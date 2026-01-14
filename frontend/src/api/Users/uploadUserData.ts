import axios from "axios";

export interface UserPianoData {
  piano_id: number;
  seconds: number;
  correct_answers: number;
}

export async function uploadUserData(
  numCorrect: number,
  seconds: number,
  pianoId: string
) {
  try {
    await axios.post(
      `http://localhost:3000/api/users/data`,
      {
        pianoId,
        numCorrect,
        seconds,
      },
      { withCredentials: true }
    );
  } catch (error) {
    console.error("Failed to upload user data:", error);
  }
}
