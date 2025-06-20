import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="site-header">
      <nav className="nav">
        <ul>
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Головна
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/posts"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Пости
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
