
import React, { useState, useRef, useEffect } from 'react';
import { AnalysisStatus, VideoPromptResult, TARGET_MODELS, WorkstationConfig } from './types';
import { analyzeContent } from './services/geminiService';
import { 
  IconUpload, IconSparkles, IconCopy, IconChevron, IconRotate
} from './components/Icons';
import { checkSubscription } from './services/supabaseClient';

const HOTMART_BASIC = "https://pay.hotmart.com/U103590267K?off=basic_plan";
const HOTMART_ELITE = "https://pay.hotmart.com/U103590267K?off=elite_plan";

const STYLE_OPTIONS = [
  "Cinematic Hyper-Realism",
  "Commercial Product Photography",
  "National Geographic Documentary",
  "Architectural CAD / Schematic",
  "Hand-Painted Concept Art",
  "Cybernetic Bio-Mechanical"
];

interface BlogPost {
  id: string;
  slug: string;
  keyword: string;
  title: string;
  seoTitle: string;
  metaDesc: string;
  content: string;
  readTime: string;
  category: string;
}

const LANGUAGES = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
];

const TRANSLATIONS: Record<string, any> = {
  pt: {
    heroTag: "Workstation Arquiteto v5.8",
    heroH1: "extrair prompt de vídeo",
    heroDesc: "O protocolo de alta fidelidade para engenharia reversa de DNA visual. Um prompt pode redefinir sua carreira e legado.",
    ctaPricing: "Garantir Licença",
    ctaWorkstation: "Abrir Terminal",
    kbTitle: "Base de Conhecimento",
    kbDesc: "Insights técnicos sobre extração de DNA visual e engenharia de prompt de elite.",
    back: "Voltar ao Início",
    buyNow: "Começar Agora",
    loading: "Escaneando DNA Neural...",
    systemIntel: "Inteligência do Sistema",
    systemIntelDesc: "Desconstruindo o impossível",
    terminalLocked: "Terminal Bloqueado",
    getAccess: "Obter Acesso",
    uploadFile: "Enviar Arquivo",
    masterDNA: "DNA Mestre",
    copy: "Copiar",
    copied: "Copiado!",
    portal: "Portal",
    portalTitle: "Portal do Arquiteto",
    verifying: "Verificando...",
    unlockTerminal: "Desbloquear Terminal",
    return: "Voltar",
    standardPlan: "Plano Mensal",
    monthly: "/mês",
    lifetime: "/vitalício",
    bestValue: "Melhor Valor",
    subscribeNow: "Assinar Agora",
    secureAccess: "Garantir Acesso",
    dashboardTitle: "Workstation V-Reverse Pro",
    dashboardSubtitle: "Terminal de extração de DNA de alta fidelidade",
    socialKitTitle: "Kit Social Viral",
    variationsTitle: "Variações Técnicas Robustas",
    thumbnailTitle: "Blueprint de Thumbnail",
    negativePromptTitle: "DNA Negativo (Filtros)",
    newAnalysis: "Nova Análise",
    stylePrompt: "Estilo do Prompt",
    readyToArchitect: "Pronto para arquitetar seu sucesso?",
    dontLetViral: "Não deixe outra sequência de DNA viral escapar das suas mãos.",
    subNotFound: "Assinatura não encontrada.",
    extractFailed: "Falha na extração. Complexidade do frame excedida.",
    targetEngine: "Motor de Destino",
    parameters: "Parâmetros Técnicos",
    fidelity: "Fidelidade",
    licenseTitle: "Licenciamento de Acesso"
  }
};

