export function groupBy(arr: Array<any>, properties: Array<any>) {
    let grouped = {};

    arr.forEach(function (a) {
        properties.reduce(function (o, g, i) {                            // take existing object,
            o[a[g]] = o[a[g]] || (i + 1 === properties.length ? [] : {}); // or generate new obj, or
            return o[a[g]];                                           // at last, then an array
        }, grouped).push(a);
    })

    return grouped
};

export function shipmentIdToDate(shipmentId: string) {
    const formattedShipmentId = "20" + shipmentId.slice(0, 2) + "-" + shipmentId.slice(2, 4) + "-" + shipmentId.slice(4, 6)
    const date = new Date(formattedShipmentId)
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    return months[date.getMonth()] + " " + (date.getDate() + 1) + " " + date.getFullYear()
}

export function calculateVolumeWeight(length: number, width: number, height: number) {
    return (length * width * height) / 366
}

export function calculateTotalWeight(array: Array<any>) {
    return array.reduce((total, item) => total + item.weight, 0)
}


export function calculateUnpaidWeight(array: Array<any>) {
    return array.reduce((total, item) => total + item.paid ? 0 : item.weight, 0)
}

export function calculateAmountOwed(weight: number, country: string) {

    if (country == "NG") {
        if (weight < 5) {
            return "$" + weight * 20
        }
        else if (weight < 10) {
            return "$" + weight * 15
        }
        else {
            return "$" + weight * 12
        }
    }

    if (country == "CA") {
        if (weight < 100){
            return "₦" + weight * 3000
        }
        else {
            return "₦" + weight * 2900
        }
    }

}

export function parseDestination(destination: string) {
    if (destination == "NG") {
        return "To Nigeria 🇳🇬"
    }

    if (destination == "CA") {
        return "To Canada 🇨🇦"
    }

    return "To"
}