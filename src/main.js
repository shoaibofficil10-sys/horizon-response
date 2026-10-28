import './style.css';

const services = {
  static: { title: 'Static Security Guards', description: 'A consistent, visible presence can help deter unauthorised access while making visitors and staff feel supported. Static guarding is about knowing the site, understanding the brief and paying attention to what changes.', points: ['Entry and exit procedures suited to your site', 'Visitor guidance and access control requirements', 'Observation, incident reporting and escalation', 'Guarding hours, post instructions and handovers'] },
  construction: { title: 'Construction Site Security', description: 'Construction sites change daily. Security planning should consider the stage of the build, the movement of contractors and deliveries, and the equipment left behind when work stops.', points: ['Site entrances, perimeter and vulnerable access points', 'Equipment, materials and storage areas', 'Contractor and delivery access arrangements', 'After-hours guarding and incident communication'] },
  warehouse: { title: 'Warehouse & Industrial Security', description: 'Busy facilities need security that fits around operations. A considered guarding plan takes account of staff movements, goods, vehicles and sensitive areas without losing sight of the people working there.', points: ['Staff, contractor and visitor access', 'Loading areas, vehicle movement and perimeter awareness', 'Restricted areas and site-specific instructions', 'Shift patterns, operating hours and reporting'] },
  event: { title: 'Event Security & Crowd Control', description: 'A safe, well-managed environment helps guests focus on the occasion. Event security planning begins with the venue, expected attendance and how people arrive, move and leave.', points: ['Entry points and guest access arrangements', 'Crowd flow and areas requiring attention', 'Coordination with venue staff and event organisers', 'Event timings, responsibilities and escalation plans'] },
  residential: { title: 'Residential Complex & Retirement Village Security', description: 'Communities need an approach that balances security with comfort and dignity. A respectful, approachable presence helps residents and visitors navigate shared spaces with greater confidence.', points: ['Community entrances and visitor arrangements', 'Shared spaces and perimeter considerations', 'Respectful interaction with residents and visitors', 'Agreed hours and communication with site management'] },
  afterhours: { title: 'After-Hours Security Services', description: 'Quiet hours can bring a different set of security concerns. Discuss an after-hours arrangement that reflects your premises, access requirements and the times when you need a visible presence.', points: ['Evening, overnight and weekend requirements', 'Vulnerable areas and site access points', 'Agreed observation and reporting procedures', 'Handover instructions and escalation contacts'] },
};

const header = document.querySelector('.site-header');
let headerFrame = false;
function updateHeader() { header.classList.toggle('scrolled', window.scrollY > 60); headerFrame = false; }
window.addEventListener('scroll', () => { if (!headerFrame) { headerFrame = true; requestAnimationFrame(updateHeader); } }, { passive: true });
updateHeader();
const heroMotionButton = document.querySelector('.hero-motion-toggle');
const hero = document.querySelector('.immersive-hero');
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
heroMotionButton.hidden = motionPreference.matches;
heroMotionButton.addEventListener('click', () => {
  const paused = hero.classList.toggle('hero-motion-paused');
  heroMotionButton.setAttribute('aria-pressed', String(paused));
  heroMotionButton.setAttribute('aria-label', paused ? 'Play hero animation' : 'Pause hero animation');
  heroMotionButton.innerHTML = paused ? '<span aria-hidden="true">&gt;</span> Play motion' : '<span aria-hidden="true">II</span> Pause motion';
});
motionPreference.addEventListener('change', event => {
  heroMotionButton.hidden = event.matches;
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
  const input = [...document.querySelectorAll('input[name=service]')].find(input => input.value === selectedService);
  if (input) input.checked = true;
  showBriefStep(1);
  serviceDialog.close();
  document.getElementById('contact').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  document.getElementById('location').focus({ preventScroll: true });
});

const form = document.getElementById('brief-form');
const requirementsPanel = document.getElementById('requirements-panel');
const detailsPanel = document.getElementById('details-panel');
function showBriefStep(step) {
  const details = step === 2;
  requirementsPanel.hidden = details;
  detailsPanel.hidden = !details;
  document.getElementById('form-step-number').textContent = details ? '02' : '01';
  document.getElementById('form-step-caption').textContent = details ? 'YOUR DETAILS' : 'YOUR REQUIREMENTS';
  document.getElementById('form-step-title').textContent = details ? 'Who should the brief be prepared for?' : 'A little about your security needs.';
  document.getElementById('form-step-count').textContent = details ? '2 OF 2' : '1 OF 2';
  document.querySelectorAll('.form-progress > span')[1].classList.toggle('active', details);
  detailsPanel.querySelectorAll('[required]').forEach(input => { input.disabled = !details; });
  if (details) {
    const data = new FormData(form);
    document.getElementById('requirements-summary').textContent = `${data.get('service')} · ${data.get('location').trim()}`;
  }
}
function validateRequirements() {
  for (const input of requirementsPanel.querySelectorAll('[required]')) {
    if (input.type !== 'radio') input.setCustomValidity(input.value.trim() ? '' : 'Please enter a value.');
    if (!input.reportValidity()) return false;
  }
  return true;
}
showBriefStep(1);
document.getElementById('form-next').addEventListener('click', () => {
  if (!validateRequirements()) return;
  showBriefStep(2);
  document.getElementById('name').focus({ preventScroll: true });
});
for (const id of ['form-back', 'edit-requirements']) document.getElementById(id).addEventListener('click', () => {
  showBriefStep(1);
  document.getElementById('location').focus({ preventScroll: true });
});
let currentBrief = '';
form.addEventListener('submit', event => {
  event.preventDefault();
  if (detailsPanel.hidden) {
    if (validateRequirements()) { showBriefStep(2); document.getElementById('name').focus({ preventScroll: true }); }
    return;
  }
  const data = new FormData(form);
  for (const input of form.querySelectorAll('[required]')) {
    if (input.type !== 'radio') input.setCustomValidity(input.value.trim() ? '' : 'Please enter a value.');
    if (!input.reportValidity()) return;
  }
  currentBrief = ['HORIZON RESPONSE SERVICES — SECURITY BRIEF', '', `Name: ${data.get('name').trim()}`, `Email: ${data.get('email').trim()}`, `Organisation: ${data.get('company').trim() || 'Not provided'}`, `Phone: ${data.get('phone').trim() || 'Not provided'}`, `Location: ${data.get('location').trim()}`, `Service: ${data.get('service')}`, '', 'Requirements:', data.get('message').trim(), '', 'Prepared in the Horizon Response website brief builder. No enquiry has been sent.'].join('\n');
  document.getElementById('brief-preview').textContent = currentBrief;
  document.querySelector('.copy-status').textContent = '';
  openDialog(document.getElementById('brief-dialog'));
});
form.querySelectorAll('[required]').forEach(input => input.addEventListener('input', () => input.setCustomValidity('')));
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
