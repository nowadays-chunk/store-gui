import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import api from '../utils/api';
import { styled } from '@mui/system';

const Container = styled('div')({
    maxWidth: '800px',
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

const Form = styled('form')({
    display: 'grid',
    gap: '1rem',
    background: '#fff',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
});

const Input = styled('input')({
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    width: '100%',
    outline: 'none',
    ':focus': { borderColor: '#0f172a' }
});

const Button = styled('button')({
    padding: '1rem',
    background: '#0f172a',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '1rem',
    ':disabled': { opacity: 0.5, cursor: 'not-allowed' }
});

export default function Checkout() {
    const { cart, total, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [phone, setPhone] = useState('');

    if (cart.length === 0) {
        if (typeof window !== 'undefined') router.push('/cart');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                userId: user ? user.id : null, // Optional for guest
                customerName: name,
                shippingAddress: `${address}, ${city}`,
                phone,
                totalAmount: total,
                status: 'pending',
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            await api.post('/orders', orderData);
            clearCart();
            alert('Commande passée avec succès !');
            router.push('/account'); // Or success page
        } catch (error) {
            console.error(error);
            alert('Erreur lors de la commande');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Title>Validation de la commande</Title>
            <Form onSubmit={handleSubmit}>
                <Input
                    placeholder="Nom complet"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />
                <Input
                    placeholder="Adresse"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    required
                />
                <Input
                    placeholder="Ville"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    required
                />
                <Input
                    placeholder="Téléphone"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                />

                <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>
                    Total à payer: {total.toFixed(2)} DHS
                </div>

                <Button type="submit" disabled={loading}>
                    {loading ? 'Traitement...' : 'Confirmer la commande'}
                </Button>
            </Form>
        </Container>
    );
}
