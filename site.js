async function getData(){
  const local=localStorage.getItem("alroushDataV2");
  if(local){
    const d=JSON.parse(local);
    if(!d.games){
      try{
        const fresh=await fetch("data.json").then(r=>r.json());
        d.games=fresh.games||[];
      }catch{}
    }
    return d;
  }
  return fetch("data.json").then(r=>r.json());
}

function wa(n){
  return "https://wa.me/20"+String(n).replace(/^0/,"");
}

function waBuy(game,pkg){
  const lines=[
    "السلام عليكم، عايز أشتري من الرّوش ستور 🎮",
    `اللعبة: ${game}`,
    `الباقة: ${pkg.name}`
  ];
  if(pkg.quantity) lines.push(`الكمية: ${pkg.quantity}`);
  if(pkg.price) lines.push(`السعر: ${pkg.price} جنيه`);
  return wa("01152713596")+"?text="+encodeURIComponent(lines.join("\n"));
}

function esc(s){
  return String(s??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
}

function renderGames(games){
  const grid=document.getElementById("gamesGrid");
  const panels=document.getElementById("gamePanels");
  grid.innerHTML=games.map(g=>`
    <article class="gameCard ${esc(g.id)}" data-game="${esc(g.id)}">
      <img class="gameImage" src="${esc(g.image)}" alt="${esc(g.name)}">
      <div class="gameBody"><h3>${esc(g.name)}</h3><p>${esc(g.description)}</p></div>
    </article>`).join("");

  panels.innerHTML=games.map(g=>`
    <section class="gamePanel" id="panel-${esc(g.id)}">
      <div class="gamePanelHead">
        <h3>${esc(g.name)} — الباقات والأسعار</h3>
        <a class="cta" target="_blank" href="${wa("01152713596")}">واتساب</a>
      </div>
      ${g.note?`<div class="gameNote">${esc(g.note)}</div>`:""}
      ${g.dollarRate!==undefined?`<div class="gameDollar">قيمة 1$ = ${esc(g.dollarRate||"______")} كوينز/روبوكس — عدّلها من بيانات المتجر</div>`:""}
      <div class="packageGrid">
        ${(g.packages||[]).map(p=>`
          <div class="packageCard">
            <h4>${esc(p.name)}</h4>
            <div class="packageMeta">${esc(p.quantity||"القيمة/الكمية تُحدد لاحقًا")}</div>
            <div class="packagePrice ${p.price?"":"muted"}">${p.price?esc(p.price)+" جنيه":"السعر يُحدد لاحقًا"}</div>
            <a class="cta buyGame" target="_blank" href="${waBuy(g.name,p)}">شراء عبر واتساب</a>
          </div>`).join("")}
      </div>
    </section>`).join("");

  document.querySelectorAll(".gameCard").forEach(card=>{
    card.addEventListener("click",()=>{
      const id=card.dataset.game;
      document.querySelectorAll(".gameCard").forEach(c=>c.classList.remove("active"));
      document.querySelectorAll(".gamePanel").forEach(p=>p.classList.remove("active"));
      card.classList.add("active");
      const panel=document.getElementById("panel-"+id);
      panel.classList.add("active");
      panel.scrollIntoView({behavior:"smooth",block:"start"});
    });
  });
}

(async()=>{
  const d=await getData();
  document.getElementById("title").textContent=d.storeName;
  document.getElementById("name").textContent=d.storeName;
  document.getElementById("headline").textContent=d.headline;
  document.getElementById("desc").textContent=d.description;
  document.getElementById("exp").textContent=d.experience;

  const main=d.phones[0]?.number||"01152713596";
  ["top","heroWa"].forEach(id=>{
    const a=document.getElementById(id);
    a.href=wa(main);a.target="_blank";
  });

  document.getElementById("phones").innerHTML=d.phones.map(p=>
    `<div class="card"><b>${esc(p.label)}</b><div class="number">${esc(p.number)}</div><a class="cta" target="_blank" href="${wa(p.number)}">تواصل واتساب</a></div>`
  ).join("");

  document.getElementById("servicesGrid").innerHTML=d.services.map(s=>
    `<div class="service"><div class="i">${esc(s.icon)}</div><h3>${esc(s.name)}</h3><p>${esc(s.desc)}</p></div>`
  ).join("");

  document.getElementById("linksGrid").innerHTML=d.links.map(s=>
    `<a class="link" target="_blank" href="${esc(s.url)}"><span class="i">${esc(s.icon)}</span><strong>${esc(s.name)}</strong><small>${esc(s.desc)}</small></a>`
  ).join("");

  renderGames(d.games||[]);
})();
