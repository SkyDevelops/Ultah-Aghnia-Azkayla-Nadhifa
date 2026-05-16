/* Admin — Underwater Scene: Snails, Submarine, Diver, Ships, Birds 🐚🫧 */
(function(){
"use strict";
const pinScreen=document.getElementById("pinScreen"),adminDashboard=document.getElementById("adminDashboard"),
pinSubmit=document.getElementById("pinSubmit"),pinError=document.getElementById("pinError"),
logoutBtn=document.getElementById("logoutBtn"),statTotal=document.getElementById("statTotal"),
statGuests=document.getElementById("statGuests"),statToday=document.getElementById("statToday"),
wishesListAdmin=document.getElementById("wishesListAdmin"),adminEmpty=document.getElementById("adminEmpty"),
exportBtn=document.getElementById("exportBtn"),toast=document.getElementById("toast"),
canvas=document.getElementById("wishTree"),ctx=canvas.getContext("2d"),
wrapper=document.getElementById("treeWrapper"),
pins=[document.getElementById("pin1"),document.getElementById("pin2"),document.getElementById("pin3"),document.getElementById("pin4")];

// PIN
pins.forEach((p,i)=>{p.addEventListener("input",()=>{if(p.value.length===1&&i<3)pins[i+1].focus()});
p.addEventListener("keydown",e=>{if(e.key==="Backspace"&&!p.value&&i>0)pins[i-1].focus();if(e.key==="Enter")login()})});
pinSubmit.addEventListener("click",login);
function login(){const pin=pins.map(i=>i.value).join("");if(pin===ADMIN_PIN){pinScreen.style.display="none";adminDashboard.style.display="block";initAdmin()}
else{pinError.textContent="❌ PIN salah!";pins.forEach(i=>{i.value="";i.style.borderColor="#FF6B6B"});pins[0].focus();
setTimeout(()=>{pins.forEach(i=>i.style.borderColor="");pinError.textContent=""},2000)}}
logoutBtn.addEventListener("click",()=>{adminDashboard.style.display="none";pinScreen.style.display="flex";pins.forEach(i=>i.value="");pins[0].focus();cancelAnimationFrame(af)});

// Data
function getW(){try{return JSON.parse(localStorage.getItem("kaylaWishes")||"[]")}catch{return[]}}
function saveW(w){localStorage.setItem("kaylaWishes",JSON.stringify(w))}
function updateStats(){const w=getW();statTotal.textContent=w.length;statGuests.textContent=new Set(w.map(x=>x.name.toLowerCase())).size;
const td=new Date().toDateString();statToday.textContent=w.filter(x=>new Date(x.timestamp).toDateString()===td).length}
function renderList(){const ws=getW();wishesListAdmin.innerHTML="";if(!ws.length){adminEmpty.style.display="block";return}
adminEmpty.style.display="none";[...ws].reverse().forEach((w,i)=>{const ri=ws.length-1-i,c=document.createElement("div");
c.className="wish-admin-card";const ini=w.name.split(" ").slice(0,2).map(x=>x[0]).join("").toUpperCase();
c.innerHTML=`<div class="wish-admin-avatar">${ini}</div><div style="flex:1;min-width:0"><div class="wish-admin-name">🐚 ${esc(w.name)}</div>
<div class="wish-admin-message">${esc(w.message)}</div><div class="wish-admin-time">${fmt(w.timestamp)}</div></div>
<button class="wish-admin-delete" data-index="${ri}">🗑</button>`;wishesListAdmin.appendChild(c)});
wishesListAdmin.querySelectorAll(".wish-admin-delete").forEach(b=>{b.addEventListener("click",()=>{const ws=getW();ws.splice(+b.dataset.index,1);saveW(ws);refreshAll();showToast("Dihapus 🗑")})})}
exportBtn.addEventListener("click",()=>{const w=getW();if(!w.length){showToast("Kosong");return}let csv="Nama,Ucapan,Waktu\n";
w.forEach(x=>{csv+=`"${x.name.replace(/"/g,'""')}","${x.message.replace(/"/g,'""')}","${new Date(x.timestamp).toLocaleString("id-ID")}"\n`});
const a=document.createElement("a");a.href=URL.createObjectURL(new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"}));a.download="ucapan_kayla.csv";a.click();showToast("CSV diunduh! 📥")});
function esc(s){const d=document.createElement("div");d.textContent=s;return d.innerHTML}
function fmt(ts){return new Date(ts).toLocaleString("id-ID",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}
function showToast(m){toast.textContent=m;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),3000)}
function refreshAll(){updateStats();renderList();syncSnails()}

// =========== CANVAS SCENE ===========
let dpr=1,cw=1000,ch=600,af,t=0;
let fishes=[],ambBub=[],wishBub=[],snails=[];
let submarine,diver,ships=[],birds=[];
const SURFACE_Y=50; // water surface line

function resize(){dpr=window.devicePixelRatio||1;const w=wrapper.clientWidth,h=Math.max(500,Math.min(Math.round(w*0.6),650));
canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+"px";canvas.style.height=h+"px";cw=w;ch=h}

// --- Fish ---
const FT=[{e:"🐠",s:24},{e:"🐟",s:20},{e:"🦈",s:34},{e:"🐡",s:18},{e:"🐬",s:30},{e:"🐙",s:26},{e:"🦑",s:22},{e:"🐳",s:36},{e:"🦀",s:16}];
function mkFish(){const f=FT[Math.floor(Math.random()*FT.length)],r=Math.random()>0.5;
return{x:r?-60:cw+60,y:SURFACE_Y+30+Math.random()*(ch-SURFACE_Y-120),spd:0.3+Math.random()*0.6,dir:r?1:-1,e:f.e,sz:f.s+Math.random()*6,wo:Math.random()*6.28,wa:6+Math.random()*12,ws:0.4+Math.random()*0.8}}
function initFish(){fishes=Array.from({length:7},()=>{const f=mkFish();f.x=Math.random()*cw;return f})}
function drawFish(c){fishes.forEach((f,i)=>{f.x+=f.spd*f.dir;const wy=Math.sin(t*f.ws+f.wo)*f.wa;
if((f.dir>0&&f.x>cw+90)||(f.dir<0&&f.x<-90)){fishes[i]=mkFish();return}
c.save();c.translate(f.x,f.y+wy);if(f.dir<0)c.scale(-1,1);c.font=f.sz+"px serif";c.textAlign="center";c.textBaseline="middle";c.fillText(f.e,0,0);c.restore()})}

// --- Ambient bubbles ---
function mkAmb(){return{x:Math.random()*cw,y:ch-25,sz:1.5+Math.random()*4,spd:0.2+Math.random()*0.4,wo:Math.random()*6.28,op:0.08+Math.random()*0.15}}
function initAmb(){ambBub=Array.from({length:15},()=>{const b=mkAmb();b.y=SURFACE_Y+Math.random()*(ch-SURFACE_Y-40);return b})}
function drawAmb(c){ambBub.forEach((b,i)=>{b.y-=b.spd;b.wo+=0.02;const bx=b.x+Math.sin(b.wo)*2;
if(b.y<SURFACE_Y-5){ambBub[i]=mkAmb();return}
c.save();c.globalAlpha=b.op;c.beginPath();c.arc(bx,b.y,b.sz,0,6.28);c.strokeStyle="rgba(135,206,235,0.5)";c.lineWidth=0.7;c.stroke();
c.beginPath();c.arc(bx-b.sz*0.3,b.y-b.sz*0.3,b.sz*0.18,0,6.28);c.fillStyle="rgba(255,255,255,0.35)";c.fill();c.restore()})}

// --- 7 Snails: 4 plain + 3 wish ---
function syncSnails(){const ws=getW();const floorY=ch-28;
snails=[];const sp=cw/8;
for(let i=0;i<7;i++){const isWish=i<3&&i<ws.length;
snails.push({x:sp*(i+1),y:floorY,isWish,wish:isWish?ws[i%ws.length]:null,timer:60+Math.random()*200+i*30,openT:0})}
// Rotate wishes among wish-snails if more than 3
if(ws.length>3){let wi=0;snails.forEach(s=>{if(s.isWish){s.wishPool=ws;s.poolIdx=wi;wi++}})}}

function drawSnails(c){snails.forEach(s=>{s.timer--;
if(s.timer<=0){s.openT=25;
if(s.isWish){// Emit wish bubble
const w=s.wishPool?s.wishPool[s.poolIdx%s.wishPool.length]:s.wish;
if(w)spawnWish(s.x,s.y-12,w);
if(s.wishPool)s.poolIdx++;
}else{// Plain small bubbles
for(let j=0;j<3;j++){const nb=mkAmb();nb.x=s.x+(Math.random()-0.5)*12;nb.y=s.y-10;nb.sz=2+Math.random()*3;nb.spd=0.3+Math.random()*0.3;ambBub.push(nb)}}
s.timer=180+Math.random()*250}
if(s.openT>0)s.openT--;
c.save();c.font=(s.openT>0?"22":"18")+"px serif";c.textAlign="center";c.textBaseline="bottom";c.fillText("🐌",s.x,s.y+12);c.restore()})}

// --- Wish Bubbles ---
function spawnWish(x,y,wish){const fs=Math.max(9,Math.min(11,wish.message.length<30?11:9.5));
const maxW=wish.message.length<20?70:wish.message.length<50?90:120;
ctx.font=`600 ${fs}px 'Nunito',sans-serif`;
const words=wish.message.split(" ");const lines=[];let cur="";
for(const w of words){const test=cur?cur+" "+w:w;if(ctx.measureText(test).width>maxW*1.5&&cur){lines.push(cur);cur=w}else cur=test}
if(cur)lines.push(cur);
const lh=fs*1.4;const r=Math.max(35,Math.max(lines.length*lh/1.6+12,ctx.measureText(wish.message.slice(0,20)).width/1.4+14));
wishBub.push({x,y,r:Math.min(r,88),spd:0.4+Math.random()*0.3,wo:Math.random()*6.28,wa:2+Math.random()*3,
hue:175+Math.random()*45,lines,fs,op:0,phase:"rise",msg:wish.message})}

function drawWishBub(c){wishBub=wishBub.filter(b=>b.op>0||b.phase==="rise");
wishBub.forEach(b=>{b.y-=b.spd;b.wo+=0.015;const bx=b.x+Math.sin(b.wo)*b.wa;
if(b.phase==="rise"&&b.op<1)b.op=Math.min(1,b.op+0.035);
if(b.y-b.r<SURFACE_Y+15&&b.phase==="rise")b.phase="fade";
if(b.phase==="fade"){b.op-=0.03;if(b.op<=0)return}
c.save();c.globalAlpha=b.op;
c.shadowColor=`hsla(${b.hue},80%,70%,0.35)`;c.shadowBlur=10;
const g=c.createRadialGradient(bx-b.r*.2,b.y-b.r*.2,b.r*.08,bx,b.y,b.r);
g.addColorStop(0,`hsla(${b.hue},70%,82%,.25)`);g.addColorStop(.7,`hsla(${b.hue},60%,65%,.1)`);g.addColorStop(1,`hsla(${b.hue},50%,55%,.03)`);
c.beginPath();c.arc(bx,b.y,b.r,0,6.28);c.fillStyle=g;c.fill();
c.shadowBlur=0;c.beginPath();c.arc(bx,b.y,b.r,0,6.28);c.strokeStyle=`hsla(${b.hue},70%,72%,.5)`;c.lineWidth=1.3;c.stroke();
c.beginPath();c.arc(bx-b.r*.3,b.y-b.r*.3,b.r*.17,0,6.28);c.fillStyle="rgba(255,255,255,.35)";c.fill();
// Text
const lh=b.fs*1.4,totalH=b.lines.length*lh;let sy=b.y-totalH/2+lh*.5;
c.font=`600 ${b.fs}px 'Nunito',sans-serif`;c.fillStyle="rgba(255,255,255,.85)";c.textAlign="center";c.textBaseline="middle";c.shadowBlur=0;
b.lines.forEach((l,li)=>{c.fillText(l,bx,sy+li*lh)});c.restore()})}

// --- Submarine ---
function initSubmarine(){submarine={x:-200,y:ch-75,spd:0.35+Math.random()*0.15,dir:1}}
function drawSubmarine(c){const s=submarine;s.x+=s.spd*s.dir;
if(s.x>cw+220){s.x=-220;s.y=ch-65-Math.random()*30;s.spd=0.3+Math.random()*0.2}
c.save();c.translate(s.x,s.y);
// Body
c.fillStyle="#FFD700";c.beginPath();c.ellipse(0,0,55,22,0,0,6.28);c.fill();
c.strokeStyle="#DAA520";c.lineWidth=2;c.stroke();
// Window with child emoji
c.fillStyle="#87CEEB";c.beginPath();c.arc(18,0,12,0,6.28);c.fill();c.strokeStyle="#DAA520";c.lineWidth=1.5;c.stroke();
c.font="14px serif";c.textAlign="center";c.textBaseline="middle";c.fillText("👶",18,0);
// Periscope
c.fillStyle="#DAA520";c.fillRect(-5,-22,4,12);c.fillRect(-8,-24,10,4);
// Propeller
const pa=t*8;c.save();c.translate(-55,0);c.rotate(pa);
c.fillStyle="#B8860B";c.fillRect(-2,-10,4,20);c.fillRect(-10,-2,20,4);c.restore();
// Bubbles trail
for(let i=0;i<3;i++){c.globalAlpha=0.2-i*0.05;c.beginPath();c.arc(-65-i*12,-8+Math.sin(t*3+i)*4,3-i*0.5,0,6.28);
c.strokeStyle="rgba(135,206,235,0.6)";c.lineWidth=0.8;c.stroke()}
c.restore()}

// --- Diver ---
function initDiver(){diver={x:cw+80,y:ch-110,spd:0.25+Math.random()*0.1,dir:-1,wo:Math.random()*6.28}}
function drawDiver(c){const d=diver;d.x+=d.spd*d.dir;d.wo+=0.02;
const dy=d.y+Math.sin(d.wo)*8;
if(d.x<-80){d.x=cw+80;d.y=ch-100-Math.random()*40;d.spd=0.2+Math.random()*0.15}
c.save();c.translate(d.x,dy);c.scale(d.dir,1);
c.font="30px serif";c.textAlign="center";c.textBaseline="middle";c.fillText("🤿",0,0);
// Bubbles from diver
c.globalAlpha=0.25;
for(let i=0;i<2;i++){c.beginPath();c.arc(10+i*8,-18+Math.sin(t*2+i)*5,2.5-i*0.5,0,6.28);
c.strokeStyle="rgba(200,230,255,0.6)";c.lineWidth=0.7;c.stroke()}
c.restore()}

// --- Ships on surface ---
function initShips(){ships=[];
const types=["⛵","🚢","⛵"];
for(let i=0;i<3;i++){const r=Math.random()>0.5;
ships.push({x:r?-60:cw+60,y:SURFACE_Y-8,spd:0.2+Math.random()*0.3,dir:r?1:-1,e:types[i],sz:22+Math.random()*10,
wo:Math.random()*6.28,delay:i*180})}}
function drawShips(c){ships.forEach((s,i)=>{if(s.delay>0){s.delay--;return}
s.x+=s.spd*s.dir;s.wo+=0.012;const sy=s.y+Math.sin(s.wo)*2;
if((s.dir>0&&s.x>cw+80)||(s.dir<0&&s.x<-80)){s.dir*=-1;s.x=s.dir>0?-70:cw+70;s.spd=0.15+Math.random()*0.3}
c.save();c.translate(s.x,sy);if(s.dir<0)c.scale(-1,1);c.font=s.sz+"px serif";c.textAlign="center";c.textBaseline="middle";c.fillText(s.e,0,0);
// Wake trail
c.globalAlpha=0.1;c.beginPath();c.moveTo(-s.sz*.6,4);c.lineTo(-s.sz*1.8,6);c.lineTo(-s.sz*.6,8);c.strokeStyle="#fff";c.lineWidth=1;c.stroke();
c.restore()})}

// --- Birds ---
function initBirds(){birds=[];
for(let i=0;i<5;i++){const r=Math.random()>0.5;const onWater=i<2;
birds.push({x:r?-40:cw+40,y:onWater?SURFACE_Y-14:5+Math.random()*25,spd:onWater?0.1+Math.random()*0.15:0.5+Math.random()*0.5,
dir:r?1:-1,onWater,wo:Math.random()*6.28,flapPhase:Math.random()*6.28})}}
function drawBirds(c){birds.forEach((b,i)=>{b.x+=b.spd*b.dir;b.wo+=0.015;b.flapPhase+=0.08;
if((b.dir>0&&b.x>cw+50)||(b.dir<0&&b.x<-50)){b.dir*=-1;b.x=b.dir>0?-40:cw+40;if(!b.onWater)b.y=3+Math.random()*20}
c.save();const by=b.onWater?b.y+Math.sin(b.wo)*1.5:b.y+Math.sin(b.wo)*3;
c.translate(b.x,by);if(b.dir<0)c.scale(-1,1);
if(b.onWater){// Sitting bird
c.font="14px serif";c.textAlign="center";c.textBaseline="middle";c.fillText("🐦",0,0);
}else{// Flying bird — draw simple V shape
const flap=Math.sin(b.flapPhase)*4;
c.strokeStyle="rgba(50,50,50,0.6)";c.lineWidth=1.5;c.lineCap="round";
c.beginPath();c.moveTo(-8,flap);c.quadraticCurveTo(-3,-2+flap*0.3,0,0);c.quadraticCurveTo(3,-2+flap*0.3,8,flap);c.stroke()}
c.restore()})}

// --- Ocean BG ---
function drawBG(c){
// Sky
const sg=c.createLinearGradient(0,0,0,SURFACE_Y);sg.addColorStop(0,"#6EC6FF");sg.addColorStop(1,"#B0E0FF");c.fillStyle=sg;c.fillRect(0,0,cw,SURFACE_Y);
// Sun
c.save();c.globalAlpha=0.7;c.font="26px serif";c.fillText("☀️",cw-50,22);c.restore();
// Clouds
c.save();c.globalAlpha=0.4;c.font="18px serif";
c.fillText("☁️",cw*0.15+Math.sin(t*0.1)*10,16);c.fillText("☁️",cw*0.5+Math.sin(t*0.08+1)*8,12);c.fillText("☁️",cw*0.78+Math.sin(t*0.12+2)*6,18);c.restore();
// Wave surface
c.beginPath();c.moveTo(0,SURFACE_Y);
for(let x=0;x<=cw;x+=5){c.lineTo(x,SURFACE_Y+Math.sin(x*.025+t*.8)*3+Math.sin(x*.05+t*.5)*1.5)}
c.lineTo(cw,ch);c.lineTo(0,ch);c.closePath();
const wg=c.createLinearGradient(0,SURFACE_Y,0,ch);wg.addColorStop(0,"#0077B6");wg.addColorStop(.3,"#023E8A");wg.addColorStop(.65,"#03045E");wg.addColorStop(1,"#020024");
c.fillStyle=wg;c.fill();
// Light rays
c.save();c.globalAlpha=.04;for(let i=0;i<5;i++){const rx=cw*(.12+i*.19),sw=Math.sin(t*.25+i*.8)*16;
c.beginPath();c.moveTo(rx-10+sw*.4,SURFACE_Y);c.lineTo(rx-35+sw,ch*.7);c.lineTo(rx+35+sw,ch*.7);c.lineTo(rx+10+sw*.4,SURFACE_Y);c.closePath();c.fillStyle="#ADD8E6";c.fill()}c.restore();
// Floor
const fy=ch-28;const fg=c.createLinearGradient(0,fy,0,ch);fg.addColorStop(0,"rgba(194,178,128,.2)");fg.addColorStop(1,"rgba(120,100,60,.35)");
c.fillStyle=fg;c.beginPath();c.moveTo(0,fy);for(let x=0;x<=cw;x+=25){c.lineTo(x,fy+Math.sin(x*.04+t*.4)*3.5)}c.lineTo(cw,ch);c.lineTo(0,ch);c.closePath();c.fill();
// Seaweed
for(let i=0;i<9;i++){const sx=cw*.06+i*(cw*.1),sh=30+(i%3)*10,sw=Math.sin(t*.7+i*1.1)*9;
c.save();c.beginPath();c.moveTo(sx,fy+2);c.quadraticCurveTo(sx+sw,fy+2-sh*.55,sx+sw*.5,fy+2-sh);
c.strokeStyle=`rgba(34,139,34,${.13+Math.sin(t*.5+i)*.03})`;c.lineWidth=2.5;c.lineCap="round";c.stroke();c.restore()}
// Coral
c.save();c.font="14px serif";c.textAlign="center";c.textBaseline="bottom";
const corals=[[cw*.08,"🪸"],[cw*.3,"🪨"],[cw*.52,"🪸"],[cw*.7,"🪨"],[cw*.88,"🪸"]];
corals.forEach(([x,e])=>{c.fillText(e,x,fy+12)});c.restore()}

// --- Main Loop ---
function loop(){ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,cw,ch);
drawBG(ctx);drawAmb(ctx);drawFish(ctx);drawSubmarine(ctx);drawDiver(ctx);drawWishBub(ctx);drawSnails(ctx);drawShips(ctx);drawBirds(ctx);
if(!snails.length){ctx.save();ctx.font="600 13px 'Nunito',sans-serif";ctx.fillStyle="rgba(255,255,255,.3)";ctx.textAlign="center";
ctx.fillText("🐚 Belum ada ucapan",cw/2,ch/2);ctx.restore()}
t+=0.016;af=requestAnimationFrame(loop)}

function initAdmin(){resize();initFish();initAmb();initSubmarine();initDiver();initShips();initBirds();syncSnails();refreshAll();loop();setInterval(refreshAll,6000)}
window.addEventListener("resize",()=>{if(adminDashboard.style.display!=="none"){cancelAnimationFrame(af);resize();initFish();initAmb();initShips();initBirds();syncSnails();loop()}});
})();
