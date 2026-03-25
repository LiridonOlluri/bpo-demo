export function countIntervalsBelowSlTarget(data: { serviceLevel: number; target: number }[]) {
    return data.filter((d) => d.serviceLevel < d.target).length
}
