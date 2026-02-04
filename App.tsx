
import React, { useState, useEffect } from 'react';
import { 
  Trophy, User, Target, Star, BookOpen, Mic, Heart,
  CheckCircle2, Zap, Menu, X, Users, Eye,
  Rocket, Medal, Brain, GraduationCap, Lightbulb, 
  Briefcase, Calendar, MapPin, Mail, Phone, ExternalLink,
  ChevronLeft, ChevronUp, Quote, Sparkles, Send, MessageSquare,
  Settings, Lock, Save, Trash2, Plus, Edit3, ShieldCheck,
  Crown, Monitor
} from 'lucide-react';

// --- الثيمات المتاحة ---
const THEMES = {
  royal: { primary: 'bg-black', secondary: 'bg-amber-500', text: 'text-black', accent: 'text-amber-600', gradient: 'from-black via-slate-900 to-black', light: 'bg-slate-50' },
  modern: { primary: 'bg-slate-900', secondary: 'bg-blue-500', text: 'text-slate-900', accent: 'text-blue-600', gradient: 'from-slate-900 to-slate-800', light: 'bg-slate-50' },
  elegant: { primary: 'bg-purple-950', secondary: 'bg-rose-400', text: 'text-purple-950', accent: 'text-purple-600', gradient: 'from-black via-purple-950 to-black', light: 'bg-purple-50' },
  nature: { primary: 'bg-emerald-950', secondary: 'bg-lime-400', text: 'text-emerald-950', accent: 'text-emerald-600', gradient: 'from-black via-emerald-950 to-black', light: 'bg-emerald-50' }
};

interface GuestMessage {
  name: string;
  age: string;
  role: string;
  content: string;
  timestamp: string;
}

interface PersonalInfo {
  name: string;
  lastName: string;
  role: string;
  bio: string;
  age: string;
  location: string;
  level: string;
  email: string;
}

interface Skill {
  title: string;
  level: number;
  color: string;
  iconType?: string;
}

interface Achievement {
  title: string;
  desc: string;
}

