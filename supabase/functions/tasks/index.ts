// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { decode } from "https://deno.land/x/djwt@v2.8/mod.ts";
import { createClient, SupabaseClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

interface Task {
  id: number | null
  title: string | null
  is_completed: boolean | null
  email: string | null
}

async function getTask(supabaseClient: SupabaseClient, id: string) {
  const { data: task, error } = await supabaseClient.from('tasks').select('*').eq('id', id)
  if (error) throw error

  return new Response(JSON.stringify({ task }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  })
}

async function getAllTasks(supabaseClient: SupabaseClient, email: string) {
  const { data: tasks, error } = await supabaseClient.from('tasks').select('*').eq('email', email)
  if (error) throw error

  return new Response(JSON.stringify({ tasks }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  })
}

async function deleteTask(supabaseClient: SupabaseClient, id: string) {
  const { error } = await supabaseClient.from('tasks').delete().eq('id', id)
  if (error) throw error

  return new Response(JSON.stringify({}), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  })
}

async function updateTask(supabaseClient: SupabaseClient, id: string, task: Task) {
  const {  error } = await supabaseClient.from('tasks').update({
    title: task.title,
    is_completed: task.is_completed,
    updated_at: new Date(),
  }).eq('id', id)
  if (error) throw error

  return new Response(JSON.stringify(
    { 
      status: 'Updated'
     }
  ), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  })
}

async function createTask(supabaseClient: SupabaseClient, task: Task, email: string) {
  const { error} = await supabaseClient.from('tasks').insert(
    {
      title: task.title ?? '',
      is_completed: false,
      email: email,
    }
  )
  if (error) throw error
  return new Response(JSON.stringify({ 
    status: 'Created',
   }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  })
}

function getTasksId(url: string) : string | null {
  try {
    const { pathname } = new URL(url);
    // Регулярное выражение ищет '/tasks/' и затем один или более символов, не являющихся '/'
    const match = pathname.match(/\/tasks\/([^\/]+)/);
    return match ? match[1] : null;
  } catch (error : unknown) {
    console.error(error);
    return null;
  }
}

function isTask(url: string) : boolean {
  try {
    const { pathname } = new URL(url);
    return pathname.match(/\/tasks/) !== null;
  } catch (error : unknown) {
    console.error(error);
    return false;
  }
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
          // headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )
   

    // For more details on URLPattern, check https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API
    if (isTask(url)) {
      const token = req.headers.get('Authorization')
      if (!token) {
        return new Response(JSON.stringify({ error: 'JWT is required' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        })
      }
      const jwt = token.split(' ')[1]
      const payload = decode(jwt)
      if (!payload) {
        return new Response(JSON.stringify({ error: 'Invalid token' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        })
      } 

      const email = payload[1].email

      const id = getTasksId(url)

      let task = null
      if (method === 'POST' || method === 'PUT') {
        const body = await req.json()
        console.log(body)
        task = body
      }
  
      // call relevant method based on method and id
      switch (true) {
        case id && method === 'GET':
          return getTask(supabaseClient, id as string)
        case id && method === 'PUT':
          return updateTask(supabaseClient, id as string, task)
        case id && method === 'DELETE':
          return deleteTask(supabaseClient, id as string)
        case method === 'POST':
          return createTask(supabaseClient, task, email)
        case method === 'GET':
          return getAllTasks(supabaseClient, email)
        default:
          return getAllTasks(supabaseClient, email)
      }
    } else {
      return new Response(JSON.stringify({ error: 'Invalid URL' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      })
    }
    
  } catch (error) {
   
    

    return new Response(JSON.stringify({ error: error }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})