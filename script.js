"use strict";
/* ==========================================================================
   1. CONFIG — edit these values
   ========================================================================== */
// WhatsApp number that receives orders: international format, digits only (e.g. "201001234567").
// Leave "" to hide the WhatsApp button and offer "Copy order" instead.
const WHATSAPP_NUMBER = "201204674718";

// LOGO SLOT: path/URL of the real logo (transparent PNG/SVG, cream on transparent works best, e.g. "logo.svg").
// Leave "" to show the text wordmark "AMORI".
const LOGO_SRC = "";

const VAT_RATE = 0.14;                                 // 14% VAT, shown as an estimate only
const BUDGET_LEVELS = { lightMax: 70, mediumMax: 95 }; // quiz budget: Light <= 70, Medium <= 95, Treat > 95 (EGP)
const SURPRISE_EXCLUDED_DEFAULT = ["shisha", "soft"];  // categories switched off by default in "Surprise me"
const QUIZ_EXCLUDED = ["shisha", "soft"];              // categories the Mood quiz never recommends
// Table QR links are signed: ?table=5&k=<key>. The key is derived from the table number + this secret,
// so changing ?table= by hand does not work. Change the secret, then regenerate the QR links with make-qr-links.py
// (use the same value there). NOTE: this is a deterrent, not real security: the page has no backend.
const TABLE_SECRET = "amori-7f3k9q2x";
const TABLE_TTL_MS = 6 * 60 * 60 * 1000;               // a remembered table number expires after 6 hours
const MAX_QTY = 20;

/* ==========================================================================
   2. MENU DATA — one array, edit freely.
   Fields: id, category (key from CATEGORIES), nameAr, nameEn, price (EGP, excl. VAT), tags.
   Tag vocabulary (used by the Mood quiz):
     temperature: hot | cold        taste: sweet | fresh | strong
     extras: dessert, fruity, creamy, vip, savory, shisha
   ========================================================================== */
const CATEGORIES = [
  { id: "coffee", ar: "قهوة", en: "Coffee" },
  { id: "hot", ar: "مشروبات ساخنة", en: "Hot Drinks" },
  { id: "juice", ar: "عصاير فريش", en: "Fresh Juice" },
  { id: "soft", ar: "مشروبات باردة", en: "Soft Drinks" },
  { id: "mojito", ar: "موهيتو", en: "Mojito" },
  { id: "cocktail", ar: "كوكتيل", en: "Cocktail" },
  { id: "fruit", ar: "فروت سالاد", en: "Fruit Salad" },
  { id: "milkshake", ar: "ميلك شيك", en: "Milkshake" },
  { id: "smoothie", ar: "سموزي", en: "Smoothie" },
  { id: "iced", ar: "آيس كوفي", en: "Iced Coffee" },
  { id: "dessert", ar: "ديزرت", en: "Desserts" },
  { id: "shisha", ar: "شيشة", en: "Shisha" }
];

