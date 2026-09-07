import React from 'react';
import type { HeadingBlock as HeadingBlockType } from '../../../types/curriculum';

interface HeadingBlockProps {
  block: HeadingBlockType;
}

export const HeadingBlock: React.FC<HeadingBlockProps> = ({ block }) => {
  const { level, text } = block;

  switch (level) {
    case 2:
      return <h2 className="text-2xl font-bold text-navy-900 mt-10 mb-4">{text}</h2>;
    case 3:
      return <h3 className="text-xl font-semibold text-navy-900 mt-8 mb-3">{text}</h3>;
    case 4:
      return <h4 className="text-lg font-medium text-navy-900 mt-6 mb-2">{text}</h4>;
    default:
      return <h2 className="text-2xl font-bold text-navy-900 mt-10 mb-4">{text}</h2>;
  }
};

export default HeadingBlock;
