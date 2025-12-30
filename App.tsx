
import React, { useState, useRef, useEffect } from 'react';
import { AnalysisStatus, VideoPromptResult, TARGET_MODELS, WorkstationConfig } from './types';
import { analyzeContent } from './services/geminiService';
import { 
  IconUpload, IconSparkles, IconCopy, IconChevron
} from './components/Icons';
import { checkSubscription } from './services/supabaseClient';

const HOTMART_BASIC = "https://pay.hotmart.com/U103590267K?off=basic_plan";
const HOTMART_ELITE = "https://pay.hotmart.com/U103590267K?off=elite_plan";

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
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'jp', name: '日本語', flag: '🇯🇵' }
];

const TRANSLATIONS: Record<string, any> = {
  en: {
    heroTag: "Architect Workstation v5.8",
    heroH1: "extract prompt from video",
    heroDesc: "The high-fidelity protocol to reverse-engineer visual DNA. One prompt can redefine your creative career and legacy.",
    ctaPricing: "Secure License",
    ctaWorkstation: "Open Terminal",
    kbTitle: "Architect Knowledge Base",
    kbDesc: "Technical insights on visual DNA extraction and high-end prompt engineering.",
    back: "Back to Home",
    buyNow: "Get Started Now",
    loading: "Scanning Neural DNA..."
  },
  pt: {
    heroTag: "Workstation Arquiteto v5.8",
    heroH1: "extract prompt from video",
    heroDesc: "O protocolo de alta fidelidade para engenharia reversa de DNA visual. Um prompt pode redefinir sua carreira e legado.",
    ctaPricing: "Garantir Licença",
    ctaWorkstation: "Abrir Terminal",
    kbTitle: "Base de Conhecimento",
    kbDesc: "Insights técnicos sobre extração de DNA visual e engenharia de prompt de elite.",
    back: "Voltar ao Início",
    buyNow: "Começar Agora",
    loading: "Escaneando DNA Neural..."
  }
};

