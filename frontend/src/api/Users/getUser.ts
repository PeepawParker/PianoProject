import axios from "axios";
import type { Piano } from "../piano";

export async function getUserPianos(
  userId: number,
  setUserPianos: (pianos: Piano[]) => void
) {
  const response = await axios.get(
    `http://localhost:3000/api/users/piano/${userId}`
  );
  setUserPianos(response.data.userPianos);
}
