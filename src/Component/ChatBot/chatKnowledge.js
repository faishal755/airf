// Airbnb AI Assistant Knowledge Base & Intelligent Matcher
// Handles natural language query parsing, place search, FAQs, and help services.

export const QUICK_SUGGESTIONS = [
  { label: "🏖️ Goa Beach Villas", query: "Show me luxury villas in Goa near the beach" },
  { label: "🏔️ Mountain Cabins", query: "Cozy timber cabins with mountain views in Manali or Shimla" },
  { label: "🏊 Private Pool Stays", query: "Stays with private swimming pool" },
  { label: "💰 Budget Under ₹3,000", query: "Affordable stays under 3000 per night" },
  { label: "⭐ Top Rated 4.9+", query: "Show highest rated properties" },
  { label: "📅 How to book a stay?", query: "How do I book a place on this website?" },
  { label: "🛡️ Cancellation & Refunds", query: "What is your cancellation and refund policy?" },
  { label: "🏡 How to become a host?", query: "How can I list my property as a host?" },
  { label: "💬 Contact Support", query: "I need help from customer support" },
];

// Helper: Extract price constraints from query
function extractBudget(text) {
  const underMatch = text.match(/(?:under|below|less than|within|max|budget of)\s*(?:rs\.?|inr|₹)?\s*(\d+[\d,]*)/i);
  if (underMatch) {
    return { max: parseInt(underMatch[1].replace(/,/g, ""), 10) };
  }

  const aboveMatch = text.match(/(?:above|more than|over|min)\s*(?:rs\.?|inr|₹)?\s*(\d+[\d,]*)/i);
  if (aboveMatch) {
    return { min: parseInt(aboveMatch[1].replace(/,/g, ""), 10) };
  }

  if (/(?:budget|cheap|affordable|low cost|economy)/i.test(text)) {
    return { max: 4000 };
  }

  if (/(?:luxury|ultra luxury|exclusive|5 star|five star|expensive)/i.test(text)) {
    return { min: 8000 };
  }

  return null;
}

// Known cities in dummy and typical listings
const KNOWN_CITIES = [
  "goa", "manali", "mumbai", "jaipur", "lonavala", "bangalore", "bengaluru",
  "rishikesh", "shimla", "delhi", "udaipur", "pune", "paris", "alibaug",
  "mahabaleshwar", "nashik", "coorg", "dehradun"
];

// Known categories
const KNOWN_CATEGORIES = [
  { key: "villa", aliases: ["villa", "villas", "mansion", "bungalow"] },
  { key: "cabin", aliases: ["cabin", "cabins", "cottage", "chalet", "wooden house", "timber"] },
  { key: "flat", aliases: ["flat", "apartment", "studio", "loft", "penthouse"] },
  { key: "farm house", aliases: ["farm house", "farmhouse", "farm", "ranch", "orchard", "estate"] },
  { key: "pool house", aliases: ["pool house", "pool villa", "private pool", "infinity pool", "swimming pool"] },
  { key: "rooms", aliases: ["room", "rooms", "suite", "private room", "homestay"] },
  { key: "pg", aliases: ["pg", "hostel", "co-living", "paying guest"] },
  { key: "shop", aliases: ["shop", "store", "pop up", "pop-up", "retail"] },
];

