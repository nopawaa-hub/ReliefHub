import type { Activity } from '../types';

function act(a: Activity): Activity {
  return a;
}

const now = '2026-10-14T00:00:00.000Z';

function baseInstructions(learningPurpose: string, materials: string[], steps: string[]) {
  return {
    learningPurpose,
    materials,
    preparation: 'None — ready to play immediately.',
    steps,
    classroomManagement: [
      'Divide the class into two teams and agree on a answering rule (hands up or teacher picks).',
      'Keep scores on the TV scoreboard so everyone can see them.',
      'Praise effort, not only correct answers, to keep shy pupils involved.',
    ],
  };
}

// ─── Original ReliefHub game activities ──────────────────────────────────────

export const mysteryBoxVocab = act({
  id: 'act-mystery-box',
  title: 'Mystery Box Vocabulary',
  description:
    'Six mystery boxes hide questions. Teams take turns choosing a box, answering the question inside, and banking points. Suspense keeps the whole class watching.',
  type: 'reliefhub-game',
  source: 'original',
  subject: 'english',
  years: [1, 2, 3, 4, 5, 6],
  durationMinutes: 15,
  minDurationMinutes: 10,
  maxDurationMinutes: 25,
  difficulty: 'easy',
  noiseLevel: 'lively',
  grouping: 'teams',
  language: 'en',
  movement: 'seated',
  phase: 'main',
  readyToPlay: true,
  gameId: 'mystery-box',
  questionSetId: 'en-vocabulary',
  instructions: baseInstructions(
    'Build vocabulary and quick recall through team competition.',
    ['Smart TV', 'Optional: whiteboard for extra score tracking'],
    [
      'Split the class into two teams and let them choose team names.',
      'A team picks a numbered mystery box.',
      'Read the question aloud and let the team answer (or pass it to the other team).',
      'Reveal the answer and award points for correct answers.',
      'The team with the most points when all boxes are open wins.',
    ],
  ),
  status: 'approved',
  createdAt: now,
  updatedAt: now,
});

export const mysteryBoxMath = act({
  ...mysteryBoxVocab,
  id: 'act-mystery-box-math',
  title: 'Mystery Box Maths',
  description:
    'Number-operation questions hidden in mystery boxes. Two teams race to answer and score. Great for mental maths practice.',
  subject: 'mathematics',
  years: [2, 3, 4, 5],
  difficulty: 'medium',
  questionSetId: 'math-addition',
  durationMinutes: 15,
  instructions: {
    ...baseInstructions(
      'Practise mental arithmetic (addition, subtraction, multiplication) under gentle time pressure.',
      ['Smart TV'],
      [
        'Split the class into two teams.',
        'A team picks a box and answers the maths question inside.',
        'Award points for correct answers; wrong answers pass to the other team.',
        'Highest score when the boxes run out wins.',
      ],
    ),
  },
});

export const trueFalseEnglish = act({
  id: 'act-true-false-english',
  title: 'True or False: English Mix',
  description:
    'Big, readable statements about everyday English. Pupils vote True or False as a class, then the answer and explanation are revealed.',
  type: 'reliefhub-game',
  source: 'original',
  subject: 'english',
  years: [2, 3, 4, 5],
  durationMinutes: 10,
  minDurationMinutes: 5,
  maxDurationMinutes: 20,
  difficulty: 'easy',
  noiseLevel: 'moderate',
  grouping: 'whole-class',
  language: 'en',
  movement: 'seated',
  phase: 'main',
  readyToPlay: true,
  gameId: 'true-false',
  questionSetId: 'en-tf-mixed',
  instructions: {
    learningPurpose: 'Check listening comprehension and general knowledge in English.',
    materials: ['Smart TV'],
    preparation: 'None — ready to play immediately.',
    steps: [
      'Read the statement aloud twice.',
      'Pupils vote together: thumbs up for True, thumbs down for False (or use the on-screen buttons with two pupil helpers).',
      'Reveal the answer and the explanation.',
      'Keep a class score or just play for fun.',
    ],
    classroomManagement: [
      'Use whole-class voting so nobody is put on the spot alone.',
      'Ask one pupil to explain WHY an answer is true or false before revealing.',
    ],
  },
  status: 'approved',
  createdAt: now,
  updatedAt: now,
});

