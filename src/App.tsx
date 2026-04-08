/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform, animate } from 'motion/react';
import { 
  X, RotateCcw, Search, ArrowUp, Sparkles, 
  History, Trash2, Copy, Check, Share2,
  ChevronRight, Info, Settings, Command, Layout,
  Settings2, Palette, Keyboard, MousePointer2, Target,
  Shuffle, HelpCircle, AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface HistoryItem {
  id: string;
  result: string;
  options: string[];
  timestamp: number;
}

const SwarmItem: React.FC<{ 
  opt: string; 
  index: number; 
  total: number; 
  drawProgress: any; 
  isWinner: boolean;
}> = ({ opt, index, total, drawProgress, isWinner }) => {
  // Unique random seeds for each item to create natural variety
  const seed = useRef({
    radius: 120 + Math.random() * 80,
    phi: Math.random() * Math.PI * 2,
    theta: Math.random() * Math.PI,
    speed: 0.5 + Math.random() * 1.5,
    offset: Math.random() * 100
  });

  // Orbital motion logic
  const angle = useTransform(drawProgress, (p: number) => p * 15 * seed.current.speed + seed.current.phi);
  const radius = useTransform(drawProgress, [0, 0.8, 1], [seed.current.radius, 40, isWinner ? 0 : 200]);
  
  const x = useTransform([radius, angle], ([r, a]: any) => Math.cos(a) * r);
  const y = useTransform([radius, angle], ([r, a]: any) => Math.sin(a) * r);
  const z = useTransform(drawProgress, [0, 0.5, 1], [isWinner ? -200 : 0, 0, isWinner ? 100 : -500]);
  
  const opacity = useTransform(drawProgress, (p: number) => {
    if (isWinner) return 1;
    return Math.max(0, 1 - p * 1.2);
  });
  
  const scale = useTransform(drawProgress, (p: number) => {
    if (isWinner) return 0.6 + p * 0.4;
    return 0.8 - p * 0.6;
  });

  const blur = useTransform(drawProgress, [0, 0.8, 1], [
    `blur(${2 + Math.random() * 4}px)`, 
    'blur(1px)', 
    isWinner ? 'blur(0px)' : 'blur(10px)'
  ]);

  return (
    <motion.div
      style={{ 
        x, y, z, 
        opacity, 
        scale, 
        filter: blur,
        position: 'absolute',
        transformStyle: 'preserve-3d'
      }}
      className={`font-bold tracking-tight whitespace-nowrap pointer-events-none ${isWinner ? 'text-black z-50' : 'text-black/20 z-10'}`}
    >
      {opt}
    </motion.div>
  );
};

const MOODS = [
  { name: 'Classic', zhName: '经典', color: 'bg-black', text: 'text-black', aura: 'bg-gray-100', hex: '#000000' },
  { name: 'Vibrant', zhName: '活力', color: 'bg-orange-500', text: 'text-orange-500', aura: 'bg-orange-50', hex: '#f97316' },
  { name: 'Ocean', zhName: '海洋', color: 'bg-cyan-500', text: 'text-cyan-500', aura: 'bg-cyan-50', hex: '#06b6d4' },
  { name: 'Nature', zhName: '自然', color: 'bg-emerald-500', text: 'text-emerald-500', aura: 'bg-emerald-50', hex: '#10b981' },
  { name: 'Warm', zhName: '温暖', color: 'bg-amber-500', text: 'text-amber-500', aura: 'bg-amber-50', hex: '#f59e0b' },
];

const TRANSLATIONS = {
  en: {
    title: "The art of",
    subtitle: "choosing.",
    description: "A refined algorithm for the modern mind. Simple, elegant, and definitive.",
    shortcutFocus: "Focus",
    shortcutDraw: "Draw",
    shortcutLabel: "Shortcut",
    drawNow: "Draw Now",
    shuffling: "Shuffling...",
    addMore: "Add {n} more",
    readyToDecide: "Ready to decide",
    thePathChosen: "The Path Chosen",
    tryAgain: "Try Again",
    tools: "Tools",
    quickAddGroups: "Quick Add Groups",
    numberRange: "Number Range",
    start: "Start",
    end: "End",
    currentOptions: "Current Options",
    presetNamePlaceholder: "Preset Name...",
    saveGroup: "Save Group",
    clearAll: "Clear all",
    savedGroups: "Saved Groups",
    noSavedGroups: "No Saved Groups",
    history: "History",
    empty: "Empty",
    reset: "Reset",
    eliminationMode: "Elimination Mode",
    eliminationDesc: "Remove winner from list after draw",
    noRepeat: "No Consecutive Repeats",
    bulkEdit: "Bulk Edit",
    bulkEditDesc: "Paste multiple items (one per line)",
    save: "Save",
    cancel: "Cancel",
    confirmClear: "Are you sure you want to clear all options?",
    confirmResetHistory: "Are you sure you want to reset all history?",
    confirmDeletePreset: "Are you sure you want to delete this group?",
    confirm: "Confirm",
    inputPlaceholder: "What's on your mind?",
    shuffle: "Shuffle",
    placeholders: [
      "What's on your mind?",
      "Need a decision?",
      "Type something here...",
      "Lunch or Dinner?",
      "Let's draw a winner!",
      "Type and press Enter"
    ],
    signIn: "Sign In",
    items: "items",
    lunch: "Lunch",
    movie: "Movie",
    game: "Game",
    lunchItems: ['Sushi', 'Burger', 'Salad', 'Pizza', 'Pasta'],
    movieItems: ['Action', 'Comedy', 'Horror', 'Sci-Fi', 'Drama'],
    gameItems: ['Valorant', 'LoL', 'Minecraft', 'CS2', 'Apex'],
    python: "Python",
    pythonItems: ['Requests', 'Loguru', 'Click', 'Typer', 'Pydantic', 'NumPy', 'Pandas', 'SciPy', 'Statsmodels', 'SymPy', 'Matplotlib', 'Seaborn', 'Plotly', 'NetworkX', 'XGBoost', 'LightGBM', 'PyTorch', 'CausalML', 'Optuna', 'Pyomo', 'CVXPY', 'Backtrader', 'Gymnasium', 'Scikitlearn'],
  },
  zh: {
    title: "抉择的",
    subtitle: "艺术。",
    description: "为现代思维打造的精炼算法。简单、优雅、果断。",
    shortcutFocus: "聚焦",
    shortcutDraw: "抽签",
    shortcutLabel: "快捷键",
    drawNow: "立即抽签",
    shuffling: "抽取中...",
    addMore: "再添加 {n} 个",
    readyToDecide: "准备就绪",
    thePathChosen: "最终抉择",
    tryAgain: "再试一次",
    tools: "工具箱",
    quickAddGroups: "快速添加组",
    numberRange: "数字范围",
    start: "开始",
    end: "结束",
    currentOptions: "当前选项",
    presetNamePlaceholder: "预设名称...",
    saveGroup: "保存组合",
    clearAll: "清空全部",
    savedGroups: "已存组合",
    noSavedGroups: "暂无保存组合",
    history: "历史记录",
    empty: "空空如也",
    reset: "重集",
    eliminationMode: "剔除模式",
    eliminationDesc: "抽中后自动从列表中移除",
    noRepeat: "避免连续重复",
    bulkEdit: "批量编辑",
    bulkEditDesc: "粘贴多个选项（每行一个）",
    save: "保存",
    cancel: "取消",
    confirmClear: "确定要清空所有选项吗？",
    confirmResetHistory: "确定要重置所有历史记录吗？",
    confirmDeletePreset: "确定要删除这个组合吗？",
    confirm: "确定",
    inputPlaceholder: "在想什么？",
    shuffle: "随机打乱",
    placeholders: [
      "在想什么？",
      "需要做个决定吗？",
      "在这里输入内容...",
      "午餐还是晚餐？",
      "让我们抽个奖吧！",
      "输入并按回车"
    ],
    signIn: "登录",
    items: "个项目",
    lunch: "午餐",
    movie: "电影",
    game: "游戏",
    lunchItems: ['寿司', '汉堡', '沙拉', '披萨', '意面'],
    movieItems: ['动作', '喜剧', '恐怖', '科幻', '剧情'],
    gameItems: ['无畏契约', '英雄联盟', '我的世界', 'CS2', 'Apex'],
    python: "Python",
    pythonItems: ['Requests', 'Loguru', 'Click', 'Typer', 'Pydantic', 'NumPy', 'Pandas', 'SciPy', 'Statsmodels', 'SymPy', 'Matplotlib', 'Seaborn', 'Plotly', 'NetworkX', 'XGBoost', 'LightGBM', 'PyTorch', 'CausalML', 'Optuna', 'Pyomo', 'CVXPY', 'Backtrader', 'Gymnasium', 'Scikitlearn'],
  }
};

interface Preset {
  id: string;
  name: string;
  items: string[];
}

const FloatingBackground = ({ mood }: { mood: any }) => {
  const symbols = [Target, Settings2, Sparkles, Shuffle, HelpCircle, Command, MousePointer2, Layout];
  return (
    <div className="fixed inset-0 -z-20 pointer-events-none overflow-hidden">
      {Array.from({ length: 12 }).map((_, i) => {
        const Symbol = symbols[i % symbols.length];
        const size = 20 + (i * 5) % 40;
        return (
          <motion.div
            key={i}
            initial={{ 
              x: `${(i * 137.5) % 100}%`, 
              y: "110%",
              rotate: i * 45,
              opacity: 0
            }}
            animate={{ 
              y: "-10%",
              rotate: i * 45 + 360,
              opacity: [0, 0.03, 0.03, 0]
            }}
            transition={{ 
              duration: 20 + (i % 5) * 5, 
              repeat: Infinity, 
              ease: "linear",
              delay: -(i * 3)
            }}
            className={`absolute ${mood.text}`}
          >
            <Symbol size={size} strokeWidth={1} />
          </motion.div>
        );
      })}
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.015]" 
        style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />
    </div>
  );
};

