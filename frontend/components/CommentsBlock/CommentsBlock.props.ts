import { DetailedHTMLProps, HTMLAttributes } from "react";
//=========================================================================================================================

export interface CommentsBlockProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	postId: string;
}
