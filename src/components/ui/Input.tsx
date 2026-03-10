import React, { InputHTMLAttributes } from 'react';
import { cn } from './Button';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className, id, style, ...props }) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-sm font-medium"
                    style={{ color: 'var(--color-text-secondary)' }}
                >
                    {label}
                </label>
            )}
            <div className="relative group">
                {icon && (
                    <div
                        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-gold-500"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        {icon}
                    </div>
                )}
                <input
                    id={inputId}
                    className={cn(
                        'w-full px-4 py-2.5 rounded-lg text-sm transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-yellow-500/40 focus:border-yellow-500',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        icon && 'pl-10',
                        error && 'border-red-500 focus:ring-red-500/40',
                        className
                    )}
                    style={{
                        background: 'var(--color-input-bg)',
                        border: `1px solid ${error ? 'rgb(239 68 68)' : 'var(--color-input-border)'}`,
                        color: 'var(--color-text-primary)',
                        ...style
                    }}
                    {...props}
                />
            </div>
            {error && (
                <span className="text-xs text-red-500 mt-0.5">{error}</span>
            )}
        </div>
    );
};

/* ── Select helper (consistent styling with Input) ── */
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
}

export const Select: React.FC<SelectProps> = ({ label, id, children, className, style, ...props }) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label
                    htmlFor={selectId}
                    className="text-sm font-medium"
                    style={{ color: 'var(--color-text-secondary)' }}
                >
                    {label}
                </label>
            )}
            <select
                id={selectId}
                className={cn(
                    'w-full px-4 py-2.5 rounded-lg text-sm transition-all duration-200 appearance-none',
                    'focus:outline-none focus:ring-2 focus:ring-yellow-500/40 focus:border-yellow-500',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    className
                )}
                style={{
                    background: 'var(--color-input-bg)',
                    border: '1px solid var(--color-input-border)',
                    color: 'var(--color-text-primary)',
                    ...style
                }}
                {...props}
            >
                {children}
            </select>
        </div>
    );
};
