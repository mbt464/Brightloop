
function Footer({ openAuth }) {
  return (
    <footer>
      <a className="logo" href="#home">
        <span className="logo-symbol">∞</span>
        Brightloop<span className="logo-dot">.</span>
      </a>

      <p>Making subscription management simple.</p>

      <div className="footer-actions">
        <button onClick={() => openAuth('login')}>
          Login
        </button>

        <button onClick={() => openAuth('signup')}>
          Create Account
        </button>
      </div>

      <p>© 2026 Brightloop Software. All rights reserved.</p>
    </footer>
  )
}

export default Footer
