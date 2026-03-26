'use client'

import { useEffect, useId } from 'react'
import { useModalContext, type OpenModalOptions } from '@/providers/ModalProvider'

interface ModalProps extends Omit<OpenModalOptions, 'children'> {
    open: boolean
    onClose: () => void
    children: React.ReactNode
}

export function Modal({ open, onClose, title, children, footer, className }: ModalProps) {
    const id = useId()
    const { openModal, closeModal } = useModalContext()

    useEffect(() => {
        if (open) {
            openModal(id, {
                title,
                children,
                footer,
                className,
            })
        } else {
            closeModal(id)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    useEffect(() => {
        if (!open) return
        openModal(id, { title, children, footer, className })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [title, children, footer, className])

    // Close via Escape key
    useEffect(() => {
        if (!open) return
        const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', handleKey)
        return () => document.removeEventListener('keydown', handleKey)
    }, [open, onClose])

    useEffect(() => () => { closeModal(id) }, [id, closeModal])

    return null
}
