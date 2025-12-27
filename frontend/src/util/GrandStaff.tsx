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

interface GrandStaffProps {
  highNoteValue: string;
  highIsSharp: boolean;
  lowNoteValue: string;
  lowIsSharp: boolean;
  currentNoteValue: string;
  currentNoteIsSharp: boolean;
  userKeys: UserNote[] | undefined;
}

// TODO make these notes clickable allowing the user to go back to this index and remap the frequency

export default function GrandStaff({
  highNoteValue,
  highIsSharp,
  lowNoteValue,
  lowIsSharp,
  currentNoteValue,
  currentNoteIsSharp,
  userKeys,
}: GrandStaffProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing content
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

    // Highest possible note on treble staff
    const highNote = new StaveNote({
      keys: [highNoteValue],
      duration: "w",
      clef: "treble",
    });
    if (highIsSharp) {
      highNote.addModifier(new Accidental("#"), 0);
    }

    const lowNote = new StaveNote({
      keys: [lowNoteValue],
      duration: "w",
      clef: "treble",
    });
    if (lowIsSharp) {
      lowNote.addModifier(new Accidental("#"), 0);
    }

    const lowVoice = new Voice({ numBeats: 4, beatValue: 4 });
    lowVoice.addTickables([lowNote]);

    const trebleVoice = new Voice({ numBeats: 4, beatValue: 4 });
    trebleVoice.addTickables([highNote]);
    new Formatter()
      .joinVoices([trebleVoice, lowVoice])
      .format([trebleVoice, lowVoice], 400);
    trebleVoice.draw(context, trebleStave);
    lowVoice.draw(context, trebleStave);

    // Low note on bass staff
    const currentNote = new StaveNote({
      keys: [currentNoteValue],
      duration: "w",
      clef: "bass",
    });
    if (currentNoteIsSharp) {
      currentNote.addModifier(new Accidental("#"), 0);
    }

    const bassVoice = new Voice({ numBeats: 4, beatValue: 4 });
    bassVoice.addTickables([currentNote]);
    new Formatter().joinVoices([bassVoice]).format([bassVoice], 400);
    currentNote.setStyle({ fillStyle: "red", strokeStyle: "red" });
    bassVoice.draw(context, bassStave);

    // Correctly structure this
    if (userKeys) {
      for (const userKey of userKeys) {
        // used to offset the userKeys from the range keys
        const spacer = new StaveNote({
          keys: ["b/4"],
          duration: "w",
          clef: "bass",
        });
        spacer.setStyle({
          fillStyle: "transparent",
          strokeStyle: "transparent",
        });

        const finishedNote = new StaveNote({
          keys: [userKey.baseNote],
          duration: "w",
          clef: "bass",
        });
        if (userKey.isSharp) {
          finishedNote.addModifier(new Accidental("#"), 0);
        }
        finishedNote.setStyle({ fillStyle: "green", strokeStyle: "green" });

        const userVoice = new Voice({ numBeats: 8, beatValue: 4 }); // double the beats
        userVoice.addTickables([spacer, finishedNote]);
        new Formatter().joinVoices([userVoice]).format([userVoice], 400);
        userVoice.draw(context, bassStave);
      }
    }
  }, [
    highNoteValue,
    currentNoteValue,
    currentNoteIsSharp,
    highIsSharp,
    userKeys,
  ]);

  // Creates the ref
  return <div ref={containerRef} style={{ marginTop: "50px" }}></div>;
}
