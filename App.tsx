import React, { useState, useRef, useEffect } from 'react';
import { AnalysisStatus, VideoPromptResult, TARGET_MODELS, WorkstationConfig } from './types';
import { analyzeContent } from './services/geminiService';
import { 
  IconUpload, IconSparkles, IconCopy, IconChevron
} from './components/Icons';
import { checkSubscription } from './services/supabaseClient';

const TRANSLATIONS: Record<string, any> = {
  en: {
    heroTag: "Architect Workstation v6.5",
    heroH1: "extract prompt from video",
    heroDesc: "The professional standard to reverse-engineer visual DNA. Transform any source into high-density AI prompts.",
    loading: "Scanning Neural DNA...",
    tabFile: "Source File",
    tabUrl: "Digital Link",
    urlPlaceholder: "Enter YouTube, TikTok or Instagram URL...",
    analyzeBtn: "Start Analysis"
  },
  pt: {
    heroTag: "Workstation Arquiteto v6.5",
    heroH1: "extrair prompt de vídeo",
    heroDesc: "O padrão profissional para engenharia reversa de DNA visual. Transforme qualquer fonte em prompts de elite.",
    loading: "Escaneando DNA Neural...",
    tabFile: "Arquivo Local",
    tabUrl: "Link Digital",
    urlPlaceholder: "Cole a URL do vídeo (YouTube, TikTok, Instagram)...",
    analyzeBtn: "Iniciar Análise"
  }
};

