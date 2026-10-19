document.addEventListener("DOMContentLoaded", () => {
    const current = location.pathname.split("/").pop() || "index.html";
    const links = document.querySelectorAll("nav a");
    links.forEach((link) => {
        if (link.getAttribute("href") === current) {
            link.classList.add("active");
        }
    });

    const themeToggle = document.getElementById("theme-toggle");
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        document.documentElement.setAttribute("data-theme", savedTheme);
        themeToggle.textContent = savedTheme === "light" ? "☀️" : "🌙";
    }

    themeToggle.addEventListener("click", () => {
        const html = document.documentElement;
        const isLight = html.getAttribute("data-theme") === "light";
        const newTheme = isLight ? "dark" : "light";
        html.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        themeToggle.textContent = newTheme === "light" ? "☀️" : "🌙";
    });

    const filterBtns = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            filterBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            const filter = btn.getAttribute("data-filter");
            projectCards.forEach((card) => {
                if (filter === "all" || card.getAttribute("data-type") === filter) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });

    const projectSearch = document.getElementById("project-search");
    if (projectSearch) {
        projectSearch.addEventListener("input", (e) => {
            const term = e.target.value.toLowerCase();
            projectCards.forEach((card) => {
                const text = card.textContent.toLowerCase();
                if (text.includes(term)) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }
            });
        });
    }

    const lowBandwidthToggle = document.getElementById("lowbandwidth-toggle");
    const savedLowBandwidth = localStorage.getItem("lowbandwidth");
    if (savedLowBandwidth === "true") {
        document.documentElement.setAttribute("data-lowbandwidth", "true");
        lowBandwidthToggle.textContent = "📄";
    }

    lowBandwidthToggle.addEventListener("click", () => {
        const html = document.documentElement;
        const isLowBandwidth = html.getAttribute("data-lowbandwidth") === "true";
        if (isLowBandwidth) {
            html.removeAttribute("data-lowbandwidth");
            localStorage.setItem("lowbandwidth", "false");
        } else {
            html.setAttribute("data-lowbandwidth", "true");
            localStorage.setItem("lowbandwidth", "true");
        }
    });

    const globalSearch = document.getElementById("global-search");
    const resultsCount = document.getElementById("results-count");
    const resultsList = document.getElementById("results-list");

    if (globalSearch) {
        const searchData = [
            {
                title: "nebulajapanese-1221.github.io",
                type: "Project",
                url: "projects.html",
                content: "This personal website portfolio. HTML",
                updated: "Oct 18, 2026"
            },
            {
                title: "NebulaOS",
                type: "Project",
                url: "projects.html",
                content: "NebulaOS is a small 32-bit x86 hobby operating system. GRUB loads its Multiboot kernel, which uses a 32-bit graphics framebuffer and starts a simple desktop-style shell. C++ x86 Assembly GNU GPL v3.0",
                updated: "Oct 18, 2026"
            },
            {
                title: "Project NebulaBeat",
                type: "Project",
                url: "projects.html",
                content: "A fast-paced rhythm-action game where players defend a spinning energy core by dragging to slice incoming explosive notes. GDScript Godot Kenney CC0",
                updated: "Oct 7, 2026"
            },
            {
                title: "About Me",
                type: "Page",
                url: "about.html",
                "content": "NebulaJapanese-1221 hobbyist developer low-level systems game development kernels bootloaders game engines operating system development x86 assembly open source software",
                updated: "Oct 19, 2026"
            },
            {
                title: "Mirror",
                type: "Page",
                url: "mirror.html",
                "content": "Access this site via clearnet or Tor. Tor hidden service clearnet",
                updated: "Oct 19, 2026"
            },
            {
                title: "Search",
                type: "Page",
                url: "search.html",
                "content": "Search across projects and site content",
                updated: "Oct 19, 2026"
            }
        ];

        globalSearch.addEventListener("input", (e) => {
            const term = e.target.value.toLowerCase();
            resultsList.innerHTML = "";

            if (!term) {
                resultsCount.textContent = "";
                return;
            }

            const results = searchData.filter((item) => {
                const haystack = (item.title + " " + item.content).toLowerCase();
                return haystack.includes(term);
            });

            resultsCount.textContent = results.length + " result" + (results.length !== 1 ? "s" : "");

            results.forEach((item) => {
                const el = document.createElement("div");
                el.className = "search-result";
                el.innerHTML = `
                    <span class="result-type">${item.type}</span>
                    <h4><a href="${item.url}">${item.title}</a></h4>
                    <p>${item.content}</p>
                `;
                resultsList.appendChild(el);
            });

            if (results.length === 0) {
                resultsList.innerHTML = "<p>No results found.</p>";
            }
        });
    }
});
