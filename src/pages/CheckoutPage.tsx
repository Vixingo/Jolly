import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { Separator } from "../components/ui/separator";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import { z } from "zod";
import { clearCart } from "../store/slices/cartSlice";
import { useFormatCurrency } from "../lib/utils";
import WhatsAppButton from "../components/support/WhatsAppButton";
import {
    getAvailablePaymentMethods,
    initializePayment,
    type PaymentRequest,
} from "../lib/payment-gateways";
import { handleInvoiceRequest } from "../lib/emailService";
import { CreditCard, Smartphone } from "lucide-react";
import enhancedTracking from "../lib/event-tracking";

const checkoutSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    phoneNumber: z
        .string()
        .refine(
            (value) => {
                const digitsOnly = value.replace(/\D/g, "");
                return digitsOnly.length <= 11;
            },
            {
                message: "Phone number cannot exceed 11 digits",
            }
        )
        .refine(
            (value) => {
                const digitsOnly = value.replace(/\D/g, "");
                return digitsOnly.length === 11;
            },
            {
                message: "Phone number must be exactly 11 digits",
            }
        ),
    address: z.string().min(10, "Please enter a complete address"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { items, total } = useAppSelector((state) => state.cart);
    const { user } = useAppSelector((state) => state.auth);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<
        Partial<Record<keyof CheckoutFormData, string>>
    >({});
    const [formData, setFormData] = useState<CheckoutFormData>({
        fullName: "",
        phoneNumber: "",
        address: "",
    });
    const [paymentMethods, setPaymentMethods] = useState<
        Array<{ id: string; name: string; enabled: boolean }>
    >([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] =
        useState<string>("cod");
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [needInvoice, setNeedInvoice] = useState(false);
    const [invoiceEmail, setInvoiceEmail] = useState("");
    const formatCurrency = useFormatCurrency();

    // Add delivery charge to total
    const deliveryCharge = 150;
    const finalTotal = total + deliveryCharge;

    // Load available payment methods
    useEffect(() => {
        const loadPaymentMethods = async () => {
            try {
                const methods = await getAvailablePaymentMethods();
                setPaymentMethods(methods);
            } catch (error) {
                console.error("Error loading payment methods:", error);
            }
        };
        loadPaymentMethods();
    }, []);

    // Track BeginCheckout event when component mounts with items (only once)
    useEffect(() => {
        if (items.length > 0) {
            const trackingProducts = items.map(item => ({
                item_id: item.id,
                item_name: item.name,
                item_category: item.category,
                price: item.price,
                quantity: item.quantity,
                currency: 'BDT'
            }));

            enhancedTracking.beginCheckout(trackingProducts, {
                currency: 'BDT',
                value: finalTotal
            });
        }
    }, [items.length > 0]); // Only trigger when items are first loaded

    const validateField = (field: keyof CheckoutFormData, value: string) => {
        try {
            checkoutSchema.shape[field].parse(value);
            setErrors((prev) => ({ ...prev, [field]: undefined }));
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors((prev) => ({
                    ...prev,
                    [field]: error.issues[0].message,
                }));
            }
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check for empty fields and show specific messages
        const emptyFields: string[] = [];
        if (!formData.fullName) emptyFields.push("Full Name");
        if (!formData.phoneNumber) emptyFields.push("Phone Number");
        if (!formData.address) emptyFields.push("Shipping Address");

        if (emptyFields.length > 0) {
            toast.error(`Please fill in: ${emptyFields.join(", ")}`);
            return;
        }

        // Validate all fields
        const isValid = Object.entries(formData).every(([field, value]) =>
            validateField(field as keyof CheckoutFormData, value)
        );

        if (!isValid) {
            toast.error("সবকিছু ঠিক আছে কি না চেক করুন ");
            return;
        }

        try {
            setIsLoading(true);

            const addressData = {
                full_name: formData.fullName,
                address_line1: formData.address,
                address_line2: "",
                city: "",
                state: "",
                postal_code: "",
                country: "US",
            };

            const orderDetails = {
                user_id: user?.id || null,
                total: finalTotal, // This already includes the delivery charge
                items: items.map((item) => ({
                    product_id: item.id,
                    product_name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    subtotal: item.price * item.quantity,
                })),
                shipping_address: addressData,
                billing_address: addressData, // Use same address for billing
                payment_status:
                    selectedPaymentMethod === "cod" ? "unpaid" : "pending",
                payment_method: selectedPaymentMethod,
                customer_phone: formData.phoneNumber,
                customer_email: user?.email || null,
                invoice_requested:
                    selectedPaymentMethod !== "cod" && needInvoice,
                invoice_email:
                    selectedPaymentMethod !== "cod" && needInvoice
                        ? invoiceEmail
                        : null,
                status: "pending" as const,
                tracking_number: null,
            };

            const { data, error } = await supabase
                .from("orders")
                .insert([orderDetails])
                .select()
                .single();

            if (error) throw error;

            // Handle payment processing for online payments
            if (selectedPaymentMethod !== "cod") {
                await handleOnlinePayment(data);
                return;
            }

            // Handle invoice request if needed
            if (data.invoice_requested && data.invoice_email) {
                await handleInvoiceRequest(data.id);
            }

            // Track Purchase event for COD orders
            const trackingProducts = items.map(item => ({
                item_id: item.id,
                item_name: item.name,
                item_category: item.category,
                price: item.price,
                quantity: item.quantity,
                currency: 'BDT'
            }));

            enhancedTracking.purchase(data.id, trackingProducts, {
                currency: 'BDT',
                value: finalTotal,
                transaction_id: data.id,
                payment_type: selectedPaymentMethod
            });

            // Clear the cart after successful order placement
            dispatch(clearCart());

            toast.success("Order placed successfully!");
            navigate("/thank-you", { state: { orderDetails: data } });
        } catch (error) {
            console.error("Error placing order:", error);
            toast.error("ফোন নাম্বার কি সঠিক না চেক করুন");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOnlinePayment = async (orderData: any) => {
        try {
            setIsProcessingPayment(true);

            const paymentRequest: PaymentRequest = {
                amount: finalTotal,
                currency: "BDT",
                order_id: orderData.id,
                customer_name: formData.fullName,
                customer_email: user?.email,
                customer_phone: formData.phoneNumber,
                customer_address: formData.address,
                success_url: `${window.location.origin}/payment-success?order_id=${orderData.id}`,
                fail_url: `${window.location.origin}/payment-failed?order_id=${orderData.id}`,
                cancel_url: `${window.location.origin}/checkout`,
            };

            const paymentResponse = await initializePayment(
                selectedPaymentMethod as "sslcommerz" | "bkash",
                paymentRequest
            );

            if (paymentResponse.success && paymentResponse.payment_url) {
                // Clear cart before redirecting to payment
                dispatch(clearCart());

                // Redirect to payment gateway
                window.location.href = paymentResponse.payment_url;
            } else {
                toast.error(
                    paymentResponse.error || "Failed to initialize payment"
                );
            }
        } catch (error) {
            console.error("Payment initialization error:", error);
            toast.error("Failed to process payment");
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const handleFieldChange = (
        field: keyof CheckoutFormData,
        value: string
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        validateField(field, value);
    };

    return (
        <div className="container mx-auto px-4 pb-8 max-w-3xl">
            <div className="space-y-4">

                            {/* Order Summary Section */}
                            <div className="mt-6 p-3 bg-muted rounded-lg">
                                <h3 className="text-sm font-medium mb-2">
                                    Order Summary
                                </h3>
                                <div className="space-y-2 text-sm">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <div className="w-10 h-10 rounded-md overflow-hidden bg-muted">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                                                        {item.quantity}
                                                    </div>
                                                </div>
                                                <span className="font-medium truncate max-w-[150px]">
                                                    {item.name}
                                                </span>
                                            </div>
                                            <span>
                                                {formatCurrency(
                                                    item.price * item.quantity
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="border-t pt-2 mt-2">
                                        <div className="flex justify-between">
                                            <span>Subtotal</span>
                                            <span>{formatCurrency(total)}</span>
                                        </div>
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>Delivery Charge</span>
                                            <span>
                                                {formatCurrency(deliveryCharge)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between font-medium text-lg mt-2">
                                            <span>Total</span>
                                            <span>
                                                {formatCurrency(finalTotal)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                {/* Shipping Information Card */}
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle>অর্ডার করতে নিচের তথ্যগুলি দিন </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4 ">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label
                                        htmlFor="fullName"
                                        className="text-sm font-medium"
                                    >
                                        নাম
                                    </Label>
                                    <Input
                                        id="fullName"
                                        value={formData.fullName}
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "fullName",
                                                e.target.value
                                            )
                                        }
                                        className={`mt-1 ${
                                            errors.fullName
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                        placeholder="আপনার নাম"
                                        autoFocus
                                        required 
                                    />
                                </div>

                                <div>
                                    <Label
                                        htmlFor="phoneNumber"
                                        className="text-sm font-medium"
                                    >
                                        মোবাইল নাম্বার
                                    </Label>

                                    <Input
                                        id="phoneNumber"
                                        required 
                                        type="tel"
                                        value={formData.phoneNumber}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const digitsOnly = value.replace(
                                                /\D/g,
                                                ""
                                            );
                                            if (digitsOnly.length <= 11) {
                                                handleFieldChange(
                                                    "phoneNumber",
                                                    value
                                                );
                                            }
                                        }}
                                        className={`mt-1 ${
                                            errors.phoneNumber
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                        placeholder=" ১১ ডিজিট মোবাইল নাম্বার"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label
                                    htmlFor="address"
                                    className="text-sm font-medium"
                                >
ঠিকানা                                </Label>
                                <Textarea
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            "address",
                                            e.target.value
                                        )
                                    }
                                    className={`mt-1 ${
                                        errors.address ? "border-red-500" : ""
                                    }`}
                                    placeholder="আপনার বাসার সম্পূর্ণ ঠিকানা"
                                    rows={3}
                                />
                            </div>

                            {/* Payment Method Selection */}
                            <div className="space-y-4">
                                <Label className="text-sm font-medium">
                                    Payment Method
                                </Label>
                                <RadioGroup
                                    value={selectedPaymentMethod}
                                    onValueChange={setSelectedPaymentMethod}
                                    className="space-y-3"
                                >
                                    {/* Cash on Delivery - Always Available */}
                                    <div
                                        className={`flex items-center space-x-3 p-3 border rounded-lg transition-all ${
                                            selectedPaymentMethod === "cod"
                                                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        <RadioGroupItem value="cod" id="cod" />
                                        <Label
                                            htmlFor="cod"
                                            className="flex items-center gap-2 cursor-pointer flex-1"
                                        >
                                            <CreditCard className="h-4 w-4" />
                                            <span> ক্যাশ অন ডেলিভারি</span>
                                        </Label>
                                    </div>

                                    {/* Online Payment Methods */}
                                    {paymentMethods.length > 0 &&
                                        paymentMethods.map((method) => (
                                            <div
                                                key={method.id}
                                                className={`flex items-center space-x-3 p-3 border rounded-lg transition-all ${
                                                    selectedPaymentMethod ===
                                                    method.id
                                                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                            >
                                                <RadioGroupItem
                                                    value={method.id}
                                                    id={method.id}
                                                />
                                                <Label
                                                    htmlFor={method.id}
                                                    className="flex items-center gap-2 cursor-pointer flex-1"
                                                >
                                                    {method.id === "bkash" ? (
                                                        <Smartphone className="h-4 w-4" />
                                                    ) : (
                                                        <CreditCard className="h-4 w-4" />
                                                    )}
                                                    <span>{method.name}</span>
                                                    <span className="text-xs text-muted-foreground ml-auto">
                                                        Pay Online
                                                    </span>
                                                </Label>
                                            </div>
                                        ))}
                                </RadioGroup>

                                {/* Invoice Request for Online Payments */}
                                {selectedPaymentMethod !== "cod" && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id="needInvoice"
                                                checked={needInvoice}
                                                onChange={(e) =>
                                                    setNeedInvoice(
                                                        e.target.checked
                                                    )
                                                }
                                                className="rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <Label
                                                htmlFor="needInvoice"
                                                className="text-sm font-medium cursor-pointer"
                                            >
                                                Need an invoice?
                                            </Label>
                                        </div>

                                        {needInvoice && (
                                            <div>
                                                <Label
                                                    htmlFor="invoiceEmail"
                                                    className="text-sm font-medium"
                                                >
                                                    Invoice Email Address
                                                </Label>
                                                <Input
                                                    id="invoiceEmail"
                                                    type="email"
                                                    value={invoiceEmail}
                                                    onChange={(e) =>
                                                        setInvoiceEmail(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="mt-1"
                                                    placeholder="Enter email for invoice"
                                                    required={needInvoice}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <Separator />


                            {/* Place Order Button - Fixed on mobile */}
                            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t md:relative md:p-0 md:border-0 md:bg-transparent">
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 hover:scale-[1.02] hover:shadow-lg animate-[jiggle_.86s_ease-in-out_infinite]"
                                    size="lg"
                                    style={{
                                        animationDelay: "2s",
                                    }}
                                    disabled={isLoading || isProcessingPayment}
                                >
                                    {isProcessingPayment
                                        ? "Processing Payment..."
                                        : isLoading
                                        ? "Processing..."
                                        : selectedPaymentMethod === "cod"
                                        ? `অর্ডার কনফার্ম করুন - ${formatCurrency(
                                              finalTotal
                                          )}`
                                        : `Pay Online - ${formatCurrency(
                                              finalTotal
                                          )}`}
                                </Button>
                            </div>

                            <style>{`
        @keyframes jiggle {
 0%, 90% {
        transform:scaleX(1)
    }

 20% {
        transform:scale3d(.97, .97, .97) rotate(-1deg)
    }

    30%, 50%, 70% {
        transform:scale3d(1.03, 1.03, 1.03) rotate(1deg)
    }

    40%, 60%, 80% {
        transform:scale3d(1.03, 1.03, 1.03) rotate(-1deg)
    }
        }
      `}</style>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <style>{`
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>

            {/* WhatsApp Support Button */}
            <WhatsAppButton message="Hi! I need help with my checkout process." />
        </div>
    );
}
