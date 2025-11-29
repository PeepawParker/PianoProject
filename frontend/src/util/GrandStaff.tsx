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

export interface UserNote {
  baseNote: string;
  isSharp: boolean;
  note_id: number;
}

// TODO make it so that the range notes are stagnant but the current note is like red and moves to indicate the current note being mapped
// TODO make the notes live update as the user submits new frequencies to the database
// TODO allow users to update note values

interface GrandStaffProps {
  highNoteValue: string;
  lowNoteValue: string;
  highIsSharp: boolean;
  lowIsSharp: boolean;
  userKeys: UserNote[] | undefined;
}

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

    const bassVoice = new Voice({ numBeats: 1, beatValue: 4 });
    bassVoice.addTickables([lowNote]);
    new Formatter().joinVoices([bassVoice]).format([bassVoice], 400);
    bassVoice.draw(context, bassStave);

    // Correctly structure this
    if (userKeys) {
      for (const userKey of userKeys) {
        // used to offset the userKeys from the range keys
        const spacer = new StaveNote({
          keys: ["b/4"],
          duration: "qr",
          clef: "bass",
        });
        spacer.setStyle({
          fillStyle: "transparent",
          strokeStyle: "transparent",
        });

        const note = new StaveNote({
          keys: [userKey.baseNote],
          duration: "q",
          clef: "bass",
        });
        if (userKey.isSharp) {
          note.addModifier(new Accidental("#"), 0);
        }
        note.setStyle({ fillStyle: "green", strokeStyle: "green" });

        const userVoice = new Voice({ numBeats: 2, beatValue: 4 }); // double the beats
        userVoice.addTickables([spacer, note]);
        new Formatter().joinVoices([userVoice]).format([userVoice], 400);
        userVoice.draw(context, bassStave);
      }
    }
  }, [highNoteValue, lowNoteValue, lowIsSharp, highIsSharp, userKeys]);

  // Creates the ref
  return <div ref={containerRef} style={{ marginTop: "50px" }}></div>;
}
