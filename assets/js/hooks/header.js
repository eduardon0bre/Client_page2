export function initHeaderBehavior(header) {
    if (!header) return;
    const maxScroll = 240;
    const minOpacity = 0.18;
    const maxOpacity = 0.88;
    const minBlur = 12;
    const maxBlur = 22;

    const updateHeader = () => {
        const current = Math.min(globalThis.scrollY, maxScroll);
        const ratio = current / maxScroll;
        const opacity = minOpacity + (maxOpacity - minOpacity) * ratio;
        const blur = minBlur + (maxBlur - minBlur) * ratio;
        header.style.setProperty("--header-opacity", opacity.toFixed(3));
        header.style.setProperty("--header-blur", `${blur.toFixed(1)}px`);
    };

    updateHeader();
    globalThis.addEventListener("scroll", updateHeader, { passive: true });
}
