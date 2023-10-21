import { DetailedHTMLProps, HTMLAttributes } from "react";
//=========================================================================================================================

export interface PostUserProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	id: string;
	imageUrl?: string;
	title: string;
	date?: string;
	tags?: string[];
	viewsCount: number;
}
