import './style.css';

const services = {
  static: { title: 'Static Security Guards', description: 'A consistent, visible presence can help deter unauthorised access while making visitors and staff feel supported. Static guarding is about knowing the site, understanding the brief and paying attention to what changes.', points: ['Entry and exit procedures suited to your site', 'Visitor guidance and access control requirements', 'Observation, incident reporting and escalation', 'Guarding hours, post instructions and handovers'] },
  construction: { title: 'Construction Site Security', description: 'Construction sites change daily. Security planning should consider the stage of the build, the movement of contractors and deliveries, and the equipment left behind when work stops.', points: ['Site entrances, perimeter and vulnerable access points', 'Equipment, materials and storage areas', 'Contractor and delivery access arrangements', 'After-hours guarding and incident communication'] },
  warehouse: { title: 'Warehouse & Industrial Security', description: 'Busy facilities need security that fits around operations. A considered guarding plan takes account of staff movements, goods, vehicles and sensitive areas without losing sight of the people working there.', points: ['Staff, contractor and visitor access', 'Loading areas, vehicle movement and perimeter awareness', 'Restricted areas and site-specific instructions', 'Shift patterns, operating hours and reporting'] },
  event: { title: 'Event Security & Crowd Control', description: 'A safe, well-managed environment helps guests focus on the occasion. Event security planning begins with the venue, expected attendance and how people arrive, move and leave.', points: ['Entry points and guest access arrangements', 'Crowd flow and areas requiring attention', 'Coordination with venue staff and event organisers', 'Event timings, responsibilities and escalation plans'] },
  residential: { title: 'Residential Complex & Retirement Village Security', description: 'Communities need an approach that balances security with comfort and dignity. A respectful, approachable presence helps residents and visitors navigate shared spaces with greater confidence.', points: ['Community entrances and visitor arrangements', 'Shared spaces and perimeter considerations', 'Respectful interaction with residents and visitors', 'Agreed hours and communication with site management'] },
  afterhours: { title: 'After-Hours Security Services', description: 'Quiet hours can bring a different set of security concerns. Discuss an after-hours arrangement that reflects your premises, access requirements and the times when you need a visible presence.', points: ['Evening, overnight and weekend requirements', 'Vulnerable areas and site access points', 'Agreed observation and reporting procedures', 'Handover instructions and escalation contacts'] },
  mobile: {"title": "Mobile Patrols", "description": "A visible patrol presence can support premises that do not need a permanent security post. Discuss your site, preferred visit times and what officers should observe, record and escalate.", "points": ["Premises, access points and external areas", "Preferred patrol windows and visit frequency", "Agreed observations, reporting and escalation", "Access instructions and coordination with management"]},
  alarm: {"title": "Alarm Services", "description": "Alarm arrangements work best when responsibilities are clear. Discuss your existing system, who receives alerts and how a suitable response or escalation arrangement could fit your premises.", "points": ["Your existing alarm system and service provider", "Authorised access and nominated contacts", "Agreed alarm response and escalation requirements", "Scope, availability and provider responsibilities"]},
  campus: {"title": "Campus Security", "description": "Education environments bring students, staff and visitors together throughout the day. Campus security planning should support a welcoming setting while considering access, shared facilities and after-hours activity.", "points": ["Campus entrances, visitor access and shared spaces", "Timetables, events and after-hours requirements", "Respectful interaction with students and staff", "Coordination with campus management and reporting"]},
  healthcare: {"title": "Healthcare Security", "description": "Healthcare settings need a respectful, attentive approach to security. Planning should consider visitor movement, staff access, sensitive areas and clear coordination with the people managing the facility.", "points": ["Visitor guidance and staff access requirements", "Privacy, dignity and sensitive shared areas", "Agreed escalation and incident communication", "Site instructions and coordination with facility management"]},
};

const header = document.querySelector('.site-header');
let headerFrame = false;
function updateHeader() { header.classList.toggle('scrolled', window.scrollY > 60); headerFrame = false; }
window.addEventListener('scroll', () => { if (!headerFrame) { headerFrame = true; requestAnimationFrame(updateHeader); } }, { passive: true });
updateHeader();
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  mobileNav.classList.remove('open');
  mobileNav.inert = true;
  document.body.classList.remove('menu-open');
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  mobileNav.classList.toggle('open', open);
  mobileNav.inert = !open;
  document.body.classList.toggle('menu-open', open);
  menuToggle.focus({ preventScroll: true });
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') { closeMenu(); menuToggle.focus(); }
  if (event.key === 'Tab' && menuToggle.getAttribute('aria-expanded') === 'true') {
    const items = [menuToggle, ...mobileNav.querySelectorAll('a')];
    const first = items[0], last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
matchMedia('(min-width: 701px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

const dialogs = [...document.querySelectorAll('dialog')];
function openDialog(dialog) { dialog.showModal(); document.body.classList.add('modal-open'); }
dialogs.forEach(dialog => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { if (!dialogs.some(d => d.open)) document.body.classList.remove('modal-open'); });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
});

