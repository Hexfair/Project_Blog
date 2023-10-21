import styles from './Pagination.module.scss';
import { PaginationProps } from './Pagination.props';
import cn from 'classnames';
//=========================================================================================================================

// Компонент пагинации. Отображается на главной странице постов
export const Pagination = ({ items, currentPage, pageSize, onPageChange, ...props }: PaginationProps): JSX.Element | null => {

	const pagesCount = Math.ceil(items / pageSize);

	if (pagesCount === 1) return null;

	const pages = Array.from({ length: pagesCount }, (_, i) => i + 1);

	return (
		<ul className={styles.pagination} {...props}>
			{pages.map(obj => (
				<li key={obj}
					className={cn(styles.pageItem, obj === currentPage && styles.active)}
					onClick={() => onPageChange(obj)}
				>{obj}
				</li>
			))}
		</ul>
	);
};