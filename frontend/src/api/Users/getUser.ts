import axios from "axios";
import type { Piano } from "../Piano/getPiano";

export async function getUserPianos(
  userId: string,
  setUserPianos: (pianos: Piano[]) => void
) {
  const response = await axios.get(
    `http://localhost:3000/api/users/piano/${userId}`
  );
  setUserPianos(response.data.userPianos);
}
