import { NavLink } from "react-router";

import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { token, logout } = useAuth();

  return (
    <header id="navbar">
      <nav id="navbar-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </nav>

      <nav id="navbar-actions">
        <NavLink to="/cart">Cart</NavLink>
        {token ? (
          <button onClick={logout}>Log out</button>
        ) : (
          <NavLink to="/login">Login / Register</NavLink>
        )}
      </nav>
    </header>
  );
}
