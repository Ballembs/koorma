// AP SCERT Class 1 Telugu Textbook — "తెలుగు తోట 1"
// Rich content with multi-paragraph stories, word breakdowns, and exercises

export const AP_CLASS_1_RHYMES = [
  {
    id: "chapter-1-rhyme",
    title: { te: "వాన", trans: "VAANA", en: "Rain" },
    lines: [
      { te: "వాన వాన వల్లప్ప", trans: "VAANA VAANA VALLAPPA", en: "Rain rain vallappa" },
      { te: "వాకిలి తిరుగు చెల్లప్ప", trans: "VAAKILI THIRUGU CHELLAPPA", en: "Turn around the yard chellappa" },
      { te: "నీళ్ళు నీళ్ళు చల్లప్ప", trans: "NEELLU NEELLU CHALLAPPA", en: "Water water challappa" },
      { te: "నేల తడిసింది వల్లప్ప", trans: "NELA THADISINDI VALLAPPA", en: "The ground got wet vallappa" },
    ],
    exercises: [
      {
        id: "c1-r1-ex1",
        type: "fill-blank",
        instruction: { te: "ఖాళీలు పూరించండి", en: "Fill in the blanks" },
        items: [
          { question: { te: "వాన వాన ___", en: "Rain rain ___" }, options: ["వల్లప్ప", "చెల్లప్ప", "పిల్లప్ప", "కల్లప్ప"], answer: "వల్లప్ప" },
          { question: { te: "వాకిలి తిరుగు ___", en: "Turn around the yard ___" }, options: ["వల్లప్ప", "చెల్లప్ప", "పిల్లప్ప", "కల్లప్ప"], answer: "చెల్లప్ప" },
          { question: { te: "___ నీళ్ళు చల్లప్ప", en: "___ water challappa" }, options: ["వాన", "నీళ్ళు", "నేల", "వాకిలి"], answer: "నీళ్ళు" },
        ]
      }
    ]
  },
  {
    id: "chapter-4-rhyme",
    title: { te: "చందమామ", trans: "CHANDAMAAMA", en: "Moon" },
    lines: [
      { te: "చందమామ రావే", trans: "CHANDAMAAMA RAAVE", en: "Come oh moon" },
      { te: "జాబిల్లి రావే", trans: "JAABILLI RAAVE", en: "Come oh crescent" },
      { te: "కొండెక్కి రావే", trans: "KONDEKKI RAAVE", en: "Come climbing the hill" },
      { te: "కోరి మ్రొక్కి రావే", trans: "KORI MROKKI RAAVE", en: "Come with prayers" },
    ],
    exercises: [
      {
        id: "c1-r2-ex1",
        type: "match",
        instruction: { te: "జతపరచండి", en: "Match the pairs" },
        items: {
          pairs: [
            { left: { te: "చందమామ", trans: "CHANDAMAAMA" }, right: { en: "Moon", emoji: "🌙" } },
            { left: { te: "జాబిల్లి", trans: "JAABILLI" }, right: { en: "Crescent Moon", emoji: "🌛" } },
            { left: { te: "కొండ", trans: "KONDA" }, right: { en: "Hill", emoji: "⛰️" } },
            { left: { te: "నక్షత్రం", trans: "NAKSHATHRAM" }, right: { en: "Star", emoji: "⭐" } },
          ]
        }
      }
    ]
  },
  {
    id: "chapter-6-rhyme",
    title: { te: "ఏనుగు", trans: "ENUGU", en: "Elephant" },
    lines: [
      { te: "ఏనుగు ఏనుగు ఎంత పెద్దది", trans: "ENUGU ENUGU ENTHA PEDDADI", en: "Elephant elephant how big it is" },
      { te: "తొండం ఊపుతూ నడుస్తోంది", trans: "THONDAM OOPUTHU NADUSTHONDI", en: "Walking while swinging its trunk" },
      { te: "చెవులు ఆడిస్తూ నిలబడింది", trans: "CHEVULU AADISTHU NILABADINDI", en: "Standing while flapping its ears" },
      { te: "పిల్లలందరికీ ఇష్టమైనది", trans: "PILLALAANDARIKI ISHTAMAINADI", en: "Loved by all children" },
    ],
    exercises: []
  }
] as const;
