import axios from "axios";

export interface UserPianoData {
  pianoId: number;
  seconds: number;
  correct_answers: number;
}

export async function uploadUserData(
  numCorrect: number,
  seconds: number,
  pianoId: string
) {
  await axios.post(
    `http://localhost:3000/api/users/data`,
    {
      pianoId,
      numCorrect,
      seconds,
    },
    { withCredentials: true }
  );
}
