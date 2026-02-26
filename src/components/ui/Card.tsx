import React, { HTMLAttributes } from 'react';
import { cn } from './Button';

export const Card: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
    return (
        <div
            className={cn(
                "bg-dark-900 border border-dark-800 rounded-xl shadow-lg overflow-hidden",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
    return (
        <div className={cn("px-6 py-4 border-b border-dark-800", className)} {...props}>
            {children}
        </div>
    );
};

export const CardContent: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
    return (
        <div className={cn("p-6", className)} {...props}>
            {children}
        </div>
    );
};
