import { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from '@vladmandic/face-api';

const WebcamProctor = ({ onViolation }) => {
  const webcamRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceStatus, setFaceStatus] = useState('Initializing...');

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = 'https://raw.githubusercontent.com/vladmandic/face-api/master/model/';
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        setModelsLoaded(true);
        setFaceStatus('Monitoring Active');
      } catch (err) {
        console.error('Failed to load face-api models', err);
        setFaceStatus('Proctoring Error');
      }
    };
    loadModels();
  }, []);

  const noFaceCounter = useRef(0);
  const multipleFaceCounter = useRef(0);

  useEffect(() => {
    if (!modelsLoaded) return;

    const detectFace = async () => {
      if (
        webcamRef.current &&
        webcamRef.current.video &&
        webcamRef.current.video.readyState === 4
      ) {
        const video = webcamRef.current.video;
        const detections = await faceapi.detectAllFaces(
          video,
          new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.3 })
        );

        if (detections.length === 0) {
          noFaceCounter.current += 1;
          multipleFaceCounter.current = 0;
          
          if (noFaceCounter.current >= 3) {
            setFaceStatus('No Face Detected!');
            if (onViolation) onViolation('no-face');
            noFaceCounter.current = 0; // Reset after logging to prevent instant spamming
          }
        } else if (detections.length > 1) {
          multipleFaceCounter.current += 1;
          noFaceCounter.current = 0;
          
          if (multipleFaceCounter.current >= 2) {
            setFaceStatus('Multiple Faces Detected!');
            if (onViolation) onViolation('multiple-faces');
            multipleFaceCounter.current = 0; // Reset after logging
          }
        } else {
          noFaceCounter.current = 0;
          multipleFaceCounter.current = 0;
          setFaceStatus('Monitoring Active');
        }
      }
    };

    const interval = setInterval(detectFace, 1000); // Check every 1 second
    return () => clearInterval(interval);
  }, [modelsLoaded, onViolation]);

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg border-2 border-slate-700 relative">
      <Webcam
        ref={webcamRef}
        audio={false}
        className="w-full h-auto object-cover"
        mirrored={true}
      />
      <div className="absolute top-2 right-2 flex items-center gap-2 bg-black/50 text-white px-2 py-1 rounded text-xs font-medium">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
        REC
      </div>
      <div className={`text-xs text-center py-2 px-4 border-t border-slate-700 font-medium ${
        faceStatus === 'Monitoring Active' ? 'bg-slate-800 text-slate-300' : 
        faceStatus === 'Initializing...' ? 'bg-slate-800 text-amber-300' :
        'bg-red-900 text-red-200'
      }`}>
        {faceStatus}
      </div>
    </div>
  );
};

export default WebcamProctor;
