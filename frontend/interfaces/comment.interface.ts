export interface CommentItem {
	_id: string;
	text: string;
	author: {
		_id: string,
		fullName: string,
		avatarUrl: string,
	}
	createdAt: string;
}

