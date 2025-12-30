import Key88 from "./Pianos/Key88";

function PianoKeySetupPage() {
  // Im going to need to get specifics of the piano like the number of keys that way I can create a layout of that piano for the user to map to their personal piano.
  // I should also have an option for keyboard that doesnt require this because their tuning should be the same no matter what

  // TODO make it so that the piano frequencies are the default values to egin with, but specif that if the users piano is out of tune that they can alter these frequencies to match with the frequencies of their piano

  // TODO offset the sharps from the standard notes so that a user can click on them to remap rather than the dumb up and down stuff we have right now

  return (
    <>
      <p>Piano Key Remap</p>
      <Key88 />
    </>
  );
}

export default PianoKeySetupPage;
