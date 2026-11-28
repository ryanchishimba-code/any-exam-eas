"use client";

import {
  ADS_PURCHASE_COOKIE,
  ADS_SIGNUP_COOKIE,
  type ConfirmedPurchase,
  type FiredStore,
  type GtagEvent,
  parsePurchaseCookie,
  parseSignupCookie,
  trackPurchaseOnce,
  trackSignUpOnce,
} from "@/lib/analytics/google-ads";

const HIT_TIMEOUT_MS = 2000;
const LIBRARY_TIMEOUT_MS = 2500;

function gtagLibraryLoaded(): boolean {
  const flag = (window as Window & { google_tag_manager?: object }).google_tag_manager;
  return typeof flag === "object" && flag !== null;
}

function waitForGtagLibrary(timeoutMs: number): Promise<boolean> {
  if (gtagLibraryLoaded()) return Promise.resolve(true);
  return new Promise((resolve) => {
    const started = Date.now();
    const timer = window.setInterval(() => {
      if (gtagLibraryLoaded() || Date.now() - started >= timeoutMs) {
        window.clearInterval(timer);
        resolve(gtagLibraryLoaded());
      }
    }, 100);
  });
}

function browserFiredStore(): FiredStore {
  return {
    has(key) {
      try {
        return window.localStorage.getItem(key) === "1";
      } catch {
        return false;
      }
    },
    add(key) {
      try {
        window.localStorage.setItem(key, "1");
      } catch {
        /* private mode still sends the hit; a refresh may send it again */
      }
    },
  };
}

function readCookie(name: string): string | null {
  const prefix = `${name}=`;
  for (const part of document.cookie.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) return trimmed.slice(prefix.length);
  }
  return null;
}

function clearCookie(name: string): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}

function consumeCookie(name: string): string | null {
  const value = readCookie(name);
  if (value) clearCookie(name);
  return value;
}

function gtagReady(): boolean {
  return typeof window.gtag === "function";
}

function dispatchGtag(
  events: GtagEvent[],
  emailHash: string | null,
  wait: boolean
): Promise<void> {
  if (!gtagReady()) return Promise.resolve();
  if (emailHash) {
    window.gtag!("set", "user_data", { sha256_email_address: emailHash });
  }
  if (!wait || events.length === 0) {
    for (const event of events) window.gtag!("event", event.name, event.params);
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    const timer = window.setTimeout(finish, HIT_TIMEOUT_MS);
    let remaining = events.length;
    for (const event of events) {
      window.gtag!("event", event.name, {
        ...event.params,
        event_callback: () => {
          remaining -= 1;
          if (remaining <= 0) {
            window.clearTimeout(timer);
            finish();
          }
        },
      });
    }
  });
}

/** Read one-shot cookies set after account creation or a confirmed charge. */
export async function flushPendingAdsConversions(email: string | null): Promise<void> {
  // The stub queues into dataLayer, which dies on navigation. Wait for gtag.js.
  if (!gtagLibraryLoaded()) return;
  const signupRaw = consumeCookie(ADS_SIGNUP_COOKIE);
  const purchaseRaw = consumeCookie(ADS_PURCHASE_COOKIE);
  const store = browserFiredStore();
  if (signupRaw) {
    const signup = parseSignupCookie(decodeURIComponentSafe(signupRaw));
    if (signup) {
      await trackSignUpOnce({
        signup,
        email,
        store,
        send: (events, emailHash) => dispatchGtag(events, emailHash, false),
      });
    }
  }
  if (purchaseRaw) {
    const purchase = parsePurchaseCookie(decodeURIComponentSafe(purchaseRaw));
    if (purchase) {
      await trackPurchaseOnce({
        purchase,
        email,
        store,
        send: (events, emailHash) => dispatchGtag(events, emailHash, false),
      });
    }
  }
}

/**
 * Fire a server-confirmed purchase and wait briefly so the hit leaves before
 * the success page navigates to the study hub.
 */
export async function trackConfirmedPurchaseAndWait(
  purchase: ConfirmedPurchase,
  email: string | null
): Promise<void> {
  const loaded = await waitForGtagLibrary(LIBRARY_TIMEOUT_MS);
  if (!loaded) return;
  await trackPurchaseOnce({
    purchase,
    email,
    store: browserFiredStore(),
    send: (events, emailHash) => dispatchGtag(events, emailHash, true),
  });
}

function decodeURIComponentSafe(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
