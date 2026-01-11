import pool from "../database";
import { noteFrequencies, notes } from "../utils/notes88";

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

export interface UserPianoData {
  pianoId: number;
  seconds: number;
  correct_answers: number;
}

export interface Note {
  id: number;
  name: string;
}

export async function getPianosByUserId(userId: number) {
  const client = await pool.connect();
  try {
    const result = await client.query<Piano>(
      `SELECT * FROM pianos WHERE user_id = $1`,
      [userId]
    );

    return result.rows;
  } finally {
    client.release();
  }
}

export async function getPianoById(pianoId: number) {
  const client = await pool.connect();
  try {
    const result = await client.query<Piano>(
      `SELECT * FROM pianos WHERE id = $1`,
      [pianoId]
    );

    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function getNoteFromString(note: string) {
  const client = await pool.connect();
  try {
    const result = await client.query<Note>(
      `SELECT * FROM notes WHERE name = $1`,
      [note]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function getMappedKeysByPianoId(
  pianoId: number
): Promise<PianoKey[]> {
  const client = await pool.connect();
  try {
    const result = await client.query<PianoKey>(
      `
      SELECT * FROM user_keys WHERE piano_id = $1`,
      [pianoId]
    );

    return result.rows;
  } finally {
    client.release();
  }
}

export async function pianoDataExists(pianoId: string): Promise<boolean> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      SELECT * FROM user_piano_data WHERE piano_id = $1`,
      [pianoId]
    );
    if (result.rows[0]) return true;
    return false;
  } finally {
    client.release();
  }
}

export async function updatePianoData(
  pianoId: string,
  seconds: number,
  numCorrect: number
): Promise<void> {
  const client = await pool.connect();
  try {
    const result = await client.query<UserPianoData>(
      `
      UPDATE user_piano_data
      SET seconds = seconds + $1,
          correct_answers = correct_answers + $2
      WHERE piano_id = $3`,
      [seconds, numCorrect, pianoId]
    );
  } finally {
    client.release();
  }
}

export async function postPianoData(
  pianoId: string,
  seconds: number,
  numCorrect: number
): Promise<void> {
  const client = await pool.connect();
  try {
    const result = await client.query<UserPianoData>(
      `
    INSERT INTO user_piano_data(piano_id, seconds, correct_answers)
    VALUES ($1, $2, $3)`,
      [pianoId, seconds, numCorrect]
    );
  } finally {
    client.release();
  }
}

export async function postPiano(
  pianoName: string,
  numKeys: number,
  userId: number
): Promise<Piano | undefined> {
  const client = await pool.connect();
  try {
    const result = await client.query<Piano>(
      `
        INSERT INTO pianos(user_id, piano_name, num_keys)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
      [userId, pianoName, numKeys]
    );

    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function postPianoKey(
  pianoId: number,
  frequency: number,
  note: Note
) {
  const client = await pool.connect();
  try {
    const result = await client.query<PianoKey>(
      `INSERT INTO user_keys (piano_id, note_id, frequency) 
      VALUES ($1, $2, $3)
      RETURNING *`,
      [pianoId, note.id, frequency]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function postDefaultKeys(pianoId: number) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (let i = 0; i < notes.length; i++) {
      await client.query(
        `INSERT INTO user_keys (piano_id, note_id, frequency)
         VALUES ($1, $2, $3)`,
        [pianoId, i + 1, noteFrequencies[notes[i]!]]
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    // You can do a standard error throw just best not to throw new AppErrors
    throw error;
  } finally {
    client.release();
  }
}

export async function putPianoKey(
  pianoId: number,
  frequency: number,
  note: Note
) {
  const client = await pool.connect();
  try {
    const result = await client.query<PianoKey>(
      `
      UPDATE user_keys
      SET frequency = $1
      WHERE piano_id = $2 AND note_id = $3`,
      [frequency, pianoId, note.id]
    );
  } finally {
    client.release();
  }
}
