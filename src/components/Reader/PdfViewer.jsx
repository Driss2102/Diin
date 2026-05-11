/**
 * PdfViewer — rendu PDF universel via PDF.js (iOS + Android + Desktop)
 * - Worker chargé depuis CDN (fiable sur mobile)
 * - PDFs linéarisés → page 1 visible sans attendre le téléchargement complet
 * - Pages rendues lazily via IntersectionObserver
 * - Barre de progression pendant le téléchargement
 */
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import * as pdfjsLib from 'pdfjs-dist'

/* Worker CDN — plus fiable sur mobile que le bundle Vite */
pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

/* ─── Cache de preload ───────────────────────────────────────
 * Quand l'utilisateur touche une carte, on démarre le téléchargement
 * AVANT que le reader s'ouvre. Quand PdfViewer monte, la tâche existe
 * déjà → page 1 visible bien plus vite.
 * ─────────────────────────────────────────────────────────── */
const _preloadCache = {}

export function preloadPdf(src) {
  if (_preloadCache[src]) return                        // déjà en cours
  const absUrl = src.startsWith('http') ? src : `${window.location.origin}${src}`
  _preloadCache[src] = pdfjsLib.getDocument({
    url:        absUrl,
    cMapUrl:    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
    cMapPacked: true,
  })
}

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
        minHeight:    Math.round(width * 1.414),
        lineHeight:   0,
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', display: 'block' }} />
    </div>
  )
}

/* ─── Viewer principal ──────────────────────────────────── */
export default function PdfViewer({ src, color }) {
  const containerRef              = useRef(null)
  const [pdf,      setPdf]        = useState(null)
  const [numPages, setNumPages]   = useState(0)
  const [loading,  setLoading]    = useState(true)
  const [progress, setProgress]   = useState(0)
  const [error,    setError]      = useState(null)
  const [width,    setWidth]      = useState(0)

  /* Largeur responsive */
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setWidth(Math.floor(e.contentRect.width)))
    ro.observe(el)
    setWidth(Math.floor(el.offsetWidth))
    return () => ro.disconnect()
  }, [])

  /* Chargement PDF avec progression */
  useEffect(() => {
    let task
    setLoading(true); setError(null); setPdf(null); setProgress(0)
    ;(async () => {
      try {
        const absUrl = src.startsWith('http') ? src : `${window.location.origin}${src}`
        /* Réutilise la tâche préchargée si disponible, sinon en crée une nouvelle */
        task = _preloadCache[src] ?? pdfjsLib.getDocument({
          url:        absUrl,
          cMapUrl:    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
          cMapPacked: true,
        })
        /* Progression du téléchargement */
        task.onProgress = ({ loaded, total }) => {
          if (total > 0) setProgress(Math.min(99, Math.round((loaded / total) * 100)))
        }
        const doc = await task.promise
        setProgress(100)
        setPdf(doc); setNumPages(doc.numPages); setLoading(false)
      } catch (e) {
        console.error('PDF load error:', e)
        setError(`Erreur de chargement — ${e?.message || 'vérifiez votre connexion'}`)
        setLoading(false)
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
        position:   'relative',
      }}
    >
      {/* ── Chargement avec barre de progression ── */}
      {loading && (
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          height: '70vh', gap: 20, padding: '0 32px',
        }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{ fontSize: 44, color }}
          >
            ☪
          </motion.div>

          {/* Barre de progression */}
          <div style={{ width: '100%', maxWidth: 260 }}>
            <div style={{
              width: '100%', height: 4, background: 'rgba(255,255,255,0.1)',
              borderRadius: 2, overflow: 'hidden',
            }}>
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                style={{ height: '100%', background: color, borderRadius: 2 }}
              />
            </div>
            <p style={{
              marginTop: 10, textAlign: 'center',
              fontSize: '0.82rem', color: '#999', fontStyle: 'italic',
            }}>
              {progress > 0
                ? `Chargement… ${progress}%`
                : 'Connexion au livre…'}
            </p>
          </div>
        </div>
      )}

      {/* ── Erreur ── */}
      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: '70vh', padding: '0 24px',
        }}>
          <p style={{ color: '#e88', textAlign: 'center', fontSize: '0.9rem' }}>{error}</p>
        </div>
      )}

      {/* ── Pages ── */}
      {pdf && width > 0 && Array.from({ length: numPages }, (_, i) => (
        <PdfPage key={i + 1} pdf={pdf} pageNum={i + 1} width={width} />
      ))}
    </div>
  )
}