// Match FAQ / Help topics
export function findHelpAnswer(query, user, navigate) {
  const q = query.toLowerCase();

  // 1. Booking assistance
  if (
    q.includes("how to book") ||
    q.includes("booking process") ||
    q.includes("how do i reserve") ||
    q.includes("how can i book") ||
    q.includes("steps to book")
  ) {
    return {
      type: "help",
      text: `### 📅 How to Book a Stay on Airbnb

Booking a place is quick, safe, and transparent:

1. **Find your ideal place**: Browse categories or search by city, landmark, or category in the search bar.
2. **View Property Details**: Click on any listing card to see photos, amenities, host details, and landmark.
3. **Select Dates**: Enter your **Check-in** and **Check-out** dates, along with guest counts.
4. **Instant Confirmation**: Click **"Book Now"** to reserve. Your reservation is immediately secured!
5. **Manage Your Trips**: View, review, or print your confirmation anytime under **"My Bookings"**.`,
      action: {
        label: "📅 View My Bookings",
        actionType: "navigate",
        payload: "/mybooking",
      },
      followUps: ["What is your cancellation policy?", "Are payments secure?", "How do I contact the host?"],
    };
  }

  // 2. Cancellation and Refunds
  if (
    q.includes("cancel") ||
    q.includes("refund") ||
    q.includes("cancellation policy") ||
    q.includes("money back")
  ) {
    return {
      type: "help",
      text: `### 🛡️ Cancellation & Refund Policy

We offer flexible and guest-friendly cancellation terms:

- **Free Cancellation**: Cancel within **48 hours of booking** for a **100% full refund** (provided check-in is at least 14 days away).
- **Standard Stays**: Cancel up to 7 days before check-in for a **50% refund** minus the service fee.
- **Host Cancellation**: If your host cancels for any reason, you receive a **full 100% immediate refund** plus assistance booking a replacement stay.
- **Refund Timeline**: Refunds are processed automatically to your original payment method within **3 to 5 business days**.`,
      action: {
        label: "💬 Talk to Support about a Refund",
        actionType: "support_form",
        payload: "refund",
      },
      followUps: ["How to book a stay?", "How do I check my booking?", "Safety & Protection"],
    };
  }

  // 3. Hosting / Listing your home
  if (
    q.includes("become a host") ||
    q.includes("host my") ||
    q.includes("list my") ||
    q.includes("how to host") ||
    q.includes("earn money") ||
    q.includes("add listing")
  ) {
    return {
      type: "help",
      text: `### 🏡 Airbnb Your Home & Start Earning

Listing your place is easy, free, and puts you in complete control:

1. **Sign In**: Ensure you are logged into your account.
2. **Click "Airbnb your home"**: Found in the top navigation profile menu or click the button below.
3. **Add Property Details**: Provide title, description, category, city, and landmark.
4. **Upload High-Res Photos**: Add 3 beautiful photos showcasing the bedroom, exterior, and key amenities.
5. **Set Your Price**: Pick a competitive nightly rate and hit publish! Your home is live worldwide.`,
      action: {
        label: "🏡 Start Listing Your Home",
        actionType: "navigate",
        payload: "/ListingPage1",
      },
      followUps: ["How do payouts work?", "What host protections exist?", "House rules advice"],
    };
  }

  // 4. Check-in, Check-out & House rules
  if (
    q.includes("check in") ||
    q.includes("check-in") ||
    q.includes("check out") ||
    q.includes("check-out") ||
    q.includes("timings") ||
    q.includes("house rules") ||
    q.includes("pets")
  ) {
    return {
      type: "help",
      text: `### 🕒 Check-in, Check-out & House Rules

- **Standard Check-in**: Typically **2:00 PM – 8:00 PM**.
- **Standard Check-out**: By **11:00 AM** to allow hosts time to clean and sanitize for next guests.
- **Early Check-in / Late Check-out**: Can often be arranged directly with your host via chat upon booking.
- **House Rules**: Most homes are non-smoking indoors. Many cabins and farm houses welcome pets (check individual listing descriptions).`,
      followUps: ["How to contact my host?", "Can I bring pets?", "Cancellation policy"],
    };
  }

  // 5. Safety, verification & trust
  if (
    q.includes("safe") ||
    q.includes("secure") ||
    q.includes("verification") ||
    q.includes("scam") ||
    q.includes("protect")
  ) {
    return {
      type: "help",
      text: `### 🔒 AirCover & Guest Safety Guarantee

Every booking comes protected with Airbnb AirCover:

- **Identity-Verified Hosts**: Hosts are verified with official identification.
- **Secure Direct Checkout**: Encrypted data and secured payments.
- **Listing Accuracy Guarantee**: If the listing differs significantly from what was advertised, our team will rebook you or issue a full refund.
- **24/7 Safety Line**: Our emergency team is available around the clock if you ever feel unsafe.`,
      followUps: ["Customer support contact", "How to book?", "Refund terms"],
    };
  }

  // 6. Customer Support / Human Help
  if (
    q.includes("human") ||
    q.includes("support") ||
    q.includes("contact") ||
    q.includes("complaint") ||
    q.includes("call") ||
    q.includes("help desk") ||
    q.includes("agent") ||
    q.includes("issue")
  ) {
    return {
      type: "support_prompt",
      text: `### 💬 Airbnb Concierge & Support Desk

Our team is dedicated to giving you an exceptional experience. How can we best help you today?

- **Instant Help**: Ask me anything regarding places, pricing, policies, or booking steps.
- **Priority Ticket**: Need personal human assistance? Click below to submit an inquiry and an Airbnb Support Specialist will assist you.`,
      action: {
        label: "🎫 Submit Support Inquiry",
        actionType: "support_form",
        payload: "general",
      },
      followUps: ["How to cancel a reservation?", "Where is my booking?", "Find best deals"],
    };
  }

  // 7. Small talk & greetings
  if (
    /^(hi|hello|hey|yo|hola|namaste|good morning|good afternoon|good evening)\b/i.test(q)
  ) {
    const greetingName = user?.name ? ` **${user.name}**` : "";
    return {
      type: "greeting",
      text: `Hello${greetingName}! 👋 Welcome to your **Airbnb Concierge**. 

I can help you:
- 🏖️ **Search & find the perfect stay** (villas, cabins, private pools, budget or luxury)
- 📍 **Explore destinations** (Goa, Manali, Mumbai, Jaipur, Paris, Coorg, etc.)
- 📅 **Guide you through booking** or viewing your reservations
- 🛡️ **Answer policies** (cancellations, refunds, check-in, hosting)

What kind of trip are you planning today?`,
      followUps: [
        "🏖️ Find beach villas in Goa",
        "🏔️ Stays with mountain views",
        "🏊 Villas with private pools",
        "💰 Stays under ₹3,000",
      ],
    };
  }

  // 8. Capabilities question ("who are you", "what can you do")
  if (
    q.includes("who are you") ||
    q.includes("what can you do") ||
    q.includes("help me with") ||
    q.includes("what are your features")
  ) {
    return {
      type: "intro",
      text: `### 🤖 I am Aura, your Airbnb AI Concierge

I'm designed to make your travel planning effortless:

1. **Smart Property Search**: Tell me where you want to go, your budget, or your travel vibe (e.g. *"Show me villas in Goa with a pool under ₹9,000"*).
2. **Interactive Listing Preview**: I display live listing cards right here in our chat with photos, prices, and one-click booking details.
3. **Filter Map & Home**: With one tap, I can sync our chat results directly to your Home page and Interactive Map.
4. **Host & Guest Support**: Step-by-step guidance on bookings, cancellations, check-in/out, and how to list your property.`,
      followUps: ["Find top rated places", "Budget stays under 3000", "How to book a place?"],
    };
  }

  // 9. Gratitude
  if (/^(thank you|thanks|thx|awesome|great|perfect|cool)\b/i.test(q)) {
    return {
      type: "chat",
      text: `You are very welcome! 😊 If you need anything else—like finding local landmarks, discovering hidden gems, or help with your reservation—just let me know! ✈️🏖️`,
      followUps: ["Show trending stays", "View my bookings", "Explore mountain cabins"],
    };
  }

  return null;
}

