import { PostItem } from "@/interfaces/post.interface";
//=========================================================================================================================

export const paginate = (items: PostItem[], pageNumber: number, pageSize: number) => {
	const startIndex = (pageNumber - 1) * pageSize;
	return items.slice(startIndex, startIndex + pageSize);
};