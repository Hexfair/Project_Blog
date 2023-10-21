import React from 'react';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Layout } from '@/layout/Layout';
import { wrapper } from '@/redux/store';
import { Provider } from 'react-redux';
import localFont from 'next/font/local';
import { parseCookies } from 'nookies';
import axios from '@/utils/axios';
import { setDataUser } from '@/redux/auth.slice';
import { UserItem } from '@/interfaces/user.interface';
import 'react-toastify/dist/ReactToastify.min.css';
//=========================================================================================================================
const roboto = localFont({
	src: [
		{ path: '../public/fonts/Roboto-Light.woff2', weight: '300', style: 'normal', },
		{ path: '../public/fonts/Roboto-Regular.woff2', weight: '400', style: 'normal', },
		{ path: '../public/fonts/Roboto-Italic.woff2', weight: '400', style: 'italic', },
		{ path: '../public/fonts/Roboto-Medium.woff2', weight: '500', style: 'normal', },
		{ path: '../public/fonts/Roboto-Bold.woff2', weight: '700', style: 'normal', },
	],
});
//=========================================================================================================================

const App = ({ Component, ...rest }: AppProps): JSX.Element => {
	const { store, props } = wrapper.useWrappedStore(rest);
	return (
		<Provider store={store}>
			<Layout className={roboto.className} {...props}>
				<Component {...props.pageProps} />
			</Layout>
		</Provider>
	);
};

App.getInitialProps = wrapper.getInitialAppProps(store => async ({ ctx, Component }) => {
	try {
		const { token } = parseCookies(ctx);

		if (token) {
			const { data } = await axios.get<UserItem>('/auth/me', {
				headers: { Authorization: token }
			});

			store.dispatch(setDataUser(data));
		}

		if (!token) {
			return {
				pageProps: {}
			};
		}

	} catch (err) {
		console.log(err);
	}

	return {
		pageProps: Component.getInitialProps ? await Component.getInitialProps({ ...ctx, store }) : {}
	};
});

export default App;