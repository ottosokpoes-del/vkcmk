import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

interface ChatStats {
  total_messages: number;
  total_questions: number;
  total_answers: number;
  avg_message_length: number;
  most_common_category: string;
  total_sessions: number;
  avg_session_duration: string;
}

interface AnalyticsData {
  date: string;
  question_category: string;
  message_count: number;
  avg_message_length: number;
  question_count: number;
  answer_count: number;
}

interface PerformanceData {
  hour: string;
  avg_response_time: number;
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
}

const ChatAnalytics = () => {
  const [stats, setStats] = useState<ChatStats | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chat istatistiklerini getir
  const fetchChatStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_chat_stats');
      
      if (error) {
        console.error('Stats fetch error:', error);
        setError('İstatistikler yüklenirken hata oluştu');
        return;
      }

      if (data && data.length > 0) {
        setStats(data[0]);
      }
    } catch (err) {
      console.error('Stats fetch error:', err);
      setError('İstatistikler yüklenirken hata oluştu');
    }
  };

  // Analytics verilerini getir
  const fetchAnalyticsData = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_analytics_summary')
        .select('*')
        .order('date', { ascending: false })
        .limit(30);

      if (error) {
        console.error('Analytics fetch error:', error);
        return;
      }

      setAnalyticsData(data || []);
    } catch (err) {
      console.error('Analytics fetch error:', err);
    }
  };

  // Performance verilerini getir
  const fetchPerformanceData = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_performance_summary')
        .select('*')
        .order('hour', { ascending: false })
        .limit(24);

      if (error) {
        console.error('Performance fetch error:', error);
        return;
      }

      setPerformanceData(data || []);
    } catch (err) {
      console.error('Performance fetch error:', err);
    }
  };

  // Tüm verileri yükle
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchChatStats(),
        fetchAnalyticsData(),
        fetchPerformanceData()
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  // Kategori renkleri
  const getCategoryColor = (category: string) => {
    const colors = {
      'price': 'bg-green-100 text-green-800',
      'contact': 'bg-blue-100 text-blue-800',
      'product': 'bg-purple-100 text-purple-800',
      'greeting': 'bg-yellow-100 text-yellow-800',
      'other': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  // Kategori Türkçe isimleri
  const getCategoryName = (category: string) => {
    const names = {
      'price': 'Fiyat',
      'contact': 'İletişim',
      'product': 'Ürün',
      'greeting': 'Selamlama',
      'other': 'Diğer'
    };
    return names[category as keyof typeof names] || 'Diğer';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Chat Analytics Dashboard</h2>
        <p className="text-gray-600">KVKK uyumlu anonim veri analizi</p>
      </div>

      {/* Ana İstatistikler */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-blue-600 text-xl">💬</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Mesaj</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_messages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-green-600 text-xl">❓</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Soru</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_questions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-purple-600 text-xl">💡</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Cevap</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_answers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-yellow-600 text-xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ort. Mesaj Uzunluğu</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(stats.avg_message_length)} karakter
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kategori Analizi */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Soru Kategorileri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {['price', 'contact', 'product', 'greeting', 'other'].map((category) => {
            const categoryData = analyticsData.filter(item => item.question_category === category);
            const totalCount = categoryData.reduce((sum, item) => sum + item.message_count, 0);
            
            return (
              <div key={category} className="text-center">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(category)}`}>
                  {getCategoryName(category)}
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-2">{totalCount}</p>
                <p className="text-sm text-gray-600">mesaj</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Günlük Aktivite */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Son 7 Gün Aktivite</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Toplam Mesaj
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sorular
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cevaplar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyticsData.slice(0, 10).map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(item.date).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(item.question_category)}`}>
                      {getCategoryName(item.question_category)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.message_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.question_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.answer_count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Metrikleri */}
      {performanceData.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Performans Metrikleri</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Ortalama Yanıt Süresi</p>
              <p className="text-2xl font-bold text-green-600">
                {Math.round(performanceData[0]?.avg_response_time || 0)}ms
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Başarılı İstekler</p>
              <p className="text-2xl font-bold text-blue-600">
                {performanceData[0]?.successful_requests || 0}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Başarı Oranı</p>
              <p className="text-2xl font-bold text-purple-600">
                {performanceData[0]?.total_requests ? 
                  Math.round((performanceData[0].successful_requests / performanceData[0].total_requests) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* KVKK Bilgilendirmesi */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-blue-600 text-xl">🔒</span>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800">KVKK Uyumlu Veri İşleme</h4>
            <p className="text-sm text-blue-700 mt-1">
              Bu dashboard sadece anonim verileri gösterir. Kişisel bilgiler saklanmaz ve işlenmez.
              Veriler 30 gün sonra otomatik olarak silinir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAnalytics;
