let data=JSON.parse(localStorage.getItem("alroushDataV2")||"null")||null;
async function init(){if(!data){data=await fetch("data.json").then(r=>r.json())}render();bind()}
function bind(){document.querySelectorAll(".nav").forEach(b=>b.onclick=()=>{document.querySelectorAll(".nav").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".panel").forEach(x=>x.classList.remove("on"));b.classList.add("active");document.getElementById(b.dataset.panel).classList.add("on");if(b.dataset.panel==="preview")refreshFrame()})}
function render(){
document.getElementById("pcount").textContent=data.phones.length;document.getElementById("scount").textContent=data.services.length;document.getElementById("lcount").textContent=data.links.length;
document.getElementById("storeName").value=data.storeName;document.getElementById("headline").value=data.headline;document.getElementById("description").value=data.description;document.getElementById("experience").value=data.experience;
document.getElementById("phonesBox").innerHTML=data.phones.map((x,i)=>`<div class="rowitem"><div class="icon">📞</div><label>النوع<input data-t="phones" data-i="${i}" data-k="label" value="${esc(x.label)}"></label><label>الرقم<input data-t="phones" data-i="${i}" data-k="number" value="${esc(x.number)}"></label><button class="del" onclick="del('phones',${i})">حذف</button></div>`).join("");
document.getElementById("servicesBox").innerHTML=data.services.map((x,i)=>`<div class="rowitem"><label>الأيقونة<input data-t="services" data-i="${i}" data-k="icon" value="${esc(x.icon)}"></label><label>الاسم<input data-t="services" data-i="${i}" data-k="name" value="${esc(x.name)}"></label><label>الوصف<input data-t="services" data-i="${i}" data-k="desc" value="${esc(x.desc)}"></label><button class="del" onclick="del('services',${i})">حذف</button></div>`).join("");
document.getElementById("linksBox").innerHTML=data.links.map((x,i)=>`<div class="rowitem links"><label>الأيقونة<input data-t="links" data-i="${i}" data-k="icon" value="${esc(x.icon)}"></label><label>الاسم<input data-t="links" data-i="${i}" data-k="name" value="${esc(x.name)}"></label><label>الوصف<input data-t="links" data-i="${i}" data-k="desc" value="${esc(x.desc)}"></label><label>الرابط<input data-t="links" data-i="${i}" data-k="url" value="${esc(x.url)}"></label><button class="del" onclick="del('links',${i})">حذف</button></div>`).join("");
}
function esc(s){return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}
document.addEventListener("input",e=>{let t=e.target;if(t.dataset.t)data[t.dataset.t][+t.dataset.i][t.dataset.k]=t.value});
function saveAll(){data.storeName=document.getElementById("storeName").value;data.headline=document.getElementById("headline").value;data.description=document.getElementById("description").value;data.experience=document.getElementById("experience").value;localStorage.setItem("alroushDataV2",JSON.stringify(data));toast("تم حفظ التغييرات ✅");refreshFrame()}
function del(t,i){data[t].splice(i,1);render()}
function addPhone(){data.phones.push({label:"جديد",number:"01"});render()}
function addService(){data.services.push({icon:"✨",name:"خدمة جديدة",desc:"وصف الخدمة"});render()}
function addLink(){data.links.push({icon:"🔗",name:"رابط جديد",desc:"وصف الرابط",url:"https://"});render()}
function refreshFrame(){let f=document.getElementById("previewFrame");f.src="site.html?"+Date.now()}
function openSite(){window.open("site.html","_blank")}
function toast(s){let x=document.getElementById("toast");x.textContent=s;x.style.display="block";setTimeout(()=>x.style.display="none",1600)}
document.getElementById("save").onclick=saveAll;init();
