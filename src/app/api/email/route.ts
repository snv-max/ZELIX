import { NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { order, customerEmail } = body;

    if (!order || !customerEmail) {
      return NextResponse.json({ error: 'Order details and customer email are required' }, { status: 400 });
    }

    const result = await sendOrderConfirmationEmail(order, customerEmail);
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: result.id });
  } catch (err: any) {
    console.error('Email API Error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
