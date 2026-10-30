/* =========================================================
   CONFIG — edit these to update the site in one place
   ========================================================= */
const CONFIG = {
  name: "Selvakumar S",
  email: "selvakumarppm555@gmail.com",
  phone: "8610183729",
  github: "selvakumarppm552-coder",
  githubUrl: "https://github.com/selvakumarppm552-coder",
  linkedinUrl: "", // TODO: add your LinkedIn URL here
  location: "Namakkal, Tamil Nadu",
  resumePath: "assets/resume.pdf",
  certPaths: {
    webDev: "assets/certificates/web-development-certificate.pdf",
    digitalTools: "assets/certificates/digital-tools-certificate.pdf"
  },
  roles: ["Web Development", "Digital Skills", "Programmer", "Tech Learner"]
};

// Projects data — add real projects here later
const PROJECTS = [
  // { title: "Project Name", desc: "Short description.", link: "#" }
];

/* =========================================================
   NAVBAR — scroll state + mobile menu
   ========================================================= */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* =========================================================
   THEME TOGGLE
   ========================================================= */
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme) body.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const next = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  body.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
});

/* =========================================================
   ROLE TYPING ANIMATION
   ========================================================= */
const rotator = document.getElementById('roleRotator');
let roleIndex = 0, charIndex = 0, deleting = false;

function typeRole() {
  const current = CONFIG.roles[roleIndex];
  if (!deleting) {
    charIndex++;
    rotator.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeRole, 1400);
      return;
    }
  } else {
    charIndex--;
    rotator.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % CONFIG.roles.length;
    }
  }
  setTimeout(typeRole, deleting ? 40 : 75);
}
typeRole();

/* =========================================================
   SCROLL REVEAL
   ========================================================= */
document.querySelectorAll('.section').forEach(sec => sec.classList.add('reveal'));
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      entry.target.querySelectorAll('.progress-fill').forEach(bar => bar.classList.add('filled'));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* =========================================================
   LINKEDIN PLACEHOLDER
   ========================================================= */
const linkedinBtn = document.getElementById('linkedinPlaceholder');
if (linkedinBtn) {
  if (CONFIG.linkedinUrl) {
    linkedinBtn.href = CONFIG.linkedinUrl;
    linkedinBtn.target = '_blank';
    linkedinBtn.rel = 'noopener';
  } else {
    linkedinBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('LinkedIn URL not set yet. Add it to CONFIG.linkedinUrl in script.js.');
    });
  }
}

/* =========================================================
   PROJECTS — placeholder cards if none provided
   ========================================================= */
const projectGrid = document.getElementById('projectGrid');
if (PROJECTS.length === 0) {
  projectGrid.innerHTML = `
    <div class="project-card">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z"/><path d="M12 7v5l3 3"/></svg>
      <p>Project details will be added soon.</p>
    </div>
    <div class="project-card">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z"/><path d="M12 7v5l3 3"/></svg>
      <p>Project details will be added soon.</p>
    </div>
    <div class="project-card">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z"/><path d="M12 7v5l3 3"/></svg>
      <p>Project details will be added soon.</p>
    </div>`;
} else {
  projectGrid.innerHTML = PROJECTS.map(p => `
    <div class="project-card" style="border-style:solid; text-align:left;">
      <h3 style="color:var(--text); margin:0 0 8px;">${p.title}</h3>
      <p style="color:var(--text-dim);">${p.desc}</p>
      ${p.link ? `<a href="${p.link}" class="cert-link">View →</a>` : ''}
    </div>`).join('');
}

/* =========================================================
   GITHUB REPOS — public API, no token, graceful fallback
   ========================================================= */
const githubRepos = document.getElementById('githubRepos');

async function loadGithubRepos() {
  try {
    const res = await fetch(`https://api.github.com/users/${CONFIG.github}/repos?sort=updated&per_page=6`);
    if (!res.ok) throw new Error('GitHub API request failed');
    const repos = await res.json();
    if (!Array.isArray(repos) || repos.length === 0) {
      showGithubFallback('No public repositories found yet.');
      return;
    }
    githubRepos.innerHTML = repos.map(r => `
      <div class="repo-card">
        <h4>${r.name}</h4>
        <p>${r.description ? r.description : 'No description provided.'}</p>
        <div class="repo-meta">
          <span>★ ${r.stargazers_count}</span>
          <span>${r.language || '—'}</span>
        </div>
      </div>`).join('');
  } catch (err) {
    showGithubFallback('Could not load repositories right now (GitHub API may be rate-limited). Please check the profile directly.');
  }
}

function showGithubFallback(message) {
  githubRepos.innerHTML = `<div class="github-fallback">${message}</div>`;
}

loadGithubRepos();

/* =========================================================
   CONTACT FORM — mailto fallback (no backend)
   ========================================================= */
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
  window.location.href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;
});

/* =========================================================
   WEB CANVAS BACKGROUND — subtle animated spider-web lines
   ========================================================= */
const canvas = document.getElementById('webCanvas');
const ctx = canvas.getContext('2d');
let w, h, points = [];

function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = document.documentElement.scrollHeight;
  const density = Math.min(60, Math.floor((w * h) / 45000));
  points = Array.from({ length: density }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.12,
    vy: (Math.random() - 0.5) * 0.12
  }));
}

function drawWeb() {
  ctx.clearRect(0, 0, w, h);
  const isLight = body.getAttribute('data-theme') === 'light';
  ctx.strokeStyle = isLight ? 'rgba(20,20,30,0.18)' : 'rgba(228,49,43,0.25)';
  ctx.lineWidth = 0.6;

  for (let p of points) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > w) p.vx *= -1;
    if (p.y < 0 || p.y > h) p.vy *= -1;
  }

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dx = points[i].x - points[j].x;
      const dy = points[i].y - points[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140) {
        ctx.globalAlpha = 1 - dist / 140;
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[j].x, points[j].y);
        ctx.stroke();
      }
    }
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(drawWeb);
}

resizeCanvas();
drawWeb();
window.addEventListener('resize', resizeCanvas);

/* =========================================================
   WEB-SHOOTER CURSOR TRAIL (desktop only)
   ========================================================= */
const webCursor = document.getElementById('webCursor');
let cursorX = 0, cursorY = 0, curX = 0, curY = 0;

window.addEventListener('mousemove', (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;
});

function animateCursor() {
  curX += (cursorX - curX) * 0.2;
  curY += (cursorY - curY) * 0.2;
  webCursor.style.left = curX + 'px';
  webCursor.style.top = curY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    webCursor.style.width = '28px';
    webCursor.style.height = '28px';
  });
  el.addEventListener('mouseleave', () => {
    webCursor.style.width = '14px';
    webCursor.style.height = '14px';
  });
});
