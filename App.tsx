import React, { useState, useEffect, useRef } from 'react';
import { Book, Verse, ChapterContent, AppSettings, ViewState, Favorite, EmotionalVerse, UserReflection } from './types';
import { BOOKS, INITIAL_SETTINGS, EMOTIONAL_VERSES, getDailyReading } from './constants';
import { storageService } from './services/storageService';
import { bibleService } from './services/bibleService';
import { geminiService } from './services/geminiService';
import { 
  IconBook, IconSearch, IconHeart, IconChevronLeft, 
  IconShare, IconSparkles, IconClose, IconMoon, IconSun,
  IconWaves, IconBattery, IconCloud, IconFire, IconAnchor, IconSunRise,
  IconPen, IconRefresh, IconInfo, IconCalendar
} from './components/Icons';

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [currentChapter, setCurrentChapter] = useState<number>(1);
  const [chapterContent, setChapterContent] = useState<ChapterContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // Welcome Screen State
  const [showWelcome, setShowWelcome] = useState(true);

  // Emotional Verse State
  const [currentEmotionalVerse, setCurrentEmotionalVerse] = useState<EmotionalVerse | null>(null);
  const [userReflections, setUserReflections] = useState<UserReflection[]>([]);
  const [isWritingReflection, setIsWritingReflection] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  
  // Ref to track the current verse for async operations logic
  const selectedVerseRef = useRef<Verse | null>(null);

  // Initialize
  useEffect(() => {
    const savedSettings = storageService.getSettings(INITIAL_SETTINGS);
    setSettings(savedSettings);
    setFavorites(storageService.getFavorites());
    setHistory(storageService.getHistory());
    
    // Check if user has seen welcome screen
    const hasSeenWelcome = localStorage.getItem('bible_app_welcome_seen');
    if (hasSeenWelcome) {
      setShowWelcome(false);
    }
    
    // Load reflections from local storage (simple implementation directly here for now)
    const storedReflections = localStorage.getItem('bible_app_reflections');
    if (storedReflections) {
      setUserReflections(JSON.parse(storedReflections));
    }

    // Apply Theme
    if (savedSettings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Reset AI explanation when selected verse changes
  useEffect(() => {
    selectedVerseRef.current = selectedVerse;
    setAiExplanation('');
    setIsAiLoading(false);
  }, [selectedVerse]);

  // Theme Toggler
  const toggleTheme = () => {
    const newTheme: AppSettings['theme'] = settings.theme === 'dark' ? 'light' : 'dark';
    const newSettings = { ...settings, theme: newTheme };
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const changeFontSize = (delta: number) => {
    const newSize = Math.max(1, Math.min(5, settings.fontSize + delta));
    const newSettings = { ...settings, fontSize: newSize };
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
  };

  // Navigation Logic
  const handleBookSelect = (book: Book) => {
    setCurrentBook(book);
    setView(ViewState.CHAPTERS);
  };

  const handleChapterSelect = async (chapter: number) => {
    if (!currentBook) return;
    
    setCurrentChapter(chapter);
    setView(ViewState.READER);
    loadChapter(currentBook.name, chapter);
    
    storageService.addToHistory({
      bookAbbrev: currentBook.abbrev,
      bookName: currentBook.name,
      chapter: chapter,
      timestamp: Date.now()
    });
    setHistory(storageService.getHistory());
  };

  const loadChapter = async (bookName: string, chapter: number) => {
    setIsLoading(true);
    // Scroll to top
    window.scrollTo(0, 0);
    const data = await bibleService.fetchChapter(bookName, chapter);
    setChapterContent(data);
    setIsLoading(false);
  };

  const nextChapter = () => {
    if (!currentBook) return;
    if (currentChapter < currentBook.chapters) {
      handleChapterSelect(currentChapter + 1);
    }
  };

  const prevChapter = () => {
    if (currentChapter > 1) {
      handleChapterSelect(currentChapter - 1);
    }
  };

  const toggleFavorite = (verse: Verse) => {
    const exists = favorites.some(f => 
      f.verse.book_name === verse.book_name && 
      f.verse.chapter === verse.chapter && 
      f.verse.verse === verse.verse
    );

    if (exists) {
      // Find id to remove
      const fav = favorites.find(f => 
        f.verse.book_name === verse.book_name && 
        f.verse.chapter === verse.chapter && 
        f.verse.verse === verse.verse
      );
      if (fav) {
        storageService.removeFavorite(fav.id);
        setFavorites(prev => prev.filter(f => f.id !== fav.id));
      }
    } else {
      const newFav: Favorite = {
        id: Date.now().toString(),
        verse: verse,
        timestamp: Date.now()
      };
      storageService.addFavorite(newFav);
      setFavorites(prev => [newFav, ...prev]);
    }
    setSelectedVerse(null); // Close modal
  };

  // Adapter for Emotional Verse to Verse type for favorites
  const toggleEmotionalFavorite = (reading?: {verse: string, reference: string, id?: string}) => {
    // If passed a specific reading object (like from Daily Message), use it
    // Otherwise fall back to currentEmotionalVerse state
    
    const text = reading ? reading.verse : currentEmotionalVerse?.text;
    const reference = reading ? reading.reference : currentEmotionalVerse?.reference;
    
    if (!text || !reference) return;

    // Convert to Verse compatible object roughly
    const parts = reference.split(' ');
    const bookName = parts[0]; 
    
    const verseObj: Verse = {
      book_id: bookName.toLowerCase(),
      book_name: bookName,
      chapter: 0, // Placeholder
      verse: 0, // Placeholder
      text: text
    };

    // Check if favorited by text match since ID structure is different
    const exists = favorites.some(f => f.verse.text === text);

    if (exists) {
       const fav = favorites.find(f => f.verse.text === text);
       if (fav) {
         storageService.removeFavorite(fav.id);
         setFavorites(prev => prev.filter(f => f.id !== fav.id));
       }
    } else {
       const newFav: Favorite = {
        id: Date.now().toString(),
        verse: verseObj,
        timestamp: Date.now()
      };
      storageService.addFavorite(newFav);
      setFavorites(prev => [newFav, ...prev]);
    }
  };

  const handleExplainVerse = async (verse: Verse) => {
    setIsAiLoading(true);
    setAiExplanation('');
    const context = `${currentBook?.name} ${currentChapter}`;
    const text = await geminiService.explainVerse(verse.text, context);
    
    // Check against the ref to ensure we update the UI for the correct verse
    const current = selectedVerseRef.current;
    if (current && 
        current.book_name === verse.book_name && 
        current.chapter === verse.chapter && 
        current.verse === verse.verse) {
      setAiExplanation(text);
      setIsAiLoading(false);
    }
  };

  const shareVerse = async (text: string, ref: string) => {
    const shareText = `"${text}" - ${ref}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Versículo Bíblico',
          text: shareText,
        });
      } catch (err) {
        console.log("Share failed", err);
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('Versículo copiado!');
    }
    setSelectedVerse(null);
  };

  // Function to share the APP itself with the specific heartfelt message
  const handleShareApp = () => {
    const message = "Pensei em você agora e senti que deveria te mandar isto. A Bíblia Palavra Viva me ajudou a encontrar direção quando eu estava precisando. Talvez também ilumine seu dia.";
    const appUrl = window.location.href; // Uses current URL
    const fullText = `${message}\n\n${appUrl}`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(fullText)}`, '_blank');
  };

  // --- EMOTIONAL LOGIC ---
  const handleEmotionSelect = (emotion: string) => {
    // 1. Filter verses by emotion
    const candidates = EMOTIONAL_VERSES.filter(v => v.emotion === emotion);
    
    // 2. Simple Random Selection (Algorithm Step)
    if (candidates.length > 0) {
      const randomIndex = Math.floor(Math.random() * candidates.length);
      setCurrentEmotionalVerse(candidates[randomIndex]);
      setView(ViewState.EMOTIONAL_READING);
      // Reset writing state
      setIsWritingReflection(false);
      setReflectionText('');
    } else {
      alert("Nenhum versículo encontrado para esta emoção no momento.");
    }
  };

  const saveReflection = () => {
    if (!currentEmotionalVerse || !reflectionText.trim()) return;
    
    const newReflection: UserReflection = {
      id: Date.now().toString(),
      verseId: currentEmotionalVerse.id,
      text: reflectionText,
      timestamp: Date.now()
    };
    
    const updated = [newReflection, ...userReflections];
    setUserReflections(updated);
    localStorage.setItem('bible_app_reflections', JSON.stringify(updated));
    setIsWritingReflection(false);
    alert('Reflexão salva com sucesso!');
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText("432451120001-15");
    alert("Chave Pix copiada para a área de transferência!");
  };

  const handleDismissWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('bible_app_welcome_seen', 'true');
  };

  // --- VIEWS ---

  const renderWelcome = () => (
    <div className="fixed inset-0 z-[60] bg-leather-900 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
       <div className="max-w-xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-1000 delay-100">
          <div className="w-16 h-16 mx-auto bg-gold-600 rounded-full flex items-center justify-center shadow-glow mb-6">
             <IconSparkles className="w-8 h-8 text-leather-900" />
          </div>
          
          <div className="space-y-6 font-serif text-lg md:text-xl leading-relaxed text-paper-100 italic opacity-90">
            <p>
              "Em cada instante do seu dia, alguém, em algum lugar, encontra uma vida mais leve devido a algo que você fez ou da pessoa que você é."
            </p>
            <p className="text-gold-400 font-bold not-italic">
              "E, mesmo sem saber, a quantidade de gratidão, alegria e amor que já estão fluindo em sua direção é inimaginável."
            </p>
            <p>
              "E é impossível mensurar o quanto de amor, felicidade e perdão Deus está derramando sobre você como resposta a isso."
            </p>
          </div>

          <button 
            onClick={handleDismissWelcome}
            className="mt-12 px-10 py-4 bg-gold-600 text-leather-900 font-bold uppercase tracking-widest rounded-sm hover:bg-gold-500 transition-all shadow-lg hover:shadow-gold-500/20 transform hover:-translate-y-1"
          >
            Entrar em Paz
          </button>
       </div>
    </div>
  );

  const renderHome = () => {
    const lastRead = history.length > 0 ? history[0] : null;

    // Use Icons instead of Emojis
    const emotions = [
      { id: 'ansiedade', label: 'Ansiedade', sub: 'Encontre calma', icon: <IconWaves className="w-5 h-5 text-slate-500" /> },
      { id: 'cansaco', label: 'Cansaço', sub: 'Renove as forças', icon: <IconBattery className="w-5 h-5 text-slate-500" /> },
      { id: 'tristeza', label: 'Tristeza', sub: 'Receba consolo', icon: <IconCloud className="w-5 h-5 text-slate-500" /> },
      { id: 'gratidao', label: 'Gratidão', sub: 'Celebre a vida', icon: <IconSunRise className="w-5 h-5 text-slate-500" /> },
      { id: 'raiva', label: 'Raiva', sub: 'Busque a paz', icon: <IconFire className="w-5 h-5 text-slate-500" /> },
      { id: 'esperanca', label: 'Esperança', sub: 'Confie no futuro', icon: <IconAnchor className="w-5 h-5 text-slate-500" /> },
    ];

    return (
      <div className="flex flex-col min-h-screen pb-32 animate-fade-in bg-paper-50 dark:bg-leather-900">
        
        {/* Leather Style Header */}
        <header className="px-8 pt-12 pb-10 bg-leather-900 dark:bg-black text-white rounded-b-sm shadow-2xl leather-texture mb-12 border-b-4 border-leather-700 relative overflow-hidden">
          <div className="flex justify-between items-start max-w-2xl mx-auto w-full relative z-10">
            <div>
              {/* PLANO B BUTTON - Left Corner */}
              <button 
                onClick={() => setView(ViewState.PLAN_B)}
                className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500 border border-gold-600/50 px-3 py-1 rounded-sm mb-3 hover:bg-gold-600 hover:text-leather-900 transition-colors"
              >
                Plano B
              </button>
              <h1 className="text-4xl font-serif font-bold text-paper-50 tracking-tight">Bíblia Palavra Viva</h1>
              <p className="text-gold-500 mt-2 font-serif text-base italic tracking-wide">Sua companhia diária</p>
            </div>
            {/* Decorative Gold Accent */}
            <div className="w-10 h-10 rounded-full border border-gold-600 flex items-center justify-center bg-leather-800 shadow-lg">
               <IconBook className="text-gold-500 w-5 h-5" />
            </div>
          </div>
        </header>

        <div className="px-6 md:px-8 max-w-2xl mx-auto w-full space-y-12">
          
          {/* Emotions Section - Clean & Minimalist List */}
          <div className="animate-in slide-in-from-bottom duration-700">
             <div className="flex items-center gap-3 mb-6">
                <span className="w-1 h-5 bg-leather-900 dark:bg-gold-500 rounded-full"></span>
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">O que você sente hoje?</h2>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {emotions.map(emo => (
                 <button
                   key={emo.id}
                   onClick={() => handleEmotionSelect(emo.id)}
                   className="group flex items-center justify-between p-5 bg-white dark:bg-leather-800 rounded-sm shadow-sm border border-slate-100 dark:border-leather-700 hover:border-gold-400 dark:hover:border-gold-600 transition-all active:scale-[0.99] hover:shadow-md"
                 >
                   <div className="flex items-center gap-5">
                     <div className="p-3 rounded-full bg-paper-100 dark:bg-leather-700 group-hover:bg-gold-50 dark:group-hover:bg-leather-600 transition-colors">
                        {React.cloneElement(emo.icon, { className: "w-6 h-6 text-leather-800 dark:text-gold-400" })}
                     </div>
                     <div className="text-left">
                       <span className="block font-serif font-semibold text-slate-800 dark:text-paper-50 text-lg group-hover:text-leather-900 dark:group-hover:text-gold-400 transition-colors">{emo.label}</span>
                       <span className="block text-xs text-slate-500 dark:text-leather-300 font-sans">{emo.sub}</span>
                     </div>
                   </div>
                   <IconChevronLeft className="rotate-180 w-5 h-5 text-slate-300 dark:text-leather-600 group-hover:text-gold-500 transition-colors" />
                 </button>
               ))}
             </div>
          </div>

          {/* Featured Daily Message */}
          <div className="animate-in slide-in-from-bottom duration-700 delay-100">
             <div className="flex items-center gap-3 mb-4">
                <span className="w-1 h-5 bg-gold-500 rounded-full"></span>
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Inspiração Diária</h2>
             </div>
             
             <button 
              onClick={() => setView(ViewState.DAILY_MESSAGE)}
              className="w-full bg-leather-900 dark:bg-gold-600 text-paper-50 p-8 rounded-sm shadow-lg hover:shadow-2xl transition-all group relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl group-hover:bg-white/10 transition duration-500"></div>
                
                <div className="flex items-center justify-between relative z-10">
                   <div className="flex items-center gap-6">
                      <div className="p-3 bg-white/10 rounded-full">
                        <IconSunRise className="w-8 h-8 text-gold-500 dark:text-leather-900" />
                      </div>
                      <div className="text-left">
                         <p className="font-bold uppercase tracking-widest text-xs text-gold-500 dark:text-leather-900 mb-2">Mensagem do Dia</p>
                         <p className="font-serif text-xl font-medium">Ver a palavra de hoje</p>
                      </div>
                   </div>
                   <div className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 group-hover:bg-white/20 transition-all">
                      <IconChevronLeft className="rotate-180 w-5 h-5" />
                   </div>
                </div>
             </button>
          </div>

          {/* Continue Reading - Minimalist Card */}
          {lastRead && (
            <div className="animate-in slide-in-from-bottom duration-700 delay-200">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-1 h-5 bg-leather-900 dark:bg-gold-500 rounded-full"></span>
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Continuar Leitura</h2>
              </div>
              <button 
                onClick={() => {
                  const book = BOOKS.find(b => b.abbrev === lastRead.bookAbbrev);
                  if (book) {
                    setCurrentBook(book);
                    handleChapterSelect(lastRead.chapter);
                  }
                }}
                className="w-full bg-white dark:bg-leather-800 p-6 rounded-sm shadow-md border-l-4 border-l-leather-900 dark:border-l-gold-500 border-y border-r border-transparent hover:border-slate-200 dark:hover:border-leather-600 text-left hover:shadow-xl transition-all group"
              >
                <div className="flex justify-between items-center">
                  <div>
                     <p className="text-xl font-serif font-bold text-leather-900 dark:text-paper-50">{lastRead.bookName}</p>
                     <p className="text-slate-500 dark:text-leather-300 text-xs mt-1 uppercase tracking-wide font-medium">Capítulo {lastRead.chapter}</p>
                  </div>
                  <div className="text-leather-900 dark:text-gold-500 opacity-20 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 duration-300">
                    <IconBook className="w-6 h-6" />
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* The NUDGE Section - Subtle, invite-only, no visual clutter */}
          <div className="mt-16 pt-8 border-t border-slate-200 dark:border-leather-800 text-center pb-8 animate-in fade-in duration-1000 delay-300">
             <div className="inline-block p-3 rounded-full bg-paper-100 dark:bg-leather-800 mb-4">
               <IconHeart className="w-5 h-5 text-gold-500 fill-current" />
             </div>
             <p className="text-slate-600 dark:text-paper-300 font-serif italic mb-6 max-w-xs mx-auto text-sm leading-relaxed">
               "Este refúgio de paz é mantido por leitores como você. Sem anúncios, apenas a Palavra."
             </p>
             <button 
               onClick={() => setView(ViewState.ABOUT)}
               className="text-xs font-bold uppercase tracking-widest text-leather-900 dark:text-gold-500 hover:text-gold-600 transition-colors border-b border-gold-500 pb-1"
             >
               Plantar uma Palavra de Amor
             </button>
          </div>

        </div>
      </div>
    );
  };

  const renderPlanB = () => (
    <div className="min-h-screen bg-leather-900 text-paper-50 flex flex-col items-center justify-center p-6 animate-fade-in relative">
        <button 
          onClick={() => setView(ViewState.HOME)}
          className="absolute top-8 left-8 p-3 bg-transparent text-gold-500 hover:text-white hover:bg-white/10 transition z-10 rounded-full"
        >
          <IconClose className="w-6 h-6" />
        </button>

        <div className="max-w-xl w-full text-center border border-gold-600/30 p-10 relative bg-leather-800/50 shadow-2xl rounded-sm">
           
           <div className="mb-8 mt-6">
             <div className="w-16 h-16 mx-auto bg-gold-600 rounded-full flex items-center justify-center mb-6 shadow-glow">
                <IconAnchor className="w-8 h-8 text-leather-900" />
             </div>
             <h2 className="text-3xl font-serif font-bold text-gold-500 leading-tight tracking-tight">
               O Plano B de Deus
             </h2>
             <p className="text-xs uppercase tracking-[0.3em] text-paper-200 mt-2">Quando o Plano A falha</p>
           </div>

           <div className="text-left font-serif leading-loose text-lg text-paper-100 space-y-6">
             <p>
               Muitas vezes, achamos que estragamos tudo. Que nossos sonhos se quebraram. Que relacionamentos terminaram sem volta. Que o "Plano A" da nossa vida fracassou.
             </p>
             <p className="text-gold-100 italic">
               Mas Deus é especialista em recomeços.
             </p>
             <p>
               Na matemática do céu, o fracasso de hoje pode ser o adubo para o milagre de amanhã. O Plano B de Deus não é um prêmio de consolação. É a graça Dele reescrevendo sua história por caminhos que você não imaginou.
             </p>
             <p>
               Se você se sente perdido hoje, lembre-se: a Bíblia está cheia de "Planos B". Moisés era um fugitivo. Davi era o menor. Pedro falhou. E Deus usou a todos poderosamente.
             </p>
           </div>

           <div className="mt-10 border-t border-gold-600/30 pt-8">
             <p className="font-serif font-bold text-xl text-white mb-4">
               "Eis que faço novas todas as coisas."
             </p>
             <span className="text-gold-500 text-sm uppercase tracking-widest font-bold">Apocalipse 21:5</span>
           </div>

           <div className="mt-10">
             <button 
                onClick={() => setView(ViewState.DAILY_MESSAGE)}
                className="px-8 py-3 bg-gold-600 text-leather-900 font-bold uppercase tracking-widest rounded-sm hover:bg-gold-500 transition shadow-lg w-full"
             >
                Receber uma Palavra
             </button>
           </div>
        </div>
    </div>
  );

  const renderDailyMessage = () => {
    // Get the reading for today
    const today = new Date();
    const dailyReading = getDailyReading(today);
    const isFav = favorites.some(f => f.verse.text === dailyReading.verse);

    return (
      <div className="min-h-screen bg-paper-50 dark:bg-leather-900 flex flex-col items-center justify-center p-6 animate-fade-in relative">
        <button 
          onClick={() => setView(ViewState.HOME)}
          className="absolute top-8 left-8 p-3 bg-transparent text-leather-900 dark:text-paper-200 hover:opacity-70 transition z-10 rounded-full hover:bg-slate-200 dark:hover:bg-leather-800"
        >
          <IconClose className="w-6 h-6" />
        </button>

        <div className="max-w-xl w-full text-center border-4 double border-leather-900 dark:border-gold-500 p-10 relative bg-white dark:bg-leather-800 shadow-xl rounded-sm">
           <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-paper-50 dark:bg-leather-900 px-6 border border-leather-200 dark:border-leather-700 rounded-full">
             <span className="text-xs font-bold text-gold-600 dark:text-gold-500 uppercase tracking-widest leading-loose">
                {today.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
             </span>
           </div>
           
           {/* Add Screenshot Hint */}
           <div className="absolute top-4 right-4 text-slate-300 dark:text-leather-600 flex flex-col items-center">
              <span className="text-[9px] uppercase tracking-widest font-bold">Tire um Print</span>
           </div>

           <div className="mb-8 mt-6">
             <IconSunRise className="w-10 h-10 mx-auto text-leather-900 dark:text-gold-500 mb-4" />
             <h2 className="text-2xl font-serif font-bold text-leather-900 dark:text-paper-50 leading-tight">
               Inspiração de Hoje
             </h2>
           </div>

           <p className="font-serif text-xl text-slate-800 dark:text-paper-100 italic leading-relaxed mb-6">
             "{dailyReading.verse}"
           </p>

           <div className="mb-8">
             <span className="block text-sm font-bold text-leather-700 dark:text-gold-500 uppercase tracking-widest border-b border-gold-300 inline-block pb-1">
               {dailyReading.reference}
             </span>
           </div>
           
           <div className="text-left bg-paper-50 dark:bg-black/20 p-6 rounded-sm mb-8 text-slate-700 dark:text-paper-200 font-serif leading-loose text-lg border-l-4 border-gold-500">
             {dailyReading.message}
           </div>

           <div className="flex justify-center gap-4 flex-wrap">
             <button 
                onClick={() => {
                  toggleEmotionalFavorite(dailyReading);
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-full border transition ${isFav ? 'bg-red-50 border-red-200 text-red-600' : 'bg-leather-900 dark:bg-gold-600 text-white border-transparent hover:opacity-90'}`}
             >
                <IconHeart fill={isFav ? "currentColor" : "none"} className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wide">{isFav ? 'Salvo' : 'Salvar'}</span>
             </button>
             
             {/* WhatsApp Share Button */}
             <button 
                onClick={() => {
                  const whatsappText = `*Bíblia Palavra Viva - Inspiração de Hoje*\n\n_"${dailyReading.verse}"_\n*${dailyReading.reference}*\n\n${dailyReading.message}`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(whatsappText)}`, '_blank');
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white hover:opacity-90 transition border border-transparent shadow-sm"
             >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                <span className="text-xs font-bold uppercase tracking-wide">WhatsApp</span>
             </button>

             <button 
                onClick={() => shareVerse(dailyReading.verse, dailyReading.reference)}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-paper-100 dark:bg-leather-700 text-leather-900 dark:text-paper-100 hover:bg-paper-200 transition border border-transparent"
             >
                <IconShare className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wide">Outros</span>
             </button>
           </div>
        </div>
      </div>
    );
  };

  const renderAbout = () => (
    <div className="min-h-screen bg-paper-50 dark:bg-leather-900 flex flex-col items-center p-8 animate-fade-in relative overflow-y-auto">
        <button 
          onClick={() => setView(ViewState.HOME)}
          className="absolute top-8 left-8 p-3 bg-transparent text-leather-900 dark:text-paper-200 hover:opacity-70 transition z-10 rounded-full hover:bg-slate-200 dark:hover:bg-leather-800"
        >
          <IconClose className="w-6 h-6" />
        </button>

        <div className="max-w-xl w-full text-left pt-16 pb-12">
           <div className="text-center mb-10">
              <IconBook className="w-12 h-12 mx-auto text-leather-900 dark:text-gold-500 mb-4" />
              <h2 className="text-2xl font-serif font-bold text-leather-900 dark:text-paper-50">Palavras de Vida – Devocional Diário</h2>
           </div>
           
           <div className="font-serif text-lg text-slate-800 dark:text-paper-200 leading-loose space-y-6">
             <p>
               Querido amigo,
             </p>
             <p>
               Gostaríamos de compartilhar uma história que nos inspira a seguir em frente com nossa missão. Um dia, recebemos uma mensagem de <strong>Rafael Borges</strong>, de São Paulo, que nos tocou profundamente.
             </p>
             
             <div className="pl-6 border-l-4 border-gold-500 my-8 py-2 italic text-leather-800 dark:text-gold-100 bg-paper-100 dark:bg-leather-800 pr-4 rounded-r-sm">
               “Parece tão pouco, mas é de coração para esse lindo projeto de vocês.”
             </div>

             <p>
               Para ele, o gesto parecia simples, mas para nós, foi uma verdadeira semente de fé que acendeu a chama dentro de nossa equipe. Aquele simples ato nos motivou a continuar.
             </p>
             <p>
               Hoje, estamos oferecendo a <strong>Bíblia Palavra Viva</strong> gratuitamente para que todos tenham acesso à Palavra pura.
             </p>
             <p>
               Mas queremos construir algo diferente. Não queremos apenas doadores, queremos parceiros de missão.
             </p>
           </div>

           {/* Donation Section - REVISED FLOW */}
           <div className="mt-12 bg-white dark:bg-leather-800 p-8 rounded-sm shadow-lg border border-gold-200 dark:border-gold-900 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-20 h-20 bg-gold-500/10 rounded-bl-full"></div>
             
             <h3 className="font-serif font-bold text-xl text-leather-900 dark:text-gold-500 mb-6 flex items-center gap-2">
               <IconHeart className="w-5 h-5 text-red-500" fill="currentColor" />
               Torne-se um Semeador
             </h3>
             
             <div className="space-y-6 text-slate-600 dark:text-paper-300 mb-8 leading-relaxed font-serif">
                <p>
                  <strong>Primeiro, um convite:</strong> Por favor, compartilhe a "Palavra Viva" de hoje com seus amigos e família. Observe como Deus pode tocar corações através de um simples gesto seu.
                </p>
                <button 
                  onClick={handleShareApp}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#25D366] hover:bg-[#1dbf57] text-white rounded-sm transition-all shadow-md group transform active:scale-95"
                >
                   <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                   <span className="text-xs font-bold uppercase tracking-widest">Enviar Convite Especial</span>
                </button>
                <p>
                  Quando você perceber que estas mensagens estão ajudando as pessoas que você ama — e se sentir que elas têm abençoado a sua vida — então, avalie nos ajudar a manter este projeto vivo.
                </p>
             </div>

             <div className="bg-paper-50 dark:bg-leather-900 p-6 rounded border border-dashed border-leather-300 dark:border-leather-600">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                  <div>
                    <span className="block text-xs uppercase text-slate-400 font-bold tracking-widest mb-1">Chave Pix</span>
                    <code className="font-mono text-lg font-bold text-leather-900 dark:text-paper-100">432451120001-15</code>
                  </div>
                  <button 
                    onClick={handleCopyPix}
                    className="px-6 py-3 bg-leather-900 dark:bg-gold-600 text-white rounded-sm text-xs font-bold uppercase tracking-widest hover:opacity-90 transition shadow-md w-full sm:w-auto"
                  >
                    Copiar Chave
                  </button>
                </div>
                
                <p className="text-xs text-center text-leather-700 dark:text-gold-500 italic mt-2 border-t border-slate-200 dark:border-leather-700 pt-3">
                  "Ao fazer o Pix, se puder, escreva na mensagem o impacto que estas palavras estão tendo em sua vida. Nós lemos cada história com gratidão."
                </p>
             </div>
           </div>

           <div className="mt-12 text-center pb-8">
             <p className="font-serif italic text-leather-800 dark:text-gold-100 text-lg">
               Você faz parte desta história,
             </p>
             <p className="font-serif font-bold text-leather-900 dark:text-paper-50 mt-2">
               Equipe da Bíblia Palavra Viva
             </p>
           </div>
        </div>
    </div>
  );

  const renderEmotionalReading = () => {
    if (!currentEmotionalVerse) return null;

    const isFav = favorites.some(f => f.verse.text === currentEmotionalVerse.text);

    return (
      <div className="min-h-screen bg-paper-50 dark:bg-leather-900 flex flex-col items-center justify-center p-6 animate-fade-in relative">
        <button 
          onClick={() => setView(ViewState.HOME)}
          className="absolute top-8 left-8 p-3 bg-transparent text-leather-900 dark:text-paper-200 hover:opacity-70 transition z-10 rounded-full hover:bg-slate-200 dark:hover:bg-leather-800"
        >
          <IconClose className="w-6 h-6" />
        </button>

        <div className="max-w-2xl w-full text-center">
           <div className="mb-14 animate-in fade-in duration-1000">
             <IconSparkles className="w-8 h-8 mx-auto text-gold-500 mb-6" />
             <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em]">Palavra para hoje</p>
           </div>

           <div className="mb-16 animate-in zoom-in duration-500 delay-100 px-8">
             <h2 className="text-3xl md:text-4xl font-serif font-medium text-leather-900 dark:text-paper-50 leading-relaxed mb-8">
               "{currentEmotionalVerse.text}"
             </h2>
             <div className="inline-block px-6 py-2 border-t border-b border-gold-400/30">
                <p className="text-leather-700 dark:text-gold-500 font-serif italic text-lg">{currentEmotionalVerse.reference}</p>
             </div>
           </div>

           <div className="bg-white dark:bg-leather-800 p-10 rounded-sm shadow-2xl border-t-4 border-leather-900 dark:border-gold-600 mb-12 text-left animate-in slide-in-from-bottom duration-700 delay-200 max-w-lg mx-auto">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <IconSparkles className="w-4 h-4" /> Reflexão
             </h3>
             <p className="text-slate-800 dark:text-paper-200 leading-loose font-serif text-xl">
               {currentEmotionalVerse.reflection}
             </p>
           </div>

           {!isWritingReflection ? (
             <div className="flex justify-center gap-8 w-full animate-in fade-in duration-1000 delay-300">
                <button 
                  onClick={() => toggleEmotionalFavorite()}
                  className="flex flex-col items-center gap-3 text-slate-400 hover:text-red-500 transition group"
                >
                  <div className={`p-4 rounded-full ${isFav ? 'bg-red-50 text-red-500' : 'bg-white dark:bg-leather-800 shadow-md group-hover:scale-110 transition-transform'}`}>
                     <IconHeart fill={isFav ? "currentColor" : "none"} className="w-6 h-6" />
                  </div>
                  <span className="text-xs uppercase tracking-wide font-medium">Salvar</span>
                </button>
                
                <button 
                  onClick={() => setIsWritingReflection(true)}
                  className="flex flex-col items-center gap-3 text-slate-400 hover:text-leather-900 dark:hover:text-paper-100 transition group"
                >
                  <div className="p-4 rounded-full bg-white dark:bg-leather-800 shadow-md group-hover:scale-110 transition-transform">
                    <IconPen className="w-6 h-6" />
                  </div>
                   <span className="text-xs uppercase tracking-wide font-medium">Anotar</span>
                </button>

                <button 
                  onClick={() => handleEmotionSelect(currentEmotionalVerse.emotion)}
                  className="flex flex-col items-center gap-3 text-slate-400 hover:text-leather-900 dark:hover:text-paper-100 transition group"
                >
                  <div className="p-4 rounded-full bg-white dark:bg-leather-800 shadow-md group-hover:scale-110 transition-transform">
                    <IconRefresh className="w-6 h-6" />
                  </div>
                   <span className="text-xs uppercase tracking-wide font-medium">Outro</span>
                </button>
             </div>
           ) : (
             <div className="w-full max-w-lg mx-auto bg-white dark:bg-leather-800 p-8 rounded-sm shadow-xl animate-in fade-in border border-slate-100 dark:border-leather-700">
                <h3 className="text-left font-serif font-bold text-leather-900 dark:text-paper-100 mb-6 text-lg">Notas Pessoais</h3>
                <textarea 
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  placeholder="Escreva aqui..."
                  className="w-full h-40 p-4 bg-paper-50 dark:bg-leather-900 rounded-sm text-slate-800 dark:text-paper-200 resize-none focus:outline-none focus:ring-1 focus:ring-gold-400 mb-6 font-serif text-lg leading-relaxed"
                  autoFocus
                />
                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsWritingReflection(false)}
                    className="flex-1 py-4 text-slate-500 hover:bg-slate-50 dark:hover:bg-leather-700 rounded-sm transition text-xs font-bold uppercase tracking-widest"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={saveReflection}
                    className="flex-1 py-4 bg-leather-900 dark:bg-gold-600 text-white rounded-sm hover:opacity-90 transition text-xs font-bold uppercase tracking-widest shadow-md"
                  >
                    Salvar Nota
                  </button>
                </div>
             </div>
           )}
        </div>
      </div>
    );
  };

  const renderBooks = () => {
    const vt = BOOKS.filter(b => b.testament === 'VT');
    const nt = BOOKS.filter(b => b.testament === 'NT');

    const BookGrid = ({ books }: { books: Book[] }) => (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {books.map(book => (
          <button
            key={book.abbrev}
            onClick={() => handleBookSelect(book)}
            className="p-5 bg-white dark:bg-leather-800 rounded-sm shadow-sm border-l-2 border-transparent hover:border-l-leather-900 dark:hover:border-l-gold-500 transition-all text-left group hover:shadow-md"
          >
            <span className="font-serif font-semibold text-slate-700 dark:text-paper-200 group-hover:text-leather-900 dark:group-hover:text-gold-400 transition-colors text-lg">{book.name}</span>
          </button>
        ))}
      </div>
    );

    return (
      <div className="p-8 pb-32 bg-paper-50 dark:bg-leather-900 min-h-screen">
        <div className="flex items-center mb-12 pt-4 border-b border-slate-200 dark:border-leather-700 pb-6 max-w-4xl mx-auto">
          <button onClick={() => setView(ViewState.HOME)} className="p-2 -ml-2 text-slate-400 hover:text-leather-900 dark:hover:text-gold-500 transition">
            <IconChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-serif font-bold ml-4 text-leather-900 dark:text-paper-50">Índice Bíblico</h2>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 pl-1">Antigo Testamento</h3>
          <BookGrid books={vt} />
          
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-16 mb-6 pl-1">Novo Testamento</h3>
          <BookGrid books={nt} />
        </div>
      </div>
    );
  };

  const renderChapters = () => (
    <div className="p-8 pb-32 bg-paper-50 dark:bg-leather-900 min-h-screen">
       <div className="flex items-center mb-12 pt-4 border-b border-slate-200 dark:border-leather-700 pb-6 max-w-4xl mx-auto">
          <button onClick={() => setView(ViewState.BOOKS)} className="p-2 -ml-2 text-slate-400 hover:text-leather-900 dark:hover:text-gold-500 transition">
            <IconChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-serif font-bold ml-4 text-leather-900 dark:text-paper-50">{currentBook?.name}</h2>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-5 md:grid-cols-8 gap-4">
          {Array.from({ length: currentBook?.chapters || 0 }, (_, i) => i + 1).map(chap => (
            <button
              key={chap}
              onClick={() => handleChapterSelect(chap)}
              className="aspect-square flex items-center justify-center bg-white dark:bg-leather-800 rounded-sm shadow-sm border border-transparent hover:border-leather-900 dark:hover:border-gold-500 font-serif font-bold text-xl text-slate-600 dark:text-paper-200 hover:bg-paper-100 dark:hover:bg-leather-700 transition"
            >
              {chap}
            </button>
          ))}
        </div>
    </div>
  );

  const renderReader = () => {
    if (isLoading) {
      return (
        <div className="h-screen flex items-center justify-center bg-paper-50 dark:bg-leather-900">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-leather-900 dark:border-gold-500 mb-6"></div>
            <p className="text-lg text-slate-400 font-serif italic">Carregando Escrituras...</p>
          </div>
        </div>
      );
    }

    const fontSizeClass = [
      'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl'
    ][settings.fontSize - 1];

    const fontFamilyClass = settings.fontFamily === 'serif' ? 'font-serif' : 'font-sans';

    return (
      <div className={`pb-32 min-h-screen transition-colors duration-500 ${settings.theme === 'sepia' ? 'bg-[#f4ecd8] text-[#5b4636]' : 'bg-paper-50 dark:bg-leather-900'}`}>
        {/* Reader Header */}
        <div className="sticky top-0 z-10 bg-paper-50/95 dark:bg-leather-900/95 backdrop-blur-md border-b border-slate-100 dark:border-leather-800 px-6 py-4 flex items-center justify-between shadow-sm transition-all">
           <div className="flex items-center">
            <button onClick={() => setView(ViewState.CHAPTERS)} className="p-2 -ml-2 text-slate-500 hover:text-leather-900 dark:text-leather-400 dark:hover:text-gold-500 transition">
              <IconChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="font-serif font-bold ml-3 text-xl text-leather-900 dark:text-paper-100">{currentBook?.name} {currentChapter}</h2>
           </div>
           
           <div className="flex gap-2">
             <button onClick={() => changeFontSize(-1)} className="p-2 text-slate-400 hover:text-leather-900 dark:hover:text-gold-500 transition font-serif">A-</button>
             <button onClick={() => changeFontSize(1)} className="p-2 text-slate-400 hover:text-leather-900 dark:hover:text-gold-500 transition font-serif">A+</button>
             <button onClick={toggleTheme} className="p-2 text-slate-400 hover:text-leather-900 dark:hover:text-gold-500 transition">
               {settings.theme === 'dark' ? <IconSun className="w-5 h-5" /> : <IconMoon className="w-5 h-5" />}
             </button>
           </div>
        </div>

        {/* Text Content */}
        <div className={`max-w-3xl mx-auto p-10 md:p-14 ${fontFamilyClass} ${fontSizeClass} leading-loose text-slate-900 dark:text-paper-100 text-justify`}>
          {chapterContent?.verses.map((verse) => {
            const isFav = favorites.some(f => 
              f.verse.book_name === verse.book_name && 
              f.verse.chapter === verse.chapter && 
              f.verse.verse === verse.verse
            );

            return (
              <span 
                key={verse.verse}
                onClick={() => setSelectedVerse(verse)}
                className={`cursor-pointer hover:bg-gold-50 dark:hover:bg-leather-800 rounded px-1 transition duration-200 ${isFav ? 'bg-gold-100 dark:bg-gold-900/20 text-leather-900 dark:text-gold-100' : ''}`}
              >
                <sup className="text-[0.6em] font-bold text-gold-600 dark:text-gold-500 mr-2 select-none opacity-80">{verse.verse}</sup>
                {verse.text}{' '}
              </span>
            );
          })}
        </div>

        {/* Reader Navigation */}
        <div className="flex justify-between px-10 py-12 max-w-3xl mx-auto border-t border-slate-100 dark:border-leather-800 mt-8">
          <button 
            onClick={prevChapter}
            disabled={currentChapter <= 1}
            className={`px-8 py-4 rounded-sm font-serif font-medium transition text-lg ${currentChapter <= 1 ? 'opacity-0' : 'text-slate-500 hover:text-leather-900 dark:hover:text-gold-500'}`}
          >
            ← Anterior
          </button>
          <button 
            onClick={nextChapter}
            className="px-8 py-4 rounded-sm bg-leather-900 dark:bg-gold-600 text-white font-serif font-medium shadow-lg hover:opacity-90 transition text-lg"
          >
            Próximo →
          </button>
        </div>
      </div>
    );
  };

  const renderFavorites = () => (
    <div className="p-8 pb-32 bg-paper-50 dark:bg-leather-900 min-h-screen">
      <div className="flex items-center mb-12 pt-4 border-b border-slate-200 dark:border-leather-700 pb-6 max-w-4xl mx-auto">
          <button onClick={() => setView(ViewState.HOME)} className="p-2 -ml-2 text-slate-400 hover:text-leather-900 dark:hover:text-gold-500 transition">
            <IconChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-serif font-bold ml-4 text-leather-900 dark:text-paper-50">Versículos Guardados</h2>
      </div>

      <div className="max-w-4xl mx-auto">
        {favorites.length === 0 ? (
          <div className="text-center py-40 text-slate-300 dark:text-leather-700">
            <IconHeart className="w-16 h-16 mx-auto mb-6 opacity-50 stroke-1" />
            <p className="font-serif italic text-xl">Nenhum versículo salvo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favorites.map(fav => (
              <div key={fav.id} className="bg-white dark:bg-leather-800 p-8 rounded-sm shadow-sm border-l-4 border-l-gold-500 relative group transition hover:shadow-lg">
                 <button 
                    onClick={() => toggleFavorite(fav.verse)}
                    className="absolute top-6 right-6 text-slate-200 hover:text-red-500 transition"
                  >
                    <IconHeart fill="currentColor" className="w-6 h-6" />
                 </button>
                 <p className="font-serif text-xl text-leather-900 dark:text-paper-100 mb-6 leading-relaxed">"{fav.verse.text}"</p>
                 <div className="flex justify-between items-center text-sm border-t border-slate-50 dark:border-leather-700 pt-6">
                   <span className="font-bold text-slate-500 dark:text-gold-500 uppercase tracking-widest text-xs">
                     {fav.verse.book_name} {fav.verse.chapter}:{fav.verse.verse}
                   </span>
                   <span className="text-slate-300 dark:text-leather-600 text-xs italic font-serif">
                     {new Date(fav.timestamp).toLocaleDateString()}
                   </span>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Bottom Navigation - Glassmorphism adjusted
  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 glass-nav flex justify-around items-center h-20 z-40 px-6 border-t border-slate-200 dark:border-leather-700 max-w-3xl mx-auto">
      <button onClick={() => setView(ViewState.HOME)} className={`flex flex-col items-center gap-1 transition duration-300 ${view === ViewState.HOME || view === ViewState.EMOTIONAL_READING || view === ViewState.ABOUT || view === ViewState.DAILY_MESSAGE || view === ViewState.PLAN_B ? 'text-leather-900 dark:text-gold-500' : 'text-slate-400 hover:text-slate-600'}`}>
        <IconBook className="w-6 h-6" />
        <span className="text-[10px] uppercase font-bold tracking-widest">Início</span>
      </button>
      <button onClick={() => setView(ViewState.BOOKS)} className={`flex flex-col items-center gap-1 transition duration-300 ${view === ViewState.BOOKS || view === ViewState.CHAPTERS || view === ViewState.READER ? 'text-leather-900 dark:text-gold-500' : 'text-slate-400 hover:text-slate-600'}`}>
        <IconSearch className="w-6 h-6" />
        <span className="text-[10px] uppercase font-bold tracking-widest">Bíblia</span>
      </button>
      <button onClick={() => setView(ViewState.FAVORITES)} className={`flex flex-col items-center gap-1 transition duration-300 ${view === ViewState.FAVORITES ? 'text-leather-900 dark:text-gold-500' : 'text-slate-400 hover:text-slate-600'}`}>
        <IconHeart className="w-6 h-6" />
        <span className="text-[10px] uppercase font-bold tracking-widest">Favoritos</span>
      </button>
    </div>
  );

  // Verse Interaction Modal
  const VerseModal = () => {
    if (!selectedVerse) return null;

    const isFav = favorites.some(f => 
      f.verse.book_name === selectedVerse.book_name && 
      f.verse.chapter === selectedVerse.chapter && 
      f.verse.verse === selectedVerse.verse
    );

    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-leather-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-leather-900 w-full max-w-lg rounded-sm p-10 shadow-2xl animate-in slide-in-from-bottom duration-300 border-t-4 border-gold-500">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xs font-bold text-gold-600 dark:text-gold-500 uppercase tracking-widest">
                {selectedVerse.book_name} {selectedVerse.chapter}:{selectedVerse.verse}
              </h3>
            </div>
            <button onClick={() => setSelectedVerse(null)} className="text-slate-400 hover:text-slate-800 dark:hover:text-white transition">
              <IconClose className="w-6 h-6" />
            </button>
          </div>

          <p className="font-serif text-2xl text-leather-900 dark:text-paper-100 mb-10 leading-relaxed">
            "{selectedVerse.text}"
          </p>

          {aiExplanation && (
             <div className="mb-8 p-6 bg-paper-100 dark:bg-black/30 rounded-sm border-l-4 border-gold-500 animate-in fade-in">
               <div className="flex items-center gap-2 mb-3 text-leather-700 dark:text-gold-500">
                 <IconSparkles className="w-4 h-4" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Comentário</span>
               </div>
               <p className="text-base text-slate-700 dark:text-paper-200 leading-relaxed text-justify font-serif">{aiExplanation}</p>
             </div>
          )}

          <div className="grid grid-cols-3 gap-6">
             <button 
                onClick={() => toggleFavorite(selectedVerse)}
                className={`flex flex-col items-center justify-center p-4 rounded-sm border transition duration-200 ${isFav ? 'bg-red-50 border-red-100 text-red-500' : 'bg-paper-50 dark:bg-leather-800 border-transparent text-slate-500 dark:text-paper-300 hover:bg-paper-100'}`}
             >
                <IconHeart fill={isFav ? "currentColor" : "none"} className="mb-2 w-6 h-6" />
                <span className="text-[10px] uppercase tracking-widest font-bold">{isFav ? 'Salvo' : 'Salvar'}</span>
             </button>
             
             <button 
                onClick={() => shareVerse(selectedVerse.text, `${selectedVerse.book_name} ${selectedVerse.chapter}:${selectedVerse.verse}`)}
                className="flex flex-col items-center justify-center p-4 rounded-sm bg-paper-50 dark:bg-leather-800 text-slate-500 dark:text-paper-300 hover:bg-paper-100 dark:hover:bg-leather-700 transition"
             >
                <IconShare className="mb-2 w-6 h-6" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Copiar</span>
             </button>

             <button 
                onClick={() => handleExplainVerse(selectedVerse)}
                disabled={isAiLoading}
                className="flex flex-col items-center justify-center p-4 rounded-sm bg-gold-50 dark:bg-gold-900/20 text-leather-900 dark:text-gold-400 hover:bg-gold-100 dark:hover:bg-gold-900/40 transition"
             >
                {isAiLoading ? (
                  <div className="w-6 h-6 border-2 border-leather-900 border-t-transparent rounded-full animate-spin mb-2"></div>
                ) : (
                  <IconSparkles className="mb-2 w-6 h-6" />
                )}
                <span className="text-[10px] uppercase tracking-widest font-bold">Explicar</span>
             </button>
          </div>
        </div>
      </div>
    );
  };

  // MAIN RENDER SWITCH
  if (showWelcome) {
    return renderWelcome();
  }

  return (
    <div className="min-h-screen font-sans selection:bg-gold-200 selection:text-leather-900 bg-paper-50 dark:bg-leather-900">
      <div className="max-w-3xl mx-auto min-h-screen bg-paper-50 dark:bg-leather-900 relative shadow-2xl overflow-hidden border-x border-slate-200 dark:border-leather-800">
        {view === ViewState.HOME && renderHome()}
        {view === ViewState.BOOKS && renderBooks()}
        {view === ViewState.CHAPTERS && renderChapters()}
        {view === ViewState.READER && renderReader()}
        {view === ViewState.FAVORITES && renderFavorites()}
        {view === ViewState.EMOTIONAL_READING && renderEmotionalReading()}
        {view === ViewState.DAILY_MESSAGE && renderDailyMessage()}
        {view === ViewState.ABOUT && renderAbout()}
        {view === ViewState.PLAN_B && renderPlanB()}
        
        <BottomNav />
        <VerseModal />
      </div>
    </div>
  );
}