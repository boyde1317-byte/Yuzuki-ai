/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  Settings,
  Activity,
  Puzzle,
  Cpu,
  Power,
  Save,
  Zap,
  RefreshCw,
  Terminal,
  Database,
  Smartphone,
  Image as ImageIcon,
  Mic,
  Globe,
  MessageSquare,
  Send,
  MoreVertical,
  Paperclip,
  Wand2,
  FileText,
} from "lucide-react";

type Tab = "overview" | "ai" | "plugins" | "simulator" | "settings";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("simulator");
  const [isBotOnline, setIsBotOnline] = useState(true);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-indigo-500/30">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-20">
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
              <Bot size={24} />
            </div>
            <div>
              <h1 className="text-slate-100 font-bold text-lg leading-tight">
                Yuzuki AI
              </h1>
              <span className="text-xs text-slate-500">Control Panel v2.0</span>
            </div>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
            <NavItem
              icon={<Activity size={18} />}
              label="Overview"
              active={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
            />
            <NavItem
              icon={<Smartphone size={18} />}
              label="WhatsApp Preview"
              active={activeTab === "simulator"}
              onClick={() => setActiveTab("simulator")}
            />
            <NavItem
              icon={<Puzzle size={18} />}
              label="10x Power Plugins"
              active={activeTab === "plugins"}
              onClick={() => setActiveTab("plugins")}
            />
            <NavItem
              icon={<Cpu size={18} />}
              label="AI Configuration"
              active={activeTab === "ai"}
              onClick={() => setActiveTab("ai")}
            />
            <NavItem
              icon={<Settings size={18} />}
              label="System Settings"
              active={activeTab === "settings"}
              onClick={() => setActiveTab("settings")}
            />
          </nav>

          <div className="p-4 border-t border-slate-800">
            <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-400">
                  Bot Status
                </span>
                <span
                  className={`flex h-2.5 w-2.5 rounded-full ${isBotOnline ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-red-500"}`}
                ></span>
              </div>
              <button
                onClick={() => setIsBotOnline(!isBotOnline)}
                className={`w-full py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  isBotOnline
                    ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                    : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                }`}
              >
                <Power size={14} />
                {isBotOnline ? "Stop Bot" : "Start Bot"}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 bg-slate-950 overflow-hidden">
          <header className="flex-none bg-slate-950/80 backdrop-blur-md border-b border-slate-800 p-6 flex justify-between items-center z-10">
            <h2 className="text-2xl font-semibold text-slate-100 capitalize">
              {activeTab === "plugins"
                ? "10x Capabilities"
                : activeTab.replace("-", " ")}
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400 flex items-center gap-2">
                <Database size={14} />
                SQLite Connected
              </span>
              <button className="h-9 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20">
                <RefreshCw size={14} />
                Sync State
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {activeTab === "overview" && <OverviewTab isOnline={isBotOnline} />}
            {activeTab === "ai" && <AITab />}
            {activeTab === "plugins" && <PluginsTab />}
            {activeTab === "simulator" && <SimulatorTab />}
            {activeTab === "settings" && <SettingsTab />}
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
          : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function SimulatorTab() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hi! I am Yuzuki, now upgraded with 10x powerful features. Try asking me to summarize, search the web, or analyze an image.",
      time: "10:00 AM",
      isSystem: false,
    },
    {
      id: 2,
      sender: "user",
      text: "@Yuzuki search the web for the latest Next.js features",
      time: "10:01 AM",
      isSystem: false,
    },
    {
      id: 3,
      sender: "bot",
      text: "🔍 *Web Search Grounding Active*\n\nHere are the latest Next.js features:\n1. Server Actions (Stable)\n2. Partial Prerendering (Preview)\n3. Next.js Compiler improvements\n\nWould you like a deeper dive into any of these?",
      time: "10:01 AM",
      isSystem: false,
    },
    {
      id: 4,
      sender: "user",
      text: "@Yuzuki summarize this group chat",
      time: "10:05 AM",
      isSystem: false,
    },
    {
      id: 5,
      sender: "bot",
      text: "📝 *Context-Aware Summary*\n\nBased on the last 150 messages in this group:\n• Alex shared the design mockups for Q3.\n• Sarah asked for feedback on the new API endpoints.\n• *Action Item:* @John needs to approve the PR by 5 PM today.",
      time: "10:05 AM",
      isSystem: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isSystem: false,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate smart reply
    setTimeout(() => {
      setIsTyping(false);
      let replyText =
        "I'm simulating my response here! In the real bot, I'd use Groq AI + tools to process this request intelligently.";
      const lowerInput = input.toLowerCase();

      if (
        lowerInput.includes("image") ||
        lowerInput.includes("generate") ||
        lowerInput.includes("draw")
      ) {
        replyText =
          "🎨 *Image Generation Engine*\n\n[Imagine a beautiful AI generated image here matching your prompt!]\n_Generated via Stable Diffusion v3 Plugin_";
      } else if (
        lowerInput.includes("summarize") ||
        lowerInput.includes("tldr")
      ) {
        replyText =
          "📝 *Smart Summarization*\n\n- The team discussed the new Yuzuki update.\n- You requested 10x powerful features.\n- The dashboard was successfully upgraded.";
      } else if (lowerInput.includes("voice") || lowerInput.includes("audio")) {
        replyText =
          '🎙️ *Audio Intelligence Plugin*\n\n_Transcribing voice note..._\n"Hey everyone, don\'t forget the meeting at 3."\n\n*Intent Detected:* Reminder\n*Action Taken:* Added to group schedule.';
      } else if (lowerInput.includes("code") || lowerInput.includes("debug")) {
        replyText =
          "💻 *Code Execution Engine*\n\nI analyzed the snippet. There's a syntax error on line 42. Here is the corrected version:\n```javascript\nconst fix = true;\nconsole.log(fix);\n```";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: replyText,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isSystem: false,
        },
      ]);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="w-full max-w-3xl h-full flex flex-col bg-[#111b21] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden relative">
        {/* WhatsApp Header */}
        <div className="bg-[#202c33] px-4 py-3 flex items-center justify-between border-b border-[#222d34]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <Bot size={20} className="text-indigo-400" />
            </div>
            <div>
              <h3 className="text-[#e9edef] font-medium text-[15px]">
                Yuzuki AI (Beta)
              </h3>
              <p className="text-[#8696a0] text-xs">online</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[#aebac1]">
            <Globe size={20} />
            <MoreVertical size={20} />
          </div>
        </div>

        {/* Chat Background */}
        <div
          className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#0b141a] relative"
          style={{
            backgroundImage:
              'url("https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png")',
            opacity: 0.9,
          }}
        >
          <div className="flex flex-col space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 shadow-sm relative text-[14.5px] leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#005c4b] text-[#e9edef] rounded-tr-none"
                      : "bg-[#202c33] text-[#e9edef] rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <div className="flex justify-end items-center gap-1 mt-1">
                    <span className="text-[11px] text-[#8696a0] leading-none">
                      {msg.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#202c33] rounded-lg rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1 text-[#8696a0]">
                  <span
                    className="w-1.5 h-1.5 bg-[#8696a0] rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></span>
                  <span
                    className="w-1.5 h-1.5 bg-[#8696a0] rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="w-1.5 h-1.5 bg-[#8696a0] rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                </div>
              </div>
            )}
            <div ref={endOfMessagesRef} />
          </div>
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSend}
          className="bg-[#202c33] px-4 py-3 flex items-center gap-3"
        >
          <button
            type="button"
            className="text-[#8696a0] hover:text-[#d1d7db] transition-colors"
          >
            <Paperclip size={24} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message or use @Yuzuki..."
            className="flex-1 bg-[#2a3942] text-[#e9edef] rounded-lg px-4 py-2.5 text-[15px] focus:outline-none placeholder:text-[#8696a0]"
          />
          {input.trim() ? (
            <button
              type="submit"
              className="w-10 h-10 bg-[#00a884] rounded-full flex items-center justify-center text-white hover:bg-[#008f6f] transition-colors"
            >
              <Send size={18} className="ml-1" />
            </button>
          ) : (
            <button
              type="button"
              className="text-[#8696a0] hover:text-[#d1d7db] transition-colors"
            >
              <Mic size={24} />
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

function OverviewTab({ isOnline }: { isOnline: boolean }) {
  const [logs, setLogs] = useState<
    { time: string; type: string; message: string }[]
  >([]);
  const [uptime, setUptime] = useState("0m");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [logsRes, statusRes] = await Promise.all([
          fetch("/api/logs"),
          fetch("/api/status"),
        ]);
        if (logsRes.ok) {
          const data = await logsRes.json();
          setLogs(data.reverse()); // newest first if array is chronological
        }
        if (statusRes.ok) {
          const data = await statusRes.json();
          if (data.uptime) setUptime(data.uptime);
        }
      } catch (e) {
        // silently fail in UI
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 2000);
    return () => clearInterval(interval);
  }, []);

  const getLogColor = (type: string) => {
    switch (type) {
      case "error":
        return "text-red-400";
      case "success":
        return "text-emerald-400";
      case "warn":
        return "text-yellow-400";
      case "plugin":
        return "text-green-400";
      case "startup":
        return "text-white";
      case "db":
        return "text-purple-400";
      default:
        return "text-blue-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Messages"
          value="124,592"
          icon={<MessageSquare size={20} className="text-blue-400" />}
        />
        <StatCard
          title="AI Invocations"
          value="8,402"
          icon={<Wand2 size={20} className="text-purple-400" />}
        />
        <StatCard
          title="Active Sessions"
          value="8"
          icon={<Zap size={20} className="text-yellow-400" />}
        />
        <StatCard
          title="Uptime"
          value={uptime}
          icon={<Activity size={20} className="text-emerald-400" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-lg font-medium text-slate-200 mb-4 flex items-center gap-2">
            <Terminal size={18} className="text-slate-400" />
            Recent Core Logs
          </h3>
          <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs text-slate-400 space-y-2 h-[300px] overflow-y-auto border border-slate-800 custom-scrollbar flex flex-col-reverse">
            {logs.length > 0 ? (
              logs.map((l, i) => (
                <p key={i}>
                  <span className={getLogColor(l.type)}>
                    [{l.type.toUpperCase()}]
                  </span>{" "}
                  [{l.time}] {l.message}
                </p>
              ))
            ) : (
              <p className="text-slate-500 italic">No logs available...</p>
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-lg font-medium text-slate-200 mb-4">
            System Subsystems
          </h3>
          <div className="space-y-4">
            <StatusRow
              label="WhatsApp Baileys Socket"
              status={isOnline ? "Connected" : "Disconnected"}
              active={isOnline}
            />
            <StatusRow
              label="Groq AI Inference Core"
              status="Operational (70ms)"
              active={true}
            />
            <StatusRow
              label="Tool Execution Engine"
              status="Monitoring"
              active={true}
            />
            <StatusRow
              label="SQLite Data Store"
              status="Healthy"
              active={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-400 font-medium mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-slate-100">{value}</h4>
      </div>
      <div className="h-12 w-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
        {icon}
      </div>
    </div>
  );
}

function StatusRow({
  label,
  status,
  active,
}: {
  label: string;
  status: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400">{status}</span>
        <span
          className={`flex h-2 w-2 rounded-full ${active ? "bg-emerald-500" : "bg-red-500"}`}
        ></span>
      </div>
    </div>
  );
}

function AITab() {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-medium text-slate-200 mb-4 flex items-center gap-2">
          <Cpu size={20} className="text-indigo-400" />
          Groq AI Configuration
        </h3>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">
              Primary Inference Model
            </label>
            <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
              <option>llama3-70b-8192 (Default - High Intelligence)</option>
              <option>llama3-8b-8192 (Fast Response)</option>
              <option>mixtral-8x7b-32768 (High Context Window)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">
              System Persona Prompt
            </label>
            <textarea
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none custom-scrollbar"
              defaultValue="You are Yuzuki, an omniscient and highly intelligent WhatsApp assistant with access to advanced tools. You are concise, friendly, and powered by Groq AI. Always use tools to verify information before answering."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">
                Temperature
              </label>
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="70"
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Precise</span>
                <span>0.7</span>
                <span>Creative</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">
                Context Memory Length
              </label>
              <input
                type="number"
                defaultValue="20"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <p className="text-xs text-slate-500 mt-1">
                Messages remembered per chat.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20">
              <Save size={16} />
              Save AI Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PluginsTab() {
  const [plugins, setPlugins] = useState([
    {
      id: "websearch",
      name: "Web Search Grounding",
      desc: "Allows Yuzuki to browse the web in real-time to answer questions.",
      icon: <Globe size={20} />,
      enabled: true,
    },
    {
      id: "vision",
      name: "Multimodal Vision",
      desc: "Analyzes photos and images sent in chat, extracting text and context.",
      icon: <ImageIcon size={20} />,
      enabled: true,
    },
    {
      id: "voice",
      name: "Audio Intelligence",
      desc: "Automatically transcribes and understands WhatsApp Voice Notes.",
      icon: <Mic size={20} />,
      enabled: true,
    },
    {
      id: "summarize",
      name: "Group Chat Summarizer",
      desc: "Condenses hundreds of missed group messages into bullet points.",
      icon: <FileText size={20} />,
      enabled: true,
    },
    {
      id: "coder",
      name: "Code Interpreter",
      desc: "Executes JS/Python code snippets directly in the chat.",
      icon: <Terminal size={20} />,
      enabled: false,
    },
    {
      id: "imagegen",
      name: "Text-to-Image Generation",
      desc: "Creates images from text prompts using Stable Diffusion.",
      icon: <Wand2 size={20} />,
      enabled: false,
    },
  ]);

  const togglePlugin = (id: string) => {
    setPlugins(
      plugins.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-lg font-medium text-slate-200">
            10x Power Capabilities
          </h3>
          <p className="text-sm text-slate-400">
            Enable advanced tool-calling and multimodal features for WhatsApp
            users.
          </p>
        </div>
        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors border border-slate-700">
          Install New Capability
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {plugins.map((plugin) => (
          <div
            key={plugin.id}
            className={`bg-slate-900 border transition-colors rounded-xl p-5 flex items-start gap-4 ${plugin.enabled ? "border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.05)]" : "border-slate-800 opacity-75"}`}
          >
            <div
              className={`p-3 rounded-lg ${plugin.enabled ? "bg-indigo-500/10 text-indigo-400" : "bg-slate-800 text-slate-500"}`}
            >
              {plugin.icon}
            </div>
            <div className="flex-1">
              <h4
                className={`font-medium mb-1 ${plugin.enabled ? "text-slate-200" : "text-slate-400"}`}
              >
                {plugin.name}
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed pr-6">
                {plugin.desc}
              </p>
            </div>
            <button
              onClick={() => togglePlugin(plugin.id)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 mt-1 ${plugin.enabled ? "bg-indigo-500" : "bg-slate-700"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${plugin.enabled ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-medium text-slate-200 mb-6 flex items-center gap-2">
          <Settings size={20} className="text-slate-400" />
          Connection Settings
        </h3>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">
              Pairing Phone Number
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="+1234567890"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <button className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors border border-slate-700 whitespace-nowrap">
                Request Code
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Required for Baileys pairing code auth (no QR scan).
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <label className="block text-sm font-medium text-slate-400 mb-1.5">
              Groq API Key
            </label>
            <input
              type="password"
              defaultValue="gsk_XXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20">
              <Save size={16} />
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
