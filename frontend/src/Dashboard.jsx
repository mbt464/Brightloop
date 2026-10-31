import React, { useMemo, useState } from 'react';
import {
  LayoutDashboard, Repeat2, Users, Package, FileText, CreditCard,
  BadgePercent, ChartNoAxesCombined, Settings, Search, Bell, ChevronDown,
  ArrowUpRight, ArrowDownRight, Plus, Download, MoreHorizontal, CalendarDays,
  CircleHelp, Menu, X, Check, Clock3, AlertCircle, CircleDollarSign,
  TrendingUp, Sparkles, Filter, ArrowRight, Command, SlidersHorizontal
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

const allNav = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Subscriptions', icon: Repeat2, count: '128' },
  { label: 'Customers', icon: Users },
  { label: 'Products & Plans', icon: Package },
  { label: 'Invoices', icon: FileText, count: '8' },
  { label: 'Payments', icon: CreditCard },
  { label: 'Discounts', icon: BadgePercent },
  { label: 'Reports', icon: ChartNoAxesCombined },
];
const staffPages = new Set(['Overview', 'Subscriptions', 'Customers', 'Invoices', 'Payments']);
const displayName = user => `${user?.full_name || user?.email?.split('@')[0] || 'there'}`;
const initials = user => (displayName(user).split(/\s+/).map(p => p[0]).slice(0,2).join('') || 'BL').toUpperCase();
const revenueData = [
  { month: 'May', revenue: 18500, previous: 14200 },
  { month: 'Jun', revenue: 22400, previous: 16800 },
  { month: 'Jul', revenue: 21100, previous: 17400 },
  { month: 'Aug', revenue: 27800, previous: 19200 },
  { month: 'Sep', revenue: 25400, previous: 20800 },
  { month: 'Oct', revenue: 32680, previous: 23100 },
];
const bars = [
  { day: 'Mon', value: 4200 }, { day: 'Tue', value: 6100 },
  { day: 'Wed', value: 4900 }, { day: 'Thu', value: 7600 },
  { day: 'Fri', value: 5800 }, { day: 'Sat', value: 3400 },
  { day: 'Sun', value: 5100 },
];
const initialInvoices = [
  { id: 'INV-2026-0842', customer: 'Northstar Studio', initials: 'NS', color: 'lavender', date: 'Oct 30, 2026', due: 'Nov 06, 2026', amount: '₹24,800', status: 'Paid' },
  { id: 'INV-2026-0841', customer: 'Vertex Labs', initials: 'VL', color: 'mint', date: 'Oct 29, 2026', due: 'Nov 05, 2026', amount: '₹18,500', status: 'Pending' },
  { id: 'INV-2026-0840', customer: 'Pixel & Co.', initials: 'PC', color: 'peach', date: 'Oct 28, 2026', due: 'Nov 04, 2026', amount: '₹12,200', status: 'Overdue' },
  { id: 'INV-2026-0839', customer: 'Aster Digital', initials: 'AD', color: 'blue', date: 'Oct 27, 2026', due: 'Nov 03, 2026', amount: '₹36,000', status: 'Paid' },
  { id: 'INV-2026-0838', customer: 'Monarch Systems', initials: 'MS', color: 'pink', date: 'Oct 26, 2026', due: 'Nov 02, 2026', amount: '₹9,600', status: 'Pending' },
];
const initialSubs = [
  { id: 'SUB-1048', customer: 'Northstar Studio', plan: 'Business Annual', date: 'Oct 28, 2026', amount: '₹24,800', status: 'Active' },
  { id: 'SUB-1047', customer: 'Vertex Labs', plan: 'Pro Monthly', date: 'Oct 27, 2026', amount: '₹18,500', status: 'Active' },
  { id: 'SUB-1046', customer: 'Pixel & Co.', plan: 'Starter Monthly', date: 'Oct 25, 2026', amount: '₹12,200', status: 'Pending' },
  { id: 'SUB-1045', customer: 'Aster Digital', plan: 'Enterprise Annual', date: 'Oct 24, 2026', amount: '₹36,000', status: 'Active' },
];

