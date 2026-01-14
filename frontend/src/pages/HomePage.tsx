import { useEffect, useState } from "react";
import { getUserPianos } from "../api/Users/getUser";
import { useSelector } from "react-redux";
import type { AppRootState } from "../stores/store";
import { Link } from "react-router-dom";
import type { Piano } from "../api/piano";
import { getUserPianoData } from "../api/Users/getUserPianoData";
import type { UserPianoData } from "../api/Users/uploadUserData";

function HomePage() {
  const { userId } = useSelector((state: AppRootState) => state.user);
  const [userPianos, setUserPianos] = useState<Piano[] | undefined>(undefined);
  const [userPianoData, setUserPianoData] = useState<
    | {
        [key: number]: UserPianoData;
      }
    | undefined
  >(undefined);

  useEffect(() => {
    const id = Number(userId);

    if (Number.isInteger(id)) {
      getUserPianos(id, setUserPianos);
    }
  }, [userId]);

  useEffect(() => {
    if (userPianos) {
      getUserPianoData(userPianos, setUserPianoData);
    }
  }, [userPianos]);

  return (
    <>
      {userId ? (
        <div>
          <h1>Home Page</h1>
          {userPianos && userPianoData
            ? userPianos.map((piano) => {
                return (
                  <div>
                    <p>
                      <Link key={piano.id} to={`/PianoHome/${piano.id}`}>
                        {piano.piano_name}
                      </Link>
                    </p>
                    <p>
                      {"Time Spent practicing: "}
                      {Math.floor(
                        (userPianoData[piano.id]?.seconds ?? 0) / 3600
                      )}{" "}
                      hours
                      {(
                        ((userPianoData[piano.id]?.seconds ?? 0) % 3600) /
                        60
                      ).toFixed(2)}{" "}
                      minutes
                      <br />
                      {"Total Correct Answers: "}
                      {userPianoData[piano.id]?.correct_answers ?? 0} <br />
                      {"Average time to play correct key: "}
                      {(userPianoData[piano.id]?.seconds ?? 0) /
                        (userPianoData[piano.id]?.correct_answers ?? 1)}{" "}
                      <br />
                    </p>
                  </div>
                );
              })
            : "Loading"}
        </div>
      ) : null}
    </>
  );
}

export default HomePage;
