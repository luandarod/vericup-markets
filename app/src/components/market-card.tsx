"use client";

import { useState } from "react";

type Outcome = "Brasil" | "Empate" | "Japão";

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
  const [selected, setSelected] = useState<Outcome>("Brasil");
  const [amount, setAmount] = useState("25");
  const outcomes: Array<{ label: Outcome; name: string; pool: number }> = [
    { label: "Brasil", name: home, pool: pools[0] },
    { label: "Empate", name: "Empate", pool: pools[1] },
    { label: "Japão", name: away, pool: pools[2] }
  ];

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
            aria-pressed={selected === outcome.label}
            key={outcome.label}
            onClick={() => setSelected(outcome.label)}
            type="button"
          >
            <span>{outcome.name}</span>
            <b>{outcome.pool} PLAY</b>
          </button>
        ))}
      </div>
      <label className="amount-field">
        <span>POSIÇÃO</span>
        <input
          aria-label="Quantidade de PLAY"
          inputMode="numeric"
          onChange={(event) => setAmount(event.target.value)}
          value={amount}
        />
        <b>PLAY</b>
      </label>
      <button className="primary-action" disabled={!amount || Number(amount) <= 0} type="button">
        Confirmar {selected}
      </button>
      <p className="helper">Demonstração local. A transação real exige carteira na Solana devnet.</p>
    </section>
  );
}
