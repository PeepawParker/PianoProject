import { PitchDetector } from "pitchy";
type PianoListenerSetupReturn = {
  stop: () => void;
};
const frequenciesList: number[] = [
  27.5, 29.14, 30.87, 32.7, 34.65, 36.71, 38.89, 41.2, 43.65, 46.25, 49.0,
  51.91, 55.0, 58.27, 61.74, 65.41, 69.3, 73.42, 77.78, 82.41, 87.31, 92.5,
  98.0, 103.83, 110.0, 116.54, 123.47, 130.81, 138.59, 146.83, 155.56, 164.81,
  174.61, 185.0, 196.0, 207.65, 220.0, 233.08, 246.94, 261.63, 277.18, 293.66,
  311.13, 329.63, 349.23, 369.99, 392.0, 415.3, 440.0, 466.16, 493.88, 523.25,
  554.37, 587.33, 622.25, 659.26, 698.46, 739.99, 783.99, 830.61, 880.0, 932.33,
  987.77, 1046.5, 1108.73, 1174.66, 1244.51, 1318.51, 1396.91, 1479.98, 1567.98,
  1661.22, 1760.0, 1864.66, 1975.53, 2093.0, 2217.46, 2349.32, 2489.02, 2637.02,
  2793.83, 2959.96, 3135.96, 3322.44, 3520.0, 3729.31, 3951.07, 4186.01,
];

// Simply asks the user if they can use their mic, if they allow then it takes in sounds if the sound passes a clarity score it can be good enough to be used

// returns a promise so that you can't press the button while its currently running

// TODO have it show the user what the current frequency being measured is so that they can confirm that the frequency is correct before inputting it into the DB
export function pianoListenerThreeSec(index: number): Promise<number> {
  return new Promise((resolve) => {
    const frequencies: number[] = [];
    pianoListenerSetup(frequencies).then(({ stop }) => {
      // Stops detect after 3 seconds
      setTimeout(() => {
        stop();
        const newFrequencies: number[] = [];
        let total: number = 0;
        let average: number;
        frequencies.forEach((num) => {
          if (
            num > 25 &&
            num < 4500 &&
            num > frequenciesList[index] - frequenciesList[index] * 0.05 &&
            num < frequenciesList[index] + frequenciesList[index] * 0.05 // 5% margin of error
          ) {
            newFrequencies.push(num);
          }
        });

        if (newFrequencies.length <= 20) {
          // TODO have it somehow distinguish the background from the piano to map the values anyways even if they are not close to what the sounds should be
          average = 0;
        } else {
          newFrequencies.forEach((num) => {
            total += num;
          });
          average = total / newFrequencies.length;
        }

        resolve(average);
      }, 3000);
    });
  });
}

// This function will live listen to the frequencies that are being transmitted through the users mic. If at any point they are within the range that the program deems worthy it will mark the note as correct and then move onto the next random note within the users note selection

export function pianoLiveListener(
  frequencies: number[],
  setCorrect: (correct: boolean) => void,
  start: boolean
) {
  pianoListenerSetup(frequencies, setCorrect).then(({ stop }) => {
    if (start === false) {
      stop();
    }

    // listen to the current frequency set correct to true if it is within the correct range
  });
}

async function pianoListenerSetup(
  frequencies: number[]
): Promise<PianoListenerSetupReturn> {
  // audio processing workspace
  const audioCtx = new AudioContext();
  // Makes the audio data accessible to the detector
  const analyser = audioCtx.createAnalyser();
  // frequency resolution (the bigger the number the more accurate the frequency detection, but slower to react to changes)
  analyser.fftSize = 4096;

  const bufferLength = analyser.fftSize;
  // holds the raw data
  const buffer = new Float32Array(bufferLength);
  // Turns the raw data into useful information
  const detector = PitchDetector.forFloat32Array(bufferLength);

  // asks browser if app can use microphone
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });
  // Converts the stream into something the audioCtx can work with
  const source = audioCtx.createMediaStreamSource(stream);
  source.connect(analyser); // Connects the converted stream to the analyser

  let running = true;
  function detect(frequencies: number[]) {
    if (!running) return;
    // Gets the current audio and puts it in the buffer (the thing that holds the raw data)
    analyser.getFloatTimeDomainData(buffer);

    // Uses the data in the buffer to analyze the audio and figure out the frequency and the clarity of the note
    // The higher the clarity the more confident it is in its reading
    const [pitch, clarity] = detector.findPitch(buffer, audioCtx.sampleRate);

    // adds frequency to array if its clear enough, and over 22 Hz (background noise)
    if (pitch && clarity > 0.9 && pitch > 22) {
      frequencies.push(parseFloat(pitch.toFixed(2)));
    }

    // Makes this function run (whatever their monitor refresh rate is) per second
    requestAnimationFrame(() => detect(frequencies));
  }

  detect(frequencies);

  // Returns a stop object to control when the detect loop should end.
  // This exits the pianoListenerSetup() but the detect function continues running on its own until this stop function is called making running = false
  return {
    stop: () => {
      running = false;
      audioCtx.close();
      stream.getTracks().forEach((t) => t.stop());
    },
  };
}
