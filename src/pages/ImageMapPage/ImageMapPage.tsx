import { useState } from 'react';
import CodeBlock from '@src/components/CodeBlock';
import Checkbox from '../../components/controls/Checkbox';
import ClickResultPanel from './content/ClickResultPanel';
import HitboxOverlay from './content/HitboxOverlay';
import {
  IMAGE_MAP_AREAS,
  IMAGE_MAP_HEIGHT,
  IMAGE_MAP_NAME,
  IMAGE_MAP_SRC,
  IMAGE_MAP_WIDTH,
  type ImageMapArea,
} from './logic/constants';
import { formatCoords } from './logic/utils/formatCoords';

const STATIC_HTML_SAMPLE = `<img src="workplace.jpg" alt="Workplace" usemap="#workmap">

<map name="workmap">
  <area shape="rect" coords="30,30,220,196" alt="Computer" href="computer.htm">
  <area shape="circle" coords="350,110,60" alt="Coffee cup" href="coffee.htm">
  <area shape="poly" coords="140,275,120,240,130,205,..." alt="Croissant" href="croissant.htm">
</map>`;

const JS_ONCLICK_SAMPLE = `<area
  shape="circle"
  coords="350,110,60"
  alt="Coffee cup"
  onclick="alert('You clicked the coffee cup!')"
>`;

export default function ImageMapPage() {
  const [activeAreaId, setActiveAreaId] = useState<string | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);

  const activeArea = IMAGE_MAP_AREAS.find((area) => area.id === activeAreaId) ?? null;

  function handleAreaActivate(props: { area: ImageMapArea }) {
    const { area } = props;

    setActiveAreaId(area.id);
  }

  return (
    <div className='flex size-full flex-col gap-8 overflow-auto p-6'>
      <header className='flex flex-col gap-2'>
        <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>HTML Image Maps</h1>
        <p className='max-w-3xl text-sm text-gray-600 dark:text-gray-400'>
          An image map turns one ordinary image into several independently clickable regions. It is built from three
          pieces: an <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>&lt;img&gt;</code>, a{' '}
          <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>&lt;map&gt;</code>, and one or more{' '}
          <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>&lt;area&gt;</code> elements. Reference:{' '}
          <a
            href='https://www.w3schools.com/html/html_images_imagemap.asp'
            target='_blank'
            rel='noreferrer'
            className='text-blue-600 underline dark:text-blue-400'
          >
            W3Schools - HTML Image Maps
          </a>
        </p>
      </header>

      <section className='flex flex-col gap-3'>
        <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>1. How the three pieces connect</h2>
        <ul className='list-inside list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400'>
          <li>
            The <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>&lt;img&gt;</code> gets a{' '}
            <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>usemap=&quot;#workmap&quot;</code> attribute -
            note the leading <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>#</code>.
          </li>
          <li>
            The <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>&lt;map&gt;</code> gets a{' '}
            <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>name=&quot;workmap&quot;</code> attribute - it
            must match the image's <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>usemap</code> value
            (without the <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>#</code>).
          </li>
          <li>
            Each <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>&lt;area&gt;</code> inside the{' '}
            <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>&lt;map&gt;</code> defines one clickable region
            via <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>shape</code> +{' '}
            <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>coords</code>, and a destination via{' '}
            <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>href</code> (or an{' '}
            <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>onclick</code>).
          </li>
        </ul>
      </section>

      <section className='flex flex-col gap-3'>
        <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>2. The four shapes</h2>
        <div className='grid gap-2 sm:grid-cols-2'>
          <div className='rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-700'>
            <p className='font-semibold text-gray-800 dark:text-gray-100'>rect</p>
            <p className='text-gray-600 dark:text-gray-400'>
              <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>x1,y1,x2,y2</code> - top-left corner, then
              bottom-right corner.
            </p>
          </div>
          <div className='rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-700'>
            <p className='font-semibold text-gray-800 dark:text-gray-100'>circle</p>
            <p className='text-gray-600 dark:text-gray-400'>
              <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>cx,cy,r</code> - center point, then radius.
            </p>
          </div>
          <div className='rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-700'>
            <p className='font-semibold text-gray-800 dark:text-gray-100'>poly</p>
            <p className='text-gray-600 dark:text-gray-400'>
              <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>x1,y1,x2,y2,...</code> - any number of points,
              connected in order by straight lines.
            </p>
          </div>
          <div className='rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-700'>
            <p className='font-semibold text-gray-800 dark:text-gray-100'>default</p>
            <p className='text-gray-600 dark:text-gray-400'>No coordinates - covers whatever is left of the image.</p>
          </div>
        </div>
      </section>

      <section className='flex flex-col gap-3'>
        <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>3. Live demo</h2>
        <p className='max-w-3xl text-sm text-gray-600 dark:text-gray-400'>
          Click the computer (<code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>rect</code>), the coffee cup (
          <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>circle</code>), or the croissant (
          <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>poly</code>). This is a real{' '}
          <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>&lt;map&gt;</code> /{' '}
          <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>&lt;area&gt;</code> pair - only the{' '}
          <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>href</code> navigation is swapped for an{' '}
          <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>onClick</code> so the demo stays on this page.
        </p>

        <Checkbox isChecked={isOverlayVisible} setIsChecked={setIsOverlayVisible} label='Show hotspot outlines' />

        <div className='flex flex-wrap items-start gap-6'>
          <div className='relative inline-block' style={{ width: IMAGE_MAP_WIDTH, height: IMAGE_MAP_HEIGHT }}>
            <img
              src={IMAGE_MAP_SRC}
              useMap={`#${IMAGE_MAP_NAME}`}
              width={IMAGE_MAP_WIDTH}
              height={IMAGE_MAP_HEIGHT}
              alt='Desk scene with a computer, a coffee cup, and a croissant'
              className='block rounded-2xl'
            />

            <map name={IMAGE_MAP_NAME}>
              {IMAGE_MAP_AREAS.map((area) => (
                <area
                  key={area.id}
                  shape={area.shape}
                  coords={formatCoords({ coords: area.coords })}
                  alt={area.label}
                  href='#'
                  onClick={(event) => {
                    event.preventDefault();
                    handleAreaActivate({ area });
                  }}
                />
              ))}
            </map>

            {isOverlayVisible && (
              <HitboxOverlay
                areas={IMAGE_MAP_AREAS}
                width={IMAGE_MAP_WIDTH}
                height={IMAGE_MAP_HEIGHT}
                activeAreaId={activeAreaId}
              />
            )}
          </div>

          <div className='max-w-sm flex-1'>
            <ClickResultPanel area={activeArea} />
          </div>
        </div>
      </section>

      <section className='flex flex-col gap-3'>
        <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>4. Source (static-site version)</h2>
        <p className='max-w-3xl text-sm text-gray-600 dark:text-gray-400'>
          Outside a React app, each <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>&lt;area&gt;</code>{' '}
          would carry a real <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>href</code> and simply navigate
          the browser:
        </p>
        <CodeBlock language='html' code={STATIC_HTML_SAMPLE} />

        <p className='max-w-3xl text-sm text-gray-600 dark:text-gray-400'>
          Or, instead of navigating, an area can run JavaScript directly:
        </p>
        <CodeBlock language='html' code={JS_ONCLICK_SAMPLE} />
      </section>
    </div>
  );
}
