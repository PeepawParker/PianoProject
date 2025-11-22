import pool from "../database";

export interface Piano {
  id: number;
  user_id: number;
  piano_name: string;
  num_keys: number;
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
