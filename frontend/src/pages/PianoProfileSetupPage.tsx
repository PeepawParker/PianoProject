import { useState } from "react";
import { useSelector } from "react-redux";
import type { AppRootState } from "../stores/store";
import { postUserPiano } from "../api/piano";

function PianoProfileSetupPage() {
  const [pianoName, setPianoName] = useState<string>("");
  const [numKeys, setNumKeys] = useState<number>(0);
  const { userId } = useSelector((state: AppRootState) => state.user);

  return (
    <>
      {userId ? (
        <div>
          <h1>Listener Page</h1>
          <div>
            <input
              placeholder="Name of the piano"
              onChange={(e) => {
                setPianoName(e.target.value);
              }}
            ></input>
            <input
              placeholder="Number of keys"
              onChange={(e) => {
                setNumKeys(Number(e.target.value));
              }}
            ></input>
            <button onClick={() => postUserPiano(pianoName, numKeys, userId)}>
              Submit
            </button>
            {/* will post the piano data to the database with the curUserInformation */}
          </div>
          {/* Drop down menu with the different piano profiles the user might have after the click it they will begin the process of recording the piano freqeuncies */}
        </div>
      ) : null}
    </>
  );
}

export default PianoProfileSetupPage;
