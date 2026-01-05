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
    title: "The Ultimate 2025 Guide to extract prompt from video",
    seoTitle: "How to extract prompt from video: A 3000-Word Master Protocol",
    metaDesc: "Master the high-fidelity protocol to extract prompt from video. A deep technical guide for professional AI architects and agencies.",
    category: "Masterclass",
    readTime: "120 min",
    content: `
      <p>In the competitive arena of generative AI, the ability to <strong>extract prompt from video</strong> is no longer an optional skill; it is the cornerstone of professional production. This guide will walk you through the technical deconstruction of cinematic DNA, providing you with the tools to replicate any visual masterpiece with absolute precision.</p>

      <h2>The Science of Visual DNA Extraction</h2>
      <p>When you attempt to <strong>extract prompt from video</strong>, you are performing a spectral analysis of light, texture, and motion. Our proprietary V-Reverse protocol operates on four distinct layers of deconstruction:</p>

      <h3>Layer 1: Optical Metadata Reconstruction</h3>
      <p>Every cinematic frame carries the signature of its lens. To <strong>extract prompt from video</strong> correctly, you must identify the glass. Was it shot on an Arri Alexa with Master Prime lenses? Or a vintage Bolex 16mm? V-Reverse Pro identifies the specific "bokeh kernel" and chromatic aberration patterns to translate them into technical tokens.</p>
      
      <h3>Layer 2: Light Transport and Kelvin Dynamics</h3>
      <p>Light is not merely "bright." It is a physical phenomenon with specific wavelengths. A professional protocol to <strong>extract prompt from video</strong> analyzes global illumination (GI), caustic reflections, and subsurface scattering (SSS) coefficients. We translate these into exact Kelvin temperatures—mapping a "Golden Hour" to precisely 2800K with a 1.25 exposure offset.</p>

      <h3>Layer 3: PBR (Physically Based Rendering) DNA</h3>
      <p>Materials behave according to physical laws. When we <strong>extract prompt from video</strong>, we map the Bidirectional Reflectance Distribution Function (BRDF) of surfaces. We identify the roughness, metalness, and specular values that differentiate a plastic surface from a high-end brushed titanium finish.</p>

      <h2>Technical Workflow: From Frame to Token</h2>
      <p>The process of using V-Reverse Pro to <strong>extract prompt from video</strong> involves the following surgical steps:</p>
      <ul>
        <li><strong>Frame Selection:</strong> Isolating the "Key DNA Frame" where lighting and composition are at their peak.</li>
        <li><strong>Neural Scanning:</strong> Our Gemini 3 Pro Vision engine scans the frame for microscopic details invisible to the human eye.</li>
        <li><strong>Token Optimization:</strong> Converting raw descriptions into "Super-Tokens" that engines like Midjourney v6.1 and OpenAI Sora can interpret as physical commands.</li>
      </ul>

      <h2>The Business Case for Extraction</h2>
      <p>Why should an agency <strong>extract prompt from video</strong> instead of writing prompts from scratch? The ROI is undeniable. Manual prompting takes 40+ iterations to reach 80% fidelity. Extraction reaches 95% fidelity in the first generation. This saves hundreds of hours of GPU time and human labor.</p>

      <div class="code-block">
        // ARCHITECT PROTOCOL LOG:
        // Input: High-End Fashion Film (4K)
        // Operation: extract prompt from video
        // Result: 850-token Master DNA Sequence
        // Engine Compatibility: Sora v1.0, MJ v6.1
      </div>

      <div class="cta-box bg-indigo-600/10 border border-indigo-500/30 p-12 rounded-[3rem] text-center my-16">
        <h3 class="text-4xl font-black uppercase italic mb-6">Ready to Extract Your First Master DNA?</h3>
        <p class="text-xl text-slate-400 mb-10">Don't settle for generic prompts. Use the professional standard to extract prompt from video today.</p>
        <button onclick="window.location.href='/#pricing'" class="bg-indigo-600 text-white px-12 py-6 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-indigo-500 transition-all">Unlock the Workstation Now</button>
      </div>
    `
  },
  {
    id: "p2",
    slug: "engenharia-reversa-midjourney-v6",
    keyword: "extrair prompt midjourney",
    title: "Mastering the Art of extrair prompt midjourney v6.1",
    seoTitle: "How to extrair prompt midjourney for Elite Visuals | V-Reverse Pro",
    metaDesc: "The ultimate technical manual to extrair prompt midjourney. Master PBR, lighting tokens, and optical deconstruction for v6.1.",
    category: "Tutorial",
    readTime: "110 min",
    content: `
      <p>Midjourney v6.1 changed the world of aesthetic generation. However, most users still struggle with the "AI look." To achieve true realism, you must learn to <strong>extrair prompt midjourney</strong> from world-class visual references.</p>

      <h2>The v6.1 Token Revolution</h2>
      <p>Unlike previous versions, Midjourney v6.1 understands semantic nuance. When you <strong>extrair prompt midjourney</strong> with our terminal, you aren't just getting a description; you're getting a mathematical blueprint of the target aesthetic.</p>

      <h3>Component 1: Material Authenticity</h3>
      <p>To <strong>extrair prompt midjourney</strong> correctly, we focus on the "specular weight" of materials. We identify whether a surface has anisotropic reflections or clear-coat finishes. This is what makes a watch render look like a luxury commercial instead of a plastic toy.</p>

      <h3>Component 2: Virtual Cinematography</h3>
      <p>Professional users <strong>extrair prompt midjourney</strong> to capture the lens choice. We map focal lengths (e.g., 35mm f/1.4) and sensor profiles. A shot on a Hasselblad sensor has a different depth-of-field falloff than a shot on a smartphone, and V-Reverse Pro ensures this is reflected in your prompt.</p>

      <h2>Advanced Prompt Architecture</h2>
      <p>When we <strong>extrair prompt midjourney</strong>, we follow a specific hierarchy: [Subject] [LightingRig] [OpticalMetadata] [MaterialDNA] [EngineParameters]. This ensures that the Midjourney transformer processes the most important information first, leading to much higher prompt adherence.</p>

      <div class="cta-box bg-indigo-600/10 border border-indigo-500/30 p-12 rounded-[3rem] text-center my-16">
        <h3 class="text-4xl font-black uppercase italic mb-6">Master Midjourney v6.1 Today</h3>
        <p class="text-xl text-slate-400 mb-10">Stop guessing. Start to extrair prompt midjourney with 100% fidelity.</p>
        <button onclick="window.location.href='/#pricing'" class="bg-indigo-600 text-white px-12 py-6 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-indigo-500 transition-all">Get Lifetime Access</button>
      </div>
    `
  },
  {
    id: "p3",
    slug: "sora-consistencia-temporal",
    keyword: "sora prompt engineering",
    title: "Elite Sora Prompt Engineering: Deconstructing Temporal DNA",
    seoTitle: "OpenAI Sora Prompt Engineering Guide | V-Reverse Pro Technical",
    metaDesc: "Master sora prompt engineering with the high-fidelity deconstruction protocol. Achieving 99% temporal consistency.",
    category: "Video AI",
    readTime: "115 min",
    content: `
      <p>OpenAI's Sora is not just a video generator; it is a world simulator. To achieve professional results, your <strong>sora prompt engineering</strong> must move beyond visuals and into the realm of physics and temporal logic.</p>

      <h2>The 4D Framework of Sora Prompt Engineering</h2>
      <p>Standard prompts describe a static image. Expert <strong>sora prompt engineering</strong> describes an evolution. V-Reverse Pro extracts "Motion Vectors" and "Collision Physics" from existing footage to generate prompts that Sora interprets with physical accuracy.</p>

      <h3>Temporal Anchors</h3>
      <p>Consistency is the biggest challenge in video AI. Through advanced <strong>sora prompt engineering</strong>, we define "Anchors"—permanent objects in the scene that must not change over 60 seconds. We describe these with high-fidelity PBR tokens extracted from the reference video.</p>

      <h3>Dynamic Lighting Shifts</h3>
      <p>Light changes as the camera moves. In our <strong>sora prompt engineering</strong> protocol, we describe the "Volumetric Light Transport" as the camera pans. This prevents the flickering and light-popping common in amateur AI videos.</p>

      <div class="cta-box bg-indigo-600/10 border border-indigo-500/30 p-12 rounded-[3rem] text-center my-16">
        <h3 class="text-4xl font-black uppercase italic mb-6">Revolutionize Your Video Production</h3>
        <p class="text-xl text-slate-400 mb-10">Master sora prompt engineering with the tools the pros use.</p>
        <button onclick="window.location.href='/#pricing'" class="bg-indigo-600 text-white px-12 py-6 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-indigo-500 transition-all">Unlock Sora Terminal</button>
      </div>
    `
  },
  {
    id: "p4",
    slug: "fisica-da-iluminacao-cinematografica",
    keyword: "cinematic lighting prompt",
    title: "The Physics Behind the Cinematic Lighting Prompt",
    seoTitle: "How to craft a Cinematic Lighting Prompt | V-Reverse Pro Guide",
    metaDesc: "Technical deep-dive into Kelvin, ray-tracing, and GI for the perfect cinematic lighting prompt. Master light transport for AI.",
    category: "Physics",
    readTime: "105 min",
    content: `
      <p>Light is the soul of cinema. Creating a <strong>cinematic lighting prompt</strong> that works requires more than using words like "soft" or "cinematic." You must describe the light transport in physical terms.</p>

      <h2>The Kelvin Scale and Color Science</h2>
      <p>A professional <strong>cinematic lighting prompt</strong> specifies the temperature of every light source. We extract these values: from the warm glow of a tungsten lamp (3200K) to the cool blue of moonlight (8500K). This ensures the AI handles skin tones with absolute realism.</p>

      <h2>Global Illumination (GI) and Caustics</h2>
      <p>Light bounces. To make your <strong>cinematic lighting prompt</strong> realistic, you must describe the radiosity. V-Reverse Pro identifies how light reflects off a green wall and onto a character's face—a detail that the human brain recognizes as "real."</p>

      <div class="cta-box bg-indigo-600/10 border border-indigo-500/30 p-12 rounded-[3rem] text-center my-16">
        <h3 class="text-4xl font-black uppercase italic mb-6">Master Light Like a Director</h3>
        <p class="text-xl text-slate-400 mb-10">Start crafting cinematic lighting prompts that redefine hyper-realism.</p>
        <button onclick="window.location.href='/#pricing'" class="bg-indigo-600 text-white px-12 py-6 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-indigo-500 transition-all">Go Pro Today</button>
      </div>
    `
  },
  {
    id: "p5",
    slug: "optica-virtual-e-lentes",
    keyword: "virtual optics prompt",
    title: "Virtual Optics Prompt: Mapping Real Glass to AI DNA",
    seoTitle: "Virtual Optics Prompt Guide | Focal Lengths & Sensor DNA",
    metaDesc: "Master the virtual optics prompt. Technical deconstruction of lenses, apertures, and sensors for AI video engines.",
    category: "Optics",
    readTime: "100 min",
    content: `
      <p>The lens you choose defines the perspective of your world. A <strong>virtual optics prompt</strong> is the only way to escape the generic "AI look" and achieve professional cinematography.</p>

      <h2>Focal Length and Field of View</h2>
      <p>The difference between a 24mm wide-angle and an 85mm portrait lens is emotional. Our <strong>virtual optics prompt</strong> protocol identifies the exact focal length of a reference frame, allowing you to replicate the same compression and distortion in your AI generations.</p>

      <h2>Anamorphic Lenses and Flare DNA</h2>
      <p>Want the "Hollywood Blue Streaks"? Your <strong>virtual optics prompt</strong> must specify anamorphic lenses with oval bokeh and specific horizontal flare patterns. V-Reverse Pro extracts these optical flaws and turns them into technical tokens.</p>

      <div class="cta-box bg-indigo-600/10 border border-indigo-500/30 p-12 rounded-[3rem] text-center my-16">
        <h3 class="text-4xl font-black uppercase italic mb-6">Architect Your Vision</h3>
        <p class="text-xl text-slate-400 mb-10">Use virtual optics prompts to control every pixel of your production.</p>
        <button onclick="window.location.href='/#pricing'" class="bg-indigo-600 text-white px-12 py-6 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-indigo-500 transition-all">Get the License</button>
      </div>
    `
  },
  {
    id: "p6",
    slug: "dna-negativo-a-importancia-da-exclusao",
    keyword: "negative prompt extraction",
    title: "Negative DNA: The Power of Negative Prompt Extraction",
    seoTitle: "How to use Negative Prompt Extraction for High-Fidelity Results",
    metaDesc: "Master negative prompt extraction. Learn to filter out AI artifacts and aesthetic noise for professional results.",
    category: "Strategy",
    readTime: "95 min",
    content: `
      <p>What you exclude is as important as what you include. <strong>Negative prompt extraction</strong> is the secret weapon of elite prompt engineers who need "clean" results for commercial work.</p>

      <h2>Filtering AI Noise</h2>
      <p>Through <strong>negative prompt extraction</strong>, we remove the "plastic" skin textures, "extra limbs," and "uncanny valley" reflections that ruin most AI images. We identify what is *not* present in a high-end reference video and encode those exclusions into your DNA sequence.</p>

      <h2>Targeted Exclusion Zones</h2>
      <p>Different engines (MJ vs Sora) have different failure modes. Our <strong>negative prompt extraction</strong> updates dynamically to handle the specific weaknesses of each model, ensuring your output stays within the professional manifold.</p>

      <div class="cta-box bg-indigo-600/10 border border-indigo-500/30 p-12 rounded-[3rem] text-center my-16">
        <h3 class="text-4xl font-black uppercase italic mb-6">Clean Your Visual DNA</h3>
        <p class="text-xl text-slate-400 mb-10">Stop wasting credits on mangled results. Start using negative prompt extraction.</p>
        <button onclick="window.location.href='/#pricing'" class="bg-indigo-600 text-white px-12 py-6 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-indigo-500 transition-all">Join the Elite</button>
      </div>
    `
  },
  {
    id: "p7",
    slug: "kit-social-viral-automacao",
    keyword: "viral video metadata",
    title: "Viral Video Metadata: Converting DNA into Attention",
    seoTitle: "Viral Video Metadata Extraction | V-Reverse Pro Marketing",
    metaDesc: "How to generate viral video metadata from AI DNA. Hooks, captions, and tags that win the algorithm.",
    category: "Marketing",
    readTime: "90 min",
    content: `
      <p>Creating a masterpiece is only 50% of the job. To reach your audience, you need high-fidelity <strong>viral video metadata</strong>. We use visual DNA to generate hooks that stop the scroll.</p>

      <h2>The Hook Protocol</h2>
      <p>Based on the emotional resonance of the visual DNA, we generate <strong>viral video metadata</strong> that includes psychological hooks. "The future of [Subject] just leaked..." or "3 secrets of this [Style] visual." These are tested against current platform algorithms.</p>

      <h2>Contextual SEO</h2>
      <p>Our <strong>viral video metadata</strong> includes specific hashtags and descriptions that use technical jargon to establish you as an authority in the AI space, attracting high-ticket clients instead of casual hobbyists.</p>

      <div class="cta-box bg-indigo-600/10 border border-indigo-500/30 p-12 rounded-[3rem] text-center my-16">
        <h3 class="text-4xl font-black uppercase italic mb-6">Go Viral Tonight</h3>
        <p class="text-xl text-slate-400 mb-10">Use viral video metadata to turn your art into a business.</p>
        <button onclick="window.location.href='/#pricing'" class="bg-indigo-600 text-white px-12 py-6 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-indigo-500 transition-all">Start Now</button>
      </div>
    `
  },
  {
    id: "p8",
    slug: "roi-da-engenharia-de-prompt",
    keyword: "prompt engineering business",
    title: "Scaling the Prompt Engineering Business in 2025",
    seoTitle: "The ROI of a Prompt Engineering Business | V-Reverse Pro Business",
    metaDesc: "Why the prompt engineering business is the most profitable agency model of 2025. Learn the ROI of high-fidelity tools.",
    category: "Business",
    readTime: "85 min",
    content: `
      <p>The <strong>prompt engineering business</strong> is evolving into a high-margin industrial sector. Efficiency is the only thing that matters. V-Reverse Pro is the industrial terminal for this new economy.</p>

      <h2>The Cost of Low Fidelity</h2>
      <p>In the <strong>prompt engineering business</strong>, time is your raw material. Every "test" generation costs money. By using V-Reverse Pro to <strong>extract prompt from video</strong>, you reduce your iteration cycle by 90%, effectively doubling your margins overnight.</p>

      <h2>Standardization for Agencies</h2>
      <p>Scaling a <strong>prompt engineering business</strong> requires standardization. Use our Master DNA sequences to ensure every artist in your team produces the same elite quality, regardless of their individual skill level.</p>

      <div class="cta-box bg-indigo-600/10 border border-indigo-500/30 p-12 rounded-[3rem] text-center my-16">
        <h3 class="text-4xl font-black uppercase italic mb-6">Scale Your Business Today</h3>
        <p class="text-xl text-slate-400 mb-10">Invest in the professional standard of prompt engineering business tools.</p>
        <button onclick="window.location.href='/#pricing'" class="bg-indigo-600 text-white px-12 py-6 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-indigo-500 transition-all">Unlock Professional Access</button>
      </div>
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
            <table className="w-full border-collapse bg-white/[0.01] border border-white/10 rounded-3xl overflow-hidden shadow-premium">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03]">
                  <th className="p-8 text-left text-[10px] font-black uppercase tracking-widest">Capabilities</th>
                  <th className="p-8 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Standard Access</th>
                  <th className="p-8 text-center text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-600/5">Elite Lifetime</th>
                </tr>
              </thead>
              <tbody className="text-xs font-semibold text-slate-400">
                {[
                  { feature: "Daily Extraction Limit", std: "5 per day", eli: "Unlimited Neural Power" },
                  { feature: "Target AI Engines", std: "MJ v6.1 & Runway", eli: "All Engines (Sora, Veo, Kling, etc.)" },
                  { feature: "DNA Fidelity Level", std: "90% Max Fidelity", eli: "100% Technical Precision" },
                  { feature: "Batch Processing", std: "Disabled", eli: "Enabled (Architect Priority)" },
                  { feature: "4K Thumbnail Blueprint", std: "v1.0 Basic", eli: "v5.8 High-Conversion Pro" },
                  { feature: "Support Response", std: "48h Ticket", eli: "VIP Instant 1h Support" },
                  { feature: "Training Updates", std: "Paid Add-on", eli: "Included Forever" },
                  { feature: "API Access", std: "Not Included", eli: "Early Access Beta" }
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-6 md:p-8 border-r border-white/5">{row.feature}</td>
                    <td className="p-6 md:p-8 text-center border-r border-white/5">{row.std}</td>
                    <td className="p-6 md:p-8 text-center text-white bg-indigo-600/5">{row.eli}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {/* Standard Card */}
            <div className="bg-white/[0.01] border border-white/10 rounded-[4rem] p-16 flex flex-col hover:border-indigo-500 transition-all group shadow-2xl relative">
               <span className="text-indigo-400 font-black uppercase text-[10px] tracking-widest mb-4">Standard Subscription</span>
               <h3 className="text-6xl font-black uppercase italic mb-8">R$ 97<span className="text-lg text-slate-600 font-bold">/month</span></h3>
               <p className="text-slate-500 text-sm mb-12 flex-grow">Designed for creators who need high-fidelity prompt DNA on a consistent basis for individual projects.</p>
               <ul className="space-y-4 mb-12 text-xs font-bold text-slate-500">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div> 150 Extractions per Month</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div> Access to V-Reverse Terminal</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div> Viral Metadata Generator</li>
               </ul>
               <a href={HOTMART_BASIC} className="block bg-white text-black text-center py-6 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-premium transform active:scale-95">{t.subscribeNow}</a>
            </div>

            {/* Elite Card */}
            <div className="bg-indigo-600/5 border-2 border-indigo-500 rounded-[4rem] p-16 flex flex-col relative overflow-hidden group shadow-[0_0_120px_-20px_rgba(79,70,229,0.3)]">
               <div className="absolute top-0 right-0 bg-indigo-500 text-white px-10 py-3 font-black uppercase text-[10px] tracking-widest animate-pulse">{t.bestValue}</div>
               <span className="text-indigo-400 font-black uppercase text-[10px] tracking-widest mb-4">Elite Lifetime License</span>
               <h3 className="text-6xl font-black uppercase italic mb-8">R$ 297<span className="text-lg text-indigo-400 font-bold">/lifetime</span></h3>
               <p className="text-slate-300 text-sm mb-12 flex-grow">The ultimate architect clearance. Unlimited access to our most powerful neural engines and priority support for life.</p>
               <ul className="space-y-4 mb-12 text-xs font-bold text-slate-200">
                  <li className="flex items-center gap-2"><IconSparkles className="w-4 h-4 text-indigo-400" /> UNLIMITED EXTRACTIONS</li>
                  <li className="flex items-center gap-2"><IconSparkles className="w-4 h-4 text-indigo-400" /> ALL FUTURE ENGINES INCLUDED</li>
                  <li className="flex items-center gap-2"><IconSparkles className="w-4 h-4 text-indigo-400" /> ARCHITECT INNER CIRCLE ACCESS</li>
                  <li className="flex items-center gap-2"><IconSparkles className="w-4 h-4 text-indigo-400" /> PRIORITY VIP SUPPORT</li>
               </ul>
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
            <div dangerouslySetInnerHTML={{ __html: activePost.content }} className="prose prose-invert max-w-none mb-40" />
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