import { useState } from 'react';
import { LayoutDashboard, Repeat2, FileText, CreditCard, UserRound, LogOut, Menu, X, ArrowRight } from 'lucide-react';

const pages = [
  { name: 'Overview', icon: LayoutDashboard },
  { name: 'My Subscriptions', icon: Repeat2 },
  { name: 'My Invoices', icon: FileText },
  { name: 'My Payments', icon: CreditCard },
];

export default function CustomerPortal({ user, onLogout }) {
  const [page, setPage] = useState('Overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const name = user.full_name || user.email.split('@')[0];
  const initials = (name.split(/\s+/).map(p => p[0]).slice(0,2).join('') || 'C').toUpperCase();
  return <div className="app-shell customer-portal">
    <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
      <div className="brand"><div className="brand-mark"><span/><span/><span/></div><span>brightloop</span><button className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={18}/></button></div>
      <div className="workspace"><div className="workspace-icon">B</div><div><strong>My Brightloop</strong><small>Customer workspace</small></div></div>
      <div className="nav-label">MY ACCOUNT</div>
      <nav>{pages.map(item => {const Icon = item.icon;return <button key={item.name} className={`nav-item ${page===item.name?'selected':''}`} onClick={()=>{setPage(item.name);setMobileOpen(false)}}><Icon size={18}/><span>{item.name}</span></button>})}</nav>
      <div className="sidebar-bottom"><div className="profile"><div className="avatar admin">{initials}</div><div><strong>{name}</strong><small>Customer</small></div></div><button className="nav-item settings" onClick={onLogout}><LogOut size={17}/> Log out</button></div>
    </aside>
    {mobileOpen&&<div className="scrim" onClick={()=>setMobileOpen(false)}/>}
    <main className="main">
      <header className="topbar"><button className="mobile-menu" onClick={()=>setMobileOpen(true)} aria-label="Open menu"><Menu size={20}/></button><div className="breadcrumb">My account <span>/</span> <strong>{page}</strong></div><div className="top-actions"><span className="session-role">Customer</span><div className="avatar admin">{initials}</div><button className="signout" onClick={onLogout}>Log out</button></div></header>
      <div className="content">
        <div className="welcome-row page-heading"><div><div className="eyebrow">CUSTOMER PORTAL</div><h1>{page==='Overview'?`Welcome, ${name}`:page} <span className="wave">✦</span></h1><p className="subheading">Signed in as {user.email}</p></div></div>
        {page==='Overview'?<div className="bottom-grid">
          <section className="customer-empty"><Repeat2 size={27} color="#7969e8"/><h3>My subscriptions</h3><p>Your subscriptions will appear here once the subscription backend is connected. No other customer's records are visible.</p><button className="text-link" onClick={()=>setPage('My Subscriptions')}>Open subscriptions <ArrowRight size={15}/></button></section>
          <section className="customer-empty"><FileText size={27} color="#7969e8"/><h3>My invoices</h3><p>Invoices linked to your account will be shown here once invoicing is implemented.</p><button className="text-link" onClick={()=>setPage('My Invoices')}>Open invoices <ArrowRight size={15}/></button></section>
        </div>:<section className="customer-empty"><UserRound size={28} color="#7969e8"/><h3>{page}</h3><p>You're securely signed in. This section is ready for integration with your own subscriptions, invoices and payments. No records have been loaded because those backend features aren't implemented yet.</p></section>}
      </div><footer className="footer"><span>© 2026 Brightloop Software</span><span>Customer portal</span></footer>
    </main>
  </div>;
}
