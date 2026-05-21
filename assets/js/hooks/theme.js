export function initTheme(toggleButton) {
    const stored = localStorage.getItem("theme");
    const prefersDark = globalThis.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored || (prefersDark ? "dark" : "light");
    applyTheme(initial);

    toggleButton?.addEventListener("click", () => {
        const current = document.documentElement.dataset.theme;
        const next = current === "dark" ? "light" : "dark";
        applyTheme(next);
    });
}

export function applyTheme(theme) {
    document.body.classList.add("theme-transition");
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    setTimeout(() => document.body.classList.remove("theme-transition"), 300);
}
