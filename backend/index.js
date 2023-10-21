import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv'
import checkAuth from './utils/checkAuth.js';
import { PostController } from './controllers/index.js';
import userRoute from './routes/User.js';
import postRoute from './routes/Post.js';
import commentRoute from './routes/Comment.js';
import helmet from 'helmet'; // for production
//=========================================================================================================================
dotenv.config({ path: '.env.local' });
const PORT = process.env.PORT || 4444;

mongoose
	.set('strictQuery', true)
	.connect(process.env.DB_URL)
	.then(() => console.log('Подключено к MongoDB!'))
	.catch((err) => console.log('Ошибка подключения к MongoDB!', err));


/* Middleware */
const app = express();
app.use(express.json());

// app.use(helmet()); - for production
app.use(cors({
	credentials: true,
	origin: process.env.CLIENT_URL
}));
app.use('/api/uploads', express.static('uploads'));

/* Storage */
const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads');
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});
const upload = multer({ storage });


/* Routes */
app.use('/api/auth', userRoute)
app.use('/api/posts', postRoute)
app.use('/api/comments', commentRoute)

app.get('/api/uposts', checkAuth, PostController.getUserPosts);
app.get('/api/search', PostController.searchPosts);

app.post('/api/upload', upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	})
});


app.listen(PORT, (err) => {
	if (err) console.log('Ошибка запуска локального сервера!');
	console.log(`Локальный сервер запущен на порту ${PORT}!`);
});

// Добавить '0.0.0.0' - for production