import { useState } from "react";
import "./Auth.css";

import { API_URL } from './services/api';

export default function Auth({ onSuccess, onBack }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const isLogin = mode === "login";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!isLogin && password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (!isLogin && password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin
        ? `${API_URL}/auth/login`
        : `${API_URL}/users/register`;

      const body = isLogin
        ? { email, password }
        : { name, email, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const responseText = await response.text();
        let errorMessage = "";

        try {
          const data = JSON.parse(responseText);
          errorMessage =
            data.message ||
            data.error ||
            data.errors?.[0]?.defaultMessage ||
            "";
        } catch {
          errorMessage = responseText;
        }

        if (response.status === 401) {
          throw new Error("E-mail ou senha incorretos.");
        }

        if (response.status === 409) {
          throw new Error("Este e-mail já está cadastrado.");
        }

        throw new Error(
          errorMessage || "Não foi possível concluir a operação."
        );
      }

      if (isLogin) {
        const data = await response.json();

        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            userId: data.userId,
            name: data.name,
            role: data.role,
          })
        );

        onSuccess?.({
          userId: data.userId,
          name: data.name,
          role: data.role,
        });
      } else {
        setMessage("Cadastro realizado! Agora você já pode entrar.");
        setMode("login");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setError(
        err.message || "Não foi possível conectar ao servidor."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <button className="auth-back" onClick={onBack} type="button">
        ← Voltar para a loja
      </button>

      <section className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-icon">N</span>
          <span>NEXUS STORE</span>
        </div>

        <div className="auth-heading">
          <p className="auth-eyebrow">
            {isLogin ? "BEM-VINDO DE VOLTA" : "JUNTE-SE À NEXUS"}
          </p>

          <h1>{isLogin ? "Entre na sua conta" : "Crie sua conta"}</h1>

          <p>
            {isLogin
              ? "Acesse sua conta e continue sua experiência."
              : "Cadastre-se para aproveitar tudo que a NEXUS oferece."}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={isLogin ? "active" : ""}
            onClick={() => {
              setMode("login");
              setError("");
              setMessage("");
            }}
          >
            Entrar
          </button>

          <button
            type="button"
            className={!isLogin ? "active" : ""}
            onClick={() => {
              setMode("register");
              setError("");
              setMessage("");
            }}
          >
            Cadastrar
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="auth-field">
              <label htmlFor="auth-name">Nome completo</label>
              <input
                id="auth-name"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email">E-mail</label>
            <input
              id="auth-email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="auth-password">Senha</label>
            <input
              id="auth-password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
            />
          </div>

          {!isLogin && (
            <div className="auth-field">
              <label htmlFor="auth-confirm-password">
                Confirmar senha
              </label>
              <input
                id="auth-confirm-password"
                type="password"
                placeholder="Digite sua senha novamente"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                minLength={6}
                required
              />
            </div>
          )}

          {error && <div className="auth-error">{error}</div>}
          {message && <div className="auth-success">{message}</div>}

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Aguarde..."
              : isLogin
                ? "Entrar na minha conta"
                : "Criar minha conta"}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? "Ainda não tem uma conta?" : "Já possui uma conta?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(isLogin ? "register" : "login");
              setError("");
              setMessage("");
            }}
          >
            {isLogin ? "Cadastre-se" : "Faça login"}
          </button>
        </p>
      </section>

      <p className="auth-footer">
        © 2026 NEXUS STORE. Todos os direitos reservados.
      </p>
    </main>
  );
}
