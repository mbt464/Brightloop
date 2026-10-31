import { useEffect, useState } from 'react';
import Home from './Home.jsx';
import Dashboard from './Dashboard.jsx';
import CustomerPortal from './CustomerPortal.jsx';
import './Dashboard.css';

const destinations = {
  admin: '/workspace/admin/',
  staff: '/workspace/staff/',
  customer: '/workspace/customer/',
};

function goto(path) {
  if (window.location.pathname !== path) {
    window.history.replaceState({}, '', path);
  }
  window.scrollTo(0, 0);
}

async function csrfToken() {
  const response = await fetch('/api/accounts/csrf/', { credentials: 'include' });
  if (!response.ok) throw new Error('Unable to obtain a security token.');
  const data = await response.json();
  return data.csrfToken;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function restoreSession() {
    try {
      const response = await fetch('/api/accounts/session/', {
        credentials: 'include', cache: 'no-store',
      });
      if (!response.ok) throw new Error('Could not check your login session.');
      const data = await response.json();
      if (data.authenticated && destinations[data.user?.role]) {
        setUser(data.user);
        goto(destinations[data.user.role]);
      } else {
        setUser(null);
        if (window.location.pathname.startsWith('/workspace/')) goto('/');
      }
      setError('');
    } catch (err) {
      setError(err.message || 'Could not reach Brightloop. Please retry.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { restoreSession(); }, []);

  function onAuthenticated(authenticatedUser) {
    if (!destinations[authenticatedUser?.role]) {
      setError('Unknown account role. Please contact your administrator.');
      return;
    }
    setUser(authenticatedUser);
    goto(destinations[authenticatedUser.role]);
  }

  async function onLogout() {
    try {
      const token = await csrfToken();
      const response = await fetch('/api/accounts/logout/', {
        method: 'POST', credentials: 'include',
        headers: { 'X-CSRFToken': token },
      });
      if (!response.ok) throw new Error('Logout failed. Please try again.');
      setUser(null);
      setError('');
      goto('/');
    } catch (err) {
      setError(err.message || 'Unable to log out.');
    }
  }

  if (loading) return <div className="brightloop-loading" role="status">Opening Brightloop…</div>;
  if (error) return <div className="brightloop-error" role="alert"><p>{error}</p><button onClick={() => { setLoading(true); restoreSession(); }}>Retry</button></div>;
  if (!user) return <Home onAuthenticated={onAuthenticated} />;
  return <div className="dashboard-root">
    {user.role === 'customer'
      ? <CustomerPortal user={user} onLogout={onLogout}/>
      : <Dashboard user={user} onLogout={onLogout}/>}
  </div>;
}
