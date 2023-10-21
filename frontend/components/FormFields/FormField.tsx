import React from 'react';
import { FormFieldProps } from './FormField.props';
import styles from './FormField.module.scss';
import cn from 'classnames';
//=========================================================================================================================

// Компонент инпута для формы. Универсален для форм авторизации и добавления/изменения поста
export const FormField: React.FC<FormFieldProps> = ({ name, type, register, errors, validationSchema, label, formData, setFormData, ...props }) => {
	return (
		<div className={cn(styles.inputBox, { [styles.noEmpty]: formData.length !== 0 })} {...props}>
			<input
				{...register(name, validationSchema)}
				name={name}
				type={type}
				value={formData}
				onChange={(e) => setFormData(e.target.value)}
			/>
			<span>{label}</span>
			{errors[name] && <p className={styles.inputError}>{errors[name]?.message?.toString()}</p>}
		</div>
	);
};