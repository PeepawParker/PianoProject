import { useParams } from "react-router-dom";
import { usePractice } from "../../contexts/PracticeContext";
import PracticePage from "./PracticePage";
import PracticePageSettings from "./PracticePageSettings";
import { uploadUserData } from "../../api/Users/uploadUserData";
import initializeRandNotes from "../../util/firstRandNote";

export default function PianoPracticeHomePage() {
  const {
    start,
    setStart,
    seconds,
    numCorrect,
    setSeconds,
    setNumCorrect,
    randomNotes,
    numPracticeNotes,
    includeFlats,
    includeSharps,
    highNoteIndex,
    lowNoteIndex,
    userKeys,
    trueRandom,
    currentNoteRef,
    trebleStave,
    bassStave,
    setRandomNotes,
    setNoteIndex,
  } = usePractice();
  const { pianoId } = useParams<{ pianoId: string }>();

  return (
    <>
      <button
        onClick={() => {
          if (start && seconds > 0 && numCorrect > 0 && pianoId) {
            uploadUserData(numCorrect, seconds, pianoId);
            setSeconds(0);
            setNumCorrect(0);
          }
          if (!start && randomNotes.length == 0) {
            const firstNote = initializeRandNotes(
              numPracticeNotes,
              includeFlats,
              includeSharps,
              highNoteIndex,
              lowNoteIndex,
              userKeys,
              trueRandom,
              setRandomNotes
            );
            currentNoteRef.current = firstNote;
            setNoteIndex(0);
          }
          if (start) {
            // reset values to defaults when the user exits the practice menu
            setNoteIndex(0);
            setRandomNotes([]);
            setSeconds(0);
            setNumCorrect(0);
          }
          setStart(!start);
        }}
      >
        {start ? "Stop" : "Start"}
      </button>
      {start && (trebleStave || bassStave) ? (
        <PracticePage />
      ) : (
        <PracticePageSettings />
      )}
    </>
  );
}
