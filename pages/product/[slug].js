// pages/product/[slug].js
import React from "react";
import Link from "next/link";
import { styled } from "@mui/system";
import { getProducts } from "@/data/products";

const Wrap = styled("section")({
  padding: "96px 0",
  background:
    "radial-gradient(1200px 400px at 50% 0%, rgba(16,185,129,0.12), transparent 60%), linear-gradient(#f7f7fb, #f1f5f9)",
});

const Container = styled("div")({
  maxWidth: 1200,
  margin: "0 auto",
  padding: "0 24px",
});

const Breadcrumb = styled("div")({
  fontSize: 13,
  color: "rgba(15, 23, 42, 0.65)",
  marginBottom: 18,
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
});

const CrumbLink = styled("a")({
  textDecoration: "none",
  color: "inherit",
  fontWeight: 700,
  opacity: 0.9,
  ":hover": { opacity: 1, textDecoration: "underline" },
});

const Panel = styled("div")({
  background: "#fff",
  borderRadius: 24,
  overflow: "hidden",
  border: "1px solid rgba(15,23,42,0.06)",
  boxShadow: "0 18px 60px rgba(2,6,23,0.10)",
  display: "grid",
  gridTemplateColumns: "1fr",
  "@media (min-width: 900px)": {
    gridTemplateColumns: "1fr 1fr",
  },
});

const Img = styled("img")({
  width: "100%",
  height: 520,
  objectFit: "cover",
  background: "#0b1220",
});

const Content = styled("div")({
  padding: 28,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: 18,
});

const Title = styled("h1")({
  margin: 0,
  fontSize: "clamp(26px, 3.5vw, 44px)",
  fontWeight: 900,
  letterSpacing: "-0.03em",
  color: "#0f172a",
  lineHeight: 1.12,
});

const Price = styled("div")({
  marginTop: 10,
  fontSize: 22,
  fontWeight: 900,
  color: "#111827",
});

const Desc = styled("p")({
  marginTop: 14,
  color: "rgba(15,23,42,0.72)",
  lineHeight: 1.7,
});

const List = styled("ul")({
  margin: "14px 0 0",
  paddingLeft: 18,
  color: "rgba(15,23,42,0.72)",
  lineHeight: 1.7,
});

const Actions = styled("div")({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 12,
  marginTop: 18,
  "@media (min-width: 520px)": {
    gridTemplateColumns: "1fr 1fr",
  },
});

const Primary = styled("a")({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  height: 52,
  borderRadius: 16,
  background: "#0b1220",
  color: "#fff",
  fontWeight: 900,
  border: "1px solid rgba(15,23,42,0.12)",
  transition: "transform .2s ease, background .2s ease",
  ":hover": { transform: "translateY(-1px)", background: "#111827" },
});

const Secondary = styled("a")({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  height: 52,
  borderRadius: 16,
  background: "#fff",
  color: "#0f172a",
  fontWeight: 900,
  border: "1px solid rgba(15,23,42,0.12)",
  transition: "transform .2s ease, background .2s ease",
  ":hover": { transform: "translateY(-1px)", background: "#f8fafc" },
});

export default function ProductPage({ product }) {
  if (!product) return null;

  const waText = `Je souhaite commander ${product.title} (${product.price} DHS).`;

  return (
    <Wrap>
      <Container>
        <Breadcrumb>
          <Link href="/" passHref legacyBehavior>
            <CrumbLink>Accueil</CrumbLink>
          </Link>
          <span>›</span>
          <Link href="/#products" passHref legacyBehavior>
            <CrumbLink>Parfums</CrumbLink>
          </Link>
          <span>›</span>
          <span style={{ color: "rgba(15,23,42,0.9)", fontWeight: 800 }}>
            {product.title}
          </span>
        </Breadcrumb>

        <Panel>
          <Img src={product.image} alt={product.title} />
          <Content>
            <div>
              <Title>{product.title}</Title>
              <Price>{product.price} DHS</Price>
              <Desc>{product.description}</Desc>
              <List>
                {product.notes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </List>
            </div>

            <Actions>
              <Primary
                href={`https://wa.me/212600000000?text=${encodeURIComponent(
                  waText
                )}`}
              >
                Commander via WhatsApp
              </Primary>

              <Link href="/#products" passHref legacyBehavior>
                <Secondary>Retour aux produits</Secondary>
              </Link>
            </Actions>
          </Content>
        </Panel>
      </Container>
    </Wrap>
  );
}

export async function getStaticPaths() {
  const products = getProducts();

  return {
    paths: products.map((p) => ({
      params: { slug: p.slug },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const products = getProducts();
  const product = products.find((p) => p.slug === params.slug) || null;

  return {
    props: { product },
  };
}
