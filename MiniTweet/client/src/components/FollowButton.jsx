import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const FollowButton = ({ userId, isFollowing, onFollowToggled }) => {
  const { state } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    setLoading(true);
    try {
      const endpoint = `/api/users/${userId}/${isFollowing ? 'unfollow' : 'follow'}`;
      await axios.put(endpoint, {}, {
        headers: {
          Authorization: `Bearer ${state.token}`
        }
      });
      onFollowToggled(); // Profili yeniden yükle veya parent component'i güncelle
    } catch (err) {
      console.error('Takip işlemi hatası:', err);
      // Hata durumunda kullanıcıya görsel geri bildirim verebilirsiniz (örn: toast mesajı)
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      // btn-primary sınıfını kullanıyoruz ve üzerine duruma göre renkleri override ediyoruz.
      // Ayrıca yükleme (loading) durumunda daha şık bir görünüm ve animasyon ekledik.
      className={`
        btn-primary // index.css'ten gelen temel buton stilleri
        ${isFollowing 
          ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' // Takip ediliyorsa kırmızı
          : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' // Takip edilmiyorsa mavi
        }
        ${loading ? 'opacity-70 cursor-not-allowed animate-pulse' : ''} // Yükleme durumunda soluk ve titreşim
        font-medium text-sm md:text-base // Yazı boyutu ve kalınlığı
        py-2 px-5 md:py-2.5 md:px-6 // Dikey ve yatay dolgu
        rounded-full // Tamamen yuvarlak butonlar
        transition-all duration-300 ease-in-out // Tüm geçişler için animasyon
      `}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {isFollowing ? 'Bırakılıyor...' : 'Takip Ediliyor...'}
        </span>
      ) : (
        isFollowing ? 'Takibi Bırak 🚫' : 'Takip Et ✨'
      )}
    </button>
  );
};

export default FollowButton;