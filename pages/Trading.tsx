import { useEffect, useState } from "react";
import {
  showOpenAdPopup,
  showOpenAdBanner,
  trackBannerAdClick,
} from "../utils/openAdUtils";

export default function Trading() {
  const [bannerAdLoaded, setBannerAdLoaded] = useState(false);
  useEffect(() => {
    async function loadBannerAd() {
      try {
        await showOpenAdBanner();
        setBannerAdLoaded(true);
      } catch (error) {
        console.error("❌ Failed to load banner ad:", error);
      }
    }

    loadBannerAd();
  }, []);
  return (
    <div className="container">
      {/* Interactive OpenAD */}
      <button onClick={showOpenAdPopup}>🔔 Show OpenAd Popup</button>
      {/* Banner Ad */}
      {bannerAdLoaded ? (
        <div
          id="ad-container"
          onClick={trackBannerAdClick} // ✅ Track the click event
          style={{
            cursor: "pointer",
            padding: "10px",
            background: "#f4f4f4",
            textAlign: "center",
          }}
        >
          📢 OpenAd Banner - Click to Track
        </div>
      ) : (
        <p>Loading banner ad...</p>
      )}
    </div>
  );
}
