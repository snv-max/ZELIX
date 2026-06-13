import { Resend } from 'resend';
import { Order, OrderItem } from '@/types/database.types';

const resendApiKey = process.env.RESEND_API_KEY || '';

// Initialize Resend client only if API key is present
const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface OrderWithItems extends Order {
  items: OrderItem[];
}

export async function sendOrderConfirmationEmail(
  order: OrderWithItems,
  customerEmail: string
): Promise<{ success: boolean; id?: string; error?: any }> {
  try {
    const itemsHtml = order.items
      .map(
        item => `
        <tr style="border-bottom: 1px solid #222;">
          <td style="padding: 12px 0; font-weight: bold; color: #ffffff;">
            ${item.product?.name || 'Garment'}
            <br/>
            <span style="font-size: 11px; color: #888; font-family: monospace;">
              ${item.size ? `SIZE: ${item.size}` : ''} ${item.color ? `COLOR: ${item.color}` : ''}
            </span>
          </td>
          <td style="padding: 12px 0; text-align: center; color: #ffffff; font-family: monospace;">
            ${item.quantity}
          </td>
          <td style="padding: 12px 0; text-align: right; color: #ffffff; font-family: monospace; font-weight: bold;">
            ₹${item.price * item.quantity}
          </td>
        </tr>
      `
      )
      .join('');

    const shipping = order.total_amount >= 3000 ? 0 : 150;
    const subtotal = order.total_amount - shipping;

    const emailHtml = `
      <div style="background-color: #09090b; color: #fafafa; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #27272a; border-radius: 8px;">
        <!-- Header -->
        <div style="text-align: center; border-bottom: 1px solid #27272a; padding-bottom: 25px; margin-bottom: 30px;">
          <h1 style="color: #ffffff; font-size: 28px; font-weight: 900; letter-spacing: 4px; margin: 0 0 5px 0;">ZELIX</h1>
          <p style="color: #a1a1aa; font-size: 10px; font-family: monospace; letter-spacing: 2px; margin: 0; text-transform: uppercase;">Unisex Streetwear // Localized India</p>
        </div>

        <!-- Greeting -->
        <div style="margin-bottom: 30px;">
          <h2 style="color: #ffffff; font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0;">Order Confirmed</h2>
          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin: 0;">
            Thank you for shopping with ZELIX. Your payment was verified, and your order has been queued for fulfillment. Below are your invoice details.
          </p>
        </div>

        <!-- Order Info -->
        <div style="background-color: #18181b; border: 1px solid #27272a; padding: 20px; border-radius: 6px; margin-bottom: 30px; font-family: monospace; font-size: 12px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #a1a1aa;">
            <span>ORDER REFERENCE:</span>
            <span style="color: #ffffff; font-weight: bold;">${order.id.substring(0, 8).toUpperCase()}...</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #a1a1aa;">
            <span>DATE:</span>
            <span style="color: #ffffff; font-weight: bold;">${new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div style="display: flex; justify-content: space-between; color: #a1a1aa;">
            <span>STATUS:</span>
            <span style="color: #10b981; font-weight: bold; text-transform: uppercase;">PROCESSING</span>
          </div>
        </div>

        <!-- Items Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px;">
          <thead>
            <tr style="border-bottom: 2px solid #27272a; text-transform: uppercase; font-size: 10px; font-family: monospace; color: #a1a1aa;">
              <th style="text-align: left; padding-bottom: 8px;">GARMENT</th>
              <th style="text-align: center; padding-bottom: 8px; width: 60px;">QTY</th>
              <th style="text-align: right; padding-bottom: 8px; width: 100px;">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <!-- Pricing Summary -->
        <div style="border-top: 1px solid #27272a; padding-top: 15px; margin-bottom: 30px; font-size: 14px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #a1a1aa;">
            <span>Subtotal</span>
            <span style="color: #ffffff; font-family: monospace;">₹${subtotal}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #a1a1aa;">
            <span>Shipping</span>
            <span style="color: #ffffff; font-family: monospace;">${shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; border-top: 1px dashed #27272a; padding-top: 10px; margin-top: 10px;">
            <span>Amount Paid</span>
            <span style="color: #ffffff; font-family: monospace;">₹${order.total_amount}</span>
          </div>
        </div>

        <!-- Shipping Destination -->
        <div style="background-color: #09090b; border: 1px solid #27272a; padding: 20px; border-radius: 6px; margin-bottom: 30px; font-size: 13px;">
          <h4 style="color: #ffffff; font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 12px 0; border-bottom: 1px solid #27272a; padding-bottom: 8px;">Delivery Destination</h4>
          <div style="color: #a1a1aa; line-height: 1.6;">
            <p style="margin: 0; font-weight: bold; color: #ffffff;">${order.shipping_address.name}</p>
            <p style="margin: 3px 0 0 0;">${order.shipping_address.line1}</p>
            ${order.shipping_address.line2 ? `<p style="margin: 3px 0 0 0;">${order.shipping_address.line2}</p>` : ''}
            <p style="margin: 3px 0 0 0;">${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.postal_code}</p>
            <p style="margin: 3px 0 0 0; text-transform: uppercase;">${order.shipping_address.country}</p>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; border-top: 1px solid #27272a; padding-top: 25px; font-size: 11px; color: #71717a; line-height: 1.5;">
          <p style="margin: 0;">This invoice is automatically generated for your records.</p>
          <p style="margin: 5px 0 0 0;">&copy; ${new Date().getFullYear()} ZELIX Apparel. All rights reserved.</p>
        </div>
      </div>
    `;

    if (!resend) {
      console.log('--- [MOCK EMAIL CONFIRMATION] ---');
      console.log(`To: ${customerEmail}`);
      console.log(`Subject: Order Confirmed - ZELIX`);
      console.log(`Content:\nTotal Paid: ₹${order.total_amount}\nReference: ${order.id}`);
      console.log('----------------------------------');
      return { success: true, id: 'mock_email_sent_id_' + Math.random().toString(36).substr(2, 9) };
    }

    const response = await resend.emails.send({
      from: 'ZELIX Apparel <orders@yourdomain.com>',
      to: customerEmail,
      subject: `ZELIX - Order Confirmed #${order.id.substring(0, 8).toUpperCase()}`,
      html: emailHtml,
    });

    if (response.error) {
      console.error('Resend API error sending email:', response.error);
      return { success: false, error: response.error };
    }

    console.log(`Order confirmation email sent successfully via Resend: ${response.data?.id}`);
    return { success: true, id: response.data?.id };
  } catch (err: any) {
    console.error('Failed to send order confirmation email:', err);
    return { success: false, error: err };
  }
}
