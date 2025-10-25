import { login } from "../api/Users/auth";

function LoginPage() {
  return (
    <>
      <input />
      <button onClick={() => login()}>Submit</button>
    </>
  );
}

export default LoginPage;
