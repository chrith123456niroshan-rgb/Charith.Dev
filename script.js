/* ==========================================================================
   Charith.Dev Core Application Scripts
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // Initialize Core Modules
    initScrollProgressBar();
    initThemeManager();
    initTypewriter();
    initMouseGlowEffect();
    initAudioSynth();
    initCommandPalette();
    initProjectModals();
    initGitHubIntegration();
    initClockWidget();
});

/* ==========================================================================
   1. Scroll Progress Bar
   ========================================================================== */
function initScrollProgressBar() {
    // Create progress element if missing
    let progressBar = document.getElementById("scroll-progress");
    if (!progressBar) {
        progressBar = document.createElement("div");
        progressBar.id = "scroll-progress";
        document.body.prepend(progressBar);
    }
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        progressBar.style.width = scrolled + "%";
    });
}

/* ==========================================================================
   2. Theme Manager (Dark / Light Mode)
   ========================================================================== */
function initThemeManager() {
    const themeToggleBtn = document.getElementById("theme-toggle");
    if (!themeToggleBtn) return;

    // Load theme from localStorage, or default to dark
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeButton(themeToggleBtn, savedTheme);

    themeToggleBtn.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        updateThemeButton(themeToggleBtn, newTheme);
        
        // Play subtle toggle sound
        playAudioTone(newTheme === "dark" ? 440 : 554, 'triangle', 0.12);
    });
}

function updateThemeButton(btn, theme) {
    if (theme === "light") {
        btn.innerHTML = `☀️ Light`;
        btn.setAttribute("title", "Switch to Dark Mode");
    } else {
        btn.innerHTML = `🌙 Dark`;
        btn.setAttribute("title", "Switch to Light Mode");
    }
}

/* ==========================================================================
   3. Pure JS Typewriter (Robust, No CDN Needed)
   ========================================================================== */
