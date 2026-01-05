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
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' }
];

const TRANSLATIONS: Record<string, any> = {
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
    licenseTitle: "Access Licensing",
    faqTitle: "Frequently Asked Questions",
    featuresTitle: "System Architecture",
    featuresSubtitle: "Reverse Engineering Capabilities"
  },
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
    fidelity: "Fidelity",
    licenseTitle: "Licenciamento de Acesso",
    faqTitle: "Perguntas Frequentes",
    featuresTitle: "Arquitetura do Sistema",
    featuresSubtitle: "Capacidades de Engenharia Reversa"
  }
};

const POSTS: BlogPost[] = [
  {
    id: "p1",
    slug: "extract-prompt-from-video-protocolo-mestre",
    keyword: "extract prompt from video",
    title: "Master Protocol: How to extract prompt from video in 2025",
    seoTitle: "Extract Prompt from Video - High Fidelity Technical Guide",
    metaDesc: "The definitive guide to extract prompt from video. Master technical deconstruction for Midjourney and Sora.",
    category: "Technical",
    readTime: "60 min",
    content: `
      <p>In the highly competitive landscape of generative AI, the ability to <strong>extract prompt from video</strong> has evolved from a convenience to an essential technical requirement for content architects.</p>
      <h2>The Science of Visual DNA Extraction</h2>
      <p>When you decide to <strong>extract prompt from video</strong>, you are performing reverse surgery on neural weights. V-Reverse Pro analyzes light Kelvin temperature, spectral dispersion, and specific lens configurations.</p>
      <div class="code-block">// V-REVERSE CORE v5.8\nANALYSIS_MODE: MOLECULAR\nSAMPLING_RATE: 4K_DPI\nLENS_MAPPING: ENABLED</div>
      <p>By mapping the precise optics used in the original video, we generate text that the AI understands as instructions for physical camera properties, not just general descriptions.</p>
    `
  },
  {
    id: "p2",
    slug: "engenharia-reversa-midjourney-v6",
    keyword: "extrair prompt midjourney",
    title: "Reverse Engineering for Midjourney v6.1",
    seoTitle: "How to Extract Prompts for Midjourney v6.1 | V-Reverse Pro",
    metaDesc: "Discover how to extract visual essence for Midjourney with absolute fidelity using our workstation.",
    category: "Tutorial",
    readTime: "45 min",
    content: `
      <p>Midjourney v6.1 introduced new aesthetic comprehension levels. To leverage this, you must <strong>extract prompt from video</strong> focusing on PBR (Physically Based Rendering) lighting tokens.</p>
      <p>Our tool isolates specific styles and lighting rigs, allowing you to replicate high-end commercial looks with a single technical text block.</p>
    `
  },
  {
    id: "p3",
    slug: "sora-consistencia-temporal",
    keyword: "sora prompt engineering",
    title: "OpenAI Sora: Achieving Temporal Consistency",
    seoTitle: "Extract Prompts for Sora Video AI | V-Reverse Protocol",
    metaDesc: "How to extract temporal DNA from video to feed OpenAI Sora's physics engine.",
    category: "AI Video",
    readTime: "50 min",
    content: `
      <p>Sora requires more than just aesthetics; it needs physical vectors. To <strong>extract prompt from video</strong> for Sora, you must identify motion curves and collision dynamics.</p>
      <p>V-Reverse Pro translates these physical movements into high-density tokens that inform Sora's fluid simulation engines.</p>
    `
  },
  {
    id: "p4",
    slug: "fisica-da-iluminacao-cinematografica",
    keyword: "cinematic lighting prompt",
    title: "The Physics of Cinematic Lighting in Prompts",
    seoTitle: "Cinematic Lighting Extraction Guide | V-Reverse Pro",
    metaDesc: "Master the extraction of light transport and Kelvin values from existing footage.",
    category: "Physics",
    readTime: "40 min",
    content: `
      <p>Light is the soul of any frame. Learn to <strong>extract prompt from video</strong> that accurately describes global illumination, ray-tracing reflections, and volumetric fog.</p>
      <p>Using the Architect Workstation, you can map the specific light sources (Key, Fill, Rim) and their intensities into a prompt that AI models can execute perfectly.</p>
    `
  },
  {
    id: "p5",
    slug: "optica-virtual-e-lentes",
    keyword: "virtual optics prompt",
    title: "Virtual Optics: Lens Mapping for AI",
    seoTitle: "How to Extract Lens Metadata for AI Prompts",
    metaDesc: "Deconstruct focal lengths and apertures from any frame into technical text.",
    category: "Optics",
    readTime: "35 min",
    content: `
      <p>Is it Anamorphic or Spherical? When you <strong>extract prompt from video</strong>, lens metadata is the bridge between a 'nice image' and a 'cinematic masterpiece'.</p>
      <p>Our system identifies depth of field, chromatic aberration, and bokeh shapes to give your prompts professional optical weight.</p>
    `
  },
  {
    id: "p6",
    slug: "dna-negativo-a-importancia-da-exclusao",
    keyword: "negative prompt extraction",
    title: "Negative DNA: The Power of Exclusion",
    seoTitle: "Extracting Negative Prompts from Video | V-Reverse Pro",
    metaDesc: "Learn why defining what is NOT in the image is as important as the subject.",
    category: "Strategy",
    readTime: "30 min",
    content: `
      <p>Effective prompts require clear boundaries. We show you how to <strong>extract prompt from video</strong> including the 'Negative DNA' – the specific artifacts and styles the AI must avoid.</p>
      <p>Excluding noise, low-res textures, and unwanted stylistic shifts is key to professional output consistency.</p>
    `
  },
  {
    id: "p7",
    slug: "kit-social-viral-automacao",
    keyword: "viral video metadata",
    title: "Social Kit: Automating Viral Metadata",
    seoTitle: "How to Extract Social Media Hooks from Video DNA",
    metaDesc: "Turn a single extraction into a full social media kit with hooks and descriptions.",
    category: "Marketing",
    readTime: "25 min",
    content: `
      <p>Convert your technical DNA into views. Learn to <strong>extract prompt from video</strong> while simultaneously generating viral captions, hooks, and technical SFX directions for editors.</p>
      <p>Our Viral Social Kit bridges the gap between technical creation and audience retention.</p>
    `
  },
  {
    id: "p8",
    slug: "roi-da-engenharia-de-prompt",
    keyword: "prompt engineering business",
    title: "The ROI of Elite Prompt Engineering",
    seoTitle: "The Business Value of High-Fidelity Prompt Extraction",
    metaDesc: "Why investing in professional extraction tools pays off for agencies and creators.",
    category: "Business",
    readTime: "20 min",
    content: `
      <p>Quality inputs lead to quality outputs. To <strong>extract prompt from video</strong> at a professional level saves agencies hundreds of hours in trial-and-error costs.</p>
      <p>V-Reverse Pro is the investment that scales your output quality while reducing your compute time.</p>
    `
  }
];

