import { Link, Outlet } from "react-router-dom";

function NavBar() {
  return (
    <>
      <Link to={"/signup"}>Signup </Link>
      <Link to={"/login"}>Login </Link>
      <Link to={"/pianoSetup"}>PianoSetup </Link>
      <Link to={"/pianoKeySetup"}>PianoKeySetup </Link>
      <Outlet />
    </>
  );
}

export default NavBar;
