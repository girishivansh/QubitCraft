import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import type { CodeBlock as CodeBlockType } from '../../../types/curriculum';

interface CodeBlockProps {
  block: CodeBlockType;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ block }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(block.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  return (
    <div className="my-6">
      <div className="rounded-[12px] overflow-hidden bg-navy-950 shadow-md border border-navy-800">
        <div className="flex items-center justify-between px-4 py-2 bg-navy-900 border-b border-navy-800">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {block.language}
            </span>
            {block.filename && (
              <span className="text-xs text-slate-300 font-mono bg-navy-800 px-2 py-0.5 rounded">
                {block.filename}
              </span>
            )}
          </div>
          <button
            onClick={handleCopy}
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <div className="p-4 overflow-x-auto custom-scrollbar">
          <pre className="font-mono text-sm text-slate-50 leading-relaxed">
            <code>{block.code}</code>
          </pre>
        </div>
      </div>
      {block.explanation && (
        <p className="mt-3 text-sm text-slate-600 px-1">
          {block.explanation}
        </p>
      )}
    </div>
  );
};

export default CodeBlock;