export const trueFalseMath = act({
  ...trueFalseEnglish,
  id: 'act-true-false-math',
  title: 'True or False: Maths Mix',
  description:
    'Quick-fire true/false number statements for mental maths warm-ups or lesson closers.',
  subject: 'mathematics',
  years: [2, 3, 4, 5],
  questionSetId: 'math-tf-mixed',
  phase: 'warmup',
  durationMinutes: 10,
  minDurationMinutes: 5,
  maxDurationMinutes: 15,
  instructions: {
    ...trueFalseEnglish.instructions,
    learningPurpose: 'Sharpen number sense and quick mental checking.',
    steps: [
      'Read the number statement aloud.',
      'Pupils show thumbs up (True) or thumbs down (False).',
      'Reveal and briefly explain — ask a pupil to correct any false statement.',
    ],
  },
});

export const trueFalseScience = act({
  ...trueFalseEnglish,
  id: 'act-true-false-science',
  title: 'True or False: Science Mix',
  description: 'Science facts and misconceptions as true/false statements with explanations.',
  subject: 'science',
  years: [3, 4, 5],
  questionSetId: 'sci-tf-mixed',
});

export const trueFalseGK = act({
  ...trueFalseEnglish,
  id: 'act-true-false-gk',
  title: 'True or False: General Knowledge',
  description: 'Malaysia, world facts and everyday knowledge as quick true/false rounds.',
  subject: 'general-knowledge',
  years: [3, 4, 5, 6],
  questionSetId: 'gk-tf-mixed',
});

export const trueFalseBM = act({
  ...trueFalseEnglish,
  id: 'act-true-false-bm',
  title: 'Benar atau Salah (BM)',
  description: 'Pernyataan bahasa Melayu untuk sesi undian Benar/Salah secara kelas.',
  subject: 'bahasa-melayu',
  years: [2, 3, 4, 5],
  language: 'bm',
  questionSetId: 'bm-tf-mixed',
});

export const hiddenPictureAnimals = act({
  id: 'act-hidden-picture-animals',
  title: 'Hidden Picture: Animal Safari',
  description:
    'A picture hides behind numbered tiles. Pupils answer or earn tile reveals and guess the picture before it is fully shown.',
  type: 'reliefhub-game',
  source: 'original',
  subject: 'english',
  years: [1, 2, 3],
  durationMinutes: 10,
  minDurationMinutes: 5,
  maxDurationMinutes: 15,
  difficulty: 'easy',
  noiseLevel: 'lively',
  grouping: 'whole-class',
  language: 'en',
  movement: 'seated',
  phase: 'warmup',
  readyToPlay: true,
  gameId: 'hidden-picture',
  picturePackId: 'pack-animals',
  instructions: {
    learningPurpose: 'Develop describing skills and vocabulary through picture guessing.',
    materials: ['Smart TV'],
    preparation: 'None — ready to play immediately.',
    steps: [
      'A pupil picks a numbered tile to reveal part of the picture.',
      'Pupils raise hands to guess the picture at any time.',
      'Reveal more tiles until someone guesses correctly.',
      'Show the full picture and the answer word, then move to the next picture.',
    ],
    classroomManagement: [
      'Hands up to guess — call on one pupil at a time so everyone gets a turn.',
      'Award a class point each time a guess is correct.',
    ],
  },
  status: 'approved',
  createdAt: now,
  updatedAt: now,
});

