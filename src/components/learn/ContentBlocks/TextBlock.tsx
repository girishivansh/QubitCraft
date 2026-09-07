import React from 'react';
import type { TextBlock as TextBlockType } from '../../../types/curriculum';

interface TextBlockProps {
  block: TextBlockType;
}

export const TextBlock: React.FC<TextBlockProps> = ({ block }) => {
  // Simple markdown-like parser for basic formatting
  const parseText = (text: string) => {
    // Escape HTML first to prevent XSS (if this was a real app we'd use DOMPurify)
    let parsed = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // **bold**
    parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // *italic*
    parsed = parsed.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // `code`
    parsed = parsed.replace(/`(.*?)`/g, '<code class="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');

    return { __html: parsed };
  };

  return (
    <p 
      className="text-base text-slate-700 leading-relaxed mb-4"
      dangerouslySetInnerHTML={parseText(block.content)}
    />
  );
};

export default TextBlock;
