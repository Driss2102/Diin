const CONTENT = {
  heureux: [
    { id: 'h1', type: 'PAROLE D\'ALLAH', arabic: 'وَإِن تَعُدُّوا نِعْمَةَ اللَّهِ لَا تُحْصُوهَا', translation: 'Et si vous comptez les bienfaits d\'Allah, vous ne sauriez les dénombrer.', ref: '[16:18] سورة النحل' },
    { id: 'h2', type: 'PAROLE D\'ALLAH', arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ', translation: 'Rappelez-vous de Moi, Je Me souviendrai de vous. Soyez reconnaissants et ne soyez pas ingrats.', ref: '[2:152] سورة البقرة' },
  ],
  triste: [
    { id: 't1', type: 'PAROLE D\'ALLAH', arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', translation: 'Certes, avec la difficulté vient la facilité.', ref: '[94:6] سورة الشرح' },
    { id: 't2', type: 'INVOCATION', arabic: 'اللهم إني أعوذ بك من الهم والحزن', translation: 'Ô Allah, je cherche refuge en Toi contre l\'inquiétude et la tristesse.', ref: 'دعاء النبي ﷺ' },
    { id: 't3', type: 'PAROLE D\'ALLAH', arabic: 'أَلَا إِنَّ أَوْلِيَاءَ اللَّهِ لَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ', translation: 'Certes, les alliés d\'Allah ne craindront rien et ne seront pas attristés.', ref: '[10:62] سورة يونس' },
  ],
  colere: [
    { id: 'c1', type: 'SAGESSE', arabic: 'لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ', translation: 'Le fort n\'est pas celui qui terrasse les autres ; le fort est celui qui se maîtrise dans la colère.', ref: 'صحيح البخاري' },
    { id: 'c2', type: 'PAROLE D\'ALLAH', arabic: 'وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ', translation: 'Ceux qui contiennent leur colère et pardonnent aux hommes — Allah aime les bienfaisants.', ref: '[3:134] سورة آل عمران' },
  ],
  effraye: [
    { id: 'e1', type: 'PAROLE D\'ALLAH', arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', translation: 'Allah nous suffit ; Il est l\'excellent Protecteur.', ref: '[3:173] سورة آل عمران' },
    { id: 'e2', type: 'INVOCATION', arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِن شَرِّ مَا خَلَق', translation: 'Je cherche refuge dans les paroles parfaites d\'Allah contre le mal de ce qu\'Il a créé.', ref: 'صحيح مسلم' },
  ],
  reconnaissant: [
    { id: 'r1', type: 'PAROLE D\'ALLAH', arabic: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ', translation: 'Si vous êtes reconnaissants, J\'augmenterai certainement vos bienfaits.', ref: '[14:7] سورة إبراهيم' },
    { id: 'r2', type: 'SAGESSE', arabic: 'الحمد لله على كل حال', translation: 'Louange à Allah en toutes circonstances.', ref: 'حكمة إسلامية' },
  ],
  solitaire: [
    { id: 's1', type: 'PAROLE D\'ALLAH', arabic: 'وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ', translation: 'Et Nous sommes plus près de lui que sa veine jugulaire.', ref: '[50:16] سورة ق' },
    { id: 's2', type: 'PAROLE D\'ALLAH', arabic: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ', translation: 'Allah est avec ceux qui persévèrent.', ref: '[2:153] سورة البقرة' },
  ],
  anxieux: [
    { id: 'a1', type: 'PAROLE D\'ALLAH', arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', translation: 'C\'est en rappelant Allah que les cœurs trouvent la quiétude.', ref: '[13:28] سورة الرعد' },
    { id: 'a2', type: 'INVOCATION', arabic: 'اللهم لا سهل إلا ما جعلته سهلاً وأنت تجعل الحزن إذا شئت سهلاً', translation: 'Ô Allah, rien n\'est aisé sauf ce que Tu rends aisé, et Tu peux rendre facile ce qui est difficile si Tu le veux.', ref: 'دعاء النبي ﷺ' },
  ],
  espoir: [
    { id: 'es1', type: 'PAROLE D\'ALLAH', arabic: 'وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ', translation: 'Ne désespérez pas de la miséricorde d\'Allah.', ref: '[12:87] سورة يوسف' },
    { id: 'es2', type: 'SAGESSE', arabic: 'إن مع العسر يسرا', translation: 'Avec la difficulté vient la facilité — et encore la facilité.', ref: '[94:5-6] سورة الشرح' },
  ],
  pardon: [
    { id: 'p1', type: 'INVOCATION', arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي', translation: 'Ô Allah, Tu es Le Pardonneur, Tu aimes le pardon, alors pardonne-moi.', ref: 'جامع الترمذي' },
    { id: 'p2', type: 'PAROLE D\'ALLAH', arabic: 'قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ', translation: 'Dis : Ô Mes serviteurs qui avez été excessifs à votre propre détriment, ne désespérez pas de la miséricorde d\'Allah.', ref: '[39:53] سورة الزمر' },
  ],
}

export function getVerseForMood(moodId) {
  const list = CONTENT[moodId] || CONTENT.espoir
  return list[Math.floor(Math.random() * list.length)]
}

export function getRandomVerse(moodId) {
  return getVerseForMood(moodId)
}
