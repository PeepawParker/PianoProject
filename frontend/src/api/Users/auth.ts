import axios from "axios";

export async function signup(
  username: string,
  email: string,
  password: string,
  passwordConfirm: string
) {
  try {
    const response = await axios.post(
      `http://localhost:3000/api/users/signup`,
      { username, email, password, passwordConfirm },
      { withCredentials: true }
    );

    console.log(response.data.status);
  } catch (err: unknown) {
    console.error("There was a problem logging in", err);
  }
}

export async function login(username: string, password: string) {
  try {
    const response = await axios.post(
      `http://localhost:3000/api/users/login`,
      { username, password },
      { withCredentials: true }
    );

    console.log(response.data.status);
  } catch (err: unknown) {
    console.error("There was a problem logging in", err);
  }
}
