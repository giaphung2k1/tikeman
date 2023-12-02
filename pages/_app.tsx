import type { AppProps } from 'next/app';
import { Footer, Navigation } from '../components';
import { Provider, store } from '../redux'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<Provider store={store}>
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar
				closeOnClick
				rtl={false}
				draggable
				theme="colored"
			/>
			<Component props={pageProps} />
		</Provider>
	);
}
