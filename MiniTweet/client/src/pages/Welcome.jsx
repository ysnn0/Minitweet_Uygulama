import React from "react";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="welcome-container">
      <h1>MiniTweet'e Hoş Geldiniz!</h1>
      <p>Hesabınıza giriş yapabilir veya hemen kaydolabilirsiniz.</p>
      <div className="flex flex-col gap-4">
        <Link to="/login" className="welcome-button">
          Giriş Yap
        </Link>
        <Link to="/register" className="welcome-button">
          Kayıt Ol
        </Link>
      </div>
    </div>
  );
};

export default Welcome;
