import { useState } from "react";
import { login } from "../api/Users/auth";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../stores/store";

function LoginPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();

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

      <button onClick={() => login(username, password, dispatch)}>
        Submit
      </button>
    </>
  );
}

export default LoginPage;
