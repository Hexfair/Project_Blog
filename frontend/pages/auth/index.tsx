import React from 'react';
import styles from '@/styles/AuthPage.module.scss';
import { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { fetchLoginData } from '@/redux/auth.slice';
import { useAppDispatch } from '@/redux/store';
import { useRouter } from 'next/router';
import { validationAuthForm } from '@/utils/validationOptions';
import axios from '@/utils/axios';
import Image from 'next/image';
import { AuthFormData } from '@/interfaces/auth.interface';
import { Button, FormField } from '@/components';
import { toast } from 'react-toastify';
import { isAxiosError } from 'axios';
//=========================================================================================================================
type TypeAuthForm = 'login' | 'register';
//=========================================================================================================================

// Страница авторизации/регистрации пользователя
const AuthPage: NextPage = () => {
	const dispatch = useAppDispatch();
	const router = useRouter();

	const [typeForm, setTypeForm] = React.useState<TypeAuthForm>('login');
	const [fullNameValue, setFullNameValue] = React.useState('');
	const [emailValue, setEmailValue] = React.useState('');
	const [passwordValue, setPasswordValue] = React.useState('');
	const [imageValue, setImageValue] = React.useState<File>();

	const inputFileRef = React.useRef<HTMLInputElement | null>(null);

	const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<AuthFormData>({
		defaultValues: { fullName: '', email: '', password: '', avatarUrl: '' },
		mode: "onChange",
	});

	const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			setImageValue(event.target.files[0]);
		}
	};

	const removeImage = () => {
		setImageValue(undefined as unknown as File);
	};

	const onChangeTypeForm = () => {
		typeForm === 'register' ? setTypeForm('login') : setTypeForm('register');
	};

	const onSubmit = async (values: AuthFormData) => {
		try {
			if (imageValue) {
				const formData = new FormData();
				formData.append('image', imageValue);
				const { data: avatarUrl } = await axios.post('/upload', formData);
				values.avatarUrl = avatarUrl.url;
			}

			if (typeForm === 'login') {
				const response = await dispatch(fetchLoginData(values));

				if (response.meta.requestStatus === 'rejected') {
					toast.error(response.payload?.toString(), { role: 'alert' });
				}

				if (response.meta.requestStatus === 'fulfilled') {
					toast.success('Вы успешно авторизовались!', { role: 'alert' });
					router.push('/');
				}
			}

			if (typeForm === 'register') {
				try {
					const response = await axios.post('/auth/register', values);
					toast.info(response.data.message, {
						autoClose: false,
						closeOnClick: true,
						hideProgressBar: true,
						role: 'alert',
					});
				} catch (error) {
					if (isAxiosError(error)) {
						toast.error(error.response?.data.message, { role: 'alert' });
					}
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className={styles.authPage}>
			<div className={styles.formBox}>
				<h2 tabIndex={0} className={styles.title}>{typeForm === 'register' ? 'Регистрация аккаунта' : 'Вход в аккаунт'}</h2>
				{typeForm === 'register' &&
					<div className={styles.imageBox}>
						<div className={styles.image}>
							{imageValue
								? <Image src={URL.createObjectURL(imageValue)} alt='Avatar-Preview' fill />
								: <Image src='/icons/noAvatar.svg' alt='Avatar-Preview' fill />}
						</div>
						<input type='file' onChange={handleChangeFile} ref={inputFileRef} hidden />
						<div className={styles.button}>
							<Button tabIndex={0} onClick={() => inputFileRef.current?.click()} color='grey'>Выбрать аватар</Button>
							{imageValue && <button className={styles.removeImage} onClick={removeImage}>Удалить</button>}
						</div>
					</div>}
				<form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
					{typeForm === 'register' &&
						<FormField
							name='fullName'
							type='text'
							label='Введите имя'
							formData={fullNameValue}
							setFormData={setFullNameValue}
							validationSchema={validationAuthForm.fullName}
							register={register}
							errors={errors}
						/>}
					<FormField
						name='email'
						type='email'
						label='Введите ваш email'
						formData={emailValue}
						setFormData={setEmailValue}
						validationSchema={validationAuthForm.email}
						register={register}
						errors={errors}
					/>
					<FormField
						name='password'
						type='password'
						label='Введите пароль'
						formData={passwordValue}
						setFormData={setPasswordValue}
						validationSchema={validationAuthForm.password}
						register={register}
						errors={errors}
					/>
					<Button
						tabIndex={0}
						type='submit'
						color='aqua'
						isLoading={isSubmitting}
						disabled={isSubmitting}
						className={typeForm === 'register' ? styles.registerButton : styles.loginButton}
					>{typeForm === 'register' ? 'Зарегистрироваться' : 'Войти'}
					</Button>
					<button
						type='button'
						tabIndex={-1}
						className={styles.link}
						onClick={onChangeTypeForm}
					>{typeForm === 'register' ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}
					</button>
				</form>
			</div >
		</div >
	);
};

export default AuthPage;
