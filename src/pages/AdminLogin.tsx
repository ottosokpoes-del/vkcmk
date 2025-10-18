import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTwoFactorAuth } from '../hooks/useTwoFactorAuth';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { 
    isLoading: isCodeLoading, 
    error: codeError, 
    sendVerificationCode, 
    verifyCode, 
    resendCode, 
    resetState 
  } = useTwoFactorAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    verificationCode: '',
  });
  const [error, setError] = useState('');
  const [step, setStep] = useState<'credentials' | 'verification'>('credentials');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Hata mesajlarını temizle
    if (error) setError('');
    if (codeError) resetState();
  };

  // İlk adım: Email ve şifre kontrolü
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basit admin kontrolü (gerçek uygulamada daha güvenli olmalı)
    const adminCredentials = {
      email: 'ottosokpoes@gmail.com',
      password: 'T$5vQ8w*Y2k9b!L3zH4RQwsXz'
    };

    if (formData.email === adminCredentials.email && formData.password === adminCredentials.password) {
      // Doğrulama kodu gönder
      const success = await sendVerificationCode(formData.email);
      if (success) {
        setStep('verification');
      }
    } else {
      setError('Geçersiz admin bilgileri');
    }
  };

  // İkinci adım: Doğrulama kodu kontrolü
  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = verifyCode(formData.verificationCode);
    
    if (isValid) {
      try {
        // Supabase ile giriş yap - sadece admin için basit kontrol
        // Gerçek Supabase auth yerine basit admin kontrolü
        const adminCredentials = {
          email: 'ottosokpoes@gmail.com',
          password: 'T$5vQ8w*Y2k9b!L3zH4RQwsXz'
        };

        if (formData.email === adminCredentials.email && formData.password === adminCredentials.password) {
          // Admin girişi başarılı - admin paneline yönlendir
          navigate('/admin');
        } else {
          setError('Geçersiz admin bilgileri');
          setStep('credentials');
          resetState();
        }
      } catch (err: any) {
        setError(err.message || 'Giriş sırasında bir hata oluştu');
        setStep('credentials');
        resetState();
      }
    }
  };

  // Kodu yeniden gönder
  const handleResendCode = async () => {
    await resendCode(formData.email);
  };

  // Geri dön
  const handleBack = () => {
    setStep('credentials');
    resetState();
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {step === 'credentials' ? 'Admin Girişi' : 'Doğrulama Kodu'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === 'credentials' 
              ? 'Güvenli admin paneline erişim' 
              : `${formData.email} adresine gönderilen doğrulama kodunu girin`
            }
          </p>
        </div>
        
        {step === 'credentials' ? (
          <form className="mt-8 space-y-6" onSubmit={handleCredentialsSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Admin Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sahibinden-red focus:border-sahibinden-red focus:z-10 sm:text-sm"
                placeholder="Admin email adresini girin"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Admin Şifresi
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sahibinden-red focus:border-sahibinden-red focus:z-10 sm:text-sm"
                placeholder="Admin şifresini girin"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isCodeLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-sahibinden-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sahibinden-red disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isCodeLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Kod Gönderiliyor...
                </div>
              ) : (
                'Doğrulama Kodu Gönder'
              )}
            </button>
          </div>
        </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleVerificationSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
                  Doğrulama Kodu
                </label>
                <input
                  id="verificationCode"
                  name="verificationCode"
                  type="text"
                  required
                  maxLength={6}
                  className="mt-1 appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sahibinden-red focus:border-sahibinden-red focus:z-10 sm:text-sm text-center text-2xl tracking-widest"
                  placeholder="000000"
                  value={formData.verificationCode}
                  onChange={handleChange}
                />
                <p className="mt-2 text-xs text-gray-500 text-center">
                  6 haneli doğrulama kodunu girin
                </p>
              </div>
            </div>

            {(error || codeError) && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">
                {error || codeError}
              </div>
            )}

            <div className="space-y-3">
              <button
                type="submit"
                disabled={isCodeLoading || formData.verificationCode.length !== 6}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-sahibinden-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sahibinden-red disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isCodeLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Giriş Yapılıyor...
                  </div>
                ) : (
                  'Giriş Yap'
                )}
              </button>

              <div className="flex justify-between text-sm">
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-gray-600 hover:text-sahibinden-red transition-colors"
                >
                  ← Geri Dön
                </button>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isCodeLoading}
                  className="text-sahibinden-red hover:text-red-700 transition-colors disabled:opacity-50"
                >
                  Kodu Yeniden Gönder
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-600 hover:text-sahibinden-red transition-colors"
          >
            ← Ana sayfaya dön
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;