const POSTS: BlogPost[] = [
  {
    id: "p1",
    slug: "extract-prompt-from-video-protocolo-mestre",
    keyword: "extract prompt from video",
    title: "Protocolo Mestre: Como extrair prompt de vídeo em 2025",
    seoTitle: "Extrair Prompt de Vídeo - Guia Técnico de Alta Fidelidade",
    metaDesc: "O guia definitivo para extrair prompt de vídeo. Domine a desconstrução técnica para Midjourney e Sora com fluxos de alta densidade.",
    category: "Técnico",
    readTime: "60 min",
    content: `
      <p>No cenário de alta competitividade da IA generativa, a capacidade de <strong>extract prompt from video</strong> evoluiu de uma conveniência para um requisito técnico essencial. Para criadores de elite, não basta descrever o que veem; é necessário mapear os pesos neurais que geraram a imagem original.</p>
      <h2>A Ciência por trás da Extração de DNA Visual</h2>
      <p>Quando você decide <strong>extract prompt from video</strong>, você está realizando uma cirurgia reversa. O V-Reverse Pro analisa a temperatura Kelvin da luz, a dispersão espectral e os coeficientes de espalhamento subsuperficial (subsurface scattering). Isso permite que você consiga <strong>extract prompt from video</strong> com uma precisão que ferramentas comuns de "image-to-text" jamais alcançariam.</p>
      <div class="code-block">// PROTOCOLO V-REVERSE v5.8\nLAYER_ANALYSIS: [OPTICS, VOLUMETRICS, MATERIALS, PHYSICS]\nRESOLUTION_SAMPLING: 4K_RAW</div>
      <p>Para <strong>extract prompt from video</strong> de forma eficaz, nosso motor identifica o hardware virtual utilizado: lentes anamórficas, sensores de 35mm e configurações de obturador. Cada um desses elementos é convertido em tokens matemáticos que o Midjourney ou Sora conseguem interpretar perfeitamente.</p>
      <p>A profundidade deste processo garante que, ao <strong>extract prompt from video</strong>, você capture não apenas o "assunto", mas a "alma" visual da obra de referência, permitindo replicação infinita com variações consistentes.</p>
    `
  },
  {
    id: "p2",
    slug: "engenharia-reversa-midjourney-v6",
    keyword: "extrair prompt midjourney",
    title: "Engenharia Reversa para Midjourney v6.1",
    seoTitle: "Como Extrair Prompts para Midjourney v6.1 | V-Reverse Pro",
    metaDesc: "Descubra como extrair a essência visual de qualquer vídeo para usar no Midjourney com fidelidade absoluta.",
    category: "Tutorial",
    readTime: "45 min",
    content: `
      <p>O Midjourney v6.1 introduziu uma nova camada de compreensão estética. Para aproveitar isso, você precisa <strong>extract prompt from video</strong> focando em tokens de iluminação PBR. O segredo está em identificar como a luz global (Global Illumination) interage com os materiais.</p>
      <p>Ao <strong>extract prompt from video</strong>, nossa ferramenta busca por palavras-chave como "ray-traced reflections" e "ambient occlusion". Esses detalhes são o que diferencia uma imagem gerada por amadores de uma obra de arte profissional.</p>
    `
  },
  {
    id: "p3",
    slug: "sora-consistencia-temporal",
    keyword: "prompts para sora",
    title: "Sora: Dominando a Consistência Temporal",
    seoTitle: "Extração de Prompts para Sora - Vídeos IA de Alta Fidelidade",
    metaDesc: "Aprenda a extrair vetores de movimento e física de vídeos reais para usar no OpenAI Sora.",
    category: "Futuro",
    readTime: "50 min",
    content: `
      <p>O Sora exige mais do que apenas descrições estáticas. Para <strong>extract prompt from video</strong> para este modelo, é vital capturar a dinâmica do movimento. Nossa Workstation rastreia vetores de movimento e a física de colisões presente no frame.</p>
      <p>Quando você consegue <strong>extract prompt from video</strong> com foco em física, o resultado no Sora é um vídeo que respeita a gravidade e a inércia, eliminando as famosas "alucinações" de IA que estragam produções profissionais.</p>
    `
  },
  {
    id: "p4",
    slug: "fisica-da-iluminacao-cinematografica",
    keyword: "iluminação cinematográfica ia",
    title: "Física da Iluminação: Do Real ao Latente",
    seoTitle: "Iluminação Cinematográfica em Prompts de IA | Guia Técnico",
    metaDesc: "Como mapear luz volumétrica e sombras complexas em prompts de inteligência artificial.",
    category: "Física",
    readTime: "40 min",
    content: `
      <p>A luz define o humor. Ao <strong>extract prompt from video</strong>, o V-Reverse Pro identifica se a iluminação é 'High-Key' ou 'Low-Key', a posição das fontes de luz e o uso de difusores. Isso é crucial para quem deseja manter a consistência de marca.</p>
      <p>Ao <strong>extract prompt from video</strong>, traduzimos o 'God Rays' para 'Volumetric Tyndall Scattering', garantindo que a IA entenda exatamente como as partículas de poeira devem interagir com os raios de sol no seu cenário virtual.</p>
    `
  },
  {
    id: "p5",
    slug: "optica-virtual-e-lentes",
    keyword: "lentes para prompts ia",
    title: "Óptica Virtual: A Alma de Cada Lente",
    seoTitle: "Simulação de Lentes Reais em Prompts de IA | V-Reverse",
    metaDesc: "Identifique milimetragens e aberturas de lentes reais para aplicar em suas gerações de IA.",
    category: "Óptica",
    readTime: "55 min",
    content: `
      <p>Uma lens de 14mm conta uma história diferente de uma de 85mm. Ao <strong>extract prompt from video</strong>, detectamos a distorção de barril e o campo de visão. Se o vídeo original foi gravado com uma lente anamórfica, nós capturamos o 'squeeze factor' para o prompt.</p>
      <p>Saber <strong>extract prompt from video</strong> com foco em óptica permite que você crie imagens com o 'bokeh' perfeito, replicando lentes lendárias como a Leica Noctilux ou a Zeiss Master Prime.</p>
    `
  },
  {
    id: "p6",
    slug: "dna-negativo-a-importancia-da-exclusao",
    keyword: "negative prompt engineering",
    title: "DNA Negativo: O Poder da Exclusão",
    seoTitle: "Como Criar Prompts Negativos Eficientes via Extração de DNA",
    metaDesc: "Por que o prompt negativo é 50% do seu resultado final em gerações de alta qualidade.",
    category: "Engenharia",
    readTime: "30 min",
    content: `
      <p>Muitas vezes, o que você *não* quer é mais importante. Ao <strong>extract prompt from video</strong>, o V-Reverse Pro gera automaticamente uma camada de 'DNA Negativo'. Isso bloqueia artefatos comuns como aberração cromática indesejada ou texturas plásticas.</p>
      <p>Aprenda a <strong>extract prompt from video</strong> para identificar ruído de sensor e filtrá-lo, resultando em gerações limpas e prontas para uso comercial em grandes telas.</p>
    `
  },
  {
    id: "p7",
    slug: "kit-social-viral-automacao",
    keyword: "metadados virais ia",
    title: "Dominando Redes Sociais com Kits Virais",
    seoTitle: "Automação de Conteúdo Viral: Do Prompt ao Post",
    metaDesc: "Como gerar ganchos (hooks) e legendas magnéticas através da extração de DNA de vídeo.",
    category: "Marketing",
    readTime: "35 min",
    content: `
      <p>O algoritmo das redes sociais é movido por retenção. Ao <strong>extract prompt from video</strong>, nossa IA analisa o 'ritmo' visual e sugere ganchos de abertura que prendem o espectador nos primeiros 3 segundos.</p>
      <p>Ao <strong>extract prompt from video</strong>, você recebe não apenas o comando de imagem, mas toda a estratégia de publicação: títulos, descrições ricas em SEO e hashtags que realmente funcionam em 2025.</p>
    `
  },
  {
    id: "p8",
    slug: "roi-da-engenharia-de-prompt",
    keyword: "roi prompt engineering",
    title: "O ROI da Engenharia de Prompt de Alta Densidade",
    seoTitle: "Valor de Negócio na Extração de Prompts IA | V-Reverse",
    metaDesc: "Entenda como a precisão na extração de prompts economiza milhares de dólares em produção.",
    category: "Negócios",
    readTime: "40 min",
    content: `
      <p>Tempo é o recurso mais caro. Profissionais decidem <strong>extract prompt from video</strong> porque isso elimina o 'tentativa e erro'. Em vez de queimar créditos e horas testando variações aleatórias, você usa um blueprint cirúrgico.</p>
      <p>Investir em uma licença para <strong>extract prompt from video</strong> com o V-Reverse Pro se paga no primeiro projeto comercial, onde a consistência e a velocidade são os diferenciais que garantem a satisfação do cliente final.</p>
    `
  }
];

