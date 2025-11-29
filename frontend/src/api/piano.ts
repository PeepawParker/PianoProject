import axios, { type AxiosResponse } from "axios";
import { notes } from "../util/notes88";
import type { UserNote } from "../util/GrandStaff";
import type { Note } from "../util/PianoRange";

export interface Piano {
  id: number;
  user_id: number;
  piano_name: string;
  num_keys: number;
}

export interface PianoKey {
  id: number;
  piano_id: number;
  note_id: number;
  frequency: number;
}

interface UserMappedKeysResponse {
  userPianoKeys: PianoKey[];
}

export async function getUserMappedKeys(
  userId: number,
  pianoId: number,
  setUserKeys: (keys: UserNote[]) => void,
  parseNotes: (note: string) => Note
) {
  const response = await axios.get<UserMappedKeysResponse>(
    `http://localhost:3000/api/users/piano/${userId}/${pianoId}`
  );

  const userKeys: PianoKey[] = response.data.userPianoKeys;
  const parsedKeys: UserNote[] = userKeys.map((key) => {
    const note = parseNotes(notes[key.note_id - 1]);
    return {
      ...note,
      note_id: key.note_id,
    };
  });
  setUserKeys(parsedKeys);
}

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

export async function postPutUserPianoKey(
  pianoId: string,
  frequency: number,
  currentNote: string,
  data: string
) {
  let response: AxiosResponse<UserMappedKeysResponse>;
  if (data === "post") {
    response = await axios.post<UserMappedKeysResponse>(
      `http://localhost:3000/api/piano/setup/key`,
      { pianoId, frequency, currentNote },
      { withCredentials: true }
    );
  } else {
    console.log("this is put");
    response = await axios.put<UserMappedKeysResponse>(
      `http://localhost:3000/api/piano/setup/key`,
      { pianoId, frequency, currentNote },
      { withCredentials: true }
    );
  }

  console.log(response);
}