const App: React.FC = () => {
  const [lang, setLang] = useState('pt');
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<VideoPromptResult | null>(null);
  const [targetModel, setTargetModel] = useState('sora');
  const [inputTab, setInputTab] = useState<'file' | 'url'>('file');
  const [urlInput, setUrlInput] = useState('');
  
  const [config, setConfig] = useState<WorkstationConfig>({
    fidelity: 95,
    detailLevel: 90,
    promptStyle: 'Cinematic'
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
  }, []);

  const validateSub = async (email: string) => {
    setLoginLoading(true);
    const active = await checkSubscription(email);
    if (active) {
      setIsSubscriber(true);
      localStorage.setItem('v-reverse-email', email);
      setShowLoginModal(false);
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
        setStatus(AnalysisStatus.ERROR);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUrlAnalysis = async () => {
    if (!urlInput || !isSubscriber) return;
    setStatus(AnalysisStatus.ANALYZING);
    setResult(null);
    try {
      const res = await analyzeContent({ type: 'url', url: urlInput }, targetModel, config);
      setResult(res);
      setStatus(AnalysisStatus.COMPLETED);
    } catch (err) {
      setStatus(AnalysisStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <IconSparkles className="text-indigo-500 w-5 h-5" />
            <span className="font-black uppercase italic tracking-tighter text-lg">V-REVERSE <span className="text-indigo-500">PRO</span></span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')} className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity">{lang.toUpperCase()}</button>
            {!isSubscriber && <button onClick={() => setShowLoginModal(true)} className="bg-indigo-600 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all">Acessar</button>}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-40">
        <header className="text-center mb-24 animate-in fade-in duration-1000">
          <span className="inline-block bg-indigo-500/10 border border-indigo-500/20 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-8">{t.heroTag}</span>
          <h1 className="text-4xl md:text-8xl font-black uppercase italic tracking-tighter leading-none mb-8 gradient-text">{t.heroH1}</h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto italic">{t.heroDesc}</p>
        </header>

        <section id="workstation" className="grid lg:grid-cols-2 gap-12 mb-20">
          <div className="space-y-8 animate-in slide-in-from-left-4 duration-700">
            <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-md">
              <h3 className="text-[11px] font-black uppercase text-indigo-400 tracking-widest mb-6">Engine Core</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {TARGET_MODELS.map(m => (
                  <button key={m.id} onClick={() => setTargetModel(m.id)} className={`flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border transition-all ${targetModel === m.id ? 'bg-indigo-600 border-indigo-400 shadow-lg' : 'bg-white/5 border-white/5 opacity-40 hover:opacity-100'}`}>
                    <span className="text-2xl">{m.icon}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest">{m.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-md">
              <h3 className="text-[11px] font-black uppercase text-indigo-400 tracking-widest mb-8">Calibration</h3>
              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60"><span>Fidelity</span><span className="text-indigo-400">{config.fidelity}%</span></div>
                  <input type="range" min="0" max="100" value={config.fidelity} onChange={e => setConfig({...config, fidelity: parseInt(e.target.value)})} className="w-full accent-indigo-500" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60"><span>Detail</span><span>{config.detailLevel}%</span></div>
                  <input type="range" min="0" max="100" value={config.detailLevel} onChange={e => setConfig({...config, detailLevel: parseInt(e.target.value)})} className="w-full accent-indigo-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/10 p-10 rounded-[3rem] flex flex-col shadow-2xl animate-in slide-in-from-right-4 duration-700">
            <div className="flex bg-black/40 p-1 rounded-2xl mb-12">
              <button onClick={() => setInputTab('file')} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${inputTab === 'file' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>{t.tabFile}</button>
              <button onClick={() => setInputTab('url')} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${inputTab === 'url' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>{t.tabUrl}</button>
            </div>

            <div className="flex-1 flex flex-col justify-center text-center">
              {!isSubscriber ? (
                <div className="space-y-8 py-12">
                  <IconSparkles className="w-16 h-16 text-indigo-500 mx-auto opacity-20" />
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter">Portal Bloqueado</h3>
                  <button onClick={() => setShowLoginModal(true)} className="bg-indigo-600 px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-premium">Validar Acesso</button>
                </div>
              ) : (
                <div className="animate-in zoom-in-95 duration-500">
                  {inputTab === 'file' ? (
                    <div onClick={() => fileInputRef.current?.click()} className="group border-2 border-dashed border-white/10 rounded-[2.5rem] p-16 cursor-pointer hover:border-indigo-500 hover:bg-indigo-600/[0.03] transition-all">
                      <IconUpload className="w-16 h-16 text-indigo-600 mx-auto mb-8 group-hover:scale-110 transition-transform" />
                      <h4 className="text-2xl font-black uppercase italic tracking-widest">Injetar Mídia</h4>
                      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <input type="text" placeholder={t.urlPlaceholder} value={urlInput} onChange={e => setUrlInput(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl px-8 py-6 font-bold outline-none focus:border-indigo-500 transition-all text-sm" />
                      <button onClick={handleUrlAnalysis} className="w-full bg-indigo-600 py-6 rounded-2xl font-black uppercase text-xs tracking-widest shadow-premium hover:bg-indigo-500 transition-all">{t.analyzeBtn}</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {status === AnalysisStatus.ANALYZING && (
          <div className="py-24 text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
            <h2 className="text-3xl font-black uppercase italic tracking-widest animate-pulse">{t.loading}</h2>
          </div>
        )}

        {status === AnalysisStatus.COMPLETED && result && (
          <div className="space-y-12 animate-in slide-in-from-bottom-12 duration-1000">
            <div className="bg-white/[0.02] border border-white/10 p-10 md:p-16 rounded-[3rem] shadow-premium">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">Neural Blueprint</h2>
                <button onClick={() => { navigator.clipboard.writeText(result.fullMasterPrompt); alert("Prompt Copiado!"); }} className="bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 transition-all">
                  <IconCopy className="w-4 h-4" /> Copiar Prompt
                </button>
              </div>
              <div className="bg-black/60 p-10 md:p-14 rounded-[2.5rem] border border-white/5 font-mono text-lg leading-relaxed text-slate-300 italic">
                "{result.fullMasterPrompt}"
              </div>

              {/* Negative DNA Section */}
              <div className="mt-8 p-8 bg-pink-500/[0.03] border border-pink-500/10 rounded-[2rem] animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-pink-500">Negative DNA (Avoidance Protocol)</h3>
                  </div>
                  <button onClick={() => { navigator.clipboard.writeText(result.negativePrompt); alert("Negative Prompt Copiado!"); }} className="text-[9px] font-black uppercase text-slate-500 hover:text-white transition-colors">Copy Negative</button>
                </div>
                <p className="text-sm text-slate-500 italic leading-relaxed font-mono opacity-80">{result.negativePrompt}</p>
              </div>

              {result.groundingSources && (
                <div className="mt-12 pt-12 border-t border-white/5">
                  <h4 className="text-[11px] font-black uppercase text-indigo-400 mb-6 tracking-widest">Fontes de Grounding</h4>
                  <div className="flex flex-wrap gap-4">
                    {result.groundingSources.map((s, i) => (
                      <a key={i} href={s.uri} target="_blank" className="bg-white/5 px-4 py-2 rounded-lg text-[10px] font-bold text-slate-500 hover:text-indigo-400 transition-all">[{i+1}] {s.title}</a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { label: 'Subject DNA', content: result.subjectDNA },
                { label: 'Style DNA', content: result.styleDNA },
                { label: 'Environment DNA', content: result.environmentDNA }
              ].map((item, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/10 p-10 rounded-[2.5rem]">
                  <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest block mb-4">{item.label}</span>
                  <p className="text-base text-slate-400 leading-relaxed italic opacity-80">{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-6">
          <div className="w-full max-w-md bg-[#0f172a] border border-white/10 p-12 rounded-[3.5rem] text-center space-y-10">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Acesso Arquiteto</h2>
            <input type="email" placeholder="seu@email.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl px-8 py-5 font-bold text-center outline-none focus:border-indigo-500 transition-all" />
            <button onClick={() => validateSub(loginEmail)} disabled={loginLoading} className="w-full bg-indigo-600 py-5 rounded-2xl font-black uppercase text-xs tracking-widest">
              {loginLoading ? 'Verificando...' : 'Desbloquear Terminal'}
            </button>
            <button onClick={() => setShowLoginModal(false)} className="text-[10px] font-black uppercase tracking-widest opacity-30">Voltar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;