const FAQ_ITEMS = [
  { q: "Qual a precisão da extração de DNA?", a: "Nossa tecnologia opera com 95% de fidelidade, identificando parâmetros como milimetragem de lentes, temperatura Kelvin de luz e tipos específicos de materiais PBR." },
  { q: "Quais modelos de IA são suportados?", a: "Midjourney v6.1, OpenAI Sora, Runway Gen-3, Luma Dream Machine, Kling AI e Google Veo." },
  { q: "Como recebo meu acesso após a compra?", a: "O acesso é imediato via Portal do Arquiteto após a aprovação da Hotmart. Você receberá as instruções no seu e-mail de compra." },
  { q: "Posso extrair de URLs do YouTube ou Instagram?", a: "Sim, assinantes do Plano Elite podem colar URLs diretamente para processamento neural (sujeito aos termos de serviço das plataformas)." },
  { q: "O pagamento é único ou assinatura?", a: "Oferecemos o Plano Mensal Standard para uso recorrente e o Plano Vitalício Elite para acesso permanente com todos os futuros updates inclusos." }
];

// Added missing FEATURES constant to fix the reference error on line 451
const FEATURES = [
  { title: "Engenharia Óptica", desc: "Mapeamento preciso de lentes, sensores e abertura para recriação física." },
  { title: "DNA Materiais", desc: "Desconstrução de texturas PBR, coeficientes de reflexo e dispersão." },
  { title: "Dinâmica Neural", desc: "Captura de vetores de movimento e física de colisão para modelos de vídeo." },
  { title: "Sinergia de Modelos", desc: "Suporte nativo para Midjourney, Sora, Runway, Kling e mais." }
];

