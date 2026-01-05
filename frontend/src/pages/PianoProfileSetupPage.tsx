import { useState } from "react";
import { useSelector } from "react-redux";
import type { AppRootState } from "../stores/store";
import { postUserPiano } from "../api/piano";
import { useNavigate } from "react-router-dom";

function PianoProfileSetupPage() {
  const [pianoName, setPianoName] = useState<string>("");
  const [numKeys, setNumKeys] = useState<number>(0);
  const { userId } = useSelector((state: AppRootState) => state.user);
  const navigate = useNavigate();

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
            <button
              onClick={async () => {
                const pianoId = await postUserPiano(pianoName, numKeys, userId);
                navigate(`/PianoHome/${pianoId}`);
              }}
            >
              Submit
            </button>
          </div>
          {/* TODO make Drop down menu with the different number of piano keys options */}
        </div>
      ) : null}
    </>
  );
}

export default PianoProfileSetupPage;
