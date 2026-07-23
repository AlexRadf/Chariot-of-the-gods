# USCSS CRONUS — Personal Access Terminal

A self-hosted, single-file crew-email prop for the **ALIEN RPG** cinematic
scenario *Chariot of the Gods*. It presents a CRT-styled personal data
terminal: players scan a crew access card (a QR code or link carrying an
`?id=` parameter) and are logged in as that crew member, seeing their private
inbox plus any clearance-gated modules (security deck maps, science archive,
company files, command records).

The entire prop lives in [`index.html`](index.html) — no build step, no
dependencies, no server-side code. It is served here as a static
**GitHub Pages** site.

## Accessing the terminal

The terminal selects a crew member from the `id` query parameter, matching the
card IDs from the original supplement:

```
https://<your-user>.github.io/<repo>/?id=8654
```

Visiting the site with **no `id`** (or an unrecognised one) shows the in-fiction
`ACCESS DENIED` screen — that is intended behaviour for the prop.

### Crew card IDs

| ID   | Name        | Role                | Clearance |
|------|-------------|---------------------|-----------|
| 1987 | A. Johns    | Second Officer      | COMMAND   |
| 2654 | V. Reid     | Security Officer    | SECURITY  |
| 3321 | L. Flynn    | Ship Medic          | MEDICAL   |
| 4987 | D. Cooper   | Chief Scientist     | SCIENCE   |
| 5654 | Ava 6       | Synthetic           | SPECIAL   |
| 6321 | R. Walker   | Captain             | COMMAND   |
| 7987 | E. Tenwick  | Research Scientist  | SCIENCE   |
| 8654 | C. Reynolds | Chief of Security   | SECURITY  |
| 9321 | L. Clayton  | Corporate Liaison   | WY-EXEC   |

Point each crew card's QR code / link at the site URL with the matching `?id=`.

## Enabling GitHub Pages

This repo ships a workflow at
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) that publishes
the site automatically. To turn it on:

1. Go to **Settings → Pages** in this repository.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Push to the deployment branch (or run the workflow manually from the
   **Actions** tab). The site URL appears in the workflow summary and under
   **Settings → Pages** once the first deploy finishes.

The `.nojekyll` file tells Pages to serve the files as-is rather than running
them through Jekyll.

## Editing the content

All crew emails and clearance-module documents are plain data literals near the
top of the `<script>` block in `index.html`:

- `CREW_DATA` — per-crew inbox (keyed by card ID).
- `SECURITY_DATA` — deck maps and room annotations.
- `SCIENCE_DOCS`, `COMPANY_DOCS`, `COMMAND_DOCS` — the clearance archives.

Edit those objects to change the story text. `\n` produces a line break inside
an email or document body.

## Credits

Prop content is original table material written for *Chariot of the Gods*.
*ALIEN* and *Weyland-Yutani* are trademarks of their respective owners; this is
a non-commercial fan prop.
