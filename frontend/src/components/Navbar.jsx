
import { useNavigate } from "react-router-dom";


const Navbar = ({ title }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="top-navbar">

      <div className="navbar-left">

        <div className="navbar-breadcrumb">
          <span>StockFlow</span>
          <span className="breadcrumb-separator">/</span>
          <strong>{title}</strong>
        </div>

        <h5>{title}</h5>

      </div>

      <div className="navbar-right">

        <div className="navbar-account">
          <div className="account-avatar">U</div>

          <div className="account-details">
            <strong>My Account</strong>
            <span>Workspace owner</span>
          </div>
        </div>

        <button
          className="navbar-logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </header>
  );
};

export default Navbar;
