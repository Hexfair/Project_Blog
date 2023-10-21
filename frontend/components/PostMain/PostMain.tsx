import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../Button/Button';
import styles from './PostMain.module.scss';
import { PostMainProps } from './PostMain.props';
import Moment from 'react-moment';
import { Avatar } from '../Avatar/Avatar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ViewsCountIcon from '@/public/icons/viewsCount.svg';
//=========================================================================================================================

// Компонент блока поста на главной странице
export const PostMain = ({ imageUrl, title, text, id, date, viewsCount, authorName, authorAvatar, tags, ...props }: PostMainProps): JSX.Element => {
	return (
		<article className={styles.article} {...props}>
			{imageUrl && <div className={styles.image}>
				<Image
					src={`${process.env.NEXT_PUBLIC_SERVER_URL}${imageUrl}`}
					priority={true}
					alt='picture'
					fill
					sizes='(max-width: 900px) 600px'
				/>
			</div>}
			<div className={styles.content}>
				<div className={styles.info}>
					<Avatar tabIndex={0} userName={authorName} userAvatar={authorAvatar} size='medium' />
					<div className={styles.date}>
						<span tabIndex={0}><Moment format="DD.MM.YYYY">{date}</Moment></span>
						<span tabIndex={0}>{viewsCount}<ViewsCountIcon /></span>
					</div>
				</div>
				<h1 tabIndex={0} className={styles.title}>{title}</h1>
				<div className={styles.text} tabIndex={0}>
					<ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
				</div>

				<div className={styles.bottom}>
					<div className={styles.tags}>
						{tags && tags.map(obj =>
							<Link href={`/search?tags=${obj}`} key={obj}>
								<span className={styles.tag}>#{obj}</span>
							</Link>)}
					</div>
					<Link href={`/posts/${id}`}>
						<Button>Читать далее</Button>
					</Link>
				</div>
			</div>
		</article>
	);
};