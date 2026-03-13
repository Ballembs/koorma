// AP SCERT Class 2 Telugu — Stories
// Rich content with multi-paragraph stories + word-level breakdowns

export const AP_CLASS_2_STORIES = [
  {
    id: "c2-ch2-story",
    title: { te: "నక్క - ద్రాక్ష", trans: "NAKKA - DRAAKSHA", en: "Fox and Grapes" },
    paragraphs: [
      {
        te: "ఒక అడవిలో ఒక నక్క ఉండేది. ఒకరోజు నక్కకు బాగా ఆకలి వేసింది.",
        trans: "OKA ADAVILO OKA NAKKA UNDEDI. OKAROZU NAKKAKU BAAGAA AAKALI VESINDI.",
        en: "There was a fox in a forest. One day the fox got very hungry.",
        words: [
          { te: "అడవి", trans: "ADAVI", en: "Forest" },
          { te: "నక్క", trans: "NAKKA", en: "Fox" },
          { te: "ఆకలి", trans: "AAKALI", en: "Hunger" },
        ]
      },
      {
        te: "ఆహారం వెతుకుతూ తిరుగుతోంది. అప్పుడు ఒక ద్రాక్ష తీగ కనిపించింది.",
        trans: "AAHAARAM VETHUKUTHU THIRUGUTHONDI. APPUDU OKA DRAAKSHA THEEGA KANIPINCHINDI.",
        en: "It wandered looking for food. Then it spotted a grapevine.",
        words: [
          { te: "ఆహారం", trans: "AAHAARAM", en: "Food" },
          { te: "వెతుకుతూ", trans: "VETHUKUTHU", en: "Searching" },
          { te: "ద్రాక్ష", trans: "DRAAKSHA", en: "Grapes" },
          { te: "తీగ", trans: "THEEGA", en: "Vine" },
        ]
      },
      {
        te: "ద్రాక్ష పండ్లు చాలా ఎత్తులో ఉన్నాయి. నక్క గెంతి గెంతి అందుకోవాలని చూసింది.",
        trans: "DRAAKSHA PANDLU CHAALA ETTHULO UNNAYI. NAKKA GENTHI GENTHI ANDUKOVAALNI CHUSINDI.",
        en: "The grapes were very high up. The fox jumped and jumped trying to reach them.",
        words: [
          { te: "ఎత్తు", trans: "ETTHU", en: "Height" },
          { te: "గెంతి", trans: "GENTHI", en: "Jumped" },
          { te: "అందుకోవాలని", trans: "ANDUKOVAALNI", en: "To reach/grab" },
        ]
      },
      {
        te: "ఎంత ప్రయత్నించినా ద్రాక్ష పండ్లు అందలేదు. నక్క అలసిపోయింది.",
        trans: "ENTHA PRAYATHNINCHINA DRAAKSHA PANDLU ANDALEDHU. NAKKA ALASIPOYINDI.",
        en: "No matter how much it tried, it couldn't reach the grapes. The fox got tired.",
        words: [
          { te: "ప్రయత్నించినా", trans: "PRAYATHNINCHINA", en: "Even after trying" },
          { te: "అందలేదు", trans: "ANDALEDHU", en: "Couldn't reach" },
          { te: "అలసిపోయింది", trans: "ALASIPOYINDI", en: "Got tired" },
        ]
      },
      {
        te: "'ఆ ద్రాక్ష పండ్లు పుల్లగా ఉంటాయి' అని నక్క అనుకుని వెళ్ళిపోయింది. అందనిది అందుకోలేనప్పుడు తప్పు పెట్టడం సరి కాదు.",
        trans: "'AA DRAAKSHA PANDLU PULLAGA UNTAAYI' ANI NAKKA ANUKUNI VELLIPOYINDI.",
        en: "'Those grapes must be sour' the fox thought and walked away. Blaming what you can't reach is wrong.",
        words: [
          { te: "పుల్లగా", trans: "PULLAGA", en: "Sour" },
          { te: "అనుకుని", trans: "ANUKUNI", en: "Thought/decided" },
          { te: "వెళ్ళిపోయింది", trans: "VELLIPOYINDI", en: "Went away" },
        ]
      },
    ],
    exercises: [
      {
        id: "c2-s1-ex1",
        type: "comprehension",
        instruction: { te: "ప్రశ్నలకు సమాధానం చెప్పండి", en: "Answer the questions" },
        items: [
          {
            question: { te: "నక్కకు ఏమి కనిపించింది?", en: "What did the fox find?" },
            options: [
              { te: "మామిడి చెట్టు", en: "Mango tree" },
              { te: "ద్రాక్ష తీగ", en: "Grapevine" },
              { te: "అరటి చెట్టు", en: "Banana tree" },
            ],
            correctIndex: 1,
            explanation: { te: "నక్కకు ఒక ద్రాక్ష తీగ కనిపించింది", en: "The fox found a grapevine" }
          },
          {
            question: { te: "ద్రాక్ష పండ్లు ఎందుకు అందలేదు?", en: "Why couldn't the fox reach the grapes?" },
            options: [
              { te: "చాలా చిన్నవి", en: "Too small" },
              { te: "చాలా ఎత్తులో ఉన్నాయి", en: "Too high up" },
              { te: "చాలా పెద్దవి", en: "Too big" },
            ],
            correctIndex: 1,
            explanation: { te: "ద్రాక్ష పండ్లు చాలా ఎత్తులో ఉన్నాయి", en: "The grapes were very high up" }
          },
          {
            question: { te: "చివరకు నక్క ఏమి అంది?", en: "What did the fox finally say?" },
            options: [
              { te: "పండ్లు తియ్యగా ఉంటాయి", en: "The fruits are sweet" },
              { te: "పండ్లు పుల్లగా ఉంటాయి", en: "The fruits are sour" },
              { te: "పండ్లు పెద్దవి", en: "The fruits are big" },
            ],
            correctIndex: 1,
            explanation: { te: "నక్క 'ద్రాక్ష పండ్లు పుల్లగా ఉంటాయి' అని అనుకుంది", en: "The fox thought 'the grapes must be sour'" }
          }
        ]
      }
    ]
  },
] as const;
