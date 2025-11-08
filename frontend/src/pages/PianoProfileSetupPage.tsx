import { useState } from "react";
import { postUserPiano } from "../api/Piano/postPiano";

function PianoProfileSetupPage() {
  const [pianoName, setPianoName] = useState<string>("");
  const [numKeys, setNumKeys] = useState<number>(0);

  return (
    <>
      <h1>Listener Page</h1>
      <div>
        <input placeholder="Name of the piano"></input>
        <input placeholder="Number of keys"></input>
        <button onClick={() => postUserPiano(pianoName, numKeys)}>
          Submit
        </button>
        {/* will post the piano data to the database with the curUserInformation */}
      </div>
      {/* Drop down menu with the different piano profiles the user might have after the click it they will begin the process of recording the piano freqeuncies */}
    </>
  );
}

export default PianoProfileSetupPage;
