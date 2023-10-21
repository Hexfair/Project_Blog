import { DetailedHTMLProps, HTMLAttributes } from "react";
//=========================================================================================================================

export interface CommentProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	_id: string;
	text: string;
	author: {
		_id: string,
		fullName: string,
		avatarUrl: string,
	}
	createdAt: string;
}
