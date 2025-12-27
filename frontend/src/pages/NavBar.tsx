import { Link, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { AppRootState } from "../stores/store";

function NavBar() {
  const { username } = useSelector((state: AppRootState) => state.user);
  return (
    <>
      {username ? null : <Link to={"/signup"}>Signup </Link>}
      {username ? null : <Link to={"/login"}>Login </Link>}

      {username ? <Link to={"/"}>Home Page </Link> : null}
      {username ? <Link to={"/pianoSetup"}>PianoSetup </Link> : null}
      <Outlet />
    </>
  );
}

export default NavBar;
