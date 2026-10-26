import { expect, test, type Page } from "@playwright/test";

const TRIAL = "/signup?plan=trial&interval=monthly&tier=pro";

const PAGES = [
  { path: "/", hero: "home", ctaName: "hero_trial", location: "hero", see: "#quick-bites-heading" },
  { path: "/nclex", hero: "nclex", ctaName: "nclex_hero_trial", location: "nclex_hero", see: "#quiz" },
  { path: "/naplex", hero: "naplex", ctaName: "naplex_hero_trial", location: "naplex_hero", see: "#quiz" },
  { path: "/usmle", hero: "usmle", ctaName: "usmle_hero_trial", location: "usmle_hero", see: "#quiz" },
  { path: "/pance", hero: "pance", ctaName: "pance_hero_trial", location: "pance_hero", see: "#quiz" },
  {
    path: "/aanp-fnp",
    hero: "aanp-fnp",
    ctaName: "aanp_fnp_hero_trial",
    location: "aanp-fnp_hero",
    see: "#quiz",
  },
  {
    path: "/npte-pt",
    hero: "npte-pt",
    ctaName: "npte_pt_hero_trial",
    location: "npte-pt_hero",
    see: "#quiz",
  },
] as const;

type Landing = (typeof PAGES)[number];

const VIEWPORTS = [
  { name: "360 portrait", width: 360, height: 740 },
  { name: "390 portrait", width: 390, height: 844 },
  { name: "430 portrait", width: 430, height: 932 },
  { name: "768 portrait", width: 768, height: 1024 },
  { name: "1024 portrait", width: 1024, height: 1366 },
  { name: "1280", width: 1280, height: 800 },
  { name: "1440", width: 1440, height: 900 },
  { name: "740 landscape", width: 740, height: 360 },
  { name: "844 landscape", width: 844, height: 390 },
  { name: "932 landscape", width: 932, height: 430 },
];

function trialHref(path: string): string {
  if (path === "/") return TRIAL;
  return `${TRIAL}&exam=${path.slice(1)}`;
}

type Shot = {
  hero: string | null;
  h1Count: number;
  h1: Record<string, string | number | null>;
  sub: Record<string, string | number | null>;
  primaryText: string | null;
  primaryHref: string | null;
  primary: Record<string, string | number | null>;
  secondaryText: string | null;
  secondaryHref: string | null;
  secondary: Record<string, string | number | null>;
  navHref: string | null;
  navH: number | null;
  overPhoto: boolean;
  navBg: string | null;
  navCta: Record<string, string | number | null>;
  photoH: number | null;
  svh: number | null;
  photoBg: string | null;
  scrimBg: string | null;
  border: string | null;
  preload: string | null;
  preloadMedia: string | null;
  sectionH: number | null;
  photoEndsWithHero: boolean;
  joinGap: number | null;
  featuresBg: string | null;
  featuresPad: number | null;
  copyGap: number | null;
  overflow: boolean;
  navOverflow: boolean;
  heroW: number | null;
  vw: number | null;
  menuVisible: boolean;
};

