import {
  showOpenAd,
  showOpenAdPopup,
  showOpenAdInterstitial,
} from "../utils/openAdUtils";

export default function Trading() {
  return (
    <div className="container">
      <h2>Trading Interface</h2>
      <p>🔄 Buy & Sell cryptocurrencies here.</p>
      {/* OpenAd Ads */}
      <button onClick={showOpenAd}>🎯 Show OpenAd</button>
      <button onClick={showOpenAdPopup}>🔔 Show OpenAd Popup</button>
      <button onClick={showOpenAdInterstitial}>
        📢 Show OpenAd Interstitial
      </button>
    </div>
  );
}
