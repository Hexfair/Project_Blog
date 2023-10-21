import React, { ReactNode, createContext } from "react";
//=========================================================================================================================

// Контекст приложения. Нужен только для того, чтобы передать в некоторые компоненты
// информацию о закрытии/открытии мобильного меню
export interface ContextEntity {
	isOpenMenu: boolean;
	setOpenMenu: (statusMenu: boolean) => void;
}

export const MenuContext = createContext<ContextEntity>({ isOpenMenu: false, setOpenMenu: () => { } });

export const MenuContextProvider = ({ children }: ContextEntity & { children: ReactNode }): JSX.Element => {
	const [menuState, setMenuState] = React.useState<boolean>(false);

	const setOpenMenu = (menuState: boolean) => {
		setMenuState(menuState);
	};

	return <MenuContext.Provider value={{ isOpenMenu: menuState, setOpenMenu }}>
		{children}
	</MenuContext.Provider>;
};

