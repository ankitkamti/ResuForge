import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, ShieldCheck, Zap, Download, Upload, 
  Sparkles, Sliders, Settings, Check, RefreshCw 
} from 'lucide-react';

// Data imports
import { SAMPLE_RESUME_DATA } from './data/sample';

// Components imports
import Editor from './components/Editor';
import Previewer from './components/Previewer';
import STARWizard from './components/STARWizard';
import ATSScanner from './components/ATSScanner';
import SpacingOptimizer from './components/SpacingOptimizer';

export default function App() {
  // Global state loaded from LocalStorage or default sample template
  const [resumeData, setResumeData] = useState(() => {
    try {
      const local = localStorage.getItem('premium_resume_draft');
      if (local) {
        const parsed = JSON.parse(local);
        // Ensure necessary defaults are present
        if (parsed.personalInfo) return parsed;
      }
    } catch (e) {
      console.warn("Failed to load local storage draft, using default template", e);
    }
    return SAMPLE_RESUME_DATA;
  });

  const [activeTab, setActiveTab] = useState('details'); // details, experience, star, ats, tweaks
  const [toastMessage, setToastMessage] = useState('');
  const [showImportDropdown, setShowImportDropdown] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const paperRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-Save Draft to LocalStorage
  useEffect(() => {
    localStorage.setItem('premium_resume_draft', JSON.stringify(resumeData));
  }, [resumeData]);

  // Display quick notifications
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // State Event Modifiers
  const updatePersonalInfo = (field, val) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: val }
    }));
  };

  const updateSummary = (val) => {
    setResumeData(prev => ({ ...prev, summary: val }));
  };

  const updateExperience = (updatedExp) => {
    setResumeData(prev => ({ ...prev, experience: updatedExp }));
  };

  const updateProjects = (updatedProj) => {
    setResumeData(prev => ({ ...prev, projects: updatedProj }));
  };

  const updateEducation = (updatedEdu) => {
    setResumeData(prev => ({ ...prev, education: updatedEdu }));
  };

  const updateSkills = (updatedSkills) => {
    setResumeData(prev => ({ ...prev, skills: updatedSkills }));
  };

  const updateCustomSections = (updatedCustom) => {
    setResumeData(prev => ({ ...prev, customSections: updatedCustom }));
  };


  const updateLayoutSettings = (field, val) => {
    setResumeData(prev => ({
      ...prev,
      layoutSettings: { ...prev.layoutSettings, [field]: val }
    }));
  };

  const updateActiveLayout = (layout) => {
    setResumeData(prev => ({ ...prev, activeLayout: layout }));
    triggerToast(`Layout Switched to ${layout.toUpperCase()}`);
  };

  // STAR bullet compiler appending logic
  const handleAddBulletToExperience = (bulletText) => {
    // Appends the compiled bullet point to the first experience item in the list
    if (resumeData.experience.length === 0) {
      triggerToast("Add a Work Experience entry first!");
      return;
    }
    
    // Find first standard job (not break) to append to, or simply first item
    const targetExp = resumeData.experience[0];
    const existingDesc = targetExp.description || '';
    const cleanDesc = existingDesc.trim() 
      ? `${existingDesc}\n${bulletText}` 
      : bulletText;

    const updated = resumeData.experience.map((exp, idx) => {
      if (idx === 0) {
        return { ...exp, description: cleanDesc };
      }
      return exp;
    });

    updateExperience(updated);
    triggerToast("Bullet point appended to newest Work History entry!");
  };

  // JSON Export File Download
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resumeData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    
    const rawName = resumeData.personalInfo.fullName || "Resume";
    const fileName = `${rawName.replace(/\s+/g, "_")}_Backup.json`;
    downloadAnchor.setAttribute("download", fileName);
    
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerToast("JSON Backup file downloaded successfully!");
  };

  // JSON Import File Reader
  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.personalInfo && Array.isArray(imported.experience)) {
          setResumeData(imported);
          triggerToast("Draft completely restored from JSON file!");
        } else {
          alert("Invalid backup format! Missing essential resume properties.");
        }
      } catch (err) {
        alert("Failed to parse JSON file. Ensure the backup file is clean.");
      }
    };
    reader.readAsText(file);
    // Reset file input value
    e.target.value = '';
  };

  // Reset Draft back to prefilled template
  const handleResetToSample = () => {
    if (window.confirm("This will overwrite your current draft with the sample template. Proceed?")) {
      setResumeData(SAMPLE_RESUME_DATA);
      triggerToast("Reset to premium template complete.");
    }
  };

  // Trigger browser A4 vector PDF print saving
  const handlePrintPDF = () => {
    setShowPrintModal(true);
  };

  const confirmPrint = () => {
    setShowPrintModal(false);
    triggerToast("Opening PDF Export print window...");
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="app-container">
      {/* 1. LEFT SIDEBAR: DARK EDITOR CONTAINER */}
      <section className="left-workspace no-print">
        {/* Header Branding Row */}
        <header className="workspace-header">
          <h1>
            ResuForge
            <span className="logo-badge">Pro</span>
          </h1>
          <div className="action-buttons">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => fileInputRef.current.click()}
              title="Import local JSON file"
            >
              <Upload size={14} />
              Import
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept=".json"
              onChange={handleImportJSON}
            />
            
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={handleExportJSON}
              title="Export local JSON backup"
            >
              <Download size={14} />
              Export
            </button>
            
            <button 
              type="button" 
              className="btn-primary" 
              onClick={handlePrintPDF}
              title="Download ATS-Friendly PDF"
            >
              <FileText size={14} />
              Save PDF
            </button>
          </div>
        </header>

        {/* Tab Selection Row */}
        <nav className="workspace-tabs">
          <button 
            type="button" 
            className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            <FileText size={14} /> Editor
          </button>
          
          <button 
            type="button" 
            className={`tab-btn ${activeTab === 'star' ? 'active' : ''}`}
            onClick={() => setActiveTab('star')}
          >
            <Sparkles size={14} /> STAR Bullet Assistant
          </button>

          <button 
            type="button" 
            className={`tab-btn ${activeTab === 'ats' ? 'active' : ''}`}
            onClick={() => setActiveTab('ats')}
          >
            <ShieldCheck size={14} /> ATS Scanner
          </button>

          <button 
            type="button" 
            className={`tab-btn ${activeTab === 'tweaks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tweaks')}
          >
            <Sliders size={14} /> Page Tweaker
          </button>
        </nav>

        {/* Workspace Dynamic Content Container */}
        <main className="workspace-content">
          {activeTab === 'details' && (
            <Editor 
              resumeData={resumeData}
              updatePersonalInfo={updatePersonalInfo}
              updateSummary={updateSummary}
              updateExperience={updateExperience}
              updateProjects={updateProjects}
              updateEducation={updateEducation}
              updateSkills={updateSkills}
              updateCustomSections={updateCustomSections}
            />
          )}

          {activeTab === 'star' && (
            <STARWizard onAddBullet={handleAddBulletToExperience} />
          )}

          {activeTab === 'ats' && (
            <ATSScanner resumeData={resumeData} updateExperience={updateExperience} />
          )}

          {activeTab === 'tweaks' && (
            <SpacingOptimizer 
              settings={resumeData.layoutSettings}
              onChangeSettings={updateLayoutSettings}
              resumeData={resumeData}
              paperRef={paperRef}
            />
          )}
          
          {/* Quick options panel at bottom */}
          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-normal)' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
              Draft Saved Locally 100% Free
            </span>
            <button 
              type="button" 
              className="btn-secondary" 
              style={{ padding: '0.2rem 0.5rem', fontSize: '0.65rem' }}
              onClick={handleResetToSample}
            >
              <RefreshCw size={10} /> Reset to Sample
            </button>
          </div>
        </main>
      </section>

      {/* 2. RIGHT PANEL: A4 PAPER PREVIEW CONTAINER */}
      <section className="right-preview-container">
        
        {/* Floating Quick Settings Menu (No print) */}
        <div className="preview-floating-bar no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span className="preview-bar-label">Template:</span>
              <select 
                className="preview-bar-select"
                value={resumeData.layoutSettings.template}
                onChange={(e) => updateLayoutSettings('template', e.target.value)}
              >
                <option value="minimal">Minimal Clean (ATS Safe)</option>
                <option value="elegant">Elegant Serif (Academic/Exec)</option>
                <option value="tech">Modern Tech (Sleek Border)</option>
                <option value="bold">Modern Bold (High Contrast)</option>
                <option value="academic">Classic Academic (CV Style)</option>
                <option value="editorial">Warm Editorial (Bookish)</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span className="preview-bar-label">Font:</span>
              <select 
                className="preview-bar-select"
                value={resumeData.layoutSettings.fontClass}
                onChange={(e) => updateLayoutSettings('fontClass', e.target.value)}
              >
                <option value="font-inter">Inter Sans</option>
                <option value="font-outfit">Outfit Geometric</option>
                <option value="font-serif">Georgia / Playfair Serif</option>
                <option value="font-poppins">Poppins Geometric</option>
                <option value="font-lora">Lora Bookish Serif</option>
                <option value="font-garamond">Garamond Classic Serif</option>
                <option value="font-opensans">Open Sans Clean</option>
                <option value="font-mono">JetBrains Mono Tech</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span className="preview-bar-label">Structure:</span>
              <select 
                className="preview-bar-select"
                value={resumeData.activeLayout}
                onChange={(e) => updateActiveLayout(e.target.value)}
              >
                <option value="hybrid">Hybrid (Recommended)</option>
                <option value="chronological">Strict Chronological</option>
                <option value="functional">Functional Skills-First</option>
                <option value="project-focused">Project-Focused Portfolio</option>
                <option value="academic-focused">Academic & CV First</option>
                <option value="skills-focused">Skills-Heavy Stack</option>
              </select>
            </div>
            
            <button 
              type="button" 
              className="btn-primary" 
              style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', background: '#2563eb', boxShadow: 'none' }}
              onClick={handlePrintPDF}
            >
              <Download size={12} />
              Save PDF
            </button>
          </div>
        </div>

        {/* Dynamic A4 Resume sheet */}
        <Previewer 
          resumeData={resumeData}
          paperRef={paperRef}
        />

        {/* Pop-up Toast overlays */}
        {toastMessage && (
          <div className="toast-notification">
            <Check size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Print Guidance Modal */}
        {showPrintModal && (
          <div className="no-print" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(11, 15, 25, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            width: '100vw',
            height: '100vh'
          }}>
            <div className="star-helper-card" style={{
              maxWidth: '480px',
              width: '90%',
              padding: '1.75rem',
              background: '#111827',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
            }}>
              <h3 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', margin: 0 }}>
                🖨️ Recommended PDF Settings
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4, margin: 0 }}>
                To ensure your resume fits on the page flawlessly and maintains its search-friendly text format, please make sure to adjust these settings in your browser's Print window:
              </p>
              <ul style={{ fontSize: '0.78rem', color: '#f8fafc', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: 0 }}>
                <li><strong>Destination</strong>: 💾 Set to <em>Save as PDF</em>.</li>
                <li><strong>Headers & Footers</strong>: 🚫 Disable (removes ugly URL and date stamps).</li>
                <li><strong>Background Graphics</strong>: ✅ Enable (keeps custom colors, borders, and dividers).</li>
                <li><strong>Margins</strong>: 📏 Set to <em>None</em> or <em>Default</em> (adjust to fit on a single page if needed).</li>
              </ul>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  style={{ flex: 1, justifyContent: 'center' }} 
                  onClick={() => setShowPrintModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn-primary" 
                  style={{ flex: 1, justifyContent: 'center', background: '#10b981', borderColor: '#10b981' }} 
                  onClick={confirmPrint}
                >
                  Open Print Dialog
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
