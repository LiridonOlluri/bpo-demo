export function formatCurrency(value: number, currency = 'EUR'): string {
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency }).format(value)
}

export function formatPercentage(value: number, decimals = 1): string {
    return `${(value * 100).toFixed(decimals)}%`
}

export function formatSeconds(seconds: number): string {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${String(s).padStart(2, '0')}`
}

export function formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
    }).format(new Date(date))
}

export function formatTime(time: string): string {
    return time.slice(0, 5)
}

export function cn(...classes: (string | false | null | undefined)[]): string {
    return classes.filter(Boolean).join(' ')
}

export function getISOWeek(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}
