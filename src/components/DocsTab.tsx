import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, GitFork, Gavel, ArrowUpRight, Code2, Terminal as TerminalIcon, Check, CheckCircle2 } from 'lucide-react';

interface DocsTabProps {
  // cleaned props as mock pull requests are removed
}

export default function DocsTab({}: DocsTabProps) {
  const [activeSection, setActiveSection] = useState<'architecture' | 'contributing' | 'installation' | 'license'>('architecture');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const dockerComposeYAML = `version: "3.8"

services:
  mutt-api:
    image: mutt/api:latest
    ports:
      - "3000:3000"
    environment:
      - PORT=:3000
      - DB_HOST=mutt-db
      - DB_PORT=5432
      - DB_USER=postgres
      - DB_PASSWORD=secret
      - DB_NAME=mutt
      - REDIS_URL=redis://mutt-redis:6379
      - JWT_SECRET=your_jwt_secret_here
      - ALLOWED_ORIGINS=*
    depends_on:
      - mutt-db
      - mutt-redis

  mutt-redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  mutt-db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_PASSWORD=secret
      - POSTGRES_DB=mutt
    ports:
      - "5432:5432"`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const scrollToSection = (sec: typeof activeSection) => {
    setActiveSection(sec);
    const element = document.getElementById(sec);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-6 py-12 flex flex-col gap-8">

      {/* Docs Section Navigation — horizontal pill bar, no sidebar conflict */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#c4c7c7] pb-4">
        <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-gray-400 mr-2">
          Jump to:
        </span>
        {(['architecture', 'installation', 'contributing', 'license'] as const).map((sec) => {
          const label = sec === 'architecture' ? 'Architecture' : sec === 'installation' ? 'Installation' : sec === 'contributing' ? 'Contributing' : 'License & AGPL';
          return (
            <button
              key={sec}
              onClick={() => scrollToSection(sec)}
              className={`font-mono text-xs px-3 py-1 border transition-all cursor-pointer capitalize ${
                activeSection === sec
                  ? 'bg-black text-white border-black font-bold'
                  : 'bg-white text-[#444748] border-[#c4c7c7] hover:border-black hover:text-black'
              }`}
            >
              {label}
            </button>
          );
        })}
        <div className="ml-auto flex items-center gap-1.5 font-mono text-[11px] text-[#444748]">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Self-hosted · Docker Compose
        </div>
      </div>

      {/* Main Documentation Area */}
      <div className="w-full space-y-16 min-w-0">
        
        {/* Document Header */}
        <header className="border-b border-[#c4c7c7] pb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-[10px] bg-gray-100 text-[#444748] border border-[#c4c7c7] px-2 py-0.5 rounded-sm">
              DOCS
            </span>
            <span className="text-gray-300">/</span>
            <span className="font-mono text-[10px] text-gray-500 uppercase tracking-wide">
              {activeSection}
            </span>
          </div>
          <h1 className="font-mono text-3xl font-bold text-black mb-3">
            Architecture &amp; Data Flow
          </h1>
          <p className="font-sans text-[#444748] text-base leading-relaxed max-w-3xl">
            Understanding how Mutt ingests, processes, and stores error telemetry. A transparent, open-source look at the journey from your client directly to Postgres.
          </p>
        </header>

        {/* Section: Architecture Flow */}
        <section id="architecture" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-2.5">
            <BookOpen size={20} className="text-[#FF8C00]" />
            <h2 className="font-mono text-xl font-bold text-black">The Journey of an Error</h2>
          </div>
          <p className="font-sans text-sm text-[#444748] leading-relaxed">
            Mutt is designed for high-throughput, low-latency error ingestion. The architecture prioritizes reliability—ensuring that once an error leaves your application, it is captured, enriched, and stored safely without dropping data during sudden production traffic spikes.
          </p>

          {/* ASCII Flow Chart inside Terminal */}
          <div className="bg-[#1E1E1E] rounded-sm border border-[#333333] overflow-hidden">
            <div className="bg-[#2D2D2D] px-4 py-2 flex items-center justify-between border-b border-[#333333]">
              <div className="flex space-x-2">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>
              <span className="font-mono text-[11px] text-[#888888]">data-flow.txt</span>
              <button
                onClick={() => copyToClipboard('[Client App] ──(1. POST /api/v1/ingest)──> [Backend API (Fiber)]\n\tRate Limiting & Auth\n\tSchema Validation\n[PostgreSQL & Redis]', 'dataflow')}
                className="font-mono text-[10px] text-gray-500 hover:text-white"
              >
                {copiedText === 'dataflow' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="p-5 font-mono text-[12px] text-gray-300 leading-relaxed overflow-x-auto whitespace-pre">
{`[Client App] ──(1. POST /api/v1/ingest)──> [Backend API (Fiber)]
                                                 │
                            ┌────────────────────┼────────────────────┐
                            ▼                    ▼                    ▼
                     [Hash API Key]     [Compute Fingerprint]    [Store Error]
                            │                    │                    │
                            ▼                    ▼                    ▼
                    [Lookup Project]    [Find/Create Group]     [Update Count]
                            │                    │                    │
                            └────────────────────┼────────────────────┘
                                                 ▼
                                     [PostgreSQL / Redis]`}
            </div>
          </div>

          {/* Core Components Grid */}
          <div className="space-y-4 pt-4">
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-gray-500">Core Components</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-[#c4c7c7] bg-white p-4 rounded-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs bg-gray-100 text-black px-1.5 py-0.5 border border-[#c4c7c7] font-semibold">GO</span>
                  <h4 className="font-mono text-xs font-bold text-black">Fiber Backend API</h4>
                </div>
                <p className="font-sans text-xs text-[#444748] leading-relaxed">
                  A lightweight Go service terminating HTTP/HTTPS requests. Responsible for API key hashing, project verification, rate limiting, and core routing.
                </p>
              </div>

              <div className="border border-[#c4c7c7] bg-white p-4 rounded-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs bg-gray-100 text-black px-1.5 py-0.5 border border-[#c4c7c7] font-semibold">REDIS</span>
                  <h4 className="font-mono text-xs font-bold text-black">Redis (Upstash)</h4>
                </div>
                <p className="font-sans text-xs text-[#444748] leading-relaxed">
                  Utilized as a high-speed, distributed database buffer to limit API requests dynamically and manage stateless dashboard auth blacklisting.
                </p>
              </div>

              <div className="border border-[#c4c7c7] bg-white p-4 rounded-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs bg-gray-100 text-black px-1.5 py-0.5 border border-[#c4c7c7] font-semibold">SQL</span>
                  <h4 className="font-mono text-xs font-bold text-black">PostgreSQL (Neon)</h4>
                </div>
                <p className="font-sans text-xs text-[#444748] leading-relaxed">
                  The primary relational datastore managing database structures securely (Users, Projects, ErrorGroups, Errors) utilizing GORM sync migrations.
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-[#c4c7c7]" />

        {/* Section: Installation Guide */}
        <section id="installation" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-2.5">
            <TerminalIcon size={20} className="text-[#FF8C00]" />
            <h2 className="font-mono text-xl font-bold text-black">Self-Hosted Installation</h2>
          </div>
          <p className="font-sans text-sm text-[#444748] leading-relaxed">
            Because Mutt is self-hosted, you can boot the entire infrastructure on your own servers in under a minute using Docker Compose. All telemetry stays inside your own virtual cloud.
          </p>

          <div className="bg-[#1E1E1E] rounded-sm border border-[#333333] overflow-hidden">
            <div className="bg-[#2D2D2D] px-4 py-2 flex items-center justify-between border-b border-[#333333]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span className="font-mono text-xs text-white uppercase font-bold">docker-compose.yml</span>
              </div>
              <button
                onClick={() => copyToClipboard(dockerComposeYAML, 'yaml')}
                className="font-mono text-[10px] text-gray-500 hover:text-white"
              >
                {copiedText === 'yaml' ? 'Yaml Copied!' : 'Copy configuration'}
              </button>
            </div>
            <div className="p-5 font-mono text-[12px] text-gray-300 leading-relaxed overflow-x-auto whitespace-pre max-h-[300px]">
              {dockerComposeYAML}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-mono text-sm font-bold uppercase text-gray-500">Run Ingestion Command</h3>
            <p className="font-sans text-xs text-[#444748]">
              Boot your containers with <code className="bg-gray-100 font-mono text-[11px] px-1 border border-gray-200">docker compose up -d</code>, then run this sample Curl request to test error routing:
            </p>
            <div className="bg-[#1E1E1E] text-gray-300 font-mono text-[11px] p-3 rounded-xs border border-[#333333] flex justify-between items-center whitespace-nowrap overflow-x-auto">
              <span>{"curl -X POST http://localhost:3000/api/v1/ingest -H \"X-Mutt-Key: <your_api_key>\" -H \"Content-Type: application/json\" -d '{\"title\":\"TypeError: Cannot read cart\",\"log\":\"TypeError: Cannot read properties of undefined (reading '\''cart'\'')\",\"stack_trace\":\"TypeError: Cannot read properties of undefined (reading '\''cart'\'')\\n    at checkout (checkout.js:42)\"}'"}</span>
              <button
                onClick={() => copyToClipboard('curl -X POST http://localhost:3000/api/v1/ingest -H "X-Mutt-Key: <your_api_key>" -H "Content-Type: application/json" -d \'{"title":"TypeError: Cannot read cart","log":"TypeError: Cannot read properties of undefined (reading \'\\\'\'cart\'\\\'\')","stack_trace":"TypeError: Cannot read properties of undefined (reading \'\\\'\'cart\'\\\'\')\\n    at checkout (checkout.js:42)"}\'', 'curl')}
                className="font-mono text-[9px] text-[#FF8C00] hover:underline pl-3"
              >
                {copiedText === 'curl' ? 'Copied!' : 'Copy Curl'}
              </button>
            </div>
          </div>
        </section>

        <hr className="border-[#c4c7c7]" />

        {/* Section: Contributing Guide */}
        <section id="contributing" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-2.5">
            <GitFork size={20} className="text-[#FF8C00]" />
            <h2 className="font-mono text-xl font-bold text-black">Contributing Guide</h2>
          </div>
          
          <div className="border border-[#c4c7c7] rounded-sm overflow-hidden bg-white">
            <div className="bg-black text-white p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-mono font-bold text-sm flex items-center gap-1.5">
                  <Code2 size={16} />
                  Help Us Shape the Transparent Stack
                </h3>
                <p className="font-sans text-xs text-gray-300 mt-1">
                  Mutt is a community-driven developer tool. We actively review and merge outside contributions.
                </p>
              </div>
              <span className="font-mono text-[10px] border border-gray-500 text-gray-300 px-2 py-1 uppercase shrink-0">
                AGPL-3.0 License
              </span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left col: Local Setup Instructions */}
              <div className="md:col-span-6 space-y-4">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-gray-500">
                  Local Development Setup
                </h4>
                <div className="space-y-3 font-mono text-xs text-[#444748]">
                  <p>To set up and run Mutt locally on your computer:</p>
                  <div className="bg-gray-50 border border-[#c4c7c7] p-3 rounded-sm leading-relaxed overflow-x-auto whitespace-pre">
{`# 1. Clone repository
git clone https://github.com/dishan1223/mutt.git
cd mutt

# 2. Configure environment keys
cp .env.example .env

# 3. Boot Go + Fiber API Server
go run ./cmd/main.go`}
                  </div>
                </div>
              </div>

              {/* Right col: Contribution Guidelines */}
              <div className="md:col-span-6 space-y-3 border-t md:border-t-0 md:border-l border-[#c4c7c7] pt-6 md:pt-0 md:pl-6">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-gray-500">
                  Contribution Guidelines
                </h4>
                <div className="space-y-2 font-sans text-xs text-[#444748] leading-relaxed">
                  <p>Mutt is open-source. Help us improve the core engine by following these simple guidelines:</p>
                  <ul className="list-disc pl-4 space-y-1.5 font-mono text-[11px]">
                    <li>Ensure all database schemas have correct indexes on <code className="bg-gray-100 px-1 border border-gray-200">api_key</code> and <code className="bg-gray-100 px-1 border border-gray-200">fingerprint</code> fields.</li>
                    <li>Always write clean routing validations inside Fiber router groups.</li>
                    <li>Format Go source files using <code className="bg-gray-100 px-1 border border-gray-200">go fmt ./...</code>.</li>
                  </ul>
                  <div className="pt-2">
                    <a
                      href="https://github.com/dishan1223/mutt"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 bg-[#FF8C00] text-black font-mono font-bold uppercase py-2 px-4 hover:bg-[#fd8b00] transition-colors border border-[#FF8C00] cursor-pointer rounded-sm"
                    >
                      View GitHub Repository
                      <ArrowUpRight size={12} />
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <hr className="border-[#c4c7c7]" />

        {/* Section: License */}
        <section id="license" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-2.5">
            <Gavel size={20} className="text-[#FF8C00]" />
            <h2 className="font-mono text-xl font-bold text-black">License &amp; Copyleft Rules</h2>
          </div>
          
          <div className="bg-[#f7f3f2] border border-[#c4c7c7] p-6 rounded-sm space-y-4">
            <div className="flex items-start gap-4">
              <Gavel size={32} className="text-[#FF8C00] shrink-0" />
              <div>
                <h3 className="font-mono font-bold text-base text-black mb-1">
                  Mutt Open Source AGPL-3.0 License
                </h3>
                <p className="font-sans text-sm text-[#444748] leading-relaxed">
                  Mutt is proudly developed as open-source telemetry software. It is licensed under the strict **GNU Affero General Public License (AGPL-3.0)**.
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#c4c7c7] p-4 font-mono text-xs leading-relaxed text-[#444748]">
              Permissions of this strongest copyleft license are conditioned on making available complete source code of licensed works and modifications, which include larger works using a licensed work, under the same license. Copyright and license notices must be preserved. Any deployment of Mutt as a SaaS product must make the source code accessible to its network end-users.
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

