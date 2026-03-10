export interface ConversationCard {
  te: string;
  trans: string;
  en: string;
  tip: string;
}

export interface DialogueLine {
  speaker: "A" | "B";
  te: string;
  trans: string;
  en: string;
}

export interface Scenario {
  id: string;
  title: string;
  teluguTitle: string;
  icon: string;
  characterA: string;
  characterB: string;
  setting: string;
  dialogue: DialogueLine[];
}

// ── CONVERSATION SCENARIOS ──

export const SCENARIOS: Scenario[] = [
  {
    id: "market",
    title: "At the Vegetable Market",
    teluguTitle: "కూరగాయల బజార్లో",
    icon: "🥬",
    characterA: "అమ్మ",
    characterB: "అంగడి అన్న",
    setting: "Amma is buying vegetables at the market",
    dialogue: [
      { speaker: "A", te: "అన్నా, టమాటాలు ఎంత?", trans: "ANNAA, TAMAATAALU ENTHA?", en: "Brother, how much are tomatoes?" },
      { speaker: "B", te: "కిలో నలభై రూపాయలు అమ్మా", trans: "KILO NALABHAI RUPAAYALU AMMAA", en: "40 rupees per kilo, ma'am" },
      { speaker: "A", te: "బంగాళదుంపలు ఉన్నాయా?", trans: "BANGAALADUMPALU UNNAAYAA?", en: "Do you have potatoes?" },
      { speaker: "B", te: "ఉన్నాయి, తాజాగా వచ్చాయి", trans: "UNNAAYI, TAAJAGAA VACHCHAAYI", en: "Yes, they came in fresh" },
      { speaker: "A", te: "రెండు కిలో ఇవ్వండి", trans: "RENDU KILO IVVANDI", en: "Give me two kilos" },
      { speaker: "B", te: "ఇంకేమన్నా కావాలా అమ్మా?", trans: "INKEMANNA KAAVAALAA AMMAA?", en: "Do you need anything else, ma'am?" },
      { speaker: "A", te: "చాలు, ఎంతయింది?", trans: "CHAALU, ENTHAYINDI?", en: "That's enough, how much is it?" },
      { speaker: "B", te: "మొత్తం నూట ఇరవై రూపాయలు", trans: "MOTHTHAM NOOTA IRAVAI RUPAAYALU", en: "Total is 120 rupees" },
    ],
  },
  {
    id: "school",
    title: "At School",
    teluguTitle: "బడిలో",
    icon: "🏫",
    characterA: "విద్యార్థి",
    characterB: "టీచర్",
    setting: "A student talks with their teacher at school",
    dialogue: [
      { speaker: "A", te: "గుడ్ మార్నింగ్ టీచర్!", trans: "GOOD MORNING TEACHER!", en: "Good morning teacher!" },
      { speaker: "B", te: "గుడ్ మార్నింగ్! హోమ్‌వర్క్ చేశావా?", trans: "GOOD MORNING! HOMEWORK CHESHAAVAA?", en: "Good morning! Did you do your homework?" },
      { speaker: "A", te: "చేశానండి టీచర్, ఇదిగోండి", trans: "CHESHAANANDI TEACHER, IDIGONDI", en: "Yes teacher, here it is" },
      { speaker: "B", te: "బాగా రాశావు, మంచిది!", trans: "BAAGAA RAASHAAVU, MANCHIDI!", en: "You wrote well, good job!" },
      { speaker: "A", te: "టీచర్, ఈ సమస్య అర్థం కాలేదండి", trans: "TEACHER, EE SAMASYA ARTHAM KAALEDANDI", en: "Teacher, I didn't understand this problem" },
      { speaker: "B", te: "పర్వాలేదు, మళ్ళీ చెప్తాను", trans: "PARVALEDU, MALLEE CHEPTHAANU", en: "No problem, I'll explain again" },
      { speaker: "A", te: "థాంక్యూ టీచర్!", trans: "THANK YOU TEACHER!", en: "Thank you teacher!" },
    ],
  },
  {
    id: "bus",
    title: "On the Bus",
    teluguTitle: "బస్సులో",
    icon: "🚌",
    characterA: "ప్రయాణికుడు",
    characterB: "కండక్టర్",
    setting: "A passenger rides a city bus",
    dialogue: [
      { speaker: "A", te: "అన్నా, ఈ బస్సు అమీర్‌పేట వెళ్తుందా?", trans: "ANNAA, EE BUSSU AMEERPET VELTHUNDAA?", en: "Brother, does this bus go to Ameerpet?" },
      { speaker: "B", te: "వెళ్తుంది, ఎక్కండి", trans: "VELTHUNDI, EKKANDI", en: "Yes it does, get on" },
      { speaker: "A", te: "టికెట్ ఎంత?", trans: "TICKET ENTHA?", en: "How much is the ticket?" },
      { speaker: "B", te: "పది రూపాయలు", trans: "PADHI RUPAAYALU", en: "Ten rupees" },
      { speaker: "A", te: "అమీర్‌పేట వచ్చినప్పుడు చెప్పండి", trans: "AMEERPET VACHCHINAPPUDU CHEPPANDI", en: "Please tell me when Ameerpet comes" },
      { speaker: "B", te: "సరే, తర్వాత స్టాప్ మీదే", trans: "SARE, THARVAATHA STOP MEEDE", en: "Okay, it's the next stop" },
      { speaker: "A", te: "థాంక్యూ అన్నా!", trans: "THANK YOU ANNAA!", en: "Thank you brother!" },
    ],
  },
  {
    id: "home",
    title: "At Home",
    teluguTitle: "ఇంట్లో",
    icon: "🏠",
    characterA: "పిల్లవాడు",
    characterB: "అమ్మ",
    setting: "A child talks with their mother at home",
    dialogue: [
      { speaker: "A", te: "అమ్మా, ఆకలి వేస్తోంది!", trans: "AMMAA, AAKALI VESTHONDI!", en: "Mom, I'm hungry!" },
      { speaker: "B", te: "ఏం తినాలనుకుంటున్నావు?", trans: "EM THINAALONUKUNTUNNAAVU?", en: "What do you want to eat?" },
      { speaker: "A", te: "దోశెలు చేయవా అమ్మా?", trans: "DOSHELU CHEYAVAA AMMAA?", en: "Can you make dosas, mom?" },
      { speaker: "B", te: "సరే, చెట్నీ కూడా చేస్తాను", trans: "SARE, CHUTNEY KOODAA CHESTHAANU", en: "Okay, I'll make chutney too" },
      { speaker: "A", te: "యాయ్! నేను హెల్ప్ చేస్తాను", trans: "YAAY! NENU HELP CHESTHAANU", en: "Yay! I'll help" },
      { speaker: "B", te: "మంచిది! ముందు చేతులు కడుక్కో", trans: "MANCHIDI! MUNDU CHETHULU KADUKKO", en: "Good! First wash your hands" },
      { speaker: "A", te: "అమ్మా, నీ దోశెలు బెస్ట్!", trans: "AMMAA, NEE DOSHELU BEST!", en: "Mom, your dosas are the best!" },
      { speaker: "B", te: "నీకు నచ్చితే చాలు నాన్నా", trans: "NEEKU NACHCHITE CHAALU NAANNAA", en: "As long as you like them, dear" },
    ],
  },
  {
    id: "doctor",
    title: "At the Doctor",
    teluguTitle: "డాక్టర్ దగ్గర",
    icon: "🏥",
    characterA: "పేషెంట్",
    characterB: "డాక్టర్",
    setting: "A visit to the doctor's clinic",
    dialogue: [
      { speaker: "B", te: "రండి, కూర్చోండి. ఏమయింది?", trans: "RANDI, KOORCHONDI. EMAAYINDI?", en: "Come in, sit down. What happened?" },
      { speaker: "A", te: "డాక్టర్, జ్వరం వచ్చింది", trans: "DOCTOR, JVARAM VACHCHINDI", en: "Doctor, I have a fever" },
      { speaker: "B", te: "ఎన్ని రోజుల నుండి?", trans: "ENNI ROJULA NUNDI?", en: "Since how many days?" },
      { speaker: "A", te: "రెండు రోజుల నుండి", trans: "RENDU ROJULA NUNDI", en: "Since two days" },
      { speaker: "B", te: "తలనొప్పి ఉందా?", trans: "THALANOPPI UNDAA?", en: "Do you have a headache?" },
      { speaker: "A", te: "ఉంది, జలుబు కూడా", trans: "UNDI, JALUBU KOODAA", en: "Yes, and a cold too" },
      { speaker: "B", te: "మందులు రాస్తాను, మూడు రోజులు వేసుకోండి", trans: "MANDHULU RAASTHAANU, MOODU ROJULU VESUKONDI", en: "I'll prescribe medicine, take it for 3 days" },
      { speaker: "A", te: "థాంక్యూ డాక్టర్!", trans: "THANK YOU DOCTOR!", en: "Thank you doctor!" },
    ],
  },
  {
    id: "ammamma",
    title: "Phone Call with Grandma",
    teluguTitle: "అమ్మమ్మతో ఫోన్",
    icon: "📞",
    characterA: "పిల్లవాడు",
    characterB: "అమ్మమ్మ",
    setting: "A child video-calls their grandmother",
    dialogue: [
      { speaker: "A", te: "హలో అమ్మమ్మా!", trans: "HALO AMMAMMAA!", en: "Hello Grandma!" },
      { speaker: "B", te: "హలో నాన్నా! ఎలా ఉన్నావు?", trans: "HALO NAANNAA! ELAA UNNAAVU?", en: "Hello dear! How are you?" },
      { speaker: "A", te: "బాగున్నాను! నువ్వు ఎలా ఉన్నావు?", trans: "BAAGUNNANU! NUVVU ELAA UNNAAVU?", en: "I'm fine! How are you?" },
      { speaker: "B", te: "బాగున్నాను. స్కూల్ ఎలా ఉంది?", trans: "BAAGUNNANU. SCHOOL ELAA UNDI?", en: "I'm fine. How is school?" },
      { speaker: "A", te: "బాగుంది! నేను తెలుగు నేర్చుకుంటున్నాను", trans: "BAAGUNDI! NENU TELUGU NERCHUKUNTUNNAANU", en: "It's good! I'm learning Telugu" },
      { speaker: "B", te: "అయ్యో, చాలా బాగుంది నాన్నా!", trans: "AYYO, CHAALAA BAAGUNDI NAANNAA!", en: "Oh, that's wonderful dear!" },
      { speaker: "A", te: "అమ్మమ్మ, ఎప్పుడు వస్తావు?", trans: "AMMAMMA, EPPUDU VASTHAAVU?", en: "Grandma, when are you coming?" },
      { speaker: "B", te: "త్వరలో వస్తాను! బై బై నాన్నా", trans: "THVARALOH VASTHAANU! BYE BYE NAANNAA", en: "I'll come soon! Bye bye dear" },
    ],
  },
];

