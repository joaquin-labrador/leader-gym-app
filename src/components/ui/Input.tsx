import React, { InputHTMLAttributes } from 'react';
import { cn } from './Button';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className, ...props }) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
            <div className="relative group">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-gold-500">
                        {icon}
                    </div>
                )}
                <input
                    className={cn(
                        "w-full px-4 py-2.5 bg-dark-900 border border-dark-700 rounded-lg text-white placeholder-gray-500",
                        "focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        icon && "pl-10",
                        error && "border-red-500 focus:ring-red-500/50",
                        className
                    )}
                    {...props}
                />
            </div>
            {error && <span className="text-xs text-red-400 mt-1">{error}</span>}
        </div>
    );
};
