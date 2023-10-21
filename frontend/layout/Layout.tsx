import React from 'react';
import styles from './Layout.module.scss';
import { LayoutProps } from './Layout.props';
import { MenuContextProvider } from '@/context/app.context';
import { Header, Sidebar } from '@/components';
import { ToastContainer } from 'react-toastify';
import { motion } from "framer-motion";
import { useRouter } from 'next/router';
//=========================================================================================================================

export const Layout = ({ isOpenMenu, setOpenMenu, children }: LayoutProps): JSX.Element => {
	const router = useRouter();
	return (
		<MenuContextProvider isOpenMenu={isOpenMenu} setOpenMenu={setOpenMenu} >
			<div className={styles.wrapper}>
				<Sidebar />
				<main className={styles.main}>
					<Header />
					<motion.div
						key={router.asPath}
						initial="initial"
						animate="animate"
						className={styles.motionDiv}
						variants={{
							initial: {
								x: "100%",
								opacity: 0,
								transition: { duration: 0.75 }
							},
							animate: {
								x: "0%",
								opacity: 1,
								transition: { duration: 0.75, delay: 0.7 }
							},
						}}
					>
						{children}
					</motion.div>
				</main>
			</div>
			<ToastContainer
				position='bottom-left'
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme='dark'
				role='alert'
				className='toastMessage'
			/>
		</MenuContextProvider >
	);
};