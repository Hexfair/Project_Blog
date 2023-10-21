import { UserItem } from "./user.interface";
//=========================================================================================================================

export interface PostItem {
	_id: string;
	title: string;
	text: string;
	tags: string[];
	imageUrl: string;
	viewsCount: number;
	createdAt: string;
	author: UserItem;
}

export interface PostFormData {
	title: string;
	text: string;
	tags?: string;
	imageUrl?: string;
}

