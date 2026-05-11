/**
 * Télécharge les PDFs depuis GitHub Releases avant le build Vite.
 * Exécuté automatiquement via le script "prebuild" de package.json.
 */
import { createWriteStream, existsSync, mkdirSync } from 'fs'
import { pipeline } from 'stream/promises'
import path from 'path'

const BASE_URL = 'https://github.com/Driss2102/Diin/releases/download/v1'

const BOOKS = [
  'maa_annabi.pdf',
  'yawm_fi_bayt_annabi.pdf',
  '356_yawman.pdf',
]

const OUT_DIR = path.resolve('public/books')
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

async function download(filename) {
  const url  = `${BASE_URL}/${filename}`
  const dest = path.join(OUT_DIR, filename)

  if (existsSync(dest)) {
    console.log(`✓ ${filename} already present, skipping.`)
    return
  }

  console.log(`⬇ Downloading ${filename}…`)
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok) throw new Error(`Failed to download ${filename}: ${res.status}`)
  await pipeline(res.body, createWriteStream(dest))
  console.log(`✓ ${filename} downloaded.`)
}

for (const book of BOOKS) {
  await download(book)
}

console.log('All books ready.')
