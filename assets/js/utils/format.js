const priceFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0
});

const numberFormatter = new Intl.NumberFormat("pt-BR");

export function formatPrice(value) {
    return priceFormatter.format(value);
}

export function formatNumber(value) {
    return numberFormatter.format(value);
}

export function getVehicleLabel(vehicle) {
    return `${vehicle.year}/${vehicle.modelYear}`;
}
