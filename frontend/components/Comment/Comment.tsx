import styles from './Comment.module.scss';
import { CommentProps } from './Comment.props';
import Moment from 'react-moment';
import DeleteIcon from '@/public/icons/deletePost.svg';
import { Avatar } from '@/components';
import { shallowEqual, useSelector } from 'react-redux';
import axios from '@/utils/axios';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { dataUserSelect } from '@/redux/auth.slice';
import { toast } from 'react-toastify';
//=========================================================================================================================

// Компонент комментария. Содержит аватар автора комментария, дату создания и текст.
// Комментарий может быть удален только тем пользователем, который его создал
export const Comment = ({ text, _id, author, createdAt, ...props }: CommentProps): JSX.Element => {
	const dataUser = useSelector(dataUserSelect, shallowEqual);
	const router = useRouter();
	const cookies = parseCookies();

	const onClickRemoveComment = async () => {
		try {
			if (window.confirm('Вы действительно хотите удалить комментарий?')) {
				const { data } = await axios.delete(`/comments/${_id}`, {
					headers: { Authorization: cookies.token ? cookies.token : '' }
				});

				if (!data) {
					toast.error('Ошибка при удалении комментария', { role: 'alert' });
				}

				if (data) {
					toast.success('Комментарий успешно удален!', { role: 'alert' });
					router.reload();
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className={styles.comment} {...props}>
			<div className={styles.content}>
				<div className={styles.topLine}>
					<Avatar tabIndex={0} userName={author?.fullName} userAvatar={author?.avatarUrl} size='small' />
					<span tabIndex={0}><Moment format="DD.MM.YYYY" className={styles.date}>{createdAt}</Moment></span>
				</div>
				<div tabIndex={0} className={styles.text}>{text}</div>
			</div>
			{dataUser?._id === author?._id && <span tabIndex={0} onClick={onClickRemoveComment} className={styles.remove}><DeleteIcon /></span>}
		</div >
	);
};