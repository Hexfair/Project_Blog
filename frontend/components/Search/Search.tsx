import React from 'react';
import styles from './Search.module.scss';
import SearchIcon from '@/public/icons/searchButton.svg';
import { useRouter } from 'next/router';
import cn from 'classnames';
//=========================================================================================================================

// Компонент поиска постов по заданному значению
export const Search = (): JSX.Element => {
	const [searchValue, setSearchValue] = React.useState<string>('');
	const [isVisible, setIsVisible] = React.useState<boolean>(false);
	const router = useRouter();

	const onClickSearch = () => {
		router.push({
			pathname: '/search',
			query: { 'title': searchValue },
		});
		setSearchValue('');
	};

	const onKeyDownHandle = (event: React.KeyboardEvent<HTMLInputElement>): void => {
		if (event.key === 'Enter') {
			event.preventDefault();
			onClickSearch();
			setIsVisible(false);
		}
	};

	return (
		<div className={styles.block}>
			<div className={cn(styles.search, { [styles.visible]: isVisible })}>
				<input
					className={styles.input}
					placeholder='Поиск по блогу'
					value={searchValue}
					onChange={e => setSearchValue(e.target.value)}
					onKeyDown={onKeyDownHandle}
				/>
				<button tabIndex={-1} onClick={onClickSearch}><SearchIcon /></button>
			</div>
			<button className={styles.mobileButton} onClick={() => setIsVisible(!isVisible)}>Поиск</button>
		</div>
	);
};