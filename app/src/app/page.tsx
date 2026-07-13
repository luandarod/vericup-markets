import { MarketCard } from "../components/market-card";
import { ProofReceipt } from "../components/proof-receipt";

export default function Home() {
  return (
    <main>
      <nav className="nav shell" aria-label="Principal">
        <a className="brand" href="#top">VERICUP</a>
        <div><a href="#prova">Prova</a><a href="#arquitetura">Arquitetura</a></div>
        <a className="nav-cta" href="#mercado">Testar</a>
      </nav>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow">MERCADOS DA COPA SEM CARTEIRA</p>
          <h1>Você prevê. A prova liquida.</h1>
          <p className="lede">Palpites convidados com PLAY virtual, placares TxLINE e uma camada Solana opcional para provar o resultado quando isso importa.</p>
          <a className="hero-cta" href="#mercado">Testar mercado</a>
        </div>
        <div id="mercado" className="hero-product">
          <MarketCard home="Brasil" away="Japão" kickoff="16 JUN, 22:00" pools={[482, 126, 209]} />
        </div>
      </section>

      <section className="signal-strip" aria-label="Garantias">
        <div className="shell">
          <span>Sem carteira</span><span>TxLINE IDL 1.5.6</span><span>Prova Solana opcional</span><span>PLAY sem valor real</span>
        </div>
      </section>

      <section className="proof-section shell" id="prova">
        <div className="section-copy">
          <h2>O placar não entra pela confiança.</h2>
          <p>O keeper observa TxLINE, deriva o resultado e pode enviar a prova Merkle para o programa Anchor. A carteira fica no lado operacional, não no caminho do torcedor.</p>
        </div>
        <ProofReceipt fixtureId={18175981} score="2 - 1" slot={421337991} hash="a19c72f6e8b42291147f9a9bdac33f08" />
      </section>

      <section className="architecture shell" id="arquitetura">
        <h2>Um caminho curto para acertar e provar.</h2>
        <div className="flow" aria-label="Fluxo de resolução">
          <article><b>Torcedor</b><p>Registra palpite convidado com PLAY virtual.</p></article>
          <span aria-hidden="true">-&gt;</span>
          <article><b>TxLINE + Keeper</b><p>Recebe SSE, trava mercados e calcula o resultado.</p></article>
          <span aria-hidden="true">-&gt;</span>
          <article><b>Prova opcional</b><p>Valida CPI na Solana e gera recibo verificável.</p></article>
        </div>
      </section>

      <footer className="footer shell">
        <div><strong>VERICUP MARKETS</strong><p>Settlement esportivo verificável.</p></div>
        <p>Construído para o TxODDS Prediction Markets and Settlement bounty.</p>
      </footer>
    </main>
  );
}
