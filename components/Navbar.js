import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { styled } from '@mui/system';

const Nav = styled('nav')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    background: '#0b1220',
    color: '#fff',
});

const Logo = styled('a')({
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    color: '#fff',
    cursor: 'pointer'
});

const Links = styled('div')({
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
});

const NavLink = styled('a')({
    textDecoration: 'none',
    color: '#fff',
    cursor: 'pointer',
    ':hover': {
        textDecoration: 'underline',
    }
});

const Button = styled('button')({
    background: 'transparent',
    border: '1px solid #fff',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    ':hover': {
        background: '#fff',
        color: '#0b1220'
    }
});

export default function Navbar() {
    const { user, logout } = useAuth();
    const { cart } = useCart();

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <Nav>
            <Link href="/" passHref legacyBehavior>
                <Logo>Parfumerie Jaouad</Logo>
            </Link>
            <Links>
                <Link href="/" passHref legacyBehavior><NavLink>Accueil</NavLink></Link>
                <Link href="/#products" passHref legacyBehavior><NavLink>Parfums</NavLink></Link>

                {user ? (
                    <>
                        <Link href="/account" passHref legacyBehavior><NavLink>Mon Compte</NavLink></Link>
                        {user.role === 'admin' && (
                            <Link href="/admin" passHref legacyBehavior><NavLink>Admin</NavLink></Link>
                        )}
                        <Button onClick={logout}>Déconnexion</Button>
                    </>
                ) : (
                    <>
                        <Link href="/auth/login" passHref legacyBehavior><NavLink>Connexion</NavLink></Link>
                        <Link href="/auth/register" passHref legacyBehavior><NavLink>Inscription</NavLink></Link>
                    </>
                )}

                <Link href="/cart" passHref legacyBehavior>
                    <NavLink>Panier ({cartCount})</NavLink>
                </Link>
            </Links>
        </Nav>
    );
}
