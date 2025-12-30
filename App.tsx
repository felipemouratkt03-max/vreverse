
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
    heroTag: "Architect Workstation v6.0",
    heroH1: "extract prompt from video",
    heroDesc: "The high-fidelity protocol to reverse-engineer visual DNA. One prompt can redefine your creative career and legacy.",
    ctaPricing: "Secure License",
    ctaWorkstation: "Open Terminal",
    kbTitle: "Architect Knowledge Base",
    kbDesc: "Technical insights on visual DNA extraction and high-end prompt engineering.",
    back: "Back to Home",
    buyNow: "Get Started Now",
    loading: "Scanning Neural DNA...",
    featureTitle: "System Intelligence",
    featureDesc: "8 Core engines driving the V-Reverse ecosystem"
  },
  pt: {
    heroTag: "Workstation Arquiteto v6.0",
    heroH1: "extract prompt from video",
    heroDesc: "O protocolo de alta fidelidade para engenharia reversa de DNA visual. Um prompt pode redefinir sua carreira e legado.",
    ctaPricing: "Garantir Licença",
    ctaWorkstation: "Abrir Terminal",
    kbTitle: "Base de Conhecimento",
    kbDesc: "Insights técnicos sobre extração de DNA visual e engenharia de prompt de elite.",
    back: "Voltar ao Início",
    buyNow: "Começar Agora",
    loading: "Escaneando DNA Neural...",
    featureTitle: "Inteligência do Sistema",
    featureDesc: "8 Motores principais que impulsionam o ecossistema V-Reverse"
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
      <p>In the high-stakes world of generative AI, the ability to <strong>extract prompt from video</strong> is the ultimate "cheat code" for creators who refuse to settle for generic outputs.</p>
      <h2>The Core Philosophy of Extraction</h2>
      <p>When you choose to <strong>extract prompt from video</strong>, you are performing a surgical operation on a visual frame. You aren't just looking for "a man in a suit." You are looking for the exact light diffraction on the fabric and lens focal length.</p>
      <div class="code-block">
        // V-REVERSE PROTOCOL v6.0
        const dna = await workstation.analyze("frame_01.png");
        return dna.toPrompt();
      </div>
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
      <p>An <strong>ai image prompt generator</strong> should not be a "black box" that gives you random words. It must be a precision instrument. Our engine uses Reverse Latent Mapping.</p>
      <div class="code-block">
        [GENERATOR OUTPUT]
        "Cinematic wide shot, brutalist architecture, raw concrete texture, overcast moody lighting, shot on ARRI Alexa."
      </div>
      <p>This <strong>ai image prompt generator</strong> output ensures that every frame generated follows the same DNA.</p>
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

const FEATURES = [
  { title: "Neural DNA Deconstruction", desc: "Surgical extraction of visual parameters using custom vision transformers.", icon: "🧬" },
  { title: "Cinematic Lens Emulation", desc: "Reverse-engineer focal lengths, apertures, and sensor dynamics.", icon: "📸" },
  { title: "Lighting Physics Analysis", desc: "Detect Kelvin temperature, volumetric scattering, and global illumination.", icon: "💡" },
  { title: "Multi-Engine Support", desc: "Native optimization for Midjourney, Sora, Runway, Kling, and Luma.", icon: "⚙️" },
  { title: "Temporal Consistency", desc: "Track motion vectors and pacing across video sequences.", icon: "⏱️" },
  { title: "Viral Social Kit", desc: "Auto-generated hooks, titles, and hashtags optimized for reach.", icon: "📈" },
  { title: "4K Frame Sampling", desc: "High-resolution analysis for pixel-perfect detail extraction.", icon: "💎" },
  { title: "Architect Portal Access", desc: "A private, high-performance terminal for professional creators.", icon: "🏛️" }
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

  // Corrigindo o roteamento para evitar tela branca
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      
      // Se o hash estiver vazio, volta para home
      if (!hash || hash === "" || hash.startsWith("/")) {
        setView('home');
        setActivePost(null);
        document.title = "Extract Prompt from Video | V-Reverse Pro Workstation";
        return;
      }

      // Procura o post pelo slug
      const post = POSTS.find(p => p.slug === hash);
      if (post) {
        setActivePost(post);
        setView('post');
        document.title = `${post.seoTitle} | V-Reverse Pro`;
        window.scrollTo(0, 0);
      } else {
        // Fallback para home se o hash for inválido (como âncoras de scroll #pricing)
        if (['pricing', 'workstation', 'faq'].includes(hash)) {
          setView('home');
          setActivePost(null);
        }
      }
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
      <section className="text-center mb-24 md:mb-40 pt-20 md:pt-40 px-4">
         <span className="inline-block bg-indigo-600/10 border border-indigo-500/20 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-8">{t.heroTag}</span>
         <h1 className="hero-h1 text-4xl md:text-8xl font-black uppercase tracking-tighter italic leading-none mb-10 gradient-text">{t.heroH1}</h1>
         <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto mb-12 italic">{t.heroDesc}</p>
         <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#pricing" className="w-full sm:w-auto bg-white text-black px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-premium">{t.ctaPricing}</a>
            <a href="#workstation" className="w-full sm:w-auto border border-white/10 px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-white/5 transition-all">{t.ctaWorkstation}</a>
         </div>
      </section>

      {/* 8 FUNCTIONALITIES SECTION */}
      <section className="py-24 border-t border-white/5 max-w-7xl mx-auto px-4">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">{t.featureTitle}</h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px]">{t.featureDesc}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-8 bg-white/[0.02] border border-white/10 rounded-[2rem] hover:bg-indigo-600/[0.05] transition-all group">
              <span className="text-3xl mb-6 block group-hover:scale-110 transition-transform">{f.icon}</span>
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-3 text-indigo-400">{f.title}</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WORKSTATION */}
      <section id="workstation" className="mb-40 space-y-16 px-4">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 max-w-7xl mx-auto">
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
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 mb-40 px-4">
           <div className="bg-white/[0.02] border border-white/10 p-10 md:p-16 rounded-[3rem] space-y-10 shadow-premium max-w-7xl mx-auto">
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

      {/* PRICING SECTION - UPDATED */}
      <section id="pricing" className="py-32 border-t border-white/5 space-y-16">
        <div className="text-center space-y-3">
          <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">License.</h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px]">Select your operational model</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4">
          <div className="bg-white/[0.01] border border-white/10 rounded-[3rem] p-12 flex flex-col hover:border-indigo-500 transition-all">
            <div className="flex justify-between mb-8">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Standard Access</span>
              <span className="bg-indigo-600/10 text-indigo-400 px-3 py-1 rounded-full text-[8px] font-black uppercase">Monthly</span>
            </div>
            <h3 className="text-5xl font-black uppercase italic mb-8">$29<span className="text-lg text-slate-600">/monthly</span></h3>
            <p className="text-slate-500 text-sm mb-10 leading-relaxed font-medium">For growing creators who need constant DNA deconstruction. Cancel anytime.</p>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-2 text-xs font-bold text-slate-400 tracking-tight">✓ Unlimited Master Prompt Extractions</li>
              <li className="flex items-center gap-2 text-xs font-bold text-slate-400 tracking-tight">✓ Support for MJ v6 & Sora</li>
              <li className="flex items-center gap-2 text-xs font-bold text-slate-400 tracking-tight">✓ Viral Social Media Kit Generator</li>
              <li className="flex items-center gap-2 text-xs font-bold text-slate-400 tracking-tight opacity-30">× 4K Ultra Precision Sampling</li>
            </ul>
            <a href={HOTMART_BASIC} className="block bg-white text-black text-center py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-indigo-600 hover:text-white transition-all">Subscribe Monthly</a>
          </div>

          <div className="bg-indigo-600/5 border-2 border-indigo-500 rounded-[3rem] p-12 flex flex-col relative overflow-hidden shadow-premium">
            <div className="absolute top-0 right-0 bg-indigo-500 text-[8px] font-black uppercase tracking-[0.3em] px-8 py-2 -rotate-45 translate-x-12 translate-y-6">Elite Status</div>
            <div className="flex justify-between mb-8">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Lifetime Access</span>
              <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase">Permanent</span>
            </div>
            <h3 className="text-5xl font-black uppercase italic mb-8">$97<span className="text-lg text-indigo-400 opacity-50">/lifetime</span></h3>
            <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium">The ultimate architect package. Buy once, own the terminal forever. No recurring fees.</p>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-2 text-xs font-bold text-slate-200 tracking-tight">✓ All Standard Features Forever</li>
              <li className="flex items-center gap-2 text-xs font-bold text-slate-200 tracking-tight">✓ 4K Ultra Precision sampling Engine</li>
              <li className="flex items-center gap-2 text-xs font-bold text-slate-200 tracking-tight">✓ Priority Cloud Deconstruction Queue</li>
              <li className="flex items-center gap-2 text-xs font-bold text-slate-200 tracking-tight">✓ Exclusive Commercial License</li>
            </ul>
            <a href={HOTMART_ELITE} className="block bg-indigo-600 text-white text-center py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-indigo-500 transition-all">Get Lifetime Access</a>
          </div>
        </div>
      </section>

      {/* KB / BLOG LIST */}
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
    // Se não houver post ativo, tentamos mostrar a home para evitar a tela branca
    if (!activePost) return renderHome();
    
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
            {!isSubscriber && <button onClick={() => setShowLoginModal(true)} className="bg-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase">Portal</button>}
          </div>
        </div>
      </nav>

      <main className="min-h-screen">
        {view === 'home' ? renderHome() : renderPost()}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-16 text-center bg-black/40">
        <IconSparkles className="w-6 h-6 text-indigo-600 mx-auto mb-6" />
        <span className="font-black text-xl uppercase italic block mb-10">V-REVERSE PRO</span>
        <div className="flex justify-center flex-wrap gap-10 text-[9px] font-black uppercase tracking-widest text-slate-600">
          <a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-indigo-400 transition-colors">Contact Support</a>
        </div>
        <p className="mt-12 text-[8px] text-slate-800 font-bold tracking-[0.2em] uppercase">© 2025 V-Reverse Architectural Systems. All rights reserved.</p>
      </footer>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl">
          <div className="w-full max-w-md p-10 bg-[#0f172a] border border-white/10 rounded-[3rem] text-center space-y-8 shadow-premium">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic">Architect Portal</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Verify your license to unlock the terminal</p>
            <input type="email" placeholder="email@architect.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-center font-bold outline-none focus:border-indigo-500 transition-all text-white" />
            <button onClick={() => validateSub(loginEmail)} disabled={loginLoading} className="w-full bg-indigo-600 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-indigo-500 transition-colors disabled:opacity-50">
              {loginLoading ? 'Verifying...' : 'Unlock Terminal'}
            </button>
            <button onClick={() => setShowLoginModal(false)} className="text-[10px] font-black uppercase opacity-30 hover:opacity-100 transition-opacity">Return to terminal</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