const POSTS: BlogPost[] = [
  {
    id: "p1",
    slug: "extract-prompt-from-video",
    keyword: "extract prompt from video",
    title: "Master Protocol: How to Extract Prompt from Video in 2025",
    seoTitle: "Extract Prompt from Video - High-Fidelity AI Vision Protocol",
    metaDesc: "The definitive professional guide to extract prompt from video. Learn the cinematic deconstruction method for Midjourney, Sora, and Runway Gen-3.",
    category: "Technical",
    readTime: "25 min",
    content: `
      <p>In the high-stakes world of generative AI, the ability to <strong>extract prompt from video</strong> is the ultimate "cheat code" for creators who refuse to settle for generic outputs. As we enter 2025, the market is saturated with "good" AI videos, but truly exceptional content requires a technical DNA that can only be found by deconstructing existing cinematic masterpieces.</p>
      
      <h2>The Core Philosophy of Extraction</h2>
      <p>When you choose to <strong>extract prompt from video</strong>, you are performing a surgical operation on a visual frame. You aren't just looking for "a man in a suit." You are looking for the exact light diffraction on the fabric, the lens focal length (e.g., 35mm f/1.4), and the volumetric scattering of the atmosphere. To <strong>extract prompt from video</strong> is to understand the math behind the beauty.</p>
      
      <div class="code-block">
        // V-REVERSE PROTOCOL v5.8
        PROTOCOL_INIT {
          SAMPLING_RATE: 4K_UHD;
          NEURAL_DECODER: VISION_TRANSFORMER_V4;
          FEATURE_EXTRACTION: [LIGHT_VECTORS, TEXTURE_DNA, LENS_PHYSICS];
          OUTPUT_FORMAT: MASTER_PROMPT_TECHNICAL;
        }
      </div>

      <h2>Phase 1: Cinematic Deconstruction</h2>
      <p>The first step to <strong>extract prompt from video</strong> is identifying the 'Prime Frame'. Our engine scans the entire video sequence to find the frame with the highest semantic density. This is where the lighting is most complex and the texture detail is most pronounced. By focusing our energy here, we <strong>extract prompt from video</strong> data that carries the soul of the entire scene.</p>
      
      <h3>1. Lighting Physics (Kelvin & Lumens)</h3>
      <p>To <strong>extract prompt from video</strong> successfully, the engine must calculate the light temperature. Is it 3200K (Tungsten) or 5600K (Daylight)? We use AI to measure the Kelvin temperature and convert it into specific tokens like "Golden Hour rim lighting" or "Blue hour cinematic mood".</p>
      
      <h3>2. Camera & Lens DNA</h3>
      <p>Professional cinematographers use specific lenses for a reason. When you <strong>extract prompt from video</strong> with V-Reverse Pro, we identify the shallow depth of field (bokeh) and translate it into "shot on 85mm f/1.2 lens". This level of technical specificity is why our users' results look like real movies, not AI hallucinations.</p>
      <p>Technical depth in visual extraction requires understanding subsurface scattering and global illumination. Every photon counts when you <strong>extract prompt from video</strong>.</p>
    `
  },
  {
    id: "p2",
    slug: "ai-image-prompt-generator",
    keyword: "ai image prompt generator",
    title: "The Ultimate AI Image Prompt Generator for Professionals",
    seoTitle: "AI Image Prompt Generator - Convert Images to Professional Prompts",
    metaDesc: "Discover the most advanced ai image prompt generator. Convert any image or video frame into a high-density AI prompt for elite results.",
    category: "AI Tools",
    readTime: "20 min",
    content: `
      <h2>Why V-Reverse is the Best AI Image Prompt Generator</h2>
      <p>An <strong>ai image prompt generator</strong> should not be a "black box" that gives you random words. It must be a precision instrument. Our <strong>ai image prompt generator</strong> is built on the premise of "Reverse Latent Mapping". This means we look at the pixel arrangement and predict what the original prompt *should* have been to generate that specific look.</p>
      
      <h2>Precision at Scale</h2>
      <p>Using a professional <strong>ai image prompt generator</strong> allows studios to maintain visual consistency across thousands of assets. If you have a specific artistic style for a project, you can't rely on humans to manually prompt every time. You need an <strong>ai image prompt generator</strong> that can "see" the style and replicate it mathematically.</p>
      
      <div class="code-block">
        [GENERATOR OUTPUT EXAMPLE]
        "Cinematic wide shot, brutalist architecture, raw concrete texture, overcast moody lighting, shot on ARRI Alexa, 35mm lens --ar 16:9 --v 6.1"
      </div>
      <p>This <strong>ai image prompt generator</strong> output ensures that every frame generated follows the same DNA. Architecture, fashion, and product design all benefit from the surgical precision of an <strong>ai image prompt generator</strong> like V-Reverse.</p>
    `
  },
  {
    id: "p3",
    slug: "image-prompt-generator",
    keyword: "image prompt generator",
    title: "Image Prompt Generator: Revolutionizing Visual Design",
    seoTitle: "Image Prompt Generator - Advanced Technical Extraction",
    metaDesc: "The industry standard image prompt generator for high-end cinematic production and architectural visualization.",
    category: "Design",
    readTime: "18 min",
    content: `
      <h2>Workflow Optimization with an Image Prompt Generator</h2>
      <p>Every professional designer needs a reliable <strong>image prompt generator</strong> in their toolkit. Why? Because the gap between vision and execution is usually filled with failed prompts. An <strong>image prompt generator</strong> closes that gap by analyzing existing references.</p>
      <p>When you use an <strong>image prompt generator</strong>, you are training your own creative eye to see patterns in lighting and composition. It’s an educational tool as much as a production one. A high-quality <strong>image prompt generator</strong> will identify the contrast ratios and color palettes that make a specific style work.</p>
    `
  },
  {
    id: "p4",
    slug: "image-to-prompt-generator",
    keyword: "image to prompt generator",
    title: "Technical Breakdown: Image to Prompt Generator Algorithms",
    seoTitle: "Image to Prompt Generator - How the Neural DNA is Decoded",
    metaDesc: "Deep dive into the neural networks behind our image to prompt generator. Learn how pixels become technical tokens.",
    category: "Engineering",
    readTime: "22 min",
    content: `
      <h2>Inside the Image to Prompt Generator</h2>
      <p>How does an <strong>image to prompt generator</strong> actually work? It uses a combination of Vision Transformers (ViT) and Large Language Models (LLM). The <strong>image to prompt generator</strong> segments the image into semantic blocks: background, middle ground, and foreground.</p>
      <p>Each block is then analyzed for its "Technical DNA". The <strong>image to prompt generator</strong> looks for lens flares, grain patterns, and specular highlights. This data is then reconstructed into a string of tokens that modern AI models like Midjourney and Sora can understand perfectly. This is the science of the <strong>image to prompt generator</strong>.</p>
    `
  },
  {
    id: "p5",
    slug: "ai-image-prompt-generator-import",
    keyword: "ai image prompt generator import",
    title: "Studio Integration: AI Image Prompt Generator Import Methods",
    seoTitle: "AI Image Prompt Generator Import - Scalable Studio Workflows",
    metaDesc: "Learn how to integrate our ai image prompt generator import feature into your professional production pipeline.",
    category: "Workflow",
    readTime: "15 min",
    content: `
      <h2>The Import Protocol</h2>
      <p>For large agencies, manual operation is impossible. You need an <strong>ai image prompt generator import</strong> system. Our workstation supports batch processing via the <strong>ai image prompt generator import</strong> protocol, allowing you to feed hundreds of references at once.</p>
      <p>By standardizing the <strong>ai image prompt generator import</strong>, your team can maintain a unified "Look Book" that is machine-readable. This level of <strong>ai image prompt generator import</strong> sophistication is what separates amateur setups from professional AI studios.</p>
    `
  },
  {
    id: "p6",
    slug: "ai-image-generator-prompt-offline",
    keyword: "ai image generator prompt offline",
    title: "Secure Privacy: AI Image Generator Prompt Offline Standards",
    seoTitle: "AI Image Generator Prompt Offline - Enterprise Privacy Protocol",
    metaDesc: "Keep your visual IP secure with our ai image generator prompt offline standard for high-profile client work.",
    category: "Security",
    readTime: "19 min",
    content: `
      <h2>Maximum Security Extraction</h2>
      <p>Corporate clients demand privacy. The <strong>ai image generator prompt offline</strong> standard ensures that your reference images never touch a public server during the initial analysis phase. Even without a constant cloud connection, our <strong>ai image generator prompt offline</strong> logic can process the frame deconstruction.</p>
      <p>This <strong>ai image generator prompt offline</strong> capability is critical for secret film projects or pre-release product designs. Security is the foundation of the <strong>ai image generator prompt offline</strong> philosophy in V-Reverse Pro.</p>
    `
  },
  {
    id: "p7",
    slug: "video-to-prompt",
    keyword: "video to prompt",
    title: "Temporal Consistency: The Video to Prompt Era",
    seoTitle: "Video to Prompt - Mastering Motion and Pacing in AI",
    metaDesc: "Convert any video clip into a structured AI prompt. The master guide to video to prompt conversion.",
    category: "Motion",
    readTime: "24 min",
    content: `
      <h2>Beyond Frames: Video to Prompt</h2>
      <p>Moving from static images to <strong>video to prompt</strong> requires analyzing the temporal dimension. How does the camera move? What is the frame rate? The <strong>video to prompt</strong> process captures the rhythm of the editing and the speed of the motion.</p>
      <p>When you perform a <strong>video to prompt</strong> extraction, you are essentially creating a storyboard that includes timing directives. This is the future of cinematic AI: <strong>video to prompt</strong> deconstruction for high-end motion models.</p>
    `
  },
  {
    id: "p8",
    slug: "video-to-prompt-generator",
    keyword: "video to prompt generator",
    title: "Pro Workstation: The Ultimate Video to Prompt Generator",
    seoTitle: "Video to Prompt Generator - High Performance DNA Extraction",
    metaDesc: "The technical specs and workflow for the world's most advanced video to prompt generator workstation.",
    category: "Workstation",
    readTime: "26 min",
    content: `
      <h2>The Architect's Terminal</h2>
      <p>Our <strong>video to prompt generator</strong> is the heart of the V-Reverse system. It’s designed for high-throughput analysis. Every pixel in the 4K stream is a data point for the <strong>video to prompt generator</strong>.</p>
      <p>Whether you're recreating a dream sequence or a high-speed car chase, the <strong>video to prompt generator</strong> provides the exact parameters to replicate the intensity. This is the professional standard for a <strong>video to prompt generator</strong> in 2025.</p>
    `
  }
];

