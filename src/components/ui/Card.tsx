import React, { HTMLAttributes } from 'react';
import { cn } from './Button';

export const Card: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className, children, style, ...props }) => {
    return (
        <div
            className={cn('rounded-xl overflow-hidden transition-colors duration-200', className)}
            style={{
                background: 'var(--color-card-bg)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-card)',
                ...style
            }}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className, children, style, ...props }) => {
    return (
        <div
            className={cn('px-6 py-4 border-b', className)}
            style={{ borderColor: 'var(--color-border)', ...style }}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardContent: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
    return (
        <div className={cn('p-6', className)} {...props}>
            {children}
        </div>
    );
};

export const CardTitle: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({ className, children, ...props }) => {
    return (
        <h3
            className={cn('text-xl font-bold', className)}
            style={{ color: 'var(--color-text-primary)' }}
            {...props}
        >
            {children}
        </h3>
    );
};
