import axios from "axios";

export async function postUserPiano(pianoName: string, numKeys: number) {
  const response = await axios.post(
    `http://localhost:3000/api/piano/setup`,
    { pianoName, numKeys },
    { withCredentials: true }
  );

  console.log(response.data);
}

export async function postUserPianoKey() {}
