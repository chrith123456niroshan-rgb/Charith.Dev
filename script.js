// 1. Scroll Progress Bar Update
window.addEventListener('scroll', () => {
    const progressBar = document.getElementById("scroll-progress");
    if (progressBar) {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    }
});

// 2. Web Audio API Sci-Fi Sound Synthesizer
let sfxEnabled = true;
let audioCtx = null;

function playSound(freq, type = 'sine', duration = 0.08) {
    if (!sfxEnabled) return;
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
}

document.querySelectorAll('.sfx-click').forEach(btn => {
    btn.addEventListener('click', () => playSound(800, 'triangle', 0.1));
});

const sfxBtn = document.getElementById('sfx-toggle');
if (sfxBtn) {
    sfxBtn.addEventListener('click', () => {
        sfxEnabled = !sfxEnabled;
        sfxBtn.innerHTML = sfxEnabled ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark"></i>';
    });
}

// 3. Mouse Tracking Glow Effect on Cards
document.querySelectorAll('.glow-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// 4. Initialize Particles.js
if (document.getElementById("particles-js") && typeof particlesJS !== 'undefined') {
    particlesJS("particles-js", {
        "particles": {
            "number": { "value": 65, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": "#38bdf8" },
            "shape": { "type": "circle" },
            "opacity": { "value": 0.4 },
            "size": { "value": 3, "random": true },
            "line_linked": { "enable": true, "distance": 150, "color": "#38bdf8", "opacity": 0.2, "width": 1 },
            "move": { "enable": true, "speed": 2 }
        }
    });
}

// 5. Initialize Typed.js
if (document.getElementById('typed-text') && typeof Typed !== 'undefined') {
    new Typed('#typed-text', {
        strings: ['Full-Stack Engineer', 'AI & Computer Vision Specialist', 'IoT & Embedded Developer'],
        typeSpeed: 50, backSpeed: 30, loop: true
    });
}

// 6. Custom Cyber Cursor Movement
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
        cursorOutline.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 250, fill: "forwards" });
    });
}

// 7. Live GitHub API Fetch
async function fetchGitHubStats() {
    const repoEl = document.getElementById('github-repos');
    const followersEl = document.getElementById('github-followers');
    
    if (!repoEl && !followersEl) return;

    try {
        const res = await fetch('https://api.github.com/users/chrith123456niroshan-rgb');
        if (res.ok) {
            const data = await res.json();
            if (repoEl) repoEl.innerText = data.public_repos || '8+';
            if (followersEl) followersEl.innerText = data.followers || '2+';
        }
    } catch (err) {
        if (repoEl) repoEl.innerText = '8+';
        if (followersEl) followersEl.innerText = '2+';
    }
}
fetchGitHubStats();

// 8. Command Palette (Ctrl + K Logic)
const cmdModal = document.getElementById('cmd-modal');
const cmdInput = document.getElementById('cmd-input');
const cmdTrigger = document.getElementById('cmd-trigger-btn');
const cmdList = document.getElementById('cmd-list');

if (cmdTrigger && cmdModal && cmdInput) {
    function toggleCmdModal() {
        cmdModal.classList.toggle('active');
        if (cmdModal.classList.contains('active')) cmdInput.focus();
    }

    cmdTrigger.addEventListener('click', toggleCmdModal);

    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            toggleCmdModal();
        }
        if (e.key === 'Escape' && cmdModal.classList.contains('active')) {
            cmdModal.classList.remove('active');
        }
    });

    if (cmdList) {
        cmdList.querySelectorAll('li').forEach(item => {
            item.addEventListener('click', () => {
                const targetSection = item.dataset.action;
                cmdModal.classList.remove('active');
                const target = document.getElementById(targetSection);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }
}

// 9. Interactive Project Code Snippets Modal
const projectDetails = {
    cricket: {
        title: "🏏 Cricket Scoring Web App",
        desc: "Ball-by-ball score calculation app with run-rate trackers.",
        code: `// JS Run Rate Formula\nfunction calcNRR(runs, overs) {\n    return (runs / overs).toFixed(2);\n}`
    },
    snake: {
        title: "🐍 Gesture Snake Game",
        desc: "OpenCV Hand tracking for gesture game navigation.",
        code: `# Python MediaPipe Hand Tracking\nimport cv2\nfrom cvzone.HandTrackingModule import HandDetector\n\ndetector = HandDetector(detectionCon=0.8)\nhands, img = detector.findHands(frame)`
    },
    ascii: {
        title: "🎬 ANSI Color ASCII Player",
        desc: "24-bit Truecolor terminal ASCII rendering engine.",
        code: `# ANSI 24-bit Color Print\nprint(f"\\033[38;2;{r};{g};{b}m#\\033[0m", end="")`
    },
    hydroponics: {
        title: "🌱 Smart Hydroponics Tower",
        desc: "Arduino C++ closed-loop sensor-actuator firmware.",
        code: `// Arduino Sensor Dosing Logic\nif (sensorValue < pH_Min) {\n    digitalWrite(RELAY_PUMP, HIGH);\n}`
    },
    hostel: {
        title: "🏢 Hostel Allocation System",
        desc: "C# WinForms administrative desktop platform.",
        code: `// C# SQL Query Binding\nstring query = "SELECT * FROM Rooms WHERE IsAllocated = 0";`
    },
    sad: {
        title: "🌐 SAD Professional Portfolio",
        desc: "Glassmorphism UI portfolio with CLI & Audio APIs.",
        code: `/* CSS Glassmorphism */\n.glass {\n  background: rgba(30, 41, 59, 0.7);\n  backdrop-filter: blur(16px);\n}`
    }
};

const modal = document.getElementById('project-modal');
const modalContent = document.getElementById('modal-content');
const modalClose = document.querySelector('.modal-close-btn');

if (modal && modalContent && modalClose) {
    document.querySelectorAll('.btn-modal-open').forEach(btn => {
        btn.addEventListener('click', () => {
            const info = projectDetails[btn.dataset.project];
            if (info) {
                modalContent.innerHTML = `
                    <h2>${info.title}</h2>
                    <p style="margin: 1rem 0; color: var(--text-secondary);">${info.desc}</p>
                    <strong>Code Snippet / Core Logic:</strong>
                    <pre class="code-box"><code>${info.code}</code></pre>
                `;
                modal.classList.add('active');
            }
        });
    });

    modalClose.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });
}

// 10. CLI Terminal Logic
const termInput = document.getElementById('terminal-input');
const termOutput = document.getElementById('terminal-output');

if (termInput && termOutput) {
    termInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const input = termInput.value.trim().toLowerCase();
            const userLine = document.createElement('p');
            userLine.className = 'term-line';
            userLine.innerHTML = `<span style="color:#10b981;">charith@dev:~$</span> ${input}`;
            termOutput.appendChild(userLine);

            if (input === 'clear') {
                termOutput.innerHTML = '';
            } else if (input === 'help') {
                termOutput.innerHTML += `<p class="term-line" style="color:#94a3b8;">Commands: about, skills, projects, contact, clear</p>`;
            } else if (input === 'about') {
                termOutput.innerHTML += `<p class="term-line" style="color:#94a3b8;">Charith Niroshan — BIT (Hons) Undergraduate @ University of Vavuniya.</p>`;
            } else if (input !== '') {
                termOutput.innerHTML += `<p class="term-line" style="color:#ef4444;">Command not found: '${input}'</p>`;
            }

            termInput.value = '';
            termOutput.scrollTop = termOutput.scrollHeight;
        }
    });
}

