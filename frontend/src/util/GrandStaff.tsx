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
import { notes } from "./notes88";
import type { PianoKey } from "../api/Piano/getPiano";

// TODO fix the issue where the accidental stays on the note
// Then make it so you can submit this and it adds the notes that have been mapped so far as it listens to the piano

interface GrandStaffProps {
  highNoteValue: string;
  lowNoteValue: string;
  highIsSharp: boolean;
  lowIsSharp: boolean;
  userKeys: PianoKey[] | undefined;
}

// TODO have this update and to see what notes the user already has mapped
// TODO make these notes clickable allowing the user to go back to this index and remap the frequency

export default function GrandStaff({
  highNoteValue,
  lowNoteValue,
  highIsSharp,
  lowIsSharp,
  userKeys,
}: GrandStaffProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing content
    containerRef.current.innerHTML = "";

    const vf = new Renderer(containerRef.current, Renderer.Backends.SVG);
    vf.resize(500, 300);
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
    }

    // Correctly structure this
    if (userKeys) {
      for (const userKey of userKeys) {
        console.log(
          "Hello this should print the already defined notes here: ",
          notes[userKey.note_id - 1]
        );
      }
    }

    const bassVoice = new Voice({ numBeats: 1, beatValue: 4 });
    bassVoice.addTickables([lowNote]);
    new Formatter().joinVoices([bassVoice]).format([bassVoice], 400);
    bassVoice.draw(context, bassStave);
  }, [highNoteValue, lowNoteValue, lowIsSharp, highIsSharp, userKeys]);

  // Creates the ref
  return <div ref={containerRef} style={{ marginTop: "50px" }}></div>;
}