export const hiddenPictureFood = act({
  ...hiddenPictureAnimals,
  id: 'act-hidden-picture-food',
  title: 'Hidden Picture: Food Fun',
  description: 'Guess the food behind the tiles — great for vocabulary warm-ups.',
  picturePackId: 'pack-food',
});

export const hiddenPicturePlaces = act({
  ...hiddenPictureAnimals,
  id: 'act-hidden-picture-places',
  title: 'Hidden Picture: Places & Things',
  description: 'Reveal tiles and guess the place or object. Builds general knowledge vocabulary.',
  subject: 'general-knowledge',
  years: [3, 4, 5],
  picturePackId: 'pack-places',
});

export const hiddenPictureScience = act({
  ...hiddenPictureAnimals,
  id: 'act-hidden-picture-science',
  title: 'Hidden Picture: Science Spotting',
  description: 'Guess the science object or symbol behind the tiles.',
  subject: 'science',
  years: [3, 4, 5],
  picturePackId: 'pack-science',
});

// ─── Warm-up & closing micro-activities (teacher-led, no game needed) ────────

export const warmupSimonSays = act({
  id: 'act-warmup-simon-says',
  title: 'Simon Says (English Words)',
  description:
    'Classic Simon Says using English action words — stand up, sit down, touch your head. Burns energy and revises verbs.',
  type: 'external-activity',
  source: 'original',
  subject: 'english',
  years: [1, 2, 3],
  durationMinutes: 5,
  minDurationMinutes: 3,
  maxDurationMinutes: 10,
  difficulty: 'easy',
  noiseLevel: 'lively',
  grouping: 'whole-class',
  language: 'en',
  movement: 'active',
  phase: 'warmup',
  readyToPlay: true,
  instructions: {
    learningPurpose: 'Listen carefully and respond to action verbs in English.',
    materials: ['Space in front of desks'],
    preparation: 'None — ready to play immediately.',
    steps: [
      'Explain: only move when the instruction starts with "Simon says".',
      'Give instructions slowly at first: "Simon says stand up", "Simon says touch your head".',
      'Pupils who move without "Simon says" sit down for one round.',
      'Speed up for the last minute.',
    ],
    classroomManagement: [
      'Keep rounds short and positive — eliminated pupils rejoin after one round.',
      'Lower noise by whispering instructions so pupils must listen closely.',
    ],
  },
  status: 'approved',
  createdAt: now,
  updatedAt: now,
});

export const warmupNumberHunt = act({
  id: 'act-warmup-number-hunt',
  title: 'Number Hunt',
  description:
    'Teacher calls a target number; pupils race to show the answer using fingers, or find it around the classroom. Quick mental maths warm-up.',
  type: 'external-activity',
  source: 'original',
  subject: 'mathematics',
  years: [1, 2, 3],
  durationMinutes: 5,
  minDurationMinutes: 3,
  maxDurationMinutes: 10,
  difficulty: 'easy',
  noiseLevel: 'moderate',
  grouping: 'whole-class',
  language: 'en',
  movement: 'some-movement',
  phase: 'warmup',
  readyToPlay: true,
  instructions: {
    learningPurpose: 'Activate number sense and mental addition/subtraction.',
    materials: ['None'],
    preparation: 'None — ready to play immediately.',
    steps: [
      'Call out a target number, e.g. "Show me 7!".',
      'Pupils combine fingers from both hands (or with a partner) to make the number.',
      'For older years, ask for two numbers that add up to the target.',
      'Increase the pace each round.',
    ],
    classroomManagement: [
      'Seated finger answers keep noise low while staying interactive.',
      'Ask pupils to show answers "on 3-2-1" so everyone answers at once.',
    ],
  },
  status: 'approved',
  createdAt: now,
  updatedAt: now,
});

