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

interface GrandStaffPracticeProps {
  currentNoteValue: string;
  currentNoteIsSharp: boolean;
  correct: boolean | null;
}

export default function GrandStaffPractice({
  currentNoteValue,
  currentNoteIsSharp,
  correct,
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

    const currentNote = new StaveNote({
      keys: [currentNoteValue],
      duration: "q",
      clef: "treble",
    });
    if (currentNoteIsSharp) {
      currentNote.addModifier(new Accidental("#"), 0);
    }

    const trebleVoice = new Voice({ numBeats: 1, beatValue: 4 });
    trebleVoice.addTickables([currentNote]);
    new Formatter().joinVoices([trebleVoice]).format([trebleVoice], 400);

    // Sets color for user feedback to let them know if they got it right or wrong
    currentNote.setStyle({
      fillStyle:
        correct === true ? "green" : correct === false ? "red" : "black",
      strokeStyle:
        correct === true ? "green" : correct === false ? "red" : "black",
    });

    trebleVoice.draw(context, trebleStave);
  }, [correct, currentNoteIsSharp, currentNoteValue]);

  return <div ref={containerRef} style={{ marginTop: "50px" }}></div>;
}
