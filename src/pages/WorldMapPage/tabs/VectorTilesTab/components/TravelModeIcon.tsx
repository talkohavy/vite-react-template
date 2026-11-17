import type { TravelModeName } from '../logic/directions/constants';

type TravelModeIconProps = {
  travelMode: TravelModeName | 'locate';
  className?: string;
};

function IconShapes(props: Pick<TravelModeIconProps, 'travelMode'>) {
  const { travelMode } = props;

  if (travelMode === 'foot') {
    return (
      <>
        <circle cx='13' cy='4' r='1.8' />
        <path d='M13 7.5 11 13l-3 7.5M11 13l3 3 1 5M12.5 8.5 9 10.5 7.5 13M12.5 8.5l2.5 3 3 1' />
      </>
    );
  }

  if (travelMode === 'bike') {
    return (
      <>
        <circle cx='5.5' cy='16.5' r='3.5' />
        <circle cx='18.5' cy='16.5' r='3.5' />
        <path d='M5.5 16.5 9.5 10H16l2.5 6.5M9.5 10l3 6.5L16 10M8.5 7.5h2.5M9.5 10 9 7.5M16 10l-1-3.5h2.5M12.5 16.5h-7' />
      </>
    );
  }

  if (travelMode === 'car') {
    return (
      <>
        <path d='M5 11.5 7 6.5h10l2 5' />
        <rect x='3' y='11.5' width='18' height='5' rx='1.5' />
        <circle cx='7.5' cy='18' r='1.8' />
        <circle cx='16.5' cy='18' r='1.8' />
      </>
    );
  }

  return (
    <>
      <circle cx='12' cy='12' r='7' />
      <circle cx='12' cy='12' r='2.5' fill='currentColor' />
      <path d='M12 2v3M12 19v3M2 12h3M19 12h3' />
    </>
  );
}

export default function TravelModeIcon(props: TravelModeIconProps) {
  const { travelMode, className } = props;

  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={1.6}
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
      className={className}
    >
      <IconShapes travelMode={travelMode} />
    </svg>
  );
}
