import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const philosophyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Banner Animation
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

      // Company Story Section
      gsap.from(".story-text", {
        opacity: 0,
        x: -50,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".story-section",
          start: "top 70%",
          end: "bottom 30%",
        },
      });

      gsap.from(".story-image", {
        opacity: 0,
        x: 50,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".story-section",
          start: "top 70%",
          end: "bottom 30%",
        },
      });

      // Timeline background parallax
      gsap.to(".timeline-bg", {
        y: -100,
        scrollTrigger: {
          trigger: ".timeline-section",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Timeline items individual parallax
      gsap.utils.toArray(".timeline-item").forEach((item: any, index) => {
        gsap.to(item, {
          y: -50 * (index + 1),
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            end: "bottom 20%",
            scrub: true,
          },
        });
      });

      // Timeline grader icons slow movement with acceleration
      gsap.utils.toArray(".timeline-dot").forEach((grader: any, index) => {
        gsap.to(grader, {
          x: 8,
          duration: 4 + index * 0.5,
          ease: "power1.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      // Team Section
      gsap.from(".team-card", {
        opacity: 0,
        y: 80,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".team-section",
          start: "top 80%",
          end: "bottom 20%",
        },
      });

      // Philosophy Section
      gsap.from(".philosophy-content", {
        opacity: 0,
        scale: 0.9,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".philosophy-section",
          start: "top 70%",
          end: "bottom 30%",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  const milestones = [
    { year: "2010", title: "Foundation", description: "GraderMarket was founded with a vision to revolutionize the construction equipment marketplace." },
    { year: "2015", title: "Expansion", description: "We expanded our services across major cities, reaching thousands of construction companies." },
    { year: "2020", title: "Digital Innovation", description: "Launched our digital platform with advanced features and AI-powered recommendations." },
    { year: "2024", title: "Premium Focus", description: "Shifted focus to premium graders and parts, becoming the leading construction equipment marketplace." }
  ];

  const teamMembers = [
    { name: "Ahmet Yılmaz", position: "CEO & Founder", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face" },
    { name: "Elif Demir", position: "CTO", image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face" },
    { name: "Mehmet Kaya", position: "Head of Sales", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face" },
    { name: "Zeynep Özkan", position: "Design Director", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section ref={heroRef} className="relative h-96 bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center overflow-hidden pt-16">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: 'url("/rsm/Grader02.jpg")'
          }}
        />
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
          <h1 className="hero-title text-5xl md:text-6xl font-bold mb-4">
            Innovation Meets Power
          </h1>
          <p className="hero-subtitle text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
            Discover the story behind GraderMarket's commitment to construction equipment excellence
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section ref={storyRef} className="story-section py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="story-text">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Founded in 2010, GraderMarket began as a small team with a big dream: to transform 
                how people buy and sell premium construction equipment. What started as a local marketplace 
                has grown into Turkey's most trusted platform for heavy machinery experiences.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our journey has been marked by continuous innovation, unwavering commitment to 
                quality, and an unshakeable belief that every construction company deserves access to 
                exceptional graders and parts.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">14+</div>
                  <div className="text-gray-600">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">50K+</div>
                  <div className="text-gray-600">Happy Customers</div>
                </div>
              </div>
            </div>
            <div className="story-image">
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <img
                  src="/rsm/Budowa_Velostrady_nr_6_-_odcinek_Katowice_Brynów_-_Katowice_Brynów,_wyrównywarka_oraz_walec_podczas_pracy.jpg"
                  alt="Company Story"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline / Milestones */}
      <section ref={timelineRef} className="timeline-section py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
        {/* Parallax Background */}
        <div className="timeline-bg absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url("/rsm/Grader02.jpg")'
            }}
          />
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Key milestones that shaped our commitment to construction equipment excellence
            </p>
          </div>

          <div className="relative">
            {/* Road Line - 2 Lane Highway */}
            <div className="timeline-line absolute left-1/2 transform -translate-x-1/2 w-20 h-full">
              {/* Road surface */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-600 via-gray-500 to-gray-600 rounded-lg"></div>
              
              {/* Center line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-yellow-400 opacity-80"></div>
              
              {/* Road edges */}
              <div className="absolute left-0 top-0 w-1 h-full bg-white opacity-60"></div>
              <div className="absolute right-0 top-0 w-1 h-full bg-white opacity-60"></div>
            </div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div 
                  key={index} 
                  className={`timeline-item flex items-center ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:scale-105">
                      <div className="text-2xl font-bold text-orange-600 mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Grader Icon */}
                  <div className="timeline-dot absolute left-1/2 transform -translate-x-1/2 w-20 h-12 flex items-center justify-center">
                    <img 
                      src="/rsm/grader-icon.png" 
                      alt="Grader Icon" 
                      className="w-16 h-10 object-contain drop-shadow-lg"
                    />
                  </div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section ref={teamRef} className="team-section py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate individuals behind GraderMarket's success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className="team-card group cursor-pointer"
                style={{ willChange: 'transform' }}
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-gray-600">
                      {member.position}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Philosophy */}
      <section ref={philosophyRef} className="philosophy-section py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="philosophy-content">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              "Power that builds the future."
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Our philosophy centers on the belief that every grader should be more than just 
              construction equipment—it should be an expression of your commitment to quality, 
              your dedication to progress, and your vision for building tomorrow.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
