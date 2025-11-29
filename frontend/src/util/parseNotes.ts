export default function parseNotes(note: string) {
  note = note.slice(0, 1) + "/" + note.slice(1);
  if (note.includes("#")) {
    return { baseNote: note.replace("#", ""), isSharp: true };
  } else {
    return { baseNote: note, isSharp: false };
  }
}
