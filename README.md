# Limestone Test Automation Suite

Playwright + TypeScript framework covering two layers against fixed public targets:

| Layer | System under test                     | Scenario                                                   |
| ----- | ------------------------------------- | ---------------------------------------------------------- |
| UI    | https://www.saucedemo.com/            | Sign in, add an item to the cart, verify the cart contents |
| API   | https://jsonplaceholder.typicode.com/ | `GET /posts/1`, assert the response contract               |

## Install

Requires Node.js 20+.

```bash
npm ci
npx playwright install --with-deps chromium
```

No `.env` is needed, since every setting falls back to a public default. Copy `.env.example` to `.env` only to point the suite somewhere else.

## Run

```bash
npm test              # full suite (both projects)
npm run test:ui       # UI project only
npm run test:api      # API project only
npm run test:smoke    # everything tagged @smoke
```

A single test, either by file or by title:

```bash
npx playwright test tests/ui/specs/cart.spec.ts
npx playwright test --grep "returns a post matching the response contract"
```

## Report

The HTML reporter writes to `playwright-report/`. After a run:

```bash
npm run test:report
```

Failures include a trace (captured on first retry) that can be opened from the report to step through the run. In CI the report is uploaded as a build artifact on every run, passing or failing.

## Layout

```
tests/
  constants.ts                  # routes, endpoints, credentials, product names
  api/
    requests/posts.api.ts       # endpoint wrapper (APIRequestContext -> APIResponse)
    schemas/post.schema.ts      # the response contract, as a zod schema
    specs/posts.spec.ts
  ui/
    fixtures.ts                 # injects the Page Objects into the test
    pages/*.page.ts             # LoginPage, InventoryPage, CartPage
    specs/cart.spec.ts
```

## Design decisions

- **Scope is a decision, not a budget.** One test per layer, as the brief asks. Everything here (fixtures, request layer, schema, tag, CI) is something a second test reuses unchanged, and nothing is here that a second test would have to undo first. The structure is sized to be extended, not to look big.
- **Page Objects with private locators.** Interaction locators are `private readonly`; only what a spec asserts on is public. The spec therefore contains no selectors at all, so a markup change is a one-file fix. `InventoryPage.openCart()` returns a `CartPage`, which keeps navigation between pages typed and explicit rather than hidden behind a shared `page`, and it waits on the URL rather than on an element, because `data-test="title"` exists on both screens and would resolve before the navigation happened.
- **The UI spec reads as the scenario.** Three `test.step` blocks (sign in, add, verify), so the HTML report and the trace show the flow rather than a flat list of clicks, and a failure names the phase it happened in.
- **Fixtures over `beforeEach`.** `test.extend` injects the Page Objects, so specs never construct them or touch a raw `page`. Adding a page later costs one fixture, not an edit to every test.
- **A project per layer, not just a folder per layer.** `ui` and `api` are Playwright projects with their own `testDir` and `baseURL`, so specs use bare paths (`/cart.html`, `/posts/1`), the target host lives in exactly one place, and `--project` selects a layer without a grep. Hosts and credentials come from the environment with public defaults, so pointing the suite at another deployment is a `.env` file and not a diff.
- **The API contract is a schema, not a pile of `expect`s.** `post.schema.ts` is a strict zod object, so an added, removed, or retyped field fails the test, including fields nobody wrote an assertion for. The spec asserts on `result.error.issues`, so a break names the offending field instead of reporting `expected true, received false`.
- **Locators verified against the live DOM.** I inspected each screen with the Playwright CLI before writing the Page Objects: the login inputs have no `<label>` (their accessible name comes from the placeholder, so `getByRole` works where `getByLabel` would not), "Products" is a `<span>` rather than a heading, and the cart link has no text at all. Roles are used wherever one exists; `getByTestId` is the fallback where the markup offers nothing better. "Add to cart" is scoped to the product's own card, so the test never depends on catalogue order.

**Optional extras, and why these three.** Schema validation because it _is_ the API assertion the brief asks for, not an addition to it. A `@smoke` tag because selection then belongs to the test rather than to a path hardcoded in a CI script; with one test it buys nothing today, but it is the convention the suite grows into, and it costs one word. A CI workflow because a suite nobody runs on every push is not a suite.

**Deliberately skipped.** A `storageState` auth setup: on SauceDemo the login _is_ the scenario under test, so caching a session would remove the thing being verified. Linting and formatting config: `tsc --noEmit` under `strict` catches what actually breaks a run, and ESLint or Prettier earn their config on a suite with several contributors, not on nine files. Data builders: one product in one test, so a factory here would be indirection with nothing to vary.

**With more time.** A negative case per layer (`locked_out_user`, and a 404 on `/posts/999`), which reuse the same objects and would be first in. Then a project matrix for mobile viewports and a second browser, sharding in CI once the suite is slow enough to warrant it, and a `docs/DECISIONS.md` once these notes outgrow a README section.
