import React from 'react';
import axios from '@/utils/axios';
import { PostItem } from '@/interfaces/post.interface';
import { GetServerSidePropsContext, NextPage } from 'next';
import styles from '@/styles/FullPost.module.scss';
import { ParsedUrlQuery } from 'querystring';
import ArrowBackIcon from '@/public/icons/arrowBack.svg';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Moment from 'react-moment';
import ReactMarkdown from 'react-markdown';
import EditIcon from '@/public/icons/editPost.svg';
import DeleteIcon from '@/public/icons/deletePost.svg';
import { shallowEqual, useSelector } from 'react-redux';
import Link from 'next/link';
import remarkGfm from 'remark-gfm';
import { parseCookies } from 'nookies';
import { dataUserSelect } from '@/redux/auth.slice';
import { Avatar, CommentsBlock } from '@/components';
//=========================================================================================================================
interface FullPostPageProps extends Record<string, unknown> {
	post: PostItem
}
//=========================================================================================================================

// Страница полного поста
const FullPostPage: NextPage<FullPostPageProps> = ({ post }) => {
	const router = useRouter();
	const dataUser = useSelector(dataUserSelect, shallowEqual);
	const cookies = parseCookies();

	const { title, text, tags = [], imageUrl, createdAt, _id, author } = post;

	const onClickRemovePost = async () => {
		if (window.confirm('Вы действительно хотите удалить статью?')) {
			const { data } = await axios.delete(`/posts/${_id}`, {
				headers: { Authorization: cookies.token ? cookies.token : '' }
			});
			data && router.push('/');
		}
	};

	const onClickEditPost = () => {
		router.push({
			pathname: '/posts/add-post',
			query: { edit: `${_id}` },
		});
	};

	return (
		<article className={styles.fullPost}>
			<button className={styles.back} onClick={() => router.back()}>
				<ArrowBackIcon /><span>вернуться назад</span>
			</button>
			{imageUrl &&
				<div className={styles.image}>
					<Image src={`${process.env.NEXT_PUBLIC_SERVER_URL}${imageUrl}`} fill alt='PostImage' />
				</div>}
			<div tabIndex={0} className={styles.title}>{title}</div>
			<span tabIndex={0}><Moment format="DD.MM.YYYY" className={styles.date}>{createdAt}</Moment></span>
			{tags.length > 0 &&
				<p>{tags && tags.map(obj =>
					<Link href={`/search?tags=${obj}`} key={obj}>
						<span className={styles.tag}>#{obj}</span>
					</Link>)}
				</p>}
			<div tabIndex={0} className={styles.reactMarkDown}>
				<ReactMarkdown remarkPlugins={[remarkGfm]} >{text}</ReactMarkdown>
			</div>
			<div className={styles.author}>
				<Avatar tabIndex={0} userName={author?.fullName} userAvatar={author?.avatarUrl} size='medium' />
				{dataUser?._id === author?._id &&
					<>
						<button onClick={onClickEditPost} className={styles.edit}><EditIcon /></button>
						<button onClick={onClickRemovePost} className={styles.remove}><DeleteIcon /></button>
					</>}
			</div>
			<hr className={styles.divider} />
			<CommentsBlock postId={_id} />
		</article>
	);
};

export const getServerSideProps = async ({ params }: GetServerSidePropsContext<ParsedUrlQuery>) => {
	try {
		if (!params) {
			return {
				notFound: true,
			};
		}

		const { data } = await axios.get<PostItem>(`/posts/${params.id}`);

		return {
			props: {
				post: data
			},
		};
	} catch (error) {
		console.log(error);
		return {
			notFound: true,
		};
	}
};

export default FullPostPage;