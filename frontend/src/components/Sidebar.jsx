
import { NavLink } from "react-router-dom";


const Sidebar = () => {
  return (
    <aside className="sidebar">

      <div className="sidebar-brand">
        <div className="brand-logo">S</div>

        <div className="brand-details">
          <h4>StockFlow</h4>
          <span>INVENTORY MANAGEMENT</span>
        </div>
      </div>

      <div className="sidebar-section">

        <span className="sidebar-section-title">
          WORKSPACE
        </span>

        <nav className="sidebar-nav">

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-link-indicator"></span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-link-indicator"></span>
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-link-indicator"></span>
            <span>Settings</span>
          </NavLink>

        </nav>

      </div>

      <div className="sidebar-bottom">

        <div className="sidebar-bottom-divider"></div>

        <div className="sidebar-footer-brand">
          StockFlow
        </div>

        <p>
          A clearer way to manage your business inventory.
        </p>

        <span className="sidebar-version">
          VERSION 1.0.0
        </span>

      </div>

    </aside>
  );
};

export default Sidebar;
