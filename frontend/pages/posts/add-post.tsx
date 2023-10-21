import React from 'react';
import styles from '@/styles/AddPost.module.scss';
import 'easymde/dist/easymde.min.css';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import axios from '@/utils/axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { shallowEqual, useSelector } from 'react-redux';
import { useAppDispatch, wrapper } from '@/redux/store';
import { PostItem, PostFormData } from '@/interfaces/post.interface';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import nookies, { parseCookies } from 'nookies';
import { dataUserSelect, fetchGetMe } from '@/redux/auth.slice';
import { validationPostForm } from '@/utils/validationOptions';
import { Button, FormField } from '@/components';
import { toast } from 'react-toastify';
import { uploadFile } from '@uploadcare/upload-client';
import EasyMDE from 'easymde';
const SimpleMdeEditor = dynamic(() => import('react-simplemde-editor'), { ssr: false });
//=========================================================================================================================
export interface AddPostProps extends Record<string, unknown> {
	postData: PostItem
}
interface ImageUploadType {
	(image: File,
		onSuccess: (url: string) => void,
		onError: (errorMessage: string) => void): void
}
//=========================================================================================================================

// Страница добавления/редактирования поста
const AddPostPage: NextPage<AddPostProps> = ({ postData }) => {
	const oldTitle = postData?.title || '';
	const oldText = postData?.text || '';
	const oldTags = postData?.tags.join(',') || '';
	const oldImageUrl = postData?.imageUrl || '';

	const router = useRouter();
	const postId = router.query.edit;
	const dataUser = useSelector(dataUserSelect, shallowEqual);
	const cookies = parseCookies();
	const dispatch = useAppDispatch();

	const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<PostFormData>({
		defaultValues: { title: oldTitle, text: oldText, tags: oldTags },
		mode: 'onChange'
	});

	const [imageValue, setImageValue] = React.useState<File>();
	const [titleValue, setTitleValue] = React.useState<string>(oldTitle);
	const [textValue, setTextValue] = React.useState<string>(oldText);
	const [tagsValue, setTagsValue] = React.useState<string>(oldTags);
	const inputFileRef = React.useRef<HTMLInputElement | null>(null);

	const onChangeEditor = React.useCallback((value: string) => {
		setTextValue(value);
	}, []);

	const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.target.files && setImageValue(event.target.files[0]);
	};

	const removeImage = () => {
		setImageValue(undefined as unknown as File);
	};

	const onSubmit = async (values: PostFormData) => {
		try {
			if (imageValue) {
				const formData = new FormData();
				formData.append('image', imageValue);
				const { data: imageUrl } = await axios.post('/upload', formData);
				values.imageUrl = imageUrl.url;
			}

			if (textValue) {
				values.text = textValue;
			}

			const { data } = postId
				? await axios.patch(`/posts/${postId}`, values, {
					headers: { Authorization: cookies.token ? cookies.token : '' }
				})
				: await axios.post('/posts', values, {
					headers: { Authorization: cookies.token ? cookies.token : '' }
				});

			if (!data) {
				toast.error(`Произошла ошибка при ${postId ? 'обновлении' : 'создании'} поста`, { role: 'alert' });
			} else {
				toast.success(`Пост успешно ${postId ? 'обновлен' : 'создан'}!`, { role: 'alert' });
				router.push(`/`);
			}

		} catch (error) {
			toast.error('Что-то пошло не так. Возможно вы не авторизованы :(', { role: 'alert' });
			console.log(error);
			router.push(`/`);
		}
	};

	const imageUpload: ImageUploadType = async (image, onSuccess, onError) => {
		try {
			const result = await uploadFile(image, {
				publicKey: '738ce6680ca9c63da757',
				store: 'auto',
				metadata: {
					subsystem: 'uploader',
				}
			});
			result.cdnUrl && onSuccess(result.cdnUrl);
		} catch (error) {
			onError('Не удалось загрузить файл :(');
		}
	};

	const newOptions = React.useMemo(() => {
		return {
			spellChecker: false,
			showIcons: ['strikethrough', 'heading-bigger', 'heading-smaller', 'table', 'code', 'upload-image'],
			uploadImage: true,
			hideIcons: ['guide', 'heading'],
			imageUploadFunction: imageUpload,
		} as EasyMDE.Options;
	}, []);



	if (!dataUser && cookies.token) {
		dispatch(fetchGetMe(cookies.token));
	}

	return (
		<div className={styles.addPost}>
			<div className={styles.imageBox}>
				{imageValue
					? <div className={styles.image}> <Image src={URL.createObjectURL(imageValue)} alt='Image-Preview' fill /></div>
					: oldImageUrl
						? <div className={styles.image}> <Image src={`${process.env.NEXT_PUBLIC_SERVER_URL}${oldImageUrl}`} alt='Image-Preview' fill /></div>
						: null}
				<input type='file' onChange={handleChangeFile} ref={inputFileRef} hidden />
				<div className={styles.button}>
					<Button tabIndex={0} onClick={() => inputFileRef.current?.click()} color='grey'>Выбрать картинку</Button>
					{imageValue && <button className={styles.removeImage} onClick={removeImage}>Удалить</button>}
				</div>
			</div>
			<div className={styles.formBox}>
				<form onSubmit={handleSubmit(onSubmit)} autoComplete='off' className={styles.form}>
					<FormField
						name='title'
						type='text'
						label='Заголовок поста'
						formData={titleValue}
						setFormData={setTitleValue}
						validationSchema={validationPostForm.title}
						register={register}
						errors={errors}
					/>
					<FormField
						name='tags'
						type='text'
						label='Тэги'
						formData={tagsValue}
						setFormData={setTagsValue}
						validationSchema={validationPostForm.tags}
						register={register}
						errors={errors}
					/>
					<p className={styles.editorNote}>* редактор поддерживает язык разметки Markdown</p>
					<SimpleMdeEditor
						value={textValue}
						onChange={onChangeEditor}
						placeholder='Текст статьи'
						options={newOptions}
						extraKeys={{ ['Tab']: false }}
					/>
					<Button
						tabIndex={0}
						type='submit'
						color='aqua'
						isLoading={isSubmitting}
						disabled={isSubmitting}
					>{postId ? 'Обновить пост' : 'Создать пост'}
					</Button>
				</form>
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps((store) => async (context: GetServerSidePropsContext) => {
	try {
		const cookies = nookies.get(context);
		const dataUser = store.getState().auth.dataUser;

		if (!context.query.edit) {
			if (!dataUser && !cookies.token) {
				return {
					redirect: { destination: '/', permanent: false, },
				};
			}

			return {
				props: {
					postData: null
				}
			};
		}

		if (!dataUser && !cookies.token) {
			return {
				redirect: { destination: '/', permanent: false, },
			};
		}

		const postId = context.query.edit;
		const { data } = await axios.get<PostItem>(`/posts/${postId}`);

		return {
			props: {
				postData: data
			}
		};
	} catch (error) {
		console.log(error);
	}

	return {
		props: {
			postData: null
		}
	};
});

export default AddPostPage;