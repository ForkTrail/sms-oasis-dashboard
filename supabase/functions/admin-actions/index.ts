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

    // Check if user is admin
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.user.id)
      .single();

    if (profileError || !userProfile?.is_admin) {
      return new Response(JSON.stringify({ error: 'Unauthorized - Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action, data } = await req.json();

    switch (action) {
      case 'add_credits':
        return await addCredits(supabase, data, user.user.id);
      
      case 'suspend_user':
        return await suspendUser(supabase, data, user.user.id);
      
      case 'create_service':
        return await createService(supabase, data, user.user.id);
      
      case 'update_service':
        return await updateService(supabase, data, user.user.id);
      
      case 'get_settings':
        return await getSettings(supabase);
      
      case 'update_settings':
        return await updateSettings(supabase, data, user.user.id);
      
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

  } catch (error) {
    console.error('Error in admin-actions function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function addCredits(supabase: any, data: any, adminId: string) {
  const { user_id, credits, reason } = data;

  // Get current user balance
  const { data: targetUser, error: userError } = await supabase
    .from('users')
    .select('balance, email')
    .eq('id', user_id)
    .single();

  if (userError) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Update user balance
  const { error: balanceError } = await supabase
    .from('users')
    .update({ balance: targetUser.balance + credits })
    .eq('id', user_id);

  if (balanceError) {
    return new Response(JSON.stringify({ error: 'Failed to update balance' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Create transaction record
  await supabase
    .from('transactions')
    .insert({
      user_id: user_id,
      amount: credits,
      payment_method: 'admin_credit',
      reference: `admin-${Date.now()}`,
      status: 'completed',
      description: reason || 'Credits added by admin'
    });

  // Log the event
  await supabase.rpc('log_event', {
    p_event_type: 'admin_action',
    p_user_id: adminId,
    p_description: `Added ${credits} credits to user ${targetUser.email}`,
    p_metadata: { 
      target_user_id: user_id,
      credits_added: credits,
      reason: reason
    }
  });

  return new Response(JSON.stringify({
    success: true,
    message: `${credits} credits added successfully`,
    new_balance: targetUser.balance + credits
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function suspendUser(supabase: any, data: any, adminId: string) {
  const { user_id, action } = data; // action: 'suspend' or 'activate'

  const status = action === 'suspend' ? 'suspended' : 'active';

  // Update user status
  const { error: updateError } = await supabase
    .from('users')
    .update({ status: status })
    .eq('id', user_id);

  if (updateError) {
    return new Response(JSON.stringify({ error: 'Failed to update user status' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Log the event
  await supabase.rpc('log_event', {
    p_event_type: 'admin_action',
    p_user_id: adminId,
    p_description: `User ${action}ed`,
    p_metadata: { 
      target_user_id: user_id,
      action: action
    }
  });

  return new Response(JSON.stringify({
    success: true,
    message: `User ${action}ed successfully`
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function createService(supabase: any, data: any, adminId: string) {
  const { name, price_per_use, assigned_server } = data;

  // Create service
  const { data: service, error: serviceError } = await supabase
    .from('services')
    .insert({
      name: name,
      price_per_use: price_per_use,
      assigned_server: assigned_server,
      available: true
    })
    .select()
    .single();

  if (serviceError) {
    return new Response(JSON.stringify({ error: 'Failed to create service' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Log the event
  await supabase.rpc('log_event', {
    p_event_type: 'admin_action',
    p_user_id: adminId,
    p_description: `Created service: ${name}`,
    p_metadata: { 
      service_id: service.id,
      service_name: name,
      price: price_per_use
    }
  });

  return new Response(JSON.stringify({
    success: true,
    message: 'Service created successfully',
    service: service
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function updateService(supabase: any, data: any, adminId: string) {
  const { service_id, updates } = data;

  // Update service
  const { error: updateError } = await supabase
    .from('services')
    .update(updates)
    .eq('id', service_id);

  if (updateError) {
    return new Response(JSON.stringify({ error: 'Failed to update service' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Log the event
  await supabase.rpc('log_event', {
    p_event_type: 'admin_action',
    p_user_id: adminId,
    p_description: `Updated service`,
    p_metadata: { 
      service_id: service_id,
      updates: updates
    }
  });

  return new Response(JSON.stringify({
    success: true,
    message: 'Service updated successfully'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getSettings(supabase: any) {
  const { data: settings, error } = await supabase
    .from('settings')
    .select('*')
    .order('key');

  if (error) {
    return new Response(JSON.stringify({ error: 'Failed to get settings' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({
    success: true,
    settings: settings
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function updateSettings(supabase: any, data: any, adminId: string) {
  const { settings } = data;

  // Update multiple settings
  const updates = settings.map((setting: any) => ({
    key: setting.key,
    value: setting.value,
    type: setting.type
  }));

  const { error: updateError } = await supabase
    .from('settings')
    .upsert(updates);

  if (updateError) {
    return new Response(JSON.stringify({ error: 'Failed to update settings' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Log the event
  await supabase.rpc('log_event', {
    p_event_type: 'admin_action',
    p_user_id: adminId,
    p_description: `Updated system settings`,
    p_metadata: { 
      settings_updated: settings.length
    }
  });

  return new Response(JSON.stringify({
    success: true,
    message: 'Settings updated successfully'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}