export const warmupBMWordChain = act({
  id: 'act-warmup-bm-word-chain',
  title: 'Rantai Kata (BM)',
  description:
    'Permainan rantai kata bahasa Melayu — murid menyambung kata mengikut huruf terakhir. Memanaskan minda dan memperkaya kosa kata.',
  type: 'external-activity',
  source: 'original',
  subject: 'bahasa-melayu',
  years: [3, 4, 5, 6],
  durationMinutes: 5,
  minDurationMinutes: 3,
  maxDurationMinutes: 10,
  difficulty: 'medium',
  noiseLevel: 'quiet',
  grouping: 'whole-class',
  language: 'bm',
  movement: 'seated',
  phase: 'warmup',
  readyToPlay: true,
  instructions: {
    learningPurpose: 'Memperkaya kosa kata dan latihan ejaan secara santai.',
    materials: ['None'],
    preparation: 'None — ready to play immediately.',
    steps: [
      'Guru memberi satu kata permulaan, cth: "sekolah".',
      'Murid seterusnya memberi kata bermula dengan huruf akhir kata sebelumnya (h).',
      'Kata tidak boleh berulang.',
      'Teruskan rantai sehingga masa tamat.',
    ],
    classroomManagement: [
      'Beri masa 5 saat untuk setiap jawapan supaya semua murid bersedia.',
      'Terima jawapan kreatif dan bantu murid yang tersekat.',
    ],
  },
  status: 'approved',
  createdAt: now,
  updatedAt: now,
});

export const warmupWordChainEN = act({
  id: 'act-warmup-word-chain-en',
  title: 'Word Chain (English)',
  description:
    'Last-letter word chains — "elephant → tiger → rabbit". A calm seated warm-up that wakes up vocabulary.',
  type: 'external-activity',
  source: 'original',
  subject: 'english',
  years: [2, 3, 4, 5, 6],
  durationMinutes: 5,
  minDurationMinutes: 3,
  maxDurationMinutes: 10,
  difficulty: 'easy',
  noiseLevel: 'quiet',
  grouping: 'whole-class',
  language: 'en',
  movement: 'seated',
  phase: 'warmup',
  readyToPlay: true,
  instructions: {
    learningPurpose: 'Activate English vocabulary and spelling recall.',
    materials: ['None'],
    preparation: 'None — ready to play immediately.',
    steps: [
      'Give a starting word, e.g. "apple".',
      'The next pupil must say a word beginning with the last letter ("e").',
      'No repeats allowed — words are collected mentally by the class.',
      'Keep the chain going around the room until time is up.',
    ],
    classroomManagement: [
      'Give 5 seconds per answer so everyone stays ready.',
      'Accept any real word; help stuck pupils with a hint instead of skipping them.',
    ],
  },
  status: 'approved',
  createdAt: now,
  updatedAt: now,
});

export const spellingBee = act({
  id: 'act-spelling-bee',
  title: 'Spelling Bee',
  description:
    'Classic spelling contest — teacher says a word, pupils spell it aloud or write it in the air. Calm, seated and curriculum-friendly.',
  type: 'external-activity',
  source: 'original',
  subject: 'english',
  years: [2, 3, 4, 5, 6],
  durationMinutes: 20,
  minDurationMinutes: 10,
  maxDurationMinutes: 30,
  difficulty: 'medium',
  noiseLevel: 'moderate',
  grouping: 'individual',
  language: 'en',
  movement: 'seated',
  phase: 'main',
  readyToPlay: true,
  instructions: {
    learningPurpose: 'Practise spelling high-frequency English words accurately.',
    materials: ['Optional: the True or False or Vocabulary question sets for word ideas'],
    preparation:
      'Pick 10–15 words from the board or a recent lesson, easy to hard. None needed if improvising.',
    steps: [
      'Say a word, then use it in a short sentence.',
      'A pupil spells it aloud (or writes it large in the air for the class to see).',
      'Correct spelling earns a point for the pupil or team; wrong spelling passes to the next pupil.',
      'Increase difficulty each round; celebrate the best speller at the end.',
    ],
    classroomManagement: [
      'Seated spelling keeps the room calm — perfect before or after a lively game.',
      'Air-writing lets the whole class check each answer together.',
    ],
  },
  status: 'approved',
  createdAt: now,
  updatedAt: now,
});

