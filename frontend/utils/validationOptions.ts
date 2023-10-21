export const validationAuthForm = {
	fullName: {
		required: 'Введите имя',
		minLength: { value: 3, message: 'Имя должно содержать минимум 3 символа' }
	},
	email: { required: 'Введите email' },
	password: {
		required: 'Введите пароль',
		minLength: { value: 5, message: 'Пароль должен содержать минимум 5 символов' }
	}
};

export const validationPostForm = {
	title: {
		required: 'Пост должен содержать заголовок',
		minLength: { value: 10, message: 'Заголовок должен содержать минимум 10 символов' }
	},
	tags: {
		pattern: {
			value: /^[A-Za-zА-Яа-я,\s]+$/i,
			message: 'Неверный формат тэгов'
		}
	}
};