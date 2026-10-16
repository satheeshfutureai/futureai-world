import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface MarkdownViewProps {
  content: string;
  className?: string;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content, className = '' }) => {
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Split by code blocks
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className={`space-y-3 leading-relaxed text-slate-200 text-xs sm:text-sm ${className}`}>
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          // Extract language and code
          const firstLineEnd = part.indexOf('\n');
          let lang = 'code';
          let codeText = '';
          if (firstLineEnd !== -1) {
            lang = part.slice(3, firstLineEnd).trim() || 'code';
            codeText = part.slice(firstLineEnd + 1, -3).trimEnd();
          } else {
            codeText = part.slice(3, -3);
          }
          const codeId = `code-${index}`;

          return (
            <div key={index} className="my-2.5 rounded-xl overflow-hidden border border-slate-800 bg-[#060812] shadow-md">
              <div className="px-3.5 py-1.5 bg-[#0C101E] border-b border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Terminal className="w-3.5 h-3.5" />
                  <span className="uppercase">{lang}</span>
                </span>
                <button
                  onClick={() => handleCopyCode(codeText, codeId)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                  {copiedCodeId === codeId ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 text-[10px]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span className="text-[10px]">Copy code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3.5 overflow-x-auto text-xs font-mono text-cyan-200 leading-relaxed scrollbar-thin">
                <code>{codeText}</code>
              </pre>
            </div>
          );
        }

        // Parse paragraphs and bullet lines
        const lines = part.split('\n');
        return (
          <div key={index} className="space-y-1.5">
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();
              if (!trimmed) {
                return <div key={lIdx} className="h-1" />;
              }

              // Heading levels
              if (trimmed.startsWith('### ')) {
                return (
                  <h4 key={lIdx} className="font-bold text-sm text-cyan-300 pt-2 pb-0.5 border-b border-slate-800/60">
                    {formatInlineText(trimmed.slice(4))}
                  </h4>
                );
              }
              if (trimmed.startsWith('## ')) {
                return (
                  <h3 key={lIdx} className="font-bold text-base text-purple-300 pt-2.5 pb-1">
                    {formatInlineText(trimmed.slice(3))}
                  </h3>
                );
              }
              if (trimmed.startsWith('# ')) {
                return (
                  <h2 key={lIdx} className="font-extrabold text-lg text-white pt-3 pb-1">
                    {formatInlineText(trimmed.slice(2))}
                  </h2>
                );
              }

              // Bullet points
              if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-2">
                    <span className="text-purple-400 font-bold select-none">•</span>
                    <span className="flex-1">{formatInlineText(trimmed.slice(2))}</span>
                  </div>
                );
              }

              // Numbered list
              const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
              if (numMatch) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-2">
                    <span className="text-cyan-400 font-mono font-bold text-xs shrink-0 select-none">
                      {numMatch[1]}.
                    </span>
                    <span className="flex-1">{formatInlineText(numMatch[2])}</span>
                  </div>
                );
              }

              return (
                <p key={lIdx} className="text-slate-200">
                  {formatInlineText(line)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

// Helper for bold and inline code
function formatInlineText(text: string): React.ReactNode {
  // Regex to match **bold** and `code`
  const tokens = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return tokens.map((tok, idx) => {
    if (tok.startsWith('**') && tok.endsWith('**') && tok.length >= 4) {
      return (
        <strong key={idx} className="font-bold text-white">
          {tok.slice(2, -2)}
        </strong>
      );
    }
    if (tok.startsWith('`') && tok.endsWith('`') && tok.length >= 2) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-mono text-[11px]"
        >
          {tok.slice(1, -1)}
        </code>
      );
    }
    return tok;
  });
}
