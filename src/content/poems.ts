export interface PoemLine {
  te: string;
  trans: string;
  en: string;
}

export interface PoemWord {
  te: string;
  trans: string;
  en: string;
}

export interface Poem {
  id: string;
  title: { te: string; trans: string; en: string };
  theme: string;
  icon: string;
  source: string; // AP Class reference
  lines: PoemLine[];
  vocabulary: PoemWord[];
  moral?: { te: string; en: string };
}

export const TELUGU_POEMS: Poem[] = [
  // ═══ AP Class 2 Poems ═══
  {
    id: "vaana",
    title: { te: "వాన", trans: "VAANA", en: "Rain" },
    theme: "nature",
    icon: "🌧️",
    source: "AP Class 2",
    lines: [
      { te: "వాన వాన వల్లప్పా", trans: "VAANA VAANA VALLAPPA", en: "Rain, rain, dear rain" },
      { te: "వానలో తడిసింది ఒళ్ళంతా", trans: "VAANALO THADISINDI OLLANTHAA", en: "Got drenched all over in the rain" },
      { te: "పిల్లలు గెంతారు సంతోషంగా", trans: "PILLALU GENTHAARU SANTHOSHAMGA", en: "Children jumped happily" },
      { te: "భూమి అంతా పచ్చగా మారింది", trans: "BHOOMI ANTHAA PACHCHAGAA MAARINDI", en: "The whole earth turned green" },
    ],
    vocabulary: [
      { te: "వాన", trans: "VAANA", en: "Rain" },
      { te: "తడిసింది", trans: "THADISINDI", en: "Got wet" },
      { te: "గెంతారు", trans: "GENTHAARU", en: "Jumped" },
      { te: "భూమి", trans: "BHOOMI", en: "Earth" },
      { te: "పచ్చగా", trans: "PACHCHAGAA", en: "Green" },
    ],
    moral: { te: "వాన వల్ల ప్రకృతి అందంగా మారుతుంది", en: "Rain makes nature beautiful" },
  },
  {
    id: "sabbu-billa",
    title: { te: "సబ్బు బిళ్ళ", trans: "SABBU BILLA", en: "Soap Bubble" },
    theme: "play",
    icon: "🫧",
    source: "AP Class 2",
    lines: [
      { te: "సబ్బు బిళ్ళ సబ్బు బిళ్ళ", trans: "SABBU BILLA SABBU BILLA", en: "Soap bubble, soap bubble" },
      { te: "ఊదితే ఎగిరింది", trans: "OODITHE EGIRINDI", en: "When I blew, it flew" },
      { te: "ఇంద్రధనుస్సు రంగులతో మెరిసింది", trans: "INDRADHANUSSU RANGULATHOO MERISINDI", en: "It shone with rainbow colors" },
      { te: "తాకగానే పగిలింది", trans: "THAAKAGAANE PAGILINDI", en: "It burst as soon as I touched it" },
    ],
    vocabulary: [
      { te: "సబ్బు", trans: "SABBU", en: "Soap" },
      { te: "ఊదితే", trans: "OODITHE", en: "When blown" },
      { te: "ఎగిరింది", trans: "EGIRINDI", en: "Flew" },
      { te: "ఇంద్రధనుస్సు", trans: "INDRADHANUSSU", en: "Rainbow" },
      { te: "పగిలింది", trans: "PAGILINDI", en: "Burst" },
    ],
  },
  {
    id: "chilakallara",
    title: { te: "చిలకల్లారా చిలకల్లారా", trans: "CHILAKALLARA CHILAKALLARA", en: "Parrots, Parrots!" },
    theme: "animals",
    icon: "🦜",
    source: "AP Class 2",
    lines: [
      { te: "చిలకల్లారా చిలకల్లారా", trans: "CHILAKALLARA CHILAKALLARA", en: "Parrots, parrots!" },
      { te: "పచ్చని రంగు చిలకల్లారా", trans: "PACHCHANI RANGU CHILAKALLARA", en: "Green colored parrots!" },
      { te: "మామిడి కాయలు తిన్నారా", trans: "MAAMIDI KAAYALU THINNARA", en: "Did you eat the mangoes?" },
      { te: "చెట్టు మీద కూర్చున్నారా", trans: "CHETTU MEEDA KOORCHUNAARA", en: "Are you sitting on the tree?" },
    ],
    vocabulary: [
      { te: "చిలకలు", trans: "CHILAKALU", en: "Parrots" },
      { te: "పచ్చని", trans: "PACHCHANI", en: "Green" },
      { te: "మామిడి కాయలు", trans: "MAAMIDI KAAYALU", en: "Mangoes" },
      { te: "చెట్టు", trans: "CHETTU", en: "Tree" },
    ],
  },
  {
    id: "kothi-baava",
    title: { te: "కోతి బావ", trans: "KOTHI BAAVA", en: "Monkey Uncle" },
    theme: "animals",
    icon: "🐒",
    source: "AP Class 2",
    lines: [
      { te: "కోతి బావ కోతి బావ", trans: "KOTHI BAAVA KOTHI BAAVA", en: "Monkey uncle, monkey uncle" },
      { te: "ఎక్కడికి వెళ్తున్నావు", trans: "EKKADIKI VELTHUNNAAVU", en: "Where are you going?" },
      { te: "చెట్టు మీదకి ఎక్కుతున్నాను", trans: "CHETTU MEEDAKI EKKUTHUNNAANU", en: "I'm climbing the tree" },
      { te: "అరటి పళ్ళు తింటున్నాను", trans: "ARATI PALLU THINTHUNNAANU", en: "I'm eating bananas" },
    ],
    vocabulary: [
      { te: "కోతి", trans: "KOTHI", en: "Monkey" },
      { te: "ఎక్కడికి", trans: "EKKADIKI", en: "Where to" },
      { te: "ఎక్కుతున్నాను", trans: "EKKUTHUNNAANU", en: "I'm climbing" },
      { te: "అరటి పళ్ళు", trans: "ARATI PALLU", en: "Bananas" },
    ],
  },
  {
    id: "appadaalu-bajjeelu",
    title: { te: "అప్పడాలు బజ్జీలు", trans: "APPADAALU BAJJEELU", en: "Papad & Bajji" },
    theme: "food",
    icon: "🍽️",
    source: "AP Class 2",
    lines: [
      { te: "అప్పడాలు బజ్జీలు", trans: "APPADAALU BAJJEELU", en: "Papads and bajjis" },
      { te: "అమ్మ చేసింది రుచిగా", trans: "AMMA CHESINDI RUCHIGA", en: "Mom made them tasty" },
      { te: "వేడి వేడిగా తిన్నాను", trans: "VEDI VEDIGA THINNAANU", en: "I ate them hot, hot" },
      { te: "కడుపు నిండిపోయింది", trans: "KADUPU NINDIPOYINDI", en: "My tummy got full" },
    ],
    vocabulary: [
      { te: "అప్పడాలు", trans: "APPADAALU", en: "Papads/Papadums" },
      { te: "బజ్జీలు", trans: "BAJJEELU", en: "Bajjis/Fritters" },
      { te: "రుచిగా", trans: "RUCHIGA", en: "Tasty/Delicious" },
      { te: "వేడి", trans: "VEDI", en: "Hot" },
      { te: "కడుపు", trans: "KADUPU", en: "Stomach/Tummy" },
    ],
  },
  {
    id: "arati-chettu",
    title: { te: "అరటిచెట్టు", trans: "ARATI CHETTU", en: "Banana Tree" },
    theme: "nature",
    icon: "🌴",
    source: "AP Class 2",
    lines: [
      { te: "అరటిచెట్టు పెరిగింది", trans: "ARATI CHETTU PERIGINDI", en: "The banana tree grew" },
      { te: "పెద్ద పెద్ద ఆకులు వచ్చాయి", trans: "PEDDA PEDDA AAKULU VACHCHAAYI", en: "Big, big leaves appeared" },
      { te: "గెలలు గెలలు కాశాయి", trans: "GELALU GELALU KAASHAYI", en: "Bunches and bunches bore fruit" },
      { te: "తీయని పళ్ళు పక్వం అయ్యాయి", trans: "THEEYANI PALLU PAKVAM AYYAAYI", en: "Sweet fruits ripened" },
    ],
    vocabulary: [
      { te: "అరటిచెట్టు", trans: "ARATI CHETTU", en: "Banana tree" },
      { te: "పెరిగింది", trans: "PERIGINDI", en: "Grew" },
      { te: "ఆకులు", trans: "AAKULU", en: "Leaves" },
      { te: "గెలలు", trans: "GELALU", en: "Bunches (of fruit)" },
      { te: "తీయని", trans: "THEEYANI", en: "Sweet" },
      { te: "పక్వం", trans: "PAKVAM", en: "Ripe" },
    ],
    moral: { te: "చెట్లు పెంచితే తీయని ఫలాలు వస్తాయి", en: "Grow trees and you'll get sweet fruits" },
  },
];
