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
  trebleStaveBool: boolean;
  bassStaveBool: boolean;
}

export default function GrandStaffPractice({
  randomNotes,
  noteIndex,
  trebleStaveBool,
  bassStaveBool,
}: GrandStaffPracticeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const vf = new Renderer(containerRef.current, Renderer.Backends.SVG);
    vf.resize(500, 400);
    const context = vf.getContext();

    let trebleStave: Stave | boolean = false;
    let bassStave: Stave | boolean = false;

    if (trebleStaveBool) {
      trebleStave = new Stave(10, 70, 480);
      trebleStave.addClef("treble");
      trebleStave.setContext(context).draw();
    }

    if (bassStaveBool) {
      bassStave = new Stave(10, 130, 480);
      bassStave.addClef("bass");
      bassStave.setContext(context).draw();
    }

    if (trebleStave && bassStave) {
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
    }

    const staveNotes: StaveNote[] = [];

    for (let i: number = 0; i < randomNotes.length; i++) {
      const { baseNote, noteType } = randomNotes[i];

      const note = new StaveNote({
        keys: [baseNote],
        duration: "w",
        clef: trebleStaveBool ? "treble" : "bass",
      });

      if (noteType === "sharp") {
        note.addModifier(new Accidental("#"), 0);
      } else if (noteType === "flat") {
        note.addModifier(new Accidental("b"), 0);
      }

      staveNotes.push(note);
    }

    let trebleVoice: Voice | boolean = false;
    let bassVoice: Voice | boolean = false;

    if (trebleStave) {
      trebleVoice = new Voice({
        numBeats: randomNotes.length * 4,
        beatValue: 4,
      });
      trebleVoice.addTickables(staveNotes);
      new Formatter().joinVoices([trebleVoice]).format([trebleVoice], 100);
    } else if (bassStave) {
      bassVoice = new Voice({
        numBeats: randomNotes.length * 4,
        beatValue: 4,
      });
      bassVoice.addTickables(staveNotes);
      new Formatter().joinVoices([bassVoice]).format([bassVoice], 100);
    }

    // Sets color for user feedback to let them know if they got it right or wrong also sets the current note to orange to let users know what note they are on if they forgot

    staveNotes[noteIndex].setStyle({
      fillStyle: "orange",
      strokeStyle: "orange",
    });

    if (trebleVoice && trebleStave) {
      trebleVoice.draw(context, trebleStave);
    } else if (bassVoice && bassStave) {
      bassVoice.draw(context, bassStave);
    }
  }, [bassStaveBool, noteIndex, randomNotes, trebleStaveBool]);

  return <div ref={containerRef} style={{ marginTop: "50px" }}></div>;
}
