/**
 * PdfViewer — rendu PDF universel via PDF.js (iOS + Android + Desktop)
 * Pages rendues en Canvas, lazy (IntersectionObserver) pour économiser la mémoire.
 */
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

/* ─── Page individuelle ─────────────────────────────────── */
function PdfPage({ pdf, pageNum, width }) {
  const canvasRef = useRef(null)
  const wrapRef   = useRef(null)
  const doneRef   = useRef(false)

  useEffect(() => {
    doneRef.current = false
    let cancelled  = false
    let renderTask = null

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || doneRef.current || cancelled) return
        doneRef.current = true
        observer.disconnect()

        try {
          const page     = await pdf.getPage(pageNum)
          if (cancelled) return
          const scale    = width / page.getViewport({ scale: 1 }).width
          const viewport = page.getViewport({ scale })
          const canvas   = canvasRef.current
          if (!canvas || cancelled) return
          canvas.width   = viewport.width
          canvas.height  = viewport.height
          renderTask     = page.render({ canvasContext: canvas.getContext('2d'), viewport })
          await renderTask.promise
        } catch (e) {
          if (e?.name !== 'RenderingCancelledException') console.warn('PDF page error:', e)
        }
      },
      { rootMargin: '600px 0px', threshold: 0 }
    )

    if (wrapRef.current) observer.observe(wrapRef.current)
    return () => { cancelled = true; observer.disconnect(); renderTask?.cancel?.() }
  }, [pdf, pageNum, width])

  return (
    <div
      ref={wrapRef}
      style={{
        width:        '100%',
        background:   '#fff',
        marginBottom: 3,
        minHeight:    Math.round(width * 1.414), /* placeholder A4 en attendant le rendu */
        lineHeight:   0,
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', display: 'block' }} />
    </div>
  )
}

/* ─── Viewer principal ──────────────────────────────────── */
export default function PdfViewer({ src, color }) {
  const containerRef            = useRef(null)
  const [pdf,      setPdf]      = useState(null)
  const [numPages, setNumPages] = useState(0)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [width,    setWidth]    = useState(0)

  /* Largeur du conteneur (responsive, remesurée au resize) */
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setWidth(Math.floor(e.contentRect.width)))
    ro.observe(el)
    setWidth(Math.floor(el.offsetWidth))
    return () => ro.disconnect()
  }, [])

  /* Chargement du PDF */
  useEffect(() => {
    let task
    setLoading(true); setError(null); setPdf(null)
    ;(async () => {
      try {
        task      = pdfjsLib.getDocument({
          url:         src,
          cMapUrl:     'https://cdn.jsdelivr.net/npm/pdfjs-dist@5/cmaps/',
          cMapPacked:  true,
        })
        const doc = await task.promise
        setPdf(doc); setNumPages(doc.numPages); setLoading(false)
      } catch {
        setError('Impossible de charger le livre.'); setLoading(false)
      }
    })()
    return () => { try { task?.destroy() } catch {} }
  }, [src])

  return (
    <div
      ref={containerRef}
      style={{
        flex:       1,
        overflowY:  'auto',
        overflowX:  'hidden',
        background: '#1e1e1e',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Chargement */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 16 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{ fontSize: 40, color }}
          >
            ☪
          </motion.div>
          <p style={{ fontSize: '0.9rem', color: '#aaa', fontStyle: 'italic' }}>
            Chargement du livre…
          </p>
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', padding: '0 24px' }}>
          <p style={{ color: '#e88', textAlign: 'center' }}>{error}</p>
        </div>
      )}

      {/* Pages */}
      {pdf && width > 0 && Array.from({ length: numPages }, (_, i) => (
        <PdfPage key={i + 1} pdf={pdf} pageNum={i + 1} width={width} />
      ))}
    </div>
  )
}
