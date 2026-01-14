import { useEffect, useRef } from "react";
import type { UserNote } from "./GrandStaff";
import {
  Renderer,
  Stave,
  StaveNote,
  StaveConnector,
  Accidental,
  Voice,
  Formatter,
} from "vexflow";

interface GrandStaffRangeProps {
  highNoteValue: string;
  highAccidental: string;
  lowNoteValue: string;
  lowAccidental: string;
  includeSharps: boolean;
  includeFlats: boolean;
  userKeys: UserNote[];
  trebleStaveBool: boolean;
  bassStaveBool: boolean;
}

export default function GrandStaffRange({
  highNoteValue,
  highAccidental,
  lowNoteValue,
  lowAccidental,
  includeSharps,
  includeFlats,
  userKeys,
  trebleStaveBool,
  bassStaveBool,
}: GrandStaffRangeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing content
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

    // Highest possible note on treble staff
    const highNote = new StaveNote({
      keys: [highNoteValue],
      duration: "w",
      clef: trebleStaveBool ? "treble" : "bass",
    });
    if (highAccidental === "sharp" && includeSharps) {
      highNote.addModifier(new Accidental("#"), 0);
    } else if (highAccidental === "flat" && includeFlats) {
      highNote.addModifier(new Accidental("b"), 0);
    } else if (highAccidental === "sharp" && includeFlats && !includeSharps) {
      highNote.addModifier(new Accidental("b"), 0);
    }

    const lowNote = new StaveNote({
      keys: [lowNoteValue],
      duration: "w",
      clef: trebleStaveBool ? "treble" : "bass",
    });
    if (lowAccidental === "sharp" && includeSharps) {
      lowNote.addModifier(new Accidental("#"), 0);
    } else if (lowAccidental === "flat" && includeFlats) {
      lowNote.addModifier(new Accidental("b"), 0);
    } else if (lowAccidental === "sharp" && includeFlats && !includeSharps) {
      lowNote.addModifier(new Accidental("b"), 0);
    }

    const lowVoice = new Voice({ numBeats: 4, beatValue: 4 });
    lowVoice.addTickables([lowNote]);

    const highVoice = new Voice({ numBeats: 4, beatValue: 4 });
    highVoice.addTickables([highNote]);
    new Formatter()
      .joinVoices([highVoice, lowVoice])
      .format([highVoice, lowVoice], 400);

    const staveToDrawOn = trebleStave || bassStave;

    if (staveToDrawOn) {
      highVoice.draw(context, staveToDrawOn);
      lowVoice.draw(context, staveToDrawOn);
    }

    if (userKeys && staveToDrawOn) {
      for (const userKey of userKeys) {
        // used to offset the userKeys from the range keys
        const spacer = new StaveNote({
          keys: ["b/4"],
          duration: "w",
          clef: trebleStaveBool ? "treble" : "bass",
        });
        spacer.setStyle({
          fillStyle: "transparent",
          strokeStyle: "transparent",
        });

        const finishedNote = new StaveNote({
          keys: [userKey.baseNote],
          duration: "w",
          clef: trebleStaveBool ? "treble" : "bass",
        });
        if (userKey.noteType === "sharp" && includeSharps) {
          finishedNote.addModifier(new Accidental("#"), 0);
        }
        // The userKeys only display sharps by default so just swap them to flats if they are sharp and either an ACDFG
        else if (
          userKey.noteType === "sharp" &&
          !includeSharps &&
          includeFlats
        ) {
          const canBeFlat = /^[ACDFG]/.test(userKey.baseNote);
          if (canBeFlat) finishedNote.addModifier(new Accidental("b"));
        }
        finishedNote.setStyle({ fillStyle: "green", strokeStyle: "green" });

        const userVoice = new Voice({ numBeats: 8, beatValue: 4 }); // double the beats
        userVoice.addTickables([spacer, finishedNote]);
        new Formatter().joinVoices([userVoice]).format([userVoice], 400);
        userVoice.draw(context, staveToDrawOn);
      }
    }
  }, [
    highNoteValue,
    userKeys,
    lowNoteValue,
    includeSharps,
    highAccidental,
    lowAccidental,
    includeFlats,
    trebleStaveBool,
    bassStaveBool,
  ]);

  // Creates the ref
  return <div ref={containerRef} style={{ marginTop: "50px" }}></div>;
}