// 11. Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');
if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));
}

// GitHub Username
const GITHUB_USERNAME = "chrith123456niroshan-rgb";

document.addEventListener("DOMContentLoaded", () => {
    fetchGitHubRepos();
    setupProjectSearch();
});

// Fetch all public repos live from GitHub API
async function fetchGitHubRepos() {
    const reposContainer = document.getElementById("github-projects-container");
    const repoCountBadge = document.getElementById("github-repos");
    
    if (!reposContainer) return;

    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
        const repos = await response.json();

        // Update Total Repos count on Dashboard
        if (repoCountBadge) {
            repoCountBadge.textContent = repos.length;
        }

        reposContainer.innerHTML = ""; // Clear loader

        repos.forEach(repo => {
            // Skip fork repos if needed, or display all
            const projectCard = document.createElement("div");
            projectCard.className = "bento-card span-2 project-item";
            projectCard.setAttribute("data-title", repo.name.toLowerCase());
            projectCard.setAttribute("data-lang", (repo.language || "").toLowerCase());

            const langColor = getLanguageColor(repo.language);

            projectCard.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                    <div>
                        <span style="color: ${langColor}; font-size: 0.8rem; font-weight: bold; text-transform: uppercase;">
                            ${repo.language ? repo.language : 'General Code'}
                        </span>
                        <h3 style="font-size: 1.3rem; margin-top: 4px;">${formatRepoName(repo.name)}</h3>
                    </div>
                    <a href="${repo.html_url}" target="_blank" style="color: var(--text-secondary); font-size: 1.3rem;" class="github-link-icon">
                        <i class="fa-brands fa-github"></i>
                    </a>
                </div>
                
                <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.5; margin-bottom: 1.2rem; min-height: 40px;">
                    ${repo.description ? repo.description : 'Official open-source repository hosted on GitHub profile.'}
                </p>

                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--card-border); padding-top: 0.8rem;">
                    <div style="display: flex; gap: 1rem; font-size: 0.85rem; color: var(--text-secondary);">
                        <span><i class="fa-regular fa-star" style="color: #f59e0b;"></i> ${repo.stargazers_count}</span>
                        <span><i class="fa-solid fa-code-branch" style="color: var(--accent-cyan);"></i> ${repo.forks_count}</span>
                    </div>
                    <a href="${repo.html_url}" target="_blank" class="btn-cyber btn-outline" style="padding: 0.4rem 0.9rem; font-size: 0.8rem;">
                        View Code <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                </div>
            `;

            reposContainer.appendChild(projectCard);
        });

    } catch (error) {
        console.error("Error fetching GitHub Repos:", error);
        reposContainer.innerHTML = `<p style="color: #ff5f56; grid-column: span 4;">Failed to load live GitHub projects. Please check your internet connection.</p>`;
    }
}

// Format repository names cleanly (e.g., "my-repo-name" -> "My Repo Name")
function formatRepoName(name) {
    return name.replace(/-/g, ' ').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Get glowing color based on programming language
function getLanguageColor(lang) {
    const colors = {
        "JavaScript": "#f7df1e",
        "Python": "#3572A5",
        "Java": "#b07219",
        "C++": "#f34b7d",
        "C#": "#178600",
        "HTML": "#e34c26",
        "CSS": "#563d7c"
    };
    return colors[lang] || "#00f2fe";
}

// Live Search Filter functionality
function setupProjectSearch() {
    const searchInput = document.getElementById("project-search");
    if (!searchInput) return;

    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const items = document.querySelectorAll(".project-item");

        items.forEach(item => {
            const title = item.getAttribute("data-title");
            const lang = item.getAttribute("data-lang");
            if (title.includes(query) || lang.includes(query)) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });
    });
}