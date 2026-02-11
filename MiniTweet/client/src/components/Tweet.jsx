import React, { useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import moment from "moment";

const Tweet = ({ tweet, currentUserId, onDelete, fetchFeed }) => {
  // Tweet'in kendi state'leri
  const [likes, setLikes] = useState(tweet.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(tweet.likes?.includes(currentUserId));
  const [tweetComments, setTweetComments] = useState(tweet.comments || []); // Tweet'in yorumları için state
  const [newCommentText, setNewCommentText] = useState(""); // Yeni yorum inputu için state
  const [showCommentInput, setShowCommentInput] = useState(false); // Yorum kutusu görünürlüğü
  
  // Loading state'leri
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingDeleteTweet, setLoadingDeleteTweet] = useState(false);
  const [loadingCommentPost, setLoadingCommentPost] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null); // Silinen yorumun ID'si

  const handleLike = async () => {
    if (loadingLike) return;
    setLoadingLike(true);
    try {
      await axios.put(`/tweets/${tweet._id}/like`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setIsLiked(!isLiked);
      setLikes(isLiked ? likes - 1 : likes + 1);
    } catch (err) {
      console.error("Beğeni hatası:", err);
    } finally {
      setLoadingLike(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    setLoadingCommentPost(true);
    try {
      const res = await axios.post(`/tweets/${tweet._id}/comments`, { text: newCommentText }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      // Yeni yorumu doğrudan state'e ekleyerek anlık güncelleme
      setTweetComments((prevComments) => [...prevComments, res.data.comment]);
      setNewCommentText("");
      setShowCommentInput(false);
      // Eğer ana sayfada da güncellenmesi gerekiyorsa, fetchFeed'i çağırabilirsiniz (prop olarak geldi)
      if (fetchFeed) fetchFeed(); 
    } catch (err) {
      console.error("Yorum ekleme hatası:", err);
    } finally {
      setLoadingCommentPost(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Bu yorumu silmek istediğine emin misin?")) return;
    setDeletingCommentId(commentId); // Silinen yorumu işaretle
    try {
      await axios.delete(`/tweets/${tweet._id}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      // Yorumu state'ten kaldırarak anlık güncelleme
      setTweetComments((prevComments) => prevComments.filter((c) => c._id !== commentId));
      // Ana sayfayı da güncelleyebiliriz
      if (fetchFeed) fetchFeed();
    } catch (err) {
      console.error("Yorum silme hatası:", err);
    } finally {
      setDeletingCommentId(null);
    }
  };

  const handleDeleteTweet = async () => {
    if (!window.confirm("Bu tweeti silmek istediğine emin misin?")) return;
    setLoadingDeleteTweet(true);
    try {
      await axios.delete(`/tweets/${tweet._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (onDelete) onDelete(tweet._id); // Home'daki listeden silmek için prop'u çağır
    } catch (err) {
      console.error("Tweet silme hatası:", err);
    } finally {
      setLoadingDeleteTweet(false);
    }
  };

  const canDeleteTweet = tweet.userId === currentUserId;
  const renderCommentAuthor = (comment) => {
    // Yorum yazarının bilgisi bazen sadece ID olarak gelebilir, bu kontrolü yapalım
    if (comment.userId && typeof comment.userId === 'object' && comment.userId.username) {
        return comment.userId.username;
    }
    // Eğer sadece ID ise veya yazar bilgisi yoksa 'Bilinmeyen Kullanıcı' göster
    return 'Bilinmeyen Kullanıcı';
};


  return (
    <div className="tweet-card relative group flex flex-col justify-between p-6 mb-4">
      {/* Tweet İçeriği */}
      <p className="text-xl text-gray-100 mb-4 leading-relaxed tracking-wide">
        {tweet.content}
      </p>

      {/* Kullanıcı Bilgisi ve Zaman Damgası */}
      <div className="flex items-center justify-between text-sm text-gray-400 border-t border-gray-700 pt-3 mt-auto mb-3">
        <Link 
          to={`/profile/${tweet.userId}`} 
          className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-semibold cursor-pointer flex items-center gap-2"
        >
          <span className="text-lg">@{tweet.username}</span>
        </Link>
        {tweet.createdAt && (
          <span className="text-xs text-gray-500">
            {moment(tweet.createdAt).fromNow()}
          </span>
        )}
      </div>

      {/* Butonlar (Like, Comment, Delete Tweet) */}
      <div className="flex gap-4 border-t border-gray-700 pt-3">
        {/* Like Butonu */}
        <button
          onClick={handleLike}
          disabled={loadingLike}
          className={`
            btn-primary py-2 px-4 text-sm md:text-base rounded-full flex items-center gap-2
            ${isLiked 
              ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            }
            ${loadingLike ? 'opacity-70 cursor-not-allowed animate-pulse' : ''}
          `}
        >
          {loadingLike ? (
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            isLiked ? (
              <span className="text-red-300">❤️</span>
            ) : (
              <span className="text-blue-300">👍</span>
            )
          )}
          <span>{likes}</span>
        </button>

        {/* Yorum Butonu */}
        <button
          onClick={() => setShowCommentInput(!showCommentInput)}
          className="btn-primary py-2 px-4 text-sm md:text-base rounded-full flex items-center gap-2 bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
          title="Yorum Yap"
        >
          💬 Yorum Yap
        </button>

        {/* Tweet Silme Butonu (Sadece yetkiliyse) */}
        {canDeleteTweet && (
          <button
            className={`
              btn-primary bg-red-700 hover:bg-red-800 focus:ring-red-600
              py-2 px-4 text-sm md:text-base rounded-full flex items-center gap-2
              ${loadingDeleteTweet ? 'opacity-70 cursor-not-allowed animate-pulse' : ''}
            `}
            onClick={handleDeleteTweet}
            disabled={loadingDeleteTweet}
            title="Tweeti Sil"
          >
            {loadingDeleteTweet ? (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <span className="text-white">🗑️</span>
            )}
            Sil
          </button>
        )}
      </div>

      {/* Yorum Yapma Kutusu */}
      {showCommentInput && (
        <form onSubmit={handleCommentSubmit} className="mt-4 flex gap-3 animate-fadeIn">
          <input
            type="text"
            name="comment"
            placeholder="Yorumunu yaz..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            className="input-field flex-1 text-base py-2" // input-field sınıfını kullan
            disabled={loadingCommentPost}
          />
          <button
            type="submit"
            className="btn-primary bg-green-600 hover:bg-green-700 focus:ring-green-500 py-2 px-5 text-base"
            disabled={loadingCommentPost}
          >
            {loadingCommentPost ? '...' : 'Ekle'}
          </button>
        </form>
      )}

      {/* Yorumlar Alanı */}
      {tweetComments.length > 0 && (
        <div className="mt-6 border-t border-gray-700 pt-4">
          <h4 className="text-md font-semibold text-gray-300 mb-3">Yorumlar:</h4>
          {tweetComments.map((comment) => (
            <div
              key={comment._id}
              className={`
                flex items-center justify-between gap-2 p-3 mb-2 rounded-lg bg-gray-700/50 text-gray-200 
                border border-gray-600/50 shadow-sm
                ${deletingCommentId === comment._id ? 'opacity-50' : ''} transition-opacity duration-300
              `}
            >
              <p className="flex-1">
                💬 <span className="font-bold text-blue-300">{renderCommentAuthor(comment)}</span>: {comment.text}
              </p>
              {(comment.userId?._id?.toString() === currentUserId?.toString() || comment.userId?.toString() === currentUserId?.toString()) && (
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="text-red-400 hover:text-red-500 transition-colors duration-200"
                  title="Yorumu Sil"
                  disabled={deletingCommentId === comment._id}
                >
                  {deletingCommentId === comment._id ? (
                    <svg className="animate-spin h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    '🗑️'
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tweet;