"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="login-page"><section className="login-card"><h1>Não foi possível carregar esta página</h1><p>Tente novamente em instantes.</p><button className="button" onClick={reset}>Tentar novamente</button></section></main>;
}
