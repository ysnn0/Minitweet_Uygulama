import React, { useState, useContext, useEffect } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext"; // AuthContext'i import edin
import FollowButton from "../components/FollowButton"; // FollowButton'ı import edin

const Search = () => {
  const { state } = useContext(AuthContext); // Giriş yapmış kullanıcının bilgilerini al
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  // Giriş yapmış kullanıcının takip ettiği kişileri tutmak için state
  const [currentUserFollowing, setCurrentUserFollowing] = useState([]);

  useEffect(() => {
    // Sadece giriş yapmış kullanıcılar için takip listesini çek
    if (state.token && state.user?._id) {
      fetchCurrentUserFollowing();
    } else {
      setCurrentUserFollowing([]); // Çıkış yapıldığında listeyi temizle
    }
  }, [state.token, state.user?._id]);

  const fetchCurrentUserFollowing = async () => {
    try {
      const res = await axios.get(`/users/${state.user._id}`, {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      // Sadece takip edilenlerin ID'lerini al
      setCurrentUserFollowing(res.data.following.map(f => f._id));
    } catch (err) {
      console.error("Takip listesi çekme hatası:", err);
      // Hata durumunda da devam etmesi için hata mesajı göstermeyebiliriz veya daha nazik olabiliriz
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(""); // Önceki hataları temizle
    if (!query.trim()) {
      setResults([]); // Boş arama ise sonuçları temizle
      return;
    }

    setIsSearching(true);
    try {
      const res = await axios.get(`/users/search?username=${query}`);
      setResults(res.data);
    } catch (err) {
      console.error("Arama hatası:", err);
      setError("Kullanıcı arama sırasında bir hata oluştu.");
    } finally {
      setIsSearching(false);
    }
  };

  // Tek bir kullanıcının takip durumunu güncelleme fonksiyonu
  const handleFollowToggleForUser = async (userId, isCurrentlyFollowing) => {
    if (!state.token) {
        setError("Takip işlemi için giriş yapmalısınız.");
        return;
    }
    try {
      const endpoint = isCurrentlyFollowing
        ? `/users/${userId}/unfollow`
        : `/users/${userId}/follow`;
      await axios.put(endpoint, {}, {
        headers: { Authorization: `Bearer ${state.token}` },
      });

      // Takip listesini güncelle
      setCurrentUserFollowing(prevFollowing => {
        if (isCurrentlyFollowing) {
          return prevFollowing.filter(id => id !== userId);
        } else {
          return [...prevFollowing, userId];
        }
      });
      // Başka bir yerden takipçi sayısı güncelleniyorsa burayı da ona göre düzenlemek gerekebilir.
      // Şimdilik sadece FollowButton'ın kendisi ve takip listesini güncelliyoruz.

    } catch (err) {
      console.error("Takip/Takip bırak işlemi hatası:", err);
      setError("Takip işlemi başarısız oldu.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 max-w-3xl">
      <h1 className="text-3xl font-extrabold text-center text-green-400 mb-8 animate-fadeIn">
        Kullanıcı Ara
      </h1>

      {error && (
        <p className="bg-red-600 bg-opacity-80 text-white p-3 rounded-lg mb-6 text-center shadow-lg animate-fadeIn">
          {error}
        </p>
      )}

      {/* Arama Formu */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-4 mb-8 bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-xl p-6 shadow-lg border border-gray-700/50 transform hover:scale-[1.005] transition-transform duration-300 ease-in-out"
      >
        <input
          type="text"
          placeholder="Kullanıcı adı ara..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input-field flex-1 text-lg py-3 px-4"
          disabled={isSearching}
        />
        <button
          type="submit"
          className="btn-primary py-3 px-6 text-base sm:text-lg bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
          disabled={isSearching}
        >
          {isSearching ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Aranıyor...
            </span>
          ) : (
            "Ara"
          )}
        </button>
      </form>

      {/* Arama Sonuçları */}
      <div className="space-y-4">
        {results.length > 0 ? (
          results.map((user) => {
            const isSelf = state.user?._id === user._id; // Kendi profilimiz mi?
            const isCurrentlyFollowing = currentUserFollowing.includes(user._id); // Takip ediyor muyuz?

            return (
              <div
                key={user._id}
                className="bg-gray-800 bg-opacity-60 rounded-xl p-5 shadow-lg border border-gray-700/50 flex items-center justify-between gap-4 transition-transform duration-200 hover:scale-[1.005] hover:bg-opacity-70"
              >
                <div className="flex items-center gap-4">
                  {/* Kullanıcı Avatarı Placeholder */}
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <Link
                    to={`/profile/${user._id}`}
                    className="text-xl font-semibold text-blue-300 hover:text-blue-200 transition-colors duration-200 truncate"
                    title={user.username}
                  >
                    @{user.username}
                  </Link>
                </div>
                {!isSelf && state.token && ( // Kendi profilimiz değilse ve giriş yapılmışsa Follow/Unfollow butonunu göster
                  <FollowButton
                    isFollowing={isCurrentlyFollowing}
                    onToggle={() => handleFollowToggleForUser(user._id, isCurrentlyFollowing)}
                    isLoading={false} // Arama sayfasında her buton için ayrı loading state tutmak karmaşık olabilir, şimdilik sabit
                  />
                )}
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-400 text-lg py-10 bg-gray-800 bg-opacity-60 rounded-lg shadow-inner border border-gray-700/50">
            {isSearching ? "Kullanıcılar aranıyor..." : (query.trim() ? "Hiçbir kullanıcı bulunamadı." : "Aramak için bir kullanıcı adı girin.")}
          </p>
        )}
      </div>
    </div>
  );
};

export default Search;