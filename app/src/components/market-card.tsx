"use client";

import { useState } from "react";

type Outcome = "HOME" | "DRAW" | "AWAY";

export function MarketCard({
  home,
  away,
  kickoff,
  pools
}: {
  home: string;
  away: string;
  kickoff: string;
  pools: [number, number, number];
}) {
  const [selected, setSelected] = useState<Outcome>("HOME");
  const [amount, setAmount] = useState("25");
  const [receipt, setReceipt] = useState<{ outcome: string; amount: string } | null>(null);
  const outcomes: Array<{ code: Outcome; name: string; pool: number }> = [
    { code: "HOME", name: home, pool: pools[0] },
    { code: "DRAW", name: "Empate", pool: pools[1] },
    { code: "AWAY", name: away, pool: pools[2] }
  ];
  const selectedName = outcomes.find((outcome) => outcome.code === selected)?.name ?? home;

  return (
    <section className="market-card" aria-label={`${home} contra ${away}`}>
      <div className="fixture-meta">
        <span>GRUPO C</span>
        <time>{kickoff}</time>
      </div>
      <div className="teams">
        <strong>{home}</strong>
        <span>vs</span>
        <strong>{away}</strong>
      </div>
      <div className="outcomes">
        {outcomes.map((outcome) => (
          <button
            aria-pressed={selected === outcome.code}
            key={outcome.code}
            onClick={() => {
              setSelected(outcome.code);
              setReceipt(null);
            }}
            type="button"
          >
            <span>{outcome.name}</span>
            <b>{outcome.pool} PLAY</b>
          </button>
        ))}
      </div>
      <label className="amount-field">
        <span>POSICAO</span>
        <input
          aria-label="Quantidade de PLAY"
          inputMode="numeric"
          onChange={(event) => {
            setAmount(event.target.value);
            setReceipt(null);
          }}
          value={amount}
        />
        <b>PLAY</b>
      </label>
      <button
        className="primary-action"
        disabled={!amount || Number(amount) <= 0}
        onClick={() => setReceipt({ outcome: selectedName, amount })}
        type="button"
      >
        Registrar {selectedName}
      </button>
      <p className="helper">Nenhuma carteira necessaria. PLAY e pontuacao virtual para a demo.</p>
      {receipt ? (
        <p className="guest-receipt" role="status">
          Palpite registrado: {receipt.outcome}, {receipt.amount} PLAY.
        </p>
      ) : null}
    </section>
  );
}
