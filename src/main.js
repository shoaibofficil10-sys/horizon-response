import './style.css';

const services = {
  static: { title: 'Static Security Guards', description: 'A consistent, visible presence can help deter unauthorised access while making visitors and staff feel supported. Static guarding is about knowing the site, understanding the brief and paying attention to what changes.', points: ['Entry and exit procedures suited to your site', 'Visitor guidance and access control requirements', 'Observation, incident reporting and escalation', 'Guarding hours, post instructions and handovers'] },
  construction: { title: 'Construction Site Security', description: 'Construction sites change daily. Security planning should consider the stage of the build, the movement of contractors and deliveries, and the equipment left behind when work stops.', points: ['Site entrances, perimeter and vulnerable access points', 'Equipment, materials and storage areas', 'Contractor and delivery access arrangements', 'After-hours guarding and incident communication'] },
  warehouse: { title: 'Warehouse & Industrial Security', description: 'Busy facilities need security that fits around operations. A considered guarding plan takes account of staff movements, goods, vehicles and sensitive areas without losing sight of the people working there.', points: ['Staff, contractor and visitor access', 'Loading areas, vehicle movement and perimeter awareness', 'Restricted areas and site-specific instructions', 'Shift patterns, operating hours and reporting'] },
  event: { title: 'Event Security & Crowd Control', description: 'A safe, well-managed environment helps guests focus on the occasion. Event security planning begins with the venue, expected attendance and how people arrive, move and leave.', points: ['Entry points and guest access arrangements', 'Crowd flow and areas requiring attention', 'Coordination with venue staff and event organisers', 'Event timings, responsibilities and escalation plans'] },
  residential: { title: 'Residential Complex & Retirement Village Security', description: 'Communities need an approach that balances security with comfort and dignity. A respectful, approachable presence helps residents and visitors navigate shared spaces with greater confidence.', points: ['Community entrances and visitor arrangements', 'Shared spaces and perimeter considerations', 'Respectful interaction with residents and visitors', 'Agreed hours and communication with site management'] },
  afterhours: { title: 'After-Hours Security Services', description: 'Quiet hours can bring a different set of security concerns. Discuss an after-hours arrangement that reflects your premises, access requirements and the times when you need a visible presence.', points: ['Evening, overnight and weekend requirements', 'Vulnerable areas and site access points', 'Agreed observation and reporting procedures', 'Handover instructions and escalation contacts'] },
};

const serviceVisuals = {
  static: { image: 'horizon-lobby.webp', alt: 'A security officer at a modern commercial reception', caption: 'A professional presence. A reassuring first impression.' },
  construction: { image: 'horizon-construction.webp', alt: 'Security officer overseeing access at a construction site', caption: 'Keep your project moving in the right direction.' },
  warehouse: { image: 'horizon-site.webp', alt: 'Modern warehouse and industrial facility at dusk', caption: 'Protection that works around your operations.' },
  event: { image: 'horizon-event.webp', alt: 'Professional security officer welcoming guests to an evening event', caption: 'A safe environment. A better experience.' },
  residential: { image: 'horizon-residential.webp', alt: 'Security officer and resident in a landscaped residential community', caption: 'A familiar presence. A community at ease.' },
  afterhours: { image: 'horizon-hero.webp', alt: 'Security officer overlooking commercial premises at blue hour', caption: 'When the day ends, attention shouldn’t.' },
};
const serviceKeys = Object.keys(serviceVisuals);
function selectService(key) {
  document.querySelectorAll('.service-card').forEach(card => {
    const active = card.dataset.panel === key;
    card.classList.toggle('active', active);
    card.querySelector('.service-tab').setAttribute('aria-expanded', String(active));
    card.querySelector('.service-description').hidden = !active;
  });
  const visual = serviceVisuals[key];
  const image = document.getElementById('service-image');
  image.src = `/images/${visual.image}`;
  image.alt = visual.alt;
  document.getElementById('service-image-title').textContent = visual.caption;
  document.getElementById('service-count').textContent = `0${serviceKeys.indexOf(key) + 1} / 06`;
}
document.querySelectorAll('[data-select-service]').forEach(button => button.addEventListener('click', () => selectService(button.dataset.selectService)));
document.querySelectorAll('[data-environment]').forEach(link => link.addEventListener('click', () => selectService(link.dataset.environment)));

