export default function parseNotes(note: string, isFlat?: boolean) {
  note = note.slice(0, 1) + "/" + note.slice(1);

  if (isFlat) {
    // tests to see if the note is sharp and one of the letters that can be a flat
    const canBeFlat = /^[ACDFG]\/#/.test(note);
    if (canBeFlat) {
      return { baseNote: note.replace("#", ""), noteType: "flat" };
    }
  }
  if (note.includes("#")) {
    return { baseNote: note.replace("#", ""), noteType: "sharp" };
  } else {
    return { baseNote: note, noteType: "natural" };
  }
}
