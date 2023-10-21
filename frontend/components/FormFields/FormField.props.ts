import { DetailedHTMLProps, HTMLAttributes } from "react";
import { FieldErrors, RegisterOptions, UseFormRegister } from 'react-hook-form';
//=========================================================================================================================

export interface FormFieldProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	name: 'email' | 'password' | 'fullName' | 'title' | 'tags';
	type: string;
	label: string;
	formData: string;
	setFormData: (value: string) => void;
	validationSchema?: RegisterOptions;
	register: UseFormRegister<any>;
	errors: FieldErrors
}