import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Link2, Copy, BarChart3, Scissors, Check, ExternalLink, Sparkles, Zap, Shield } from 'lucide-react';
import axios from 'axios';
import './index.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Confetti component for success celebration 🎉
const Confetti = () => {
  const colors = ['#bef264', '#22d3ee', '#a78bfa', '#f472b6'];
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 6 + Math.random() * 8,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ 
            y: -20, 
            x: `${piece.left}vw`,
            opacity: 1,
            rotate: 0 
          }}
          animate={{ 
            y: '110vh',
            opacity: 0,
            rotate: 360 + Math.random() * 360
          }}
          transition={{ 
            duration: piece.duration, 
            delay: piece.delay,
            ease: "linear"
          }}
          className="absolute w-2 h-2 rounded-sm"
          style={{ 
            backgroundColor: piece.color,
            width: piece.size,
            height: piece.size * 0.6,
            left: `${piece.left}%`
          }}
        />
      ))}
    </div>
  );
};

// Animated background grid
const BackgroundGrid = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/50 to-zinc-950" />
    
    {/* Floating orbs with pulse animation */}
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-gradient-to-br from-[#bef264]/10 to-[#22d3ee]/10 blur-3xl"
        style={{
          width: `${30 + i * 15}%`,
          height: `${30 + i * 15}%`,
          top: `${i * 20 - 10}%`,
          left: `${i * 25 - 10}%`,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8 + i * 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    ))}
  </div>
);

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const controls = useAnimation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (result) {
      setShowConfetti(true);
      controls.start({ scale: [1, 1.02, 1], transition: { duration: 0.3 } });
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [result, controls]);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const { data } = await axios.post(`${API_BASE}/api/shorten`, {
        longUrl,
        customAlias: customAlias || undefined
      });
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong');
      controls.start({ x: [-10, 10, -10, 10, 0], transition: { duration: 0.3 } });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (result) {
      const shortUrl = `${API_BASE}/${result.shortCode || result.short_url}`;
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const features = [
    { 
      icon: <BarChart3 className="w-6 h-6" />, 
      title: 'Real-time Analytics', 
      desc: 'Track clicks, locations & referrers with beautiful dashboards.',
      gradient: 'from-emerald-500/20 to-cyan-500/20'
    },
    { 
      icon: <Zap className="w-6 h-6" />, 
      title: 'Lightning Fast', 
      desc: 'Global edge network ensures <50ms redirect latency worldwide.',
      gradient: 'from-cyan-500/20 to-violet-500/20'
    },
    { 
      icon: <Shield className="w-6 h-6" />, 
      title: 'Secure & Reliable', 
      desc: 'Enterprise-grade security with 99.99% uptime SLA guarantee.',
      gradient: 'from-violet-500/20 to-pink-500/20'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-zinc-950 text-white">
      <BackgroundGrid />
      {showConfetti && <Confetti />}

      <main className="container mx-auto px-4 pt-16 pb-20 relative z-10">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#bef264]/10 to-[#22d3ee]/10 border border-[#bef264]/20 text-sm font-medium mb-8 backdrop-blur-sm"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Sparkles className="w-4 h-4 text-[#bef264]" />
            <span className="bg-gradient-to-r from-[#bef264] to-[#22d3ee] bg-clip-text text-transparent font-semibold">
              NEW
            </span>
            <span className="text-zinc-400">• Production-Ready URL Shortener</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-8 tracking-tight leading-tight">
            Simplify Your{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-[#bef264] via-[#22d3ee] to-[#a78bfa] bg-clip-text text-transparent">
                Network
              </span>
              <motion.span 
                className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-[#bef264]/30 via-[#22d3ee]/30 to-[#a78bfa]/30 rounded-full blur-sm"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </span>
          </h1>
          
          <p className="text-zinc-400 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Build, scale, and monitor your shortened links with a{' '}
            <span className="text-[#bef264] font-medium">high-performance infrastructure</span>{' '}
            designed for the modern web.
          </p>
        </motion.div>

        {/* Input Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring", damping: 25 }}
          className="relative max-w-4xl mx-auto mb-16"
        >
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#bef264]/20 via-[#22d3ee]/20 to-[#a78bfa]/20 rounded-3xl blur-xl opacity-50" />
          
          <div className="relative glass p-1 rounded-3xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 shadow-2xl">
            <form onSubmit={handleShorten} className="p-6 md:p-8 space-y-6">
              {/* URL Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-[#bef264] transition-colors">
                  <Link2 size={20} />
                </div>
                <input 
                  type="url"
                  placeholder="Paste your long URL here..."
                  required
                  value={longUrl}
                  ref={inputRef}
                  onChange={(e) => setLongUrl(e.target.value)}
                  className="w-full bg-zinc-950/60 border border-zinc-800 rounded-2xl py-4 pl-12 pr-5 text-lg placeholder-zinc-600 focus:outline-none focus:border-[#bef264]/50 focus:ring-2 focus:ring-[#bef264]/20 transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#bef264]/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
              </div>

              {/* Custom Alias + Submit */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500 text-sm group-focus-within:text-[#22d3ee] transition-colors">
                    <span className="font-mono">/</span>
                  </div>
                  <input 
                    type="text"
                    placeholder="Custom alias (optional)"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value.replace(/\s+/g, '-').toLowerCase())}
                    className="w-full bg-zinc-950/60 border border-zinc-800 rounded-2xl py-3.5 pl-9 pr-5 text-sm placeholder-zinc-600 focus:outline-none focus:border-[#22d3ee]/50 focus:ring-2 focus:ring-[#22d3ee]/20 transition-all duration-300 font-mono"
                  />
                </div>
                
                <motion.button 
                  type="submit" 
                  disabled={loading || !longUrl}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative overflow-hidden px-8 py-3.5 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2.5 transition-all duration-300 ${
                    loading || !longUrl 
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-[#bef264] to-[#22d3ee] text-zinc-950 hover:shadow-lg hover:shadow-[#bef264]/25'
                  }`}
                >
                  {/* Button shine effect */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
                    animate={{ x: ['100%', '-100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    style={{ opacity: loading || !longUrl ? 0 : 1 }}
                  />
                  
                  {loading ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-zinc-600 border-t-zinc-950 rounded-full"
                    />
                  ) : (
                    <>
                      <Scissors size={20} className="shrink-0" />
                      <span>Shorten URL</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Error Message */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.p 
                    key="error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-rose-400 text-sm text-center font-medium flex items-center justify-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-pulse" />
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </div>
        </motion.div>

        {/* Result Area */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="max-w-4xl mx-auto mb-20"
            >
              <motion.div 
                animate={controls}
                className="relative group"
              >
                {/* Success glow */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#bef264] to-[#22d3ee] rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
                
                <div className="relative glass p-5 md:p-6 rounded-2xl bg-zinc-900/90 border border-[#bef264]/30 backdrop-blur-xl flex flex-col md:flex-row items-center gap-4">
                  {/* URL Display */}
                  <div className="flex-1 min-w-0 w-full">
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2"
                    >
                      <Check className="w-3 h-3 text-[#bef264]" />
                      Your Shortened Link
                    </motion.p>
                    
                    <div className="flex items-center gap-3 bg-zinc-950/50 rounded-xl p-3 md:p-4 border border-zinc-800/50">
                      <span className="text-[#bef264] font-mono text-sm md:text-base truncate flex-1">
                        {API_BASE}/{result.shortCode || result.short_url}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={copyToClipboard}
                        className={`p-2.5 rounded-xl transition-all duration-200 ${
                          copied 
                            ? 'bg-[#bef264]/20 text-[#bef264]' 
                            : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                        }`}
                        title={copied ? "Copied!" : "Copy to clipboard"}
                      >
                        <AnimatePresence mode="wait">
                          {copied ? (
                            <motion.div
                              key="check"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Check size={18} />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="copy"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Copy size={18} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <motion.a 
                      href={`${API_BASE}/${result.shortCode || result.short_url}`}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-gradient-to-r from-zinc-800 to-zinc-900 border border-zinc-700 hover:border-zinc-600 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200"
                    >
                      <ExternalLink size={16} />
                      <span>Visit</span>
                    </motion.a>
                    
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setResult(null);
                        setLongUrl('');
                        setCustomAlias('');
                        inputRef.current?.focus();
                      }}
                      className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-800 text-sm font-medium transition-all duration-200"
                    >
                      New Link
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative p-7 rounded-3xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm hover:border-zinc-700/50 transition-all duration-300"
            >
              {/* Hover gradient border */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`} />
              
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-zinc-800/80 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 border border-zinc-700/50">
                  {React.cloneElement(feature.icon as React.ReactElement, { 
                    className: "w-7 h-7 text-[#bef264]" 
                  })}
                </div>
                <h4 className="text-xl font-bold mb-3 bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                  {feature.title}
                </h4>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-24 pt-12 border-t border-zinc-800/50"
        >
          <p className="text-zinc-500 mb-6">Ready to supercharge your links?</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#bef264] to-[#22d3ee] text-zinc-950 font-bold text-lg shadow-lg shadow-[#bef264]/20 hover:shadow-xl hover:shadow-[#bef264]/30 transition-all duration-300"
          >
            Get API Access →
          </motion.button>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 text-center py-10 border-t border-zinc-900/50">
        <motion.p 
          whileHover={{ scale: 1.02 }}
          className="text-zinc-600 text-sm"
        >
          Crafted with{' '}
          <span className="text-rose-500">♥</span>{' '}
          by{' '}
          <a 
            href="https://harshsharma.dev" 
            target="_blank" 
            rel="noreferrer"
            className="text-zinc-300 hover:text-[#bef264] font-medium transition-colors inline-flex items-center gap-1"
          >
            Harsh Sharma
            <ExternalLink size={12} className="opacity-60" />
          </a>{' '}
          &bull; 2026
        </motion.p>
      </footer>
    </div>
  );
}

export default App;