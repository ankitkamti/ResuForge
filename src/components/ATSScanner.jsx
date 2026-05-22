import React, { useState } from 'react';
import { 
  ShieldCheck, AlertCircle, CheckCircle, Info, Terminal, 
  AlertTriangle, Eye, Brain, HelpCircle, ChevronRight, Zap, Play 
} from 'lucide-react';

export default function ATSScanner({ resumeData, updateExperience }) {
  const [selectedLens, setSelectedLens] = useState('hiring'); // skimmer, tech, hiring
  const [injectingBulletId, setInjectingBulletId] = useState(null);
  const [selectedMetricTmpl, setSelectedMetricTmpl] = useState('performance');
  const [metricValue, setMetricValue] = useState('');

  const { personalInfo, summary, experience, education, projects, skills, activeLayout } = resumeData;

  // Standard ATS score rating calculations
  const runScan = () => {
    let score = 0;
    const items = [];
    let wordCount = 0;
    
    // 1. Personal Info Check (Max 15pts)
    let pInfoScore = 0;
    const pInfoKeys = ['fullName', 'email', 'phone', 'location'];
    const pKeysFound = pInfoKeys.filter(k => personalInfo && personalInfo[k]?.trim());
    pInfoScore += pKeysFound.length * 3.75;
    score += pInfoScore;

    if (pKeysFound.length === 4) {
      items.push({ type: 'success', text: 'All essential contact details provided (Name, Email, Phone, Location).' });
    } else {
      const missing = pInfoKeys.filter(k => !personalInfo || !personalInfo[k]?.trim());
      items.push({ 
        type: 'danger', 
        text: `Missing critical contact detail: ${missing.map(m => m === 'fullName' ? 'Full Name' : m.charAt(0).toUpperCase() + m.slice(1)).join(', ')}.` 
      });
    }

    if (personalInfo?.linkedin?.trim()) {
      score += 2;
    }

    // Calculate word counts
    const textBlocks = [];
    if (summary) textBlocks.push(summary);
    
    experience.forEach(exp => {
      textBlocks.push(exp.company || '');
      textBlocks.push(exp.role || '');
      textBlocks.push(exp.description || '');
    });
    
    projects.forEach(proj => {
      textBlocks.push(proj.title || '');
      textBlocks.push(proj.description || '');
      textBlocks.push(proj.technologies || '');
    });

    education.forEach(edu => {
      textBlocks.push(edu.degree || '');
      textBlocks.push(edu.school || '');
      textBlocks.push(edu.description || '');
    });

    skills.forEach(sk => {
      textBlocks.push(sk.category || '');
      textBlocks.push(sk.list || '');
    });

    const fullText = textBlocks.join(' ');
    wordCount = fullText.split(/\s+/).filter(w => w.length > 0).length;

    // 2. Core Section Content Checks (Max 25pts)
    if (summary?.trim() && summary.length > 30) {
      score += 5;
    } else {
      items.push({ type: 'danger', text: 'Professional summary is missing or too brief.' });
    }

    if (experience && experience.length > 0) {
      score += 10;
    } else {
      items.push({ type: 'danger', text: 'No work experience added. ATS parsers require chronological history.' });
    }

    if (skills && skills.some(sk => sk.list?.trim())) {
      score += 5;
    }

    // 3. Word Count sweet spot (Max 15pts)
    if (wordCount >= 400 && wordCount <= 750) {
      score += 15;
    } else {
      score += 8;
    }

    // 4. Layout & ATS Structure Checks (Max 25pts)
    if (activeLayout === 'functional') {
      score += 10;
    } else {
      score += 15;
    }

    if (resumeData.layoutSettings?.template === 'elegant' || resumeData.layoutSettings?.template === 'minimal') {
      score += 10;
    } else {
      score += 8;
    }

    // 5. Action Verbs check (Max 15pts)
    const strongVerbs = ['architected', 'engineered', 'led', 'designed', 'streamlined', 'optimized', 'spearheaded', 'managed', 'created', 'built', 'orchestrated', 'refactored', 'automated', 'implemented', 'negotiated', 'formulated'];
    const lowerText = fullText.toLowerCase();
    const matches = strongVerbs.filter(v => lowerText.includes(v));
    const verbPoints = Math.min(15, matches.length * 3);
    score += verbPoints;

    return { score: Math.min(100, Math.round(score)), items, wordCount };
  };

  const { score, items, wordCount } = runScan();

  // Simulated ATS plain-text extraction
  const generateSimulatedParse = () => {
    let out = '';
    if (personalInfo?.fullName) out += `[CONTACT_HEADER]\n${personalInfo.fullName.toUpperCase()}\n`;
    if (personalInfo?.title) out += `${personalInfo.title}\n`;
    const contactRow = [personalInfo?.email, personalInfo?.phone, personalInfo?.location].filter(Boolean).join(' | ');
    if (contactRow) out += `${contactRow}\n`;
    if (summary) out += `\n[SUMMARY]\n${summary}\n`;
    
    if (experience && experience.length > 0) {
      out += `\n[WORK_EXPERIENCE]\n`;
      experience.forEach(exp => {
        out += `* ${exp.company} - ${exp.role} (${exp.dates})\n  ${exp.description || ''}\n`;
      });
    }
    return out;
  };

  // Recruiter simulated lens parameters
  const getLensInfo = () => {
    switch (selectedLens) {
      case 'skimmer':
        return {
          title: "The 6-Second Skimmer (HR Generalist)",
          focus: "Readability, layout speed, density.",
          desc: "HR managers spend an average of 6 seconds skimming a resume. They scan for clean layouts and penalize dense paragraphs and massive bullet logs.",
          metricName: "Skim-Scan Index",
          metricValue: experience.some(exp => exp.description?.length > 300 && !exp.description.includes('\n')) ? 'Moderate (Dense Block Alert)' : 'High (Good bullet distribution)'
        };
      case 'tech':
        return {
          title: "The Technical Recruiter (Screener)",
          focus: "Skills stack matches, keyword index.",
          desc: "Tech screeners search for key technologies, databases, frameworks, and programming languages. They want to see skill tags supported by practical usage in job bullet points.",
          metricName: "Keyword Match Ratio",
          metricValue: `${Math.min(100, Math.round(skills.reduce((acc, curr) => acc + (curr.list ? curr.list.split(',').length : 0), 0) * 8))}% Match`
        };
      case 'hiring':
      default:
        return {
          title: "The Hiring Manager (Engineering Lead)",
          focus: "Quantitative metrics, business impact, STAR structure.",
          desc: "Hiring managers hate standard list of duties. They hunt for numbers, %, scale, and currency symbols indicating genuine, measurable business results.",
          metricName: "Metrics Density Score",
          metricValue: `${experience.reduce((acc, curr) => {
            if (!curr.description) return acc;
            const matches = curr.description.match(/\d+[%$]?/g);
            return acc + (matches ? matches.length : 0);
          }, 0)} Metrics Found`
        };
    }
  };

  const lens = getLensInfo();

  // Helper lists for technology keyword highlights
  const TECH_WORDS = ['react', 'next.js', 'node.js', 'express', 'javascript', 'typescript', 'go', 'python', 'sql', 'html5', 'css3', 'aws', 'docker', 'git', 'github', 's3', 'lambda', 'ec2', 'websockets', 'serverless', 'distributed', 'postgres', 'databases', 'system', 'cloud'];

  // Highlights text according to the selected Recruiter Lens
  const highlightText = (text, type) => {
    if (!text) return <em>Empty field</em>;

    if (selectedLens === 'skimmer') {
      // Skimmer highlights: highlight bullet lists as good green, paragraphs as dense orange
      if (text.includes('\n')) {
        return <div style={{ borderLeft: '2px solid #10b981', paddingLeft: '8px', color: '#a7f3d0' }}>{text}</div>;
      }
      if (text.length > 200) {
        return (
          <div style={{ borderLeft: '2px solid #f59e0b', paddingLeft: '8px', color: '#fde68a' }}>
            <span style={{ fontSize: '0.65rem', background: '#d97706', color: 'white', padding: '1px 4px', borderRadius: '3px', marginRight: '5px' }}>DENSE BLOCK</span>
            {text}
          </div>
        );
      }
      return <div style={{ color: '#f8fafc' }}>{text}</div>;
    }

    if (selectedLens === 'tech') {
      // Tech screener highlights: Color code technology keywords in bright blue
      const words = text.split(/(\s+|,|\.|\n)/);
      return (
        <div>
          {words.map((word, idx) => {
            const clean = word.toLowerCase().replace(/[^a-z0-9\-.]/g, '');
            if (TECH_WORDS.includes(clean)) {
              return <span key={idx} style={{ backgroundColor: 'rgba(59, 130, 246, 0.25)', color: '#60a5fa', fontWeight: 'bold', padding: '1px 3px', borderRadius: '3px' }}>{word}</span>;
            }
            return <span key={idx}>{word}</span>;
          })}
        </div>
      );
    }

    if (selectedLens === 'hiring') {
      // Hiring manager highlights: Color code numbers and percentage metrics in bright green
      const bullets = text.split('\n');
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {bullets.map((b, bIdx) => {
            const hasMetric = /\d+/.test(b);
            const words = b.split(/(\s+)/);
            
            return (
              <div 
                key={bIdx} 
                style={{ 
                  padding: '4px', 
                  borderRadius: '4px',
                  background: hasMetric ? 'rgba(16, 185, 129, 0.04)' : 'rgba(245, 158, 11, 0.04)',
                  borderLeft: hasMetric ? '2px solid #10b981' : '2px solid #f59e0b'
                }}
              >
                {words.map((word, idx) => {
                  if (/\d+[%$]?/.test(word)) {
                    return <span key={idx} style={{ color: '#10b981', fontWeight: 'bold', textDecoration: 'underline' }}>{word}</span>;
                  }
                  return <span key={idx}>{word}</span>;
                })}
              </div>
            );
          })}
        </div>
      );
    }

    return text;
  };

  // Metric injector configurations
  const METRIC_TEMPLATES = {
    performance: {
      label: 'Performance / Speed',
      format: (val) => `, accelerating interface rendering times by ${val}% through automated code caching`
    },
    savings: {
      label: 'Cost / Server Savings',
      format: (val) => `, reducing monthly cloud hosting expenditures by ${val}%`
    },
    scale: {
      label: 'User / Scale Volume',
      format: (val) => `, scaling concurrent platform capacity to support ${val}+ active sessions`
    },
    speed: {
      label: 'Team Delivery Speed',
      format: (val) => `, cutting engineer release deployment intervals by ${val}%`
    }
  };

  const handleOpenInjector = (expId, bulletText) => {
    setInjectingBulletId({ expId, text: bulletText });
  };

  const handleApplyMetric = () => {
    if (!metricValue) return;

    const { expId, text } = injectingBulletId;
    const formattedMetric = METRIC_TEMPLATES[selectedMetricTmpl].format(metricValue);
    
    // Stitch the metric into the selected bullet text
    const cleanBullet = text.trim().replace(/\.$/, ''); // strip trailing dot
    const modifiedBullet = `${cleanBullet}${formattedMetric}.`;

    // Rewrite the experience description state
    const updated = experience.map(exp => {
      if (exp.id === expId) {
        // Find and replace the specific bullet line
        const bullets = exp.description.split('\n');
        const index = bullets.findIndex(b => b.trim() === text.trim());
        if (index !== -1) {
          bullets[index] = modifiedBullet;
        } else {
          // If match fails, just append it
          bullets.push(modifiedBullet);
        }
        return { ...exp, description: bullets.join('\n') };
      }
      return exp;
    });

    updateExperience(updated);
    
    // Clear state
    setInjectingBulletId(null);
    setMetricValue('');
  };

  return (
    <div className="ats-scanner-panel">
      {/* 1. Global Score Dial Row */}
      <div className="ats-score-row">
        <div className="ats-radial-gauge">
          <svg width="70" height="70">
            <circle className="circle-bg" cx="35" cy="35" r="28" />
            <circle 
              className="circle-progress" 
              cx="35" 
              cy="35" 
              r="28" 
              stroke={score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'}
              strokeDasharray={2 * Math.PI * 28}
              strokeDashoffset={2 * Math.PI * 28 - (score / 100) * (2 * Math.PI * 28)}
            />
          </svg>
          <div className="ats-radial-score" style={{ color: score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444' }}>
            {score}
          </div>
        </div>
        <div className="ats-score-meta">
          <div className="ats-score-title">ATS Indexability Score</div>
          <div className="ats-score-desc">
            Vitals check: contact details, chronological layouts, structural formats, and action word density.
          </div>
        </div>
      </div>

      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0.25rem 0' }} />

      {/* 2. RECRUITER PERSONA SIMULATOR TABS */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <label style={{ fontSize: '0.68rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Eye size={14} color="#3b82f6" />
            Recruiter Lens Simulator
          </label>
        </div>

        <div className="layout-toggle-row" style={{ width: '100%' }}>
          <button 
            type="button" 
            className={`layout-toggle-btn ${selectedLens === 'skimmer' ? 'active' : ''}`}
            style={{ flex: 1 }}
            onClick={() => setSelectedLens('skimmer')}
          >
            HR Skimmer
          </button>
          <button 
            type="button" 
            className={`layout-toggle-btn ${selectedLens === 'tech' ? 'active' : ''}`}
            style={{ flex: 1 }}
            onClick={() => setSelectedLens('tech')}
          >
            Tech Screener
          </button>
          <button 
            type="button" 
            className={`layout-toggle-btn ${selectedLens === 'hiring' ? 'active' : ''}`}
            style={{ flex: 1 }}
            onClick={() => setSelectedLens('hiring')}
          >
            Hiring Manager
          </button>
        </div>

        {/* Selected Lens Info Card */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0.75rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>{lens.title}</span>
            <span style={{ fontSize: '0.65rem', background: 'rgba(59,130,246,0.15)', color: '#60a5fa', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold' }}>
              {lens.metricName}: {lens.metricValue}
            </span>
          </div>
          <p style={{ fontSize: '0.68rem', color: '#94a3b8', lineHeight: 1.35 }}>{lens.desc}</p>
        </div>
      </div>

      {/* 3. SIMULATOR DYNAMIC VISUAL HEATMAP */}
      <div>
        <label style={{ fontSize: '0.68rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'block' }}>
          Real-time Audit Heatmap Highlights
        </label>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '200px', overflowY: 'auto', paddingRight: '0.25rem' }}>
          {experience.map(exp => (
            <div key={exp.id} style={{ background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '6px', padding: '0.6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'white', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                <span>{exp.company} — {exp.role}</span>
              </div>
              
              {/* Highlight Output */}
              <div style={{ fontSize: '0.72rem', lineHeight: 1.4 }}>
                {highlightText(exp.description, exp.isCareerBreak ? 'break' : 'job')}
              </div>

              {/* Dynamic Interactive Metrics Injector Prompt */}
              {selectedLens === 'hiring' && exp.description && !exp.isCareerBreak && (
                <div style={{ marginTop: '0.4rem', borderTop: '1px dashed rgba(255,255,255,0.05)', paddingTop: '0.4rem' }}>
                  {exp.description.split('\n').filter(b => b.trim()).map((bullet, idx) => {
                    const hasMetric = /\d+/.test(bullet);
                    if (!hasMetric) {
                      return (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.1)', padding: '4px 6px', borderRadius: '4px', marginTop: '3px' }}>
                          <span style={{ fontSize: '0.65rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Zap size={10} /> Bullet lacks quantitative impact.
                          </span>
                          <button 
                            type="button" 
                            className="btn-primary" 
                            style={{ padding: '2px 6px', fontSize: '0.6rem', background: '#d97706', boxShadow: 'none' }}
                            onClick={() => handleOpenInjector(exp.id, bullet)}
                          >
                            Inject Metric
                          </button>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              )}

            </div>
          ))}
        </div>
      </div>

      {/* Metric Injector Dialogue Overlay */}
      {injectingBulletId && (
        <div style={{ background: 'rgba(79, 70, 229, 0.08)', border: '1px solid rgba(79, 70, 229, 0.25)', borderRadius: '8px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Zap size={14} color="#f59e0b" />
              Metric Rewriter Wizard
            </span>
            <button 
              type="button" 
              className="icon-btn" 
              style={{ fontSize: '0.65rem' }} 
              onClick={() => setInjectingBulletId(null)}
            >
              ✕
            </button>
          </div>
          
          <p style={{ fontSize: '0.65rem', color: '#94a3b8', fontStyle: 'italic', lineHeight: 1.3 }}>
            "{injectingBulletId.text}"
          </p>

          <div className="form-group">
            <label style={{ fontSize: '0.6rem' }}>Select Achievement Formula</label>
            <select 
              className="form-input" 
              style={{ padding: '0.3rem', fontSize: '0.7rem' }}
              value={selectedMetricTmpl}
              onChange={(e) => setSelectedMetricTmpl(e.target.value)}
            >
              {Object.keys(METRIC_TEMPLATES).map(k => (
                <option key={k} value={k}>{METRIC_TEMPLATES[k].label}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ fontSize: '0.6rem' }}>Quantifiable Amount (e.g. 45, 12K)</label>
              <input 
                type="text" 
                className="form-input" 
                style={{ padding: '0.35rem', fontSize: '0.72rem' }}
                placeholder="Value"
                value={metricValue}
                onChange={(e) => setMetricValue(e.target.value)}
              />
            </div>
            <button 
              type="button" 
              className="btn-primary" 
              style={{ background: '#10b981', padding: '0.4rem 0.75rem', fontSize: '0.7rem', height: '29px' }}
              onClick={handleApplyMetric}
              disabled={!metricValue}
            >
              Rewrite Bullet
            </button>
          </div>
        </div>
      )}

      {/* 4. Parser Raw Feed */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.3rem', color: '#94a3b8' }}>
          <Terminal size={14} />
          <span style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase' }}>
            ATS plain-text machine extraction feed
          </span>
        </div>
        <div className="ats-parser-preview-box" style={{ height: '90px' }}>
          {generateSimulatedParse() || '// Add data to start extraction simulation...'}
        </div>
      </div>
    </div>
  );
}
