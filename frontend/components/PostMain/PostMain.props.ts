import { DetailedHTMLProps, HTMLAttributes } from "react";
//=========================================================================================================================

export interface PostMainProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	id: string;
	imageUrl?: string;
	title: string;
	text: string;
	date?: string;
	tags?: string[];
	viewsCount: number;
	authorName: string;
	authorAvatar?: string;
}
