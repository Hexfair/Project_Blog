import { PostItem } from "@/interfaces/post.interface";
import { GetServerSidePropsContext } from "next";
import axios from '@/utils/axios';
import { NextPage } from "next";
import styles from '@/styles/UserPosts.module.scss';
import nookies from 'nookies';
import { PostUser } from "@/components";
import Image from "next/image";
//=========================================================================================================================
export interface UserPostsProps extends Record<string, unknown> {
	posts: PostItem[]
}
//=========================================================================================================================

// Страница всех постов пользователя
const UserPostsPage: NextPage<UserPostsProps> = ({ posts }) => {

	if (posts.length === 0) {
		return (
			<div className={styles.emptyPosts}>
				<Image src='/pageEmpty.svg' alt='Page is empty' width={256} height={256} priority />
				<h2>Вы не написали ни одного поста :(</h2>
				{/* <p>Возможно, вы не авторизованы. Попробуйте перейти на главную страницу или повторить запрос позже</p> */}
			</div>
		);
	}

	return (
		<div className={styles.userPosts}>
			{posts.map(obj =>
				<PostUser
					key={obj.title}
					id={obj._id}
					imageUrl={obj.imageUrl}
					title={obj.title}
					date={obj.createdAt}
					tags={obj.tags}
					viewsCount={obj.viewsCount}
				/>
			)}
		</div>
	);
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	try {
		const cookies = nookies.get(ctx);

		const { data } = await axios.get<PostItem[]>(`/uposts`, {
			headers: { Authorization: cookies.token }
		});

		return {
			props: {
				posts: data
			}
		};
	} catch (err) {
		console.log(err);
	}

	return {
		props: {
			posts: []
		}
	};
};

export default UserPostsPage;