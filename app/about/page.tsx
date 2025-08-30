"use client"
import { Shield, Clock, Gem, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();

  const stats = [
    { icon: Clock, label: 'Years of Expertise', value: '16+' },
    { icon: Gem, label: 'Authenticated Pieces', value: '500+' },
    { icon: Shield, label: 'Satisfied Collectors', value: '350+' },
    { icon: Award, label: 'Authenticity Rate', value: '100%' }
  ];

  const team = [
    {
      name: 'Somchai Wangmanee',
      role: 'Founder & Master Appraiser',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Third-generation jewelry expert with 25+ years specializing in Victorian and Art Deco pieces'
    },
    {
      name: 'Dr. Siriporn Chen',
      role: 'Senior Authenticator',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Ph.D. in Art History, specialist in Asian antiques and provenance documentation'
    },
    {
      name: 'James Harrison',
      role: 'European Antiques Curator',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Former Sotheby\'s specialist with expertise in European estate jewelry'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-stone-900">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1446948/pexels-photo-1446948.jpeg?auto=compress&cs=tinysrgb&w=1200)'
          }}
        >
          <div className="absolute inset-0 bg-stone-900 bg-opacity-70" />
        </div>
        <div className="relative h-full flex items-center justify-center text-center text-white">
          <div className="max-w-4xl px-4">
            <div className="mb-6">
              <div className="w-16 h-0.5 bg-stone-200 mx-auto mb-4"></div>
              <p className="text-stone-200 tracking-[0.2em] text-sm font-light uppercase">
                Established 2008 • Bangkok, Thailand
              </p>
            </div>
            <h1 className="text-5xl md:text-6xl font-light mb-6">
              <span className="font-serif">Wangmanee</span> Gallery
            </h1>
            <p className="text-xl md:text-2xl font-light leading-relaxed max-w-3xl mx-auto">
              Curating exceptional antique jewelry with authenticated provenance for discerning collectors worldwide
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="group">
                  <div className="w-16 h-16 bg-stone-900 rounded-sm mx-auto mb-4 flex items-center justify-center group-hover:bg-stone-800 transition-colors duration-200">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-light text-stone-900 mb-2">{stat.value}</div>
                  <div className="text-stone-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Heritage */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-8">
                <div className="w-16 h-0.5 bg-stone-600 mb-4"></div>
                <p className="text-stone-600 tracking-[0.2em] text-sm font-medium uppercase">
                  Our Heritage
                </p>
              </div>
              <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-8 leading-tight">
                A Legacy of <span className="font-serif italic">Authenticity</span>
              </h2>
              <div className="space-y-6 text-stone-700 leading-relaxed">
                <p>
                  Founded in 2008 by master jeweler Somchai Wangmanee, our gallery represents three generations 
                  of expertise in fine antique jewelry. Located in the heart of Bangkok's historic district, 
                  we have built our reputation on meticulous authentication and uncompromising quality.
                </p>
                <p>
                  What began as a passion for preserving historical craftsmanship has evolved into Southeast Asia's 
                  most trusted source for authenticated antique jewelry. Each piece in our collection undergoes 
                  rigorous verification, complete with detailed provenance documentation.
                </p>
                <p>
                  Today, collectors from around the world trust Wangmanee Gallery to provide not just exquisite 
                  jewelry, but the stories and heritage that make each piece truly exceptional. Our commitment 
                  to authenticity remains unwavering after more than a decade of service.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="relative overflow-hidden rounded-sm shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Antique jewelry workshop"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-sm shadow-xl border border-stone-100">
                <div className="text-2xl font-light text-stone-900 mb-1">Est. 2008</div>
                <div className="text-sm text-stone-600">Bangkok, Thailand</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise & Values */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="mb-8">
              <div className="w-16 h-0.5 bg-stone-600 mx-auto mb-4"></div>
              <p className="text-stone-600 tracking-[0.2em] text-sm font-medium uppercase">
                Our Expertise
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-6">
              Uncompromising <span className="font-serif italic">Standards</span>
            </h2>
            <p className="text-xl text-stone-700 max-w-2xl mx-auto font-light">
              Every piece meets our exacting standards for authenticity, condition, and historical significance
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-stone-900 rounded-sm mx-auto mb-6 flex items-center justify-center group-hover:bg-stone-800 transition-colors duration-200">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-medium text-stone-900 mb-4">Expert Authentication</h3>
              <p className="text-stone-600 leading-relaxed">
                Our certified gemologists and historians verify every piece using advanced techniques 
                and decades of expertise to ensure absolute authenticity.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-stone-900 rounded-sm mx-auto mb-6 flex items-center justify-center group-hover:bg-stone-800 transition-colors duration-200">
                <Gem className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-medium text-stone-900 mb-4">Curated Collection</h3>
              <p className="text-stone-600 leading-relaxed">
                Each piece is carefully selected for its historical significance, craftsmanship quality, 
                and provenance documentation before joining our collection.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-stone-900 rounded-sm mx-auto mb-6 flex items-center justify-center group-hover:bg-stone-800 transition-colors duration-200">
                <Award className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-medium text-stone-900 mb-4">Lifetime Guarantee</h3>
              <p className="text-stone-600 leading-relaxed">
                We stand behind every piece with comprehensive documentation and a lifetime 
                authenticity guarantee for complete peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="mb-8">
              <div className="w-16 h-0.5 bg-stone-600 mx-auto mb-4"></div>
              <p className="text-stone-600 tracking-[0.2em] text-sm font-medium uppercase">
                Meet Our Experts
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-6">
              The <span className="font-serif italic">Specialists</span> Behind Your Collection
            </h2>
            <p className="text-xl text-stone-700 max-w-2xl mx-auto font-light">
              Our team combines generations of experience with modern authentication techniques
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {team.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative w-56 h-56 mx-auto mb-6 overflow-hidden rounded-sm">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-medium text-stone-900 mb-2">{member.name}</h3>
                <p className="text-stone-600 font-medium mb-4 text-sm uppercase tracking-wide">{member.role}</p>
                <p className="text-stone-600 leading-relaxed text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visit Our Gallery */}
      <section className="py-20 bg-stone-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="mb-8">
            <div className="w-16 h-0.5 bg-stone-300 mx-auto mb-4"></div>
            <p className="text-stone-200 tracking-[0.2em] text-sm font-light uppercase">
              Visit Our Gallery
            </p>
          </div>
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            Ready to Discover Your <span className="font-serif italic">Perfect Piece</span>?
          </h2>
          <p className="text-xl mb-8 font-light text-stone-100 leading-relaxed">
            Experience our collection in person or browse our authenticated pieces online with detailed provenance
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-6 sm:flex sm:justify-center">
            <a
              href="/tours"
              className="inline-block bg-white text-stone-900 px-8 py-4 font-medium hover:bg-stone-50 transition-colors duration-200 rounded-sm"
            >
              Browse Collection
            </a>
            <a
              href="/contact"
              className="inline-block border border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-stone-900 transition-colors duration-200 rounded-sm"
            >
              Visit Gallery
            </a>
          </div>
          
          <div className="mt-12 pt-8 border-t border-stone-700">
            <div className="text-stone-300 text-sm space-y-1">
              <p>Wangmanee Jewelry Store, Bangkok, Thailand</p>
              <p>Open Daily: 10:00 AM - 8:00 PM</p>
              <p>Private appointments available</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}