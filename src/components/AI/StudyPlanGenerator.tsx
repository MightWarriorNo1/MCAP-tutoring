import React, { useState } from 'react';
import { Calendar, Clock, Target, Brain, Loader2, Download } from 'lucide-react';
import { openAIService, StudyPlanRequest, StudyPlanResponse } from '../../services/openai';
import { format, addWeeks } from 'date-fns';

const StudyPlanGenerator: React.FC = () => {
  const [formData, setFormData] = useState<StudyPlanRequest>({
    testDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    weeklyHours: 20,
    weakAreas: [],
    strongAreas: [],
    currentLevel: 'intermediate'
  });
  const [studyPlan, setStudyPlan] = useState<StudyPlanResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mcatSubjects = [
    'Biology',
    'Chemistry', 
    'Physics',
    'Psychology',
    'Sociology',
    'Biochemistry',
    'CARS'
  ];

  const handleSubjectToggle = (subject: string, type: 'weak' | 'strong') => {
    setFormData(prev => {
      const currentArray = type === 'weak' ? prev.weakAreas : prev.strongAreas;
      const otherArray = type === 'weak' ? prev.strongAreas : prev.weakAreas;
      
      // Remove from other array if present
      const updatedOtherArray = otherArray.filter(s => s !== subject);
      
      // Toggle in current array
      const updatedCurrentArray = currentArray.includes(subject)
        ? currentArray.filter(s => s !== subject)
        : [...currentArray, subject];

      return {
        ...prev,
        [type === 'weak' ? 'weakAreas' : 'strongAreas']: updatedCurrentArray,
        [type === 'weak' ? 'strongAreas' : 'weakAreas']: updatedOtherArray
      };
    });
  };

  const generatePlan = async () => {
    setIsLoading(true);
    try {
      const plan = await openAIService.generateStudyPlan(formData);
      setStudyPlan(plan);
    } catch (error) {
      console.error('Error generating study plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportPlan = () => {
    if (!studyPlan) return;
    
    const planText = `
MCAT Study Plan
Generated: ${new Date().toLocaleDateString()}
Test Date: ${formData.testDate.toLocaleDateString()}

OVERVIEW:
${studyPlan.overview}

WEEKLY SCHEDULE:
${studyPlan.weeklySchedule.map(week => `
Week ${week.week} - ${week.focus}
Subjects: ${week.subjects.join(', ')}
Hours: ${week.hours}
Tasks:
${week.tasks.map(task => `- ${task}`).join('\n')}
`).join('\n')}

MILESTONES:
${studyPlan.milestones.map(milestone => `
Week ${milestone.week}: ${milestone.title}
${milestone.description}
`).join('\n')}

RECOMMENDATIONS:
${studyPlan.recommendations.map(rec => `- ${rec}`).join('\n')}
    `;

    const blob = new Blob([planText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mcat-study-plan.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <Brain className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Study Plan Generator</h2>
            <p className="text-gray-600">Create a personalized MCAT study plan tailored to your needs</p>
          </div>
        </div>

        {!studyPlan ? (
          <div className="space-y-6">
            {/* Test Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                MCAT Test Date
              </label>
              <input
                type="date"
                value={format(formData.testDate, 'yyyy-MM-dd')}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  testDate: new Date(e.target.value) 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Weekly Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Weekly Study Hours
              </label>
              <select
                value={formData.weeklyHours}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  weeklyHours: parseInt(e.target.value) 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value={10}>10 hours/week (Light)</option>
                <option value={15}>15 hours/week (Moderate)</option>
                <option value={20}>20 hours/week (Standard)</option>
                <option value={25}>25 hours/week (Intensive)</option>
                <option value={30}>30+ hours/week (Full-time)</option>
              </select>
            </div>

            {/* Current Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Target className="w-4 h-4 inline mr-1" />
                Current Preparation Level
              </label>
              <div className="flex space-x-4">
                {['beginner', 'intermediate', 'advanced'].map(level => (
                  <label key={level} className="flex items-center">
                    <input
                      type="radio"
                      value={level}
                      checked={formData.currentLevel === level}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        currentLevel: e.target.value as any 
                      }))}
                      className="mr-2"
                    />
                    <span className="capitalize">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Subject Strengths/Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Weak Areas (need more focus)
                </label>
                <div className="space-y-2">
                  {mcatSubjects.map(subject => (
                    <label key={subject} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.weakAreas.includes(subject)}
                        onChange={() => handleSubjectToggle(subject, 'weak')}
                        className="mr-2 text-danger-600"
                      />
                      <span className={formData.weakAreas.includes(subject) ? 'text-danger-600 font-medium' : ''}>
                        {subject}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Strong Areas (maintain proficiency)
                </label>
                <div className="space-y-2">
                  {mcatSubjects.map(subject => (
                    <label key={subject} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.strongAreas.includes(subject)}
                        onChange={() => handleSubjectToggle(subject, 'strong')}
                        className="mr-2 text-success-600"
                      />
                      <span className={formData.strongAreas.includes(subject) ? 'text-success-600 font-medium' : ''}>
                        {subject}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generatePlan}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating your personalized study plan...</span>
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  <span>Generate AI Study Plan</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Plan Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Personalized Study Plan</h3>
                <p className="text-gray-600">Test Date: {format(formData.testDate, 'MMMM d, yyyy')}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={exportPlan}
                  className="flex items-center space-x-1 px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <button
                  onClick={() => setStudyPlan(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Generate New Plan
                </button>
              </div>
            </div>

            {/* Overview */}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <h4 className="font-semibold text-primary-900 mb-2">Study Plan Overview</h4>
              <p className="text-primary-800">{studyPlan.overview}</p>
            </div>

            {/* Weekly Schedule */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Weekly Schedule</h4>
              <div className="grid gap-4">
                {studyPlan.weeklySchedule.map((week, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-gray-900">Week {week.week}: {week.focus}</h5>
                      <span className="text-sm text-gray-500">{week.hours} hours</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Focus: {week.subjects.join(', ')}
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {week.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-2 mr-2 flex-shrink-0" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Milestones</h4>
              <div className="space-y-3">
                {studyPlan.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                      milestone.type === 'practice_test' ? 'bg-primary-600' :
                      milestone.type === 'assessment' ? 'bg-secondary-600' :
                      'bg-accent-600'
                    }`}>
                      {milestone.week}
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">{milestone.title}</h5>
                      <p className="text-sm text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Study Recommendations</h4>
              <div className="bg-success-50 border border-success-200 rounded-lg p-4">
                <ul className="space-y-2">
                  {studyPlan.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start text-success-800">
                      <span className="w-1.5 h-1.5 bg-success-600 rounded-full mt-2 mr-2 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyPlanGenerator;