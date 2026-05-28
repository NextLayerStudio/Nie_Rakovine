# Logo assets

Drop the official ONKO KLUB / NIE RAKOVINE logo files here.

Expected files (SVG preferred, PNG@2x as fallback):

- `onko-klub.svg` — colour version (pink pin + heart + purple wordmark)
- `onko-klub-white.svg` — white version (used on the pink splash)
- `onko-klub-mark.svg` — just the pin+heart mark (no wordmark)
- `nie-rakovine.svg` — pink ribbon + purple wordmark
- `nie-rakovine-white.svg` — white version

After the files are added, update `src/components/OnkoLogo.tsx` to render
`<Image src="/logo/onko-klub.svg" .../>` instead of the inline SVG placeholder.
