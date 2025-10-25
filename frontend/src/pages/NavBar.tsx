import { Outlet } from "react-router-dom";

function NavBar() {
  return (
    <>
      <h1>navbar</h1>
      <Outlet />
    </>
  );
}

export default NavBar;
