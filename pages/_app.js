import "@/styles/globals.css";
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { useRouter } from 'next/router';
import CustomerLayout from '../components/customer/Layout';
import '@fontsource/outfit/300.css';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAdmin = router.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <CartProvider>
        {isAdmin ? (
          <Component {...pageProps} />
        ) : (
          <CustomerLayout>
            <Component {...pageProps} />
          </CustomerLayout>
        )}
      </CartProvider>
    </AuthProvider>
  );
}
