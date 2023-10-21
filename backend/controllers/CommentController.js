import PostModel from '../models/Post.js';
import CommentModel from '../models/Comment.js';
//=========================================================================================================================

// Получение всех комментарий к конкретному посту
export const getPostComments = async (req, res) => {
	try {
		const post = await PostModel.findById(req.params.id);

		const list = await Promise.all(
			post.comments.map(obj => {
				return CommentModel.findById(obj).populate('author', '_id fullName avatarUrl').exec();
			}),
		);

		res.json(list);
	} catch (error) {
		res.json({ message: 'Что-то пошло не так при получении комментариев' });
	}
}

// Создание нового комментария
export const createComment = async (req, res) => {
	try {
		const { postId, text } = req.body;

		if (!text) {
			return res.json({ message: 'Комментарий не может быть пустым' })
		};

		const newComment = new CommentModel({
			text,
			author: req.userId,
		});

		await newComment.save();

		await PostModel.findByIdAndUpdate(postId, {
			$push: { comments: newComment._id },
		});

		res.json(newComment);
	} catch (error) {
		res.json({ message: 'Что-то пошло не так.' })
	}
}

// Удаление комментария
export const removeComment = async (req, res) => {
	try {
		const commentId = req.params.id;
		await CommentModel.findByIdAndDelete(commentId);

		await PostModel.findOneAndUpdate(
			{ 'comments': { _id: commentId } },
			{ $pull: { 'comments': commentId } },
			{ 'new': true }
		)

		res.json({ message: 'Комментарий успешно удален!' });
	} catch (err) {
		console.log(err);
		res.status(400).json({ message: 'Ошибка при удалении комментария' });
	}
};

