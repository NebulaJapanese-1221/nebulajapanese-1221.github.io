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
});
