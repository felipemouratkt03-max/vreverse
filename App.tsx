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
    readyToArchitect: "Pronto para arquitetar seu sucesso?",
    dontLetViral: "Não deixe outra sequência de DNA viral escapar das suas mãos.",
    subNotFound: "Assinatura não encontrada.",
    extractFailed: "Falha na extração. Complexidade do frame excedida.",
    targetEngine: "Motor de Destino",
    parameters: "Parâmetros Técnicos",
    fidelity: "Fidelidade",
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
    seoTitle: "Extract Prompt from Video - High Fidelity Technical Guide 2025",
    metaDesc: "The professional's definitive guide to extract prompt from video. Master technical deconstruction for Midjourney, Sora, and Kling AI.",
    category: "Technical",
    readTime: "90 min",
    content: `
      <p>In the rapidly evolving landscape of generative artificial intelligence, the ability to <strong>extract prompt from video</strong> has transitioned from a creative "hack" to a fundamental technical requirement for professional digital architects. This guide provides a deep-dive into the V-Reverse protocol, explaining how we deconstruct visual DNA to rebuild masterpieces in the latent space.</p>

      <h2>1. The Physics of Visual Deconstruction</h2>
      <p>To effectively <strong>extract prompt from video</strong>, one must first understand that a video frame is not just a collection of pixels, but a manifestation of physical parameters. Our neural engine scans for:</p>
      <ul>
        <li><strong>Spectral Dispersion:</strong> How light refracts through virtual or real lenses.</li>
        <li><strong>BRDF Mapping:</strong> The Bidirectional Reflectance Distribution Function of surfaces within the frame.</li>
        <li><strong>Global Illumination:</strong> The complex interaction of bounce light, caustic patterns, and ambient occlusion.</li>
      </ul>
      <p>When you choose to <strong>extract prompt from video</strong> using V-Reverse Pro, you are accessing a layer of metadata that remains invisible to the human eye but is critical for AI engines like Midjourney v6.1 and OpenAI Sora.</p>

      <h2>2. Optical Metadata Extraction</h2>
      <p>A cinematic look is defined by optics. A professional <strong>extract prompt from video</strong> protocol must identify the virtual camera rig:</p>
      <ul>
        <li><strong>Lens Hardware:</strong> Is it a Panavision Anamorphic or a Zeiss Master Prime? The extraction process identifies the unique "bokeh kernel" and chromatic aberration patterns.</li>
        <li><strong>Sensor Character:</strong> Identifying film grain size and dynamic range latitude (LogC4 vs S-Log3).</li>
        <li><strong>Aperture Dynamics:</strong> Mapping the f-stop to the depth-of-field falloff.</li>
      </ul>

      <h2>3. The Neural Bridge: From Pixels to Tokens</h2>
      <p>The core challenge to <strong>extract prompt from video</strong> lies in translation. AI models like Sora don't "see" images; they process tokens. V-Reverse Pro acts as a high-fidelity bridge, converting visual motion vectors into physical descriptors that the AI can interpret as gravity, friction, and light transport.</p>

      <h2>4. Scaling Creative Production</h2>
      <p>For agencies, the mission to <strong>extract prompt from video</strong> is about ROI. Instead of spending 40 hours in trial-and-error prompting, the Architect can isolate a viral frame, extract its DNA, and generate a 95% fidelity copy in 60 seconds. This is the new standard of "Speed to Market" in the creative industry.</p>

      <h2>Conclusion: Your Legacy as an Architect</h2>
      <p>The digital age rewards the precise. By mastering the ability to <strong>extract prompt from video</strong>, you are not just copying; you are learning the grammar of the universe as understood by machines. Join the elite who use V-Reverse Pro to architect the future.</p>
    `
  },
  {
    id: "p2",
    slug: "engenharia-reversa-midjourney-v6",
    keyword: "extrair prompt midjourney",
    title: "The Ultimate Guide to extrair prompt midjourney for Elite Visuals",
    seoTitle: "How to extrair prompt midjourney v6.1 | Technical Reverse Engineering",
    metaDesc: "Learn the high-fidelity protocol to extrair prompt midjourney. Master the art of deconstructing aesthetics into technical MJ tokens.",
    category: "Tutorial",
    readTime: "75 min",
    content: `
      <p>Midjourney v6.1 is a beast of aesthetic capability, but most users are barely scratching the surface. To truly master this engine, you must learn to <strong>extrair prompt midjourney</strong> from world-class references. This is not about the /describe command; it's about neural DNA extraction.</p>

      <h2>1. The Limitation of the /describe Command</h2>
      <p>While standard users rely on simple tools, the Architect knows that to <strong>extrair prompt midjourney</strong> with professional results, you need a multi-layered analysis. Simple descriptions miss the "hidden tokens"—the specific technical jargon that MJ uses to define hyper-realism.</p>

      <h2>2. Deconstructing Texture and Materiality</h2>
      <p>When we <strong>extrair prompt midjourney</strong>, we focus heavily on the PBR (Physically Based Rendering) values of the target image. We look for:</p>
      <ul>
        <li><strong>Subsurface Scattering:</strong> Essential for realistic skin and organic matter.</li>
        <li><strong>Anisotropy:</strong> The way light reflects on brushed metals or silk.</li>
        <li><strong>Micro-displacements:</strong> The tiny imperfections that prevent the "AI-plastic" look.</li>
      </ul>

      <h2>3. Lighting Protocols in MJ v6.1</h2>
      <p>Lighting is 80% of the image. To <strong>extrair prompt midjourney</strong> successfully, our system identifies the lighting rig. Is it a "Rembrandt lighting setup with a 2:1 ratio"? Or "Volumetric rays with Tyndall effect"? Capturing these specific tokens is what makes the difference between a toy and a tool.</p>

      <h2>4. Prompt Engineering at Scale</h2>
      <p>The goal of learning to <strong>extrair prompt midjourney</strong> is consistency. By building a library of "DNA Blocks," you can mix and match lighting from one video with the composition of another, creating entirely new masterpieces that maintain physical logic.</p>

      <h2>Final Thoughts</h2>
      <p>The era of "guessing" prompts is over. Start to <strong>extrair prompt midjourney</strong> today with V-Reverse Pro and join the top 1% of AI artists globally.</p>
    `
  },
  {
    id: "p3",
    slug: "sora-consistencia-temporal",
    keyword: "sora prompt engineering",
    title: "Sora Prompt Engineering: Mastering Temporal DNA and World Physics",
    seoTitle: "Elite Sora Prompt Engineering Guide | V-Reverse Pro 2025",
    metaDesc: "Master Sora prompt engineering by extracting temporal and physical DNA from videos. The technical protocol for OpenAI Sora.",
    category: "AI Video",
    readTime: "80 min",
    content: `
      <p>OpenAI's Sora is not just a video generator; it is a world simulator. To interact with it effectively, your <strong>sora prompt engineering</strong> must go beyond visual description and enter the realm of physics and temporal logic.</p>

      <h2>1. The Third Dimension: Time</h2>
      <p>Standard prompting focuses on the X and Y axes. Professional <strong>sora prompt engineering</strong> focuses on the T axis (Time). You must describe how a subject evolves over 60 seconds. V-Reverse Pro extracts "Temporal Consistency Anchors" from existing videos to feed Sora's transformer architecture.</p>

      <h2>2. Physics-Based Descriptors</h2>
      <p>Sora responds to physical laws. Your <strong>sora prompt engineering</strong> should include:</p>
      <ul>
        <li><strong>Fluid Dynamics:</strong> Viscosity and turbulence of liquids.</li>
        <li><strong>Kinetic Energy:</strong> The momentum and inertia of moving objects.</li>
        <li><strong>Collision Geometry:</strong> How objects interact when they touch.</li>
      </ul>

      <h2>3. Camera Paths and Motion Vectors</h2>
      <p>A key part of <strong>sora prompt engineering</strong> is the "virtual director." Instead of "camera moves," use "Dolly track following subject with a subtle parralax shift and focus racking from 5m to 20m." Our extraction tool identifies these cinematic paths and translates them into Sora-ready text.</p>

      <h2>4. The Future of Cinema</h2>
      <p>With high-level <strong>sora prompt engineering</strong>, the cost of a Hollywood-grade shot drops from $50,000 to $0.50. The only barrier left is your ability to describe the scene with technical precision. Use V-Reverse Pro to bridge that gap.</p>
    `
  },
  {
    id: "p4",
    slug: "fisica-da-iluminacao-cinematografica",
    keyword: "cinematic lighting prompt",
    title: "The Advanced Physics of the Cinematic Lighting Prompt",
    seoTitle: "Cinematic Lighting Prompt - High Fidelity Deconstruction Guide",
    metaDesc: "Master the cinematic lighting prompt. Technical guide on Kelvin, light transport, and PBR for AI creators.",
    category: "Physics",
    readTime: "70 min",
    content: `
      <p>Light is the language of emotion in cinema. To craft a <strong>cinematic lighting prompt</strong> that works, you must speak the language of physics. Stop using "beautiful light" and start using "ray-traced global illumination with spectral caustics."</p>

      <h2>1. The Kelvin Scale and Color Temperature</h2>
      <p>A professional <strong>cinematic lighting prompt</strong> specifies temperature. We extract the exact light balance: "Golden Hour (2800K) transitioning to Twilight (8000K)." This precision ensures the AI handles skin tones and shadows with absolute realism.</p>

      <h2>2. Light Transport and Bounce</h2>
      <p>When you use V-Reverse Pro to <strong>extract prompt from video</strong>, we analyze the indirect lighting. How does the red of the carpet bleed into the white of the wall? This "Light Bleed" or "Radiosity" is a critical token in any advanced <strong>cinematic lighting prompt</strong>.</p>

      <h2>3. Shadow Hardness and Penumbra</h2>
      <p>Softness is a technical value. Describe the light source size to control shadows. A "Large softbox at 45 degrees" produces a wide penumbra, while a "Direct solar point light" creates sharp, high-contrast edges. Your <strong>cinematic lighting prompt</strong> needs these geometric definitions.</p>
    `
  },
  {
    id: "p5",
    slug: "optica-virtual-e-lentes",
    keyword: "virtual optics prompt",
    title: "Virtual Optics Prompt: Deconstructing Cinematic Lenses",
    seoTitle: "How to Build a Virtual Optics Prompt | V-Reverse Pro Protocol",
    metaDesc: "Deconstruct focal lengths, apertures, and lens flares. Build the perfect virtual optics prompt for AI video engines.",
    category: "Optics",
    readTime: "65 min",
    content: `
      <p>The "AI Look" is often just a lack of optical logic. To fix it, your <strong>virtual optics prompt</strong> must emulate the flaws and beauties of real-world glass. Lenses like the Panavision Anamorphic or the Leica Summilux have a "DNA" that can be transcribed into text.</p>

      <h2>1. Focal Length and Perspective Distortion</h2>
      <p>The choice between a 24mm and an 85mm lens changes the emotional weight of a shot. Your <strong>virtual optics prompt</strong> must specify this. V-Reverse Pro calculates the field of view of any video frame and provides the exact focal length token.</p>

      <h2>2. The Anamorphic Squeeze</h2>
      <p>Do you want the "Hollywood Look"? Your <strong>virtual optics prompt</strong> needs tokens like "2.0x anamorphic squeeze, horizontal blue streaks, oval-shaped bokeh, and slight vignetting." This forces the engine to move away from generic digital rendering.</p>

      <h2>3. Sensor Size Emulation</h2>
      <p>Describe the sensor. "Shot on Super 35mm" vs "Shot on Full Frame 70mm IMAX." Each has a different depth-of-field falloff and grain structure. Your <strong>virtual optics prompt</strong> is incomplete without these specifications.</p>
    `
  },
  {
    id: "p6",
    slug: "dna-negativo-a-importancia-da-exclusao",
    keyword: "negative prompt extraction",
    title: "Negative DNA: The Power of Excluion in Prompt Engineering",
    seoTitle: "Negative Prompt Extraction - The Secret to Clean AI Output",
    metaDesc: "Learn why negative prompt extraction is the key to professional AI visuals. Filter out artifacts and low-quality noise.",
    category: "Strategy",
    readTime: "60 min",
    content: `
      <p>What you DON'T want is as important as what you do. <strong>Negative prompt extraction</strong> is the process of identifying and excluding the aesthetic failures of AI models. It is the "filter" that ensures high-fidelity results.</p>

      <h2>1. Eliminating AI Artifacts</h2>
      <p>Through <strong>negative prompt extraction</strong>, we remove "mangled hands," "extra limbs," and "uncanny valley skin." But we go deeper: we remove "chromatic noise," "low-resolution textures," and "generic digital art styles."</p>

      <h2>2. Aesthetic Control</h2>
      <p>If you want a raw, documentary look, your <strong>negative prompt extraction</strong> must exclude "cinematic lighting," "over-saturation," and "perfect symmetry." By defining the boundaries, you find the truth of the image.</p>

      <h2>3. The Professional Filter List</h2>
      <p>V-Reverse Pro generates a dynamic negative DNA sequence that updates based on the target engine. Sora and Midjourney have different failure modes, and our <strong>negative prompt extraction</strong> handles them both perfectly.</p>
    `
  },
  {
    id: "p7",
    slug: "kit-social-viral-automacao",
    keyword: "viral video metadata",
    title: "Viral Video Metadata: Converting DNA into Global Reach",
    seoTitle: "How to Generate Viral Video Metadata with AI DNA",
    metaDesc: "Transform technical prompts into viral video metadata. Hooks, captions, and tags that resonate with the social algorithm.",
    category: "Marketing",
    readTime: "55 min",
    content: `
      <p>A masterpiece with zero views is a tragedy. To avoid this, V-Reverse Pro converts your technical extraction into <strong>viral video metadata</strong>. We bridge the gap between "Engine Engineering" and "Attention Engineering."</p>

      <h2>1. Algorithmic Hooks</h2>
      <p>Based on the visual DNA, we generate a hook. If the video is futuristic, the <strong>viral video metadata</strong> focuses on "The Future is Here." If it's organic, we focus on "The Secret of Nature." These hooks are tested against current social algorithms.</p>

      <h2>2. Contextual Captions</h2>
      <p>Stop using generic captions. Our <strong>viral video metadata</strong> includes descriptions that use the technical jargon to establish you as an authority, increasing engagement from the "Elite" creative community.</p>

      <h2>3. The Power of Technical Tags</h2>
      <p>We provide a mix of broad and hyper-specific hashtags. This ensure your AI-generated content doesn't just get views, but gets the *right* views from agencies and potential clients. This is the ultimate use of <strong>viral video metadata</strong>.</p>
    `
  },
  {
    id: "p8",
    slug: "roi-da-engenharia-de-prompt",
    keyword: "prompt engineering business",
    title: "The ROI of the Prompt Engineering Business in 2025",
    seoTitle: "Prompt Engineering Business - ROI and Agency Scaling Guide",
    metaDesc: "Why every creative agency needs a prompt engineering business protocol. Scale production and increase margins.",
    category: "Business",
    readTime: "50 min",
    content: `
      <p>Efficiency is the only way to scale. In the <strong>prompt engineering business</strong>, your "raw materials" are tokens. The better your tokens, the higher your margins. V-Reverse Pro is the industrial-grade tool for this new economy.</p>

      <h2>1. Reducing the Iteration Cycle</h2>
      <p>The biggest cost in the <strong>prompt engineering business</strong> is the "trial and error." Each failed generation is wasted time and money. By using V-Reverse Pro to <strong>extract prompt from video</strong>, you start at 90% fidelity, slashing costs by 95%.</p>

      <h2>2. Standardizing Output</h2>
      <p>Agencies struggle with consistency. A <strong>prompt engineering business</strong> protocol allows you to standardize the "DNA" of a campaign. Every team member uses the same Master DNA, ensuring a cohesive look regardless of who is hitting the "generate" button.</p>

      <h2>3. The New Creative Director</h2>
      <p>The role of the director is changing. It's no longer about holding a camera, but about managing DNA sequences. Your <strong>prompt engineering business</strong> strategy should focus on building a proprietary library of technical prompts that give you a unique "house style" that no one else can copy.</p>
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
          <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-xs">Choose Your Clearance Level</p>
        </div>
        
        <div className="max-w-7xl mx-auto">
          {/* Tabela Comparativa Detalhada */}
          <div className="overflow-x-auto mb-20">
            <table className="w-full border-collapse bg-white/[0.01] border border-white/10 rounded-3xl overflow-hidden">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03]">
                  <th className="p-8 text-left text-[10px] font-black uppercase tracking-widest">Capabilities</th>
                  <th className="p-8 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Standard Access</th>
                  <th className="p-8 text-center text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-600/5">Elite Lifetime</th>
                </tr>
              </thead>
              <tbody className="text-xs font-semibold text-slate-400">
                {[
                  { feature: "Daily Extraction Limit", std: "5 per day", eli: "Unlimited" },
                  { feature: "Target Engines", std: "Midjourney, Runway", eli: "Full Suite (Sora, Veo, Kling, Kling, etc.)" },
                  { feature: "Neural Fidelity Level", std: "90% Max", eli: "100% Precision Level" },
                  { feature: "Batch Processing", std: "No", eli: "Yes (Architect Priority)" },
                  { feature: "4K Thumbnail Blueprint", std: "v1.0 Basic", eli: "v5.8 High-Conversion" },
                  { feature: "Priority Support", std: "48h Response", eli: "Instant 1h VIP Support" },
                  { feature: "Future Updates", std: "Paid Upgrade", eli: "Forever Free" }
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-6 md:p-8">{row.feature}</td>
                    <td className="p-6 md:p-8 text-center">{row.std}</td>
                    <td className="p-6 md:p-8 text-center text-white bg-indigo-600/5">{row.eli}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {/* Standard Card */}
            <div className="bg-white/[0.01] border border-white/10 rounded-[4rem] p-16 flex flex-col hover:border-indigo-500 transition-all group shadow-2xl">
               <span className="text-indigo-400 font-black uppercase text-[10px] tracking-widest mb-4">Standard Subscription</span>
               <h3 className="text-6xl font-black uppercase italic mb-8">R$ 97<span className="text-lg text-slate-600 font-bold">/month</span></h3>
               <p className="text-slate-500 text-sm mb-12 flex-grow">Perfect for individual creators starting their visual reverse engineering journey.</p>
               <a href={HOTMART_BASIC} className="block bg-white text-black text-center py-6 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-premium transform active:scale-95">{t.subscribeNow}</a>
            </div>

            {/* Elite Card */}
            <div className="bg-indigo-600/5 border-2 border-indigo-500 rounded-[4rem] p-16 flex flex-col relative overflow-hidden group shadow-[0_0_80px_-15px_rgba(79,70,229,0.3)]">
               <div className="absolute top-0 right-0 bg-indigo-500 text-white px-10 py-3 font-black uppercase text-[10px] tracking-widest">{t.bestValue}</div>
               <span className="text-indigo-400 font-black uppercase text-[10px] tracking-widest mb-4">Elite Lifetime License</span>
               <h3 className="text-6xl font-black uppercase italic mb-8">R$ 297<span className="text-lg text-indigo-400 font-bold">/lifetime</span></h3>
               <p className="text-slate-300 text-sm mb-12 flex-grow">Designed for agencies and elite architects who demand unlimited neural power and 100% fidelity.</p>
               <a href={HOTMART_ELITE} className="block bg-indigo-600 text-white text-center py-6 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-indigo-500 transition-all shadow-premium transform active:scale-95">{t.secureAccess}</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-32 px-4 border-t border-white/5 text-center bg-black">
          <div className="flex items-center justify-center gap-3 mb-12">
            <IconSparkles className="w-6 h-6 text-indigo-500" />
            <span className="font-black tracking-tighter text-2xl uppercase italic">V-REVERSE <span className="text-indigo-500">PRO</span></span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-700">© 2025 V-Reverse Intelligence Protocol. All Rights Reserved to Elite Architects.</p>
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