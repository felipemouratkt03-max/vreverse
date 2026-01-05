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
    processUrl: "Analisar URL",
    urlPlaceholder: "https://youtube.com/watch?v=...",
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
  },
  en: {
    heroTag: "Architect Workstation v5.8",
    heroH1: "extract prompt from video",
    heroDesc: "The high-fidelity protocol for visual DNA reverse engineering. One prompt can redefine your career and legacy.",
    ctaPricing: "Get License",
    ctaWorkstation: "Open Terminal",
    kbTitle: "Knowledge Base",
    kbDesc: "Technical insights on visual DNA extraction and elite prompt engineering.",
    back: "Back Home",
    buyNow: "Start Now",
    loading: "Scanning Neural DNA...",
    systemIntel: "System Intelligence",
    systemIntelDesc: "Deconstructing the impossible",
    terminalLocked: "Terminal Locked",
    getAccess: "Get Access",
    uploadFile: "Upload File",
    processUrl: "Analyze URL",
    urlPlaceholder: "https://youtube.com/watch?v=...",
    masterDNA: "Master DNA",
    copy: "Copy",
    copied: "Copied!",
    portal: "Portal",
    portalTitle: "Architect Portal",
    verifying: "Verifying...",
    unlockTerminal: "Unlock Terminal",
    return: "Back",
    standardPlan: "Monthly Plan",
    monthly: "/month",
    lifetime: "/lifetime",
    bestValue: "Best Value",
    subscribeNow: "Subscribe Now",
    secureAccess: "Secure Access",
    dashboardTitle: "V-Reverse Pro Workstation",
    dashboardSubtitle: "High-fidelity DNA extraction terminal",
    socialKitTitle: "Viral Social Kit",
    variationsTitle: "Robust Technical Variations",
    thumbnailTitle: "Thumbnail Blueprint",
    negativePromptTitle: "Negative DNA (Filters)",
    newAnalysis: "New Analysis",
    stylePrompt: "Prompt Style",
    readyToArchitect: "Ready to architect your success?",
    dontLetViral: "Don't let another viral DNA sequence slip away.",
    subNotFound: "Subscription not found.",
    extractFailed: "Extraction failed. Frame complexity exceeded.",
    targetEngine: "Target Engine",
    parameters: "Technical Parameters",
    fidelity: "Fidelity",
    licenseTitle: "Access Licensing"
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
      <p>O Midjourney v6.1 introduziu uma nova camada de compreensão estética. Para aproveitar isso, você precisa <strong>extract prompt from video</strong> focando em tokens de iluminação PBR.</p>
    `
  }
];

const FAQ_ITEMS = [
  { q: "Qual a precisão da extração de DNA?", a: "Nossa tecnologia opera com 95% de fidelidade, identificando parâmetros como milimetragem de lentes, temperatura Kelvin de luz e tipos específicos de materiais PBR." },
  { q: "Quais modelos de IA são suportados?", a: "Midjourney v6.1, OpenAI Sora, Runway Gen-3, Luma Dream Machine, Kling AI e Google Veo." },
  { q: "Como recebo meu acesso após a compra?", a: "O acesso é imediato via Portal do Arquiteto após a aprovação da Hotmart." }
];

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
  const [videoUrl, setVideoUrl] = useState('');
  
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
    processAnalysis({ type: 'file', base64: '', mimeType: file.type }, file);
  };

  const handleUrlProcess = () => {
    if (!videoUrl || !isSubscriber) return;
    processAnalysis({ type: 'url', url: videoUrl });
  };

  const processAnalysis = async (input: any, file?: File) => {
    setStatus(AnalysisStatus.ANALYZING);
    setResult(null);
    try {
      let finalInput = input;
      if (file) {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
        });
        reader.readAsDataURL(file);
        const b64 = await base64Promise;
        finalInput = { type: 'file', base64: b64, mimeType: file.type };
      }
      
      const res = await analyzeContent(finalInput, targetModel, config);
      setResult(res);
      setStatus(AnalysisStatus.COMPLETED);
    } catch (err) {
      setStatus(AnalysisStatus.IDLE);
      alert(t.extractFailed);
    }
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

        <div className="space-y-6">
          <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem] flex flex-col justify-center text-center h-full">
            <div className="grid gap-6">
              <div onClick={() => fileInputRef.current?.click()} className="group border-2 border-dashed border-white/10 rounded-[2rem] p-10 cursor-pointer hover:border-indigo-500 hover:bg-indigo-600/[0.03] transition-all relative">
                <IconUpload className="w-10 h-10 text-indigo-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-black uppercase italic tracking-widest mb-1">{t.uploadFile}</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">MP4, MOV, PNG, JPG</p>
                <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} />
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-indigo-600 blur-2xl opacity-0 group-focus-within:opacity-10 transition-opacity"></div>
                <div className="bg-white/[0.02] border border-white/10 p-6 rounded-[2rem] space-y-4 relative">
                  <input 
                    type="text" 
                    placeholder={t.urlPlaceholder} 
                    value={videoUrl} 
                    onChange={e => setVideoUrl(e.target.value)} 
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-3 text-xs font-bold outline-none focus:border-indigo-500 transition-all text-center"
                  />
                  <button onClick={handleUrlProcess} className="w-full bg-indigo-600 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:shadow-indigo-500/20 hover:shadow-xl transition-all">
                    {t.processUrl}
                  </button>
                </div>
              </div>
            </div>
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
            <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2rem] space-y-6">
              <h2 className="text-xl font-black uppercase italic text-indigo-400">{t.socialKitTitle}</h2>
              <div className="space-y-4">
                <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                  <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest mb-1 block">Hook</span>
                  <p className="text-sm font-bold italic">"{result.socialKit.hook}"</p>
                </div>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                  <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest mb-1 block">Description</span>
                  <p className="text-xs text-slate-400 whitespace-pre-wrap">{result.socialKit.descriptionPlain}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.socialKit.hashtags.map(h => <span key={h} className="text-[9px] font-bold text-indigo-500">{h}</span>)}
                </div>
              </div>
            </div>
            <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2rem] space-y-6">
              <h2 className="text-xl font-black uppercase italic text-pink-500">{t.negativePromptTitle}</h2>
              <div className="bg-black/40 p-6 rounded-xl border border-white/5 text-xs italic opacity-70 leading-relaxed font-mono">
                {result.negativePrompt}
              </div>
              <button onClick={() => copyToClipboard(result.negativePrompt)} className="w-full bg-white/5 border border-white/10 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-white/10 transition-all">{t.copy} Negative</button>
            </div>
          </div>

          <div className="flex justify-center pt-10">
             <button onClick={() => { setStatus(AnalysisStatus.IDLE); setResult(null); setVideoUrl(''); }} className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl">
                <IconRotate className="w-4 h-4 inline-block mr-2" /> {t.newAnalysis}
             </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderLanding = () => (
    <div className="animate-in fade-in duration-700">
      <section className="text-center mb-24 md:mb-40 pt-20 md:pt-40 px-4">
         <span className="inline-block bg-indigo-600/10 border border-indigo-500/20 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-8">{t.heroTag}</span>
         <h1 className="hero-h1 text-4xl md:text-8xl font-black uppercase tracking-tighter italic leading-none mb-10 gradient-text">{t.heroH1}</h1>
         <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto mb-12 italic">{t.heroDesc}</p>
         <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#pricing" className="w-full sm:w-auto bg-white text-black px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-premium">{t.ctaPricing}</a>
            <button onClick={() => setShowLoginModal(true)} className="w-full sm:w-auto border border-white/10 px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-white/5 transition-all">{t.ctaWorkstation}</button>
         </div>
      </section>

      {/* Features, Pricing, Articles sections would follow same structure as original... */}
      <section id="pricing" className="py-32 border-t border-white/5 space-y-16 bg-gradient-to-b from-transparent to-indigo-950/10">
        <div className="text-center space-y-3">
          <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">{t.licenseTitle}</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4">
          <div className="bg-white/[0.01] border border-white/10 rounded-[3rem] p-12 flex flex-col hover:border-indigo-500 transition-all">
             <h3 className="text-5xl font-black uppercase italic mb-2">R$ 97<span className="text-lg text-slate-600 tracking-normal font-bold">{t.monthly}</span></h3>
             <a href={HOTMART_BASIC} className="block bg-white text-black text-center py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-indigo-600 hover:text-white transition-all mt-8">{t.subscribeNow}</a>
          </div>
          <div className="bg-indigo-600/5 border-2 border-indigo-500 rounded-[3rem] p-12 flex flex-col relative overflow-hidden shadow-premium">
             <h3 className="text-5xl font-black uppercase italic mb-2">R$ 297<span className="text-lg text-indigo-400/50 tracking-normal font-bold">{t.lifetime}</span></h3>
             <a href={HOTMART_ELITE} className="block bg-indigo-600 text-white text-center py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-indigo-500 transition-all mt-8">{t.secureAccess}</a>
          </div>
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
              <button onClick={() => { setIsSubscriber(false); localStorage.removeItem('v-reverse-email'); window.location.hash = ''; }} className="bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase opacity-50 hover:opacity-100 transition-opacity">Logout</button>
            )}
          </div>
        </div>
      </nav>

      {view === 'home' ? (isSubscriber ? renderDashboard() : renderLanding()) : renderPost()}

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