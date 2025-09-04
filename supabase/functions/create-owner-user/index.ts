import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { email, password, name, propertyId } = await req.json()

    // 1. Crear el usuario en Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

    if (authError) {
      throw new Error(`Error creating auth user: ${authError.message}`)
    }

    // 2. Crear el registro owner
    const { data: ownerData, error: ownerError } = await supabaseAdmin
      .from('owners')
      .insert({
        name,
        email,
        user_id: authData.user.id
      })
      .select()
      .single()

    if (ownerError) {
      throw new Error(`Error creating owner: ${ownerError.message}`)
    }

    // 3. Asignar la propiedad al owner
    const { error: propertyError } = await supabaseAdmin
      .from('properties')
      .update({ owner_id: ownerData.id })
      .eq('id', propertyId)

    if (propertyError) {
      throw new Error(`Error assigning property: ${propertyError.message}`)
    }

    return new Response(
      JSON.stringify({ 
        message: 'Owner user created successfully',
        userId: authData.user.id,
        ownerId: ownerData.id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})