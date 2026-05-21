import { renderFeatured, initHome } from "./pages/home.js";
import { initInventory, renderInventory, setFiltersFromParams } from "./pages/inventory.js";
import { renderDetail, handleGalleryClick } from "./pages/detail.js";
import { initTheme } from "./hooks/theme.js";
import { initHeaderBehavior } from "./hooks/header.js";
import { initNavToggle, closeNav } from "./layouts/nav.js";
import { parseRoute, onRouteChange } from "./routes/router.js";
import { setActiveView, setActiveNav } from "./utils/dom.js";

const elements = {
    featuredGrid: document.getElementById("featured-grid"),
    inventoryGrid: document.getElementById("inventory-grid"),
    relatedGrid: document.getElementById("related-grid"),
    detailMain: document.getElementById("detail-main-content"),
    detailSidebar: document.getElementById("detail-sidebar-content"),
    resultsCount: document.getElementById("results-count"),
    loadMore: document.getElementById("load-more"),
    applyFilters: document.getElementById("apply-filters"),
    clearFilters: document.getElementById("clear-filters"),
    navLinks: document.getElementById("nav-links"),
    navToggle: document.getElementById("nav-toggle"),
    themeToggle: document.getElementById("theme-toggle"),
    header: document.getElementById("site-header"),
    homeSearch: document.getElementById("home-search"),
    homeBrand: document.getElementById("home-brand"),
    homeBrandList: document.getElementById("home-brand-list"),
    homeModel: document.getElementById("home-model"),
    homeYear: document.getElementById("home-year"),
    homeYearList: document.getElementById("home-year-list"),
    homePriceMin: document.getElementById("home-price-min"),
    homePriceMax: document.getElementById("home-price-max"),
    homeFuel: document.getElementById("home-fuel"),
    homeFuelList: document.getElementById("home-fuel-list"),
    homeTransmission: document.getElementById("home-transmission"),
    homeTransmissionList: document.getElementById("home-transmission-list"),
    filterModel: document.getElementById("filter-model"),
    filterBrand: document.getElementById("filter-brand"),
    filterBrandList: document.getElementById("filter-brand-list"),
    filterYear: document.getElementById("filter-year"),
    filterYearList: document.getElementById("filter-year-list"),
    filterPrice: document.getElementById("filter-price"),
    filterPriceList: document.getElementById("filter-price-list"),
    filterFuel: document.getElementById("filter-fuel"),
    filterFuelList: document.getElementById("filter-fuel-list"),
    filterTransmission: document.getElementById("filter-transmission"),
    filterTransmissionList: document.getElementById("filter-transmission-list")
};

function handleCardClick(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const card = target.closest("[data-vehicle-id]");
    if (!card) return;

    const id = card.dataset.vehicleId;
    if (id) {
        globalThis.location.hash = `#/veiculo/${id}`;
    }
}

function handleRoute(route) {
    closeNav(elements.navToggle, elements.navLinks);

    if (route.path.startsWith("#/veiculo/")) {
        const id = route.path.replace("#/veiculo/", "");
        setActiveView("view-detail");
        renderDetail(elements, id);
        setActiveNav("#/estoque");
        return;
    }

    if (route.path === "#/estoque") {
        setActiveView("view-inventory");
        setFiltersFromParams(elements, route.params);
        renderInventory(elements, true);
        setActiveNav("#/estoque");
        return;
    }

    if (route.path === "#/contato") {
        setActiveView("view-home");
        setActiveNav("#/contato");
        const contactSection = document.getElementById("contato");
        if (contactSection) {
            setTimeout(() => contactSection.scrollIntoView({ behavior: "smooth" }), 150);
        }
        return;
    }

    setActiveView("view-home");
    renderFeatured(elements.featuredGrid);
    setActiveNav("#/");
}

function initApp() {
    initTheme(elements.themeToggle);
    initHeaderBehavior(elements.header);
    initNavToggle(elements.navToggle, elements.navLinks);
    initHome(elements, (filters) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });
        globalThis.location.hash = `#/estoque?${params.toString()}`;
    });
    initInventory(elements);

    renderFeatured(elements.featuredGrid);
    document.addEventListener("click", handleCardClick);
    document.addEventListener("click", handleGalleryClick);
    onRouteChange(handleRoute);
    handleRoute(parseRoute());
}

initApp();