const MENU = [
  // ---- Coffee ----
  { id: "coffee-01", category: "coffee", nameAr: "قهوة تركي سنجل", nameEn: "Turkish Coffee Single", price: 45, tags: ["hot", "strong"] },
  { id: "coffee-02", category: "coffee", nameAr: "قهوة تركي دبل", nameEn: "Turkish Coffee Double", price: 59, tags: ["hot", "strong"] },
  { id: "coffee-03", category: "coffee", nameAr: "قهوة فرنساوي سنجل", nameEn: "French Coffee Single", price: 50, tags: ["hot", "strong"] },
  { id: "coffee-04", category: "coffee", nameAr: "قهوة فرنساوي دبل", nameEn: "French Coffee Double", price: 59, tags: ["hot", "strong"] },
  { id: "coffee-05", category: "coffee", nameAr: "قهوة بندق سنجل", nameEn: "Hazelnut Coffee Single", price: 55, tags: ["hot", "sweet"] },
  { id: "coffee-06", category: "coffee", nameAr: "قهوة بندق دبل", nameEn: "Hazelnut Coffee Double", price: 75, tags: ["hot", "sweet"] },
  { id: "coffee-07", category: "coffee", nameAr: "اسبرسو سنجل", nameEn: "Espresso Single", price: 49, tags: ["hot", "strong"] },
  { id: "coffee-08", category: "coffee", nameAr: "اسبرسو دبل", nameEn: "Espresso Double", price: 65, tags: ["hot", "strong"] },
  { id: "coffee-09", category: "coffee", nameAr: "ميكاتو سنجل", nameEn: "Macchiato Single", price: 54, tags: ["hot", "strong", "creamy"] },
  { id: "coffee-10", category: "coffee", nameAr: "ميكاتو دبل", nameEn: "Macchiato Double", price: 65, tags: ["hot", "strong", "creamy"] },
  { id: "coffee-11", category: "coffee", nameAr: "فلات وايت", nameEn: "Flat White", price: 75, tags: ["hot", "strong", "creamy"] },
  { id: "coffee-12", category: "coffee", nameAr: "كورتادو", nameEn: "Cortado", price: 75, tags: ["hot", "strong"] },
  { id: "coffee-13", category: "coffee", nameAr: "كابتشينو", nameEn: "Cappuccino", price: 70, tags: ["hot", "strong", "creamy"] },
  { id: "coffee-14", category: "coffee", nameAr: "لاتيه", nameEn: "Latte", price: 65, tags: ["hot", "sweet", "creamy"] },
  { id: "coffee-15", category: "coffee", nameAr: "نسكافيه بلاك", nameEn: "Nescafe Black", price: 50, tags: ["hot", "strong"] },
  { id: "coffee-16", category: "coffee", nameAr: "نسكافيه باللبن", nameEn: "Nescafe With Milk", price: 65, tags: ["hot", "sweet", "creamy"] },
  { id: "coffee-17", category: "coffee", nameAr: "أميريكان كوفي بلاك", nameEn: "Americano Black", price: 65, tags: ["hot", "strong"] },
  { id: "coffee-18", category: "coffee", nameAr: "أميريكان كوفي باللبن", nameEn: "Americano With Milk", price: 75, tags: ["hot", "strong", "creamy"] },
  { id: "coffee-19", category: "coffee", nameAr: "موكا", nameEn: "Mocha", price: 75, tags: ["hot", "sweet", "creamy"] },
  { id: "coffee-20", category: "coffee", nameAr: "وايت موكا", nameEn: "White Mocha", price: 75, tags: ["hot", "sweet", "creamy"] },
  { id: "coffee-21", category: "coffee", nameAr: "كوفي لوتس", nameEn: "Lotus Coffee", price: 70, tags: ["hot", "sweet"] },
  { id: "coffee-22", category: "coffee", nameAr: "بستاشيو كوفي", nameEn: "Pistachio Coffee", price: 75, tags: ["hot", "sweet"] },
  { id: "coffee-23", category: "coffee", nameAr: "ماتشا", nameEn: "Matcha", price: 65, tags: ["hot", "fresh", "creamy"] },
  { id: "coffee-24", category: "coffee", nameAr: "بلو لاتيه", nameEn: "Blue Latte", price: 75, tags: ["hot", "sweet", "creamy"] },
  // ---- Hot Drinks ----
  { id: "hot-01", category: "hot", nameAr: "شاي أحمر", nameEn: "Black Tea", price: 40, tags: ["hot", "strong"] },
  { id: "hot-02", category: "hot", nameAr: "شاي أخضر", nameEn: "Green Tea", price: 45, tags: ["hot", "fresh"] },
  { id: "hot-03", category: "hot", nameAr: "شاي فواكه", nameEn: "Fruit Tea", price: 45, tags: ["hot", "fresh"] },
  { id: "hot-04", category: "hot", nameAr: "ينسون (باكيت)", nameEn: "Anise", price: 40, tags: ["hot", "fresh"] },
  { id: "hot-05", category: "hot", nameAr: "كركديه (باكيت)", nameEn: "Hibiscus", price: 40, tags: ["hot", "fresh"] },
  { id: "hot-06", category: "hot", nameAr: "نعناع (باكيت)", nameEn: "Mint", price: 40, tags: ["hot", "fresh"] },
  { id: "hot-07", category: "hot", nameAr: "قرفة (باكيت)", nameEn: "Cinnamon", price: 40, tags: ["hot", "fresh"] },
  { id: "hot-08", category: "hot", nameAr: "جنزبيل (باكيت)", nameEn: "Ginger", price: 40, tags: ["hot", "strong"] },
  { id: "hot-09", category: "hot", nameAr: "قرفة باللبن", nameEn: "Cinnamon With Milk", price: 55, tags: ["hot", "sweet", "creamy"] },
  { id: "hot-10", category: "hot", nameAr: "جنزبيل باللبن", nameEn: "Ginger With Milk", price: 55, tags: ["hot", "sweet", "creamy"] },
  { id: "hot-11", category: "hot", nameAr: "ميكس أعشاب", nameEn: "Herbal Mix", price: 70, tags: ["hot", "fresh"] },
  { id: "hot-12", category: "hot", nameAr: "هوت سيدر", nameEn: "Hot Cider", price: 65, tags: ["hot", "sweet", "fresh"] },
  { id: "hot-13", category: "hot", nameAr: "هوت شوكلت", nameEn: "Hot Chocolate", price: 65, tags: ["hot", "sweet", "dessert"] },
  { id: "hot-14", category: "hot", nameAr: "هوت وايت شوكلت", nameEn: "Hot White Chocolate", price: 65, tags: ["hot", "sweet", "dessert"] },
  { id: "hot-15", category: "hot", nameAr: "هوت سنيكرز", nameEn: "Hot Snickers", price: 95, tags: ["hot", "sweet", "dessert"] },
  { id: "hot-16", category: "hot", nameAr: "هوت كيت كات", nameEn: "Hot KitKat", price: 95, tags: ["hot", "sweet", "dessert"] },
  { id: "hot-17", category: "hot", nameAr: "هوت اوريو", nameEn: "Hot Oreo", price: 85, tags: ["hot", "sweet", "dessert"] },
  { id: "hot-18", category: "hot", nameAr: "شاي براد (2 فرد)", nameEn: "Tea Pot (2 Persons)", price: 45, tags: ["hot", "strong"] },
  { id: "hot-19", category: "hot", nameAr: "شاي براد (3-4 فرد)", nameEn: "Tea Pot (3-4 Persons)", price: 59, tags: ["hot", "strong"] },
  { id: "hot-20", category: "hot", nameAr: "شاي باللبن", nameEn: "Milk Tea", price: 55, tags: ["hot", "sweet", "creamy"] },
  { id: "hot-21", category: "hot", nameAr: "سحلب سادة", nameEn: "Sahlab Plain", price: 60, tags: ["hot", "sweet", "dessert", "creamy"] },
  { id: "hot-22", category: "hot", nameAr: "سحلب مكسرات", nameEn: "Sahlab Nuts", price: 70, tags: ["hot", "sweet", "dessert", "creamy"] },
  { id: "hot-23", category: "hot", nameAr: "سحلب فواكه", nameEn: "Sahlab Fruits", price: 70, tags: ["hot", "sweet", "dessert", "creamy"] },
  { id: "hot-24", category: "hot", nameAr: "سحلب لوتس", nameEn: "Lotus Sahlab", price: 70, tags: ["hot", "sweet", "dessert", "creamy"] },
  { id: "hot-25", category: "hot", nameAr: "سحلب بستاشيو", nameEn: "Pistachio Sahlab", price: 75, tags: ["hot", "sweet", "dessert", "creamy"] },
  { id: "hot-26", category: "hot", nameAr: "حمص الشام", nameEn: "Chickpeas Soup", price: 65, tags: ["hot", "strong", "savory"] },
  // ---- Fresh Juice ----
  { id: "juice-01", category: "juice", nameAr: "عصير مانجا", nameEn: "Mango Juice", price: 85, tags: ["cold", "fresh", "fruity", "sweet"] },
  { id: "juice-02", category: "juice", nameAr: "عصير فراولة", nameEn: "Strawberry Juice", price: 80, tags: ["cold", "fresh", "fruity", "sweet"] },
  { id: "juice-03", category: "juice", nameAr: "عصير جوافة", nameEn: "Guava Juice", price: 75, tags: ["cold", "fresh", "fruity"] },
  { id: "juice-04", category: "juice", nameAr: "عصير برتقال", nameEn: "Orange Juice", price: 85, tags: ["cold", "fresh", "fruity"] },
  { id: "juice-05", category: "juice", nameAr: "عصير موز باللبن", nameEn: "Banana Milk Juice", price: 85, tags: ["cold", "fresh", "fruity", "sweet"] },
  { id: "juice-06", category: "juice", nameAr: "عصير بطيخ", nameEn: "Watermelon Juice", price: 85, tags: ["cold", "fresh", "fruity"] },
  { id: "juice-07", category: "juice", nameAr: "عصير كنتلوب", nameEn: "Cantaloupe Juice", price: 85, tags: ["cold", "fresh", "fruity"] },
  { id: "juice-08", category: "juice", nameAr: "عصير كيوي", nameEn: "Kiwi Juice", price: 95, tags: ["cold", "fresh", "fruity"] },
  { id: "juice-09", category: "juice", nameAr: "عصير عناب", nameEn: "Jujube Juice", price: 59, tags: ["cold", "fresh", "fruity"] },
  { id: "juice-10", category: "juice", nameAr: "عصير ليمون", nameEn: "Lemon Juice", price: 59, tags: ["cold", "fresh", "fruity"] },
  { id: "juice-11", category: "juice", nameAr: "عصير ليمون نعناع", nameEn: "Lemon Mint Juice", price: 69, tags: ["cold", "fresh", "fruity"] },
  { id: "juice-12", category: "juice", nameAr: "عصير خوخ", nameEn: "Peach Juice", price: 80, tags: ["cold", "fresh", "fruity", "sweet"] },
  { id: "juice-13", category: "juice", nameAr: "عصير تفاح", nameEn: "Apple Juice", price: 84, tags: ["cold", "fresh", "fruity", "sweet"] },
  { id: "juice-14", category: "juice", nameAr: "عصير اناناس", nameEn: "Pineapple Juice", price: 84, tags: ["cold", "fresh", "fruity", "sweet"] },
  { id: "juice-15", category: "juice", nameAr: "عصير بطيخ نعناع", nameEn: "Watermelon Mint", price: 90, tags: ["cold", "fresh", "fruity"] },
  { id: "juice-16", category: "juice", nameAr: "عصير جوافة نعناع", nameEn: "Guava Mint", price: 85, tags: ["cold", "fresh", "fruity"] },
  // ---- Soft Drinks ----
  { id: "soft-01", category: "soft", nameAr: "مياه معدنية صغيرة", nameEn: "Small Mineral Water", price: 17, tags: ["cold", "fresh"] },
  { id: "soft-02", category: "soft", nameAr: "بيبسي", nameEn: "Pepsi", price: 49, tags: ["cold", "sweet"] },
  { id: "soft-03", category: "soft", nameAr: "سفن اب", nameEn: "7Up", price: 49, tags: ["cold", "fresh"] },
  { id: "soft-04", category: "soft", nameAr: "فيروز", nameEn: "Fayrouz", price: 55, tags: ["cold", "sweet"] },
  { id: "soft-05", category: "soft", nameAr: "بريل", nameEn: "Birell", price: 55, tags: ["cold", "fresh"] },
  { id: "soft-06", category: "soft", nameAr: "كوكاكولا", nameEn: "Coca Cola", price: 49, tags: ["cold", "sweet"] },
  { id: "soft-07", category: "soft", nameAr: "ميرندا", nameEn: "Mirinda", price: 49, tags: ["cold", "sweet"] },
  { id: "soft-08", category: "soft", nameAr: "ريد بول", nameEn: "Red Bull Energy", price: 90, tags: ["cold", "strong"] },
  { id: "soft-09", category: "soft", nameAr: "ريد بول فلفر", nameEn: "Red Bull Flavor", price: 97, tags: ["cold", "strong"] },
  // ---- Mojito ----
  { id: "mojito-01", category: "mojito", nameAr: "موهيتو كلاسيك", nameEn: "Classic Mojito", price: 95, tags: ["cold", "fresh"] },
  { id: "mojito-02", category: "mojito", nameAr: "موهيتو فلفر", nameEn: "Flavor Mojito", price: 99, tags: ["cold", "fresh"] },
  { id: "mojito-03", category: "mojito", nameAr: "موهيتو ريد بول", nameEn: "Red Bull Mojito", price: 105, tags: ["cold", "fresh", "strong"] },
  { id: "mojito-04", category: "mojito", nameAr: "صن شاين", nameEn: "Sun Shine", price: 90, tags: ["cold", "fresh"] },
  { id: "mojito-05", category: "mojito", nameAr: "صن شاين رايز", nameEn: "Sun Shine Rise", price: 90, tags: ["cold", "fresh"] },
  { id: "mojito-06", category: "mojito", nameAr: "موهيتو أموري", nameEn: "Amori Mojito", price: 95, tags: ["cold", "fresh"] },
  { id: "mojito-07", category: "mojito", nameAr: "شيرى كولا", nameEn: "Cherry Cola", price: 75, tags: ["cold", "fresh", "sweet"] },
  { id: "mojito-08", category: "mojito", nameAr: "هامر هيد", nameEn: "Hammer Head", price: 110, tags: ["cold", "fresh", "strong"] },
  { id: "mojito-09", category: "mojito", nameAr: "باور لاجون", nameEn: "Power Lagoon", price: 110, tags: ["cold", "fresh", "strong"] },
  { id: "mojito-10", category: "mojito", nameAr: "بلو سكاي", nameEn: "Blue Sky", price: 100, tags: ["cold", "fresh", "sweet"] },
  // ---- Cocktail ----
  { id: "cocktail-01", category: "cocktail", nameAr: "كوكتيل بينا كولادا", nameEn: "Pina Colada Cocktail", price: 105, tags: ["cold", "fruity", "sweet", "creamy"] },
  { id: "cocktail-02", category: "cocktail", nameAr: "كوكتيل كوبا كابانا", nameEn: "Copa Cabana Cocktail", price: 110, tags: ["cold", "fruity", "sweet"] },
  { id: "cocktail-03", category: "cocktail", nameAr: "كوكتيل فلوريدا", nameEn: "Florida Cocktail", price: 95, tags: ["cold", "fruity", "fresh"] },
  { id: "cocktail-04", category: "cocktail", nameAr: "كوكتيل باور كوكتيل", nameEn: "Power Cocktail", price: 110, tags: ["cold", "fruity", "fresh"] },
  { id: "cocktail-05", category: "cocktail", nameAr: "كوكتيل بيبي لاف", nameEn: "Baby Love Cocktail", price: 95, tags: ["cold", "fruity", "sweet"] },
  { id: "cocktail-06", category: "cocktail", nameAr: "كوكتيل مانجو كيوي", nameEn: "Mango Kiwi Cocktail", price: 105, tags: ["cold", "fruity", "fresh"] },
  { id: "cocktail-07", category: "cocktail", nameAr: "كوكتيل أفوكادو مكسرات", nameEn: "Avocado Nuts Cocktail", price: 135, tags: ["cold", "fruity", "sweet", "creamy"] },
  { id: "cocktail-08", category: "cocktail", nameAr: "كوكتيل زبادي عسل", nameEn: "Yogurt Honey Cocktail", price: 90, tags: ["cold", "fruity", "sweet", "creamy"] },
  { id: "cocktail-09", category: "cocktail", nameAr: "كوكتيل زبادي فواكه", nameEn: "Yogurt Fruits Cocktail", price: 95, tags: ["cold", "fruity", "fresh", "sweet", "creamy"] },
  { id: "cocktail-10", category: "cocktail", nameAr: "كوكتيل زبادي قطع فاكهة أموري", nameEn: "Amori Yogurt Fruit Cocktail", price: 105, tags: ["cold", "fruity", "fresh", "sweet", "creamy"] },
  { id: "cocktail-11", category: "cocktail", nameAr: "كوكتيل مينت شوكولاتة", nameEn: "Mint Chocolate Cocktail", price: 95, tags: ["cold", "fruity", "sweet"] },
  { id: "cocktail-12", category: "cocktail", nameAr: "كوكتيل هابي مانكي", nameEn: "Happy Monkey Cocktail", price: 110, tags: ["cold", "fruity", "sweet"] },
  { id: "cocktail-13", category: "cocktail", nameAr: "كوكتيل بوبا", nameEn: "Boba Cocktail", price: 105, tags: ["cold", "fruity", "sweet", "creamy"] },
  // ---- Fruit Salad ----
  { id: "fruit-01", category: "fruit", nameAr: "فروت سالاد عادي", nameEn: "Fruit Salad", price: 77, tags: ["fruity", "cold", "fresh"] },
  { id: "fruit-02", category: "fruit", nameAr: "فروت سالاد آيس", nameEn: "Fruit Salad Ice Cream", price: 95, tags: ["fruity", "cold", "sweet", "dessert"] },
  { id: "fruit-03", category: "fruit", nameAr: "باور فروت", nameEn: "Power Fruit", price: 80, tags: ["fruity", "cold", "fresh"] },
  { id: "fruit-04", category: "fruit", nameAr: "هيلثي فروت", nameEn: "Healthy Fruit", price: 85, tags: ["fruity", "cold", "fresh"] },
  { id: "fruit-05", category: "fruit", nameAr: "فروت أموري", nameEn: "Amori Fruit", price: 99, tags: ["fruity", "cold", "sweet", "dessert"] },
  { id: "fruit-06", category: "fruit", nameAr: "بانانا سبليت", nameEn: "Banana Split", price: 80, tags: ["fruity", "cold", "sweet", "dessert"] },
  { id: "fruit-07", category: "fruit", nameAr: "اوريو ماجنس", nameEn: "Oreo Magnus", price: 85, tags: ["fruity", "cold", "sweet", "dessert"] },
  { id: "fruit-08", category: "fruit", nameAr: "أم علي", nameEn: "Om Ali", price: 79, tags: ["fruity", "hot", "sweet", "dessert"] },
  { id: "fruit-09", category: "fruit", nameAr: "أم علي مكسرات", nameEn: "Om Ali Nuts", price: 85, tags: ["fruity", "hot", "sweet", "dessert"] },
  { id: "fruit-10", category: "fruit", nameAr: "طاجن بان كيك", nameEn: "Pancake Pan", price: 79, tags: ["fruity", "hot", "sweet", "dessert"] },
  { id: "fruit-11", category: "fruit", nameAr: "طاجن وافل أموري", nameEn: "Amori Waffle Pan", price: 90, tags: ["fruity", "hot", "sweet", "dessert"] },
  // ---- Milkshake ----
  { id: "milkshake-01", category: "milkshake", nameAr: "ميلك شيك فانيليا", nameEn: "Vanilla Milkshake", price: 90, tags: ["cold", "sweet", "creamy"] },
  { id: "milkshake-02", category: "milkshake", nameAr: "ميلك شيك شوكولاتة", nameEn: "Chocolate Milkshake", price: 90, tags: ["cold", "sweet", "creamy"] },
  { id: "milkshake-03", category: "milkshake", nameAr: "ميلك شيك كراميل", nameEn: "Caramel Milkshake", price: 95, tags: ["cold", "sweet", "creamy"] },
  { id: "milkshake-04", category: "milkshake", nameAr: "ميلك شيك مانجا", nameEn: "Mango Milkshake", price: 95, tags: ["cold", "sweet", "creamy", "fruity"] },
  { id: "milkshake-05", category: "milkshake", nameAr: "ميلك شيك فراولة", nameEn: "Strawberry Milkshake", price: 95, tags: ["cold", "sweet", "creamy", "fruity"] },
  { id: "milkshake-06", category: "milkshake", nameAr: "ميلك شيك بلو بيري", nameEn: "Blueberry Milkshake", price: 90, tags: ["cold", "sweet", "creamy", "fruity"] },
  { id: "milkshake-07", category: "milkshake", nameAr: "ميلك شيك مكس بيري", nameEn: "Mix Berry Milkshake", price: 90, tags: ["cold", "sweet", "creamy", "fruity"] },
  { id: "milkshake-08", category: "milkshake", nameAr: "ميلك شيك بطيخ", nameEn: "Watermelon Milkshake", price: 99, tags: ["cold", "sweet", "creamy", "fruity"] },
  { id: "milkshake-09", category: "milkshake", nameAr: "ميلك شيك موز", nameEn: "Banana Milkshake", price: 99, tags: ["cold", "sweet", "creamy", "fruity"] },
  { id: "milkshake-10", category: "milkshake", nameAr: "ميلك شيك كيوي", nameEn: "Kiwi Milkshake", price: 110, tags: ["cold", "sweet", "creamy", "fruity"] },
  { id: "milkshake-11", category: "milkshake", nameAr: "ميلك شيك اوريو", nameEn: "Oreo Milkshake", price: 110, tags: ["cold", "sweet", "creamy"] },
  { id: "milkshake-12", category: "milkshake", nameAr: "ميلك شيك كيتكات", nameEn: "KitKat Milkshake", price: 120, tags: ["cold", "sweet", "creamy"] },
  { id: "milkshake-13", category: "milkshake", nameAr: "ميلك شيك سنكيرز", nameEn: "Snickers Milkshake", price: 120, tags: ["cold", "sweet", "creamy"] },
  { id: "milkshake-14", category: "milkshake", nameAr: "ميلك شيك VIP ريد فلفت", nameEn: "Red Velvet VIP Milkshake", price: 135, tags: ["cold", "sweet", "creamy", "vip"] },
  { id: "milkshake-15", category: "milkshake", nameAr: "ميلك شيك VIP تشوكلت فادج", nameEn: "Chocolate Fudge VIP Milkshake", price: 135, tags: ["cold", "sweet", "creamy", "vip"] },
  { id: "milkshake-16", category: "milkshake", nameAr: "ميلك شيك VIP تراميسيو", nameEn: "Tiramisu VIP Milkshake", price: 135, tags: ["cold", "sweet", "creamy", "vip"] },
  { id: "milkshake-17", category: "milkshake", nameAr: "ميلك شيك VIP مولتن نوتيلا", nameEn: "Molten Nutella VIP Milkshake", price: 135, tags: ["cold", "sweet", "creamy", "vip"] },
  { id: "milkshake-18", category: "milkshake", nameAr: "ميلك شيك VIP لوتس", nameEn: "Lotus VIP Milkshake", price: 135, tags: ["cold", "sweet", "creamy", "vip"] },
  // ---- Smoothie ----
  { id: "smoothie-01", category: "smoothie", nameAr: "سموزي مانجا", nameEn: "Mango Smoothie", price: 90, tags: ["cold", "fresh", "fruity", "sweet"] },
  { id: "smoothie-02", category: "smoothie", nameAr: "سموزي فراولة", nameEn: "Strawberry Smoothie", price: 90, tags: ["cold", "fresh", "fruity", "sweet"] },
  { id: "smoothie-03", category: "smoothie", nameAr: "سموزي ليمون", nameEn: "Lemon Smoothie", price: 70, tags: ["cold", "fresh", "fruity"] },
  { id: "smoothie-04", category: "smoothie", nameAr: "سموزي ليمون نعناع", nameEn: "Lemon Mint Smoothie", price: 75, tags: ["cold", "fresh", "fruity"] },
  { id: "smoothie-05", category: "smoothie", nameAr: "سموزي برتقال", nameEn: "Orange Smoothie", price: 85, tags: ["cold", "fresh", "fruity"] },
  { id: "smoothie-06", category: "smoothie", nameAr: "سموزي بطيخ", nameEn: "Watermelon Smoothie", price: 90, tags: ["cold", "fresh", "fruity"] },
  { id: "smoothie-07", category: "smoothie", nameAr: "سموزي كنتلوب", nameEn: "Cantaloupe Smoothie", price: 95, tags: ["cold", "fresh", "fruity"] },
  { id: "smoothie-08", category: "smoothie", nameAr: "سموزي كيوي", nameEn: "Kiwi Smoothie", price: 99, tags: ["cold", "fresh", "fruity"] },
  { id: "smoothie-09", category: "smoothie", nameAr: "سموزي خوخ", nameEn: "Peach Smoothie", price: 85, tags: ["cold", "fresh", "fruity"] },
  { id: "smoothie-10", category: "smoothie", nameAr: "سموزي تفاح", nameEn: "Apple Smoothie", price: 85, tags: ["cold", "fresh", "fruity"] },
  { id: "smoothie-11", category: "smoothie", nameAr: "سموزي اناناس", nameEn: "Pineapple Smoothie", price: 85, tags: ["cold", "fresh", "fruity"] },
  { id: "smoothie-12", category: "smoothie", nameAr: "سموزي بلوبيري", nameEn: "Blueberry Smoothie", price: 85, tags: ["cold", "fresh", "fruity", "sweet"] },
  { id: "smoothie-13", category: "smoothie", nameAr: "سموزي مكس بيري", nameEn: "Mix Berry Smoothie", price: 85, tags: ["cold", "fresh", "fruity", "sweet"] },
  { id: "smoothie-14", category: "smoothie", nameAr: "سموزي شيري", nameEn: "Cherry Smoothie", price: 75, tags: ["cold", "fresh", "fruity", "sweet"] },
  { id: "smoothie-15", category: "smoothie", nameAr: "سموزي باشون فروت", nameEn: "Passion Fruit Smoothie", price: 90, tags: ["cold", "fresh", "fruity", "sweet"] },
  { id: "smoothie-16", category: "smoothie", nameAr: "سموزي كوكتيل", nameEn: "Cocktail Smoothie", price: 90, tags: ["cold", "fresh", "fruity"] },
  // ---- Iced Coffee ----
  { id: "iced-01", category: "iced", nameAr: "آيس لاتيه", nameEn: "Iced Latte", price: 85, tags: ["cold", "strong"] },
  { id: "iced-02", category: "iced", nameAr: "آيس اسبنش لاتيه", nameEn: "Iced Spanish Latte", price: 87, tags: ["cold", "sweet"] },
  { id: "iced-03", category: "iced", nameAr: "آيس موكا", nameEn: "Iced Mocha", price: 87, tags: ["cold", "sweet"] },
  { id: "iced-04", category: "iced", nameAr: "آيس وايت موكا", nameEn: "Iced White Mocha", price: 87, tags: ["cold", "sweet"] },
  { id: "iced-05", category: "iced", nameAr: "آيس كراميل ميكياتو", nameEn: "Iced Caramel Macchiato", price: 87, tags: ["cold", "sweet"] },
  { id: "iced-06", category: "iced", nameAr: "آيس كوفي لوتس", nameEn: "Iced Lotus Coffee", price: 90, tags: ["cold", "sweet"] },
  { id: "iced-07", category: "iced", nameAr: "آيس كوفي بستاشيو", nameEn: "Iced Pistachio Coffee", price: 90, tags: ["cold", "sweet"] },
  { id: "iced-08", category: "iced", nameAr: "آيس ماتشا", nameEn: "Iced Matcha", price: 80, tags: ["cold", "fresh"] },
  { id: "iced-09", category: "iced", nameAr: "آيس شوكلت", nameEn: "Iced Chocolate", price: 85, tags: ["cold", "sweet"] },
  { id: "iced-10", category: "iced", nameAr: "فرابيه نوتيلا", nameEn: "Nutella Frappe", price: 95, tags: ["cold", "sweet", "creamy"] },
  { id: "iced-11", category: "iced", nameAr: "فرابيه كراميل", nameEn: "Caramel Frappe", price: 90, tags: ["cold", "sweet", "creamy"] },
  { id: "iced-12", category: "iced", nameAr: "فرابنتشينو كلاسيك", nameEn: "Classic Frappuccino", price: 90, tags: ["cold", "strong", "creamy"] },
  { id: "iced-13", category: "iced", nameAr: "فرابنتشينو شوكلت", nameEn: "Chocolate Frappuccino", price: 95, tags: ["cold", "sweet", "creamy"] },
  // ---- Desserts ----
  { id: "dessert-01", category: "dessert", nameAr: "مولتن نوتيلا", nameEn: "Molten Nutella", price: 110, tags: ["sweet", "dessert", "hot"] },
  { id: "dessert-02", category: "dessert", nameAr: "مولتن لوتس", nameEn: "Molten Lotus", price: 99, tags: ["sweet", "dessert", "hot"] },
  { id: "dessert-03", category: "dessert", nameAr: "تشيز كيك", nameEn: "Cheese Cake", price: 95, tags: ["sweet", "dessert", "cold"] },
  { id: "dessert-04", category: "dessert", nameAr: "ريد فلفت", nameEn: "Red Velvet", price: 90, tags: ["sweet", "dessert", "cold"] },
  { id: "dessert-05", category: "dessert", nameAr: "تشوكلت فادج", nameEn: "Chocolate Fudge", price: 95, tags: ["sweet", "dessert", "cold"] },
  { id: "dessert-06", category: "dessert", nameAr: "براونيز", nameEn: "Brownies", price: 80, tags: ["sweet", "dessert", "hot"] },
  { id: "dessert-07", category: "dessert", nameAr: "تراميسو", nameEn: "Tiramisu", price: 99, tags: ["sweet", "dessert", "cold"] },
  { id: "dessert-08", category: "dessert", nameAr: "هاني كيك", nameEn: "Honey Cake", price: 89, tags: ["sweet", "dessert", "cold"] },
  { id: "dessert-09", category: "dessert", nameAr: "فولكانو نوتيلا", nameEn: "Nutella Volcano", price: 90, tags: ["sweet", "dessert", "hot"] },
  { id: "dessert-10", category: "dessert", nameAr: "طاجن نوتيلا", nameEn: "Nutella Pan", price: 85, tags: ["sweet", "dessert", "hot"] },
  { id: "dessert-11", category: "dessert", nameAr: "طاجن اوريو", nameEn: "Oreo Pan", price: 85, tags: ["sweet", "dessert", "hot"] },
  { id: "dessert-12", category: "dessert", nameAr: "طاجن نوتيلا وايت", nameEn: "White Nutella Pan", price: 85, tags: ["sweet", "dessert", "hot"] },
  { id: "dessert-13", category: "dessert", nameAr: "وافل شوكولاتة كراميل", nameEn: "Chocolate Caramel Waffle", price: 85, tags: ["sweet", "dessert", "hot"] },
  { id: "dessert-14", category: "dessert", nameAr: "وافل نوتيلا لوتس", nameEn: "Nutella Lotus Waffle", price: 90, tags: ["sweet", "dessert", "hot"] },
  { id: "dessert-15", category: "dessert", nameAr: "وافل نوتيلا وايت فواكه", nameEn: "White Nutella Fruits Waffle", price: 100, tags: ["sweet", "dessert", "hot"] },
  { id: "dessert-16", category: "dessert", nameAr: "قشطوطة مانجو", nameEn: "Mango Qeshtota", price: 85, tags: ["sweet", "dessert", "cold", "fresh", "fruity"] },
  { id: "dessert-17", category: "dessert", nameAr: "قشطوطة خوخ", nameEn: "Peach Qeshtota", price: 85, tags: ["sweet", "dessert", "cold", "fresh", "fruity"] },
  { id: "dessert-18", category: "dessert", nameAr: "قشطوطة اناناس", nameEn: "Pineapple Qeshtota", price: 85, tags: ["sweet", "dessert", "cold", "fresh", "fruity"] },
  { id: "dessert-19", category: "dessert", nameAr: "قشطوطة فواكه", nameEn: "Fruits Qeshtota", price: 89, tags: ["sweet", "dessert", "cold", "fresh", "fruity"] },
  // ---- Shisha ----
  { id: "shisha-01", category: "shisha", nameAr: "شيشة قص", nameEn: "Shisha Plain", price: 30, tags: ["shisha"] },
  { id: "shisha-02", category: "shisha", nameAr: "شيشة سلوم", nameEn: "Saloum Shisha", price: 30, tags: ["shisha"] },
  { id: "shisha-03", category: "shisha", nameAr: "شيشة فواكه", nameEn: "Fruit Shisha", price: 115, tags: ["shisha"] },
  { id: "shisha-04", category: "shisha", nameAr: "لي طبي", nameEn: "Medical Mouthpiece", price: 20, tags: ["shisha"] },
];

