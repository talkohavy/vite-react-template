import { useEffect, useRef, useState } from 'react';

export function useMediaCaptureApiPageLogic() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isColumnView, setIsColumnView] = useState(false);

  const startCameraDisabled = Boolean(stream);
  const takePictureDisabled = !(stream && isStreaming);

  function toggleRowAndColumnLayout() {
    setIsColumnView((prev) => !prev);
  }

  useEffect(() => {
    return () => {
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => void track.stop());
      }
    };
  }, [stream]);

  async function startCamera() {
    setError(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        // video: { width: { min: 1920 }, height: { min: 1080 }, frameRate: { min: 30 } }, // <--- video: true or... 3840 x 2160, 1920 x 1080, 1280 x 720,
        video: { width: 1920, height: 1080 },
        audio: false,
      });

      setStream(mediaStream);

      const video = videoRef.current;

      if (!video) return;

      video.srcObject = mediaStream;

      await video.play();
    } catch (error) {
      const message = error.message || String(error) || error.name;
      setError(`Camera error: ${message}`);
    }
  }

  function onVideoCanPlay() {
    const video = videoRef.current;

    const canPlayVideo = video && !isStreaming;

    if (!canPlayVideo) return;

    setIsStreaming(true);
  }

  function stopCamera() {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => void track.stop());

      setStream(null);
    }

    setIsStreaming(false);
    setPhotoDataUrl(null);

    const video = videoRef.current;

    if (video) video.srcObject = null;
  }

  function takePicture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const canTakePicture = video && canvas && video.videoWidth > 0;

    if (!canTakePicture) return setPhotoDataUrl(null);

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const canvasWidth = video.videoWidth;
    const canvasHeight = video.videoHeight;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.drawImage(video, 0, 0, canvasWidth, canvasHeight);
    const dataUrl = canvas.toDataURL('image/png');
    setPhotoDataUrl(dataUrl);
  }

  const openFullscreen = async () => {
    const video = videoRef.current;

    if (!video) return;

    const requestFs = video.requestFullscreen ?? (video as any).webkitRequestFullscreen;

    if (!requestFs) return;

    try {
      await requestFs.call(video);
    } catch (err) {
      // Fullscreen can fail when: not in a user gesture, blocked by Permissions Policy (e.g. in iframe without allow="fullscreen"), or user denied
      console.warn('Fullscreen request failed:', err);
    }
  };

  function getVideoWidth() {
    return videoRef.current?.videoWidth ?? 0;
  }

  return {
    videoRef,
    canvasRef,
    error,
    photoDataUrl,
    startCameraDisabled,
    takePictureDisabled,
    getVideoWidth,
    onVideoCanPlay,
    startCamera,
    takePicture,
    stopCamera,
    openFullscreen,
    isColumnView,
    toggleRowAndColumnLayout,
  };
}
