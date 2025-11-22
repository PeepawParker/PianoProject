import { useEffect, useState } from "react";
import { getUserPianos } from "../api/Users/getUser";
import { useSelector } from "react-redux";
import type { AppRootState } from "../stores/store";
import { Link } from "react-router-dom";
import type { Piano } from "../api/Piano/getPiano";

function HomePage() {
  const { userId } = useSelector((state: AppRootState) => state.user);
  const [userPianos, setUserPianos] = useState<Piano[] | undefined>(undefined);

  useEffect(() => {
    if (userId) {
      getUserPianos(userId, setUserPianos);
    }
  }, [userId]);
  return (
    <>
      {userId ? (
        <div>
          <h1>Home Page</h1>
          {userPianos
            ? userPianos.map((piano) => (
                <Link key={piano.id} to={`/PianoHomePage/${piano.id}`}>
                  {piano.piano_name}
                </Link>
              ))
            : "Loading"}
        </div>
      ) : null}
    </>
  );
}

export default HomePage;