/* ==========================================================================
   3. I18N — all UI text, Arabic + English
   ========================================================================== */
const I18N = {
  en: {
    skip: "Skip to menu", switchLang: "Switch to Arabic", langLabel: "عربي",
    greetMorning: "Good morning", greetAfternoon: "Good afternoon", greetEvening: "Good evening",
    welcome: "Welcome to Amori. Pull up a chair — something lovely is one tap away.",
    surprise: "Surprise me", quiz: "Mood quiz", quizSub: "3 quick taps, 3 perfect picks",
    searchLabel: "Search the menu", searchPh: "Search the menu…", clearSearch: "Clear search",
    filters: "Filters", favorites: "Favorites", catNav: "Menu categories",
    priceRange: "Price range (EGP)", from: "From", to: "To", categories: "Categories", reset: "Reset filters",
    showing: "Showing {n} of {total}",
    emptyT: "Nothing matches yet", emptyP: "Try another word, or loosen the filters.",
    emptyFavT: "No favorites yet", emptyFavP: "Tap the heart on any item to save it here.",
    add: "Add {name} to order", inc: "More {name}", dec: "Less {name}", favAdd: "Add {name} to favorites", favRemove: "Remove {name} from favorites",
    table: "Table {t}", tableLabel: "Table number", tablePh: "e.g. 5 or A3", change: "Change",
    tableRequired: "Please scan the QR code on your table to place an order.",
    viewOrder: "View order", myOrder: "My order", close: "Close",
    orderEmpty: "Your order is empty. Tap + on any item to add it.",
    subtotal: "Subtotal", vat: "VAT 14%", total: "Total", egp: "EGP",
    estimate: "This is an estimate for your convenience, not an official bill. The final bill is issued by the cafe.",
    notesLabel: "Notes (optional)", notesPh: "e.g. no sugar",
    sendWa: "Send via WhatsApp", copyOrder: "Copy order", copied: "Order copied",
    sendNoteWa: "Your order is only sent once you press Send in WhatsApp.",
    sendNoteCopy: "Copy your order and show it to your waiter.",
    needTable: "Scan the QR code on your table to order.",
    clearOrder: "Clear order", clearConfirm: "Tap again to clear", cleared: "Order cleared", added: "Added: {name}",
    surpriseFrom: "Pick from", maxBudget: "Max budget", spin: "Pick for me", spinning: "Choosing…",
    yourPick: "Your surprise", tryAnother: "Try another", addToOrder: "Add to order", favorite: "Favorite", favorited: "Favorited",
    surpriseNone: "Nothing fits those filters. Raise the budget or add a category.",
    surpriseHint: "Tap “Pick for me” and let us choose.",
    quizQ1: "Hot or cold?", quizQ2: "What's your mood?", quizQ3: "Budget?",
    hot: "Hot", cold: "Cold", sweet: "Sweet", fresh: "Fresh", strong: "Strong",
    sweetD: "Cozy & indulgent", freshD: "Light & refreshing", strongD: "Bold & awake",
    light: "Light", medium: "Medium", treat: "Treat myself",
    lightD: "up to {a}", mediumD: "{a}–{b}", treatD: "{a}+",
    yourTop3: "Your top 3", startOver: "Start over", back: "Back", quizNone: "We couldn't find a match. Start over!",
    reason_hot_sweet: "Warm, cozy and a little indulgent — a hug in a cup.",
    reason_hot_fresh: "Gentle and soothing, with a clean, fresh finish.",
    reason_hot_strong: "Bold and rich, for when you want it properly strong.",
    reason_cold_sweet: "Cool, creamy and sweet — pure treat energy.",
    reason_cold_fresh: "Bright, icy and refreshing — an instant reset.",
    reason_cold_strong: "Cold with a real kick to wake up your mood.",
    reason_loose: "Not an exact match, but a guest favorite worth trying.",
    extra_vip: "A VIP treat.", extra_dessert: "Dessert-lover approved.", extra_creamy: "Silky and creamy.", extra_fruity: "Fruity and bright.",
    footVat: "All prices exclude 14% VAT",
    hours: "Heliopolis · Daily 8 AM – 3 AM",
    waHello: "Hello Amori! I'd like to order:", waTable: "Table: {t}", waNotes: "Notes: {n}",
    waEstimate: "(Estimate — the final bill is issued by the cafe)"
  },
  ar: {
    skip: "تخطَّ إلى المنيو", switchLang: "التبديل إلى الإنجليزية", langLabel: "English",
    greetMorning: "صباح الخير", greetAfternoon: "نهارك سعيد", greetEvening: "مساء الخير",
    welcome: "أهلاً بك في أموري. تفضّل بالجلوس، وأجمل مشروب على بُعد لمسة.",
    surprise: "فاجئني", quiz: "اختبار المزاج", quizSub: "3 نقرات سريعة و3 اقتراحات مناسبة",
    searchLabel: "ابحث في المنيو", searchPh: "ابحث في المنيو…", clearSearch: "مسح البحث",
    filters: "تصفية", favorites: "المفضلة", catNav: "أقسام المنيو",
    priceRange: "نطاق السعر (جنيه)", from: "من", to: "إلى", categories: "الأقسام", reset: "إعادة ضبط التصفية",
    showing: "عرض {n} من {total}",
    emptyT: "لا توجد نتائج", emptyP: "جرّب كلمة أخرى، أو خفّف التصفية.",
    emptyFavT: "لا توجد مفضلات بعد", emptyFavP: "اضغط على القلب بجوار أي صنف لحفظه هنا.",
    add: "أضف {name} إلى الطلب", inc: "زيادة {name}", dec: "إنقاص {name}", favAdd: "أضف {name} إلى المفضلة", favRemove: "احذف {name} من المفضلة",
    table: "طاولة {t}", tableLabel: "رقم الطاولة", tablePh: "مثال: 5 أو A3", change: "تغيير",
    tableRequired: "من فضلك امسح رمز QR الموجود على طاولتك لتتمكن من الطلب.",
    viewOrder: "عرض الطلب", myOrder: "طلبي", close: "إغلاق",
    orderEmpty: "طلبك فارغ. اضغط + بجوار أي صنف لإضافته.",
    subtotal: "المجموع الفرعي", vat: "ضريبة القيمة المضافة 14%", total: "الإجمالي", egp: "ج.م",
    estimate: "هذا تقدير لراحتك وليس فاتورة رسمية. الفاتورة النهائية يصدرها الكافيه.",
    notesLabel: "ملاحظات (اختياري)", notesPh: "مثال: بدون سكر",
    sendWa: "إرسال عبر واتساب", copyOrder: "نسخ الطلب", copied: "تم نسخ الطلب",
    sendNoteWa: "لن يُرسل طلبك إلا بعد أن تضغط «إرسال» في واتساب.",
    sendNoteCopy: "انسخ طلبك واعرضه على النادل.",
    needTable: "امسح رمز QR على طاولتك للطلب.",
    clearOrder: "مسح الطلب", clearConfirm: "اضغط مرة أخرى للمسح", cleared: "تم مسح الطلب", added: "تمت إضافة: {name}",
    surpriseFrom: "اختر من", maxBudget: "أقصى ميزانية", spin: "اختر لي", spinning: "جارٍ الاختيار…",
    yourPick: "مفاجأتك", tryAnother: "جرّب غيره", addToOrder: "أضف للطلب", favorite: "مفضلة", favorited: "في المفضلة",
    surpriseNone: "لا يوجد ما يناسب هذه التصفية. ارفع الميزانية أو أضف قسمًا.",
    surpriseHint: "اضغط «اختر لي» ودعنا نختار.",
    quizQ1: "ساخن أم بارد؟", quizQ2: "ما مزاجك؟", quizQ3: "الميزانية؟",
    hot: "ساخن", cold: "بارد", sweet: "حلو", fresh: "منعش", strong: "قوي",
    sweetD: "دافئ ومدلّل", freshD: "خفيف ومنعش", strongD: "غني ومنبّه",
    light: "خفيفة", medium: "متوسطة", treat: "دلّع نفسك",
    lightD: "حتى {a}", mediumD: "{a}–{b}", treatD: "{a}+",
    yourTop3: "أفضل 3 اختيارات لك", startOver: "ابدأ من جديد", back: "رجوع", quizNone: "لم نجد اقتراحًا مناسبًا. ابدأ من جديد!",
    reason_hot_sweet: "دافئ ومريح وفيه دلع بسيط — حضن في كوب.",
    reason_hot_fresh: "هادئ ومريح بلمسة منعشة.",
    reason_hot_strong: "قوي وغني لمن يريده بمزاج عالٍ.",
    reason_cold_sweet: "بارد وكريمي وحلو — لحظة تدليل.",
    reason_cold_fresh: "منعش وبارد — يعيد لك نشاطك فورًا.",
    reason_cold_strong: "بارد بنكهة قوية توقظ مزاجك.",
    reason_loose: "ليس مطابقًا تمامًا، لكنه من مفضلات ضيوفنا ويستحق التجربة.",
    extra_vip: "من تشكيلة VIP.", extra_dessert: "اختيار عشاق الحلويات.", extra_creamy: "ناعم وكريمي.", extra_fruity: "بنكهة فاكهة مبهجة.",
    footVat: "جميع الأسعار لا تشمل ضريبة القيمة المضافة 14%",
    hours: "مصر الجديدة · يوميًا من 8 صباحًا حتى 3 فجرًا",
    waHello: "مرحبًا أموري! أود طلب التالي:", waTable: "الطاولة: {t}", waNotes: "ملاحظات: {n}",
    waEstimate: "(تقدير — الفاتورة النهائية يصدرها الكافيه)"
  }
};

