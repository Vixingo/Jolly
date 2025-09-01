import { supabase } from "./supabase";

interface OrderDetails {
    id: string;
    total: number;
    status: string;
    payment_status: string;
    items: any[];
    shipping_address: any;
    billing_address?: any;
    tracking_number?: string;
    customer_phone?: string;
    customer_email?: string;
    payment_method?: string;
    invoice_requested?: boolean;
    invoice_email?: string;
    created_at: string;
}

export const generateInvoiceHTML = (orderDetails: OrderDetails): string => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice - Order #${orderDetails.id}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f8fafc;
          padding: 20px;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        
        .header h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
          font-weight: 700;
        }
        
        .header p {
          font-size: 1.1rem;
          opacity: 0.9;
        }
        
        .content {
          padding: 40px 30px;
        }
        
        .order-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 8px;
        }
        
        .info-item {
          text-align: center;
        }
        
        .info-label {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .info-value {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
        }
        
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
          text-transform: capitalize;
        }
        
        .status-paid {
          background: #dcfce7;
          color: #166534;
        }
        
        .status-unpaid {
          background: #fef3c7;
          color: #92400e;
        }
        
        .items-section {
          margin-bottom: 40px;
        }
        
        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 20px;
          color: #1e293b;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 10px;
        }
        
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        
        .items-table th,
        .items-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .items-table th {
          background: #f1f5f9;
          font-weight: 600;
          color: #475569;
        }
        
        .total-row {
          background: #f8fafc;
          font-weight: 600;
        }
        
        .addresses {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin-bottom: 40px;
        }
        
        .address-card {
          padding: 20px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #fafafa;
        }
        
        .address-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 15px;
          color: #1e293b;
        }
        
        .address-line {
          margin-bottom: 5px;
          color: #64748b;
        }
        
        .footer {
          background: #1e293b;
          color: white;
          padding: 30px;
          text-align: center;
        }
        
        .footer p {
          margin-bottom: 10px;
        }
        
        @media (max-width: 600px) {
          .container {
            margin: 10px;
          }
          
          .header,
          .content {
            padding: 20px;
          }
          
          .order-info {
            grid-template-columns: 1fr;
          }
          
          .addresses {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Invoice</h1>
          <p>Thank you for your order!</p>
        </div>
        
        <div class="content">
          <div class="order-info">
            <div class="info-item">
              <div class="info-label">Order ID</div>
              <div class="info-value">#${orderDetails.id}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Date</div>
              <div class="info-value">${new Date(
                  orderDetails.created_at
              ).toLocaleDateString()}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Status</div>
              <div class="info-value">
                <span class="status-badge status-${orderDetails.status}">${
        orderDetails.status
    }</span>
              </div>
            </div>
            <div class="info-item">
              <div class="info-label">Payment Status</div>
              <div class="info-value">
                <span class="status-badge status-${
                    orderDetails.payment_status
                }">${orderDetails.payment_status}</span>
              </div>
            </div>
            <div class="info-item">
              <div class="info-label">Total Amount</div>
              <div class="info-value">${formatCurrency(
                  orderDetails.total
              )}</div>
            </div>
          </div>
          
          <div class="items-section">
            <h2 class="section-title">Order Items</h2>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${orderDetails.items
                    .map(
                        (item) => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${formatCurrency(item.price)}</td>
                    <td>${formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                `
                    )
                    .join("")}
                <tr class="total-row">
                  <td colspan="3"><strong>Total</strong></td>
                  <td><strong>${formatCurrency(
                      orderDetails.total
                  )}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="addresses">
            <div class="address-card">
              <h3 class="address-title">Shipping Address</h3>
              <div class="address-line">${
                  orderDetails.shipping_address.full_name
              }</div>
              <div class="address-line">${
                  orderDetails.shipping_address.address_line_1
              }</div>
              ${
                  orderDetails.shipping_address.address_line_2
                      ? `<div class="address-line">${orderDetails.shipping_address.address_line_2}</div>`
                      : ""
              }
              <div class="address-line">${
                  orderDetails.shipping_address.city
              }, ${orderDetails.shipping_address.state} ${
        orderDetails.shipping_address.postal_code
    }</div>
              ${
                  orderDetails.customer_phone
                      ? `<div class="address-line">Phone: ${orderDetails.customer_phone}</div>`
                      : ""
              }
            </div>
            
            ${
                orderDetails.billing_address
                    ? `
              <div class="address-card">
                <h3 class="address-title">Billing Address</h3>
                <div class="address-line">${
                    orderDetails.billing_address.full_name
                }</div>
                <div class="address-line">${
                    orderDetails.billing_address.address_line_1
                }</div>
                ${
                    orderDetails.billing_address.address_line_2
                        ? `<div class="address-line">${orderDetails.billing_address.address_line_2}</div>`
                        : ""
                }
                <div class="address-line">${
                    orderDetails.billing_address.city
                }, ${orderDetails.billing_address.state} ${
                          orderDetails.billing_address.postal_code
                      }</div>
                ${
                    orderDetails.customer_phone
                        ? `<div class="address-line">Phone: ${orderDetails.customer_phone}</div>`
                        : ""
                }
              </div>
            `
                    : ""
            }
          </div>
        </div>
        
        <div class="footer">
          <p>Thank you for shopping with us!</p>
          <p>If you have any questions, please contact our support team.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const sendInvoiceEmail = async (
    orderDetails: OrderDetails,
    recipientEmail: string
): Promise<boolean> => {
    try {
        // Generate the invoice HTML
        // const invoiceHTML = generateInvoiceHTML(orderDetails)

        // Here you would integrate with your email service (e.g., SendGrid, Nodemailer, etc.)
        // For now, we'll use a placeholder that logs the email content
        console.log("Sending invoice email to:", recipientEmail);
        console.log("Invoice HTML generated for order:", orderDetails.id);

        // In a real implementation, you would:
        // 1. Use an email service like SendGrid, AWS SES, or Nodemailer
        // 2. Send the HTML as the email body
        // 3. Set appropriate subject line and headers

        // Example with a hypothetical email service:
        /*
    const emailService = new EmailService()
    await emailService.send({
      to: recipientEmail,
      subject: `Invoice for Order #${orderDetails.id}`,
      html: invoiceHTML,
      from: 'noreply@yourstore.com'
    })
    */

        // For demo purposes, we'll simulate success
        return true;
    } catch (error) {
        console.error("Error sending invoice email:", error);
        return false;
    }
};

// Function to be called after successful payment
export const handleInvoiceRequest = async (orderId: string): Promise<void> => {
    try {
        // Fetch order details
        const { data: order, error } = await supabase
            .from("orders")
            .select("*")
            .eq("id", orderId)
            .single();

        if (error || !order) {
            console.error("Error fetching order for invoice:", error);
            return;
        }

        // Check if invoice was requested and email is provided
        if (order.invoice_requested && order.invoice_email) {
            const success = await sendInvoiceEmail(order, order.invoice_email);

            if (success) {
                console.log(`Invoice sent successfully for order ${orderId}`);
            } else {
                console.error(`Failed to send invoice for order ${orderId}`);
            }
        }
    } catch (error) {
        console.error("Error handling invoice request:", error);
    }
};
