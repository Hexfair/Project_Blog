import { DetailedHTMLProps, HTMLAttributes } from "react";
//=========================================================================================================================

export interface PaginationProps extends DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement> {
	items: number;
	currentPage: number;
	pageSize: number;
	onPageChange: (page: number) => void;
}
