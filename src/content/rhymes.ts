export interface RhymeLine {
  te: string;
  trans: string;
  en: string;
}

export interface Rhyme {
  id: string;
  title: { te: string; trans: string; en: string };
  theme: string;
  icon: string;
  difficulty: number;
  lines: RhymeLine[];
  audioFull: string;
}

export const TELUGU_RHYMES: Rhyme[] = [
  {
    id: "chandamama",
    title: { te: "చందమామ రావే", trans: "CHANDAMAMA RAAVE", en: "Come, Moon!" },
    theme: "bedtime",
    icon: "🌙",
    difficulty: 1,
    lines: [
      { te: "చందమామ రావే", trans: "CHANDAMAMA RAAVE", en: "Come, dear Moon" },
      { te: "జాబిల్లి రావే", trans: "JAABILLI RAAVE", en: "Come, moonlight" },
      { te: "కొండెక్కి రావే", trans: "KONDEKKI RAAVE", en: "Come over the hill" },
      { te: "గోరుముద్ద తేవే", trans: "GORUMUDDA THEVE", en: "Bring rice balls" },
    ],
    audioFull: "/audio/te/rhyme-chandamama-full.mp3",
  },
  {
    id: "lali-lali",
    title: { te: "లాలి లాలి", trans: "LAALI LAALI", en: "Lullaby" },
    theme: "bedtime",
    icon: "🛏️",
    difficulty: 1,
    lines: [
      { te: "లాలి లాలి లాలమ్మ", trans: "LAALI LAALI LAALAMMA", en: "Lullaby, lullaby, dear baby" },
      { te: "లాలి లాలి నిద్రపోమ్మ", trans: "LAALI LAALI NIDRAPOMMA", en: "Lullaby, go to sleep" },
      { te: "పాలు తాగి పడుకోమ్మ", trans: "PAALU THAAGI PADUKOMMA", en: "Drink milk and sleep" },
      { te: "బంగారు తల్లి నిద్రపోమ్మ", trans: "BANGAARU THALLI NIDRAPOMMA", en: "Golden child, go to sleep" },
    ],
    audioFull: "/audio/te/rhyme-lali-lali-full.mp3",
  },
  {
    id: "akkada-ikkada",
    title: { te: "అక్కడ ఇక్కడ", trans: "AKKADA IKKADA", en: "Here and There" },
    theme: "play",
    icon: "🏃",
    difficulty: 1,
    lines: [
      { te: "అక్కడ ఇక్కడ ఎక్కడ చూసినా", trans: "AKKADA IKKADA EKKADA CHOOSINA", en: "Here, there, everywhere I look" },
      { te: "పచ్చని చెట్లు పూల తోటలు", trans: "PACHCHANI CHETLU POOLA THOTALU", en: "Green trees and flower gardens" },
    ],
    audioFull: "/audio/te/rhyme-akkada-ikkada-full.mp3",
  },
  {
    id: "chitti-chilakamma",
    title: { te: "చిట్టి చిలకమ్మ", trans: "CHITTI CHILAKAMMA", en: "Little Parrot" },
    theme: "animals",
    icon: "🦜",
    difficulty: 1,
    lines: [
      { te: "చిట్టి చిలకమ్మ అటు తిరిగి ఇటు తిరిగి", trans: "CHITTI CHILAKAMMA ATU THIRIGI ITU THIRIGI", en: "Little parrot, turning here and there" },
      { te: "ఆ కొమ్మ మీద ఈ కొమ్మ మీద", trans: "AA KOMMA MEEDA EE KOMMA MEEDA", en: "On that branch, on this branch" },
      { te: "గూటికి చేరింది", trans: "GOOTIKI CHERINDI", en: "Reached its nest" },
    ],
    audioFull: "/audio/te/rhyme-chitti-chilakamma-full.mp3",
  },
  {
    id: "papa-papa",
    title: { te: "పాపా పాపా", trans: "PAAPAA PAAPAA", en: "Baby, Baby" },
    theme: "family",
    icon: "👶",
    difficulty: 1,
    lines: [
      { te: "పాపా పాపా నువ్వెక్కడ వెళ్ళావు", trans: "PAAPAA PAAPAA NUVVEKKADA VELLAAVU", en: "Baby baby, where did you go?" },
      { te: "అమ్మమ్మ ఇంటికి వెళ్ళాను", trans: "AMMAMMA INTIKI VELLAANU", en: "I went to grandma's house" },
      { te: "ఏం తిన్నావు", trans: "EM THINNAVU", en: "What did you eat?" },
      { te: "లడ్డు తిన్నాను", trans: "LADDU THINNANU", en: "I ate laddus" },
    ],
    audioFull: "/audio/te/rhyme-papa-papa-full.mp3",
  },
  {
    id: "naa-bommalu",
    title: { te: "నా బొమ్మలు", trans: "NAA BOMMALU", en: "My Toys" },
    theme: "play",
    icon: "🧸",
    difficulty: 1,
    lines: [
      { te: "నా బొమ్మలు నా బొమ్మలు", trans: "NAA BOMMALU NAA BOMMALU", en: "My toys, my toys" },
      { te: "చాలా బాగున్నాయి", trans: "CHAALAA BAAGUNNAAYI", en: "They're very nice" },
      { te: "బంతి బొమ్మ బావుంది", trans: "BANTHI BOMMA BAAVUNDI", en: "The ball toy is lovely" },
      { te: "బస్సు బొమ్మ బావుంది", trans: "BUSSU BOMMA BAAVUNDI", en: "The bus toy is lovely" },
    ],
    audioFull: "/audio/te/rhyme-naa-bommalu-full.mp3",
  },
  {
    id: "veena-veena",
    title: { te: "వీణ వీణ", trans: "VEENA VEENA", en: "Veena, Veena" },
    theme: "culture",
    icon: "🎵",
    difficulty: 2,
    lines: [
      { te: "వీణ వీణ వీణా వాయించు", trans: "VEENA VEENA VEENA VAAYINCHU", en: "Veena, veena, play the veena" },
      { te: "రాగాలు రాగాలు పాడించు", trans: "RAAGAALU RAAGAALU PAADINCHU", en: "Make the melodies sing" },
    ],
    audioFull: "/audio/te/rhyme-veena-veena-full.mp3",
  },
  {
    id: "amma-amma",
    title: { te: "అమ్మ అమ్మ", trans: "AMMA AMMA", en: "Mother, Mother" },
    theme: "family",
    icon: "👩",
    difficulty: 1,
    lines: [
      { te: "అమ్మ అమ్మ నువ్వే నా దేవత", trans: "AMMA AMMA NUVVE NAA DEVATHA", en: "Mother, you are my goddess" },
      { te: "నీ చేతి వంట చాలా బాగుంటుంది", trans: "NEE CHETHI VANTA CHAALAA BAAGUNTUNDI", en: "Your cooking is delicious" },
      { te: "నీ కథలు వింటే నిద్ర వస్తుంది", trans: "NEE KATHALU VINTHE NIDRA VASTHUNDI", en: "Hearing your stories makes me sleepy" },
    ],
    audioFull: "/audio/te/rhyme-amma-amma-full.mp3",
  },
  {
    id: "egurevayya-gaalipatam",
    title: { te: "ఎగిరేవయ్యా గాలిపటం", trans: "EGIREVAYYA GAALIPATAM", en: "The Kite Flies!" },
    theme: "play",
    icon: "🪁",
    difficulty: 2,
    lines: [
      { te: "ఎగిరేవయ్యా గాలిపటం", trans: "EGIREVAYYA GAALIPATAM", en: "The kite is flying" },
      { te: "ఆకాశంలో ఎగురుతోంది", trans: "AAKAASHAMLO EGURUTHONDI", en: "Flying in the sky" },
      { te: "గాలి వీస్తే ఎగురుతోంది", trans: "GAALI VEESTHE EGURUTHONDI", en: "Flies when the wind blows" },
    ],
    audioFull: "/audio/te/rhyme-egurevayya-gaalipatam-full.mp3",
  },
  {
    id: "chukkalu",
    title: { te: "చుక్కలు", trans: "CHUKKALU", en: "Stars" },
    theme: "bedtime",
    icon: "⭐",
    difficulty: 1,
    lines: [
      { te: "చుక్కలు చుక్కలు ఆకాశంలో", trans: "CHUKKALU CHUKKALU AAKAASHAMLO", en: "Stars, stars in the sky" },
      { te: "మెరుస్తున్నాయి బంగారంలా", trans: "MERUSTUNNAYI BANGAARAMLA", en: "Shining like gold" },
      { te: "ఒకటి రెండు మూడు నాలుగు", trans: "OKATI RENDU MOODU NAALUGU", en: "One, two, three, four" },
      { te: "లెక్కపెట్టు చుక్కల్ని", trans: "LEKKAPETTU CHUKKALANI", en: "Count the stars" },
    ],
    audioFull: "/audio/te/rhyme-chukkalu-full.mp3",
  },
  {
    id: "aavu-aavu",
    title: { te: "ఆవూ ఆవూ", trans: "AAVU AAVU", en: "Cow, Cow" },
    theme: "animals",
    icon: "🐄",
    difficulty: 1,
    lines: [
      { te: "ఆవూ ఆవూ ఏమి తింటావు", trans: "AAVU AAVU EMI THINTAAVU", en: "Cow, cow, what do you eat?" },
      { te: "గడ్డి తింటాను", trans: "GADDI THINTAANU", en: "I eat grass" },
      { te: "ఏమి ఇస్తావు", trans: "EMI ISTHAAVU", en: "What do you give?" },
      { te: "పాలు ఇస్తాను", trans: "PAALU ISTHAANU", en: "I give milk" },
    ],
    audioFull: "/audio/te/rhyme-aavu-aavu-full.mp3",
  },
  {
    id: "kokkorokko",
    title: { te: "కొక్కొరొక్కో", trans: "KOKKOROKKO", en: "Cock-a-doodle-doo" },
    theme: "animals",
    icon: "🐓",
    difficulty: 1,
    lines: [
      { te: "కొక్కొరొక్కో తెల్లవారింది", trans: "KOKKOROKKO TELLAVAARINDI", en: "Cock-a-doodle-doo, dawn has come" },
      { te: "నిద్ర లేవండి", trans: "NIDRA LEVANDI", en: "Wake up everyone" },
      { te: "ముఖం కడుక్కోండి", trans: "MUKHAM KADUKKONDI", en: "Wash your face" },
      { te: "పాలు తాగండి", trans: "PAALU THAAGANDI", en: "Drink your milk" },
    ],
    audioFull: "/audio/te/rhyme-kokkorokko-full.mp3",
  },

  // ═══ AP Class 1 బాలగేయాలు (Children's Songs from తెలుగు తోట) ═══

  {
    id: "udata-udata",
    title: { te: "ఉడత ఉడత హూచ్", trans: "UDATA UDATA HOOCH", en: "Squirrel Song" },
    theme: "animals",
    icon: "🐿️",
    difficulty: 1,
    lines: [
      { te: "ఉడత ఉడత హూచ్", trans: "UDATA UDATA HOOCH", en: "Squirrel, squirrel, whoosh!" },
      { te: "చెట్టు ఎక్కింది హూచ్", trans: "CHETTU EKKINDI HOOCH", en: "Climbed the tree, whoosh!" },
      { te: "కొమ్మ మీద కూర్చుంది", trans: "KOMMA MEEDA KOORCHUNDI", en: "Sat on the branch" },
      { te: "తోక ఊపుతూ చూసింది", trans: "THOKA OOPUTHOO CHOOSINDI", en: "Looked around wagging its tail" },
    ],
    audioFull: "/audio/te/rhyme-udata-udata-full.mp3",
  },
  {
    id: "baavaa-panneeru",
    title: { te: "బావా బావా పన్నీరు", trans: "BAAVAA BAAVAA PANNEERU", en: "Uncle, Perfume Water" },
    theme: "culture",
    icon: "💐",
    difficulty: 1,
    lines: [
      { te: "బావా బావా పన్నీరు", trans: "BAAVAA BAAVAA PANNEERU", en: "Uncle, uncle, perfume water" },
      { te: "పన్నీరు బుడ్డీలో", trans: "PANNEERU BUDDEELO", en: "In the perfume bottle" },
      { te: "బుడ్డీ ఎవరిది", trans: "BUDDEE EVARIDI", en: "Whose bottle is it?" },
      { te: "రాజుగారిది", trans: "RAAJUGAARIDI", en: "It belongs to the king" },
    ],
    audioFull: "/audio/te/rhyme-baavaa-panneeru-full.mp3",
  },
  {
    id: "megham-chhatram",
    title: { te: "మేఘం ఛత్రం", trans: "MEGHAM CHHATRAM", en: "Cloud Umbrella" },
    theme: "nature",
    icon: "☁️",
    difficulty: 2,
    lines: [
      { te: "మేఘం ఛత్రం పట్టింది", trans: "MEGHAM CHHATRAM PATTINDI", en: "The cloud held an umbrella" },
      { te: "భూమికి నీళ్ళు ఇచ్చింది", trans: "BHOOMIKI NEELLU ICHCHINDI", en: "Gave water to the earth" },
      { te: "చెట్లు పూలు పండ్లు పూశాయి", trans: "CHETLU POOLU PANDLU POOSHAYI", en: "Trees bloomed with flowers and fruits" },
      { te: "పిల్లలు సంతోషంగా ఆడారు", trans: "PILLALU SANTHOSHAMGA AADAARU", en: "Children played happily" },
    ],
    audioFull: "/audio/te/rhyme-megham-chhatram-full.mp3",
  },
  {
    id: "gunna-maamidi",
    title: { te: "గున్న మామిడి", trans: "GUNNA MAAMIDI", en: "Little Mango Tree" },
    theme: "nature",
    icon: "🥭",
    difficulty: 1,
    lines: [
      { te: "గున్న మామిడి చెట్టు", trans: "GUNNA MAAMIDI CHETTU", en: "Little mango tree" },
      { te: "కాయలు కాసింది", trans: "KAAYALU KAASINDI", en: "Bore fruits" },
      { te: "పిల్లలు వచ్చారు", trans: "PILLALU VACHCHAARU", en: "Children came" },
      { te: "మామిడి పండ్లు తిన్నారు", trans: "MAAMIDI PANDLU THINNARU", en: "Ate the mangoes" },
    ],
    audioFull: "/audio/te/rhyme-gunna-maamidi-full.mp3",
  },
];
