import axios from "axios";

export async function login() {
  try {
    const response = await axios.get(`http://localhost:3000/api/users/login`, {
      withCredentials: true,
    });

    console.log(response.data.status);
  } catch (err: unknown) {
    console.error("There was a problem logging in", err);
  }
}
