import { Link, Outlet } from "react-router-dom";

function NavBar() {
  return (
    <>
      <Link to={"/signup"}>Signup</Link>
      <Link to={"/login"}>Login</Link>
      <Outlet />
    </>
  );
}

export default NavBar;
