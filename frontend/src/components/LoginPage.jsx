import { useState } from "react";

const WARD_NAMES = Array.from({ length: 20 }, (_, i) => `Ward ${i + 1}`);

function LoginPage({ onComplete }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    dob: "",
    contact: "",
    role: "",
    ward: "",
    seniorCitizen: null,
    outdoorWorker: null,
  });

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleRoleSelect = (role) => {
    update("role", role);
    setStep(role === "public" ? 3 : 4); // public gets extra questions, authority skips ahead
  };

  const handleFinish = () => {
    localStorage.setItem("ushma_user", JSON.stringify(form));
    onComplete(form);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <span className="logo-badge">☀</span>
          <h1>USHMA</h1>
          <p>Turning Heat into Action</p>
        </div>

        {step === 1 && (
          <div className="login-step">
            <h2>Let's get started</h2>
            <label>Your Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
            <label>Date of Birth</label>
            <input
              type="date"
              value={form.dob}
              onChange={(e) => update("dob", e.target.value)}
            />
            <label>Phone Number or Email</label>
            <input
              type="text"
              placeholder="Phone number or email"
              value={form.contact}
              onChange={(e) => update("contact", e.target.value)}
            />
            <button
              className="login-button"
              disabled={!form.name || !form.dob || !form.contact}
              onClick={() => setStep(2)}
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="login-step">
            <h2>How will you use USHMA?</h2>
            <button className="role-button" onClick={() => handleRoleSelect("public")}>
              <span className="role-icon">🧑</span>
              <div>
                <strong>I'm a Member of the Public</strong>
                <p>Simple heat safety info for you and your family</p>
              </div>
            </button>
            <button className="role-button" onClick={() => handleRoleSelect("authority")}>
              <span className="role-icon">🏥</span>
              <div>
                <strong>I'm a Health/Disaster Authority</strong>
                <p>Full ward-level risk dashboard and controls</p>
              </div>
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="login-step">
            <h2>Just a couple more questions</h2>
            <p className="login-subtext">This helps us give you safer, more personal advice.</p>

            <label>Which ward do you live in?</label>
            <select
              className="ward-select-login"
              value={form.ward}
              onChange={(e) => update("ward", e.target.value)}
            >
              <option value="" disabled>Select your ward</option>
              {WARD_NAMES.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>

            <label>Are you a senior citizen (60+)?</label>
            <div className="yes-no-row">
              <button
                className={form.seniorCitizen === true ? "yn-button active" : "yn-button"}
                onClick={() => update("seniorCitizen", true)}
              >
                Yes
              </button>
              <button
                className={form.seniorCitizen === false ? "yn-button active" : "yn-button"}
                onClick={() => update("seniorCitizen", false)}
              >
                No
              </button>
            </div>

            <label>Do you work outdoors (e.g. construction, delivery, farming)?</label>
            <div className="yes-no-row">
              <button
                className={form.outdoorWorker === true ? "yn-button active" : "yn-button"}
                onClick={() => update("outdoorWorker", true)}
              >
                Yes
              </button>
              <button
                className={form.outdoorWorker === false ? "yn-button active" : "yn-button"}
                onClick={() => update("outdoorWorker", false)}
              >
                No
              </button>
            </div>

            <button
              className="login-button"
              disabled={!form.ward || form.seniorCitizen === null || form.outdoorWorker === null}
              onClick={handleFinish}
            >
              Enter USHMA
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="login-step">
            <h2>You're all set</h2>
            <p className="login-subtext">Welcome, {form.name}. Entering the authority dashboard.</p>
            <button className="login-button" onClick={handleFinish}>
              Enter Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;