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
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-gold-500 text-dark-950 hover:bg-gold-400 shadow-[0_0_10px_rgba(245,158,11,0.3)] hover:shadow-[0_0_15px_rgba(245,158,11,0.5)]',
        secondary: 'bg-dark-800 text-white hover:bg-dark-700 border border-dark-700',
        danger: 'bg-red-600 text-white hover:bg-red-500 shadow-[0_0_10px_rgba(220,38,38,0.3)]',
        outline: 'border-2 border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-dark-950',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                </>
            ) : children}
        </button>
    );
};
