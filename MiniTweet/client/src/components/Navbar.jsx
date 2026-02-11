import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { state, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  if (!state.token) return null;

  return (
    // 'nav-base' sınıfı, index.css'te tanımladığımız genel navbar stillerini ve animasyonları içerir.
    // Ek Tailwind sınıfları (px-6, py-4, justify-between, items-center) ile responsive ve düzenli bir görünüm sağlanır.
    <nav className="nav-base">
      {/* Sol taraf: Linkler */}
      <div className="flex gap-x-8"> {/* Linkler arasında daha fazla boşluk */}
        <Link 
          to="/feed" 
          className="nav-item text-white hover:text-blue-300 transition-colors duration-300"
        >
          Anasayfa
        </Link>
        <Link 
          to={`/profile/${state.user?._id}`} 
          className="nav-item text-white hover:text-blue-300 transition-colors duration-300"
        >
          Profil
        </Link>
        <Link 
          to="/search" 
          className="nav-item text-white hover:text-blue-300 transition-colors duration-300"
        >
          Kullanıcı Ara
        </Link>
      </div>

      {/* Sağ taraf: Çıkış Yap butonu */}
      <div>
        {/* 'btn-primary' sınıfı, index.css'te tanımladığımız şık buton stillerini ve animasyonları içerir. */}
        <button 
          onClick={handleLogout} 
          className="btn-primary py-2 px-6 text-sm" // Buton boyutunu navbara uygun küçült
        >
          Çıkış Yap
        </button>
      </div>
    </nav>
  );
};

export default Navbar;