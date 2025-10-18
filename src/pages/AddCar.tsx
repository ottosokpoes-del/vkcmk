import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiX } from 'react-icons/fi';
import { useAppStore } from '../store';
import { Car } from '../types';
import { InputValidator, SecurityUtils } from '../utils/security';

const AddCar = () => {
  const navigate = useNavigate();
  const { addCar } = useAppStore();
  
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    price: '',
    year: '',
    mileage: '',
    fuel: 'Benzin' as Car['fuel'],
    transmission: 'Manuel' as Car['transmission'],
    location: '',
    sellerType: 'Sahibinden' as Car['sellerType'],
    description: '',
    images: [''],
    technicalSpecs: {
      engine: '',
      power: '',
      torque: '',
      acceleration: '',
      topSpeed: '',
      fuelConsumption: ''
    },
    features: [''],
    safety: [''],
    isNew: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate title
    const titleValidation = InputValidator.validateText(formData.title, {
      minLength: 5,
      maxLength: 200,
      required: true,
      pattern: /^[a-zA-Z0-9\s\-\.]+$/
    });
    if (!titleValidation.isValid) {
      newErrors.title = titleValidation.error || 'Invalid title format';
    }

    // Validate brand
    const brandValidation = InputValidator.validateText(formData.brand, {
      minLength: 2,
      maxLength: 50,
      required: true,
      pattern: /^[a-zA-Z\s]+$/
    });
    if (!brandValidation.isValid) {
      newErrors.brand = brandValidation.error || 'Invalid brand format';
    }

    // Validate model
    const modelValidation = InputValidator.validateText(formData.model, {
      minLength: 1,
      maxLength: 50,
      required: true,
      pattern: /^[a-zA-Z0-9\s\-\.]+$/
    });
    if (!modelValidation.isValid) {
      newErrors.model = modelValidation.error || 'Invalid model format';
    }

    // Validate price
    const priceValidation = InputValidator.validateNumber(formData.price, {
      min: 1000,
      max: 50000000,
      required: true,
      integer: true
    });
    if (!priceValidation.isValid) {
      newErrors.price = priceValidation.error || 'Invalid price';
    }

    // Validate year
    const yearValidation = InputValidator.validateNumber(formData.year, {
      min: 1990,
      max: 2024,
      required: true,
      integer: true
    });
    if (!yearValidation.isValid) {
      newErrors.year = yearValidation.error || 'Invalid year';
    }

    // Validate mileage
    const mileageValidation = InputValidator.validateNumber(formData.mileage, {
      min: 0,
      max: 1000000,
      required: true,
      integer: true
    });
    if (!mileageValidation.isValid) {
      newErrors.mileage = mileageValidation.error || 'Invalid mileage';
    }

    // Validate location
    const locationValidation = InputValidator.validateText(formData.location, {
      minLength: 2,
      maxLength: 100,
      required: true,
      pattern: /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/
    });
    if (!locationValidation.isValid) {
      newErrors.location = locationValidation.error || 'Invalid location format';
    }

    // Validate description
    const descriptionValidation = InputValidator.validateText(formData.description, {
      minLength: 10,
      maxLength: 2000,
      required: true
    });
    if (!descriptionValidation.isValid) {
      newErrors.description = descriptionValidation.error || 'Invalid description';
    }

    // Validate images
    formData.images.forEach((image, index) => {
      if (image.trim()) {
        const urlValidation = InputValidator.validateUrl(image);
        if (!urlValidation.isValid) {
          newErrors[`image_${index}`] = 'Invalid image URL';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Sanitize all text inputs
      const sanitizedFormData = {
        ...formData,
        title: SecurityUtils.sanitizeHtml(formData.title.trim()),
        brand: SecurityUtils.sanitizeHtml(formData.brand.trim()),
        model: SecurityUtils.sanitizeHtml(formData.model.trim()),
        location: SecurityUtils.sanitizeHtml(formData.location.trim()),
        description: SecurityUtils.sanitizeHtml(formData.description.trim()),
        technicalSpecs: {
          ...formData.technicalSpecs,
          engine: SecurityUtils.sanitizeHtml(formData.technicalSpecs.engine),
          power: SecurityUtils.sanitizeHtml(formData.technicalSpecs.power),
          torque: SecurityUtils.sanitizeHtml(formData.technicalSpecs.torque),
          acceleration: SecurityUtils.sanitizeHtml(formData.technicalSpecs.acceleration),
          topSpeed: SecurityUtils.sanitizeHtml(formData.technicalSpecs.topSpeed),
          fuelConsumption: SecurityUtils.sanitizeHtml(formData.technicalSpecs.fuelConsumption),
        },
        features: formData.features.map(f => SecurityUtils.sanitizeHtml(f.trim())).filter(f => f !== ''),
        safety: formData.safety.map(s => SecurityUtils.sanitizeHtml(s.trim())).filter(s => s !== ''),
        images: formData.images.filter(img => img.trim() !== '')
      };

    const newCar: Car = {
        id: SecurityUtils.generateSecureToken(16),
        title: sanitizedFormData.title,
        brand: sanitizedFormData.brand,
        model: sanitizedFormData.model,
      price: Number(formData.price),
      year: Number(formData.year),
      mileage: Number(formData.mileage),
      fuel: formData.fuel,
      transmission: formData.transmission,
        location: sanitizedFormData.location,
      sellerType: formData.sellerType,
        description: sanitizedFormData.description,
        images: sanitizedFormData.images,
        technicalSpecs: sanitizedFormData.technicalSpecs,
        features: sanitizedFormData.features,
        safety: sanitizedFormData.safety,
      isNew: formData.isNew,
      createdAt: new Date().toISOString()
    };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

    addCar(newCar);
    navigate('/admin');
    } catch (error) {
      console.error('Error adding car:', error);
      setErrors({ general: 'An error occurred while adding the car. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const updateImage = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }));
  };

  const addSafety = () => {
    setFormData(prev => ({
      ...prev,
      safety: [...prev.safety, '']
    }));
  };

  const removeSafety = (index: number) => {
    setFormData(prev => ({
      ...prev,
      safety: prev.safety.filter((_, i) => i !== index)
    }));
  };

  const updateSafety = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      safety: prev.safety.map((s, i) => i === index ? value : s)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Yeni Araç Ekle</h1>
                <p className="text-gray-600">Yeni bir araç ilanı oluşturun</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/admin')}
                className="btn-secondary"
              >
                İptal
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`btn-primary flex items-center space-x-2 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <FiSave className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Temel Bilgiler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlık *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sahibinden-red focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Örn: 2020 BMW 3 Serisi 320d"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marka *
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sahibinden-red focus:border-transparent ${
                    errors.brand ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="BMW"
                />
                {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model *
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sahibinden-red focus:border-transparent ${
                    errors.model ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="3 Serisi"
                />
                {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fiyat (₺) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sahibinden-red focus:border-transparent ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="1250000"
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yıl *
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sahibinden-red focus:border-transparent ${
                    errors.year ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="2020"
                  min="1990"
                  max="2024"
                />
                {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kilometre *
                </label>
                <input
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => setFormData(prev => ({ ...prev, mileage: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sahibinden-red focus:border-transparent ${
                    errors.mileage ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="45000"
                />
                {errors.mileage && <p className="text-red-500 text-sm mt-1">{errors.mileage}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yakıt
                </label>
                <select
                  value={formData.fuel}
                  onChange={(e) => setFormData(prev => ({ ...prev, fuel: e.target.value as Car['fuel'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sahibinden-red focus:border-transparent"
                >
                  <option value="Benzin">Benzin</option>
                  <option value="Dizel">Dizel</option>
                  <option value="Elektrik">Elektrik</option>
                  <option value="Hibrit">Hibrit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vites
                </label>
                <select
                  value={formData.transmission}
                  onChange={(e) => setFormData(prev => ({ ...prev, transmission: e.target.value as Car['transmission'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sahibinden-red focus:border-transparent"
                >
                  <option value="Manuel">Manuel</option>
                  <option value="Otomatik">Otomatik</option>
                  <option value="Yarı Otomatik">Yarı Otomatik</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konum *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sahibinden-red focus:border-transparent ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="İstanbul"
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Satıcı Tipi
                </label>
                <select
                  value={formData.sellerType}
                  onChange={(e) => setFormData(prev => ({ ...prev, sellerType: e.target.value as Car['sellerType'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sahibinden-red focus:border-transparent"
                >
                  <option value="Sahibinden">Sahibinden</option>
                  <option value="Galeriden">Galeriden</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama *
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sahibinden-red focus:border-transparent ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Araç hakkında detaylı açıklama..."
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => setFormData(prev => ({ ...prev, isNew: e.target.checked }))}
                    className="rounded border-gray-300 text-sahibinden-red focus:ring-sahibinden-red"
                  />
                  <span className="text-sm font-medium text-gray-700">Yeni İlan</span>
                </label>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Fotoğraflar</h2>
            <div className="space-y-4">
              {formData.images.map((image, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => updateImage(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sahibinden-red focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addImage}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-sahibinden-red hover:text-sahibinden-red transition-colors"
              >
                + Fotoğraf Ekle
              </button>
            </div>
          </div>

          {/* Technical Specs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Teknik Özellikler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Motor</label>
                <input
                  type="text"
                  value={formData.technicalSpecs.engine}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    technicalSpecs: { ...prev.technicalSpecs, engine: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sahibinden-red focus:border-transparent"
                  placeholder="2.0L Turbo Diesel"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Güç</label>
                <input
                  type="text"
                  value={formData.technicalSpecs.power}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    technicalSpecs: { ...prev.technicalSpecs, power: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sahibinden-red focus:border-transparent"
                  placeholder="190 HP"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tork</label>
                <input
                  type="text"
                  value={formData.technicalSpecs.torque}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    technicalSpecs: { ...prev.technicalSpecs, torque: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sahibinden-red focus:border-transparent"
                  placeholder="400 Nm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">0-100 km/h</label>
                <input
                  type="text"
                  value={formData.technicalSpecs.acceleration}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    technicalSpecs: { ...prev.technicalSpecs, acceleration: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sahibinden-red focus:border-transparent"
                  placeholder="7.1s"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maksimum Hız</label>
                <input
                  type="text"
                  value={formData.technicalSpecs.topSpeed}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    technicalSpecs: { ...prev.technicalSpecs, topSpeed: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sahibinden-red focus:border-transparent"
                  placeholder="230 km/h"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Yakıt Tüketimi</label>
                <input
                  type="text"
                  value={formData.technicalSpecs.fuelConsumption}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    technicalSpecs: { ...prev.technicalSpecs, fuelConsumption: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sahibinden-red focus:border-transparent"
                  placeholder="5.2L/100km"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Özellikler</h2>
            <div className="space-y-4">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sahibinden-red focus:border-transparent"
                    placeholder="Özellik adı"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-sahibinden-red hover:text-sahibinden-red transition-colors"
              >
                + Özellik Ekle
              </button>
            </div>
          </div>

          {/* Safety */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Güvenlik</h2>
            <div className="space-y-4">
              {formData.safety.map((safety, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={safety}
                    onChange={(e) => updateSafety(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sahibinden-red focus:border-transparent"
                    placeholder="Güvenlik özelliği"
                  />
                  <button
                    type="button"
                    onClick={() => removeSafety(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addSafety}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-sahibinden-red hover:text-sahibinden-red transition-colors"
              >
                + Güvenlik Özelliği Ekle
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCar;

