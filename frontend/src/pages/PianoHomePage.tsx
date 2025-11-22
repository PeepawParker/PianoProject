import { Link, useParams } from "react-router-dom";

export default function PianoHomePage() {
  const { pianoId } = useParams();
  return (
    <>
      <h1>This is the piano home page</h1>
      <Link to={`/pianoKeySetup/${pianoId}`}>Piano Key Setup</Link>
    </>
  );
}
