
function Navbar({ openAuth }) {
  return (
    <>
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
    </>
  )
}

export default Navbar
