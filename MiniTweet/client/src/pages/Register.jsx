import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom"; // Link'i import et

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state'i eklendi
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Önceki hataları temizle
    setIsLoading(true); // Yüklemeyi başlat

    try {
      await axios.post("/auth/register", { username, email, password });
      navigate("/login"); // Başarılı kayıtta /login adresine yönlendir
    } catch (err) {
      console.error("Kayıt hatası:", err);
      // Backend'den gelen spesifik hata mesajını göster (eğer varsa)
      setError(err.response?.data?.message || "Kayıt yapılamadı. Kullanıcı adı veya email zaten kullanılıyor olabilir.");
    } finally {
      setIsLoading(false); // Yüklemeyi bitir
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 p-4">
      {/* Arkaplan deseni */}
      <div className="absolute inset-0 bg-pattern-light opacity-5 dark:bg-pattern-dark dark:opacity-10"></div>

      <div className="relative z-10 max-w-md w-full bg-gray-800 bg-opacity-80 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-gray-700 transform transition-transform duration-300 hover:scale-[1.005]">
        <h1 className="text-4xl font-extrabold text-green-400 text-center mb-8 drop-shadow-lg animate-fadeIn">
          MiniTweet'e Kaydol
        </h1>

        {error && (
          <p className="bg-red-600 bg-opacity-80 text-white p-3 rounded-lg mb-6 text-center shadow-lg animate-fadeIn">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">Kullanıcı Adı</label>
            <input
              type="text"
              id="username"
              placeholder="Kullanıcı Adınız"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field text-lg" // Kendi input-field stiliniz
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Adresi</label>
            <input
              type="email"
              id="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field text-lg" // Kendi input-field stiliniz
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Şifre</label>
            <input
              type="password"
              id="password"
              placeholder="Şifreniz"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field text-lg" // Kendi input-field stiliniz
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-3 text-xl bg-green-600 hover:bg-green-700 focus:ring-green-500 transition-all duration-200 ease-in-out"
            disabled={isLoading} // Yüklenirken butonu devre dışı bırak
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Kaydolunuyor...
              </span>
            ) : (
              "Kaydol"
            )}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-md">
          Zaten hesabın var mı?{" "}
          <Link to="/login" className="text-green-400 hover:underline font-semibold transition-colors duration-200">
            Giriş Yap!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;