export const closingExitChallenge = act({
  id: 'act-closing-exit-challenge',
  title: 'Exit Challenge',
  description:
    'Three quick questions on today\u2019s topic. Pupils answer together before lining up — a calm, structured way to end the session.',
  type: 'external-activity',
  source: 'original',
  subject: 'general-knowledge',
  years: [1, 2, 3, 4, 5, 6],
  durationMinutes: 5,
  minDurationMinutes: 3,
  maxDurationMinutes: 10,
  difficulty: 'easy',
  noiseLevel: 'quiet',
  grouping: 'whole-class',
  language: 'en',
  movement: 'seated',
  phase: 'closing',
  readyToPlay: true,
  instructions: {
    learningPurpose: 'Consolidate what was practised during the session.',
    materials: ['None'],
    preparation: 'Think of 3 questions based on the activities you just played.',
    steps: [
      'Ask three short questions about the main activity.',
      'Pupils answer together as a class.',
      'End with praise for effort and teamwork.',
    ],
    classroomManagement: [
      'A calm closing activity helps pupils transition to the next lesson.',
      'Ask pupils to sit quietly and raise hands to answer.',
    ],
  },
  status: 'approved',
  createdAt: now,
  updatedAt: now,
});

export const closingTicketIn = act({
  id: 'act-closing-ticket',
  title: 'One Word Ticket',
  description:
    'Every pupil says one word they learned today before the bell. Quick reflection and a positive ending.',
  type: 'external-activity',
  source: 'original',
  subject: 'english',
  years: [1, 2, 3, 4, 5, 6],
  durationMinutes: 5,
  minDurationMinutes: 3,
  maxDurationMinutes: 8,
  difficulty: 'easy',
  noiseLevel: 'quiet',
  grouping: 'individual',
  language: 'en',
  movement: 'seated',
  phase: 'closing',
  readyToPlay: true,
  instructions: {
    learningPurpose: 'Reflect and recall one new word from the session.',
    materials: ['None'],
    preparation: 'None — ready to play immediately.',
    steps: [
      'Model first: "My word today is \u2018enormous\u2019 — it means very big."',
      'Go row by row; each pupil says one word from the session.',
      'Thank the class and end with encouragement.',
    ],
    classroomManagement: [
      'Keep the pace brisk — 3–5 seconds per pupil.',
      'Accept any honest attempt; repetition is fine for Year 1–2.',
    ],
  },
  status: 'approved',
  createdAt: now,
  updatedAt: now,
});

// More main activities covering remaining subjects/years

export const mysteryBoxBM = act({
  ...mysteryBoxVocab,
  id: 'act-mystery-box-bm',
  title: 'Kotak Misteri (BM)',
  description:
    'Soalan kata nama dan kosa kata bahasa Melayu dalam kotak misteri. Dua kumpulan bertanding menjawab dan mengutip mata.',
  subject: 'bahasa-melayu',
  years: [1, 2, 3],
  language: 'bm',
  difficulty: 'easy',
  questionSetId: 'bm-kata-nama',
});

export const mysteryBoxGK = act({
  ...mysteryBoxVocab,
  id: 'act-mystery-box-gk',
  title: 'Mystery Box: Know Malaysia',
  description:
    'Questions about Malaysia, safety and everyday life hidden in mystery boxes. Team play with points.',
  subject: 'general-knowledge',
  years: [3, 4, 5, 6],
  questionSetId: 'gk-malaysia',
});

export const mysteryBoxScience = act({
  ...mysteryBoxVocab,
  id: 'act-mystery-box-science',
  title: 'Mystery Box: Science Lab',
  description: 'Living things, body parts and matter questions in mystery-box team battles.',
  subject: 'science',
  years: [3, 4, 5],
  questionSetId: 'sci-human-body',
});

