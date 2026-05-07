/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Stethoscope, 
  Search, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Trophy, 
  RefreshCcw,
  BookOpen,
  Info,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { questions, QuestionType, Difficulty } from './data/questions';

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  Easy: 'text-green-700 bg-green-50 border-green-200',
  Moderate: 'text-natural-accent bg-rose-50 border-natural-accent/30',
  Advanced: 'text-natural-ink bg-natural-sidebar border-natural-olive',
};

const TYPE_LABELS: Record<QuestionType, string> = {
  mcq: 'Multiple Choice',
  case: 'Clinical Case',
  tf: 'True / False',
};

export default function App() {
  const [currentMode, setCurrentMode] = useState<QuestionType | 'all'>('all');
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'results'>('menu');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const filteredQuestions = useMemo(() => {
    const pool = currentMode === 'all' 
      ? questions 
      : questions.filter(q => q.type === currentMode);
    return [...pool].sort(() => Math.random() - 0.5);
  }, [currentMode]);

  const currentQuestion = filteredQuestions[currentIndex];

  const handleAnswer = (answer: string) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answer);
    const correct = answer.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();
    setIsCorrect(correct);
    if (correct) setScore(prev => prev + 1);
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowFeedback(false);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setGameState('results');
    }
  };

  const startNewGame = (mode: QuestionType | 'all') => {
    setCurrentMode(mode);
    setCurrentIndex(0);
    setScore(0);
    setGameState('playing');
    setShowFeedback(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  if (gameState === 'menu') {
    return (
      <div id="game-menu" className="min-h-screen bg-natural-bg flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full bg-white rounded-[32px] shadow-2xl shadow-natural-olive/5 overflow-hidden border border-natural-border flex flex-col md:flex-row"
        >
          <div className="bg-natural-olive p-12 text-white flex flex-col justify-center relative overflow-hidden md:w-2/5">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute -top-10 -left-10 w-60 h-60 bg-white rounded-full blur-3xl"></div>
            </div>
            <Stethoscope className="w-16 h-16 mb-8 text-natural-sidebar" />
            <h1 className="serif text-4xl font-bold tracking-tight mb-4 leading-none">Pediatric Rash Detective</h1>
            <p className="text-natural-sidebar/80 font-medium italic opacity-90 text-sm">Educational Simulation: Fever & Exanthem Challenge</p>
          </div>

          <div className="p-12 md:w-3/5">
            <h2 className="serif text-2xl font-semibold mb-6 text-natural-ink">Clinical Intake</h2>
            <p className="text-natural-muted mb-10 leading-relaxed text-sm">
              Welcome, medical investigator. Test your clinical knowledge on pediatric differential diagnosis, 
              focusing on hallmark symptoms, complications, and management of major exanthematous illnesses.
            </p>

            <div className="grid grid-cols-1 gap-4">
              <MenuButton 
                onClick={() => startNewGame('all')} 
                icon={<BookOpen className="w-5 h-5" />} 
                title="Full Challenge" 
                description="Comprehensive 50-question clinical board prep"
                color="olive"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <MenuButton 
                  onClick={() => startNewGame('mcq')} 
                  icon={<Search className="w-4 h-4" />} 
                  title="Board Review" 
                  description="30 MCQ Practice"
                  color="sidebar"
                />
                <MenuButton 
                  onClick={() => startNewGame('case')} 
                  icon={<Stethoscope className="w-4 h-4" />} 
                  title="Clinical Rounds" 
                  description="10 Case Simulations"
                  color="sidebar"
                />
              </div>
              <MenuButton 
                onClick={() => startNewGame('tf')} 
                icon={<CheckCircle2 className="w-4 h-4" />} 
                title="Rapid Fire Blitz" 
                description="10 Intensive True/False cases"
                color="sidebar"
              />
            </div>

            <div className="mt-12 pt-8 border-t border-natural-border flex items-center justify-between text-natural-muted text-xs font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                <span>Simulation Only</span>
              </div>
              <span>v.2024 Protocol</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'results') {
    const percentage = Math.round((score / filteredQuestions.length) * 100);
    return (
      <div id="game-results" className="min-h-screen bg-natural-bg flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-xl w-full bg-white rounded-[32px] card-shadow p-12 text-center border border-natural-border"
        >
          <div className="mb-8 inline-flex p-5 bg-natural-sidebar rounded-full text-natural-olive">
            <Trophy className="w-14 h-14" />
          </div>
          <h2 className="serif text-3xl font-bold text-natural-ink mb-3">Diagnostic Summary</h2>
          <p className="text-natural-muted mb-10 italic">Case Review Complete: Correctly analyzed {score} of {filteredQuestions.length} pathologies.</p>
          
          <div className="relative w-40 h-40 mx-auto mb-10">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="72"
                fill="transparent"
                stroke="#E9E4D9"
                strokeWidth="12"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="72"
                fill="transparent"
                stroke="#5A5A40"
                strokeWidth="12"
                strokeDasharray="452.4"
                initial={{ strokeDashoffset: 452.4 }}
                animate={{ strokeDashoffset: 452.4 - (452.4 * percentage) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="serif text-4xl font-bold text-natural-olive">{percentage}%</span>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => setGameState('menu')}
              className="w-full py-5 px-8 bg-natural-olive hover:bg-[#4A4A35] text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-natural-olive/20"
            >
              <RefreshCcw className="w-5 h-5" />
              Reset Rounds
            </button>
            <p className="text-natural-muted text-[10px] uppercase tracking-widest font-black pt-4">Target Competency: 80%</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div id="game-playground" className="min-h-screen bg-natural-bg flex flex-col md:flex-row overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-full md:w-[320px] bg-natural-sidebar border-b md:border-b-0 md:border-r border-natural-border p-8 flex flex-col shrink-0">
        <div className="mb-12">
          <h1 className="serif text-3xl font-bold leading-tight text-natural-olive mb-3">Pediatric Rash Detective</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-natural-muted">
            {TYPE_LABELS[currentQuestion.type]} • Case {currentIndex + 1}/{filteredQuestions.length}
          </p>
        </div>

        <div className="flex-1">
          <div className="mb-10">
            <div className="flex justify-between items-end mb-3">
              <span className="text-[11px] font-black uppercase tracking-[0.15em] text-natural-olive">Progress</span>
              <span className="text-xs font-mono text-natural-olive/70">{Math.round(((currentIndex + 1) / filteredQuestions.length) * 100)}%</span>
            </div>
            <div className="w-full h-1.5 bg-natural-border rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-natural-olive"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* QUESTION MATRIX VISUALIZER */}
          <div className="grid grid-cols-5 gap-3">
            {filteredQuestions.slice(0, 50).map((_, idx) => ( // Show grid for up to 50
              <div 
                key={idx}
                className={`h-3 rounded-sm transition-all duration-500 ${
                  idx < currentIndex 
                    ? 'bg-natural-olive opacity-100' 
                    : idx === currentIndex 
                    ? 'bg-natural-accent outline-2 outline-natural-accent outline-offset-2' 
                    : 'bg-natural-border'
                }`}
              />
            ))}
          </div>
          <p className="mt-4 text-[11px] italic text-natural-muted text-center uppercase tracking-wider font-semibold">
            Status Matrix
          </p>
        </div>

        <div className="mt-auto p-5 bg-white/40 rounded-2xl border border-natural-border backdrop-blur-sm">
          <p className="text-[10px] font-black text-natural-olive uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
            <BookOpen className="w-3 h-3" />
            Clinical Source
          </p>
          <p className="text-[11px] text-natural-ink/70 leading-relaxed italic">
            Differential Diagnosis Table for Major Pediatric Rash & Fever Illnesses (v.2024)
          </p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <div className="max-w-4xl w-full mx-auto p-8 md:p-12">
          <header className="flex flex-wrap justify-between items-center mb-10 gap-4 border-b border-natural-border pb-8">
            <div className="flex gap-2">
              <span className="px-4 py-1.5 bg-natural-olive text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                {TYPE_LABELS[currentQuestion.type]}
              </span>
              <span className="px-4 py-1.5 bg-white border border-natural-border text-natural-olive text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                #{currentQuestion.topic.replace(/\s+/g, '')}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-natural-muted">Difficulty:</span>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${DIFFICULTY_COLORS[currentQuestion.difficulty]}`}>
                {currentQuestion.difficulty}
              </span>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div 
              key={currentQuestion.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
            >
              <h2 className="serif text-3xl md:text-4xl font-semibold text-natural-ink mb-10 leading-tight text-balance">
                {currentQuestion.question}
              </h2>

              <div className="bg-white border border-natural-border p-8 md:p-12 rounded-[40px] card-shadow mb-10">
                <div className="space-y-5">
                  {currentQuestion.type === 'case' ? (
                     <div className="relative group">
                        <textarea 
                          key={`case-${currentQuestion.id}`}
                          id={`case-answer-${currentQuestion.id}`}
                          className="w-full p-8 bg-natural-bg/30 border-2 border-natural-border rounded-3xl focus:border-natural-olive focus:outline-none min-h-[180px] transition-all resize-none text-natural-ink font-medium placeholder:text-natural-muted/50 text-lg leading-relaxed"
                          placeholder="Formulate your diagnostic conclusion here..."
                          disabled={showFeedback}
                        />
                        {!showFeedback && (
                          <button 
                            onClick={() => {
                               const val = (document.getElementById(`case-answer-${currentQuestion.id}`) as HTMLTextAreaElement).value;
                               handleAnswer(val);
                            }}
                            className="w-full mt-8 py-5 bg-natural-olive hover:bg-[#4A4A35] text-white rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-natural-olive/20 hover:scale-[1.02] active:scale-[0.98]"
                          >
                            Submit Diagnosis
                          </button>
                        )}
                     </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {currentQuestion.options ? (
                        currentQuestion.options.map((option, idx) => (
                          <AnswerOption 
                            key={idx}
                            option={option}
                            label={String.fromCharCode(65 + idx)}
                            onClick={() => handleAnswer(option)}
                            isSelected={selectedAnswer === option}
                            showFeedback={showFeedback}
                            isCorrect={option === currentQuestion.correctAnswer}
                          />
                        ))
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                          {['True', 'False'].map((option, idx) => (
                            <AnswerOption 
                              key={option}
                              option={option}
                              label={idx === 0 ? 'T' : 'F'}
                              onClick={() => handleAnswer(option)}
                              isSelected={selectedAnswer === option}
                              showFeedback={showFeedback}
                              isCorrect={option === currentQuestion.correctAnswer}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {showFeedback && (
                    <motion.div 
                      id="feedback-panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="mt-12 pt-10 border-t border-natural-border"
                    >
                      <div className={`p-8 rounded-3xl mb-8 flex gap-5 ${isCorrect ? 'bg-green-50/50 text-green-900 border border-green-100' : 'bg-rose-50/50 text-natural-accent border border-rose-100'}`}>
                        <div className="shrink-0 mt-1">
                          {isCorrect ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                        </div>
                        <div>
                          <p className="serif text-2xl font-bold mb-2 leading-none">{isCorrect ? 'Diagnostic Concordance' : 'Diagnostic Divergence'}</p>
                          <p className="text-sm opacity-90 leading-relaxed font-semibold">
                            Pathognomonic Match: <span className="underline decoration-2 underline-offset-8 font-bold">{currentQuestion.correctAnswer}</span>
                          </p>
                        </div>
                      </div>

                      <div className="bg-natural-sidebar/30 p-8 md:p-10 rounded-[32px] border border-natural-border mb-10">
                        <div className="flex items-center gap-2 mb-6 text-natural-olive italic">
                          <BookOpen className="w-4 h-4" />
                          <span className="text-[10px] uppercase font-black tracking-[0.2em] not-italic">Clinical Contextualization</span>
                        </div>
                        <p className="text-natural-ink/90 text-base leading-relaxed font-medium text-balance">
                          {currentQuestion.explanation}
                        </p>
                      </div>

                      <div className="flex justify-between items-center gap-4">
                        <button 
                          onClick={nextQuestion}
                          className="flex-1 py-5 bg-natural-olive hover:bg-[#4A4A35] text-white rounded-full text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl shadow-natural-olive/20 hover:scale-[1.02] active:scale-[0.98]"
                        >
                          Next Case Study
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </AnimatePresence>
          
          <footer className="mt-12 pt-8 border-t border-natural-border flex justify-between items-center">
             <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-natural-muted">
               <span className="hover:text-natural-olive cursor-pointer transition-colors" onClick={() => setGameState('menu')}>← Exit Rounds</span>
               <div className="w-px h-4 bg-natural-border"></div>
               <span>Clinical Load: {score} Correct</span>
             </div>
             <p className="text-[10px] font-bold uppercase italic text-natural-muted tracking-widest">{filteredQuestions.length - currentIndex - 1} cases remaining in queue</p>
          </footer>
        </div>
      </main>
    </div>
  );
}

function MenuButton({ onClick, icon, title, description, color }: { onClick: () => void, icon: React.ReactNode, title: string, description: string, color: string }) {
  const colorMap: Record<string, string> = {
    olive: 'bg-natural-bg text-natural-olive border-natural-border hover:bg-natural-olive hover:text-white',
    sidebar: 'bg-natural-sidebar/50 text-natural-olive border-natural-border hover:bg-natural-olive hover:text-white',
  };

  return (
    <button 
      onClick={onClick}
      className="group relative flex flex-col items-start p-6 bg-white border border-natural-border rounded-2xl transition-all hover:shadow-xl hover:border-natural-olive/30 text-left active:scale-[0.98] overflow-hidden"
    >
      <div className={`p-3 rounded-xl mb-4 transition-all duration-500 ${colorMap[color]}`}>
        {icon}
      </div>
      <h3 className="serif text-lg font-bold text-natural-ink mb-1 flex items-center gap-2">
        {title}
        <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-natural-olive" />
      </h3>
      <p className="text-[10px] text-natural-muted font-bold uppercase tracking-widest">{description}</p>
    </button>
  );
}

function AnswerOption({ option, label, onClick, isSelected, showFeedback, isCorrect }: { 
  option: string, 
  label: string,
  onClick: () => void, 
  isSelected: boolean, 
  showFeedback: boolean, 
  isCorrect: boolean 
}) {
  let styles = "w-full p-4 md:p-6 rounded-2xl border-2 text-left font-semibold transition-all flex items-center group relative overflow-hidden ";
  
  if (showFeedback) {
    if (isCorrect) styles += "bg-green-50 border-green-500 text-green-900 ";
    else if (isSelected) styles += "bg-rose-50 border-natural-accent text-natural-accent shadow-inner opacity-80 ";
    else styles += "bg-white border-slate-100 text-slate-300 ";
  } else {
    styles += isSelected 
      ? "bg-natural-sidebar border-natural-olive text-natural-olive shadow-lg " 
      : "bg-white border-natural-border hover:border-natural-olive/50 text-natural-ink hover:bg-natural-bg/50 ";
  }

  return (
    <motion.button 
      whileHover={!showFeedback ? { x: 8 } : {}}
      whileTap={!showFeedback ? { scale: 0.98 } : {}}
      disabled={showFeedback}
      onClick={onClick}
      className={styles}
    >
      <span className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-xs font-black mr-5 transition-colors duration-500 ${
        showFeedback && isCorrect 
          ? 'bg-green-500 text-white' 
          : isSelected 
          ? 'bg-natural-olive text-white' 
          : 'bg-natural-sidebar text-natural-olive group-hover:bg-natural-olive group-hover:text-white'
      }`}>
        {label}
      </span>
      <span className="text-sm md:text-base leading-tight pr-10">{option}</span>
      <div className="absolute right-6">
        {showFeedback && isCorrect && <CheckCircle2 className="w-6 h-6 text-green-600" />}
        {showFeedback && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-natural-accent" />}
      </div>
    </motion.button>
  );
}
