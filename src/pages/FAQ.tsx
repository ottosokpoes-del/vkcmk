const FAQ = () => {
  const faqs = [
    {
      question: "Araç satın alırken nelere dikkat etmeliyim?",
      answer: "Araç satın alırken kilometre, yıl, yakıt türü, vites tipi, kaza geçmişi ve servis kayıtları gibi önemli detayları kontrol etmelisiniz. Ayrıca araç sahibiyle detaylı görüşme yaparak araç hakkında bilgi almalısınız."
    },
    {
      question: "Favori listeme nasıl araç ekleyebilirim?",
      answer: "Beğendiğiniz araç kartındaki kalp ikonuna tıklayarak veya araç detay sayfasındaki 'Favorilere Ekle' butonuna basarak araçları favori listenize ekleyebilirsiniz."
    },
    {
      question: "Araç fiyatları güncel mi?",
      answer: "Evet, platformumuzdaki tüm araç fiyatları satıcılar tarafından güncel tutulmaktadır. Ancak fiyatlar değişebileceği için satın almadan önce satıcıyla iletişime geçmenizi öneririz."
    },
    {
      question: "Araç sahibiyle nasıl iletişime geçebilirim?",
      answer: "Araç detay sayfasında bulunan 'Ara', 'WhatsApp' ve 'Mesaj Gönder' butonlarını kullanarak araç sahibiyle iletişime geçebilirsiniz."
    },
    {
      question: "Galeriden ve sahibinden araçlar arasında fark var mı?",
      answer: "Galeriden araçlar genellikle garantili ve bakımlı olurken, sahibinden araçlar bireysel satıcılardan gelir. Her iki durumda da araç detaylarını dikkatli incelemenizi öneririz."
    },
    {
      question: "Araç fotoğrafları gerçek mi?",
      answer: "Evet, platformumuzdaki tüm fotoğraflar gerçek araçlara aittir. Fotoğraflar satıcılar tarafından yüklenir ve gerçek araçları yansıtır."
    },
    {
      question: "Filtreleme nasıl çalışır?",
      answer: "Sol taraftaki filtre panelini kullanarak marka, yıl, fiyat aralığı, yakıt türü, vites tipi ve şehir gibi kriterlere göre arama yapabilirsiniz. Filtreler anlık olarak sonuçları günceller."
    },
    {
      question: "Mobil uygulamanız var mı?",
      answer: "Şu anda sadece web platformumuz mevcuttur. Mobil uygulama geliştirme çalışmalarımız devam etmektedir."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Sık Sorulan Sorular
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Merak ettiğiniz soruların cevaplarını burada bulabilirsiniz
        </p>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {faq.question}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div className="mt-12 bg-gray-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Sorunuzun cevabını bulamadınız mı?
        </h2>
        <p className="text-gray-600 mb-6">
          Bizimle iletişime geçin, size yardımcı olmaktan mutluluk duyarız
        </p>
        <a
          href="/contact"
          className="btn-primary inline-flex items-center space-x-2"
        >
          <span>İletişime Geç</span>
        </a>
      </div>
    </div>
  );
};

export default FAQ;

