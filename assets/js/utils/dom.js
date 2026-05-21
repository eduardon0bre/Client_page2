export function populateSelect(target, items, includeAll = true, allLabel = "Todas") {
    if (!target) return;
    const isDataList = target instanceof HTMLDataListElement;
    target.innerHTML = "";
    if (includeAll && !isDataList) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = allLabel;
        target.appendChild(option);
    }
    items.forEach((item) => {
        const option = document.createElement("option");
        if (isDataList) {
            option.value = item.label ?? item.value ?? item;
            option.label = item.label ?? item.value ?? item;
        } else {
            option.value = item.value ?? item;
            option.textContent = item.label ?? item;
        }
        target.appendChild(option);
    });
}

export function populateDropdown(list, items, includeAll = true, allLabel = "Todas") {
    if (!list) return;
    list.innerHTML = "";
    if (includeAll) {
        const item = document.createElement("div");
        item.className = "dropdown-item";
        item.dataset.value = "";
        item.dataset.label = allLabel;
        item.textContent = allLabel;
        list.appendChild(item);
    }
    items.forEach((option) => {
        const item = document.createElement("div");
        const value = option.value ?? option;
        const label = option.label ?? option;
        item.className = "dropdown-item";
        item.dataset.value = String(value);
        item.dataset.label = String(label);
        item.textContent = String(label);
        list.appendChild(item);
    });
}

export function initDropdown(input, list) {
    if (!input || !list) return;

    const openList = () => list.classList.add("is-open");
    const closeList = () => list.classList.remove("is-open");
    const items = () => Array.from(list.querySelectorAll(".dropdown-item"));

    const filterItems = () => {
        const query = input.value.trim().toLowerCase();
        items().forEach((item) => {
            const label = (item.dataset.label || "").toLowerCase();
            const match = !query || label.includes(query);
            item.classList.toggle("is-hidden", !match);
        });
    };

    input.addEventListener("focus", () => {
        filterItems();
        openList();
    });
    input.addEventListener("click", () => {
        filterItems();
        openList();
    });
    input.addEventListener("input", () => {
        filterItems();
        openList();
    });

    list.addEventListener("mousedown", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        const item = target.closest(".dropdown-item");
        if (!item) return;
        event.preventDefault();
        const value = item.dataset.value ?? "";
        const label = item.dataset.label ?? "";
        input.value = value ? label : "";
        closeList();
        input.dispatchEvent(new Event("change", { bubbles: true }));
    });

    document.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        if (target === input || list.contains(target)) return;
        closeList();
    });
}

export function setActiveView(viewId) {
    document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
    const target = document.getElementById(viewId);
    if (target) target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

export function setActiveNav(route) {
    document.querySelectorAll(".nav-links a").forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === route);
    });
}
