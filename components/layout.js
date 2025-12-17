// components/Layout.jsx
import React from "react";
import Link from "next/link";
import { styled } from "@mui/system";

const Page = styled("div")({
  overflowX: "hidden",
  background: "#f7f7fb",
  color: "#0f172a",
  fontFamily:
    'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
});

const Header = styled("header")({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 50,
  background: "rgba(255,255,255,0.82)",
  backdropFilter: "blur(10px)",
  borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
});

const Nav = styled("nav")({
  maxWidth: 1200,
  margin: "0 auto",
  height: 64,
  padding: "0 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

const Logo = styled("a")({
  fontWeight: 900,
  letterSpacing: "-0.02em",
  fontSize: 18,
  color: "#0f172a",
  textDecoration: "none",
});

const NavLinks = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: 18,
  fontSize: 13,
  fontWeight: 700,
  color: "#111827",
});

const NavLink = styled("a")({
  textDecoration: "none",
  color: "inherit",
  opacity: 0.85,
  transition: "opacity .2s ease",
  ":hover": { opacity: 1 },
});

const HeaderOffset = styled("div")({
  height: 64,
});

const Footer = styled("footer")({
  background: "#000",
  color: "rgba(255,255,255,0.8)",
  padding: "42px 0",
});

const FooterInner = styled("div")({
  maxWidth: 1200,
  margin: "0 auto",
  padding: "0 24px",
  textAlign: "center",
});

const FooterLogo = styled("div")({
  color: "#fff",
  fontWeight: 900,
  fontSize: 16,
  marginBottom: 10,
});

const FooterLinks = styled("div")({
  display: "flex",
  gap: 16,
  justifyContent: "center",
  flexWrap: "wrap",
  marginTop: 12,
  fontSize: 13,
});

const FooterLink = styled("a")({
  color: "rgba(255,255,255,0.85)",
  textDecoration: "none",
  transition: "color .2s ease",
  ":hover": { color: "#fff" },
});

export default function Layout({ children }) {
  return (
    <Page>
      <Header>
        <Nav>
          <Link href="/" passHref legacyBehavior>
            <Logo>LOGO • Parfumerie Jaouad</Logo>
          </Link>

          <NavLinks>
            <NavLink href="/#home">Accueil</NavLink>
            <NavLink href="/#video">Vidéo</NavLink>
            <NavLink href="/#products">Parfums</NavLink>
            <NavLink href="/#contact">Contact</NavLink>
          </NavLinks>
        </Nav>
      </Header>

      <HeaderOffset />

      {children}

      <Footer>
        <FooterInner>
          <FooterLogo>LOGO • Parfumerie Jaouad</FooterLogo>
          <div>© 2025 Parfumerie Jaouad — Tous droits réservés.</div>
          <FooterLinks>
            <FooterLink href="#">YouTube</FooterLink>
            <FooterLink href="#">Instagram</FooterLink>
            <FooterLink href="#">Facebook</FooterLink>
            <FooterLink href="https://wa.me/212600000000">
              WhatsApp (+212 6 00 00 00 00)
            </FooterLink>
          </FooterLinks>
        </FooterInner>
      </Footer>
    </Page>
  );
}
