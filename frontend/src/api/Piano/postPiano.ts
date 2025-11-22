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
  userId: string,
  frequency: GLfloat
) {
  const response = await axios.post(
    `http://localhost:3000/api/piano/setup/key`,
    { pianoId, userId, frequency },
    { withCredentials: true }
  );

  console.log(response.data);
}
