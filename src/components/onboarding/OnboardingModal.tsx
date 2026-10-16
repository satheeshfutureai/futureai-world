import React, { useState } from 'react';
import { UserProfile } from '../../types';
import {
  EXPERIENCE_LEVELS,
  AGE_GROUPS,
  PRIMARY_GOALS,
  INTEREST_TOPICS,
  DAILY_TIME_COMMITMENTS,
  recommendTrack
} from '../../data/onboardingOptions';
import { CAREER_TRACKS } from '../../data/careers';
import { Sparkles, ArrowRight, Check, Compass, X, Target, Clock, Languages, Award } from 'lucide-react';

interface OnboardingModalProps {
  currentProfile: UserProfile;
  onSaveProfile: (profile: Partial<UserProfile>) => void;
  onClose: () => void;
  onSelectTrackNavigate?: (trackId: string) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  currentProfile,
  onSaveProfile,
  onClose,
  onSelectTrackNavigate
}) => {
  const [step, setStep] = useState<number>(1);
  const [experienceLevel, setExperienceLevel] = useState(currentProfile.experienceLevel);
  const [ageGroup, setAgeGroup] = useState(currentProfile.ageGroup);
  const [primaryGoal, setPrimaryGoal] = useState(currentProfile.primaryGoal);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(currentProfile.interests);
  const [preferredLanguage, setPreferredLanguage] = useState(currentProfile.preferredLanguage);
  const [dailyTime, setDailyTime] = useState(currentProfile.dailyTime);

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const recommendation = recommendTrack(experienceLevel, primaryGoal, selectedInterests);
  const matchedTrack = CAREER_TRACKS.find((c) => c.id === recommendation.trackId) || CAREER_TRACKS[0];

  const handleFinish = () => {
    onSaveProfile({
      experienceLevel,
      ageGroup,
      primaryGoal,
      interests: selectedInterests,
      preferredLanguage,
      dailyTime,
      recommendedTrackId: recommendation.trackId,
      onboardingCompleted: true
    });
    if (onSelectTrackNavigate) {
      onSelectTrackNavigate(recommendation.trackId);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#0B0F1E] border border-purple-500/40 rounded-2xl max-w-2xl w-full flex flex-col max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-[#0E1326] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-950/80 border border-purple-500/40">
              <Compass className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Personalized Learning Pathway
              </h3>
              <p className="text-xs text-slate-400">
                Tailor FutureAI World to your background, age group, and goals
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-2.5 bg-[#090C19] border-b border-slate-800/80 flex items-center justify-between text-xs">
          <span className="font-mono text-purple-400 font-semibold">
            Step {step} of 3: {step === 1 ? 'Background & Experience' : step === 2 ? 'Goals & Interests' : 'Pace & Language'}
          </span>
          <div className="flex gap-1.5">
            <span className={`w-6 h-1.5 rounded-full ${step >= 1 ? 'bg-purple-500' : 'bg-slate-800'}`} />
            <span className={`w-6 h-1.5 rounded-full ${step >= 2 ? 'bg-purple-500' : 'bg-slate-800'}`} />
            <span className={`w-6 h-1.5 rounded-full ${step >= 3 ? 'bg-purple-500' : 'bg-slate-800'}`} />
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-300">
          {step === 1 && (
            <div className="space-y-6">
              {/* Experience Level */}
              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  What is your current technical background?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {EXPERIENCE_LEVELS.map((exp) => (
                    <button
                      key={exp.id}
                      onClick={() => setExperienceLevel(exp.id as any)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        experienceLevel === exp.id
                          ? 'bg-purple-950/60 border-purple-500 text-white shadow-sm'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-semibold block text-xs sm:text-sm text-slate-100 mb-1">
                        {exp.label}
                      </span>
                      <span className="text-xs text-slate-400 block leading-relaxed">
                        {exp.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Group */}
              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Which best describes your current stage?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {AGE_GROUPS.map((age) => (
                    <button
                      key={age.id}
                      onClick={() => setAgeGroup(age.id as any)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        ageGroup === age.id
                          ? 'bg-purple-950/60 border-purple-500 text-white shadow-sm'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-semibold block text-xs sm:text-sm text-slate-100 mb-1">
                        {age.label}
                      </span>
                      <span className="text-xs text-slate-400 block leading-relaxed">
                        {age.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {/* Primary Goal */}
              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  What is your primary objective?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PRIMARY_GOALS.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setPrimaryGoal(g.id as any)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        primaryGoal === g.id
                          ? 'bg-purple-950/60 border-purple-500 text-white shadow-sm'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-semibold block text-xs sm:text-sm text-slate-100 mb-1">
                        {g.label}
                      </span>
                      <span className="text-xs text-slate-400 block leading-relaxed">
                        {g.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Select topics you are interested in exploring:
                </label>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_TOPICS.map((topic) => {
                    const isChecked = selectedInterests.includes(topic.id);
                    return (
                      <button
                        key={topic.id}
                        onClick={() => toggleInterest(topic.id)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1.5 ${
                          isChecked
                            ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                        <span>{topic.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              {/* Preferred Language */}
              <div>
                <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Languages className="w-4 h-4 text-purple-400" />
                  Preferred Explanation Language:
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'tanglish', label: 'Tanglish', sub: 'Tamil in English text' },
                    { id: 'ta', label: 'தமிழ் (Tamil)', sub: 'Pure Tamil text' },
                    { id: 'en', label: 'English', sub: 'Clear simple English' }
                  ].map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setPreferredLanguage(l.id as any)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        preferredLanguage === l.id
                          ? 'bg-purple-950/60 border-purple-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="font-bold block text-xs sm:text-sm">{l.label}</span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">{l.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Daily Learning Time */}
              <div>
                <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  Daily Time Commitment:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {DAILY_TIME_COMMITMENTS.map((time) => (
                    <button
                      key={time.id}
                      onClick={() => setDailyTime(time.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        dailyTime === time.id
                          ? 'bg-cyan-950/60 border-cyan-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="font-bold block text-xs sm:text-sm text-cyan-300">{time.label}</span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">{time.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recommended Track Card */}
              <div className="p-4 rounded-xl bg-[#070912] border border-purple-500/30">
                <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Recommended Starting Track For You:</span>
                </div>
                <h4 className="text-base font-bold text-white mb-1">
                  {matchedTrack.role}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                  {recommendation.rationale}
                </p>
                <div className="text-[11px] text-slate-500 font-mono">
                  Market Benchmark: {matchedTrack.salaryIndia} · {matchedTrack.marketDemand}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#0E1326] flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800 transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="px-5 py-2 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 transition-all shadow-md shadow-purple-600/30"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-5 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-95 text-white flex items-center gap-1.5 transition-all shadow-lg shadow-purple-600/30"
            >
              <span>Confirm & Start Learning</span>
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
