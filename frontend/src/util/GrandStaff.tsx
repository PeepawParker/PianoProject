import React, { useEffect, useRef } from "react";
import {
  Renderer,
  Stave,
  StaveNote,
  StaveConnector,
  Accidental,
  Voice,
  Formatter,
} from "vexflow";

// fix the issue where the accidental stays on the note
// Then make it so you can submit this and it adds the notes that have been mapped so far as it listens to the piano

interface GrandStaffProps {
  highNoteValue: string;
  lowNoteValue: string;
  highIsSharp: boolean;
  lowIsSharp: boolean;
}

export default function GrandStaff({
  highNoteValue,
  lowNoteValue,
  highIsSharp,
  lowIsSharp,
}: GrandStaffProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing content
    containerRef.current.innerHTML = "";

    const vf = new Renderer(containerRef.current, Renderer.Backends.SVG);
    vf.resize(500, 180);
    const context = vf.getContext();

    const trebleStave = new Stave(10, 0, 480);
    trebleStave.addClef("treble");
    trebleStave.setContext(context).draw();

    const bassStave = new Stave(10, 80, 480);
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

    // High note on treble staff
    const highNote = new StaveNote({
      keys: [highNoteValue],
      duration: "q",
      clef: "treble",
    });
    if (highIsSharp) {
      highNote.addModifier(new Accidental("#"), 0);
    }

    const trebleVoice = new Voice({ numBeats: 1, beatValue: 4 });
    trebleVoice.addTickables([highNote]);
    new Formatter().joinVoices([trebleVoice]).format([trebleVoice], 400);
    trebleVoice.draw(context, trebleStave);

    // Low note on bass staff
    const lowNote = new StaveNote({
      keys: [lowNoteValue],
      duration: "q",
      clef: "bass",
    });
    if (lowIsSharp) {
      lowNote.addModifier(new Accidental("#"), 0);
    } else {
      lowNote.addModifier(new Accidental("n"), 0);
    }

    const bassVoice = new Voice({ numBeats: 1, beatValue: 4 });
    bassVoice.addTickables([lowNote]);
    new Formatter().joinVoices([bassVoice]).format([bassVoice], 400);
    bassVoice.draw(context, bassStave);
  }, [highNoteValue, lowNoteValue, lowIsSharp, highIsSharp]);

  // Creates the ref
  return <div ref={containerRef}></div>;
}
