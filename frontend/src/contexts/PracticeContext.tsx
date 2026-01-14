import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type RefObject,
} from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { AppRootState } from "../stores/store";
import { getUserMappedKeys } from "../api/piano";
import type { UserNote } from "../pages/GrandStaves/GrandStaff";

type PracticeContextType = {
  start: boolean;
  userKeys: UserNote[];
  numPracticeNotes: number;
  trueRandom: boolean;
  includeSharps: boolean;
  includeFlats: boolean;
  highNoteIndex: number;
  lowNoteIndex: number;
  seconds: number;
  numCorrect: number;
  randomNotes: UserNote[];
  noteIndex: number;
  trebleStave: boolean;
  bassStave: boolean;

  setStart: React.Dispatch<React.SetStateAction<boolean>>;
  setUserKeys: React.Dispatch<React.SetStateAction<UserNote[]>>;
  setNumPracticeNotes: React.Dispatch<React.SetStateAction<number>>;
  setTrueRandom: React.Dispatch<React.SetStateAction<boolean>>;
  setIncludeSharps: React.Dispatch<React.SetStateAction<boolean>>;
  setIncludeFlats: React.Dispatch<React.SetStateAction<boolean>>;
  setHighNoteIndex: React.Dispatch<React.SetStateAction<number>>;
  setLowNoteIndex: React.Dispatch<React.SetStateAction<number>>;
  setSeconds: React.Dispatch<React.SetStateAction<number>>;
  setNumCorrect: React.Dispatch<React.SetStateAction<number>>;
  setRandomNotes: React.Dispatch<React.SetStateAction<UserNote[]>>;
  setNoteIndex: React.Dispatch<React.SetStateAction<number>>;
  settrebleStave: React.Dispatch<React.SetStateAction<boolean>>;
  setbassStave: React.Dispatch<React.SetStateAction<boolean>>;

  currentNoteRef: RefObject<UserNote | undefined>;
};

const PracticeContext = createContext<PracticeContextType | null>(null);

export function PracticeProvider({ children }: { children: React.ReactNode }) {
  const [start, setStart] = useState<boolean>(false);
  const [userKeys, setUserKeys] = useState<UserNote[]>([]);
  const [numPracticeNotes, setNumPracticeNotes] = useState<number>(1);
  const [trueRandom, setTrueRandom] = useState<boolean>(false);
  const [includeSharps, setIncludeSharps] = useState<boolean>(false);
  const [includeFlats, setIncludeFlats] = useState<boolean>(false);
  const [highNoteIndex, setHighNoteIndex] = useState<number>(0);
  const [lowNoteIndex, setLowNoteIndex] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [numCorrect, setNumCorrect] = useState<number>(0);
  const [randomNotes, setRandomNotes] = useState<UserNote[]>([]);
  const [noteIndex, setNoteIndex] = useState<number>(0);
  const [trebleStave, settrebleStave] = useState<boolean>(true);
  const [bassStave, setbassStave] = useState<boolean>(true);

  const currentNoteRef = useRef<UserNote | undefined>(undefined);

  const { userId } = useSelector((state: AppRootState) => state.user);
  const { pianoId } = useParams();

  // Get user keys
  useEffect(() => {
    if (userId && pianoId) {
      getUserMappedKeys(userId, pianoId, setUserKeys);
    }
  }, [pianoId, userId]);

  // Set highNoteIndex when userKeys loads
  useEffect(() => {
    if (userKeys.length > 0) {
      setHighNoteIndex(userKeys.length - 1);
    }
  }, [userKeys.length]);

  return (
    <PracticeContext.Provider
      value={{
        start,
        userKeys,
        numPracticeNotes,
        trueRandom,
        includeSharps,
        includeFlats,
        highNoteIndex,
        lowNoteIndex,
        seconds,
        numCorrect,
        randomNotes,
        noteIndex,
        currentNoteRef,
        trebleStave,
        bassStave,
        setStart,
        setUserKeys,
        setNumPracticeNotes,
        setTrueRandom,
        setIncludeSharps,
        setIncludeFlats,
        setHighNoteIndex,
        setLowNoteIndex,
        setSeconds,
        setNumCorrect,
        setRandomNotes,
        setNoteIndex,
        settrebleStave,
        setbassStave,
      }}
    >
      {children}
    </PracticeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePractice() {
  const context = useContext(PracticeContext);
  if (!context) {
    throw new Error("usePractice must be used within PracticeProvider");
  }
  return context;
}
