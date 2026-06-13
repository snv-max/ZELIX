import { NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const { order, customerEmail } = body;

    if (!order || !customerEmail) {
      return NextResponse.json({ error: 'Order details and customer email are required' }, { status: 400 });
    }

    const result = await sendOrderConfirmationEmail(order, customerEmail);
    if (!result.success) {
      console.error('Email API failed to send order confirmation:', result.error);
      return NextResponse.json({ 
        success: false, 
        warning: 'Order confirmation email failed to send, but order is successfully processed.',
        error: result.error?.message || result.error || 'Failed to send email' 
      }, { status: 200 });
    }

    return NextResponse.json({ 
      success: true, 
      id: result.id, 
      provider: result.provider,
      warning: result.warning 
    });
  } catch (err: any) {
    console.error('Email API Error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
