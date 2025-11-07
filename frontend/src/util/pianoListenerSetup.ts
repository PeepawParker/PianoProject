import { PitchDetector } from "pitchy";

// Simply asks the user if they can use their mic, if they allow then it takes in sounds if the sound passes a clarity score it can be good enough to be used
// TODO MAKE IT SO THAT THERE IS LIKE A 3 SECOND COUNTDOWN OR SOMETHING AND THEN IT RECORDS AUDIO FOR 3 SECONDS THEN YOU GET THE AVERAGE FREQUENCY OF THE GOOD FREQUENCIES TO BE ADDED TO THE DATABASE FOR THAT NOTE

export async function pianoListenerSetup() {
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

  function detect() {
    // Gets the current audio and puts it in the buffer (the thing that holds the raw data)
    analyser.getFloatTimeDomainData(buffer);

    // Uses the data in the buffer to analyze the audio and figure out the frequency and the clarity of the note
    // The higher the clarity the more confident it is in its reading
    const [pitch, clarity] = detector.findPitch(buffer, audioCtx.sampleRate);

    // If the pitch has a clarity score of over 0.9 then it can be used
    if (pitch && clarity > 0.9) {
      console.log(`Detected frequency: ${pitch.toFixed(2)} Hz`);
    }

    // Makes this function run (whatever their monitor refresh rate is) per second
    requestAnimationFrame(detect);
  }

  detect();
}
