import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthContext from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Navbar from "./components/Navbar";
import Welcome from "./pages/Welcome";

const App = () => {
  const { state } = useContext(AuthContext);

  return (
    <Router>
      {/* Navbar sadece kullanıcı giriş yaptıysa göster */}
      {state.token && <Navbar />}
      <Routes>
        {/* Hoş Geldiniz Sayfası */}
        <Route
          path="/"
          element={
            state.token ? <Navigate to="/feed" replace /> : <Welcome />
          }
        />
        {/* Feed Sayfası */}
        <Route
          path="/feed"
          element={
            state.token ? <Home /> : <Navigate to="/" replace />
          }
        />
        {/* Login Sayfası */}
        <Route path="/login" element={<Login />} />
        {/* Register Sayfası */}
        <Route path="/register" element={<Register />} />
        {/* Profil Sayfası */}
        <Route
          path="/profile/:id"
          element={state.token ? <Profile /> : <Navigate to="/login" replace />}
        />
        {/* Kullanıcı Ara */}
        <Route
          path="/search"
          element={state.token ? <Search /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
};

export default App;
