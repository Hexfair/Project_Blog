import nodemailer from 'nodemailer';
//=========================================================================================================================

// Отправка сслылки на email на активацию пользователя
export const sendLinkMail = async (email, activationLink) => {

	let transporter = nodemailer.createTransport({
		host: 'smtp.mail.ru',
		port: 465,
		secure: true,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		}
	});

	const info = await transporter.sendMail({
		from: process.env.SMTP_FROM,
		to: email,
		subject: 'Активация аккаунта HEXFAIR-Blog',
		text: '',
		html:
			`<div>
			 	<h3>Спасибо за регистрацию на сайте HEXFAIR-Blog! :)</h3>
				<h1>Для активации аккаунта перейдите по ссылке ниже:</h1>
				<a href="http://localhost:4444/api/auth/activate/${activationLink}">http://localhost:4444/auth/activate/${activationLink}</a>
			 </div>`,
	});

	return info;
};