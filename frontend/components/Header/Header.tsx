import styles from './Header.module.scss';
import { Search } from '../Search/Search';
import { BurgerMenu } from '../BurgerMenu/BurgerMenu';
//=========================================================================================================================

// Компонент хедер. Изменяется при изменении диагонали экрана.
// Содержит компонент поиска
export const Header = (): JSX.Element => {
	return (
		<header className={styles.header}>
			<BurgerMenu />
			<div className={styles.logo}>HEXFAIR Blog</div>
			<Search />
		</header>
	);
};