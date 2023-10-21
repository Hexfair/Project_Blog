import PostModel from '../models/Post.js';
import CommentModel from '../models/Comment.js';
//=========================================================================================================================

// Получение всех постов
export const getAll = async (req, res) => {
	try {
		const posts = await PostModel
			.find()
			.sort('-createdAt')
			.populate('author', '_id fullName avatarUrl')
			.exec();

		res.json(posts);

	} catch (err) {
		console.log(err);
		res.status(400).json({ message: 'Ошибка при получении статей' });
	}
};

// Получить один пост
export const getOne = async (req, res) => {
	try {
		const postId = req.params.id;
		const postData = await PostModel.findOneAndUpdate(
			{ _id: postId, },
			{ $inc: { viewsCount: 1 }, },
			{ returnDocument: 'after', })
			.populate('author', '_id fullName avatarUrl')

		if (!postData) {
			return res.status(500).json({ message: 'Не удалось найти статью' });
		};

		res.json(postData);

	} catch (err) {
		console.log(err);
		res.status(400).json({ message: 'Ошибка при получении статьи' });
	}
};

// Получить посты пользователя
export const getUserPosts = async (req, res) => {
	try {
		const userId = req.userId;

		const posts = await PostModel
			.find({ author: { _id: userId } })
			.sort('-createdAt')
			.populate('author', '_id fullName')
			.exec();

		res.json(posts);

	} catch (err) {
		console.log(err);
		res.status(400).json({ message: 'Ошибка при получении статей пользователя' });
	}
};

// Создать новый пост
export const create = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.length > 0 && tag.trim()) : [],
			imageUrl: req.body.imageUrl,
			author: req.userId,
		});

		const post = await doc.save();

		res.json(post);

	} catch (err) {
		console.log(err);
		res.status(400).json({ message: 'Ошибка при создании статьи' });
	}
};

// Удалить пост
export const remove = async (req, res) => {
	try {
		const postId = req.params.id;

		const post = await PostModel.findById(postId);

		await Promise.all(post.comments.map(obj => {
			return CommentModel.findByIdAndDelete(obj);
		}));

		await PostModel.findByIdAndDelete(postId);

		res.json({ message: 'Пост и комментарии к нему успешно удалены!' });

	} catch (err) {
		console.log(err);
		res.status(400).json({ message: 'Ошибка при удалении статьи' });
	}
};

// Обновить данные поста
export const update = async (req, res) => {
	try {
		const postId = req.params.id;
		await PostModel.updateOne(
			{ _id: postId, },
			{
				title: req.body.title,
				text: req.body.text,
				imageUrl: req.body.imageUrl,
				author: req.userId,
				tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.length > 0 && tag.trim()) : [],
			},
		)
		res.json({ message: 'Статья успешно обновлена!' });
	} catch (err) {
		console.log(err);
		res.status(400).json({ message: 'Ошибка при обновлении статьи' });
	}
}

// Поиск постов по ключевым словам или тегам
export const searchPosts = async (req, res) => {
	try {
		if (!req.query) {
			return res.json({ message: 'Ошибка в параметрах поиска' });
		}

		const searchKey = Object.keys(req.query)[0];
		const searchValue = Object.values(req.query)[0];

		const regexValue = new RegExp(searchValue, 'i');
		const posts = await PostModel
			.find({ [searchKey]: { $regex: regexValue } })
			.sort('-createdAt')
			.populate('author', '_id fullName avatarUrl')
			.exec();

		res.json(posts);

	} catch (err) {
		console.log(err);
		res.status(400).json({ message: 'Ошибка при поиске статей' });
	}
};