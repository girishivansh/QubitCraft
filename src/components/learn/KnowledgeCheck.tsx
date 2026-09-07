import React, { useState } from 'react';
import { CheckCircle2, XCircle, Star } from 'lucide-react';
import { Button } from '../Button';

interface KnowledgeCheckOption {
  id: string;
  text: string;
}

export interface KnowledgeCheckProps {
  id: string;
  question: string;
  questionType: 'multiple-choice' | 'true-false';
  options: KnowledgeCheckOption[];
  correctOptionId: string;
  explanation: string;
  xp: number;
  onComplete: (checkId: string, xpEarned: number) => void;
  isCompleted: boolean;
}

export const KnowledgeCheck: React.FC<KnowledgeCheckProps> = ({
  id,
  question,
  options,
  correctOptionId,
  explanation,
  xp,
  onComplete,
  isCompleted,
}) => {
  const [selectedId, setSelectedId] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>(isCompleted ? 'correct' : 'idle');

  const handleSubmit = () => {
    if (!selectedId) return;

    if (selectedId === correctOptionId) {
      setStatus('correct');
      if (!isCompleted) {
        onComplete(id, xp);
      }
    } else {
      setStatus('incorrect');
    }
  };

  const handleRetry = () => {
    setSelectedId('');
    setStatus('idle');
  };

  const showExplanation = status === 'correct' || status === 'incorrect';

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-indigo-50/50 px-6 py-4 border-b border-indigo-100 flex items-center justify-between">
        <h4 className="font-bold text-navy-900 flex items-center gap-2">
          Knowledge Check
        </h4>
        {isCompleted ? (
          <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-100 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
            <Star className="w-3.5 h-3.5 fill-current" /> +{xp} XP
          </span>
        )}
      </div>

      <div className="p-6">
        <fieldset disabled={status === 'correct'}>
          <legend className="text-lg font-semibold text-navy-900 mb-4 leading-snug">
            {question}
          </legend>

          <div className="space-y-3 mb-6">
            {options.map((option) => {
              const isSelected = selectedId === option.id;
              const isCorrectOption = option.id === correctOptionId;
              
              let styleClass = 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 cursor-pointer';
              let icon = null;

              if (status === 'correct') {
                if (isCorrectOption) {
                  styleClass = 'border-green-500 bg-green-50 text-green-900 cursor-default';
                  icon = <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto" />;
                } else {
                  styleClass = 'border-slate-100 opacity-50 cursor-default';
                }
              } else if (status === 'incorrect') {
                if (isSelected) {
                  styleClass = 'border-red-300 bg-red-50 text-red-900 cursor-default';
                  icon = <XCircle className="w-5 h-5 text-red-500 ml-auto" />;
                } else if (isCorrectOption) {
                  styleClass = 'border-green-500 bg-green-50 text-green-900 cursor-default shadow-sm ring-1 ring-green-500';
                  icon = <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto" />;
                } else {
                  styleClass = 'border-slate-200 opacity-50 cursor-default';
                }
              } else if (isSelected) {
                styleClass = 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600';
              }

              return (
                <label
                  key={option.id}
                  className={`flex items-center p-4 rounded-xl border-2 transition-all ${styleClass}`}
                >
                  <input
                    type="radio"
                    name={`kc-${id}`}
                    value={option.id}
                    checked={isSelected}
                    onChange={() => setSelectedId(option.id)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 mr-3 mt-0.5 disabled:opacity-50"
                  />
                  <span className="font-medium text-slate-700 flex-grow">
                    {option.text}
                  </span>
                  {icon}
                </label>
              );
            })}
          </div>
        </fieldset>

        {showExplanation && (
          <div className={`p-4 rounded-xl mb-6 ${status === 'correct' ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
            <h5 className={`text-sm font-bold mb-1 ${status === 'correct' ? 'text-green-800' : 'text-red-800'}`}>
              {status === 'correct' ? 'Correct!' : 'Incorrect'}
            </h5>
            <p className="text-slate-700 text-sm leading-relaxed">
              {explanation}
            </p>
          </div>
        )}

        <div className="flex justify-end">
          {status === 'idle' && (
            <Button
              variant="primary"
              onClick={handleSubmit}
              className={!selectedId ? 'opacity-50 cursor-not-allowed' : ''}
            >
              Submit Answer
            </Button>
          )}
          {status === 'incorrect' && (
            <Button variant="secondary" onClick={handleRetry}>
              Try Again
            </Button>
          )}
          {status === 'correct' && !isCompleted && (
            <div className="text-green-600 font-semibold flex items-center gap-2 animate-fade-in">
              <Star className="w-5 h-5 fill-current" /> +{xp} XP Earned!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeCheck;
