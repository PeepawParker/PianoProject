import axios, { type AxiosResponse } from "axios";
import { notes } from "../util/notes88";
import type { UserNote } from "../util/GrandStaff";
import parseNotes from "../util/parseNotes";
import type { Dispatch, SetStateAction } from "react";

// TODO fix these so that instead of having the api requests also alter the react states it returns the values where the react component will then update the states

export interface Piano {
  id: number;
  user_id: number;
  piano_name: string;
  num_keys: number;
}

export interface PianoResponse {
  piano: Piano;
}

export interface PianoKey {
  id: number;
  piano_id: number;
  note_id: number;
  frequency: number;
}

interface PianoKeyResponse {
  pianoKey: PianoKey;
}

interface UserMappedKeysResponse {
  userPianoKeys: PianoKey[];
}

export async function getUserMappedKeys(
  userId: string,
  pianoId: string,
  setUserKeys: (keys: UserNote[]) => void
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
  const response = await axios.post<PianoResponse>(
    `http://localhost:3000/api/piano/setup`,
    { pianoName, numKeys, userId },
    { withCredentials: true }
  );
  return response.data.piano.id;
}

export async function postPutUserPianoKey(
  pianoId: string,
  frequency: number,
  currentNote: string,
  data: string,
  setUserKeys: Dispatch<SetStateAction<UserNote[]>>
) {
  let response: AxiosResponse<PianoKeyResponse>;
  if (data === "post") {
    // this shouldn't return all the keys just the most recent one
    response = await axios.post(
      `http://localhost:3000/api/piano/setup/key`,
      { pianoId, frequency, currentNote },
      { withCredentials: true }
    );
    console.log("here is the response: ", response);
    console.log(
      "here is the frequency and currentNote: ",
      frequency,
      currentNote
    );
    const parsedNote = parseNotes(currentNote);
    const newNote: UserNote = {
      ...parsedNote,
      note_id: response.data.pianoKey.id,
    };
    setUserKeys((prevKeys) => [...prevKeys, newNote]);
  } else {
    await axios.put(
      `http://localhost:3000/api/piano/setup/key`,
      { pianoId, frequency, currentNote },
      { withCredentials: true }
    );
    // Nothing needs to happen here because the updated value that gets returned would look no different from the original value and we don't need the frequency or anything at this point on the frontend so no reason to overcomplicate it
  }
}