// ─── Curated external resources (verified links only) ────────────────────────

export const externalBaamboozleBrowse = act({
  id: 'act-ext-baamboozle',
  title: 'Baamboozle Game (Browse & Pick)',
  description:
    'Open Baamboozle and pick a ready-made game matching your topic. Free to play from one screen, no pupil devices needed. Note: creating your own games requires a free account.',
  type: 'baamboozle',
  source: 'external',
  subject: 'english',
  years: [2, 3, 4, 5, 6],
  durationMinutes: 20,
  minDurationMinutes: 10,
  maxDurationMinutes: 30,
  difficulty: 'medium',
  noiseLevel: 'lively',
  grouping: 'teams',
  language: 'en',
  movement: 'seated',
  phase: 'main',
  readyToPlay: false,
  url: 'https://www.baamboozle.com/',
  embeddable: false,
  instructions: {
    learningPurpose: 'Play a curriculum-matching quiz game from a large teacher-made library.',
    materials: ['Smart TV with internet', 'A topic in mind (e.g. "past tense")'],
    preparation:
      'Search and preview one game before class if possible. Playing requires no account.',
    steps: [
      'Open the Baamboozle link and use the search box to find your topic.',
      'Pick a game with a suitable number of questions for your time slot.',
      'Play in teams — Baamboozle keeps score for you.',
    ],
    classroomManagement: [
      'Preview the game quickly to check language level before playing.',
      'Baamboozle is ad-supported on free plans — open it before the bell to skip loading.',
    ],
  },
  status: 'approved',
  createdAt: now,
  updatedAt: now,
});

export const externalWordwallCommunity = act({
  id: 'act-ext-wordwall',
  title: 'Wordwall Activity (Browse & Pick)',
  description:
    'Open Wordwall\u2019s community library and pick a teacher-made activity (quiz, match-up, gameshow). Filter by subject and level.',
  type: 'wordwall',
  source: 'external',
  subject: 'english',
  years: [1, 2, 3, 4, 5, 6],
  durationMinutes: 20,
  minDurationMinutes: 10,
  maxDurationMinutes: 30,
  difficulty: 'easy',
  noiseLevel: 'moderate',
  grouping: 'whole-class',
  language: 'en',
  movement: 'seated',
  phase: 'main',
  readyToPlay: false,
  url: 'https://wordwall.net/community',
  embeddable: false,
  instructions: {
    learningPurpose: 'Play a ready-made interactive activity matched to the syllabus topic.',
    materials: ['Smart TV with internet'],
    preparation: 'Choose a topic and preview one activity before class if possible.',
    steps: [
      'Open the Wordwall community link.',
      'Filter or search for your topic and level.',
      'Open an activity and play it as a whole class on the TV.',
    ],
    classroomManagement: [
      'Wordwall activities switch templates (quiz → maze → match-up) for variety.',
      'Keep one pupil as the "clicker" while others advise — keeps more pupils active.',
    ],
  },
  status: 'approved',
  createdAt: now,
  updatedAt: now,
});

export const allActivities: Activity[] = [
  mysteryBoxVocab,
  mysteryBoxMath,
  mysteryBoxBM,
  mysteryBoxGK,
  mysteryBoxScience,
  trueFalseEnglish,
  trueFalseMath,
  trueFalseScience,
  trueFalseGK,
  trueFalseBM,
  hiddenPictureAnimals,
  hiddenPictureFood,
  hiddenPicturePlaces,
  hiddenPictureScience,
  warmupSimonSays,
  warmupNumberHunt,
  warmupBMWordChain,
  warmupWordChainEN,
  spellingBee,
  closingExitChallenge,
  closingTicketIn,
  externalBaamboozleBrowse,
  externalWordwallCommunity,
];
