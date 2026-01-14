import type { RefObject } from "react";
import { enharmonicFlats } from "../../util/notes88";
import type { UserNote } from "../GrandStaves/GrandStaff";

export function randomNote(
  userKeys: UserNote[],
  trueRandom: boolean,
  includeSharps: boolean,
  includeFlats: boolean,
  noteIndex: number,
  lowNoteIndex: number,
  highNoteIndex: number,
  firstIndexRef: RefObject<number | undefined> // <- updated]
) {
  let randNum: number;
  if (trueRandom || noteIndex === 0) {
    randNum =
      Math.floor(Math.random() * (highNoteIndex - lowNoteIndex + 1)) +
      lowNoteIndex;

    if (noteIndex === 0) {
      firstIndexRef.current = randNum;
      console.log("here is whatthe ref is now: ", firstIndexRef.current);
    }
  } else {
    const min = Math.max(lowNoteIndex, firstIndexRef.current! - 7); // clamp to lower bound
    const max = Math.min(highNoteIndex, firstIndexRef.current! + 7); // clamp to upper bound
    randNum = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log(
      "here is what the randNum is now",
      randNum,
      firstIndexRef.current
    );
  }

  // since we are just making a copy you can update the baseNote, frequency, and accidental without having to worry about it messing up future things
  const randomNote = { ...userKeys[randNum] };

  if (includeFlats && includeSharps && randomNote.noteType === "sharp") {
    const canBeFlat = /^[ACDFG]/.test(randomNote.baseNote);
    if (canBeFlat) {
      // %50 for it to swap from a sharp to a flat if both are active when practicing
      const result = Math.round(Math.random());

      // update the note to be a flat
      if (result == 1) {
        randomNote.noteType = "flat";
        randomNote.baseNote = enharmonicFlats[randomNote.baseNote]; // updating because a sharp and flat of the same note aren't on the same line
      }
    }
  } else if (includeFlats && randomNote.noteType === "sharp") {
    const canBeFlat = /^[ACDFG]/.test(randomNote.baseNote);
    if (canBeFlat) randomNote.noteType = "flat";
  } else if (
    !includeSharps &&
    !includeFlats &&
    randomNote.noteType === "sharp" // Don't need to check for flats because they will always by default be sharp uless they are changed in this function
  ) {
    // update the sharp frequencies to standard frequencies
    randomNote.frequency = userKeys[randNum - 1].frequency;
    randomNote.noteType = "natural";
  }

  // Need to figure out how im going to update the ref dynamically
  // I think I can use the index to have it update to whatever the index is in a useEffect, or maybe it'd be one more than the index and then if the index is the numPracticeNotes then I would reset it back to randomNotes[0]

  // Need to update how I set the index because it will be updated dynamically
  // Dont check just set it to what the current index is
  // setRandomNote((prev) => prev[currentIndex]) when you do this also set the curRef
  console.log("did we make it down here though?");
  return randomNote;
}
