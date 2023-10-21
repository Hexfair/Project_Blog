import { ContextEntity } from "@/context/app.context";
import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";
//=========================================================================================================================

export interface LayoutProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, ContextEntity {
	children: ReactNode;
} 