const App: React.FC = () => {
  const [lang, setLang] = useState('pt');
  const [view, setView] = useState<'home' | 'post'>('home');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<VideoPromptResult | null>(null);
  const [targetModel, setTargetModel] = useState('midjourney');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  const [config, setConfig] = useState<WorkstationConfig>({
    fidelity: 95,
    detailLevel: 90,
    promptStyle: 'Cinematic Hyper-Realism'
  });

  const [isSubscriber, setIsSubscriber] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.pt;

  useEffect(() => {
    const savedEmail = localStorage.getItem('v-reverse-email');
    if (savedEmail) validateSub(savedEmail);
    
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      const post = POSTS.find(p => p.slug === hash);
      if (post) { setActivePost(post); setView('post'); window.scrollTo(0, 0); } 
      else { setView('home'); setActivePost(null); }
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const validateSub = async (email: string) => {
    setLoginLoading(true);
    const active = await checkSubscription(email);
    if (active) {
      setIsSubscriber(true);
      localStorage.setItem('v-reverse-email', email);
      setShowLoginModal(false);
    } else if (loginEmail) {
      alert(t.subNotFound);
    }
    setLoginLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isSubscriber) return;
    setStatus(AnalysisStatus.ANALYZING);
    setResult(null);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const b64 = (reader.result as string).split(',')[1];
        const res = await analyzeContent({ type: 'file', base64: b64, mimeType: file.type }, targetModel, config);
        setResult(res);
        setStatus(AnalysisStatus.COMPLETED);
      } catch (err) {
        setStatus(AnalysisStatus.IDLE);
        alert(t.extractFailed);
      }
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(t.copied);
  };

  const renderDashboard = () => (
    <div className="pt-32 px-4 pb-40 max-w-7xl mx-auto space-y-16 animate-in fade-in duration-700">
      <header className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter gradient-text">{t.dashboardTitle}</h1>
        <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px]">{t.dashboardSubtitle}</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2rem] space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{t.targetEngine}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TARGET_MODELS.map(m => (
                <button key={m.id} onClick={() => setTargetModel(m.id)} className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${targetModel === m.id ? 'bg-indigo-600 border-indigo-400 shadow-lg' : 'bg-white/5 border-white/10 opacity-50'}`}>
                  <span className="text-xl">{m.icon}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest">{m.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2rem] space-y-6">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{t.parameters}</h3>
             <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-black uppercase text-slate-600"><span>{t.fidelity}</span><span className="text-indigo-400">{config.fidelity}%</span></div>
                  <input type="range" min="0" max="100" value={config.fidelity} onChange={e => setConfig({...config, fidelity: parseInt(e.target.value)})} className="w-full accent-indigo-600" />
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase text-slate-600 tracking-widest">{t.stylePrompt}</span>
                  <select value={config.promptStyle} onChange={e => setConfig({...config, promptStyle: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-xs font-bold outline-none focus:border-indigo-500 transition-colors">
                    {STYLE_OPTIONS.map(opt => <option key={opt} value={opt} className="bg-[#0f172a]">{opt}</option>)}
                  </select>
                </div>
             </div>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem] flex flex-col justify-center text-center">
          <div onClick={() => fileInputRef.current?.click()} className="group border-2 border-dashed border-white/10 rounded-[2rem] p-12 md:p-20 cursor-pointer hover:border-indigo-500 hover:bg-indigo-600/[0.03] transition-all relative">
            <IconUpload className="w-12 h-12 text-indigo-600 mx-auto mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-black uppercase italic tracking-widest mb-1">{t.uploadFile}</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">MP4, MOV, PNG, JPG</p>
            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} />
          </div>
        </div>
      </div>

      {status === AnalysisStatus.ANALYZING && (
        <div className="py-24 text-center space-y-8">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="text-3xl font-black uppercase italic animate-pulse">{t.loading}</h2>
        </div>
      )}

      {status === AnalysisStatus.COMPLETED && result && (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-10">
          {/* Master DNA */}
          <div className="bg-white/[0.02] border border-white/10 p-8 md:p-12 rounded-[2.5rem] space-y-8 shadow-premium">
            <div className="flex flex-col sm:flex-row justify-between items-center border-b border-white/5 pb-6 gap-4">
              <h2 className="text-3xl font-black uppercase italic">{t.masterDNA}</h2>
              <button onClick={() => copyToClipboard(result.fullMasterPrompt)} className="bg-indigo-600 px-6 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest flex items-center gap-2">
                <IconCopy className="w-4 h-4" /> {t.copy} Full Prompt
              </button>
            </div>
            <div className="bg-black/60 p-6 md:p-10 rounded-[1.5rem] border border-white/5 text-sm md:text-lg font-medium italic text-slate-300 leading-relaxed font-serif max-h-96 overflow-y-auto">
              "{result.fullMasterPrompt}"
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Social Kit */}
            <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2rem] space-y-6">
              <h2 className="text-xl font-black uppercase italic text-indigo-400">{t.socialKitTitle}</h2>
              <div className="space-y-4">
                <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                  <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest mb-1 block">Hook</span>
                  <p className="text-sm font-bold italic">"{result.socialKit.hook}"</p>
                </div>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                  <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest mb-1 block">Descrição</span>
                  <p className="text-xs text-slate-400 whitespace-pre-wrap">{result.socialKit.descriptionPlain}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.socialKit.hashtags.map(h => <span key={h} className="text-[9px] font-bold text-indigo-500">{h}</span>)}
                </div>
              </div>
            </div>
            {/* Negative DNA */}
            <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2rem] space-y-6">
              <h2 className="text-xl font-black uppercase italic text-pink-500">{t.negativePromptTitle}</h2>
              <div className="bg-black/40 p-6 rounded-xl border border-white/5 text-xs italic opacity-70 leading-relaxed font-mono">
                {result.negativePrompt}
              </div>
              <button onClick={() => copyToClipboard(result.negativePrompt)} className="w-full bg-white/5 border border-white/10 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-white/10 transition-all">{t.copy} Negative</button>
            </div>
          </div>

          {/* Thumbnail Blueprint */}
          <div className="bg-indigo-600/5 border border-indigo-500/20 p-8 md:p-12 rounded-[2.5rem] space-y-6">
             <h2 className="text-xl font-black uppercase italic text-indigo-400">{t.thumbnailTitle}</h2>
             <div className="grid md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-2 bg-black/40 p-6 rounded-xl border border-white/5 font-serif italic text-base leading-relaxed">
                  "{result.thumbnailBlueprint.prompt}"
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] text-slate-400 leading-relaxed uppercase font-bold tracking-widest">{result.thumbnailBlueprint.visualComposition}</p>
                  <button onClick={() => copyToClipboard(result.thumbnailBlueprint.prompt)} className="w-full bg-indigo-600 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest">{t.copy} Thumbnail DNA</button>
                </div>
             </div>
          </div>

          {/* Variations */}
          <div className="space-y-10">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-center">{t.variationsTitle}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {result.viralVariations.map((v, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/10 p-6 rounded-[1.5rem] space-y-4 hover:border-indigo-500 transition-all flex flex-col group">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black uppercase text-indigo-500 tracking-widest">{v.type}</span>
                    <h3 className="text-lg font-black uppercase italic group-hover:text-indigo-400 transition-colors">{v.title}</h3>
                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">{v.strategy}</p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-xl border border-white/5 text-[10px] flex-grow font-serif italic max-h-48 overflow-y-auto leading-relaxed text-slate-400">
                    "{v.fullModifiedPrompt}"
                  </div>
                  <button onClick={() => copyToClipboard(v.fullModifiedPrompt)} className="w-full bg-white/5 border border-white/10 py-3 rounded-lg font-black uppercase text-[9px] tracking-widest group-hover:bg-indigo-600 transition-all">{t.copy} Variação</button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center pt-10">
             <button onClick={() => { setStatus(AnalysisStatus.IDLE); setResult(null); }} className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl">
                <IconRotate className="w-4 h-4 inline-block mr-2" /> {t.newAnalysis}
             </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderLanding = () => (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="text-center mb-24 md:mb-40 pt-20 md:pt-40 px-4">
         <span className="inline-block bg-indigo-600/10 border border-indigo-500/20 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-8">{t.heroTag}</span>
         <h1 className="hero-h1 text-4xl md:text-8xl font-black uppercase tracking-tighter italic leading-none mb-10 gradient-text">{t.heroH1}</h1>
         <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto mb-12 italic">{t.heroDesc}</p>
         <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#pricing" className="w-full sm:w-auto bg-white text-black px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-premium">{t.ctaPricing}</a>
            <button onClick={() => setShowLoginModal(true)} className="w-full sm:w-auto border border-white/10 px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-white/5 transition-all">{t.ctaWorkstation}</button>
         </div>
      </section>

      {/* Features */}
      <section className="py-24 border-t border-white/5 max-w-7xl mx-auto px-4">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">{t.systemIntel}</h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px]">{t.systemIntelDesc}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-8 bg-white/[0.02] border border-white/10 rounded-[2rem] hover:bg-indigo-600/[0.05] transition-all group">
              <IconSparkles className="w-6 h-6 text-indigo-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-3 text-indigo-400">{f.title}</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 border-t border-white/5 space-y-16 bg-gradient-to-b from-transparent to-indigo-950/10">
        <div className="text-center space-y-3">
          <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">{t.licenseTitle}</h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px]">Escolha seu nível de acesso ao DNA Visual</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4">
          <div className="bg-white/[0.01] border border-white/10 rounded-[3rem] p-12 flex flex-col hover:border-indigo-500 transition-all">
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block">{t.standardPlan}</span>
                <h3 className="text-5xl font-black uppercase italic mb-2">R$ 97<span className="text-lg text-slate-600 tracking-normal font-bold">{t.monthly}</span></h3>
              </div>
              <IconSparkles className="w-6 h-6 text-slate-700" />
            </div>
            <ul className="space-y-4 mb-10 text-slate-500 font-medium text-sm">
              <li className="flex items-center gap-2"><IconSparkles className="w-3 h-3 text-indigo-500"/> Extração ilimitada de prompts</li>
              <li className="flex items-center gap-2"><IconSparkles className="w-3 h-3 text-indigo-500"/> Kit Social Viral Automático</li>
              <li className="flex items-center gap-2"><IconSparkles className="w-3 h-3 text-indigo-500"/> Blueprint de Thumbnails</li>
            </ul>
            <a href={HOTMART_BASIC} className="block bg-white text-black text-center py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl">{t.subscribeNow}</a>
          </div>
          <div className="bg-indigo-600/5 border-2 border-indigo-500 rounded-[3rem] p-12 flex flex-col relative overflow-hidden shadow-premium">
            <div className="absolute top-0 right-0 bg-indigo-500 text-[8px] font-black uppercase tracking-[0.3em] px-8 py-2 -rotate-45 translate-x-12 translate-y-6">{t.bestValue}</div>
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 block">Plano Vitalício Elite</span>
                <h3 className="text-5xl font-black uppercase italic mb-2">R$ 297<span className="text-lg text-indigo-400/50 tracking-normal font-bold">{t.lifetime}</span></h3>
              </div>
              <IconSparkles className="w-8 h-8 text-indigo-400" />
            </div>
            <ul className="space-y-4 mb-10 text-slate-300 font-medium text-sm">
              <li className="flex items-center gap-2"><IconSparkles className="w-4 h-4 text-indigo-500"/> Tudo do plano mensal</li>
              <li className="flex items-center gap-2"><IconSparkles className="w-4 h-4 text-indigo-500"/> Extração via URL (YouTube/TikTok)</li>
              <li className="flex items-center gap-2"><IconSparkles className="w-4 h-4 text-indigo-500"/> Updates vitalícios do motor neural</li>
            </ul>
            <a href={HOTMART_ELITE} className="block bg-indigo-600 text-white text-center py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-indigo-500 transition-all shadow-indigo-500/20 shadow-2xl">{t.secureAccess}</a>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-32 border-t border-white/5 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-5xl font-black uppercase italic tracking-tighter">{t.kbTitle}</h2>
            <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px]">{t.kbDesc}</p>
          </div>
          <div className="grid gap-6">
            {POSTS.map(post => (
              <a key={post.id} href={`#${post.slug}`} className="group flex flex-col md:flex-row md:items-center justify-between p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-white/[0.05] transition-all">
                <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase text-indigo-500 tracking-widest">{post.category}</span>
                  <h3 className="text-xl md:text-2xl font-black uppercase italic group-hover:text-indigo-400 transition-colors">{post.title}</h3>
                </div>
                <div className="mt-4 md:mt-0 flex items-center gap-4 text-[10px] font-black uppercase text-slate-600 tracking-widest">
                  <span>{post.readTime}</span>
                  <IconChevron className="w-4 h-4 -rotate-90 text-indigo-600" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 border-t border-white/5 max-w-3xl mx-auto px-4">
        <h2 className="text-4xl font-black uppercase italic text-center mb-12">FAQ</h2>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full p-6 flex justify-between items-center text-left">
                <span className="font-bold uppercase tracking-tight text-slate-300 text-sm">{item.q}</span>
                <IconChevron className={`w-4 h-4 transition-transform ${openFaq === i ? 'rotate-180 text-indigo-500' : ''}`} />
              </button>
              {openFaq === i && <div className="px-6 pb-6 text-slate-500 text-sm leading-relaxed pt-4 border-t border-white/5">{item.a}</div>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderPost = () => {
    if (!activePost) return null;
    return (
      <div className="animate-in slide-in-from-bottom-10 duration-700 pt-32 pb-40">
        <div className="max-w-4xl mx-auto px-6">
          <button onClick={() => { window.location.hash = ''; }} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-12 hover:text-white transition-colors">
            <IconChevron className="w-4 h-4 rotate-90" /> {t.back}
          </button>
          <article className="post-body">
            <h1 className={activePost.keyword === "extract prompt from video" ? "gradient-text" : ""}>{activePost.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: activePost.content }} />
            <div className="mt-20 p-12 bg-indigo-600/10 border border-indigo-500/20 rounded-[3rem] text-center space-y-8">
               <h2 className="text-4xl font-black uppercase italic tracking-tighter m-0 border-0 p-0">{t.readyToArchitect}</h2>
               <p className="text-xl font-medium text-slate-400 italic">{t.dontLetViral}</p>
               <a href="#pricing" className="inline-block bg-white text-black px-12 py-6 rounded-2xl font-black uppercase text-sm tracking-widest hover:scale-105 transition-all">{t.buyNow}</a>
            </div>
          </article>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 w-full z-[150] glass border-b border-white/5 px-4 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a href="#" className="flex items-center gap-2" onClick={(e) => { e.preventDefault(); window.location.hash = ''; }}>
            <IconSparkles className="w-5 h-5 text-indigo-500" />
            <span className="font-black tracking-tighter text-lg uppercase italic">V-REVERSE <span className="text-indigo-500">PRO</span></span>
          </a>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-[10px] font-bold">
                {LANGUAGES.find(l => l.code === lang)?.flag} <span className="hidden sm:inline">{LANGUAGES.find(l => l.code === lang)?.name}</span>
              </button>
              <div className="absolute top-full right-0 mt-2 w-40 bg-[#0f172a] border border-white/10 rounded-xl overflow-hidden hidden group-hover:block z-[200]">
                {LANGUAGES.map(l => (
                  <button key={l.code} onClick={() => setLang(l.code)} className="w-full px-4 py-3 text-left text-[10px] font-bold hover:bg-indigo-600 flex items-center gap-3">
                    <span>{l.flag}</span> {l.name}
                  </button>
                ))}
              </div>
            </div>
            {!isSubscriber && <button onClick={() => setShowLoginModal(true)} className="bg-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase">{t.portal}</button>}
            {isSubscriber && (
              <div className="flex items-center gap-3">
                <span className="bg-indigo-500/10 border border-indigo-500/20 text-[8px] font-black uppercase tracking-widest text-indigo-400 px-3 py-1.5 rounded-lg hidden sm:inline">License: PRO</span>
                <button onClick={() => { setIsSubscriber(false); localStorage.removeItem('v-reverse-email'); window.location.hash = ''; }} className="bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase opacity-50 hover:opacity-100 transition-opacity">Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {view === 'home' ? (isSubscriber ? renderDashboard() : renderLanding()) : renderPost()}

      <footer className="border-t border-white/5 py-16 text-center">
        <IconSparkles className="w-6 h-6 text-indigo-600 mx-auto mb-6" />
        <span className="font-black text-xl uppercase italic block mb-4">V-REVERSE PRO</span>
        <p className="text-slate-600 text-[9px] uppercase tracking-[0.5em]">&copy; 2025 Architect Prime Workstation</p>
      </footer>

      {showLoginModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl">
          <div className="w-full max-w-md p-10 bg-[#0f172a] border border-white/10 rounded-[3rem] text-center space-y-8 shadow-premium">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic">{t.portalTitle}</h2>
            <input type="email" placeholder="email@architect.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-center font-bold outline-none focus:border-indigo-500 transition-all" />
            <button onClick={() => validateSub(loginEmail)} disabled={loginLoading} className="w-full bg-indigo-600 py-4 rounded-xl font-black uppercase text-xs tracking-widest">
              {loginLoading ? t.verifying : t.unlockTerminal}
            </button>
            <button onClick={() => setShowLoginModal(false)} className="text-[10px] font-black uppercase opacity-30">{t.return}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
