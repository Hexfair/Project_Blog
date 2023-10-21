import React, { KeyboardEvent } from 'react';
import styles from './Sidebar.module.scss';
import MainIcon from './MainIcon.svg';
import AddPostIcon from './AddPostIcon.svg';
import MyPostsIcon from './MyPostsIcon.svg';
import ExitIcon from './ExitIcon.svg';
import Link from 'next/link';
import { shallowEqual, useSelector } from 'react-redux';
import { useAppDispatch } from '@/redux/store';
import { dataUserSelect, logout } from '@/redux/auth.slice';
import { Avatar } from '../Avatar/Avatar';
import { destroyCookie } from 'nookies';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { MenuContext } from '@/context/app.context';
//=========================================================================================================================

// Компонент меню сайта. На мобильной версии находится в меню-бургер
export const Sidebar = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const dataUser = useSelector(dataUserSelect, shallowEqual);
	const router = useRouter();
	const { isOpenMenu, setOpenMenu } = React.useContext(MenuContext);

	const onClickLogout = () => {
		if (window.confirm('Вы действительно хотите выйти?')) {
			destroyCookie(null, 'token', { path: '/' });
			dispatch(logout());
		}
	};

	const onClickLogoutKey = (key: KeyboardEvent) => {
		if (key.code === 'Enter') {
			key.preventDefault();
			onClickLogout();
		}
	};

	const onClickLoginKey = (key: KeyboardEvent) => {
		if (key.code === 'Enter') {
			key.preventDefault();
			router.push('/auth/login');
		}
	};

	return (
		<div className={cn(styles.sidebar, { [styles.active]: isOpenMenu })}>
			<Avatar
				size='big'
				userName={dataUser ? dataUser.fullName : ''}
				userAvatar={dataUser ? dataUser.avatarUrl : ''}
				userMail={dataUser ? dataUser.email : ''}
			/>
			<ul className={styles.list}>
				<li className={cn(styles.link, { [styles.active]: router.pathname === '/' })}>
					<Link href='/' onClick={() => setOpenMenu(false)}>
						<MainIcon /> Главная
					</Link>
				</li>
				<li className={cn(styles.link, { [styles.active]: router.pathname === '/posts/user-posts' })}>
					<Link href={dataUser ? '/posts/user-posts' : '/auth'} onClick={() => setOpenMenu(false)}>
						<MyPostsIcon /> Мои посты
					</Link>
				</li>
				<li className={cn(styles.link, { [styles.active]: router.pathname === '/posts/add-post' })}>
					<Link href={dataUser ? '/posts/add-post' : '/auth'} onClick={() => setOpenMenu(false)}>
						<AddPostIcon /> Добавить пост
					</Link>
				</li>
				{dataUser
					? <li className={styles.exit} tabIndex={0} onKeyDown={onClickLogoutKey}>
						<a onClick={onClickLogout}><ExitIcon /> Выйти</a>
					</li>
					: <li className={styles.enter} tabIndex={0} onKeyDown={onClickLoginKey}>
						<Link href='/auth'>
							<ExitIcon /> Войти
						</Link>
					</li>}
			</ul>
		</div>
	);
};