import { enharmonicFlats } from "./notes88";
import type { UserNote } from "../pages/GrandStaves/GrandStaff";

type RandomUserNote = UserNote & { index: number };

export default function initializeRandNotes(
  numPracticeNotes: number,
  includeFlats: boolean,
  includeSharps: boolean,
  highNoteIndex: number,
  lowNoteIndex: number,
  userKeys: UserNote[],
  trueRandom: boolean,
  setRandomNotes: (notes: UserNote[]) => void
) {
  const randomNotes: RandomUserNote[] = [];
  let firstIndex: number;

  for (let i = 0; i < numPracticeNotes; i++) {
    let randNum: number;
    if (trueRandom || i == 0) {
      randNum =
        Math.floor(Math.random() * (highNoteIndex - lowNoteIndex + 1)) +
        lowNoteIndex;

      if (i === 0) {
        firstIndex = randNum;
      }
    } else {
      const min = Math.max(lowNoteIndex, firstIndex! - 7); // clamp to lower bound
      const max = Math.min(highNoteIndex, firstIndex! + 7); // clamp to upper bound
      randNum = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    randomNotes.push({ ...userKeys[randNum], index: randNum });
  }

  for (let i = 0; i < randomNotes.length; i++) {
    if (includeFlats && includeSharps && randomNotes[i].noteType === "sharp") {
      const canBeFlat = /^[ACDFG]/.test(randomNotes[i].baseNote);
      if (canBeFlat) {
        // %50 for it to swap from a sharp to a flat if both are active when practicing
        const result = Math.round(Math.random());

        // update the note to be a flat
        if (result == 1) {
          randomNotes[i].noteType = "flat";
          randomNotes[i].baseNote = enharmonicFlats[randomNotes[i].baseNote]; // updating because a sharp and flat of the same note aren't on the same line
        }
      }
    } else if (includeFlats && randomNotes[i].noteType === "sharp") {
      const canBeFlat = /^[ACDFG]/.test(randomNotes[i].baseNote);
      if (canBeFlat) randomNotes[i].noteType = "flat";
    } else if (
      !includeSharps &&
      !includeFlats &&
      randomNotes[i].noteType === "sharp" // Don't need to check for flats because they will always by default be sharp uless they are changed in this function
    ) {
      // update the sharp frequencies to standard frequencies
      randomNotes[i].frequency = userKeys[randomNotes[i].index - 1].frequency;
      randomNotes[i].noteType = "natural";
    }
  }

  setRandomNotes(randomNotes);
  return randomNotes[0];
}