const form = document.getElementById('brief-form');
let currentBrief = '';
form?.addEventListener('submit', event => {
  event.preventDefault();
  for (const input of form.querySelectorAll('[required]')) {
    input.setCustomValidity(input.value.trim() ? '' : 'Please enter a value.');
    if (!input.reportValidity()) return;
  }
  const data = new FormData(form);
  currentBrief = ['HORIZON RESPONSE SERVICES — SECURITY BRIEF', '', `Name: ${data.get('name').trim()}`, `Email: ${data.get('email').trim()}`, `Organisation: ${data.get('company').trim() || 'Not provided'}`, `Phone: ${data.get('phone').trim()}`, `Location: ${data.get('location').trim()}`, `Service: ${data.get('service')}`, '', 'Requirements:', data.get('message').trim(), '', 'Prepared in the Horizon Response website brief builder. No enquiry has been sent.'].join('\n');
  document.getElementById('brief-preview').textContent = currentBrief;
  document.querySelector('.copy-status').textContent = '';
  openDialog(document.getElementById('brief-dialog'));
});
form?.querySelectorAll('[required]').forEach(input => input.addEventListener('input', () => input.setCustomValidity('')));
const heroLeadForm = document.getElementById('hero-lead-form');
heroLeadForm?.addEventListener('submit', event => {
  event.preventDefault();
  for (const field of heroLeadForm.querySelectorAll('[required]')) {
    field.setCustomValidity(field.value.trim() ? '' : 'Please enter a value.');
    if (!field.reportValidity()) return;
  }
  const data = new FormData(heroLeadForm);
  document.getElementById('name').value = data.get('name').trim();
  document.getElementById('email').value = data.get('email').trim();
  document.getElementById('phone').value = data.get('phone').trim();
  document.getElementById('service').value = data.get('service');
  document.getElementById('contact').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  document.getElementById('location').focus({ preventScroll: true });
});
heroLeadForm?.querySelectorAll('[required]').forEach(field => field.addEventListener('input', () => field.setCustomValidity('')));

document.getElementById('download-brief').addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob([currentBrief], {type: 'text/plain;charset=utf-8'}));
  const link = document.createElement('a'); link.href = url; link.download = 'horizon-response-security-brief.txt';
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.querySelector('.copy-status').textContent = 'Your brief has been prepared for download.';
});
document.getElementById('copy-brief').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(currentBrief); document.querySelector('.copy-status').textContent = 'Brief copied. Ready to share.'; }
  catch { document.querySelector('.copy-status').textContent = 'Clipboard unavailable. Please download your brief instead.'; }
});
document.getElementById('privacy-button').addEventListener('click', () => openDialog(document.getElementById('privacy-dialog')));
document.getElementById('year').textContent = new Date().getFullYear();

document.querySelectorAll('.page-hero h1, .contact-intro-note, .contact-intro-bottom, .contact-copy>h2, .contact-copy>p, .contact-checklist article, .values-grid article, .about-story>div, .sector-grid>a').forEach(element => element.classList.add('reveal'));

if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('js-motion');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}

