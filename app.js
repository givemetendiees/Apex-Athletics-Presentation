const sections=[...document.querySelectorAll('.slide')];
const names = sections.map(section => section.dataset.slideTitle || section.querySelector("h1, h2")?.textContent.trim() || "Section");
const menu=document.getElementById('sections-menu'),toggle=document.getElementById('sections-toggle');
const links=sections.map((section,index)=>{const link=document.createElement('a');link.href='#'+section.id;const number=document.createElement('span');number.textContent=String(index+1).padStart(2,'0');link.append(number,document.createTextNode(names[index]));link.addEventListener('click',()=>{setMenu(false);section.querySelector('h1,h2').setAttribute('tabindex','-1');section.querySelector('h1,h2').focus({preventScroll:true});update(index);});document.getElementById('section-links').append(link);return link;});
const extra=document.createElement('a');extra.href=document.title.includes('Evidence')?'index.html':'evidence.html';extra.textContent=document.title.includes('Evidence')?'← Main presentation':'Q&A Evidence Center ↗';document.getElementById('section-links').append(extra);
function setMenu(open){menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open));}
toggle.addEventListener('click',()=>setMenu(menu.hidden));
document.addEventListener('click',event=>{if(!event.target.closest('.section-picker'))setMenu(false);});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!menu.hidden){setMenu(false);toggle.focus();}});
document.addEventListener('focusin',event=>{if(!event.target.closest('.section-picker'))setMenu(false);});
let current=0;
const previous=document.getElementById('previous'),next=document.getElementById('next');
function update(index){current=index;document.getElementById('position').textContent=`${String(index+1).padStart(2,'0')} / ${String(sections.length).padStart(2,'0')}`;document.getElementById('section-label').textContent=names[index];previous.disabled=index===0;next.disabled=index===sections.length-1;links.forEach((link,i)=>{if(i===index)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}
function move(step){const target=Math.max(0,Math.min(sections.length-1,current+step));sections[target].scrollIntoView({block:'start'});update(target);}
previous.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
document.addEventListener('keydown',event=>{if(event.altKey||event.ctrlKey||event.metaKey||/INPUT|TEXTAREA|SELECT/.test(event.target.tagName))return;if(event.key==='ArrowRight'){event.preventDefault();move(1);}if(event.key==='ArrowLeft'){event.preventDefault();move(-1);}});
let scheduled=false;window.addEventListener('scroll',()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{let nearest=0,distance=Infinity;sections.forEach((section,index)=>{const d=Math.abs(section.getBoundingClientRect().top-document.querySelector('.topbar').offsetHeight);if(d<distance){distance=d;nearest=index;}});update(nearest);scheduled=false;});},{passive:true});
const full=document.querySelector('.fullscreen');if(!document.fullscreenEnabled)full.hidden=true;
full.addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{full.textContent='Full screen unavailable';}});
document.addEventListener('fullscreenchange',()=>{full.textContent=document.fullscreenElement?'Exit full screen ⛶':'Full screen ⛶';});const initialSection = sections.findIndex(section => "#" + section.id === window.location.hash);
update(Math.max(0, initialSection));
