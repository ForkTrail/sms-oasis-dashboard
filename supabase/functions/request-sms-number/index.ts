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
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get JWT token and verify user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: user, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user.user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { service_id, server } = await req.json();

    // Get user profile and check balance
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('balance')
      .eq('id', user.user.id)
      .single();

    if (profileError) {
      return new Response(JSON.stringify({ error: 'Failed to get user profile' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get service details
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('*')
      .eq('id', service_id)
      .eq('available', true)
      .single();

    if (serviceError || !service) {
      return new Response(JSON.stringify({ error: 'Service not found or unavailable' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user has sufficient balance
    if (userProfile.balance < service.price_per_use) {
      return new Response(JSON.stringify({ error: 'Insufficient balance' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Request phone number from SMS Man API
    const smsManApiKey = Deno.env.get('SMS_MAN_API_KEY');
    if (!smsManApiKey) {
      return new Response(JSON.stringify({ error: 'SMS Man API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const smsManResponse = await fetch(
      `https://api.sms-man.com/control/get-number?token=${smsManApiKey}&application=${service.name.toLowerCase()}&country=2&maxPrice=${service.price_per_use}`,
      { method: 'GET' }
    );

    const smsManData = await smsManResponse.json();
    
    if (!smsManData.success) {
      return new Response(JSON.stringify({ error: 'Failed to get phone number', details: smsManData.error_msg }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now

    // Create SMS session
    const { data: session, error: sessionError } = await supabase
      .from('sms_sessions')
      .insert({
        user_id: user.user.id,
        service_id: service_id,
        phone_number: smsManData.number,
        server: server,
        status: 'active',
        request_id: smsManData.request_id,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (sessionError) {
      return new Response(JSON.stringify({ error: 'Failed to create session' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Deduct credits from user balance
    const { error: balanceError } = await supabase
      .from('users')
      .update({ balance: userProfile.balance - service.price_per_use })
      .eq('id', user.user.id);

    if (balanceError) {
      // Rollback session creation if balance update fails
      await supabase.from('sms_sessions').delete().eq('id', session.id);
      return new Response(JSON.stringify({ error: 'Failed to deduct credits' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Log the event
    await supabase.rpc('log_event', {
      p_event_type: 'sms_request',
      p_user_id: user.user.id,
      p_description: `SMS session created for ${service.name}`,
      p_metadata: { session_id: session.id, phone_number: smsManData.number }
    });

    return new Response(JSON.stringify({
      success: true,
      session_id: session.id,
      phone_number: smsManData.number,
      expires_at: expiresAt.toISOString(),
      credits_deducted: service.price_per_use,
      remaining_balance: userProfile.balance - service.price_per_use
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in request-sms-number function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});