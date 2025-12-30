import { Link, useParams } from "react-router-dom";

export default function PianoHomePage() {
  const { pianoId } = useParams();
  return (
    <>
      <h1>This is the piano home page</h1>
      <p>
        <Link to={`/pianoKeySetup/${pianoId}`}>Piano Key Remap</Link>
      </p>
      <p>
        <Link to={`/pianoPractice/${pianoId}`}>Piano Practice</Link>
      </p>
    </>
  );
}
