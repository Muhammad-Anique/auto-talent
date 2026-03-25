'use client';

import React, { useCallback } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import ChatPanel from '@/components/super-agent/chat-panel';
import ArtifactPanel from '@/components/super-agent/artifact-panel';
import { useSuperAgent } from '@/components/super-agent/use-super-agent';
import { useLocale } from '@/components/providers/locale-provider';

export default function AgentPage() {
  const {
    messages,
    error,
    append,
    isLoading,
    stop,
    artifacts,
    activeArtifact,
    activeArtifactId,
    setActiveArtifactId,
    isArtifactLoading,
    updateArtifactHtml,
    revertToVersion,
    clearAll,
  } = useSuperAgent();

  const handleSubmit = useCallback((message: string) => {
    append({ content: message, role: 'user' });
  }, [append]);

  const handleRequestTranslate = useCallback((language: string) => {
    append({
      content: `Please translate the current artifact to ${language}. Keep all HTML structure and styling exactly the same, only translate the text content.`,
      role: 'user',
    });
  }, [append]);

  const handleRequestSave = useCallback(() => {
    if (!activeArtifact) return;
    append({
      content: `Please save the current ${activeArtifact.type.replace('_', ' ')} artifact titled "${activeArtifact.title}" to my account.`,
      role: 'user',
    });
  }, [append, activeArtifact]);

  const hasArtifact = activeArtifact !== null;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Desktop */}
      <div className="flex-1 hidden md:block overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={hasArtifact ? 38 : 100} minSize={28}>
            <ChatPanel
              messages={messages}
              isLoading={isLoading}
              error={error}
              artifacts={artifacts}
              activeArtifactId={activeArtifactId}
              onSelectArtifact={setActiveArtifactId}
              onDismissArtifact={() => setActiveArtifactId(null)}
              onSubmit={handleSubmit}
              onStop={stop}
              onClear={clearAll}
            />
          </ResizablePanel>

          {hasArtifact && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={62} minSize={30}>
                <ArtifactPanel
                  artifact={activeArtifact}
                  isLoading={isArtifactLoading}
                  onUpdateHtml={updateArtifactHtml}
                  onRevertToVersion={revertToVersion}
                  onRequestSave={handleRequestSave}
                  onRequestTranslate={handleRequestTranslate}
                  onClose={() => setActiveArtifactId(null)}
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>

      {/* Mobile */}
      <div className="flex-1 md:hidden flex flex-col overflow-hidden">
        {hasArtifact ? (
          <MobileTabs
            messages={messages}
            isLoading={isLoading}
            error={error}
            artifacts={artifacts}
            activeArtifact={activeArtifact}
            activeArtifactId={activeArtifactId}
            isArtifactLoading={isArtifactLoading}
            onSelectArtifact={setActiveArtifactId}
            onSubmit={handleSubmit}
            onStop={stop}
            onClear={clearAll}
            onUpdateHtml={updateArtifactHtml}
            onRevertToVersion={revertToVersion}
            onRequestSave={handleRequestSave}
            onRequestTranslate={handleRequestTranslate}
          />
        ) : (
          <ChatPanel
            messages={messages}
            isLoading={isLoading}
            error={error}
            artifacts={artifacts}
            activeArtifactId={activeArtifactId}
            onSelectArtifact={setActiveArtifactId}
            onSubmit={handleSubmit}
            onStop={stop}
            onClear={clearAll}
          />
        )}
      </div>
    </div>
  );
}

function MobileTabs({
  messages,
  isLoading,
  error,
  artifacts,
  activeArtifact,
  activeArtifactId,
  isArtifactLoading,
  onSelectArtifact,
  onSubmit,
  onStop,
  onClear,
  onUpdateHtml,
  onRevertToVersion,
  onRequestSave,
  onRequestTranslate,
}: {
  messages: React.ComponentProps<typeof ChatPanel>['messages'];
  isLoading: boolean;
  error?: Error;
  artifacts: React.ComponentProps<typeof ChatPanel>['artifacts'];
  activeArtifact: React.ComponentProps<typeof ArtifactPanel>['artifact'];
  activeArtifactId: string | null;
  isArtifactLoading: boolean;
  onSelectArtifact: (id: string) => void;
  onSubmit: (message: string) => void;
  onStop: () => void;
  onClear: () => void;
  onUpdateHtml: (html: string) => void;
  onRevertToVersion: (index: number) => void;
  onRequestSave: () => void;
  onRequestTranslate: (language: string) => void;
}) {
  const { t } = useLocale();
  const tr = (key: string) => t(`dashboard.agentPage.${key}`);
  const [tab, setTab] = React.useState<'chat' | 'artifact'>('chat');

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-zinc-200 shrink-0">
        <button
          onClick={() => setTab('chat')}
          className={`flex-1 py-2 text-xs font-medium transition-colors ${
            tab === 'chat' ? 'text-zinc-800 border-b-2 border-zinc-800' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          {tr('chat')}
        </button>
        <button
          onClick={() => setTab('artifact')}
          className={`flex-1 py-2 text-xs font-medium transition-colors ${
            tab === 'artifact' ? 'text-zinc-800 border-b-2 border-zinc-800' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          {tr('document')}
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        {tab === 'chat' ? (
          <ChatPanel
            messages={messages}
            isLoading={isLoading}
            error={error}
            artifacts={artifacts}
            activeArtifactId={activeArtifactId}
            onSelectArtifact={onSelectArtifact}
            onSubmit={onSubmit}
            onStop={onStop}
            onClear={onClear}
          />
        ) : (
          <ArtifactPanel
            artifact={activeArtifact}
            isLoading={isArtifactLoading}
            onUpdateHtml={onUpdateHtml}
            onRevertToVersion={onRevertToVersion}
            onRequestSave={onRequestSave}
            onRequestTranslate={onRequestTranslate}
            onClose={() => onSelectArtifact('')}
          />
        )}
      </div>
    </div>
  );
}
