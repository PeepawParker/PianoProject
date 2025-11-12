import { useState } from "react";
import { signup } from "../api/Users/auth";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../stores/store";

function SignupPage() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      <div>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
      <div>
        <input
          placeholder="PasswordConfirm"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          type="password"
        />
      </div>
      <button
        onClick={() =>
          signup(username, email, password, passwordConfirm, dispatch)
        }
      >
        Submit
      </button>
    </>
  );
}

export default SignupPage;
