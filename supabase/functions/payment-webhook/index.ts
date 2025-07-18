import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.text();
    const event = JSON.parse(body);

    // Verify webhook signature (implement based on your payment provider)
    const signature = req.headers.get('x-paystack-signature') || req.headers.get('x-flutterwave-signature');
    
    if (!signature) {
      return new Response(JSON.stringify({ error: 'Missing signature' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle different payment providers
    let transactionData;
    let provider;
    
    if (req.headers.get('x-paystack-signature')) {
      provider = 'paystack';
      transactionData = event.data;
    } else if (req.headers.get('x-flutterwave-signature')) {
      provider = 'flutterwave';
      transactionData = event.data;
    } else {
      return new Response(JSON.stringify({ error: 'Unknown payment provider' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Only process successful payments
    if (event.event !== 'charge.success' && event.event !== 'transaction.completed') {
      return new Response(JSON.stringify({ message: 'Event not processed' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const reference = transactionData.reference;
    const amount = Math.floor(transactionData.amount / 100); // Convert from kobo to naira
    const customerEmail = transactionData.customer?.email || transactionData.customer_email;

    // Find user by email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', customerEmail)
      .single();

    if (userError || !user) {
      console.error('User not found:', customerEmail);
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if transaction already exists
    const { data: existingTransaction } = await supabase
      .from('transactions')
      .select('*')
      .eq('reference', reference)
      .single();

    if (existingTransaction) {
      return new Response(JSON.stringify({ message: 'Transaction already processed' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Calculate credits based on amount (customize this logic)
    const creditsPerNaira = 2; // 2 credits per naira
    const creditsToAdd = amount * creditsPerNaira;

    // Create transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        amount: creditsToAdd,
        payment_method: provider,
        reference: reference,
        status: 'completed',
        description: `Credit purchase via ${provider}`
      })
      .select()
      .single();

    if (transactionError) {
      console.error('Failed to create transaction:', transactionError);
      return new Response(JSON.stringify({ error: 'Failed to create transaction' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update user balance
    const { error: balanceError } = await supabase
      .from('users')
      .update({ balance: user.balance + creditsToAdd })
      .eq('id', user.id);

    if (balanceError) {
      console.error('Failed to update balance:', balanceError);
      
      // Mark transaction as failed
      await supabase
        .from('transactions')
        .update({ status: 'failed' })
        .eq('id', transaction.id);

      return new Response(JSON.stringify({ error: 'Failed to update balance' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Log the event
    await supabase.rpc('log_event', {
      p_event_type: 'payment_processed',
      p_user_id: user.id,
      p_description: `Payment processed: ${creditsToAdd} credits added`,
      p_metadata: { 
        transaction_id: transaction.id, 
        reference: reference,
        amount: amount,
        provider: provider
      }
    });

    // Log credit addition
    await supabase.rpc('log_event', {
      p_event_type: 'credit_addition',
      p_user_id: user.id,
      p_description: `${creditsToAdd} credits added via ${provider}`,
      p_metadata: { 
        transaction_id: transaction.id,
        credits_added: creditsToAdd,
        new_balance: user.balance + creditsToAdd
      }
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Payment processed successfully',
      credits_added: creditsToAdd,
      new_balance: user.balance + creditsToAdd
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in payment-webhook function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});