"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Box, LayoutDashboard, Plus, Search, Trash2, Upload, X, ExternalLink, LockKeyhole } from "lucide-react";

type Product = { id: string; name: string; category: string | null; image_url: string | null; is_featured: boolean; price: number | string };

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [code, setCode] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productError, setProductError] = useState("");
  const [savingProduct, setSavingProduct] = useState(false);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Barber Chairs & Equipment", price: "", image: "", featured: false });

  useEffect(() => {
    fetch("/api/admin-login")
      .then(res => res.json())
      .then(data => setAuthenticated(Boolean(data.authenticated)))
      .catch(() => setAuthenticated(false))
      .finally(() => setCheckingAccess(false));
  }, []);

  async function loadProducts() {
    setProductError("");
    try {
      const response = await fetch("/api/products", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not load products.");
      setProducts(result.products || []);
    } catch (error) {
      setProductError(error instanceof Error ? error.message : "Could not load products.");
    } finally {
      setReady(true);
    }
  }

  useEffect(() => {
    if (authenticated) loadProducts();
  }, [authenticated]);

  const filtered = useMemo(() => products.filter(p => `${p.name} ${p.category || ""}`.toLowerCase().includes(query.toLowerCase())), [products, query]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);
    try {
      const response = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const result = await response.json();
      if (!response.ok) {
        setLoginError(result.error || "Unable to verify the code.");
        return;
      }
      setAuthenticated(true);
      setCode("");
    } catch {
      setLoginError("Could not connect. Please try again.");
    } finally {
      setLoggingIn(false);
    }
  }

  async function logout() {
    await fetch("/api/admin-login", { method: "DELETE" });
    setAuthenticated(false);
    setReady(false);
  }

  async function addProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.image || form.price.trim() === "") {
      setProductError("Enter a product name, price, and upload an image.");
      return;
    }
    setSavingProduct(true);
    setProductError("");
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name.trim(), category: form.category, price: Number(form.price), imageData: form.image, featured: form.featured }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not save product.");
      setProducts(prev => [result.product, ...prev]);
      setForm({ name: "", category: "Barber Chairs & Equipment", price: "", image: "", featured: false });
      setShowForm(false);
    } catch (error) {
      setProductError(error instanceof Error ? error.message : "Could not save product.");
    } finally {
      setSavingProduct(false);
    }
  }

  async function removeProduct(id: string) {
    if (!window.confirm("Delete this product from the catalogue?")) return;
    try {
      const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not delete product.");
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      setProductError(error instanceof Error ? error.message : "Could not delete product.");
    }
  }

  if (checkingAccess) {
    return <main className="admin-login-shell"><div className="admin-login-card"><span className="admin-brand-mark">B</span><h1>Checking access…</h1><p>Please wait a moment.</p></div></main>;
  }

  if (!authenticated) {
    return (
      <main className="admin-login-shell">
        <form className="admin-login-card" onSubmit={login}>
          <a className="admin-login-home" href="/"><ArrowLeft size={16} /> Back to website</a>
          <span className="admin-brand-mark login-brand-mark">B</span>
          <span className="section-kicker">BISI INTERIORS</span>
          <h1>Admin access</h1>
          <p>Enter your admin access code to open the dashboard.</p>
          <label htmlFor="admin-code">Access code</label>
          <div className="admin-code-field"><LockKeyhole size={18} /><input id="admin-code" type="password" value={code} onChange={e => setCode(e.target.value)} placeholder="Enter your code" autoComplete="current-password" required /></div>
          {loginError && <p className="admin-login-error" role="alert">{loginError}</p>}
          <button className="admin-login-submit" type="submit" disabled={loggingIn}>{loggingIn ? "Checking…" : "Unlock dashboard"}</button>
          <small>Your code is checked on the server.</small>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/"><span className="admin-brand-mark">B</span><span><strong>Bisi Interiors</strong><small>ADMIN CONSOLE</small></span></a>
        <div className="sidebar-label">WORKSPACE</div>
        <a className="sidebar-link selected" href="/admin"><LayoutDashboard size={18} /> Dashboard</a>
        <a className="sidebar-link" href="#inventory"><Box size={18} /> Products <span className="side-count">{products.length}</span></a>
        <div className="sidebar-bottom"><a href="/" className="sidebar-link"><ArrowLeft size={18} /> View storefront</a><button className="admin-logout-button" onClick={logout}>Lock dashboard</button><p>Secure admin<br />Supabase connected</p></div>
      </aside>
      <section className="admin-main">
        <header className="admin-topbar"><div><span className="admin-breadcrumb">Workspace /</span> <strong>Dashboard</strong></div><a href="/" className="view-site-link">View website <ExternalLink size={15} /></a></header>
        <div className="admin-content">
          <div className="admin-welcome"><div><span className="section-kicker">BISI INTERIORS</span><h1>Product dashboard</h1><p>Manage the products shown in your catalogue.</p></div><button className="admin-add-button" onClick={() => setShowForm(true)}><Plus size={18} /> Add product</button></div>
          <div className="admin-stat-grid">
            <div className="admin-stat"><span className="stat-icon"><Box size={20} /></span><span>Total products</span><strong>{products.length}</strong><small>In your catalogue</small></div>
            <div className="admin-stat"><span className="stat-icon"><LayoutDashboard size={20} /></span><span>Featured products</span><strong>{products.filter(p => p.is_featured).length}</strong><small>Marked as featured</small></div>
            <div className="admin-stat"><span className="stat-icon"><Upload size={20} /></span><span>Storage status</span><strong className="status-local">Connected</strong><small>Supabase database</small></div>
          </div>
          {productError && <p className="admin-login-error" role="alert">{productError}</p>}
          <section className="admin-products-panel" id="inventory">
            <div className="panel-heading"><div><h2>Product inventory</h2><p>Add, review, and remove catalogue products.</p></div><label className="admin-search"><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products..." /></label></div>
            <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>PRODUCT</th><th>CATEGORY</th><th>PRICE</th><th>STATUS</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>
              {filtered.map(p => <tr key={p.id}><td><div className="admin-product-cell"><div className="admin-thumb">{p.image_url ? <img src={p.image_url} alt="" /> : <Box size={22} />}</div><div><strong>{p.name}</strong></div></div></td><td>{p.category}</td><td>₦{Number(p.price || 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td><td><span className={`product-status ${p.is_featured ? "featured-status" : ""}`}>{p.is_featured ? "Featured" : "Active"}</span></td><td><button className="delete-button" onClick={() => removeProduct(p.id)} aria-label={`Remove ${p.name}`}><Trash2 size={17} /></button></td></tr>)}
              {filtered.length === 0 && <tr><td colSpan={5} className="empty-table">No products found. Try another search or add a product.</td></tr>}
            </tbody></table></div>
            <div className="panel-foot">Showing {filtered.length} of {products.length} products <span>Changes sync through Supabase.</span></div>
          </section>
          
        </div>
      </section>

      {showForm && <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
        <section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="add-product-title">
          <div className="modal-heading"><div><span className="section-kicker">CATALOGUE MANAGEMENT</span><h2 id="add-product-title">Add a product</h2></div><button className="modal-close" onClick={() => setShowForm(false)} aria-label="Close"><X /></button></div>
          <form onSubmit={addProduct} className="product-form">
            <label>Product name *<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Premium Barber Chair" /></label>
            <div className="form-row"><label>Category<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}><option>Barber Chairs & Equipment</option><option>Salon Furniture & Equipment</option><option>Reception & Waiting Area</option><option>Tools & Accessories</option><option>Interior Design Solutions</option><option>Salon Equipment</option><option>Shampoo Beds & Wash Units</option><option>Clippers & Accessories</option><option>Salon Stations & Mirrors</option><option>Office Chairs</option><option>Office Desks</option><option>Office Furniture</option><option>Other</option></select></label><label>Price (₦) *<input required type="number" min="0" max="9999999999.99" step="0.01" inputMode="decimal" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="e.g. 250000" /></label></div>
            <label>Product image *<input type="file" accept="image/*" onChange={e => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (file.size > 2 * 1024 * 1024) {
                alert("Please choose an image smaller than 2 MB.");
                e.currentTarget.value = "";
                return;
              }
              const reader = new FileReader();
              reader.onload = () => setForm(current => ({ ...current, image: String(reader.result || "") }));
              reader.readAsDataURL(file);
            }} /><small>Choose an image from your device (maximum 2 MB). Images are uploaded to secure project storage.</small></label>
            {form.image && <div className="product-image-preview"><img src={form.image} alt="Product preview" /><button type="button" className="cancel-button" onClick={() => setForm({ ...form, image: "" })}>Remove image</button></div>}
            
            <label className="featured-check"><input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} /> Mark as featured product</label>
            <div className="modal-actions"><button type="button" className="cancel-button" onClick={() => setShowForm(false)}>Cancel</button><button type="submit" className="admin-add-button" disabled={savingProduct}><Plus size={17} /> {savingProduct ? "Saving…" : "Save product"}</button></div>
          </form>
        </section>
      </div>}
    </main>
  );
}