async function readLanding(page: Page): Promise<Shot> {
  return page.evaluate(() => {
    const px = (value: string) => {
      const n = parseFloat(value);
      return Number.isNaN(n) ? null : Math.round(n * 100) / 100;
    };
    const family = (value: string) => value.split(",")[0]?.replace(/["']/g, "").trim().toLowerCase() ?? "";
    const typeOf = (el: Element | null) => {
      if (!el) return null;
      const s = getComputedStyle(el);
      return {
        family: family(s.fontFamily),
        weight: s.fontWeight,
        size: px(s.fontSize),
        lh: px(s.lineHeight),
        ls: s.letterSpacing === "normal" ? "normal" : px(s.letterSpacing),
        style: s.fontStyle,
        color: s.color,
      };
    };
    const boxOf = (el: Element | null) => {
      if (!el) return null;
      const s = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        minH: px(s.minHeight),
        radius: px(s.borderTopLeftRadius),
        display: s.display,
        transition: s.transitionDuration,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };
    };
    const hero = document.querySelector(".mkt-photo-hero");
    const photo = document.querySelector(".mkt-photo-hero__photo");
    const scrim = document.querySelector(".mkt-photo-hero__scrim");
    const h1 = hero?.querySelector("h1") ?? null;
    const sub = hero?.querySelector(".mkt-photo-hero__sub") ?? null;
    const copy = hero?.querySelector(".mkt-photo-hero__copy") ?? null;
    const primary = hero?.querySelector("a.aee-flagship-cta") ?? null;
    const secondary = hero?.querySelector("a.bl-button-secondary") ?? null;
    const nav = document.querySelector("header.aee-nav");
    const navCta = nav?.querySelector("a.aee-nav-cta") ?? null;
    const menuBtn = nav?.querySelector(".aee-nav-menu-btn") ?? null;
    const next = hero?.nextElementSibling ?? null;
    const probe = document.createElement("div");
    probe.style.cssText =
      "position:absolute;left:0;top:0;height:100svh;width:1px;visibility:hidden;pointer-events:none";
    document.body.appendChild(probe);
    const svh = Math.round(probe.getBoundingClientRect().height);
    probe.remove();
    const heroBottom = hero ? hero.getBoundingClientRect().bottom + window.scrollY : null;
    const nextTop = next ? next.getBoundingClientRect().top + window.scrollY : null;
    const preload = document.querySelector('link[rel="preload"][as="image"]');
    const photoStyle = photo ? getComputedStyle(photo) : null;
    const nextStyle = next ? getComputedStyle(next) : null;
    return {
      hero: hero?.getAttribute("data-hero") ?? null,
      h1Count: document.querySelectorAll("h1").length,
      h1: typeOf(h1),
      sub: typeOf(sub),
      primaryText: primary?.textContent?.replace(/\s+/g, " ").trim() ?? null,
      primaryHref: primary?.getAttribute("href") ?? null,
      primary: primary ? { ...typeOf(primary), ...boxOf(primary) } : null,
      secondaryText: secondary?.textContent?.replace(/\s+/g, " ").trim() ?? null,
      secondaryHref: secondary?.getAttribute("href") ?? null,
      secondary: secondary ? { ...typeOf(secondary), ...boxOf(secondary) } : null,
      navHref: navCta?.getAttribute("href") ?? null,
      navH: nav ? Math.round(nav.getBoundingClientRect().height) : null,
      overPhoto: nav?.classList.contains("aee-nav--over-photo") ?? false,
      navBg: nav ? getComputedStyle(nav).backgroundColor : null,
      navCta: navCta ? { ...typeOf(navCta), ...boxOf(navCta) } : null,
      photoH: photo ? Math.round(photo.getBoundingClientRect().height) : null,
      sectionH: hero ? Math.round(hero.getBoundingClientRect().height) : null,
      svh,
      photoBg: photoStyle?.backgroundImage ?? null,
      scrimBg: scrim ? getComputedStyle(scrim).backgroundImage : null,
      border: photoStyle?.borderImageSource ?? null,
      preload: preload?.getAttribute("href") ?? null,
      preloadMedia: preload?.getAttribute("media") ?? null,
      photoEndsWithHero:
        photo != null &&
        hero != null &&
        Math.round(photo.getBoundingClientRect().bottom) <=
          Math.round(hero.getBoundingClientRect().bottom) + 1,
      joinGap: heroBottom != null && nextTop != null ? Math.round(nextTop - heroBottom) : null,
      featuresBg: nextStyle?.backgroundColor ?? null,
      featuresPad: nextStyle ? px(nextStyle.paddingTop) : null,
      copyGap: copy ? px(getComputedStyle(copy).rowGap || getComputedStyle(copy).gap) : null,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      navOverflow: nav ? nav.scrollWidth > nav.clientWidth + 1 : true,
      heroW: hero ? Math.round(hero.getBoundingClientRect().width) : null,
      vw: document.documentElement.clientWidth,
      menuVisible: menuBtn ? getComputedStyle(menuBtn).display !== "none" : false,
    };
  });
}

function same(values: { path: string; value: unknown }[], label: string) {
  const base = JSON.stringify(values[0]?.value ?? null);
  const diffs = values.filter((row) => JSON.stringify(row.value) !== base);
  expect(
    diffs.map((row) => row.path),
    `${label}\nshared ${base}\n${diffs
      .map((row) => `${row.path} ${JSON.stringify(row.value)}`)
      .join("\n")}`
  ).toEqual([]);
}

function sharedShot(shot: Shot) {
  return {
    h1: shot.h1,
    sub: shot.sub,
    primaryText: shot.primaryText,
    primary: shot.primary,
    secondaryText: shot.secondaryText,
    secondary: shot.secondary,
    navH: shot.navH,
    overPhoto: shot.overPhoto,
    navBg: shot.navBg,
    navCta: shot.navCta,
    photoH: shot.photoH,
    sectionH: shot.sectionH,
    svh: shot.svh,
    photoBg: shot.photoBg,
    joinGap: shot.joinGap,
    featuresBg: shot.featuresBg,
    featuresPad: shot.featuresPad,
    copyGap: shot.copyGap,
    overflow: shot.overflow,
    navOverflow: shot.navOverflow,
    menuVisible: shot.menuVisible,
  };
}

function expectPageIdentity(entry: Landing, shot: Shot) {
  const href = trialHref(entry.path);
  expect(shot.hero, entry.path).toBe(entry.hero);
  expect(shot.h1Count, entry.path).toBe(1);
  expect(shot.primaryText, entry.path).toBe("Start free trial");
  expect(shot.secondaryText, entry.path).toBe("See questions");
  expect(shot.primaryHref, entry.path).toBe(href);
  expect(shot.navHref, entry.path).toBe(href);
  expect(shot.secondaryHref, entry.path).toBe(entry.see);
  expect(shot.preload, entry.path).toBeNull();
  expect(shot.border ?? "", entry.path).toContain(`/images/marketing/heroes/${entry.hero}-`);
  expect(shot.photoH, entry.path).toBe(shot.svh);
  expect(shot.sectionH, entry.path).toBe(shot.svh);
  expect(shot.photoEndsWithHero, entry.path).toBe(true);
  expect(shot.heroW, entry.path).toBe(shot.vw);
  expect(shot.overflow, entry.path).toBe(false);
  expect(shot.navOverflow, entry.path).toBe(false);
  expect(shot.joinGap, entry.path).toBe(0);
  expect(shot.overPhoto, entry.path).toBe(true);
}

async function scrollTo(page: Page, top: number, overPhoto: boolean) {
  await page.evaluate((y) => window.scrollTo(0, y), top);
  await expect
    .poll(async () => (await readLanding(page)).overPhoto, { timeout: 5_000 })
    .toBe(overPhoto);
}

async function settle(page: Page, path: string) {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await page.locator(".mkt-photo-hero h1").waitFor();
  // The layout hydrates before the page. A key or click in that gap hits the
  // server HTML only: the menu button has no toggle yet, and the trial link
  // navigates before its conversion handler exists.
  await page.waitForFunction(() => {
    const ready = (el: Element | null) =>
      !!el && Object.getOwnPropertyNames(el).some((key) => key.startsWith("__reactProps"));
    const header = document.querySelector("header.aee-nav");
    const menu = document.querySelector(".aee-nav-menu-btn");
    const hero = document.querySelector(".mkt-photo-hero");
    const cta = document.querySelector(".mkt-photo-hero a.aee-flagship-cta");
    if (!ready(header) || !ready(menu)) return false;
    // Logged-in home replaces the marketing hero. Don't wait for a CTA that left.
    if (!hero) return true;
    return ready(cta);
  });
  await page.evaluate(() => document.fonts.ready);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const style = document.createElement("style");
    style.textContent = "nextjs-portal{display:none!important}";
    document.documentElement.appendChild(style);
  });
});

