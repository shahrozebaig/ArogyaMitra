import { useEffect, useRef, useState } from "react";
import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";

function CameraTracker({ onRepUpdate }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const callbackRef = useRef(onRepUpdate);

  const [reps, setReps] = useState(0);
  const [status, setStatus] = useState("Initializing...");
  const [confidence, setConfidence] = useState(0);

  // keep latest callback
  useEffect(() => {
    callbackRef.current = onRepUpdate;
  }, [onRepUpdate]);

  useEffect(() => {
    let count = 0;
    let down = false;

    const pose = new Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults((results) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

      if (results.poseLandmarks) {
        setStatus("Detecting...");
        setConfidence(
          Math.round(results.poseLandmarks[0].visibility * 100)
        );

        const shoulder = results.poseLandmarks[11];
        const elbow = results.poseLandmarks[13];

        if (elbow.y > shoulder.y) {
          down = true;
        }

        if (elbow.y < shoulder.y && down) {
          count++;
          down = false;

          setReps(count);

          // ✅ safe callback usage
          if (callbackRef.current) {
            callbackRef.current(count);
          }
        }

        results.poseLandmarks.forEach((lm) => {
          ctx.beginPath();
          ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 4, 0, 2 * Math.PI);
          ctx.fillStyle = "lime";
          ctx.fill();
        });
      } else {
        setStatus("No Body Detected");
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await pose.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    camera.start();
  }, []);

  return (
    <div className="space-y-2">
      <video ref={videoRef} className="hidden" />

      <div className="relative group">
        <canvas
          ref={canvasRef}
          width="640"
          height="400"
          className="rounded-2xl w-full border border-white/10 shadow-2xl"
        />
        
        {/* Modern Overlay */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
             <div className={`w-2 h-2 rounded-full ${status === 'Detecting...' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
             <div>
               <p className="text-[10px] uppercase font-bold text-white/40 leading-none">System Status</p>
               <p className="text-xs font-semibold text-white">{status}</p>
             </div>
          </div>

          <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-right">
             <p className="text-[10px] uppercase font-bold text-white/40 leading-none">Confidence</p>
             <p className="text-xs font-semibold text-white">{confidence}%</p>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
          <div className="bg-purple-600/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-purple-400/30 flex justify-between items-center shadow-xl">
             <div className="flex items-center gap-3">
                <span className="text-xl">🏃</span>
                <div>
                  <p className="text-[10px] uppercase font-black text-purple-200 leading-none">Activity Detected</p>
                  <p className="text-sm font-bold text-white tracking-tight">Initializing movement tracking...</p>
                </div>
             </div>
             <div className="text-right">
                <p className="text-[10px] uppercase font-black text-purple-200 leading-none">Reps</p>
                <p className="text-2xl font-black text-white leading-none">{reps}</p>
             </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default CameraTracker;