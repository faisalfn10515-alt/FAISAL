
import React, { useState, useEffect } from 'react';
import { 
  Trophy, User, Target, Star, Mic, CheckCircle2, Zap, Menu, X, Users, Eye,
  Rocket, Medal, Brain, GraduationCap, Lightbulb, Calendar, MapPin, Mail, ExternalLink,
  ChevronUp, Send, Settings, Lock, Save, Trash2, RefreshCcw, 
  ChevronRight, ChevronLeft, XCircle, Timer, Crown, Monitor
} from 'lucide-react';

const THEMES = {
  royal: { primary: 'bg-black', secondary: 'bg-amber-500', text: 'text-black', accent: 'text-amber-600', gradient: 'from-black via-slate-900 to-black', light: 'bg-slate-50' },
  modern: { primary: 'bg-slate-900', secondary: 'bg-blue-500', text: 'text-slate-900', accent: 'text-blue-600', gradient: 'from-slate-900 to-slate-800', light: 'bg-slate-50' },
  elegant: { primary: 'bg-purple-950', secondary: 'bg-rose-400', text: 'text-purple-950', accent: 'text-purple-600', gradient: 'from-black via-purple-950 to-black', light: 'bg-purple-50' },
  nature: { primary: 'bg-emerald-950', secondary: 'bg-lime-400', text: 'text-emerald-950', accent: 'text-emerald-600', gradient: 'from-black via-emerald-950 to-black', light: 'bg-emerald-50' }
};

const VISITOR_KEY = 'faisal_visitor_v2';

const QUIZ_QUESTIONS = [
  { question: "ما هو الفريق الذي يشجعه فيصل؟", options: ["أ) الهلال", "ب) الأهلي", "ج) الاتحاد"], correct: 0 },
  { question: "ما هو عمر فيصل؟", options: ["أ) 13", "ب) 11", "ج) 12"], correct: 2 },
  { question: "ما هي مادة فيصل المفضلة؟", options: ["أ) العلوم", "ب) الرياضيات", "ج) الإنجليزية"], correct: 1 },
  { question: "من هو لاعب فيصل المفضل؟", options: ["أ) ميسي", "ب) بنزيما", "ج) نيمار"], correct: 0 },
  { question: "ما اسم أخو فيصل؟", options: ["أ) إياد", "ب) حسام", "ج) إلياس"], correct: 2 }
];

