// AP SCERT Class 2 Telugu Textbook — "తెలుగు తోట 2"
// Rich content with full rhymes and exercises

export const AP_CLASS_2_RHYMES = [
  {
    id: "c2-ch1-rhyme",
    title: { te: "వానకల్లప్ప", trans: "VAANAKALLAPPA", en: "Rainy Days" },
    lines: [
      { te: "మబ్బులు పట్టి వానలు కురిసె", trans: "MABBULU PATTI VAANALU KURISE", en: "Clouds gathered and it rained" },
      { te: "వాగులు పొంగి నీళ్ళు పారె", trans: "VAAGULU PONGI NEELLU PAARE", en: "Streams overflowed and water flowed" },
      { te: "కప్పలు బెకబెక మని అరిచె", trans: "KAPPALU BEKABEKA MANI ARICHE", en: "Frogs croaked beka-beka" },
      { te: "పిల్లలు వానలో ఆడుకునిరి", trans: "PILLALU VAANALO AADUKUNIRI", en: "Children played in the rain" },
    ],
    exercises: [
      {
        id: "c2-r1-ex1",
        type: "fill-blank",
        instruction: { te: "ఖాళీలు పూరించండి", en: "Fill in the blanks" },
        items: [
          { question: { te: "___ పట్టి వానలు కురిసె", en: "___ gathered and it rained" }, options: ["మబ్బులు", "కప్పలు", "పిల్లలు", "నక్షత్రాలు"], answer: "మబ్బులు" },
          { question: { te: "కప్పలు ___ మని అరిచె", en: "Frogs croaked ___" }, options: ["బెకబెక", "మేమే", "కావ్", "భౌభౌ"], answer: "బెకబెక" },
        ]
      }
    ]
  },
  {
    id: "c2-ch3-rhyme",
    title: { te: "చిట్టి చిలకమ్మ", trans: "CHITTI CHILAKAMMA", en: "Little Parrot" },
    lines: [
      { te: "చిట్టి చిలకమ్మ పచ్చ చిలకమ్మ", trans: "CHITTI CHILAKAMMA PACHCHA CHILAKAMMA", en: "Little parrot, green parrot" },
      { te: "ఎర్ర ముక్కు ఉన్న చిలకమ్మ", trans: "ERRA MUKKU UNNA CHILAKAMMA", en: "Parrot with a red beak" },
      { te: "మామిడి పండు తిన్న చిలకమ్మ", trans: "MAAMIDI PANDU THINNA CHILAKAMMA", en: "Parrot that ate a mango" },
      { te: "రామ రామ అన్న చిలకమ్మ", trans: "RAAMA RAAMA ANNA CHILAKAMMA", en: "Parrot that said Rama Rama" },
    ],
    exercises: []
  }
] as const;
