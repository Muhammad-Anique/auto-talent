'use client';

import { useChat } from 'ai/react';
import { useState, useCallback, useEffect } from 'react';
import type { ArtifactType } from '@/lib/super-agent/artifact-templates';

export interface ArtifactState {
  id: string;
  type: ArtifactType;
  title: string;
  html: string;
  language: string;
  createdAt: Date;
  versions: Array<{ html: string; title: string; timestamp: Date }>;
  resumeId?: string;
}

interface UseSuperAgentOptions {
  resumeContext?: string;
}

export function useSuperAgent(options: UseSuperAgentOptions = {}) {
  const [artifacts, setArtifacts] = useState<ArtifactState[]>([]);
  const [activeArtifactId, setActiveArtifactId] = useState<string | null>(null);
  const [isArtifactLoading, setIsArtifactLoading] = useState(false);

  const activeArtifact = artifacts.find(a => a.id === activeArtifactId) || null;

  const {
    messages,
    error,
    append,
    isLoading,
    stop,
    setMessages,
  } = useChat({
    api: '/api/super-agent',
    body: {
      resumeContext: options.resumeContext,
    },
    maxSteps: 10,
    async onToolCall({ toolCall }) {
      const { toolName, args } = toolCall;

      if (toolName === 'create_artifact') {
        const { type, title, html, language, resume_id } = args as {
          type: ArtifactType;
          title: string;
          html: string;
          language?: string;
          resume_id?: string;
        };
        setIsArtifactLoading(true);
        const id = crypto.randomUUID();
        const newArtifact: ArtifactState = {
          id,
          type,
          title,
          html,
          language: language || 'en',
          createdAt: new Date(),
          versions: [{ html, title, timestamp: new Date() }],
          resumeId: resume_id,
        };
        setArtifacts(prev => [...prev, newArtifact]);
        setActiveArtifactId(id);
        setIsArtifactLoading(false);
        return { success: true, type, title, artifact_id: id };
      }

      if (toolName === 'update_artifact') {
        const { title, html, language } = args as {
          title?: string;
          html: string;
          language?: string;
        };
        setIsArtifactLoading(true);
        setArtifacts(prev => prev.map(a => {
          if (a.id !== activeArtifactId) return a;
          return {
            ...a,
            html,
            title: title || a.title,
            language: language || a.language,
            versions: [...a.versions, { html, title: title || a.title, timestamp: new Date() }],
          };
        }));
        setIsArtifactLoading(false);
        return { success: true };
      }

      if (toolName === 'translate_artifact') {
        const { target_language, target_language_code, html } = args as {
          target_language: string;
          target_language_code: string;
          html: string;
        };
        setIsArtifactLoading(true);
        setArtifacts(prev => prev.map(a => {
          if (a.id !== activeArtifactId) return a;
          return {
            ...a,
            html,
            language: target_language_code,
            versions: [...a.versions, { html, title: `${a.title} (${target_language})`, timestamp: new Date() }],
          };
        }));
        setIsArtifactLoading(false);
        return { success: true, language: target_language };
      }

      return undefined;
    },
  });

  const updateArtifactHtml = useCallback((html: string) => {
    setArtifacts(prev => prev.map(a => {
      if (a.id !== activeArtifactId) return a;
      return {
        ...a,
        html,
        versions: [...a.versions, { html, title: a.title, timestamp: new Date() }],
      };
    }));
  }, [activeArtifactId]);

  const revertToVersion = useCallback((index: number) => {
    setArtifacts(prev => prev.map(a => {
      if (a.id !== activeArtifactId || !a.versions[index]) return a;
      const version = a.versions[index];
      return { ...a, html: version.html, title: version.title };
    }));
  }, [activeArtifactId]);

  const clearAll = useCallback(() => {
    setMessages([]);
    setArtifacts([]);
    setActiveArtifactId(null);
    localStorage.removeItem('super-agent-conversation');
  }, [setMessages]);

  // Persist
  const conversationKey = 'super-agent-conversation';

  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(conversationKey, JSON.stringify({
          messages,
          artifacts: artifacts.map(a => ({
            ...a,
            createdAt: a.createdAt.toISOString(),
            versions: a.versions.map(v => ({ ...v, timestamp: v.timestamp.toISOString() })),
          })),
          activeArtifactId,
        }));
      } catch { /* full */ }
    }
  }, [messages, artifacts, activeArtifactId]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(conversationKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.messages?.length > 0) setMessages(parsed.messages);
        if (parsed.artifacts?.length > 0) {
          setArtifacts(parsed.artifacts.map((a: ArtifactState & { createdAt: string; versions: Array<{ html: string; title: string; timestamp: string }> }) => ({
            ...a,
            createdAt: new Date(a.createdAt),
            versions: a.versions.map(v => ({ ...v, timestamp: new Date(v.timestamp) })),
          })));
        }
        if (parsed.activeArtifactId) setActiveArtifactId(parsed.activeArtifactId);
      }
    } catch { /* invalid */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    messages,
    error,
    append,
    isLoading,
    stop,
    setMessages,
    artifacts,
    activeArtifact,
    activeArtifactId,
    setActiveArtifactId,
    isArtifactLoading,
    updateArtifactHtml,
    revertToVersion,
    clearAll,
  };
}
