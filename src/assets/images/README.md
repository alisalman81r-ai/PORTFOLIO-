# Images

Every image in the app is referenced from **one place**: `src/data/media.js`.
No component and no other data file points at an image path. Swapping a
placeholder for a real asset is an edit in that file and nowhere else.

## Folders

| Folder | Holds | Suggested size |
| --- | --- | --- |
| `profile/` | Your portrait | 900×1125 (4:5) |
| `projects/` | Case-study covers and gallery screens | 1400×788 (16:9) |
| `blog/` | Article cover images | 800×450 (16:9) |
| `testimonials/` | Client avatars | 128×128 (1:1) |
| `backgrounds/` | Large decorative art | as needed |

## Replacing a placeholder

1. Drop the file into the folder above.
2. Import it at the top of `src/data/media.js`.
3. Swap the value.

```js
import portrait from '@/assets/images/profile/portrait.jpg'

export const MEDIA = {
  profile: { avatar: portrait },
  …
}
```

**Import — never write a string path.** Vite fingerprints and compresses an
imported file and emits a hashed, immutably-cacheable URL. A typo then fails the
*build* rather than shipping a broken `<img>` to production. A string path gets
none of that.

## Before you commit an image

- **Resize it.** A 4000px original behind a 640px card is the most common
  performance mistake with photography. Match the table above.
- **Prefer `.webp` or `.avif`.** Typically 30–50% smaller than JPEG at the same
  perceived quality; Vite passes them straight through.
- **Keep originals out of the repo.** Commit the delivery-sized file only.

## Current state

The defaults in `media.js` are **remote Unsplash URLs**, each verified to
return 200 before being committed. That is a staging state, not a destination —
it means a third-party dependency on every page load, visitor IPs disclosed to
another host, no Vite optimisation, and a CSP that has to allow an external
image host. Replace them before launch.
