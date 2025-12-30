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
  frequency: number;
}

interface GrandStaffRangeProps {
  highNoteValue: string;
  highIsSharp: boolean;
  lowNoteValue: string;
  lowIsSharp: boolean;
  userKeys: UserNote[];
}

export default function GrandStaffRange({
  highNoteValue,
  highIsSharp,
  lowNoteValue,
  lowIsSharp,
  userKeys,
}: GrandStaffRangeProps) {
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

    const highVoice = new Voice({ numBeats: 4, beatValue: 4 });
    highVoice.addTickables([highNote]);
    new Formatter()
      .joinVoices([highVoice, lowVoice])
      .format([highVoice, lowVoice], 400);
    highVoice.draw(context, trebleStave);
    lowVoice.draw(context, trebleStave);
  }, [highNoteValue, highIsSharp, userKeys, lowNoteValue, lowIsSharp]);

  // Creates the ref
  return <div ref={containerRef} style={{ marginTop: "50px" }}></div>;
}
