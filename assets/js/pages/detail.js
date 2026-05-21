import { vehicles } from "../data/vehicles.js";
import { renderVehicleCard } from "../components/vehicleCard.js";
import { formatNumber, formatPrice, getVehicleLabel } from "../utils/format.js";

export function renderDetail(elements, id) {
    const vehicle = vehicles.find((item) => item.id === id) ?? vehicles[0];
    if (!vehicle) return;

    const thumbs = vehicle.images
        .map(
            (image, index) =>
                `<img class="gallery-thumb ${index === 0 ? "active" : ""}" src="${image}" data-thumb="${image}" alt="Preview ${index + 1}">`
        )
        .join("");

    if (elements.detailMain) {
        elements.detailMain.innerHTML = `
            <img src="${vehicle.images[0]}" class="gallery-main" id="main-gallery" alt="${vehicle.name}">
            <div class="gallery-thumbs">${thumbs}</div>
            <div class="specs-grid">
                <div class="spec-item"><span class="label">Ano/Modelo</span><span>${getVehicleLabel(vehicle)}</span></div>
                <div class="spec-item"><span class="label">Quilometragem</span><span>${formatNumber(vehicle.mileage)} km</span></div>
                <div class="spec-item"><span class="label">Combustível</span><span>${vehicle.fuel}</span></div>
                <div class="spec-item"><span class="label">Câmbio</span><span>${vehicle.transmission}</span></div>
                <div class="spec-item"><span class="label">Cor</span><span>${vehicle.color}</span></div>
                <div class="spec-item"><span class="label">Motor</span><span>${vehicle.engine}</span></div>
                <div class="spec-item"><span class="label">Potência</span><span>${vehicle.power}</span></div>
                <div class="spec-item"><span class="label">Portas</span><span>${vehicle.doors}</span></div>
                <div class="spec-item"><span class="label">Final da placa</span><span>${vehicle.plate}</span></div>
                <div class="spec-item"><span class="label">Direção</span><span>${vehicle.steering}</span></div>
            </div>
            <h3>Opcionais</h3>
            <ul class="optionals-list">
                ${vehicle.optionals.map((item) => `<li>${item}</li>`).join("")}
            </ul>
            <h3>Descrição</h3>
            <p>${vehicle.description}</p>
        `;
    }

    if (elements.detailSidebar) {
        elements.detailSidebar.innerHTML = `
            <h1 class="detail-title">${vehicle.name}</h1>
            <div class="detail-price">${formatPrice(vehicle.price)}</div>
            <div class="detail-actions">
                <a class="btn-whatsapp" href="https://wa.me/5511900000000" target="_blank" rel="noopener">
                    <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp">
                    WhatsApp
                </a>
                <button class="btn-secondary" type="button">Simular financiamento</button>
            </div>
            <div class="detail-contact">
                <strong>Contato da loja</strong><br>
                Av. Exemplo Empresarial, 1000<br>
                (11) 90000-0000
            </div>
        `;
    }

    if (elements.relatedGrid) {
        const related = vehicles.filter((item) => item.id !== id).slice(0, 4);
        elements.relatedGrid.innerHTML = related.map(renderVehicleCard).join("");
    }
}

export function handleGalleryClick(event) {
    const target = event.target;
    if (!(target instanceof HTMLImageElement)) return;
    const image = target.dataset.thumb;
    if (!image) return;

    const main = document.getElementById("main-gallery");
    if (main) main.src = image;

    document.querySelectorAll(".gallery-thumb").forEach((thumb) => {
        thumb.classList.toggle("active", thumb.dataset.thumb === image);
    });
}
