# BACKEND

Let's generate the remaining questions for the Sound and Rockets buildings as per your request. We'll include educational story blurbs, math questions, multiple-choice options, and correct answers.

---

### Questions for Sound (53-57)

**Sound Questions (53-57):**

```javascript
  // ========================================
  // 🔊 MUSIC ROOM — Sound & Pitch (53-57)
  // ========================================
  {
    id: 53,
    building: "sound",
    difficulty: "easy",
    story: "Sound travels in waves. High-pitched sounds have waves close together, while low-pitched sounds have waves spread apart.",
    question: "If a high note has 800 waves per second and a low note has 200, how many more waves does the high note have?",
    options: ["600", "400", "1000", "200"],
    answer: "600"
  },
  {
    id: 54,
    building: "sound",
    difficulty: "easy",
    story: "The speed of sound in air is about 343 meters per second. That's why you hear thunder after you see lightning!",
    question: "If sound travels 343 meters per second, how far does it travel in 5 seconds?",
    options: ["1,715 meters", "686 meters", "343 meters", "2,000 meters"],
    answer: "1,715 meters"
  },
  {
    id: 55,
    building: "sound",
    difficulty: "medium",
    story: "A guitar string vibrates to create sound. Tighter strings vibrate faster and produce higher pitches.",
    question: "If a guitar string vibrates 440 times per second to produce the note A, how many times does it vibrate in 3 seconds?",
    options: ["1,320", "440", "880", "1,100"],
    answer: "1,320"
  },
  {
    id: 56,
    building: "sound",
    difficulty: "medium",
    story: "The human ear can detect frequencies from 20 Hz to 20,000 Hz.",
    question: "If a dog whistle emits sound at 25,000 Hz, how many Hz above human hearing is it?",
    options: ["5,000 Hz", "10,000 Hz", "15,000 Hz", "20,000 Hz"],
    answer: "5,000 Hz"
  },
  {
    id: 57,
    building: "sound",
    difficulty: "hard",
    story: "In a concert hall, sound waves reflect off walls to create echoes.",
    question: "If an echo returns in 2 seconds and sound travels at 343 meters per second, how far away is the wall that reflected the sound?",
    options: ["343 meters", "686 meters", "1,029 meters", "1,372 meters"],
    answer: "343 meters"
  },
```

### Questions for Rockets (58-60)

**Rockets Questions (58-60):**

```javascript
  // ========================================
  // 🚀 SPACE CENTER — Rockets (58-60)
  // ========================================
  {
    id: 58,
    building: "rockets",
    difficulty: "easy",
    story: "Rockets burn fuel to create thrust and lift off the ground. The more fuel, the more thrust!",
    question: "If a rocket uses 15 tons of fuel per minute and burns for 4 minutes, how much fuel does it use?",
    options: ["60 tons", "45 tons", "15 tons", "30 tons"],
    answer: "60 tons"
  },
  {
    id: 59,
    building: "rockets",
    difficulty: "medium",
    story: "A rocket's speed is measured in kilometers per hour (kph). Some rockets travel faster than 28,000 kph!",
    question: "If a rocket travels 28,000 kph, how far does it travel in 3 hours?",
    options: ["84,000 km", "56,000 km", "28,000 km", "112,000 km"],
    answer: "84,000 km"
  },
  {
    id: 60,
    building: "rockets",
    difficulty: "hard",
    story: "The thrust-to-weight ratio determines how fast a rocket can accelerate.",
    question: "If a rocket weighs 1,000 tons and produces 5,000 tons of thrust, what is its thrust-to-weight ratio?",
    options: ["5:1", "1:5", "10:1", "1:10"],
    answer: "5:1"
  },
```

---

### Execution Plan

Let's create the full file with questions 23 through 60 now.

---

**File Path:** `~/projects/school-builder/src/data/mathQuestions_23_60.js`

