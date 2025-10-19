import { useState, useEffect } from 'react';
import { FiEye, FiEdit, FiTrash2, FiPlus, FiTruck, FiSettings, FiCalendar, FiArrowUp, FiArrowDown, FiX, FiMessageCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { SecurityUtils } from '../utils/security';
import ChatAnalytics from '../components/ChatAnalytics';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { 
    graders, 
    parts, 
    homepageSlider,
    deleteGrader, 
    deletePart,
    updateGrader,
    updatePart,
    setHomepageSlider,
    addHomepageSliderItem,
    updateHomepageSliderItem,
    deleteHomepageSliderItem,
    saveHomepageSlider
  } = useAppStore();
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<'graders' | 'parts' | 'homepage' | 'analytics'>('graders');
  const [showProductSelectionModal, setShowProductSelectionModal] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState<'grader' | 'part' | null>(null);

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const handleDeleteGrader = async (graderId: string) => {
    setIsDeleting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      deleteGrader(graderId);
      setShowDeleteModal(null);
    } catch (error) {
      console.error('Error deleting grader:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeletePart = async (partId: string) => {
    setIsDeleting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      deletePart(partId);
      setShowDeleteModal(null);
    } catch (error) {
      console.error('Error deleting part:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const toggleSaleStatus = (type: 'grader' | 'part', id: string) => {
    if (type === 'grader') {
      const grader = graders.find(g => g.id === id);
      if (grader) {
        updateGrader({
          ...grader,
          isSold: !grader.isSold
        });
      }
    } else {
      const part = parts.find(p => p.id === id);
      if (part) {
        updatePart({
          ...part,
          isSold: !part.isSold
        });
      }
    }
  };

  // Homepage Slider Functions
  const addToSlider = (type: 'grader' | 'part', id: string) => {
    // Find the next available order number (1-4)
    const usedOrders = homepageSlider.map(item => item.order);
    let nextOrder = 1;
    while (usedOrders.includes(nextOrder) && nextOrder <= 4) {
      nextOrder++;
    }
    
    // If all 4 slots are full, don't add
    if (nextOrder > 4) {
      alert('Maksimum 4 nokta eklenebilir!');
      return;
    }
    
    const newItem = {
      id: `slider-${Date.now()}`,
      type,
      graderId: type === 'grader' ? id : undefined,
      partId: type === 'part' ? id : undefined,
      order: nextOrder,
      isActive: true,
    };
    addHomepageSliderItem(newItem);
  };

  const removeFromSlider = (sliderId: string) => {
    deleteHomepageSliderItem(sliderId);
  };

  const toggleSliderItem = (sliderId: string) => {
    const item = homepageSlider.find(i => i.id === sliderId);
    if (item) {
      updateHomepageSliderItem({
        ...item,
        isActive: !item.isActive
      });
    }
  };

  const reorderSliderItems = (fromIndex: number, toIndex: number) => {
    const newSlider = [...homepageSlider];
    const [removed] = newSlider.splice(fromIndex, 1);
    newSlider.splice(toIndex, 0, removed);
    
    // Update order numbers
    const updatedSlider = newSlider.map((item, index) => ({
      ...item,
      order: index + 1
    }));
    
    setHomepageSlider(updatedSlider);
  };

  const moveSliderItemUp = (itemId: string) => {
    const sortedSlider = [...homepageSlider].sort((a, b) => a.order - b.order);
    const currentIndex = sortedSlider.findIndex(item => item.id === itemId);
    
    if (currentIndex > 0) {
      reorderSliderItems(currentIndex, currentIndex - 1);
    }
  };

  const moveSliderItemDown = (itemId: string) => {
    const sortedSlider = [...homepageSlider].sort((a, b) => a.order - b.order);
    const currentIndex = sortedSlider.findIndex(item => item.id === itemId);
    
    if (currentIndex < sortedSlider.length - 1) {
      reorderSliderItems(currentIndex, currentIndex + 1);
    }
  };

  const openProductSelectionModal = (type: 'grader' | 'part') => {
    setSelectedProductType(type);
    setShowProductSelectionModal(true);
  };

  const closeProductSelectionModal = () => {
    setShowProductSelectionModal(false);
    setSelectedProductType(null);
  };

  const selectProductForSlider = (productId: string) => {
    if (selectedProductType) {
      addToSlider(selectedProductType, productId);
      closeProductSelectionModal();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Grader ve parça yönetimi
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/admin/add-grader')}
            className="btn-primary flex items-center space-x-2"
          >
            <FiTruck className="w-4 h-4" />
            <span>Grader Ekle</span>
          </button>
          <button
            onClick={() => navigate('/admin/add-part')}
            className="btn-primary flex items-center space-x-2"
          >
            <FiSettings className="w-4 h-4" />
            <span>Parça Ekle</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Toplam Grader</h3>
          <p className="text-3xl font-bold text-orange-600">{graders.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Toplam Parça</h3>
          <p className="text-3xl font-bold text-orange-600">{parts.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Toplam Ürün</h3>
          <p className="text-3xl font-bold text-orange-600">{graders.length + parts.length}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('graders')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'graders'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Graders ({graders.length})
          </button>
          <button
            onClick={() => setActiveTab('parts')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'parts'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Parçalar ({parts.length})
          </button>
          <button
            onClick={() => setActiveTab('homepage')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'homepage'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Ana Sayfa Slider ({homepageSlider.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FiMessageCircle className="inline w-4 h-4 mr-1" />
            Chat Analytics
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'graders' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Graders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grader
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fiyat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Yıl
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İlan Tarihi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Satış Durumu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {graders.map((grader) => (
                  <tr key={grader.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-16">
                          <img
                            className="h-12 w-16 rounded object-cover"
                            src={grader.images[0]}
                            alt={SecurityUtils.sanitizeHtml(grader.title)}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {SecurityUtils.sanitizeHtml(grader.title)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {SecurityUtils.sanitizeHtml(grader.location)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(grader.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {grader.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-1">
                        <FiCalendar className="w-3 h-3 text-gray-400" />
                        <span>{formatDate(grader.listingDate)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleSaleStatus('grader', grader.id)}
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                          grader.isSold 
                            ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {grader.isSold ? 'Satıldı' : 'Satışta'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        grader.isNew 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {grader.isNew ? 'Yeni' : 'İkinci El'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => navigate(`/grader/${grader.id}`)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/edit-grader/${grader.id}`)}
                          className="text-orange-600 hover:text-orange-900 p-1"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => addToSlider('grader', grader.id)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Slider'a Ekle"
                        >
                          <FiPlus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(grader.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'parts' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Parçalar</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parça
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fiyat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İlan Tarihi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Satış Durumu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {parts.map((part) => (
                  <tr key={part.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-16">
                          <img
                            className="h-12 w-16 rounded object-cover"
                            src={part.images[0]}
                            alt={SecurityUtils.sanitizeHtml(part.title)}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {SecurityUtils.sanitizeHtml(part.title)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {SecurityUtils.sanitizeHtml(part.partNumber)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(part.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {SecurityUtils.sanitizeHtml(part.category)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-1">
                        <FiCalendar className="w-3 h-3 text-gray-400" />
                        <span>{formatDate(part.listingDate)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleSaleStatus('part', part.id)}
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                          part.isSold 
                            ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {part.isSold ? 'Satıldı' : 'Satışta'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        part.isNew 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {part.isNew ? 'Yeni' : 'İkinci El'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => navigate(`/part/${part.id}`)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/edit-part/${part.id}`)}
                          className="text-orange-600 hover:text-orange-900 p-1"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => addToSlider('part', part.id)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Slider'a Ekle"
                        >
                          <FiPlus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(part.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'homepage' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Ana Sayfa Slider Yönetimi</h2>
                <p className="text-gray-600 mt-1">Ana sayfada gösterilecek ürünleri düzenleyin</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => openProductSelectionModal('grader')}
                  className="btn-primary flex items-center space-x-2"
                >
                  <FiTruck className="w-4 h-4" />
                  <span>Grader Seç</span>
                </button>
                <button
                  onClick={() => openProductSelectionModal('part')}
                  className="btn-primary flex items-center space-x-2"
                >
                  <FiSettings className="w-4 h-4" />
                  <span>Parça Seç</span>
                </button>
                <button
                  onClick={() => navigate('/admin/add-grader')}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Yeni Grader</span>
                </button>
                <button
                  onClick={() => navigate('/admin/add-part')}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Yeni Parça</span>
                </button>
                <button
                  onClick={() => {
                    // Force save homepage slider
                    saveHomepageSlider();
                    // Force page refresh to update home page
                    setTimeout(() => {
                      window.location.reload();
                    }, 500);
                    alert('Ana sayfa slider\'ı kaydedildi ve sayfa güncellendi!');
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <FiSettings className="w-4 h-4" />
                  <span>Kaydet</span>
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            {/* 4 Dot Slider Management */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Slider Noktaları (4 Adet)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((dotNumber) => {
                  const item = homepageSlider.find(item => item.order === dotNumber);
                  const data = item ? (item.type === 'grader' 
                    ? graders.find(g => g.id === item.graderId)
                    : parts.find(p => p.id === item.partId)) : null;
                  
                  return (
                    <div key={dotNumber} className="border border-gray-200 rounded-lg p-4">
                      <div className="text-center mb-3">
                        <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">
                          {dotNumber}
                        </div>
                        <h4 className="font-medium text-gray-900">Nokta {dotNumber}</h4>
                      </div>
                      
                      {item && data ? (
                        <div className="space-y-3">
                          <div className="w-full h-20 bg-gray-100 rounded-lg overflow-hidden">
                            <img 
                              src={data.images[0]} 
                              alt={data.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-900 truncate">{data.title}</p>
                            <p className="text-xs text-gray-600">
                              {item.type === 'grader' ? '🚜 Grader' : '🔧 Parça'}
                            </p>
                            <p className="text-xs text-gray-500">₺{data.price.toLocaleString('tr-TR')}</p>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => toggleSliderItem(item.id)}
                              className={`flex-1 px-2 py-1 rounded text-xs font-medium ${
                                item.isActive 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {item.isActive ? 'Aktif' : 'Pasif'}
                            </button>
                            <button
                              onClick={() => removeFromSlider(item.id)}
                              className="px-2 py-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded text-xs"
                              title="Sil"
                            >
                              <FiTrash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-500 mb-3">Boş Nokta</p>
                          <div className="space-y-2">
                            <button
                              onClick={() => openProductSelectionModal('grader')}
                              className="w-full px-3 py-2 bg-blue-100 text-blue-800 rounded text-xs font-medium hover:bg-blue-200 transition-colors"
                            >
                              Grader Ekle
                            </button>
                            <button
                              onClick={() => openProductSelectionModal('part')}
                              className="w-full px-3 py-2 bg-green-100 text-green-800 rounded text-xs font-medium hover:bg-green-200 transition-colors"
                            >
                              Parça Ekle
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Current Slider Items List */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mevcut Slider Öğeleri</h3>
              <div className="space-y-4">
                {homepageSlider
                  .sort((a, b) => a.order - b.order)
                  .map((item, index) => {
                    const data = item.type === 'grader' 
                      ? graders.find(g => g.id === item.graderId)
                      : parts.find(p => p.id === item.partId);
                    
                    if (!data) return null;

                    return (
                      <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {item.order}
                          </div>
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                            <img 
                              src={data.images[0]} 
                              alt={data.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{data.title}</h3>
                            <p className="text-sm text-gray-600">
                              {item.type === 'grader' ? '🚜 Grader' : '🔧 Parça'} • 
                              {data.brand} • 
                              ₺{data.price.toLocaleString('tr-TR')}
                            </p>
                            <p className="text-xs text-gray-500">Sıra: {item.order}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex flex-col space-y-1">
                            <button
                              onClick={() => moveSliderItemUp(item.id)}
                              disabled={index === 0}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Yukarı Taşı"
                            >
                              <FiArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => moveSliderItemDown(item.id)}
                              disabled={index === homepageSlider.length - 1}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Aşağı Taşı"
                            >
                              <FiArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => toggleSliderItem(item.id)}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              item.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {item.isActive ? 'Aktif' : 'Pasif'}
                          </button>
                          <button
                            onClick={() => removeFromSlider(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Slider'dan Kaldır"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              
                {homepageSlider.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiPlus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz slider'a ürün eklenmemiş</h3>
                    <p className="text-gray-500 mb-6">Ana sayfada gösterilecek ürünleri eklemek için aşağıdaki butonları kullanın</p>
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() => openProductSelectionModal('grader')}
                        className="btn-primary flex items-center space-x-2"
                      >
                        <FiTruck className="w-4 h-4" />
                        <span>Grader Seç</span>
                      </button>
                      <button
                        onClick={() => openProductSelectionModal('part')}
                        className="btn-primary flex items-center space-x-2"
                      >
                        <FiSettings className="w-4 h-4" />
                        <span>Parça Seç</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Selection Modal */}
      {showProductSelectionModal && selectedProductType && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedProductType === 'grader' ? 'Grader Seç' : 'Parça Seç'}
                </h3>
                <button
                  onClick={closeProductSelectionModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-600 mt-1">
                Ana sayfa slider'ına eklemek için {selectedProductType === 'grader' ? 'grader' : 'parça'} seçin
              </p>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(selectedProductType === 'grader' ? graders : parts).map((product) => {
                  const isAlreadyInSlider = homepageSlider.some(item => 
                    (selectedProductType === 'grader' && item.graderId === product.id) ||
                    (selectedProductType === 'part' && item.partId === product.id)
                  );
                  
                  return (
                    <div 
                      key={product.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        isAlreadyInSlider 
                          ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed' 
                          : 'border-gray-200 hover:border-orange-500 hover:shadow-md'
                      }`}
                      onClick={() => !isAlreadyInSlider && selectProductForSlider(product.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={product.images[0]} 
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{product.title}</h4>
                          <p className="text-sm text-gray-600">
                            {selectedProductType === 'grader' 
                              ? `${(product as any).year} • ${product.brand}` 
                              : `${product.brand} • ${(product as any).category}`
                            }
                          </p>
                          <p className="text-sm font-semibold text-orange-600">
                            {formatPrice(product.price)}
                          </p>
                          {isAlreadyInSlider && (
                            <p className="text-xs text-gray-500 mt-1">✓ Zaten slider'da</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {(selectedProductType === 'grader' ? graders : parts).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>Henüz {selectedProductType === 'grader' ? 'grader' : 'parça'} eklenmemiş</p>
                  <button
                    onClick={() => {
                      closeProductSelectionModal();
                      navigate(selectedProductType === 'grader' ? '/admin/add-grader' : '/admin/add-part');
                    }}
                    className="mt-4 btn-primary"
                  >
                    {selectedProductType === 'grader' ? 'Yeni Grader Ekle' : 'Yeni Parça Ekle'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Silme Onayı
            </h3>
            <p className="text-gray-600 mb-6">
              Bu öğeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isDeleting}
              >
                İptal
              </button>
              <button
                onClick={() => {
                  if (graders.find(g => g.id === showDeleteModal)) {
                    handleDeleteGrader(showDeleteModal);
                  } else if (parts.find(p => p.id === showDeleteModal)) {
                    handleDeletePart(showDeleteModal);
                  }
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? 'Siliniyor...' : 'Sil'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <ChatAnalytics />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;