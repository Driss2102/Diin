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

/* ── Pool mélangé + curseur par mood ────────────────────────── *
 * Au lieu du tirage purement aléatoire (risque de ne jamais
 * tomber sur un hadith), on mélange le pool UNE FOIS puis on
 * avance d'un cran à chaque appel → dans chaque cycle de 25,
 * l'utilisateur voit exactement 5 hadiths et 20 versets.      */
const _pools   = {}  // pool mélangé par mood
const _cursors = {}  // position actuelle dans le pool

function getPool(moodId) {
  if (!_pools[moodId]) {
    // Fisher-Yates shuffle
    const arr = [...(CONTENT[moodId] || CONTENT.espoir)]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    _pools[moodId]   = arr
    _cursors[moodId] = 0
  }
  return _pools[moodId]
}

export function getVerseForMood(moodId) {
  const pool   = getPool(moodId)
  const idx    = _cursors[moodId] % pool.length
  _cursors[moodId] = idx + 1
  // Remélange discret à la fin du cycle pour éviter la répétition
  if (_cursors[moodId] >= pool.length) {
    delete _pools[moodId]   // force re-shuffle au prochain cycle
  }
  return pool[idx]
}

export function getRandomVerse(moodId) {
  return getVerseForMood(moodId)
}
