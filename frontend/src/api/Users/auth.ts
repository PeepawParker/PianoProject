import axios from "axios";

// TODO CORRECTLY TYPE THE RESPONSES THAT ARE RETURNED HERE

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
    console.log(response.data);
  } catch (err: unknown) {
    console.error("There was a problem logging in", err);
  }
}
