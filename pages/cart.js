import React from 'react';
import { useCart } from '../context/CartContext';
import { styled } from '@mui/system';
import Link from 'next/link';

const Container = styled('div')({
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '2rem',
    minHeight: '80vh'
});

const Title = styled('h1')({
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '2rem',
    color: '#0f172a'
});

const CartItem = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    background: '#fff',
    borderRadius: '12px',
    marginBottom: '1rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
});

const ItemInfo = styled('div')({
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
});

const Image = styled('img')({
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '8px',
    backgroundColor: '#0b1220'
});

const Controls = styled('div')({
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
});

const Button = styled('button')({
    background: '#0f172a',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
});

const RemoveButton = styled('button')({
    color: '#ef4444',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.9rem'
});

const Total = styled('div')({
    textAlign: 'right',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBlock: '2rem',
    color: '#0f172a'
});

const CheckoutBtn = styled('a')({
    display: 'inline-block',
    background: '#0f172a',
    color: '#fff',
    padding: '1rem 2rem',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: 'bold',
    float: 'right'
});

export default function Cart() {
    const { cart, removeFromCart, total } = useCart();

    if (cart.length === 0) {
        return (
            <Container>
                <Title>Votre Panier</Title>
                <p>Votre panier est vide.</p>
                <Link href="/#products">Continuer mes achats</Link>
            </Container>
        );
    }

    return (
        <Container>
            <Title>Votre Panier</Title>
            {cart.map(item => (
                <CartItem key={item.id}>
                    <ItemInfo>
                        <Image src={item.image || item.imageUrl || '/assets/products/placeholder.jpeg'} alt={item.title || item.name} />
                        <div>
                            <h3>{item.title || item.name}</h3>
                            <p>{item.price} DHS x {item.quantity}</p>
                        </div>
                    </ItemInfo>
                    <Controls>
                        <p style={{ fontWeight: 'bold' }}>{item.price * item.quantity} DHS</p>
                        <RemoveButton onClick={() => removeFromCart(item.id)}>Supprimer</RemoveButton>
                    </Controls>
                </CartItem>
            ))}
            <Total>Total: {total.toFixed(2)} DHS</Total>
            <Link href="/checkout" passHref legacyBehavior>
                <CheckoutBtn>Passer la commande</CheckoutBtn>
            </Link>
        </Container>
    );
}
