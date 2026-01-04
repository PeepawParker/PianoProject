import pool from "../database";

export interface User {
  user_id: string;
  username: string;
  email: string;
  password: string;
  created_at: Date;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const client = await pool.connect();
  try {
    const result = await client.query<User>(
      "SELECT * FROM users WHERE email = $1",
      [email.toLowerCase()]
    );

    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function getUserByUsername(
  username: string
): Promise<User | undefined> {
  const client = await pool.connect();
  try {
    const result = await client.query<User>(
      "SELECT * FROM users WHERE username = $1",
      [username.toLowerCase()]
    );

    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function postNewUser(
  username: string,
  password: string,
  email: string
): Promise<User | undefined> {
  const client = await pool.connect();
  try {
    const result = await client.query<User>(
      `INSERT INTO users(username, email, password)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [username.toLowerCase(), email.toLowerCase(), password]
    );

    return result.rows[0];
  } finally {
    client.release();
  }
}
