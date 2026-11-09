# Karim Boulad — Portfolio

A fast, static portfolio built with **plain HTML, CSS, and JavaScript**. No build step, no frameworks, no package manager — ready for GitHub Pages.

## Structure

```
my_portfolio/
├── index.html                     # Home page
├── assets/
│   ├── css/
│   │   └── style.css              # All styles + design tokens
│   ├── js/
│   │   └── main.js                # Nav, reveal animations, counters, lightbox
│   └── imgs/                      # Project screenshots
├── projects/
│   ├── amra-ride.html             # Ride-hailing case study
│   ├── bora.html                  # Desktop ERP & POS case study
│   ├── hayah-calm.html            # Telehealth platform case study
│   ├── irole.html                 # Remote work platform case study
│   ├── jpa-certificate-portal.html # Certification platform case study
│   ├── kas.html                   # Medical association platform case study
│   ├── markazi-fruits.html        # E-commerce case study
│   ├── taalof-lkheir.html         # Business operations case study
│   ├── wataiki-mob.html           # Document services platform case study
│   └── woga.html                  # B2B supply marketplace case study
└── README.md
```

## Run locally

Open `index.html` directly, or serve the folder so relative paths behave exactly like GitHub Pages:

```bash
# PHP (already installed with Laragon)
php -S 127.0.0.1:8000
```

Then visit `http://127.0.0.1:8000`.

## Add a new project

Each project gets its own page. To add one:

1. **Copy an existing case study**
   - Duplicate `projects/taalof-lkheir.html` and rename it, e.g. `projects/markazi-fruits.html`.

2. **Update the page content**
   - Change the `<title>`, meta description, breadcrumb, title, meta grid, overview, features, gallery, stack, and outcome.
   - Keep the header/footer links pointing to `../index.html#...`.

3. **Add screenshots**
   - Put images in `assets/imgs/` using a consistent name: `markazi-fruits-landing.webp`, `markazi-fruits-admin.webp`, etc.
   - Update each `src`, `data-full`, `data-caption`, and `alt` in the gallery.
   - Keep the `data-lightbox` attribute on each gallery button.
   - Add `width` and `height` attributes matching the image's real pixel size to prevent layout shift.

4. **Add a card on the home page**
   - Open `index.html` and find the `#projects` section.
   - Duplicate a `.project-card` and point its link to `projects/your-project.html`.
   - Or replace the featured `.featured-project` block if the new project should be the headline.

5. **Test locally**
   - Check the mobile menu, gallery lightbox, and that no images are missing.

## Screenshot guidelines

- **Format:** WebP — far smaller than PNG for UI screenshots and supported by every modern browser.
- **Ratio:** 16:9 or 16:10 works best.
- **Width:** 1600–1920px is enough for retina displays.
- **Weight:** aim for under ~150 KB per image.
- **Naming:** `project-name-view.webp` (e.g. `taalof-admin-dashboard.webp`).

To convert a screenshot, use [Squoosh](https://squoosh.app/) (quality ~85) or the following Python snippet with Pillow:

```python
from PIL import Image
Image.open("shot.png").convert("RGB").save("shot.webp", "WEBP", quality=88, method=6)
```

## Deploy to GitHub Pages

1. Create a repository on GitHub and push this folder to the `main` branch.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the `main` branch and the `/ (root)` folder, then save.
5. GitHub will publish the site at `https://<username>.github.io/<repository>/`.

All links in this project are relative, so it works from a subfolder without changes.

## Customization

- **Colors, spacing, fonts:** edit the CSS variables at the top of `assets/css/style.css` (`:root`).
- **Reveal animations:** add `class="reveal"` to any block you want to fade in on scroll.
- **Images:** replace files in `assets/imgs/` and keep the file names or update the paths.
- **Email / links:** search for `karim.boulad.dev@gmail.com`, `karim-boulad0`, and `+96181042408` in both HTML files.

## Notes

- The reveal animation uses a tiny inline script in `<head>` (`document.documentElement.classList.add("js")`) so content stays visible if JavaScript is disabled.
- Fonts are loaded from Google Fonts. The rest of the site has no external dependencies.
- Accessibility, best practices, and SEO were checked with Lighthouse at 100.