// The gallery uses native scrolling, so all services remain reachable by touch and keyboard.
const serviceGallery = document.querySelector('.service-grid');
if (serviceGallery) {
const galleryCards = [...serviceGallery.querySelectorAll('.service-card')];
const galleryTabs = [...document.querySelectorAll('[data-service-slide]')];
// Split the catalogue evenly between two rows, so both rows end together.
const cardsPerRow = Math.ceil(galleryCards.length / 2);
galleryCards.forEach((card, i) => {
  card.style.gridColumn = String(i % cardsPerRow + 1);
  card.style.gridRow = String(Math.floor(i / cardsPerRow) + 1);
});
let galleryIndex = 0;
let galleryManualScroll = false;
function updateGallery(index) {
  galleryIndex = Math.max(0, Math.min(galleryCards.length - 1, index));
  galleryTabs.forEach(tab => tab.setAttribute('aria-pressed', String(tab.dataset.serviceMembers.split(',').map(Number).includes(galleryIndex))));
  galleryCards.forEach((card, i) => card.classList.toggle('is-current', i === galleryIndex));
  document.getElementById('service-current').textContent = String(galleryIndex + 1).padStart(2, '0');
  document.querySelector('.service-progress>span').style.width = `${(galleryIndex + 1) / galleryCards.length * 100}%`;
}
function showService(index) {
  galleryManualScroll = false;
  updateGallery(index);
  serviceGallery.scrollTo({ left: galleryCards[galleryIndex].offsetLeft - galleryCards[0].offsetLeft, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}
galleryTabs.forEach(tab => tab.addEventListener('click', () => showService(Number(tab.dataset.serviceSlide))));
document.getElementById('service-prev').addEventListener('click', () => showService((galleryIndex + galleryCards.length - 1) % galleryCards.length));
document.getElementById('service-next').addEventListener('click', () => showService((galleryIndex + 1) % galleryCards.length));
for (const event of ['pointerdown', 'wheel', 'keydown']) serviceGallery.addEventListener(event, () => { galleryManualScroll = true; }, { passive: true });
serviceGallery.addEventListener('scroll', () => {
  if (!galleryManualScroll) return;
  const origin = galleryCards[0].offsetLeft;
  let nearest = 0, distance = Infinity;
  galleryCards.forEach((card, i) => {
    const gap = Math.abs(card.offsetLeft - origin - serviceGallery.scrollLeft);
    if (gap < distance) { distance = gap; nearest = i; }
  });
  updateGallery(nearest);
}, { passive: true });

}

// Contact links from service dialogs preselect the chosen requirement.
if (form) {
  const requested = new URLSearchParams(location.search).get('service');
  const choice = form.elements.namedItem('service');
  if ([...choice.options].some(option => option.value === requested)) choice.value = requested;
}
const heroStage = document.querySelector('.hero-stage');
if (heroStage) {
  const slides = [
    { image: '/images/security-black-uniform-hero.webp', alt: 'Two professional security officers at a landscaped modern commercial entrance', title: 'Trusted Security Provider for Businesses in Brisbane, Gold Coast, Logan, and Ipswich', copy: 'Professional security guards, mobile patrols and specialist services, shaped around your people, property and operating hours.', signature: 'YOUR BUSINESS. YOUR PEOPLE. OUR FOCUS.' },
    { image: '/images/security-black-uniform-event.webp', alt: 'Security officer overseeing an outdoor event in daylight', title: 'Professional Security for Your Events and Communities', copy: 'From events and crowd control to residential, campus and healthcare security, plan an approachable presence for the places that matter.', signature: 'EVENT SECURITY. A WELCOMING PRESENCE.' }
  ];
  let active = 0;
  let heroChanging = false;
  let paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pause = document.createElement('button');
  pause.id = 'hero-pause'; pause.type = 'button';
  function syncPause() { pause.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow'); pause.setAttribute('aria-pressed', String(paused)); pause.textContent = paused ? '▶' : 'Ⅱ'; }
  syncPause();
  document.querySelector('.hero-slider-controls').append(pause);
  pause.addEventListener('click', () => { paused = !paused; syncPause(); });
  const preload = new Image(); preload.src = slides[1].image;
  async function showHero(index) {
    if (heroChanging) return;
    heroChanging = true;
    active = (index + slides.length) % slides.length;
    const slide = slides[active], image = heroStage.querySelector('.hero-photo');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const controls = [document.getElementById('hero-prev'), document.getElementById('hero-next')];
    const updateCopy = () => {
      heroStage.querySelector('h1').innerHTML = slide.title;
      heroStage.querySelector('.hero-inner>p').textContent = slide.copy;
      heroStage.querySelector('.hero-signature').textContent = slide.signature;
      document.getElementById('hero-slide-count').textContent = `${String(active + 1).padStart(2, '0')} / 02`;
    };
    if (reduced) { image.src = slide.image; image.alt = slide.alt; updateCopy(); heroChanging = false; return; }
    controls.forEach(button => { button.disabled = true; });
    const incoming = image.cloneNode();
    incoming.removeAttribute('fetchpriority'); incoming.classList.add('hero-photo-incoming');
    incoming.src = slide.image; incoming.alt = slide.alt; incoming.style.opacity = '0';
    try {
      await incoming.decode();
      heroStage.append(incoming);
      const text = heroStage.querySelector('.hero-inner');
      const fadeText = text.animate([{opacity:1, transform:'translateY(0)'},{opacity:0, transform:'translateY(-7px)'}],{duration:220,easing:'ease-in',fill:'forwards'});
      const fadeImage = incoming.animate([{opacity:0, transform:'scale(1.025)'},{opacity:1, transform:'scale(1)'}],{duration:1050,easing:'cubic-bezier(.2,.65,.25,1)',fill:'forwards'});
      await fadeText.finished; updateCopy(); fadeText.cancel();
      text.animate([{opacity:0, transform:'translateY(10px)'},{opacity:1, transform:'translateY(0)'}],{duration:600,easing:'cubic-bezier(.2,.65,.25,1)'});
      await fadeImage.finished;
      image.src = slide.image; image.alt = slide.alt;
      await image.decode();
    } catch { image.src = slide.image; image.alt = slide.alt; updateCopy(); }
    finally { incoming.remove(); controls.forEach(button => { button.disabled = false; }); heroChanging = false; }
  }
  setInterval(() => {
    if (!paused && !document.hidden && !document.querySelector('.site-header.mega-open, .site-header.call-open') && !document.body.classList.contains('menu-open') && !heroStage.closest('.immersive-hero').matches(':hover, :focus-within') && heroStage.getBoundingClientRect().bottom > 0 && !document.querySelector('dialog[open]')) showHero(active + 1);
  }, 8500);
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', event => { if(event.matches) { paused = true; syncPause(); } });
  document.getElementById('hero-prev').addEventListener('click', () => showHero(active - 1));
  document.getElementById('hero-next').addEventListener('click', () => showHero(active + 1));
  let touchStart = 0;
  heroStage.addEventListener('touchstart', event => { touchStart = event.changedTouches[0].clientX; }, { passive: true });
  heroStage.addEventListener('touchend', event => { const delta = event.changedTouches[0].clientX - touchStart; if (Math.abs(delta) > 70) showHero(active + (delta < 0 ? 1 : -1)); }, { passive: true });
}

// Shared services disclosure: mouse, keyboard and mobile support without menu-role restrictions.
const megaPanel = document.getElementById('services-mega');
const megaTriggers = [...document.querySelectorAll('.mega-trigger')];
let lastMegaTrigger = megaTriggers[0];
let megaHoverOpenTimer, megaHoverCloseTimer;
function closeMega(restoreFocus = false) {
  clearTimeout(megaHoverOpenTimer); clearTimeout(megaHoverCloseTimer);
  header.classList.remove('mega-open'); megaPanel.inert = true;
  megaTriggers.forEach(trigger => trigger.setAttribute('aria-expanded', 'false'));
  if (restoreFocus) lastMegaTrigger.focus({preventScroll:true});
}
function openMega(trigger) {
  clearTimeout(megaHoverOpenTimer); clearTimeout(megaHoverCloseTimer);
  lastMegaTrigger = trigger; header.classList.add('mega-open'); megaPanel.inert = false;
  megaTriggers.forEach(item => item.setAttribute('aria-expanded', 'true'));
}
megaTriggers.forEach(trigger => {
  trigger.addEventListener('click', () => header.classList.contains('mega-open') ? closeMega() : openMega(trigger));
  trigger.addEventListener('keydown', event => { if(event.key === 'ArrowDown') { event.preventDefault(); openMega(trigger); megaPanel.querySelector('a,button').focus(); } });
});
document.querySelector('.mega-close').addEventListener('click', () => closeMega(true));
document.querySelector('.mega-backdrop').addEventListener('click', () => closeMega());
megaPanel.querySelectorAll('a').forEach(item => item.addEventListener('click', () => { closeMega(); closeMenu(); }));
document.addEventListener('keydown', event => {
  if (!header.classList.contains('mega-open')) return;
  if(event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); closeMega(true); return; }
  if(event.key === 'Tab') {
    const items=[lastMegaTrigger,...megaPanel.querySelectorAll('a,button')];
    const first=items[0],last=items.at(-1);
    if(!event.shiftKey && document.activeElement===first) { event.preventDefault(); items[1].focus(); return; }
    if(event.shiftKey && document.activeElement===first) { event.preventDefault(); last.focus(); }
    else if(!event.shiftKey && document.activeElement===last) { event.preventDefault(); first.focus(); }
  }
}, true);
document.addEventListener('pointerdown', event => { if(header.classList.contains('mega-open') && !header.contains(event.target)) closeMega(); });
matchMedia('(min-width:701px)').addEventListener('change', () => closeMega());

// Keep the hero copy aligned with the enquiry form at every desktop breakpoint.
if (heroLeadForm) {
  const alignHero = () => document.querySelector('.immersive-hero').style.setProperty('--hero-form-height', `${heroLeadForm.getBoundingClientRect().height}px`);
  alignHero();
  if ('ResizeObserver' in window) new ResizeObserver(alignHero).observe(heroLeadForm);
}

// Fine-pointer hover intent: a short entrance delay and a forgiving bridge to the panel.
const canHoverMega = () => matchMedia('(hover: hover) and (min-width: 701px)').matches;
const scheduleMegaClose = () => {
  clearTimeout(megaHoverOpenTimer); clearTimeout(megaHoverCloseTimer);
  megaHoverCloseTimer = setTimeout(() => { if (!megaPanel.matches(':focus-within')) closeMega(); }, 260);
};
megaTriggers.forEach(trigger => {
  trigger.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'mouse' || !canHoverMega()) return;
    clearTimeout(megaHoverCloseTimer); clearTimeout(megaHoverOpenTimer);
    megaHoverOpenTimer = setTimeout(() => openMega(trigger), 140);
  });
  trigger.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse' && canHoverMega()) scheduleMegaClose(); });
});
megaPanel.addEventListener('pointerenter', () => { clearTimeout(megaHoverOpenTimer); clearTimeout(megaHoverCloseTimer); });
megaPanel.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse' && canHoverMega()) scheduleMegaClose(); });

