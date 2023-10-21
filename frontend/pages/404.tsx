import { Button } from '@/components';
import styles from '@/styles/Error.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/router';
//=========================================================================================================================

const ErrorPage = () => {
	const router = useRouter();

	return (
		<div className={styles.errorPage}>
			<Image src='/404.png' alt='Page not found' width={256} height={256} priority />
			<h2>Запрашиваемая страница не найдена :(</h2>
			<p>Возможно, вы не авторизованы. Попробуйте перейти на главную страницу или повторить запрос позже</p>
			<Button tabIndex={0} color='aqua' onClick={() => router.push('/')}>На главную</Button>
		</div>
	);
};
export default ErrorPage;