const FAQ_ITEMS = [
  { q: "How precise is the DNA extraction?", a: "Our technology operates with 95% fidelity, identifying parameters like lens focal length, Kelvin light temperature, and specific PBR material types from any source media." },
  { q: "Which AI models are supported?", a: "Midjourney v6.1, OpenAI Sora, Runway Gen-3, Luma Dream Machine, Kling AI, and Google Veo. We optimize the prompt logic for the specific model you select." },
  { q: "How do I receive access after purchase?", a: "Access is immediate via the Architect Portal. Once Hotmart approves your payment, simply login with your purchase email to unlock the terminal." },
  { q: "Does it work with YouTube and TikTok URLs?", a: "Yes, the Pro terminal accepts direct URLs. It uses an internal search tool to analyze remote frames and extract the technical prompt without downloading." },
  { q: "Can I use it for high-end commercial projects?", a: "Absolutely. V-Reverse Pro is designed for elite agencies and high-end visual creators who need exact aesthetic replication." }
];

const FEATURES_LIST = [
  { title: "Optical Engineering", desc: "Precise mapping of lenses, sensors, and apertures for physical recreation in AI prompts." },
  { title: "Material DNA", desc: "Deconstruction of PBR textures, reflection coefficients, and spectral light dispersion." },
  { title: "Neural Dynamics", desc: "Capture of motion vectors, physics of collision, and fluid dynamics for video models." },
  { title: "Engine Synergy", desc: "Automatic optimization for Midjourney, Sora, Runway, Kling, and all major AI engines." }
];

