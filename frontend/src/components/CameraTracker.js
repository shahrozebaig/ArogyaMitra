import { useEffect, useRef, useState } from "react";
import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";

function CameraTracker({ onRepUpdate, onStatusUpdate, onFeedbackUpdate, onConfidenceUpdate, isActive }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const poseRef = useRef(null);
  const countRef = useRef(0);
  const downRef = useRef(false);

  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    const messages = ["Great form!", "Keep it up!", "Excellent rep!", "Perfect!", "Stay focused!"];

    pose.onResults((results) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

      if (results.poseLandmarks) {
        if (onStatusUpdate) onStatusUpdate("Detecting...");
        const conf = Math.round(results.poseLandmarks[0].visibility * 100);
        if (onConfidenceUpdate) onConfidenceUpdate(conf);

        const shoulder = results.poseLandmarks[11];
        const elbow = results.poseLandmarks[13];

        if (elbow.y > shoulder.y + 0.05) {
          downRef.current = true;
          if (onFeedbackUpdate) onFeedbackUpdate("Going down...");
        }

        if (elbow.y < shoulder.y && downRef.current) {
          countRef.current++;
          downRef.current = false;
          const msg = messages[Math.floor(Math.random() * messages.length)];
          if (onFeedbackUpdate) onFeedbackUpdate(msg);
          if (onRepUpdate) onRepUpdate(countRef.current);
        }

        results.poseLandmarks.forEach((lm) => {
          ctx.beginPath();
          ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 2, 0, 2 * Math.PI);
          ctx.fillStyle = "#a855f7";
          ctx.fill();
        });
      } else {
        if (onStatusUpdate) onStatusUpdate("Searching...");
        if (onFeedbackUpdate) onFeedbackUpdate("Positioning...");
      }
    });

    poseRef.current = pose;

    return () => {
      if (poseRef.current) {
        poseRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!isActive || !videoRef.current) {
      if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null;
      }
      return;
    }

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (isActive && poseRef.current && videoRef.current) {
          try {
            await poseRef.current.send({ image: videoRef.current });
          } catch (e) {
            console.error("Pose error:", e);
          }
        }
      },
      width: 640,
      height: 480,
    });

    cameraRef.current = camera;
    camera.start();

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null;
      }
    };
  }, [isActive]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-black">
      <video ref={videoRef} className="hidden" />
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        className="w-full h-full object-cover opacity-90"
      />
    </div>
  );
}

export default CameraTracker;