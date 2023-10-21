import jwt from 'jsonwebtoken';
//=========================================================================================================================

// Проверка прав доступа пользователя
export default (req, res, next) => {
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

	if (token) {
		try {
			const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
			req.userId = decoded._id;
			next();
		} catch (err) {
			return res.status(403).json({ message: 'Ошибка при получении доступа' })
		}
	} else {
		return res.status(403).json({ message: 'Нет доступа' })
	}
};