import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { styled } from '@mui/system';
import api from '../../utils/api';

const Container = styled('div')({
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
});

const Grid = styled('div')({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '2rem',
    marginTop: '2rem'
});

const ProductCard = styled('div')({
    background: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    ':hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }
});

const ProductImage = styled('img')({
    width: '100%',
    height: '280px',
    objectFit: 'cover'
});

const ProductInfo = styled('div')({
    padding: '1rem'
});

const ProductName = styled('h3')({
    fontSize: '1.125rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#0f172a'
});

const ProductPrice = styled('div')({
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#0f172a'
});

const SearchBar = styled('input')({
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '1rem',
    outline: 'none',
    ':focus': {
        borderColor: '#0f172a'
    }
});

const Title = styled('h1')({
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    color: '#0f172a'
});

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchProducts();
    }, [search]);

    const fetchProducts = async () => {
        try {
            const query = search ? `?search=${search}` : '';
            const data = await api.get(`/products${query}`);
            setProducts(data.products || data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProductClick = (slug) => {
        router.push(`/product/${slug}`);
    };

    if (loading) return <Container>Loading...</Container>;

    return (
        <Container>
            <Title>Our Products</Title>
            <SearchBar
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <Grid>
                {products.map((product) => (
                    <ProductCard key={product.id} onClick={() => handleProductClick(product.slug)}>
                        <ProductImage
                            src={product.images?.[0] || '/placeholder-product.jpg'}
                            alt={product.name}
                        />
                        <ProductInfo>
                            <ProductName>{product.name}</ProductName>
                            <ProductPrice>${product.price}</ProductPrice>
                        </ProductInfo>
                    </ProductCard>
                ))}
            </Grid>
        </Container>
    );
}
