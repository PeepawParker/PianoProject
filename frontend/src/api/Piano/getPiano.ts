import axios from "axios";

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

export async function getUserMappedKeys(
  userId: number,
  pianoId: number,
  setUserKeys: (keys: PianoKey[]) => void
) {
  const response = await axios.get(
    `http://localhost:3000/api/users/piano/${userId}/${pianoId}`
  );
  console.log("Here are the user mapped keys: ", response.data);
  // setUserKeys(response.data);
}
