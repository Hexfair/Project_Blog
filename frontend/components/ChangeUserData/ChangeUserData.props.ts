import { DetailedHTMLProps, HTMLAttributes } from "react";
//=========================================================================================================================

export interface ChangeUserDataProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	setIsPopupOpen: (value: boolean) => void;
}
