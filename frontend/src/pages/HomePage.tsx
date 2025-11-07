import { pianoListenerSetup } from "../util/pianoListenerSetup";

function HomePage() {
  return (
    <>
      <h1>Home Page</h1>
      <button onClick={pianoListenerSetup}></button>
    </>
  );
}

export default HomePage;
