import { useState } from 'react';
import emailjs from '@emailjs/browser';

// EmailJS konfigürasyonu - sabit değerler (environment variables sorunu nedeniyle)
const EMAILJS_SERVICE_ID = 'service_usy9dun';
const EMAILJS_TEMPLATE_ID = 'template_l1tz6ch';
const EMAILJS_PUBLIC_KEY = 'NPNTpy-uFXxyG81mo';

export interface TwoFactorAuthState {
  isCodeSent: boolean;
  isLoading: boolean;
  error: string;
  verificationCode: string;
  attempts: number;
}

export const useTwoFactorAuth = () => {
  const [state, setState] = useState<TwoFactorAuthState>({
    isCodeSent: false,
    isLoading: false,
    error: '',
    verificationCode: '',
    attempts: 0,
  });

  // 6 haneli doğrulama kodu oluştur
  const generateVerificationCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // EmailJS ile doğrulama kodu gönder
  const sendVerificationCode = async (email: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      const verificationCode = generateVerificationCode();
      
      // EmailJS template parametreleri
      const templateParams = {
        to_email: email,
        verification_code: verificationCode,
        user_name: 'Admin',
      };

      // EmailJS ile email gönder
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      if (result.status === 200) {
        // Başarılı gönderim - kodu localStorage'a kaydet (güvenlik için)
        localStorage.setItem('verification_code', verificationCode);
        localStorage.setItem('verification_email', email);
        localStorage.setItem('verification_timestamp', Date.now().toString());
        
        setState(prev => ({
          ...prev,
          isCodeSent: true,
          isLoading: false,
          verificationCode,
          error: '',
        }));
        
        return true;
      } else {
        throw new Error('Email gönderilemedi');
      }
    } catch (error: any) {
      console.error('EmailJS Error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Doğrulama kodu gönderilemedi. Lütfen tekrar deneyin.',
      }));
      return false;
    }
  };

  // Doğrulama kodunu kontrol et
  const verifyCode = (inputCode: string): boolean => {
    const storedCode = localStorage.getItem('verification_code');
    const storedEmail = localStorage.getItem('verification_email');
    const storedTimestamp = localStorage.getItem('verification_timestamp');

    if (!storedCode || !storedEmail || !storedTimestamp) {
      setState(prev => ({
        ...prev,
        error: 'Doğrulama kodu bulunamadı. Lütfen tekrar gönderin.',
      }));
      return false;
    }

    // Kod 10 dakika geçerli
    const codeAge = Date.now() - parseInt(storedTimestamp);
    const maxAge = 10 * 60 * 1000; // 10 dakika

    if (codeAge > maxAge) {
      setState(prev => ({
        ...prev,
        error: 'Doğrulama kodu süresi dolmuş. Lütfen yeni kod isteyin.',
        isCodeSent: false,
      }));
      // Süresi dolmuş kodları temizle
      localStorage.removeItem('verification_code');
      localStorage.removeItem('verification_email');
      localStorage.removeItem('verification_timestamp');
      return false;
    }

    if (inputCode === storedCode) {
      // Başarılı doğrulama - kodları temizle
      localStorage.removeItem('verification_code');
      localStorage.removeItem('verification_email');
      localStorage.removeItem('verification_timestamp');
      
      setState(prev => ({
        ...prev,
        error: '',
        attempts: 0,
      }));
      return true;
    } else {
      const newAttempts = state.attempts + 1;
      setState(prev => ({
        ...prev,
        attempts: newAttempts,
        error: `Yanlış kod. ${3 - newAttempts} deneme hakkınız kaldı.`,
      }));

      // 3 yanlış denemeden sonra kodu geçersiz kıl
      if (newAttempts >= 3) {
        localStorage.removeItem('verification_code');
        localStorage.removeItem('verification_email');
        localStorage.removeItem('verification_timestamp');
        setState(prev => ({
          ...prev,
          isCodeSent: false,
          error: 'Çok fazla yanlış deneme. Yeni kod gönderin.',
        }));
      }
      return false;
    }
  };

  // Kodu yeniden gönder
  const resendCode = async (email: string): Promise<boolean> => {
    setState(prev => ({ ...prev, attempts: 0, error: '' }));
    return await sendVerificationCode(email);
  };

  // Durumu sıfırla
  const resetState = () => {
    setState({
      isCodeSent: false,
      isLoading: false,
      error: '',
      verificationCode: '',
      attempts: 0,
    });
    // LocalStorage'dan kodları temizle
    localStorage.removeItem('verification_code');
    localStorage.removeItem('verification_email');
    localStorage.removeItem('verification_timestamp');
  };

  return {
    ...state,
    sendVerificationCode,
    verifyCode,
    resendCode,
    resetState,
  };
};
