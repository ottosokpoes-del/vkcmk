import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiX } from 'react-icons/fi';
import { useAppStore } from '../store';
import { Grader } from '../types';
import { SecurityUtils } from '../utils/security';

const AddGrader = () => {
  const navigate = useNavigate();
  const { addGrader } = useAppStore();
  
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    price: '',
    year: '',
    operatingHours: '',
    fuel: 'Dizel' as Grader['fuel'],
    transmission: 'Manuel' as Grader['transmission'],
    location: '',
    sellerType: 'Sahibinden' as Grader['sellerType'],
    description: '',
    images: [''],
    technicalSpecs: {
      engine: '',
      power: '',
      torque: '',
      bladeWidth: '',
      operatingWeight: '',
      fuelConsumption: ''
    },
    features: [''],
    safety: [''],
    isNew: true,
    isSold: false,
    listingDate: new Date().toISOString().split('T')[0], // Bugünün tarihi
    stockCountry: 'EU' as Grader['stockCountry']
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Sadece temel kontroller - hiçbir sınırlama yok
    if (!formData.title.trim()) {
      newErrors.title = 'Başlık gereklidir';
    }
    if (!formData.brand.trim()) {
      newErrors.brand = 'Marka gereklidir';
    }
    if (!formData.model.trim()) {
      newErrors.model = 'Model gereklidir';
    }
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Geçerli bir fiyat giriniz';
    }
    if (!formData.year || isNaN(Number(formData.year)) || Number(formData.year) <= 0) {
      newErrors.year = 'Geçerli bir yıl giriniz';
    }
    if (!formData.operatingHours || isNaN(Number(formData.operatingHours)) || Number(formData.operatingHours) < 0) {
      newErrors.operatingHours = 'Geçerli bir çalışma saati giriniz';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Konum gereklidir';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Açıklama gereklidir';
    }

    // Image validation kaldırıldı - herhangi bir URL kabul edilir

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
        title: SecurityUtils.sanitizeHTML(formData.title.trim()),
        brand: SecurityUtils.sanitizeHTML(formData.brand.trim()),
        model: SecurityUtils.sanitizeHTML(formData.model.trim()),
        location: SecurityUtils.sanitizeHTML(formData.location.trim()),
        description: SecurityUtils.sanitizeHTML(formData.description.trim()),
        technicalSpecs: {
          ...formData.technicalSpecs,
          engine: SecurityUtils.sanitizeHTML(formData.technicalSpecs.engine),
          power: SecurityUtils.sanitizeHTML(formData.technicalSpecs.power),
          torque: SecurityUtils.sanitizeHTML(formData.technicalSpecs.torque),
          bladeWidth: SecurityUtils.sanitizeHTML(formData.technicalSpecs.bladeWidth),
          operatingWeight: SecurityUtils.sanitizeHTML(formData.technicalSpecs.operatingWeight),
          fuelConsumption: SecurityUtils.sanitizeHTML(formData.technicalSpecs.fuelConsumption),
        },
        features: formData.features.map(f => SecurityUtils.sanitizeHTML(f.trim())).filter(f => f !== ''),
        safety: formData.safety.map(s => SecurityUtils.sanitizeHTML(s.trim())).filter(s => s !== ''),
        images: formData.images.filter(img => img.trim() !== '')
      };
      const newGrader: Grader = {
        id: SecurityUtils.generateSecureToken(16),
        title: sanitizedFormData.title,
        brand: sanitizedFormData.brand,
        model: sanitizedFormData.model,
        price: Number(formData.price),
        year: Number(formData.year),
        operatingHours: Number(formData.operatingHours),
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
        isSold: formData.isSold,
        createdAt: new Date().toISOString(),
        listingDate: new Date().toISOString(),
        stockCountry: formData.stockCountry
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      addGrader(newGrader);
      navigate('/admin');
    } catch (error) {
      console.error('Error adding grader:', error);
      setErrors({ general: 'An error occurred while adding the grader. Please try again.' });
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
                <h1 className="text-2xl font-bold text-gray-900">Yeni Grader Ekle</h1>
                <p className="text-gray-600">Yeni bir grader ilanı oluşturun</p>
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent ${
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent ${
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent ${
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent ${
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent ${
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
                  Çalışma Saati *
                </label>
                <input
                  type="number"
                  value={formData.operatingHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, operatingHours: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent ${
                    errors.operatingHours ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="2500"
                />
                {errors.operatingHours && <p className="text-red-500 text-sm mt-1">{errors.operatingHours}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İlana Koyma Tarihi *
                </label>
                <input
                  type="date"
                  value={formData.listingDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, listingDate: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent ${
                    errors.listingDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.listingDate && <p className="text-red-500 text-sm mt-1">{errors.listingDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stok Ülkesi *
                </label>
                <select
                  value={formData.stockCountry}
                  onChange={(e) => setFormData(prev => ({ ...prev, stockCountry: e.target.value as Grader['stockCountry'] }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent ${
                    errors.stockCountry ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="EU">🇪🇺 Avrupa Stok</option>
                  <option value="Kenya">🇰🇪 Kenya Stok</option>
                  <option value="US">🇺🇸 ABD Stok</option>
                </select>
                {errors.stockCountry && <p className="text-red-500 text-sm mt-1">{errors.stockCountry}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yakıt
                </label>
                <select
                  value={formData.fuel}
                  onChange={(e) => setFormData(prev => ({ ...prev, fuel: e.target.value as Grader['fuel'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                >
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
                  onChange={(e) => setFormData(prev => ({ ...prev, transmission: e.target.value as Grader['transmission'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent ${
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
                  onChange={(e) => setFormData(prev => ({ ...prev, sellerType: e.target.value as Grader['sellerType'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent ${
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
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-600"
                  />
                  <span className="text-sm font-medium text-gray-700">Yeni İlan</span>
                </label>
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isSold}
                    onChange={(e) => setFormData(prev => ({ ...prev, isSold: e.target.checked }))}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-600"
                  />
                  <span className="text-sm font-medium text-gray-700">Satıldı</span>
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
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
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
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-600 hover:text-orange-600 transition-colors"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                  placeholder="400 Nm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bıçak Genişliği</label>
                <input
                  type="text"
                  value={formData.technicalSpecs.bladeWidth}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    technicalSpecs: { ...prev.technicalSpecs, bladeWidth: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                  placeholder="3.7m"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Çalışma Ağırlığı</label>
                <input
                  type="text"
                  value={formData.technicalSpecs.operatingWeight}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    technicalSpecs: { ...prev.technicalSpecs, operatingWeight: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                  placeholder="18,500 kg"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
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
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
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
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-600 hover:text-orange-600 transition-colors"
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
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
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
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-600 hover:text-orange-600 transition-colors"
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

export default AddGrader;

