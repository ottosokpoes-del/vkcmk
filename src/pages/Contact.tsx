import { useState, useEffect, useRef } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Section Animation
      gsap.from(".contact-title", {
        opacity: 0,
        y: 50,
        duration: 1.2,
        ease: "power2.out"
      });

      gsap.from(".contact-subtitle", {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.3,
        ease: "power2.out"
      });

      // Form Animation
      gsap.from(".form-field", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".form-section",
          start: "top 80%",
          end: "bottom 20%",
        },
      });

      // Map Section Animation
      gsap.from(".map-section", {
        opacity: 0,
        scale: 0.9,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".map-section",
          start: "top 80%",
          end: "bottom 20%",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Success animation
    gsap.to(".submit-btn", {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.out"
    });

    setSubmitStatus('success');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);

    // Reset status after 3 seconds
    setTimeout(() => setSubmitStatus('idle'), 3000);
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    gsap.to(e.target, {
      scale: 1.02,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    gsap.to(e.target, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section ref={headerRef} className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black pt-36">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="contact-title text-5xl md:text-6xl font-bold text-white mb-6">
            Get in Touch
          </h1>
          <p className="contact-subtitle text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section ref={formRef} className="form-section py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-field">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all duration-300"
                    placeholder="Your full name"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all duration-300"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all duration-300"
                    placeholder="What's this about?"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="submit-btn w-full bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <FiSend className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                {submitStatus === 'success' && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                    <p className="font-medium">Message sent successfully!</p>
                    <p className="text-sm">We'll get back to you soon.</p>
                  </div>
                )}
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Contact Information
              </h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiMapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Maslak Mahallesi, Büyükdere Caddesi<br />
                      No: 123, Sarıyer/İstanbul<br />
                      Turkey
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiPhone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
                    <p className="text-gray-600">
                      <a href="tel:+902125550123" className="hover:text-orange-600 transition-colors">
                        +90 (212) 555 0123
                      </a>
                    </p>
                    <p className="text-gray-600">
                      <a href="tel:+902125550124" className="hover:text-orange-600 transition-colors">
                        +90 (212) 555 0124
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiMail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                    <p className="text-gray-600">
                      <a href="mailto:info@gradermarket.com" className="hover:text-orange-600 transition-colors">
                        info@gradermarket.com
                      </a>
                    </p>
                    <p className="text-gray-600">
                      <a href="mailto:support@gradermarket.com" className="hover:text-orange-600 transition-colors">
                        support@gradermarket.com
                      </a>
                    </p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Working Hours</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monday - Friday</span>
                      <span className="font-medium text-gray-900">09:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saturday</span>
                      <span className="font-medium text-gray-900">10:00 - 16:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sunday</span>
                      <span className="font-medium text-gray-900">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section ref={mapRef} className="map-section py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Find Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Visit our showroom and experience our premium graders and parts in person
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-96 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center relative">
              {/* Simple map placeholder with interactive elements */}
              <div className="text-center p-8">
                <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FiMapPin className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Harita Konumu</h3>
                <p className="text-gray-700 mb-6 max-w-md mx-auto">
                  Maslak Mahallesi, Büyükdere Caddesi No: 123<br />
                  Sarıyer/İstanbul, Turkey
                </p>
                
                {/* Interactive buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="https://www.google.com/maps/search/Maslak,+Istanbul" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-300 flex items-center justify-center space-x-2"
                  >
                    <FiMapPin className="w-5 h-5" />
                    <span>Google Maps'te Aç</span>
                  </a>
                  
                  <a 
                    href="https://maps.apple.com/?q=Maslak+Istanbul" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center space-x-2"
                  >
                    <FiMapPin className="w-5 h-5" />
                    <span>Apple Maps'te Aç</span>
                  </a>
                </div>
              </div>
              
              {/* Decorative map elements */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-white/30 rounded-full"></div>
              </div>
              <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-white/30 rounded-full"></div>
              </div>
              <div className="absolute top-1/2 left-8 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white/30 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
