import { useEffect, useRef, useState } from 'react';

export function useScreenCaptureApiPageLogic() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [displaySurface, setDisplaySurface] = useState<string | null>(null);

  const startCaptureDisabled = !!stream;

  useEffect(() => {
    return () => {
      if (!streamRef.current) return;

      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => void track.stop());
      streamRef.current = null;
    };
  }, []);

  function stopScreenCapture() {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => void track.stop());
      streamRef.current = null;
    }

    setStream(null);
    setIsStreaming(false);
    setDisplaySurface(null);

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  async function startScreenCapture() {
    setError(null);
    setDisplaySurface(null);

    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'browser', // <--- Defaults to 'browser'. The default option to display first. Options are: 'browser' (default), 'window', 'monitor'.
          frameRate: 60, // <--- 30 is definitely not the highest value! Not sure 60 is, but it's definitely some value higher than 30!
        },
        // selfBrowserSurface: 'exclude',
        // audio: true,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
        // @ts-ignore
        // systemAudio: 'exclude', // <--- this key definitely exists! Defaults to 'include'. Options are: 'include' (default), 'exclude'.
        // selfBrowserSurface: 'include', // <--- this key definitely exists! Include/Exclude the current tab as a share option. Defaults to 'exclude'. Options are: 'include', 'exclude' (default).
        // monitorTypeSurfaces: 'exclude', // <--- this key definitely exists! Include/Exclude "Entire Screen" as a share option. Defaults to 'include'. Options are: 'include' (default), 'exclude'.
        // preferCurrentTab: true, // <--- this key definitely exists! Show only this tab as a share option! Remove monitor, or window, or other tabs as options. Defaults to false.
      });

      streamRef.current = mediaStream;
      setStream(mediaStream);

      const video = videoRef.current;

      if (!video) return;

      video.srcObject = mediaStream;

      await video.play();

      const [videoTrack] = mediaStream.getVideoTracks() as [MediaStreamTrack];

      const settings = videoTrack.getSettings();

      setDisplaySurface(settings.displaySurface!);

      // Screen sharing can end manually, but it can also end automatically when the user clicks "Stop sharing" or closes the browser tab.
      videoTrack.addEventListener('ended', stopScreenCapture);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(`Screen capture error: ${message}`);
    }
  }

  function onVideoCanPlay() {
    if (videoRef.current && !isStreaming) {
      setIsStreaming(true);
    }
  }

  return {
    videoRef,
    error,
    displaySurface,
    startCaptureDisabled,
    isStreaming,
    onVideoCanPlay,
    startScreenCapture,
    stopScreenCapture,
  };
}
