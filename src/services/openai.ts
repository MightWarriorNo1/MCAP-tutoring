import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface StudyPlanRequest {
  testDate: Date;
  weeklyHours: number;
  weakAreas: string[];
  strongAreas: string[];
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
}

export interface StudyPlanResponse {
  overview: string;
  weeklySchedule: WeeklyScheduleItem[];
  milestones: Milestone[];
  recommendations: string[];
}

export interface WeeklyScheduleItem {
  week: number;
  focus: string;
  subjects: string[];
  hours: number;
  tasks: string[];
}

export interface Milestone {
  week: number;
  title: string;
  description: string;
  type: 'practice_test' | 'review' | 'assessment';
}

class OpenAIService {
  private explanationCache = new Map<string, string>();

  async chatWithAssistant(messages: ChatMessage[]): Promise<string> {
    try {
      const systemPrompt = `You are an expert MCAT tutor and study assistant. You have deep knowledge of all MCAT subjects including:
      - Biology and Biochemistry
      - General Chemistry and Organic Chemistry  
      - Physics
      - Psychology and Sociology
      - Critical Analysis and Reasoning Skills (CARS)
      
      Your role is to:
      1. Provide clear, accurate explanations of MCAT concepts
      2. Help students understand complex topics through analogies and examples
      3. Offer study strategies and test-taking tips
      4. Answer questions in a supportive, encouraging manner
      5. Break down complex problems into manageable steps
      
      Always maintain a professional, encouraging tone and focus on helping students succeed on the MCAT.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map(msg => ({ role: msg.role, content: msg.content }))
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to get response from AI assistant. Please try again.');
    }
  }

  async generateExplanation(
    question: string, 
    correctAnswer: string, 
    userAnswer: string,
    complexity: 'basic' | 'detailed' = 'basic'
  ): Promise<string> {
    const cacheKey = `${question}-${correctAnswer}-${complexity}`;
    
    if (this.explanationCache.has(cacheKey)) {
      return this.explanationCache.get(cacheKey)!;
    }

    try {
      const complexityPrompt = complexity === 'basic' 
        ? 'Provide a clear, concise explanation suitable for someone learning the concept.'
        : 'Provide a detailed, comprehensive explanation with additional context and related concepts.';

      const prompt = `As an MCAT expert, explain why the correct answer is right and help the student understand the concept.

Question: ${question}
Correct Answer: ${correctAnswer}
Student's Answer: ${userAnswer}

${complexityPrompt}

Focus on:
1. Why the correct answer is right
2. Common misconceptions (if the student got it wrong)
3. Key concepts to remember
4. Study tips for this topic

Keep the explanation encouraging and educational.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.3,
      });

      const explanation = response.choices[0]?.message?.content || 'Unable to generate explanation.';
      this.explanationCache.set(cacheKey, explanation);
      
      return explanation;
    } catch (error) {
      console.error('Error generating explanation:', error);
      return 'Unable to generate explanation at this time. Please try again later.';
    }
  }

  async generateStudyPlan(request: StudyPlanRequest): Promise<StudyPlanResponse> {
    try {
      const weeksUntilTest = Math.ceil(
        (request.testDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 7)
      );

      const prompt = `Create a comprehensive MCAT study plan with the following parameters:

Test Date: ${request.testDate.toDateString()}
Weeks Until Test: ${weeksUntilTest}
Weekly Study Hours: ${request.weeklyHours}
Current Level: ${request.currentLevel}
Weak Areas: ${request.weakAreas.join(', ')}
Strong Areas: ${request.strongAreas.join(', ')}

Please provide a structured study plan in JSON format with:
1. overview: A brief summary of the study approach
2. weeklySchedule: Array of weekly focus areas with subjects, hours, and specific tasks
3. milestones: Key checkpoints including practice tests and reviews
4. recommendations: Specific study tips and strategies

Focus more time on weak areas while maintaining strong areas. Include regular practice tests and review sessions.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
        temperature: 0.5,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      // Try to parse JSON response, fallback to structured text parsing
      try {
        return JSON.parse(content);
      } catch {
        return this.parseStudyPlanFromText(content, weeksUntilTest, request);
      }
    } catch (error) {
      console.error('Error generating study plan:', error);
      return this.generateFallbackStudyPlan(request);
    }
  }

  private parseStudyPlanFromText(content: string, weeks: number, request: StudyPlanRequest): StudyPlanResponse {
    // Fallback parsing logic for non-JSON responses
    return {
      overview: "Comprehensive MCAT study plan tailored to your needs and timeline.",
      weeklySchedule: this.generateDefaultSchedule(weeks, request),
      milestones: this.generateDefaultMilestones(weeks),
      recommendations: [
        "Focus extra time on your identified weak areas",
        "Take a full-length practice test every 2-3 weeks",
        "Review incorrect answers thoroughly",
        "Use active recall and spaced repetition techniques",
        "Maintain consistent daily study habits"
      ]
    };
  }

  private generateDefaultSchedule(weeks: number, request: StudyPlanRequest): WeeklyScheduleItem[] {
    const schedule: WeeklyScheduleItem[] = [];
    const subjects = ['Biology', 'Chemistry', 'Physics', 'Psychology', 'CARS'];
    
    for (let week = 1; week <= Math.min(weeks, 16); week++) {
      const focusSubjects = week <= 8 
        ? request.weakAreas.slice(0, 2) 
        : subjects.filter(s => !request.weakAreas.includes(s));
      
      schedule.push({
        week,
        focus: week <= 8 ? 'Content Review' : 'Practice & Review',
        subjects: focusSubjects,
        hours: request.weeklyHours,
        tasks: [
          `Study ${focusSubjects.join(' and ')}`,
          'Complete practice questions',
          'Review weak areas',
          week % 3 === 0 ? 'Take practice test' : 'Review previous mistakes'
        ]
      });
    }
    
    return schedule;
  }

  private generateDefaultMilestones(weeks: number): Milestone[] {
    const milestones: Milestone[] = [];
    
    for (let week = 3; week <= weeks; week += 3) {
      milestones.push({
        week,
        title: `Week ${week} Assessment`,
        description: week <= 6 
          ? 'Content review checkpoint and diagnostic test'
          : 'Full-length practice test and performance review',
        type: week <= 6 ? 'assessment' : 'practice_test'
      });
    }
    
    return milestones;
  }

  private generateFallbackStudyPlan(request: StudyPlanRequest): StudyPlanResponse {
    const weeks = Math.ceil(
      (request.testDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 7)
    );

    return {
      overview: "A structured MCAT study plan focusing on your weak areas while maintaining strengths.",
      weeklySchedule: this.generateDefaultSchedule(weeks, request),
      milestones: this.generateDefaultMilestones(weeks),
      recommendations: [
        "Prioritize your weak areas in daily study sessions",
        "Take regular practice tests to track progress",
        "Use active learning techniques like flashcards and practice problems",
        "Join study groups or find a study partner for accountability",
        "Maintain a consistent sleep schedule during your prep"
      ]
    };
  }
}

export const openAIService = new OpenAIService();