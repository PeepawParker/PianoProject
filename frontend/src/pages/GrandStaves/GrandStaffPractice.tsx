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
  NoteOneValue: string;
  NoteOneAccidental: string;
  NoteTwoValue: string;
  NoteTwoAccidental: string;
  NoteThreeValue: string;
  NoteThreeAccidental: string;
  NoteFourValue: string;
  NoteFourAccidental: string;
  noteIndex: number;
  correct: boolean | null;
}

export default function GrandStaffPractice({
  NoteOneValue,
  NoteOneAccidental,
  NoteTwoValue,
  NoteTwoAccidental,
  NoteThreeValue,
  NoteThreeAccidental,
  NoteFourValue,
  NoteFourAccidental,
  noteIndex,
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

    const noteOne = new StaveNote({
      keys: [NoteOneValue],
      duration: "q",
      clef: "treble",
    });
    if (NoteOneAccidental === "sharp") {
      noteOne.addModifier(new Accidental("#"), 0);
    } else if (NoteOneAccidental === "flat") {
      noteOne.addModifier(new Accidental("b"), 0);
    }

    const noteTwo = new StaveNote({
      keys: [NoteTwoValue],
      duration: "q",
      clef: "treble",
    });
    if (NoteTwoAccidental === "sharp") {
      noteTwo.addModifier(new Accidental("#"), 0);
    } else if (NoteTwoAccidental === "flat") {
      noteTwo.addModifier(new Accidental("b"), 0);
    }

    const noteThree = new StaveNote({
      keys: [NoteThreeValue],
      duration: "q",
      clef: "treble",
    });
    if (NoteThreeAccidental === "sharp") {
      noteTwo.addModifier(new Accidental("#"), 0);
    } else if (NoteThreeAccidental === "flat") {
      noteTwo.addModifier(new Accidental("b"), 0);
    }

    const noteFour = new StaveNote({
      keys: [NoteFourValue],
      duration: "q",
      clef: "treble",
    });
    if (NoteFourAccidental === "sharp") {
      noteTwo.addModifier(new Accidental("#"), 0);
    } else if (NoteFourAccidental === "flat") {
      noteTwo.addModifier(new Accidental("b"), 0);
    }

    const trebleVoice = new Voice({ numBeats: 4, beatValue: 4 });
    trebleVoice.addTickables([noteOne, noteTwo, noteThree, noteFour]);
    new Formatter().joinVoices([trebleVoice]).format([trebleVoice], 100);

    // Sets color for user feedback to let them know if they got it right or wrong
    if (noteIndex === 0) {
      noteOne.setStyle({
        fillStyle:
          correct === true ? "green" : correct === false ? "red" : "orange",
        strokeStyle:
          correct === true ? "green" : correct === false ? "red" : "orange",
      });
    } else if (noteIndex === 1) {
      noteTwo.setStyle({
        fillStyle:
          correct === true ? "green" : correct === false ? "red" : "orange",
        strokeStyle:
          correct === true ? "green" : correct === false ? "red" : "orange",
      });
    } else if (noteIndex === 2) {
      noteThree.setStyle({
        fillStyle:
          correct === true ? "green" : correct === false ? "red" : "orange",
        strokeStyle:
          correct === true ? "green" : correct === false ? "red" : "orange",
      });
    } else if (noteIndex === 3) {
      noteFour.setStyle({
        fillStyle:
          correct === true ? "green" : correct === false ? "red" : "orange",
        strokeStyle:
          correct === true ? "green" : correct === false ? "red" : "orange",
      });
    }

    trebleVoice.draw(context, trebleStave);
  }, [
    NoteFourAccidental,
    NoteFourValue,
    NoteOneAccidental,
    NoteOneValue,
    NoteThreeAccidental,
    NoteThreeValue,
    NoteTwoAccidental,
    NoteTwoValue,
    correct,
    noteIndex,
  ]);

  return <div ref={containerRef} style={{ marginTop: "50px" }}></div>;
}
