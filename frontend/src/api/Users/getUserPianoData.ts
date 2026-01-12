import axios from "axios";
import type { UserPianoData } from "./uploadUserData";
import type { Piano } from "../piano";

export interface GetUserPianoData {
  userPianoData: UserPianoData[];
}

export async function getUserPianoData(
  pianos: Piano[],
  setUserPianoData: (data: { [key: number]: UserPianoData }) => void
) {
  console.log("we are going to try now", pianos);
  const response = await axios.get<GetUserPianoData>(
    `http://localhost:3000/api/users/piano/data`,
    {
      params: {
        pianos: pianos.map((p) => p.id),
      },
      withCredentials: true,
    }
  );

  const userPianoDataObj: { [key: number]: UserPianoData } = {};

  console.log(response.data.userPianoData);
  for (let i = 0; i < response.data.userPianoData.length; i++) {
    const data = response.data.userPianoData[i];
    userPianoDataObj[data.piano_id] = data;
  }
  console.log("here is the userPianoDataObj: ", userPianoDataObj);
  setUserPianoData(userPianoDataObj);
}
