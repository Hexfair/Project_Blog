import { ChangeUserDataProps } from './ChangeUserData.props';
import styles from './ChangeUserData.module.scss';
import React from 'react';
import { Button } from '../Button/Button';
import { FormField } from '../FormFields/FormField';
import Image from 'next/image';
import { AuthFormData } from '@/interfaces/auth.interface';
import { validationAuthForm } from '@/utils/validationOptions';
import { useAppDispatch } from '@/redux/store';
import { useForm } from 'react-hook-form';
import axios from '@/utils/axios';
import { useRouter } from 'next/router';
import { fetchUpdateData } from '@/redux/auth.slice';
import { toast } from 'react-toastify';
//=========================================================================================================================

// Компонент модульного окна для изменения данных пользователя.
// Можно изменить имя и аватар пользователя
export const ChangeUserData = ({ setIsPopupOpen, ...props }: ChangeUserDataProps): JSX.Element => {
	const dispatch = useAppDispatch();
	const router = useRouter();

	const [fullNameValue, setFullNameValue] = React.useState('');
	const [imageValue, setImageValue] = React.useState<File>();

	const inputFileRef = React.useRef<HTMLInputElement | null>(null);

	const { register, handleSubmit, formState: { errors } } = useForm<AuthFormData>({
		defaultValues: { fullName: '', avatarUrl: '' },
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

	const onSubmit = async (values: AuthFormData) => {
		try {
			const formData = new FormData();
			if (imageValue) {
				formData.append('image', imageValue);
				const { data: avatarUrl } = await axios.post('/upload', formData);
				values.avatarUrl = avatarUrl.url;
			}
			const response = await dispatch(fetchUpdateData(values));

			if (response.meta.requestStatus === 'rejected') {
				toast.error(response.payload?.toString(), { role: 'alert' });
			}

			if (response.meta.requestStatus === 'fulfilled') {
				toast.success('Данные успешно обновлены!', { role: 'alert' });
				setIsPopupOpen(false);
				router.push('/');
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className={styles.popup} {...props}>
			<div className={styles.formBox}>
				<h2 tabIndex={0} className={styles.title}>Обновление данных аккаунта</h2>
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
				</div>
				<form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
					<FormField
						name='fullName'
						type='text'
						label='Введите имя'
						formData={fullNameValue}
						setFormData={setFullNameValue}
						validationSchema={validationAuthForm.fullName}
						register={register}
						errors={errors}
					/>
					<Button tabIndex={0} type='submit' color='aqua'>Обновить данные</Button>
					<button className={styles.link} onClick={() => setIsPopupOpen(false)}>Отмена</button>
				</form>
			</div >
		</div>
	);
};