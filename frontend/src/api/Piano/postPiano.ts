import axios from "axios";

export async function postUserPiano(
  pianoName: string,
  numKeys: number,
  userId: string
) {
  await axios.post(
    `http://localhost:3000/api/piano/setup`,
    { pianoName, numKeys, userId },
    { withCredentials: true }
  );
}

export async function postUserPianoKey(
  pianoId: string,
  frequency: number,
  currentNote: string
) {
  await axios.post(
    `http://localhost:3000/api/piano/setup/key`,
    { pianoId, frequency, currentNote },
    { withCredentials: true }
  );
}
