import axios, { type AxiosResponse } from "axios";
import { notes } from "../util/notes88";
import type { UserNote } from "../pages/GrandStaves/GrandStaff";
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

  console.log("here are the userKeys: ", response.data.userPianoKeys);
  const userKeys: PianoKey[] = response.data.userPianoKeys;
  const parsedKeys: UserNote[] = userKeys.map((key) => {
    const note = parseNotes(notes[key.note_id - 1]);
    return {
      ...note,
      note_id: key.note_id,
      frequency: key.frequency,
    };
  });
  const sortedParsedKeys = sortPianoKeys(parsedKeys);
  setUserKeys(sortedParsedKeys);
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
    const parsedNote = parseNotes(currentNote);
    const newNote: UserNote = {
      ...parsedNote,
      note_id: response.data.pianoKey.id,
      frequency: response.data.pianoKey.frequency,
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

function sortPianoKeys(keys: UserNote[]): UserNote[] {
  // sort it by the frequency smallest to largest

  // Base case return if the array only has one item in it
  if (keys.length <= 1) {
    return keys;
  }

  const mid = Math.floor(keys.length / 2);
  const left = sortPianoKeys(keys.slice(0, mid));
  const right = sortPianoKeys(keys.slice(mid));

  // Combine by sorting the left and right arrays that were returned from the last iteration
  let lIndex = 0;
  let rIndex = 0;
  const sorted: UserNote[] = [];
  while (lIndex < left.length && rIndex < right.length) {
    if (left[lIndex].frequency < right[rIndex].frequency) {
      sorted.push(left[lIndex++]);
    } else {
      sorted.push(right[rIndex++]);
    }
  }

  // gets remaining items in the left/right array into the sorted array
  while (lIndex < left.length) {
    sorted.push(left[lIndex++]);
  }

  while (rIndex < right.length) {
    sorted.push(right[rIndex++]);
  }

  return sorted;
}