const App: React.FC = () => {
  // --- States ---
  const [themeKey, setThemeKey] = useState<keyof typeof THEMES>(() => (localStorage.getItem('faisal-theme-v2') as any) || 'royal');
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  
  // --- Editable Content States ---
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(() => {
    const saved = localStorage.getItem('faisal-personal-info');
    return saved ? JSON.parse(saved) : {
      name: 'فيصل',
      lastName: 'نبيل السلمي',
      role: 'مهندس المستقبل 🏗️',
      bio: 'أنا فيصل، طالب شغوف بالعلم والابتكار، أسعى دائماً لتطوير مهاراتي في شتى المجالات. أؤمن بأن كل إنجاز يبدأ بخطوة، وأن النجاح هو ثمرة الجد والمثابرة.',
      age: '13 عاماً',
      location: 'المملكة العربية السعودية',
      level: 'الأول المتوسط',
      email: 'faisal.nabil@example.com'
    };
  });

  const [skills, setSkills] = useState<Skill[]>(() => {
    const saved = localStorage.getItem('faisal-skills');
    return saved ? JSON.parse(saved) : [
      { title: 'الإلقاء والخطابة', level: 95, color: 'bg-amber-500', iconType: 'mic' },
      { title: 'التفكير الإبداعي', level: 90, color: 'bg-slate-800', iconType: 'brain' },
      { title: 'القيادة الطلابية', level: 85, color: 'bg-slate-700', iconType: 'crown' },
      { title: 'استخدام التقنية', level: 80, color: 'bg-slate-900', iconType: 'monitor' }
    ];
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('faisal-achievements');
    return saved ? JSON.parse(saved) : [
      { title: 'بطل الإلقاء على مستوى المدرسة', desc: 'المركز الأول في مسابقة الإلقاء والخطابة المدرسية، بفضل التمكن من لغة الجسد ونبرة الصوت المؤثرة.' },
      { title: 'شهادة التفوق الدراسي', desc: 'الحصول على المركز الأول في الفصل الدراسي بتقدير ممتاز في كافة المواد الدراسية.' },
      { title: 'قائد النادي الإبداعي', desc: 'إدارة وتوجيه مبادرات طلابية مبتكرة تهدف لتحسين البيئة المدرسية وتحفيز الزملاء.' }
    ];
  });

  const [messages, setMessages] = useState<GuestMessage[]>(() => {
    const saved = localStorage.getItem('faisal-guestbook-v5');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [formData, setFormData] = useState({ name: '', age: '', role: '', content: '' });

  const currentTheme = THEMES[themeKey];

  // --- Effects ---
  useEffect(() => {
    const savedCount = localStorage.getItem('faisal-visitor-count-v2');
    const currentCount = savedCount ? parseInt(savedCount) : 0; 
    const newCount = currentCount + 1;
    setVisitorCount(newCount);
    localStorage.setItem('faisal-visitor-count-v2', newCount.toString());

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ['home', 'about', 'skills', 'achievements', 'vision', 'contact'];
      let current = 'home';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) current = section;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    localStorage.setItem('faisal-theme-v2', themeKey);
    localStorage.setItem('faisal-guestbook-v5', JSON.stringify(messages));
    localStorage.setItem('faisal-personal-info', JSON.stringify(personalInfo));
    localStorage.setItem('faisal-skills', JSON.stringify(skills));
    localStorage.setItem('faisal-achievements', JSON.stringify(achievements));
  }, [themeKey, messages, personalInfo, skills, achievements]);

  // --- Handlers ---
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 90, behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.content.trim()) {
      const newMessage: GuestMessage = {
        ...formData,
        timestamp: new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      };
      setMessages([newMessage, ...messages]);
      setFormData({ name: '', age: '', role: '', content: '' });
      scrollToSection('contact');
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'admin123') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword('');
      alert('تم الدخول بنجاح! يمكنك الآن تعديل المحتوى مباشرة.');
    } else {
      alert('كلمة المرور خاطئة');
    }
  };

  const deleteMessage = (index: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
      const newMessages = [...messages];
      newMessages.splice(index, 1);
      setMessages(newMessages);
    }
  };

  const addSkill = () => {
    setSkills([...skills, { title: 'مهارة جديدة', level: 50, color: 'bg-black', iconType: 'zap' }]);
  };

  const updateSkill = (index: number, key: keyof Skill, value: any) => {
    const newSkills = [...skills];
    newSkills[index] = { ...newSkills[index], [key]: value };
    setSkills(newSkills);
  };

  const deleteSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const addAchievement = () => {
    setAchievements([...achievements, { title: 'إنجاز جديد', desc: 'وصف الإنجاز هنا...' }]);
  };

  const updateAchievement = (index: number, key: keyof Achievement, value: string) => {
    const newAchievements = [...achievements];
    newAchievements[index] = { ...newAchievements[index], [key]: value };
    setAchievements(newAchievements);
  };

  const deleteAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: <Rocket size={18}/> },
    { id: 'about', label: 'من أنا', icon: <User size={18}/> },
    { id: 'skills', label: 'مهاراتي', icon: <Zap size={18}/> },
    { id: 'achievements', label: 'إنجازاتي', icon: <Trophy size={18}/> },
    { id: 'vision', label: 'طموحاتي', icon: <Target size={18}/> },
    { id: 'contact', label: 'تواصل معي', icon: <Mail size={18}/> }
  ];

  const renderSkillIcon = (iconType?: string) => {
    switch(iconType) {
      case 'mic': return <Mic size={28} />;
      case 'brain': return <Brain size={28} />;
      case 'crown': return <Crown size={28} />;
      case 'monitor': return <Monitor size={28} />;
      default: return <Zap size={28} />;
    }
  };

  return (
    <div className={`min-h-screen ${currentTheme.light} transition-colors duration-500 text-right font-['Cairo']`} dir="rtl">
      
      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
          <div className="bg-white rounded-[2rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <Lock className="text-amber-500" /> دخول الإدارة
              </h3>
              <button onClick={() => setShowAdminLogin(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <X />
              </button>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input 
                type="password" 
                placeholder="أدخل كلمة المرور"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-400 outline-none font-bold"
              />
              <button className={`w-full py-4 rounded-xl ${currentTheme.primary} text-white font-black shadow-lg hover:scale-105 transition-all`}>
                تأكيد الدخول
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Admin Floating Banner */}
      {isAdmin && (
        <div className="fixed top-0 left-0 right-0 z-[150] bg-amber-500 text-slate-900 py-2 text-center font-black flex items-center justify-center gap-4 shadow-xl">
          <Settings className="animate-spin-slow" size={18} />
          وضع التعديل نشط - يمكنك تغيير أي نص مباشرة
          <button onClick={() => setIsAdmin(false)} className="bg-slate-900 text-white px-4 py-1 rounded-full text-xs hover:bg-slate-800 transition-all">إغلاق الإدارة</button>
        </div>
      )}

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isAdmin ? 'mt-10' : ''} ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg h-20' : 'bg-transparent h-24'}`}>
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => scrollToSection('home')}>
            <div className={`w-12 h-12 ${currentTheme.primary} rounded-xl flex items-center justify-center text-white shadow-xl transform group-hover:rotate-12 transition-transform`}>
              <PrivatelyLabelIcon icon={GraduationCap} size={28} />
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-black ${scrolled ? 'text-black' : 'text-slate-900'} leading-none`}>{personalInfo.name} {personalInfo.lastName}</span>
              <span className={`text-xs font-bold ${currentTheme.accent} mt-1`}>ملف إنجاز رقمي</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-1">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-slate-500 ml-4 font-bold text-xs border border-slate-200">
               <Eye size={14} className={currentTheme.accent} />
               <span>الزوار: {visitorCount.toLocaleString()}</span>
            </div>
            {navItems.map((item) => (
              <button 
                key={item.id} 
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${activeSection === item.id ? `${currentTheme.primary} text-white shadow-md` : 'text-slate-600 hover:bg-white/50'}`}
              >
                {item.label}
              </button>
            ))}
            <div className="h-6 w-px bg-slate-200 mx-4"></div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowAdminLogin(true)}
                title="لوحة التحكم"
                className="flex items-center justify-center w-10 h-10 bg-black text-white rounded-xl font-black hover:bg-slate-800 transition-all shadow-md ml-2"
              >
                <ShieldCheck size={20} className="text-amber-500" />
              </button>
              {Object.keys(THEMES).map((k) => (
                <button 
                  key={k} 
                  title={k}
                  onClick={() => setThemeKey(k as any)}
                  className={`w-6 h-6 rounded-full border-2 border-white shadow-sm ${THEMES[k as keyof typeof THEMES].primary} ${themeKey === k ? 'ring-2 ring-slate-400 ring-offset-2' : ''}`}
                />
              ))}
            </div>
          </div>

          <button className="lg:hidden p-2 text-slate-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[90] bg-white pt-24 px-6 lg:hidden animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col gap-4 text-center">
            <div className="flex items-center justify-center gap-2 p-4 bg-slate-50 rounded-2xl mb-4 font-bold text-slate-600">
               <Users size={20} className={currentTheme.accent} />
               <span>الزوار: {visitorCount.toLocaleString()}</span>
            </div>
            {navItems.map((item) => (
              <button 
                key={item.id} 
                onClick={() => scrollToSection(item.id)}
                className="text-2xl font-black text-slate-800 py-4 border-b border-slate-100 w-full"
              >
                {item.label}
              </button>
            ))}
            <button 
              onClick={() => { setShowAdminLogin(true); setIsMenuOpen(false); }}
              title="لوحة التحكم"
              className="mt-6 flex items-center justify-center w-16 h-16 mx-auto bg-black text-white rounded-[1.5rem] shadow-xl active:scale-95 transition-all"
            >
              <Settings size={28} className="text-amber-500" />
            </button>
          </div>
        </div>
      )}

      <main>
        {/* Hero Section */}
        <section id="home" className={`min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br ${currentTheme.gradient} scroll-mt-24`}>
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10 w-full text-white">
            <div className="space-y-8 animate-in fade-in slide-in-from-right-10 duration-1000">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 animate-bounce">
                <Sparkles size={20} className="text-yellow-400" />
                <span className="font-bold text-sm tracking-wide">مرحباً بكم في عالمي الرقمي الأسود</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tighter">
                {isAdmin ? (
                  <div className="flex gap-4">
                    <input value={personalInfo.name} onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})} className="bg-transparent border-b-2 border-amber-400 focus:outline-none w-1/2" />
                    <input value={personalInfo.lastName} onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})} className="bg-transparent border-b-2 border-amber-400 focus:outline-none w-1/2 text-transparent bg-clip-text bg-gradient-to-l from-amber-400 to-yellow-200" />
                  </div>
                ) : (
                  <> {personalInfo.name} <span className="text-transparent bg-clip-text bg-gradient-to-l from-amber-400 to-yellow-200">{personalInfo.lastName}</span></>
                )}
              </h1>
              {isAdmin ? (
                <textarea 
                  value={personalInfo.bio} 
                  onChange={(e) => setPersonalInfo({...personalInfo, bio: e.target.value})}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 w-full h-32 focus:outline-none text-xl text-white"
                />
              ) : (
                <p className="text-xl md:text-2xl font-medium text-white/80 leading-relaxed max-w-2xl">
                  {personalInfo.bio}
                </p>
              )}
              <div className="flex flex-wrap gap-4 pt-4">
                <button onClick={() => scrollToSection('about')} className="px-10 py-4 rounded-2xl bg-white text-black font-black text-lg shadow-2xl hover:scale-105 transition-all flex items-center gap-3">
                  تعرف عليّ <ChevronLeft />
                </button>
                <button onClick={() => scrollToSection('contact')} className="px-10 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 font-black text-lg hover:bg-white/20 transition-all">
                  سجل الزوار
                </button>
              </div>
            </div>
            <div className="hidden lg:flex justify-center animate-in fade-in zoom-in duration-1000 delay-200">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-400 rounded-[4rem] rotate-6 opacity-20 blur-2xl"></div>
                <div className="relative w-80 h-[28rem] bg-black/40 backdrop-blur-2xl rounded-[4rem] border-4 border-white/30 flex items-center justify-center overflow-hidden shadow-2xl">
                   <User size={160} className="text-white opacity-20" />
                   <div className="absolute bottom-10 left-0 right-0 text-center px-6">
                    <p className="text-white font-black text-2xl mb-2">{personalInfo.name}</p>
                    {isAdmin ? (
                      <input value={personalInfo.role} onChange={(e) => setPersonalInfo({...personalInfo, role: e.target.value})} className="bg-transparent border-b border-white/30 text-center w-full focus:outline-none text-white" />
                    ) : (
                      <p className="text-white/60 text-sm font-bold tracking-widest">{personalInfo.role}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-32 bg-white scroll-mt-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="order-2 lg:order-1 space-y-8">
                <h2 className={`text-5xl font-black ${currentTheme.text}`}>نبذة شخصية 👤</h2>
                <div className="w-20 h-2 bg-black rounded-full"></div>
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    { label: 'العمر', key: 'age', icon: <Calendar /> },
                    { label: 'المكان', key: 'location', icon: <MapPin /> },
                    { label: 'المرحلة', key: 'level', icon: <GraduationCap /> },
                    { label: 'البريد', key: 'email', icon: <Mail /> }
                  ].map((info, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-black transition-colors">
                      <div className={`w-12 h-12 rounded-xl ${currentTheme.primary} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        {React.cloneElement(info.icon as any, { size: 22 })}
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-400 text-xs font-bold">{info.label}</p>
                        {isAdmin ? (
                          <input 
                            value={(personalInfo as any)[info.key]} 
                            onChange={(e) => setPersonalInfo({...personalInfo, [info.key]: e.target.value})}
                            className="bg-white border border-slate-200 rounded px-2 w-full focus:outline-none text-black font-black"
                          />
                        ) : (
                          <p className="text-black font-black">{(personalInfo as any)[info.key]}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="bg-slate-100 rounded-[3rem] p-10 relative">
                   <Quote className={`absolute -top-6 -right-6 text-black opacity-10`} size={100} />
                   <div className="space-y-6 relative z-10">
                      <h3 className="text-3xl font-black text-black">قيمي ومبادئي</h3>
                      <ul className="space-y-4">
                        {['الصدق والأمانة في طلب العلم.', 'السعي للتميز لا للمنافسة فقط.', 'خدمة ديني ووطني بمهاراتي.', 'الاحترام والتعاون مع الجميع.'].map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-lg font-bold text-slate-800">
                            <ChevronUp className="text-black rotate-90 md:rotate-0" size={24} />
                            {item}
                          </li>
                        ))}
                      </ul>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className={`py-32 ${currentTheme.light} scroll-mt-24`}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20 space-y-4">
              <h2 className={`text-5xl font-black ${currentTheme.text}`}>مهاراتي وقدراتي ✨</h2>
              <p className="text-xl font-bold text-slate-500 max-w-2xl mx-auto">أعمل باستمرار على صقل مهاراتي التقنية والشخصية لأكون فرداً فعالاً في المجتمع.</p>
              {isAdmin && (
                <button onClick={addSkill} className="mt-4 bg-black text-white px-6 py-2 rounded-full font-black flex items-center gap-2 mx-auto hover:bg-slate-800 shadow-lg">
                  <Plus size={18} /> إضافة مهارة
                </button>
              )}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {skills.map((skill, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-white hover:shadow-2xl transition-all group relative">
                  {isAdmin && (
                    <button onClick={() => deleteSkill(i)} className="absolute top-4 left-4 p-2 bg-rose-100 text-rose-500 rounded-full hover:bg-rose-500 hover:text-white transition-all">
                      <Trash2 size={16} />
                    </button>
                  )}
                  <div className={`w-16 h-16 rounded-2xl ${skill.color} text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    {renderSkillIcon(skill.iconType)}
                  </div>
                  {isAdmin ? (
                    <div className="space-y-3">
                      <input 
                        value={skill.title} 
                        onChange={(e) => updateSkill(i, 'title', e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded-xl font-black focus:outline-none"
                      />
                      <div className="flex items-center gap-2">
                        <input 
                          type="range" value={skill.level} min="0" max="100"
                          onChange={(e) => updateSkill(i, 'level', parseInt(e.target.value))}
                          className="flex-1 accent-black"
                        />
                        <span className="text-xs font-black">{skill.level}%</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl font-black text-black mb-4">{skill.title}</h3>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
                        <div className={`h-full ${skill.color} transition-all duration-1000`} style={{ width: `${skill.level}%` }}></div>
                      </div>
                      <p className="text-right text-xs font-black text-slate-400">{skill.level}% مستوى التمكن</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section id="achievements" className="py-32 bg-white scroll-mt-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-20 space-y-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className={`text-5xl font-black ${currentTheme.text}`}>سجل الإنجازات 🏆</h2>
                <p className="text-xl font-bold text-slate-500">لحظات فخر واعتزاز في مسيرتي التعليمية</p>
              </div>
              {isAdmin && (
                <button onClick={addAchievement} className="mt-4 bg-black text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-slate-800 shadow-xl self-start">
                  <Plus /> إضافة إنجاز
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {achievements.map((item, i) => (
                <div key={i} className="group relative bg-slate-50 rounded-[3rem] p-10 overflow-hidden border border-slate-100 hover:bg-white hover:shadow-2xl transition-all">
                  {isAdmin && (
                    <button onClick={() => deleteAchievement(i)} className="absolute top-6 left-6 z-20 p-2 bg-rose-100 text-rose-500 rounded-full hover:bg-rose-500 hover:text-white transition-all">
                      <Trash2 size={18} />
                    </button>
                  )}
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-150 transition-transform">
                    <Medal size={120} className="text-black" />
                  </div>
                  <div className="relative z-10 space-y-6">
                    {isAdmin ? (
                      <div className="space-y-4">
                        <input 
                          value={item.title} 
                          onChange={(e) => updateAchievement(i, 'title', e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded-xl font-black focus:outline-none"
                        />
                        <textarea 
                          value={item.desc} 
                          onChange={(e) => updateAchievement(i, 'desc', e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded-xl h-24 focus:outline-none text-slate-600"
                        />
                      </div>
                    ) : (
                      <>
                        <h3 className="text-2xl font-black text-black group-hover:text-amber-600 transition-colors leading-tight">{item.title}</h3>
                        <p className="text-slate-600 font-bold leading-relaxed">{item.desc}</p>
                      </>
                    )}
                    <div className="flex items-center gap-2 text-sm font-black text-slate-400 group-hover:text-black transition-colors">
                      إنجاز متميز <ExternalLink size={14} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section id="vision" className={`py-32 bg-gradient-to-br ${currentTheme.gradient} text-white relative overflow-hidden scroll-mt-24`}>
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="max-w-4xl">
              <h2 className="text-5xl md:text-7xl font-black mb-12">رؤيتي للمستقبل 🚀</h2>
              <div className="grid md:grid-cols-2 gap-12">
                <div className="bg-white/10 backdrop-blur-xl p-10 rounded-[3rem] border border-white/20">
                  <Lightbulb className="text-amber-400 mb-6" size={48} />
                  <h3 className="text-3xl font-black mb-6 text-white">حلم الهندسة 🏗️</h3>
                  <p className="text-xl font-medium leading-relaxed opacity-90">
                    أطمح للالتحاق بأعرق كليات الهندسة، لأساهم في تصميم مشاريع وطنية عملاقة تدعم رؤية المملكة 2030.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-xl p-10 rounded-[3rem] border border-white/20">
                  <Target className="text-blue-400 mb-6" size={48} />
                  <h3 className="text-3xl font-black mb-6 text-white">تطوير الذات 📚</h3>
                  <p className="text-xl font-medium leading-relaxed opacity-90">
                    أسعى لتعلم اللغات الحية وتقنيات البرمجة والذكاء الاصطناعي، لأكون مهندساً يجمع بين المهارة والقيادة.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact & Guestbook */}
        <section id="contact" className="py-32 bg-white scroll-mt-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-20">
              <div className="space-y-10">
                <div className="space-y-4">
                  <h2 className={`text-5xl font-black ${currentTheme.text}`}>سجل الزوار 📝</h2>
                  <p className="text-xl font-bold text-slate-500 leading-relaxed">يسعدني استقبال رسائلكم التشجيعية. سيتم عرض رسالتك فور إرسالها!</p>
                </div>
                
                <div className="space-y-6">
                   <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="text-black" size={28} />
                        <h3 className="text-2xl font-black text-black">الرسائل الواردة ({messages.length})</h3>
                      </div>
                   </div>
                   <div className="max-h-[500px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                     {messages.length === 0 ? (
                       <div className="p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center text-slate-400 font-bold">
                         لا توجد رسائل بعد.. كن أول من يكتب كلمة طيبة!
                       </div>
                     ) : (
                       messages.map((msg, idx) => (
                         <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm animate-in slide-in-from-top-4 relative group">
                           {isAdmin && (
                             <button onClick={() => deleteMessage(idx)} className="absolute top-4 left-4 p-2 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 size={16} />
                             </button>
                           )}
                           <div className="flex justify-between items-start mb-2">
                             <div>
                               <span className="font-black text-black text-lg">{msg.name}</span>
                               <span className="text-xs font-bold text-slate-400 mr-2">({msg.age} عاماً - {msg.role})</span>
                             </div>
                             <Star className="text-amber-400 fill-amber-400" size={16} />
                           </div>
                           <p className="text-slate-600 font-bold leading-relaxed">{msg.content}</p>
                           <p className="text-[10px] text-slate-400 mt-3 font-bold">{msg.timestamp}</p>
                         </div>
                       ))
                     )}
                   </div>
                </div>
              </div>

              <form 
                className="bg-slate-50 p-10 md:p-14 rounded-[4rem] border border-slate-100 shadow-xl space-y-6 self-start sticky top-28" 
                onSubmit={handleSendMessage}
              >
                <h3 className="text-2xl font-black text-black mb-8 flex items-center gap-3">
                   اترك كلمة طيبة <Send size={24} className="text-black" />
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-500 mr-2">الاسم</label>
                    <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-4 rounded-2xl bg-white border border-slate-200 focus:ring-4 focus:ring-black/10 outline-none transition-all font-bold text-black" placeholder="اسمك" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-500 mr-2">العمر</label>
                    <input required type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className="w-full p-4 rounded-2xl bg-white border border-slate-200 focus:ring-4 focus:ring-black/10 outline-none transition-all font-bold text-black" placeholder="عمرك" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-black text-slate-500 mr-2">الصفة</label>
                    <input type="text" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full p-4 rounded-2xl bg-white border border-slate-200 focus:ring-4 focus:ring-black/10 outline-none transition-all font-bold text-black" placeholder="معلم، زميل، زائر..." />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-500 mr-2">رسالتك</label>
                  <textarea required rows={4} value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className="w-full p-4 rounded-2xl bg-white border border-slate-200 focus:ring-4 focus:ring-black/10 outline-none transition-all font-bold text-black" placeholder="اكتب كلمة تشجيعية هنا..."></textarea>
                </div>
                <button type="submit" className={`w-full py-5 rounded-2xl bg-black text-white font-black text-xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3`}>
                  إرسال الكلمة <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-black text-white py-20 relative">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
          <div className="flex flex-col items-center gap-4">
            <div className={`w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white shadow-2xl border border-white/20`}>
              <GraduationCap size={32} />
            </div>
            <h4 className="text-3xl font-black">{personalInfo.name} {personalInfo.lastName}</h4>
            <p className="text-slate-400 font-bold">{personalInfo.role}</p>
            <div className="flex items-center gap-2 mt-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-white/60 text-xs">
              <Users size={14} />
              <span>إجمالي الزيارات: {visitorCount.toLocaleString()}</span>
            </div>
            <button 
              onClick={() => setShowAdminLogin(true)} 
              title="دخول لوحة التحكم"
              className="mt-6 flex items-center justify-center w-12 h-12 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition-all text-white"
            >
               <Settings size={22} className="text-amber-500" />
            </button>
          </div>
          <div className="h-px bg-white/10 w-full max-w-xl mx-auto"></div>
          <p className="text-slate-500 font-bold text-sm">© {new Date().getFullYear()} جميع الحقوق محفوظة لفيصل السلمي. صنع بكل حب 🇸🇦</p>
        </div>
      </footer>

      {scrolled && (
        <button 
          onClick={() => scrollToSection('home')}
          className={`fixed bottom-10 left-10 w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center shadow-2xl z-[110] animate-in fade-in slide-in-from-bottom-6 transition-all hover:scale-110 active:scale-90 border border-white/20`}
        >
          <ChevronUp size={28} />
        </button>
      )}

    </div>
  );
};

// Simple helper to avoid duplication if needed, though not strictly required.
const PrivatelyLabelIcon = ({ icon: Icon, size }: { icon: any, size: number }) => <Icon size={size} />;

export default App;