export default function App() {
  const [options, setOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cyclingOption, setCyclingOption] = useState<string | null>(null);
  const [mood, setMood] = useState(MOODS[0]);
  const [lang, setLang] = useState<'en' | 'zh'>('en');
  const [eliminationMode, setEliminationMode] = useState(false);
  const [noConsecutiveRepeat, setNoConsecutiveRepeat] = useState(true);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [modal, setModal] = useState<{ 
    show: boolean; 
    title: string; 
    type?: 'confirm' | 'bulk';
    value?: string;
    onConfirm: (val?: string) => void; 
  }>({ show: false, title: '', onConfirm: () => {} });
  
  const t = (key: keyof typeof TRANSLATIONS.en) => TRANSLATIONS[lang][key];

  // Cycle placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % (TRANSLATIONS[lang].placeholders.length));
    }, 2000);
    return () => clearInterval(interval);
  }, [lang]);

  const quickSuggestions = [
    { label: t('lunch'), items: t('lunchItems') as string[] },
    { label: t('movie'), items: t('movieItems') as string[] },
    { label: t('game'), items: t('gameItems') as string[] },
    { label: t('python'), items: t('pythonItems') as string[] },
  ];
  
  // New States
  const [presets, setPresets] = useState<Preset[]>([]);
  const [presetName, setPresetName] = useState('');
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(10);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const stageControls = useAnimation();
  const drumControls = useAnimation();
  const [showFlash, setShowFlash] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);
  
  // 3D Tilt Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && options.length >= 2 && !isDrawing) {
        e.preventDefault();
        draw();
      }
      if (e.key === 'Escape') {
        setInputValue('');
        setIsFocused(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [options, isDrawing]);

  // Load data from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('dia_draw_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    
    const savedPresets = localStorage.getItem('dia_draw_presets');
    if (savedPresets) setPresets(JSON.parse(savedPresets));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('dia_draw_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('dia_draw_presets', JSON.stringify(presets));
  }, [presets]);

  const addOption = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputValue.trim()) {
      // Support batch add by splitting with commas or newlines
      const newItems = inputValue
        .split(/[,\n，]/)
        .map(item => item.trim())
        .filter(item => item && !options.includes(item));
      
      if (newItems.length > 0) {
        setOptions([...options, ...newItems]);
        setInputValue('');
      }
    }
  };

  const quickAdd = (items: string[]) => {
    const newOptions = [...new Set([...options, ...items])];
    setOptions(newOptions);
  };

  const generateRange = () => {
    const start = Math.min(rangeStart, rangeEnd);
    const end = Math.max(rangeStart, rangeEnd);
    const count = end - start + 1;
    if (count > 100) return; // Limit to 100 for performance
    
    const rangeItems = Array.from({ length: count }, (_, i) => (start + i).toString());
    const newOptions = [...new Set([...options, ...rangeItems])];
    setOptions(newOptions);
  };

  const savePreset = () => {
    if (!presetName.trim() || options.length === 0) return;
    const newPreset: Preset = {
      id: Math.random().toString(36).substr(2, 9),
      name: presetName.trim(),
      items: [...options]
    };
    setPresets([newPreset, ...presets]);
    setPresetName('');
  };

  const loadPreset = (preset: Preset) => {
    setOptions(preset.items);
  };

  const deletePreset = (id: string) => {
    setModal({
      show: true,
      title: t('confirmDeletePreset'),
      onConfirm: () => {
        setPresets(presets.filter(p => p.id !== id));
        setModal({ show: false, title: '', onConfirm: () => {} });
      }
    });
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const shuffleOptions = () => {
    setOptions([...options].sort(() => Math.random() - 0.5));
  };

  const draw = async () => {
    if (options.length < 2) return;
    
    setIsDrawing(true);
    setResult(null);
    setShowResult(false);

    // Pick winner immediately for the animation to know
    let winnerIdx;
    if (noConsecutiveRepeat && options.length > 1 && result) {
      const otherIndices = options.map((_, i) => i).filter(i => options[i] !== result);
      winnerIdx = otherIndices[Math.floor(Math.random() * otherIndices.length)];
    } else {
      winnerIdx = Math.floor(Math.random() * options.length);
    }
    
    const winner = options[winnerIdx];
    setWinnerIndex(winnerIdx);

    // Stage reaction
    if (isMounted.current) {
      stageControls.start({
        scale: [1, 0.95, 1.05, 1],
        rotateX: [0, 10, -5, 0],
        transition: { duration: 3.5, ease: [0.16, 1, 0.3, 1] }
      });
    }

    // Quantum Decrypt Animation
    let currentDelay = 50;
    let elapsed = 0;
    const maxDuration = 3000;

    const cycle = () => {
      if (!isMounted.current) return;

      setCyclingOption(options[Math.floor(Math.random() * options.length)]);
      stageControls.start({ y: [0, -2, 0], transition: { duration: 0.05 } });

      elapsed += currentDelay;
      currentDelay = currentDelay * 1.15; // Slow down exponentially

      if (elapsed < maxDuration) {
        setTimeout(cycle, currentDelay);
      } else {
        // Finish
        setCyclingOption(winner);
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 400);
        
        setResult(winner);
        setIsDrawing(false);
        setShowResult(true);
        setWinnerIndex(null);
        setCyclingOption(null);
        
        if (eliminationMode) {
          setOptions(prev => prev.filter(opt => opt !== winner));
        }
        
        const historyItem: HistoryItem = {
          id: Math.random().toString(36).substr(2, 9),
          result: winner,
          options: [...options],
          timestamp: Date.now()
        };
        setHistory([historyItem, ...history.slice(0, 19)]);

        stageControls.start({
          scale: [1, 1.1, 1],
          transition: { duration: 0.5, ease: "easeInOut" }
        });

        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: [mood.hex, '#ffffff'],
          ticks: 300,
          gravity: 1.2,
          scalar: 0.75
        });
      }
    };
    
    setTimeout(cycle, currentDelay);
  };

  const reset = () => {
    setModal({
      show: true,
      title: t('confirmClear'),
      onConfirm: () => {
        setOptions([]);
        setResult(null);
        setShowResult(false);
        setModal({ show: false, title: '', onConfirm: () => {} });
      }
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearHistory = () => {
    setModal({
      show: true,
      title: t('confirmResetHistory'),
      onConfirm: () => {
        setHistory([]);
        setModal({ show: false, title: '', onConfirm: () => {} });
      }
    });
  };

  const shareResult = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Dia Draw Result',
        text: `I just drew "${result}" using Dia Draw!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      copyToClipboard(result || '');
    }
  };

  const probability = options.length > 0 ? (100 / options.length).toFixed(1) : '0';

  return (
    <div className={`min-h-screen flex flex-col items-center selection:bg-black selection:text-white transition-colors duration-700`}>
      {/* Navbar */}
      <nav className="w-full max-w-7xl flex items-center justify-between py-8 px-8 md:px-12 z-50">
        <div className="flex items-center gap-3 font-bold text-xl tracking-tight group cursor-pointer">
          <div className={`w-10 h-10 ${mood.color} rounded-xl flex items-center justify-center text-white transition-all group-hover:rotate-12 shadow-lg`}>
            <Target size={20} />
          </div>
          <span className="hidden sm:inline">Dia Draw</span>
        </div>
        
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
              className="px-3 py-2 rounded-xl bg-black/5 hover:bg-black/10 transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2"
            >
              <span>{lang === 'en' ? 'EN' : 'ZH'}</span>
            </button>

            {/* Mood Selector */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/5 mr-2">
              {MOODS.map((m) => (
                <button
                  key={m.name}
                  onClick={() => setMood(m)}
                  className={`w-4 h-4 rounded-full transition-all ${m.color} ${mood.name === m.name ? 'scale-125 ring-2 ring-black/10 ring-offset-2' : 'opacity-40 hover:opacity-100'}`}
                  title={lang === 'en' ? m.name : m.zhName}
                />
              ))}
            </div>
          
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`p-3 rounded-xl transition-all ${showHistory ? 'bg-black text-white' : 'hover:bg-black/5 text-black/40 hover:text-black'}`}
          >
            <History size={20} />
          </button>
          <button className="p-3 rounded-xl hover:bg-black/5 text-black/40 hover:text-black transition-all">
            <Settings size={20} />
          </button>
          <div className="w-px h-6 bg-black/10 mx-2" />
          <div className="flex items-center gap-4 mr-4">
            <button 
              onClick={() => setNoConsecutiveRepeat(!noConsecutiveRepeat)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all border ${noConsecutiveRepeat ? 'bg-black text-white border-black' : 'bg-transparent text-black/40 border-black/10 hover:border-black/20'}`}
              title={t('noRepeat')}
            >
              <RotateCcw size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider hidden md:inline">{t('noRepeat')}</span>
            </button>
            <button 
              onClick={() => setEliminationMode(!eliminationMode)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all border ${eliminationMode ? 'bg-black text-white border-black' : 'bg-transparent text-black/40 border-black/10 hover:border-black/20'}`}
              title={t('eliminationDesc')}
            >
              <Trash2 size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider hidden md:inline">{t('eliminationMode')}</span>
            </button>
          </div>
          <button className="px-6 py-2.5 rounded-full bg-black/5 hover:bg-black/10 transition-all text-sm font-semibold">
            {t('signIn')}
          </button>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 px-8 pb-32">
        {/* Left Column: Drawing Stage */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-2xl flex flex-col items-center text-center pt-12">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="arc-pill mb-8 group"
            >
              <span className="opacity-50">{t('shortcutLabel')}:</span> <span className="kbd ml-1">⌘</span> <span className="kbd">K</span> {lang === 'en' ? 'to' : ''} {t('shortcutFocus').toLowerCase()} <ChevronRight size={14} className="inline ml-1 group-hover:translate-x-1 transition-transform" />
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`font-bold mb-8 transition-all duration-500 ${
                lang === 'zh' 
                  ? 'text-5xl md:text-7xl tracking-tight leading-[1.2]' 
                  : 'text-6xl md:text-8xl tracking-tighter leading-[0.85]'
              }`}
            >
              {t('title')} <br />
              <span className="text-black/10">{t('subtitle')}</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`text-black/40 mb-16 max-w-md transition-all duration-500 ${
                lang === 'zh'
                  ? 'text-base md:text-lg leading-relaxed tracking-wide'
                  : 'text-lg leading-normal'
              }`}
            >
              {t('description')}
            </motion.p>

            {/* Drawing Area with 3D Tilt */}
            <div className="perspective-1000 w-full max-w-md">
              <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY }}
                animate={stageControls}
                className="relative w-full aspect-[4/3] rounded-[56px] glass-panel flex flex-col items-center justify-center p-12 overflow-hidden preserve-3d transition-shadow duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)]"
              >
                <AnimatePresence>
                  {showFlash && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.8, 0] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 bg-white z-50 pointer-events-none"
                    />
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {!showResult ? (
                    <motion.div
                      key="drawing"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      className="flex flex-col items-center"
                    >
                      <div className={`relative w-32 h-32 mb-8 ${mood.text}`}>
                        {/* Orbiting Rings */}
                        <motion.div 
                          animate={{ 
                            rotate: 360,
                            scale: isDrawing ? [1, 1.1, 1] : 1
                          }}
                          transition={{ 
                            rotate: { duration: isDrawing ? 1.5 : 10, repeat: Infinity, ease: "linear" },
                            scale: { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
                          }}
                          className={`absolute inset-[-15px] border border-black/[0.03] rounded-[38px] ${isDrawing ? mood.text + ' opacity-20 border-current' : ''}`}
                        />
                        <motion.div 
                          animate={{ 
                            rotate: -360,
                            scale: isDrawing ? [1, 1.05, 1] : 1
                          }}
                          transition={{ 
                            rotate: { duration: isDrawing ? 2.5 : 15, repeat: Infinity, ease: "linear" },
                            scale: { duration: 0.7, repeat: Infinity, ease: "easeInOut", delay: 0.2 }
                          }}
                          className={`absolute inset-[-30px] border border-black/[0.02] rounded-[48px] ${isDrawing ? mood.text + ' opacity-10 border-current' : ''}`}
                        />

                        {/* The Orb Mask */}
                        <div className="absolute inset-0 rounded-full bg-white shadow-[inset_0_4px_20px_rgba(0,0,0,0.04)] border border-black/5 overflow-hidden flex items-center justify-center">
                          {isDrawing ? (
                            <motion.div
                              key={cyclingOption}
                              initial={{ opacity: 0.5, scale: 0.8, filter: "blur(4px)" }}
                              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                              transition={{ duration: 0.1 }}
                              className="text-2xl font-bold text-center px-4 line-clamp-3 break-words opacity-80"
                            >
                              {cyclingOption}
                            </motion.div>
                          ) : (
                            <Target size={48} className="opacity-20" />
                          )}
                        </div>

                        {/* Glass Reflection */}
                        <div className="absolute inset-0 rounded-full pointer-events-none bg-gradient-to-tr from-transparent via-white/20 to-white/60 opacity-80 z-20" />
                      </div>

                      {isDrawing ? (
                        <div className="h-24 w-full flex flex-col items-center justify-center mb-8 relative">
                          <div className="text-[10px] font-bold text-black/20 uppercase tracking-[0.5em] animate-pulse">
                            {t('shuffling')}
                          </div>
                        </div>
                      ) : (
                        <div className="mb-8">
                          <button 
                            onClick={draw}
                            disabled={options.length < 2 || isDrawing}
                            className="arc-button-primary group relative overflow-hidden"
                          >
                            <span className="relative z-10">{isDrawing ? t('shuffling') : t('drawNow')}</span>
                            <motion.div 
                              className={`absolute inset-0 ${mood.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                            />
                          </button>
                        </div>
                      )}
                      
                      <p className="mt-6 text-[10px] font-bold text-black/20 uppercase tracking-[0.4em]">
                        {options.length < 2 ? t('addMore').replace('{n}', (2 - options.length).toString()) : t('readyToDecide')}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex flex-col items-center w-full relative"
                    >
                      {/* Result Background Glow */}
                      <motion.div 
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.1, 0.2, 0.1]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className={`absolute inset-0 ${mood.color} blur-[100px] rounded-full -z-10`}
                      />

                      <div className="relative mb-8">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          className={`h-1.5 ${mood.color} rounded-full opacity-30 shadow-[0_0_20px_rgba(0,0,0,0.1)]`}
                        />
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: 0.3 }}
                          className={`absolute -top-3 -right-3 w-6 h-6 ${mood.color} rounded-full flex items-center justify-center text-white shadow-lg`}
                        >
                          <Sparkles size={12} />
                        </motion.div>
                      </div>
                      
                      <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/20 mb-6"
                      >
                        {t('thePathChosen')}
                      </motion.span>
                      
                      <div className="relative group">
                        {/* Holographic Scanline Effect */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
                          <motion.div 
                            animate={{ y: ['-100%', '100%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="h-1/2 w-full bg-gradient-to-b from-transparent via-white to-transparent"
                          />
                        </div>

                        <motion.h2 
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ 
                            scale: 1, 
                            opacity: 1,
                            y: [0, -5, 0]
                          }}
                          transition={{ 
                            scale: { type: "spring", delay: 0.1 },
                            y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                          }}
                          className={`font-bold tracking-tight mb-12 break-words max-w-full text-center bg-clip-text text-transparent bg-gradient-to-b from-black to-black/60 relative z-10 ${
                            lang === 'zh' ? 'text-4xl md:text-6xl leading-tight' : 'text-5xl md:text-7xl leading-tight'
                          }`}
                        >
                          {result}
                        </motion.h2>
                      </div>
                      
                      <div className="flex gap-3">
                        <button 
                          onClick={() => copyToClipboard(result || '')}
                          className="p-4 rounded-2xl bg-black/5 hover:bg-black/10 transition-all text-black/40 hover:text-black"
                        >
                          {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                        </button>
                        <button 
                          onClick={() => setShowResult(false)}
                          className="arc-button-secondary border border-black/5"
                        >
                          {t('tryAgain')}
                        </button>
                        <button 
                          onClick={shareResult}
                          className="p-4 rounded-2xl bg-black/5 hover:bg-black/10 transition-all text-black/40 hover:text-black"
                        >
                          <Share2 size={20} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Right Column: Options & History */}
        <div className="flex flex-col gap-8">
          {/* Tools Section (Quick Add & Number Range) */}
          <section className="flex flex-col gap-8 p-8 rounded-[40px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-black/[0.02]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-black/5 flex items-center justify-center text-black/40">
                  <Settings2 size={18} />
                </div>
                <div className="flex flex-col">
                  <h3 className={`text-xs font-bold text-black/80 ${lang === 'zh' ? 'tracking-normal' : 'uppercase tracking-wider'}`}>{t('tools')}</h3>
                  <p className="text-[10px] text-black/30 font-medium">{lang === 'en' ? 'Quick setup your draw' : '快速配置抽签选项'}</p>
                </div>
              </div>
            </div>

            {/* Quick Add */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-3 rounded-full bg-black/10" />
                <span className={`text-[10px] font-bold text-black/40 tracking-widest ${lang === 'zh' ? '' : 'uppercase'}`}>{t('quickAddGroups')}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickSuggestions.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => quickAdd(s.items)}
                    className="px-4 py-2.5 rounded-2xl bg-black/[0.03] border border-transparent text-xs font-bold transition-all active:scale-95 hover:bg-black/10 hover:shadow-xl hover:shadow-black/5"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Number Range Generator */}
            <div className="flex flex-col gap-4 pt-6 border-t border-black/[0.03]">
              <div className="flex items-center gap-2">
                <div className="w-1 h-3 rounded-full bg-black/10" />
                <span className={`text-[10px] font-bold text-black/40 tracking-widest ${lang === 'zh' ? '' : 'uppercase'}`}>{t('numberRange')}</span>
              </div>
              <div className="flex items-center p-1.5 rounded-2xl bg-black/[0.03] border border-black/[0.02]">
                <input 
                  type="number" 
                  value={rangeStart}
                  onChange={(e) => setRangeStart(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 bg-transparent text-sm font-bold outline-none placeholder:text-black/20"
                  placeholder={t('start')}
                />
                <div className="w-px h-4 bg-black/10 mx-1" />
                <input 
                  type="number" 
                  value={rangeEnd}
                  onChange={(e) => setRangeEnd(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 bg-transparent text-sm font-bold outline-none placeholder:text-black/20"
                  placeholder={t('end')}
                />
                <button 
                  onClick={generateRange}
                  className={`p-2.5 rounded-xl ${mood.color} text-white shadow-lg shadow-black/5 hover:scale-105 active:scale-95 transition-all ml-1`}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </section>

          {/* Options Section */}
          <section className="flex flex-col gap-6 p-8 rounded-[40px] bg-white border border-black/[0.03] shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layout size={16} className="text-black/20" />
                <h3 className={`text-[11px] font-bold text-black/30 ${lang === 'zh' ? 'tracking-normal' : 'uppercase tracking-[0.2em]'}`}>{t('currentOptions')}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setModal({
                    show: true,
                    title: t('bulkEdit'),
                    type: 'bulk',
                    value: options.join('\n'),
                    onConfirm: (val) => {
                      if (val !== undefined) {
                        const newItems = val.split('\n').map(i => i.trim()).filter(i => i !== '');
                        setOptions(newItems);
                      }
                      setModal(prev => ({ ...prev, show: false }));
                    }
                  })}
                  className="p-1.5 rounded-lg hover:bg-black/5 text-black/20 hover:text-black transition-all"
                  title={t('bulkEdit')}
                >
                  <Copy size={14} />
                </button>
                <button 
                  onClick={shuffleOptions}
                  disabled={options.length < 2}
                  className="p-1.5 rounded-lg hover:bg-black/5 text-black/20 hover:text-black transition-all disabled:opacity-0"
                  title={t('shuffle')}
                >
                  <Shuffle size={14} />
                </button>
                <span className="text-[10px] font-mono bg-black/5 px-2 py-0.5 rounded-full text-black/40">{options.length}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <AnimatePresence mode="popLayout">
                {options.map((opt, i) => (
                  <motion.div
                    key={opt}
                    layout
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ y: -2, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="px-4 py-2.5 rounded-2xl bg-black/[0.02] border border-black/[0.03] flex items-center gap-3 group hover:bg-white hover:border-black/10 hover:shadow-md transition-all cursor-default"
                  >
                    <div className="flex flex-col">
                      <span className={`font-medium ${lang === 'zh' ? 'text-base' : 'text-sm'}`}>{opt}</span>
                      <span className="text-[9px] font-mono text-black/20 group-hover:text-black/40 transition-colors">{probability}%</span>
                    </div>
                    <button 
                      onClick={() => removeOption(i)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/5 rounded-lg"
                    >
                      <X size={12} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {options.length === 0 && (
                <div className="w-full py-16 flex flex-col items-center justify-center text-black/10">
                  <MousePointer2 size={32} strokeWidth={1} className="mb-4 animate-bounce" />
                  <p className="text-xs font-bold uppercase tracking-widest">{lang === 'en' ? 'Add items below' : '在下方添加选项'}</p>
                </div>
              )}
            </div>

            {options.length > 0 && (
              <div className="flex flex-col gap-4 pt-4 border-t border-black/[0.03]">
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    placeholder={t('presetNamePlaceholder')}
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-black/[0.02] border border-black/[0.05] text-xs font-medium outline-none focus:border-black/20"
                  />
                  <button 
                    onClick={savePreset}
                    disabled={!presetName.trim()}
                    className={`px-4 py-2 rounded-xl bg-black text-white font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-20 ${lang === 'zh' ? 'text-xs' : 'text-[10px] uppercase tracking-widest'}`}
                  >
                    {t('saveGroup')}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <button 
                    onClick={reset}
                    className={`font-bold text-black/20 hover:text-red-500 transition-colors flex items-center gap-1.5 ${lang === 'zh' ? 'text-xs' : 'text-[10px] uppercase tracking-widest'}`}
                  >
                    <Trash2 size={12} /> {t('clearAll')}
                  </button>
                  <div className="flex items-center gap-1">
                    <span className="kbd">⌘</span> <span className="kbd">Enter</span> <span className="text-[10px] text-black/20 ml-1">{lang === 'en' ? 'to draw' : '抽签'}</span>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Saved Presets Section */}
          <section className="flex flex-col gap-6 p-8 rounded-[40px] bg-white border border-black/[0.03] shadow-sm">
            <div className="flex items-center gap-2">
              <Palette size={16} className="text-black/20" />
              <h3 className={`text-[11px] font-bold text-black/30 ${lang === 'zh' ? 'tracking-normal' : 'uppercase tracking-[0.2em]'}`}>{t('savedGroups')}</h3>
            </div>

            <div className="flex flex-col gap-3 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
              {presets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-black/10">
                  <Palette size={32} className="mb-3 opacity-20" />
                  <p className={`font-bold tracking-widest ${lang === 'zh' ? 'text-xs' : 'text-[11px] uppercase'}`}>{t('noSavedGroups')}</p>
                </div>
              ) : (
                presets.map((p) => (
                  <div 
                    key={p.id} 
                    className="p-4 rounded-2xl bg-black/[0.01] border border-black/[0.02] flex items-center justify-between hover:bg-black/[0.03] transition-colors group"
                  >
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => loadPreset(p)}
                    >
                      <span className="font-bold text-sm tracking-tight block">{p.name}</span>
                      <span className="text-[10px] text-black/30 font-medium">{p.items.length} {t('items')}</span>
                    </div>
                    <button 
                      onClick={() => deletePreset(p.id)}
                      className="p-2 text-black/10 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* History Section */}
          <section className={`flex flex-col gap-6 p-8 rounded-[40px] transition-all duration-500 ${showHistory ? 'bg-white border border-black/[0.03] shadow-sm' : 'opacity-40 grayscale pointer-events-none'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History size={16} className="text-black/20" />
                <h3 className={`text-[11px] font-bold text-black/30 ${lang === 'zh' ? 'tracking-normal' : 'uppercase tracking-[0.2em]'}`}>{t('history')}</h3>
              </div>
              <button onClick={clearHistory} className={`font-bold text-black/20 hover:text-black ${lang === 'zh' ? 'text-xs' : 'text-[10px] uppercase tracking-widest'}`}>{t('reset')}</button>
            </div>

            <div className="flex flex-col gap-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-black/10">
                  <History size={32} className="mb-3 opacity-20" />
                  <p className={`font-bold tracking-widest ${lang === 'zh' ? 'text-xs' : 'text-[11px] uppercase'}`}>{t('empty')}</p>
                </div>
              ) : (
                history.map((item) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={item.id} 
                    className="p-4 rounded-2xl bg-black/[0.01] border border-black/[0.02] flex flex-col gap-1.5 hover:bg-black/[0.03] transition-colors cursor-default"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm tracking-tight">{item.result}</span>
                      <span className="text-[9px] font-mono text-black/20">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[10px] text-black/30 truncate font-medium">
                      {item.options.join(' • ')}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Floating Input Bar */}
      <div className="fixed bottom-10 w-full max-w-2xl px-6 z-50">
        <form 
          onSubmit={addOption} 
          className={`input-container group relative overflow-hidden transition-all duration-500 ${
            isFocused || inputValue ? 'ring-8 ring-black/[0.02]' : ''
          }`}
        >
          {/* Animated Gradient Border */}
          {(isFocused || inputValue) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 -z-10"
            >
              <div className="absolute inset-[-2px] bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-red-500 bg-[length:200%_auto] animate-[gradient_3s_linear_infinite] opacity-30" />
            </motion.div>
          )}

          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${
            isFocused || inputValue 
              ? `${mood.color} text-white shadow-lg` 
              : 'bg-black/5 text-black/20'
          }`}>
            <Command size={20} />
          </div>
          <input 
            ref={inputRef}
            type="text" 
            placeholder={inputValue ? '' : TRANSLATIONS[lang].placeholders[placeholderIndex]} 
            className="flex-1 bg-transparent border-none outline-none text-lg placeholder:text-black/20 font-medium transition-all duration-500"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {inputValue && (
            <button 
              type="button"
              onClick={() => setInputValue('')}
              className="p-2 text-black/20 hover:text-black transition-colors"
            >
              <X size={18} />
            </button>
          )}
          <button 
            type="submit"
            disabled={!inputValue.trim()}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 hover:scale-105 active:scale-95 disabled:scale-100 ${
              isFocused || inputValue 
                ? `${mood.color} text-white shadow-lg` 
                : 'bg-black/5 text-black/20 opacity-40'
            }`}
          >
            <ArrowUp size={24} />
          </button>
        </form>
        <div className="flex justify-center gap-4 mt-4">
          <div className="flex items-center gap-1.5">
            <span className="kbd">⌘</span> <span className="kbd">K</span> <span className="text-[10px] text-black/20 font-bold uppercase tracking-widest ml-1">{t('shortcutFocus')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="kbd">⌘</span> <span className="kbd">Enter</span> <span className="text-[10px] text-black/20 font-bold uppercase tracking-widest ml-1">{t('shortcutDraw')}</span>
          </div>
        </div>
      </div>

      {/* Custom Modal */}
      <AnimatePresence>
        {modal.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModal({ ...modal, show: false })}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative w-full bg-white rounded-[32px] p-8 shadow-2xl border border-black/5 ${modal.type === 'bulk' ? 'max-w-xl' : 'max-w-sm'}`}
            >
              <div className="flex flex-col items-center text-center">
                {modal.type !== 'bulk' && (
                  <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 mb-6">
                    <AlertCircle size={24} />
                  </div>
                )}
                <h3 className="text-lg font-bold tracking-tight mb-4 leading-tight">{modal.title}</h3>
                
                {modal.type === 'bulk' ? (
                  <div className="w-full flex flex-col gap-4 mb-8">
                    <p className="text-xs text-black/40 text-left">{t('bulkEditDesc')}</p>
                    <textarea 
                      className="w-full h-64 p-4 rounded-2xl bg-black/[0.02] border border-black/5 outline-none focus:border-black/20 transition-all font-medium text-sm resize-none custom-scrollbar"
                      value={modal.value}
                      onChange={(e) => setModal({ ...modal, value: e.target.value })}
                      autoFocus
                    />
                  </div>
                ) : (
                  <div className="mb-8" />
                )}

                <div className="flex gap-3 w-full">
                  <button 
                    onClick={() => setModal({ ...modal, show: false })}
                    className="flex-1 px-6 py-3 rounded-2xl bg-black/5 hover:bg-black/10 transition-all font-bold text-sm"
                  >
                    {t('cancel')}
                  </button>
                  <button 
                    onClick={() => modal.onConfirm(modal.value)}
                    className={`flex-1 px-6 py-3 rounded-2xl transition-all font-bold text-sm text-white shadow-lg ${modal.type === 'bulk' ? 'bg-black hover:bg-black/80 shadow-black/20' : 'bg-red-500 hover:bg-red-600 shadow-red-500/20'}`}
                  >
                    {modal.type === 'bulk' ? t('save') : t('confirm')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Background */}
      <FloatingBackground mood={mood} />
    </div>
  );
}
