import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import tweetRoutes from './routes/tweets.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tweets', tweetRoutes);

// DB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('✅ MongoDB bağlantısı başarılı');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Sunucu ${process.env.PORT || 5000} portunda çalışıyor`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB bağlantı hatası:', err);
  });