const App: React.FC = () => {
  const [lang, setLang] = useState('en');
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
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

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
          <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2rem] space-y-6 shadow-xl">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{t.targetEngine}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TARGET_MODELS.map(m => (
                <button key={m.id} onClick={() => setTargetModel(m.id)} className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${targetModel === m.id ? 'bg-indigo-600 border-indigo-400 shadow-lg' : 'bg-white/5 border-white/10 opacity-50'}`}>
                  <span className="text-xl">{m.icon}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest">{m.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2rem] space-y-6">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{t.parameters}</h3>
             <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-black uppercase text-slate-400 tracking-widest"><span>{t.fidelity}</span><span className="text-indigo-400">{config.fidelity}%</span></div>
                  <input type="range" min="0" max="100" value={config.fidelity} onChange={e => setConfig({...config, fidelity: parseInt(e.target.value)})} className="w-full accent-indigo-600" />
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{t.stylePrompt}</span>
                  <select value={config.promptStyle} onChange={e => setConfig({...config, promptStyle: e.target.value})} className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-xs font-bold outline-none focus:border-indigo-500 transition-colors">
                    {STYLE_OPTIONS.map(opt => <option key={opt} value={opt} className="bg-[#0f172a]">{opt}</option>)}
                  </select>
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem] flex flex-col justify-center text-center h-full gap-8">
            <div onClick={() => fileInputRef.current?.click()} className="group border-2 border-dashed border-white/10 rounded-[2rem] p-12 cursor-pointer hover:border-indigo-500 hover:bg-indigo-600/[0.03] transition-all relative">
              <IconUpload className="w-12 h-12 text-indigo-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-black uppercase italic tracking-widest mb-1">{t.uploadFile}</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">MP4, MOV, PNG, JPG (MAX 20MB)</p>
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} />
            </div>
            
            <div className="relative group">
              <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2rem] space-y-4 relative">
                <input 
                  type="text" 
                  placeholder={t.urlPlaceholder} 
                  value={videoUrl} 
                  onChange={e => setVideoUrl(e.target.value)} 
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-5 py-4 text-xs font-bold outline-none focus:border-indigo-500 transition-all text-center placeholder:opacity-30"
                />
                <button onClick={handleUrlProcess} className="w-full bg-indigo-600 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:shadow-indigo-500/40 hover:shadow-2xl transition-all active:scale-95">
                  {t.processUrl}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {status === AnalysisStatus.ANALYZING && (
        <div className="py-24 text-center space-y-8 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto shadow-[0_0_50px_-12px_rgba(79,70,229,0.5)]"></div>
          <h2 className="text-3xl font-black uppercase italic animate-pulse tracking-tighter">{t.loading}</h2>
        </div>
      )}

      {status === AnalysisStatus.COMPLETED && result && (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="bg-white/[0.02] border border-white/10 p-8 md:p-16 rounded-[3rem] space-y-10 shadow-premium">
            <div className="flex flex-col sm:flex-row justify-between items-center border-b border-white/5 pb-8 gap-4">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter">{t.masterDNA}</h2>
              <button onClick={() => copyToClipboard(result.fullMasterPrompt)} className="bg-indigo-600 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 hover:bg-indigo-500 transition-all shadow-xl">
                <IconCopy className="w-5 h-5" /> {t.copy} Full Prompt
              </button>
            </div>
            <div className="bg-black/60 p-8 md:p-12 rounded-[2rem] border border-white/5 text-lg md:text-xl font-medium italic text-slate-300 leading-relaxed font-serif max-h-[500px] overflow-y-auto custom-scrollbar">
              "{result.fullMasterPrompt}"
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white/[0.02] border border-white/10 p-10 rounded-[2.5rem] space-y-8">
              <h2 className="text-2xl font-black uppercase italic text-indigo-400 tracking-tighter">{t.socialKitTitle}</h2>
              <div className="space-y-6">
                <div className="bg-black/40 p-6 rounded-2xl border border-white/5 group hover:border-indigo-500/30 transition-all">
                  <span className="text-[8px] font-black uppercase text-indigo-500 tracking-widest mb-2 block">Hook Protocol</span>
                  <p className="text-lg font-bold italic leading-tight">"{result.socialKit.hook}"</p>
                </div>
                <div className="bg-black/40 p-6 rounded-2xl border border-white/5 group hover:border-indigo-500/30 transition-all">
                  <span className="text-[8px] font-black uppercase text-indigo-500 tracking-widest mb-2 block">Caption Strategy</span>
                  <p className="text-xs text-slate-400 whitespace-pre-wrap leading-relaxed">{result.socialKit.descriptionPlain}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/[0.02] border border-white/10 p-10 rounded-[2.5rem] space-y-8">
              <h2 className="text-2xl font-black uppercase italic text-pink-500 tracking-tighter">{t.negativePromptTitle}</h2>
              <div className="bg-black/40 p-8 rounded-2xl border border-white/5 text-xs italic opacity-70 leading-relaxed font-mono min-h-[200px]">
                {result.negativePrompt}
              </div>
              <button onClick={() => copyToClipboard(result.negativePrompt)} className="w-full bg-white/5 border border-white/10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all">{t.copy} Negative DNA</button>
            </div>
          </div>

          <div className="flex justify-center pt-10">
             <button onClick={() => { setStatus(AnalysisStatus.IDLE); setResult(null); setVideoUrl(''); }} className="bg-white text-black px-12 py-6 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-premium group">
                <IconRotate className="w-4 h-4 inline-block mr-3 group-hover:rotate-180 transition-transform duration-500" /> {t.newAnalysis}
             </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderLanding = () => (
    <div className="animate-in fade-in duration-1000">
      <section className="text-center mb-32 md:mb-60 pt-24 md:pt-48 px-4 relative overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full -z-10"></div>
         <span className="inline-block bg-indigo-600/10 border border-indigo-500/20 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-10">{t.heroTag}</span>
         <h1 className="hero-h1 text-4xl md:text-8xl font-black uppercase tracking-tighter italic leading-[0.9] mb-12 gradient-text">{t.heroH1}</h1>
         <p className="text-xl md:text-3xl text-slate-400 font-medium leading-relaxed max-w-4xl mx-auto mb-16 italic opacity-80">{t.heroDesc}</p>
         <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="#pricing" className="w-full sm:w-auto bg-white text-black px-12 py-6 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-premium">{t.ctaPricing}</a>
            <button onClick={() => setShowLoginModal(true)} className="w-full sm:w-auto border border-white/10 px-12 py-6 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-white/5 transition-all">{t.ctaWorkstation}</button>
         </div>
      </section>

      {/* Features Section */}
      <section className="py-40 px-4 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center mb-32">
          <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-6">{t.featuresTitle}</h2>
          <p className="text-indigo-400 font-black uppercase tracking-[0.3em] text-xs">{t.featuresSubtitle}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES_LIST.map((f, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 p-12 rounded-[3rem] hover:border-indigo-500 transition-all group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-14 h-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500">
                <IconSparkles className="w-7 h-7 text-indigo-500" />
              </div>
              <h3 className="text-2xl font-black uppercase italic mb-5 leading-tight">{f.title}</h3>
              <p className="text-slate-500 text-sm font-semibold leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Knowledge Base Section */}
      <section id="kb" className="py-40 bg-white/[0.01] border-y border-white/5 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-32">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter">{t.kbTitle}</h2>
              <p className="text-slate-400 font-semibold text-lg max-w-2xl leading-relaxed italic opacity-70">{t.kbDesc}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {POSTS.map(post => (
              <a key={post.id} href={`#${post.slug}`} className="group bg-white/[0.02] border border-white/5 p-10 rounded-[2.5rem] hover:bg-indigo-600/[0.05] hover:border-indigo-500 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <span className="bg-indigo-600/10 px-4 py-2 rounded-full text-[9px] font-black uppercase text-indigo-400 tracking-widest">{post.category}</span>
                    <span className="text-[9px] font-bold text-slate-600 uppercase">{post.readTime}</span>
                  </div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-8 group-hover:text-indigo-400 transition-colors leading-[1.1]">{post.title}</h3>
                </div>
                <div className="flex items-center gap-2 text-indigo-500 font-black uppercase text-[10px] tracking-widest pt-4 border-t border-white/5">
                  Analyze Protocol <IconChevron className="w-4 h-4 -rotate-90" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-40 px-4 max-w-5xl mx-auto">
        <h2 className="text-6xl font-black uppercase italic tracking-tighter mb-24 text-center">{t.faqTitle}</h2>
        <div className="space-y-6">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="bg-white/[0.01] border border-white/5 rounded-[2rem] overflow-hidden group">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex justify-between items-center p-10 text-left transition-all">
                <span className="text-xl md:text-2xl font-black uppercase italic tracking-tight group-hover:text-indigo-400 transition-colors pr-8">{item.q}</span>
                <div className={`p-3 rounded-full border border-white/10 transition-all ${openFaq === i ? 'bg-indigo-600 border-indigo-500 rotate-180' : ''}`}>
                  <IconChevron className="w-6 h-6" />
                </div>
              </button>
              {openFaq === i && (
                <div className="px-10 pb-10 text-slate-400 text-lg font-semibold leading-relaxed italic animate-in slide-in-from-top-4 duration-500">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-40 border-t border-white/5 space-y-24 bg-gradient-to-b from-transparent to-indigo-950/20 px-4">
        <div className="text-center space-y-6">
          <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter">{t.licenseTitle}</h2>
          <p className="text-slate-500 font-black uppercase tracking-[0.5em] text-[10px]">Secure Your Neural Gateway</p>
        </div>
        <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          <div className="bg-white/[0.01] border border-white/10 rounded-[4rem] p-16 flex flex-col hover:border-indigo-500/50 transition-all group">
             <span className="text-indigo-400 font-black uppercase text-[10px] tracking-widest mb-4">Entry Level</span>
             <h3 className="text-6xl font-black uppercase italic mb-8">R$ 97<span className="text-lg text-slate-600 tracking-normal font-bold lowercase">{t.monthly}</span></h3>
             <ul className="space-y-4 mb-12 flex-grow">
               {["50 Extractions/mo", "Midjourney & Sora Ready", "Basic Social Kit", "Email Support"].map(item => (
                 <li key={item} className="flex items-center gap-3 text-sm font-semibold text-slate-400"><IconSparkles className="w-4 h-4 text-indigo-500" /> {item}</li>
               ))}
             </ul>
             <a href={HOTMART_BASIC} className="block bg-white text-black text-center py-6 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl group-hover:scale-105">{t.subscribeNow}</a>
          </div>
          <div className="bg-indigo-600/5 border-2 border-indigo-500 rounded-[4rem] p-16 flex flex-col relative overflow-hidden shadow-premium group">
             <div className="absolute -top-4 -right-4 bg-indigo-500 text-white px-10 py-8 rotate-45 font-black uppercase text-[10px] tracking-widest">{t.bestValue}</div>
             <span className="text-indigo-400 font-black uppercase text-[10px] tracking-widest mb-4">Unlimited Elite</span>
             <h3 className="text-6xl font-black uppercase italic mb-8">R$ 297<span className="text-lg text-indigo-400/50 tracking-normal font-bold lowercase">{t.lifetime}</span></h3>
             <ul className="space-y-4 mb-12 flex-grow">
               {["Unlimited DNA Extraction", "All Current & Future Engines", "Advanced Viral Social Kit", "VIP Architect Community", "Lifetime Support"].map(item => (
                 <li key={item} className="flex items-center gap-3 text-sm font-semibold text-white/80"><IconSparkles className="w-4 h-4 text-indigo-400" /> {item}</li>
               ))}
             </ul>
             <a href={HOTMART_ELITE} className="block bg-indigo-600 text-white text-center py-6 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-indigo-500 transition-all shadow-premium group-hover:scale-105">{t.secureAccess}</a>
          </div>
        </div>
      </section>

      <footer className="py-32 px-4 border-t border-white/5 text-center bg-black">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex items-center justify-center gap-3">
            <IconSparkles className="w-6 h-6 text-indigo-500" />
            <span className="font-black tracking-tighter text-2xl uppercase italic">V-REVERSE <span className="text-indigo-500">PRO</span></span>
          </div>
          <nav className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-widest opacity-40">
            <a href="#kb" className="hover:text-white">Knowledge Base</a>
            <a href="#pricing" className="hover:text-white">Licensing</a>
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
          </nav>
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-700">© 2025 V-Reverse Intelligence Protocol. All Rights Reserved to Elite Architects.</p>
        </div>
      </footer>
    </div>
  );

  const renderPost = () => {
    if (!activePost) return null;
    return (
      <div className="animate-in slide-in-from-bottom-10 duration-700 pt-40 pb-60">
        <div className="max-w-5xl mx-auto px-6">
          <button onClick={() => { window.location.hash = ''; }} className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-16 hover:text-white transition-all group">
            <div className="p-3 rounded-full border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-all">
              <IconChevron className="w-5 h-5 rotate-90" />
            </div>
            {t.back}
          </button>
          <article className="post-body">
            <h1 className={activePost.keyword === "extract prompt from video" ? "gradient-text" : ""}>{activePost.title}</h1>
            <div className="flex items-center gap-4 mb-16 text-[10px] font-black uppercase tracking-widest text-slate-600">
              <span className="bg-white/5 px-4 py-2 rounded-full">{activePost.category}</span>
              <span>•</span>
              <span>{activePost.readTime} reading time</span>
            </div>
            <div dangerouslySetInnerHTML={{ __html: activePost.content }} className="prose prose-invert max-w-none" />
          </article>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen selection:bg-indigo-500/50">
      <nav className="fixed top-0 w-full z-[150] glass border-b border-white/5 px-6 md:px-16 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a href="#" className="flex items-center gap-3 group" onClick={(e) => { e.preventDefault(); window.location.hash = ''; }}>
            <IconSparkles className="w-6 h-6 text-indigo-500 group-hover:scale-125 transition-transform" />
            <span className="font-black tracking-tighter text-xl md:text-2xl uppercase italic">V-REVERSE <span className="text-indigo-500">PRO</span></span>
          </a>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase hover:bg-white/10 transition-all">
                {LANGUAGES.find(l => l.code === lang)?.flag} <span className="hidden sm:inline">{LANGUAGES.find(l => l.code === lang)?.name}</span>
              </button>
              <div className="absolute top-full right-0 mt-3 w-48 bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden hidden group-hover:block z-[200] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                {LANGUAGES.map(l => (
                  <button key={l.code} onClick={() => setLang(l.code)} className={`w-full px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest flex items-center gap-4 hover:bg-indigo-600 hover:text-white transition-all ${lang === l.code ? 'bg-white/5 text-indigo-400' : ''}`}>
                    <span className="text-base">{l.flag}</span> {l.name}
                  </button>
                ))}
              </div>
            </div>
            {!isSubscriber && <button onClick={() => setShowLoginModal(true)} className="bg-indigo-600 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg active:scale-95">{t.portal}</button>}
            {isSubscriber && (
              <button onClick={() => { setIsSubscriber(false); localStorage.removeItem('v-reverse-email'); window.location.hash = ''; }} className="bg-white/5 border border-white/10 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 hover:bg-red-600/20 hover:border-red-600/50 transition-all">Logout</button>
            )}
          </div>
        </div>
      </nav>

      <main>
        {view === 'home' ? (isSubscriber ? renderDashboard() : renderLanding()) : renderPost()}
      </main>

      {showLoginModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500">
          <div className="w-full max-w-md p-12 bg-[#0f172a] border border-white/10 rounded-[4rem] text-center space-y-10 shadow-premium">
            <div className="w-20 h-20 bg-indigo-600/10 rounded-3xl flex items-center justify-center mx-auto">
              <IconSparkles className="w-10 h-10 text-indigo-500" />
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-black uppercase tracking-tighter italic">{t.portalTitle}</h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Access the Architect Workstation</p>
            </div>
            <input 
              type="email" 
              placeholder="email@architect.com" 
              value={loginEmail} 
              onChange={e => setLoginEmail(e.target.value)} 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-center font-bold outline-none focus:border-indigo-500 transition-all text-lg placeholder:opacity-20" 
            />
            <button 
              onClick={() => validateSub(loginEmail)} 
              disabled={loginLoading} 
              className="w-full bg-indigo-600 py-6 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-500 transition-all shadow-xl active:scale-95 disabled:opacity-50"
            >
              {loginLoading ? t.verifying : t.unlockTerminal}
            </button>
            <button onClick={() => setShowLoginModal(false)} className="text-[10px] font-black uppercase opacity-30 hover:opacity-100 transition-opacity tracking-widest">{t.return}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;