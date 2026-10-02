ROGER B. JANTIO — IMAGE SLOTS
=============================
Every slot is filled with a real photograph of Roger. Missing files degrade to
a labelled placeholder, so anything here can be swapped freely.

IN PLACE
--------
hero-wide.jpg      index. Now FULL-BLEED: the photograph fills the whole first
                   screen and the copy sits over its lower half, so the name is
                   visible without scrolling. 2200x1222.
ph-*.jpg           One per interior page — a photograph on the right of each
                   page head that dissolves into the paper. 1200x960. Hidden
                   below 900px, where the pages are narrow.
thesis.jpg         index, beside the quote circle.
portrait.jpg       about, and the Sterling Leadership page.
practice-*.jpg     practice. The advisory figure is WIDE (2.18:1, the frame's
                   full width) so nobody in it gets cropped off.
portfolio-side.jpg portfolio, vertical.
about-side.jpg     about, vertical (Harvard Business School).
about-jet.jpg      about. The aircraft photograph, tonally lifted with CLAHE
                   plus a gamma curve — the original was very dark.
record-side.jpg    record, landscape.
contact-band.jpg   contact, wide band.
g-*.jpg            speaking gallery, native orientations, masonry layout.
favicon.png        Browser tab icon.

PROCESSING
----------
Every file goes through denoise-then-upscale, not upscale-then-sharpen. The
earlier batch looked grainy because a strong unsharp mask was applied after
enlarging, which amplifies sensor and JPEG noise. Now: crop, denoise with
OpenCV fastNlMeans (strength scaled to how far the image is being stretched),
resize with Lanczos4, then a gentle unsharp at roughly a third of the previous
strength. Downscaled images use INTER_AREA, which is smooth by nature.

CAPTIONS
--------
Every event name above was read off the backdrop in the photograph itself, so
the names are reliable. What is NOT yet confirmed, and is flagged in each
caption: exact dates, cities, and — importantly — whether he SPOKE at each
event or attended it. Only speaking-1 shows him actually presenting; the rest
are step-and-repeat photographs, which evidence attendance. Worth getting that
distinction right before launch.

Several photographs include other people, and two need particular care:
practice-africa.jpg / g-delegation.jpg (the riverside group) appears to include
senior government figures, and record.jpg is the Burundi audience. Do not name
anyone without checking, and get Roger's explicit sign-off on publishing both.

SOURCE QUALITY
--------------
All originals were roughly 1000px, so the hero and the wide bands are upscaled
about 1.8x with a sharpening pass. They hold up at display size, especially
under the greyscale-and-dim treatment on the hero. If larger originals exist,
hero-wide.jpg benefits most.

SPECS FOR REPLACEMENTS
----------------------
Hero      2.9:1, 2000px+, face in the upper half
Bands     2.9:1, 1800px wide
Gallery   3:2, 1300px wide
Portrait  4:5, 1100px wide

DISTRIBUTION ACROSS PAGES
-------------------------
Photographs now appear on all eight pages, not just Speaking:

  index       hero-wide.jpg (lectern) · home-band.jpg
  practice    practice-advisory.jpg · practice-investment.jpg · practice-band.jpg
  writing     writing-media.jpg · insight-band.jpg
  speaking    speaking-1..7.jpg (gallery) + two videos
  record      record-side.jpg · record.jpg
  about       portrait.jpg · about-side.jpg · about-band.jpg
  contact     contact-band.jpg

Two layouts are used, alternating so pages don't all read the same:
  .photoband  full-width wide band with a caption over a scrim
  .sidefig    photograph beside a short piece of prose; add class "flip"
              to put the image on the right instead

Snippets for both are at the bottom of this file. A few photographs appear
twice, in different crops on different pages — that is deliberate.

UPDATE — NEW PHOTOGRAPHS (round 20)
-----------------------------------
Repeated photographs replaced with new ones:
  ph-speaking.jpg     was the lectern (same as hero) -> seated meeting, Madagascar
  ph-practice.jpg     was MIPAD (also in gallery)    -> greeting handshake, Madagascar
  ph-record.jpg       was the riverside delegation   -> wide meeting, Madagascar
  about-side.jpg      was Semafor WES (also gallery) -> seated, in discussion
  portfolio-side.jpg  was MIPAD (captioned Dubai)    -> posed handshake, Madagascar
  gallery: g-lectern, g-jet, g-delegation, g-unstoppable removed (each also
  appeared elsewhere) -> g-next3billion, g-madagascar, g-lobby,
  g-unstoppable-wall
Still repeated (no new wide photographs left): ph-portfolio (= g-dubai),
ph-writing (= g-financialafrik), ph-contact (= g-unjspf).
Madagascar photographs carry the Republic's seal; the other person is not
named anywhere. Confirm venue/date and get sign-off before launch.

UPDATE — round 21 (Madagascar photographs)
  thesis.jpg           Unstoppable Africa -> seated meeting, cropped to Roger so
                       neither quote bubble covers a face
  ph-contact.jpg       UNJSPF -> seated, gesturing (header crop)
  contact-band.jpg     group photo -> greeting handshake
  portfolio-beyond.jpg NEW. Beyond AI section now has a photo column (.split)
Each Madagascar photograph now appears in colour once at most, plus at most
one faded page-header crop elsewhere.

UPDATE — round 22
  ph-contact.jpg       -> smiling close crop from the posed handshake
  thesis.jpg           -> over-the-shoulder greeting handshake (wide)
  contact-band.jpg     -> wide meeting beside the Madagascar flag
  practice-africa.jpg  recropped to 2.4:1 from the top so every head is in frame
  record-side.jpg      recropped to 2.4:1 from the top so both heads are in frame
