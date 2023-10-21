import React from 'react';
import styles from './CommentsBlock.module.scss';
import { CommentsBlockProps } from './CommentsBlock.props';
import axios from '@/utils/axios';
import { parseCookies } from 'nookies';
import { CommentItem } from '@/interfaces/comment.interface';
import ArrowDownIcon from '@/public/icons/arrowDown.svg';
import { Button, Comment } from '@/components';
import { toast } from 'react-toastify';
//=========================================================================================================================

// Компонент блок комментариев. Содержит поля ввода и кнопку добавления комментария,
// кнопку для подгрузки всех комментариев и сам перечень комментариев
export const CommentsBlock = ({ postId, ...props }: CommentsBlockProps): JSX.Element => {
	const cookies = parseCookies();

	const [textComment, setTextComment] = React.useState<string>('');
	const [isSubmitingComment, setIsSubmitingComment] = React.useState<boolean>(false);
	const [commentsList, setCommentsList] = React.useState<CommentItem[]>([]);

	const getComments = async () => {
		const response = await axios.get(`/posts/comments/${postId}`);
		setCommentsList(response.data);
	};

	const onClickAddComment = async () => {
		try {
			setIsSubmitingComment(true);
			const body = {
				text: textComment,
				postId,
			};

			const response = await axios.post(`/comments/${postId}`, body, {
				headers: { Authorization: cookies.token ? cookies.token : '' }
			});

			if (response.status === 200) {
				getComments();
			}
		} catch (error) {
			console.log(error);
			toast.error('Произошла ошибка при создании комментария :(', { role: 'alert' });
		} finally {
			setTextComment('');
			setIsSubmitingComment(false);
		}
	};

	return (
		<div {...props}>
			<form className={styles.formBox}>
				<textarea value={textComment} onChange={(event) => setTextComment(event.target.value)} />
				<Button
					tabIndex={0}
					type='submit'
					color='aqua'
					onClick={onClickAddComment}
					className={styles.addCommentButton}
					isLoading={isSubmitingComment}
					disabled={isSubmitingComment}
				>Добавить
				</Button>
			</form>
			<div className={styles.commentsBlock}>
				<button className={styles.showCommentsButton} onClick={getComments}>
					<span>Показать комментарии</span>
					<span><ArrowDownIcon /></span>
				</button>
				<div>
					{commentsList && commentsList.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).map(obj =>
						<Comment
							key={obj._id}
							_id={obj._id}
							text={obj.text}
							author={obj.author}
							createdAt={obj.createdAt}
						/>
					)}
				</div>
			</div>
		</div>
	);
};