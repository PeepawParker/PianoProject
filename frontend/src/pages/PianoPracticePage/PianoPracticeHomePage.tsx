import { useParams } from "react-router-dom";
import { usePractice } from "../../contexts/PracticeContext";
import PracticePage from "./PracticePage";
import PracticePageSettings from "./PracticePageSettings";
import { uploadUserData } from "../../api/Users/uploadUserData";

export default function PianoPracticeHomePage() {
  const { start, setStart, seconds, numCorrect, setSeconds, setNumCorrect } =
    usePractice();
  const { pianoId } = useParams<{ pianoId: string }>();

  return (
    <>
      <button
        onClick={() => {
          console.log(
            !start,
            seconds > 0,
            numCorrect > 0,
            pianoId,
            seconds,
            numCorrect,
            pianoId
          );
          if (start && seconds > 0 && numCorrect > 0 && pianoId) {
            uploadUserData(numCorrect, seconds, pianoId);
            setSeconds(0);
            setNumCorrect(0);
          }
          setStart(!start);
        }}
      >
        {start ? "Stop" : "Start"}
      </button>
      {start ? <PracticePage /> : <PracticePageSettings />}
    </>
  );
}
