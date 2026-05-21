import { formatNumber, formatPrice, getVehicleLabel } from "../utils/format.js";

export function renderVehicleCard(vehicle) {
    return `
        <article class="car-card" data-vehicle-id="${vehicle.id}">
            <img src="${vehicle.images[0]}" alt="${vehicle.name}">
            <div class="car-content">
                <h3 class="car-title">${vehicle.name}</h3>
                <div class="car-meta">
                    <span>${getVehicleLabel(vehicle)}</span>
                    <span>${formatNumber(vehicle.mileage)} km</span>
                    <span>${vehicle.fuel}</span>
                    <span>${vehicle.transmission}</span>
                </div>
                <div class="car-price">${formatPrice(vehicle.price)}</div>
                <button class="btn-primary btn-details" type="button">Ver detalhes</button>
            </div>
        </article>
    `;
}
