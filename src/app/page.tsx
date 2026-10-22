import Link from 'next/link';

export default function ShoppingGateway() {
  return (
    <main className="shopping-gateway">
      <div className="gateway-spark" aria-hidden="true">✦</div>
      <p className="gateway-kicker">NAVIDAD MÁGICA</p>
      <h1>Elegí dónde empieza<br/><em>tu aventura.</em></h1>
      <p className="gateway-intro">Cada shopping tiene su propia campaña, premios y tarjetas. Entrá a la experiencia que corresponde a tu visita.</p>
      <div className="gateway-options">
        <Link href="/centenario" className="gateway-option gateway-centenario"><span>01 · CORRIENTES</span><strong>Centenario Shopping</strong><small>Una Navidad para compartir ↗</small></Link>
        <Link href="/uniplaza" className="gateway-option gateway-uniplaza"><span>02 · LA UNIDAD</span><strong>UniPlaza Shopping</strong><small>Una Navidad para recorrer ↗</small></Link>
      </div>
      <footer>Una campaña, dos experiencias propias.</footer>
      <style>{`
        .shopping-gateway{min-height:100svh;padding:max(48px,10vh) clamp(20px,6vw,80px) 28px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:radial-gradient(ellipse at 50% 0%,#e6eee9 0%,#f8f5ed 56%);color:#203a31;font-family:Arial,sans-serif}
        .gateway-spark{font-size:34px;color:#b57642}.gateway-kicker{font:11px ui-monospace,monospace;letter-spacing:.2em;margin:14px 0}.shopping-gateway h1{font:500 clamp(38px,7vw,72px)/1.05 Georgia,serif;letter-spacing:-.045em;margin:10px 0 16px}.shopping-gateway h1 em{color:#a65c43;font-weight:400}.gateway-intro{max-width:56ch;color:#4f5d53;line-height:1.7;margin:0 auto 30px}.gateway-options{width:min(100%,960px);display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;text-align:left}.gateway-option{min-height:190px;padding:clamp(20px,4vw,34px);display:flex;flex-direction:column;justify-content:space-between;text-decoration:none;color:#fff;border-radius:16px;background:linear-gradient(135deg,#315d4b,#203f34);transition:transform .2s,box-shadow .2s}.gateway-option:hover{transform:translateY(-3px);box-shadow:0 16px 32px #203a3126}.gateway-uniplaza{background:linear-gradient(135deg,#315c70,#203e4d);border-radius:28px 8px 28px 8px}.gateway-option:focus-visible{outline:3px solid #9e5c2e;outline-offset:3px}.gateway-option span,.gateway-option small{font:10px ui-monospace,monospace;letter-spacing:.1em}.gateway-option strong{font:500 clamp(22px,3.5vw,34px) Georgia,serif}.gateway-option small{letter-spacing:0}.shopping-gateway footer{margin-top:auto;padding-top:42px;color:#536158;font-size:12px}
        @media(max-width:620px){.shopping-gateway{justify-content:flex-start;padding-top:max(64px,12vh)}.gateway-options{grid-template-columns:1fr}.gateway-option{min-height:155px}}
        @media(prefers-reduced-motion:reduce){.gateway-option{transition:none}}
      `}</style>
    </main>
  );
}
