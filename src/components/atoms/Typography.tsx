import React from 'react'
import { cn } from '@/lib/utils'

type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'overline'
type HtmlTag = keyof React.JSX.IntrinsicElements

const styles: Record<Variant, string> = {
    h1: 'text-3xl font-bold tracking-tight',
    h2: 'text-2xl font-semibold tracking-tight',
    h3: 'text-xl font-semibold',
    h4: 'text-lg font-medium',
    body: 'text-sm',
    caption: 'text-xs text-brand-gray',
    overline: 'text-xs font-semibold uppercase tracking-wider text-brand-gray',
}

const tags: Record<Variant, HtmlTag> = {
    h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', body: 'p', caption: 'p', overline: 'p',
}

interface TypographyProps {
    variant?: Variant
    children: React.ReactNode
    className?: string
    as?: HtmlTag
}

export function Typography({ variant = 'body', children, className, as }: TypographyProps) {
    const Tag = (as ?? tags[variant]) as React.ElementType
    return <Tag className={cn(styles[variant], className)}>{children}</Tag>
}
