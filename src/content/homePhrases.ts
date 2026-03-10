export interface HomePhrase {
  te: string;
  trans: string;
  en: string;
  situation: string;
}

export const HOME_PHRASES: Record<string, HomePhrase[]> = {
  vowels: [
    { te: "అమ్మా, ఇది ఏమిటి?", trans: "AMMAA, IDI EMITI?", en: "Mom, what is this?", situation: "Point at objects around the house" },
    { te: "నాకు ఆకలి వేస్తోంది", trans: "NAAKU AAKALI VESTHONDI", en: "I'm hungry", situation: "Before meals" },
    { te: "థాంక్ యూ అమ్మా", trans: "THANK YOU AMMAA", en: "Thank you Mom", situation: "After receiving something" },
    { te: "నేను ఆడుకుంటాను", trans: "NENU AADUKUNTAANU", en: "I'll play", situation: "After homework" },
    { te: "శుభ రాత్రి", trans: "SHUBHA RAATHRI", en: "Good night", situation: "At bedtime" },
  ],
  consonants: [
    { te: "నాన్నా, ఎక్కడికి వెళ్తున్నావు?", trans: "NAANNAA, EKKADIKI VELTHUNNAAVU?", en: "Dad, where are you going?", situation: "When dad leaves" },
    { te: "ఈ రోజు స్కూల్ బాగుంది", trans: "EE ROJU SCHOOL BAAGUNDI", en: "School was good today", situation: "After school" },
    { te: "నీళ్ళు కావాలి", trans: "NEELLU KAAVAALI", en: "I want water", situation: "When thirsty" },
    { te: "నేను రెడీ", trans: "NENU READY", en: "I'm ready", situation: "Getting dressed" },
    { te: "మళ్ళీ చెప్పు", trans: "MALLEE CHEPPU", en: "Say it again", situation: "When learning new words" },
  ],
  words: [
    { te: "ఇది ఎర్రగా ఉంది", trans: "IDI ERRAGAA UNDI", en: "This is red", situation: "Point at colors" },
    { te: "కుక్క ఎక్కడ?", trans: "KUKKA EKKADA?", en: "Where's the dog?", situation: "Playing with pets" },
    { te: "నాకు అన్నం పెట్టు", trans: "NAAKU ANNAM PETTU", en: "Serve me rice", situation: "At dinner" },
    { te: "ఒకటి, రెండు, మూడు", trans: "OKATI, RENDU, MOODU", en: "One, two, three", situation: "Counting anything" },
    { te: "బయట వర్షం వస్తోంది", trans: "BAYATA VARSHAM VASTHONDI", en: "It's raining outside", situation: "Weather talk" },
  ],
  sentences: [
    { te: "అమ్మా, ఈ రోజు ఏం వండావు?", trans: "AMMAA, EE ROJU EM VANDAAVU?", en: "Mom, what did you cook today?", situation: "Coming home" },
    { te: "నేను తెలుగు నేర్చుకుంటున్నాను!", trans: "NENU TELUGU NERCHUKUNTUNNAANU!", en: "I'm learning Telugu!", situation: "Proudly tell anyone!" },
    { te: "అమ్మమ్మ ఎప్పుడు వస్తుంది?", trans: "AMMAMMA EPPUDU VASTHUNDI?", en: "When is grandma coming?", situation: "Missing grandparents" },
    { te: "దయచేసి ఇవ్వు", trans: "DAYACHESI IVVU", en: "Please give me", situation: "Asking politely" },
    { te: "నేను హెల్ప్ చేస్తాను", trans: "NENU HELP CHESTHAANU", en: "I'll help", situation: "Offering to help" },
  ],
};
