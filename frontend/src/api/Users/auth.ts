import axios from "axios";
import type { AppDispatch } from "../../stores/store";
import { userActions } from "../../stores/userStore";

interface User {
  status: string;
  user: {
    user_id: string;
    username: string;
    email: string;
    password: string;
    created_at: Date;
  };
}

export async function signup(
  username: string,
  email: string,
  password: string,
  passwordConfirm: string,
  dispatch: AppDispatch
) {
  try {
    const response = await axios.post<User>(
      `http://localhost:3000/api/users/signup`,
      { username, email, password, passwordConfirm },
      { withCredentials: true }
    );

    dispatch(
      userActions.login({
        userId: response.data.user.user_id,
        username: response.data.user.username,
      })
    );
  } catch (err: unknown) {
    console.error("There was a problem logging in", err);
  }
}

export async function login(
  username: string,
  password: string,
  dispatch: AppDispatch
) {
  try {
    const response = await axios.post<User>(
      `http://localhost:3000/api/users/login`,
      { username, password },
      { withCredentials: true }
    );
    dispatch(
      userActions.login({
        userId: response.data.user.user_id,
        username: response.data.user.username,
      })
    );
  } catch (err: unknown) {
    console.error("There was a problem logging in", err);
  }
}
