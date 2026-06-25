import { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, DollarSign, Layers, Zap, Activity, Bell, Terminal as TerminalIcon, ArrowRight, CheckCircle2, ChevronRight, Play } from 'lucide-react';
import { TabId } from '../types';

interface OverviewTabProps {
  onNavigate: (tab: TabId) => void;
  onSimulateError: (type: string, message: string, file: string, line: number) => void;
  simulationLogs: string[];
  clearLogs: () => void;
}

export default function OverviewTab({
  onNavigate,
  onSimulateError,
  simulationLogs,
  clearLogs,
}: OverviewTabProps) {
  const [selectedProtocol, setSelectedProtocol] = useState<'curl' | 'http'>('curl');
  const [activeRoadmap, setActiveRoadmap] = useState(false);

  const mockCodeSnippets = {
    curl: `curl -X POST https://github.com/dishan1223/mutt/api/v1/ingest \\
  -H "X-Mutt-Key: mutt_sk_live_8f3d1b9" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "TypeError: Cannot read properties of undefined (reading '\''cart'\'')",
    "log": "TypeError: Cannot read properties of undefined (reading '\''cart'\'')\\n    at checkout (src/components/checkout.js:42:14)",
    "stack_trace": "TypeError: Cannot read properties of undefined (reading '\''cart'\'')\\n    at checkout (src/components/checkout.js:42:14)\\n    at processOrder (src/controllers/payment.ts:182:12)",
    "severity": "error"
  }'`,
    http: `POST /api/v1/ingest HTTP/1.1
Host: github.com/dishan1223/mutt
X-Mutt-Key: mutt_sk_live_8f3d1b9
Content-Type: application/json

{
  "title": "TypeError: Cannot read properties of undefined (reading 'cart')",
  "log": "TypeError: Cannot read properties of undefined (reading 'cart')\\n    at checkout (src/components/checkout.js:42:14)",
  "stack_trace": "TypeError: Cannot read properties of undefined (reading 'cart')\\n    at checkout (src/components/checkout.js:42:14)\\n    at processOrder (src/controllers/payment.ts:182:12)",
  "severity": "error"
}`,
  };

  const handleSimulate = () => {
    onSimulateError(
      'TypeError',
      "Cannot read properties of undefined (reading 'cart')",
      'src/components/checkout.js',
      42
    );
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-6 py-12 md:py-20 flex flex-col items-center">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center flex flex-col items-center max-w-4xl"
      >
        <div className="mb-6">
          <span className="bg-[#ffdcc3] text-[#603100] font-mono text-[11px] tracking-wider uppercase px-3 py-1 border border-[#c4c7c7] font-bold">
            Alpha Preview
          </span>
        </div>
        <h1 className="font-mono text-3xl md:text-5xl font-bold tracking-tight text-black leading-tight max-w-4xl">
          ERROR TRACKING FOR THE TRANSPARENT STACK.
        </h1>
        <p className="font-sans text-base md:text-lg text-[#444748] mt-6 max-w-2xl leading-relaxed">
          An early-stage, open-source, and self-hosted error tracking tool. We're building for developers who demand full visibility. Join us in shaping the transparent stack.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <button
            onClick={() => onNavigate('features')}
            className="bg-black text-white font-mono text-sm px-6 py-3 border border-black hover:bg-[#1c1b1b] transition-colors cursor-pointer flex items-center justify-center gap-2 group"
          >
            Explore Active Dashboard
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => setActiveRoadmap(true)}
            className="bg-transparent text-black font-mono text-sm px-6 py-3 border border-[#747878] hover:border-black transition-colors cursor-pointer"
          >
            Read Roadmap
          </button>
        </div>
      </motion.section>

      {/* Terminal Code Simulator */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-4xl mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-12 gap-6 bg-white border border-[#c4c7c7] overflow-hidden"
      >
        {/* Left Column: Code Picker */}
        <div className="md:col-span-7 bg-[#1E1E1E] text-white p-5 flex flex-col">
          <div className="flex items-center justify-between border-b border-[#333333] pb-3 mb-4">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>
            <div className="flex gap-2">
              {(['curl', 'http'] as const).map((proto) => (
                <button
                  key={proto}
                  onClick={() => setSelectedProtocol(proto)}
                  className={`font-mono text-xs px-2.5 py-1 transition-colors uppercase ${
                    selectedProtocol === proto
                      ? 'bg-[#333333] text-[#FF8C00] font-bold border border-[#444444]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {proto === 'curl' ? 'cURL Request' : 'Raw HTTP'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-grow font-mono text-[13px] leading-relaxed overflow-x-auto whitespace-pre text-gray-300">
            {mockCodeSnippets[selectedProtocol]}
          </div>
          <div className="border-t border-[#333333] pt-4 mt-4 flex justify-between items-center">
            <span className="text-xs font-mono text-gray-400">
              {selectedProtocol === 'curl'
                ? 'POST /api/v1/ingest'
                : 'payload.json'}
            </span>
            <button
              onClick={handleSimulate}
              className="bg-[#FF8C00] text-black font-mono font-bold text-xs px-4 py-2 border border-[#FF8C00] hover:bg-[#fd8b00] transition-colors flex items-center gap-1.5 cursor-pointer rounded-sm"
            >
              <Play size={12} fill="black" />
              Simulate Error Ingest
            </button>
          </div>
        </div>

        {/* Right Column: Mutt Live Ingestion Logs */}
        <div className="md:col-span-5 bg-gray-50 p-5 flex flex-col border-t md:border-t-0 md:border-l border-[#c4c7c7]">
          <div className="flex justify-between items-center border-b border-[#c4c7c7] pb-3 mb-4">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
              <TerminalIcon size={14} className="text-[#FF8C00]" />
              Mutt Live Ingest Stream
            </span>
            {simulationLogs.length > 0 && (
              <button
                onClick={clearLogs}
                className="font-mono text-[10px] text-gray-500 hover:text-black transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex-grow font-mono text-[11px] space-y-2 overflow-y-auto max-h-[250px] min-h-[200px] text-[#444748] pr-1 scrollbar-thin">
            {simulationLogs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 py-8">
                <TerminalIcon size={24} className="mb-2 stroke-1" />
                <p>No active ingest stream.</p>
                <p className="text-[10px] mt-1">Click "Simulate Error Ingest" on the left to trigger errors in real-time!</p>
              </div>
            ) : (
              simulationLogs.map((log, index) => {
                let colorClass = 'text-gray-500';
                if (log.includes('[ERROR INGESTED]')) colorClass = 'text-red-600 font-bold';
                else if (log.includes('[MUTT OK]')) colorClass = 'text-green-600 font-semibold';
                else if (log.includes('[FINGERPRINT]')) colorClass = 'text-orange-600 font-semibold';
                else if (log.includes('[QUEUED]')) colorClass = 'text-blue-600';
                return (
                  <div key={index} className={`border-l-2 pl-2 ${colorClass} leading-tight py-0.5`}>
                    {log}
                  </div>
                );
              })
            )}
          </div>
          {simulationLogs.length > 0 && (
            <div className="mt-4 pt-3 border-t border-[#c4c7c7] flex justify-between items-center text-[11px] font-mono">
              <span className="text-[#603100] flex items-center gap-1 font-bold">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                Listening...
              </span>
              <button
                onClick={() => onNavigate('features')}
                className="text-black font-semibold hover:underline flex items-center gap-0.5"
              >
                View Dashboard
                <ChevronRight size={12} />
              </button>
            </div>
          )}
        </div>
      </motion.section>

      {/* Why Mutt Section */}
      <section className="w-full py-16 border-y border-[#c4c7c7] bg-gray-50/50 mt-20 md:mt-28">
        <div className="max-w-4xl mx-auto w-full">
          <h2 className="font-mono text-2xl font-bold text-black text-center mb-10">Why Mutt?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 border border-[#c4c7c7] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-black bg-gray-100 p-2 border border-[#c4c7c7]">
                    <Eye size={20} />
                  </div>
                  <h3 className="font-mono text-base font-bold text-black">Transparency</h3>
                </div>
                <p className="font-sans text-sm text-[#444748] leading-relaxed">
                  Self-host to maintain complete control over your telemetry data. Audit the code, understand exactly what is collected, and ensure compliance with your security policies. No opaque SaaS black boxes.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 border border-[#c4c7c7] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-black bg-gray-100 p-2 border border-[#c4c7c7]">
                    <DollarSign size={20} />
                  </div>
                  <h3 className="font-mono text-base font-bold text-black">Cost Efficiency</h3>
                </div>
                <p className="font-sans text-sm text-[#444748] leading-relaxed">
                  Escape unpredictable volume-based pricing. Mutt is designed to be lightweight and run efficiently on your own infrastructure, drastically reducing the cost of error tracking at scale.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Section */}
      <section className="w-full max-w-4xl py-16 md:py-24">
        <h2 className="font-mono text-2xl font-bold text-black mb-10 text-center">Core Capabilities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigate('features')}
            className="bg-white p-5 border border-[#c4c7c7] hover:bg-gray-50 hover:border-black transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 bg-gray-50 flex items-center justify-center border border-[#c4c7c7] mb-4 group-hover:border-black transition-colors">
              <Layers size={18} className="text-[#444748] group-hover:text-black" />
            </div>
            <h4 className="font-mono text-sm font-semibold text-black mb-2">Error Grouping</h4>
            <p className="font-sans text-xs text-[#444748] leading-relaxed">
              Automatic clustering of similar errors based on stack traces and fingerprinting.
            </p>
          </div>

          <div
            onClick={() => onNavigate('features')}
            className="bg-white p-5 border border-[#c4c7c7] hover:bg-gray-50 hover:border-black transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 bg-gray-50 flex items-center justify-center border border-[#c4c7c7] mb-4 group-hover:border-black transition-colors">
              <Zap size={18} className="text-[#444748] group-hover:text-black" />
            </div>
            <h4 className="font-mono text-sm font-semibold text-black mb-2">Real-time Ingestion</h4>
            <p className="font-sans text-xs text-[#444748] leading-relaxed">
              Low-latency ingestion ensures you see errors the moment they happen in production.
            </p>
          </div>

          <div
            onClick={() => onNavigate('features')}
            className="bg-white p-5 border border-[#c4c7c7] hover:bg-gray-50 hover:border-black transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 bg-gray-50 flex items-center justify-center border border-[#c4c7c7] mb-4 group-hover:border-black transition-colors">
              <Activity size={18} className="text-[#444748] group-hover:text-black" />
            </div>
            <h4 className="font-mono text-sm font-semibold text-black mb-2">Status Tracking</h4>
            <p className="font-sans text-xs text-[#444748] leading-relaxed">
              Mark issues as unresolved, ignored, or resolved directly from the clean dashboard.
            </p>
          </div>

          <div
            onClick={() => onNavigate('features')}
            className="bg-white p-5 border border-[#c4c7c7] hover:bg-gray-50 hover:border-black transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 bg-gray-50 flex items-center justify-center border border-[#c4c7c7] mb-4 group-hover:border-black transition-colors">
              <Bell size={18} className="text-[#444748] group-hover:text-black" />
            </div>
            <h4 className="font-mono text-sm font-semibold text-black mb-2">Per-Project Alerts</h4>
            <p className="font-sans text-xs text-[#444748] leading-relaxed">
              Configure precise notification rules for Slack, Webhooks, or Email per environment.
            </p>
          </div>
        </div>
      </section>

      {/* Roadmap Modal Overlay */}
      {activeRoadmap && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border-2 border-black max-w-lg w-full p-6 shadow-lg rounded-sm flex flex-col"
          >
            <div className="flex justify-between items-center border-b-2 border-black pb-3 mb-4">
              <h3 className="font-mono font-bold text-lg flex items-center gap-2 text-black">
                <span className="w-2.5 h-2.5 bg-[#FF8C00] rounded-full inline-block" />
                Mutt Roadmap 2026
              </h3>
              <button
                onClick={() => setActiveRoadmap(false)}
                className="font-mono font-bold text-sm text-gray-500 hover:text-black transition-colors px-1 cursor-pointer"
              >
                [ CLOSE ]
              </button>
            </div>
            <div className="space-y-4 font-mono text-xs leading-relaxed max-h-[380px] overflow-y-auto pr-1">
              <div className="border border-[#c4c7c7] p-3 bg-gray-50">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[#FF8C00] font-bold">PHASE 1: Core API & DB</span>
                  <span className="bg-green-100 text-green-800 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase">
                    100% Done
                  </span>
                </div>
                <p className="text-gray-600 font-sans">
                  Go-based Fiber API server, GORM sync auto-migrations, and automated fingerprint error grouping.
                </p>
              </div>

              <div className="border border-[#c4c7c7] p-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-black font-bold">PHASE 2: SDK Integrations</span>
                  <span className="bg-[#ffdcc3] text-[#6e3900] font-bold px-1.5 py-0.5 rounded text-[9px] uppercase">
                    Under Development
                  </span>
                </div>
                <p className="text-gray-600 font-sans">
                  Official language SDKs for Go, Javascript, and Python to make capturing and routing exceptions seamless.
                </p>
              </div>

              <div className="border border-[#c4c7c7] p-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-gray-400 font-bold">PHASE 3: Full-stack Self-host</span>
                  <span className="bg-gray-100 text-gray-600 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase">
                    Planned (Q3 2026)
                  </span>
                </div>
                <p className="text-gray-400 font-sans">
                  Pre-configured Docker Compose orchestrations, unified deployment docs, and integrated database retention/pruning limits.
                </p>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-[#c4c7c7] flex justify-end">
              <button
                onClick={() => setActiveRoadmap(false)}
                className="bg-black text-white font-mono text-xs px-4 py-2 border border-black hover:bg-[#1a1a1a] transition-colors cursor-pointer"
              >
                Acknowledge
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