test.describe("landing parity", () => {
  test("seven pages match at every viewport, orientation, scroll position, and menu state", async ({
    page,
  }) => {
    test.setTimeout(360_000);
    const byViewport = new Map<string, { path: string; shot: Shot }[]>();

    for (const entry of PAGES) {
      await settle(page, entry.path);
      for (const vp of VIEWPORTS) {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await scrollTo(page, 0, true);
        const shot = await readLanding(page);
        expectPageIdentity(entry, shot);
        const bucket = byViewport.get(vp.name) ?? [];
        bucket.push({ path: entry.path, shot });
        byViewport.set(vp.name, bucket);

        await scrollTo(page, 240, false);
        const scrolled = await readLanding(page);
        expect(scrolled.navH, `${entry.path} ${vp.name} header height`).toBe(shot.navH);
        expect(scrolled.navBg, `${entry.path} ${vp.name} solid header`).not.toBe(shot.navBg);
        expect(scrolled.photoH, `${entry.path} ${vp.name} photo`).toBe(shot.photoH);

        await scrollTo(page, 0, true);
        if (shot.menuVisible) {
          await page.getByRole("button", { name: "Open menu" }).click();
          await expect(page.locator("#site-menu")).toBeVisible();
          const open = await readLanding(page);
          expect(open.overPhoto, `${entry.path} ${vp.name} menu`).toBe(false);
          const panelBg = await page.locator("#site-menu").evaluate((el) => getComputedStyle(el).backgroundColor);
          expect(panelBg, `${entry.path} ${vp.name} menu panel`).not.toMatch(/rgba?\(\s*0,\s*0,\s*0,\s*0\s*\)/);
          await page.keyboard.press("Escape");
          await expect(page.locator("#site-menu")).toBeHidden();
          await expect
            .poll(async () => (await readLanding(page)).overPhoto, { timeout: 5_000 })
            .toBe(true);
          bucket[bucket.length - 1].shot = {
            ...shot,
            navBgScrolled: scrolled.navBg,
            menuPanel: panelBg,
          } as Shot;
        } else {
          await expect(page.getByRole("button", { name: "Open menu" })).toBeHidden();
          bucket[bucket.length - 1].shot = { ...shot, navBgScrolled: scrolled.navBg, menuPanel: null } as Shot;
        }
      }
    }

    for (const [name, rows] of byViewport) {
      same(
        rows.map((row) => ({ path: row.path, value: sharedShot(row.shot) })),
        name
      );
      const extra = rows.map((row) => {
        const shot = row.shot as Shot & { navBgScrolled?: string | null; menuPanel?: string | null };
        return { path: row.path, value: { scrolled: shot.navBgScrolled ?? null, menu: shot.menuPanel ?? null } };
      });
      same(extra, `${name} scroll and menu`);
      const borders = rows.map((row) => row.shot.border);
      expect(new Set(borders).size, `${name} photos must differ`).toBe(borders.length);
    }
  });

  test("focus ring and keyboard menu match on every page", async ({ page }) => {
    test.setTimeout(180_000);
    for (const width of [390, 1280]) {
      const rings: { path: string; value: unknown }[] = [];
      await page.setViewportSize({ width, height: width === 390 ? 844 : 800 });
      for (const entry of PAGES) {
        await settle(page, entry.path);
        const ring = await page.evaluate(() => {
          const el = document.querySelector(".mkt-photo-hero a.aee-flagship-cta") as HTMLElement | null;
          el?.focus({ focusVisible: true });
          const s = el ? getComputedStyle(el) : null;
          return {
            width: s?.outlineWidth ?? null,
            style: s?.outlineStyle ?? null,
            color: s?.outlineColor ?? null,
            offset: s?.outlineOffset ?? null,
            active: document.activeElement === el,
          };
        });
        expect(ring.active, entry.path).toBe(true);
        expect(ring.style, entry.path).toBe("solid");
        expect(parseFloat(ring.width ?? "0"), entry.path).toBeGreaterThanOrEqual(3);
        rings.push({ path: entry.path, value: ring });

        if (width < 1024) {
          const button = page.getByRole("button", { name: "Open menu" });
          await button.press("Enter");
          await expect(page.locator("#site-menu")).toBeVisible();
          await page.keyboard.press("Escape");
          await expect(page.locator("#site-menu")).toBeHidden();
          await button.press(" ");
          await expect(page.locator("#site-menu")).toBeVisible();
          expect(await page.evaluate(() => window.scrollY)).toBeLessThanOrEqual(8);
          await page.keyboard.press("Escape");
          await expect(page.locator("#site-menu")).toBeHidden();
        }
      }
      same(rings, `focus ${width}`);
    }
  });

  test("reduced motion and the default motion share one hero treatment", async ({ browser }) => {
    test.setTimeout(180_000);
    for (const reduced of [false, true]) {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        reducedMotion: reduced ? "reduce" : "no-preference",
      });
      const page = await context.newPage();
      const rows: { path: string; value: unknown }[] = [];
      for (const entry of PAGES) {
        await settle(page, entry.path);
        const motion = await page.evaluate(() => {
          const cta = document.querySelector(".mkt-photo-hero a.aee-flagship-cta");
          const chip = document.querySelector(".mkt-photo-hero__soft");
          return {
            ctaTransition: cta ? getComputedStyle(cta).transitionDuration : null,
            ctaAnimation: cta ? getComputedStyle(cta).animationName : null,
            chipAnimation: chip ? getComputedStyle(chip).animationName : "absent",
          };
        });
        if (reduced) {
          expect(motion.ctaTransition, entry.path).toBe("0s");
          expect(motion.chipAnimation === "none" || motion.chipAnimation === "absent", entry.path).toBe(true);
        } else if (entry.path === "/") {
          expect(motion.chipAnimation, "home chips").toContain("mkt-hero-soft");
        } else {
          expect(motion.chipAnimation, entry.path).toBe("absent");
        }
        rows.push({ path: entry.path, value: { ctaTransition: motion.ctaTransition, ctaAnimation: motion.ctaAnimation } });
      }
      same(rows, reduced ? "reduced motion" : "motion");
      await context.close();
    }
  });

  test("slow network keeps the same photo placeholder", async ({ page }) => {
    test.setTimeout(180_000);
    let release: () => void = () => {};
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    await page.route(/\/images\/marketing\/heroes\/.+\.(avif|webp)(\?|$)/, async (route) => {
      await gate;
      await route.continue();
    });
    await page.setViewportSize({ width: 390, height: 844 });
    const rows: { path: string; value: unknown }[] = [];
    for (const entry of PAGES) {
      await page.goto(entry.path, { waitUntil: "domcontentloaded" });
      await page.locator(".mkt-photo-hero h1").waitFor();
      const shot = await readLanding(page);
      expect(shot.h1?.family, entry.path).toBeTruthy();
      expect(String(shot.photoBg), entry.path).toContain("gradient");
      expect(String(shot.scrimBg), entry.path).toContain("gradient");
      rows.push({
        path: entry.path,
        value: { photo: shot.photoBg, scrim: shot.scrimBg, h1: shot.h1, sub: shot.sub },
      });
    }
    release();
    same(
      rows.map((row) => ({
        path: row.path,
        value: {
          photo: (row.value as { photo: string }).photo,
          h1: (row.value as { h1: unknown }).h1,
          sub: (row.value as { sub: unknown }).sub,
        },
      })),
      "slow network placeholder"
    );
    same(
      rows
        .filter((row) => row.path !== "/")
        .map((row) => ({ path: row.path, value: (row.value as { scrim: string }).scrim })),
      "board scrim"
    );
  });

  test("javascript disabled still renders the hero, heading, and trial CTA", async ({ browser }) => {
    test.setTimeout(180_000);
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage();
    const rows: { path: string; value: unknown }[] = [];
    for (const entry of PAGES) {
      await page.goto(entry.path, { waitUntil: "domcontentloaded" });
      const html = await page.evaluate(() => {
        const shown = (el: Element | null) =>
          Boolean(el && !el.closest("[hidden]") && getComputedStyle(el).visibility !== "hidden");
        const hero = [...document.querySelectorAll(".mkt-photo-hero")].find((el) => shown(el)) ?? null;
        const h1s = [...document.querySelectorAll("h1")].filter((el) => shown(el));
        return {
          hero: hero?.getAttribute("data-hero") ?? null,
          h1: hero?.querySelector("h1")?.textContent?.replace(/\s+/g, " ").trim() ?? "",
          cta: hero?.querySelector("a.aee-flagship-cta")?.textContent?.replace(/\s+/g, " ").trim() ?? "",
          href: hero?.querySelector("a.aee-flagship-cta")?.getAttribute("href") ?? null,
          over: document.querySelector("header.aee-nav")?.classList.contains("aee-nav--over-photo") ?? false,
          h1Count: h1s.length,
        };
      });
      expect(html.hero, entry.path).toBe(entry.hero);
      expect(html.h1.length, entry.path).toBeGreaterThan(8);
      expect(html.cta, entry.path).toBe("Start free trial");
      expect(html.href, entry.path).toBe(trialHref(entry.path));
      expect(html.over, entry.path).toBe(true);
      expect(html.h1Count, entry.path).toBe(1);
      rows.push({
        path: entry.path,
        value: { cta: html.cta, over: html.over, h1Count: html.h1Count },
      });
    }
    same(rows, "no javascript");
    await context.close();
  });

  test("client navigation matches a direct load with no header or font flash", async ({ page }) => {
    test.setTimeout(180_000);
    await page.setViewportSize({ width: 1280, height: 800 });
    await settle(page, "/nclex");
    await page.evaluate(() => {
      const w = window as Window & { __headerMiss?: number };
      w.__headerMiss = 0;
      const note = () => {
        const hero = document.querySelector("[data-hero]")?.getAttribute("data-hero");
        const over = document.querySelector("header.aee-nav")?.classList.contains("aee-nav--over-photo");
        if (hero === "naplex" && window.scrollY <= 8 && !over) w.__headerMiss = (w.__headerMiss ?? 0) + 1;
      };
      new MutationObserver(note).observe(document.documentElement, {
        attributes: true,
        childList: true,
        subtree: true,
      });
      document.addEventListener("scroll", note, { passive: true });
    });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.locator("footer a[href='/naplex']").first().click();
    await page.locator("[data-hero='naplex'] h1").waitFor();
    const arrived = await page.evaluate(() => {
      const w = window as Window & { __headerMiss?: number };
      return {
        hero: document.querySelector("[data-hero]")?.getAttribute("data-hero"),
        scroll: window.scrollY,
        over: document.querySelector("header.aee-nav")?.classList.contains("aee-nav--over-photo") ?? false,
        family: (document.querySelector(".mkt-photo-hero h1")
          ? getComputedStyle(document.querySelector(".mkt-photo-hero h1")!).fontFamily
          : ""
        ).toLowerCase(),
        miss: w.__headerMiss ?? 0,
      };
    });
    expect(arrived.hero).toBe("naplex");
    expect(arrived.scroll).toBeLessThanOrEqual(8);
    expect(arrived.over).toBe(true);
    expect(arrived.family).toContain("plus jakarta sans");
    expect(arrived.miss).toBe(0);
    const client = sharedShot(await readLanding(page));
    await settle(page, "/naplex");
    const direct = sharedShot(await readLanding(page));
    expect(client).toEqual(direct);

    await page.setViewportSize({ width: 390, height: 844 });
    await settle(page, "/");
    await page.locator("a.home-hero__board-link[href='/usmle']").click();
    await page.locator("[data-hero='usmle'] h1").waitFor();
    const fromHome = await page.evaluate(async () => {
      await document.fonts.ready;
      const h1 = document.querySelector(".mkt-photo-hero h1");
      return {
        over: document.querySelector("header.aee-nav")?.classList.contains("aee-nav--over-photo") ?? false,
        family: h1 ? getComputedStyle(h1).fontFamily.toLowerCase() : "",
        border: getComputedStyle(document.querySelector(".mkt-photo-hero__photo")!).borderImageSource,
      };
    });
    expect(fromHome.over).toBe(true);
    expect(fromHome.family).toContain("plus jakarta sans");
    expect(fromHome.border).toContain("/usmle-");
    expect(fromHome.border).not.toContain("/home-");
  });

  test("logged-in chrome keeps the same hero and header treatment", async ({ page }) => {
    test.setTimeout(180_000);
    await page.route("**/api/auth/session", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: { name: "Alex Student", email: "alex@example.com", role: "user" },
          expires: "2099-01-01T00:00:00.000Z",
        }),
      });
    });
    await page.route("**/api/subscription/status**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          hasAccess: true,
          hasAppAccess: true,
          hasStudyAccess: true,
          status: "active",
          role: "user",
        }),
      });
    });

    await page.setViewportSize({ width: 1280, height: 800 });
    const rows: { path: string; value: unknown }[] = [];
    for (const entry of PAGES) {
      await settle(page, entry.path);
      await expect(page.getByRole("button", { name: /Account menu for Alex/i })).toBeVisible();
      await expect(page.locator("header.aee-nav").getByText("Log in", { exact: true })).toHaveCount(0);
      if (entry.path === "/") {
        await expect(page.getByRole("heading", { name: /Keep going, Alex/i })).toBeVisible();
        await expect.poll(async () => (await readLanding(page)).overPhoto).toBe(false);
        continue;
      }
      const shot = await readLanding(page);
      expect(shot.hero, entry.path).toBe(entry.hero);
      expect(shot.overPhoto, entry.path).toBe(true);
      expect(shot.primaryHref, entry.path).toBe(trialHref(entry.path));
      expect(shot.photoH, entry.path).toBe(shot.svh);
      const height = shot.navH;
      await scrollTo(page, 240, false);
      const scrolled = await readLanding(page);
      expect(scrolled.navH, entry.path).toBe(height);
      await scrollTo(page, 0, true);
      rows.push({
        path: entry.path,
        value: {
          ...sharedShot(shot),
          scrolledBg: scrolled.navBg,
        },
      });
    }
    same(rows, "logged in boards");
  });

  test("hero trial click records the same conversion event on every page", async ({ page }) => {
    test.setTimeout(180_000);
    const seen: {
      path: string;
      body: { eventName?: string; properties?: { cta_name?: string; location?: string } };
    }[] = [];
    await page.route("**/api/analytics/conversion", async (route) => {
      seen.push({ path: new URL(page.url()).pathname, body: route.request().postDataJSON() });
      await route.fulfill({ status: 204, body: "" });
    });
    // A document fulfill for /signup unloads the landing and races the next
    // goto. Stop the navigation after the click handler runs. preventDefault
    // does not skip React's onClick, which is what records the event.
    await page.route("**/signup**", async (route) => {
      if (route.request().resourceType() === "document") {
        await route.fulfill({
          status: 200,
          contentType: "text/html",
          body: "<!doctype html><title>signup</title>",
        });
        return;
      }
      await route.continue();
    });

    for (const entry of PAGES) {
      await settle(page, entry.path);
      const before = seen.length;
      const cta = page.locator(".mkt-photo-hero a.aee-flagship-cta");
      await cta.evaluate((el) => {
        el.addEventListener("click", (event) => event.preventDefault(), { capture: true });
      });
      await cta.click();
      await expect.poll(() => seen.length, { timeout: 10_000 }).toBeGreaterThan(before);
      const hit = seen[seen.length - 1];
      expect(hit.body.eventName, entry.path).toBe("cta_clicked");
      expect(hit.body.properties?.cta_name, entry.path).toBe(entry.ctaName);
      expect(hit.body.properties?.location, entry.path).toBe(entry.location);
    }
  });
});
