import React, { useState } from 'react';
import { Brain, Loader2, RotateCcw } from 'lucide-react';
import { openAIService } from '../../services/openai';

interface AIExplanationProps {
  question: string;
  correctAnswer: string;
  userAnswer: string;
  onClose?: () => void;
}

const AIExplanation: React.FC<AIExplanationProps> = ({
  question,
  correctAnswer,
  userAnswer,
  onClose
}) => {
  const [explanation, setExplanation] = useState<string>('');
  const [complexity, setComplexity] = useState<'basic' | 'detailed'>('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateExplanation = async (selectedComplexity: 'basic' | 'detailed' = complexity) => {
    setIsLoading(true);
    try {
      const result = await openAIService.generateExplanation(
        question,
        correctAnswer,
        userAnswer,
        selectedComplexity
      );
      setExplanation(result);
      setHasGenerated(true);
    } catch (error) {
      setExplanation('Unable to generate explanation at this time. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplexityChange = (newComplexity: 'basic' | 'detailed') => {
    setComplexity(newComplexity);
    if (hasGenerated) {
      generateExplanation(newComplexity);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">AI Explanation</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        )}
      </div>

      {/* Question Context */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">Question:</p>
        <p className="text-gray-900 mb-3">{question}</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Correct Answer:</span>
            <p className="font-medium text-success-600">{correctAnswer}</p>
          </div>
          <div>
            <span className="text-gray-600">Your Answer:</span>
            <p className={`font-medium ${
              userAnswer === correctAnswer ? 'text-success-600' : 'text-danger-600'
            }`}>
              {userAnswer}
            </p>
          </div>
        </div>
      </div>

      {/* Complexity Toggle */}
      <div className="flex items-center space-x-4 mb-4">
        <span className="text-sm font-medium text-gray-700">Explanation Level:</span>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => handleComplexityChange('basic')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              complexity === 'basic'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Basic
          </button>
          <button
            onClick={() => handleComplexityChange('detailed')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              complexity === 'detailed'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Detailed
          </button>
        </div>
      </div>

      {/* Generate Button */}
      {!hasGenerated && (
        <button
          onClick={() => generateExplanation()}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating explanation...</span>
            </>
          ) : (
            <>
              <Brain className="w-5 h-5" />
              <span>Get AI Explanation</span>
            </>
          )}
        </button>
      )}

      {/* Explanation Content */}
      {explanation && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
              <span className="ml-2 text-primary-600">Generating explanation...</span>
            </div>
          ) : (
            <>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-gray-800">{explanation}</div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => generateExplanation()}
                  className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Regenerate</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AIExplanation;