// ── LEGACY: Keep existing AMMAMMA_CONVERSATIONS for backward compatibility ──

export interface ConversationSet {
  title: string;
  situation: string;
  cards: ConversationCard[];
}

export const AMMAMMA_CONVERSATIONS: Record<string, ConversationSet> = {
  afterVowels: {
    title: "First Video Call Set!",
    situation: "Ammamma calls on video — child can greet and respond!",
    cards: [
      { te: "హలో అమ్మమ్మా!", trans: "HALO AMMAMMAA!", en: "Hello Grandma!", tip: "Ammamma says this first, child repeats" },
      { te: "ఎలా ఉన్నావు?", trans: "ELAA UNNAAVU?", en: "How are you?", tip: "Ammamma asks, child answers: 'బాగున్నాను!'" },
      { te: "బాగున్నాను!", trans: "BAAGUNNANU!", en: "I'm fine!", tip: "Child responds with a big smile" },
      { te: "I love you అమ్మమ్మా", trans: "I LOVE YOU AMMAMMAA", en: "I love you Grandma", tip: "Telugu + English is perfectly fine!" },
      { te: "బై బై!", trans: "BYE BYE!", en: "Bye bye!", tip: "Wave and say it together" },
    ],
  },
  afterConsonants: {
    title: "Tell Ammamma About Your Day!",
    situation: "Ammamma asks about school — child can answer in Telugu!",
    cards: [
      { te: "స్కూల్ బాగుంది", trans: "SCHOOL BAAGUNDI", en: "School was good", tip: "Ammamma asks 'స్కూల్ ఎలా ఉంది?'" },
      { te: "నేను తెలుగు నేర్చుకుంటున్నాను", trans: "NENU TELUGU NERCHUKUNTUNNAANU", en: "I'm learning Telugu!", tip: "Show ammamma the Koorma app!" },
      { te: "నాకు ఆకలి వేస్తోంది", trans: "NAAKU AAKALI VESTHONDI", en: "I'm hungry", tip: "Ammamma loves hearing this!" },
      { te: "అమ్మమ్మ రావాలి", trans: "AMMAMMA RAAVAALI", en: "Grandma should come", tip: "Ammamma will melt!" },
      { te: "మీ ఇంటికి వస్తాను", trans: "MEE INTIKI VASTHAANU", en: "I'll come to your house", tip: "Plan a visit!" },
    ],
  },
  afterWords: {
    title: "Describe Things in Telugu!",
    situation: "Show ammamma objects and name them in Telugu!",
    cards: [
      { te: "ఇది నా కుక్క", trans: "IDI NAA KUKKA", en: "This is my dog", tip: "Show pets on camera" },
      { te: "ఇది ఎర్రగా ఉంది", trans: "IDI ERRAGAA UNDI", en: "This is red", tip: "Point at things and name colors" },
      { te: "అమ్మమ్మ, అన్నం తిన్నావా?", trans: "AMMAMMA, ANNAM THINNAVA?", en: "Grandma, did you eat?", tip: "Caring question — ammamma will be so proud" },
      { te: "నాకు మామిడి పండు కావాలి", trans: "NAAKU MAAMIDI PANDU KAAVAALI", en: "I want a mango", tip: "Ask ammamma about Indian fruits!" },
      { te: "నేను పాట పాడతాను", trans: "NENU PAATA PAADATAANU", en: "I'll sing a song", tip: "Sing a Telugu rhyme from the app!" },
    ],
  },
  afterSentences: {
    title: "Full Conversations with Ammamma!",
    situation: "Have a real conversation — question and answer!",
    cards: [
      { te: "అమ్మమ్మ, ఏం వండావు?", trans: "AMMAMMA, EM VANDAAVU?", en: "Grandma, what did you cook?", tip: "Ammamma loves talking about food" },
      { te: "నేను పుస్తకం చదువుతున్నాను", trans: "NENU PUSTHAKAM CHADHUVUTHUNNAANU", en: "I'm reading a book", tip: "Show ammamma your Telugu reading!" },
      { te: "అక్కడ వాతావరణం ఎలా ఉంది?", trans: "AKKADA VAATHAAVARNAM ELAA UNDI?", en: "How's the weather there?", tip: "Compare India weather vs here!" },
      { te: "నేను తెలుగులో మాట్లాడగలను!", trans: "NENU TELUGULO MAATLAADAGALANU!", en: "I can speak in Telugu!", tip: "Say this proudly!" },
      { te: "మళ్ళీ ఫోన్ చేస్తాను", trans: "MALLEE PHONE CHESTHAANU", en: "I'll call again", tip: "Promise to call again soon" },
    ],
  },
};
