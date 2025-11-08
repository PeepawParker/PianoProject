import { PitchDetector } from "pitchy";

// Simply asks the user if they can use their mic, if they allow then it takes in sounds if the sound passes a clarity score it can be good enough to be used
// TODO MAKE IT SO THAT THERE IS LIKE A 3 SECOND COUNTDOWN OR SOMETHING AND THEN IT RECORDS AUDIO FOR 3 SECONDS THEN YOU GET THE AVERAGE FREQUENCY OF THE GOOD FREQUENCIES TO BE ADDED TO THE DATABASE FOR THAT NOTE

// returns a promise so that you can't press the button while its currently running
export function pianoListenerThreeSec() {
  return new Promise((resolve) => {
    const frequencies: GLfloat[] = [];
    pianoListenerSetup(frequencies).then(({ stop }) => {
      // Stops detect after 3 seconds
      setTimeout(() => {
        stop();
        console.log("recording finished");
        console.log(frequencies);

        let count: GLfloat = 0.0;
        for (let i = 0; i < frequencies.length; i++) {
          count += frequencies[i];
        }

        const average = count / frequencies.length;

        console.log(`Here was the average that was produced: ${average}`);
        resolve(frequencies);
      }, 3000);
    });
  });
}

async function pianoListenerSetup(frequencies: GLfloat[]) {
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
  function detect(frequencies: GLfloat[]) {
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
