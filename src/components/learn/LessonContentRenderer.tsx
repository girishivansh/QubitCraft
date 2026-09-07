import React from 'react';
import type { LessonContentBlock as LessonContentBlockType } from '../../types/curriculum';

import { HeadingBlock } from './ContentBlocks/HeadingBlock';
import { TextBlock } from './ContentBlocks/TextBlock';
import { CalloutBlock } from './ContentBlocks/CalloutBlock';
import { FormulaBlock } from './ContentBlocks/FormulaBlock';
import { CodeBlock } from './ContentBlocks/CodeBlock';
import { VisualBlock } from './ContentBlocks/VisualBlock';
import { InteractiveBlock } from './ContentBlocks/InteractiveBlock';
import { KnowledgeCheckBlock } from './ContentBlocks/KnowledgeCheckBlock';

interface LessonContentRendererProps {
  blocks: LessonContentBlockType[];
  completedCheckIds: string[];
  onCheckComplete: (checkId: string, xpEarned: number) => void;
}

export const LessonContentRenderer: React.FC<LessonContentRendererProps> = ({
  blocks,
  completedCheckIds,
  onCheckComplete,
}) => {
  return (
    <div className="max-w-3xl mx-auto w-full pb-24">
      {blocks.map((block) => {
        switch (block.type) {
          case 'heading':
            return <HeadingBlock key={block.id} block={block} />;
          case 'text':
            return <TextBlock key={block.id} block={block} />;
          case 'callout':
            return <CalloutBlock key={block.id} block={block} />;
          case 'formula':
            return <FormulaBlock key={block.id} block={block} />;
          case 'code':
            return <CodeBlock key={block.id} block={block} />;
          case 'visual':
            return <VisualBlock key={block.id} block={block} />;
          case 'interactive':
            return <InteractiveBlock key={block.id} block={block} />;
          case 'knowledge-check':
            return (
              <KnowledgeCheckBlock
                key={block.id}
                block={block}
                onComplete={onCheckComplete}
                isCompleted={completedCheckIds.includes(block.id)}
              />
            );
          default:
            console.warn(`Unknown block type`, block);
            return null;
        }
      })}
    </div>
  );
};

export default LessonContentRenderer;
