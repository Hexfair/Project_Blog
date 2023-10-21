import { MenuContext } from '@/context/app.context';
import styles from './BurgerMenu.module.scss';
import cn from 'classnames';
import { useContext } from 'react';
//=========================================================================================================================

// Компонент бургер-меню. Скрывается и раскрывается при нажатии
export const BurgerMenu = () => {
	const { isOpenMenu, setOpenMenu } = useContext(MenuContext);

	return (
		<div
			className={cn(styles.burger, isOpenMenu && styles.active)}
			onClick={() => setOpenMenu(!isOpenMenu)}>
			<span></span>
		</div>
	);
};

