
# MiniTweet

MiniTweet, kullanicilarin tweet atabilecegi, takip edebilecegi ve birbirleriyle etkilesimde bulunabilecegi basit bir sosyal medya uygulamasidir.

---

## 🚀 Kullanilan Teknolojiler

- Frontend: React.js, Tailwind CSS
- Backend: Node.js, Express.js
- Veritabani: MongoDB
- Kimlik Dogrulama: JWT (Json Web Token)

---

## 🛠️ Kurulum ve Calistirma Adimlari

### 1️⃣ Backend (API) Kurulumu

1. Terminali ac ve backend klasorune gir:
   ```bash
   cd backend
   ```
2. Bagimliliklari yukle:
   ```bash
   npm install
   ```
3. `.env` dosyasi olustur ve asagidaki gibi doldur:
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/minitweet
   JWT_SECRET=seninGizliAnahtarin
   ```
4. Sunucuyu baslat:
   ```bash
   npm start
   ```
   Bu komut backend sunucusunu calistiracaktir (Varsayilan: http://localhost:5000).

---

### 2️⃣ Frontend Kurulumu

1. Terminalde frontend klasorune gir:
   ```bash
   cd frontend
   ```
2. Bagimliliklari yukle:
   ```bash
   npm install
   ```
3. Frontend sunucusunu calistir:
   ```bash
   npm run dev
   ```
   Bu komut frontend uygulamasini calistiracaktir (Varsayilan: http://localhost:5173).

---

### 3️⃣ Giris

- Once backend (API) calistirilmali.
- Ardindan frontend calistirilmali.
- Tarayicidan http://localhost:5173 adresine girerek uygulamayi kullanabilirsin.

---

## 👤 Gelistiriciler

- **Yasin Dağ** — 19240001413
- **Ömer Demirel** — 1924001410

---


