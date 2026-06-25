import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GitMerge, LogIn, Folder, Cpu, Check, AlertCircle, Plus, Trash2, ArrowUpRight, ToggleLeft, ToggleRight, X } from 'lucide-react';
import { ErrorEvent, Project } from '../types';

interface FeaturesTabProps {
  errors: ErrorEvent[];
  projects: Project[];
  onToggleAlert: (id: string) => void;
  onAddProject: (name: string) => void;
  onUpdateErrorStatus: (id: string, status: ErrorEvent['status']) => void;
  onTriggerOccurrence: (id: string) => void;
}

export default function FeaturesTab({
  errors,
  projects,
  onToggleAlert,
  onAddProject,
  onUpdateErrorStatus,
  onTriggerOccurrence,
}: FeaturesTabProps) {
  // States
  const [selectedError, setSelectedError] = useState<ErrorEvent | null>(null);
  const [filterEnv, setFilterEnv] = useState<'all' | 'production' | 'staging'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unresolved' | 'ignored' | 'resolved'>('all');
  
  // Ingestion testing tool
  const [testKey, setTestKey] = useState('mutt_sk_live_8f3d1b9');
  const [hashedKey, setHashedKey] = useState('');
  const [hashingProgress, setHashingProgress] = useState(false);
  const [hashSteps, setHashSteps] = useState<string[]>([]);

  // Add Project modal/inline input
  const [newProjectName, setNewProjectName] = useState('');
  const [showAddProject, setShowAddProject] = useState(false);

  // Tech Stack state
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  // Filtered errors list
  const filteredErrors = errors.filter((err) => {
    const envMatch = filterEnv === 'all' || err.environment === filterEnv;
    const statusMatch = filterStatus === 'all' || err.status === filterStatus;
    return envMatch && statusMatch;
  });

  const handleHashKey = () => {
    if (!testKey.trim()) return;
    setHashingProgress(true);
    setHashSteps(['1. Reading raw API key token...']);
    
    setTimeout(() => {
      setHashSteps((prev) => [...prev, '2. Processing bytes through SHA-256...']);
    }, 400);

    setTimeout(async () => {
      try {
        const msgBuffer = new TextEncoder().encode(testKey.trim());
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        setHashedKey(hashHex);
        setHashSteps((prev) => [...prev, '3. API key successfully hashed!']);
      } catch (err) {
        setHashedKey('Hashing error');
        setHashSteps((prev) => [...prev, '3. Hashing failed internally.']);
      } finally {
        setHashingProgress(false);
      }
    }, 800);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    onAddProject(newProjectName.trim());
    setNewProjectName('');
    setShowAddProject(false);
  };

  const techStackDetails: Record<string, { title: string; desc: string; metrics: string }> = {
    Go: {
      title: 'Go + Fiber',
      desc: 'Selected for concurrent execution speed and native low memory footprint. Go routines allow Mutt to ingest 50,000+ operations/sec per thread.',
      metrics: 'Benchmarks: 0.15ms response latency',
    },
    Postgres: {
      title: 'Postgres (Neon DB)',
      desc: 'Robust relational database integrity utilizing PostgreSQL on Neon serverless database, managing users, projects, and error groups safely with GORM mapping.',
      metrics: 'Optimized schema indexing on API key and fingerprint hashes',
    },
    Redis: {
      title: 'Redis (Upstash)',
      desc: 'Acts as our fast rate-limiter store to restrict API client requests dynamically per project API key, protecting resources against abuse.',
      metrics: 'Distributed rate limiting via sliding window counter',
    },
    JWT: {
      title: 'JWT Auth Security',
      desc: 'Standard compliant stateless authorization ensuring client agents can securely authorize payloads without constant database verification round-trips.',
      metrics: 'Auth check overhead: < 1 microsecond',
    },
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-6 py-12">
      {/* Header */}
      <header className="mb-10 max-w-3xl">
        <h1 className="font-mono text-2xl md:text-3xl font-bold text-black mb-3">Core Capabilities</h1>
        <p className="font-sans text-[#444748] text-base">
          Technical details on how Mutt ingests, processes, and organizes telemetry data efficiently.
        </p>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Bento 1: Error Grouping (spans 8 cols) */}
        <section className="col-span-1 md:col-span-8 bg-white border border-[#c4c7c7] rounded-sm p-6 flex flex-col justify-between">
          <div>
            <div className="border-b border-[#c4c7c7] pb-3 mb-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="bg-[#ffdcc3] text-[#6e3900] font-mono text-[9px] font-bold px-2 py-0.5 uppercase border border-[#c4c7c7]">
                  ACTIVE ENG
                </span>
                <h2 className="font-mono text-base font-bold text-black">Error Grouping</h2>
              </div>
              <GitMerge size={18} className="text-[#747878]" />
            </div>
            
            <p className="font-sans text-xs md:text-sm text-[#444748] mb-6 leading-relaxed">
              Mutt uses fingerprint hashing to intelligently cluster similar errors. Instead of flooding your inbox with 10,000 identical stack traces, it generates a unique hash based on the error type, file path, and specific line number, aggregating them into a single trackable issue.
            </p>

            {/* In-tab Filters */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 bg-gray-50 p-2 border border-[#c4c7c7] text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-gray-500 uppercase text-[10px]">Env:</span>
                <div className="flex gap-1">
                  {(['all', 'production', 'staging'] as const).map((env) => (
                    <button
                      key={env}
                      onClick={() => setFilterEnv(env)}
                      className={`px-2 py-0.5 font-mono text-[10px] rounded-sm transition-colors uppercase cursor-pointer ${
                        filterEnv === env ? 'bg-black text-white font-bold' : 'text-gray-500 hover:text-black'
                      }`}
                    >
                      {env}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-gray-500 uppercase text-[10px]">Status:</span>
                <div className="flex gap-1">
                  {(['all', 'unresolved', 'ignored', 'resolved'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setFilterStatus(st)}
                      className={`px-2 py-0.5 font-mono text-[10px] rounded-sm transition-colors uppercase cursor-pointer ${
                        filterStatus === st ? 'bg-black text-white font-bold' : 'text-gray-500 hover:text-black'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Error Group List Mockup */}
            <div className="border border-[#c4c7c7] bg-white overflow-hidden text-xs rounded-sm">
              <div className="grid grid-cols-12 bg-gray-50 border-b border-[#c4c7c7] p-2.5 font-mono font-bold text-gray-500 text-[10px] uppercase">
                <div className="col-span-6">Fingerprint Hash / Error</div>
                <div className="col-span-2 text-right">Events</div>
                <div className="col-span-2 text-right">Env</div>
                <div className="col-span-2 text-right">Last Seen</div>
              </div>

              <div className="divide-y divide-[#c4c7c7] max-h-[220px] overflow-y-auto">
                {filteredErrors.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 font-mono">
                    No active errors matching filters. Trigger one from the Overview page simulator!
                  </div>
                ) : (
                  filteredErrors.map((err) => (
                    <div
                      key={err.id}
                      onClick={() => setSelectedError(err)}
                      className={`grid grid-cols-12 p-2.5 hover:bg-gray-50 transition-colors cursor-pointer items-center ${
                        selectedError?.id === err.id ? 'bg-[#fdf8f8] border-l-2 border-orange-500' : ''
                      }`}
                    >
                      <div className="col-span-6 font-mono flex items-center gap-1.5 truncate">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            err.status === 'resolved'
                              ? 'bg-green-500'
                              : err.status === 'ignored'
                              ? 'bg-gray-400'
                              : err.type === 'TypeError'
                              ? 'bg-[#FF8C00]'
                              : 'bg-red-600'
                          }`}
                        />
                        <span className="text-gray-400 font-bold">{err.fingerprint.substring(0, 8)}...</span>
                        <span className="font-semibold text-black truncate">{err.type}</span>
                        <span className="text-gray-400 text-[10px] max-w-xs truncate hidden lg:inline">
                          ({err.filePath}:{err.line})
                        </span>
                      </div>
                      <div className="col-span-2 text-right font-mono font-bold text-[#444748]">
                        {err.events.toLocaleString()}
                      </div>
                      <div className="col-span-2 text-right font-mono text-[10px] uppercase">
                        <span
                          className={`px-1 py-0.5 rounded-sm text-[9px] ${
                            err.environment === 'production'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                          }`}
                        >
                          {err.environment}
                        </span>
                      </div>
                      <div className="col-span-2 text-right font-mono text-gray-500 text-[10px]">
                        {err.lastSeen}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 text-[11px] font-mono text-gray-400 italic">
            * Click any error row to inspect detailed stack traces, update tracking states, or force occurrence.
          </div>
        </section>

        {/* Bento 2: Ingestion (spans 4 cols) */}
        <section className="col-span-1 md:col-span-4 bg-white border border-[#c4c7c7] rounded-sm p-6 flex flex-col justify-between">
          <div>
            <div className="border-b border-[#c4c7c7] pb-3 mb-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="bg-[#ffdcc3] text-[#6e3900] font-mono text-[9px] font-bold px-2 py-0.5 uppercase border border-[#c4c7c7]">
                  ACTIVE
                </span>
                <h2 className="font-mono text-base font-bold text-black">Ingestion</h2>
              </div>
              <LogIn size={18} className="text-[#747878]" />
            </div>

            <p className="font-sans text-xs md:text-sm text-[#444748] mb-5 leading-relaxed">
              Secure API Key authentication. Keys are hashed before storage, ensuring that even in the event of a database compromise, client credentials remain secure.
            </p>

            {/* Mini hashing play tool */}
            <div className="bg-gray-50 border border-[#c4c7c7] p-3 rounded-sm font-mono text-xs">
              <div className="mb-2 font-bold text-[10px] text-gray-500 uppercase">Test API Key Hashing</div>
              <div className="flex gap-1.5 mb-3">
                <input
                  type="text"
                  value={testKey}
                  onChange={(e) => setTestKey(e.target.value)}
                  placeholder="Enter a mock key"
                  className="bg-white border border-[#c4c7c7] px-2 py-1 flex-grow font-mono text-xs text-black focus:outline-none focus:border-[#FF8C00]"
                />
                <button
                  onClick={handleHashKey}
                  disabled={hashingProgress}
                  className="bg-black text-white px-3 py-1 font-bold text-[11px] hover:bg-gray-800 transition-colors cursor-pointer border border-black disabled:bg-gray-300"
                >
                  Hash
                </button>
              </div>

              {hashSteps.length > 0 && (
                <div className="space-y-1 text-[10px] text-gray-600 bg-white p-2 border border-gray-200 rounded-xs">
                  {hashSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      {idx === hashSteps.length - 1 && hashingProgress ? (
                        <span className="w-1.5 h-1.5 bg-orange-500 animate-ping rounded-full inline-block" />
                      ) : (
                        <span className="text-green-600 font-bold">✓</span>
                      )}
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              )}

              {hashedKey && !hashingProgress && (
                <div className="mt-3 p-2 bg-[#fdf8f8] border border-red-200">
                  <div className="text-[9px] text-red-700 font-bold uppercase mb-0.5">DB Fingerprint Hash</div>
                  <div className="font-mono text-[10px] text-black select-all break-all">{hashedKey}</div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#c4c7c7] text-center text-[11px] font-mono text-[#6e3900]">
            SHA-256 for fast key lookup.
          </div>
        </section>

        {/* Bento 3: Project Management (spans 6 cols) */}
        <section className="col-span-1 md:col-span-6 bg-white border border-[#c4c7c7] rounded-sm p-6 flex flex-col justify-between">
          <div>
            <div className="border-b border-[#c4c7c7] pb-3 mb-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="bg-[#ffdcc3] text-[#6e3900] font-mono text-[9px] font-bold px-2 py-0.5 uppercase border border-[#c4c7c7]">
                  ACTIVE
                </span>
                <h2 className="font-mono text-base font-bold text-black">Project Management</h2>
              </div>
              <Folder size={18} className="text-[#747878]" />
            </div>

            <p className="font-sans text-xs md:text-sm text-[#444748] mb-6 leading-relaxed">
              Isolate environments and manage notification rules on a per-project basis. Easily toggle alerts for staging vs. production.
            </p>

            {/* List of Projects */}
            <div className="border border-[#c4c7c7] divide-y divide-[#c4c7c7] text-xs rounded-sm overflow-hidden">
              {projects.map((proj) => (
                <div key={proj.id} className="flex justify-between items-center p-3 bg-white hover:bg-gray-50/50">
                  <div>
                    <div className="font-mono font-bold text-black text-sm">{proj.name}</div>
                    <div className="font-mono text-[10px] text-gray-400 uppercase mt-0.5">ID: {proj.id}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-gray-500">Alerts:</span>
                    <button
                      onClick={() => onToggleAlert(proj.id)}
                      className="cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-500/50 rounded-sm"
                    >
                      {proj.alertsEnabled ? (
                        <div className="flex items-center gap-1 bg-black text-white px-2 py-0.5 font-mono text-[10px] font-bold uppercase border border-black">
                          Active
                          <Check size={10} />
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 bg-gray-100 text-gray-400 px-2 py-0.5 font-mono text-[10px] border border-gray-200">
                          Muted
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            {showAddProject ? (
              <form onSubmit={handleCreateProject} className="flex gap-2 w-full">
                <input
                  type="text"
                  required
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. Analytics API"
                  className="bg-white border border-[#c4c7c7] px-3 py-1 font-mono text-xs flex-grow focus:outline-none focus:border-black text-black"
                />
                <button
                  type="submit"
                  className="bg-black text-white px-3 py-1 font-mono text-xs font-bold border border-black hover:bg-gray-800 cursor-pointer"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProject(false)}
                  className="bg-gray-100 text-gray-500 px-2 py-1 font-mono text-xs border border-gray-200 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowAddProject(true)}
                className="font-mono text-xs bg-gray-100 text-black border border-[#c4c7c7] hover:border-black transition-colors px-3 py-1.5 flex items-center gap-1.5 cursor-pointer rounded-sm"
              >
                <Plus size={12} />
                Add New Project
              </button>
            )}
          </div>
        </section>

        {/* Bento 4: Backend Tech Stack (spans 6 cols) */}
        <section className="col-span-1 md:col-span-6 bg-[#1A1A1A] border border-black rounded-sm p-6 text-white flex flex-col justify-between">
          <div>
            <div className="border-b border-[#333333] pb-3 mb-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="bg-[#484645] text-white font-mono text-[9px] font-bold px-2 py-0.5 uppercase border border-[#666666]">
                  ACTIVE
                </span>
                <h2 className="font-mono text-base font-bold text-white">Backend Tech Stack</h2>
              </div>
              <Cpu size={18} className="text-gray-400" />
            </div>

            <p className="font-sans text-xs md:text-sm text-gray-300 mb-6 leading-relaxed">
              Built for high performance and minimal overhead, capable of ingesting thousands of events per second with sub-millisecond route timings.
            </p>

            {/* Clickable Tech Grid */}
            <div className="grid grid-cols-2 gap-3">
              {(['Go', 'Postgres', 'Redis', 'JWT'] as const).map((tech) => {
                const label = tech === 'Go' ? 'Go + Fiber' : tech === 'Postgres' ? 'Postgres (Neon)' : tech === 'Redis' ? 'Redis (Upstash)' : 'JWT Auth';
                const labelCaps = tech === 'Go' ? 'BACKEND' : tech === 'Postgres' ? 'DATABASE' : tech === 'Redis' ? 'CACHING/QUEUE' : 'SECURITY';
                return (
                  <button
                    key={tech}
                    onClick={() => setSelectedTech(selectedTech === tech ? null : tech)}
                    className={`text-left p-3 rounded-xs border transition-all cursor-pointer ${
                      selectedTech === tech
                        ? 'bg-[#2f1500] border-[#FF8C00] shadow-sm shadow-[#FF8C00]/20'
                        : 'bg-[#2D2D2D] border-[#444444] hover:bg-[#333333] hover:border-gray-500'
                    }`}
                  >
                    <div className="font-mono text-[9px] text-[#FF8C00] font-bold tracking-widest uppercase mb-1 flex justify-between items-center">
                      <span>{labelCaps}</span>
                      {selectedTech === tech && <span className="w-1.5 h-1.5 bg-[#FF8C00] rounded-full animate-pulse" />}
                    </div>
                    <div className="font-mono font-bold text-xs text-white">{label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 min-h-[50px]">
            <AnimatePresence mode="wait">
              {selectedTech ? (
                <motion.div
                  key={selectedTech}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-[#2D2D2D] border border-[#FF8C00]/40 p-3 text-xs font-sans rounded-xs"
                >
                  <strong className="font-mono text-white text-[12px] uppercase block mb-1">
                    {techStackDetails[selectedTech].title}
                  </strong>
                  <p className="text-gray-300 leading-relaxed">{techStackDetails[selectedTech].desc}</p>
                  <span className="font-mono text-[10px] text-[#FF8C00] mt-2 block">
                    {techStackDetails[selectedTech].metrics}
                  </span>
                </motion.div>
              ) : (
                <div className="text-[11px] font-mono text-gray-500 italic text-center py-2">
                  * Click any card in the Proposed Tech Stack above to view architecture selection metrics.
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>

      </div>

      {/* Slide-over Error Inspector / Details Modal */}
      <AnimatePresence>
        {selectedError && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-end z-50 p-0">
            {/* Click backdrop to close */}
            <div className="absolute inset-0" onClick={() => setSelectedError(null)} />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg bg-white border-l border-[#c4c7c7] shadow-xl h-full flex flex-col z-10"
            >
              <div className="p-6 border-b border-[#c4c7c7] flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-[11px] bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 uppercase font-bold">
                      {selectedError.environment}
                    </span>
                    <span className="font-mono text-[11px] text-gray-400">
                      ID: {selectedError.id}
                    </span>
                  </div>
                  <h3 className="font-mono font-bold text-lg text-black">{selectedError.type}</h3>
                  <p className="text-[#FF8C00] font-mono text-xs font-semibold select-all">
                    Fingerprint: {selectedError.fingerprint}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedError(null)}
                  className="text-[#747878] hover:text-black p-1 bg-gray-50 border border-gray-200 hover:border-black cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-grow p-6 overflow-y-auto space-y-6">
                {/* Status controllers */}
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase text-gray-400 block mb-2">
                    Issue Status
                  </span>
                  <div className="flex gap-2">
                    {(['unresolved', 'ignored', 'resolved'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          onUpdateErrorStatus(selectedError.id, status);
                          setSelectedError((prev) => prev ? { ...prev, status } : null);
                        }}
                        className={`font-mono text-xs px-3 py-1.5 border capitalize cursor-pointer flex-1 text-center transition-colors ${
                          selectedError.status === status
                            ? 'bg-black text-white font-bold border-black'
                            : 'bg-white text-gray-500 border-[#c4c7c7] hover:border-black'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error message */}
                <div className="bg-red-50 border-l-4 border-red-600 p-4">
                  <span className="font-mono text-[9px] font-bold text-red-700 uppercase block mb-1">
                    Ingested Error Message
                  </span>
                  <p className="font-mono text-xs font-bold text-black select-all break-words">
                    {selectedError.message}
                  </p>
                </div>

                {/* Location details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-[#c4c7c7] p-3 bg-gray-50 rounded-xs">
                    <span className="font-mono text-[9px] text-gray-500 font-bold uppercase block mb-1">
                      File Path
                    </span>
                    <span className="font-mono text-xs text-black font-semibold break-all">
                      {selectedError.filePath}
                    </span>
                  </div>
                  <div className="border border-[#c4c7c7] p-3 bg-gray-50 rounded-xs">
                    <span className="font-mono text-[9px] text-gray-500 font-bold uppercase block mb-1">
                      Line Number
                    </span>
                    <span className="font-mono text-xs text-black font-bold">
                      Line {selectedError.line}
                    </span>
                  </div>
                </div>

                {/* Simulated Stack Trace */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-[10px] font-bold uppercase text-gray-400">
                      Deobfuscated Stack Trace
                    </span>
                    <span className="font-mono text-[9px] text-green-700 font-bold uppercase flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                      Symbolic mapping match
                    </span>
                  </div>
                  <div className="bg-[#1E1E1E] text-gray-300 p-4 rounded-xs font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre select-all border border-[#333333]">
                    <div className="text-[#FF8C00] font-bold">
                      {selectedError.type}: {selectedError.message}
                    </div>
                    <div className="text-white font-bold bg-[#333333] px-1 my-1">
                      &gt; at checkout ({selectedError.filePath}:{selectedError.line})
                    </div>
                    <div className="opacity-60">
                      at processOrder (src/controllers/payment.ts:182:12)<br />
                      at executeRoute (src/server.ts:45:9)<br />
                      at handleRequest (node_modules/express/lib/router/layer.js:95:5)<br />
                      at next (node_modules/express/lib/router/route.js:144:13)<br />
                      at dispatch (node_modules/express/lib/router/route.js:137:9)
                    </div>
                  </div>
                </div>

                {/* Simulate Occurrence button */}
                <div className="border-t border-[#c4c7c7] pt-4 flex justify-between items-center">
                  <div>
                    <span className="font-mono text-[10px] text-gray-500 block">Occurrences</span>
                    <span className="font-mono font-bold text-sm text-black">
                      {selectedError.events.toLocaleString()} Events
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onTriggerOccurrence(selectedError.id);
                      // Update local modal state immediately
                      setSelectedError((prev) =>
                        prev ? { ...prev, events: prev.events + 1, lastSeen: 'Just now' } : null
                      );
                    }}
                    className="bg-black text-white font-mono text-xs font-bold px-4 py-2 border border-black hover:bg-gray-800 transition-colors flex items-center gap-1 cursor-pointer rounded-sm"
                  >
                    <Plus size={12} />
                    Trigger Occurrence Again
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