```javascript
export const mathQuestions = [
  // ========================================
  // 🔭 OBSERVATORY — Stars (23-27)
  // ========================================
  {
    id: 23,
    building: "stars",
    difficulty: "easy",
    story: "Stars appear to twinkle because their light passes through Earth's atmosphere, which is constantly moving.",
    question: "If you observe 10 stars and 4 twinkle, how many do not twinkle?",
    options: ["4", "10", "6", "14"],
    answer: "6"
  },
  {
    id: 24,
    building: "stars",
    difficulty: "medium",
    story: "A light-year is the distance light travels in one year, about 5.88 trillion miles.",
    question: "If a star is 4 light-years away, how many trillion miles away is it?",
    options: ["23.52", "11.76", "17.64", "5.88"],
    answer: "23.52"
  },
  {
    id: 25,
    building: "stars",
    difficulty: "hard",
    story: "Our galaxy, the Milky Way, contains an estimated 100 billion stars.",
    question: "If 1 in every 10,000 stars has a solar system, how many solar systems are there?",
    options: ["10 million", "1 million", "100,000", "10,000"],
    answer: "10 million"
  },
  {
    id: 26,
    building: "stars",
    difficulty: "easy",
    story: "The nearest star to Earth is the Sun. It provides the light and heat necessary to sustain life.",
    question: "If the Sun is 93 million miles away and light travels at 186,000 miles per second, how many seconds does it take light to reach Earth?",
    options: ["500", "600", "700", "800"],
    answer: "500"
  },
  {
    id: 27,
    building: "stars",
    difficulty: "medium",
    story: "A star's brightness is determined by its size and distance from Earth.",
    question: "If Star A is twice as far from Earth as Star B, and they have the same size, how much dimmer is Star A?",
    options: ["Twice as dim", "Half as dim", "Four times as dim", "The same brightness"],
    answer: "Four times as dim"
  },

  // ========================================
  // ⚡ POWER STATION — Lightning (28-32)
  // ========================================
  {
    id: 28,
    building: "lightning",
    difficulty: "easy",
    story: "Lightning is a giant spark of electricity in the atmosphere between clouds, the air, or the ground.",
    question: "If a storm produces 30 lightning strikes in one hour, how many strikes occur every 10 minutes?",
    options: ["3", "10", "5", "15"],
    answer: "5"
  },
  {
    id: 29,
    building: "lightning",
    difficulty: "medium",
    story: "Lightning can heat the air around it to 30,000 degrees Celsius, five times hotter than the sun's surface.",
    question: "If the sun's surface is about 6,000 degrees Celsius, how much hotter is lightning?",
    options: ["18,000", "24,000", "30,000", "36,000"],
    answer: "24,000"
  },
  {
    id: 30,
    building: "lightning",
    difficulty: "hard",
    story: "On average, the Earth is struck by lightning 100 times per second.",
    question: "How many times is the Earth struck by lightning in a minute?",
    options: ["600", "3,000", "6,000", "1,000"],
    answer: "6,000"
  },
  {
    id: 31,
    building: "lightning",
    difficulty: "easy",
    story: "Lightning occurs when positive and negative charges in the atmosphere build up and create a spark.",
    question: "If the atmosphere has 40 positive charges and 10 negative charges, how many more positive charges are there?",
    options: ["30", "10", "50", "40"],
    answer: "30"
  },
  {
    id: 32,
    building: "lightning",
    difficulty: "medium",
    story: "Lightning rods are used to protect buildings by directing lightning to the ground.",
    question: "If a lightning rod is 30 meters tall and a building is 50 meters tall, how much taller is the building than the rod?",
    options: ["20 meters", "10 meters", "5 meters", "25 meters"],
    answer: "20 meters"
  },

  // ========================================
  // 🦴 MUSEUM — Bones Healing (33-37)
  // ========================================
  {
    id: 33,
    building: "bones",
    difficulty: "easy",
    story: "Bones are living tissues that constantly rebuild themselves.",
    question: "If a human skeleton has 206 bones and you lose 2 in an accident, how many remain?",
    options: ["204", "206", "208", "202"],
    answer: "204"
  },
  {
    id: 34,
    building: "bones",
    difficulty: "medium",
    story: "The human body replaces about 10% of its bone mass each year.",
    question: "If your body replaces 10% of its bone mass every year, how much is replaced in 3 years?",
    options: ["10%", "20%", "30%", "40%"],
    answer: "30%"
  },
  {
    id: 35,
    building: "bones",
    difficulty: "hard",
    story: "The femur is the longest and strongest bone in the body.",
    question: "If the femur can withstand 2,000 pounds of pressure, how much pressure can two femurs withstand together?",
    options: ["4,000", "2,000", "6,000", "8,000"],
    answer: "4,000"
  },
  {
    id: 36,
    building: "bones",
    difficulty: "easy",
    story: "Babies are born with about 300 bones, but adults have 206. This is because some bones fuse together as you grow.",
    question: "How many bones fuse together as you grow from a baby to an adult?",
    options: ["100", "94", "206", "300"],
    answer: "94"
  },
  {
    id: 37,
    building: "bones",
    difficulty: "medium",
    story: "Calcium is essential for strong bones. The average adult needs about 1,000 mg of calcium per day.",
    question: "If you consume 250 mg of calcium in one meal, how many meals would you need to meet the daily requirement?",
    options: ["2", "3", "4", "5"],
    answer: "4"
  },

  // ========================================
  // 🌈 ART STUDIO — Rainbows (38-42)
  // ========================================
  {
    id: 38,
    building: "rainbows",
    difficulty: "easy",
    story: "Rainbows are formed by the reflection, refraction, and dispersion of light in water droplets.",
    question: "If a rainbow has 7 colors, how many colors do 3 rainbows have in total?",
    options: ["21", "14", "7", "10"],
    answer: "21"
  },
  {
    id: 39,
    building: "rainbows",
    difficulty: "medium",
    story: "Rainbows are always opposite the sun.",
    question: "If the sun is in the east, where would you look to find a rainbow?",
    options: ["North", "South", "West", "East"],
    answer: "West"
  },
  {
    id: 40,
    building: "rainbows",
    difficulty: "hard",
    story: "A double rainbow occurs when light is reflected twice inside a raindrop.",
    question: "If each reflection adds 7 colors, how many colors are in a double rainbow?",
    options: ["7", "14", "21", "28"],
    answer: "14"
  },
  {
    id: 41,
    building: "rainbows",
    difficulty: "easy",
    story: "Rainbows can only be seen in the morning or late afternoon when the sun is low in the sky.",
    question: "If you see a rainbow at 8 AM and another at 5 PM, how many hours apart are the two rainbows?",
    options: ["9", "7", "8", "10"],
    answer: "9"
  },
  {
    id: 42,
    building: "rainbows",
    difficulty: "medium",
    story: "The angle of a rainbow is usually 42 degrees. This is why rainbows are always in a circle.",
    question: "If a rainbow forms at 42 degrees and you turn 180 degrees, how many degrees do you still need to turn to face the rainbow again?",
    options: ["138", "42", "180", "90"],
    answer: "138"
  },

  // ========================================
  // 🧊 CAFETERIA — Melting (43-47)
  // ========================================
  {
    id: 43,
    building: "melting",
    difficulty: "easy",
    story: "Ice cream melts when heat from the air moves into the ice cream.",
    question: "If ice cream melts at a rate of 2 inches per hour, how many inches melt in 3 hours?",
    options: ["2", "3", "6", "9"],
    answer: "6"
  },
  {
    id: 44,
    building: "melting",
    difficulty: "medium",
    story: "Salt lowers the freezing point of water, causing ice to melt at a lower temperature.",
    question: "If the freezing point is 0°C and salt lowers it by 5°C, what is the new freezing point?",
    options: ["-5°C", "0°C", "5°C", "-10°C"],
    answer: "-5°C"
  },
  {
    id: 45,
    building: "melting",
    difficulty: "hard",
    story: "The rate at which ice melts depends on the surface area exposed to the air.",
    question: "If an ice block melts at 1 inch per hour with 10 square inches exposed, how many inches in 5 hours?",
    options: ["5", "10", "15", "20"],
    answer: "5"
  },
  {
    id: 46,
    building: "melting",
    difficulty: "easy",
    story: "Chocolate melts at about 30°C, which is a little below body temperature.",
    question: "If chocolate starts melting at 30°C and the room is 25°C, how many degrees warmer does the room need to be for chocolate to melt?",
    options: ["5°C", "10°C", "0°C", "15°C"],
    answer: "5°C"
  },
  {
    id: 47,
    building: "melting",
    difficulty: "medium",
    story: "Ice cubes can melt faster in metal cups than in plastic cups because metal conducts heat better.",
    question: "If an ice cube melts in 10 minutes in a metal cup and 15 minutes in a plastic cup, how many minutes faster does it melt in the metal cup?",
    options: ["5", "10", "15", "20"],
    answer: "5"
  },

  // ========================================
  // 🌪️ WEATHER STATION — Tornadoes (48-52)
  // ========================================
  {
    id: 48,
    building: "tornadoes",
    difficulty: "easy",
    story: "Tornadoes form from severe thunderstorms in warm, moist air.",
    question: "If there are 5 tornadoes in one day, how many tornadoes occur in a week?",
    options: ["5", "10", "35", "25"],
    answer: "35"
  },
  {
    id: 49,
    building: "tornadoes",
    difficulty: "medium",
    story: "The Enhanced Fujita scale rates tornadoes from EF0 to EF5 based on damage.",
    question: "If an EF5 tornado is 5 times stronger than an EF1, how much stronger is it than an EF3?",
    options: ["2 times", "3 times", "5 times", "10 times"],
    answer: "2 times"
  },
  {
    id: 50,
    building: "tornadoes",
    difficulty: "hard",
    story: "Tornadoes can have wind speeds exceeding 300 mph.",
    question: "If a tornado's winds increase from 200 mph to 300 mph, what is the percentage increase?",
    options: ["25%", "33%", "50%", "67%"],
    answer: "50%"
  },
  {
    id: 51,
    building: "tornadoes",
    difficulty: "easy",
    story: "Tornadoes are usually accompanied by hail and heavy rain.",
    question: "If a tornado lasts 15 minutes and it rains for 30 minutes, how many more minutes does it rain than the tornado lasts?",
    options: ["15", "30", "45", "60"],
    answer: "15"
  },
  {
    id: 52,
    building: "tornadoes",
    difficulty: "medium",
    story: "The United States experiences more tornadoes than anywhere else in the world.",
    question: "If the US has 1,200 tornadoes a year and Europe has 300, how many more tornadoes does the US have?",
    options: ["900", "1,200", "300", "1,500"],
    answer: "900"
  },

  // ========================================
  // 🔊 MUSIC ROOM — Sound & Pitch (53-57)
  // ========================================
  {
    id: 53,
    building: "sound",
    difficulty: "easy",
    story: "Sound travels in waves. High-pitched sounds have waves close together, while low-pitched sounds have waves spread apart.",
    question: "If a high note has 800 waves per second and a low note has 200, how many more waves does the high