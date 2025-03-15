import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Trading from "./pages/Trading";
import { injectOpenAd } from "./utils/openAdUtils";

export default function App() {
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    // Inject OpenAD script
    injectOpenAd();

    // Debugging: Check if OpenAD is available
    setTimeout(() => {
      injectOpenAd().then(() => {
        if (window.openADJsSDK) {
          console.log("✅ OpenAD SDK is ready.");
        } else {
          console.warn("⚠️ OpenAD SDK failed to initialize.");
        }
      });
    }, 5000); // Wait 5 seconds to allow the script to load
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/trading" element={<Trading />} />
      </Routes>
    </Router>
  );
}
