"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckoutStepperProps {
    currentStep: number;
}

const steps = [
    { id: 1, name: "Cart", label: "Shopping Cart" },
    { id: 2, name: "Shipping", label: "Shipping Info" },
    { id: 3, name: "Payment", label: "Payment" },
    { id: 4, name: "Review", label: "Review Order" },
];

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
    return (
        <div className="w-full py-6">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center flex-1">
                        {/* Step Circle */}
                        <div className="flex flex-col items-center relative">
                            <div
                                className={cn(
                                    "h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center font-semibold text-sm md:text-base transition-all duration-300",
                                    currentStep > step.id
                                        ? "bg-primary text-primary-foreground"
                                        : currentStep === step.id
                                            ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                                            : "bg-gray-200 text-gray-500"
                                )}
                            >
                                {currentStep > step.id ? (
                                    <Check className="h-5 w-5 md:h-6 md:w-6" />
                                ) : (
                                    step.id
                                )}
                            </div>

                            {/* Step Label */}
                            <span
                                className={cn(
                                    "absolute -bottom-6 text-xs md:text-sm font-medium whitespace-nowrap transition-colors",
                                    currentStep >= step.id ? "text-primary" : "text-gray-500"
                                )}
                            >
                                <span className="hidden md:inline">{step.label}</span>
                                <span className="md:hidden">{step.name}</span>
                            </span>
                        </div>

                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                            <div
                                className={cn(
                                    "flex-1 h-1 mx-2 md:mx-4 rounded-full transition-all duration-300",
                                    currentStep > step.id ? "bg-primary" : "bg-gray-200"
                                )}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
