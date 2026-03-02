const remainingAssets = [
  // Anchor Words (Vowels)
  {
    imageName: "ii",
    prompt: "Warm Indian Picture Book style, Bapu art influence. Cute cartoon housefly (adorable, not gross). Big sparkly compound jewel eyes, tiny transparent wings with rainbow shimmer, chubby body. Buzzing happily. Warm earthy colors (Turmeric gold, Mango green, Terra cotta, Kolam blue). Clean edges, isolated subject, transparent-like clean background."
  },
  {
    imageName: "u",
    prompt: "Warm Indian Picture Book style, Bapu art influence. Beautiful traditional Indian gold ring with a large red stone (temple jewelry style). Intricate gold filigree work. Sparkle effects. Sitting on a small red velvet cushion. Warm earthy colors (Turmeric gold, Mango green, Terra cotta, Kolam blue). Clean edges, isolated subject, transparent-like clean background."
  },
  {
    imageName: "uu",
    prompt: "Warm Indian Picture Book style, Bapu art influence. Colorful wooden swing (oonjal/jhoola) hanging from a big mango tree with thick leaves. Flower garlands wrapped around ropes. Happy child sitting on swing mid-air. Bright blue sky background. Warm earthy colors (Turmeric gold, Mango green, Terra cotta, Kolam blue). Clean edges, isolated subject, transparent-like clean background."
  },
  {
    imageName: "ru",
    prompt: "Warm Indian Picture Book style, Bapu art influence. Friendly cartoon sage/rishi sitting cross-legged under a large banyan tree. Orange/saffron robes, white beard, kind eyes, gentle smile (like a kind grandpa). Small fire (havan) nearby. Peaceful forest background. Warm earthy colors (Turmeric gold, Mango green, Terra cotta, Kolam blue). Clean edges, isolated subject, transparent-like clean background."
  },
  {
    imageName: "roo",
    prompt: "Warm Indian Picture Book style, Bapu art influence. Bright green grass patch swaying gently in the wind. Tiny wildflowers (yellow, pink, white) scattered. Colorful butterfly and a ladybug visible. Soft morning light, simple but beautiful. Warm earthy colors (Turmeric gold, Mango green, Terra cotta, Kolam blue). Clean edges, isolated subject, transparent-like clean background."
  },
  {
    imageName: "e",
    prompt: "Warm Indian Picture Book style, Bapu art influence. Cute cartoon mouse with big round ears, bright eyes, long curled tail. Brown fur. Sitting up on hind legs, holding and nibbling a piece of murukku (Indian spiral snack). Wearing a tiny red pottu on forehead. Warm earthy colors (Turmeric gold, Mango green, Terra cotta, Kolam blue). Clean edges, isolated subject, transparent-like clean background."
  },
  {
    imageName: "ee",
    prompt: "Warm Indian Picture Book style, Bapu art influence. Decorated Indian temple elephant — colorful nettipattam (gold forehead plate), painted trunk, silk caparison (body cloth) with mirror work. Trunk curled up in blessing pose. Warm earthy colors (Turmeric gold, Mango green, Terra cotta, Kolam blue). Clean edges, isolated subject, transparent-like clean background."
  },
  {
    imageName: "ai",
    prompt: "Warm Indian Picture Book style, Bapu art influence. Triple-scoop ice cream cone — scoops in mango orange, pista green, and strawberry pink (Indian flavors!). Waffle cone with sprinkles. One scoop slightly melting. Bright, cheerful. Warm earthy colors (Turmeric gold, Mango green, Terra cotta, Kolam blue). Clean edges, isolated subject, transparent-like clean background."
  },
  {
    imageName: "o",
    prompt: "Warm Indian Picture Book style, Bapu art influence. Friendly cartoon camel with a big goofy smile, long eyelashes. Decorated with colorful Rajasthani textiles — mirror work saddle blanket, tassels, bells. Desert sand and a small cactus in background. Warm sunset colors. Clean edges, isolated subject, transparent-like clean background."
  },
  {
    imageName: "oo",
    prompt: "Warm Indian Picture Book style, Bapu art influence. Colorful traditional Indian fishing boat (like a Kerala vallam) on bright blue water. Painted hull in red, yellow, blue. Small sail with simple pattern. Seagulls. Fisherman waving from the boat. Warm earthy colors (Turmeric gold, Mango green, Terra cotta, Kolam blue). Clean edges, isolated subject, transparent-like clean background."
  },
  {
    imageName: "au",
    prompt: "Warm Indian Picture Book style, Bapu art influence. Ayurvedic theme: Stone mortar and pestle with green herbs being ground. Small brass bottles of oils. Tulasi leaves, neem leaves, turmeric root arranged attractively. Friendly plant with cartoon eyes growing from clay pot. Warm earthy colors (Turmeric gold, Mango green, Terra cotta, Kolam blue). Clean edges, isolated subject, transparent-like clean background."
  },
  {
    imageName: "am",
    prompt: "Warm Indian Picture Book style, Bapu art influence. Vibrant Indian street shop/kirana store with bright yellow/red striped awning. Shelves filled with colorful items — glass jars of candy, stacks of biscuit packets, hanging banana bunches, bags of rice. Friendly shopkeeper waving. Small weighing scale. Warm earthy colors. Clean edges, isolated subject, transparent-like clean background."
  },
  {
    imageName: "aha",
    prompt: "Warm Indian Picture Book style, Bapu art influence. A small child sitting on the ground, one tear on cheek, looking at a dropped ice cream cone on the ground. A baby tortoise (Chintu) gently patting the child's back offering comfort. Bittersweet gentle emotion. Warm earthy colors. Clean edges, isolated subject, transparent-like clean background."
  },

  // Village World Backgrounds (Landscape Banner format 1200x400)
  {
    imageName: "village_vowels",
    prompt: "Warm Indian Picture Book style, Bapu art influence. Landscape banner format. Lush garden scene: mango trees, jasmine creepers, lotus pond, kolam patterns on pathways, butterflies, sunflowers. Warm saffron and green palette. Peaceful morning light."
  },
  {
    imageName: "village_consonants",
    prompt: "Warm Indian Picture Book style, Bapu art influence. Landscape banner format. Ancient Indian fort (Golconda style): Stone walls with carved pillars, red/saffron banners, torch sconces, decorated elephant at gate, carved Telugu letters in stone. Amber/warm stone palette."
  },
  {
    imageName: "village_guninthalu",
    prompt: "Warm Indian Picture Book style, Bapu art influence. Landscape banner format. Enchanted forest: Glowing mushrooms, fireflies, a magical peacock with sparkling tail, twisted ancient trees with Telugu letter-shaped leaves. Purple/teal/gold sparkle palette."
  },
  {
    imageName: "village_words",
    prompt: "Warm Indian Picture Book style, Bapu art influence. Landscape banner format. Bustling village market: Colorful cloth awnings, fruit stalls (mangoes, bananas), bangle shop, flower seller, auto-rickshaw parked nearby. Bright red/orange/yellow palette."
  },
  {
    imageName: "village_sentences",
    prompt: "Warm Indian Picture Book style, Bapu art influence. Landscape banner format. Peaceful river path: Bullock cart on a dirt road, paddy fields in background, a village bridge over a gentle river, herons standing in water, a rainbow. Calm blue/green/golden palette."
  },
  {
    imageName: "village_stories",
    prompt: "Warm Indian Picture Book style, Bapu art influence. Landscape banner format. South Indian temple: Ornate gopuram (tower) with colorful sculptures, brass oil lamps, carved story panels on walls, temple garden with tulasi. Deep red/gold/white marble palette."
  }
];

// Instructions for Antigravity: 
// When the quota is reset, run through the remainingAssets array, and call the default_api:generate_image tool for each. Let's make sure to rename files and move them appropriately as well.
console.log("This is a reference file containing the exact prompts needed for later generation.")