/* ==========================================================================
   4. STATE + STORAGE (every localStorage call is wrapped; falls back to memory)
   ========================================================================== */
const memStore = {};
const store = {
  get(k) { try { const v = localStorage.getItem(k); return v === null ? (memStore[k] ?? null) : v; } catch (e) { return memStore[k] ?? null; } },
  set(k, v) { memStore[k] = v; try { localStorage.setItem(k, v); } catch (e) { /* storage blocked: keep in memory */ } },
  del(k) { delete memStore[k]; try { localStorage.removeItem(k); } catch (e) { /* ignore */ } }
};
const readJSON = (k, fallback) => { try { const v = JSON.parse(store.get(k)); return v ?? fallback; } catch (e) { return fallback; } };

const BYID = Object.fromEntries(MENU.map(i => [i.id, i]));
const CATBYID = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));
const PRICES = MENU.map(i => i.price);
const PRICE_LO = Math.floor(Math.min(...PRICES) / 5) * 5;
const PRICE_HI = Math.ceil(Math.max(...PRICES) / 5) * 5;
const REDUCED = () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

const state = {
  lang: "en",
  cart: {},            // id -> qty
  favs: new Set(),
  table: "",           // validated table code or ""
  tableLocked: false,  // true when the table came from the QR link: the customer cannot change it
  notes: "",
  search: "",
  pMin: PRICE_LO, pMax: PRICE_HI,
  catFilter: new Set(), // empty = all categories
  favOnly: false,
  surprise: { cats: new Set(CATEGORIES.map(c => c.id).filter(c => !SURPRISE_EXCLUDED_DEFAULT.includes(c))), budget: PRICE_HI, last: null, current: null },
  quiz: { step: 0, temp: null, taste: null, budget: null }
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const t = (k, vars) => {
  let s = (I18N[state.lang] && I18N[state.lang][k]) ?? I18N.en[k] ?? k;
  if (vars) for (const v in vars) s = s.split("{" + v + "}").join(vars[v]);
  return s;
};
const money = n => { n = Math.round(n * 100) / 100; return Number.isInteger(n) ? String(n) : n.toFixed(2); };
const nameMain = i => state.lang === "ar" ? i.nameAr : i.nameEn;
const nameSub = i => state.lang === "ar" ? i.nameEn : i.nameAr;
const catMain = c => state.lang === "ar" ? c.ar : c.en;
const catSub = c => state.lang === "ar" ? c.en : c.ar;
const L = lang => ` lang="${lang}" dir="${lang === "ar" ? "rtl" : "ltr"}"`;
const mainLang = () => state.lang;
const subLang = () => state.lang === "ar" ? "en" : "ar";

/* ==========================================================================
   5. SEARCH NORMALISATION (Arabic + English)
   ========================================================================== */
function norm(s) {
  return String(s).toLowerCase()
    .replace(/[ً-ٰٟـ]/g, "")   // diacritics + tatweel
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d))
    .replace(/\s+/g, " ").trim();
}
MENU.forEach(i => { i._s = norm(i.nameAr + " " + i.nameEn); });

