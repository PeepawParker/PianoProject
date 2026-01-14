import { useEffect, useRef } from "react";
import {
  Renderer,
  Stave,
  StaveNote,
  StaveConnector,
  Accidental,
  Voice,
  Formatter,
} from "vexflow";
import type { UserNote } from "./GrandStaff";

interface GrandStaffPracticeProps {
  randomNotes: UserNote[];
  noteIndex: number;
}

export default function GrandStaffPractice({
  randomNotes,
  noteIndex,
}: GrandStaffPracticeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const vf = new Renderer(containerRef.current, Renderer.Backends.SVG);
    vf.resize(500, 400);
    const context = vf.getContext();

    const trebleStave = new Stave(10, 70, 480);
    trebleStave.addClef("treble");
    trebleStave.setContext(context).draw();

    const bassStave = new Stave(10, 130, 480);
    bassStave.addClef("bass");
    bassStave.setContext(context).draw();

    new StaveConnector(trebleStave, bassStave)
      .setType(StaveConnector.type.BRACE)
      .setContext(context)
      .draw();

    new StaveConnector(trebleStave, bassStave)
      .setType(StaveConnector.type.SINGLE_LEFT)
      .setContext(context)
      .draw();

    new StaveConnector(trebleStave, bassStave)
      .setType(StaveConnector.type.SINGLE_RIGHT)
      .setContext(context)
      .draw();

    const staveNotes: StaveNote[] = [];

    for (let i: number = 0; i < randomNotes.length; i++) {
      const { baseNote, noteType } = randomNotes[i];

      const note = new StaveNote({
        keys: [baseNote],
        duration: "q",
        clef: "treble",
      });

      if (noteType === "sharp") {
        note.addModifier(new Accidental("#"), 0);
      } else if (noteType === "flat") {
        note.addModifier(new Accidental("b"), 0);
      }

      staveNotes.push(note);
    }

    const trebleVoice = new Voice({
      numBeats: randomNotes.length,
      beatValue: 4,
    });
    trebleVoice.addTickables(staveNotes);
    new Formatter().joinVoices([trebleVoice]).format([trebleVoice], 100);

    // Sets color for user feedback to let them know if they got it right or wrong also sets the current note to orange to let users know what note they are on if they forgot

    staveNotes[noteIndex].setStyle({
      fillStyle: "orange",
      strokeStyle: "orange",
    });

    trebleVoice.draw(context, trebleStave);
  }, [noteIndex, randomNotes]);

  return <div ref={containerRef} style={{ marginTop: "50px" }}></div>;
}
