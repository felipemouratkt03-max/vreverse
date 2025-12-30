
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, hottok',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Usando nomes que NÃO começam com SUPABASE_ para evitar erro no CLI
    // Fix: Access environment variables via process.env to resolve "Cannot find name 'Deno'" 
    // and maintain consistency with project guidelines for environment variable access.
    const DB_URL = process.env.APP_DB_URL ?? ""
    const SERVICE_ROLE = process.env.APP_SERVICE_ROLE ?? ""

    if (!DB_URL || !SERVICE_ROLE) {
      throw new Error("Configurações de ambiente (APP_DB_URL ou APP_SERVICE_ROLE) não encontradas.");
    }

    const body = await req.json()
    console.log("Recebido Webhook:", JSON.stringify(body))

    const email = (body.email || body.data?.buyer?.email || "").toLowerCase().trim();
    const status = (body.status || body.data?.status || "").toLowerCase();
    const event = body.event;

    const approvedStatus = ['approved', 'complete', 'active', 'active_subscription'];
    const approvedEvents = ['PURCHASE_APPROVED', 'PURCHASE_COMPLETE', 'SUBSCRIPTION_RENEWAL'];
    
    const isApproved = approvedStatus.includes(status) || approvedEvents.includes(event);

    if (email && isApproved) {
      const supabase = createClient(DB_URL, SERVICE_ROLE)
      
      const { error } = await supabase
        .from('subscribers')
        .upsert([{ 
          email: email, 
          last_event: event || status,
          updated_at: new Date().toISOString()
        }], { onConflict: 'email' })

      if (error) throw error;
      console.log(`✅ Acesso liberado: ${email}`);
    }

    return new Response(JSON.stringify({ message: "OK" }), { 
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    })

  } catch (err) {
    console.error("❌ Erro:", (err as Error).message)
    return new Response(JSON.stringify({ error: (err as Error).message }), { 
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    })
  }
})
