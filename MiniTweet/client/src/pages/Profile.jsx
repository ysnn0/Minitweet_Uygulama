import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import AuthContext from "../context/AuthContext";
import Tweet from "../components/Tweet"; // Tweet bileşenini import edin
import FollowButton from "../components/FollowButton"; // FollowButton bileşenini import edin (eğer varsa, components altında olmalı)
import moment from "moment"; // Tarih formatlama için moment

const Profile = () => {
  const { id } = useParams(); // Profilini görüntülediğimiz kullanıcının ID'si
  const { state } = useContext(AuthContext); // Giriş yapmış kullanıcının bilgileri
  const [userProfile, setUserProfile] = useState(null); // Görüntülenen profilin bilgileri
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState("");
  const [newTweetContent, setNewTweetContent] = useState(""); // Yeni tweet içeriği için state
  const [isPostingTweet, setIsPostingTweet] = useState(false); // Yeni tweet gönderme loading state'i
  const [isFollowing, setIsFollowing] = useState(false); // Takip durumu
  const [loadingFollow, setLoadingFollow] = useState(false); // Takip/Takip bırak loading state'i

  const isOwnProfile = state.user?._id === id; // Kendi profilimiz mi?

  useEffect(() => {
    fetchData();
  }, [id, state.user?._id]); // id veya kendi kullanıcı id'miz değiştiğinde veriyi çek

  const fetchData = async () => {
    setError(""); // Önceki hataları temizle
    try {
      const userRes = await axios.get(`/users/${id}`);
      const userData = userRes.data;
      setUserProfile(userData);

      // Kendi profilimiz değilse takip durumunu kontrol et
      if (!isOwnProfile) {
        setIsFollowing(userData.followers.some(
          (f) => f._id === state.user?._id
        ));
      } else {
        setIsFollowing(false); // Kendi profilimizse takip butonu göstermeyiz
      }

      const tweetRes = await axios.get(`/tweets/user/${id}`);
      setTweets(tweetRes.data);
    } catch (err) {
      console.error("Profil veya tweet çekme hatası:", err);
      setError("Profil bilgileri veya tweetler yüklenirken bir hata oluştu.");
    }
  };

  const handleFollowToggle = async () => {
    if (!state.token) {
        setError("Takip işlemi için giriş yapmalısınız.");
        return;
    }
    setLoadingFollow(true);
    try {
      const endpoint = isFollowing
        ? `/users/${id}/unfollow`
        : `/users/${id}/follow`;
      await axios.put(endpoint, {}, {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      setIsFollowing(!isFollowing);
      // Profil verisini güncelleyerek takipçi sayılarını anında yansıtabiliriz
      setUserProfile(prevUser => ({
          ...prevUser,
          followersCount: isFollowing ? prevUser.followersCount - 1 : prevUser.followersCount + 1
      }));
    } catch (err) {
      console.error("Takip işlemi hatası:", err);
      setError("Takip işlemi başarısız oldu.");
    } finally {
      setLoadingFollow(false);
    }
  };

  const handlePostTweet = async (e) => {
    e.preventDefault();
    if (!newTweetContent.trim()) {
      setError("Tweet içeriği boş olamaz.");
      return;
    }
    setIsPostingTweet(true);
    setError("");
    try {
      await axios.post("/tweets", { content: newTweetContent }, {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      setNewTweetContent("");
      fetchData(); // Yeni tweet gönderildikten sonra profilin tweetlerini yeniden çek
    } catch (err) {
      console.error("Tweet gönderme hatası:", err);
      setError("Tweet gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsPostingTweet(false);
    }
  };

  const handleDeleteTweetFromProfile = (deletedTweetId) => {
    // Tweet silindiğinde state'i güncelleyerek anlık yansıt
    setTweets((prevTweets) =>
      prevTweets.filter((tweet) => tweet._id !== deletedTweetId)
    );
    // Ayrıca kullanıcının tweet sayısını da güncelleyebiliriz
    setUserProfile(prevUser => ({
        ...prevUser,
        tweetCount: prevUser.tweetCount ? prevUser.tweetCount - 1 : 0
    }));
  };

  if (!userProfile) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-200 text-xl">
        {error ? (
            <p className="bg-red-600 bg-opacity-80 text-white p-4 rounded-lg shadow-lg">{error}</p>
        ) : (
            <div className="animate-pulse">Profil yükleniyor...</div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 max-w-3xl">
      {/* Profil Başlık ve Bilgileri */}
      <div className="bg-gradient-to-br from-blue-700 to-purple-800 rounded-xl p-8 mb-8 shadow-2xl relative overflow-hidden transform transition-transform duration-300 hover:scale-[1.005]">
        <div className="absolute inset-0 bg-pattern-light opacity-10"></div> {/* Arkaplan deseni */}
        
        {/* Avatar Alanı (Örnek) */}
        <div className="flex justify-center mb-6 relative z-10">
          <div className="w-32 h-32 rounded-full bg-gray-600 border-4 border-white shadow-lg flex items-center justify-center text-5xl font-bold text-white overflow-hidden">
            {/* Gerçek bir avatar resmi eklenebilir */}
            {userProfile.username ? userProfile.username.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>

        <h1 className="text-4xl font-extrabold text-white text-center mb-2 drop-shadow-lg animate-fadeIn">
          @{userProfile.username}
        </h1>
        <p className="text-lg text-blue-200 text-center mb-4">{userProfile.email}</p>

        {/* İstatistikler */}
        <div className="flex justify-center gap-8 text-center mb-6 text-white text-lg font-semibold relative z-10">
          <div>
            <span className="block text-2xl font-bold text-yellow-300">{userProfile.followersCount || 0}</span>
            <span className="text-gray-300">Takipçi</span>
          </div>
          <div>
            <span className="block text-2xl font-bold text-green-300">{userProfile.followingCount || 0}</span>
            <span className="text-gray-300">Takip Edilen</span>
          </div>
          <div>
            <span className="block text-2xl font-bold text-pink-300">{tweets.length}</span>
            <span className="text-gray-300">Tweet</span>
          </div>
        </div>

        {/* Takip/Takip Bırak Butonu */}
        {!isOwnProfile && state.token && (
          <div className="flex justify-center mt-6 relative z-10">
            <FollowButton
              isFollowing={isFollowing}
              onToggle={handleFollowToggle}
              isLoading={loadingFollow}
            />
          </div>
        )}
      </div>

      {error && (
        <p className="bg-red-600 bg-opacity-80 text-white p-3 rounded-lg mb-6 text-center shadow-lg animate-fadeIn">
          {error}
        </p>
      )}

      {/* Sadece kendi profilimizdeysek tweet atma alanı */}
      {isOwnProfile && (
        <div className="bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-xl p-6 mb-8 shadow-lg border border-gray-700/50 transform hover:scale-[1.005] transition-transform duration-300 ease-in-out">
          <h2 className="text-xl font-semibold text-white mb-4">Yeni Tweet Oluştur</h2>
          <form onSubmit={handlePostTweet}>
            <textarea
              className="input-field w-full p-4 h-28 resize-none focus:ring-blue-500 rounded-lg text-lg"
              placeholder="Ne düşünüyorsun?"
              value={newTweetContent}
              onChange={(e) => setNewTweetContent(e.target.value)}
              maxLength={280}
              disabled={isPostingTweet}
            ></textarea>
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="btn-primary py-2.5 px-6 text-base"
                disabled={isPostingTweet}
              >
                {isPostingTweet ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Gönderiliyor...
                  </span>
                ) : (
                  "Tweetle"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Kullanıcının Tweetleri */}
      <h2 className="text-2xl font-bold text-center text-gray-200 mb-6 border-b border-gray-700 pb-3">
        @{userProfile.username}'in Tweetleri
      </h2>
      {tweets.length ? (
        tweets.map((tweet) => (
          <Tweet
            key={tweet._id}
            tweet={tweet}
            currentUserId={state.user?._id}
            onDelete={handleDeleteTweetFromProfile} // Tweet silindiğinde profil listesini güncellemek için
            fetchFeed={fetchData} // Yorumlar güncellendiğinde profil tweetlerini de yenile
          />
        ))
      ) : (
        <p className="text-center text-gray-400 text-lg py-10 bg-gray-800 bg-opacity-60 rounded-lg shadow-inner border border-gray-700/50">
          Bu kullanıcının henüz hiç tweet'i yok.
        </p>
      )}
    </div>
  );
};

export default Profile;