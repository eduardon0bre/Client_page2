import { vehicles } from "../data/vehicles.js";
import { populateSelect, populateDropdown, initDropdown } from "../utils/dom.js";
import { renderVehicleCard } from "../components/vehicleCard.js";

const currencyFormatter = new Intl.NumberFormat("pt-BR");

export function initHome(elements, onSearch) {
    const brandOptions = getUniqueValues("brand");
    const fuelOptions = getUniqueValues("fuel");
    const transmissionOptions = getUniqueValues("transmission");
    const yearOptions = Array.from(new Set(vehicles.map((item) => item.year))).sort((a, b) => b - a);

    populateDropdown(elements.homeBrandList, brandOptions, true, "Todas");
    populateDropdown(elements.homeFuelList, fuelOptions, true, "Todos");
    populateDropdown(elements.homeTransmissionList, transmissionOptions, true, "Todos");
    const yearItems = yearOptions.map((year) => ({ value: String(year), label: String(year) }));
    populateDropdown(elements.homeYearList, yearItems, true, "Todos");

    initDropdown(elements.homeBrand, elements.homeBrandList);
    initDropdown(elements.homeFuel, elements.homeFuelList);
    initDropdown(elements.homeTransmission, elements.homeTransmissionList);
    initDropdown(elements.homeYear, elements.homeYearList);

    initPriceInputs(elements);

    elements.homeSearch?.addEventListener("submit", (event) => {
        event.preventDefault();
        if (typeof onSearch === "function") {
            const normalized = normalizeHomeFilters(elements, {
                brandOptions,
                fuelOptions,
                transmissionOptions,
                yearOptions: yearItems.map((item) => item.value)
            });
            onSearch({
                brand: normalized.brand,
                model: normalized.model,
                year: normalized.year,
                minPrice: normalized.minPrice,
                maxPrice: normalized.maxPrice,
                fuel: normalized.fuel,
                transmission: normalized.transmission
            });
        }
    });
}

export function renderFeatured(container) {
    if (!container) return;
    const featured = vehicles.filter((vehicle) => vehicle.featured).slice(0, 6);
    container.innerHTML = featured.map(renderVehicleCard).join("");
}

function getUniqueValues(key) {
    return Array.from(new Set(vehicles.map((item) => item[key]))).sort();
}

function initPriceInputs(elements) {
    const inputs = [elements.homePriceMin, elements.homePriceMax].filter(Boolean);
    if (!inputs.length) return;

    inputs.forEach((input) => {
        input.addEventListener("input", () => {
            input.value = formatCurrencyInput(input.value);
        });
        input.addEventListener("blur", () => {
            input.value = formatCurrencyInput(input.value);
        });
    });
}

function formatCurrencyInput(value) {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";
    return currencyFormatter.format(Number(digits));
}

function getCurrencyValue(input) {
    if (!input) return "";
    const digits = input.value.replace(/\D/g, "");
    return digits ? String(Number(digits)) : "";
}

function normalizeHomeFilters(elements, options) {
    const brand = normalizeInput(elements.homeBrand, options.brandOptions);
    const fuel = normalizeInput(elements.homeFuel, options.fuelOptions);
    const transmission = normalizeInput(elements.homeTransmission, options.transmissionOptions);
    const year = normalizeInput(elements.homeYear, options.yearOptions);
    const model = elements.homeModel?.value.trim() ?? "";
    let minPrice = getCurrencyValue(elements.homePriceMin);
    let maxPrice = getCurrencyValue(elements.homePriceMax);

    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
        const temp = minPrice;
        minPrice = maxPrice;
        maxPrice = temp;
        if (elements.homePriceMin) elements.homePriceMin.value = formatCurrencyInput(minPrice);
        if (elements.homePriceMax) elements.homePriceMax.value = formatCurrencyInput(maxPrice);
    }

    return {
        brand,
        model,
        year,
        minPrice,
        maxPrice,
        fuel,
        transmission
    };
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
