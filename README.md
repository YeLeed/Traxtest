Prizma demo site for the Trax Fin POC. Static files only, nothing to build or install. Trax hosts this folder on its own infrastructure; Intercom does not host it.

## Hosting on GitHub Pages (Trax's GitHub)

1. Create a new **private** repository in the Trax GitHub organisation (any name; an unguessable one is better, see the visibility note below).
2. Copy the contents of this folder to the repository root, so `index.html`, `portal.html`, `assets/` and `.nojekyll` sit at the top level. Commit to `main`.
3. In the repository: Settings → Pages → Build and deployment → Source: **Deploy from a branch** → Branch: `main`, folder `/ (root)` → Save.
4. Wait one to two minutes. The site is at `https://<org>.github.io/<repo>/`. Open it, sign in as Marta or Daniel, and press `?` for the demo prompts.
5. Direct links: `https://<org>.github.io/<repo>/portal.html?persona=marta` or `?persona=daniel` sign in as that persona straight away.

Visibility: a GitHub Pages site is reachable by anyone with the URL, even from a private repository, unless the organisation is on GitHub Enterprise Cloud and the site is set to **Private** under Settings → Pages → Visibility. Use that setting if available. The files contain no secrets (only the public Messenger id and the mock API address), but anyone who finds the URL can open the Messenger as the demo personas and create conversations in the POC workspace. Delete the repository or disable Pages when the POC ends.

Other static hosts work the same way (an internal nginx `root`, an internal S3 or blob static site, or `python3 -m http.server 8765` on a laptop). All paths are relative, so the site works at the domain root or under a sub-path.

## What the pages call out to

- The Intercom Messenger script from `https://widget.intercom.io/widget/jtwcfhlr` (workspace jtwcfhlr).
- The mock Prizma API at `https://mockingbird.intercom.workers.dev/jtwcfhlr/trax` (see `assets/app.js`), which serves the persona dashboards and the carrier context Fin reads. It is a demo mock owned by Intercom, not Trax data, and it allows any origin, so it works from a GitHub Pages domain.

## Caveats for the hosted copy

- The two personas sign in with a fixed name, email and user_id. The Messenger creates their Intercom contacts without an email, so the contact email must be set once in the Inbox (Marta: m.kowalski@meridianfreight.com, Daniel: d.reyes@northwindcg.com) or the "status of invoice" and "dispute" prompts fail. Check the two contacts before any session. Identity verification is not enforced on the workspace, and the reason the Messenger drops the email is not established.
- Fin's demo flows, teams, SLAs and the Messenger workflow live in the jtwcfhlr workspace, not in these files; the site only opens the Messenger with the right identity and pre-fills prompts.