function initTypewriter() {
    const target = document.getElementById('typed-text');
    if (!target) return;

    const words = [
        'Full-Stack Developer 🚀',
        'AI & Computer Vision Specialist 🧠',
        'IoT & Embedded Systems Engineer 🔌',
        'ICT & SFT Educator 🎓'
    ];
    
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            target.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deleting is faster
        } else {
            target.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            // Wait at the end of word
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

/* ==========================================================================
   4. Card Hover Mouse Glow Effect
   ========================================================================== */
function initMouseGlowEffect() {
    const cards = document.querySelectorAll('.bento-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Set custom property coordinates on hovered card
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/* ==========================================================================
   5. Interactive Audio Synthesizer (Web Audio API)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initAudioSynth() {
    // Bind click events to elements with feedback
    const soundInteractiveSelectors = 'a, button, .bento-card, .dock-item, .filter-chip';
    document.querySelectorAll(soundInteractiveSelectors).forEach(element => {
        element.addEventListener('click', () => {
            // Play click tone
            playAudioTone(600, 'sine', 0.06);
        });
        element.addEventListener('mouseenter', () => {
            // Play extremely subtle hover tone
            playAudioTone(1000, 'sine', 0.02, 0.01);
        });
    });
}

function playAudioTone(freq, type = 'sine', duration = 0.08, volume = 0.04) {
    if (!soundEnabled) return;
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // Resume if suspended (browser security policy)
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        
        gain.gain.setValueAtTime(volume, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
        console.warn("Web Audio API not supported or blocked by browser policies.");
    }
}

/* ==========================================================================
   6. Command Palette (Ctrl + K Search)
   ========================================================================== */
function initCommandPalette() {
    // Create palette HTML dynamically if not in DOM to ensure global availability
    let overlay = document.getElementById('cmd-modal');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'cmd-modal';
        overlay.className = 'cmd-overlay';
        overlay.innerHTML = `
            <div class="cmd-window">
                <div class="cmd-input-container">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" id="cmd-input" class="cmd-input" placeholder="Type a search query or command..." autocomplete="off">
                </div>
                <ul id="cmd-list" class="cmd-results">
                    <!-- Dynamic Search Results -->
                </ul>
                <div class="cmd-footer">
                    <span><kbd>▲▼</kbd> Navigate</span>
                    <span><kbd>Enter</kbd> Select</span>
                    <span><kbd>Esc</kbd> Close</span>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    const input = document.getElementById('cmd-input');
    const list = document.getElementById('cmd-list');
    
    // Commands & Pages Index
    const searchIndex = [
        { title: "Home Dashboard", category: "Navigation", path: "index.html", icon: "fa-house" },
        { title: "Academic & Timeline Summary", category: "Navigation", path: "about.html", icon: "fa-user" },
        { title: "Technical Skills & Toolkit", category: "Navigation", path: "skills.html", icon: "fa-code" },
        { title: "Projects Showcase & Code", category: "Navigation", path: "projects.html", icon: "fa-folder-open" },
        { title: "Interactive Developer CLI Terminal", category: "Navigation", path: "terminal.html", icon: "fa-terminal" },
        { title: "Contact Channels & CV", category: "Navigation", path: "contact.html", icon: "fa-envelope" },
        { title: "Download PDF Curriculum Vitae", category: "Action", path: "cv.pdf", icon: "fa-file-pdf", download: true },
        { title: "Start Interactive Terminal Mode", category: "Action", path: "terminal.html", icon: "fa-terminal" },
        { title: "Toggle Light / Dark Theme", category: "Theme", action: "toggle-theme", icon: "fa-circle-half-stroke" }
    ];

    let selectedIndex = 0;

    function renderResults(query = "") {
        list.innerHTML = "";
        const filtered = searchIndex.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) || 
            item.category.toLowerCase().includes(query.toLowerCase())
        );

        if (filtered.length === 0) {
            list.innerHTML = `<li style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.9rem;">No shortcuts or commands found.</li>`;
            return;
        }

        filtered.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = `cmd-item ${index === selectedIndex ? 'selected' : ''}`;
            
            // Format icon
            li.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fa-solid ${item.icon} item-icon"></i>
                    <span class="item-title">${item.title}</span>
                </div>
                <span class="item-shortcut">${item.category}</span>
            `;
            
            li.addEventListener('click', () => triggerAction(item));
            list.appendChild(li);
        });
    }

    function triggerAction(item) {
        overlay.classList.remove('active');
        if (item.path) {
            if (item.download) {
                const a = document.createElement('a');
                a.href = item.path;
                a.download = item.path;
                a.target = "_blank";
                a.click();
            } else {
                window.location.href = item.path;
            }
        } else if (item.action === "toggle-theme") {
            const themeBtn = document.getElementById("theme-toggle");
            if (themeBtn) themeBtn.click();
        }
    }

    // Toggle shortcut (Ctrl + K or Command + K)
    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            overlay.classList.toggle('active');
            if (overlay.classList.contains('active')) {
                input.value = "";
                selectedIndex = 0;
                renderResults();
                input.focus();
                playAudioTone(800, 'triangle', 0.1);
            }
        }
        
        if (!overlay.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            overlay.classList.remove('active');
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const items = list.querySelectorAll('.cmd-item');
            if (items.length > 0) {
                selectedIndex = (selectedIndex + 1) % items.length;
                renderResults(input.value);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const items = list.querySelectorAll('.cmd-item');
            if (items.length > 0) {
                selectedIndex = (selectedIndex - 1 + items.length) % items.length;
                renderResults(input.value);
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const selectedItem = list.querySelector('.cmd-item.selected');
            if (selectedItem) {
                selectedItem.click();
            }
        }
    });

    input.addEventListener('input', () => {
        selectedIndex = 0;
        renderResults(input.value);
    });

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
        }
    });
}

/* ==========================================================================
   7. Project Detail Popup Modals
   ========================================================================== */
function initProjectModals() {
    const projectDetails = {
        cricket: {
            title: "🏏 Digital Cricket Scorer Engine",
            desc: "A responsive, math-driven calculation application engineered to replace manual scorecard processes. Computes overs, individual player stats, and current run rates in real-time.",
            code: `// JS Mathematical Run Rate Engine\nfunction calculateRunRate(runsScored, deliveriesBowled) {\n    if (deliveriesBowled === 0) return "0.00";\n    const overs = Math.floor(deliveriesBowled / 6) + (deliveriesBowled % 6) / 10;\n    const totalOversDec = Math.floor(deliveriesBowled / 6) + (deliveriesBowled % 6) / 6;\n    return (runsScored / totalOversDec).toFixed(2);\n}`
        },
        snake: {
            title: "🐍 Computer Vision Gesture Snake Game",
            desc: "A gamified Human-Computer Interaction (HCI) software created in Python. Interfaces standard desktop webcam modules with MediaPipe hand landmark tracking filters to pilot gameplay coordinates.",
            code: `# Python MediaPipe Vector Coordinate Tracking\nimport cv2\nimport mediapipe as mp\n\nclass HandGestureDetector:\n    def __init__(self):\n        self.mp_hands = mp.solutions.hands\n        self.hands = self.mp_hands.Hands(max_num_hands=1)\n        \n    def get_index_tip_pos(self, frame):\n        img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)\n        results = self.hands.process(img_rgb)\n        if results.multi_hand_landmarks:\n            # Return normalized index finger tip coords\n            return results.multi_hand_landmarks[0].landmark[8]\n        return None`
        },
        ascii: {
            title: "🎬 ANSI Truecolor Terminal ASCII Player",
            desc: "Terminal rendering software written in Python. Processes video frames via OpenCV, down-samples frame dimensions, and maps pixels to ANSI 24-bit Truecolor terminal escape codes.",
            code: `# Python ANSI 24-Bit Escape Code Formatter\ndef rgb_to_ansi(r, g, b, character="#"):\n    # Return glowing visual element block code\n    return f"\\033[38;2;{r};{g};{b}m{character}\\033[0m"`
        },
        hydroponics: {
            title: "🌱 IoT Automated Grow Tower",
            desc: "C++ microcontroller firmware integrating pH level sensors, Electrical Conductivity (EC) nutrient trackers, water level valves, and relays to support vertical farm automation.",
            code: `// C++ Closed-Loop Nutrient Pump Trigger\nconst int PH_DOSING_RELAY = 5;\nconst float PH_THRESHOLD_MIN = 5.8;\n\nvoid checkNutrients(float currentPH) {\n    if (currentPH < PH_THRESHOLD_MIN) {\n        // Run alkaline pump for 2 seconds\n        digitalWrite(PH_DOSING_RELAY, HIGH);\n        delay(2000);\n        digitalWrite(PH_DOSING_RELAY, LOW);\n    }\n}`
        },
        hostel: {
            title: "🏢 Digitized Hostel Allocation System",
            desc: "Full-Stack desktop administration database platform utilizing a clean Relational Database Management System (RDBMS) mapping allocation requests, room capacity limits, and records.",
            code: `// C# Query String Binding & Allocations\nusing (SqlConnection conn = new SqlConnection(connString)) {\n    string query = "UPDATE Rooms SET IsAllocated = 1 WHERE RoomID = @RoomID";\n    SqlCommand cmd = new SqlCommand(query, conn);\n    cmd.Parameters.AddWithValue("@RoomID", allocatedRoomId);\n    conn.Open();\n    cmd.ExecuteNonQuery();\n}`
        }
    };

    // Append Modal HTML dynamically if missing
    let modal = document.getElementById('project-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'project-modal';
        modal.className = 'proj-modal-overlay';
        modal.innerHTML = `
            <div class="proj-modal-container">
                <div class="proj-modal-header">
                    <h3 id="modal-title" style="margin: 0; font-size: 1.3rem;">Project Logic</h3>
                    <button class="proj-modal-close"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div class="proj-modal-body">
                    <p id="modal-desc" style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.9rem; line-height: 1.5;"></p>
                    <h4 style="font-size: 0.95rem; margin-bottom: 0.8rem; display: flex; align-items: center; gap: 8px;">
                        <i class="fa-solid fa-code" style="color: var(--accent-purple);"></i> Source Snippet
                    </h4>
                    <div class="proj-code-block-container">
                        <button class="proj-code-copy-btn" id="modal-copy-btn">Copy Code</button>
                        <pre id="modal-code"><code></code></pre>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const titleEl = document.getElementById('modal-title');
    const descEl = document.getElementById('modal-desc');
    const codeEl = document.getElementById('modal-code');
    const copyBtn = document.getElementById('modal-copy-btn');
    const closeBtn = modal.querySelector('.proj-modal-close');

    // Attach event listeners to projects page or dashboard button triggers
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-project]');
        if (!btn) return;

        const projKey = btn.dataset.project;
        const details = projectDetails[projKey];
        if (details) {
            titleEl.textContent = details.title;
            descEl.textContent = details.desc;
            codeEl.innerHTML = `<code>${escapeHtml(details.code)}</code>`;
            
            modal.classList.add('active');
            playAudioTone(700, 'sine', 0.1);
        }
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        playAudioTone(400, 'sine', 0.08);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            playAudioTone(400, 'sine', 0.08);
        }
    });

    // Copy to clipboard logic
    copyBtn.addEventListener('click', () => {
        const codeText = codeEl.textContent;
        navigator.clipboard.writeText(codeText).then(() => {
            copyBtn.textContent = "Copied! ✓";
            copyBtn.style.color = "var(--accent-green)";
            copyBtn.style.borderColor = "var(--accent-green)";
            
            playAudioTone(900, 'triangle', 0.1);

            setTimeout(() => {
                copyBtn.textContent = "Copy Code";
                copyBtn.style.color = "var(--text-secondary)";
                copyBtn.style.borderColor = "var(--card-border)";
            }, 2000);
        }).catch(err => {
            console.error("Failed to copy code: ", err);
        });
    });
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* ==========================================================================
   8. Live GitHub API Sync (Projects page & Repository Counters)
   ========================================================================== */
const GITHUB_USERNAME = "chrith123456niroshan-rgb";

async function initGitHubIntegration() {
    const reposContainer = document.getElementById("github-projects-container");
    const countBadge = document.getElementById("github-repos");

    // Fetch repository counters for Dashboard or Project page
    if (!reposContainer && !countBadge) return;

    try {
        // Show loading skeletons inside projects panel
        if (reposContainer) {
            reposContainer.innerHTML = renderSkeletonLoaders();
        }

        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
        if (!response.ok) throw new Error("API Limit reached or network error");
        
        const repos = await response.json();

        // Update counts on UI
        if (countBadge) {
            countBadge.textContent = repos.length;
        }

        if (!reposContainer) return;

        reposContainer.innerHTML = ""; // Clear loader skeletons

        // Sort repos by star count descending, then display
        const sortedRepos = repos.sort((a, b) => b.stargazers_count - a.stargazers_count);

        sortedRepos.forEach(repo => {
            const card = document.createElement("div");
            card.className = "bento-card span-2 project-item";
            card.setAttribute("data-title", repo.name.toLowerCase());
            card.setAttribute("data-lang", (repo.language || "general").toLowerCase());

            const langColor = getLanguageColor(repo.language);
            const formattedName = repo.name.replace(/-/g, ' ').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                    <div>
                        <span style="color: ${langColor}; font-size: 0.75rem; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">
                            ${repo.language ? repo.language : 'General Code'}
                        </span>
                        <h3 style="font-size: 1.25rem; margin-top: 4px; color: var(--text-primary);">${formattedName}</h3>
                    </div>
                    <a href="${repo.html_url}" target="_blank" class="github-link-icon" style="color: var(--text-secondary); font-size: 1.25rem;">
                        <i class="fa-brands fa-github"></i>
                    </a>
                </div>
                
                <p style="color: var(--text-secondary); font-size: 0.85rem; line-height: 1.5; margin-bottom: 1.5rem; flex: 1;">
                    ${repo.description ? repo.description : 'Official repository for code scripts, firmware modules, or dynamic developer assets.'}
                </p>

                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--card-border); padding-top: 1rem; margin-top: auto;">
                    <div style="display: flex; gap: 1rem; font-size: 0.8rem; color: var(--text-muted);">
                        <span><i class="fa-regular fa-star" style="color: #fbbf24; margin-right: 4px;"></i>${repo.stargazers_count}</span>
                        <span><i class="fa-solid fa-code-branch" style="color: var(--accent-cyan); margin-right: 4px;"></i>${repo.forks_count}</span>
                    </div>
                    <a href="${repo.html_url}" target="_blank" class="btn-cyber btn-outline" style="padding: 6px 12px; font-size: 0.78rem;">
                        Code Source <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.7rem; margin-left: 2px;"></i>
                    </a>
                </div>
            `;

            reposContainer.appendChild(card);
        });

        // Initialize dynamic filtering if chips exist
        setupFilteringAndSearch();

    } catch (err) {
        console.warn("GitHub API error: ", err);
        if (reposContainer) {
            reposContainer.innerHTML = `
                <div style="grid-column: span 4; text-align: center; padding: 2.5rem; color: var(--text-secondary);">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size: 2.5rem; color: var(--accent-magenta); margin-bottom: 1rem;"></i>
                    <p style="margin: 0; font-size: 0.95rem;">Failed to fetch live repositories due to rate limiting.</p>
                    <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 5px;">You can view the code repositories directly on my <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" style="color: var(--accent-cyan);">GitHub Profile</a>.</p>
                </div>
            `;
        }
    }
}

