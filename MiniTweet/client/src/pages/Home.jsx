import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "../api/axios";
// import Tweet bileşenini import etmeyi unutmayın!
import Tweet from "../components/Tweet"; // components klasöründe ise yolunu kontrol edin

const Home = () => {
  const { state } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState("");
  const [newTweetContent, setNewTweetContent] = useState(""); // Yeni tweet içeriği için state
  const [isPostingTweet, setIsPostingTweet] = useState(false); // Yeni tweet gönderimi loading state'i

  useEffect(() => {
    if (state.token) {
      fetchFeed();
    } else {
      navigate("/", { replace: true });
    }
  }, [state.token, navigate]);

  const fetchFeed = async () => {
    try {
      const res = await axios.get("/tweets/feed", {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      setTweets(res.data);
      setError(""); // Hata mesajını temizle
    } catch (err) {
      console.error("Feed çekme hatası:", err);
      setError("Tweetler yüklenemedi. Lütfen daha sonra tekrar deneyin.");
    }
  };

  const handlePostTweet = async (e) => {
    e.preventDefault();
    if (!newTweetContent.trim()) {
      setError("Tweet içeriği boş olamaz.");
      return;
    }
    setIsPostingTweet(true);
    setError(""); // Hata mesajını temizle
    try {
      await axios.post("/tweets", { content: newTweetContent }, {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      setNewTweetContent(""); // Tweet gönderildikten sonra inputu temizle
      fetchFeed(); // Tweetleri yeniden yükle
    } catch (err) {
      console.error("Tweet gönderme hatası:", err);
      setError("Tweet gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsPostingTweet(false);
    }
  };

  const handleDeleteTweetFromFeed = (deletedTweetId) => {
    setTweets((prevTweets) =>
      prevTweets.filter((tweet) => tweet._id !== deletedTweetId)
    );
    // Veya sadece fetchFeed() çağırabilirsiniz, bu da çalışır ancak anlık güncelleme için filter daha iyi.
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 max-w-3xl">
      {/* Başlık */}
      <h1 className="text-3xl font-extrabold text-center text-blue-400 mb-8 animate-fadeIn">
        Ana Sayfa
      </h1>

      {error && (
        <p className="bg-red-600 bg-opacity-80 text-white p-3 rounded-lg mb-6 text-center shadow-lg animate-fadeIn">
          {error}
        </p>
      )}

      {/* Yeni Tweet Oluşturma Alanı */}
      <div className="bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-xl p-6 mb-8 shadow-lg border border-gray-700/50 transform hover:scale-[1.005] transition-transform duration-300 ease-in-out">
        <h2 className="text-xl font-semibold text-white mb-4">Yeni Tweet Oluştur</h2>
        <form onSubmit={handlePostTweet}>
          <textarea
            className="input-field w-full p-4 h-28 resize-none focus:ring-blue-500 rounded-lg text-lg"
            placeholder="Ne düşünüyorsun?"
            value={newTweetContent}
            onChange={(e) => setNewTweetContent(e.target.value)}
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

      {/* Tweet Akışı */}
      <h2 className="text-2xl font-bold text-center text-gray-200 mb-6 border-b border-gray-700 pb-3">
        Son Tweetler
      </h2>
      {tweets.length ? (
        tweets.map((tweet) => (
          <Tweet
            key={tweet._id}
            tweet={tweet}
            currentUserId={state.user?._id}
            onDelete={handleDeleteTweetFromFeed} // Tweet silindiğinde feed'i güncellemek için
            // Yorum ekleme/silme fonksiyonları da buradan Tweet bileşenine geçirilecek
            // Bu kısım Tweet.jsx güncellendikten sonra tekrar kontrol edilecek
            fetchFeed={fetchFeed} // Yorum eklendikten/silindikten sonra tweetleri tekrar çekmek için
          />
        ))
      ) : (
        <p className="text-center text-gray-400 text-lg py-10 bg-gray-800 bg-opacity-60 rounded-lg shadow-inner border border-gray-700/50">
          Henüz hiç tweet yok. Yeni bir tane göndererek ilk adımı atabilirsin!
        </p>
      )}
    </div>
  );
};

export default Home;