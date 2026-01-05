import { enharmonicFlats, noteFrequencies } from "./notes88";
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
  } else if (!includeSharps && !includeFlats) {
    // update the sharp frequencies to standard frequencies
    console.log("LOOOOOK FIRST: ", firstNote);
    const noteName = firstNote.baseNote.replace("/", "");
    firstNote.frequency = noteFrequencies[noteName];
    firstNote.noteType = "natural";
    console.log("LOOOOOK FIRST AFTER: ", firstNote);
  }

  setRandomKeyOne(firstNote);
  return firstNote;
}
