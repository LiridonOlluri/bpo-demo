'use client'

import { createContext, useCallback, useContext, useId, useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'


export interface OpenModalOptions {
    title?: React.ReactNode
    children: React.ReactNode
    footer?: React.ReactNode
    className?: string
}

interface ModalEntry extends OpenModalOptions {
    id: string
}

interface ModalContextValue {
    openModal: (id: string, options: OpenModalOptions) => void
    closeModal: (id: string) => void
}


export const ModalContext = createContext<ModalContextValue | null>(null)

export function useModalContext() {
    const ctx = useContext(ModalContext)
    if (!ctx) throw new Error('useModalContext must be used inside <ModalProvider>')
    return ctx
}


export function ModalProvider({ children }: { children: React.ReactNode }) {
    const [stack, setStack] = useState<ModalEntry[]>([])

    const openModal = useCallback((id: string, options: OpenModalOptions) => {
        setStack((prev) => {
            const exists = prev.find((m) => m.id === id)
            if (exists) return prev.map((m) => (m.id === id ? { ...m, ...options } : m))
            return [...prev, { id, ...options }]
        })
    }, [])

    const closeModal = useCallback((id: string) => {
        setStack((prev) => prev.filter((m) => m.id !== id))
    }, [])

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}

            {stack.map((modal) => (
                <div
                    key={modal.id}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
                    onClick={() => closeModal(modal.id)}
                >
                    <div
                        className={cn(
                            'w-full max-w-md rounded-xl border border-surface-border bg-surface shadow-2xl',
                            modal.className,
                        )}
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                    >
                        {modal.title && (
                            <div className="flex items-center justify-between gap-3 border-b border-surface-border px-5 py-4">
                                <div className="flex-1">{modal.title}</div>
                                <button
                                    type="button"
                                    onClick={() => closeModal(modal.id)}
                                    className="rounded-lg p-1 text-brand-gray transition-colors hover:bg-surface-muted hover:text-foreground"
                                    aria-label="Close"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}

                        <div className="px-5 py-4">{modal.children}</div>

                        {modal.footer && (
                            <div className="border-t border-surface-border px-5 py-3">
                                {modal.footer}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </ModalContext.Provider>
    )
}
