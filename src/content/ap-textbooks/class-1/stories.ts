// AP SCERT Class 1 Telugu Textbook — Stories
// Rich content with multi-paragraph stories + word-level breakdowns

export const AP_CLASS_1_STORIES = [
  {
    id: "chapter-2-story",
    title: { te: "కోతి, పిల్లి", trans: "KOTHI, PILLI", en: "Monkey and Cat" },
    paragraphs: [
      {
        te: "ఒక ఊరిలో ఒక కోతి, ఒక పిల్లి ఉండేవి.",
        trans: "OKA OORILO OKA KOTHI, OKA PILLI UNDEVI.",
        en: "In a village, there lived a monkey and a cat.",
        words: [
          { te: "ఊరు", trans: "OORU", en: "Village" },
          { te: "కోతి", trans: "KOTHI", en: "Monkey" },
          { te: "పిల్లి", trans: "PILLI", en: "Cat" },
        ]
      },
      {
        te: "అవి రెండూ మంచి స్నేహితులు. ఎప్పుడూ కలిసి ఆడుకునేవి.",
        trans: "AVI RENDU MANCHI SNEHITHULU. EPPUDU KALISI AADUKUNEVI.",
        en: "They were both good friends. They always played together.",
        words: [
          { te: "స్నేహితులు", trans: "SNEHITHULU", en: "Friends" },
          { te: "కలిసి", trans: "KALISI", en: "Together" },
          { te: "ఆడుకునేవి", trans: "AADUKUNEVI", en: "Used to play" },
        ]
      },
      {
        te: "ఒకరోజు వాటికి ఒక రొట్టె దొరికింది. ఎవరికి ఎక్కువ వాటా అని గొడవ పడ్డాయి.",
        trans: "OKAROZU VAATIKI OKA ROTTE DORIKINDI. EVARIKI EKKUVA VAATA ANI GODAVA PADDAYI.",
        en: "One day they found a bread. They fought over who gets the bigger share.",
        words: [
          { te: "రొట్టె", trans: "ROTTE", en: "Bread" },
          { te: "దొరికింది", trans: "DORIKINDI", en: "Found" },
          { te: "గొడవ", trans: "GODAVA", en: "Fight/quarrel" },
          { te: "వాటా", trans: "VAATA", en: "Share" },
        ]
      },
      {
        te: "అప్పుడు ఒక నక్క వచ్చింది. 'నేను సమానంగా పంచుతాను' అని చెప్పింది.",
        trans: "APPUDU OKA NAKKA VACHCHINDI. 'NENU SAMAANANGA PANCHUTHAANU' ANI CHEPPINDI.",
        en: "Then a fox came. 'I will divide it equally' it said.",
        words: [
          { te: "నక్క", trans: "NAKKA", en: "Fox" },
          { te: "సమానంగా", trans: "SAMAANANGA", en: "Equally" },
          { te: "పంచుతాను", trans: "PANCHUTHAANU", en: "I will divide" },
        ]
      },
      {
        te: "నక్క రొట్టెని రెండు ముక్కలు చేసింది. ఒక ముక్క పెద్దది, ఒకటి చిన్నది. నక్క పెద్ద ముక్కలో కొంచెం తినేసింది. 'ఇప్పుడు ఇది చిన్నది' అని మళ్ళీ రెండో ముక్కలో తినేసింది.",
        trans: "NAKKA ROTTENI RENDU MUKKALU CHESINDI. OKA MUKKA PEDDADI, OKATI CHINNADI. NAKKA PEDDA MUKKALO KONCHEM THINISESINDI.",
        en: "The fox broke the bread into two pieces. One was bigger, one smaller. The fox ate some from the bigger piece. 'Now this is smaller' it said and ate from the other piece too.",
        words: [
          { te: "ముక్కలు", trans: "MUKKALU", en: "Pieces" },
          { te: "పెద్దది", trans: "PEDDADI", en: "Big one" },
          { te: "చిన్నది", trans: "CHINNADI", en: "Small one" },
          { te: "తినేసింది", trans: "THINISESINDI", en: "Ate up" },
        ]
      },
      {
        te: "చివరకు రొట్టె అంతా నక్క తినేసింది! కోతి, పిల్లి బాధపడ్డాయి. 'మనం గొడవ పడకుండా పంచుకుని ఉంటే బాగుండేది' అని అనుకున్నాయి.",
        trans: "CHIVARAKU ROTTE ANTH NAKKA THINISESINDI! KOTHI, PILLI BAADHA PADDAYI.",
        en: "In the end, the fox ate all the bread! The monkey and cat were sad. 'We should have shared without fighting' they thought.",
        words: [
          { te: "చివరకు", trans: "CHIVARAKU", en: "In the end" },
          { te: "బాధపడ్డాయి", trans: "BAADHA PADDAYI", en: "Were sad" },
          { te: "పంచుకుని", trans: "PANCHUKUNI", en: "Shared" },
        ]
      },
    ],
    exercises: [
      {
        id: "c1-s1-ex1",
        type: "comprehension",
        instruction: { te: "ప్రశ్నలకు సమాధానం రాయండి", en: "Answer the questions" },
        items: [
          {
            question: { te: "కోతి, పిల్లికి ఏమి దొరికింది?", en: "What did the monkey and cat find?" },
            options: [
              { te: "పండు", en: "Fruit" },
              { te: "రొట్టె", en: "Bread" },
              { te: "పాలు", en: "Milk" },
            ],
            correctIndex: 1,
            explanation: { te: "కోతి, పిల్లికి ఒక రొట్టె దొరికింది", en: "The monkey and cat found a bread" }
          },
          {
            question: { te: "రొట్టెను ఎవరు పంచుతానని చెప్పారు?", en: "Who said they would divide the bread?" },
            options: [
              { te: "కోతి", en: "Monkey" },
              { te: "పిల్లి", en: "Cat" },
              { te: "నక్క", en: "Fox" },
            ],
            correctIndex: 2,
            explanation: { te: "నక్క రొట్టెను సమానంగా పంచుతానని చెప్పింది", en: "The fox said it would divide the bread equally" }
          },
          {
            question: { te: "చివరకు రొట్టె ఎవరు తిన్నారు?", en: "Who ate the bread in the end?" },
            options: [
              { te: "కోతి", en: "Monkey" },
              { te: "నక్క", en: "Fox" },
              { te: "పిల్లి", en: "Cat" },
            ],
            correctIndex: 1,
            explanation: { te: "నక్క రొట్టె అంతా తినేసింది", en: "The fox ate all the bread" }
          },
        ]
      },
      {
        id: "c1-s1-ex2",
        type: "ordering",
        instruction: { te: "సరైన వరుసలో పెట్టండి", en: "Put in the correct order" },
        items: [
          { te: "నక్క రొట్టె అంతా తినేసింది", trans: "NAKKA ROTTE ANTH THINISESINDI", en: "The fox ate all the bread" },
          { te: "కోతి పిల్లి గొడవ పడ్డాయి", trans: "KOTHI PILLI GODAVA PADDAYI", en: "Monkey and cat fought" },
          { te: "వాటికి రొట్టె దొరికింది", trans: "VAATIKI ROTTE DORIKINDI", en: "They found a bread" },
          { te: "నక్క వచ్చింది", trans: "NAKKA VACHCHINDI", en: "The fox came" },
        ],
        correctOrder: [2, 1, 3, 0]
      }
    ]
  },
  {
    id: "chapter-5-story",
    title: { te: "ఆవు - పులి", trans: "AAVU - PULI", en: "Cow and Tiger" },
    paragraphs: [
      {
        te: "ఒక అడవిలో ఒక ఆవు ఉండేది. ఆ ఆవుకు ఒక చిన్న దూడ ఉంది.",
        trans: "OKA ADAVILO OKA AAVU UNDEDI. AA AAVUKU OKA CHINNA DUDA UNDI.",
        en: "In a forest, there lived a cow. The cow had a little calf.",
        words: [
          { te: "అడవి", trans: "ADAVI", en: "Forest" },
          { te: "ఆవు", trans: "AAVU", en: "Cow" },
          { te: "దూడ", trans: "DUDA", en: "Calf" },
        ]
      },
      {
        te: "ప్రతిరోజు ఆవు గడ్డి తినడానికి వెళ్ళేది. దూడను ఇంట్లో ఉంచేది.",
        trans: "PRATHIROZU AAVU GADDI THINADANIKI VELLEDI. DUDANU INTLO UNCHEDI.",
        en: "Every day the cow went to eat grass. She kept the calf at home.",
        words: [
          { te: "గడ్డి", trans: "GADDI", en: "Grass" },
          { te: "వెళ్ళేది", trans: "VELLEDI", en: "Used to go" },
          { te: "ఇంట్లో", trans: "INTLO", en: "At home" },
        ]
      },
      {
        te: "ఒకరోజు ఒక పులి వచ్చింది. దూడను తినాలని చూసింది.",
        trans: "OKAROZU OKA PULI VACHCHINDI. DUDANU THINAALNI CHUSINDI.",
        en: "One day a tiger came. It wanted to eat the calf.",
        words: [
          { te: "పులి", trans: "PULI", en: "Tiger" },
          { te: "తినాలని", trans: "THINAALNI", en: "To eat" },
        ]
      },
      {
        te: "ఆవు ధైర్యంగా పులి ముందు నిలబడింది. తన కొమ్ములతో పులిని తరిమేసింది.",
        trans: "AAVU DHAIRYANGA PULI MUNDU NILABADINDI. THANA KOMMULATO PULINI THARIMESINDI.",
        en: "The cow bravely stood before the tiger. She chased the tiger away with her horns.",
        words: [
          { te: "ధైర్యంగా", trans: "DHAIRYANGA", en: "Bravely" },
          { te: "కొమ్ములు", trans: "KOMMULU", en: "Horns" },
          { te: "తరిమేసింది", trans: "THARIMESINDI", en: "Chased away" },
        ]
      },
      {
        te: "పులి భయపడి పారిపోయింది. దూడ తల్లి దగ్గరకు పరిగెత్తింది. అమ్మ ఎంత గొప్పది!",
        trans: "PULI BHAYAPADI PAARIPOYINDI. DUDA THALLI DAGGARAKU PARIGETTINDI. AMMA ENTHA GOPPADI!",
        en: "The tiger got scared and ran away. The calf ran to its mother. How great a mother is!",
        words: [
          { te: "భయపడి", trans: "BHAYAPADI", en: "Got scared" },
          { te: "పారిపోయింది", trans: "PAARIPOYINDI", en: "Ran away" },
          { te: "తల్లి", trans: "THALLI", en: "Mother" },
          { te: "గొప్పది", trans: "GOPPADI", en: "Great" },
        ]
      },
    ],
    exercises: [
      {
        id: "c1-s2-ex1",
        type: "comprehension",
        instruction: { te: "ప్రశ్నలకు సమాధానం రాయండి", en: "Answer the questions" },
        items: [
          {
            question: { te: "ఆవు ఎక్కడ ఉండేది?", en: "Where did the cow live?" },
            options: [
              { te: "ఊరిలో", en: "In a village" },
              { te: "అడవిలో", en: "In a forest" },
              { te: "నదిలో", en: "In a river" },
            ],
            correctIndex: 1,
            explanation: { te: "ఆవు ఒక అడవిలో ఉండేది", en: "The cow lived in a forest" }
          },
          {
            question: { te: "ఆవు పులిని ఎలా తరిమేసింది?", en: "How did the cow chase the tiger?" },
            options: [
              { te: "అరిచి", en: "By shouting" },
              { te: "కొమ్ములతో", en: "With horns" },
              { te: "పరిగెత్తి", en: "By running" },
            ],
            correctIndex: 1,
            explanation: { te: "ఆవు తన కొమ్ములతో పులిని తరిమేసింది", en: "The cow chased the tiger with her horns" }
          }
        ]
      },
      {
        id: "c1-s2-ex2",
        type: "odd-one-out",
        instruction: { te: "వేరుగా ఉన్నది ఏది?", en: "Which one is different?" },
        items: [
          { te: "ఆవు", en: "Cow", isOdd: false, emoji: "🐄" },
          { te: "పులి", en: "Tiger", isOdd: false, emoji: "🐅" },
          { te: "దూడ", en: "Calf", isOdd: false, emoji: "🐮" },
          { te: "రొట్టె", en: "Bread", isOdd: true, emoji: "🍞" },
        ],
        hint: { te: "మూడు జంతువులు, ఒకటి ఆహారం", en: "Three are animals, one is food" }
      }
    ]
  },
] as const;
