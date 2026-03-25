'use client'

import { useMemo, useState, useCallback } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight, ArrowLeft } from 'lucide-react'
import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { SearchInput } from '@/components/molecules/SearchInput'
import {
    INDICATOR_CATEGORIES,
    MODULE_FEATURE_COUNTS,
    SMART_LEAVE_STATES,
    FTE_LOSS_ENGINE_CATEGORIES,
    SPEC_VERSION,
} from '@/lib/specRegistry'
import { DEMO_DEFAULTS } from '@/lib/constants'
import { cn } from '@/lib/utils'

type ModuleTagFilter = 'all' | 'F' | 'V' | 'P'
type LetterFilter = 'all' | (typeof INDICATOR_CATEGORIES)[number]['id']

export default function IndicatorsCatalogPage() {
    const [query, setQuery] = useState('')
    const [letterFilter, setLetterFilter] = useState<LetterFilter>('all')
    const [moduleTag, setModuleTag] = useState<ModuleTagFilter>('all')
    const [openCats, setOpenCats] = useState<Set<string>>(() => new Set(INDICATOR_CATEGORIES.map((c) => c.id)))

    const toggleCat = useCallback((id: string) => {
        setOpenCats((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }, [])

    const expandAll = useCallback(() => {
        setOpenCats(new Set(INDICATOR_CATEGORIES.map((c) => c.id)))
    }, [])

    const collapseAll = useCallback(() => {
        setOpenCats(new Set())
    }, [])

    const filteredModules = useMemo(() => {
        return MODULE_FEATURE_COUNTS.filter((m) => {
            if (moduleTag === 'all') return true
            if (moduleTag === 'F') return m.functional > 0
            if (moduleTag === 'V') return m.visible > 0
            return m.premium > 0
        })
    }, [moduleTag])

    const modTotals = useMemo(
        () =>
            filteredModules.reduce(
                (a, m) => ({
                    total: a.total + m.total,
                    f: a.f + m.functional,
                    v: a.v + m.visible,
                    p: a.p + m.premium,
                }),
                { total: 0, f: 0, v: 0, p: 0 }
            ),
        [filteredModules]
    )

    const filteredCategories = useMemo(() => {
        const q = query.trim().toLowerCase()
        return INDICATOR_CATEGORIES.filter((cat) => {
            if (letterFilter !== 'all' && cat.id !== letterFilter) return false
            if (!q) return true
            return (
                cat.name.toLowerCase().includes(q) ||
                cat.id.toLowerCase().includes(q) ||
                cat.items.some((item) => item.toLowerCase().includes(q))
            )
        })
    }, [query, letterFilter])

    const totalIndicators = filteredCategories.reduce((s, c) => s + c.count, 0)

    const letterIds = INDICATOR_CATEGORIES.map((c) => c.id)

    return (
        <DashboardTemplate
            title="Indicator & module registry"
            actions={
                <Link href="/settings" className="inline-flex items-center gap-2 text-sm font-medium text-brand-gray hover:text-foreground">
                    <ArrowLeft size={16} />
                    Back to Settings
                </Link>
            }
        >
            <p className="mb-6 text-sm text-brand-gray">
                Reference: meTru ERP — BPO <span className="font-medium text-foreground">{SPEC_VERSION}</span>. Demo baseline:{' '}
                <span className="font-medium">{DEMO_DEFAULTS.agentCount}</span> agents,{' '}
                <span className="font-medium">{DEMO_DEFAULTS.teamCount}</span> teams, {DEMO_DEFAULTS.clientCount} clients. Use search and filters
                below — sections expand/collapse for scanning.
            </p>

            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-md flex-1">
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-brand-gray">Search indicators</label>
                    <SearchInput
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Name, ID (e.g. F2), or keyword…"
                        aria-label="Search indicators"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="secondary" size="sm" onClick={expandAll}>
                        Expand all
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={collapseAll}>
                        Collapse all
                    </Button>
                </div>
            </div>

            <div className="mb-8">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-brand-gray">Category (A–K)</p>
                <div className="flex flex-wrap gap-1">
                    <button
                        type="button"
                        onClick={() => setLetterFilter('all')}
                        className={cn(
                            'rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors',
                            letterFilter === 'all'
                                ? 'border-brand-green bg-brand-green/10 text-brand-green'
                                : 'border-surface-border bg-surface text-brand-gray hover:text-foreground'
                        )}
                    >
                        All
                    </button>
                    {letterIds.map((id) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setLetterFilter((prev) => (prev === id ? 'all' : id))}
                            className={cn(
                                'rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors',
                                letterFilter === id
                                    ? 'border-brand-green bg-brand-green/10 text-brand-green'
                                    : 'border-surface-border bg-surface text-brand-gray hover:text-foreground'
                            )}
                        >
                            {id}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray">Total features (filtered modules)</p>
                    <p className="mt-1 text-2xl font-bold">{modTotals.total}</p>
                </Card>
                <Card className="p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray">Functional [F]</p>
                    <p className="mt-1 text-2xl font-bold text-status-green">{modTotals.f}</p>
                </Card>
                <Card className="p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray">Visible [V]</p>
                    <p className="mt-1 text-2xl font-bold text-brand-blue">{modTotals.v}</p>
                </Card>
                <Card className="p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray">Premium [P]</p>
                    <p className="mt-1 text-2xl font-bold text-brand-gray">{modTotals.p}</p>
                </Card>
            </div>

            <Card className="mb-8">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-lg font-semibold">Modules (feature counts)</h2>
                    <div className="flex flex-wrap gap-1">
                        {(['all', 'F', 'V', 'P'] as const).map((tag) => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => setModuleTag(tag)}
                                className={cn(
                                    'rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors',
                                    moduleTag === tag
                                        ? 'border-brand-green bg-brand-green/10 text-brand-green'
                                        : 'border-surface-border bg-surface text-brand-gray hover:text-foreground'
                                )}
                            >
                                {tag === 'all' ? 'All rows' : `[${tag}] only`}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-surface-border text-left text-brand-gray">
                                <th className="p-2 font-medium">Module</th>
                                <th className="p-2 text-right font-medium">Total</th>
                                <th className="p-2 text-right font-medium">F</th>
                                <th className="p-2 text-right font-medium">V</th>
                                <th className="p-2 text-right font-medium">P</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredModules.map((m) => (
                                <tr key={m.module} className="border-b border-surface-border/80">
                                    <td className="p-2">{m.module}</td>
                                    <td className="p-2 text-right font-medium">{m.total}</td>
                                    <td className="p-2 text-right text-status-green">{m.functional}</td>
                                    <td className="p-2 text-right text-brand-blue">{m.visible}</td>
                                    <td className="p-2 text-right">{m.premium}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredModules.length === 0 && <p className="py-4 text-center text-sm text-brand-gray">No modules match this tag filter.</p>}
                <p className="mt-3 text-xs text-brand-gray">
                    [F] Interactive in demo · [V] UI only · [P] Greyed / Premium lane in product
                </p>
            </Card>

            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-lg font-semibold">
                    Configurable indicators ({totalIndicators} shown · {filteredCategories.length} categories)
                </h2>
                {query.trim() && filteredCategories.length < INDICATOR_CATEGORIES.length && (
                    <Badge variant="grey">
                        {INDICATOR_CATEGORIES.length - filteredCategories.length} categories hidden by search
                    </Badge>
                )}
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
                {filteredCategories.map((cat) => {
                    const isOpen = openCats.has(cat.id)
                    return (
                        <Card key={cat.id} className="overflow-hidden p-0">
                            <button
                                type="button"
                                onClick={() => toggleCat(cat.id)}
                                className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left transition-colors hover:bg-surface-muted/80"
                                aria-expanded={isOpen}
                            >
                                <span className="font-semibold">
                                    {cat.id}. {cat.name}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Badge variant="grey">{cat.count}</Badge>
                                    {isOpen ? <ChevronDown size={18} className="shrink-0 text-brand-gray" /> : <ChevronRight size={18} className="shrink-0 text-brand-gray" />}
                                </span>
                            </button>
                            {isOpen && (
                                <ul className="list-inside list-disc space-y-1 border-t border-surface-border px-4 pb-4 pt-0 text-xs text-brand-gray">
                                    {cat.items.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            )}
                        </Card>
                    )
                })}
            </div>
            {filteredCategories.length === 0 && (
                <p className="mt-6 rounded-lg border border-dashed border-surface-border p-8 text-center text-sm text-brand-gray">
                    No indicator categories match your filters. Clear search or set category to All.
                </p>
            )}

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <Card className="p-4">
                    <h3 className="mb-3 font-semibold">Smart leave push — states</h3>
                    <ul className="space-y-2 text-sm">
                        {SMART_LEAVE_STATES.map((s) => (
                            <li key={s.state}>
                                <span className="font-medium">
                                    State {s.state} — {s.name}:
                                </span>{' '}
                                <span className="text-brand-gray">{s.summary}</span>
                            </li>
                        ))}
                    </ul>
                </Card>
                <Card className="p-4">
                    <h3 className="mb-3 font-semibold">FTE loss engine — categories</h3>
                    <ul className="list-inside list-disc text-sm text-brand-gray">
                        {FTE_LOSS_ENGINE_CATEGORIES.map((c) => (
                            <li key={c}>{c}</li>
                        ))}
                    </ul>
                </Card>
            </div>
        </DashboardTemplate>
    )
}
