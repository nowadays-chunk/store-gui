// pages/index.js
import React from "react";
import Link from "next/link";
import { styled } from "@mui/system";
import { getProducts } from "@/data/products";

const Section = styled("section")({
  padding: "96px 0",
  background:
    "radial-gradient(1200px 400px at 50% 0%, rgba(99,102,241,0.12), transparent 60%), linear-gradient(#f7f7fb, #f1f5f9)",
});

const Container = styled("div")({
  maxWidth: 1200,
  margin: "0 auto",
  padding: "0 24px",
});

const Title = styled("h2")({
  margin: 0,
  textAlign: "center",
  fontSize: "clamp(30px, 4vw, 46px)",
  fontWeight: 900,
  letterSpacing: "-0.03em",
  color: "#0f172a",
});

const Subtitle = styled("p")({
  margin: "14px auto 0",
  textAlign: "center",
  maxWidth: 760,
  color: "rgba(15, 23, 42, 0.72)",
  lineHeight: 1.6,
  fontSize: 16,
});

const Grid = styled("div")({
  marginTop: 48,
  display: "grid",
  gap: 18,
  gridTemplateColumns: "1fr",
  "@media (min-width: 720px)": {
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))", // tablet 3
  },
  "@media (min-width: 1100px)": {
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))", // desktop 4
  },
});

const Card = styled("a")({
  display: "block",
  textDecoration: "none",
  color: "inherit",
  background: "#fff",
  borderRadius: 18,
  overflow: "hidden",
  boxShadow: "0 10px 30px rgba(2, 6, 23, 0.08)",
  border: "1px solid rgba(15,23,42,0.06)",
  transform: "translateZ(0)",
  transition: "transform .28s ease, box-shadow .28s ease",
  ":hover": {
    transform: "translateY(-6px)",
    boxShadow: "0 18px 45px rgba(2, 6, 23, 0.14)",
  },
});

const ImgWrap = styled("div")({
  height: 290,
  overflow: "hidden",
  background: "#0b1220",
});

const Img = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transform: "scale(1.02)",
  transition: "transform .55s ease",
  [`${Card}:hover &`]: {
    transform: "scale(1.12)",
  },
});

const CardBody = styled("div")({
  padding: 16,
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 12,
});

const Name = styled("div")({
  fontWeight: 800,
  letterSpacing: "-0.01em",
  color: "#0f172a",
  lineHeight: 1.25,
});

const Price = styled("div")({
  fontWeight: 900,
  color: "#111827",
  whiteSpace: "nowrap",
});

const Badge = styled("div")({
  marginTop: 8,
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontSize: 12,
  fontWeight: 800,
  color: "rgba(15, 23, 42, 0.7)",
});

const Dot = styled("span")({
  width: 8,
  height: 8,
  borderRadius: 99,
  background: "linear-gradient(135deg,#10b981,#6366f1,#ef4444,#8b5cf6)",
  display: "inline-block",
});

const ContactSection = styled("section")({
  padding: "96px 0",
  color: "#fff",
  position: "relative",
  background:
    "linear-gradient(135deg, #064e3b, #1e3a8a, #7f1d1d, #6d28d9)",
});

const Shine = styled("div")({
  position: "absolute",
  inset: 0,
  background:
    "radial-gradient(circle at 25% 20%, rgba(255,255,255,0.35), transparent 45%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.25), transparent 55%)",
  mixBlendMode: "overlay",
  pointerEvents: "none",
});

const ContactCard = styled("div")({
  position: "relative",
  maxWidth: 820,
  margin: "0 auto",
  padding: 24,
  borderRadius: 22,
  background: "rgba(0,0,0,0.25)",
  border: "1px solid rgba(255,255,255,0.16)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 18px 60px rgba(0,0,0,0.25)",
});

const Form = styled("form")({
  marginTop: 18,
  display: "grid",
  gap: 12,
  gridTemplateColumns: "1fr",
  "@media (min-width: 720px)": {
    gridTemplateColumns: "1fr 1fr",
  },
});

const Input = styled("input")({
  width: "100%",
  padding: "14px 14px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.18)",
  outline: "none",
  background: "rgba(255,255,255,0.92)",
  color: "#0f172a",
});

const Textarea = styled("textarea")({
  width: "100%",
  padding: "14px 14px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.18)",
  outline: "none",
  background: "rgba(255,255,255,0.92)",
  color: "#0f172a",
  gridColumn: "1 / -1",
  resize: "vertical",
  minHeight: 120,
});

