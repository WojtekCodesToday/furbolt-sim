(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))g(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const u of r.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&g(u)}).observe(document,{childList:!0,subtree:!0});function d(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerPolicy&&(r.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?r.credentials="include":t.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function g(t){if(t.ep)return;t.ep=!0;const r=d(t);fetch(t.href,r)}})();document.title="Furbolt Simulator";const h=o=>{let i=new Image;return i.src=o,i},m={sprite:"./sprites/furbolt/",favIcon:"favicon.png",warn:"./sprites/objects/warning.png",map:"./sprites/map/main.png",loadingText:"./sprites/text/loading.png",cafeImg:"./sprites/buildings/cafe.png"},a={furboltWidth:100,furboltHeight:100,speed:200,sprintSpeedMultiplier:4,normalSpeedMultiplier:2,savingProgressTimeoutDuration:2e4},n=document.createElement("canvas");n.id="game";const s=n.getContext("2d");s.font="50px serif";const x=h(m.loadingText);x.onload=()=>{s.drawImage(x,n.width-x.width/2,n.height-x.height/2)};let e={x:0,y:0,image:new Image,state:"idle",sprinting:!1},l={},L=performance.now();const k=()=>window.requestAnimationFrame(W);e.image.src=m.sprite+"idle.png";const p=h(m.map);p.onload=()=>{e.x=(n.width-a.furboltWidth)/2,e.y=(n.height-a.furboltHeight)/2,k()};document.addEventListener("keydown",o=>{l[o.key]=!0,o.key==="z"&&(e.sprinting=!0),e.state=l.w||l.s||l.a||l.d?"move":"idle",e.image=h(m.sprite+(e.sprinting?"sprint.png":"move.png"))});document.addEventListener("keyup",o=>{delete l[o.key],Object.keys(l).length===0?(e.state="idle",e.sprinting=!1,e.image=h(m.sprite+"idle.png")):(e.state="move",e.image=h(m.sprite+(e.sprinting?"sprint.png":"move.png")))});const q=o=>{const i=document.createElement("canvas");i.width=o.width,i.height=o.height;const d=i.getContext("2d");return d.translate(i.width,0),d.scale(-1,1),d.drawImage(o,0,0),i};let S=!1;document.addEventListener("visibilitychange",()=>{S=document.hidden});const W=()=>{if(S){window.requestAnimationFrame(W);return}const o=performance.now(),i=(o-L)/1e3;L=o,s.clearRect(0,0,n.width,n.height),n.width=window.innerWidth,n.height=window.innerHeight;const d=p.width/5,g=p.height/5;for(let f=0;f<5;f++)for(let w=0;w<5;w++){const H=f*d,O=w*g,T=d,X=g,Y=n.width/2-p.width/2+f*d-e.x,C=n.height/2-p.height/2+w*g-e.y,M=d,j=g;s.drawImage(p,H,O,T,X,Y,C,M,j)}const t=a.speed,r=e.sprinting?a.sprintSpeedMultiplier:a.normalSpeedMultiplier,u=e.x,E=e.y;l.w&&(e.y-=r*t*i),l.s&&(e.y+=r*t*i),l.a&&(e.x-=r*t*i),l.d&&(e.x+=r*t*i);const y=(n.width-a.furboltWidth)/2,b=(n.height-a.furboltHeight)/2,I=n.width/2-e.x,v=n.height/2-e.y;let P=1219.47,F=829.92,c=h(m.cafeImg);try{const f=h(m.cafeImg.replace(".png","-hitbox.png"));s.drawImage(f,I-P,v-F),s.getImageData(y,b,a.furboltWidth,a.furboltHeight).data.some((H,O)=>O%4===0&&H===255)&&(e.x=u,e.y=E)}catch(f){console.error("Error checking collision with cafe hitbox:",f)}s.drawImage(c,0,c.height/2,c.width,c.height/2,I-1219.47,v-829.92+c.height/2,c.width,c.height/2),A(h(m.warn),94.3,353.94);try{e.state==="idle"?s.drawImage(e.image,y,b,a.furboltWidth,a.furboltHeight):e.state==="move"&&(l.a?s.drawImage(q(e.image),y,b,a.furboltWidth,a.furboltHeight):s.drawImage(e.image,y,b,a.furboltWidth,a.furboltHeight))}catch{}s.drawImage(c,0,0,c.width,c.height/2,I-1219.47,v-829.92,c.width,c.height/2),s.fillText(e.x+" - "+e.y,10,10),window.requestAnimationFrame(W)},A=(o,i,d)=>{const g=n.width/2-e.x,t=n.height/2-e.y;s.save();try{s.drawImage(h(o.replace(".png","-hitbox.png")),g-i,t-d)}catch{}s.restore();try{s.drawImage(h(o),g-i,t-d)}catch{}};e.x=0;e.y=0;document.body.appendChild(n);
