
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eunkucxcttrakmtgxpup.supabase.co';
const supabaseKey = 'sb_publishable_W8D0WR0_gwUoJqxfTG01OA_b145MRON';

export const supabase = createClient(supabaseUrl, supabaseKey);

// E-mail correto do Super Admin para bypass de autenticação
const SUPER_ADMINS = ['jadermourabh@gmail.com'];

/**
 * Verifica se um e-mail existe na base de dados ou é um super admin
 */
export const checkSubscription = async (email: string): Promise<boolean> => {
  if (!email || !email.includes('@')) return false;
  
  const cleanEmail = email.toLowerCase().trim();

  // Bypass imediato para Super Admin
  if (SUPER_ADMINS.includes(cleanEmail)) {
    console.log('Acesso Super Admin detectado para:', cleanEmail);
    return true;
  }

  try {
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
