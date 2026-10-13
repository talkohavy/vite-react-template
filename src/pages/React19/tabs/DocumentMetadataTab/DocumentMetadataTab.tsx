/**
 * When React renders this component, it will see the <title> <link> and <meta> tags,
 * and automatically hoist them to the <head> section of document.
 * By supporting these metadata tags natively, we're able to ensure they work with client-only apps,
 * streaming SSR, and Server Components.
 */
export default function DocumentMetadataTab() {
  return (
    <div>
      {/* No more needing react-helmet to manage the head tags */}
      <title>My Awesome React App</title>
      <meta name='description' content='This is a description of my awesome react app' />
      <meta name='author' content='Tal Kohavy' />
      <link rel='author' href='https://facebook.com/taltaltal/' />
      <link rel='canonical' href='https://www.linkedin.com/taltaltal/' />
      <meta name='keywords' content='react, javascript, typescript' />
      Check out SEO in 1 click to see what changed when on this tab.
    </div>
  );
}