function renderSkeletonLoaders() {
    let html = "";
    for (let i = 0; i < 4; i++) {
        html += `
            <div class="bento-card span-2 skeleton-card" style="min-height: 200px; border-color: rgba(255,255,255,0.03); opacity: 0.5;">
                <div style="height: 14px; width: 30%; background: rgba(255,255,255,0.08); border-radius: 4px; margin-bottom: 0.8rem;"></div>
                <div style="height: 20px; width: 60%; background: rgba(255,255,255,0.08); border-radius: 4px; margin-bottom: 1rem;"></div>
                <div style="height: 12px; width: 100%; background: rgba(255,255,255,0.05); border-radius: 4px; margin-bottom: 0.5rem;"></div>
                <div style="height: 12px; width: 85%; background: rgba(255,255,255,0.05); border-radius: 4px; margin-bottom: 1.5rem;"></div>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.04); padding-top: 0.8rem; margin-top: auto;">
                    <div style="height: 14px; width: 25%; background: rgba(255,255,255,0.04); border-radius: 4px;"></div>
                    <div style="height: 24px; width: 30%; background: rgba(255,255,255,0.06); border-radius: 6px;"></div>
                </div>
            </div>
        `;
    }
    return html;
}

function getLanguageColor(lang) {
    const colors = {
        "javascript": "#f7df1e",
        "typescript": "#3178c6",
        "python": "#3572a5",
        "java": "#b07219",
        "c++": "#f34b7d",
        "c#": "#178600",
        "html": "#e34c26",
        "css": "#563d7c",
        "php": "#4f5d95"
    };
    return colors[(lang || "").toLowerCase()] || "var(--accent-cyan)";
}

