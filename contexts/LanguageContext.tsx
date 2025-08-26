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
    "home.hero.title1": "Discover Exquisite Antique Jewelry",
    "home.hero.desc1":
      "Experience timeless elegance with our curated collection of vintage jewelry and precious antiques",
    "home.hero.title2": "Timeless Treasures Await",
    "home.hero.desc2":
      "From Victorian elegance to Art Deco glamour, your perfect piece awaits discovery",
    "home.hero.title3": "Heritage & Craftsmanship",
    "home.hero.desc3":
      "Each piece tells a story of artisan craftsmanship and historical significance",
    "home.hero.explore": "Explore Collection",
    "home.featured.title": "Featured Pieces",
    "home.featured.subtitle": "Discover our most coveted antique jewelry",
    "home.company.title": "Why Choose Heritage Antiques?",
    "home.company.desc":
      "With over 15 years of expertise in authenticating and curating exceptional antique jewelry, we specialize in connecting collectors with genuine pieces that embody historical artistry and timeless beauty.",
    "home.cta.title": "Ready to Find Your Perfect Piece?",
    "home.cta.subtitle":
      "Join thousands of satisfied collectors who have discovered their treasures with us",
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
    "auth.signup.subtitle": "Join Heritage Antiques",
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
    "admin.title": "Jewelry Admin",
    "admin.subtitle": "Management Panel",
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
    "admin.profile.name": "Admin User",
    "admin.profile.profile": "Profile",
    "admin.profile.settings": "Settings",
    "admin.profile.logout": "Log out",

    // Dashboard
    "admin.dashboard.title": "Dashboard",
    "admin.dashboard.subtitle": "Overview of your jewelry business",
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
      "From Victorian elegance to Art Deco masterpieces",

    "home.testimonials.title": "Cherished Stories",
    "home.testimonials.subtitle":
      "Discover why collectors trust us with their precious acquisitions",
    "home.testimonials.customer1.name": "Margaret & Robert Chen",
    "home.testimonials.customer1.location": "San Francisco, USA",
    "home.testimonials.customer1.purchase": "Victorian Diamond Necklace",
    "home.testimonials.customer1.text":
      "An absolutely exquisite piece with impeccable provenance documentation. The authentication process was thorough and professional.",
    "home.testimonials.customer2.name": "James Harrison",
    "home.testimonials.customer2.location": "London, UK",
    "home.testimonials.customer2.purchase": "Art Deco Emerald Ring",
    "home.testimonials.customer2.text":
      "Heritage Antiques exceeded all expectations. The piece arrived exactly as described with detailed historical documentation.",
    "home.testimonials.customer3.name": "Isabella Rodriguez",
    "home.testimonials.customer3.location": "Barcelona, Spain",
    "home.testimonials.customer3.purchase": "Edwardian Pearl Brooch",
    "home.testimonials.customer3.text":
      "A soul-stirring piece that connects me to history. The quality and authenticity verification was exceptional.",

    // English
    "home.categories.title": "Exquisite Categories",
    "home.categories.subtitle":
      "From Victorian elegance to Art Deco masterpieces, explore our curated collections",
    "home.categories.victorian": "Victorian Era",
    "home.categories.victorian.desc": "Ornate designs & romantic motifs",
    "home.categories.victorian.count": "24 Pieces",
    "home.categories.artdeco": "Art Deco",
    "home.categories.artdeco.desc": "Geometric patterns & bold designs",
    "home.categories.artdeco.count": "18 Pieces",
    "home.categories.edwardian": "Edwardian Period",
    "home.categories.edwardian.desc": "Delicate filigree & pearls",
    "home.categories.edwardian.count": "31 Pieces",
    "home.categories.vintage": "Vintage Modern",
    "home.categories.vintage.desc": "Mid-century contemporary styles",
    "home.categories.vintage.count": "16 Pieces",

    // English
    "home.stats.years": "Years of Expertise",
    "home.stats.pieces": "Authenticated Pieces",
    "home.stats.collectors": "Happy Collectors",
    "home.stats.satisfaction": "Satisfaction Rate",

    // Add to English translations
    "footer.title": "Heritage Antiques",
    "footer.subtitle": "Curating timeless treasures since 1999",
    "footer.description":
      "Discover authentic antique jewelry pieces with verified provenance and expert authentication.",

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
    "footer.contact.address": "123 Heritage Lane, Antique District",
    "footer.contact.city": "Bangkok, Thailand 10110",
    "footer.contact.phone": "+66 2 123 4567",
    "footer.contact.email": "info@heritageantiques.com",
    "footer.contact.hours": "Mon-Sat: 10AM-7PM",

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

    "footer.copyright": "© 2025 Heritage Antiques. All rights reserved.",
    "footer.crafted": "Crafted with passion for antique jewelry collectors",
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
    "home.hero.title1": "ค้นพบเครื่องประดับโบราณอันงดงาม",
    "home.hero.desc1":
      "สัมผัสความงามเหนือกาลเวลาด้วยคอลเลกชันเครื่องประดับวินเทจและของโบราณล้ำค่าของเรา",
    "home.hero.title2": "สมบัติเหนือกาลเวลารออยู่",
    "home.hero.desc2":
      "จากความหรูหราแบบวิคตอเรียถึงความเก๋ไก๋แบบอาร์ตเดโค ชิ้นที่สมบูรณ์แบบของคุณรอการค้นพบ",
    "home.hero.title3": "มรดกและงานฝีมือ",
    "home.hero.desc3":
      "แต่ละชิ้นเล่าเรื่องราวของงานฝีมือช่างและความสำคัญทางประวัติศาสตร์",
    "home.hero.explore": "สำรวจคอลเลกชัน",
    "home.featured.title": "ชิ้นเด่น",
    "home.featured.subtitle":
      "ค้นพบเครื่องประดับโบราณที่ได้รับความนิยมมากที่สุด",
    "home.company.title": "ทำไมต้องเลือก Heritage Antiques?",
    "home.company.desc":
      "ด้วยความเชี่ยวชาญกว่า 15 ปีในการตรวจสอบและคัดสรรเครื่องประดับโบราณที่ยอดเยี่ยม เราเชี่ยวชาญในการเชื่อมต่อนักสะสมกับชิ้นแท้ที่เป็นตัวแทนของศิลปะทางประวัติศาสตร์และความงามเหนือกาลเวลา",
    "home.cta.title": "พร้อมที่จะหาชิ้นที่สมบูรณ์แบบของคุณแล้วหรือยัง?",
    "home.cta.subtitle":
      "เข้าร่วมกับนักสะสมที่พอใจหลายพันคนที่ได้ค้นพบสมบัติของพวกเขากับเรา",
    "home.cta.browse": "เรียกดูคอลเลกชันทั้งหมด",
    "home.cta.learn": "เรียนรู้เพิ่มเติมเกี่ยวกับเรา",

    // Collection page (formerly Tours page)
    "tours.title": "ค้นพบคอลเลกชันของเรา",
    "tours.subtitle":
      "ค้นหาสมบัติที่สมบูรณ์แบบจากเครื่องประดับโบราณที่คัดสรรแล้ว",
    "tours.search": "ค้นหาเครื่องประดับ, สไตล์, ยุคสมัย...",
    "tours.category.all": "หมวดหมู่ทั้งหมด",
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
    "cart.empty.subtitle":
      "ค้นพบเครื่องประดับโบราณอันงดงามและเพิ่มลงในตะกร้าของคุณ",
    "cart.empty.browse": "เรียกดูคอลเลกชัน",
    "cart.summary": "สรุปคำสั่งซื้อ",
    "cart.subtotal": "ยอดรวมย่อย",
    "cart.serviceFee": "ค่าบริการ",
    "cart.taxes": "ภาษี",
    "cart.total": "ยอดรวม",
    "cart.checkout": "ดำเนินการชำระเงิน",
    "cart.signin.required": "กรุณาเข้าสู่ระบบเพื่อดำเนินการชำระเงิน",
    "cart.continue": "ช้อปปิ้งต่อ",
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
    "auth.signup.subtitle": "เข้าร่วม Heritage Antiques",
    "auth.signup.name": "ชื่อเต็ม",
    "auth.signup.confirmPassword": "ยืนยันรหัสผ่าน",
    "auth.signup.button": "สร้างบัญชี",
    "auth.signup.hasAccount": "มีบัญชีอยู่แล้ว?",

    // Common
    "common.loading": "กำลังโหลด...",
    "common.perPerson": "ต่อชิ้น",
    "common.days": "ยุคสมัย",
    "common.rating": "คะแนน",
    "common.features": "คุณสมบัติ",
    "common.location": "แหล่งกำเนิด",
    "common.duration": "ระยะเวลา",
    "common.price": "ราคา",

    "auth.signup.fullNamePlaceholder": "กรอกชื่อเต็มของคุณ",
    "auth.signup.emailPlaceholder": "กรอกอีเมลของคุณ",
    "auth.signup.passwordPlaceholder": "สร้างรหัสผ่านที่แข็งแกร่ง",
    "auth.signup.confirmPasswordPlaceholder": "ยืนยันรหัสผ่านของคุณ",
    "auth.signup.passwordRequirements":
      "ต้องมี 8 ตัวอักษรขึ้นไป พร้อมตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก และตัวเลข",
    "auth.signup.accountType": "ประเภทบัญชี",
    "auth.signup.user": "ลูกค้า",
    "auth.signup.admin": "ผู้ดูแล",
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
    "toast.passwordWeak": "รหัสผ่านต้องมีตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก และตัวเลข",
    "toast.accountCreated":
      "สร้างบัญชีแล้ว! กรุณาตรวจสอบอีเมลของคุณสำหรับรหัสยืนยัน",
    "toast.accountSuccess": "สร้างบัญชีสำเร็จ!",
    "toast.signInSuccess": "เข้าสู่ระบบสำเร็จ!",
    "toast.verifyEmail": "กรุณายืนยันอีเมลของคุณก่อน",
    "toast.invalidCredentials": "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
    "toast.userNotFound": "ไม่พบบัญชีที่ใช้อีเมลนี้",
    "toast.createAccountFailed": "สร้างบัญชีไม่สำเร็จ",
    "toast.signInFailed": "เข้าสู่ระบบไม่สำเร็จ",

    //admin

    // Admin Navigation
    "admin.title": "ผู้ดูแลเครื่องประดับ",
    "admin.subtitle": "แผงควบคุม",
    "admin.nav.dashboard": "แดชบอร์ด",
    "admin.nav.categories": "หมวดหมู่",
    "admin.nav.tours": "คอลเลกชันเครื่องประดับ",
    "admin.nav.bookings": "คำสั่งซื้อ",
    "admin.nav.customers": "ลูกค้า",
    "admin.nav.locations": "แหล่งกำเนิด",
    "admin.nav.media": "ไลบรารีสื่อ",
    "admin.nav.analytics": "การวิเคราะห์",
    "admin.nav.reports": "รายงาน",
    "admin.nav.settings": "การตั้งค่า",
    "admin.nav.logout": "ออกจากระบบ",
    "admin.search": "ค้นหา...",

    // Admin Profile
    "admin.profile.name": "ผู้ใช้ผู้ดูแล",
    "admin.profile.profile": "โปรไฟล์",
    "admin.profile.settings": "การตั้งค่า",
    "admin.profile.logout": "ออกจากระบบ",

    // Dashboard
    "admin.dashboard.title": "แดชบอร์ด",
    "admin.dashboard.subtitle": "ภาพรวมของธุรกิจเครื่องประดับของคุณ",
    "admin.dashboard.quickActions": "การดำเนินการด่วน",
    "admin.dashboard.overview": "ภาพรวม",
    "admin.dashboard.totalCategories": "จำนวนหมวดหมู่ทั้งหมด",
    "admin.dashboard.totalTours": "จำนวนชิ้นทั้งหมด",
    "admin.dashboard.featuredTours": "สินค้าเด่น",
    "admin.dashboard.averagePrice": "ราคาเฉลี่ย",
    "admin.dashboard.active": "ใช้งานอยู่",
    "admin.dashboard.toursByCategory": "สินค้าตามหมวดหมู่",
    "admin.dashboard.toursByCategoryDesc":
      "การกระจายของเครื่องประดับตามหมวดหมู่",
    "admin.dashboard.toursByDifficulty": "สินค้าตามระดับความหายาก",
    "admin.dashboard.toursByDifficultyDesc": "แยกตามระดับความหายาก",
    "admin.dashboard.recentTours": "สินค้าล่าสุด",
    "admin.dashboard.recentToursDesc": "เครื่องประดับที่เพิ่มล่าสุด",
    "admin.dashboard.viewAll": "ดูทั้งหมด",

    // Quick Actions
    "admin.quickActions.newTour": "เพิ่มเครื่องประดับใหม่",
    "admin.quickActions.newTourDesc": "เพิ่มชิ้นเครื่องประดับใหม่",
    "admin.quickActions.newCategory": "สร้างหมวดหมู่",
    "admin.quickActions.newCategoryDesc": "เพิ่มหมวดหมู่เครื่องประดับใหม่",
    "admin.quickActions.viewBookings": "ดูคำสั่งซื้อ",
    "admin.quickActions.viewBookingsDesc": "จัดการคำสั่งซื้อของลูกค้า",

    // Difficulty levels (now rarity levels)
    "admin.difficulty.easy": "ทั่วไป",
    "admin.difficulty.moderate": "หายาก",
    "admin.difficulty.challenging": "หายากมาก",
    "admin.difficulty.extreme": "คุณภาพระดับพิพิธภัณฑ์",

    // Categories
    "admin.categories.title": "หมวดหมู่",
    "admin.categories.subtitle": "จัดการหมวดหมู่เครื่องประดับ",
    "admin.categories.create": "สร้างหมวดหมู่",
    "admin.categories.edit": "แก้ไขหมวดหมู่",
    "admin.categories.name": "ชื่อหมวดหมู่",
    "admin.categories.description": "คำอธิบาย",
    "admin.categories.slug": "สลัก",
    "admin.categories.isActive": "ใช้งานอยู่",
    "admin.categories.actions": "การดำเนินการ",
    "admin.categories.noCategories": "ไม่พบหมวดหมู่",
    "admin.categories.createFirst": "สร้างหมวดหมู่แรกของคุณ",

    // Tours (now Jewelry)
    "admin.tours.title": "คอลเลกชันเครื่องประดับ",
    "admin.tours.subtitle": "จัดการชิ้นเครื่องประดับของคุณ",
    "admin.tours.create": "เพิ่มชิ้นเครื่องประดับ",
    "admin.tours.edit": "แก้ไขชิ้นเครื่องประดับ",
    "admin.tours.name": "ชื่อเครื่องประดับ",
    "admin.tours.description": "คำอธิบาย",
    "admin.tours.shortDescription": "คำอธิบายสั้น",
    "admin.tours.category": "หมวดหมู่",
    "admin.tours.location": "แหล่งกำเนิด",
    "admin.tours.duration": "ยุคสมัย/ระยะเวลา",
    "admin.tours.price": "ราคา",
    "admin.tours.discountedPrice": "ราคาลดพิเศษ",
    "admin.tours.currency": "สกุลเงิน",
    "admin.tours.maxGroupSize": "จำนวนที่มีพร้อม",
    "admin.tours.difficulty": "ความหายาก",
    "admin.tours.images": "รูปภาพ",
    "admin.tours.highlights": "คุณสมบัติเด่น",
    "admin.tours.inclusions": "รวมในการซื้อ",
    "admin.tours.exclusions": "ไม่รวม",
    "admin.tours.itinerary": "ประวัติและที่มา",
    "admin.tours.isFeatured": "เด่น",
    "admin.tours.isActive": "ใช้งานอยู่",
    "admin.tours.actions": "การดำเนินการ",
    "admin.tours.noTours": "ไม่พบชิ้นเครื่องประดับ",
    "admin.tours.createFirst": "เพิ่มชิ้นเครื่องประดับแรกของคุณ",

    // Common
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
    "admin.common.optional": "ไม่บังคับ",

    "tourDetail.back": "กลับไปที่คอลเลกชัน",
    "tourDetail.loading": "กำลังโหลดชิ้นเครื่องประดับ...",
    "tourDetail.error": "ข้อผิดพลาด",
    "tourDetail.notFound": "ไม่พบชิ้นเครื่องประดับ",
    "tourDetail.days": "ยุคสมัย",
    "tourDetail.maxGroup": "จำนวนที่มีพร้อม",
    "tourDetail.difficulty": "ความหายาก",
    "tourDetail.about": "เกี่ยวกับชิ้นนี้",
    "tourDetail.highlights": "คุณสมบัติเด่น",
    "tourDetail.itinerary": "ประวัติและที่มา",
    "tourDetail.itineraryNotAvailable":
      "ข้อมูลประวัติโดยละเอียดไม่มีสำหรับชิ้นนี้",
    "tourDetail.whatsIncluded": "สิ่งที่รวมอยู่",
    "tourDetail.inclusions": "รวม",
    "tourDetail.exclusions": "ไม่รวม",
    "tourDetail.ready": "พร้อมที่จะเป็นเจ้าของสมบัตินี้หรือไม่?",
    "tourDetail.addToCart": "เพิ่มในตะกร้า",
    "tourDetail.askQuestion": "ถามคำถาม",
    "tourDetail.bookWithConfidence": "ซื้อด้วยความมั่นใจ",
    "tourDetail.securePayments":
      "การชำระเงินที่ปลอดภัยและการรับรองความแท้โดยผู้เชี่ยวชาญ",
    "tourDetail.day": "ยุค",

    // Home page features
    "home.features.expertGuides": "การรับรองความแท้โดยผู้เชี่ยวชาญ",
    "home.features.expertGuidesDesc":
      "ผู้เชี่ยวชาญที่ได้รับการรับรองของเรารับรองความแท้ของทุกชิ้นพร้อมเอกสารที่มาโดยละเอียด",
    "home.features.premiumQuality": "คุณภาพพรีเมียม",
    "home.features.premiumQualityDesc":
      "คอลเลกชันที่คัดสรรอย่างพิถีพิถันของเครื่องประดับโบราณแท้พร้อมการรับรองความแท้",
    "home.features.uniqueDestinations": "คอลเลกชันที่ไม่เหมือนใคร",
    "home.features.uniqueDestinationsDesc":
      "จากความหรูหราแบบวิคตอเรียถึงผลงานชิ้นเอกแบบอาร์ตเดโค",

    "home.testimonials.title": "เรื่องราวอันล้ำค่า",
    "home.testimonials.subtitle":
      "ค้นพบว่าทำไมนักสะสมจึงไว้วางใจเราในการซื้อของล้ำค่า",
    "home.testimonials.customer1.name": "มาร์กาเร็ต และ โรเบิร์ต เฉิน",
    "home.testimonials.customer1.location": "ซานฟรานซิสโก, สหรัฐอเมริกา",
    "home.testimonials.customer1.purchase": "สร้อยคอเพชรแบบวิคตอเรีย",
    "home.testimonials.customer1.text":
      "ชิ้นที่งดงามอย่างแท้จริงพร้อมเอกสารที่มาที่ไร้ที่ติ กระบวนการตรวจสอบความแท้ครอบคลุมและเป็นมืออาชีพ",
    "home.testimonials.customer2.name": "เจมส์ แฮร์ริสัน",
    "home.testimonials.customer2.location": "ลอนดอน, สหราชอาณาจักร",
    "home.testimonials.customer2.purchase": "แหวนมรกตแบบอาร์ตเดโค",
    "home.testimonials.customer2.text":
      "Heritage Antiques เกินความคาดหมายทุกประการ ชิ้นงานมาถึงตรงตามที่อธิบายพร้อมเอกสารทางประวัติศาสตร์โดยละเอียด",
    "home.testimonials.customer3.name": "อิซาเบลลา โรดริเกซ",
    "home.testimonials.customer3.location": "บาร์เซโลนา, สเปน",
    "home.testimonials.customer3.purchase": "เข็มกลัดมุกแบบเอดเวิร์เดียน",
    "home.testimonials.customer3.text":
      "ชิ้นที่สะเทือนใจและเชื่อมต่อฉันกับประวัติศาสตร์ คุณภาพและการตรวจสอบความแท้ยอดเยี่ยม",

    // Thai
    "home.categories.title": "หมวดหมู่อันงดงาม",
    "home.categories.subtitle":
      "จากความหรูหราแบบวิคตอเรียถึงผลงานชิ้นเอกแบบอาร์ตเดโค สำรวจคอลเลกชันที่คัดสรรแล้ว",
    "home.categories.victorian": "ยุควิคตอเรีย",
    "home.categories.victorian.desc": "ลวดลายประณีต & ลวดลายโรแมนติก",
    "home.categories.victorian.count": "24 ชิ้น",
    "home.categories.artdeco": "อาร์ตเดโค",
    "home.categories.artdeco.desc": "ลวดลายเรขาคณิต & ดีไซน์โดดเด่น",
    "home.categories.artdeco.count": "18 ชิ้น",
    "home.categories.edwardian": "ยุคเอดเวิร์เดียน",
    "home.categories.edwardian.desc": "ลายละเอียดอ่อนช้อย & มุก",
    "home.categories.edwardian.count": "31 ชิ้น",
    "home.categories.vintage": "วินเทจโมเดิร์น",
    "home.categories.vintage.desc": "สไตล์ร่วมสมัยกลางศตวรรษ",
    "home.categories.vintage.count": "16 ชิ้น",

    // Thai
    "home.stats.years": "ปีแห่งความเชี่ยวชาญ",
    "home.stats.pieces": "ชิ้นที่ตรวจสอบแล้ว",
    "home.stats.collectors": "นักสะสมที่พอใจ",
    "home.stats.satisfaction": "อัตราความพึงพอใจ",

    // Add to Thai translations
    "footer.title": "เฮอริเทจ แอนทีค",
    "footer.subtitle": "คัดสรรสมบัติเหนือกาลเวลาตั้งแต่ปี 1999",
    "footer.description":
      "ค้นพบเครื่องประดับโบราณแท้พร้อมการตรวจสอบที่มาและการรับรองโดยผู้เชี่ยวชาญ",

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
    "footer.categories.brooches": "เข็มกลัดเอสเทท",
    "footer.categories.watches": "นาฬิกาวินเทจ",

    "footer.contact": "ข้อมูลการติดต่อ",
    "footer.contact.address": "123 ถนนเฮอริเทจ เขตโบราณ",
    "footer.contact.city": "กรุงเทพฯ ประเทศไทย 10110",
    "footer.contact.phone": "+66 2 123 4567",
    "footer.contact.email": "info@heritageantiques.com",
    "footer.contact.hours": "จันทร์-เสาร์: 10:00-19:00 น.",

    "footer.followUs": "ติดตามคอลเลกชันของเรา",
    "footer.newsletter": "รับข่าวสารล่าสุด",
    "footer.newsletter.desc": "รับแจ้งเตือนเกี่ยวกับของใหม่และชิ้นพิเศษ",
    "footer.newsletter.placeholder": "กรอกอีเมลของคุณ",
    "footer.newsletter.subscribe": "สมัครรับข่าวสาร",

    "footer.legal": "ข้อกฎหมาย",
    "footer.legal.privacy": "นโยบายความเป็นส่วนตัว",
    "footer.legal.terms": "เงื่อนไขการใช้บริการ",
    "footer.legal.returns": "การคืนสินค้าและการแลกเปลี่ยน",
    "footer.legal.authenticity": "การรับประกันความแท้",

    "footer.copyright": "© 2025 เฮอริเทจ แอนทีค สงวนลิขสิทธิ์",
    "footer.crafted":
      "สร้างสรรค์ด้วยความหลงใหลในเครื่องประดับโบราณสำหรับนักสะสม",
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
