import pool from "../database";

interface User {
  user_id: number;
  username: string;
  email: string;
  password: string;
}

export async function getUserByEmail(email: string) {
  const client = await pool.connect();
  try {
    const result = await client.query<User>(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}
