import React, { ForwardedRef } from "react";
import { ButtonProps } from "./Button.props";
import styles from './Button.module.scss';
import cn from 'classnames';
//=========================================================================================================================

// Компонент кнопка. Нажатие на кнопку становится недоступным при загрузке данных 
// eslint-disable-next-line react/display-name
export const Button = React.forwardRef(({ children, color = 'aqua', isLoading, className, ...props }: ButtonProps, ref: ForwardedRef<HTMLButtonElement>): JSX.Element => {
	return (
		<button
			tabIndex={-1}
			ref={ref}
			className={cn(className, styles.button, {
				[styles.aqua]: color === 'aqua',
				[styles.grey]: color === 'grey',
			})}
			{...props}
		>
			{isLoading ? <span className={styles.spinner}></span> : children}
		</button>
	);
});