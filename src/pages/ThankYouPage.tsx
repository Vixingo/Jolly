import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { useFormatCurrency } from "../lib/utils";

interface OrderItem {
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
    subtotal: number;
}

interface Address {
    full_name: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
}

interface OrderDetails {
    id: string;
    total: number;
    status: string;
    payment_status: string;
    items: OrderItem[];
    shipping_address: Address;
    billing_address?: Address;
    tracking_number?: string;
    customer_phone?: string;
    customer_email?: string;
    payment_method?: string;
    invoice_requested?: boolean;
    invoice_email?: string;
    created_at: string;
}

export default function ThankYouPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
    const formatCurrency = useFormatCurrency();

    useEffect(() => {
        if (!location.state?.orderDetails) {
            navigate("/");
            return;
        }
        setOrderDetails(location.state.orderDetails);
        setOrderDetails(location.state.orderDetails);
    }, []);
    if (!orderDetails) return null;

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
            <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                <CardHeader className="text-center pb-0 pt-8 sm:pt-10 px-4 sm:px-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Thank You!
                    </CardTitle>
                    <p className="mt-2 text-base sm:text-lg text-gray-600 px-2">
                        Your order has been placed successfully
                    </p>
                </CardHeader>
                <CardContent className="pt-6 sm:pt-8 px-4 sm:px-6">
                    <div className="space-y-6 sm:space-y-8">
                        <div className="bg-gray-50 rounded-xl p-4 sm:p-6 space-y-4">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Order Details
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
                                <div className="bg-white/50 p-3 rounded-lg">
                                    <p className="text-sm font-medium text-gray-500">
                                        Order ID
                                    </p>
                                    <p className="font-mono mt-1">
                                        {orderDetails.id}
                                    </p>
                                </div>
                                <div className="bg-white/50 p-3 rounded-lg">
                                    <p className="text-sm font-medium text-gray-500">
                                        Date
                                    </p>
                                    <p className="mt-1">
                                        {new Date(
                                            orderDetails.created_at
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="bg-white/50 p-3 rounded-lg">
                                    <p className="text-sm font-medium text-gray-500">
                                        Status
                                    </p>
                                    <p className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                                        {orderDetails.status
                                            .charAt(0)
                                            .toUpperCase() +
                                            orderDetails.status.slice(1)}
                                    </p>
                                </div>
                                <div className="bg-white/50 p-3 rounded-lg">
                                    <p className="text-sm font-medium text-gray-500">
                                        Payment Status
                                    </p>
                                    <p
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                                            orderDetails.payment_status ===
                                            "paid"
                                                ? "bg-green-100 text-green-800"
                                                : orderDetails.payment_status ===
                                                  "unpaid"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-yellow-100 text-yellow-800"
                                        }`}
                                    >
                                        {orderDetails.payment_status
                                            .charAt(0)
                                            .toUpperCase() +
                                            orderDetails.payment_status.slice(
                                                1
                                            )}
                                    </p>
                                </div>
                                {orderDetails.tracking_number && (
                                    <div className="col-span-full bg-white/50 p-3 rounded-lg">
                                        <p className="text-sm font-medium text-gray-500">
                                            Tracking Number
                                        </p>
                                        <p className="font-mono mt-1">
                                            {orderDetails.tracking_number}
                                        </p>
                                    </div>
                                )}
                                <div className="col-span-full bg-white/50 p-3 rounded-lg">
                                    <p className="text-sm font-medium text-gray-500">
                                        Total Amount
                                    </p>
                                    <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                                        {formatCurrency(orderDetails.total)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="border-t border-gray-200 pt-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4 px-1">
                                Order Items
                            </h4>
                            <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                                <div className="space-y-3">
                                    {orderDetails.items.map((item, index) => (
                                        <div
                                            key={index}
                                            className="bg-white/50 p-3 rounded-lg flex justify-between items-center"
                                        >
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {item.product_name}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Quantity: {item.quantity} ×{" "}
                                                    {formatCurrency(item.price)}
                                                </p>
                                            </div>
                                            <p className="font-semibold text-gray-900">
                                                {formatCurrency(item.subtotal)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Shipping Details */}
                        <div className="border-t border-gray-200 pt-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4 px-1">
                                Shipping Details
                            </h4>
                            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 space-y-3">
                                <div className="bg-white/50 p-3 rounded-lg">
                                    <p className="text-gray-900 font-medium">
                                        {
                                            orderDetails.shipping_address
                                                .full_name
                                        }
                                    </p>
                                    <p className="text-gray-600 mt-1">
                                        {
                                            orderDetails.shipping_address
                                                .address_line1
                                        }
                                    </p>
                                    {orderDetails.shipping_address
                                        .address_line2 && (
                                        <p className="text-gray-600">
                                            {
                                                orderDetails.shipping_address
                                                    .address_line2
                                            }
                                        </p>
                                    )}
                                    <p className="text-gray-600 mt-1">
                                        {orderDetails.shipping_address.city},{" "}
                                        {orderDetails.shipping_address.state}{" "}
                                        {
                                            orderDetails.shipping_address
                                                .postal_code
                                        }
                                    </p>
                                    {orderDetails.customer_phone && (
                                        <p className="text-gray-600">
                                            Phone: {orderDetails.customer_phone}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Billing Address */}
                        {orderDetails.billing_address && (
                            <div className="border-t border-gray-200 pt-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 px-1">
                                    Billing Details
                                </h4>
                                <div className="bg-gray-50 rounded-xl p-4 sm:p-6 space-y-3">
                                    <div className="bg-white/50 p-3 rounded-lg">
                                        <p className="text-gray-900 font-medium">
                                            {
                                                orderDetails.billing_address
                                                    .full_name
                                            }
                                        </p>
                                        <p className="text-gray-600 mt-1">
                                            {
                                                orderDetails.billing_address
                                                    .address_line1
                                            }
                                        </p>
                                        {orderDetails.billing_address
                                            .address_line2 && (
                                            <p className="text-gray-600">
                                                {
                                                    orderDetails.billing_address
                                                        .address_line2
                                                }
                                            </p>
                                        )}
                                        <p className="text-gray-600 mt-1">
                                            {orderDetails.billing_address.city},{" "}
                                            {orderDetails.billing_address.state}{" "}
                                            {
                                                orderDetails.billing_address
                                                    .postal_code
                                            }
                                        </p>
                                        {orderDetails.customer_phone && (
                                            <p className="text-gray-600">
                                                Phone:{" "}
                                                {orderDetails.customer_phone}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="text-center pt-4 sm:pt-6">
                            <Button
                                onClick={() => navigate("/")}
                                className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white px-6 sm:px-8 py-2.5 rounded-full inline-flex items-center justify-center gap-2 transition-all duration-200 hover:gap-3"
                            >
                                Continue Shopping
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
