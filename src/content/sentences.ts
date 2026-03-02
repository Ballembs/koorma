export const SENTENCE_LEVELS = {
  level1: {
    title: "రెండు పదాలు", titleEn: "Two Words",
    pattern: "Subject + Verb",
    sentences: [
      {
        te: "అమ్మ వచ్చింది",
        trans: "AMMA VACHCHINDI",
        en: "Mom came",
        words: [
          { te: "అమ్మ", trans: "AMMA", en: "Mom", role: "subject" },
          { te: "వచ్చింది", trans: "VACHCHINDI", en: "came", role: "verb" },
        ],
      },
      {
        te: "నాన్న వెళ్ళాడు",
        trans: "NAANNA VELLAADU",
        en: "Dad went",
        words: [
          { te: "నాన్న", trans: "NAANNA", en: "Dad", role: "subject" },
          { te: "వెళ్ళాడు", trans: "VELLAADU", en: "went", role: "verb" },
        ],
      },
      {
        te: "వర్షం వచ్చింది",
        trans: "VARSHAM VACHCHINDI",
        en: "Rain came",
        words: [
          { te: "వర్షం", trans: "VARSHAM", en: "Rain", role: "subject" },
          { te: "వచ్చింది", trans: "VACHCHINDI", en: "came", role: "verb" },
        ],
      },
      {
        te: "కుక్క మొరిగింది",
        trans: "KUKKA MORIGINDI",
        en: "Dog barked",
        words: [
          { te: "కుక్క", trans: "KUKKA", en: "Dog", role: "subject" },
          { te: "మొరిగింది", trans: "MORIGINDI", en: "barked", role: "verb" },
        ],
      },
      {
        te: "పిల్లి పడుకుంది",
        trans: "PILLI PADUKUNDI",
        en: "Cat slept",
        words: [
          { te: "పిల్లి", trans: "PILLI", en: "Cat", role: "subject" },
          { te: "పడుకుంది", trans: "PADUKUNDI", en: "slept", role: "verb" },
        ],
      },
      {
        te: "బాబు ఏడ్చాడు",
        trans: "BAABU EDCHAADU",
        en: "Baby cried",
        words: [
          { te: "బాబు", trans: "BAABU", en: "Baby", role: "subject" },
          { te: "ఏడ్చాడు", trans: "EDCHAADU", en: "cried", role: "verb" },
        ],
      },
      {
        te: "చెల్లి నవ్వింది",
        trans: "CHELLI NAVVINDI",
        en: "Sister laughed",
        words: [
          { te: "చెల్లి", trans: "CHELLI", en: "Sister", role: "subject" },
          { te: "నవ్వింది", trans: "NAVVINDI", en: "laughed", role: "verb" },
        ],
      },
      {
        te: "తాత కూర్చున్నాడు",
        trans: "THAATHA KOORCHUNNAADU",
        en: "Grandpa sat",
        words: [
          { te: "తాత", trans: "THAATHA", en: "Grandpa", role: "subject" },
          { te: "కూర్చున్నాడు", trans: "KOORCHUNNAADU", en: "sat", role: "verb" },
        ],
      },
      {
        te: "దోమ కుట్టింది",
        trans: "DOMA KUTTINDI",
        en: "Mosquito bit",
        words: [
          { te: "దోమ", trans: "DOMA", en: "Mosquito", role: "subject" },
          { te: "కుట్టింది", trans: "KUTTINDI", en: "bit", role: "verb" },
        ],
      },
      {
        te: "గాలి వీస్తోంది",
        trans: "GAALI VEESTHONDI",
        en: "Wind is blowing",
        words: [
          { te: "గాలి", trans: "GAALI", en: "Wind", role: "subject" },
          { te: "వీస్తోంది", trans: "VEESTHONDI", en: "is blowing", role: "verb" },
        ],
      },
    ],
  },
  level2: {
    title: "మూడు పదాలు", titleEn: "Three Words",
    pattern: "Subject + Object + Verb",
    sentences: [
      {
        te: "అమ్మ అన్నం వండుతోంది",
        trans: "AMMA ANNAM VANDUTHONDI",
        en: "Mom is cooking rice",
        words: [
          { te: "అమ్మ", trans: "AMMA", en: "Mom", role: "subject" },
          { te: "అన్నం", trans: "ANNAM", en: "rice", role: "object" },
          { te: "వండుతోంది", trans: "VANDUTHONDI", en: "is cooking", role: "verb" },
        ],
      },
      {
        te: "నాన్న పేపర్ చదువుతున్నాడు",
        trans: "NAANNA PAPER CHADHUVUTHUNNAADU",
        en: "Dad is reading the paper",
        words: [
          { te: "నాన్న", trans: "NAANNA", en: "Dad", role: "subject" },
          { te: "పేపర్", trans: "PAPER", en: "paper", role: "object" },
          { te: "చదువుతున్నాడు", trans: "CHADHUVUTHUNNAADU", en: "is reading", role: "verb" },
        ],
      },
      {
        te: "అక్క పాలు తాగుతోంది",
        trans: "AKKA PAALU THAAGUTHONDI",
        en: "Sister is drinking milk",
        words: [
          { te: "అక్క", trans: "AKKA", en: "Sister", role: "subject" },
          { te: "పాలు", trans: "PAALU", en: "milk", role: "object" },
          { te: "తాగుతోంది", trans: "THAAGUTHONDI", en: "is drinking", role: "verb" },
        ],
      },
      {
        te: "కుక్క ఎముక తింటోంది",
        trans: "KUKKA EMUKA THINTHONDI",
        en: "Dog is eating bone",
        words: [
          { te: "కుక్క", trans: "KUKKA", en: "Dog", role: "subject" },
          { te: "ఎముక", trans: "EMUKA", en: "bone", role: "object" },
          { te: "తింటోంది", trans: "THINTHONDI", en: "is eating", role: "verb" },
        ],
      },
      {
        te: "బాబు బంతి ఆడుతున్నాడు",
        trans: "BAABU BANTHI AADUTHUNNAADU",
        en: "Boy is playing ball",
        words: [
          { te: "బాబు", trans: "BAABU", en: "Boy", role: "subject" },
          { te: "బంతి", trans: "BANTHI", en: "ball", role: "object" },
          { te: "ఆడుతున్నాడు", trans: "AADUTHUNNAADU", en: "is playing", role: "verb" },
        ],
      },
      {
        te: "తాత పాట పాడుతున్నాడు",
        trans: "THAATHA PAATA PAADUTHUNNAADU",
        en: "Grandpa is singing a song",
        words: [
          { te: "తాత", trans: "THAATHA", en: "Grandpa", role: "subject" },
          { te: "పాట", trans: "PAATA", en: "song", role: "object" },
          { te: "పాడుతున్నాడు", trans: "PAADUTHUNNAADU", en: "is singing", role: "verb" },
        ],
      },
      {
        te: "అమ్మమ్మ కత చెప్తోంది",
        trans: "AMMAMMA KATHA CHEPTHONDI",
        en: "Grandma is telling a story",
        words: [
          { te: "అమ్మమ్మ", trans: "AMMAMMA", en: "Grandma", role: "subject" },
          { te: "కత", trans: "KATHA", en: "story", role: "object" },
          { te: "చెప్తోంది", trans: "CHEPTHONDI", en: "is telling", role: "verb" },
        ],
      },
      {
        te: "పిల్లి ఎలుకను పట్టింది",
        trans: "PILLI ELUKANU PATTINDI",
        en: "Cat caught a mouse",
        words: [
          { te: "పిల్లి", trans: "PILLI", en: "Cat", role: "subject" },
          { te: "ఎలుకను", trans: "ELUKANU", en: "mouse", role: "object" },
          { te: "పట్టింది", trans: "PATTINDI", en: "caught", role: "verb" },
        ],
      },
      {
        te: "ఆవు గడ్డి తింటోంది",
        trans: "AAVU GADDI THINTHONDI",
        en: "Cow is eating grass",
        words: [
          { te: "ఆవు", trans: "AAVU", en: "Cow", role: "subject" },
          { te: "గడ్డి", trans: "GADDI", en: "grass", role: "object" },
          { te: "తింటోంది", trans: "THINTHONDI", en: "is eating", role: "verb" },
        ],
      },
      {
        te: "చేప నీళ్ళు తాగుతోంది",
        trans: "CHEPA NEELLU THAAGUTHONDI",
        en: "Fish is drinking water (Wait, do fish drink?)",
        words: [
          { te: "చేప", trans: "CHEPA", en: "Fish", role: "subject" },
          { te: "నీళ్ళు", trans: "NEELLU", en: "water", role: "object" },
          { te: "తాగుతోంది", trans: "THAAGUTHONDI", en: "is drinking", role: "verb" },
        ],
      },
    ],
  },
  level3: {
    title: "చోటు + పని", titleEn: "Place + Action",
    pattern: "Subject + Place + Verb",
    sentences: [
      {
        te: "అమ్మ ఇంట్లో ఉంది",
        trans: "AMMA INTLO UNDI",
        en: "Mom is at home",
        words: [
          { te: "అమ్మ", trans: "AMMA", en: "Mom", role: "subject" },
          { te: "ఇంట్లో", trans: "INTLO", en: "at home", role: "place" },
          { te: "ఉంది", trans: "UNDI", en: "is", role: "verb" },
        ],
        note: "ఇంట్లో = ఇల్లు + లో (sandhi merged — NEVER write ఇల్లు లో)"
      },
      {
        te: "నాన్న ఆఫీసులో ఉన్నాడు",
        trans: "NAANNA OFFISULO UNNAADU",
        en: "Dad is in the office",
        words: [
          { te: "నాన్న", trans: "NAANNA", en: "Dad", role: "subject" },
          { te: "ఆఫీసులో", trans: "OFFISULO", en: "in the office", role: "place" },
          { te: "ఉన్నాడు", trans: "UNNAADU", en: "is", role: "verb" },
        ],
      },
      {
        te: "పిల్లలు బడికి వెళ్తున్నారు",
        trans: "PILLALU BADIKI VELTHUNNAARU",
        en: "Children are going to school",
        words: [
          { te: "పిల్లలు", trans: "PILLALU", en: "Children", role: "subject" },
          { te: "బడికి", trans: "BADIKI", en: "to school", role: "place" },
          { te: "వెళ్తున్నారు", trans: "VELTHUNNAARU", en: "are going", role: "verb" },
        ],
      },
      {
        te: "పూలు తోటలో ఉన్నాయి",
        trans: "POOLU THOTALO UNNAYI",
        en: "Flowers are in the garden",
        words: [
          { te: "పూలు", trans: "POOLU", en: "Flowers", role: "subject" },
          { te: "తోటలో", trans: "THOTALO", en: "in the garden", role: "place" },
          { te: "ఉన్నాయి", trans: "UNNAYI", en: "are", role: "verb" },
        ],
      },
      {
        te: "పక్షులు ఆకాశంలో ఎగురుతున్నాయి",
        trans: "PAKSHULU AAKAASHAMLO EGURUTHUNNAAYI",
        en: "Birds are flying in the sky",
        words: [
          { te: "పక్షులు", trans: "PAKSHULU", en: "Birds", role: "subject" },
          { te: "ఆకాశంలో", trans: "AAKAASHAMLO", en: "in the sky", role: "place" },
          { te: "ఎగురుతున్నాయి", trans: "EGURUTHUNNAAYI", en: "are flying", role: "verb" },
        ],
      },
      {
        te: "ఆవు గొట్టంలో ఉంది",
        trans: "AAVU GOTTAMLO UNDI",
        en: "Cow is in the shed",
        words: [
          { te: "ఆవు", trans: "AAVU", en: "Cow", role: "subject" },
          { te: "గొట్టంలో", trans: "GOTTAMLO", en: "in shed", role: "place" },
          { te: "ఉంది", trans: "UNDI", en: "is", role: "verb" },
        ],
      },
      {
        te: "చేప నీటిలో ఉంది",
        trans: "CHEPA NEETILO UNDI",
        en: "Fish is in the water",
        words: [
          { te: "చేప", trans: "CHEPA", en: "Fish", role: "subject" },
          { te: "నీటిలో", trans: "NEETILO", en: "in water", role: "place" },
          { te: "ఉంది", trans: "UNDI", en: "is", role: "verb" },
        ],
      },
      {
        te: "తాత ఇంటికి వచ్చాడు",
        trans: "THAATHA INTIKI VACHCHAADU",
        en: "Grandpa came home",
        words: [
          { te: "తాత", trans: "THAATHA", en: "Grandpa", role: "subject" },
          { te: "ఇంటికి", trans: "INTIKI", en: "to home", role: "place" },
          { te: "వచ్చాడు", trans: "VACHCHAADU", en: "came", role: "verb" },
        ],
      },
      {
        te: "కారు రోడ్డుమీద వెళ్తోంది",
        trans: "KAARU RODDUMEEDA VELTHONDI",
        en: "Car is going on the road",
        words: [
          { te: "కారు", trans: "KAARU", en: "Car", role: "subject" },
          { te: "రోడ్డుమీద", trans: "RODDUMEEDA", en: "on the road", role: "place" },
          { te: "వెళ్తోంది", trans: "VELTHONDI", en: "is going", role: "verb" },
        ],
      },
      {
        te: "నాన్న బజారుకి వెళ్ళాడు",
        trans: "NAANNA BAJAARUKI VELLAADU",
        en: "Dad went to the market",
        words: [
          { te: "నాన్న", trans: "NAANNA", en: "Dad", role: "subject" },
          { te: "బజారుకి", trans: "BAJAARUKI", en: "to the market", role: "place" },
          { te: "వెళ్ళాడు", trans: "VELLAADU", en: "went", role: "verb" },
        ],
      },
    ],
  },
  level4: {
    title: "ప్రశ్నలు & జవాబులు", titleEn: "Questions & Answers",
    pattern: "Q & A",
    sentences: [
      {
        te: "ఇది ఏమిటి?",
        trans: "IDI EMITI?",
        en: "What is this?",
        words: [
          { te: "ఇది", trans: "IDI", en: "this", role: "subject" },
          { te: "ఏమిటి", trans: "EMITI", en: "what", role: "question" },
        ],
      },
      {
        te: "ఇది పుస్తకం",
        trans: "IDI PUSTHAKAM",
        en: "This is a book",
        words: [
          { te: "ఇది", trans: "IDI", en: "this", role: "subject" },
          { te: "పుస్తకం", trans: "PUSTHAKAM", en: "book", role: "object" },
        ],
      },
      {
        te: "అమ్మ ఎక్కడ?",
        trans: "AMMA EKKADA?",
        en: "Where is mom?",
        words: [
          { te: "అమ్మ", trans: "AMMA", en: "Mom", role: "subject" },
          { te: "ఎక్కడ", trans: "EKKADA", en: "where", role: "question" },
        ],
      },
      {
        te: "అమ్మ ఇంట్లో ఉంది",
        trans: "AMMA INTLO UNDI",
        en: "Mom is at home",
        words: [
          { te: "అమ్మ", trans: "AMMA", en: "Mom", role: "subject" },
          { te: "ఇంట్లో", trans: "INTLO", en: "at home", role: "place" },
          { te: "ఉంది", trans: "UNDI", en: "is", role: "verb" },
        ],
      },
      {
        te: "ఇవి ఎన్ని?",
        trans: "IVI ENNI?",
        en: "How many are these?",
        words: [
          { te: "ఇవి", trans: "IVI", en: "these", role: "subject" },
          { te: "ఎన్ని", trans: "ENNI", en: "how many", role: "question" },
        ],
      },
      {
        te: "ఇవి మూడు",
        trans: "IVI MOODU",
        en: "These are three",
        words: [
          { te: "ఇవి", trans: "IVI", en: "these", role: "subject" },
          { te: "మూడు", trans: "MOODU", en: "three", role: "object" },
        ],
      },
      {
        te: "నువ్వు ఎవరు?",
        trans: "NUVVU EVARU?",
        en: "Who are you?",
        words: [
          { te: "నువ్వు", trans: "NUVVU", en: "you", role: "subject" },
          { te: "ఎవరు", trans: "EVARU", en: "who", role: "question" },
        ],
      },
      {
        te: "నేను అబ్బాయిని",
        trans: "NENU ABBAYINI",
        en: "I am a boy",
        words: [
          { te: "నేను", trans: "NENU", en: "I", role: "subject" },
          { te: "అబ్బాయిని", trans: "ABBAYINI", en: "am a boy", role: "verb" },
        ],
      },
      {
        te: "అది ఏమిటి?",
        trans: "ADI EMITI?",
        en: "What is that?",
        words: [
          { te: "అది", trans: "ADI", en: "that", role: "subject" },
          { te: "ఏమిటి", trans: "EMITI", en: "what", role: "question" },
        ],
      },
      {
        te: "అది పిల్లి",
        trans: "ADI PILLI",
        en: "That is a cat",
        words: [
          { te: "అది", trans: "ADI", en: "that", role: "subject" },
          { te: "పిల్లి", trans: "PILLI", en: "cat", role: "object" },
        ],
      },
    ],
  }
};