const dayTabs = [...document.querySelectorAll('.day-tabs [role=tab]')];
function chooseDay(index, focus = false) {
  dayTabs.forEach((tab, i) => {
    tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1;
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    panel.hidden = i !== index;
    if (i === index && !matchMedia('(prefers-reduced-motion: reduce)').matches) panel.animate([{opacity:0,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}], {duration:450,easing:'cubic-bezier(.2,.7,.2,1)'});
  });
  if(focus) dayTabs[index].focus();
}
dayTabs.forEach((tab,i) => {
  tab.addEventListener('click', () => chooseDay(i));
  tab.addEventListener('keydown', event => {
    let index;
    if(event.key === 'ArrowRight') index = (i + 1) % dayTabs.length;
    if(event.key === 'ArrowLeft') index = (i + dayTabs.length - 1) % dayTabs.length;
    if(event.key === 'Home') index = 0;
    if(event.key === 'End') index = dayTabs.length - 1;
    if(index !== undefined) {event.preventDefault();chooseDay(index,true);}
  });
});

// Editorial testimonial carousel. Sample status stays visible for every slide.
const testimonialSection = document.querySelector('.testimonial-section');
if(testimonialSection) {
  const slides = [...testimonialSection.querySelectorAll('[data-testimonial-slide]')];
  const categories = [...testimonialSection.querySelectorAll('[data-testimonial-index]')];
  const prev = document.getElementById('testimonial-prev'), next = document.getElementById('testimonial-next');
  const pause = document.getElementById('testimonial-pause');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0, moving = false, paused = reduced.matches;
  function syncTestimonialPause() {
    pause.setAttribute('aria-pressed',String(paused));
    pause.setAttribute('aria-label',paused?'Play testimonial slideshow':'Pause testimonial slideshow');
    pause.innerHTML=paused?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 11 7-11 7V5Z"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6v12M16 6v12"/></svg>';
  }
  syncTestimonialPause();
  async function showTestimonial(index, announce = false) {
    const target = (index + slides.length) % slides.length;
    if(moving || target === active) return;
    moving = true; prev.disabled = true; next.disabled = true;
    try {
      if(!reduced.matches) await slides[active].animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-7px)'}],{duration:180,easing:'ease-in'}).finished;
      slides[active].hidden = true; active = target; slides[active].hidden = false;
      categories.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===active)));
      document.getElementById('testimonial-current').textContent=String(active+1).padStart(2,'0');
      testimonialSection.querySelector('.testimonial-progress>span').style.width=`${(active+1)/slides.length*100}%`;
      if(announce) testimonialSection.querySelector('.testimonial-status').textContent=`Sample perspective ${active+1} of ${slides.length}. ${slides[active].querySelector('strong').textContent}.`;
      if(!reduced.matches) await slides[active].animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:600,easing:'cubic-bezier(.2,.7,.2,1)'}).finished;
    } finally {moving=false;prev.disabled=false;next.disabled=false;}
  }
  categories.forEach((button,i)=>button.addEventListener('click',()=>showTestimonial(i,true)));
  prev.addEventListener('click',()=>showTestimonial(active-1,true));
  next.addEventListener('click',()=>showTestimonial(active+1,true));
  pause.addEventListener('click',()=>{paused=!paused;syncTestimonialPause();});
  testimonialSection.querySelector('.testimonial-stage').addEventListener('keydown',event=>{
    if(event.key==='ArrowRight'){event.preventDefault();showTestimonial(active+1,true);}
    if(event.key==='ArrowLeft'){event.preventDefault();showTestimonial(active-1,true);}
  });
  reduced.addEventListener('change',event=>{if(event.matches){paused=true;syncTestimonialPause();}});
  setInterval(()=>{
    const bounds=testimonialSection.getBoundingClientRect();
    if(!paused&&!document.hidden&&bounds.top<innerHeight&&bounds.bottom>0&&!testimonialSection.matches(':hover,:focus-within')&&!document.querySelector('dialog[open],.site-header.mega-open,.site-header.call-open')&&!document.body.classList.contains('menu-open'))showTestimonial(active+1);
  },8500);
}

