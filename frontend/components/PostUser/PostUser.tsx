import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../Button/Button';
import styles from './PostUser.module.scss';
import { PostUserProps } from './PostUser.props';
import Moment from 'react-moment';
import EditIcon from '@/public/icons/editPost.svg';
import DeleteIcon from '@/public/icons/deletePost.svg';
import ViewsCountIcon from '@/public/icons/viewsCount.svg';
import { useRouter } from 'next/router';
import axios from '@/utils/axios';
import { parseCookies } from 'nookies';
//=========================================================================================================================

// Компонент блока поста на странице постов пользователя
export const PostUser = ({ imageUrl, title, id, date, tags, viewsCount, ...props }: PostUserProps): JSX.Element => {
	const router = useRouter();
	const cookies = parseCookies();

	const onClickRemovePost = async () => {
		if (window.confirm('Вы действительно хотите удалить статью?')) {
			const { data } = await axios.delete(`/posts/${id}`, {
				headers: { Authorization: cookies.token ? cookies.token : '' }
			});
			data && router.reload();
		}
	};

	const onClickEditPost = () => {
		router.push({
			pathname: '/posts/add-post',
			query: { edit: `${id}` },
		});
	};

	return (
		<article className={styles.article} {...props}>
			{imageUrl
				? <div className={styles.image}>
					<Image
						src={`${process.env.NEXT_PUBLIC_SERVER_URL}${imageUrl}`}
						priority={true}
						alt='picture'
						fill
						sizes='(max-width: 900px) 600px'
					/>
				</div>
				: <div className={styles.logo}>HEXFAIR Blog</div>}
			<div className={styles.content}>
				<h2 className={styles.title} tabIndex={0}>{title}</h2>
				<div className={styles.topLine}>
					<div className={styles.date}>
						<span tabIndex={0}><Moment format="DD.MM.YYYY">{date}</Moment></span>
						<span tabIndex={0}><ViewsCountIcon />{viewsCount}</span>
					</div>
					<button tabIndex={0} onClick={onClickEditPost} className={styles.edit}><EditIcon /></button>
					<button tabIndex={0} onClick={onClickRemovePost} className={styles.remove}><DeleteIcon /></button>
				</div>
				<div className={styles.bottomLine}>
					<div className={styles.tags}>
						{tags && tags.map(obj =>
							<Link href={`/search?tags=${obj}`} key={obj}>
								<span className={styles.tag}>#{obj}</span>
							</Link>)}
					</div>
					<div className={styles.bottom}>
						<Link href={`/posts/${id}`}>
							<Button>Читать далее</Button>
						</Link>
					</div>
				</div>
			</div>
		</article >
	);
};