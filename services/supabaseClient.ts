
import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const supabaseUrl = 'https://eunkucxcttrakmtgxpup.supabase.co';
const supabaseKey = 'sb_publishable_W8D0WR0_gwUoJqxfTG01OA_b145MRON';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Verifica se um e-mail existe na base de dados
 * Adiciona normalização de strings para evitar erros comuns de digitação
 */
export const checkSubscription = async (email: string): Promise<boolean> => {
  if (!email || !email.includes('@')) return false;
  
  const cleanEmail = email.toLowerCase().trim();

  try {
    // Busca na tabela 'subscribers' que é populada pelo nosso Webhook (via Cloudflare ou CLI)
    const { data, error } = await supabase
      .from('subscribers')
      .select('email')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (error) {
      console.warn('Falha na consulta Supabase:', error.message);
      return false;
    }
    
    return !!data;
  } catch (e) {
    console.error('Falha crítica na API Supabase:', e);
    return false;
  }
};
