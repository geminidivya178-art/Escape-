import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
const isRealKey = apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "";

let ai: GoogleGenAI | null = null;
if (isRealKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Pre-seeded fallback escapes to ensure zero-crash robustness
const fallbacks: Record<string, any> = {
  "budget-adventure": {
    destination: "Hanoi & Ha Long Bay",
    country: "Vietnam",
    tagline: "Sip Egg Coffee, Explore Emerald Bays, and Ride on Two Wheels",
    whyThisDestination: "Hanoi offers a sensory-rich backpacker haven with unbelievably delicious street food, bustling old quarter streets, and affordable excursions. Moving into Ha Long Bay delivers dramatic limestone pillars rising from the water, all within an accessible budget.",
    bestTimeToGo: "October to April (cool, dry season)",
    packingList: [
      "Lightweight raincoat for unexpected showers",
      "Comfortable walking shoes for exploring busy alleys",
      "Stomach-soothing meds for culinary adventures",
      "Universal travel adapter",
      "Compact dry-bag for boating in Ha Long Bay"
    ],
    costEstimates: {
      flights: "$500 - $750 (regional/international)",
      accommodation: "$15 - $30 per night (hostels or cozy homestays)",
      dailyFoodActivity: "$20 - $35 per day",
      totalEstimated: "$650 - $950"
    },
    itinerary: [
      {
        dayNumber: 1,
        title: "French Quarter Charms & Street Food Tour",
        morning: {
          activity: "Wander around Hoan Kiem Lake",
          description: "Start your morning with a stroll around the misty lake, visiting Ngoc Son Temple located on a small island. Grab a traditional Vietnamese iced coffee (Ca Phe Sua Da) at a lakeside cafe."
        },
        afternoon: {
          activity: "Explore Hanoi's Train Street & Old Quarter",
          description: "Stroll through the narrow 36 Streets of the Old Quarter, then watch the local train pass incredibly close to residential buildings while sipping local egg coffee."
        },
        evening: {
          activity: "Street Food Walking Feast",
          description: "Join a local guide to try Bun Cha (grilled pork with noodles), Banh Mi, and fresh spring rolls in lively night markets."
        },
        meals: {
          breakfast: "Pho Bo at a roadside stand",
          lunch: "Banh Mi 25 in the Old Quarter",
          dinner: "Bun Cha Huong Lien (Obama's choice)"
        },
        dayBudget: "$15"
      },
      {
        dayNumber: 2,
        title: "Cruise on Ha Long Bay",
        morning: {
          activity: "Transfer to Ha Long Bay Port",
          description: "Board a traditional wooden junk boat and cruise into the legendary emerald waters filled with towering limestone karsts."
        },
        afternoon: {
          activity: "Kayaking & Cave Exploring",
          description: "Paddle through hidden lagoons and hike up into the massive Sung Sot (Surprise) Cave with its spectacular stalactites."
        },
        evening: {
          activity: "Sunset on Deck & Squid Fishing",
          description: "Watch a gorgeous sunset over the bay, enjoy a multi-course Vietnamese seafood dinner, and try night squid fishing with the crew."
        },
        meals: {
          breakfast: "Honeydew melon and sticky rice",
          lunch: "Freshly prepared seafood buffet on board",
          dinner: "Vietnamese grilled meats and fish on the cruise"
        },
        dayBudget: "$45"
      },
      {
        dayNumber: 3,
        title: "Hanoi's Culture & Water Puppet Show",
        morning: {
          activity: "Visit Temple of Literature",
          description: "Explore Vietnam's first imperial university built in 1070, filled with quiet courtyards and ancient turtle steles."
        },
        afternoon: {
          activity: "Museum of Ethnology",
          description: "Check out the fascinating indoor and outdoor exhibits representing Vietnam's 54 official ethnic groups, complete with replica houses."
        },
        evening: {
          activity: "Thang Long Water Puppet Show & Bia Hoi Craft Beer",
          description: "Enjoy a traditional water puppet performance accompanied by a live orchestra, then head to Ta Hien Street for 50-cent draught beer."
        },
        meals: {
          breakfast: "Sticky rice with mung beans (Xoi Xeo)",
          lunch: "Bun Ca (fish noodle soup)",
          dinner: "Hot pot at Ta Hien corner"
        },
        dayBudget: "$20"
      }
    ],
    localPhrases: [
      { phrase: "Xin chào", translation: "Hello", pronunciation: "Sin chow" },
      { phrase: "Cảm ơn", translation: "Thank you", pronunciation: "Kam on" },
      { phrase: "Bao nhiêu?", translation: "How much?", pronunciation: "Bow nyew?" }
    ]
  },
  "mid-range-culture": {
    destination: "Kyoto",
    country: "Japan",
    tagline: "Walk Through Vermilion Gates, Drink Matcha, and Discover Ancient Zen",
    whyThisDestination: "Kyoto represents the cultural heart of Japan, boasting thousands of temples, bamboo groves, and traditional wooden tea houses. A moderate budget allows you to enjoy excellent ryokan stays, participate in a tea ceremony, and taste delicate seasonal cuisine.",
    bestTimeToGo: "April (Cherry Blossoms) or November (Autumn Foliage)",
    packingList: [
      "Slip-on shoes for frequent temple visits",
      "A notebook for collecting wooden temple stamps (Shuin)",
      "Cash (many small local noodle shops are cash-only)",
      "Light layers for crisp evenings",
      "An empty water bottle to fill up at natural spring shrines"
    ],
    costEstimates: {
      flights: "$700 - $1100",
      accommodation: "$80 - $140 per night (boutique hotels or traditional Machiya)",
      dailyFoodActivity: "$45 - $75 per day",
      totalEstimated: "$1200 - $1800"
    },
    itinerary: [
      {
        dayNumber: 1,
        title: "The Iconic Torii Gates & Historic Gion",
        morning: {
          activity: "Early morning hike at Fushimi Inari-Taisha",
          description: "Beat the crowds by hiking up through the thousands of vermilion Shinto shrine gates that line the sacred forest paths of Mount Inari."
        },
        afternoon: {
          activity: "Wander Gion & Yasaka Pagoda",
          description: "Walk past the beautifully preserved wooden merchant houses of Hanamikoji Street. Keep an eye out for Geishas walking gracefully to appointments."
        },
        evening: {
          activity: "Pontocho Alley Izakaya Hop",
          description: "Stroll down Pontocho, a narrow stone alleyway lit by paper lanterns, and enjoy local grilled skewers (Yakitori) and craft sake."
        },
        meals: {
          breakfast: "Matcha croissant from local bakery",
          lunch: "Kitsune Udon noodle bowl near Inari",
          dinner: "Yakitori and local side dishes at an Izakaya"
        },
        dayBudget: "$40"
      },
      {
        dayNumber: 2,
        title: "Golden Zen & Bamboo Whispers",
        morning: {
          activity: "Visit Kinkaku-ji (Golden Pavilion)",
          description: "Marvel at the top two floors of this stunning temple covered in gold leaf, reflecting beautifully on the surrounding mirror pond."
        },
        afternoon: {
          activity: "Arashiyama Bamboo Grove & Monkey Park",
          description: "Walk through the towering green bamboo stalks that rustle with the breeze, then hike up to see free-roaming macaque monkeys at Iwatayama."
        },
        evening: {
          activity: "Kamo River Riverside Stroll",
          description: "Dine on wooden platforms ('yuka') elevated over the refreshing water of the Kamo River, a classic summer/autumn tradition."
        },
        meals: {
          breakfast: "Onigiri rice balls from 7-Eleven (surprisingly gourmet!)",
          lunch: "Handmade Soba noodles in Arashiyama",
          dinner: "Traditional Kyoto Tofu banquet (Yudofu)"
        },
        dayBudget: "$55"
      },
      {
        dayNumber: 3,
        title: "Tea Ceremonies & Silver Pavilions",
        morning: {
          activity: "Philosopher's Path & Ginkaku-ji",
          description: "Stroll along a quiet stone path lined with cherry trees and canals, leading to the elegant Zen temple Ginkaku-ji (Silver Pavilion)."
        },
        afternoon: {
          activity: "Traditional Matcha Tea Ceremony",
          description: "Participate in a private, guided tea ceremony in a historic wooden teahouse. Learn the meditative art of whisking powdered green tea."
        },
        evening: {
          activity: "Panoramic view from Kiyomizu-dera",
          description: "Climb up the hill to Kyoto's famous wooden temple, standing on a massive veranda that offers sunset views over the entire city without a single nail used."
        },
        meals: {
          breakfast: "Japanese fluffy pancakes",
          lunch: "Kyoto style Ramen (dense chicken broth)",
          dinner: "Seasonal Tempura tasting menu"
        },
        dayBudget: "$50"
      }
    ],
    localPhrases: [
      { phrase: "Arigatou gozaimasu", translation: "Thank you very much", pronunciation: "Ah-ree-gah-toh go-zye-mas" },
      { phrase: "Sumimasen", translation: "Excuse me / Sorry", pronunciation: "Su-mee-mah-sen" },
      { phrase: "Kore wa ikura desu ka?", translation: "How much is this?", pronunciation: "Ko-reh wah ee-koo-rah des kah?" }
    ]
  },
  "luxury-nature": {
    destination: "Amalfi Coast",
    country: "Italy",
    tagline: "Dramatic Cliffs, Private Yachts, and Limoncello in Cliffside Villages",
    whyThisDestination: "The Amalfi Coast is a legendary masterpiece of nature and luxury. Dramatic mountains plunge directly into the deep blue Tyrrhenian Sea. A luxury tier unlocks breathtaking cliffside villa resorts, private boat charters to hidden caves, and Michelin-starred culinary journeys.",
    bestTimeToGo: "May to September (warm beach season)",
    packingList: [
      "Designer sunglasses and beachwear",
      "Grip shoes for steep cobbled streets",
      "Scented sunblock",
      "Linen shirts and elegant resort wear",
      "A light jacket for breezy yacht rides"
    ],
    costEstimates: {
      flights: "$1200 - $2200 (business or premium econ)",
      accommodation: "$350 - $800 per night (five-star cliffside suites)",
      dailyFoodActivity: "$150 - $300 per day",
      totalEstimated: "$3000 - $5500"
    },
    itinerary: [
      {
        dayNumber: 1,
        title: "Positano Magic & Sunset Cocktails",
        morning: {
          activity: "Arrival at Positano Luxury Resort",
          description: "Check into your breathtaking hotel built directly into the sheer cliffside. Sip a complimentary sparkling wine while gazing over the colorful cascading buildings."
        },
        afternoon: {
          activity: "Private Beach Club Lounge",
          description: "Descend by elevator through the rocks to a private beach club. Soak in the sun on comfortable sunbeds with direct ocean access and attentive towel service."
        },
        evening: {
          activity: "Sunset Dinner at a Michelin-Starred Balcony",
          description: "Indulge in a 5-course seafood tasting menu overlooking the glowing lights of Positano's vertical village."
        },
        meals: {
          breakfast: "Fresh pastries, local figs, and espresso on your terrace",
          lunch: "Fresh lobster pasta by the beach",
          dinner: "Gourmet lemon-infused culinary tasting"
        },
        dayBudget: "$250"
      },
      {
        dayNumber: 2,
        title: "Capri Private Yacht & Blue Grotto",
        morning: {
          activity: "Board Private Riva Yacht Charter",
          description: "Step aboard your private luxury yacht with a captain, departing for the mythical island of Capri. Zoom past rugged sea stacks (Faraglioni)."
        },
        afternoon: {
          activity: "Swim in Emerald Caves & Dine in Capri",
          description: "Dive into crystal-clear turquoise waters in secret coves. Stop in Anacapri for premium shopping and lunch under a canopy of giant lemon trees."
        },
        evening: {
          activity: "Piazza People-Watching & Limoncello Tasting",
          description: "Enjoy pre-dinner drinks in Capri's high-society 'Piazzetta' before cruising back to the mainland as dusk settles."
        },
        meals: {
          breakfast: "Buffet with local prosciutto and prosecco",
          lunch: "Caprese salad with buffalo mozzarella and freshly caught fish",
          dinner: "Candlelit dining overlooking the cliffs of Amalfi town"
        },
        dayBudget: "$450"
      },
      {
        dayNumber: 3,
        title: "Ravello Gardens & Path of the Gods",
        morning: {
          activity: "Explore Villa Cimbrone Gardens",
          description: "Drive up to the mountain village of Ravello. Walk through the romantic gardens of Villa Cimbrone to the 'Terrace of Infinity' for a view of the gulf."
        },
        afternoon: {
          activity: "Exclusive Helicopter Tour or Scenic Hike",
          description: "Take a stunning helicopter tour of the peninsula, or enjoy a guided private trek along the high-elevation Path of the Gods with a gourmet picnic."
        },
        evening: {
          activity: "Traditional Woodfired Feast & Music Festival",
          description: "Listen to live classical music at the open-air Ravello Festival, then enjoy wood-fired coastal delights paired with aged Italian wines."
        },
        meals: {
          breakfast: "Freshly squeezed blood orange juice and warm croissants",
          lunch: "Artisanal pasta with truffles and wild mushrooms",
          dinner: "Slow-roasted lamb and sea bass at a cliffside tavern"
        },
        dayBudget: "$200"
      }
    ],
    localPhrases: [
      { phrase: "Buongiorno", translation: "Good morning / Hello", pronunciation: "Bwon jor-no" },
      { phrase: "Grazie mille", translation: "Thank you very much", pronunciation: "Graht-zee-eh meel-leh" },
      { phrase: "Un limoncello, per favore", translation: "A limoncello, please", pronunciation: "Oon lee-mon-chel-lo, pehr fah-vo-reh" }
    ]
  }
};

// Main Endpoint: Generate escape suggestion and complete itinerary
app.post("/api/generate-escape", async (req, res) => {
  const { days, interests, budgetLevel } = req.body;

  const validDays = Math.min(Math.max(Number(days) || 3, 1), 14); // Clamp days between 1 and 14
  const activeInterests = Array.isArray(interests) && interests.length > 0 ? interests : ["adventure", "culture"];
  const budget = budgetLevel || "mid-range";

  // Create prompt
  const interestsStr = activeInterests.join(", ");
  const prompt = `Suggest a real-world surprise travel destination that is an absolute match for a vacation of ${validDays} days with a budget of "${budget}" and a strong focus on these interests: ${interestsStr}.
Generate a complete, practical, highly detailed, and culturally rich travel escape.
The output MUST be in the exact JSON format specified in the schema.
Ensure the cost estimates match a "${budget}" traveler tier in US Dollars.
The "itinerary" array must contain exactly ${validDays} items, representing each day from Day 1 to Day ${validDays}. Each day should contain highly contextual, non-generic descriptions of morning, afternoon, and evening activities, plus specific breakfast, lunch, and dinner recommendation names.`;

  if (ai) {
    try {
      console.log(`Calling Gemini API to suggest escape for: Days=${validDays}, Budget=${budget}, Interests=${interestsStr}`);
      
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an elite travel concierge. Suggest realistic, captivating travel destinations, create highly detailed day-by-day itineraries with morning/afternoon/evening plans, suggest precise dishes or dining locations, estimate realistic budgets, and recommend a curated packing list. Always output strictly valid JSON conforming exactly to the requested schema. Do not include markdown formatting like ```json in your response, just return the raw JSON.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              destination: { type: Type.STRING },
              country: { type: Type.STRING },
              tagline: { type: Type.STRING },
              whyThisDestination: { type: Type.STRING },
              bestTimeToGo: { type: Type.STRING },
              packingList: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              costEstimates: {
                type: Type.OBJECT,
                properties: {
                  flights: { type: Type.STRING },
                  accommodation: { type: Type.STRING },
                  dailyFoodActivity: { type: Type.STRING },
                  totalEstimated: { type: Type.STRING }
                },
                required: ["flights", "accommodation", "dailyFoodActivity", "totalEstimated"]
              },
              itinerary: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    dayNumber: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    morning: {
                      type: Type.OBJECT,
                      properties: {
                        activity: { type: Type.STRING },
                        description: { type: Type.STRING }
                      },
                      required: ["activity", "description"]
                    },
                    afternoon: {
                      type: Type.OBJECT,
                      properties: {
                        activity: { type: Type.STRING },
                        description: { type: Type.STRING }
                      },
                      required: ["activity", "description"]
                    },
                    evening: {
                      type: Type.OBJECT,
                      properties: {
                        activity: { type: Type.STRING },
                        description: { type: Type.STRING }
                      },
                      required: ["activity", "description"]
                    },
                    meals: {
                      type: Type.OBJECT,
                      properties: {
                        breakfast: { type: Type.STRING },
                        lunch: { type: Type.STRING },
                        dinner: { type: Type.STRING }
                      },
                      required: ["breakfast", "lunch", "dinner"]
                    },
                    dayBudget: { type: Type.STRING }
                  },
                  required: ["dayNumber", "title", "morning", "afternoon", "evening", "meals", "dayBudget"]
                }
              },
              localPhrases: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    phrase: { type: Type.STRING },
                    translation: { type: Type.STRING },
                    pronunciation: { type: Type.STRING }
                  },
                  required: ["phrase", "translation", "pronunciation"]
                }
              }
            },
            required: ["destination", "country", "tagline", "whyThisDestination", "bestTimeToGo", "packingList", "costEstimates", "itinerary", "localPhrases"]
          }
        }
      });

      const textOutput = response.text;
      if (!textOutput) {
        throw new Error("No text response received from Gemini.");
      }

      const cleanJson = textOutput.trim();
      const parsedData = JSON.parse(cleanJson);
      return res.json(parsedData);
    } catch (err: any) {
      console.error("Gemini API Error, falling back to local list:", err);
      // Fallback selection based on user options if API fails
      return getFallback(budget, activeInterests, validDays, res);
    }
  } else {
    console.log("No active Gemini API key or key is mock. Using handcrafted local destination.");
    return getFallback(budget, activeInterests, validDays, res);
  }
});

// Helper function to return fallback with correct day duration
function getFallback(budget: string, interests: string[], days: number, res: any) {
  let selectedFallbackKey = "mid-range-culture"; // default
  
  if (budget === "budget") {
    selectedFallbackKey = "budget-adventure";
  } else if (budget === "luxury") {
    selectedFallbackKey = "luxury-nature";
  } else {
    // mid-range
    if (interests.includes("beach") || interests.includes("nature")) {
      selectedFallbackKey = "luxury-nature"; // Amalfi Coast is beautiful for nature
    } else if (interests.includes("adventure") || interests.includes("food")) {
      selectedFallbackKey = "budget-adventure"; // Hanoi is amazing for food
    }
  }

  const baseData = JSON.parse(JSON.stringify(fallbacks[selectedFallbackKey]));
  
  // Custom adjust days length
  if (baseData.itinerary.length !== days) {
    const originalLength = baseData.itinerary.length;
    if (days < originalLength) {
      baseData.itinerary = baseData.itinerary.slice(0, days);
    } else {
      // Pad with dynamic extensions
      for (let i = originalLength; i < days; i++) {
        const repeatDay = baseData.itinerary[i % originalLength];
        baseData.itinerary.push({
          dayNumber: i + 1,
          title: `Discover More of ${baseData.destination}`,
          morning: {
            activity: `Explore Local Neighborhoods`,
            description: `Venture off the beaten track. Stroll down quiet side streets, visit neighborhood shops, and interact with the friendly locals.`
          },
          afternoon: {
            activity: `Local Craft Workshop & Shopping`,
            description: `Participate in a workshop to learn about traditional local crafts, or pick up authentic souvenirs at local markets.`
          },
          evening: {
            activity: `Farewell Feast & Lookout View`,
            description: `Savor your final evening with panoramic views of the city skyline or coastline, sipping a local beverage and reflecting on your escape.`
          },
          meals: {
            breakfast: `Local breakfast specialities`,
            lunch: `A cozy traditional bistro meal`,
            dinner: `High-quality celebration dinner`
          },
          dayBudget: repeatDay.dayBudget
        });
      }
    }
  }

  // Adjust cost totals based on days ratio roughly
  const daysMultiplier = days / 3;
  if (selectedFallbackKey === "budget-adventure") {
    baseData.costEstimates.totalEstimated = `$${Math.round(550 + (days * 60))} - $${Math.round(750 + (days * 85))}`;
    baseData.costEstimates.accommodation = `$${Math.round(days * 20)} - $${Math.round(days * 35)}`;
  } else if (selectedFallbackKey === "mid-range-culture") {
    baseData.costEstimates.totalEstimated = `$${Math.round(900 + (days * 110))} - $${Math.round(1300 + (days * 160))}`;
    baseData.costEstimates.accommodation = `$${Math.round(days * 90)} - $${Math.round(days * 140)}`;
  } else {
    baseData.costEstimates.totalEstimated = `$${Math.round(1800 + (days * 400))} - $${Math.round(2500 + (days * 700))}`;
    baseData.costEstimates.accommodation = `$${Math.round(days * 400)} - $${Math.round(days * 750)}`;
  }

  return res.json(baseData);
}

// Endpoint to check if a real API key is loaded
app.get("/api/key-check", (req, res) => {
  res.json({
    hasKey: isRealKey,
    message: isRealKey 
      ? "Google AI Studio is successfully using your connected Gemini API key." 
      : "No API key found. Running in offline mode with full custom fallback itineraries."
  });
});

// Vite & Static file serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
