export function initNavToggle(toggleButton, navLinks) {
    if (!toggleButton || !navLinks) return;
    toggleButton.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("is-open");
        toggleButton.setAttribute("aria-expanded", String(isOpen));
    });
}

export function closeNav(toggleButton, navLinks) {
    if (!toggleButton || !navLinks) return;
    navLinks.classList.remove("is-open");
    toggleButton.setAttribute("aria-expanded", "false");
}