/* ==========================================================================
   6. TABLE NUMBER (?table=5)
   ========================================================================== */
const TABLE_RE = /^[A-Z0-9]{1,4}$/;
function cleanTable(v) {
  v = String(v || "").trim().toUpperCase().replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
  return TABLE_RE.test(v) ? v : "";
}
function tableKey(tb) {                          // FNV-1a hash of secret + table -> 5 base-36 chars
  let h = 0x811c9dc5;
  const str = TABLE_SECRET + "|" + tb;
  for (let n = 0; n < str.length; n++) { h ^= str.charCodeAt(n); h = Math.imul(h, 16777619) >>> 0; }
  return h.toString(36).padStart(5, "0").slice(-5);
}
function syncTableToURL() {
  try {
    const u = new URL(location.href);
    if (state.table) { u.searchParams.set("table", state.table); u.searchParams.set("k", tableKey(state.table)); }
    else { u.searchParams.delete("table"); u.searchParams.delete("k"); }
    history.replaceState(null, "", u.pathname + u.search + u.hash);
  } catch (e) { /* e.g. file:// or restricted history: ignore */ }
}
function saveTable() {
  if (state.table) store.set("amori.table", JSON.stringify({ v: state.table, ts: Date.now() }));
  else store.del("amori.table");
  syncTableToURL();
}
// Rules: a valid signed link (QR scan) sets the table. Any other ?table= value is ignored.
// While a scanned table is remembered (TABLE_TTL_MS), it always wins, so a customer can't hop to another table.
function initTable() {
  let raw = "", key = "";
  try { const p = new URLSearchParams(location.search); raw = p.get("table") || ""; key = p.get("k") || ""; } catch (e) { /* ignore */ }
  const want = cleanTable(raw), signed = !!want && key === tableKey(want);
  const saved = readJSON("amori.table", null);
  const fresh = saved && cleanTable(saved.v) && Date.now() - saved.ts < TABLE_TTL_MS ? cleanTable(saved.v) : "";
  if (signed) {
    if (fresh !== want) {                          // new table / new visit: start with an empty order
      state.cart = {}; saveCart();
    }
    state.table = want; state.tableLocked = true; saveTable();
  } else if (fresh) {
    state.table = fresh; state.tableLocked = true; syncTableToURL();   // keep remembered table, ignore the typed one
  } else {
    state.table = ""; state.tableLocked = false; store.del("amori.table"); syncTableToURL();
    state.cart = {}; saveCart();                   // no table session: nothing carries over
  }
}

/* ==========================================================================
   7. PERSISTENCE (cart, favourites, language)
   ========================================================================== */
function loadSaved() {
  const cart = readJSON("amori.cart", {});
  if (cart && typeof cart === "object") for (const id in cart) { const q = Math.floor(+cart[id]); if (BYID[id] && q > 0) state.cart[id] = Math.min(q, MAX_QTY); }
  const favs = readJSON("amori.favs", []);
  if (Array.isArray(favs)) favs.forEach(id => { if (BYID[id]) state.favs.add(id); });
}
const saveCart = () => store.set("amori.cart", JSON.stringify(state.cart));
const saveFavs = () => store.set("amori.favs", JSON.stringify([...state.favs]));
function detectLang() {
  const saved = store.get("amori.lang");
  if (saved === "ar" || saved === "en") return saved;
  const nl = (navigator.language || (navigator.languages && navigator.languages[0]) || "").toLowerCase();
  return nl.startsWith("ar") ? "ar" : "en";
}

