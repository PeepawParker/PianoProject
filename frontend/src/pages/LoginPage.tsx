import { useState } from "react";
import { login } from "../api/Users/auth";

function SignupPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <>
      <div>
        <input
          placeholder="Username/Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <input
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
      </div>

      <button onClick={() => login(username, password)}>Submit</button>
    </>
  );
}

export default SignupPage;
