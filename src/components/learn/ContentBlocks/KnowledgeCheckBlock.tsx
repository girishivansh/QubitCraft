import React from 'react';
import type { KnowledgeCheckBlock as KnowledgeCheckBlockType } from '../../../types/curriculum';
import { KnowledgeCheck } from '../KnowledgeCheck';

interface KnowledgeCheckBlockProps {
  block: KnowledgeCheckBlockType;
  onComplete: (checkId: string, xpEarned: number) => void;
  isCompleted: boolean;
}

export const KnowledgeCheckBlock: React.FC<KnowledgeCheckBlockProps> = ({
  block,
  onComplete,
  isCompleted,
}) => {
  return (
    <div className="my-10">
      <KnowledgeCheck
        id={block.id}
        question={block.question}
        questionType={block.questionType}
        options={block.options}
        correctOptionId={block.correctOptionId}
        explanation={block.explanation}
        xp={block.xp}
        onComplete={onComplete}
        isCompleted={isCompleted}
      />
    </div>
  );
};

export default KnowledgeCheckBlock;
