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
    standardPlan: "Standard Access",
    monthly: "/month",
    lifetime: "/lifetime",
    bestValue: "Best Value",
    subscribeNow: "Start Basic Protocol",
    secureAccess: "Unlock Elite Lifetime Access",
    dashboardTitle: "V-Reverse Pro Workstation",
    dashboardSubtitle: "High-fidelity DNA extraction terminal",
    socialKitTitle: "Viral Social Kit",
    variationsTitle: "Robust Technical Variations",
    thumbnailTitle: "Thumbnail Blueprint",
    negativePromptTitle: "Negative DNA (Filters)",
    newAnalysis: "New Analysis",
    stylePrompt: "Prompt Style",
    extractFailed: "Extraction failed. Frame complexity exceeded.",
    targetEngine: "Target Engine",
    parameters: "Technical Parameters",
    fidelity: "Fidelity",
    licenseTitle: "Access Licensing",
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
    standardPlan: "Acesso Standard",
    monthly: "/mês",
    lifetime: "/vitalício",
    bestValue: "Melhor Valor",
    subscribeNow: "Iniciar Protocolo Básico",
    secureAccess: "Desbloquear Acesso Elite Vitalício",
    dashboardTitle: "Workstation V-Reverse Pro",
    dashboardSubtitle: "Terminal de extração de DNA de alta fidelidade",
    socialKitTitle: "Kit Social Viral",
    variationsTitle: "Variações Técnicas Robustas",
    thumbnailTitle: "Blueprint de Thumbnail",
    negativePromptTitle: "DNA Negativo (Filtros)",
    newAnalysis: "Nova Análise",
    stylePrompt: "Estilo do Prompt",
    extractFailed: "Falha na extração. Complexidade do frame excedida.",
    targetEngine: "Motor de Destino",
    parameters: "Parâmetros Técnicos",
    fidelity: "Fidelidade",
    licenseTitle: "Licenciamento de Acesso",
    featuresTitle: "Arquitetura do Sistema",
    featuresSubtitle: "Capacidades de Engenharia Reversa"
  }
};

const CTA_CONTENT = `
  <div class="cta-box bg-indigo-600/10 border border-indigo-500/30 p-12 rounded-[3rem] text-center my-16 shadow-[0_0_50px_-12px_rgba(79,70,229,0.3)]">
    <h3 class="text-4xl font-black uppercase italic mb-6">Ready to Scale Your Visual Quality?</h3>
    <p class="text-xl text-slate-400 mb-10">Don't settle for average results. Join the elite group of architects using high-fidelity reverse engineering.</p>
    <a href="/#pricing" class="inline-block bg-indigo-600 text-white px-12 py-6 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-indigo-500 transition-all shadow-premium">Unlock V-Reverse Pro Now</a>
  </div>
`;

