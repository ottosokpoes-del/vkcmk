import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const luxuryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // Hero Section Animations
      gsap.from(".hero-title", {
        opacity: 0,
        y: 50,
        duration: 1.2,
        ease: "power2.out"
      });

      gsap.from(".hero-subtitle", {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.3,
        ease: "power2.out"
      });

      gsap.from(".hero-btn", {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.6,
        ease: "power2.out"
      });

      // Hero background parallax
      gsap.from(".hero-bg", {
        scale: 1.1,
        duration: 2,
        ease: "power2.out"
      });

      gsap.to(".hero-bg", {
        scale: 1,
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Benefits Section
      gsap.from(".benefit-card", {
        opacity: 0,
        y: 80,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".benefits-section",
          start: "top 80%",
          end: "bottom 20%",
        },
      });

      // Luxury Experience Section
      gsap.from(".luxury-text", {
        opacity: 0,
        x: -50,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".luxury-section",
          start: "top 70%",
          end: "bottom 30%",
        },
      });

      gsap.from(".luxury-image", {
        opacity: 0,
        x: 50,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".luxury-section",
          start: "top 70%",
          end: "bottom 30%",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  const benefits = [
    {
      icon: "🛡️",
      title: "Güvenli Alışveriş",
      description: "Tüm araçlarımız detaylı kontrol edilir ve güvenlik sertifikalarına sahiptir."
    },
    {
      icon: "💰",
      title: "En İyi Fiyatlar",
      description: "Piyasadaki en rekabetçi fiyatlarla premium araçları keşfedin."
    },
    {
      icon: "🚗",
      title: "Geniş Seçenek",
      description: "Binlerce araç arasından ihtiyacınıza uygun olanı kolayca bulun."
    },
    {
      icon: "📞",
      title: "7/24 Destek",
      description: "Uzman ekibimiz her zaman yanınızda, sorularınızı yanıtlamaya hazır."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="hero-section relative h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="hero-bg absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1920&h=1080&fit=crop")'
            }}
          />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="hero-title text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Drive Beyond Ordinary
          </h1>
          <p className="hero-subtitle text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Discover premium vehicles that redefine luxury and performance. 
            Experience automotive excellence like never before.
          </p>
          <Link 
            to="/gallery"
            className="hero-btn inline-block bg-sahibinden-red text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors duration-300"
          >
            Explore Models
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section ref={benefitsRef} className="benefits-section py-20 bg-white mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Neden Bizi Seçmelisiniz?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Otomotiv deneyiminizi bir üst seviyeye taşıyacak avantajlarımızı keşfedin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="benefit-card group cursor-pointer"
                style={{ willChange: 'transform' }}
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 p-8 text-center">
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/gallery"
              className="inline-block bg-sahibinden-red text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors duration-300"
            >
              Araçları Keşfet
            </Link>
          </div>
        </div>
      </section>


      {/* Luxury Experience Section */}
      <section ref={luxuryRef} className="luxury-section py-20 bg-gray-50 mt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="luxury-text">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Luxury Experience
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Every vehicle in our collection represents the pinnacle of automotive engineering. 
                From meticulously crafted interiors to cutting-edge technology, we deliver an 
                experience that exceeds expectations.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our commitment to excellence ensures that every detail, from the initial design 
                to the final delivery, reflects our dedication to providing the ultimate 
                automotive experience.
              </p>
              <Link 
                to="/about"
                className="inline-block bg-sahibinden-red text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors duration-300"
              >
                Learn More
              </Link>
            </div>
            <div className="luxury-image">
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop"
                  alt="Luxury Car Interior"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
