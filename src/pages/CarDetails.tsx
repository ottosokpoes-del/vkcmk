import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiHeart, FiPhone, FiMail, FiSend, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { gsap } from 'gsap';
import { useAppStore } from '../store';

gsap.registerPlugin();

const CarDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cars, favorites, toggleFavorite } = useAppStore();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const swiperRef = useRef<any>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [mouseStart, setMouseStart] = useState<number | null>(null);
  const [mouseEnd, setMouseEnd] = useState<number | null>(null);

  const car = cars.find(c => c.id === id);
  const isFavorite = car ? favorites.includes(car.id) : false;

  useEffect(() => {
    if (!car) {
      navigate('/');
    }
  }, [car, navigate]);

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

  if (!car) {
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
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-20 left-4 z-40 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors"
      >
        <FiArrowLeft className="w-5 h-5 text-gray-700" />
      </button>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Photo Gallery Section */}
          <div className="lg:col-span-1">
            {/* Main Image */}
            <div className="relative bg-white rounded-xl shadow-lg overflow-hidden mb-4">
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
                {car.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative w-full h-full">
                      <img
                        src={image}
                        alt={`${car.title} - ${index + 1}`}
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
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm z-10">
                {currentImageIndex + 1} / {car.images.length}
              </div>

              {/* Fullscreen Button */}
              <button
                onClick={() => openLightbox(currentImageIndex)}
                className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm z-10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {car.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    currentImageIndex === index
                      ? 'border-sahibinden-red ring-2 ring-sahibinden-red/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${car.title} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Car Details Section */}
          <div className="lg:col-span-1">
            {/* Title and Price */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {car.title}
              </h1>
              <div className="text-4xl font-bold text-sahibinden-red mb-4">
                {formatPrice(car.price)}
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{car.year}</span>
                <span>•</span>
                <span>{car.mileage ? car.mileage.toLocaleString('tr-TR') : 'N/A'} km</span>
                <span>•</span>
                <span>{car.fuel}</span>
                <span>•</span>
                <span>{car.transmission}</span>
                <span>•</span>
                <span>{car.location}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <div className="space-y-4">
                <button
                  onClick={() => toggleFavorite(car.id)}
                  className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                    isFavorite
                      ? 'bg-sahibinden-red text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FiHeart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  <span>{isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}</span>
                </button>

                <button className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors">
                  <FiPhone className="w-5 h-5" />
                  <span>Ara</span>
                </button>

                <button className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
                  <FiMail className="w-5 h-5" />
                  <span>WhatsApp</span>
                </button>

                <button className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  <FiSend className="w-5 h-5" />
                  <span>Mesaj Gönder</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Key Specs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Temel Bilgiler</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Marka</span>
                <p className="font-medium">{car.title.split(' ')[0]}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Model Yılı</span>
                <p className="font-medium">{car.year}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Kilometre</span>
                <p className="font-medium">{car.mileage ? car.mileage.toLocaleString('tr-TR') : 'N/A'} km</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Yakıt</span>
                <p className="font-medium">{car.fuel}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Vites</span>
                <p className="font-medium">{car.transmission}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Şehir</span>
                <p className="font-medium">{car.location}</p>
              </div>
            </div>
          </div>

          {/* Seller Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Satıcı Bilgileri</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Satıcı Tipi</span>
                <p className="font-medium">{car.sellerType}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Konum</span>
                <p className="font-medium">{car.location}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">İlan Tarihi</span>
                <p className="font-medium">
                  {new Date(car.createdAt).toLocaleDateString('tr-TR')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Sections */}
        <div className="mt-8 space-y-6">
          {/* Technical Specs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Teknik Özellikler</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Motor</span>
                <p className="font-medium">{car.technicalSpecs.engine}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Güç</span>
                <p className="font-medium">{car.technicalSpecs.power}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Tork</span>
                <p className="font-medium">{car.technicalSpecs.torque}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">0-100 km/h</span>
                <p className="font-medium">{car.technicalSpecs.acceleration}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Maksimum Hız</span>
                <p className="font-medium">{car.technicalSpecs.topSpeed}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Yakıt Tüketimi</span>
                <p className="font-medium">{car.technicalSpecs.fuelConsumption}</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Özellikler</h2>
            <div className="grid grid-cols-2 gap-2">
              {car.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-sahibinden-red rounded-full"></div>
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Güvenlik</h2>
            <div className="grid grid-cols-2 gap-2">
              {car.safety.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Açıklama</h2>
            <p className="text-gray-700 leading-relaxed">{car.description}</p>
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
                src={car.images[currentImageIndex]}
                alt={`${car.title} - ${currentImageIndex + 1}`}
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
              {currentImageIndex + 1} / {car.images.length}
            </div>

            {/* Thumbnail Strip */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-[calc(100vw-2rem)] sm:max-w-4xl overflow-x-auto px-4">
              {car.images.map((image, index) => (
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
                    alt={`${car.title} thumbnail ${index + 1}`}
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

export default CarDetails;
