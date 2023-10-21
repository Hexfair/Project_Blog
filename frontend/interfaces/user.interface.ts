export interface UserItem {
	_id?: string;
	fullName: string;
	email: string;
	passwordHash?: string;
	avatarUrl?: string;
	createdAt?: string;
	updatedAt?: string;
	token?: string;
}