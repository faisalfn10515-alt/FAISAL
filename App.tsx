
import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, User, Target, Star, Mic, CheckCircle2, Zap, Menu, X, Users, Eye,
  Rocket, Medal, Brain, GraduationCap, Lightbulb, Calendar, MapPin, Mail, ExternalLink,
  ChevronUp, Send, Settings, Lock, Save, Trash2, RefreshCcw, Copy, Download, Upload,
  ChevronRight, ChevronLeft, XCircle, Timer, Crown, Monitor, ClipboardCheck, Cloud, Wifi,
  Globe, ShieldCheck, Clock, Camera, Image as ImageIcon, Loader2, Heart
} from 'lucide-react';

// Firebase SDK Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, collection, addDoc, onSnapshot, query, orderBy, 
  deleteDoc, doc, serverTimestamp, updateDoc, increment 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZ9bVqQJ4VzsbBWhMFUfBbWCNOsprA6J4",
  authDomain: "faisal-cc26e.firebaseapp.com",
  projectId: "faisal-cc26e",
  storageBucket: "faisal-cc26e.firebasestorage.app",
  messagingSenderId: "725506817533",
  appId: "1:725506817533:web:7b3a5877e46d511ccdad94",
  measurementId: "G-CFTXSCYZKE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const THEMES = {
  royal: { primary: 'bg-black', secondary: 'bg-amber-500', text: 'text-black', accent: 'text-amber-600', gradient: 'from-black via-slate-900 to-black', light: 'bg-slate-50' }
};

const DEVICE_ID_KEY = 'faisal_device_id';

const QUIZ_QUESTIONS = [
  { question: "ما هو الفريق الذي يشجعه فيصل؟", options: ["أ) الهلال", "ب) الأهلي", "ج) الاتحاد"], correct: 0 },
  { question: "ما هو عمر فيصل؟", options: ["أ) 13", "ب) 11", "ج) 12"], correct: 2 },
  { question: "ما هي مادة فيصل المفضلة؟", options: ["أ) العلوم", "ب) الرياضيات", "ج) الإنجليزية"], correct: 1 },
  { question: "من هو لاعب فيصل المفضل؟", options: ["أ) ميسي", "ب) بنزيما", "ج) نيمار"], correct: 0 },
  { question: "ما اسم أخو فيصل؟", options: ["أ) إياد", "ب) حسام", "ج) إلياس"], correct: 2 }
];

