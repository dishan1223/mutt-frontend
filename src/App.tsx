import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal as TerminalIcon, LayoutGrid, FileText, Github, Star, Menu, X, Check, Bell, Activity, Play, AlertCircle } from 'lucide-react';
import { TabId, ErrorEvent, Project } from './types';
import OverviewTab from './components/OverviewTab';
import FeaturesTab from './components/FeaturesTab';
import DocsTab from './components/DocsTab';
import MuttLogo from './components/MuttLogo';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stars, setStars] = useState<number | null>(null);

  // Real-time toast notifications
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'alert' | 'info' }[]>([]);

  // Autopilot traffic simulation state
  const [isAutopilot, setIsAutopilot] = useState(false);

  // Simulation Ingestion Logs
  const [simulationLogs, setSimulationLogs] = useState<string[]>([
    `[SYSTEM] ${new Date().toISOString()} Mutt core engine initialized.`,
    `[SYSTEM] Ingestion API gateway booted on port :3000`,
    `[SYSTEM] Connected to local Redis instance (Upstash simulation mode)`,
    `[SYSTEM] PostgreSQL schema synchronized successfully (Neon DB)`,
    `[SYSTEM] Listening for secure API payload transmissions...`
  ]);

  // Initial mock error clusters
  const [errors, setErrors] = useState<ErrorEvent[]>([
    {
      id: 'err_t5y8u2',
      type: 'TypeError',
      message: "Cannot read properties of undefined (reading 'cart')",
      filePath: 'src/components/checkout.js',
      line: 42,
      fingerprint: 'a1b2c3d4f8e7a6b5c4d3e2f1a0b9',
      events: 14203,
      lastSeen: '2m ago',
      timestamp: new Date(Date.now() - 120000),
      status: 'unresolved',
      environment: 'production',
    },
    {
      id: 'err_n9b1v4',
      type: 'NullReference',
      message: 'pointer resolution failed for active session',
      filePath: 'auth/session.go',
      line: 87,
      fingerprint: 'e5f6g7h8a9b0c1d2e3f4g5h6i7j8',
      events: 892,
      lastSeen: '1h ago',
      timestamp: new Date(Date.now() - 3600000),
      status: 'unresolved',
      environment: 'staging',
    },
    {
      id: 'err_d1v8n3',
      type: 'DatabaseTimeout',
      message: 'Database connection lost after 5000ms',
      filePath: 'db/connection.py',
      line: 118,
      fingerprint: 'i9j0k1l2m3n4o5p6q7r8s9t0u1v2',
      events: 12,
      lastSeen: '3d ago',
      timestamp: new Date(Date.now() - 259200000),
      status: 'ignored',
      environment: 'production',
    },
  ]);

  // Initial projects
  const [projects, setProjects] = useState<Project[]>([
    { id: 'prj_9x8y7z', name: 'Production API', alertsEnabled: true },
    { id: 'prj_1a2b3c', name: 'Staging Worker', alertsEnabled: false },
  ]);

  const showToast = (message: string, type: 'success' | 'alert' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Fetch real GitHub stars on mount
  useEffect(() => {
    fetch('https://api.github.com/repos/dishan1223/mutt')
      .then((res) => res.json())
      .then((data) => {
        if (data.stargazers_count !== undefined) setStars(data.stargazers_count);
      })
      .catch(() => setStars(0));
  }, []);

  const handleSimulateError = (type: string, message: string, file: string, line: number, env: 'production' | 'staging' = 'production') => {
    // Generate fingerprint representation (SHA256 mock)
    let sum = 0;
    const str = `${type}:${file}:${line}`;
    for (let i = 0; i < str.length; i++) sum += str.charCodeAt(i);
    const mockFingerprint = (sum * 7392).toString(16).padEnd(28, 'e');

    const formattedTime = new Date().toLocaleTimeString();

    // Add simulation logs
    setSimulationLogs((prev) => [
      `[MUTT INGEST] Ingesting HTTP payload: error_type="${type}" environment="${env}"`,
      `[FINGERPRINT] Fingerprint hash computed: ${mockFingerprint.substring(0, 16)}...`,
      `[DATABASE] Writing error record to PostgreSQL database`,
      `[MUTT OK] Ingestion request completed. Response: 202 Accepted`,
      ...prev
    ].slice(0, 30));

    // Update error clusters list
    setErrors((prev) => {
      const matchIdx = prev.findIndex((e) => e.fingerprint === mockFingerprint || (e.type === type && e.filePath === file));
      if (matchIdx > -1) {
        const updated = [...prev];
        updated[matchIdx] = {
          ...updated[matchIdx],
          events: updated[matchIdx].events + 1,
          lastSeen: 'Just now',
          timestamp: new Date(),
        };
        return updated;
      } else {
        const newErr: ErrorEvent = {
          id: `err_${Math.random().toString(36).substring(2, 8)}`,
          type,
          message,
          filePath: file,
          line,
          fingerprint: mockFingerprint,
          events: 1,
          lastSeen: 'Just now',
          timestamp: new Date(),
          status: 'unresolved',
          environment: env,
        };
        return [newErr, ...prev];
      }
    });

    // Fire alert notifications if enabled for active project
    const activeProject = projects.find((p) => p.name.toLowerCase().includes(env) || p.alertsEnabled);
    if (activeProject && activeProject.alertsEnabled) {
      showToast(`[Slack Alert] ${type} on Line ${line} routed immediately!`, 'alert');
    } else {
      showToast(`Ingested ${type} in ${env} environment`, 'success');
    }
  };

  const handleToggleAlert = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newState = !p.alertsEnabled;
          showToast(
            newState
              ? `Alerts activated for project: ${p.name}`
              : `Muted active notifications for: ${p.name}`,
            'info'
          );
          return { ...p, alertsEnabled: newState };
        }
        return p;
      })
    );
  };

  const handleAddProject = (name: string) => {
    const id = `prj_${Math.random().toString(36).substring(2, 8)}`;
    const newProj: Project = { id, name, alertsEnabled: true };
    setProjects((prev) => [...prev, newProj]);
    showToast(`Created environment project: ${name}`, 'success');
  };

  const handleUpdateErrorStatus = (id: string, status: ErrorEvent['status']) => {
    setErrors((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          showToast(`Issue status changed to: ${status}`, 'success');
          return { ...e, status };
        }
        return e;
      })
    );
  };

  const handleTriggerOccurrence = (id: string) => {
    setErrors((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          handleSimulateError(e.type, e.message, e.filePath, e.line, e.environment);
          return { ...e, events: e.events + 1, lastSeen: 'Just now', timestamp: new Date() };
        }
        return e;
      })
    );
  };

  // Autopilot telemetry simulator loop
  useEffect(() => {
    if (!isAutopilot) return;

    const mockErrorsPool = [
      { type: 'TypeError', message: "Cannot read property 'length' of null", file: 'src/utils/parser.ts', line: 18, env: 'production' as const },
      { type: 'DatabaseTimeout', message: 'Connection pool exhausted on replication cluster', file: 'config/database.go', line: 55, env: 'production' as const },
      { type: 'NullReference', message: 'attempt to de-reference nil value inside handler', file: 'src/api/auth.go', line: 104, env: 'staging' as const },
      { type: 'ReferenceError', message: 'analyticsIsActive is not defined', file: 'public/tracker.js', line: 192, env: 'production' as const },
      { type: 'SyntaxError', message: 'Unexpected token } in JSON payload', file: 'src/checkout.js', line: 142, env: 'staging' as const },
    ];

    const interval = setInterval(() => {
      const selected = mockErrorsPool[Math.floor(Math.random() * mockErrorsPool.length)];
      handleSimulateError(selected.type, selected.message, selected.file, selected.line, selected.env);
    }, 8000);

    return () => clearInterval(interval);
  }, [isAutopilot, projects]);

  const handleNavigate = (tab: TabId) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    // Smooth scroll page back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#fdf8f8] text-[#1c1b1b] antialiased min-h-screen flex flex-col font-sans selection:bg-[#ffdcc3]">

      {/* Top Notification Toast Engine */}
      <div className="fixed top-20 right-6 z-50 space-y-2 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`p-4 rounded-xs border shadow-md font-mono text-xs pointer-events-auto flex items-start gap-2.5 ${toast.type === 'alert'
                  ? 'bg-red-50 text-red-900 border-red-300'
                  : toast.type === 'info'
                    ? 'bg-gray-900 text-white border-gray-800'
                    : 'bg-white text-black border-[#c4c7c7]'
                }`}
            >
              {toast.type === 'alert' ? (
                <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
              ) : (
                <Check size={16} className="text-green-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-grow">{toast.message}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Top Banner Call For Contributors */}
      <div className="bg-[#ebe7e6] border-b border-[#c4c7c7] py-2 px-6 text-center z-40 relative">
        <div className="font-mono text-[11px] font-bold text-[#444748] flex items-center justify-center flex-wrap gap-2">
          <span className="w-2 h-2 rounded-full bg-[#fd8b00] animate-pulse" />
          <span><span className="hidden sm:inline">CALL FOR CONTRIBUTORS: We are in early development. Help us build the future of transparent error tracking.</span><span className="sm:hidden">CALL FOR CONTRIBUTORS: We're early. Join us?</span></span>
          <button
            onClick={() => handleNavigate('docs')}
            className="underline hover:text-black ml-1 text-[10px] cursor-pointer"
          >
            Learn more
          </button>
        </div>
      </div>

      {/* Top Navigation Bar */}
      <nav className="bg-[#fdf8f8] border-b border-[#c4c7c7] w-full sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
        <div className="flex justify-between items-center h-16 px-6 max-w-[1280px] mx-auto w-full">

          {/* Logo Brand */}
          <div className="flex items-center gap-10">
            <button
              onClick={() => handleNavigate('overview')}
              className="font-mono text-lg font-bold text-black flex items-center gap-2 cursor-pointer focus:outline-none"
            >
              <MuttLogo className="w-5 h-5 text-[#FF8C00]" />
              Mutt
            </button>

            {/* Desktop Navbar Menu Links */}
            <div className="hidden md:flex items-center gap-6">
              {(['overview', 'features', 'docs'] as const).map((tab) => {
                const label = tab === 'overview' ? 'Overview' : tab === 'features' ? 'Features' : 'Docs';
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => handleNavigate(tab)}
                    className={`font-mono text-[11px] font-bold uppercase tracking-wider transition-all px-2.5 py-1 rounded-xs cursor-pointer ${isActive
                        ? 'text-black border-b-2 border-black font-extrabold'
                        : 'text-[#747878] hover:text-black hover:bg-[#f1edec]'
                      }`}
                  >
                    {label}
                  </button>
                );
              })}
              <a
                href="https://github.com/dishan1223/mutt"
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#747878] hover:text-black px-2.5 py-1 rounded-xs flex items-center gap-1"
              >
                GitHub
                <Star size={10} />
              </a>
            </div>
          </div>

          {/* GitHub Star Trigger Action button */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Live Autopilot simulation controller */}
            <div className="flex items-center gap-2 border border-[#c4c7c7] bg-white px-2.5 py-1.5 text-xs font-mono rounded-xs">
              <span className="text-[10px] uppercase font-bold text-gray-500">Auto Simulator</span>
              <button
                onClick={() => {
                  setIsAutopilot(!isAutopilot);
                  showToast(
                    !isAutopilot
                      ? 'Live production mock traffic stream started!'
                      : 'Mock traffic simulator paused.',
                    'info'
                  );
                }}
                className={`w-8 h-4 rounded-full relative transition-colors duration-200 cursor-pointer ${isAutopilot ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
              >
                <div
                  className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-200 ${isAutopilot ? 'right-0.5' : 'left-0.5'
                    }`}
                />
              </button>
            </div>

            <a
              href="https://github.com/dishan1223/mutt"
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs px-4 py-2 border flex items-center gap-2 transition-all cursor-pointer rounded-xs bg-black text-white border-black hover:bg-[#1c1b1b]"
            >
              <Github size={14} />
              <span>Star on GitHub</span>
              <span className="px-1.5 py-0.5 text-[10px] rounded-xs font-bold tabular-nums bg-white/20 text-white border border-white/30">
                {stars !== null ? stars.toLocaleString() : '—'}
              </span>
            </a>
          </div>

          {/* Mobile responsive hamburger toggle */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => {
                setIsAutopilot(!isAutopilot);
                showToast(
                  !isAutopilot
                    ? 'Live production mock traffic stream started!'
                    : 'Mock traffic simulator paused.',
                  'info'
                );
              }}
              className={`p-1.5 border border-[#c4c7c7] rounded-sm font-mono text-[10px] font-bold uppercase ${isAutopilot ? 'bg-[#ffdcc3] text-[#6e3900]' : 'bg-white text-gray-400'
                }`}
            >
              Live
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#1c1b1b] p-1 border border-[#c4c7c7] bg-white cursor-pointer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Menu Drawer Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-[#c4c7c7] bg-white text-xs font-mono uppercase font-bold text-gray-700 divide-y divide-[#c4c7c7]"
          >
            {(['overview', 'features', 'docs'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => handleNavigate(tab)}
                className="w-full text-left py-4 px-6 hover:bg-gray-50 flex items-center justify-between"
              >
                <span>{tab}</span>
                <span className="text-gray-300">&gt;</span>
              </button>
            ))}
            <a
              href="https://github.com/dishan1223/mutt"
              target="_blank"
              rel="noreferrer"
              className="block py-4 px-6 hover:bg-gray-50 flex items-center justify-between"
            >
              <span>GitHub codebase</span>
              <Star size={12} className="text-[#FF8C00]" />
            </a>
            <div className="p-6 bg-gray-50 flex justify-center">
              <a
                href="https://github.com/dishan1223/mutt"
                target="_blank"
                rel="noreferrer"
                className="bg-black text-white px-6 py-2.5 w-full flex items-center justify-center gap-2 border border-black"
              >
                <Github size={14} />
                <span>Star on GitHub ({stars !== null ? stars.toLocaleString() : '—'})</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Body Canvas Area */}
      <main className="flex-grow w-full flex">
        <div className="w-full flex">

          {/* Side Navigation Bar (Hidden on Mobile, Docked left on desktop in Features & Docs page to give high-end IDE look) */}
          {activeTab !== 'overview' && (
            <aside className="hidden lg:flex flex-col py-8 bg-[#f7f3f2] border-r border-[#c4c7c7] h-[calc(100vh-64px-37px)] w-56 sticky top-[101px] shrink-0 z-10">
              <div className="px-6 mb-8 flex items-center gap-2">
                <MuttLogo className="w-6 h-6 text-black" />
                <div>
                  <div className="font-mono text-sm font-bold text-black leading-tight">Mutt</div>
                  <div className="font-mono text-[10px] text-gray-400 font-semibold tracking-wide uppercase">
                    Error Tracking
                  </div>
                </div>
              </div>

              <nav className="flex flex-col gap-1.5 flex-grow font-mono text-xs">
                <button
                  onClick={() => handleNavigate('overview')}
                  className="flex items-center gap-3 text-[#747878] hover:text-black py-2 pl-6 hover:bg-[#ebe7e6] transition-all cursor-pointer border-l-2 border-transparent"
                >
                  <TerminalIcon size={16} />
                  <span>Overview</span>
                </button>

                <button
                  onClick={() => handleNavigate('features')}
                  className={`flex items-center gap-3 py-2 pl-6 transition-all cursor-pointer border-l-2 ${activeTab === 'features'
                      ? 'text-black border-black bg-[#ebe7e6] font-bold'
                      : 'text-[#747878] hover:text-black hover:bg-[#ebe7e6] border-transparent'
                    }`}
                >
                  <LayoutGrid size={16} />
                  <span>Features</span>
                </button>

                <button
                  onClick={() => handleNavigate('docs')}
                  className={`flex items-center gap-3 py-2 pl-6 transition-all cursor-pointer border-l-2 ${activeTab === 'docs'
                      ? 'text-black border-black bg-[#ebe7e6] font-bold'
                      : 'text-[#747878] hover:text-black hover:bg-[#ebe7e6] border-transparent'
                    }`}
                >
                  <FileText size={16} />
                  <span>Docs</span>
                </button>

                <a
                  href="https://github.com/dishan1223/mutt"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-[#747878] hover:text-black py-2 pl-6 hover:bg-[#ebe7e6] transition-all"
                >
                  <Github size={16} />
                  <span>GitHub</span>
                </a>
              </nav>

              {/* Sidebar bottom indicator */}
              <div className="px-6 mt-auto">
                <a
                  href="https://github.com/dishan1223/mutt"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-black text-white font-mono text-[11px] font-bold py-2 border border-black hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-center gap-1.5 rounded-xs"
                >
                  <Github size={12} />
                  <span>Star on GitHub</span>
                </a>
              </div>
            </aside>
          )}

          {/* Active Tab Screen Render */}
          <div className="flex-grow min-w-0">
            {activeTab === 'overview' && (
              <OverviewTab
                onNavigate={handleNavigate}
                onSimulateError={handleSimulateError}
                simulationLogs={simulationLogs}
                clearLogs={() => setSimulationLogs([])}
              />
            )}
            {activeTab === 'features' && (
              <FeaturesTab
                errors={errors}
                projects={projects}
                onToggleAlert={handleToggleAlert}
                onAddProject={handleAddProject}
                onUpdateErrorStatus={handleUpdateErrorStatus}
                onTriggerOccurrence={handleTriggerOccurrence}
              />
            )}
            {activeTab === 'docs' && (
              <DocsTab />
            )}
          </div>

        </div>
      </main>

      {/* Footer (Responsive layout conforming to Mutt system guidelines) */}
      <footer className="bg-[#fdf8f8] border-t border-[#c4c7c7] w-full z-10">
        <div className="flex flex-col md:flex-row justify-between items-center py-8 px-6 max-w-[1280px] mx-auto gap-4">
          <div className="font-mono text-[11px] font-bold text-black uppercase tracking-wider text-center md:text-left">
            © 2026 Mutt Open Source. AGPL-3.0 License.
          </div>
          <div className="flex flex-wrap justify-center gap-6 font-mono text-[11px] font-semibold">
            <button
              onClick={() => handleNavigate('docs')}
              className="text-[#747878] hover:text-black transition-colors cursor-pointer hover:underline"
            >
              License
            </button>
            <button
              onClick={() => handleNavigate('docs')}
              className="text-[#747878] hover:text-black transition-colors cursor-pointer hover:underline"
            >
              Contributing
            </button>
            <button
              onClick={() => handleNavigate('docs')}
              className="text-[#747878] hover:text-black transition-colors cursor-pointer hover:underline"
            >
              Architecture
            </button>
            <button
              onClick={() => handleNavigate('overview')}
              className="text-[#747878] hover:text-black transition-colors cursor-pointer hover:underline"
            >
              Security
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
