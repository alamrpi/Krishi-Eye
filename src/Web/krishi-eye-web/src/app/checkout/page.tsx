"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { CheckoutStepper } from "@/components/checkout/CheckoutStepper";
import { ShippingForm, type ShippingFormData } from "@/components/checkout/ShippingForm";
import { PaymentMethod, type PaymentMethodData, type PaymentMethodType } from "@/components/checkout/PaymentMethod";
import { OrderReview } from "@/components/checkout/OrderReview";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
    const router = useRouter();
    const { items, itemCount, subtotal, deliveryCharge, discount, total, clearCart } = useCart();

    const [currentStep, setCurrentStep] = useState(2); // Start at shipping (step 2)
    const [isProcessing, setIsProcessing] = useState(false);

    // Shipping form state
    const [shippingData, setShippingData] = useState<ShippingFormData>({
        fullName: "",
        phone: "",
        email: "",
        division: "",
        district: "",
        upazila: "",
        address: "",
        saveAddress: false,
    });

    const [shippingErrors, setShippingErrors] = useState<Record<string, string>>({});

    // Payment form state
    const [paymentData, setPaymentData] = useState<PaymentMethodData>({
        method: "cod",
    });

    // Order review state
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // Redirect if cart is empty
    useEffect(() => {
        if (itemCount === 0) {
            router.push("/cart");
        }
    }, [itemCount, router]);

    const validateShippingForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!shippingData.fullName.trim()) errors.fullName = "Full name is required";
        if (!shippingData.phone.trim()) errors.phone = "Phone number is required";
        else if (!/^01[0-9]{9}$/.test(shippingData.phone.replace(/\s/g, ""))) {
            errors.phone = "Please enter a valid Bangladesh phone number";
        }

        if (!shippingData.division) errors.division = "Division is required";
        if (!shippingData.district.trim()) errors.district = "District is required";
        if (!shippingData.upazila.trim()) errors.upazila = "Upazila is required";
        if (!shippingData.address.trim()) errors.address = "Address is required";

        setShippingErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleContinueToPayment = () => {
        if (validateShippingForm()) {
            setCurrentStep(3);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleContinueToReview = () => {
        setCurrentStep(4);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handlePlaceOrder = async () => {
        setIsProcessing(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Clear cart and redirect to success page (you can create this later)
        clearCart();
        alert("Order placed successfully! Order ID: #" + Math.random().toString(36).substr(2, 9).toUpperCase());
        router.push("/");

        setIsProcessing(false);
    };

    if (itemCount === 0) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 md:px-8 py-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-gray-500 hover:text-primary flex items-center gap-1">
                            <Home className="h-4 w-4" />
                            Home
                        </Link>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <Link href="/cart" className="text-gray-500 hover:text-primary">
                            Cart
                        </Link>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">Checkout</span>
                    </div>
                </div>
            </div>

            {/* Page Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 md:px-8 py-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
                    <p className="text-gray-600">Complete your order</p>
                </div>
            </div>

            {/* Stepper */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 md:px-8">
                    <CheckoutStepper currentStep={currentStep} />
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 md:px-8 py-8">
                <div className="max-w-5xl mx-auto">
                    {/* Step 2: Shipping Information */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <ShippingForm
                                formData={shippingData}
                                onFormChange={(data) => setShippingData({ ...shippingData, ...data })}
                                errors={shippingErrors}
                            />

                            <div className="flex justify-between items-center">
                                <Link href="/cart">
                                    <Button variant="outline" size="lg" className="rounded-full">
                                        Back to Cart
                                    </Button>
                                </Link>

                                <Button
                                    size="lg"
                                    className="rounded-full px-8"
                                    onClick={handleContinueToPayment}
                                >
                                    Continue to Payment
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Payment Method */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <PaymentMethod
                                selectedMethod={paymentData.method}
                                paymentData={paymentData}
                                onMethodChange={(method: PaymentMethodType) => setPaymentData({ ...paymentData, method })}
                                onPaymentDataChange={(data) => setPaymentData({ ...paymentData, ...data })}
                            />

                            <div className="flex justify-between items-center">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="rounded-full"
                                    onClick={() => setCurrentStep(2)}
                                >
                                    Back to Shipping
                                </Button>

                                <Button
                                    size="lg"
                                    className="rounded-full px-8"
                                    onClick={handleContinueToReview}
                                >
                                    Review Order
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Order Review */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <OrderReview
                                items={items}
                                shippingInfo={shippingData}
                                paymentInfo={paymentData}
                                subtotal={subtotal}
                                deliveryCharge={deliveryCharge}
                                discount={discount}
                                total={total}
                                agreedToTerms={agreedToTerms}
                                onAgreeTerms={setAgreedToTerms}
                                onPlaceOrder={handlePlaceOrder}
                                isProcessing={isProcessing}
                            />

                            <div className="flex justify-center">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="rounded-full"
                                    onClick={() => setCurrentStep(3)}
                                >
                                    Back to Payment
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
