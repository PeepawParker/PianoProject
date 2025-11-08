import axios from "axios";

export async function postUserPiano(
  pianoName: string,
  numKeys: number,
  userId: number
) {
  const response = await axios.post(
    `http://localhost:3000/api/piano/setup`,
    { pianoName, numKeys, userId },
    { withCredentials: true }
  );

  console.log(response.data);
}

export async function postUserPianoKey() {}
