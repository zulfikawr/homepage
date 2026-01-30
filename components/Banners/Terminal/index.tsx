'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card } from '@/components/UI';
import { Icon, Separator } from '@/components/UI';
import { useCollection } from '@/hooks';
import { Post } from '@/types/post';
import { Project } from '@/types/project';
import { mapRecordToPost, mapRecordToProject } from '@/lib/mappers';

export default function TerminalBanner({ className = '' }: { className?: string }) {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  const { data: posts } = useCollection<Post>('posts', mapRecordToPost);
  const { data: projects } = useCollection<Project>('projects', mapRecordToProject);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setTime(new Date()), 1000);
    
    const syncInterval = setInterval(() => {
      setSyncProgress(prev => (prev >= 100 ? 0 : prev + Math.floor(Math.random() * 5) + 1));
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(syncInterval);
    };
  }, []);

  const systemInfo = useMemo(() => {
    if (typeof window === 'undefined') return { os: 'Linux', cpu: 'x86_64' };
    const ua = window.navigator.userAgent;
    let os = 'Linux';
    if (ua.indexOf('Win') !== -1) os = 'Windows';
    if (ua.indexOf('Mac') !== -1) os = 'macOS';
    
    return {
      os,
      cpu: 'x86_64',
      shell: 'zsh 5.8',
      term: 'xterm-256color'
    };
  }, []);

  const stats = useMemo(() => {
    return [
      { label: 'POSTS', value: posts?.length || 0, color: 'text-[#fe8019]' },
      { label: 'PROJS', value: projects?.length || 0, color: 'text-[#8ec07c]' },
      { label: 'UPTIME', value: '15d 4h', color: 'text-[#b8bb26]' },
      { label: 'MEM', value: '1.2GB', color: 'text-[#83a598]' },
    ];
  }, [posts, projects]);

  const recentActivity = useMemo(() => {
    const all = [
      ...(posts?.slice(0, 3).map(p => ({ label: 'POST', title: p.title, date: p.dateString })) || []),
      ...(projects?.slice(0, 3).map(p => ({ label: 'PROJ', title: p.name, date: p.dateString })) || []),
    ].sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime());
    return all.slice(0, 3);
  }, [posts, projects]);

  if (!mounted) return null;

  const progressBar = () => {
    const filled = Math.floor(syncProgress / 5);
    return `[${'#'.repeat(filled)}${'.'.repeat(20 - filled)}] ${syncProgress}%`;
  };

  return (
    <Card className={`relative overflow-hidden font-mono text-xs md:text-sm bg-[#fbf1c7] dark:bg-[#1d2021] border-[#d5c4a1] dark:border-[#3c3836] ${className}`} isPreview>
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#ebdbb2] dark:bg-[#3c3836] border-b border-[#d5c4a1] dark:border-[#3c3836]">
        <div className="flex gap-1.5">
          <div className="size-2.5 rounded-full bg-[#fb4934] shadow-[0_0_5px_rgba(251,73,52,0.5)]" />
          <div className="size-2.5 rounded-full bg-[#fabd2f] shadow-[0_0_5px_rgba(250,189,47,0.5)]" />
          <div className="size-2.5 rounded-full bg-[#b8bb26] shadow-[0_0_5px_rgba(184,187,38,0.5)]" />
        </div>
        <div className="text-[10px] uppercase font-bold text-[#7c6f64] dark:text-[#a89984] tracking-widest flex items-center">
          SYSTEM_MONITOR v1.0.4
        </div>
        <div className="text-[10px] text-[#928374]">PID: 4821</div>
      </div>

      {/* Terminal Body */}
      <div className="p-4 space-y-5 min-h-[250px]">
        {/* Top Row: System Info & Progress */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-1">
            <div className="text-[#98971a] dark:text-[#b8bb26] font-bold">OS: <span className="text-[#3c3836] dark:text-[#ebdbb2] font-normal">{systemInfo.os}</span></div>
            <div className="text-[#98971a] dark:text-[#b8bb26] font-bold">CPU: <span className="text-[#3c3836] dark:text-[#ebdbb2] font-normal">{systemInfo.cpu}</span></div>
            <div className="text-[#98971a] dark:text-[#b8bb26] font-bold">SHELL: <span className="text-[#3c3836] dark:text-[#ebdbb2] font-normal">{systemInfo.shell}</span></div>
          </div>
          <div className="flex-1 space-y-1">
            <div className="text-[#d79921] dark:text-[#fabd2f] font-bold uppercase tracking-tighter mb-1">Database Sync</div>
            <div className="text-[#689d6a] dark:text-[#8ec07c]">{progressBar()}</div>
            <div className="text-[10px] text-[#928374] animate-pulse">SCANNING DATABASE SECTORS...</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-[#ebdbb2] dark:bg-[#282828] border border-[#d5c4a1] dark:border-[#3c3836] p-2 rounded relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-1 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Icon name="database" className="size-8 text-[#3c3836] dark:text-[#ebdbb2]" />
              </div>
              <div className="text-[9px] text-[#928374] font-bold mb-1">{stat.label}</div>
              <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Recent Activity Table-like */}
        <div className="space-y-2">
          <div className="text-[#af3a03] dark:text-[#fe8019] font-bold border-b border-[#d5c4a1] dark:border-[#3c3836] pb-1 flex justify-between">
            <span>RECENT_DATA_NODES</span>
            <span className="text-[10px] font-normal opacity-50">STREAMS_ACTIVE</span>
          </div>
          <div className="space-y-1 font-mono text-[11px] md:text-xs">
            {recentActivity.map((act, i) => (
              <div key={i} className="flex items-center gap-3 py-0.5 hover:bg-[#ebdbb2] dark:hover:bg-[#32302f] transition-colors group cursor-default">
                <span className="text-[#928374] w-12 shrink-0">[{act.label}]</span>
                <span className="text-[#3c3836] dark:text-[#ebdbb2] truncate flex-1">{act.title}</span>
                <span className="text-[#458588] dark:text-[#83a598] shrink-0">{act.date}</span>
                <span className="text-[#98971a] dark:text-[#b8bb26] shrink-0 opacity-0 group-hover:opacity-100">READY</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Prompt */}
        <div className="flex items-center gap-2 pt-1 border-t border-[#d5c4a1] dark:border-[#3c3836]/30">
          <span className="text-[#98971a] dark:text-[#b8bb26] font-bold">zulfikar@homepage</span>
          <span className="text-[#3c3836] dark:text-[#ebdbb2]">:</span>
          <span className="text-[#458588] dark:text-[#83a598]">~</span>
          <span className="text-[#3c3836] dark:text-[#ebdbb2] font-bold">$</span>
          <div className="flex items-center">
             <span className="text-[#3c3836] dark:text-[#ebdbb2]">watch -n 1 stats.sh</span>
             <span className="ml-1 w-2 h-4 bg-[#3c3836] dark:bg-[#ebdbb2] animate-caret" />
          </div>
          <div className="ml-auto text-[10px] text-[#928374]">
            {time.toLocaleTimeString([], { hour12: false })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes caret {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-caret {
          animation: caret 1s step-end infinite;
        }
      `}</style>
    </Card>
  );
}

