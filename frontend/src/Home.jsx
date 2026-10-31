import { useState } from 'react'
import './App.css'

const features = [
  {
    icon: '📦',
    title: 'Products & Plans',
    description: 'Create products, variants, pricing tiers, and flexible daily, weekly, monthly, or yearly plans.',
  },
  {
    icon: '🔁',
    title: 'Recurring Billing',
    description: 'Prepare renewals and generate subscription invoices automatically on the right billing date.',
  },
  {
    icon: '🧾',
    title: 'Invoices & Taxes',
    description: 'Keep invoice details accurate with configured tax rules and clear payment statuses.',
  },
  {
    icon: '🏷️',
    title: 'Smart Discounts',
    description: 'Set eligibility rules, validity dates, usage limits, and product or subscription discounts.',
  },
  {
    icon: '📊',
    title: 'Revenue Reporting',
    description: 'View active subscriptions, received payments, outstanding balances, and overdue invoices.',
  },
  {
    icon: '🔐',
    title: 'Role-Based Access',
    description: 'Give admins, staff, and customers the right tools and permissions for their accounts.',
  },
]

function Home({ onAuthenticated }) {
  const [authMode, setAuthMode] = useState(null)
  const [message, setMessage] = useState('')

  const openAuth = (mode) => {
    setAuthMode(mode)
    setMessage('')
  }

  const closeAuth = () => {
    setAuthMode(null)
    setMessage('')
  }

  
const handleSubmit = async (e) => {
  e.preventDefault()
  setMessage('')

  
if (authMode === 'login') {
  const formData = new FormData(e.currentTarget)

  try {
    // Get Django CSRF token
    const csrfResponse = await fetch(
      '/api/accounts/csrf/',
      { credentials: 'include' }
    )

    if (!csrfResponse.ok) {
      throw new Error('Unable to get security token.')
    }

    const { csrfToken } = await csrfResponse.json()

    // Send login details to Django
    const response = await fetch(
      '/api/accounts/login/',
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password'),
        }),
      }
    )

    const data = await response.json()

    if (response.ok) {
      onAuthenticated(data.user)
    } else {
      setMessage(data.error || 'Login failed.')
    }
  } catch (error) {
    setMessage(error.message || 'Unable to connect to Django.')
  }

  return
}


  const formData = new FormData(e.currentTarget)

  const userData = {
    full_name: formData.get('full_name'),
    email: formData.get('email'),
    password: formData.get('password'),
  }

  try {
    // Step 1: Get CSRF token from Django
    const csrfResponse = await fetch(
      '/api/accounts/csrf/',
      { credentials: 'include' }
    )

    if (!csrfResponse.ok) {
      throw new Error('Could not obtain the security token.')
    }

    const { csrfToken } = await csrfResponse.json()

    // Step 2: Send registration details to Django
    const response = await fetch(
      '/api/accounts/register/',
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(userData),
      }
    )

    const data = await response.json()

    if (response.ok) {
      setMessage('Account created successfully! You can log in now.')
    } else {
      const errorMessage = Object.values(data)
        .flat()
        .join(' ')

      setMessage(errorMessage || 'Registration failed.')
    }
  } catch (error) {
    setMessage(error.message || 'Unable to connect to Django.')
  }
}


  return (
    <div className="website" id="home">

      {/* NAVBAR */}
      <header className="navbar">
        <a className="logo" href="#home">
          <span className="logo-symbol">∞</span>
          Brightloop<span className="logo-dot">.</span>
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </nav>

        <div className="nav-actions">
          <button
            className="login-btn"
            onClick={() => openAuth('login')}
          >
            Log In
          </button>

          <button
            className="primary-btn nav-signup"
            onClick={() => openAuth('signup')}
          >
            Sign Up <span>↗</span>
          </button>
        </div>
      </header>

      <main>

        {/* HERO */}
        <section className="hero">
          <div className="hero-content">

            <span className="eyebrow">
              <span className="status-dot"></span>
              ALL-IN-ONE SUBSCRIPTION PLATFORM
            </span>

            <h1>
              Subscriptions made
              <span> simple.</span>
              <br />
              Business made
              <span> smarter.</span>
            </h1>

            <p>
              Manage your plans, automate recurring invoices,
              track payments, and understand your revenue.
              Everything your subscription business needs,
              all in one place.
            </p>

            <div className="hero-buttons">
              <button
                className="primary-btn large"
                onClick={() => openAuth('signup')}
              >
                Get Started Free <span>→</span>
              </button>

              <button
                className="secondary-btn"
                onClick={() => document.getElementById('about')?.scrollIntoView({
                  behavior: 'smooth'
                })}
              >
                Learn More <span>↗</span>
              </button>
            </div>

            <div className="trust">
              <span>✓ Flexible billing</span>
              <span>✓ Clear invoices</span>
              <span>✓ Revenue insights</span>
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="hero-art">
            <div className="art-glow"></div>

            <div className="art-card">

              <div className="art-top">
                <div className="art-icon">◈</div>
                <span className="live-badge">
                  <span></span> LIVE PREVIEW
                </span>
              </div>

              <h2>Subscription overview</h2>
              <p className="art-subtitle">
                Everything in one dashboard
              </p>

              <div className="art-line"></div>

              <div className="art-row">
                <span>Active subscriptions</span>
                <strong>128</strong>
              </div>

              <div className="art-row">
                <span>Upcoming renewals</span>
                <strong>24</strong>
              </div>

              <div className="art-row">
                <span>Invoices issued</span>
                <strong>96</strong>
              </div>

              <div className="art-row">
                <span>Billing status</span>
                <strong className="success-text">On track ✓</strong>
              </div>

              <div className="art-footer">
                <span>BRIGHTLOOP SOFTWARE</span>
                <span>2026</span>
              </div>
            </div>

            <div className="floating-icon floating-one">↗</div>
            <div className="floating-icon floating-two">✓</div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="features" id="features">

          <div className="section-heading">
            <span className="eyebrow">WHAT WE OFFER</span>

            <h2>
              Everything you need.
              <span> One platform.</span>
            </h2>

            <p>
              From the first quotation to the final payment,
              keep your subscription business organized.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature, index) => (
              <article className="feature-card" key={feature.title}>
                <div className="feature-card-top">
                  <div className="feature-icon">
                    {feature.icon}
                  </div>
                  <span className="feature-number">
                    0{index + 1}
                  </span>
                </div>

                <h3>{feature.title}</h3>
                <p>{feature.description}</p>

                <div className="feature-arrow">↗</div>
              </article>
            ))}
          </div>

        </section>

        {/* HOW IT WORKS */}
        <section className="workflow">
          <div className="section-heading">
            <span className="eyebrow">SIMPLE WORKFLOW</span>
            <h2>From subscription to payment.</h2>
            <p>
              Every step of your billing process, connected.
            </p>
          </div>

          <div className="workflow-grid">
            <div className="workflow-step">
              <span>01</span>
              <div>📦</div>
              <h3>Create a plan</h3>
              <p>Set up products and subscription pricing.</p>
            </div>

            <div className="workflow-connector">→</div>

            <div className="workflow-step">
              <span>02</span>
              <div>👤</div>
              <h3>Add customers</h3>
              <p>Choose customers and assign their plans.</p>
            </div>

            <div className="workflow-connector">→</div>

            <div className="workflow-step">
              <span>03</span>
              <div>🧾</div>
              <h3>Generate invoices</h3>
              <p>Prepare invoices for recurring billing.</p>
            </div>

            <div className="workflow-connector">→</div>

            <div className="workflow-step">
              <span>04</span>
              <div>💳</div>
              <h3>Record payments</h3>
              <p>Track payments and outstanding balances.</p>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="about" id="about">
          <div className="about-content">
            <span className="eyebrow">WHY BRIGHTLOOP?</span>

            <h2>
              Spend less time tracking bills.
              <span> More time growing.</span>
            </h2>

            <p>
              Replace disconnected spreadsheets, missed renewals,
              and manual invoicing with one clear workflow
              for your whole team and your customers.
            </p>

            <button
              className="primary-btn large"
              onClick={() => openAuth('signup')}
            >
              Start Your Journey <span>→</span>
            </button>
          </div>

          <div className="about-decoration">
            <span>∞</span>
            <p>One platform.</p>
            <p>Endless possibilities.</p>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer>
        <a className="logo" href="#home">
          <span className="logo-symbol">∞</span>
          Brightloop<span className="logo-dot">.</span>
        </a>

        <p>Making subscription management simple.</p>

        <div className="footer-actions">
          <button onClick={() => openAuth('login')}>Login</button>
          <button onClick={() => openAuth('signup')}>Create Account</button>
        </div>

        <p>© 2026 Brightloop Software. All rights reserved.</p>
      </footer>

      {/* AUTHENTICATION MODAL */}
      {authMode && (
        <div
          className="modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeAuth()
          }}
        >
          <div className="auth-modal">

            <button
              className="modal-close"
              onClick={closeAuth}
              aria-label="Close dialog"
            >
              ×
            </button>

            <div className="modal-logo">
              ∞
            </div>

            <span className="eyebrow">WELCOME TO BRIGHTLOOP</span>

            <h2>
              {authMode === 'login'
                ? 'Welcome back.'
                : 'Create your account.'}
            </h2>

            <p className="modal-description">
              {authMode === 'login'
                ? 'Log in to continue managing your subscriptions.'
                : 'Get started with smarter subscription management.'}
            </p>

            <form onSubmit={handleSubmit}>

              {authMode === 'signup' && (
                <div className="form-group">
                  <label htmlFor="fullname">Full name</label>
                  <input
                    id="fullname"
                    name="full_name"
                    type="text"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  minLength={9}
                  required
                />
              </div>

              {authMode === 'signup' && (
                <p className="password-hint">
                  Use more than 8 characters, including uppercase,
                  lowercase and a special character.
                </p>
              )}

              {message && (
                <div className="form-message">
                  {message}
                </div>
              )}

              <button className="primary-btn auth-submit" type="submit">
                {authMode === 'login' ? 'Log In' : 'Create Account'} →
              </button>
            </form>

            <div className="auth-switch">
              {authMode === 'login'
                ? "Don't have an account?"
                : 'Already have an account?'}

              <button
                onClick={() => openAuth(
                  authMode === 'login' ? 'signup' : 'login'
                )}
              >
                {authMode === 'login' ? 'Sign Up' : 'Log In'}
              </button>
            </div>

            <p className="modal-terms">
              By continuing, you agree to Brightloop's terms and privacy policy.
            </p>

          </div>
        </div>
      )}

    </div>
  )
}

export default Home