/* ==========================================================================
   8. ORDER MATH
   ========================================================================== */
function orderTotals() {
  let count = 0, sub = 0;
  for (const id in state.cart) { count += state.cart[id]; sub += state.cart[id] * BYID[id].price; }
  const vat = Math.round(sub * VAT_RATE * 100) / 100;
  return { count, sub, vat, total: Math.round((sub + vat) * 100) / 100 };
}
function setQty(id, q) {
  q = Math.max(0, Math.min(MAX_QTY, q));
  if (q === 0) delete state.cart[id]; else state.cart[id] = q;
  saveCart();
  refreshItem(id);
  renderFab();
  if (isOpen("order")) renderOrder();
  refreshSurpriseCard();
}

/* ==========================================================================
   9. RENDER — menu, category bar, filters
   ========================================================================== */
const ICON = n => `<svg class="i" aria-hidden="true"><use href="#i-${n}"/></svg>`;

function qtyHTML(i, small) {
  const q = state.cart[i.id] || 0, nm = esc(nameMain(i));
  if (!q) return `<button class="q-add" type="button" data-act="inc" data-id="${i.id}" aria-label="${esc(t("add", { name: nameMain(i) }))}">${ICON("plus")}</button>`;
  return `<div class="stepper${small ? " sm" : ""}" role="group" aria-label="${nm}">
    <button type="button" data-act="dec" data-id="${i.id}" aria-label="${esc(t("dec", { name: nameMain(i) }))}">${ICON("minus")}</button>
    <b aria-live="polite">${q}</b>
    <button type="button" data-act="inc" data-id="${i.id}" aria-label="${esc(t("inc", { name: nameMain(i) }))}">${ICON("plus")}</button></div>`;
}
const favLabel = i => t(state.favs.has(i.id) ? "favRemove" : "favAdd", { name: nameMain(i) });
function favHTML(i) {
  return `<button class="fav" type="button" data-act="fav" data-id="${i.id}" aria-pressed="${state.favs.has(i.id)}" aria-label="${esc(favLabel(i))}">${ICON("heart")}</button>`;
}
function itemHTML(i) {
  return `<li class="item${state.cart[i.id] ? " incart" : ""}" data-id="${i.id}">
    <div class="names"><span class="n1"${L(mainLang())}>${esc(nameMain(i))}</span><span class="n2"${L(subLang())}>${esc(nameSub(i))}</span></div>
    <span class="price">${i.price}</span>
    <div class="row2">${favHTML(i)}<div class="qty">${qtyHTML(i)}</div></div>
  </li>`;
}

let revealIO = null;
function renderMenu(animate) {
  $("#menu").innerHTML = CATEGORIES.map((c, n) => {
    const items = MENU.filter(i => i.category === c.id);
    return `<section class="section" id="cat-${c.id}" data-cat="${c.id}" aria-labelledby="h-${c.id}">
      <div class="sect-head"><span class="num" aria-hidden="true">${String(n + 1).padStart(2, "0")}</span><h2 class="display" id="h-${c.id}"${L(mainLang())}>${esc(catMain(c))}</h2><span class="sect-sub"${L(subLang())}>${esc(catSub(c))}</span><div class="orn" aria-hidden="true"><i></i></div></div>
      <ul class="items">${items.map(itemHTML).join("")}</ul></section>`;
  }).join("");
  if (animate && "IntersectionObserver" in window && !REDUCED()) {
    revealIO && revealIO.disconnect();
    let batch = 0, timer = 0;
    revealIO = new IntersectionObserver(entries => {
      entries.filter(e => e.isIntersecting).forEach(e => {
        e.target.style.setProperty("--d", Math.min(batch++, 6) * 55 + "ms");
        e.target.classList.add("in");
        revealIO.unobserve(e.target);
      });
      clearTimeout(timer); timer = setTimeout(() => { batch = 0; }, 120);
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.05 });
    $$(".item, .sect-head").forEach(el => { el.classList.add("reveal"); revealIO.observe(el); });
  }
  applyFilters();
}
function refreshItem(id) {
  const i = BYID[id], li = $(`.item[data-id="${id}"]`);
  if (!li) return;
  li.classList.toggle("incart", !!state.cart[id]);
  $(".qty", li).innerHTML = qtyHTML(i);
  const f = $(".fav", li);
  f.setAttribute("aria-pressed", state.favs.has(id)); f.setAttribute("aria-label", favLabel(i));
}
function toggleFav(id) {
  state.favs.has(id) ? state.favs.delete(id) : state.favs.add(id);
  saveFavs(); refreshItem(id); renderFavBadge();
  if (state.favOnly) applyFilters();
  refreshSurpriseCard();
}

function renderCatBar() {
  $("#catscroll").innerHTML = CATEGORIES.map(c => `<button class="cat" type="button" data-cat="${c.id}"${L(mainLang())}>${esc(catMain(c))}</button>`).join("");
  spy(true);
}
function renderFilterChips() {
  $("#filterChips").innerHTML = CATEGORIES.map(c => `<button class="chip" type="button" data-cat="${c.id}" aria-pressed="${state.catFilter.has(c.id)}"${L(mainLang())}>${esc(catMain(c))}</button>`).join("");
}
function renderFavBadge() {
  const n = state.favs.size, b = $("#favNum");
  b.hidden = !n; b.textContent = n;
}

/* ==========================================================================
   10. FILTERS + SEARCH
   ========================================================================== */
function filtersActive() { return state.pMin > PRICE_LO || state.pMax < PRICE_HI || state.catFilter.size > 0; }
function anyFilter() { return !!state.search || filtersActive() || state.favOnly; }

function applyFilters() {
  const tokens = norm(state.search).split(" ").filter(Boolean);
  let shown = 0;
  $$(".section").forEach(sec => {
    const cid = sec.dataset.cat;
    const catOk = state.catFilter.size === 0 || state.catFilter.has(cid);
    let n = 0;
    $$(".item", sec).forEach(li => {
      const i = BYID[li.dataset.id];
      const ok = catOk && i.price >= state.pMin && i.price <= state.pMax && (!state.favOnly || state.favs.has(i.id)) && tokens.every(tk => i._s.includes(tk));
      li.hidden = !ok; if (ok) n++;
    });
    sec.hidden = n === 0; shown += n;
    const btn = $(`.cat[data-cat="${cid}"]`); if (btn) btn.hidden = n === 0;
  });
  $("#count").textContent = t("showing", { n: shown, total: MENU.length });
  $("#empty").hidden = shown !== 0;
  if (shown === 0) {
    const favEmpty = state.favOnly && !state.search && !filtersActive();
    $("#emptyT").textContent = t(favEmpty ? "emptyFavT" : "emptyT");
    $("#emptyP").textContent = t(favEmpty ? "emptyFavP" : "emptyP");
  }
  $("#filterDot").hidden = !filtersActive();
  $("#qClear").hidden = !state.search;
  $("#favBtn").setAttribute("aria-pressed", state.favOnly);
  $("#resetBtn").hidden = !anyFilter();
  requestAnimationFrame(() => { measureSticky(); spy(true); });
}
function resetFilters() {
  state.search = ""; $("#q").value = "";
  state.pMin = PRICE_LO; state.pMax = PRICE_HI; syncRanges();
  state.catFilter.clear(); state.favOnly = false;
  renderFilterChips(); applyFilters();
}
function syncRanges() {
  $("#pMin").value = state.pMin; $("#pMax").value = state.pMax;
  $("#pMinOut").textContent = state.pMin; $("#pMaxOut").textContent = state.pMax;
}

/* ==========================================================================
   11. STICKY BAR + SCROLL-SPY
   ========================================================================== */
let activeCat = null, spyQueued = false;
function measureSticky() {
  const h = $("#catbar").offsetHeight;
  if (h) document.documentElement.style.setProperty("--sticky-h", h + "px");
}
function setActive(id, instant) {
  if (id === activeCat && !instant) return;
  activeCat = id;
  $$(".cat").forEach(b => {
    const on = b.dataset.cat === id;
    if (on) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current");
  });
  const b = $(`.cat[data-cat="${id}"]`);
  if (b && !b.hidden) { try { b.scrollIntoView({ inline: "center", block: "nearest", behavior: REDUCED() || instant ? "auto" : "smooth" }); } catch (e) { /* old browsers */ } }
}
function spy(force) {
  if (spyQueued && !force) return;
  spyQueued = true;
  requestAnimationFrame(() => {
    spyQueued = false;
    const bar = $("#catbar");
    bar.classList.toggle("stuck", bar.getBoundingClientRect().top <= 0.5);
    const line = bar.offsetHeight + 24;
    const secs = $$(".section").filter(s => !s.hidden);
    if (!secs.length) return;
    let cur = secs[0].dataset.cat;
    for (const s of secs) { if (s.getBoundingClientRect().top <= line) cur = s.dataset.cat; else break; }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) cur = secs[secs.length - 1].dataset.cat;
    setActive(cur, false);
  });
}
function goToCat(id) {
  const sec = $("#cat-" + id); if (!sec) return;
  activeCat = null; setActive(id, false);
  sec.scrollIntoView({ behavior: REDUCED() ? "auto" : "smooth", block: "start" });
}

/* ==========================================================================
   12. LANGUAGE
   ========================================================================== */
function applyLang(persist) {
  const lang = state.lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.title = lang === "ar" ? "أموري كافيه & لاونج — المنيو" : "AMORI Cafe & Lounge — Menu";
  if (persist) store.set("amori.lang", lang);
  $$("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  $$("[data-i18n-ph]").forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  $$("[data-i18n-aria]").forEach(el => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
  const lb = $("#langBtn"); lb.textContent = t("langLabel"); lb.setAttribute("aria-label", t("switchLang")); lb.setAttribute("lang", lang === "ar" ? "en" : "ar");
  const h = new Date().getHours();
  $("#greet").textContent = t(h >= 5 && h < 12 ? "greetMorning" : h >= 12 && h < 17 ? "greetAfternoon" : "greetEvening");
  $("#vatNote").textContent = t("footVat"); $("#hours").textContent = t("hours");
  $("#spinBtn").textContent = t(state.surprise.current ? "tryAnother" : "spin");
  renderTableUI();
  renderMenu(false); renderCatBar(); renderFilterChips(); renderFavBadge(); renderFab();
  renderOrder(); renderSurprise(); renderQuiz();
  measureSticky();
}

/* ==========================================================================
   13. FLOATING BUTTON + TOAST
   ========================================================================== */
function renderFab() {
  const { count, sub } = orderTotals(), fab = $("#fab");
  const was = fab.hidden;
  fab.hidden = count === 0 || isAnyOpen();
  $("#fabCount").textContent = count;
  $("#fabTotal").textContent = money(sub) + " " + t("egp");
  fab.setAttribute("aria-label", `${t("viewOrder")}: ${count} · ${money(sub)} ${t("egp")}`);
  if (!fab.hidden && !REDUCED() && !was) { fab.classList.remove("bump"); void fab.offsetWidth; fab.classList.add("bump"); }
}
let toastT = 0;
function toast(msg) {
  const el = $("#toast"); el.textContent = msg; el.classList.toggle("top", isAnyOpen()); el.classList.add("show");
  clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove("show"), 1900);
}

