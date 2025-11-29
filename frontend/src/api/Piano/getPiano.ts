import axios from "axios";
import type { Note } from "../../util/PianoRange";
import { notes } from "../../util/notes88";

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

interface GetUserMappedKeysResponse {
  userPianoKeys: PianoKey[];
}

export async function getUserMappedKeys(
  userId: number,
  pianoId: number,
  setUserKeys: (keys: Note[]) => void,
  parseNotes: (note: string) => Note
) {
  const response = await axios.get<GetUserMappedKeysResponse>(
    `http://localhost:3000/api/users/piano/${userId}/${pianoId}`
  );

  const userKeys: PianoKey[] = response.data.userPianoKeys;
  const parsedKeys: Note[] = userKeys.map((key) =>
    parseNotes(notes[key.note_id - 1])
  );
  setUserKeys(parsedKeys);
}
