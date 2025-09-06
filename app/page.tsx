"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Users,
  Star,
  Sparkles,
  Dot,
  Clock,
  Shield, // Add this
  Gem, // Add this
  Award, // Add this
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  const carouselImages = [
    {
      src: "https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title: t("home.hero.title1"),
      description: t("home.hero.desc1"),
    },
    {
      src: "https://images.pexels.com/photos/1446948/pexels-photo-1446948.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title: t("home.hero.title2"),
      description: t("home.hero.desc2"),
    },
    {
      src: "https://images.pexels.com/photos/1395319/pexels-photo-1395319.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title: t("home.hero.title3"),
      description: t("home.hero.desc3"),
    },
  ];

  const featuredTours = [
    {
      id: 1,
      name: "Victorian Diamond Rivière Necklace",
      location: "England, circa 1870",
      duration: "Victorian Era",
      price: 12500,
      rating: 4.9,
      image:
        "https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=400",
      description:
        "Exquisite graduated diamond rivière with impeccable provenance",
    },
    {
      id: 2,
      name: "Art Deco Emerald & Diamond Ring",
      location: "France, circa 1925",
      duration: "Art Deco Period",
      price: 8900,
      rating: 4.8,
      image:
        "https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Stunning emerald-cut emerald surrounded by diamonds",
    },
    {
      id: 3,
      name: "Edwardian Pearl & Amethyst Brooch",
      location: "England, circa 1905",
      duration: "Edwardian Period",
      price: 3200,
      rating: 4.7,
      image:
        "https://images.pexels.com/photos/1446948/pexels-photo-1446948.jpeg?auto=compress&cs=tinysrgb&w=400",
      description:
        "Delicate filigree work featuring natural pearls and amethysts",
    },
  ];

  // Simplified animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12,
      },
    },
  };

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const slideVariants = {
    enter: {
      x: 1000,
      opacity: 0,
    },
    center: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
    exit: {
      x: -1000,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-white">
      <style jsx>{`
        .glass-effect {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>

      {/* Hero Carousel */}
      <section className="relative h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            <div
              className="h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${carouselImages[currentSlide].src})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 via-amber-900/80 to-stone-800/70" />

              <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                <motion.div className="max-w-4xl px-4" variants={itemVariants}>
                  <div className="mb-6">
                    <div className="inline-block">
                      <div className="w-16 h-0.5 bg-stone-200 mb-4"></div>
                      <p className="text-stone-200 tracking-[0.2em] text-sm font-light uppercase">
                        Established 2008 • Authentic Jewelry Specialists
                      </p>
                    </div>
                  </div>

                  <h1 className="text-5xl md:text-7xl font-light leading-tight mb-6">
                    {carouselImages[currentSlide].title
                      .split(" ")
                      .map((word, index) => (
                        <span key={index}>
                          {index === 1 ? (
                            <span className="font-serif italic text-stone-200">
                              {word}
                            </span>
                          ) : (
                            word
                          )}
                          {index <
                            carouselImages[currentSlide].title.split(" ")
                              .length -
                              1 && " "}
                        </span>
                      ))}
                  </h1>

                  <p className="text-xl text-stone-100 mb-8 leading-relaxed font-light max-w-3xl">
                    {carouselImages[currentSlide].description}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden bg-white text-stone-900 font-medium tracking-wide transition-all duration-500 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 shadow-2xl">
                      <span className="absolute inset-0 bg-gradient-to-r from-stone-100 to-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                      <span className="relative flex items-center gap-3">
                        <svg
                          className="w-5 h-5 transition-transform group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          ></path>
                        </svg>
                        {t("home.hero.explore")}
                      </span>
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          <ChevronLeft className="h-6 w-6 mx-auto" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          <ChevronRight className="h-6 w-6 mx-auto" />
        </button>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {carouselImages.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-stone-200 shadow-lg scale-125"
                  : "bg-white/50"
              }`}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </section>

      {/* Heritage Stats */}
      {/* Heritage Stats - Updated to match About page styling */}
      <motion.section
        className="py-16 bg-stone-100"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="grid md:grid-cols-4 gap-8 text-center"
            variants={containerVariants}
          >
            {[
              { icon: Clock, label: t("home.stats.years"), value: "16+" },
              { icon: Gem, label: t("home.stats.pieces"), value: "500+" },
              {
                icon: Shield,
                label: t("home.stats.collectors"),
                value: "350+",
              },
              {
                icon: Award,
                label: t("home.stats.satisfaction"),
                value: "100%",
              },
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group"
                >
                  <div className="w-16 h-16 bg-stone-900 rounded-sm mx-auto mb-4 flex items-center justify-center group-hover:bg-stone-800 transition-colors duration-200">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-light text-stone-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-stone-600 font-medium">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Pieces */}
      <motion.section
        className="py-16 bg-white relative"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-stone-50/30 to-white/30"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <div className="inline-block mb-6">
              <div className="w-16 h-0.5 bg-stone-600 mx-auto mb-4"></div>
              <p className="text-stone-700 tracking-[0.2em] text-sm font-medium uppercase">
                Curated Selections
              </p>
            </div>
            <h2 className="text-4xl md:text-6xl font-light text-stone-900 mb-6">
              {t("home.featured.title")
                .split(" ")
                .map((word, index) => (
                  <span key={index}>
                    {index === 1 ? (
                      <span className="font-serif italic">{word}</span>
                    ) : (
                      word
                    )}
                    {index < t("home.featured.title").split(" ").length - 1 &&
                      " "}
                  </span>
                ))}
            </h2>
            <p className="text-xl text-stone-700 max-w-2xl mx-auto font-light">
              {t("home.featured.subtitle")}
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {featuredTours.map((tour, index) => (
              <motion.div
                key={tour.id}
                variants={cardVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-xl transition-all duration-300 border border-stone-200 shadow-lg overflow-hidden bg-white">
                  <div className="relative h-48 group">
                    <img
                      src={tour.image}
                      alt={tour.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl text-sm font-bold text-stone-800 shadow-lg border border-stone-100">
                      ${tour.price}
                    </div>
                  </div>
                  <div className="group relative bg-white border border-stone-200/60 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-stone-300/20 hover:border-stone-300/80">
                    <div className="absolute inset-0 bg-gradient-to-br from-stone-50/30 to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="relative">
                        <CardContent className="p-6 bg-gradient-to-b from-white to-stone-50/30">
                          <h3 className="text-xl font-semibold mb-2 text-stone-900 group-hover:text-stone-700 transition-colors">
                            {tour.name}
                          </h3>
                          <div className="flex items-center text-stone-700 mb-2">
                            <MapPin className="h-4 w-4 mr-1 text-stone-500" />
                            <span className="text-sm font-medium">
                              {tour.location}
                            </span>
                          </div>
                          <div className="flex items-center text-stone-700 mb-2">
                            <Calendar className="h-4 w-4 mr-1 text-stone-500" />
                            <span className="text-sm font-medium">
                              {tour.duration}
                            </span>
                          </div>
                          <div className="flex items-center mb-3">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-stone-600 ml-1">
                              {tour.rating}
                            </span>
                          </div>
                          <p className="text-stone-600 text-sm mb-4 leading-relaxed">
                            {tour.description}
                          </p>
                          <button className="group w-full relative overflow-hidden bg-stone-800 text-white py-3 px-6 font-medium tracking-wide transition-all duration-400 hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2">
                            <span className="absolute inset-0 bg-gradient-to-r from-stone-700 to-stone-600 translate-x-[-100%] transition-transform duration-400 group-hover:translate-x-0"></span>
                            <span className="relative flex items-center justify-center gap-2">
                              {t("tours.viewDetails")}
                              <svg
                                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 5l7 7-7 7"
                                ></path>
                              </svg>
                            </span>
                          </button>
                        </CardContent>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Jewelry Categories */}
      <motion.section
        className="py-16 bg-gradient-to-br from-stone-100 to-white relative"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <div className="inline-block mb-6">
              <div className="w-16 h-0.5 bg-stone-600 mx-auto mb-4"></div>
              <p className="text-stone-700 tracking-[0.2em] text-sm font-medium uppercase">
                {t("home.categories.subtitle").split(" ").slice(0, 3).join(" ")}
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-6">
              {t("home.categories.title")
                .split(" ")
                .map((word, index) => (
                  <span key={index}>
                    {index === 1 ? (
                      <span className="font-serif italic">{word}</span>
                    ) : (
                      word
                    )}
                    {index < t("home.categories.title").split(" ").length - 1 &&
                      " "}
                  </span>
                ))}
            </h2>
            <p className="text-xl text-stone-700 max-w-2xl mx-auto font-light">
              {t("home.categories.subtitle")}
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={containerVariants}
          >
            {[
              {
                title: t("home.categories.victorian"),
                icon: "💎",
                count: t("home.categories.victorian.count"),
                image:
                  "https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=400",
                description: t("home.categories.victorian.desc"),
              },
              {
                title: t("home.categories.artdeco"),
                icon: "✨",
                count: t("home.categories.artdeco.count"),
                image:
                  "https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=400",
                description: t("home.categories.artdeco.desc"),
              },
              {
                title: t("home.categories.edwardian"),
                icon: "🌸",
                count: t("home.categories.edwardian.count"),
                image:
                  "https://images.pexels.com/photos/1446948/pexels-photo-1446948.jpeg?auto=compress&cs=tinysrgb&w=400",
                description: t("home.categories.edwardian.desc"),
              },
              {
                title: t("home.categories.vintage"),
                icon: "🏺",
                count: t("home.categories.vintage.count"),
                image:
                  "https://images.pexels.com/photos/1395319/pexels-photo-1395319.jpeg?auto=compress&cs=tinysrgb&w=400",
                description: t("home.categories.vintage.desc"),
              },
            ].map((category, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ scale: 1.02 }}
                className="group cursor-pointer"
              >
                <div className="group cursor-pointer">
                  <div className="relative h-48 overflow-hidden mb-4 border border-stone-200/40 transition-all duration-500 group-hover:border-stone-300/60">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <div className="w-1 h-8 bg-white/60 mb-3"></div>
                      <h3 className="font-medium text-lg tracking-wide mb-1">
                        {category.title}
                      </h3>
                      <p className="text-sm text-stone-200 font-light">
                        {category.count}
                      </p>
                    </div>
                  </div>
                  <p className="text-center text-stone-700 text-sm font-light leading-relaxed px-2">
                    {category.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Company Description */}
      <motion.section
        className="py-16 bg-gradient-to-br from-white to-stone-50 relative overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants}>
              <div className="mb-6">
                <div className="w-16 h-0.5 bg-stone-600 mb-4"></div>
                <p className="text-stone-700 tracking-[0.2em] text-sm font-medium uppercase">
                  Why Choose Wangmanee Gallery
                </p>
              </div>

              <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-6 leading-tight">
                {t("home.company.title")
                  .split(" ")
                  .map((word, index) => (
                    <span key={index}>
                      {index === 2 ? (
                        <span className="font-serif italic">{word}</span>
                      ) : (
                        word
                      )}
                      {index < t("home.company.title").split(" ").length - 1 &&
                        " "}
                    </span>
                  ))}
              </h2>
              <p className="text-lg text-stone-700 mb-6 leading-relaxed font-light">
                {t("home.company.desc")}
              </p>
              <div className="space-y-6">
                {[
                  {
                    icon: Users,
                    title: t("home.features.expertGuides"),
                    desc: t("home.features.expertGuidesDesc"),
                  },
                  {
                    icon: Star,
                    title: t("home.features.premiumQuality"),
                    desc: t("home.features.premiumQualityDesc"),
                  },
                  {
                    icon: MapPin,
                    title: t("home.features.uniqueDestinations"),
                    desc: t("home.features.uniqueDestinationsDesc"),
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start group">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-stone-600 to-stone-700 rounded-xl flex items-center justify-center mr-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <item.icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-stone-900 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-stone-700 leading-relaxed font-light">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div className="relative" variants={itemVariants}>
              <div className="relative group">
                <img
                  src="https://images.pexels.com/photos/1446948/pexels-photo-1446948.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Antique jewelry collection"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-stone-600/20 to-stone-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="absolute -bottom-8 -left-8 bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-stone-100">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-stone-600 to-stone-700 rounded-xl flex items-center justify-center mr-4">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-stone-900 text-lg">
                        Expert Authentication
                      </div>
                      <div className="text-sm text-stone-700">
                        16+ Years Experience
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Customer Testimonials */}
      <motion.section
        className="py-16 bg-white relative overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-stone-50/50 to-white/50"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <div className="inline-block mb-6">
              <div className="w-16 h-0.5 bg-stone-600 mx-auto mb-4"></div>
              <p className="text-stone-700 tracking-[0.2em] text-sm font-medium uppercase">
                {t("home.testimonials.subtitle").split(" ").slice(-3).join(" ")}
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-6">
              {t("home.testimonials.title")
                .split(" ")
                .map((word, index) => (
                  <span key={index}>
                    {index === 1 ? (
                      <span className="font-serif italic">{word}</span>
                    ) : (
                      word
                    )}
                    {index <
                      t("home.testimonials.title").split(" ").length - 1 && " "}
                  </span>
                ))}
            </h2>
            <p className="text-xl text-stone-700 max-w-2xl mx-auto font-light">
              {t("home.testimonials.subtitle")}
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {[
              {
                name: t("home.testimonials.customer1.name"),
                location: t("home.testimonials.customer1.location"),
                purchase: t("home.testimonials.customer1.purchase"),
                rating: 5,
                text: t("home.testimonials.customer1.text"),
                image:
                  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
              },
              {
                name: t("home.testimonials.customer2.name"),
                location: t("home.testimonials.customer2.location"),
                purchase: t("home.testimonials.customer2.purchase"),
                rating: 5,
                text: t("home.testimonials.customer2.text"),
                image:
                  "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150",
              },
              {
                name: t("home.testimonials.customer3.name"),
                location: t("home.testimonials.customer3.location"),
                purchase: t("home.testimonials.customer3.purchase"),
                rating: 5,
                text: t("home.testimonials.customer3.text"),
                image:
                  "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-stone-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-stone-200"
                  />
                  <div>
                    <h4 className="font-semibold text-stone-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-stone-600">
                      {testimonial.location}
                    </p>
                    <p className="text-xs text-stone-500 italic">
                      {testimonial.purchase}
                    </p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>

                <p className="text-stone-700 leading-relaxed italic font-light">
                  "{testimonial.text}"
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        className="py-16 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white relative overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <motion.div className="mb-6" variants={itemVariants}>
            <div className="w-16 h-0.5 bg-stone-300 mx-auto mb-4"></div>
            <p className="text-stone-200 tracking-[0.2em] text-sm font-light uppercase">
              Start Your Collection Journey
            </p>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-light mb-6">
            {t("home.cta.title")
              .split(" ")
              .map((word, index) => (
                <span key={index}>
                  {word.toLowerCase().includes("perfect") ||
                  word.toLowerCase().includes("piece") ? (
                    <span className="font-serif italic text-stone-200">
                      {word}
                    </span>
                  ) : (
                    word
                  )}
                  {index < t("home.cta.title").split(" ").length - 1 && " "}
                </span>
              ))}
          </h2>
          <p className="text-xl text-stone-100 mb-8 font-light">
            {t("home.cta.subtitle")}
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <button className="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden bg-white text-stone-900 font-medium tracking-wide transition-all duration-400 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 shadow-2xl">
              <span className="absolute inset-0 bg-gradient-to-r from-stone-50 to-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              <span className="relative flex items-center gap-3">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M5 3l14 9-14 9V3z"
                  ></path>
                </svg>
                {t("home.cta.browse")}
              </span>
            </button>
            <button className="group relative inline-flex items-center justify-center px-10 py-4 border border-white/30 bg-white/5 backdrop-blur-sm text-white font-medium tracking-wide transition-all duration-400 hover:bg-white hover:text-stone-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">
              <span className="relative flex items-center gap-3">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  ></path>
                </svg>
                {t("home.cta.learn")}
              </span>
            </button>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg')] bg-cover bg-center opacity-5"></div>

        <div className="relative z-10">
          {/* Main Footer Content */}
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Company Info */}
              <motion.div
                className="lg:col-span-1"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="mb-6">
                  <h3 className="text-2xl font-serif italic text-stone-200 mb-2">
                    {t("footer.title")}
                  </h3>
                  <p className="text-stone-300 text-sm font-light tracking-wide">
                    {t("footer.subtitle")}
                  </p>
                </div>
                <p className="text-stone-100 mb-6 leading-relaxed font-light text-sm">
                  {t("footer.description")}
                </p>

                {/* Social Media */}
                <div className="mb-6">
                  <h4 className="text-stone-200 font-semibold mb-4 text-sm uppercase tracking-wide">
                    {t("footer.followUs")}
                  </h4>
                  <div className="flex space-x-4">
                    <a
                      href="https://instagram.com/wangmaneegallery"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg flex items-center justify-center hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>

                    <a
                      href="#"
                      className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h4 className="text-stone-200 font-semibold mb-6 text-sm uppercase tracking-wide">
                  {t("footer.quickLinks")}
                </h4>
                <ul className="space-y-3">
                  {[
                    { key: "home", href: "/" },
                    { key: "collection", href: "/products" },
                    { key: "about", href: "/about" },
                    { key: "contact", href: "/contact" },
                    { key: "authentication", href: "/authentication" },
                    { key: "shipping", href: "/shipping" },
                  ].map((link, index) => (
                    <li key={link.key}>
                      <Link
                        href={link.href}
                        className="text-stone-100 hover:text-stone-300 transition-colors font-light text-sm"
                      >
                        {t(`footer.quickLinks.${link.key}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Categories */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h4 className="text-stone-200 font-semibold mb-6 text-sm uppercase tracking-wide">
                  {t("footer.categories")}
                </h4>
                <ul className="space-y-3">
                  {[
                    { key: "rings", href: "/tours?category=rings" },
                    { key: "necklaces", href: "/tours?category=necklaces" },
                    { key: "bracelets", href: "/tours?category=bracelets" },
                    { key: "earrings", href: "/tours?category=earrings" },
                    { key: "brooches", href: "/tours?category=brooches" },
                    { key: "watches", href: "/tours?category=watches" },
                  ].map((category, index) => (
                    <li key={category.key}>
                      <Link
                        href={category.href}
                        className="text-stone-100 hover:text-stone-300 transition-colors font-light text-sm"
                      >
                        {t(`footer.categories.${category.key}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h4 className="text-stone-200 font-semibold mb-6 text-sm uppercase tracking-wide">
                  {t("footer.contact")}
                </h4>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-stone-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-stone-100 text-sm font-light leading-relaxed">
                        {t("footer.contact.address")}
                      </p>
                      <p className="text-stone-100 text-sm font-light">
                        {t("footer.contact.city")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="h-4 w-4 text-stone-400 mr-3 flex items-center justify-center">
                      📞
                    </div>
                    <p className="text-stone-100 text-sm font-light">
                      {t("footer.contact.phone")}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <div className="h-4 w-4 text-stone-400 mr-3 flex items-center justify-center">
                      ✉️
                    </div>
                    <p className="text-stone-100 text-sm font-light">
                      {t("footer.contact.email")}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-stone-400 mr-3" />
                    <p className="text-stone-100 text-sm font-light">
                      {t("footer.contact.hours")}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-stone-700/50 bg-stone-950/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-stone-200 text-sm font-light mb-4 md:mb-0">
                  {t("footer.copyright")}
                </p>

                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                  <p className="text-stone-300 text-xs font-light italic">
                    {t("footer.crafted")}
                  </p>

                  <div className="flex space-x-4 text-xs">
                    {[
                      { key: "privacy", href: "/privacy" },
                      { key: "terms", href: "/terms" },
                      { key: "returns", href: "/returns" },
                      { key: "authenticity", href: "/authenticity" },
                    ].map((legal, index) => (
                      <Link
                        key={legal.key}
                        href={legal.href}
                        className="text-stone-300 hover:text-stone-100 transition-colors"
                      >
                        {t(`footer.legal.${legal.key}`)}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
