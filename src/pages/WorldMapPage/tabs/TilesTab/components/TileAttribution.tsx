export default function TileAttribution() {
  return (
    <div className='absolute bottom-px right-px px-1.5 py-0.5 text-[11px] bg-white/80 text-gray-800'>
      ©{' '}
      <a href='https://www.openstreetmap.org/copyright' target='_blank' rel='noreferrer' className='underline'>
        OpenStreetMap
      </a>{' '}
      contributors ·{' '}
      <a href='https://www.openstreetmap.org/fixthemap' target='_blank' rel='noreferrer' className='underline'>
        Report a map issue
      </a>
    </div>
  );
}
