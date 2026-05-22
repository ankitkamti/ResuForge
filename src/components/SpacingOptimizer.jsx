import React from 'react';
import { Sliders, Palette, Zap, ArrowDown, ArrowUp } from 'lucide-react';

const COLORS = [
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Teal Emerald', hex: '#0d9488' },
  { name: 'Deep Crimson', hex: '#be123c' },
  { name: 'Executive Indigo', hex: '#4f46e5' },
  { name: 'Professional Slate', hex: '#334155' },
  { name: 'Bronze Gold', hex: '#b45309' }
];

export default function SpacingOptimizer({ settings, onChangeSettings, resumeData, paperRef }) {
  const handleSliderChange = (field, val) => {
    onChangeSettings(field, val);
  };

  // The Auto-Fit spacing solver algorithm
  const handleAutoFit = (targetPages = 1) => {
    const { summary, experience, projects, education, skills } = resumeData;

    // 1. Calculate the weight of content on the resume
    let summaryWeight = summary ? summary.length : 0;
    
    let expWeight = experience.reduce((acc, curr) => {
      // Standard experience has company, role, dates, description
      let weight = (curr.company?.length || 0) + (curr.role?.length || 0) + (curr.description?.length || 0);
      if (curr.isCareerBreak) weight += 50; // extra weight for formatting breaks
      return acc + weight;
    }, 0);

    let projWeight = projects.reduce((acc, curr) => {
      return acc + (curr.title?.length || 0) + (curr.technologies?.length || 0) + (curr.description?.length || 0);
    }, 0);

    let eduWeight = education.reduce((acc, curr) => {
      return acc + (curr.degree?.length || 0) + (curr.school?.length || 0) + (curr.description?.length || 0);
    }, 0);

    let skillsWeight = skills.reduce((acc, curr) => {
      return acc + (curr.category?.length || 0) + (curr.list?.length || 0);
    }, 0);

    const totalWeight = summaryWeight + expWeight + projWeight + eduWeight + skillsWeight;

    // 2. Resolve layouts based on weight and target page count
    let optimized = {
      fontSize: 10,
      lineHeight: 1.4,
      sectionSpacing: 18,
      pageMargin: 20
    };

    if (targetPages === 1) {
      if (totalWeight < 1200) {
        // Very light content: blow it up to fill the page
        optimized = {
          fontSize: 11.5,
          lineHeight: 1.5,
          sectionSpacing: 25,
          pageMargin: 26
        };
      } else if (totalWeight >= 1200 && totalWeight < 2300) {
        // Standard content
        optimized = {
          fontSize: 10,
          lineHeight: 1.4,
          sectionSpacing: 18,
          pageMargin: 20
        };
      } else if (totalWeight >= 2300 && totalWeight < 3400) {
        // Heavy content: shrink items slightly
        optimized = {
          fontSize: 9.2,
          lineHeight: 1.3,
          sectionSpacing: 12,
          pageMargin: 15
        };
      } else {
        // Ultra heavy: compress to the maximum possible limits to keep it on 1 page!
        optimized = {
          fontSize: 8.5,
          lineHeight: 1.25,
          sectionSpacing: 8,
          pageMargin: 12
        };
      }
    } else if (targetPages === 2) {
      if (totalWeight < 3000) {
        // Light content for 2 pages: expand
        optimized = {
          fontSize: 11,
          lineHeight: 1.45,
          sectionSpacing: 22,
          pageMargin: 22
        };
      } else if (totalWeight >= 3000 && totalWeight < 5000) {
        // Standard 2 page content
        optimized = {
          fontSize: 10,
          lineHeight: 1.4,
          sectionSpacing: 18,
          pageMargin: 20
        };
      } else {
        // Heavy 2 page content: compress
        optimized = {
          fontSize: 9.0,
          lineHeight: 1.3,
          sectionSpacing: 10,
          pageMargin: 14
        };
      }
    }

    // Apply resolved settings
    Object.keys(optimized).forEach(key => {
      onChangeSettings(key, optimized[key]);
    });

    // If DOM is available, let's do a post-render fine tweak
    setTimeout(() => {
      if (paperRef && paperRef.current) {
        const height = paperRef.current.scrollHeight;
        const targetHeight = targetPages * 1123; // A4 height limit

        // If it still overflows slightly (less than 100px), drop spacing by 1 step
        if (height > targetHeight && (height - targetHeight) < 100) {
          onChangeSettings('sectionSpacing', Math.max(8, optimized.sectionSpacing - 2));
          onChangeSettings('pageMargin', Math.max(12, optimized.pageMargin - 2));
        }
      }
    }, 100);
  };

  return (
    <div className="sliders-grid">
      {/* Brand Color Selector */}
      <div className="slider-group">
        <label style={{ fontSize: '0.68rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Palette size={14} color="#3b82f6" />
          Primary Theme Color
        </label>
        <div className="palette-selectors" style={{ marginTop: '0.25rem' }}>
          {COLORS.map(c => (
            <div 
              key={c.hex} 
              className={`palette-dot ${settings.primaryColor === c.hex ? 'active' : ''}`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
              onClick={() => handleSliderChange('primaryColor', c.hex)}
            />
          ))}
        </div>
      </div>

      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0.5rem 0' }} />

      {/* Manual Layout adjust sliders */}
      <div className="slider-group">
        <div className="slider-header">
          <span>Font Size</span>
          <span className="slider-val">{settings.fontSize}px</span>
        </div>
        <input 
          type="range" 
          className="slider-input" 
          min="8" 
          max="14" 
          step="0.1"
          value={settings.fontSize}
          onChange={(e) => handleSliderChange('fontSize', parseFloat(e.target.value))}
        />
      </div>

      <div className="slider-group">
        <div className="slider-header">
          <span>Line Spacing</span>
          <span className="slider-val">{settings.lineHeight}x</span>
        </div>
        <input 
          type="range" 
          className="slider-input" 
          min="1.1" 
          max="1.8" 
          step="0.05"
          value={settings.lineHeight}
          onChange={(e) => handleSliderChange('lineHeight', parseFloat(e.target.value))}
        />
      </div>

      <div className="slider-group">
        <div className="slider-header">
          <span>Section Spacing</span>
          <span className="slider-val">{settings.sectionSpacing}px</span>
        </div>
        <input 
          type="range" 
          className="slider-input" 
          min="6" 
          max="32" 
          step="1"
          value={settings.sectionSpacing}
          onChange={(e) => handleSliderChange('sectionSpacing', parseInt(e.target.value))}
        />
      </div>

      <div className="slider-group">
        <div className="slider-header">
          <span>Page Padding</span>
          <span className="slider-val">{settings.pageMargin}px</span>
        </div>
        <input 
          type="range" 
          className="slider-input" 
          min="10" 
          max="45" 
          step="1"
          value={settings.pageMargin}
          onChange={(e) => handleSliderChange('pageMargin', parseInt(e.target.value))}
        />
      </div>

      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0.5rem 0' }} />

      {/* Intelligent Auto-fit layout buttons */}
      <div className="slider-group">
        <label style={{ fontSize: '0.68rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.4rem' }}>
          <Zap size={14} color="#f59e0b" />
          Intelligent Page Solver
        </label>
        <p style={{ fontSize: '0.65rem', color: '#64748b', lineHeight: 1.3, marginBottom: '0.5rem' }}>
          Avoid awkward overflowing lines or huge blank holes. Let our algorithm solve the perfect margins and font-scales instantly.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            type="button" 
            className="btn-primary" 
            style={{ flex: 1, padding: '0.5rem', background: '#4f46e5', boxShadow: 'none', justifyContent: 'center', fontSize: '0.72rem' }}
            onClick={() => handleAutoFit(1)}
          >
            <ArrowDown size={12} />
            Fit to 1 Page
          </button>
          <button 
            type="button" 
            className="btn-primary" 
            style={{ flex: 1, padding: '0.5rem', background: '#0d9488', boxShadow: 'none', justifyContent: 'center', fontSize: '0.72rem' }}
            onClick={() => handleAutoFit(2)}
          >
            <ArrowUp size={12} />
            Fit to 2 Pages
          </button>
        </div>
      </div>
    </div>
  );
}
