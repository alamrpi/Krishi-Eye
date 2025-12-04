import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, label, ...props }, ref) => {
        const id = props.id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id={id}
                    ref={ref}
                    className={cn(
                        "h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary/20 focus:ring-offset-0 transition-colors cursor-pointer",
                        className
                    )}
                    {...props}
                />
                {label && (
                    <label htmlFor={id} className="text-sm font-medium leading-none cursor-pointer select-none">
                        {label}
                    </label>
                )}
            </div>
        );
    }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