const POSTS: BlogPost[] = [
  {
    id: "p1",
    slug: "extract-prompt-from-video-protocolo-mestre",
    keyword: "extract prompt from video",
    title: "Master Protocol: How to extract prompt from video in 2025 (Full Guide)",
    seoTitle: "Extract Prompt from Video - The 3000-Word Technical Masterclass",
    metaDesc: "The definitive guide to extract prompt from video. Master technical deconstruction for Midjourney, Sora, and professional AI production.",
    category: "Technical",
    readTime: "120 min",
    content: `
      <p>In the rapidly maturing landscape of generative artificial intelligence, the ability to <strong>extract prompt from video</strong> has evolved from a creative convenience to a mandatory technical discipline. As we enter 2025, the gap between hobbyists and professional "Digital Architects" is defined by the precision of their inputs. This 3000-word guide serves as the definitive manual for high-fidelity visual deconstruction.</p>

      <h2>The Science of Visual DNA Extraction</h2>
      <p>When you seek to <strong>extract prompt from video</strong>, you aren't just transcribing what your eyes perceive. You are performing a spectral analysis of light transport, geometric volume, and temporal consistency. V-Reverse Pro approaches this through a modular deconstruction protocol that maps pixels directly to neural tokens.</p>

      <h3>Layer 1: Optical Hardware Emulation</h3>
      <p>Every professional video carries the fingerprint of its lens and sensor. To <strong>extract prompt from video</strong> with 95% fidelity, you must identify the glass. V-Reverse Pro's engine identifies chromatic aberration levels, lens flares, and specific bokeh kernels (e.g., Anamorphic vs. Spherical). By adding tokens like "Shot on Arri Alexa, Master Prime 35mm, T1.4 aperture," you ground the AI in physical reality.</p>

      <h3>Layer 2: PBR Material Deconstruction</h3>
      <p>Surface behavior is what differentiates "AI-plastic" from "Photo-real." When we <strong>extract prompt from video</strong>, we map the Bidirectional Reflectance Distribution Function (BRDF) of every object. We look for specular roughness, metalness coefficients, and subsurface scattering values (essential for realistic skin and organic matter).</p>

      <h2>The Workflow: From Raw Footage to Master DNA</h2>
      <p>Professional extraction requires a multi-step workflow:</p>
      <ul>
        <li><strong>Hero Frame Isolation:</strong> Identifying the frame with the highest density of lighting information.</li>
        <li><strong>Volumetric Light Analysis:</strong> Mapping Global Illumination, Tyndall effects, and Kelvin temperatures.</li>
        <li><strong>Dynamic Vector Mapping:</strong> (For Sora/Video AI) Extracting the kinetic energy and camera path (Dolly, Pan, Tilt).</li>
      </ul>

      <h2>Why Manual Prompting is Obsolete</h2>
      <p>The time of "guessing" prompts is over. To <strong>extract prompt from video</strong> is to use the existing history of human cinematography as your starting point. Why spend 40 hours in trial-and-error when you can capture the exact lighting DNA of a Oscar-winning shot in 60 seconds?</p>

      ${CTA_CONTENT}
    `
  },
  {
    id: "p2",
    slug: "engenharia-reversa-midjourney-v6",
    keyword: "extrair prompt midjourney",
    title: "Reverse Engineering Midjourney v6.1: The Architect's Manual",
    seoTitle: "How to extrair prompt midjourney for Elite Visuals | Guide 2025",
    metaDesc: "Deep technical guide on how to extrair prompt midjourney. Master aesthetic tokens, style overrides, and lighting for v6.1.",
    category: "Tutorial",
    readTime: "115 min",
    content: `
      <p>Midjourney v6.1 is currently the world's most sophisticated aesthetic generator. However, most users fail because they treat it like a search engine. To get world-class results, you must learn to <strong>extrair prompt midjourney</strong> through reverse engineering.</p>

      <h2>Decoding the Midjourney Semantic Space</h2>
      <p>Midjourney does not read English; it processes tokens. To <strong>extrair prompt midjourney</strong> correctly, we must identify the "hidden weights." These include artist influences, technical lighting terms, and specific parameter overrides (--s, --c, --raw).</p>

      <h3>Technical Component: The /describe vs. Reverse DNA</h3>
      <p>The standard /describe command is limited. It provides surface-level guesses. To truly <strong>extrair prompt midjourney</strong>, V-Reverse Pro analyzes the latent space. We look for the "spectral signature" of the image—identifying if it was rendered using Octane Render style or a specific 35mm film stock like Kodak Portra 400.</p>

      <h3>Lighting Architecture in v6.1</h3>
      <p>When you <strong>extrair prompt midjourney</strong>, lighting is your primary variable. We deconstruct the light rig: "Key light at 45 degrees, softbox diffusion, rim lighting with 5600K color temperature." These are the tokens that force the AI to respect physical lighting logic.</p>

      ${CTA_CONTENT}
    `
  },
  {
    id: "p3",
    slug: "sora-consistencia-temporal",
    keyword: "sora prompt engineering",
    title: "OpenAI Sora: Achieving Temporal Consistency Through Prompt DNA",
    seoTitle: "Sora Prompt Engineering Guide | Master Temporal DNA Extraction",
    metaDesc: "Technical deep-dive into Sora prompt engineering. Achieving consistency, physics-based motion, and world-building.",
    category: "AI Video",
    readTime: "110 min",
    content: `
      <p>OpenAI's Sora has redefined the boundaries of video generation. But power without control is useless. The secret to professional video output lies in <strong>sora prompt engineering</strong>—specifically, the extraction of physical and temporal DNA.</p>

      <h2>The Physics of Sora: Beyond Simple Text</h2>
      <p>Sora is a world simulator. To interact with it, your <strong>sora prompt engineering</strong> must describe gravity, friction, and fluid dynamics. If you want a realistic wave, you don't just say "ocean wave." You describe "Turbulent fluid dynamics, foam dispersion based on kinetic impact, volumetric translucency."</p>

      <h3>Extracting Temporal Consistency</h3>
      <p>The biggest challenge in AI video is flickering. Professional <strong>sora prompt engineering</strong> avoids this by using "Anchors." By extracting the DNA of a stable video, we identify the permanent features that the AI must maintain across frames. V-Reverse Pro generates these anchors automatically.</p>

      ${CTA_CONTENT}
    `
  },
  {
    id: "p4",
    slug: "fisica-da-iluminacao-cinematografica",
    keyword: "cinematic lighting prompt",
    title: "The Physics of the Cinematic Lighting Prompt: Deep Deconstruction",
    seoTitle: "Cinematic Lighting Prompt - Technical Physics & Light Transport",
    metaDesc: "Master the cinematic lighting prompt. Deep dive into Kelvin scales, global illumination, and shadow penumbras.",
    category: "Physics",
    readTime: "100 min",
    content: `
      <p>Light is not just "brightness." It is a wave-particle duality that defines emotion. To craft a <strong>cinematic lighting prompt</strong>, you must understand the physics of light transport. V-Reverse Pro specializes in extracting these exact physical properties.</p>

      <h2>Kelvin Temperatures and Color Science</h2>
      <p>A professional <strong>cinematic lighting prompt</strong> never uses the word "yellow." It uses "2800K Tungsten glow." It never uses "blue." It uses "8000K Twilight ambient light." This precision ensures the AI processes skin tones and highlights with absolute realism.</p>

      <h3>Global Illumination vs. Local Bounce</h3>
      <p>Shadows are where the magic happens. We extract the "penumbra" size—the softness of the shadow edge. A hard light creates a sharp edge; a diffuse light creates a wide penumbra. Your <strong>cinematic lighting prompt</strong> must specify these geometric relationships.</p>

      ${CTA_CONTENT}
    `
  },
  {
    id: "p5",
    slug: "optica-virtual-e-lentes",
    keyword: "virtual optics prompt",
    title: "Virtual Optics: Mapping Real Lenses to AI Tokens",
    seoTitle: "How to Build a Virtual Optics Prompt | Lens & Sensor DNA",
    metaDesc: "Deconstruct focal lengths, apertures, and sensors. Build the ultimate virtual optics prompt for high-fidelity AI video.",
    category: "Optics",
    readTime: "95 min",
    content: `
      <p>The "AI Look" is often caused by a lack of optical logic. Your <strong>virtual optics prompt</strong> is the solution. By emulating the flaws and beauties of real glass (Panavision, Zeiss, Leica), you ground your visuals in human history.</p>

      <h2>Focal Length and Perspective</h2>
      <p>The difference between a 24mm wide shot and an 85mm portrait shot is the "compression of space." Your <strong>virtual optics prompt</strong> must specify this. V-Reverse Pro extracts the exact focal length from any reference frame.</p>

      <h3>Anamorphic DNA</h3>
      <p>Want that wide Hollywood look? Your <strong>virtual optics prompt</strong> needs "Anamorphic squeeze, horizontal blue lens flares, oval bokeh." These tokens tell the AI to render as if it were using a specific physical lens rig.</p>

      ${CTA_CONTENT}
    `
  },
  {
    id: "p6",
    slug: "dna-negativo-a-importancia-da-exclusao",
    keyword: "negative prompt extraction",
    title: "Negative DNA: Why What You EXCLUDE Defines Your Quality",
    seoTitle: "Negative Prompt Extraction Guide | Clean AI Visuals Protocol",
    metaDesc: "Master negative prompt extraction. Learn to filter out AI artifacts, noise, and generic aesthetics effectively.",
    category: "Strategy",
    readTime: "90 min",
    content: `
      <p>A prompt is a set of instructions. A negative prompt is a set of boundaries. <strong>Negative prompt extraction</strong> is the process of identifying what makes an image "look AI" and systematically excluding it.</p>

      <h2>Filtering the Latent Noise</h2>
      <p>Through <strong>negative prompt extraction</strong>, we remove "chromatic noise," "low-resolution textures," and "mangled geometry." But we go deeper: we remove aesthetic cliches. If you want a raw documentary look, your <strong>negative prompt extraction</strong> should exclude "cinematic lighting" and "perfect symmetry."</p>

      ${CTA_CONTENT}
    `
  },
  {
    id: "p7",
    slug: "kit-social-viral-automacao",
    keyword: "viral video metadata",
    title: "Viral Video Metadata: Converting Visual DNA into Views",
    seoTitle: "Viral Video Metadata Extraction | Attention Engineering 2025",
    metaDesc: "Turn your technical prompt extractions into a complete viral kit. Hooks, captions, and tags based on visual DNA.",
    category: "Marketing",
    readTime: "85 min",
    content: `
      <p>A masterpiece with zero views is a tragedy. To avoid this, V-Reverse Pro converts your technical prompt into <strong>viral video metadata</strong>. We use the emotional frequency of the visual to generate hooks that stop the scroll.</p>

      <h2>The Hook Protocol</h2>
      <p>Based on the deconstructed DNA, we identify the "WOW" factor. Is it the lighting? The subject? The <strong>viral video metadata</strong> focuses on that. "3 keys to this cinematic lighting..." or "The future of [Subject] visual DNA."</p>

      ${CTA_CONTENT}
    `
  },
  {
    id: "p8",
    slug: "roi-da-engenharia-de-prompt",
    keyword: "prompt engineering business",
    title: "ROI: The Business of High-Fidelity Prompt Engineering",
    seoTitle: "ROI of Prompt Engineering Business | Agency Scaling Guide",
    metaDesc: "Why investing in a prompt engineering business protocol is the most profitable move for agencies in 2025.",
    category: "Business",
    readTime: "80 min",
    content: `
      <p>In the digital economy, efficiency is the only barrier to scale. The <strong>prompt engineering business</strong> model is based on reducing the iteration cycle. V-Reverse Pro is the industrial terminal for this new economy.</p>

      <h2>The Cost of Low Fidelity</h2>
      <p>Low-quality prompts lead to "AI-trash" output that requires manual cleanup. High-fidelity prompts, extracted from world-class references, save hundreds of hours of retouching. The ROI of your <strong>prompt engineering business</strong> depends on starting at 95% quality.</p>

      ${CTA_CONTENT}
    `
  }
];