const FAQ_ITEMS = [
  { q: "How accurate is the DNA extraction?", a: "With 95% fidelity settings, our engine extracts camera focal lengths, lighting vectors, and specific material textures with professional-grade precision." },
  { q: "Which models are supported?", a: "Midjourney v6.1, Sora, Runway Gen-3, Luma, and Kling AI." },
  { q: "How do I access my purchase?", a: "Instant access via the Architect Portal after Hotmart approval." },
  { q: "Is it mobile-friendly?", a: "Yes, optimized for high-performance use on any smartphone or tablet." },
  { q: "Can I use it for commercial work?", a: "Absolutely. You own 100% of the prompts and the resulting generations." }
];

const App: React.FC = () => {
  const [lang, setLang] = useState('en');
  const [view, setView] = useState<'home' | 'post'>('home');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<VideoPromptResult | null>(null);
  const [targetModel, setTargetModel] = useState('sora');
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
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // HANDLE ROUTING VIA HASH
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      const post = POSTS.find(p => p.slug === hash);
      if (post) {
        setActivePost(post);
        setView('post');
        document.title = `${post.seoTitle} | V-Reverse Pro`;
        window.scrollTo(0, 0);
      } else {
        setView('home');
        setActivePost(null);
        document.title = "Extract Prompt from Video | V-Reverse Pro Workstation";
      }
    };

    window.addEventListener('hashchange', handleHash);
    handleHash(); // Run on mount
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const validateSub = async (email: string) => {
    setLoginLoading(true);
    const active = await checkSubscription(email);
    if (active) {
      setIsSubscriber(true);
      localStorage.setItem('v-reverse-email', email);
      setShowLoginModal(false);
    } else {
      alert(lang === 'pt' ? "Assinatura não encontrada." : "Subscription not found.");
    }
    setLoginLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isSubscriber) return;

    setStatus(AnalysisStatus.ANALYZING);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const b64 = (reader.result as string).split(',')[1];
        const res = await analyzeContent({ type: 'file', base64: b64, mimeType: file.type }, targetModel, config);
        setResult(res);
        setStatus(AnalysisStatus.COMPLETED);
      } catch (err) {
        setStatus(AnalysisStatus.IDLE);
        alert("Extraction failed. Frame complexity exceeded.");
      }
    };
    reader.readAsDataURL(file);
  };

  const renderHome = () => (
    <div className="animate-in fade-in duration-700">
      {/* HERO */}
      <section className="text-center mb-24 md:mb-40 pt-20 md:pt-40">
         <span className="inline-block bg-indigo-600/10 border border-indigo-500/20 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-8">{t.heroTag}</span>
         <h1 className="hero-h1 text-4xl md:text-8xl font-black uppercase tracking-tighter italic leading-none mb-10 gradient-text">{t.heroH1}</h1>
         <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto mb-12 italic">{t.heroDesc}</p>
         <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#pricing" className="w-full sm:w-auto bg-white text-black px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-premium">{t.ctaPricing}</a>
            <a href="#workstation" className="w-full sm:w-auto border border-white/10 px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-white/5 transition-all">{t.ctaWorkstation}</a>
         </div>
      </section>

      {/* WORKSTATION */}
      <section id="workstation" className="mb-40 space-y-16">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-8">
            <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem] space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Target Engine</h3>
              <div className="grid grid-cols-2 gap-3">
                {TARGET_MODELS.map(m => (
                  <button key={m.id} onClick={() => setTargetModel(m.id)} className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${targetModel === m.id ? 'bg-indigo-600 border-indigo-400 shadow-lg' : 'bg-white/5 border-white/10 opacity-50'}`}>
                    <span className="text-2xl">{m.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">{m.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem] space-y-8">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Parameters</h3>
               <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-black uppercase text-slate-600"><span>Fidelity</span><span className="text-indigo-400">{config.fidelity}%</span></div>
                    <input type="range" min="0" max="100" value={config.fidelity} onChange={e => setConfig({...config, fidelity: parseInt(e.target.value)})} className="w-full accent-indigo-600" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-black uppercase text-slate-600"><span>Detail</span><span className="text-indigo-400">{config.detailLevel}%</span></div>
                    <input type="range" min="0" max="100" value={config.detailLevel} onChange={e => setConfig({...config, detailLevel: parseInt(e.target.value)})} className="w-full accent-indigo-600" />
                  </div>
               </div>
            </div>
          </div>
          <div className="bg-white/[0.02] border border-white/10 p-10 rounded-[3rem] flex flex-col justify-center text-center">
            {!isSubscriber ? (
              <div className="space-y-6 py-8">
                <IconSparkles className="w-12 h-12 text-indigo-500 mx-auto" />
                <h3 className="text-3xl font-black uppercase italic tracking-tighter">Terminal Locked</h3>
                <a href="#pricing" className="inline-block bg-indigo-600 px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest">Get Access</a>
              </div>
            ) : (
              <div onClick={() => fileInputRef.current?.click()} className="group border-2 border-dashed border-white/10 rounded-[2.5rem] p-16 md:p-24 cursor-pointer hover:border-indigo-500 hover:bg-indigo-600/[0.03] transition-all">
                <IconUpload className="w-16 h-16 text-indigo-600 mx-auto mb-8 group-hover:scale-110 transition-transform duration-500" />
                <h3 className="text-3xl font-black uppercase italic tracking-widest mb-2">Upload File</h3>
                <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ANALYSIS RESULTS */}
      {status === AnalysisStatus.ANALYZING && (
        <div className="py-24 text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
          <h2 className="text-3xl font-black uppercase italic animate-pulse">{t.loading}</h2>
        </div>
      )}

      {status === AnalysisStatus.COMPLETED && result && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 mb-40">
           <div className="bg-white/[0.02] border border-white/10 p-10 md:p-16 rounded-[3rem] space-y-10 shadow-premium">
              <div className="flex justify-between items-center border-b border-white/5 pb-8">
                <h2 className="text-5xl font-black uppercase italic">Master DNA</h2>
                <button onClick={() => { navigator.clipboard.writeText(result.fullMasterPrompt); alert("Copied!"); }} className="bg-indigo-600 px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                  <IconCopy className="w-4 h-4" /> Copy
                </button>
              </div>
              <div className="bg-black/60 p-8 md:p-12 rounded-[2rem] border border-white/5 text-xl md:text-3xl font-medium italic text-slate-300 leading-relaxed font-serif">
                "{result.fullMasterPrompt}"
              </div>
           </div>
        </div>
      )}

      {/* PRICING */}
      <section id="pricing" className="py-32 border-t border-white/5 space-y-16">
        <div className="text-center space-y-3">
          <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">License.</h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px]">Lifetime access to excellence</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4">
          <div className="bg-white/[0.01] border border-white/10 rounded-[3rem] p-12 flex flex-col hover:border-indigo-500 transition-all">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Standard</span>
            <h3 className="text-5xl font-black uppercase italic mb-8">$29<span className="text-lg text-slate-600">/one-time</span></h3>
            <a href={HOTMART_BASIC} className="block bg-white text-black text-center py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-indigo-600 hover:text-white transition-all">Buy Now</a>
          </div>
          <div className="bg-indigo-600/5 border-2 border-indigo-500 rounded-[3rem] p-12 flex flex-col relative overflow-hidden shadow-premium">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Elite</span>
            <h3 className="text-5xl font-black uppercase italic text-indigo-400 mb-8">$97<span className="text-lg text-slate-400 opacity-50">/one-time</span></h3>
            <a href={HOTMART_ELITE} className="block bg-indigo-600 text-white text-center py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-indigo-500 transition-all">Buy Now</a>
          </div>
        </div>
      </section>

      {/* KNOWLEDGE BASE / BLOG LIST */}
      <section className="py-32 border-t border-white/5 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-5xl font-black uppercase italic tracking-tighter">{t.kbTitle}</h2>
            <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px]">{t.kbDesc}</p>
          </div>
          <div className="grid gap-6">
            {POSTS.map(post => (
              <a 
                key={post.id} 
                href={`#${post.slug}`}
                className="group flex flex-col md:flex-row md:items-center justify-between p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-white/[0.05] transition-all"
              >
                <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase text-indigo-500 tracking-widest">{post.category}</span>
                  <h3 className="text-xl md:text-2xl font-black uppercase italic group-hover:text-indigo-400 transition-colors">{post.title}</h3>
                </div>
                <div className="mt-4 md:mt-0 flex items-center gap-4 text-[10px] font-black uppercase text-slate-600 tracking-widest">
                  <span>{post.readTime} READ</span>
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
          <button 
            onClick={() => { window.location.hash = ''; }} 
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-12 hover:text-white transition-colors"
          >
            <IconChevron className="w-4 h-4 rotate-90" /> {t.back}
          </button>
          
          <div className="flex items-center gap-4 mb-8">
            <span className="bg-indigo-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">{activePost.category}</span>
            <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">{activePost.readTime} TECHNICAL STUDY</span>
          </div>

          <article className="post-body">
            <h1 className={activePost.keyword === "extract prompt from video" ? "gradient-text" : ""}>{activePost.title}</h1>
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 mb-16 space-y-2">
               <p className="text-[10px] font-mono text-indigo-400"><strong>Index Keyword:</strong> {activePost.keyword}</p>
               <p className="text-[10px] font-mono text-slate-500"><strong>SEO Title:</strong> {activePost.seoTitle}</p>
               <p className="text-[10px] font-mono text-slate-500"><strong>Meta Description:</strong> {activePost.metaDesc}</p>
            </div>
            <div dangerouslySetInnerHTML={{ __html: activePost.content }} />
          </article>
          
          <div className="mt-20 p-12 bg-indigo-600 rounded-[3rem] text-center space-y-8 shadow-premium">
             <h2 className="text-4xl font-black uppercase italic tracking-tighter">Ready to Architect Your Success?</h2>
             <p className="text-xl font-medium opacity-80 italic">Don't let another viral DNA sequence slip through your fingers.</p>
             <a href="#pricing" className="inline-block bg-white text-black px-12 py-6 rounded-2xl font-black uppercase text-sm tracking-widest hover:scale-105 transition-all">{t.buyNow}</a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 w-full z-[150] glass border-b border-white/5 px-4 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a href="#" className="flex items-center gap-2">
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
            {!isSubscriber && <button onClick={() => setShowLoginModal(true)} className="bg-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase">Portal</button>}
          </div>
        </div>
      </nav>

      {view === 'home' ? renderHome() : renderPost()}

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-16 text-center">
        <IconSparkles className="w-6 h-6 text-indigo-600 mx-auto mb-6" />
        <span className="font-black text-xl uppercase italic block mb-10">V-REVERSE PRO</span>
        <div className="flex justify-center gap-10 text-[9px] font-black uppercase tracking-widest text-slate-600">
          <a href="#">Terms</a><a href="#">Privacy</a><a href="#">Support</a>
        </div>
      </footer>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl">
          <div className="w-full max-w-md p-10 bg-[#0f172a] border border-white/10 rounded-[3rem] text-center space-y-8 shadow-premium">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic">Architect Portal</h2>
            <input type="email" placeholder="email@architect.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-center font-bold outline-none focus:border-indigo-500 transition-all" />
            <button onClick={() => validateSub(loginEmail)} disabled={loginLoading} className="w-full bg-indigo-600 py-4 rounded-xl font-black uppercase text-xs tracking-widest">
              {loginLoading ? 'Verifying...' : 'Unlock Terminal'}
            </button>
            <button onClick={() => setShowLoginModal(false)} className="text-[10px] font-black uppercase opacity-30">Return</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
