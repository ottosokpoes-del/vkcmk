import { useState, useEffect, useRef } from 'react';
import { supabase } from '../config/supabase';
import { useAppStore } from '../store';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type: 'text' | 'image' | 'carousel' | 'quick_reply';
  data?: any;
}

interface ConsentState {
  given: boolean;
  timestamp: Date | null;
}

const AdvancedChatBot = () => {
  const { graders } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({ given: false, timestamp: null });
  const [showConsentModal, setShowConsentModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // KVKK Uyumlu Onay Sistemi
  const ConsentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
      <div className="bg-white p-6 rounded-lg max-w-md mx-4 relative z-[100000]">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-sm">🔒</span>
          </div>
          <h3 className="text-lg font-semibold">Veri Kullanım Onayı</h3>
        </div>
        
        <div className="text-sm text-gray-600 mb-6 space-y-2">
          <p>Müşteri hizmetlerimizi geliştirmek için:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Sorularınızı anonim olarak kaydediyoruz</li>
            <li>Kişisel bilgileriniz saklanmaz</li>
            <li>Veriler üçüncü taraflarla paylaşılmaz</li>
            <li>İstediğiniz zaman veri işlemeyi durdurabilirsiniz</li>
          </ul>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={() => {
              setConsent({ given: true, timestamp: new Date() });
              setShowConsentModal(false);
              // Onayı localStorage'a kaydet
              localStorage.setItem('chatbot-consent', JSON.stringify({
                given: true,
                timestamp: new Date().toISOString()
              }));
            }}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            Kabul Ediyorum
          </button>
          <button 
            onClick={() => {
              setConsent({ given: false, timestamp: null });
              setShowConsentModal(false);
            }}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium"
          >
            Reddet
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-3 text-center">
          KVKK ve GDPR uyumlu veri işleme
        </p>
      </div>
    </div>
  );

  // Yerel cevaplar sistemi
  const getLocalResponse = (input: string): string | null => {
    const responses: Record<string, string> = {
      // Selamlama
      'merhaba': 'Merhaba! Motor greyder konusunda size nasıl yardımcı olabilirim?',
      'selam': 'Selam! Hoş geldiniz! Motor greyderlerimiz hakkında sorularınızı yanıtlayabilirim.',
      'hello': 'Hello! Welcome to our grader marketplace!',
      'hi': 'Hi! How can I help you with motor graders?',
      'günaydın': 'Günaydın! Motor greyder konusunda size nasıl yardımcı olabilirim?',
      'iyi günler': 'İyi günler! Motor greyderlerimiz hakkında bilgi almak ister misiniz?',
      
      // Yardım ve bilgi
      'yardım': 'Size şu konularda yardımcı olabilirim:\n• Motor greyder fiyatları\n• Marka ve model bilgileri\n• İletişim bilgileri\n• Galeri görüntüleme\n• Teknik özellikler',
      'help': 'I can help you with:\n• Motor grader prices\n• Brand and model information\n• Contact details\n• Gallery viewing\n• Technical specifications',
      'bilgi': 'Motor greyderlerimiz hakkında detaylı bilgi verebilirim. Hangi konuda yardım istiyorsunuz?',
      'ne yapabilirsin': 'Motor greyderlerimiz hakkında:\n• Fiyat bilgileri\n• Marka/model önerileri\n• İletişim bilgileri\n• Galeri görüntüleme\n• Teknik destek',
      
      // İletişim
      'iletişim': 'İletişim bilgilerimiz:\n📞 +90 XXX XXX XX XX\n📧 info@sadece1deneme.com\n📍 [Adres bilgisi]\n\nSize nasıl yardımcı olabilirim?',
      'telefon': 'Telefon numaramız: +90 XXX XXX XX XX\n\nDetaylı bilgi için arayabilirsiniz.',
      'email': 'E-posta adresimiz: info@sadece1deneme.com\n\nSorularınızı e-posta ile de gönderebilirsiniz.',
      'contact': 'Contact information:\n📞 +90 XXX XXX XX XX\n📧 info@sadece1deneme.com\n📍 [Address]',
      
      // Fiyat bilgileri
      'fiyat': 'Motor greyder fiyatları marka ve modele göre değişir. Hangi marka/model ile ilgileniyorsunuz?\n\n• Caterpillar\n• John Deere\n• Komatsu\n• Case\n• New Holland',
      'price': 'Motor grader prices vary by brand and model. Which brand/model are you interested in?',
      'ne kadar': 'Motor greyder fiyatları marka ve modele göre değişir. Hangi marka/model ile ilgileniyorsunuz?',
      'kaç para': 'Motor greyder fiyatları marka ve modele göre değişir. Hangi marka/model ile ilgileniyorsunuz?',
      'maliyet': 'Motor greyder maliyetleri marka ve modele göre değişir. Hangi marka/model ile ilgileniyorsunuz?',
      
      // Marka bilgileri
      'marka': 'Şu anda stokta olan markalarımız:\n\n• Caterpillar (Cat)\n• Komatsu\n\nHangi marka ile ilgileniyorsunuz?',
      'brand': 'Currently available brands:\n\n• Caterpillar (Cat)\n• Komatsu\n\nWhich brand are you interested in?',
      'caterpillar': 'Caterpillar motor greyderlerimiz mevcuttur. Hangi model ile ilgileniyorsunuz?\n\n• 140M\n• 160M',
      'cat': 'Caterpillar motor greyderlerimiz mevcuttur. Hangi model ile ilgileniyorsunuz?\n\n• 140M\n• 160M',
      'john deere': 'Üzgünüm, şu anda John Deere motor greyderlerimiz stokta bulunmuyor.\n\nStokta olan markalar:\n• Caterpillar (Cat)\n• Komatsu\n\nHangi marka ile ilgileniyorsunuz?',
      'komatsu': 'Komatsu motor greyderlerimiz mevcuttur. Hangi model ile ilgileniyorsunuz?\n\n• GD655-7',
      
      // Model bilgileri
      'model': 'Hangi marka ile ilgileniyorsunuz?\n\n• Caterpillar (140M, 160M)\n• Komatsu (GD655-7)',
      '140m': 'Caterpillar 140M motor greyder hakkında bilgi verebilirim. Detaylı bilgi için iletişime geçin.',
      '160m': 'Caterpillar 160M motor greyder hakkında bilgi verebilirim. Detaylı bilgi için iletişime geçin.',
      'gd655': 'Komatsu GD655-7 motor greyder hakkında bilgi verebilirim. Detaylı bilgi için iletişime geçin.',
      '670g': 'Üzgünüm, John Deere 670G şu anda stokta bulunmuyor.\n\nStokta olan modeller:\n• Caterpillar 140M\n• Caterpillar 160M\n• Komatsu GD655-7',
      
      // Greyder genel
      'greyder': 'Motor greyderlerimiz hakkında bilgi almak için galeri sayfasını ziyaret edin.\n\nHangi konuda yardım istiyorsunuz?',
      'grader': 'Motor graderlerimiz hakkında bilgi almak için galeri sayfasını ziyaret edin.\n\nHangi konuda yardım istiyorsunuz?',
      'makine': 'Motor greyderlerimiz hakkında bilgi almak için galeri sayfasını ziyaret edin.\n\nHangi konuda yardım istiyorsunuz?',
      'makineler': 'Motor greyderlerimiz hakkında bilgi almak için galeri sayfasını ziyaret edin.\n\nHangi konuda yardım istiyorsunuz?',
      
      // Galeri
      'galeri': 'Galeri sayfamızda tüm motor greyderlerimizi görebilirsiniz.\n\nHangi marka/model ile ilgileniyorsunuz?',
      'gallery': 'You can see all our motor graders in the gallery page.\n\nWhich brand/model are you interested in?',
      'görsel': 'Galeri sayfamızda tüm motor greyderlerimizi görebilirsiniz.\n\nHangi marka/model ile ilgileniyorsunuz?',
      'resim': 'Galeri sayfamızda tüm motor greyderlerimizi görebilirsiniz.\n\nHangi marka/model ile ilgileniyorsunuz?',
      
      // Teknik özellikler
      'teknik': 'Motor greyderlerimizin teknik özellikleri hakkında bilgi verebilirim.\n\nHangi marka/model ile ilgileniyorsunuz?',
      'özellik': 'Motor greyderlerimizin özellikleri hakkında bilgi verebilirim.\n\nHangi marka/model ile ilgileniyorsunuz?',
      'specification': 'I can provide information about motor grader specifications.\n\nWhich brand/model are you interested in?',
      
      // Teşekkür
      'teşekkür': 'Rica ederim! Başka sorunuz var mı?',
      'sağol': 'Rica ederim! Başka sorunuz var mı?',
      'thanks': 'You\'re welcome! Do you have any other questions?',
      'thank you': 'You\'re welcome! Do you have any other questions?',
      
      // Genel sorular
      'nasıl': 'Motor greyderlerimiz hakkında nasıl yardımcı olabilirim?\n\n• Fiyat bilgileri\n• Marka/model önerileri\n• İletişim bilgileri\n• Galeri görüntüleme',
      'ne zaman': 'Motor greyderlerimiz hakkında bilgi almak için iletişime geçin.\n\n📞 +90 XXX XXX XX XX',
      'nerede': 'Motor greyderlerimiz hakkında bilgi almak için iletişime geçin.\n\n📞 +90 XXX XXX XX XX',
      'kim': 'Motor greyderlerimiz hakkında bilgi almak için iletişime geçin.\n\n📞 +90 XXX XXX XX XX',
      
      // Satış
      'satış': 'Motor greyderlerimiz hakkında bilgi almak için iletişime geçin.\n\n📞 +90 XXX XXX XX XX',
      'satın al': 'Motor greyderlerimiz hakkında bilgi almak için iletişime geçin.\n\n📞 +90 XXX XXX XX XX',
      'buy': 'For motor grader information, please contact us.\n\n📞 +90 XXX XXX XX XX',
      'purchase': 'For motor grader information, please contact us.\n\n📞 +90 XXX XXX XX XX',
      
      // Kiralama
      'kiralama': 'Motor greyderlerimiz hakkında bilgi almak için iletişime geçin.\n\n📞 +90 XXX XXX XX XX',
      'kiralık': 'Motor greyderlerimiz hakkında bilgi almak için iletişime geçin.\n\n📞 +90 XXX XXX XX XX',
      'rent': 'For motor grader information, please contact us.\n\n📞 +90 XXX XXX XX XX',
      'rental': 'For motor grader information, please contact us.\n\n📞 +90 XXX XXX XX XX'
    };

    const lowerInput = input.toLowerCase().trim();
    
    // Tam eşleşme kontrolü
    if (responses[lowerInput]) {
      return responses[lowerInput];
    }
    
    // Kısmi eşleşme kontrolü
    for (const [key, value] of Object.entries(responses)) {
      if (lowerInput.includes(key)) {
        return value;
      }
    }
    
    return null;
  };

  // Yerel store'dan grader arama
  const searchGraders = async (query: string) => {
    try {
      console.log('Searching for graders with query:', query);
      console.log('Available graders:', graders);
      
      // Yerel store'dan arama yap
      const filteredGraders = graders.filter(grader => {
        const searchTerm = query.toLowerCase();
        return (
          grader.brand.toLowerCase().includes(searchTerm) ||
          grader.model.toLowerCase().includes(searchTerm) ||
          grader.description.toLowerCase().includes(searchTerm) ||
          grader.title.toLowerCase().includes(searchTerm)
        );
      });

      console.log('Filtered graders:', filteredGraders);
      return filteredGraders.slice(0, 3); // En fazla 3 sonuç
      
    } catch (error) {
      console.error('Grader search error:', error);
      return [];
    }
  };

  // Grader'lar için özel cevap
  const createGradersResponse = (graders: any[]): string | null => {
    if (graders.length === 0) return null;
    
    let response = `İlgilendiğiniz konuda ${graders.length} adet motor greyder buldum:\n\n`;
    
    graders.forEach((grader, index) => {
      response += `${index + 1}. ${grader.brand} ${grader.model} ${grader.year}\n`;
      response += `   💰 ${grader.price.toLocaleString()} TL\n`;
      response += `   📍 ${grader.location}\n`;
      if (grader.operatingHours) {
        response += `   🚗 ${grader.operatingHours.toLocaleString()} saat\n`;
      }
      response += '\n';
    });

    response += 'Detaylı bilgi için iletişime geçin: +90 XXX XXX XX XX';
    return response;
  };

  // Akıllı cevap sistemi
  const getSmartResponse = async (input: string): Promise<string> => {
    try {
      console.log('Getting smart response for:', input);
      
      // 1. Önce yerel cevapları kontrol et
      const localResponse = getLocalResponse(input);
      if (localResponse) {
        console.log('Found local response:', localResponse);
        return localResponse;
      }

      // 2. Supabase'den ilgili grader'ları çek
      console.log('Searching graders...');
      const graders = await searchGraders(input);
      console.log('Found graders:', graders);
      
      const gradersResponse = createGradersResponse(graders);
      if (gradersResponse) {
        console.log('Found graders response:', gradersResponse);
        return gradersResponse;
      }

      // 3. Varsayılan cevap
      console.log('Using default response');
      return 'Motor greyderlerimiz hakkında size yardımcı olabilirim! Şu konularda sorularınızı yanıtlayabilirim:\n\n• Fiyat bilgileri\n• Marka/model önerileri\n• İletişim bilgileri\n• Galeri görüntüleme\n• Teknik özellikler\n\nHangi konuda yardım istiyorsunuz?';

    } catch (error) {
      console.error('Smart response error:', error);
      return 'Motor greyderlerimiz hakkında size yardımcı olabilirim! Şu konularda sorularınızı yanıtlayabilirim:\n\n• Fiyat bilgileri\n• Marka/model önerileri\n• İletişim bilgileri\n• Galeri görüntüleme\n\nHangi konuda yardım istiyorsunuz?';
    }
  };

  // KVKK uyumlu veri kaydetme
  const saveAnalytics = async (message: string, isUser: boolean) => {
    if (!consent.given) return;

    try {
      // Sadece anonim veri kaydet - tablo yoksa sessizce geç
      await supabase.from('chat_analytics').insert({
        message_type: isUser ? 'question' : 'answer',
        message_length: message.length,
        question_category: categorizeQuestion(message),
        timestamp: new Date(),
        // Kişisel bilgi YOK
      });
    } catch (error) {
      // Tablo yoksa sessizce geç
      console.log('Analytics table not found, skipping...');
    }
  };

  // Soru kategorilendirme
  const categorizeQuestion = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('fiyat') || lowerMessage.includes('para') || lowerMessage.includes('ne kadar')) {
      return 'price';
    }
    if (lowerMessage.includes('iletişim') || lowerMessage.includes('telefon') || lowerMessage.includes('email')) {
      return 'contact';
    }
    if (lowerMessage.includes('marka') || lowerMessage.includes('model') || lowerMessage.includes('greyder')) {
      return 'product';
    }
    if (lowerMessage.includes('merhaba') || lowerMessage.includes('selam') || lowerMessage.includes('hello')) {
      return 'greeting';
    }
    
    return 'other';
  };

  // Mesaj gönderme
  const handleSend = async () => {
    if (!inputText.trim()) return;

    // İlk mesajda onay kontrolü
    if (messages.length === 0 && !consent.given) {
      setShowConsentModal(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Analytics kaydet
    await saveAnalytics(inputText, true);

    // Bot cevabı
    const botResponse = await getSmartResponse(inputText);
    
    setTimeout(async () => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      
      // Bot cevabını da kaydet
      await saveAnalytics(botResponse, false);
    }, 1000);
  };

  // Hızlı cevaplar
  const quickReplies = [
    'Fiyat bilgisi',
    'İletişim',
    'Marka bilgisi',
    'Galeri',
    'Caterpillar',
    'Komatsu'
  ];

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Onay durumunu kontrol et
  useEffect(() => {
    const savedConsent = localStorage.getItem('chatbot-consent');
    if (savedConsent) {
      const consentData = JSON.parse(savedConsent);
      setConsent({
        given: consentData.given,
        timestamp: new Date(consentData.timestamp)
      });
    }
  }, []);

  return (
    <>
      {showConsentModal && <ConsentModal />}
      
      <div className="fixed bottom-4 right-2 lg:right-4 z-[9999]">
        {isOpen && (
          <div className="bg-white rounded-lg shadow-xl w-80 lg:w-96 h-[500px] border border-gray-200 relative flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center relative">
              <div>
                <h3 className="font-semibold text-lg">Motor Greyder Asistanı</h3>
                <p className="text-sm opacity-90">
                  {consent.given ? 'Size yardımcı olmaya hazırım' : 'Onay bekleniyor'}
                </p>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-white hover:bg-blue-700 rounded-full w-8 h-8 flex items-center justify-center absolute top-4 right-4"
              >
                ×
              </button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs p-3 rounded-lg ${
                    msg.isUser 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{msg.text}</p>
                    <p className={`text-xs mt-1 ${
                      msg.isUser ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {msg.timestamp.toLocaleTimeString('tr-TR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Quick Replies */}
            {messages.length === 0 && (
              <div className="p-4 border-t bg-gray-50">
                <p className="text-sm text-gray-600 mb-2">Hızlı sorular:</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => {
                        if (!consent.given) {
                          setShowConsentModal(true);
                        } else {
                          setInputText(reply);
                        }
                      }}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  onClick={() => {
                    if (messages.length === 0 && !consent.given) {
                      setShowConsentModal(true);
                    }
                  }}
                  placeholder={consent.given ? "Mesajınızı yazın..." : "Önce onay verin"}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isTyping}
                />
                <button
                  onClick={() => {
                    if (messages.length === 0 && !consent.given) {
                      setShowConsentModal(true);
                    } else {
                      handleSend();
                    }
                  }}
                  disabled={isTyping || !inputText.trim()}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Gönder
                </button>
              </div>
              
              {/* Consent Status */}
              {!consent.given && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Veri kullanım onayı gereklidir
                </p>
              )}
            </div>
          </div>
        )}
        
        {/* Chat Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 relative z-[10000]"
        >
          <div className="flex items-center justify-center">
            {isOpen ? '×' : '💬'}
          </div>
        </button>
      </div>
    </>
  );
};

export default AdvancedChatBot;
