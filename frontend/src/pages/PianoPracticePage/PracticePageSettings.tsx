import { notes } from "../../util/notes88";
import parseNotes from "../../util/parseNotes";
import GrandStaffRange from "../GrandStaves/GrandStaffRange";
import { usePractice } from "../../contexts/PracticeContext";

export default function PracticePageSettings() {
  const {
    start,
    userKeys,
    highNoteIndex,
    lowNoteIndex,
    setHighNoteIndex,
    setLowNoteIndex,
    numPracticeNotes,
    setNumPracticeNotes,
    trueRandom,
    setTrueRandom,
    includeSharps,
    includeFlats,
    setIncludeSharps,
    setIncludeFlats,
    trebleStave,
    bassStave,
    settrebleStave,
    setbassStave,
  } = usePractice();

  if (userKeys.length <= 1) {
    return null;
  }

  return (
    <div>
      <GrandStaffRange
        highNoteValue={parseNotes(notes[highNoteIndex]).baseNote}
        highAccidental={parseNotes(notes[highNoteIndex]).noteType}
        lowNoteValue={parseNotes(notes[lowNoteIndex]).baseNote}
        lowAccidental={parseNotes(notes[lowNoteIndex]).noteType}
        includeSharps={includeSharps}
        includeFlats={includeFlats}
        userKeys={userKeys}
        trebleStaveBool={trebleStave}
        bassStaveBool={bassStave}
      />

      {start ? <p>You need to select one or both of the Clefs</p> : null}

      <div>
        <label>
          <input
            type="checkbox"
            checked={includeSharps}
            onChange={(e) => setIncludeSharps(e.target.checked)}
          />
          Sharps Included
        </label>
        <label>
          <input
            type="checkbox"
            checked={includeFlats}
            onChange={(e) => setIncludeFlats(e.target.checked)}
          />
          Flats Included
        </label>
        <label>
          <input
            type="checkbox"
            checked={trueRandom}
            onChange={(e) => setTrueRandom(e.target.checked)}
          />
          Truly Random Notes
        </label>

        <label>
          <input
            type="checkbox"
            checked={trebleStave}
            onChange={(e) => settrebleStave(e.target.checked)}
          />
          Treble Clef
        </label>

        <label>
          <input
            type="checkbox"
            checked={bassStave}
            onChange={(e) => setbassStave(e.target.checked)}
          />
          Bass Clef
        </label>
      </div>

      <div>
        {/* Future labels down here so we have rows rather than one line of selections */}
        {/* <label>
          <input
            type="checkbox"
            checked={bassStave}
            onChange={(e) => setbassStave(e.target.checked)}
          />
          Bass Clef
        </label> */}
      </div>

      <p>Number of random notes you want to practice with</p>
      <input
        type="number"
        min={1}
        max={16}
        step={1}
        value={numPracticeNotes}
        onChange={(e) => setNumPracticeNotes(+e.target.value)}
      />

      <p>Highest Note allowed</p>
      <input
        type="number"
        min={lowNoteIndex + 1}
        max={userKeys.length - 1}
        step={1}
        value={highNoteIndex}
        onChange={(e) => setHighNoteIndex(+e.target.value)}
      />
      <p>Lowest Note allowed</p>
      <input
        type="number"
        min={0}
        max={highNoteIndex - 1}
        step={1}
        value={lowNoteIndex}
        onChange={(e) => setLowNoteIndex(+e.target.value)}
      />
    </div>
  );
}