/* ==========================================================================
   9. Live Searching & Filter Chips (Showcase Page)
   ========================================================================== */
function setupFilteringAndSearch() {
    const searchInput = document.getElementById("project-search");
    const chips = document.querySelectorAll(".filter-chip");
    const items = document.querySelectorAll(".project-item");

    if (!searchInput && chips.length === 0) return;

    let activeFilter = "all";
    let searchQuery = "";

    function filterProjects() {
        items.forEach(item => {
            const title = item.getAttribute("data-title") || "";
            const lang = item.getAttribute("data-lang") || "";
            
            // Check matches
            const matchSearch = title.includes(searchQuery) || lang.includes(searchQuery);
            const matchFilter = activeFilter === "all" || lang === activeFilter || 
                                (activeFilter === "iot" && (lang.includes("c++") || title.includes("hydroponics"))) ||
                                (activeFilter === "ai" && (lang.includes("python") || title.includes("gesture") || title.includes("snake") || title.includes("ascii"))) ||
                                (activeFilter === "full-stack" && (lang.includes("javascript") || lang.includes("html") || title.includes("hostel")));

            if (matchSearch && matchFilter) {
                item.style.display = "flex";
                item.style.opacity = "1";
                item.style.transform = "scale(1)";
            } else {
                item.style.display = "none";
                item.style.opacity = "0";
                item.style.transform = "scale(0.95)";
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            filterProjects();
        });
    }

    chips.forEach(chip => {
        chip.addEventListener("click", () => {
            chips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            activeFilter = chip.dataset.filter.toLowerCase();
            filterProjects();
            
            playAudioTone(500, 'sine', 0.08);
        });
    });
}

/* ==========================================================================
   10. Real-Time Status Clock Widget
   ========================================================================== */
function initClockWidget() {
    const clockEl = document.getElementById('sl-clock');
    if (!clockEl) return;

    function updateClock() {
        const options = { 
            timeZone: 'Asia/Colombo', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: true 
        };
        clockEl.innerText = new Date().toLocaleTimeString('en-US', options);
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}