const App: React.FC = () => {
  const [themeKey] = useState<keyof typeof THEMES>('royal');
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [formData, setFormData] = useState({ name: '', age: '', role: '', content: '' });

  const [quizMode, setQuizMode] = useState<'idle' | 'playing' | 'feedback' | 'finished'>('idle');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const [deviceId] = useState(() => {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = 'dev_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  });

  const skills = [
    { title: 'الإلقاء والخطابة', level: 95, color: 'bg-amber-500', icon: <Mic size={20} /> },
    { title: 'التفكير الإبداعي', level: 90, color: 'bg-slate-800', icon: <Lightbulb size={20} /> },
    { title: 'القيادة الطلابية', level: 85, color: 'bg-slate-700', icon: <Crown size={20} /> },
    { title: 'استخدام التقنية', level: 80, color: 'bg-slate-900', icon: <Monitor size={20} /> }
  ];

  const achievements = [
    { title: 'بطل الإلقاء على مستوى المدرسة', desc: 'المركز الأول في مسابقة الإلقاء والخطابة المدرسية لعام 2024.' },
    { title: 'شهادة التفوق الدراسي', desc: 'الحصول على المركز الأول بتقدير ممتاز ودرجات كاملة.' },
    { title: 'المشاركة في الأنشطة الطلابية', desc: 'قيادة عدة مبادرات تطوعية داخل البيئة المدرسية.' },
    { title: 'شهادة ابتكار تقني', desc: 'تطوير مشروع صغير لتبسيط مادة الرياضيات لزملائي.' }
  ];

  const currentTheme = THEMES[themeKey];

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgsData);
    });

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
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.content.trim()) return;
    setIsUploading(true);
    let imageUrl = null;
    try {
      if (selectedFile) {
        const storageRef = ref(storage, `messages/${deviceId}_${Date.now()}_${selectedFile.name}`);
        const uploadResult = await uploadBytes(storageRef, selectedFile);
        imageUrl = await getDownloadURL(uploadResult.ref);
      }
      await addDoc(collection(db, "messages"), {
        ...formData,
        imageUrl,
        deviceId,
        likes: 0,
        createdAt: serverTimestamp()
      });
      setFormData({ name: '', age: '', role: '', content: '' });
      setSelectedFile(null);
      setFilePreview(null);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      alert('حدث خطأ أثناء الإرسال.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleLike = async (id: string) => {
    const messageDoc = doc(db, "messages", id);
    try {
      await updateDoc(messageDoc, { likes: increment(1) });
    } catch (err) {
      console.error("Error updating likes:", err);
    }
  };

  const handleAnswer = (idx: number) => {
    if (quizMode !== 'playing') return;
    setSelectedOption(idx);
    const correct = idx === QUIZ_QUESTIONS[currentQIndex].correct;
    setIsCorrect(correct);
    if (correct) setScore(p => p + 1);
    setQuizMode('feedback');
    setTimeout(() => {
      if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
        setCurrentQIndex(p => p + 1);
        setSelectedOption(null);
        setIsCorrect(null);
        setQuizMode('playing');
      } else {
        setQuizMode('finished');
      }
    }, 1200);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const navLinks = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'about', label: 'عني' },
    { id: 'skills', label: 'مهاراتي' },
    { id: 'achievements', label: 'إنجازاتي' },
    { id: 'quiz', label: 'تحدي' },
    { id: 'contact', label: 'سجل الزوار' }
  ];

  return (
    <div className={`min-h-screen ${currentTheme.light} text-right font-['Cairo']`} dir="rtl">
      
      {/* Admin Bar */}
      {isAdmin && (
        <div className="fixed top-0 left-0 right-0 z-[150] bg-amber-500 text-slate-900 h-12 flex items-center justify-center gap-4 shadow-xl font-black text-sm">
          <ShieldCheck size={16} /> إدارة المحتوى
          <button onClick={() => setIsAdmin(false)} className="bg-black text-white px-3 py-1 rounded-full text-xs mr-auto ml-4">خروج</button>
        </div>
      )}

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all ${isAdmin ? 'mt-12' : ''} ${scrolled ? 'bg-white/95 shadow-md h-16' : 'bg-transparent h-20'}`}>
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          
          {/* Mobile Menu Button - Styled as per User Screenshot */}
          <div className="lg:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className={`relative p-3 rounded-full border-2 transition-all ${!scrolled ? 'border-blue-400/50 text-white hover:bg-white/10' : 'border-slate-200 text-slate-900 hover:bg-slate-100'}`}
              aria-label="القائمة"
            >
              <div className={`absolute inset-0 rounded-full border-2 border-blue-400 opacity-50 blur-[2px] ${!scrolled ? 'block' : 'hidden'}`}></div>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map(link => (
              <button 
                key={link.id} 
                onClick={() => scrollToSection(link.id)} 
                className={`px-4 py-1 rounded-md font-bold text-sm transition-all ${activeSection === link.id ? `${currentTheme.primary} text-white shadow-md` : (!scrolled ? 'text-white/70 hover:text-white' : 'text-slate-600 hover:bg-slate-50')}`}
              >
                {link.label}
              </button>
            ))}
            <button onClick={() => setShowAdminLogin(true)} className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-lg ml-2 shadow-lg hover:scale-110 transition-transform"><Lock size={14}/></button>
          </div>

          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('home')}>
            <div className={`w-10 h-10 ${currentTheme.primary} rounded-lg flex items-center justify-center text-white shadow-lg`}><GraduationCap /></div>
            <span className={`text-lg font-black ${!scrolled ? 'text-white' : 'text-slate-900'}`}>فيصل نبيل السلمي</span>
          </div>
        </div>

        {/* Mobile Menu Overlay - ADDED TO FIX THE ISSUE */}
        <div 
          className={`fixed inset-0 bg-black/60 backdrop-blur-md z-[90] lg:hidden transition-all duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsMenuOpen(false)}
        >
          <div 
            className={`absolute top-0 right-0 w-[80%] h-full bg-white shadow-2xl p-10 flex flex-col gap-6 transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-10 border-b pb-6">
              <span className="text-2xl font-black text-slate-900">القائمة</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-slate-100 rounded-xl"><X /></button>
            </div>
            {navLinks.map(link => (
              <button 
                key={link.id} 
                onClick={() => scrollToSection(link.id)} 
                className={`w-full text-right p-4 rounded-2xl font-black text-xl transition-all ${activeSection === link.id ? 'bg-amber-400 text-black shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {link.label}
              </button>
            ))}
            <div className="mt-auto pt-10 border-t flex items-center justify-between">
               <button onClick={() => { setIsMenuOpen(false); setShowAdminLogin(true); }} className="flex items-center gap-2 font-black text-slate-400"><Lock size={16}/> دخول المسؤول</button>
               <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white"><GraduationCap size={20}/></div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className={`min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br ${currentTheme.gradient} text-white pt-20`}>
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center w-full z-10">
          <div className="space-y-6 lg:text-right text-center">
            <h1 className="text-6xl md:text-8xl font-black leading-tight">أنا فيصل <br/><span className="text-amber-400">نبيل السلمي</span></h1>
            <p className="text-lg md:text-2xl opacity-80 leading-relaxed max-w-xl mx-auto lg:mx-0">طالب شغوف بالعلم والابتكار، أسعى دائماً لتطوير مهاراتي في شتى المجالات. أؤمن بأن كل إنجاز يبدأ بخطوة.</p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
              <button onClick={() => scrollToSection('contact')} className="bg-amber-400 text-black px-10 py-4 rounded-2xl font-black hover:scale-105 transition-all shadow-2xl flex items-center gap-2 order-1 lg:order-2">تواصل معي ✨</button>
              <button onClick={() => scrollToSection('about')} className="bg-white text-black px-10 py-4 rounded-2xl font-black hover:scale-105 transition-all shadow-2xl flex items-center gap-2 order-2 lg:order-1">استكشاف الملف 🚀</button>
            </div>
          </div>
          <div className="hidden lg:flex justify-center">
            <div className="w-72 h-96 bg-white/10 backdrop-blur-xl border-4 border-white/20 rounded-[4rem] flex items-center justify-center shadow-2xl relative">
               <div className="absolute -top-6 -right-6 w-20 h-20 bg-amber-400 rounded-full flex items-center justify-center text-black shadow-xl animate-bounce"><Star fill="black" /></div>
              <User size={140} className="opacity-30" />
            </div>
          </div>
        </div>
      </section>

      {/* Rest of the sections remain same... (About, Skills, Achievements, Quiz, Contact, Footer) */}
      <section id="about" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-slate-900">البطاقة الشخصية 👤</h2>
            <div className="w-24 h-2 bg-amber-400 mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-slate-50 rounded-[2.5rem] flex items-center gap-6 border-2 border-slate-100 hover:border-amber-400 transition-colors">
                <div className={`w-16 h-16 rounded-2xl ${currentTheme.primary} text-white flex items-center justify-center shadow-xl`}><Calendar /></div>
                <div><p className="text-sm font-bold text-slate-400">العمر</p><p className="text-2xl font-black text-slate-800">12 عاماً</p></div>
            </div>
            <div className="p-8 bg-slate-50 rounded-[2.5rem] flex items-center gap-6 border-2 border-slate-100 hover:border-amber-400 transition-colors">
                <div className={`w-16 h-16 rounded-2xl ${currentTheme.primary} text-white flex items-center justify-center shadow-xl`}><GraduationCap /></div>
                <div><p className="text-sm font-bold text-slate-400">المرحلة الدراسية</p><p className="text-2xl font-black text-slate-800">الأول المتوسط</p></div>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="py-24 bg-slate-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-black mb-16">مهاراتي المتميزة ✨</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {skills.map((s, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[3rem] shadow-sm border border-white hover:-translate-y-3 transition-all">
                <div className={`w-14 h-14 rounded-2xl ${s.color} text-white flex items-center justify-center mb-6 shadow-xl mx-auto`}>{s.icon}</div>
                <h3 className="text-xl font-black mb-4 text-slate-800">{s.title}</h3>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                   <div className={`h-full ${s.color} transition-all duration-1000 shadow-sm`} style={{width: `${s.level}%`}}></div>
                </div>
                <p className="text-sm font-black text-slate-400">{s.level}%</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="achievements" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-black mb-16 text-center">إنجازاتي الطموحة 🏆</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {achievements.map((ach, idx) => (
              <div key={idx} className="bg-slate-900 text-white p-10 rounded-[3.5rem] flex gap-8 items-start relative overflow-hidden group hover:scale-[1.02] transition-transform">
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
          <div className="bg-slate-900 text-white rounded-[4rem] p-12 shadow-2xl relative border-x-[12px] border-amber-400">
            {quizMode === 'idle' && (
              <div className="text-center space-y-8 py-10">
                <Brain size={100} className="mx-auto text-amber-400 animate-pulse" />
                <h2 className="text-4xl font-black">تحدي معلومات فيصل 🎮</h2>
                <button onClick={() => setQuizMode('playing')} className="bg-amber-400 text-black px-16 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all">ابدأ التحدي</button>
              </div>
            )}
            {quizMode === 'playing' && (
              <div className="space-y-8">
                <h3 className="text-3xl font-black min-h-[100px]">{QUIZ_QUESTIONS[currentQIndex].question}</h3>
                <div className="grid gap-4">
                  {QUIZ_QUESTIONS[currentQIndex].options.map((o, idx) => (
                    <button key={idx} onClick={() => handleAnswer(idx)} className="p-6 text-right rounded-2xl font-bold text-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {quizMode === 'feedback' && <div className="text-center py-20 text-4xl font-black">{isCorrect ? 'إجابة صحيحة! 👏' : 'إجابة خاطئة! 💔'}</div>}
            {quizMode === 'finished' && (
              <div className="text-center space-y-8 py-10">
                <Trophy size={120} className="mx-auto text-amber-500" />
                <h2 className="text-5xl font-black">النتيجة: {score} من 5</h2>
                <button onClick={() => {setQuizMode('idle'); setScore(0); setCurrentQIndex(0);}} className="bg-white text-black px-12 py-4 rounded-xl font-black">إعادة المحاولة</button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
           <h2 className="text-5xl font-black text-slate-900 text-center mb-16">سجل الزوار 📝</h2>
           <div className="grid lg:grid-cols-5 gap-10">
              <div className="lg:col-span-2">
                 <div className="bg-slate-50 p-8 rounded-[3rem] border-2 border-slate-100 shadow-sm">
                    <form onSubmit={handleSendMessage} className="space-y-4">
                       <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="الاسم" className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-bold focus:ring-2 ring-amber-400 outline-none" required />
                       <textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="اترك رسالتك..." rows={3} className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-bold focus:ring-2 ring-amber-400 outline-none" required />
                       <button disabled={isUploading} className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black text-xl hover:bg-black transition-all shadow-lg">إرسال</button>
                    </form>
                 </div>
              </div>
              <div className="lg:col-span-3 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar p-2">
                 {messages.map((m) => (
                    <div key={m.id} className="p-6 rounded-[2rem] border bg-white shadow-sm">
                       <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black">{m.name.charAt(0)}</div>
                          <h4 className="font-black text-slate-900">{m.name}</h4>
                       </div>
                       <p className="text-slate-700 font-bold mb-4">{m.content}</p>
                       <button onClick={() => handleLike(m.id)} className="flex items-center gap-2 text-rose-500 font-black text-sm"><Heart size={16} fill={m.likes > 0 ? "currentColor" : "none"} /> {m.likes || 0}</button>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-white py-20 text-center">
         <div className="w-16 h-16 bg-amber-400 text-black mx-auto rounded-2xl flex items-center justify-center font-black text-3xl mb-6">ف</div>
         <p className="text-2xl font-black">فيصل نبيل السلمي</p>
         <p className="opacity-20 mt-10">جميع الحقوق محفوظة © {new Date().getFullYear()}</p>
      </footer>

      {saveStatus === 'saved' && (
        <div className="fixed top-24 right-8 z-[300] bg-green-500 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-2xl flex items-center gap-3">
          <CheckCircle2 size={18} /> تم الإرسال بنجاح
        </div>
      )}

      {showAdminLogin && (
        <div className="fixed inset-0 z-[250] bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-[2rem] max-w-sm w-full shadow-2xl">
            <h3 className="text-2xl font-black mb-6 text-center">دخول المسؤول 🔐</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              if(adminPassword === 'FAISAL.2013') { setIsAdmin(true); setShowAdminLogin(false); setAdminPassword(''); }
              else alert('كلمة مرور غير صحيحة');
            }} className="space-y-4">
              <input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} className="w-full p-4 bg-slate-100 rounded-xl font-bold outline-none ring-amber-400 focus:ring-2" placeholder="كلمة المرور" />
              <button type="submit" className="w-full bg-black text-white p-4 rounded-xl font-black">دخول</button>
              <button type="button" onClick={() => setShowAdminLogin(false)} className="w-full bg-slate-100 p-4 rounded-xl font-black mt-2">إلغاء</button>
            </form>
          </div>
        </div>
      )}
      
      <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className={`fixed bottom-8 left-8 p-4 bg-black text-white rounded-full shadow-2xl z-[150] transition-all hover:scale-110 ${scrolled ? 'opacity-100' : 'opacity-0'}`}>
        <ChevronUp />
      </button>
    </div>
  );
};

export default App;