function Status({ children }) {
  const cls = children.toLowerCase();
  return <span className={`status ${cls}`}><i />{children}</span>;
}
function Dashboard({ user, onLogout }) {
  const isAdmin = user.role === 'admin';
  const nav = isAdmin ? allNav : allNav.filter(item => staffPages.has(item.label));
  const [active, setActive] = useState('Overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [period, setPeriod] = useState('Last 6 months');
  const [invoiceFilter, setInvoiceFilter] = useState('All');
  const [invoices, setInvoices] = useState(initialInvoices);
  const [subs, setSubs] = useState(initialSubs);
  const [toast, setToast] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPlan, setNewPlan] = useState('Pro Monthly');

  const notify = (msg) => { setToast(msg); window.setTimeout(() => setToast(''), 2600); };
  const filteredInvoices = useMemo(() => invoices.filter(i =>
    (invoiceFilter === 'All' || i.status === invoiceFilter) &&
    `${i.id} ${i.customer}`.toLowerCase().includes(query.toLowerCase())
  ), [invoices, invoiceFilter, query]);
  const filteredSubs = useMemo(() => subs.filter(s =>
    `${s.id} ${s.customer} ${s.plan}`.toLowerCase().includes(query.toLowerCase())
  ), [subs, query]);

  const addSubscription = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setSubs([{ id: `SUB-${1050 + subs.length}`, customer: newName, plan: newPlan, date: 'Oct 31, 2026', amount: newPlan.includes('Annual') ? '₹24,800' : '₹18,500', status: 'Pending' }, ...subs]);
    setNewName(''); setShowCreate(false); setActive('Subscriptions'); notify('Subscription draft created');
  };

  const Sidebar = () => (
    <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
      <div className="brand">
        <div className="brand-mark"><span /><span /><span /></div>
        <span>brightloop</span><button className="mobile-close" onClick={() => setMobileOpen(false)}><X size={18}/></button>
      </div>
      <div className="workspace">
        <div className="workspace-icon">B</div>
        <div><strong>Brightloop Software</strong><small>{isAdmin ? "Administrator" : "Staff"} workspace</small></div>
        <ChevronDown size={15} className="muted-icon"/>
      </div>
      <div className="nav-label">WORKSPACE</div>
      <nav>
        {nav.map(item => {
          const Icon = item.icon;
          return <button key={item.label} onClick={() => {setActive(item.label);setMobileOpen(false);setQuery('');}} className={`nav-item ${active === item.label ? 'selected' : ''}`}>
            <Icon size={18}/><span>{item.label}</span>{isAdmin && item.count && <small>{item.count}</small>}
          </button>
        })}
      </nav>
      <div className="sidebar-bottom">
        <div className="help-card"><div className="help-icon"><CircleHelp size={17}/></div><strong>Need a hand?</strong><p>Visit our help centre for tips and guides.</p><button onClick={() => notify('Help centre coming soon')}>Open help centre <ArrowUpRight size={13}/></button></div>
        <button className="nav-item settings" onClick={() => notify('Settings are coming soon')}><Settings size={18}/>Settings</button>
        <div className="profile"><div className="avatar admin">{initials(user)}</div><div><strong>{displayName(user)}</strong><small>{isAdmin ? "Administrator" : "Staff member"}</small></div><MoreHorizontal size={18}/></div>
      </div>
    </aside>
  );

  const metricCards = [
    { title: 'Monthly recurring revenue', value: '₹8,42,680', change: '+12.8%', note: 'vs. last month', icon: CircleDollarSign, tone: 'purple', up: true },
    { title: 'Active subscriptions', value: '1,284', change: '+8.2%', note: 'vs. last month', icon: Repeat2, tone: 'blue', up: true },
    { title: 'Revenue collected', value: '₹6,18,420', change: '+6.4%', note: 'vs. last month', icon: TrendingUp, tone: 'green', up: true },
    { title: 'Outstanding payments', value: '₹1,24,260', change: '8 invoices', note: 'need attention', icon: Clock3, tone: 'orange', up: false },
  ];


const renderStaffOverview = () => <>
  <div className="welcome-row"><div><div className="eyebrow">TEAM WORKSPACE</div><h1>Welcome back, {displayName(user)} ✦</h1><p className="subheading">Your day-to-day subscriptions and customer tasks.</p></div></div>
  <section className="panel placeholder-panel"><div className="placeholder-icon"><Users size={24}/></div><h2>Staff workspace</h2><p>Use the sidebar to explore subscriptions, customers, invoices and payments. The sample records shown here are illustrative; real backend records and staff permissions will be connected in the next phase.</p><button className="button primary" onClick={() => setActive('Subscriptions')}>View subscriptions <ArrowRight size={15}/></button></section>
