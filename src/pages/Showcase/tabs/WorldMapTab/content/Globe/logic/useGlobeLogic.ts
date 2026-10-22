import { useEffect, useMemo, useState } from 'react';
import { buildGlobeDefinition } from '../../../logic/definitions/buildGlobeDefinition';
import { wrapLongitude } from '../../../logic/utils/wrapLongitude';

const DEGREES_PER_SECOND = 15;

export function useGlobeLogic() {
  const [longitude, setLongitude] = useState(35);
  const [latitude, setLatitude] = useState(25);
  const [isSpinning, setIsSpinning] = useState(false);

  const definition = useMemo(() => buildGlobeDefinition({ longitude, latitude }), [longitude, latitude]);

  useEffect(() => {
    if (!isSpinning) return;

    let previousTimestamp = performance.now();
    let frameId = requestAnimationFrame(spin);

    function spin(timestamp: number) {
      const elapsedSeconds = (timestamp - previousTimestamp) / 1000;
      previousTimestamp = timestamp;

      setLongitude((prevLongitude) =>
        wrapLongitude({ longitude: prevLongitude + DEGREES_PER_SECOND * elapsedSeconds }),
      );
      frameId = requestAnimationFrame(spin);
    }

    return () => cancelAnimationFrame(frameId);
  }, [isSpinning]);

  function toggleIsSpinning() {
    setIsSpinning((prevIsSpinning) => !prevIsSpinning);
  }

  return { definition, longitude, setLongitude, latitude, setLatitude, isSpinning, toggleIsSpinning };
}
