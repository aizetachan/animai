import { Link, NavLink } from 'react-router-dom';

export default function Nav() {
  return (
    <nav className="nav">
      <div className="wrap">
        <Link to="/" className="brand">
          Motion Lab<span className="dot">.</span>
        </Link>
        <NavLink to="/" end className={({ isActive }) => 'link' + (isActive ? ' active' : '')}>
          Inicio
        </NavLink>
        <NavLink to="/gallery" className={({ isActive }) => 'link' + (isActive ? ' active' : '')}>
          Galería
        </NavLink>
        <span className="spacer" />
        <Link to="/gallery" className="btn-primary">
          Explorar efectos
        </Link>
      </div>
    </nav>
  );
}
