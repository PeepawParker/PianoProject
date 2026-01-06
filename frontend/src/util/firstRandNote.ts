import { enharmonicFlats } from "./notes88";
import type { UserNote } from "../pages/GrandStaves/GrandStaff";

export default function firstRandNote(
  includeFlats: boolean,
  includeSharps: boolean,
  highNoteIndex: number,
  lowNoteIndex: number,
  userKeys: UserNote[],
  setRandomKeyOne: (note: UserNote) => void
) {
  const randNum =
    Math.floor(Math.random() * (highNoteIndex - lowNoteIndex + 1)) +
    lowNoteIndex;

  // Create the first note seperate so we can add it to the noteRef
  const firstNote: UserNote | undefined = { ...userKeys[randNum] };

  console.log("first note before:", firstNote);

  if (includeFlats && includeSharps && firstNote.noteType === "sharp") {
    const canBeFlat = /^[ACDFG]/.test(firstNote.baseNote);
    if (canBeFlat) {
      // %50 for it to swap from a sharp to a flat if both are active when practicing
      const result = Math.round(Math.random());

      // update the note to be a flat
      if (result == 1) {
        firstNote.noteType = "flat";
        firstNote.baseNote = enharmonicFlats[firstNote.baseNote]; // updating because a sharp and flat of the same note aren't on the same line
      }
    }
  } else if (includeFlats && firstNote.noteType === "sharp") {
    const canBeFlat = /^[ACDFG]/.test(firstNote.baseNote);
    if (canBeFlat) firstNote.noteType = "flat";
  } else if (
    !includeSharps &&
    !includeFlats &&
    firstNote.noteType === "sharp" // Don't need to check for flats because they will always by default be sharp uless they are changed in this function
  ) {
    // update the sharp frequencies to standard frequencies
    firstNote.frequency = userKeys[randNum - 1].frequency;
    firstNote.noteType = "natural";
  }

  setRandomKeyOne(firstNote);
  console.log("here is what firstNote is:", firstNote);
  return firstNote;
}