const Button = styled("button")({
  gridColumn: "1 / -1",
  padding: "14px 16px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.25)",
  background: "rgba(0,0,0,0.65)",
  color: "#fff",
  fontWeight: 900,
  cursor: "pointer",
  transition: "transform .2s ease, background .2s ease",
  ":hover": { transform: "translateY(-1px)", background: "rgba(0,0,0,0.8)" },
});

const Main = styled("main")({
  width: "100%",
});


/* Main hero container */
export const Hero = styled("section")(() => ({
  position: "relative",
  width: "100%",
  height: "100vh",
  overflow: "hidden",
}));

/* Split wrapper */
export const HeroSplit = styled("div")(() => ({
  display: "flex",
  width: "100%",
  height: "100%",
}));

/* Left background — 35% */
export const HeroLeft = styled("div")(() => ({
  width: "35%",
  height: "100%",
  backgroundImage: "url('/assets/backgrounds/homme-parfum-jaouad.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  borderRight: '6px solid white'
}));

/* Right background — 65% */
export const HeroRight = styled("div")(() => ({
  width: "65%",
  height: "100%",
  backgroundImage: "url('/assets/backgrounds/femme-parfum-chez-jaouad.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
}));

/* Dark overlay */
export const HeroOverlay = styled("div")(() => ({
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(to right, rgba(0,0,0,0.65), rgba(0,0,0,0.45))",
  zIndex: 1,
}));

/* Content layer */
export const HeroContent = styled("div")(() => ({
  position: "absolute",
  inset: 0,
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  padding: "0 24px",
  color: "#fff",
}));

export const HeroTitle = styled("h1")(() => ({
  fontSize: "clamp(2.5rem, 5vw, 4rem)",
  fontWeight: 600,
  letterSpacing: "1px",
  marginBottom: "16px",
}));

export const HeroSubtitle = styled("p")(() => ({
  maxWidth: "720px",
  fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
  lineHeight: 1.6,
  opacity: 0.9,
}));

const YoutubeSection = styled("section")({
  background: "#000",
});

const YoutubeFrame = styled("iframe")({
  width: "100%",
  height: "80vh",
  border: 0,
  display: "block",
});

export default function Home({ products }) {
  return (
    <>
    {/* HERO SECTION (Split Background Images) */}
      <Hero id="home">
        <HeroSplit>
          <HeroLeft />
          <HeroRight />
        </HeroSplit>

        <HeroOverlay />

        <HeroContent>
          <HeroTitle>Parfumerie Jaouad</HeroTitle>
          <HeroSubtitle>
            L’élégance orientale, une signature inoubliable — parfums raffinés,
            présence unique, et style premium.
          </HeroSubtitle>
        </HeroContent>
      </Hero>

      {/* YOUTUBE FULL VIEW (with sound) */}
      <YoutubeSection id="video">
        <YoutubeFrame
          src="https://www.youtube.com/embed/YrGyIA9EJR8?si=5XabOI-L9pMrGcaE"
          title="Nature inspiration"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </YoutubeSection>

      <Main>
        <Section id="products">
          <Container>
            <Title>Nos Parfums</Title>
            <Subtitle>
              Découvrez une sélection premium — inspirée des boutiques haut de
              gamme, avec un style moderne et élégant.
            </Subtitle>

            <Grid>
              {products.map((p) => (
                <Link key={p.id} href={`/product/${p.slug}`} passHref legacyBehavior>
                  <Card>
                    <ImgWrap>
                      <Img src={p.image} alt={p.title} />
                    </ImgWrap>
                    <CardBody>
                      <div>
                        <Name>{p.title}</Name>
                        <Badge>
                          <Dot /> Notes orientales & florales
                        </Badge>
                      </div>
                      <Price>{p.price} DHS</Price>
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </Grid>
          </Container>
        </Section>

        <ContactSection id="contact">
          <Shine />
          <Container>
            <ContactCard>
              <Title style={{ color: "#fff" }}>Contactez-nous</Title>
              <Subtitle style={{ color: "rgba(255,255,255,0.85)" }}>
                Envoyez-nous votre demande, on vous répond rapidement.
              </Subtitle>

              <Form>
                <Input placeholder="Nom complet" />
                <Input placeholder="Téléphone" />
                <Input placeholder="Ville" />
                <Input placeholder="Pays" />
                <Textarea placeholder="Votre message" />
                <Button type="button">Envoyer</Button>
              </Form>
            </ContactCard>
          </Container>
        </ContactSection>
      </Main>
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      products: getProducts(),
    },
  };
}
