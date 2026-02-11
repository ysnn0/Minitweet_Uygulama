# 🐦 MiniTweet

> Sosyal ağ deneyimini keşfedin! Tweet atın, takip edin ve topluluğunuzla bağlantı kurun.

MiniTweet, kullanıcıların tweet atabildiği, diğer kullanıcıları takip edebildiği ve birbirleriyle etkileşim kurabileceği modern bir sosyal medya uygulamasıdır.

## ✨ Özellikler

- ✅ Tweet oluşturma ve paylaşma
- ✅ Kullanıcı takip sistemi
- ✅ Gerçek zamanlı etkileşimler (Beğeni, Retweet, Yorum)
- ✅ Kullanıcı profili ve ayarları
- ✅ JWT tabanlı güvenli kimlik doğrulama
- ✅ Responsive tasarım

---

## 🚀 Teknoloji Stack'i

| Katman | Teknolojiler |
|--------|-------------|
| **Frontend** | React.js, Tailwind CSS, Vite |
| **Backend** | Node.js, Express.js |
| **Veritabanı** | MongoDB |
| **Kimlik Doğrulama** | JWT (JSON Web Token) |

---

## 📋 Ön Koşullar

Başlamadan önce bilgisayarınızda şunların yüklü olması gerekir:

- **Node.js** (v14 veya üzeri)
- **npm** veya **yarn**
- **MongoDB** (local veya MongoDB Atlas hesabı)

---

## 🛠️ Kurulum Adımları

### 1️⃣ Projeyi Klonlayın

```bash
git clone https://github.com/ysnn0/Minitweet_Uygulama.git
cd Minitweet_Uygulama
```

### 2️⃣ Backend Kurulumu

```bash
# Backend dizinine gidin
cd backend

# Bağımlılıkları yükleyin
npm install

# .env dosyası oluşturun
cp .env.example .env
```

**.env dosyasını düzenleyin:**
```env
# MongoDB bağlantı URL'si
MONGO_URI=mongodb+srv://<kullanıcı_adı>:<şifre>@<cluster-url>/minitweet

# JWT gizli anahtarı (güvenli bir anahtar oluşturun)
JWT_SECRET=guclu_gizli_anahtarinizi_buraya_yazin

# Port (opsiyonel)
PORT=5000

# Node ortamı
NODE_ENV=development
```

**Backend'i başlatın:**
```bash
npm start
```

✅ Backend, `http://localhost:5000` adresinde çalışacaktır.

---

### 3️⃣ Frontend Kurulumu

Yeni bir terminal penceresi açın:

```bash
# Frontend dizinine gidin
cd frontend

# Bağımlılıkları yükleyin
npm install

# Frontend uygulamasını başlatın
npm run dev
```

✅ Frontend, `http://localhost:5173` adresinde çalışacaktır.

---

## 🎯 Kullanım

1. **Backend'in** çalışıyor olduğundan emin olun (http://localhost:5000)
2. **Frontend'i** başlatın
3. Tarayıcınızda **http://localhost:5173** adresini açın
4. Hesap oluşturun veya giriş yapın
5. Tweet atmaya başlayın! 🚀

---

## 📁 Proje Yapısı

```
Minitweet_Uygulama/
├── backend/
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── middleware/
│   ├── .env
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── hooks/
    │   └── App.jsx
    └── vite.config.js
```

---

## 🔧 Geliştirme

### Kullanışlı npm Komutları

**Backend:**
```bash
# Development modunda çalıştır (nodemon ile)
npm run dev

# Linting kontrol et
npm run lint

# Testleri çalıştır
npm test
```

**Frontend:**
```bash
# Development sunucusu
npm run dev

# Production için build et
npm run build

# Linting kontrol et
npm run lint
```

---

## 🐛 Sorun Giderme

| Sorun | Çözüm |
|-------|-------|
| `MONGO_URI connection failed` | MongoDB bağlantı URL'sini kontrol edin |
| `Port 5000 already in use` | `lsof -i :5000` komutuyla işlemi bulup öldürün veya farklı port kullanın |
| `Frontend uygulaması yüklenmez` | Tarayıcı cache'ini temizleyin, CORS ayarlarını kontrol edin |
| `npm install hatası` | `npm cache clean --force` ve tekrar deneyin |

---

## 📝 API Endpoints (Örnekler)

```
POST   /api/auth/register       - Yeni hesap oluştur
POST   /api/auth/login          - Hesaba giriş yap
GET    /api/tweets              - Tüm tweetleri getir
POST   /api/tweets              - Yeni tweet oluştur
DELETE /api/tweets/:id          - Tweet sil
GET    /api/users/:id           - Kullanıcı profilini getir
POST   /api/users/:id/follow    - Kullanıcı takip et
```

---

## 🚀 Production Dağıtımı

### Backend (Heroku örneği)
```bash
heroku create your-app-name
git push heroku main
```

### Frontend (Netlify/Vercel örneği)
```bash
npm run build
# Netlify/Vercel'e deploy edin
```

---

## 📄 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır.

---

## 👤 Yazar

**ysnn0**
- GitHub: [@ysnn0](https://github.com/ysnn0)

---

## 🤝 Katkıda Bulunma

Katkılarınız hoşlanır! Lütfen:

1. Bu repoyu fork'layın
2. Yeni bir branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'i push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın

---

## ❓ Sık Sorulan Sorular

**Q: Projemi geliştirmek istiyorum, nasıl başlarım?**
A: Yukarıdaki "Katkıda Bulunma" bölümünü takip edin.

**Q: MongoDB yerine başka bir veritabanı kullanabilir miyim?**
A: Evet, fakat backend kodu uygun şekilde değiştirilmesi gerekir.

**Q: Uygulamayı production'a almak için neler yapmam gerekir?**
A: Güvenlik ayarlarını kontrol edin, ortam değişkenlerini ayarlayın, HTTPS kullanın.

---

## 📞 İletişim

Sorularınız varsa, lütfen GitHub Issues üzerinden iletişime geçin.

---

**Başarılı geliştirmeler! 🚀**