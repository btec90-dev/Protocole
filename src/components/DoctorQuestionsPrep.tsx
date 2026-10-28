import React, { useState } from 'react';
import { PhoneCall, CheckSquare, Square, Plus, Trash2, Save, Stethoscope, Copy, Check, Sparkles } from 'lucide-react';
import { MilestoneBadge } from './MilestoneBadge';

interface QuestionItem {
  id: string;
  question: string;
  answered: boolean;
  response: string;
}

export const DoctorQuestionsPrep: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionItem[]>([
    {
      id: "q1",
      question: "Valider les suites opératoires de l'hystéroscopie (Debris Removal) du 28 octobre à 06h15 et l'aspect de la cavité utérine ?",
      answered: false,
      response: ""
    },
    {
      id: "q2",
      question: "Confirmer la sélection du Blastocyste #1 (5AA Euploïde Garçon parmi nos 5 normaux : 2 garçons, 3 filles) pour la décongélation ?",
      answered: false,
      response: ""
    },
    {
      id: "q3",
      question: "Quelle est la date cible définitive fixée pour le transfert d'embryon congelé (FET) maintenant que la cavité est nettoyée ?",
      answered: false,
      response: ""
    },
    {
      id: "q4",
      question: "À quelle date et heure précise commencer les injections de progestérone (PIO - 120h avant transfert) et quel est le protocole d'estrogènes ?",
      answered: false,
      response: ""
    },
    {
      id: "q5",
      question: "Quelles sont les recommandations post-transfert (repos relatif, compléments) pour maximiser les chances d'implantation ?",
      answered: false,
      response: ""
    }
  ]);

  const [newQuestionText, setNewQuestionText] = useState('');
  const [copiedScript, setCopiedScript] = useState(false);

  const toggleAnswered = (id: string) => {
    setQuestions(prev =>
      prev.map(q => (q.id === id ? { ...q, answered: !q.answered } : q))
    );
  };

  const handleUpdateResponse = (id: string, text: string) => {
    setQuestions(prev =>
      prev.map(q => (q.id === id ? { ...q, response: text } : q))
    );
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newQ: QuestionItem = {
      id: `q-${Date.now()}`,
      question: newQuestionText.trim(),
      answered: false,
      response: ""
    };

    setQuestions([...questions, newQ]);
    setNewQuestionText('');
  };

  const handleDelete = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleCopyScript = () => {
    const text = `Questions pour la consultation FET de Fatou :
${questions.map((q, idx) => `${idx + 1}. ${q.question} ${q.response ? `[Réponse: ${q.response}]` : ''}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <section id="consultation" className="py-10 bg-[#FAF7F2] border-b border-[#E8DDD0]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#8C6D46] uppercase-eyebrow">
              <Stethoscope className="w-3.5 h-3.5 text-[#8C6D46]" />
              <span>Préparation Consultation Médicale</span>
              <span aria-hidden="true" className="text-zinc-300">·</span>
              <span>Post-Opératoire & FET</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#3E2C1C] font-display mt-1">
              Questions pour l'équipe médicale & appel de protocole
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl leading-relaxed">
              Consignez vos questions pour ne rien oublier lors de l'appel post-opératoire et notez directement les réponses du praticien.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopyScript}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#5C4434] bg-white border border-[#E8DDD0] rounded-xl hover:bg-[#F5EFEB] transition-colors shadow-2xs self-start md:self-auto"
          >
            {copiedScript ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copié dans le presse-papier !</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#8C6D46]" />
                <span>Copier la liste pour l'appel</span>
              </>
            )}
          </button>
        </div>

        {/* Questions List */}
        <div className="bg-white rounded-2xl border border-[#E8DDD0] p-4 sm:p-5 shadow-xs space-y-3.5 mb-5">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className={`p-3.5 rounded-xl border transition-all ${
                q.answered
                  ? 'bg-[#FAF7F2]/60 border-[#E8DDD0]'
                  : 'bg-white border-[#E8DDD0] hover:border-[#8C6D46]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => toggleAnswered(q.id)}
                  className="mt-0.5 text-[#8C6D46] hover:text-[#5C4434] transition-colors"
                  aria-label={q.answered ? "Marquer non répondu" : "Marquer répondu"}
                >
                  {q.answered ? (
                    <CheckSquare className="w-5 h-5 text-[#8C6D46]" />
                  ) : (
                    <Square className="w-5 h-5 text-zinc-400" />
                  )}
                </button>

                <div className="flex-1">
                  <h4 className={`text-xs sm:text-sm font-semibold leading-relaxed ${
                    q.answered ? 'line-through text-zinc-400' : 'text-[#3E2C1C]'
                  }`}>
                    {idx + 1}. {q.question}
                  </h4>

                  {/* Practitioner response input */}
                  <div className="mt-2.5">
                    <input
                      type="text"
                      value={q.response}
                      onChange={(e) => handleUpdateResponse(q.id, e.target.value)}
                      placeholder="Notez ici la réponse du praticien ou de l'infirmière coordonnatrice..."
                      className="w-full text-xs p-2 bg-[#FAF7F2] border border-[#E8DDD0] rounded-lg text-[#3E2C1C] placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#8C6D46]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(q.id)}
                  className="text-zinc-300 hover:text-rose-600 p-1 transition-colors"
                  title="Supprimer"
                  aria-label="Supprimer la question"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Add custom question form */}
          <form onSubmit={handleAddQuestion} className="flex gap-2 pt-2">
            <input
              type="text"
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="Ajouter une autre question personnalisée..."
              className="flex-1 text-xs p-2.5 bg-[#FAF7F2] border border-[#E8DDD0] rounded-xl text-[#3E2C1C] placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#8C6D46]"
            />
            <button
              type="submit"
              className="px-3.5 py-2 text-xs font-bold text-white bg-[#8C6D46] hover:bg-[#745233] rounded-xl shadow-xs transition-colors flex items-center gap-1 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
