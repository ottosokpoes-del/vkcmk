import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPhone, FiMail, FiSend, FiX, FiChevronLeft, FiChevronRight, FiMapPin, FiCalendar, FiActivity, FiSettings, FiShield, FiStar, FiCheck, FiShare2 } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { gsap } from 'gsap';
import { useAppStore } from '../store';

gsap.registerPlugin();

const GraderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { graders } = useAppStore();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const swiperRef = useRef<any>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [mouseStart, setMouseStart] = useState<number | null>(null);
  const [mouseEnd, setMouseEnd] = useState<number | null>(null);

  const grader = graders.find(g => g.id === id);

  useEffect(() => {
    if (!grader) {
      navigate('/');
    }
  }, [grader, navigate]);

  // Lightbox functions
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const prevImage = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  // Touch/Swipe handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextImage();
    }
    if (isRightSwipe) {
      prevImage();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: grader?.title,
          text: grader?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link kopyalandı!');
    }
  };

  // Mouse drag handlers for desktop
  const onMouseDown = (e: React.MouseEvent) => {
    setMouseEnd(null);
    setMouseStart(e.clientX);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (mouseStart !== null) {
      setMouseEnd(e.clientX);
    }
  };

  const onMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!mouseStart || !mouseEnd) return;
    
    const distance = mouseStart - mouseEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextImage();
    }
    if (isRightSwipe) {
      prevImage();
    }
    
    setMouseStart(null);
    setMouseEnd(null);
  };

  if (!grader) {
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>Geri</span>
            </button>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={handleShare}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
              >
                <FiShare2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Photo Gallery Section */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
              <Swiper
                modules={[Navigation]}
                navigation={false}
                spaceBetween={0}
                slidesPerView={1}
                initialSlide={currentImageIndex}
                onSlideChange={(swiper) => setCurrentImageIndex(swiper.activeIndex)}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                className="aspect-[4/3]"
              >
                {grader.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative w-full h-full">
                      <img
                        src={image}
                        alt={`${grader.title} - ${index + 1}`}
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                        onClick={() => openLightbox(index)}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/80 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm z-10">
                {currentImageIndex + 1} / {grader.images.length}
              </div>

              {/* Fullscreen Button */}
              <button
                onClick={() => openLightbox(currentImageIndex)}
                className="absolute top-4 right-4 bg-black/80 hover:bg-black/90 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>

              {/* New Badge */}
              {grader.isNew && (
                <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Yeni İlan
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {grader.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    currentImageIndex === index
                      ? 'border-orange-600 ring-2 ring-orange-600/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${grader.title} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Grader Details Section */}
          <div className="lg:col-span-1">
            {/* Title and Price */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {grader.title}
                </h1>
                <div className="text-4xl font-bold text-orange-600 mb-4">
                  {formatPrice(grader.price)}
                </div>
                
                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiCalendar className="w-4 h-4 text-orange-600" />
                    <span>{grader.year}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiActivity className="w-4 h-4 text-orange-600" />
                    <span>{grader.operatingHours ? grader.operatingHours.toLocaleString('tr-TR') : 'N/A'} saat</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiSettings className="w-4 h-4 text-orange-600" />
                    <span>{grader.fuel}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiMapPin className="w-4 h-4 text-orange-600" />
                    <span>{grader.location}</span>
                  </div>
                </div>

                {/* Seller Badge */}
                <div className="flex items-center gap-2 mb-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    grader.sellerType === 'Sahibinden' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {grader.sellerType}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(grader.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 py-3 px-4 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors">
                    <FiPhone className="w-5 h-5" />
                    <span>Ara</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors">
                    <FiMail className="w-5 h-5" />
                    <span>WhatsApp</span>
                  </button>
                </div>

                <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                  <FiSend className="w-5 h-5" />
                  <span>Mesaj Gönder</span>
                </button>
              </div>
            </div>

            {/* Seller Info Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiStar className="w-5 h-5 text-orange-600" />
                Satıcı Bilgileri
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Satıcı Tipi</span>
                  <span className="font-semibold">{grader.sellerType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Konum</span>
                  <span className="font-semibold">{grader.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">İlan Tarihi</span>
                  <span className="font-semibold">
                    {new Date(grader.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="mt-12 space-y-8">
          {/* Key Specs */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FiSettings className="w-6 h-6 text-orange-600" />
              Temel Bilgiler
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-sm text-gray-600 mb-1">Marka</div>
                <div className="font-bold text-lg">{grader.title.split(' ')[0]}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-sm text-gray-600 mb-1">Model Yılı</div>
                <div className="font-bold text-lg">{grader.year}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-sm text-gray-600 mb-1">Çalışma Saati</div>
                <div className="font-bold text-lg">{grader.operatingHours ? grader.operatingHours.toLocaleString('tr-TR') : 'N/A'} saat</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-sm text-gray-600 mb-1">Yakıt</div>
                <div className="font-bold text-lg">{grader.fuel}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-sm text-gray-600 mb-1">Vites</div>
                <div className="font-bold text-lg">{grader.transmission}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-sm text-gray-600 mb-1">Şehir</div>
                <div className="font-bold text-lg">{grader.location}</div>
              </div>
            </div>
          </div>

          {/* Technical Specs */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FiSettings className="w-6 h-6 text-orange-600" />
              Teknik Özellikler
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                <div className="text-sm text-orange-700 mb-1 font-medium">Motor</div>
                <div className="font-bold text-lg text-orange-900">{grader.technicalSpecs.engine}</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                <div className="text-sm text-orange-700 mb-1 font-medium">Güç</div>
                <div className="font-bold text-lg text-orange-900">{grader.technicalSpecs.power}</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                <div className="text-sm text-orange-700 mb-1 font-medium">Tork</div>
                <div className="font-bold text-lg text-orange-900">{grader.technicalSpecs.torque}</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                <div className="text-sm text-orange-700 mb-1 font-medium">Bıçak Genişliği</div>
                <div className="font-bold text-lg text-orange-900">{grader.technicalSpecs.bladeWidth}</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                <div className="text-sm text-orange-700 mb-1 font-medium">Çalışma Ağırlığı</div>
                <div className="font-bold text-lg text-orange-900">{grader.technicalSpecs.operatingWeight}</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                <div className="text-sm text-orange-700 mb-1 font-medium">Yakıt Tüketimi</div>
                <div className="font-bold text-lg text-orange-900">{grader.technicalSpecs.fuelConsumption}</div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FiCheck className="w-6 h-6 text-orange-600" />
              Özellikler
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {grader.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center">
                    <FiCheck className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FiShield className="w-6 h-6 text-orange-600" />
              Güvenlik
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {grader.safety.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <FiShield className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Açıklama</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg">{grader.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
            >
              <FiX className="w-6 h-6" />
            </button>

            {/* Main Image Container */}
            <div 
              className="relative w-full h-full flex items-center justify-center"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={() => {
                setMouseStart(null);
                setMouseEnd(null);
              }}
            >
              <img
                src={grader.images[currentImageIndex]}
                alt={`${grader.title} - ${currentImageIndex + 1}`}
                className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-2xl"
                style={{ 
                  maxWidth: 'calc(100vw - 2rem)',
                  maxHeight: 'calc(100vh - 8rem)'
                }}
              />
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-4 rounded-full transition-all duration-300 backdrop-blur-sm z-10"
            >
              <FiChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-4 rounded-full transition-all duration-300 backdrop-blur-sm z-10"
            >
              <FiChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/20 text-white px-4 py-2 rounded-full text-lg backdrop-blur-sm">
              {currentImageIndex + 1} / {grader.images.length}
            </div>

            {/* Thumbnail Strip */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-[calc(100vw-2rem)] sm:max-w-4xl overflow-x-auto px-4">
              {grader.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-12 h-9 sm:w-16 sm:h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    currentImageIndex === index
                      ? 'border-white'
                      : 'border-white/50 hover:border-white/80'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${grader.title} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraderDetails;
