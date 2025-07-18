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

    const { session_id } = await req.json();

    // Get session details
    const { data: session, error: sessionError } = await supabase
      .from('sms_sessions')
      .select('*')
      .eq('id', session_id)
      .eq('user_id', user.user.id)
      .single();

    if (sessionError || !session) {
      return new Response(JSON.stringify({ error: 'Session not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      // Update session status to expired
      await supabase
        .from('sms_sessions')
        .update({ 
          status: 'expired', 
          delivery_status: 'expired' 
        })
        .eq('id', session_id);

      return new Response(JSON.stringify({
        success: true,
        status: 'expired',
        message: 'Session has expired'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check SMS delivery status from SMS Man API
    const smsManApiKey = Deno.env.get('SMS_MAN_API_KEY');
    if (!smsManApiKey) {
      return new Response(JSON.stringify({ error: 'SMS Man API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const smsManResponse = await fetch(
      `https://api.sms-man.com/control/get-sms?token=${smsManApiKey}&request_id=${session.request_id}`,
      { method: 'GET' }
    );

    const smsManData = await smsManResponse.json();

    if (smsManData.success && smsManData.sms_code) {
      // SMS received - update session
      const messages = Array.isArray(session.messages) ? session.messages : [];
      const newMessage = {
        code: smsManData.sms_code,
        message: smsManData.sms_text || '',
        received_at: new Date().toISOString()
      };
      
      const updatedMessages = [...messages, newMessage];

      const { error: updateError } = await supabase
        .from('sms_sessions')
        .update({
          status: 'completed',
          delivery_status: 'completed',
          messages: updatedMessages,
          sms_count: updatedMessages.length,
          received_at: new Date().toISOString()
        })
        .eq('id', session_id);

      if (updateError) {
        console.error('Failed to update session:', updateError);
        return new Response(JSON.stringify({ error: 'Failed to update session' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Log the event
      await supabase.rpc('log_event', {
        p_event_type: 'sms_request',
        p_user_id: user.user.id,
        p_description: `SMS received for session ${session_id}`,
        p_metadata: { session_id: session_id, sms_code: smsManData.sms_code }
      });

      return new Response(JSON.stringify({
        success: true,
        status: 'completed',
        message: 'SMS received',
        sms_code: smsManData.sms_code,
        sms_text: smsManData.sms_text,
        messages: updatedMessages
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if we need to retry or mark as failed
    const maxRetries = 3;
    if (session.retry_count >= maxRetries) {
      // Mark as failed and potentially refund
      const { data: settings } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'enable_refunds')
        .single();

      let refundAmount = 0;
      if (settings && settings.value === 'true') {
        // Get service price for refund
        const { data: service } = await supabase
          .from('services')
          .select('price_per_use')
          .eq('id', session.service_id)
          .single();

        if (service) {
          refundAmount = service.price_per_use;
          
          // Refund credits to user
          const { data: userProfile } = await supabase
            .from('users')
            .select('balance')
            .eq('id', user.user.id)
            .single();

          if (userProfile) {
            await supabase
              .from('users')
              .update({ balance: userProfile.balance + refundAmount })
              .eq('id', user.user.id);
          }
        }
      }

      await supabase
        .from('sms_sessions')
        .update({ 
          status: 'failed', 
          delivery_status: 'failed' 
        })
        .eq('id', session_id);

      return new Response(JSON.stringify({
        success: true,
        status: 'failed',
        message: 'Maximum retries reached. Session marked as failed.',
        refund_amount: refundAmount
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Increment retry count
    await supabase
      .from('sms_sessions')
      .update({ retry_count: session.retry_count + 1 })
      .eq('id', session_id);

    return new Response(JSON.stringify({
      success: true,
      status: 'pending',
      message: 'No SMS received yet. Retrying...',
      retry_count: session.retry_count + 1
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in check-sms-delivery function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});