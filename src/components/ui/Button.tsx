import React, { ButtonHTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    children,
    disabled,
    ...props
}) => {
    const base = 'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap select-none';

    /* (variants object removed) */

    const variantClasses = {
        primary: 'text-black shadow-md hover:brightness-110 active:scale-95',
        secondary: 'text-sm font-medium hover:brightness-95 active:scale-95',
        danger: 'text-white font-semibold shadow-md hover:brightness-110 active:scale-95',
        outline: 'font-semibold hover:text-black active:scale-95',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    const getStyle = (): React.CSSProperties => {
        switch (variant) {
            case 'primary':
                return {
                    background: 'linear-gradient(135deg, var(--color-gold-400) 0%, var(--color-gold-600) 100%)',
                    boxShadow: '0 0 12px rgba(245,158,11,0.3)',
                    color: '#030712',
                };
            case 'secondary':
                return {
                    background: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border-subtle)',
                    color: 'var(--color-text-primary)',
                };
            case 'danger':
                return {
                    background: 'rgb(220 38 38)',
                    boxShadow: '0 0 10px rgba(220,38,38,0.3)',
                    color: '#fff',
                };
            case 'outline':
                return {
                    border: '2px solid var(--color-gold-500)',
                    color: 'var(--color-gold-500)',
                    background: 'transparent',
                };
            default:
                return {};
        }
    };

    return (
        <button
            className={cn(base, variantClasses[variant], sizes[size], className)}
            style={{ ...getStyle(), ...props.style }}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin -ml-0.5 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Procesando...
                </>
            ) : children}
        </button>
    );
};