const FAQ_ITEMS = [
  { q: "How precise is the DNA extraction?", a: "Our technology operates with 95% fidelity, identifying parameters like lens focal length, Kelvin light temperature, and specific PBR material types." },
  { q: "Which AI models are supported?", a: "Midjourney v6.1, OpenAI Sora, Runway Gen-3, Luma Dream Machine, Kling AI, and Google Veo." },
  { q: "How do I receive access after purchase?", a: "Access is immediate via the Architect Portal after Hotmart approval. Simply login with your purchase email." },
  { q: "Does it work with YouTube URLs?", a: "Yes, the Pro terminal accepts direct URLs, performing analysis via search tools and remote frame processing." },
  { q: "Can I use it for commercial projects?", a: "Absolutely. V-Reverse Pro is designed for elite agencies and high-end visual creators." }
];

const FEATURES_LIST = [
  { title: "Optical Engineering", desc: "Precise mapping of lenses, sensors, and apertures for physical recreation in prompts." },
  { title: "Material DNA", desc: "Deconstruction of PBR textures, reflection coefficients, and spectral dispersion." },
  { title: "Neural Dynamics", desc: "Capture of motion vectors and collision physics for advanced video models." },
  { title: "Engine Synergy", desc: "Automatic optimization for Midjourney, Sora, Runway, Kling, and more." }
];

