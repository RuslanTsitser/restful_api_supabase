// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient, SupabaseClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}
Deno.serve(async (req) => {
  const { url, method } = req
    // This is needed if you're planning to invoke your function from a browser.
    if (method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
    }
    console.log(req)
  
    try {
      // Create a Supabase client with the Auth context of the logged in user.
      const supabaseClient = createClient(
        // Supabase API URL - env var exported by default.
        Deno.env.get('URL') ?? '',
        // Supabase API ANON KEY - env var exported by default.
        Deno.env.get('ANON_KEY') ?? '',
        // Create client with Auth context of the user that called the function.
        // This way your row-level-security (RLS) policies are applied.
        {
          global: {
            headers: { Authorization: req.headers.get('Authorization')! },
          },
        }
      )
  
      if (isSignIn(url)) {
        const body = await req.json()
        const email = body.email
        const password = body.password
        return sighIn(supabaseClient, email, password)
      }
      if (isSignUp(url)) {
        const body = await req.json()
        const email = body.email
        const password = body.password
        return sighUp(supabaseClient, email, password)
      } else {
        return new Response(JSON.stringify({ error: 'Invalid auth method' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        })
      }
      
    } catch (error) {
      console.error(error)
  
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }
})

function isSignIn(url: string) : boolean {
  try {
    const { pathname } = new URL(url);
    return pathname.match(/\/auth\/sign-in/) !== null;
  } catch (error : unknown) {
    console.error(error);
    return false;
  }
}

function isSignUp(url: string) : boolean {
  try {
    const { pathname } = new URL(url);
    return pathname.match(/\/auth\/sign-up/) !== null;
  } catch (error : unknown) {
    console.error(error);
    return false;
  }
}


async function sighIn(supabaseClient: SupabaseClient, email: string, password: string) {
  const  {data, error}  = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  })
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }

  return new Response(JSON.stringify({
    token: data.session?.access_token,
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  })
}


async function sighUp(supabaseClient: SupabaseClient, email: string, password: string) {
  const  {data, error }  = await supabaseClient.auth.signUp({
    email,
    password,
  })
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }

  return new Response(JSON.stringify({
    token: data.session?.access_token,
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  })
}

