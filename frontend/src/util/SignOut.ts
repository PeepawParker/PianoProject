import type { NavigateFunction } from "react-router-dom";
import type { AppDispatch } from "../stores/store";
import { userActions } from "../stores/userStore";

export default function handleLogout(
  dispatch: AppDispatch,
  navigate: NavigateFunction
) {
  dispatch(userActions.resetUser());
  navigate("/login");
}
