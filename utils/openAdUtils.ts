import PromiseLoadScript from "./PromiseLoadScript";

// Constants for ad tracking
const MAX_AD_CLICKS = 3;
const STORAGE_KEY = "openAdClicks";
const DATE_KEY = "lastAdDate";
const OPENAD_ZONE_ID = 384; // ✅ Your Zone ID
const OPENAD_PUBLISHER_ID = 444; // ✅ Your Publisher ID

const adParams = {
  version: "v3", // ✅ Match OpenAD documentation
  TG: true, // ✅ Set true ONLY for Telegram Mini Apps
};

// ✅ Mandatory userInfo parameters (can be left blank if unknown)
const userInfo = {
  userId: "", // User ID, can be blank
  firstName: "",
  lastName: "",
  userName: "",
  walletType: "",
  walletAddress: "",
};

/**
 * Checks if an ad can be shown based on daily limits.
 */
function canShowAd(): boolean {
  const today = new Date().toISOString().split("T")[0];
  const lastDate = localStorage.getItem(DATE_KEY);
  let adClicks = Number(localStorage.getItem(STORAGE_KEY) || "0");

  if (lastDate !== today) {
    // Reset the counter if a new day starts
    localStorage.setItem(STORAGE_KEY, "0");
    localStorage.setItem(DATE_KEY, today);
    adClicks = 0;
  }

  return adClicks < MAX_AD_CLICKS;
}

/**
 * Tracks an ad click in local storage.
 */
function trackAdClick(): void {
  let adClicks = Number(localStorage.getItem(STORAGE_KEY) || "0");
  localStorage.setItem(STORAGE_KEY, (adClicks + 1).toString());
}

/**
 * Ensures that the OpenAD SDK is loaded before calling any ad functions.
 */
export async function injectOpenAd(): Promise<void> {
  if (window.openADJsSDK) {
    console.log("✅ OpenAD SDK already loaded.");
    return;
  }

  console.log("🚀 Injecting OpenAD SDK...");
  try {
    await PromiseLoadScript({
      url: "https://protocol.openad.network/sdk/loader.js?v=3.4.0",
      name: "openADJsSDK",
      version: "3.4.0",
      noCache: true,
    });

    console.log("✅ OpenAD script loaded successfully!");

    if (window.openADJsSDK) {
      const openAD = window.openADJsSDK as OpenADJsSDK;

      const adInfo = {
        zoneId: OPENAD_ZONE_ID,
        publisherId: OPENAD_PUBLISHER_ID,
        eventId: 0,
      };

      const initResult = await openAD.init({ adParams, adInfo, userInfo });

      if (initResult.code === 0) {
        console.log("✅ OpenAD initialized successfully!");
      } else {
        console.error("❌ OpenAD initialization failed:", initResult.msg);
      }
    }
  } catch (error) {
    console.error("❌ Failed to load OpenAD script:", error);
  }
}

/**
 * Ensures OpenAD SDK is available before using it.
 */
async function ensureOpenAD(): Promise<OpenADJsSDK | null> {
  if (!window.openADJsSDK) {
    await injectOpenAd();
  }
  return window.openADJsSDK ? (window.openADJsSDK as OpenADJsSDK) : null;
}

/**
 * Displays an interactive OpenAD popup.
 */
export async function showOpenAdPopup(): Promise<void> {
  const openAD = await ensureOpenAD();
  if (!openAD) {
    console.warn("⚠️ OpenAD SDK not available.");
    return;
  }

  if (!openAD.interactive || !openAD.interactive.getRender) {
    console.error("❌ OpenAD Interactive is not initialized.");
    return;
  }

  const adInfo = {
    zoneId: OPENAD_ZONE_ID,
    publisherId: OPENAD_PUBLISHER_ID,
    eventId: 0,
  };

  try {
    openAD.interactive.getRender({
      adInfo,
      cb: {
        adResourceLoad: (e: boolean) =>
          console.log("🔍 Ad Resource Loaded:", e),
        adOpening: (e: boolean) => console.log("🚀 Ad is Opening:", e),
        adOpened: (e: string) => console.log("✅ Interactive Ad Opened:", e),
        adTaskFinished: (e: string) => console.log("✅ Ad Task Completed:", e),
        adClosing: (e: string) => console.log("🔴 Ad is Closing:", e),
        adClosed: (e: string) => {
          console.log("✅ Interactive Ad Closed:", e);
          trackAdClick(); // ✅ Track ad interaction
        },
        adClick: (e: boolean) => console.log("🎯 Ad Clicked:", e),
      },
    });
  } catch (error) {
    console.error("❌ Error calling getRender:", error);
  }
}

/**
 * Displays an interstitial ad.
 */
export async function showOpenAdInterstitial(): Promise<void> {
  if (!canShowAd()) {
    alert("🚫 Daily ad limit reached.");
    return;
  }

  const openAD = await ensureOpenAD();
  if (!openAD) {
    console.warn("⚠️ OpenAD SDK not available.");
    return;
  }

  // ✅ Ensure `interactive` is available before calling `getRender`
  if (!openAD.interactive || !openAD.interactive.getRender) {
    console.error("❌ OpenAD Interactive is not initialized.");
    return;
  }

  const adInfo = {
    zoneId: OPENAD_ZONE_ID,
    publisherId: OPENAD_PUBLISHER_ID,
    eventId: 0,
  };

  try {
    openAD.interactive.getRender({
      adInfo,
      cb: {
        adResourceLoad: (e: boolean) =>
          console.log("🔍 Ad Resource Loaded:", e),
        adOpening: (e: boolean) => console.log("🚀 Ad is Opening:", e),
        adOpened: (e: string) => console.log("✅ Interstitial Ad Opened:", e),
        adTaskFinished: (e: string) => console.log("✅ Ad Task Completed:", e),
        adClosing: (e: string) => console.log("🔴 Ad is Closing:", e),
        adClosed: (e: string) => {
          console.log("✅ Interstitial Ad Closed:", e);
          trackAdClick(); // ✅ Track clicks when the ad is closed
        },
        adClick: (e: boolean) => console.log("🎯 Ad Clicked:", e),
      },
    });
  } catch (error) {
    console.error("❌ Error calling getRender:", error);
  }
}

/**
 * Displays a standard OpenAD.
 */
export async function showOpenAd(): Promise<void> {
  if (!canShowAd()) {
    alert("🚫 Daily ad limit reached.");
    return;
  }

  const openAD = await ensureOpenAD();
  if (!openAD || !openAD.bridge || !openAD.bridge.get || !openAD.bridge.click) {
    console.error("❌ OpenAD SDK is missing required methods.");
    return;
  }

  const adInfo = {
    zoneId: OPENAD_ZONE_ID,
    publisherId: OPENAD_PUBLISHER_ID,
    eventId: 0,
  };

  try {
    const res = await openAD.bridge.get({ adInfo, adParams });

    if (res.code === 0 && res.data) {
      console.log("✅ OpenAD Banner Loaded:", res);

      // ✅ Display the banner ad to the user
      openAD.bridge.click(adInfo);

      // ✅ Track the click when the user interacts
      setTimeout(() => trackAdClick(), 500); // Delay to ensure tracking is accurate
    } else {
      console.warn("⚠️ No ads available:", res.msg);
    }
  } catch (error) {
    console.error("❌ Error loading OpenAD:", error);
  }
}
