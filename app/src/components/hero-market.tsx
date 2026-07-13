"use client";

import { useState } from "react";
import { MarketCard } from "./market-card";

export function HeroMarket() {
  const [focusKey, setFocusKey] = useState(0);

  return (
    <section className="hero shell" id="top">
      <div className="hero-copy">
        <p className="eyebrow">MERCADOS DA COPA SEM CARTEIRA</p>
        <h1>Você prevê. A prova liquida.</h1>
        <p className="lede">Palpites convidados com PLAY virtual, placares TxLINE e uma camada Solana opcional para provar o resultado quando isso importa.</p>
        <button className="hero-cta" onClick={() => setFocusKey((value) => value + 1)} type="button">Testar mercado</button>
      </div>
      <div id="mercado" className="hero-product">
        <MarketCard focusKey={focusKey} home="Brasil" away="Japão" kickoff="16 JUN, 22:00" pools={[482, 126, 209]} />
      </div>
    </section>
  );
}
