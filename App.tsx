
import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, User, Target, Star, Mic, CheckCircle2, Zap, Menu, X, Users, Eye,
  Rocket, Medal, Brain, GraduationCap, Lightbulb, Calendar, MapPin, Mail, ExternalLink,
  ChevronUp, Send, Settings, Lock, Save, Trash2, RefreshCcw, Copy, Download, Upload,
  ChevronRight, ChevronLeft, XCircle, Timer, Crown, Monitor, ClipboardCheck, Cloud, Wifi,
  Globe, ShieldCheck, Clock, Camera, Image as ImageIcon, Loader2, Heart, Plus, Edit3
} from 'lucide-react';

// Firebase SDK Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, collection, addDoc, onSnapshot, query, orderBy, 
  deleteDoc, doc, serverTimestamp, updateDoc, increment, setDoc, getDoc 
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

  // Dynamic CMS States
  const [siteData, setSiteData] = useState({
    heroTitle: "أنا فيصل نبيل السلمي",
    heroDesc: "طالب شغوف بالعلم والابتكار، أسعى دائماً لتطوير مهاراتي في شتى المجالات. أؤمن بأن كل إنجاز يبدأ بخطوة.",
    aboutAge: "12 عاماً",
    aboutStage: "الأول المتوسط",
    profileImageUrl: ""
  });
  
  // Optimistic UI state for profile image - ensures fast feedback
  const [localProfilePreview, setLocalProfilePreview] = useState<string | null>(null);

  const [skills, setSkills] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);

  // Admin Edit Modal State
  const [editTarget, setEditTarget] = useState<{type: 'skill' | 'achievement' | 'site', data?: any} | null>(null);

  const [quizMode, setQuizMode] = useState<'idle' | 'playing' | 'feedback' | 'finished'>('idle');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const profileInputRef = useRef<HTMLInputElement>(null);

  const [deviceId] = useState(() => {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = 'dev_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  });

  const currentTheme = THEMES[themeKey];

  useEffect(() => {
    // Sync Messages
    const qMessages = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubMessages = onSnapshot(qMessages, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Sync Skills
    const qSkills = query(collection(db, "skills"), orderBy("level", "desc"));
    const unsubSkills = onSnapshot(qSkills, (snapshot) => {
      if (!snapshot.empty) {
        setSkills(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else {
        setSkills([
          { title: 'الإلقاء والخطابة', level: 95 },
          { title: 'التفكير الإبداعي', level: 90 },
          { title: 'القيادة الطلابية', level: 85 },
          { title: 'استخدام التقنية', level: 80 }
        ]);
      }
    });

    // Sync Achievements
    const qAchievements = query(collection(db, "achievements"), orderBy("createdAt", "desc"));
    const unsubAchievements = onSnapshot(qAchievements, (snapshot) => {
      if (!snapshot.empty) {
        setAchievements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else {
        setAchievements([
          { title: 'بطل الإلقاء على مستوى المدرسة', desc: 'المركز الأول في مسابقة الإلقاء والخطابة المدرسية لعام 2024.' },
          { title: 'شهادة التفوق الدراسي', desc: 'الحصول على المركز الأول بتقدير ممتاز ودرجات كاملة.' }
        ]);
      }
    });

    // Sync Site Config
    const unsubConfig = onSnapshot(doc(db, "config", "site"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSiteData(prev => ({ ...prev, ...data }));
        // Only clear local preview if the remote data matches the intended state
        setLocalProfilePreview(null);
      }
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
      unsubMessages();
      unsubSkills();
      unsubAchievements();
      unsubConfig();
    };
  }, []);

  const handleProfileImageClick = () => {
    if (isAdmin) {
      profileInputRef.current?.click();
    }
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // STEP 1: OPTIMISTIC UPDATE (Instant feedback)
      const previewUrl = URL.createObjectURL(file);
      setLocalProfilePreview(previewUrl);

      setIsUploading(true);
      try {
        // STEP 2: UPLOAD TO STORAGE
        const storageRef = ref(storage, `site_assets/profile_${Date.now()}_${file.name}`);
        const uploadResult = await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(uploadResult.ref);
        
        // STEP 3: PERSIST IN FIRESTORE
        const siteRef = doc(db, "config", "site");
        await setDoc(siteRef, { 
          profileImageUrl: imageUrl 
        }, { merge: true });

        // Force a local update to siteData just in case onSnapshot is slow
        setSiteData(prev => ({ ...prev, profileImageUrl: imageUrl }));

        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } catch (err) {
        alert('حدث خطأ أثناء حفظ الصورة. يرجى التأكد من الاتصال بالإنترنت.');
        setLocalProfilePreview(null); // Revert on error
        console.error(err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

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

  const handleAdminSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    setIsUploading(true);
    try {
      let dataToSave = { ...editTarget.data };
      
      if (selectedFile) {
        const fileRef = ref(storage, `site_assets/${Date.now()}_${selectedFile.name}`);
        const result = await uploadBytes(fileRef, selectedFile);
        dataToSave.imageUrl = await getDownloadURL(result.ref);
      }

      if (editTarget.type === 'site') {
        await setDoc(doc(db, "config", "site"), dataToSave, { merge: true });
      } else if (editTarget.type === 'skill') {
        if (dataToSave.id) {
          await updateDoc(doc(db, "skills", dataToSave.id), dataToSave);
        } else {
          await addDoc(collection(db, "skills"), { ...dataToSave, createdAt: serverTimestamp() });
        }
      } else if (editTarget.type === 'achievement') {
        if (dataToSave.id) {
          await updateDoc(doc(db, "achievements", dataToSave.id), dataToSave);
        } else {
          await addDoc(collection(db, "achievements"), { ...dataToSave, createdAt: serverTimestamp() });
        }
      }
      
      setEditTarget(null);
      setSelectedFile(null);
      setFilePreview(null);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error(err);
      alert('خطأ أثناء الحفظ');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, type: 'skill' | 'achievement') => {
    if (!window.confirm('هل أنت متأكد من الحذف النهائي؟')) return;
    try {
      await deleteDoc(doc(db, type === 'skill' ? "skills" : "achievements", id));
    } catch (err) {
      alert('حدث خطأ أثناء الحذف');
    }
  };

  const handleLike = async (id: string) => {
    try {
      await updateDoc(doc(db, "messages", id), { likes: increment(1) });
    } catch (err) { console.error(err); }
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

  return (
    <div className={`min-h-screen ${currentTheme.light} text-right font-['Cairo']`} dir="rtl">
      
      {/* Admin Toolbar Overlay */}
      {isAdmin && (
        <div className="fixed top-0 left-0 right-0 z-[150] bg-amber-500 text-slate-900 h-12 flex items-center justify-between px-6 shadow-xl font-black text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 animate-pulse"><ShieldCheck size={18} /> نمط الإدارة نشط</span>
            <button onClick={() => setEditTarget({type: 'site', data: siteData})} className="bg-black text-white px-3 py-1 rounded-full text-[10px] hover:scale-105 transition-all">تعديل نصوص الموقع الأساسية</button>
          </div>
          <button onClick={() => setIsAdmin(false)} className="bg-black text-white px-4 py-1 rounded-full text-xs font-bold">تسجيل خروج</button>
        </div>
      )}

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all ${isAdmin ? 'mt-12' : ''} ${scrolled ? 'bg-white/95 shadow-md h-16' : 'bg-transparent h-20'}`}>
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('home')}>
            <div className={`w-10 h-10 ${currentTheme.primary} rounded-lg flex items-center justify-center text-white shadow-lg`}><GraduationCap /></div>
            <span className={`text-lg font-black ${!scrolled ? 'text-white' : 'text-slate-900'}`}>فيصل نبيل السلمي</span>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            {['home', 'about', 'skills', 'achievements', 'quiz', 'contact'].map(id => (
              <button key={id} onClick={() => scrollToSection(id)} className={`px-4 py-1 rounded-md font-bold text-sm transition-all ${activeSection === id ? `${currentTheme.primary} text-white shadow-md` : (!scrolled ? 'text-white/70 hover:text-white' : 'text-slate-600 hover:bg-slate-50')}`}>
                {id === 'home' ? 'الرئيسية' : id === 'about' ? 'عني' : id === 'skills' ? 'مهاراتي' : id === 'achievements' ? 'إنجازاتي' : id === 'quiz' ? 'تحدي' : 'سجل الزوار'}
              </button>
            ))}
            <button onClick={() => setShowAdminLogin(true)} className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-lg ml-2 shadow-lg hover:scale-110 transition-transform"><Lock size={14}/></button>
          </div>

          <button className={`lg:hidden relative p-3 rounded-full border-2 transition-all ${!scrolled ? 'border-blue-400/50 text-white' : 'border-slate-200 text-slate-900'}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <div className={`absolute inset-0 rounded-full border-2 border-blue-400 opacity-50 blur-[2px] ${!scrolled ? '' : 'hidden'}`}></div>
            {isMenuOpen ? <X size={24}/> : <Menu size={24}/>}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 bg-black/70 backdrop-blur-md z-[110] lg:hidden transition-all duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)}>
          <div className={`absolute top-0 right-0 w-[80%] h-full bg-white shadow-2xl p-10 flex flex-col gap-6 transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8 border-b pb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white"><GraduationCap size={20}/></div>
                <span className="text-xl font-black text-slate-900">القائمة</span>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="p-3 bg-slate-100 rounded-xl text-slate-900"><X size={24}/></button>
            </div>
            {['home', 'about', 'skills', 'achievements', 'quiz', 'contact'].map(id => (
              <button key={id} onClick={() => scrollToSection(id)} className={`w-full text-right p-5 rounded-2xl font-black text-xl transition-all ${activeSection === id ? 'bg-amber-400 text-black shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}>
                {id === 'home' ? 'الرئيسية' : id === 'about' ? 'عني' : id === 'skills' ? 'مهاراتي' : id === 'achievements' ? 'إنجازاتي' : id === 'quiz' ? 'تحدي' : 'سجل الزوار'}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className={`min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br ${currentTheme.gradient} text-white pt-20`}>
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center w-full z-10">
          <div className="space-y-6 lg:text-right text-center">
            <h1 className="text-6xl md:text-8xl font-black leading-tight animate-in slide-in-from-right duration-700">
               {siteData.heroTitle.split(' نبيل').map((part, i) => i === 0 ? <span key={i}>{part}<br/></span> : <span key={i} className="text-amber-400">نبيل {part}</span>)}
            </h1>
            <p className="text-lg md:text-2xl opacity-80 leading-relaxed max-w-xl mx-auto lg:mx-0 animate-in slide-in-from-right delay-200">{siteData.heroDesc}</p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
              <button onClick={() => scrollToSection('about')} className="bg-white text-black px-10 py-4 rounded-2xl font-black hover:scale-105 transition-all shadow-2xl flex items-center gap-2">استكشاف الملف 🚀</button>
              <button onClick={() => scrollToSection('contact')} className="bg-amber-400 text-black px-10 py-4 rounded-2xl font-black hover:scale-105 transition-all shadow-2xl flex items-center gap-2">تواصل معي ✨</button>
            </div>
          </div>
          <div className="hidden lg:flex justify-center">
            <div className="w-72 h-96 bg-white/10 backdrop-blur-xl border-4 border-white/20 rounded-[4rem] flex items-center justify-center shadow-2xl relative overflow-visible group/profile">
               
               {/* Profile Image Display - Uses local preview if available for instant update */}
               {(localProfilePreview || siteData.profileImageUrl) ? (
                 <img src={localProfilePreview || siteData.profileImageUrl} alt="Profile" className="w-full h-full object-cover rounded-[3.8rem] transition-all duration-300" />
               ) : (
                 <User size={140} className="opacity-30" />
               )}

               {/* Admin Photo Control Button */}
               {isAdmin && (
                 <div className="absolute bottom-4 right-4 z-20">
                    <input type="file" ref={profileInputRef} className="hidden" accept="image/*" onChange={handleProfileImageUpload} />
                    <button 
                      onClick={handleProfileImageClick}
                      disabled={isUploading}
                      className="w-14 h-14 bg-amber-400 text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all border-4 border-slate-900 group"
                    >
                      {isUploading ? <Loader2 className="animate-spin" /> : <Camera size={24} />}
                      <span className="absolute -top-12 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">تغيير الصورة</span>
                    </button>
                 </div>
               )}

               <div className="absolute -top-6 -right-6 w-20 h-20 bg-amber-400 rounded-full flex items-center justify-center text-black shadow-xl animate-bounce"><Star fill="black" /></div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Section */}
      <section id="about" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-5xl font-black text-slate-900">البطاقة الشخصية 👤</h2>
            <div className="w-24 h-2 bg-amber-400 mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-slate-50 rounded-[2.5rem] flex items-center gap-6 border-2 border-slate-100 hover:border-amber-400 transition-colors">
                <div className={`w-16 h-16 rounded-2xl ${currentTheme.primary} text-white flex items-center justify-center shadow-xl`}><Calendar /></div>
                <div><p className="text-sm font-bold text-slate-400">العمر</p><p className="text-2xl font-black text-slate-800">{siteData.aboutAge}</p></div>
            </div>
            <div className="p-8 bg-slate-50 rounded-[2.5rem] flex items-center gap-6 border-2 border-slate-100 hover:border-amber-400 transition-colors">
                <div className={`w-16 h-16 rounded-2xl ${currentTheme.primary} text-white flex items-center justify-center shadow-xl`}><GraduationCap /></div>
                <div><p className="text-sm font-bold text-slate-400">المرحلة الدراسية</p><p className="text-2xl font-black text-slate-800">{siteData.aboutStage}</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 bg-slate-50 scroll-mt-20 relative">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-16">
            <h2 className="text-5xl font-black text-slate-900">مهاراتي المتميزة ✨</h2>
            {isAdmin && (
              <button 
                onClick={() => setEditTarget({type: 'skill', data: {title: '', level: 50}})}
                className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
              >
                <Plus />
              </button>
            )}
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {skills.map((s, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[3rem] shadow-sm border border-white hover:-translate-y-3 transition-all relative group">
                {isAdmin && (
                  <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditTarget({type: 'skill', data: s})} className="p-2 bg-amber-400 text-black rounded-lg shadow-sm"><Edit3 size={14}/></button>
                    <button onClick={() => handleDelete(s.id, 'skill')} className="p-2 bg-rose-500 text-white rounded-lg shadow-sm"><Trash2 size={14}/></button>
                  </div>
                )}
                <div className={`w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-6 shadow-xl mx-auto`}><Star size={20}/></div>
                <h3 className="text-xl font-black mb-4 text-slate-800">{s.title}</h3>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                   <div className={`h-full bg-amber-500 transition-all duration-1000 shadow-sm`} style={{width: `${s.level}%`}}></div>
                </div>
                <p className="text-sm font-black text-slate-400">{s.level}%</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center gap-4 mb-16">
            <h2 className="text-5xl font-black text-slate-900">إنجازاتي الطموحة 🏆</h2>
            {isAdmin && (
              <button 
                onClick={() => setEditTarget({type: 'achievement', data: {title: '', desc: ''}})}
                className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
              >
                <Plus />
              </button>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {achievements.map((ach, idx) => (
              <div key={idx} className="bg-slate-900 text-white p-10 rounded-[3.5rem] flex gap-8 items-start relative overflow-hidden group hover:scale-[1.02] transition-transform">
                 <div className="w-16 h-16 bg-amber-400 text-black rounded-2xl flex items-center justify-center shadow-xl shrink-0 overflow-hidden">
                    {ach.imageUrl ? (
                      <img src={ach.imageUrl} className="w-full h-full object-cover" />
                    ) : (
                      <Medal size={32} />
                    )}
                 </div>
                 <div className="flex-1">
                    <h3 className="text-2xl font-black mb-3">{ach.title}</h3>
                    <p className="text-lg opacity-60 leading-relaxed">{ach.desc}</p>
                 </div>
                 {isAdmin && (
                  <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditTarget({type: 'achievement', data: ach})} className="p-2 bg-amber-400 text-black rounded-lg"><Edit3 size={14}/></button>
                    <button onClick={() => handleDelete(ach.id, 'achievement')} className="p-2 bg-rose-500 text-white rounded-lg"><Trash2 size={14}/></button>
                  </div>
                 )}
                 <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-amber-400/20 transition-colors"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admin Edit Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white rounded-[3rem] max-w-2xl w-full p-10 max-h-[90vh] overflow-y-auto shadow-2xl relative scroll-smooth custom-scrollbar">
              <button onClick={() => {setEditTarget(null); setFilePreview(null); setSelectedFile(null);}} className="absolute top-8 left-8 p-3 bg-slate-100 rounded-2xl text-slate-400 hover:text-rose-500 transition-colors"><X /></button>
              
              <h2 className="text-3xl font-black mb-8 text-slate-900 flex items-center gap-3">
                 <Settings className="text-amber-500" />
                 {editTarget.type === 'site' ? 'تعديل نصوص الموقع' : editTarget.data?.id ? 'تعديل المحتوى' : 'إضافة عنصر جديد'}
              </h2>

              <form onSubmit={handleAdminSave} className="space-y-6">
                 {editTarget.type === 'site' ? (
                   <>
                     <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">العنوان الرئيسي</label>
                        <input value={editTarget.data.heroTitle} onChange={e => setEditTarget({...editTarget, data: {...editTarget.data, heroTitle: e.target.value}})} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black focus:ring-2 ring-amber-400 outline-none" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">الوصف التعريفي</label>
                        <textarea value={editTarget.data.heroDesc} onChange={e => setEditTarget({...editTarget, data: {...editTarget.data, heroDesc: e.target.value}})} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black h-32 focus:ring-2 ring-amber-400 outline-none" />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-xs font-black text-slate-400 uppercase tracking-widest">العمر</label>
                           <input value={editTarget.data.aboutAge} onChange={e => setEditTarget({...editTarget, data: {...editTarget.data, aboutAge: e.target.value}})} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black focus:ring-2 ring-amber-400 outline-none" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-black text-slate-400 uppercase tracking-widest">المرحلة</label>
                           <input value={editTarget.data.aboutStage} onChange={e => setEditTarget({...editTarget, data: {...editTarget.data, aboutStage: e.target.value}})} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black focus:ring-2 ring-amber-400 outline-none" />
                        </div>
                     </div>
                   </>
                 ) : editTarget.type === 'skill' ? (
                   <>
                     <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">اسم المهارة</label>
                        <input value={editTarget.data.title} onChange={e => setEditTarget({...editTarget, data: {...editTarget.data, title: e.target.value}})} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black focus:ring-2 ring-amber-400 outline-none" required />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">مستوى الإتقان: {editTarget.data.level}%</label>
                        <input type="range" min="0" max="100" value={editTarget.data.level} onChange={e => setEditTarget({...editTarget, data: {...editTarget.data, level: parseInt(e.target.value)}})} className="w-full h-3 bg-slate-100 rounded-full appearance-none accent-amber-500 cursor-pointer" />
                     </div>
                   </>
                 ) : (
                   <>
                     <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">عنوان الإنجاز</label>
                        <input value={editTarget.data.title} onChange={e => setEditTarget({...editTarget, data: {...editTarget.data, title: e.target.value}})} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black focus:ring-2 ring-amber-400 outline-none" required />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">وصف الإنجاز</label>
                        <textarea value={editTarget.data.desc} onChange={e => setEditTarget({...editTarget, data: {...editTarget.data, desc: e.target.value}})} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black h-32 focus:ring-2 ring-amber-400 outline-none" required />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">صورة الإنجاز (أو أيقونة افتراضية)</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="admin-file" />
                        <label htmlFor="admin-file" className="w-full p-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition-all">
                           {filePreview || editTarget.data.imageUrl ? (
                             <img src={filePreview || editTarget.data.imageUrl} className="w-full h-48 object-cover rounded-2xl shadow-lg" />
                           ) : (
                             <>
                               <ImageIcon className="text-slate-300 mb-2" size={40} />
                               <span className="text-xs font-bold text-slate-400">اختر صورة للرفع</span>
                             </>
                           )}
                        </label>
                     </div>
                   </>
                 )}

                 <div className="flex gap-4 pt-4">
                    <button disabled={isUploading} type="submit" className="flex-1 bg-slate-900 text-white p-5 rounded-2xl font-black text-xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-50">
                       {isUploading ? <Loader2 className="animate-spin" /> : <Save />} حفظ التغييرات
                    </button>
                    <button type="button" onClick={() => {setEditTarget(null); setFilePreview(null); setSelectedFile(null);}} className="bg-slate-100 text-slate-500 px-8 py-5 rounded-2xl font-black">إلغاء</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Quiz Section */}
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
              <div className="space-y-8 animate-in fade-in duration-500">
                <h3 className="text-3xl font-black leading-tight min-h-[100px]">{QUIZ_QUESTIONS[currentQIndex].question}</h3>
                <div className="grid gap-4">
                  {QUIZ_QUESTIONS[currentQIndex].options.map((o, idx) => (
                    <button key={idx} onClick={() => handleAnswer(idx)} className="p-6 text-right rounded-2xl font-bold text-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-400/50 transition-all">
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {quizMode === 'feedback' && <div className="text-center py-20 text-4xl font-black animate-bounce">{isCorrect ? 'إجابة صحيحة! 👏' : 'إجابة خاطئة! 💔'}</div>}
            {quizMode === 'finished' && (
              <div className="text-center space-y-8 py-10">
                <Trophy size={120} className="mx-auto text-amber-400" />
                <h2 className="text-5xl font-black text-amber-400">انتهى التحدي! النتيجة: {score} من 5</h2>
                <button onClick={() => {setQuizMode('idle'); setScore(0); setCurrentQIndex(0);}} className="bg-white text-black px-12 py-4 rounded-xl font-black">إعادة المحاولة</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Guestbook Section */}
      <section id="contact" className="py-24 bg-white scroll-mt-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-16 space-y-4">
              <h2 className="text-5xl font-black text-slate-900">سجل الزوار والرسائل 📝</h2>
              <p className="text-xl text-slate-500 font-bold">يسعدني أن تشاركني رأيك أو تترك لي رسالة تشجيعية!</p>
           </div>

           <div className="grid lg:grid-cols-5 gap-10">
              <div className="lg:col-span-2">
                 <div className="bg-slate-50 p-8 rounded-[3rem] border-2 border-slate-100 shadow-sm sticky top-24">
                    <form onSubmit={handleSendMessage} className="space-y-4">
                       <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="الاسم" className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-black focus:ring-2 ring-amber-400 outline-none" required />
                       <textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="اترك رسالتك هنا..." rows={3} className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-black focus:ring-2 ring-amber-400 outline-none" required />
                       <div className="relative">
                          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="file-input" />
                          <label htmlFor="file-input" className="w-full p-4 bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition-all">
                             {filePreview ? <img src={filePreview} className="w-full h-32 object-cover rounded-xl" /> : <><ImageIcon className="text-slate-400 mb-2" size={30} /><span className="text-xs font-bold text-slate-400">أضف صورة</span></>}
                          </label>
                       </div>
                       <button disabled={isUploading} className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black text-xl hover:bg-black transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50">
                          {isUploading ? <Loader2 className="animate-spin" /> : <Send />} إرسال الآن
                       </button>
                    </form>
                 </div>
              </div>

              <div className="lg:col-span-3 space-y-4 max-h-[800px] overflow-y-auto p-2 custom-scrollbar">
                 {messages.length === 0 ? (
                    <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
                      <Mail size={40} className="mx-auto text-slate-300 mb-4" />
                      <p className="text-slate-400 font-bold">لا توجد رسائل بعد، كن أول من يكتب!</p>
                    </div>
                 ) : (
                    messages.map((m) => (
                       <div key={m.id} className={`p-6 rounded-[2.5rem] border shadow-sm relative transition-all animate-in slide-in-from-bottom-5 ${m.deviceId === deviceId ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-100'}`}>
                          <div className="flex justify-between items-start mb-4">
                             <div className="flex items-center gap-3">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl ${m.deviceId === deviceId ? 'bg-amber-400 text-black' : 'bg-slate-900 text-white shadow-lg'}`}>{m.name.charAt(0)}</div>
                                <h4 className="font-black text-slate-900 text-lg leading-none">{m.name}</h4>
                             </div>
                             {isAdmin && <button onClick={() => deleteDoc(doc(db, "messages", m.id))} className="text-rose-500 p-2"><Trash2 size={16}/></button>}
                          </div>
                          <p className="text-slate-900 leading-relaxed font-bold mb-4 text-lg">{m.content}</p>
                          {m.imageUrl && <img src={m.imageUrl} className="max-h-72 rounded-2xl border-4 border-white shadow-md mb-4" />}
                          <div className="flex items-center gap-4 border-t border-slate-50 pt-4">
                             <button onClick={() => handleLike(m.id)} className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all font-black"><Heart size={18} fill={m.likes > 0 ? "currentColor" : "none"} /> {m.likes || 0}</button>
                          </div>
                       </div>
                    ))}
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-20 text-center">
         <div className="w-16 h-16 bg-amber-400 text-black mx-auto rounded-2xl flex items-center justify-center font-black text-3xl mb-6 shadow-[0_0_30px_rgba(251,191,36,0.3)]">ف</div>
         <p className="text-2xl font-black">فيصل نبيل السلمي</p>
         <p className="opacity-40 mt-4 italic font-bold">ملف إنجاز متكامل وطموح مستمر 🚀</p>
         <p className="text-[10px] opacity-20 mt-10">جميع الحقوق محفوظة © {new Date().getFullYear()}</p>
      </footer>

      {/* UI States */}
      {saveStatus === 'saved' && (
        <div className="fixed top-24 right-8 z-[300] bg-green-500 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10">
          <CheckCircle2 size={18} /> تم الحفظ بنجاح
        </div>
      )}

      {showAdminLogin && (
        <div className="fixed inset-0 z-[250] bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-[2rem] max-w-sm w-full shadow-2xl">
            <h3 className="text-2xl font-black mb-6 text-center text-slate-900">دخول المسؤول 🔐</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              if(adminPassword === 'FAISAL.2013') { setIsAdmin(true); setShowAdminLogin(false); setAdminPassword(''); }
              else alert('كلمة مرور غير صحيحة');
            }} className="space-y-4">
              <input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} className="w-full p-4 bg-slate-100 rounded-xl font-bold text-black outline-none ring-amber-400 focus:ring-2 text-center text-2xl" placeholder="••••" />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-black text-white p-4 rounded-xl font-black">دخول</button>
                <button type="button" onClick={() => setShowAdminLogin(false)} className="bg-slate-100 text-slate-500 p-4 rounded-xl font-black">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className={`fixed bottom-8 left-8 p-4 bg-black text-white rounded-full shadow-2xl z-[150] transition-all hover:scale-110 active:scale-95 ${scrolled ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <ChevronUp />
      </button>
    </div>
  );
};

export default App;