/* ==========================================================================
   14. SHEETS (generic open/close, focus handling)
   ========================================================================== */
const openers = {};
const isOpen = n => { const s = $("#sheet-" + n); return !!s && !s.hidden && s.classList.contains("open"); };
const isAnyOpen = () => $$(".sheet").some(s => !s.hidden);
function openSheet(name) {
  const s = $("#sheet-" + name);
  openers[name] = document.activeElement;
  s.hidden = false; void s.offsetWidth; s.classList.add("open");
  document.body.style.overflow = "hidden"; $("#app").inert = true; $("#fab").hidden = true; $("#toast").classList.remove("show");
  const p = $(".sheet-panel", s);
  setTimeout(() => p.focus({ preventScroll: true }), 30);
}
function closeSheet(name) {
  const s = $("#sheet-" + name); if (s.hidden) return;
  s.classList.remove("open");
  const done = () => {
    s.hidden = true;
    if (!isAnyOpen()) { document.body.style.overflow = ""; $("#app").inert = false; }
    renderFab();
    const o = openers[name]; if (o && document.contains(o) && !o.hidden) o.focus({ preventScroll: true });
  };
  REDUCED() ? done() : setTimeout(done, 300);
}

/* ==========================================================================
   15. MY ORDER SHEET + WHATSAPP
   ========================================================================== */
let clearArmed = 0;
function renderTableUI() {
  const has = !!state.table;
  const hb = $("#headTable"); hb.hidden = !has; hb.textContent = has ? t("table", { t: state.table }) : "";
  $("#sheetTable").textContent = has ? t("table", { t: state.table }) : "";
  $("#tableShown").hidden = !has;
  $("#tableErr").hidden = has;
  updateSendState();
}
function orderMessage() {
  const { sub, vat, total } = orderTotals();
  const lines = [t("waHello"), t("waTable", { t: state.table }), ""];
  for (const id in state.cart) { const i = BYID[id], q = state.cart[id]; lines.push(`• ${q}× ${nameMain(i)} — ${money(i.price * q)}`); }
  lines.push("", `${t("subtotal")}: ${money(sub)}`, `${t("vat")}: ${money(vat)}`, `${t("total")}: ${money(total)} ${t("egp")}`);
  const n = state.notes.trim();
  if (n) lines.push("", t("waNotes", { n }));
  lines.push("", t("waEstimate"));
  return lines.join("\n");
}
const waNumber = () => String(WHATSAPP_NUMBER || "").replace(/\D/g, "");
function updateSendState() {
  const hasWA = !!waNumber(), ok = !!state.table && orderTotals().count > 0;
  const wa = $("#waBtn"), cp = $("#copyBtn");
  wa.hidden = !hasWA; wa.disabled = !ok; cp.disabled = !ok;
  cp.className = "btn " + (hasWA ? "btn-line" : "btn-gold btn-wa");
  $("#sendNote").textContent = !state.table ? t("needTable") : t(hasWA ? "sendNoteWa" : "sendNoteCopy");
  $("#orderFoot").hidden = orderTotals().count === 0;
}
function renderOrder() {
  const { count, sub, vat, total } = orderTotals();
  $("#orderEmpty").hidden = count > 0; $("#orderFull").hidden = count === 0;
  $("#clearBtn").hidden = count === 0;
  $("#olist").innerHTML = Object.keys(state.cart).map(id => {
    const i = BYID[id], q = state.cart[id];
    return `<div class="oitem"><div class="names"><span class="n1"${L(mainLang())}>${esc(nameMain(i))}</span><span class="unit">${i.price} × ${q}</span></div>
      <div class="oright"><span class="line">${money(i.price * q)}</span>${qtyHTML(i, true)}</div></div>`;
  }).join("");
  $("#tSub").textContent = `${money(sub)} ${t("egp")}`;
  $("#tVat").textContent = `${money(vat)} ${t("egp")}`;
  $("#tTot").textContent = `${money(total)} ${t("egp")}`;
  $("#clearBtn").textContent = t(clearArmed ? "clearConfirm" : "clearOrder");
  updateSendState();
  if (count === 0 && isOpen("order")) { /* keep the sheet open to show the empty message */ }
}
function sendWhatsApp() {
  if (!state.table || !waNumber()) return;
  const url = `https://wa.me/${waNumber()}?text=${encodeURIComponent(orderMessage())}`;
  window.open(url, "_blank", "noopener");
}
async function copyOrder() {
  if (!state.table) return;
  const text = orderMessage();
  let ok = false;
  try { await navigator.clipboard.writeText(text); ok = true; } catch (e) { /* fall through */ }
  if (!ok) {
    const ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", ""); ta.style.cssText = "position:fixed;top:0;opacity:0";
    document.body.appendChild(ta); ta.select();
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    ta.remove();
  }
  if (ok) toast(t("copied")); else window.prompt("", text);
}

/* ==========================================================================
   16. SURPRISE ME
   ========================================================================== */
let spinTimer = 0;
function surprisePool() {
  const s = state.surprise;
  return MENU.filter(i => s.cats.has(i.category) && i.price <= s.budget);
}
function pickCardHTML(i, spinning) {
  const c = CATBYID[i.category], fav = state.favs.has(i.id), q = state.cart[i.id] || 0;
  return `<div class="pick${spinning ? " spinning" : " pop"}">
    <div class="kicker">${esc(t(spinning ? "spinning" : "yourPick"))}</div>
    <div class="pn1 display"${L(mainLang())}>${esc(nameMain(i))}</div>
    <div class="pn2"${L(subLang())}>${esc(nameSub(i))}</div>
    <div class="pprice">${i.price} <small style="font-size:14px;font-family:var(--f-sans);color:var(--amori-sand)">${esc(t("egp"))}</small></div>
    <div class="pcat"${L(mainLang())}>${esc(catMain(c))}</div>
    ${spinning ? "" : `<div class="pick-actions">
      <button class="btn btn-sand" type="button" data-sact="add">${ICON("plus")}<span>${esc(t("addToOrder"))}${q ? " (" + q + ")" : ""}</span></button>
      <button class="btn btn-line fav-act" type="button" data-sact="fav" aria-pressed="${fav}">${ICON("heart")}<span>${esc(t(fav ? "favorited" : "favorite"))}</span></button>
    </div>`}
  </div>`;
}
function renderSurprise() {
  const s = state.surprise, cur = s.current;
  $("#sCats").innerHTML = CATEGORIES.map(c => `<button class="chip" type="button" data-scat="${c.id}" aria-pressed="${s.cats.has(c.id)}"${L(mainLang())}>${esc(catMain(c))}</button>`).join("");
  const r = $("#sBudget"); r.min = PRICE_LO; r.max = PRICE_HI; r.step = 5; r.value = s.budget;
  $("#sBudgetOut").textContent = s.budget >= PRICE_HI ? `${PRICE_HI}+ ${t("egp")}` : `${s.budget} ${t("egp")}`;
  $("#stage").innerHTML = cur ? pickCardHTML(cur, false).replace("pick pop", "pick") : `<p class="note" style="text-align:center">${esc(t("surpriseHint"))}</p>`;
  $("#spinBtn").textContent = t(cur ? "tryAnother" : "spin");
}
function refreshSurpriseCard() {
  const s = state.surprise;
  if (!s.current || !isOpen("surprise") || $(".pick.spinning")) return;
  $("#stage").innerHTML = pickCardHTML(s.current, false).replace("pick pop", "pick");
}
function spin() {
  const s = state.surprise, btn = $("#spinBtn");
  clearTimeout(spinTimer);
  let pool = surprisePool();
  const alt = pool.filter(i => i.id !== s.last);
  if (!alt.length) {
    s.current = null; $("#stage").innerHTML = `<p class="note strong" style="text-align:center">${esc(t("surpriseNone"))}</p>`; return;
  }
  const final = alt[Math.floor(Math.random() * alt.length)];
  s.last = final.id;
  btn.disabled = true; btn.textContent = t("spinning");
  const finish = () => { s.current = final; btn.disabled = false; $("#stage").innerHTML = pickCardHTML(final, false); btn.textContent = t("tryAnother"); };
  if (REDUCED()) { finish(); return; }
  let n = 0, total = 14, delay = 55;
  const tick = () => {
    if (n >= total) { finish(); return; }
    $("#stage").innerHTML = pickCardHTML(pool[Math.floor(Math.random() * pool.length)], true);
    n++; delay *= 1.1; spinTimer = setTimeout(tick, delay);
  };
  tick();
}

/* ==========================================================================
   17. MOOD QUIZ
   ========================================================================== */
