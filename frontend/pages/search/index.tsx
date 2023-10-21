import { PostItem } from "@/interfaces/post.interface";
import axios from "@/utils/axios";
import { GetServerSidePropsContext, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import styles from '@/styles/SearchPage.module.scss';
import { useRouter } from "next/router";
import { PostMain } from "@/components";
//=========================================================================================================================
interface SearchPageProps extends Record<string, unknown> {
	posts: PostItem[]
}
//=========================================================================================================================

// Страница поиска постов
const SearchPage: NextPage<SearchPageProps> = ({ posts }) => {
	const router = useRouter();

	return (
		<div className={styles.content}>
			<h3 className={styles.text}>
				Результаты поиска <span>{router.query.tags ? `"#${router.query.tags}"` : `"${router.query.title}"`}</span>
			</h3>
			{posts && posts.map(obj =>
				<PostMain
					key={obj._id}
					id={obj._id}
					title={obj.title}
					text={obj.text}
					imageUrl={obj.imageUrl ? obj.imageUrl : ''}
					date={obj.createdAt}
					authorName={obj.author.fullName}
					authorAvatar={obj.author.avatarUrl}
					tags={obj.tags}
					viewsCount={obj.viewsCount}
				/>)}
		</div>
	);
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext<ParsedUrlQuery>) => {

	const searchParams = ctx.query;

	const { data } = searchParams.tags
		? await axios.get<PostItem[]>(`/search?tags=${ctx.query.tags}`)
		: await axios.get<PostItem[]>(`/search?title=${ctx.query.title}`);

	if (data) {
		return {
			props: {
				posts: data
			},
		};
	}

	return {
		props: {
			posts: []
		},
	};
};

export default SearchPage;
