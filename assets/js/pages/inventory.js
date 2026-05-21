import { vehicles, priceRanges } from "../data/vehicles.js";
import { populateSelect, populateDropdown, initDropdown } from "../utils/dom.js";
import { renderVehicleCard } from "../components/vehicleCard.js";

const VISIBLE_STEP = 6;

const state = {
    filters: {
        brand: "",
        model: "",
        year: "",
        price: "",
        minPrice: "",
        maxPrice: "",
        fuel: "",
        transmission: ""
    },
    visibleCount: VISIBLE_STEP,
    currentList: []
};

const filterOptions = {
    brands: [],
    fuels: [],
    transmissions: [],
    years: []
};

export function initInventory(elements) {
    const brandOptions = getUniqueValues("brand");
    const fuelOptions = getUniqueValues("fuel");
    const transmissionOptions = getUniqueValues("transmission");
    const yearOptions = Array.from(new Set(vehicles.map((item) => item.year))).sort((a, b) => b - a);

    filterOptions.brands = brandOptions;
    filterOptions.fuels = fuelOptions;
    filterOptions.transmissions = transmissionOptions;
    filterOptions.years = yearOptions.map((year) => String(year));

    populateDropdown(elements.filterBrandList, brandOptions, true, "Todas");
    populateDropdown(elements.filterFuelList, fuelOptions, true, "Todos");
    populateDropdown(elements.filterTransmissionList, transmissionOptions, true, "Todos");
    populateDropdown(
        elements.filterYearList,
        yearOptions.map((year) => ({ value: String(year), label: String(year) })),
        true,
        "Todos"
    );
    populateDropdown(elements.filterPriceList, priceRanges, true, "Todas as faixas");

    initDropdown(elements.filterBrand, elements.filterBrandList);
    initDropdown(elements.filterFuel, elements.filterFuelList);
    initDropdown(elements.filterTransmission, elements.filterTransmissionList);
    initDropdown(elements.filterYear, elements.filterYearList);
    initDropdown(elements.filterPrice, elements.filterPriceList);

    elements.applyFilters?.addEventListener("click", () => renderInventory(elements, true));
    const filterInputs = [
        elements.filterModel,
        elements.filterBrand,
        elements.filterYear,
        elements.filterPrice,
        elements.filterFuel,
        elements.filterTransmission
    ].filter(Boolean);
    filterInputs.forEach((input) => {
        input.addEventListener("keydown", (event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            renderInventory(elements, true);
        });
    });
    elements.clearFilters?.addEventListener("click", () => {
        applyFilterValues(elements, {
            model: "",
            brand: "",
            year: "",
            price: "",
            minPrice: "",
            maxPrice: "",
            fuel: "",
            transmission: ""
        });
        state.filters.minPrice = "";
        state.filters.maxPrice = "";
        renderInventory(elements, true);
    });
    elements.loadMore?.addEventListener("click", () => loadMore(elements));
}

export function setFiltersFromParams(elements, params) {
    const incoming = {
        brand: params.get("brand") || "",
        model: params.get("model") || "",
        year: params.get("year") || "",
        price: params.get("price") || "",
        minPrice: params.get("minPrice") || "",
        maxPrice: params.get("maxPrice") || "",
        fuel: params.get("fuel") || "",
        transmission: params.get("transmission") || ""
    };

    state.filters = incoming;
    applyFilterValues(elements, incoming);
}

export function renderInventory(elements, resetCount = false) {
    collectFilters(elements);
    state.currentList = filterVehicles(vehicles, state.filters);
    if (resetCount) {
        state.visibleCount = VISIBLE_STEP;
    }

    if (elements.resultsCount) {
        elements.resultsCount.textContent = `${state.currentList.length} resultados`;
    }

    const visible = state.currentList.slice(0, state.visibleCount);
    if (elements.inventoryGrid) {
        if (!state.currentList.length) {
            elements.inventoryGrid.innerHTML =
                "<div class=\"empty-state\">Nenhum veiculo encontrado. Ajuste os filtros para ver novas opcoes.</div>";
        } else {
            elements.inventoryGrid.innerHTML = visible.map(renderVehicleCard).join("");
        }
    }

    if (elements.loadMore) {
        elements.loadMore.style.display = state.currentList.length > state.visibleCount ? "inline-flex" : "none";
    }
}

function loadMore(elements) {
    state.visibleCount += VISIBLE_STEP;
    renderInventory(elements);
}

function collectFilters(elements) {
    const priceValue = normalizePriceValue(elements.filterPrice?.value ?? "");
    const brand = normalizeInput(elements.filterBrand, filterOptions.brands);
    const fuel = normalizeInput(elements.filterFuel, filterOptions.fuels);
    const transmission = normalizeInput(elements.filterTransmission, filterOptions.transmissions);
    const year = normalizeInput(elements.filterYear, filterOptions.years);
    state.filters = {
        model: elements.filterModel?.value.trim() ?? "",
        brand,
        year,
        price: priceValue,
        minPrice: priceValue ? "" : state.filters.minPrice,
        maxPrice: priceValue ? "" : state.filters.maxPrice,
        fuel,
        transmission
    };
}

function filterVehicles(list, filters) {
    return list.filter((vehicle) => {
        const matchModel = filters.model
            ? `${vehicle.model} ${vehicle.name}`.toLowerCase().includes(filters.model.toLowerCase())
            : true;
        const matchBrand = filters.brand ? vehicle.brand === filters.brand : true;
        const matchYear = filters.year ? vehicle.year >= Number(filters.year) : true;
        const matchFuel = filters.fuel ? vehicle.fuel === filters.fuel : true;
        const matchTransmission = filters.transmission ? vehicle.transmission === filters.transmission : true;
        const priceRange = priceRanges.find((range) => range.value === filters.price);
        const matchPrice = priceRange ? vehicle.price >= priceRange.min && vehicle.price <= priceRange.max : true;
        const minPrice = filters.minPrice ? Number(filters.minPrice) : null;
        const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : null;
        const matchMinPrice = Number.isFinite(minPrice) ? vehicle.price >= minPrice : true;
        const matchMaxPrice = Number.isFinite(maxPrice) ? vehicle.price <= maxPrice : true;
        const matchPriceRange = priceRange ? matchPrice : matchMinPrice && matchMaxPrice;

        return matchModel && matchBrand && matchYear && matchFuel && matchTransmission && matchPriceRange;
    });
}

function applyFilterValues(elements, filters) {
    if (elements.filterModel) elements.filterModel.value = filters.model || "";
    if (elements.filterBrand) elements.filterBrand.value = filters.brand || "";
    if (elements.filterYear) elements.filterYear.value = filters.year || "";
    if (elements.filterPrice) elements.filterPrice.value = getPriceLabel(filters.price || "");
    if (elements.filterFuel) elements.filterFuel.value = filters.fuel || "";
    if (elements.filterTransmission) elements.filterTransmission.value = filters.transmission || "";
}

function getUniqueValues(key) {
    return Array.from(new Set(vehicles.map((item) => item[key]))).sort();
}

function normalizePriceValue(value) {
    if (!value) return "";
    const match = priceRanges.find((range) => range.value === value || range.label === value);
    return match ? match.value : "";
}

function getPriceLabel(value) {
    if (!value) return "";
    const match = priceRanges.find((range) => range.value === value);
    return match ? match.label : value;
}

function normalizeInput(input, options) {
    if (!input) return "";
    const value = input.value.trim();
    if (!value) return "";
    const match = options.find((option) => option === value);
    if (!match) {
        input.value = "";
        return "";
    }
    return match;
}
