import axios from "axios";

export async function postUserPiano(
  pianoName: string,
  numKeys: number,
  userId: string
) {
  const response = await axios.post(
    `http://localhost:3000/api/piano/setup`,
    { pianoName, numKeys, userId },
    { withCredentials: true }
  );

  console.log(response.data);
}

export async function postUserPianoKey(
  pianoId: string,
  frequency: GLfloat,
  currentNote: string
) {
  const response = await axios.post(
    `http://localhost:3000/api/piano/setup/key`,
    { pianoId, frequency, currentNote },
    { withCredentials: true }
  );

  console.log(response.data);
}
