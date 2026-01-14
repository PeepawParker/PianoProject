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
    pianoListenerSetup(frequencies, frequencies[index]).then(({ stop }) => {
      // Stops detect after 3 seconds
      setTimeout(() => {
        stop();
        let tolerance;
        if (frequenciesList[index] < 60) tolerance = 0.12;
        else if (frequenciesList[index] > 2000) tolerance = 0.015;
        else tolerance = 0.05;
        const newFrequencies: number[] = [];
        let total: number = 0;
        frequencies.forEach((num) => {
          if (
            num > 20 &&
            num < 4500 &&
            num > frequenciesList[index] - frequenciesList[index] * tolerance &&
            num < frequenciesList[index] + frequenciesList[index] * tolerance
          ) {
            newFrequencies.push(num);
          }
        });

        newFrequencies.forEach((num) => {
          total += num;
        });
        const average = total / newFrequencies.length;

        console.log("here is the freq: ", newFrequencies);

        if (newFrequencies.length === 0) {
          resolve(0);
          return;
        }

        resolve(average);
      }, 3000);
    });
  });
}

// This function will live listen to the frequencies that are being transmitted through the users mic. If at any point they are within the range that the program deems worthy it will mark the note as correct and then move onto the next random note within the users note selection

export async function pianoLiveListener(
  getKeyFrequency: () => number,
  setCorrect: (correct: boolean) => void
): Promise<() => void> {
  const { stop } = await pianoListenerSetup([], getKeyFrequency(), (pitch) => {
    const frequency = parseFloat(pitch.toFixed(2));
    const targetFrequency = getKeyFrequency();
    const tolerance = targetFrequency < 80 ? 0.04 : 0.01;

    // returns if the frequency was undefined
    if (!targetFrequency) return;
    if (
      frequency >= targetFrequency - targetFrequency * tolerance &&
      frequency <= targetFrequency + targetFrequency * tolerance
    ) {
      setCorrect(true);
    }
  });

  return stop;
}

async function pianoListenerSetup(
  frequencies: number[],
  expectedFrequency: number,
  pitchCorrectness?: (pitch: number) => void
): Promise<PianoListenerSetupReturn> {
  // audio processing workspace
  const audioCtx = new AudioContext();
  // Makes the audio data accessible to the detector
  const analyser = audioCtx.createAnalyser();
  // frequency resolution (the bigger the number the more accurate the frequency detection, but longer latency)

  analyser.fftSize =
    expectedFrequency > 2000 || expectedFrequency < 100 ? 8192 : 2048;

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
    let minClarity;
    if (pitch < 80) minClarity = 0.6;
    else if (pitch > 2000) minClarity = 0.7;
    else minClarity = 0.85;

    if (pitch && clarity > minClarity && pitch > 20) {
      if (!pitchCorrectness) {
        frequencies.push(parseFloat(pitch.toFixed(2)));
      } else if (pitchCorrectness) {
        pitchCorrectness(pitch);
      }
    }

    // Makes this function run (whatever their monitor refresh rate is) per second
    requestAnimationFrame(() => detect(frequencies));
  }

  // detect will initially run one time
  detect(frequencies);

  // After this initial call it will return the stop function
  // requestAnimationFrame(() => detect(frequencies)); is a non blocking function that will continue to schedult detect calls until we set running to false which will cause it to return
  // request animation frame schedules calls to the designated function one time per available frame
  return {
    stop: () => {
      running = false;
      audioCtx.close();
      stream.getTracks().forEach((t) => t.stop());
    },
  };
}