function budgetLevel(price) { return price <= BUDGET_LEVELS.lightMax ? 0 : price <= BUDGET_LEVELS.mediumMax ? 1 : 2; }
function quizPicks() {
  const { temp, taste, budget } = state.quiz;
  const scored = MENU.filter(i => !QUIZ_EXCLUDED.includes(i.category) && i.tags.includes(temp)).map(i => {
    const tasteHit = i.tags.includes(taste);
    const score = (tasteHit ? 4 : 0) + (2 - Math.abs(budgetLevel(i.price) - budget)) + Math.random() * 0.9;
    return { i, score, tasteHit };
  }).sort((a, b) => b.score - a.score);
  const out = [], used = new Set();
  while (out.length < 3 && scored.length) {   // prefer variety: different categories first
    scored.forEach(x => { x.adj = x.score - (used.has(x.i.category) ? 1.6 : 0); });
    scored.sort((a, b) => b.adj - a.adj);
    const x = scored.shift(); out.push(x); used.add(x.i.category);
  }
  return out;
}
function quizReason(i, tasteHit) {
  const q = state.quiz, extra = ["vip", "dessert", "creamy", "fruity"].find(k => i.tags.includes(k));
  return t(tasteHit ? `reason_${q.temp}_${q.taste}` : "reason_loose") + (extra ? " " + t("extra_" + extra) : "");
}
function renderQuiz() {
  const q = state.quiz, body = $("#qBody");
  $$("#qDots i").forEach((d, k) => d.classList.toggle("on", k <= Math.min(q.step, 2)));
  $("#qDots").hidden = q.step > 2;
  const back = q.step > 0 && q.step <= 2 ? `<div class="qnav"><button class="linkbtn" type="button" data-qback>${esc(t("back"))}</button></div>` : "";
  if (q.step === 0) {
    body.innerHTML = `<div class="qstep"><h3 class="display">${esc(t("quizQ1"))}</h3><div class="qgrid two">
      <button class="qbtn" type="button" data-qtemp="hot"><b>${esc(t("hot"))}</b></button>
      <button class="qbtn" type="button" data-qtemp="cold"><b>${esc(t("cold"))}</b></button></div></div>`;
  } else if (q.step === 1) {
    body.innerHTML = `<div class="qstep"><h3 class="display">${esc(t("quizQ2"))}</h3><div class="qgrid">
      ${["sweet", "fresh", "strong"].map(k => `<button class="qbtn" type="button" data-qtaste="${k}"><b>${esc(t(k))}</b><span>${esc(t(k + "D"))}</span></button>`).join("")}</div>${back}</div>`;
  } else if (q.step === 2) {
    const B = BUDGET_LEVELS;
    const d = [t("lightD", { a: B.lightMax }), t("mediumD", { a: B.lightMax + 1, b: B.mediumMax }), t("treatD", { a: B.mediumMax + 1 })];
    body.innerHTML = `<div class="qstep"><h3 class="display">${esc(t("quizQ3"))}</h3><div class="qgrid">
      ${["light", "medium", "treat"].map((k, n) => `<button class="qbtn" type="button" data-qbudget="${n}"><b>${esc(t(k))}</b><span>${esc(d[n])} ${esc(t("egp"))}</span></button>`).join("")}</div>${back}</div>`;
  } else {
    const picks = state.quiz.picks || (state.quiz.picks = quizPicks());
    body.innerHTML = `<div class="qstep"><h3 class="display">${esc(t("yourTop3"))}</h3><div class="qresult">${
      picks.length ? picks.map(({ i, tasteHit }, n) => `<div class="rcard" style="animation-delay:${n * 90}ms">
        <div class="names"><span class="n1"${L(mainLang())}>${esc(nameMain(i))}</span><span class="n2"${L(subLang())}>${esc(nameSub(i))}</span></div>
        <span class="price">${i.price}</span>
        <p class="why">${esc(quizReason(i, tasteHit))}</p>
        <div class="row2">${favHTML(i)}<div class="qty">${qtyHTML(i)}</div></div></div>`).join("") : `<p class="note">${esc(t("quizNone"))}</p>`
    }</div><div class="qnav" style="justify-content:center"><button class="btn btn-line" type="button" data-qrestart>${esc(t("startOver"))}</button></div></div>`;
  }
}
function resetQuiz() { state.quiz = { step: 0, temp: null, taste: null, budget: null }; renderQuiz(); }

/* ==========================================================================
   18. EVENTS
   ========================================================================== */
function bindEvents() {
  // language
  $("#langBtn").addEventListener("click", () => { state.lang = state.lang === "ar" ? "en" : "ar"; applyLang(true); });

  // search + filters
  let st = 0;
  $("#q").addEventListener("input", e => { state.search = e.target.value; clearTimeout(st); st = setTimeout(applyFilters, 80); $("#qClear").hidden = !state.search; });
  $("#qClear").addEventListener("click", () => { state.search = ""; $("#q").value = ""; applyFilters(); $("#q").focus(); });
  $("#filterBtn").addEventListener("click", e => {
    const open = $("#filters").hidden; $("#filters").hidden = !open; e.currentTarget.setAttribute("aria-expanded", open);
    requestAnimationFrame(() => { measureSticky(); spy(true); });
  });
  $("#favBtn").addEventListener("click", () => { state.favOnly = !state.favOnly; applyFilters(); });
  const onRange = which => () => {
    let a = +$("#pMin").value, b = +$("#pMax").value;
    if (a > b) { if (which === "min") a = b; else b = a; }
    state.pMin = a; state.pMax = b; syncRanges(); applyFilters();
  };
  $("#pMin").min = $("#pMax").min = PRICE_LO; $("#pMin").max = $("#pMax").max = PRICE_HI; $("#pMin").step = $("#pMax").step = 5;
  $("#pMin").addEventListener("input", onRange("min")); $("#pMax").addEventListener("input", onRange("max"));
  $("#filterChips").addEventListener("click", e => {
    const b = e.target.closest("[data-cat]"); if (!b) return;
    const id = b.dataset.cat; state.catFilter.has(id) ? state.catFilter.delete(id) : state.catFilter.add(id);
    b.setAttribute("aria-pressed", state.catFilter.has(id)); applyFilters();
  });
  $("#resetBtn").addEventListener("click", resetFilters);
  $("#emptyReset").addEventListener("click", resetFilters);

  // category bar
  $("#catscroll").addEventListener("click", e => { const b = e.target.closest(".cat"); if (b) goToCat(b.dataset.cat); });
  window.addEventListener("scroll", () => spy(), { passive: true });
  window.addEventListener("resize", () => { measureSticky(); spy(true); });

  // menu items (delegated; also used inside the quiz results and order sheet)
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    const id = b.dataset.id, act = b.dataset.act;
    if (act === "fav") { toggleFav(id); if (isOpen("quiz")) renderQuizKeep(); return; }
    const q = state.cart[id] || 0;
    if (act === "inc") { setQty(id, q + 1); if (!q && !isOpen("order")) toast(t("added", { name: nameMain(BYID[id]) })); }
    if (act === "dec") setQty(id, q - 1);
    if (isOpen("quiz")) renderQuizKeep();
  });
  const renderQuizKeep = () => { const y = $("#sheet-quiz .sheet-body").scrollTop; renderQuiz(); $("#sheet-quiz .sheet-body").scrollTop = y; };

  // sheets
  document.addEventListener("click", e => {
    const c = e.target.closest("[data-close]"); if (!c) return;
    const s = c.closest(".sheet"); closeSheet(s.id.replace("sheet-", ""));
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { const s = $$(".sheet").find(x => !x.hidden); if (s) closeSheet(s.id.replace("sheet-", "")); }
  });
  $("#fab").addEventListener("click", () => { renderOrder(); openSheet("order"); });

  // order sheet
  $("#notes").addEventListener("input", e => { state.notes = e.target.value; });
  $("#waBtn").addEventListener("click", sendWhatsApp);
  $("#copyBtn").addEventListener("click", copyOrder);
  $("#clearBtn").addEventListener("click", () => {
    if (!clearArmed) { clearArmed = setTimeout(() => { clearArmed = 0; renderOrder(); }, 2600); renderOrder(); return; }
    clearTimeout(clearArmed); clearArmed = 0;
    Object.keys(state.cart).forEach(id => { delete state.cart[id]; refreshItem(id); });
    saveCart(); state.notes = ""; $("#notes").value = ""; renderFab(); renderOrder(); toast(t("cleared"));
  });

  // surprise
  $("#surpriseBtn").addEventListener("click", () => { renderSurprise(); openSheet("surprise"); });
  $("#spinBtn").addEventListener("click", spin);
  $("#sCats").addEventListener("click", e => {
    const b = e.target.closest("[data-scat]"); if (!b) return;
    const id = b.dataset.scat, s = state.surprise; s.cats.has(id) ? s.cats.delete(id) : s.cats.add(id);
    b.setAttribute("aria-pressed", s.cats.has(id));
  });
  $("#sBudget").addEventListener("input", e => {
    state.surprise.budget = +e.target.value;
    $("#sBudgetOut").textContent = state.surprise.budget >= PRICE_HI ? `${PRICE_HI}+ ${t("egp")}` : `${state.surprise.budget} ${t("egp")}`;
  });
  $("#stage").addEventListener("click", e => {
    const b = e.target.closest("[data-sact]"); if (!b || !state.surprise.current) return;
    const id = state.surprise.current.id;
    if (b.dataset.sact === "add") { setQty(id, (state.cart[id] || 0) + 1); toast(t("added", { name: nameMain(BYID[id]) })); }
    if (b.dataset.sact === "fav") toggleFav(id);
    refreshSurpriseCard();
  });

  // quiz
  $("#quizBtn").addEventListener("click", () => { resetQuiz(); openSheet("quiz"); });
  $("#qBody").addEventListener("click", e => {
    const q = state.quiz, el = e.target.closest("[data-qtemp],[data-qtaste],[data-qbudget],[data-qback],[data-qrestart]"); if (!el) return;
    if (el.dataset.qtemp) { q.temp = el.dataset.qtemp; q.step = 1; }
    else if (el.dataset.qtaste) { q.taste = el.dataset.qtaste; q.step = 2; }
    else if (el.dataset.qbudget) { q.budget = +el.dataset.qbudget; q.picks = null; q.step = 3; }
    else if (el.hasAttribute("data-qback")) { q.step = Math.max(0, q.step - 1); }
    else { resetQuiz(); return; }
    renderQuiz();
  });
}

/* ==========================================================================
   19. INIT + SELF-CHECK
   ========================================================================== */
const EXPECTED_COUNTS = { coffee: 24, hot: 26, juice: 16, soft: 9, mojito: 10, cocktail: 13, fruit: 11, milkshake: 18, smoothie: 16, iced: 13, dessert: 19, shisha: 4 };
function verifyCounts() {
  const bad = [];
  CATEGORIES.forEach(c => {
    const n = $$(`#cat-${c.id} .item`).length;
    if (EXPECTED_COUNTS[c.id] !== undefined && n !== EXPECTED_COUNTS[c.id]) bad.push(`${c.id}: ${n} (expected ${EXPECTED_COUNTS[c.id]})`);
  });
  const total = $$(".item").length;
  if (total !== 179) bad.push(`total: ${total} (expected 179)`);
  if (bad.length) console.warn("Amori menu count mismatch:", bad.join("; "));
  return bad.length === 0;
}

(function init() {
  if (LOGO_SRC) { const img = $("#logoImg"); img.src = LOGO_SRC; img.hidden = false; $("#wordmark").classList.add("sr"); }
  state.lang = detectLang();
  loadSaved();
  initTable();
  syncRanges();
  bindEvents();
  applyLang(false);
  renderMenu(true);        // second pass with entrance animation
  window.__amoriOK = verifyCounts();
  measureSticky(); spy(true);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measureSticky(); spy(true); });
})();