// Quote requests share the existing browser-local download/copy delivery method.
const quoteDialog = document.getElementById('quote-dialog');
if(quoteDialog) {
  const quoteForm = document.getElementById('quote-form'), quoteResult = document.getElementById('quote-result');
  let quoteBrief = '';
  document.querySelectorAll('[data-quote]').forEach(button=>button.addEventListener('click',()=>{
    if (header.classList.contains('mega-open')) closeMega(true);
    closeMenu();
    quoteForm.hidden=false; quoteResult.hidden=true;
    quoteForm.elements.service.value=services[button.dataset.quote].title;
    openDialog(quoteDialog); document.getElementById('quote-name').focus();
  }));
  function quoteError(input,message) {
    input.setAttribute('aria-invalid',String(Boolean(message)));
    const error=document.getElementById(input.getAttribute('aria-describedby'));
    if(error)error.textContent=message;
  }
  quoteForm.querySelectorAll('[required]').forEach(input=>input.addEventListener('input',()=>quoteError(input,'')));
  quoteForm.addEventListener('submit',event=>{
    event.preventDefault(); let firstInvalid;
    for(const input of quoteForm.querySelectorAll('[required]')) {
      let message='';
      if(!input.value.trim())message=input.name==='service'?'Choose a security service.':`Please enter your ${input.name === 'name' ? 'full name' : input.name === 'phone' ? 'phone number' : 'email address'}.`;
      else if(input.type==='email'&&!input.validity.valid)message='Enter a valid email address.';
      else if(input.name==='phone'&&(!/^[+\d\s().-]+$/.test(input.value)||input.value.replace(/\D/g,'').length<7))message='Enter a valid phone number with at least 7 digits.';
      quoteError(input,message);if(message&&!firstInvalid)firstInvalid=input;
    }
    if(firstInvalid){firstInvalid.focus();return;}
    const data=new FormData(quoteForm);
    quoteBrief=['HORIZON RESPONSE SERVICES — QUOTE REQUEST','',`Name: ${data.get('name').trim()}`,`Email: ${data.get('email').trim()}`,`Phone: ${data.get('phone').trim()}`,`Service: ${data.get('service')}`,`Location: ${data.get('location').trim()||'To be discussed'}`,'','Details:',data.get('message').trim()||'To be discussed.','','Prepared in the Horizon Response website. No enquiry has been sent.'].join('\n');
    document.getElementById('quote-preview').textContent=quoteBrief;
    quoteForm.hidden=true;quoteResult.hidden=false;
    quoteResult.querySelector('h3').tabIndex=-1;quoteResult.querySelector('h3').focus();
  });
  document.getElementById('quote-download').addEventListener('click',()=>{
    const url=URL.createObjectURL(new Blob([quoteBrief],{type:'text/plain;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download='horizon-response-quote-request.txt';document.body.append(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    quoteResult.querySelector('.quote-copy-status').textContent='Your quote brief is ready to download.';
  });
  document.getElementById('quote-copy').addEventListener('click',async()=>{
    try {await navigator.clipboard.writeText(quoteBrief);quoteResult.querySelector('.quote-copy-status').textContent='Request copied. Ready to share.';}
    catch {quoteResult.querySelector('.quote-copy-status').textContent='Clipboard unavailable. Please download your request instead.';}
  });
  document.getElementById('quote-edit').addEventListener('click',()=>{quoteForm.hidden=false;quoteResult.hidden=true;document.getElementById('quote-name').focus();});
}
