import { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import AccessibilityBar from "./components/AccessibilityBar";
import PublicView from "./components/PublicView";
import AuthorityView from "./components/AuthorityView";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [colorBlindMode, setColorBlindMode] = useState(false);
  const [textScale, setTextScale] = useState(1);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("ushma_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("ushma_user");
    setUser(null);
  };

  if (!user) {
    return <LoginPage onComplete={setUser} />;
  }

  return (
    <div
      className={`app-container ${colorBlindMode ? "colorblind-mode" : ""}`}
      style={{ fontSize: `${textScale}em` }}
    >
      <header className="app-header">
        <div className="header-left">
          <span className="logo-badge">☀</span>
          <div>
            <h1>USHMA</h1>
            <span className="tagline">Turning Heat into Action</span>
          </div>
        </div>
        <div className="header-right">
          <AccessibilityBar
            colorBlindMode={colorBlindMode}
            onToggleColorBlind={() => setColorBlindMode((v) => !v)}
            textScale={textScale}
            onTextScaleChange={setTextScale}
            language={language}
            onLanguageChange={setLanguage}
          />
          <button className="header-toggle" onClick={handleLogout}>Log out</button>
        </div>
      </header>

      {user.role === "public" ? (
        <PublicView user={user} language={language} />
      ) : (
        <AuthorityView colorBlindMode={colorBlindMode} language={language} />
      )}
    </div>
  );
}

export default App;