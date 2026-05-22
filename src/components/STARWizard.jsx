import React, { useState } from 'react';
import { ACTION_VERBS, STAR_GUIDELINES } from '../data/verbs';
import { Sparkles, Copy, FileText, Check } from 'lucide-react';

export default function STARWizard({ onAddBullet }) {
  const [framework, setFramework] = useState('star'); // star or car
  const [inputs, setInputs] = useState({
    situation: '',
    task: '',
    action: '',
    result: ''
  });
  
  const [selectedCategory, setSelectedCategory] = useState(Object.keys(ACTION_VERBS)[0]);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (field, val) => {
    setInputs(prev => ({ ...prev, [field]: val }));
  };

  const handleVerbClick = (verb) => {
    // Insert verb at the beginning of Action, capitalize it
    const cleanVerb = verb.trim();
    if (!inputs.action) {
      handleInputChange('action', cleanVerb + ' ');
    } else {
      handleInputChange('action', cleanVerb + ' ' + inputs.action.replace(/^[A-Z][a-z]+\s/, ''));
    }
  };

  // Stitches the sentence together professionally
  const compileSentence = () => {
    const { situation, task, action, result } = inputs;
    
    if (!action) return 'Start typing your Action to see the compiled bullet...';

    const cleanAction = action.trim();
    const cleanTask = task ? ` ${task.trim()}` : '';
    const cleanSituation = situation ? ` to address ${situation.trim().replace(/^to address\s+/i, '')}` : '';
    const cleanResult = result ? `, resulting in ${result.trim().replace(/^resulting in\s+/i, '')}` : '';

    // e.g., "Optimized database performance to address legacy load drops, resulting in 40% speed up."
    let sentence = `${cleanAction}${cleanTask}${cleanSituation}${cleanResult}`;
    
    // Clean up double spaces or periods
    sentence = sentence.replace(/\s+/g, ' ');
    if (!sentence.endsWith('.')) sentence += '.';
    
    return sentence;
  };

  const handleCopy = () => {
    const text = compileSentence();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = () => {
    const text = compileSentence();
    if (onAddBullet) {
      onAddBullet(text);
      // Reset inputs
      setInputs({ situation: '', task: '', action: '', result: '' });
    }
  };

  return (
    <div className="star-helper-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'white' }}>
          <Sparkles size={16} color="#3b82f6" />
          STAR/CAR Bullet Creator
        </h4>
        <div className="layout-toggle-row">
          <button 
            type="button"
            className={`layout-toggle-btn ${framework === 'star' ? 'active' : ''}`}
            onClick={() => setFramework('star')}
          >
            STAR
          </button>
          <button 
            type="button"
            className={`layout-toggle-btn ${framework === 'car' ? 'active' : ''}`}
            onClick={() => setFramework('car')}
          >
            CAR
          </button>
        </div>
      </div>

      <p style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.4 }}>
        Struggling to write impactful accomplishments? Use the {framework.toUpperCase()} formula below to frame your achievements.
      </p>

      {/* Inputs Form */}
      <div className="star-steps">
        {framework === 'star' ? (
          <>
            <div className="star-step-input">
              <span className="star-badge s">S</span>
              <div className="form-group" style={{ flex: 1 }}>
                <label>{STAR_GUIDELINES.S.label}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g., Faced with a 25% drop in conversion rate" 
                  value={inputs.situation}
                  onChange={(e) => handleInputChange('situation', e.target.value)}
                />
              </div>
            </div>

            <div className="star-step-input">
              <span className="star-badge t">T</span>
              <div className="form-group" style={{ flex: 1 }}>
                <label>{STAR_GUIDELINES.T.label}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g., Tasked with redesigning the signup funnel" 
                  value={inputs.task}
                  onChange={(e) => handleInputChange('task', e.target.value)}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="star-step-input">
            <span className="star-badge s">C</span>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Context (Challenge / Scope)</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g., Faced with outdated legacy codebase and slow pipelines" 
                value={inputs.situation}
                onChange={(e) => handleInputChange('situation', e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="star-step-input">
          <span className="star-badge a">A</span>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Action (What you engineered/did)</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g., Spearheaded refactoring of code and migratied microservices" 
              value={inputs.action}
              onChange={(e) => handleInputChange('action', e.target.value)}
            />
          </div>
        </div>

        <div className="star-step-input">
          <span className="star-badge r">R</span>
          <div className="form-group" style={{ flex: 1 }}>
            <label>{STAR_GUIDELINES.R.label}</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g., reducing build times by 40% and cutting hosting costs by 20%" 
              value={inputs.result}
              onChange={(e) => handleInputChange('result', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Thesaurus Box */}
      <div className="verbs-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <label style={{ fontSize: '0.68rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
            Action Verbs Thesaurus
          </label>
          <select 
            className="verbs-category-select" 
            style={{ width: '130px', margin: 0 }}
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {Object.keys(ACTION_VERBS).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="verbs-grid">
          {ACTION_VERBS[selectedCategory].map(verb => (
            <span 
              key={verb} 
              className="verb-pill"
              onClick={() => handleVerbClick(verb)}
            >
              {verb}
            </span>
          ))}
        </div>
      </div>

      {/* Result Compile Section */}
      <div className="star-result-preview">
        <span className="title">Compiled Bullet Output</span>
        <p style={{ color: inputs.action ? '#f8fafc' : '#64748b', fontStyle: inputs.action ? 'normal' : 'italic' }}>
          {compileSentence()}
        </p>
      </div>

      {/* Helper Actions */}
      <div className="star-actions">
        <button 
          type="button" 
          className="btn-secondary" 
          style={{ flex: 1, justifyContent: 'center' }}
          onClick={handleCopy}
          disabled={!inputs.action}
        >
          {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
        <button 
          type="button" 
          className="btn-primary" 
          style={{ flex: 1, justifyContent: 'center' }}
          onClick={handleInsert}
          disabled={!inputs.action}
        >
          <FileText size={14} />
          Insert into Experience
        </button>
      </div>
    </div>
  );
}