// Search and rank listings matching user query
export function searchListingsWithNLP(query, allListings = []) {
  if (!allListings || allListings.length === 0) return { listings: [], explanation: "" };

  const q = query.toLowerCase();
  const budget = extractBudget(q);

  // Detect city
  let matchedCity = null;
  for (const city of KNOWN_CITIES) {
    if (q.includes(city)) {
      matchedCity = city;
      break;
    }
  }

  // Detect category
  let matchedCategory = null;
  for (const cat of KNOWN_CATEGORIES) {
    if (cat.aliases.some((alias) => q.includes(alias))) {
      matchedCategory = cat.key;
      break;
    }
  }

  // Detect specific amenity or vibe filters
  const wantsPool = q.includes("pool") || q.includes("swimming") || q.includes("jacuzzi");
  const wantsMountain = q.includes("mountain") || q.includes("snow") || q.includes("hill") || q.includes("pine") || q.includes("himalayan");
  const wantsBeach = q.includes("beach") || q.includes("sea") || q.includes("ocean") || q.includes("cliff");
  const wantsHeritage = q.includes("heritage") || q.includes("haveli") || q.includes("palace") || q.includes("royal");
  const wantsNature = q.includes("farm") || q.includes("orchard") || q.includes("vineyard") || q.includes("green") || q.includes("plantation");
  const wantsWork = q.includes("work") || q.includes("wifi") || q.includes("studio") || q.includes("nomad");
  const wantsTopRated = q.includes("best") || q.includes("top rated") || q.includes("highest") || q.includes("top");

  // Score each listing
  const scored = allListings.map((item) => {
    let score = 0;
    const title = (item.title || "").toLowerCase();
    const desc = (item.description || "").toLowerCase();
    const city = (item.city || "").toLowerCase();
    const landmark = (item.landmark || "").toLowerCase();
    const category = (item.category || "").toLowerCase();
    const rent = Number(item.rent) || 0;
    const rating = Number(item.rating) || 0;

    // City matching
    if (matchedCity) {
      if (city.includes(matchedCity) || landmark.includes(matchedCity)) {
        score += 35;
      } else {
        // Penalty if city requested but doesn't match
        score -= 20;
      }
    }

    // Category matching
    if (matchedCategory) {
      if (category.includes(matchedCategory) || title.includes(matchedCategory)) {
        score += 30;
      }
    }

    // Budget constraints
    if (budget) {
      if (budget.max && rent <= budget.max) {
        score += 25;
      } else if (budget.max && rent > budget.max) {
        score -= 30;
      }
      if (budget.min && rent >= budget.min) {
        score += 25;
      } else if (budget.min && rent < budget.min) {
        score -= 20;
      }
    }

    // Amenity & feature matches
    if (wantsPool && (category.includes("pool") || desc.includes("pool") || title.includes("pool"))) {
      score += 20;
    }
    if (wantsMountain && (desc.includes("mountain") || desc.includes("snow") || desc.includes("pine") || city === "manali" || city === "shimla")) {
      score += 20;
    }
    if (wantsBeach && (desc.includes("beach") || desc.includes("sea") || desc.includes("cliff") || city === "goa" || city === "alibaug")) {
      score += 20;
    }
    if (wantsHeritage && (desc.includes("heritage") || desc.includes("haveli") || desc.includes("palace") || city === "jaipur" || city === "udaipur")) {
      score += 20;
    }
    if (wantsNature && (category.includes("farm") || desc.includes("orchard") || desc.includes("farm") || desc.includes("vineyard"))) {
      score += 20;
    }
    if (wantsWork && (desc.includes("wifi") || desc.includes("studio") || desc.includes("work") || category === "flat" || category === "pg")) {
      score += 15;
    }

    // Rating boost
    if (wantsTopRated) {
      score += (rating - 4.5) * 40;
    } else {
      score += rating * 2;
    }

    // Keyword tokens
    const tokens = q.split(/\s+/).filter((t) => t.length > 2);
    for (const token of tokens) {
      if (title.includes(token)) score += 8;
      if (landmark.includes(token)) score += 6;
      if (desc.includes(token)) score += 3;
    }

    return { item, score };
  });

  // Filter positive scores and sort descending
  const matches = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.item);

  // If query is broad or no matches, take top rated as fallback
  const results = matches.length > 0 ? matches.slice(0, 4) : allListings.slice(0, 3);

  // Generate friendly conversational explanation
  let explanation = "";
  if (matchedCity && matchedCategory) {
    explanation = `I found wonderful **${matchedCategory}s in ${matchedCity.charAt(0).toUpperCase() + matchedCity.slice(1)}** matching your request:`;
  } else if (matchedCity) {
    explanation = `Here are the top-rated stays in **${matchedCity.charAt(0).toUpperCase() + matchedCity.slice(1)}**:`;
  } else if (matchedCategory) {
    explanation = `Here are standout **${matchedCategory}s** handpicked for your trip:`;
  } else if (budget?.max) {
    explanation = `Here are fantastic properties priced **under ₹${budget.max.toLocaleString()} / night**:`;
  } else if (wantsPool) {
    explanation = `Here are gorgeous retreats with **private and panoramic pools**:`;
  } else if (wantsMountain) {
    explanation = `Here are cozy mountain sanctuaries with **snowy peaks and cedar forests**:`;
  } else {
    explanation = `Here are exceptional stays that match what you're looking for:`;
  }

  return {
    listings: results,
    explanation,
  };
}
