"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Locale, defaultLocale } from "@/lib/i18n";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Translation dictionaries
const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.tours": "Collection",
    "nav.about": "About",
    "nav.cart": "Cart",
    "nav.signin": "Sign In",
    "nav.signup": "Sign Up",
    "nav.signout": "Sign Out",
    "nav.admin": "Admin Dashboard",

    // Home page
    "home.hero.title1": "Exquisite Antique Jewelry Collection",
    "home.hero.desc1":
      "Discover authentic vintage jewelry pieces with verified provenance and expert authentication from Wangmanee Gallery",
    "home.hero.title2": "Timeless Treasures & Collectibles",
    "home.hero.desc2":
      "From Victorian elegance to Art Deco glamour, each piece tells a story of historical craftsmanship and artistry",
    "home.hero.title3": "Heritage & Authentication",
    "home.hero.desc3":
      "Every jewelry piece comes with detailed provenance documentation and expert authentication certificates",
    "home.hero.explore": "Explore Collection",
    "home.featured.title": "Featured Pieces",
    "home.featured.subtitle": "Discover our most coveted antique jewelry pieces",
    "home.company.title": "Why Choose Wangmanee Gallery?",
    "home.company.desc":
      "With over 16 years of expertise in authenticating and curating exceptional antique jewelry, we specialize in connecting collectors with genuine pieces that embody historical artistry and timeless beauty. Located in Bangkok, Thailand, we serve collectors worldwide.",
    "home.cta.title": "Ready to Find Your Perfect Piece?",
    "home.cta.subtitle":
      "Join hundreds of satisfied collectors who have discovered their treasures with Wangmanee Gallery",
    "home.cta.browse": "Browse All Collections",
    "home.cta.learn": "Learn More About Us",

    // Collection page (formerly Tours page)
    "tours.title": "Discover Our Collection",
    "tours.subtitle":
      "Find your perfect treasure from our curated antique jewelry",
    "tours.search": "Search jewelry, styles, periods...",
    "tours.category.all": "All Categories",
    "tours.category.adventure": "Rings",
    "tours.category.cultural": "Necklaces",
    "tours.category.beach": "Bracelets",
    "tours.category.mountain": "Earrings",
    "tours.category.city": "Brooches",
    "tours.filters": "More Filters",
    "tours.showing": "Showing",
    "tours.tour": "piece",
    "tours.tours": "pieces",
    "tours.viewDetails": "View Details",
    "tours.addToCart": "Add to Cart",
    "tours.noResults": "No jewelry found matching your criteria.",
    "tours.clearFilters": "Clear Filters",

    // Cart page
    "cart.title": "Shopping Cart",
    "cart.empty.title": "Your cart is empty",
    "cart.empty.subtitle":
      "Discover exquisite antique jewelry and add them to your cart",
    "cart.empty.browse": "Browse Collection",
    "cart.summary": "Order Summary",
    "cart.subtotal": "Subtotal",
    "cart.serviceFee": "Service Fee",
    "cart.taxes": "Taxes",
    "cart.total": "Total",
    "cart.checkout": "Proceed to Checkout",
    "cart.signin.required": "Please sign in to proceed with checkout",
    "cart.continue": "Continue Shopping",
    "cart.processing": "Processing...",

    // Auth pages
    "auth.signin.title": "Welcome Back",
    "auth.signin.subtitle": "Sign in to your account",
    "auth.signin.email": "Email",
    "auth.signin.password": "Password",
    "auth.signin.button": "Sign In",
    "auth.signin.noAccount": "Don't have an account?",
    "auth.signin.demo": "Demo Accounts:",
    "auth.signup.title": "Create Account",
    "auth.signup.subtitle": "Join Wangmanee Gallery",
    "auth.signup.name": "Full Name",
    "auth.signup.confirmPassword": "Confirm Password",
    "auth.signup.button": "Create Account",
    "auth.signup.hasAccount": "Already have an account?",

    // Common
    "common.loading": "Loading...",
    "common.perPerson": "per piece",
    "common.days": "Era",
    "common.rating": "Rating",
    "common.features": "Features",
    "common.location": "Origin",
    "common.duration": "Period",
    "common.price": "Price",

    "auth.signup.fullNamePlaceholder": "Enter your full name",
    "auth.signup.emailPlaceholder": "Enter your email",
    "auth.signup.passwordPlaceholder": "Create a strong password",
    "auth.signup.confirmPasswordPlaceholder": "Confirm your password",
    "auth.signup.passwordRequirements":
      "Must be 8+ characters with uppercase, lowercase, and numbers",
    "auth.signup.accountType": "Account Type",
    "auth.signup.user": "Customer",
    "auth.signup.admin": "Admin",
    "auth.signup.creating": "Creating account...",

    "auth.signin.emailPlaceholder": "Enter your email",
    "auth.signin.passwordPlaceholder": "Enter your password",
    "auth.signin.signingIn": "Signing in...",
    "auth.signin.demoAccount": "Demo Account",
    "auth.signin.demoDesc1":
      "Create a new account to test the authentication flow",
    "auth.signin.demoDesc2": "Verification codes will be sent to your email",

    // Toast messages
    "toast.passwordMismatch": "Passwords do not match",
    "toast.passwordTooShort": "Password must be at least 8 characters",
    "toast.passwordWeak":
      "Password must contain uppercase, lowercase, and numbers",
    "toast.accountCreated":
      "Account created! Please check your email for verification code.",
    "toast.accountSuccess": "Account created successfully!",
    "toast.signInSuccess": "Signed in successfully!",
    "toast.verifyEmail": "Please verify your email first",
    "toast.invalidCredentials": "Invalid email or password",
    "toast.userNotFound": "No account found with this email",
    "toast.createAccountFailed": "Failed to create account",
    "toast.signInFailed": "Failed to sign in",

    //admin

    // Admin Navigation
    "admin.title": "Wangmanee Gallery Admin",
    "admin.subtitle": "Jewelry Management Panel",
    "admin.nav.dashboard": "Dashboard",
    "admin.nav.categories": "Categories",
    "admin.nav.tours": "Jewelry Collection",
    "admin.nav.bookings": "Orders",
    "admin.nav.customers": "Customers",
    "admin.nav.locations": "Origins",
    "admin.nav.media": "Media Library",
    "admin.nav.analytics": "Analytics",
    "admin.nav.reports": "Reports",
    "admin.nav.settings": "Settings",
    "admin.nav.logout": "Logout",
    "admin.search": "Search...",

    // Admin Profile
    "admin.profile.name": "Gallery Admin",
    "admin.profile.profile": "Profile",
    "admin.profile.settings": "Settings",
    "admin.profile.logout": "Log out",

    // Dashboard
    "admin.dashboard.title": "Dashboard",
    "admin.dashboard.subtitle": "Overview of Wangmanee Gallery operations",
    "admin.dashboard.quickActions": "Quick Actions",
    "admin.dashboard.overview": "Overview",
    "admin.dashboard.totalCategories": "Total Categories",
    "admin.dashboard.totalTours": "Total Pieces",
    "admin.dashboard.featuredTours": "Featured Items",
    "admin.dashboard.averagePrice": "Average Price",
    "admin.dashboard.active": "active",
    "admin.dashboard.toursByCategory": "Items by Category",
    "admin.dashboard.toursByCategoryDesc":
      "Distribution of jewelry across categories",
    "admin.dashboard.toursByDifficulty": "Items by Rarity",
    "admin.dashboard.toursByDifficultyDesc": "Breakdown by rarity level",
    "admin.dashboard.recentTours": "Recent Items",
    "admin.dashboard.recentToursDesc": "Latest jewelry pieces added",
    "admin.dashboard.viewAll": "View All",

    // Quick Actions
    "admin.quickActions.newTour": "Add New Jewelry",
    "admin.quickActions.newTourDesc": "Add a new jewelry piece",
    "admin.quickActions.newCategory": "Create Category",
    "admin.quickActions.newCategoryDesc": "Add a new jewelry category",
    "admin.quickActions.viewBookings": "View Orders",
    "admin.quickActions.viewBookingsDesc": "Manage customer orders",

    // Difficulty levels (now rarity levels)
    "admin.difficulty.easy": "Common",
    "admin.difficulty.moderate": "Rare",
    "admin.difficulty.challenging": "Very Rare",
    "admin.difficulty.extreme": "Museum Quality",

    // Categories
    "admin.categories.title": "Categories",
    "admin.categories.subtitle": "Manage jewelry categories",
    "admin.categories.create": "Create Category",
    "admin.categories.edit": "Edit Category",
    "admin.categories.name": "Category Name",
    "admin.categories.description": "Description",
    "admin.categories.slug": "Slug",
    "admin.categories.isActive": "Active",
    "admin.categories.actions": "Actions",
    "admin.categories.noCategories": "No categories found",
    "admin.categories.createFirst": "Create your first category",

    // Tours (now Jewelry)
    "admin.tours.title": "Jewelry Collection",
    "admin.tours.subtitle": "Manage your jewelry pieces",
    "admin.tours.create": "Add Jewelry Piece",
    "admin.tours.edit": "Edit Jewelry Piece",
    "admin.tours.name": "Jewelry Name",
    "admin.tours.description": "Description",
    "admin.tours.shortDescription": "Short Description",
    "admin.tours.category": "Category",
    "admin.tours.location": "Origin",
    "admin.tours.duration": "Period/Era",
    "admin.tours.price": "Price",
    "admin.tours.discountedPrice": "Sale Price",
    "admin.tours.currency": "Currency",
    "admin.tours.maxGroupSize": "Quantity Available",
    "admin.tours.difficulty": "Rarity",
    "admin.tours.images": "Images",
    "admin.tours.highlights": "Key Features",
    "admin.tours.inclusions": "Included with Purchase",
    "admin.tours.exclusions": "Not Included",
    "admin.tours.itinerary": "History & Provenance",
    "admin.tours.isFeatured": "Featured",
    "admin.tours.isActive": "Active",
    "admin.tours.actions": "Actions",
    "admin.tours.noTours": "No jewelry pieces found",
    "admin.tours.createFirst": "Add your first jewelry piece",

    // Common
    "admin.common.save": "Save",
    "admin.common.cancel": "Cancel",
    "admin.common.delete": "Delete",
    "admin.common.edit": "Edit",
    "admin.common.view": "View",
    "admin.common.loading": "Loading...",
    "admin.common.search": "Search",
    "admin.common.filter": "Filter",
    "admin.common.export": "Export",
    "admin.common.import": "Import",
    "admin.common.refresh": "Refresh",
    "admin.common.yes": "Yes",
    "admin.common.no": "No",
    "admin.common.confirm": "Confirm",
    "admin.common.success": "Success",
    "admin.common.error": "Error",
    "admin.common.required": "Required",
    "admin.common.optional": "Optional",

    "tourDetail.back": "Back to Collection",
    "tourDetail.loading": "Loading jewelry piece...",
    "tourDetail.error": "Error",
    "tourDetail.notFound": "Jewelry piece not found.",
    "tourDetail.days": "Era",
    "tourDetail.maxGroup": "Available Quantity",
    "tourDetail.difficulty": "Rarity",
    "tourDetail.about": "About This Piece",
    "tourDetail.highlights": "Key Features",
    "tourDetail.itinerary": "History & Provenance",
    "tourDetail.itineraryNotAvailable":
      "Detailed history information is not available for this piece.",
    "tourDetail.whatsIncluded": "What's Included",
    "tourDetail.inclusions": "Included",
    "tourDetail.exclusions": "Not Included",
    "tourDetail.ready": "Ready to own this treasure?",
    "tourDetail.addToCart": "Add to Cart",
    "tourDetail.askQuestion": "Ask a Question",
    "tourDetail.bookWithConfidence": "Buy with confidence.",
    "tourDetail.securePayments": "Secure payments & expert authentication.",
    "tourDetail.day": "Period",

    // Home page features
    "home.features.expertGuides": "Expert Authentication",
    "home.features.expertGuidesDesc":
      "Our certified experts authenticate every piece with detailed provenance documentation",
    "home.features.premiumQuality": "Premium Quality",
    "home.features.premiumQualityDesc":
      "Carefully curated collection of genuine antique jewelry with verified authenticity",
    "home.features.uniqueDestinations": "Unique Collections",
    "home.features.uniqueDestinationsDesc":
      "From Victorian elegance to Art Deco masterpieces, Chinese cloisonné to European antiques",

    "home.testimonials.title": "Client Stories",
    "home.testimonials.subtitle":
      "Discover why collectors trust Wangmanee Gallery with their precious acquisitions",
    "home.testimonials.customer1.name": "Margaret Chen",
    "home.testimonials.customer1.location": "Singapore",
    "home.testimonials.customer1.purchase": "Victorian Diamond Necklace",
    "home.testimonials.customer1.text":
      "Exceptional quality and authenticity. The provenance documentation was thorough and professional. Highly recommend Wangmanee Gallery.",
    "home.testimonials.customer2.name": "James Thompson",
    "home.testimonials.customer2.location": "London, UK",
    "home.testimonials.customer2.purchase": "Art Deco Emerald Ring",
    "home.testimonials.customer2.text":
      "Outstanding service and expertise. The piece arrived exactly as described with detailed historical documentation. Truly impressed.",
    "home.testimonials.customer3.name": "Isabella Martinez",
    "home.testimonials.customer3.location": "Madrid, Spain",
    "home.testimonials.customer3.purchase": "Chinese Cloisonné Vase",
    "home.testimonials.customer3.text":
      "Beautiful antique piece with excellent craftsmanship. The gallery's knowledge of Asian antiques is remarkable.",

    // Categories reflecting real business
    "home.categories.title": "Exquisite Categories",
    "home.categories.subtitle":
      "From Victorian jewelry to Chinese cloisonné, explore our curated collections of authentic antiques",
    "home.categories.victorian": "Victorian Jewelry",
    "home.categories.victorian.desc": "Ornate designs & romantic motifs",
    "home.categories.victorian.count": "45 Pieces",
    "home.categories.artdeco": "Art Deco Pieces",
    "home.categories.artdeco.desc": "Geometric patterns & bold designs",
    "home.categories.artdeco.count": "32 Pieces",
    "home.categories.edwardian": "Edwardian Era",
    "home.categories.edwardian.desc": "Delicate filigree & pearls",
    "home.categories.edwardian.count": "28 Pieces",
    "home.categories.vintage": "Asian Antiques",
    "home.categories.vintage.desc": "Chinese cloisonné & jade pieces",
    "home.categories.vintage.count": "67 Pieces",

    // Real business stats
    "home.stats.years": "Years of Expertise",
    "home.stats.pieces": "Authenticated Pieces",
    "home.stats.collectors": "Happy Collectors",
    "home.stats.satisfaction": "Satisfaction Rate",

    // Footer with real business info
    "footer.title": "Wangmanee Gallery",
    "footer.subtitle": "Curating authentic antiques since 2008",
    "footer.description":
      "Discover authentic antique jewelry and collectibles with verified provenance and expert authentication from our Bangkok gallery.",

    "footer.quickLinks": "Quick Links",
    "footer.quickLinks.home": "Home",
    "footer.quickLinks.collection": "Collection",
    "footer.quickLinks.about": "About Us",
    "footer.quickLinks.contact": "Contact",
    "footer.quickLinks.authentication": "Authentication",
    "footer.quickLinks.shipping": "Shipping Info",

    "footer.categories": "Categories",
    "footer.categories.rings": "Antique Rings",
    "footer.categories.necklaces": "Vintage Necklaces",
    "footer.categories.bracelets": "Classic Bracelets",
    "footer.categories.earrings": "Period Earrings",
    "footer.categories.brooches": "Estate Brooches",
    "footer.categories.watches": "Vintage Watches",

    "footer.contact": "Contact Information",
    "footer.contact.address": "Wangmanee Jewelry Store",
    "footer.contact.city": "Bangkok, Thailand 10200",
    "footer.contact.phone": "+66 (0) 2-xxx-xxxx",
    "footer.contact.email": "info@wangmaneegallery.com",
    "footer.contact.hours": "Daily: 10:00AM - 8:00PM",

    "footer.followUs": "Follow Our Collection",
    "footer.newsletter": "Stay Updated",
    "footer.newsletter.desc":
      "Get notified about new arrivals and exclusive pieces",
    "footer.newsletter.placeholder": "Enter your email",
    "footer.newsletter.subscribe": "Subscribe",

    "footer.legal": "Legal",
    "footer.legal.privacy": "Privacy Policy",
    "footer.legal.terms": "Terms of Service",
    "footer.legal.returns": "Returns & Exchanges",
    "footer.legal.authenticity": "Authenticity Guarantee",

    "footer.copyright": "© 2025 Wangmanee Gallery. All rights reserved.",
    "footer.crafted": "Crafted with passion for antique jewelry & collectible enthusiasts",
  },
  th: {
    // Navigation
    "nav.home": "หน้าแรก",
    "nav.tours": "คอลเลกชัน",
    "nav.about": "เกี่ยวกับเรา",
    "nav.cart": "ตะกร้า",
    "nav.signin": "เข้าสู่ระบบ",
    "nav.signup": "สมัครสมาชิก",
    "nav.signout": "ออกจากระบบ",
    "nav.admin": "แผงควบคุมผู้ดูแล",

    // Home page
    "home.hero.title1": "คอลเลกชันเครื่องประดับโบราณอันงดงาม",
    "home.hero.desc1":
      "ค้นพบเครื่องประดับวินเทจแท้พร้อมการตรวจสอบที่มาและการรับรองจากผู้เชี่ยวชาญที่ วังมณีแกลเลอรี",
    "home.hero.title2": "สมบัติเหนือกาลเวลาและของสะสม",
    "home.hero.desc2":
      "จากความหรูหราแบบวิคตอเรียถึงความเก๋ไก๋แบบอาร์ตเดโค แต่ละชิ้นเล่าเรื่องราวของงานฝีมือและศิลปะทางประวัติศาสตร์",
    "home.hero.title3": "มรดกและการตรวจสอบความแท้",
    "home.hero.desc3":
      "เครื่องประดับทุกชิ้นมาพร้อมเอกสารที่มาโดยละเอียดและใบรับรองการตรวจสอบความแท้จากผู้เชี่ยวชาญ",
    "home.hero.explore": "สำรวจคอลเลกชัน",
    "home.featured.title": "ชิ้นเด่น",
    "home.featured.subtitle": "ค้นพบเครื่องประดับโบราณที่ได้รับความนิยมมากที่สุด",
    "home.company.title": "ทำไมต้องเลือก วังมณีแกลเลอรี?",
    "home.company.desc":
      "ด้วยความเชี่ยวชาญกว่า 16 ปีในการตรวจสอบและคัดสรรเครื่องประดับโบราณที่ยอดเยี่ยม เราเชี่ยวชาญในการเชื่อมต่อนักสะสมกับชิ้นแท้ที่เป็นตัวแทนของศิลปะทางประวัติศาสตร์และความงามเหนือกaลเวลา ตั้งอยู่ในกรุงเทพฯ ประเทศไทย เราให้บริการนักสะสมทั่วโลก",
    "home.cta.title": "พร้อมที่จะหาชิ้นที่สมบูรณ์แบบของคุณแล้วหรือยัง?",
    "home.cta.subtitle":
      "เข้าร่วมกับนักสะสมที่พอใจหลายร้อยคนที่ได้ค้นพบสมบัติของพวกเขากับ วังมณีแกลเลอรี",
    "home.cta.browse": "เรียกดูคอลเลกชันทั้งหมด",
    "home.cta.learn": "เรียนรู้เพิ่มเติมเกี่ยวกับเรา",

    // Real business testimonials in Thai
    "home.testimonials.title": "เรื่องราวจากลูกค้า",
    "home.testimonials.subtitle":
      "ค้นพบว่าทำไมนักสะสมจึงไว้วางใจ วังมณีแกลเลอรี ในการซื้อของล้ำค่า",
    "home.testimonials.customer1.name": "มาร์กาเร็ต เฉิน",
    "home.testimonials.customer1.location": "สิงคโปร์",
    "home.testimonials.customer1.purchase": "สร้อยคอเพชรแบบวิคตอเรีย",
    "home.testimonials.customer1.text":
      "คุณภาพและความแท้ที่ยอดเยี่ยม เอกสารที่มาครบถ้วนและเป็นมืออาชีพ แนะนำ วังมณีแกลเลอรี อย่างยิ่ง",
    "home.testimonials.customer2.name": "เจมส์ ทอมป์สัน",
    "home.testimonials.customer2.location": "ลอนดอน, สหราชอาณาจักร",
    "home.testimonials.customer2.purchase": "แหวนมรกตแบบอาร์ตเดโค",
    "home.testimonials.customer2.text":
      "บริการและความเชี่ยวชาญที่โดดเด่น ชิ้นงานมาถึงตรงตามที่อธิบายพร้อมเอกสารทางประวัติศาสตร์โดยละเอียด ประทับใจจริงๆ",
    "home.testimonials.customer3.name": "อิซาเบลลา มาร์ติเนซ",
    "home.testimonials.customer3.location": "มาดริด, สเปน",
    "home.testimonials.customer3.purchase": "แจกันเคลือบจีน",
    "home.testimonials.customer3.text":
      "ชิ้นโบราณที่สวยงามพร้อมงานฝีมือที่ยอดเยี่ยม ความรู้ของแกลเลอรีเกี่ยวกับของโบราณเอเชียน่าทึ่งมาก",

    // Categories in Thai reflecting real business
    "home.categories.title": "หมวดหมู่อันงดงาม",
    "home.categories.subtitle":
      "จากเครื่องประดับวิคตอเรียถึงเคลือบจีน สำรวจคอลเลกชันของโบราณแท้ที่คัดสรรแล้ว",
    "home.categories.victorian": "เครื่องประดับวิคตอเรีย",
    "home.categories.victorian.desc": "ลวดลายประณีต & ลวดลายโรแมนติก",
    "home.categories.victorian.count": "45 ชิ้น",
    "home.categories.artdeco": "ชิ้นอาร์ตเดโค",
    "home.categories.artdeco.desc": "ลวดลายเรขาคณิต & ดีไซน์โดดเด่น",
    "home.categories.artdeco.count": "32 ชิ้น",
    "home.categories.edwardian": "ยุคเอดเวิร์เดียน",
    "home.categories.edwardian.desc": "ลายละเอียดอ่อนช้อย & มุก",
    "home.categories.edwardian.count": "28 ชิ้น",
    "home.categories.vintage": "โบราณเอเชีย",
    "home.categories.vintage.desc": "เคลือบจีนและชิ้นหยก",
    "home.categories.vintage.count": "67 ชิ้น",

    // Real business stats in Thai
    "home.stats.years": "ปีแห่งความเชี่ยวชาญ",
    "home.stats.pieces": "ชิ้นที่ตรวจสอบแล้ว",
    "home.stats.collectors": "นักสะสมที่พอใจ",
    "home.stats.satisfaction": "อัตราความพึงพอใจ",

    // Footer with real business info in Thai
    "footer.title": "วังมณีแกลเลอรี",
    "footer.subtitle": "คัดสรรของโบราณแท้ตั้งแต่ปี 2008",
    "footer.description":
      "ค้นพบเครื่องประดับโบราณแท้และของสะสมพร้อมการตรวจสอบที่มาและการรับรองจากผู้เชี่ยวชาญจากแกลเลอรีในกรุงเทพฯ",

    "footer.contact": "ข้อมูลการติดต่อ",
    "footer.contact.address": "ร้านเครื่องประดับวังมณี",
    "footer.contact.city": "กรุงเทพฯ ประเทศไทย 10200",
    "footer.contact.phone": "+66 (0) 2-xxx-xxxx",
    "footer.contact.email": "info@wangmaneegallery.com",
    "footer.contact.hours": "ทุกวัน: 10:00-20:00 น.",

    "footer.copyright": "© 2025 วังมณีแกลเลอรี สงวนลิขสิทธิ์",
    "footer.crafted":
      "สร้างสรรค์ด้วยความหลงใหลในเครื่องประดับโบราณและผู้ที่ชื่นชอบของสะสม",

    // Home page features
"home.features.expertGuides": "การตรวจสอบจากผู้เชี่ยวชาญ",
"home.features.expertGuidesDesc": "ผู้เชี่ยวชาญที่ได้รับการรับรองของเราตรวจสอบทุกชิ้นพร้อมเอกสารที่มาโดยละเอียด",
"home.features.premiumQuality": "คุณภาพพรีเมียม",
"home.features.premiumQualityDesc": "คอลเลกชันที่คัดสรรอย่างพิถีพิถันของเครื่องประดับโบราณแท้พร้อมการตรวจสอบความแท้",
"home.features.uniqueDestinations": "คอลเลกชันที่เป็นเอกลักษณ์",
"home.features.uniqueDestinationsDesc": "จากความหรูหราแบบวิคตอเรียถึงผลงานชิ้นเอกอาร์ตเดโค เคลือบจีนถึงของโบราณยุโรป",

// Collection page (formerly Tours page)
"tours.title": "ค้นพบคอลเลกชันของเรา",
"tours.subtitle": "ค้นหาสมบัติที่สมบูรณ์แบบจากเครื่องประดับโบราณที่คัดสรรแล้ว",
"tours.search": "ค้นหาเครื่องประดับ, สไตล์, ช่วงเวลา...",
"tours.category.all": "ทุกหมวดหมู่",
"tours.category.adventure": "แหวน",
"tours.category.cultural": "สร้อยคอ",
"tours.category.beach": "สร้อยข้อมือ",
"tours.category.mountain": "ต่างหู",
"tours.category.city": "เข็มกลัด",
"tours.filters": "ตัวกรองเพิ่มเติม",
"tours.showing": "แสดง",
"tours.tour": "ชิ้น",
"tours.tours": "ชิ้น",
"tours.viewDetails": "ดูรายละเอียด",
"tours.addToCart": "เพิ่มในตะกร้า",
"tours.noResults": "ไม่พบเครื่องประดับที่ตรงกับเงื่อนไขของคุณ",
"tours.clearFilters": "ล้างตัวกรอง",

// Cart page
"cart.title": "ตะกร้าสินค้า",
"cart.empty.title": "ตะกร้าของคุณว่างเปล่า",
"cart.empty.subtitle": "ค้นพบเครื่องประดับโบราณที่งดงามและเพิ่มลงในตะกร้าของคุณ",
"cart.empty.browse": "เรียกดูคอลเลกชัน",
"cart.summary": "สรุปคำสั่งซื้อ",
"cart.subtotal": "ยอดรวมย่อย",
"cart.serviceFee": "ค่าบริการ",
"cart.taxes": "ภาษี",
"cart.total": "รวมทั้งหมด",
"cart.checkout": "ดำเนินการชำระเงิน",
"cart.signin.required": "กรุณาเข้าสู่ระบบเพื่อดำเนินการชำระเงิน",
"cart.continue": "เลือกซื้อต่อ",
"cart.processing": "กำลังดำเนินการ...",

// Auth pages
"auth.signin.title": "ยินดีต้อนรับกลับ",
"auth.signin.subtitle": "เข้าสู่ระบบบัญชีของคุณ",
"auth.signin.email": "อีเมล",
"auth.signin.password": "รหัสผ่าน",
"auth.signin.button": "เข้าสู่ระบบ",
"auth.signin.noAccount": "ยังไม่มีบัญชี?",
"auth.signin.demo": "บัญชีทดลอง:",
"auth.signup.title": "สร้างบัญชี",
"auth.signup.subtitle": "เข้าร่วม วังมณีแกลเลอรี",
"auth.signup.name": "ชื่อเต็ม",
"auth.signup.confirmPassword": "ยืนยันรหัสผ่าน",
"auth.signup.button": "สร้างบัญชี",
"auth.signup.hasAccount": "มีบัญชีแล้ว?",

// Common
"common.loading": "กำลังโหลด...",
"common.perPerson": "ต่อชิ้น",
"common.days": "ยุค",
"common.rating": "คะแนน",
"common.features": "คุณสมบัติ",
"common.location": "ที่มา",
"common.duration": "ช่วงเวลา",
"common.price": "ราคา",

"auth.signup.fullNamePlaceholder": "กรอกชื่อเต็มของคุณ",
"auth.signup.emailPlaceholder": "กรอกอีเมลของคุณ",
"auth.signup.passwordPlaceholder": "สร้างรหัสผ่านที่แข็งแกร่ง",
"auth.signup.confirmPasswordPlaceholder": "ยืนยันรหัสผ่านของคุณ",
"auth.signup.passwordRequirements": "ต้องมีอย่างน้อย 8 ตัวอักษร ประกอบด้วยตัวพิมพ์ใหญ่ พิมพ์เล็ก และตัวเลข",
"auth.signup.accountType": "ประเภทบัญชี",
"auth.signup.user": "ลูกค้า",
"auth.signup.admin": "ผู้ดูแลระบบ",
"auth.signup.creating": "กำลังสร้างบัญชี...",

"auth.signin.emailPlaceholder": "กรอกอีเมลของคุณ",
"auth.signin.passwordPlaceholder": "กรอกรหัสผ่านของคุณ",
"auth.signin.signingIn": "กำลังเข้าสู่ระบบ...",
"auth.signin.demoAccount": "บัญชีทดลอง",
"auth.signin.demoDesc1": "สร้างบัญชีใหม่เพื่อทดสอบระบบการยืนยันตัวตน",
"auth.signin.demoDesc2": "รหัสยืนยันจะถูกส่งไปยังอีเมลของคุณ",

// Toast messages
"toast.passwordMismatch": "รหัสผ่านไม่ตรงกัน",
"toast.passwordTooShort": "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",
"toast.passwordWeak": "รหัสผ่านต้องมีตัวพิมพ์ใหญ่ พิมพ์เล็ก และตัวเลข",
"toast.accountCreated": "สร้างบัญชีแล้ว! กรุณาตรวจสอบอีเมลของคุณสำหรับรหัสยืนยัน",
"toast.accountSuccess": "สร้างบัญชีสำเร็จ!",
"toast.signInSuccess": "เข้าสู่ระบบสำเร็จ!",
"toast.verifyEmail": "กรุณายืนยันอีเมลของคุณก่อน",
"toast.invalidCredentials": "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
"toast.userNotFound": "ไม่พบบัญชีด้วยอีเมลนี้",
"toast.createAccountFailed": "ไม่สามารถสร้างบัญชีได้",
"toast.signInFailed": "ไม่สามารถเข้าสู่ระบบได้",

// Footer
"footer.quickLinks": "ลิงก์ด่วน",
"footer.quickLinks.home": "หน้าแรก",
"footer.quickLinks.collection": "คอลเลกชัน",
"footer.quickLinks.about": "เกี่ยวกับเรา",
"footer.quickLinks.contact": "ติดต่อ",
"footer.quickLinks.authentication": "การตรวจสอบความแท้",
"footer.quickLinks.shipping": "ข้อมูลการจัดส่ง",

"footer.categories": "หมวดหมู่",
"footer.categories.rings": "แหวนโบราณ",
"footer.categories.necklaces": "สร้อยคอวินเทจ",
"footer.categories.bracelets": "สร้อยข้อมือคลาสสิก",
"footer.categories.earrings": "ต่างหูยุคต่างๆ",
"footer.categories.brooches": "เข็มกลัดมรดก",
"footer.categories.watches": "นาฬิกาวินเทจ",

"footer.followUs": "ติดตามคอลเลกชันของเรา",
"footer.newsletter": "รับข้อมูลอัปเดต",
"footer.newsletter.desc": "รับแจ้งเตือนเกี่ยวกับสินค้าใหม่และชิ้นพิเศษ",
"footer.newsletter.placeholder": "กรอกอีเมลของคุณ",
"footer.newsletter.subscribe": "สมัครรับข้อมูล",

"footer.legal": "กฎหมาย",
"footer.legal.privacy": "นโยบายความเป็นส่วนตัว",
"footer.legal.terms": "เงื่อนไขการให้บริการ",
"footer.legal.returns": "การคืนและการแลกเปลี่ยน",
"footer.legal.authenticity": "การรับประกันความแท้",

// Tour Detail page
"tourDetail.back": "กลับไปยังคอลเลกชัน",
"tourDetail.loading": "กำลังโหลดชิ้นเครื่องประดับ...",
"tourDetail.error": "ข้อผิดพลาด",
"tourDetail.notFound": "ไม่พบชิ้นเครื่องประดับ",
"tourDetail.days": "ยุค",
"tourDetail.maxGroup": "จำนวนที่มีอยู่",
"tourDetail.difficulty": "ความหายาก",
"tourDetail.about": "เกี่ยวกับชิ้นนี้",
"tourDetail.highlights": "คุณสมบัติเด่น",
"tourDetail.itinerary": "ประวัติและที่มา",
"tourDetail.itineraryNotAvailable": "ข้อมูลประวัติโดยละเอียดไม่มีสำหรับชิ้นนี้",
"tourDetail.whatsIncluded": "สิ่งที่รวมอยู่",
"tourDetail.inclusions": "รวมอยู่",
"tourDetail.exclusions": "ไม่รวมอยู่",
"tourDetail.ready": "พร้อมที่จะเป็นเจ้าของสมบัตินี้แล้วหรือยัง?",
"tourDetail.addToCart": "เพิ่มในตะกร้า",
"tourDetail.askQuestion": "ถามคำถาม",
"tourDetail.bookWithConfidence": "ซื้อด้วยความมั่นใจ",
"tourDetail.securePayments": "การชำระเงินปลอดภัยและการตรวจสอบจากผู้เชี่ยวชาญ",
"tourDetail.day": "ช่วงเวลา",

//admin - basic ones
"admin.title": "วังมณีแกลเลอรี ผู้ดูแลระบบ",
"admin.subtitle": "แผงการจัดการเครื่องประดับ",
"admin.nav.dashboard": "แดชบอร์ด",
"admin.nav.categories": "หมวดหมู่",
"admin.nav.tours": "คอลเลกชันเครื่องประดับ",
"admin.nav.bookings": "คำสั่งซื้อ",
"admin.nav.customers": "ลูกค้า",
"admin.nav.locations": "ที่มา",
"admin.nav.media": "คลังสื่อ",
"admin.nav.analytics": "การวิเคราะห์",
"admin.nav.reports": "รายงาน",
"admin.nav.settings": "การตั้งค่า",
"admin.nav.logout": "ออกจากระบบ",
"admin.search": "ค้นหา...",

"admin.profile.name": "ผู้ดูแลแกลเลอรี",
"admin.profile.profile": "โปรไฟล์",
"admin.profile.settings": "การตั้งค่า",
"admin.profile.logout": "ออกจากระบบ",

"admin.common.save": "บันทึก",
"admin.common.cancel": "ยกเลิก",
"admin.common.delete": "ลบ",
"admin.common.edit": "แก้ไข",
"admin.common.view": "ดู",
"admin.common.loading": "กำลังโหลด...",
"admin.common.search": "ค้นหา",
"admin.common.filter": "ตัวกรอง",
"admin.common.export": "ส่งออก",
"admin.common.import": "นำเข้า",
"admin.common.refresh": "รีเฟรช",
"admin.common.yes": "ใช่",
"admin.common.no": "ไม่",
"admin.common.confirm": "ยืนยัน",
"admin.common.success": "สำเร็จ",
"admin.common.error": "ข้อผิดพลาด",
"admin.common.required": "จำเป็น",
"admin.common.optional": "ทางเลือก",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const storedLocale = localStorage.getItem("locale") as Locale;
    if (storedLocale && ["en", "th"].includes(storedLocale)) {
      setLocaleState(storedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  const t = (key: string): string => {
    return (
      translations[locale][key as keyof (typeof translations)[typeof locale]] ||
      key
    );
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}