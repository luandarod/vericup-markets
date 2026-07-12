import { MarketCard } from "../components/market-card";
import { ProofReceipt } from "../components/proof-receipt";

export default function Home() {
  return (
    <main>
      <nav className="nav shell" aria-label="Principal">
        <a className="brand" href="#top">VERICUP</a>
        <div><a href="#prova">Prova</a><a href="#arquitetura">Arquitetura</a></div>
        <a className="nav-cta" href="https://github.com" rel="noreferrer" target="_blank">Ver código</a>
      </nav>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow">MERCADOS DA COPA NA SOLANA</p>
          <h1>Você prevê. A prova liquida.</h1>
          <p className="lede">Resultados TxLINE verificados on-chain, payouts determinísticos e nenhuma decisão escondida no backend.</p>
          <a className="hero-cta" href="#mercado">Testar mercado</a>
        </div>
        <div id="mercado" className="hero-product">
          <MarketCard home="Brasil" away="Japão" kickoff="16 JUN, 22:00" pools={[482, 126, 209]} />
        </div>
      </section>

      <section className="signal-strip" aria-label="Garantias">
        <div className="shell">
          <span>TxLINE IDL 1.5.6</span><span>Solana devnet</span><span>12 testes Anchor</span><span>PLAY sem valor real</span>
        </div>
      </section>

      <section className="proof-section shell" id="prova">
        <div className="section-copy">
          <h2>O placar não entra pela confiança.</h2>
          <p>O keeper envia as folhas e provas Merkle. O programa reconstrói os predicados, chama TxLINE por CPI e deriva o vencedor.</p>
        </div>
        <ProofReceipt fixtureId={18175981} score="2 - 1" slot={421337991} hash="a19c72f6e8b42291147f9a9bdac33f08" />
      </section>

      <section className="architecture shell" id="arquitetura">
        <h2>Uma linha de confiança curta.</h2>
        <div className="flow" aria-label="Fluxo de resolução">
          <article><b>TxLINE</b><p>Score final e prova de estatística.</p></article>
          <span aria-hidden="true">→</span>
          <article><b>Keeper</b><p>Observa SSE, trava e envia a prova.</p></article>
          <span aria-hidden="true">→</span>
          <article><b>VeriCup</b><p>Valida CPI, deriva e paga no cofre.</p></article>
        </div>
      </section>

      <footer className="footer shell">
        <div><strong>VERICUP MARKETS</strong><p>Settlement esportivo verificável.</p></div>
        <p>Construído para o TxODDS Prediction Markets and Settlement bounty.</p>
      </footer>
    </main>
  );
}
