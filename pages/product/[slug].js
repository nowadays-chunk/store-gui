import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { styled } from '@mui/system';
import api from '../../utils/api';

const Container = styled('div')({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '2rem'
});

const ProductGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '3rem',
  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr'
  }
});

const ImageSection = styled('div')({
  position: 'sticky',
  top: '2rem',
  height: 'fit-content'
});

const MainImage = styled('img')({
  width: '100%',
  borderRadius: '12px',
  marginBottom: '1rem'
});

const InfoSection = styled('div')({});

const Title = styled('h1')({
  fontSize: '2rem',
  fontWeight: 'bold',
  marginBottom: '1rem',
  color: '#0f172a'
});

const Price = styled('div')({
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#0f172a',
  marginBottom: '1.5rem'
});

const Description = styled('p')({
  fontSize: '1rem',
  lineHeight: '1.6',
  color: '#475569',
  marginBottom: '2rem'
});

const Button = styled('button')({
  padding: '1rem 2rem',
  borderRadius: '8px',
  background: '#0f172a',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '1rem',
  cursor: 'pointer',
  border: 'none',
  width: '100%',
  ':hover': {
    opacity: 0.9
  }
});

const Badge = styled('span')({
  display: 'inline-block',
  padding: '0.25rem 0.75rem',
  borderRadius: '6px',
  background: '#dcfce7',
  color: '#166534',
  fontSize: '0.875rem',
  fontWeight: '500',
  marginBottom: '1rem'
});

export default function ProductDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const data = await api.get(`/products/slug/${slug}`);
      setProduct(data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    // Add to cart logic
    console.log('Adding to cart:', product.id);
  };

  if (loading) return <Container>Loading...</Container>;
  if (!product) return <Container>Product not found</Container>;

  return (
    <Container>
      <ProductGrid>
        <ImageSection>
          <MainImage
            src={product.images?.[0] || '/placeholder-product.jpg'}
            alt={product.name}
          />
        </ImageSection>
        <InfoSection>
          {product.isFeatured && <Badge>Featured</Badge>}
          <Title>{product.name}</Title>
          <Price>${product.price}</Price>
          <Description>{product.description}</Description>
          <Button onClick={handleAddToCart}>Add to Cart</Button>
        </InfoSection>
      </ProductGrid>
    </Container>
  );
}