const stage = document.querySelector('.hero-stage');
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused = motionPreference.matches;
stage.addEventListener('pointermove', event => {
  if (motionPaused || event.pointerType !== 'mouse') return;
  const rect = stage.getBoundingClientRect();
  stage.style.setProperty('--shield-ry', `${((event.clientX - rect.left) / rect.width - .5) * 12}deg`);
  stage.style.setProperty('--shield-rx', `${((event.clientY - rect.top) / rect.height - .5) * -8}deg`);
});
stage.addEventListener('pointerleave', () => {
  stage.style.setProperty('--shield-ry', '0deg');
  stage.style.setProperty('--shield-rx', '0deg');
});
const motionButton = document.createElement('button');
motionButton.className = 'motion-toggle';
motionButton.textContent = 'II PAUSE MOTION';
motionButton.setAttribute('aria-label', 'Pause decorative animations');
motionButton.setAttribute('aria-pressed', 'false');
motionButton.hidden = motionPreference.matches;
stage.append(motionButton);
motionButton.addEventListener('click', () => {
  motionPaused = !motionPaused;
  document.body.classList.toggle('motion-paused', motionPaused);
  motionButton.textContent = motionPaused ? '> PLAY MOTION' : 'II PAUSE MOTION';
  motionButton.setAttribute('aria-label', motionPaused ? 'Play decorative animations' : 'Pause decorative animations');
  motionButton.setAttribute('aria-pressed', String(motionPaused));
  if (motionPaused) stage.style.setProperty('--shield-ry', '0deg');
  if (motionPaused) stage.style.setProperty('--shield-rx', '0deg');
});
motionPreference.addEventListener('change', event => {
  motionPaused = event.matches;
  motionButton.hidden = event.matches;
  document.body.classList.remove('motion-paused');
  motionButton.textContent = 'II PAUSE MOTION';
  motionButton.setAttribute('aria-label', 'Pause decorative animations');
  motionButton.setAttribute('aria-pressed', 'false');
});

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

const serviceDialog = document.getElementById('service-dialog');
let selectedService = '';
document.querySelectorAll('[data-service]').forEach(button => button.addEventListener('click', () => {
  const service = services[button.dataset.service];
  selectedService = service.title;
  document.getElementById('dialog-title').textContent = service.title;
  document.getElementById('dialog-description').textContent = service.description;
  const list = document.getElementById('dialog-list');
  list.replaceChildren(...service.points.map(text => { const item = document.createElement('li'); item.textContent = text; return item; }));
  openDialog(serviceDialog);
}));
document.getElementById('dialog-enquire').addEventListener('click', () => {
  const select = document.getElementById('service');
  select.value = selectedService;
  serviceDialog.close();
  document.getElementById('contact').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  document.getElementById('name').focus({ preventScroll: true });
});

let currentBrief = '';
document.getElementById('brief-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  for (const input of event.currentTarget.querySelectorAll('[required]')) {
    input.setCustomValidity(input.value.trim() ? '' : 'Please enter a value.');
    if (!input.reportValidity()) return;
  }
  currentBrief = ['HORIZON RESPONSE SERVICES — SECURITY BRIEF', '', `Name: ${data.get('name').trim()}`, `Email: ${data.get('email').trim()}`, `Organisation: ${data.get('company').trim() || 'Not provided'}`, `Location: ${data.get('location').trim()}`, `Service: ${data.get('service')}`, '', 'Requirements:', data.get('message').trim(), '', 'Prepared in the Horizon Response website brief builder. No enquiry has been sent.'].join('\n');
  document.getElementById('brief-preview').textContent = currentBrief;
  document.querySelector('.copy-status').textContent = '';
  openDialog(document.getElementById('brief-dialog'));
});
document.querySelectorAll('#brief-form [required]').forEach(input => input.addEventListener('input', () => input.setCustomValidity('')));
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

if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('js-motion');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}
