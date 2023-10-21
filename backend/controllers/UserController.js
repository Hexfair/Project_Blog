import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';
import { sendLinkMail } from '../utils/sendLinkMail.js';
import { v4 as uuidv4 } from 'uuid';
//=========================================================================================================================

// Регистрация нового пользователя
export const register = async (req, res) => {
	try {
		const password = req.body.password;
		const salt = await bcrypt.genSalt(10);
		const passHash = await bcrypt.hash(password, salt);

		const activationLink = uuidv4();

		const doc = new UserModel({
			email: req.body.email,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl,
			passwordHash: passHash,
			activationLink,
		});
		await doc.save();

		await sendLinkMail(req.body.email, activationLink);

		res.json({ message: 'Вы успешно зарегистрировались! Для активации аккаунта пройдите по ссылке в сообщении на Вашей электронной почте' });

	} catch (err) {
		console.log(err);
		res.status(400).json({ message: 'Ошибка при регистрации пользователя' });
	}
};

// Процедура активации нового пользователя через ссылку на email
export const activate = async (req, res, next) => {
	try {
		const activationLink = req.params.link;

		const user = await UserModel.findOneAndUpdate(
			{ activationLink, },
			{ isActivated: true, },
		)

		if (!user) {
			res.status(400).json({ message: 'Некорректная ссылка активации' });
		}

		const token = jwt.sign(
			{ _id: user._id },
			process.env.JWT_ACCESS_SECRET,
			{ expiresIn: '15d' }
		);

		res.cookie('token', token)
		return res.redirect(process.env.CLIENT_URL)

	} catch (err) {
		console.log(err);
		res.status(400).json({ message: 'Ошибка при активации аккаунта' });
	}
};

// Авторизация пользователя
export const login = async (req, res) => {
	try {
		const user = await UserModel.findOne({ email: req.body.email });

		if (!user) {
			return res.status(404).json({ message: 'Пользователь не найден' });
		};

		if (!user.isActivated) {
			return res.status(404).json({ message: 'Пользователь не найден. Возможно вы не активировали аккаунт через электронную почту' });
		};

		const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

		if (!isValidPass) {
			return res.status(400).json({ message: 'Неверный логин или пароль' });
		};

		const token = jwt.sign(
			{ _id: user._id },
			process.env.JWT_ACCESS_SECRET,
			{ expiresIn: '15d' }
		);

		const responseUserData = {
			_id: user._doc._id,
			fullName: user._doc.fullName,
			email: user._doc.email,
			avatarUrl: user._doc.avatarUrl,
		}

		res.json({ ...responseUserData, token });

	} catch (err) {
		console.log(err);
		res.status(400).json({ message: 'Ошибка при авторизации' });
	}
};


// Получение данных пользователя
export const getMe = async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId);

		if (!user) {
			return res.status(404).json({ message: 'Такого пользователя нет' });
		};

		const responseUserData = {
			_id: user._doc._id,
			fullName: user._doc.fullName,
			email: user._doc.email,
			avatarUrl: user._doc.avatarUrl,
		}

		res.json(responseUserData);

	} catch (err) {
		console.log(err);
		res.status(400).json({ message: 'Ошибка при получении данных' });
	}
};

// Обновление данных ползователя
export const update = async (req, res) => {
	try {
		await UserModel.updateOne(
			{ _id: req.userId, },
			{
				fullName: req.body.fullName,
				avatarUrl: req.body.avatarUrl,
			},
		)
		res.json({ message: 'Данные пользователя успешны обновлены!' });

	} catch (err) {
		console.log(err);
		res.status(400).json({ message: 'Ошибка при обновлении данных пользователя' });
	}
};