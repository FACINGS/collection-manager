import '@styles/globals.css';
import Header from '@components/Header';
import Footer from '@components/Footer';
import { ChainProvider } from '@contexts/ChainContext';

function MyApp({ Component, pageProps }) {
    return (
        <ChainProvider>
            <Header />
            <Component {...pageProps} />
            <Footer />
        </ChainProvider>
    )
}

export default MyApp
