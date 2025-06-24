import React, { useState } from 'react';
import { CheckCircle, XCircle, Flag, RotateCcw, Brain } from 'lucide-react';
import AIExplanation from '../AI/AIExplanation';

interface Question {
  id: string;
  content: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuestionReviewProps {
  question: Question;
  userAnswer: number | null;
  isCorrect: boolean;
  onNext: () => void;
  onFlag: () => void;
  isFlagged: boolean;
}

const QuestionReview: React.FC<QuestionReviewProps> = ({
  question,
  userAnswer,
  isCorrect,
  onNext,
  onFlag,
  isFlagged
}) => {
  const [showAIExplanation, setShowAIExplanation] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Question Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {isCorrect ? (
              <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success-600" />
              </div>
            ) : (
              <div className="w-8 h-8 bg-danger-100 rounded-full flex items-center justify-center">
                <XCircle className="w-5 h-5 text-danger-600" />
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </h2>
              <p className="text-sm text-gray-500">
                {question.subject} • {question.topic} • {question.difficulty}
              </p>
            </div>
          </div>
          <button
            onClick={onFlag}
            className={`p-2 rounded-full transition-colors ${
              isFlagged 
                ? 'bg-warning-100 text-warning-600' 
                : 'bg-gray-100 text-gray-400 hover:text-warning-600'
            }`}
          >
            <Flag className="w-5 h-5" />
          </button>
        </div>

        {/* Question Content */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Question:</h3>
          <p className="text-gray-800 leading-relaxed">{question.content}</p>
        </div>

        {/* Answer Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 transition-colors ${
                index === question.correctAnswer
                  ? 'border-success-300 bg-success-50'
                  : userAnswer === index && !isCorrect
                  ? 'border-danger-300 bg-danger-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                  index === question.correctAnswer
                    ? 'bg-success-600 text-white'
                    : userAnswer === index && !isCorrect
                    ? 'bg-danger-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-gray-900">{option}</span>
                {index === question.correctAnswer && (
                  <CheckCircle className="w-5 h-5 text-success-600 ml-auto" />
                )}
                {userAnswer === index && !isCorrect && (
                  <XCircle className="w-5 h-5 text-danger-600 ml-auto" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Standard Explanation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Explanation</h3>
        <p className="text-gray-800 leading-relaxed">{question.explanation}</p>
      </div>

      {/* AI Explanation Toggle */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Need More Help?</h3>
          <button
            onClick={() => setShowAIExplanation(!showAIExplanation)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Brain className="w-4 h-4" />
            <span>{showAIExplanation ? 'Hide' : 'Get'} AI Explanation</span>
          </button>
        </div>
        
        {showAIExplanation && (
          <AIExplanation
            question={question.content}
            correctAnswer={question.options[question.correctAnswer]}
            userAnswer={userAnswer !== null ? question.options[userAnswer] : 'No answer selected'}
            onClose={() => setShowAIExplanation(false)}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Back to Practice</span>
        </button>
        
        <button
          onClick={onNext}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Next Question
        </button>
      </div>
    </div>
  );
};

export default QuestionReview;