</>;

  const renderOverview = () => <>
    <div className="welcome-row">
      <div><div className="eyebrow"><span className="live-dot"/> BRIGHTLOOP WORKSPACE</div><h1>Welcome back, {displayName(user)} <span className="wave">✦</span></h1><p className="subheading">Here's what's happening with your subscriptions today.</p></div>
      <div className="welcome-actions">{isAdmin && <button className="button secondary" onClick={() => notify("Reports are a demo in this version")}><Download size={16}/> Export report</button>}<button className="button primary" onClick={() => setShowCreate(true)}><Plus size={17}/> New subscription (demo)</button></div>
    </div>
    <div className="metric-grid">
      {metricCards.map((m) => {const Icon=m.icon;return <div className="metric-card" key={m.title}>
        <div className="metric-top"><span>{m.title}</span><div className={`metric-icon ${m.tone}`}><Icon size={18}/></div></div>
        <div className="metric-value">{m.value}</div>
        <div className="metric-foot"><span className={`change ${m.up?'positive':'neutral'}`}>{m.up?<ArrowUpRight size={14}/>:<AlertCircle size={13}/>} {m.change}</span><span>{m.note}</span></div>
      </div>})}
    </div>
    <div className="chart-grid">
      <section className="panel revenue-panel">
        <div className="panel-head"><div><h3>Revenue overview</h3><p>Track your revenue performance over time</p></div><select value={period} onChange={e=>setPeriod(e.target.value)}><option>Last 6 months</option><option>Last 30 days</option><option>This year</option></select></div>
        <div className="chart-legend"><span><i className="legend-current"/> This year <b>₹1,48,880</b></span><span><i className="legend-previous"/> Previous year</span></div>
        <div className="revenue-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={revenueData} margin={{top:10,right:8,left:-20,bottom:0}}><defs><linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7868e8" stopOpacity={0.22}/><stop offset="95%" stopColor="#7868e8" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#edf0f5" vertical={false}/><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill:'#9aa2b2',fontSize:12}} dy={10}/><YAxis axisLine={false} tickLine={false} tick={{fill:'#9aa2b2',fontSize:11}} tickFormatter={v=>`₹${v/1000}k`}/><Tooltip formatter={v=>`₹${v.toLocaleString('en-IN')}`} contentStyle={{border:'1px solid #edf0f5',borderRadius:12,fontSize:12}}/><Area type="monotone" dataKey="previous" stroke="#cbd0dc" strokeWidth={2} strokeDasharray="5 5" fill="transparent"/><Area type="monotone" dataKey="revenue" stroke="#7969e8" strokeWidth={2.7} fill="url(#revFill)" activeDot={{r:5,strokeWidth:0}}/></AreaChart></ResponsiveContainer></div>
      </section>
      <section className="panel activity-panel">
        <div className="panel-head"><div><h3>Payment activity</h3><p>Collected this week</p></div><button className="icon-button" onClick={()=>notify('Showing sample weekly payment activity')}><MoreHorizontal size={19}/></button></div>
        <div className="activity-total">₹37,100 <span className="change positive"><ArrowUpRight size={14}/> 9.6%</span></div>
        <div className="activity-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={bars} margin={{top:8,right:0,left:-25,bottom:0}}><CartesianGrid stroke="#edf0f5" vertical={false}/><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill:'#9aa2b2',fontSize:11}} dy={8}/><YAxis hide/><Tooltip cursor={{fill:'#f5f3ff'}} formatter={v=>`₹${v.toLocaleString('en-IN')}`}/><Bar dataKey="value" fill="#8b7cf0" radius={[5,5,0,0]} maxBarSize={24}/></BarChart></ResponsiveContainer></div>
        <div className="activity-foot"><span><i className="dot-purple"/> Successful payments</span><strong>42 transactions</strong></div>
      </section>
    </div>
    <div className="bottom-grid">
      <section className="panel table-panel">
        <div className="panel-head"><div><h3>Recent invoices</h3><p>A quick look at your latest billing activity</p></div><button className="text-link" onClick={()=>setActive('Invoices')}>View all <ArrowRight size={15}/></button></div>
        <InvoiceTable rows={invoices.slice(0,4)} />
      </section>
      <section className="panel renewal-panel">
        <div className="panel-head"><div><h3>Upcoming renewals</h3><p>Subscriptions renewing soon</p></div><button className="icon-button" onClick={()=>notify('Renewal list refreshed')}><MoreHorizontal size={19}/></button></div>
        <div className="renewal-list">
          {[['Northstar Studio','Business Annual','Nov 02','₹24,800','NS','lavender'],['Vertex Labs','Pro Monthly','Nov 03','₹18,500','VL','mint'],['Aster Digital','Enterprise Annual','Nov 05','₹36,000','AD','blue']].map(r=><div className="renewal-item" key={r[0]}><div className={`avatar ${r[5]}`}>{r[4]}</div><div className="renewal-info"><strong>{r[0]}</strong><small>{r[1]}</small></div><div className="renewal-date"><strong>{r[3]}</strong><small>{r[2]}</small></div></div>)}
        </div><button className="renewal-link" onClick={()=>setActive('Subscriptions')}>See all renewals <ArrowRight size={14}/></button>
      </section>
    </div>
  </>;

  const InvoiceTable = ({rows}) => <div className="table-wrap"><table><thead><tr><th>INVOICE</th><th>CUSTOMER</th><th>ISSUED</th><th>AMOUNT</th><th>STATUS</th><th></th></tr></thead><tbody>{rows.map((r,i)=><tr key={r.id}><td className="invoice-id">{r.id}</td><td><div className="customer-cell"><div className={`avatar ${r.color}`}>{r.initials}</div><strong>{r.customer}</strong></div></td><td className="date-cell">{r.date}</td><td className="amount-cell">{r.amount}</td><td><Status>{r.status}</Status></td><td><button className="row-more" onClick={()=>notify(`${r.id} selected`)}><MoreHorizontal size={17}/></button></td></tr>)}</tbody></table></div>;

  const renderInvoices = () => <><PageHeading title="Invoices" desc="Create, manage and keep track of customer invoices." action="Create invoice" onAction={()=>notify('Invoice creation form coming soon')}/><div className="metric-grid compact">{[['Total invoices','248'],['Paid','196'],['Pending','44'],['Overdue','8']].map((x,i)=><div className="metric-card mini" key={x[0]}><span>{x[0]}</span><strong>{x[1]}</strong><small>{['This month','79% of total','Needs follow-up','Needs attention'][i]}</small></div>)}</div><section className="panel full-table"><div className="table-toolbar"><div className="filter-tabs">{['All','Paid','Pending','Overdue'].map(f=><button className={invoiceFilter===f?'active':''} onClick={()=>setInvoiceFilter(f)} key={f}>{f}</button>)}</div><button className="button secondary small" onClick={()=>notify('Filters opened')}><SlidersHorizontal size={15}/> Filters</button></div><InvoiceTable rows={filteredInvoices}/></section></>;

  const renderSubscriptions = () => <><PageHeading title="Subscriptions" desc="Manage every customer subscription, from quotation to renewal." action="New subscription" onAction={()=>setShowCreate(true)}/><div className="metric-grid compact">{[['All subscriptions','1,428'],['Active','1,284'],['Pending','36'],['Closed','108']].map((x,i)=><div className="metric-card mini" key={x[0]}><span>{x[0]}</span><strong>{x[1]}</strong><small>{['Across all plans','89.9% of total','Awaiting confirmation','This year'][i]}</small></div>)}</div><section className="panel full-table"><div className="table-toolbar"><strong className="table-title">All subscriptions <span>({subs.length} shown)</span></strong><button className="button secondary small" onClick={()=>notify('Subscription filters opened')}><Filter size={15}/> Filter</button></div><div className="table-wrap"><table><thead><tr><th>SUBSCRIPTION</th><th>CUSTOMER</th><th>PLAN</th><th>START DATE</th><th>AMOUNT</th><th>STATUS</th></tr></thead><tbody>{filteredSubs.map(s=><tr key={s.id}><td className="invoice-id">{s.id}</td><td className="amount-cell">{s.customer}</td><td>{s.plan}</td><td className="date-cell">{s.date}</td><td className="amount-cell">{s.amount}</td><td><Status>{s.status}</Status></td></tr>)}</tbody></table></div></section></>;

  const genericContent = {
    'Customers': ['Customers','Keep customer profiles and their subscription history in one place.','1,082','New customer'],
    'Products & Plans': ['Products & Plans','Manage product catalogues, variants, pricing and billing intervals.','24 products','Add product'],
    'Payments': ['Payments','Monitor incoming payments and match them to the right invoices.','₹6,18,420 collected','Record payment'],
    'Discounts': ['Discounts','Create discount rules with limits, conditions and validity dates.','12 active rules','Create discount'],
    'Reports': ['Reports','Understand recurring revenue, collections and subscription performance.','October 2026','Export report']
  };
  const renderGeneric = () => {
    const data=genericContent[active] || ['Overview','Your workspace at a glance.','',''];
    return <><PageHeading title={data[0]} desc={data[1]} action={data[3]} onAction={()=>notify(`${data[3]} flow coming soon`)}/><section className="panel placeholder-panel"><div className="placeholder-icon"><Sparkles size={24}/></div><h2>{active} workspace</h2><p>This section is ready for the next stage of the Brightloop platform. Connect the backend to turn these controls into live records.</p><div className="placeholder-stats"><div><strong>{data[2]}</strong><span>Current workspace data</span></div><div><strong>Live-ready UI</strong><span>Frontend foundation</span></div></div><button className="button primary" onClick={()=>setActive('Overview')}>Back to overview <ArrowRight size={15}/></button></section></>;
  };

  return <div className="app-shell">
    <Sidebar />
    {mobileOpen && <div className="scrim" onClick={()=>setMobileOpen(false)}/>}
    <main className="main">
      <header className="topbar"><button className="mobile-menu" onClick={()=>setMobileOpen(true)}><Menu size={20}/></button><div className="breadcrumb">Workspace <span>/</span> <strong>{active}</strong></div><div className="top-actions"><div className="global-search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search anything..."/><kbd><Command size={10}/> K</kbd></div><button className="top-icon" onClick={()=>notify('You’re all caught up')}><Bell size={18}/><i/></button><div className="top-profile"><div className="avatar admin">{initials(user)}</div><span className="session-role">{isAdmin ? "Admin" : "Staff"}</span><button className="signout" onClick={onLogout} title="Log out">Log out</button></div></div></header>
      <div className="content"><div className="workspace-demo-notice" role="status">Preview interface — subscription, invoice and revenue figures are sample data, not live Supabase records.</div>{active==='Overview'?(isAdmin?renderOverview():renderStaffOverview()):active==='Invoices'?renderInvoices():active==='Subscriptions'?renderSubscriptions():renderGeneric()}</div>
      <footer className="footer"><span>© 2026 Brightloop Software</span><span>Made for smoother subscriptions <span className="footer-heart">✦</span></span></footer>
    </main>
    {showCreate && <div className="modal-backdrop" onClick={()=>setShowCreate(false)}><form className="modal" onSubmit={addSubscription} onClick={e=>e.stopPropagation()}><div className="modal-head"><div><span className="eyebrow">SUBSCRIPTION SETUP</span><h2>Create subscription</h2></div><button type="button" className="icon-button" onClick={()=>setShowCreate(false)}><X size={19}/></button></div><label>Customer name<input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="e.g. Northstar Studio" required/></label><label>Choose a plan<select value={newPlan} onChange={e=>setNewPlan(e.target.value)}><option>Pro Monthly</option><option>Business Annual</option><option>Starter Monthly</option><option>Enterprise Annual</option></select></label><div className="modal-note"><AlertCircle size={15}/> This creates a demo subscription record. Billing is not connected.</div><div className="modal-actions"><button type="button" className="button secondary" onClick={()=>setShowCreate(false)}>Cancel</button><button className="button primary" type="submit"><Plus size={16}/> Create subscription</button></div></form></div>}
    {toast && <div className="toast"><Check size={16}/>{toast}</div>}
  </div>;
}
function PageHeading({title,desc,action,onAction}) { return <div className="welcome-row page-heading"><div><div className="eyebrow"><span className="live-dot"/> BRIGHTLOOP WORKSPACE</div><h1>{title}</h1><p className="subheading">{desc}</p></div><button className="button primary" onClick={onAction}><Plus size={17}/>{action}</button></div>; }
export default Dashboard;
