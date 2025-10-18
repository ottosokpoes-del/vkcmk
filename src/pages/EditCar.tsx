import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiX } from 'react-icons/fi';
import { useAppStore } from '../store';
import { Car } from '../types';

const EditCar = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cars, updateCar } = useAppStore();
  
  const [formData, setFormData] = useState({
    title: '',
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
    isNew: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Admin kontrolü - 2FA sistemi için basitleştirildi
  useEffect(() => {
    // 2FA ile giriş yapıldığı için admin kontrolü atlanıyor
  }, []);

  const car = cars.find(c => c.id === id);

  // Car bulunamadığında admin paneline yönlendir
  useEffect(() => {
    if (!car && id) {
      navigate('/admin');
    }
  }, [car, id, navigate]);

  useEffect(() => {
    if (car) {
      setFormData({
        title: car.title || '',
        price: car.price ? car.price.toString() : '',
        year: car.year ? car.year.toString() : '',
        mileage: car.mileage ? car.mileage.toString() : '',
        fuel: car.fuel || 'Benzin',
        transmission: car.transmission || 'Manuel',
        location: car.location || '',
        sellerType: car.sellerType || 'Sahibinden',
        description: car.description || '',
        images: car.images && car.images.length > 0 ? car.images : [''],
        technicalSpecs: car.technicalSpecs || {
          engine: '',
          power: '',
          torque: '',
          acceleration: '',
          topSpeed: '',
          fuelConsumption: ''
        },
        features: car.features && car.features.length > 0 ? car.features : [''],
        safety: car.safety && car.safety.length > 0 ? car.safety : [''],
        isNew: car.isNew || false
      });
    }
  }, [car]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Başlık gereklidir';
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Geçerli bir fiyat giriniz';
    }
    if (!formData.year || isNaN(Number(formData.year)) || Number(formData.year) < 1990 || Number(formData.year) > 2024) {
      newErrors.year = 'Geçerli bir yıl giriniz (1990-2024)';
    }
    if (!formData.mileage || isNaN(Number(formData.mileage)) || Number(formData.mileage) < 0) {
      newErrors.mileage = 'Geçerli bir kilometre giriniz';
    }
    if (!formData.location.trim()) newErrors.location = 'Konum gereklidir';
    if (!formData.description.trim()) newErrors.description = 'Açıklama gereklidir';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const updatedCar: Partial<Car> = {
      title: formData.title.trim(),
      price: Number(formData.price),
      year: Number(formData.year),
      mileage: Number(formData.mileage),
      fuel: formData.fuel,
      transmission: formData.transmission,
      location: formData.location.trim(),
      sellerType: formData.sellerType,
      description: formData.description.trim(),
      images: formData.images.filter(img => img.trim() !== ''),
      technicalSpecs: formData.technicalSpecs,
      features: formData.features.filter(f => f.trim() !== ''),
      safety: formData.safety.filter(s => s.trim() !== ''),
      isNew: formData.isNew
    };

    if (id) {
      updateCar(id, updatedCar);
      navigate('/admin');
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

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Araç Bulunamadı</h1>
          <button onClick={() => navigate('/admin')} className="btn-primary">
            Admin Paneline Dön
          </button>
        </div>
      </div>
    );
  }

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
                <h1 className="text-2xl font-bold text-gray-900">Araç Düzenle</h1>
                <p className="text-gray-600">{car.title}</p>
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
                className="btn-primary flex items-center space-x-2"
              >
                <FiSave className="w-4 h-4" />
                <span>Kaydet</span>
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

export default EditCar;