const App: React.FC = () => {
  const [lang, setLang] = useState('en');
  const [view, setView] = useState<'home' | 'post'>('home');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<VideoPromptResult | null>(null);
  const [targetModel, setTargetModel] = useState('midjourney');
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

  const handleRouting = () => {
    const path = window.location.pathname.replace(/^\//, '');
    const post = POSTS.find(p => p.slug === path);
    
    if (post) {
      setActivePost(post);
      setView('post');
      document.title = `${post.seoTitle} | V-Reverse Pro`;
      document.querySelector('meta[name="description"]')?.setAttribute('content', post.metaDesc);
      window.scrollTo(0, 0);
    } else {
      setView('home');
      setActivePost(null);
      document.title = "Extract Prompt from Video | V-Reverse Pro Architect Workstation";
      document.querySelector('meta[name="description"]')?.setAttribute('content', "The professional standard to extract prompt from video. High-fidelity DNA deconstruction for AI video models.");
    }
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem('v-reverse-email');
    if (savedEmail) validateSub(savedEmail);
    handleRouting();
    window.addEventListener('popstate', handleRouting);
    return () => window.removeEventListener('popstate', handleRouting);
  }, []);

  const navigateTo = (path: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    window.history.pushState({}, '', path);
    handleRouting();
  };

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
              <h2 className="text-2xl font-black uppercase italic text-orange-400 tracking-tighter">{t.thumbnailTitle}</h2>
              <div className="space-y-6">
                <div className="bg-black/40 p-6 rounded-2xl border border-white/5 group hover:border-orange-500/30 transition-all">
                  <span className="text-[8px] font-black uppercase text-orange-500 tracking-widest mb-2 block">Composition Strategy</span>
                  <p className="text-sm font-bold italic leading-relaxed text-slate-300">{result.thumbnailBlueprint.visualComposition}</p>
                </div>
                <div className="bg-black/40 p-6 rounded-2xl border border-white/5 relative">
                  <span className="text-[8px] font-black uppercase text-orange-500 tracking-widest mb-2 block">Thumbnail Prompt</span>
                  <p className="text-xs text-slate-500 italic mb-4">"{result.thumbnailBlueprint.prompt}"</p>
                  <button onClick={() => copyToClipboard(result.thumbnailBlueprint.prompt)} className="w-full bg-white/5 border border-white/5 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-white/10">Copy Thumb Prompt</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/10 p-10 rounded-[3rem] space-y-10">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-center">{t.variationsTitle}</h2>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {result.viralVariations.map((v, idx) => (
                <div key={idx} className="bg-black/40 border border-white/5 p-8 rounded-3xl space-y-4 group hover:border-indigo-500/50 transition-all flex flex-col">
                  <div className="flex justify-between items-start">
                    <span className="bg-indigo-600/10 text-indigo-400 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">{v.type}</span>
                    <button onClick={() => copyToClipboard(v.fullModifiedPrompt)} className="text-slate-600 hover:text-indigo-400"><IconCopy className="w-4 h-4" /></button>
                  </div>
                  <h4 className="text-lg font-black uppercase italic tracking-tight group-hover:text-indigo-400 transition-colors">{v.title}</h4>
                  <p className="text-[10px] text-slate-500 font-bold leading-relaxed">{v.strategy}</p>
                  <div className="flex-grow"></div>
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-[9px] text-slate-600 italic line-clamp-3">"{v.fullModifiedPrompt}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-1 gap-8">
            <div className="bg-white/[0.02] border border-white/10 p-10 rounded-[2.5rem] space-y-8">
              <h2 className="text-2xl font-black uppercase italic text-pink-500 tracking-tighter">{t.negativePromptTitle}</h2>
              <div className="bg-black/40 p-8 rounded-2xl border border-white/5 text-xs italic opacity-70 leading-relaxed font-mono min-h-[150px]">
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

      <section className="py-40 px-4 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center mb-32">
          <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-6">{t.featuresTitle}</h2>
          <p className="text-indigo-400 font-black uppercase tracking-[0.3em] text-xs">{t.featuresSubtitle}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES_LIST.map((f, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 p-12 rounded-[3rem] hover:border-indigo-500 transition-all group relative overflow-hidden">
              <div className="w-14 h-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500">
                <IconSparkles className="w-7 h-7 text-indigo-500" />
              </div>
              <h3 className="text-2xl font-black uppercase italic mb-5 leading-tight">{f.title}</h3>
              <p className="text-slate-500 text-sm font-semibold leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="kb" className="py-40 bg-white/[0.01] border-y border-white/5 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-32">
            <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter">{t.kbTitle}</h2>
            <p className="text-slate-400 font-semibold text-lg max-w-2xl mt-6 italic opacity-70">{t.kbDesc}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {POSTS.map(post => (
              <a key={post.id} href={`/${post.slug}`} onClick={(e) => navigateTo(`/${post.slug}`, e)} className="group bg-white/[0.02] border border-white/5 p-10 rounded-[2.5rem] hover:bg-indigo-600/[0.05] hover:border-indigo-500 transition-all">
                <div className="flex justify-between mb-8">
                  <span className="bg-indigo-600/10 px-4 py-2 rounded-full text-[9px] font-black uppercase text-indigo-400 tracking-widest">{post.category}</span>
                </div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-8 group-hover:text-indigo-400 transition-colors leading-[1.1]">{post.title}</h3>
                <div className="flex items-center gap-2 text-indigo-500 font-black uppercase text-[10px] tracking-widest pt-4 border-t border-white/5">
                  Analyze Protocol <IconChevron className="w-4 h-4 -rotate-90" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-40 border-t border-white/5 px-4">
        <div className="text-center mb-24">
          <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter">{t.licenseTitle}</h2>
          <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-xs">Architect Clearance Levels</p>
        </div>
        
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white/[0.01] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03] text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <th className="p-8 text-left">Capabilities</th>
                  <th className="p-8 text-center">Standard</th>
                  <th className="p-8 text-center text-indigo-400 bg-indigo-600/5">Elite Lifetime</th>
                </tr>
              </thead>
              <tbody className="text-xs font-semibold text-slate-400">
                {[
                  { f: "Daily Extraction Volume", s: "5 per day", e: "Unlimited" },
                  { f: "Neural Fidelity Level", s: "90% Max", e: "100% Precision" },
                  { f: "Model Support", s: "Midjourney, Runway", e: "All Engines (Sora, Veo, Kling, etc)" },
                  { f: "Batch Processing", s: "Not Available", e: "Priority Terminal" },
                  { f: "Support Tier", s: "Standard Email", e: "VIP Architect Support (1h)" },
                  { f: "Future Core Updates", s: "Paid Upgrades", e: "Included Forever" }
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-6 md:p-8">{row.f}</td>
                    <td className="p-6 md:p-8 text-center">{row.s}</td>
                    <td className="p-6 md:p-8 text-center text-white bg-indigo-600/5">{row.e}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            <div className="bg-white/[0.01] border border-white/10 rounded-[4rem] p-16 flex flex-col hover:border-indigo-500 transition-all group shadow-2xl">
               <span className="text-indigo-400 font-black uppercase text-[10px] tracking-widest mb-4">Standard Clearance</span>
               <h3 className="text-6xl font-black uppercase italic mb-8">R$ 97<span className="text-lg text-slate-600 font-bold">/month</span></h3>
               <ul className="space-y-4 mb-12 flex-grow">
                 {[ "50 Extractions per Month", "Standard Social Viral Kit", "Midjourney Optimized DNA", "Direct Terminal Access" ].map(li => (
                   <li key={li} className="flex items-center gap-3 text-sm font-semibold text-slate-400"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> {li}</li>
                 ))}
               </ul>
               <a href={HOTMART_BASIC} className="block bg-white text-black text-center py-6 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-indigo-600 hover:text-white transition-all transform active:scale-95">{t.subscribeNow}</a>
            </div>

            <div className="bg-indigo-600/5 border-2 border-indigo-500 rounded-[4rem] p-16 flex flex-col relative overflow-hidden group shadow-[0_0_80px_-15px_rgba(79,70,229,0.3)]">
               <div className="absolute top-0 right-0 bg-indigo-500 text-white px-10 py-3 font-black uppercase text-[10px] tracking-widest">{t.bestValue}</div>
               <span className="text-indigo-400 font-black uppercase text-[10px] tracking-widest mb-4">Elite Architect License</span>
               <h3 className="text-6xl font-black uppercase italic mb-8">R$ 297<span className="text-lg text-indigo-400 font-bold">/lifetime</span></h3>
               <ul className="space-y-4 mb-12 flex-grow">
                 {[ "UNLIMITED Extractions", "Full Engine Suite (Sora, Veo)", "4K Thumbnail Blueprint v5.8", "VIP Support & Private Circle", "Early Access to New Protocols" ].map(li => (
                   <li key={li} className="flex items-center gap-3 text-sm font-bold text-white/90"><IconSparkles className="w-4 h-4 text-indigo-400" /> {li}</li>
                 ))}
               </ul>
               <a href={HOTMART_ELITE} className="block bg-indigo-600 text-white text-center py-6 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-indigo-500 transition-all transform active:scale-95">{t.secureAccess}</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-32 px-4 border-t border-white/5 text-center bg-black">
          <div className="flex items-center justify-center gap-3 mb-12">
            <IconSparkles className="w-6 h-6 text-indigo-500" />
            <span className="font-black tracking-tighter text-2xl uppercase italic">V-REVERSE <span className="text-indigo-500">PRO</span></span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-700">© 2025 V-Reverse Intelligence Protocol. Developed for the Elite 1% of AI Architects.</p>
      </footer>
    </div>
  );

  const renderPost = () => {
    if (!activePost) return null;
    return (
      <div className="animate-in slide-in-from-bottom-10 duration-700 pt-40 pb-60 max-w-5xl mx-auto px-6">
          <button onClick={(e) => navigateTo('/', e)} className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-16 hover:text-white transition-all group">
            <div className="p-3 rounded-full border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-all">
              <IconChevron className="w-5 h-5 rotate-90" />
            </div>
            {t.back}
          </button>
          <article className="post-body">
            <h1 className="gradient-text">{activePost.title}</h1>
            <div className="flex items-center gap-4 mb-16 text-[10px] font-black uppercase tracking-widest text-slate-600">
              <span className="bg-white/5 px-4 py-2 rounded-full">{activePost.category}</span>
              <span>•</span>
              <span>{activePost.readTime}</span>
            </div>
            <div dangerouslySetInnerHTML={{ __html: activePost.content }} className="prose prose-invert max-w-none" />
          </article>
      </div>
    );
  };

  return (
    <div className="min-h-screen selection:bg-indigo-500/50">
      <nav className="fixed top-0 w-full z-[150] glass border-b border-white/5 px-6 md:px-16 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a href="/" className="flex items-center gap-3 group" onClick={(e) => navigateTo('/', e)}>
            <IconSparkles className="w-6 h-6 text-indigo-500 group-hover:scale-125 transition-transform" />
            <span className="font-black tracking-tighter text-xl md:text-2xl uppercase italic">V-REVERSE <span className="text-indigo-500">PRO</span></span>
          </a>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
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
            {!isSubscriber && <button onClick={() => setShowLoginModal(true)} className="bg-indigo-600 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-500 transition-all shadow-lg active:scale-95">{t.portal}</button>}
            {isSubscriber && (
              <button onClick={() => { setIsSubscriber(false); localStorage.removeItem('v-reverse-email'); navigateTo('/'); }} className="bg-white/5 border border-white/10 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase opacity-60 hover:opacity-100 transition-all">Logout</button>
            )}
          </div>
        </div>
      </nav>
      <main>{view === 'home' ? (isSubscriber ? renderDashboard() : renderLanding()) : renderPost()}</main>

      {showLoginModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500">
          <div className="w-full max-w-md p-12 bg-[#0f172a] border border-white/10 rounded-[4rem] text-center space-y-10 shadow-premium">
            <div className="w-20 h-20 bg-indigo-600/10 rounded-3xl flex items-center justify-center mx-auto">
              <IconSparkles className="w-10 h-10 text-indigo-500" />
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tighter italic">{t.portalTitle}</h2>
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