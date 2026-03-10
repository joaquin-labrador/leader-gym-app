import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
    // ESC key to close
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const maxWidths = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className={`w-full ${maxWidths[size]} rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200`}
                style={{
                    background: 'var(--color-modal-bg)',
                    border: '1px solid var(--color-border-subtle)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-6 py-4"
                    style={{ borderBottom: '1px solid var(--color-border)' }}
                >
                    <h3
                        className="text-lg font-bold"
                        style={{ color: 'var(--color-text-primary)' }}
                    >
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: 'var(--color-text-muted)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text-primary)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                        aria-label="Cerrar"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-6" style={{ color: 'var(--color-text-primary)' }}>
                    {children}
                </div>

                {/* Footer */}
                <div
                    className="px-6 py-4 flex justify-end gap-3"
                    style={{ background: 'var(--color-bg-base)', borderTop: '1px solid var(--color-border)' }}
                >
                    {footer ?? (
                        <Button onClick={onClose} variant="secondary">Cerrar</Button>
                    )}
                </div>
            </div>
        </div>
    );
};
