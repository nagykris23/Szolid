import { useState } from "react";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Register.css";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (email !== emailConfirm) {
      setError("Az email címek nem egyeznek!");
      return;
    }

    if (password !== passwordConfirm) {
      setError("A jelszavak nem egyeznek!");
      return;
    }

    try {
      const fullName = `${firstName} ${lastName}`;
      const data = await registerUser(fullName, email, password);
      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-page" style={{ paddingTop: "140px" }}>
      <h2>Regisztráció</h2>

      <form className="register-grid" onSubmit={handleSubmit}>
        <input
          placeholder="Keresztnév"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <input
          placeholder="Vezetéknév"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email újra"
          value={emailConfirm}
          onChange={(e) => setEmailConfirm(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Jelszó"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Jelszó újra"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
        />

        <button className="full" type="submit">
          Regisztráció
        </button>

        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

