import { usePractice } from "../../contexts/PracticeContext";
import PracticePage from "./PracticePage";
import PracticePageSettings from "./PracticePageSettings";

export default function PianoPracticeHomePage() {
  const { start, setStart } = usePractice();
  // TODO the setStart isnt making it update to the practice Page

  return (
    <>
      <button onClick={() => setStart(!start)}>
        {start ? "Stop" : "Start"}
      </button>
      {start ? <PracticePage /> : <PracticePageSettings />}
    </>
  );
}
