import {
  ArrowRight, Search, UserRound, ShoppingCart, ChevronDown,
  ShieldCheck, Truck, Headset, Award, Armchair, Scissors, Sofa, Lamp, Menu
} from "lucide-react";

const categories = [
  { title: "Barber Chairs & Equipment", subtitle: "Professional comfort", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=85" },
  { title: "Salon Furniture & Equipment", subtitle: "Designed for professionals", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=85" },
  { title: "Reception & Waiting Area", subtitle: "Make a lasting first impression", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85" },
  { title: "Tools & Accessories", subtitle: "Tools for every professional", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=85" },
  { title: "Interior Design Solutions", subtitle: "Bring your vision to life", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85" },
];

import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type Product = { id: string; name: string; category: string | null; image_url: string | null; is_featured: boolean; price: number | string };

// Always read the catalogue on the server using the server-only Supabase key.
// This avoids public-key/RLS configuration mismatches and prevents stale product lists.
export const dynamic = "force-dynamic";

async function getProducts(): Promise<Product[]> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("products")
      .select("id,name,category,image_url,is_featured,price")
      .eq("is_available", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Could not load public product catalogue:", error.message);
      return [];
    }
    return (data ?? []) as Product[];
  } catch (error) {
    console.error("Could not initialize public product catalogue:", error);
    return [];
  }
}

function Brand() {
  return (
    <a className="brand" href="#home" aria-label="Bisi Interiors home">
      <img className="brand-emblem" src="/images/bisi-monogram.jpg" alt="" />
      <img className="brand-wordmark" src="/images/bisi-wordmark.jpg" alt="Bisi Interiors — Designing Spaces. Creating Experiences." />
    </a>
  );
}

export default async function Home() {
  const products = await getProducts();
  const whatsappNumber = "2349032959952";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello Bisi Interiors, I would like to enquire about a product.")}`;
  return (
    <main>
      <header className="site-header">
        <div className="header-inner">
          <Brand />
          <nav className="main-nav" aria-label="Main navigation">
            <a className="nav-link active" href="#home">Home</a>
            <a className="nav-link" href="#products">Shop <ChevronDown size={14} /></a>
            <a className="nav-link" href="#categories">Categories <ChevronDown size={14} /></a>
            <a className="nav-link" href="#about">About Us</a>
            <a className="nav-link" href="#contact">Contact</a>
          </nav>
          <div className="header-actions">
            <a aria-label="Search products" className="icon-button" href="#products"><Search size={24} strokeWidth={1.7} /></a>
            <a aria-label="Admin dashboard" className="icon-button account-icon" href="/admin"><UserRound size={24} strokeWidth={1.7} /></a>
            <a aria-label="Shopping cart" className="icon-button cart-button" href="#products"><ShoppingCart size={26} strokeWidth={1.7} /><span className="cart-count">0</span></a>
          </div>
          <a href="/admin" className="mobile-menu" aria-label="Open admin dashboard"><Menu /></a>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="hero-main">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" />PREMIUM BARBER COLLECTION</div>
            <h1>High End<br />Barber Chair</h1>
            <p className="hero-description">Elevate your barbershop with premium comfort<br className="desktop-break" /> and timeless style.</p>
            <div className="benefit-list"><span>Premium upholstery</span><i /><span>Adjustable headrest</span><i /><span>Integrated footrest</span></div>
          </div>
          <div className="hero-product"><img src="/images/chair.png" alt="Premium beige barber chair with chrome base and footrest" /></div>
          <div className="hero-actions">
            <a className="button button-primary" href={whatsappLink} target="_blank" rel="noreferrer">
              <span className="whatsapp-mark">◉</span>
              <span className="button-label"><strong>ENQUIRE ON WHATSAPP</strong><small>Get Price &amp; Availability</small></span>
              <ArrowRight size={19} />
            </a>
            <a className="button button-secondary" href="#products"><strong>VIEW PRODUCT DETAILS</strong><ArrowRight size={19} /></a>
          </div>
        </div>
      </section>

      <section className="section categories-section" id="categories">
        <div className="section-heading"><span className="section-kicker">EXPLORE OUR COLLECTION</span><h2>Everything for your space</h2><p>Thoughtfully selected furniture and equipment for professionals who care about every detail.</p></div>
        <div className="category-grid">
          {categories.map(({ title, subtitle, image }) => <a href="#products" className="category-card" key={title}>
            <span className="category-image"><img src={image} alt={title} loading="lazy" /></span>
            <span className="category-card-copy"><span className="category-title">{title}</span><span className="category-subtitle">{subtitle}</span><span className="category-arrow"><ArrowRight size={17} /></span></span>
          </a>)}
        </div>
      </section>

      <section className="section products-section" id="products">
        <div className="products-heading"><div><span className="section-kicker">SELECTED FOR YOU</span><h2>Featured products</h2></div><a className="text-link" href="#contact">Explore our collection <ArrowRight size={17} /></a></div>
        <div className="product-grid">
          {products.map((product) => {
            const enquiry = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello Bisi Interiors, I would like to enquire about ${product.name}.`)}`;
            return <article className="product-card" key={product.id}>
              <a href={enquiry} target="_blank" rel="noreferrer" className="product-visual" aria-label={`Enquire about ${product.name}`}>
                {product.image_url ? <img src={product.image_url} alt={product.name} /> : <span className="product-placeholder"><Armchair size={76} strokeWidth={0.9} /></span>}
              </a>
              <div className="product-info"><h3>{product.name}</h3><p className="product-price">₦{Number(product.price || 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p><a href={enquiry} target="_blank" rel="noreferrer">Enquire on WhatsApp <ArrowRight size={15} /></a></div>
            </article>;
          })}
          {products.length === 0 && <p className="empty-products">Our collection is being updated. Please enquire with us on WhatsApp.</p>}
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-mark"><Armchair size={42} strokeWidth={1.2} /></div>
        <div className="about-copy"><span className="section-kicker">ABOUT BISI INTERIORS</span><h2>Designed for the way<br />you want to feel.</h2><p>We help bring spaces to life with furniture and professional equipment chosen for comfort, quality, and timeless style. From salons and barbershops to offices and modern interiors, every detail matters.</p><a className="button button-dark" href="#contact">Get in touch <ArrowRight size={18} /></a></div>
      </section>

      <section className="contact-section" id="contact"><div><span className="section-kicker">LET'S CREATE SOMETHING GREAT</span><h2>Ready to elevate your space?</h2><p>Tell us what you need. Our team will help you find the right fit.</p></div><a className="button button-primary contact-button" href={whatsappLink} target="_blank" rel="noreferrer">Enquire on WhatsApp <ArrowRight size={18} /></a></section>

      <footer className="site-footer"><Brand /><p>Premium furniture and equipment for spaces that inspire.</p><span>© {new Date().getFullYear()} Bisi Interiors. All rights reserved.</span><a href="/admin" className="footer-admin">Admin</a></footer>
    </main>
  );
}
