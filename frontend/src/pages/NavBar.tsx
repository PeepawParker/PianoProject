import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppRootState } from "../stores/store";
import handleLogout from "../util/SignOut";

function NavBar() {
  const { username } = useSelector((state: AppRootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <>
      {username ? null : <Link to={"/signup"}>Signup </Link>}
      {username ? (
        <button onClick={() => handleLogout(dispatch, navigate)}>Logout</button>
      ) : (
        <Link to={"/login"}>Login </Link>
      )}

      {username ? <Link to={"/"}>Home Page </Link> : null}
      {username ? <Link to={"/pianoSetup"}>PianoSetup </Link> : null}
      <Outlet />
    </>
  );
}

export default NavBar;
