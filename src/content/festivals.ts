export interface VocabularyItem {
  te: string;
  trans: string;
  en: string;
}

export interface Festival {
  id: string;
  name: { te: string; en: string };
  month: number; // 1-12 (approximate Gregorian month)
  emoji: string;
  greeting: { te: string; trans: string; en: string };
  vocabulary: VocabularyItem[];
  story: string;
}

export const TELUGU_FESTIVALS: Festival[] = [
  {
    id: "ugadi",
    name: { te: "ఉగాది", en: "Ugadi (Telugu New Year)" },
    month: 3, // March/April (varies)
    emoji: "🌸",
    greeting: { te: "ఉగాది శుభాకాంక్షలు!", trans: "UGADI SHUBHAAKANKSHALU!", en: "Happy Ugadi!" },
    vocabulary: [
      { te: "పచ్చడి", trans: "PACHCHADI", en: "Ugadi special chutney (6 tastes)" },
      { te: "నూతన సంవత్సరం", trans: "NOOTHANA SAMVATHSARAM", en: "New Year" },
      { te: "తోరణం", trans: "THORANAM", en: "Mango leaf decoration" },
      { te: "తీపి", trans: "THEEPI", en: "Sweet" },
      { te: "పులుపు", trans: "PULUPU", en: "Sour" },
      { te: "ఉప్పు", trans: "UPPU", en: "Salt" },
      { te: "చేదు", trans: "CHEDU", en: "Bitter" },
      { te: "కారం", trans: "KAARAM", en: "Spicy" },
      { te: "వగరు", trans: "VAGARU", en: "Tangy/Astringent" },
    ],
    story: "🌸 ఎందుకు జరుపుకుంటాం? (Why do we celebrate?)\n\nఉగాది is the తెలుగు నూతన సంవత్సరం (Telugu New Year)! It marks the beginning of a new year in the Telugu calendar. The word ఉగాది comes from 'యుగ + ఆది' meaning 'beginning of an era.'\n\n🍽️ ఎలా జరుపుకుంటాం? (How do we celebrate?)\n\nWe eat ఉగాది పచ్చడి — a special chutney with ఆరు రుచులు (6 tastes):\n• తీపి (Sweet) — బెల్లం (jaggery)\n• పులుపు (Sour) — చింతపండు (tamarind)\n• ఉప్పు (Salty) — ఉప్పు (salt)\n• చేదు (Bitter) — వేప పూలు (neem flowers)\n• కారం (Spicy) — మిరపకాయ (chilli)\n• వగరు (Tangy) — మామిడికాయ (raw mango)\n\nJust like life has all kinds of experiences — happy, sad, and everything in between! We also hang తోరణం (mango leaf decorations) on our doors. 🥭",
  },
  {
    id: "sankranti",
    name: { te: "సంక్రాంతి", en: "Sankranti" },
    month: 1, // January
    emoji: "🪁",
    greeting: { te: "సంక్రాంతి శుభాకాంక్షలు!", trans: "SANKRANTHI SHUBHAAKANKSHALU!", en: "Happy Sankranti!" },
    vocabulary: [
      { te: "గాలిపటం", trans: "GAALIPATAM", en: "Kite" },
      { te: "పొంగలి", trans: "PONGALI", en: "Sweet rice dish" },
      { te: "భోగి మంట", trans: "BHOGI MANTA", en: "Bhogi bonfire" },
      { te: "ముగ్గులు", trans: "MUGGULU", en: "Rangoli patterns" },
    ],
    story: "🪁 ఎందుకు జరుపుకుంటాం? (Why do we celebrate?)\n\nసంక్రాంతి is the పంట పండుగ (harvest festival)! Farmers celebrate the new harvest and thank the sun — సూర్యుడు — for a good crop. It comes in జనవరి (January) every year.\n\n🏠 ఎలా జరుపుకుంటాం? (How do we celebrate?)\n\nSankranti is 3 days of fun!\n• భోగి (Day 1): We light భోగి మంటలు (bonfires) to burn old things and welcome the new.\n• సంక్రాంతి (Day 2): Families make పొంగలి (sweet rice with jaggery) and wear కొత్త బట్టలు (new clothes).\n• కనుమ (Day 3): We thank our పశువులు (cattle) who helped with farming.\n\nKids fly colorful గాలిపటాలు (kites) in the sky, and women draw beautiful ముగ్గులు (rangoli) with రంగులు (colors) in front of their houses! 🎨",
  },
  {
    id: "bathukamma",
    name: { te: "బతుకమ్మ", en: "Bathukamma" },
    month: 10, // October
    emoji: "💐",
    greeting: { te: "బతుకమ్మ పండుగ శుభాకాంక్షలు!", trans: "BATHUKAMMA PANDUGA SHUBHAAKANKSHALU!", en: "Happy Bathukamma!" },
    vocabulary: [
      { te: "పూలు", trans: "POOLU", en: "Flowers" },
      { te: "తంగేడు పూలు", trans: "THANGEDU POOLU", en: "Marigold flowers" },
      { te: "బతుకమ్మ", trans: "BATHUKAMMA", en: "Flower stack" },
    ],
    story: "💐 ఎందుకు జరుపుకుంటాం? (Why do we celebrate?)\n\nబతుకమ్మ is a beautiful తెలంగాణ పండుగ (Telangana festival)! The name means 'Mother, come alive!' — we celebrate గౌరీ దేవి (Goddess Gauri) and pray for మంచి ఆరోగ్యం (good health) and సంతోషం (happiness).\n\n🌺 ఎలా జరుపుకుంటాం? (How do we celebrate?)\n\nWomen and girls collect seasonal పూలు (flowers) — especially bright yellow తంగేడు పూలు (marigolds) and pink గునుగు పూలు. They arrange the flowers in beautiful layers on a plate — this is the బతుకమ్మ!\n\nThen they gather together, place the బతుకమ్మ in the center, sing పాటలు (songs), and dance around it in circles — clapping and singing! At the end, they float the flower arrangement in a చెరువు (pond). It's absolutely gorgeous! 🌊",
  },
  {
    id: "dussehra",
    name: { te: "దసరా", en: "Dussehra/Vijayadashami" },
    month: 10,
    emoji: "🏆",
    greeting: { te: "దసరా శుభాకాంక్షలు!", trans: "DASARA SHUBHAAKANKSHALU!", en: "Happy Dussehra!" },
    vocabulary: [
      { te: "బొమ్మల కొలువు", trans: "BOMMALA KOLUVU", en: "Doll display/arrangement" },
      { te: "విజయదశమి", trans: "VIJAYADASHAMI", en: "Victory on the 10th day" },
      { te: "సరస్వతి పూజ", trans: "SARASWATHI POOJA", en: "Worship of Goddess Saraswathi" },
    ],
    story: "🏆 ఎందుకు జరుపుకుంటాం? (Why do we celebrate?)\n\nదసరా celebrates మంచి యొక్క విజయం (victory of good over evil)! విజయదశమి means 'victory on the 10th day' — the day రాముడు (Lord Rama) defeated రావణుడు (Ravana). It also marks the end of నవరాత్రులు (9 nights of worship).\n\n🎎 ఎలా జరుపుకుంటాం? (How do we celebrate?)\n\n• బొమ్మల కొలువు: We arrange beautiful బొమ్మలు (dolls) and figurines on మెట్లు (steps) — gods, animals, villages! Friends and family visit each other's displays.\n• సరస్వతి పూజ: We worship పుస్తకాలు (books), వాద్యాలు (musical instruments), and పనిముట్లు (tools) to honor the goddess of విద్య (knowledge).\n• జమ్మి చెట్టు: Families exchange జమ్మి ఆకులు (shammi leaves) as a sign of బంగారం (gold) and good wishes! 🍃",
  },
  {
    id: "deepavali",
    name: { te: "దీపావళి", en: "Diwali/Deepavali" },
    month: 11,
    emoji: "🪔",
    greeting: { te: "దీపావళి శుభాకాంక్షలు!", trans: "DEEPAVALI SHUBHAAKANKSHALU!", en: "Happy Diwali!" },
    vocabulary: [
      { te: "దీపాలు", trans: "DEEPAALU", en: "Lamps" },
      { te: "టపాసులు", trans: "TAPAASULU", en: "Firecrackers" },
      { te: "మిఠాయిలు", trans: "MITAAYILU", en: "Sweets" },
      { te: "లక్ష్మీ పూజ", trans: "LAKSHMI POOJA", en: "Worship of Goddess Lakshmi" },
    ],
    story: "🪔 ఎందుకు జరుపుకుంటాం? (Why do we celebrate?)\n\nదీపావళి is the వెలుగుల పండుగ (festival of lights)! We celebrate the victory of వెలుగు (light) over చీకటి (darkness), and మంచి (good) over చెడు (evil). The story says that శ్రీకృష్ణుడు (Lord Krishna) defeated the demon నరకాసురుడు (Narakasura) on this day.\n\n✨ ఎలా జరుపుకుంటాం? (How do we celebrate?)\n\nWe wake up at తెల్లవారుజామున (early dawn) and take an అభ్యంగన స్నానం (oil bath) — this is very special! Then:\n• దీపాలు: We light rows of beautiful నూనె దీపాలు (oil lamps) everywhere — inside and outside the house.\n• మిఠాయిలు: Families make and share sweet treats like లడ్డూలు (laddus) and చక్కలాలు (chakkalas).\n• టపాసులు: Kids light colorful crackers — మతాబాలు (sparklers) are the most fun!\n• లక్ష్మీ పూజ: We welcome Goddess లక్ష్మీ (Lakshmi) — the goddess of సంపద (wealth) — into our homes. 🏠",
  },
];
