export const EMPLOYEES = ["53149202-00f2-42b9-8103-cbdbe2d9b9e3", "7ae47660-d774-4b76-a2a0-2aaecbd1ee86", "b3faf80a-8ab0-45a2-bded-ea31a80daf98"]

export function groupBy(arr: Array<any>, properties: Array<any>) {
    let grouped = <any>{};
    
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
    return Math.round((length * width * height) / 366)
}

export function calculateTotalWeight(array: Array<any>) {
    return array.reduce((total, item) => total + item.weight, 0)
}


export function calculateUnpaidWeight(array: Array<any>) {
    return array.reduce((total, item) => total + item.paid ? 0 : item.weight, 0)
}

export function calculateAmountOwed(weight: number, destination: string, method: string) {

    if (destination == "NG") {
        if (method == "AIR") {
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
        if (method == "SEA") {
            return "Contact us for pricing"
        }
    }

    if (destination == "CA") {
        if (method == "AIR") {
            if (weight < 100) {
                return "₦" + weight * 3000
            }
            else {
                return "₦" + weight * 2900
            }
        }
        if (method == "SEA") {
            return "Contact us for pricing"
        }
    }


}

export function parseDestinationAndMethod(destination: string, method: string) {

    if (destination == "NG") {
        if (method == "AIR") {

            return "To Nigeria 🇳🇬 by ✈️"

        }
        if (method == "SEA") {
            return "To Nigeria 🇳🇬 by 🚢"
        }
    }

    if (destination == "CA") {
        if (method == "AIR") {

            return "To Canada 🇨🇦 by ✈️"

        }
        if (method == "SEA") {

            return "To Canada 🇨🇦 by 🚢"

        }
    }

    return "To"
}

export function getShipmentStatus(shipments: Array<any>, shipment: any, destination: any, method: any) {
    return shipments.find((s: { id: any; destination: any; method: any; }) => s.id == shipment && s.destination == destination && s.method == method).status
}

export function getCargoBoxes(boxes: any[], shipment: string, cargo: any, destination: string, method: string) {
    return boxes.filter((box: { shipment: string; cargo: any; destination: string; method: string; }) => box.shipment == shipment && box.cargo == cargo && box.destination == destination && box.method == method)
}

export function getShipmentId(){
    //gets the next Friday
    const d = new Date();
    d.setDate(d.getDate() + (((1 + 11 - d.getDay()) % 7) || 7));

    return ((d.getFullYear() % 100) * 10000) + ((d.getMonth() + 1) * 100) + d.getDate()
}

export function isEmployee(user: string){
    return EMPLOYEES.includes(user)
}

export function keyToAlphabet(key: number){
    return String.fromCharCode(64 + key)
}