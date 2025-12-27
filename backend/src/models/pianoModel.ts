import pool from "../database";

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
      SELECT * FROM user_keys WHERE piano_id = $1
    `,
      [pianoId]
    );

    const pianoKeys = result.rows;
    if (!pianoKeys) throw new Error("Failed to get keys from pianoId");

    return pianoKeys;
  } finally {
    client.release();
  }
}

export async function postPiano(
  pianoName: string,
  numKeys: number,
  userId: number
): Promise<Piano> {
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

    const piano = result.rows[0];
    if (!piano) throw new Error("Failed to insert piano");

    return piano;
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
