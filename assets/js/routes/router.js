export function parseRoute() {
    const hash = globalThis.location.hash || "#/";
    const [path, queryString] = hash.split("?");
    return { path, params: new URLSearchParams(queryString || "") };
}

export function onRouteChange(handler) {
    globalThis.addEventListener("hashchange", () => handler(parseRoute()));
}
