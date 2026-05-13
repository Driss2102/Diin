import { versets } from './versets'
import { hadith }  from './hadith'

/* ── Mappings vers le format interne ─────────────────────────── */
function mapVerset(v) {
  return {
    id:          v.id,
    type:        "PAROLE D'ALLAH",
    arabic:      v.ar,
    translation: v.fr,
    ref:         `[${v.code}] سورة ${v.sourate}`,
  }
}

function mapHadith(h) {
  return {
    id:          h.id,
    type:        'HADITH',
    arabic:      h.ar,
    translation: h.fr,
    ref:         h.source,
  }
}

/* ── Pool combiné par mood (versets + hadiths mélangés) ─────── */
const MOOD_IDS = ['heureux', 'triste', 'colere', 'effraye', 'reconnaissant', 'solitaire', 'anxieux', 'espoir', 'pardon']

const CONTENT = {}
for (const moodId of MOOD_IDS) {
  const vs = (versets[moodId] || []).map(mapVerset)
  const hs = (hadith[moodId]  || []).map(mapHadith)
  CONTENT[moodId] = [...vs, ...hs]
}

/* ── API publique (inchangée) ────────────────────────────────── */
export function getVerseForMood(moodId) {
  const list = CONTENT[moodId] || CONTENT.espoir
  return list[Math.floor(Math.random() * list.length)]
}

export function getRandomVerse(moodId) {
  return getVerseForMood(moodId)
}