const App: React.FC = () => {
  const [themeKey, setThemeKey] = useState<keyof typeof THEMES>(() => (localStorage.getItem('f_theme') as any) || 'royal');
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const [quizMode, setQuizMode] = useState<'idle' | 'playing' | 'feedback' | 'finished'>('idle');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  const [personalInfo, setPersonalInfo] = useState(() => {
    const saved = localStorage.getItem('f_info');
    return saved ? JSON.parse(saved) : {
      name: 'فيصل', lastName: 'نبيل السلمي', role: 'مهندس المستقبل 🏗️',
      bio: 'أنا فيصل، طالب شغوف بالعلم والابتكار، أسعى دائماً لتطوير مهاراتي في شتى المجالات. أؤمن بأن كل إنجاز يبدأ بخطوة، وأن النجاح هو ثمرة الجد والمثابرة.',
      age: '12 عاماً', location: 'المملكة العربية السعودية', level: 'الأول المتوسط', email: 'faisal.nabil@example.com'
    };
  });

  const [skills, setSkills] = useState(() => {
    const saved = localStorage.getItem('f_skills');
    return saved ? JSON.parse(saved) : [
      { title: 'الإلقاء والخطابة', level: 95, color: 'bg-amber-500', iconType: 'mic' },
      { title: 'التفكير الإبداعي', level: 90, color: 'bg-slate-800', iconType: 'brain' },
      { title: 'القيادة الطلابية', level: 85, color: 'bg-slate-700', iconType: 'crown' },
      { title: 'استخدام التقنية', level: 80, color: 'bg-slate-900', iconType: 'monitor' }
    ];
  });

  const [achievements, setAchievements] = useState(() => {
    const saved = localStorage.getItem('f_achieve');
    return saved ? JSON.parse(saved) : [
      { title: 'بطل الإلقاء على مستوى المدرسة', desc: 'المركز الأول في مسابقة الإلقاء والخطابة المدرسية.' },
      { title: 'شهادة التفوق الدراسي', desc: 'الحصول على المركز الأول بتقدير ممتاز.' }
    ];
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('f_msgs');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [formData, setFormData] = useState({ name: '', age: '', role: '', content: '' });
  const currentTheme = THEMES[themeKey];

  useEffect(() => {
    const savedCount = localStorage.getItem(VISITOR_KEY);
    const newCount = (savedCount ? parseInt(savedCount) : 0) + 1;
    setVisitorCount(newCount);
    localStorage.setItem(VISITOR_KEY, newCount.toString());

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ['home', 'about', 'skills', 'achievements', 'quiz', 'contact'];
      let cur = 'home';
      for (const s of sections) {
        const el = document.getElementById(s);
        if (el && el.getBoundingClientRect().top <= 150) cur = s;
      }
      setActiveSection(cur);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (saveStatus === 'saving') return;
    const t = setTimeout(() => {
      localStorage.setItem('f_theme', themeKey);
      localStorage.setItem('f_msgs', JSON.stringify(messages));
      localStorage.setItem('f_info', JSON.stringify(personalInfo));
      localStorage.setItem('f_skills', JSON.stringify(skills));
      localStorage.setItem('f_achieve', JSON.stringify(achievements));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
    return () => clearTimeout(t);
  }, [themeKey, messages, personalInfo, skills, achievements]);

  useEffect(() => {
    let t: any;
    if (quizMode === 'playing' && timeLeft > 0) {
      t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    } else if (quizMode === 'playing' && timeLeft === 0) {
      handleAnswer(null);
    }
    return () => clearInterval(t);
  }, [quizMode, timeLeft]);

  const handleAnswer = (idx: number | null) => {
    if (quizMode !== 'playing') return;
    setSelectedOption(idx);
    const correct = idx === QUIZ_QUESTIONS[currentQIndex].correct;
    setIsCorrect(correct);
    if (correct) setScore(p => p + 1);
    setQuizMode('feedback');
    setTimeout(() => {
      if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
        setCurrentQIndex(p => p + 1);
        setTimeLeft(10);
        setSelectedOption(null);
        setIsCorrect(null);
        setQuizMode('playing');
      } else {
        setQuizMode('finished');
      }
    }, 1200);
  };

  const resetVisitorCount = () => {
    setVisitorCount(0);
    localStorage.setItem(VISITOR_KEY, '0');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === '1234') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword('');
    } else {
      alert('كلمة مرور خاطئة');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.content.trim()) return;
    const msg = { ...formData, timestamp: new Date().toLocaleString('ar-SA') };
    setMessages([msg, ...messages]);
    setFormData({ name: '', age: '', role: '', content: '' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <div className={`min-h-screen ${currentTheme.light} text-right transition-all duration-500 font-['Cairo']`} dir="rtl">
      
      {isAdmin && (
        <div className="fixed top-0 left-0 right-0 z-[150] bg-amber-500 text-slate-900 h-10 flex items-center justify-center gap-4 shadow-xl font-black text-xs">
          <div className="flex items-center gap-2"><Settings className="animate-spin-slow" size={14} /> وضع التعديل نشط</div>
          <button onClick={resetVisitorCount} className="bg-white/30 px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-white/50 transition-all"><RefreshCcw size={12}/> تصفير العداد</button>
          <button onClick={() => setIsAdmin(false)} className="bg-slate-900 text-white px-3 py-1 rounded-full hover:bg-slate-800">إغلاق الإدارة</button>
        </div>
      )}

      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all ${isAdmin ? 'mt-10' : ''} ${scrolled ? 'bg-white/95 shadow-md h-16' : 'bg-transparent h-20'}`}>
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('home')}>
            <div className={`w-10 h-10 ${currentTheme.primary} rounded-lg flex items-center justify-center text-white shadow-lg`}><GraduationCap /></div>
            <span className={`text-lg font-black ${!scrolled && themeKey === 'royal' ? 'text-white' : 'text-slate-900'}`}>فيصل نبيل السلمي</span>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1 bg-slate-100/50 backdrop-blur rounded-full text-xs font-bold ml-4 border border-slate-200">
               <Eye size={12} className="text-amber-500" /> الزوار: {visitorCount.toLocaleString()}
            </div>
            {['home', 'about', 'skills', 'achievements', 'quiz', 'contact'].map(id => (
              <button key={id} onClick={() => scrollToSection(id)} className={`px-4 py-1 rounded-md font-bold text-sm transition-all ${activeSection === id ? `${currentTheme.primary} text-white shadow-md` : (!scrolled && themeKey === 'royal' ? 'text-white/70 hover:text-white' : 'text-slate-600 hover:bg-slate-50')}`}>
                {id === 'home' ? 'الرئيسية' : id === 'about' ? 'من أنا' : id === 'skills' ? 'مهاراتي' : id === 'achievements' ? 'إنجازاتي' : id === 'quiz' ? 'تحدي' : 'تواصل'}
              </button>
            ))}
            <button onClick={() => setShowAdminLogin(true)} className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-lg ml-2 hover:bg-slate-800 transition-all shadow-lg"><Lock size={14}/></button>
          </div>
          <button className="lg:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}><Menu /></button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[200] bg-white p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-10">
          <button onClick={() => setIsMenuOpen(false)} className="self-end p-2"><X /></button>
          {['home', 'about', 'skills', 'achievements', 'quiz', 'contact'].map(id => (
            <button key={id} onClick={() => scrollToSection(id)} className="text-2xl font-black text-right p-4 border-b border-slate-100 uppercase">
              {id === 'home' ? 'الرئيسية' : id === 'about' ? 'من أنا' : id === 'skills' ? 'مهاراتي' : id === 'achievements' ? 'إنجازاتي' : id === 'quiz' ? 'تحدي' : 'تواصل'}
            </button>
          ))}
        </div>
      )}

      {showAdminLogin && (
        <div className="fixed inset-0 z-[250] bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-[2rem] max-w-sm w-full shadow-2xl">
            <h3 className="text-2xl font-black mb-6 text-center">دخول المسؤول 🔐</h3>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input 
                type="password" 
                placeholder="كلمة المرور" 
                className="w-full p-4 bg-slate-100 rounded-xl font-bold"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-black text-white p-4 rounded-xl font-black">دخول</button>
                <button type="button" onClick={() => setShowAdminLogin(false)} className="bg-slate-100 p-4 rounded-xl font-black">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <section id="home" className={`min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br ${currentTheme.gradient} text-white pt-20`}>
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center w-full relative z-10">
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-black leading-tight animate-in fade-in slide-in-from-right-10 duration-700">أنا فيصل <br/><span className="text-amber-400">نبيل السلمي</span></h1>
            <p className="text-lg md:text-2xl opacity-80 leading-relaxed max-w-xl animate-in fade-in slide-in-from-right-12 duration-1000 delay-200">{personalInfo.bio}</p>
            <div className="flex gap-4 pt-4 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-500">
              <button onClick={() => scrollToSection('about')} className="bg-white text-black px-10 py-4 rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-2">ابدأ الرحلة 🚀</button>
            </div>
          </div>
          <div className="hidden lg:flex justify-center animate-in zoom-in duration-1000 delay-300">
            <div className="w-72 h-96 bg-white/10 backdrop-blur-xl border-4 border-white/20 rounded-[4rem] flex items-center justify-center shadow-2xl group transition-all hover:border-amber-400 relative">
               <div className="absolute -top-6 -right-6 w-20 h-20 bg-amber-400 rounded-full flex items-center justify-center text-black shadow-xl animate-bounce">
                  <Star fill="black" />
               </div>
              <User size={140} className="opacity-30 group-hover:opacity-60 transition-opacity" />
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-5xl font-black text-slate-900">البطاقة التعريفية 👤</h2>
            <div className="w-24 h-2 bg-amber-400 mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { label: 'العمر', val: personalInfo.age, icon: <Calendar /> },
              { label: 'المرحلة', val: personalInfo.level, icon: <GraduationCap /> },
              { label: 'المكان', val: personalInfo.location, icon: <MapPin /> },
              { label: 'التواصل', val: personalInfo.email, icon: <Mail /> }
            ].map((it, idx) => (
              <div key={idx} className="p-8 bg-slate-50 rounded-[2.5rem] flex items-center gap-6 border-2 border-slate-100 hover:border-amber-200 hover:shadow-2xl transition-all group">
                <div className={`w-16 h-16 rounded-2xl ${currentTheme.primary} text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform`}>{it.icon}</div>
                <div>
                  <p className="text-sm font-bold text-slate-400 mb-1">{it.label}</p>
                  <p className="text-2xl font-black text-slate-800">{it.val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="skills" className="py-24 bg-slate-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-black mb-16">مهاراتي المتميزة ✨</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {skills.map((s:any, idx:number) => (
              <div key={idx} className="bg-white p-8 rounded-[3rem] shadow-sm border border-white hover:shadow-2xl hover:-translate-y-4 transition-all">
                <div className={`w-14 h-14 rounded-2xl ${s.color} text-white flex items-center justify-center mb-6 shadow-xl mx-auto`}><Zap size={24} /></div>
                <h3 className="text-xl font-black mb-4 text-slate-800">{s.title}</h3>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
                   <div className={`h-full ${s.color} transition-all duration-1000`} style={{width: `${s.level}%`}}></div>
                </div>
                <p className="text-sm font-bold text-slate-400">{s.level}%</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="achievements" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-black mb-16 text-center">إنجازاتي 🏆</h2>
          <div className="grid md:grid-cols-2 gap-10">
            {achievements.map((ach:any, idx:number) => (
              <div key={idx} className="bg-slate-900 text-white p-10 rounded-[3.5rem] flex gap-8 items-start relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-amber-400/20 transition-all"></div>
                 <div className="w-16 h-16 bg-amber-400 text-black rounded-2xl flex items-center justify-center shadow-xl shrink-0"><Medal size={32} /></div>
                 <div>
                    <h3 className="text-2xl font-black mb-3">{ach.title}</h3>
                    <p className="text-lg opacity-60 leading-relaxed">{ach.desc}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="quiz" className="py-24 bg-slate-50 scroll-mt-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-slate-900 text-white rounded-[4rem] p-12 shadow-2xl relative overflow-hidden border-x-[12px] border-amber-400">
            {quizMode === 'idle' && (
              <div className="text-center space-y-8 py-10">
                <Brain size={100} className="mx-auto text-amber-400 animate-pulse" />
                <h2 className="text-4xl font-black">تحدي معلومات فيصل 🎮</h2>
                <p className="text-xl text-slate-400 font-bold">هل تعتقد أنك تعرف فيصل جيداً؟</p>
                <button onClick={() => setQuizMode('playing')} className="bg-amber-400 text-black px-16 py-5 rounded-2xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-amber-400/40">ابدأ التحدي</button>
              </div>
            )}
            {quizMode === 'playing' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center text-sm font-black text-amber-400">
                   <span className="bg-white/10 px-4 py-2 rounded-xl border border-white/10">سؤال {currentQIndex+1} / 5</span> 
                   <span className={`flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-white/10 ${timeLeft < 4 ? 'text-rose-500 animate-pulse' : ''}`}><Timer size={18} /> {timeLeft} ثانية</span>
                </div>
                <h3 className="text-3xl font-black leading-tight min-h-[100px]">{QUIZ_QUESTIONS[currentQIndex].question}</h3>
                <div className="grid gap-4">
                  {QUIZ_QUESTIONS[currentQIndex].options.map((o, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => handleAnswer(idx)} 
                      className={`p-6 text-right rounded-2xl font-bold text-xl transition-all border-2 ${selectedOption === idx ? 'bg-amber-400 text-black border-amber-400' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {quizMode === 'feedback' && (
              <div className="text-center py-20 space-y-6">
                 {isCorrect ? (
                   <div className="flex flex-col items-center gap-4 animate-bounce">
                      <CheckCircle2 size={120} className="text-green-400" />
                      <h3 className="text-4xl font-black">إجابة صحيحة! 👏</h3>
                   </div>
                 ) : (
                   <div className="flex flex-col items-center gap-4 animate-shake">
                      <XCircle size={120} className="text-rose-500" />
                      <h3 className="text-4xl font-black">إجابة خاطئة! 💔</h3>
                   </div>
                 )}
              </div>
            )}
            {quizMode === 'finished' && (
              <div className="text-center space-y-8 py-10">
                <Trophy size={120} className="mx-auto text-amber-400" />
                <h2 className="text-5xl font-black">انتهى التحدي!</h2>
                <div className="text-3xl font-black p-6 bg-white/5 rounded-3xl inline-block px-12">
                   النتيجة: <span className="text-amber-400">{score}</span> من 5
                </div>
                <p className="text-xl opacity-60 font-bold">{score === 5 ? 'أنت تعرف فيصل حق المعرفة! 🏆' : 'جيد جداً، حاول مرة أخرى! 💪'}</p>
                <button onClick={() => {setQuizMode('idle'); setScore(0); setCurrentQIndex(0); setTimeLeft(10);}} className="block mx-auto bg-white text-black px-12 py-4 rounded-xl font-black hover:bg-amber-400 transition-colors">إعادة المحاولة</button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20">
           <div className="space-y-10">
              <h2 className="text-5xl font-black">تواصل معي ✍️</h2>
              <p className="text-xl opacity-70 leading-relaxed font-bold italic">"رسائلكم تلهمني وتدفعني للمضي قدماً.. شكراً لكل كلمة تشجيع!"</p>
              <form onSubmit={handleSendMessage} className="space-y-4">
                 <div className="grid md:grid-cols-3 gap-4">
                    <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="الاسم" className="p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl w-full focus:border-amber-400 outline-none font-bold" />
                    <input value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} placeholder="العمر" className="p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl w-full focus:border-amber-400 outline-none font-bold" />
                    <input value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="المنصب (اختياري)" className="p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl w-full focus:border-amber-400 outline-none font-bold" />
                 </div>
                 <textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="اكتب رسالتك هنا..." rows={5} className="p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl w-full focus:border-amber-400 outline-none font-bold" />
                 <button className="w-full bg-black text-white p-5 rounded-2xl font-black text-xl hover:bg-slate-900 flex items-center justify-center gap-3 shadow-xl transition-all">
                    <Send size={24} /> إرسال الرسالة
                 </button>
              </form>
           </div>
           <div className="space-y-8">
              <h3 className="text-3xl font-black flex items-center gap-3">سجل الزوار 📝 <span className="text-sm bg-slate-100 px-3 py-1 rounded-full">{messages.length}</span></h3>
              <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar p-2">
                 {messages.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-3xl opacity-40">لا توجد رسائل بعد.. كن أول من يعلق!</div>
                 ) : (
                    messages.map((m:any, idx:number) => (
                       <div key={idx} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-sm relative group animate-in slide-in-from-bottom-4">
                          <div className="flex justify-between items-start mb-4">
                             <div>
                                <p className="font-black text-slate-900 text-lg">{m.name} {m.age && <span className="text-sm text-slate-400">({m.age} سنة)</span>}</p>
                                <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">{m.role || 'زائر متميز'}</p>
                             </div>
                             <p className="text-[10px] opacity-40 font-bold">{m.timestamp}</p>
                          </div>
                          <p className="text-slate-700 leading-relaxed font-bold">{m.content}</p>
                          {isAdmin && (
                            <button onClick={() => setMessages(messages.filter((_:any, i:number) => i !== idx))} className="absolute top-4 left-4 p-2 bg-rose-50 text-rose-500 rounded-full opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14}/></button>
                          )}
                       </div>
                    ))
                 )}
              </div>
           </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-white py-20">
         <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
            <div className="flex items-center justify-center gap-3">
               <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-amber-400 text-3xl font-black">ف</div>
               <span className="text-2xl font-black tracking-tighter">فيصل نبيل السلمي</span>
            </div>
            <p className="max-w-xl mx-auto opacity-50 font-bold leading-relaxed text-lg italic">
               "طموح يعانق السماء.. وإرادة تصنع المستحيل. شكراً لزيارة ملف إنجازي."
            </p>
            <div className="pt-10 border-t border-white/5 text-[10px] font-bold opacity-20 uppercase tracking-[0.3em]">
               © 2024 فيصل نبيل السلمي | ملف الإنجاز الرقمي
            </div>
         </div>
      </footer>
      
      <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className={`fixed bottom-8 right-8 p-4 bg-black text-white rounded-full shadow-2xl z-[150] transition-all hover:scale-110 active:scale-95 ${scrolled ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <ChevronUp />
      </button>

      {saveStatus === 'saved' && (
        <div className="fixed top-24 right-8 z-[300] bg-green-500 text-white px-6 py-2 rounded-full font-black text-xs shadow-xl flex items-center gap-2 animate-in slide-in-from-right-10">
          <Save size={14} /> تم الحفظ تلقائياً
        </div>
      )}
    </div>
  );
};

export default App;
