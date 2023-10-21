import { DetailedHTMLProps, HTMLAttributes } from "react";
//=========================================================================================================================

export interface AvatarProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	userName: string;
	userAvatar?: string;
	userMail?: string;
	size?: 'small' | 'medium' | 'big'
}
