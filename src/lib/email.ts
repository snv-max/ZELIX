import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import { Order, OrderItem } from '@/types/database.types';

// Amazon SES SMTP credentials
const smtpHost = process.env.SMTP_HOST || '';
const smtpPort = Number(process.env.SMTP_PORT || '587');
const smtpUser = process.env.SMTP_USER || '';
const smtpPassword = process.env.SMTP_PASSWORD || '';
const smtpFrom = process.env.SMTP_FROM || 'ZELIX Apparel <orders@yourdomain.com>';

// Resend credentials
const resendApiKey = process.env.RESEND_API_KEY || '';

// Initialize Resend client if key is present
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Initialize Nodemailer transporter if SMTP settings are present
const transporter = smtpHost && smtpUser && smtpPassword
  ? nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    })
  : null;

// Fallback SMTP credentials (added to resolve AWS SES Sandbox rejections)
const fallbackSmtpHost = process.env.FALLBACK_SMTP_HOST || '';
const fallbackSmtpPort = Number(process.env.FALLBACK_SMTP_PORT || '587');
const fallbackSmtpUser = process.env.FALLBACK_SMTP_USER || '';
const fallbackSmtpPassword = process.env.FALLBACK_SMTP_PASSWORD || '';
const fallbackSmtpFrom = process.env.FALLBACK_SMTP_FROM || 'ZELIX Apparel <fallback@yourdomain.com>';

// Initialize Fallback Nodemailer transporter
const fallbackTransporter = fallbackSmtpHost && fallbackSmtpUser && fallbackSmtpPassword
  ? nodemailer.createTransport({
      host: fallbackSmtpHost,
      port: fallbackSmtpPort,
      secure: fallbackSmtpPort === 465,
      auth: {
        user: fallbackSmtpUser,
        pass: fallbackSmtpPassword,
      },
    })
  : null;

// Email sending configuration check
const disableEmail = process.env.DISABLE_EMAIL === 'true';

if (typeof window === 'undefined') {
  if (disableEmail) {
    console.log('[EMAIL_INIT] Email provider is disabled via DISABLE_EMAIL=true.');
  } else {
    const configured: string[] = [];
    if (transporter) configured.push('Amazon SES (SMTP)');
    if (fallbackTransporter) configured.push('Fallback SMTP');
    if (resend) configured.push('Resend API');
    if (configured.length > 0) {
      console.log(`[EMAIL_INIT] Email service initialized with providers: ${configured.join(', ')} (tried in sequence).`);
    } else {
      console.log('[EMAIL_INIT] No email providers configured. Falling back to console logging.');
    }
  }
}

interface OrderWithItems extends Order {
  items: OrderItem[];
}

function logEmailFailure(provider: string, err: any) {
  const errMsg = err.message || err.toString() || '';
  console.error(`[EMAIL_ERROR] ${provider} failed to send email:`, errMsg);
  
  // Detect AWS SES Sandbox verification error specifically
  if (
    provider === 'Amazon SES SMTP' &&
    (errMsg.includes('554 Message rejected') || 
     errMsg.includes('Email address is not verified') ||
     err.code === 'MessageRejected')
  ) {
    console.error(
      `\n=================================================================================\n` +
      `[AWS SES SANDBOX RESTRICTION DETECTED]\n` +
      `---------------------------------------------------------------------------------\n` +
      `Amazon SES is currently running in SANDBOX MODE for this account/region.\n` +
      `To resolve this, you must either:\n` +
      `  1. Verify both the sender email ("${smtpFrom}") AND the recipient email in your AWS SES Console.\n` +
      `  2. Request Production Access for AWS SES to enable sending to any unverified address.\n` +
      `  3. Configure a Resend API Key (RESEND_API_KEY) or a Fallback SMTP server (FALLBACK_SMTP_*).\n` +
      `  4. Disable emails for local testing by setting DISABLE_EMAIL=true.\n` +
      `=================================================================================\n`
    );
  }
}

function logMockEmail(order: OrderWithItems, customerEmail: string) {
  console.log('\n--- [MOCK EMAIL CONFIRMATION] ---');
  console.log(`To: ${customerEmail}`);
  console.log(`Subject: Order Confirmed - ZELIX #${order.id.substring(0, 8).toUpperCase()}`);
  console.log(`Content:\nTotal Paid: ₹${order.total_amount}\nReference: ${order.id}`);
  console.log('----------------------------------\n');
}

function generateEmailHtml(order: OrderWithItems): string {
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

  return `
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
}

export async function sendOrderConfirmationEmail(
  order: OrderWithItems,
  customerEmail: string
): Promise<{ success: boolean; id?: string; provider?: string; error?: any; warning?: string }> {
  // Check if emails are disabled
  if (disableEmail) {
    logMockEmail(order, customerEmail);
    return { 
      success: true, 
      provider: 'Mock (Email Disabled)', 
      id: 'mock_disabled_' + Math.random().toString(36).substr(2, 9) 
    };
  }

  const emailHtml = generateEmailHtml(order);

  // 1. Try Amazon SES SMTP
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: smtpFrom,
        to: customerEmail,
        subject: `ZELIX - Order Confirmed #${order.id.substring(0, 8).toUpperCase()}`,
        html: emailHtml,
      });
      console.log(`[EMAIL] Order confirmation email sent successfully via Amazon SES: ${info.messageId}`);
      return { success: true, provider: 'Amazon SES SMTP', id: info.messageId };
    } catch (err: any) {
      logEmailFailure('Amazon SES SMTP', err);
    }
  }

  // 2. Try Fallback SMTP
  if (fallbackTransporter) {
    try {
      const info = await fallbackTransporter.sendMail({
        from: fallbackSmtpFrom,
        to: customerEmail,
        subject: `ZELIX - Order Confirmed #${order.id.substring(0, 8).toUpperCase()}`,
        html: emailHtml,
      });
      console.log(`[EMAIL] Order confirmation email sent successfully via Fallback SMTP: ${info.messageId}`);
      return { success: true, provider: 'Fallback SMTP', id: info.messageId };
    } catch (err: any) {
      logEmailFailure('Fallback SMTP', err);
    }
  }

  // 3. Try Resend API
  if (resend) {
    try {
      const response = await resend.emails.send({
        from: 'ZELIX Apparel <orders@yourdomain.com>',
        to: customerEmail,
        subject: `ZELIX - Order Confirmed #${order.id.substring(0, 8).toUpperCase()}`,
        html: emailHtml,
      });

      if (response.error) {
        logEmailFailure('Resend API', response.error);
      } else {
        console.log(`[EMAIL] Order confirmation email sent successfully via Resend: ${response.data?.id}`);
        return { success: true, provider: 'Resend API', id: response.data?.id || 'resend_ok' };
      }
    } catch (err: any) {
      logEmailFailure('Resend API', err);
    }
  }

  // 4. Mock Local Console Fallback if everything else fails
  console.warn('[EMAIL] All configured live email delivery methods failed. Falling back to local console logger.');
  logMockEmail(order, customerEmail);
  return {
    success: true,
    provider: 'Mock Fallback',
    id: 'mock_fallback_' + Math.random().toString(36).substr(2, 9),
    warning: 'All live email providers failed or were rejected. Logged to server console.'
  };
}
