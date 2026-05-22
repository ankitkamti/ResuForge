import React from 'react';

export default function Previewer({ resumeData, paperRef }) {
  const { personalInfo, summary, experience, projects, education, skills, customSections = [], layoutSettings, activeLayout } = resumeData;

  const fontClass = layoutSettings.fontClass || 'font-inter';
  const templateClass = `template-${layoutSettings.template || 'minimal'}`;
  
  // Custom theme variables applied directly to the document
  const paperStyle = {
    '--primary-color': layoutSettings.primaryColor || '#2563eb',
    fontSize: `${layoutSettings.fontSize || 10}px`,
    lineHeight: layoutSettings.lineHeight || 1.4,
    padding: `${layoutSettings.pageMargin || 20}px`,
    fontFamily: fontClass.startsWith('font-') ? `var(--${fontClass})` : 'var(--font-inter)',
  };

  const sectionGapStyle = {
    marginBottom: `${layoutSettings.sectionSpacing || 18}px`
  };

  const itemGapStyle = {
    marginBottom: `${(layoutSettings.sectionSpacing || 18) * 0.55}px`
  };

  // Render the contact header
  const renderHeader = () => {
    const { fullName, title, email, phone, location, website, linkedin, github } = personalInfo;
    const metaItems = [
      email && `Email: ${email}`,
      phone && `Phone: ${phone}`,
      location && `Location: ${location}`,
      website && `Web: ${website}`,
      linkedin && `LinkedIn: ${linkedin}`,
      github && `GitHub: ${github}`
    ].filter(Boolean);

    return (
      <header className="header-section" style={{ marginBottom: `${layoutSettings.sectionSpacing || 18}px` }}>
        {fullName && <h1 className="header-name">{fullName}</h1>}
        {title && <h2 className="header-title">{title}</h2>}
        {metaItems.length > 0 && (
          <div className="header-meta">
            {metaItems.map((item, idx) => (
              <span key={idx}>
                {idx > 0 && layoutSettings.template !== 'tech' && ' • '}
                {item}
              </span>
            ))}
          </div>
        )}
      </header>
    );
  };

  // Render the professional summary
  const renderSummary = () => {
    if (!summary?.trim()) return null;
    return (
      <section style={sectionGapStyle}>
        <h3 className="section-heading">Professional Summary</h3>
        <div className="section-divider" style={{ borderColor: layoutSettings.primaryColor }} />
        <p style={{ fontSize: '100%', color: '#374151', textAlign: 'justify', lineHeight: 'inherit' }}>
          {summary}
        </p>
      </section>
    );
  };

  // Render experience & career breaks
  const renderExperience = () => {
    if (!experience || experience.length === 0) return null;
    return (
      <section style={sectionGapStyle}>
        <h3 className="section-heading">Work History</h3>
        <div className="section-divider" style={{ borderColor: layoutSettings.primaryColor }} />
        <div>
          {experience.map((exp, idx) => {
            const isBreak = exp.isCareerBreak;
            return (
              <div 
                key={exp.id} 
                className="experience-item" 
                style={idx === experience.length - 1 ? {} : itemGapStyle}
              >
                <div className="item-title-row">
                  <span>
                    {isBreak ? (
                      <strong style={{ color: '#d97706' }}>
                        [Career Break] {exp.company || 'Professional Development'}
                      </strong>
                    ) : (
                      <strong>{exp.company}</strong>
                    )}
                    {exp.role && !isBreak && ` — ${exp.role}`}
                  </span>
                  <span>{exp.dates}</span>
                </div>
                
                {isBreak && exp.breakReason && (
                  <div className="item-subtitle-row" style={{ color: '#d97706', fontWeight: 600 }}>
                    Focus: {exp.breakReason}
                  </div>
                )}
                
                {exp.description && (
                  <div style={{ marginTop: '2px' }}>
                    {isBreak ? (
                      <p style={{ fontSize: '95%', color: '#4b5563', fontStyle: 'italic', lineHeight: 'inherit' }}>
                        {exp.description}
                      </p>
                    ) : (
                      <ul className="item-bullets">
                        {exp.description.split('\n').filter(b => b.trim()).map((bullet, bIdx) => (
                          <li key={bIdx}>{bullet.replace(/^[•\-\*\s]+/, '')}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  // Render projects
  const renderProjects = () => {
    if (!projects || projects.length === 0) return null;
    return (
      <section style={sectionGapStyle}>
        <h3 className="section-heading">Key Projects</h3>
        <div className="section-divider" style={{ borderColor: layoutSettings.primaryColor }} />
        <div>
          {projects.map((proj, idx) => (
            <div 
              key={proj.id} 
              className="experience-item" 
              style={idx === projects.length - 1 ? {} : itemGapStyle}
            >
              <div className="item-title-row">
                <span>
                  <strong>{proj.title}</strong>
                  {proj.role && ` — ${proj.role}`}
                </span>
                <span>{proj.dates}</span>
              </div>
              {proj.technologies && (
                <div className="item-subtitle-row" style={{ fontStyle: 'normal', color: 'var(--primary-color)', fontWeight: 500 }}>
                  Technologies: {proj.technologies}
                </div>
              )}
              {proj.description && (
                <ul className="item-bullets">
                  {proj.description.split('\n').filter(b => b.trim()).map((bullet, bIdx) => (
                    <li key={bIdx}>{bullet.replace(/^[•\-\*\s]+/, '')}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Render skills
  const renderSkills = () => {
    const activeSkills = skills.filter(sk => sk.category?.trim() && sk.list?.trim());
    if (activeSkills.length === 0) return null;
    
    return (
      <section style={sectionGapStyle}>
        <h3 className="section-heading">Core Skills</h3>
        <div className="section-divider" style={{ borderColor: layoutSettings.primaryColor }} />
        <div className="skills-grid">
          {activeSkills.map((sk) => (
            <div key={sk.id} className="skills-row">
              <span className="skills-category">{sk.category}:</span>{' '}
              <span className="skills-list">{sk.list}</span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Render education
  const renderEducation = () => {
    if (!education || education.length === 0) return null;
    return (
      <section style={sectionGapStyle}>
        <h3 className="section-heading">Education & Credentials</h3>
        <div className="section-divider" style={{ borderColor: layoutSettings.primaryColor }} />
        <div>
          {education.map((edu, idx) => (
            <div 
              key={edu.id} 
              className="experience-item" 
              style={idx === education.length - 1 ? {} : itemGapStyle}
            >
              <div className="item-title-row">
                <span><strong>{edu.degree}</strong></span>
                <span>{edu.dates}</span>
              </div>
              <div className="item-subtitle-row" style={{ fontStyle: 'normal', fontWeight: 500 }}>
                {edu.school}
              </div>
              {edu.description && (
                <p style={{ fontSize: '95%', color: '#4b5563', marginTop: '2px', lineHeight: 'inherit' }}>
                  {edu.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Render custom sections
  const renderCustomSections = () => {
    if (!customSections || customSections.length === 0) return null;
    return customSections.map((cust, cIdx) => {
      if (!cust.title?.trim() || !cust.description?.trim()) return null;
      return (
        <section key={cust.id || cIdx} style={sectionGapStyle}>
          <h3 className="section-heading">{cust.title}</h3>
          <div className="section-divider" style={{ borderColor: layoutSettings.primaryColor }} />
          <div>
            <ul className="item-bullets">
              {cust.description.split('\n').filter(b => b.trim()).map((bullet, bIdx) => (
                <li key={bIdx}>{bullet.replace(/^[•\-\*\s]+/, '')}</li>
              ))}
            </ul>
          </div>
        </section>
      );
    });
  };


  // Maps section ordering dynamically based on activeLayout configuration
  // Chronological: Summary, Experience, Projects, Skills, Education
  // Functional: Summary, Skills, Projects, Experience, Education
  // Hybrid: Summary, Experience (integrating breaks), Projects, Skills, Education
  const renderSections = () => {
    const layoutOrder = {
      chronological: ['summary', 'experience', 'projects', 'skills', 'education', 'custom'],
      functional: ['summary', 'skills', 'projects', 'experience', 'education', 'custom'],
      hybrid: ['summary', 'experience', 'projects', 'skills', 'education', 'custom'],
      'project-focused': ['summary', 'projects', 'experience', 'skills', 'education', 'custom'],
      'academic-focused': ['summary', 'education', 'custom', 'experience', 'projects', 'skills'],
      'skills-focused': ['summary', 'skills', 'education', 'projects', 'experience', 'custom']
    };

    const order = layoutOrder[activeLayout] || layoutOrder.hybrid;

    return order.map(sectionName => {
      let content = null;
      switch (sectionName) {
        case 'summary': content = renderSummary(); break;
        case 'experience': content = renderExperience(); break;
        case 'projects': content = renderProjects(); break;
        case 'skills': content = renderSkills(); break;
        case 'education': content = renderEducation(); break;
        case 'custom': content = renderCustomSections(); break;
        default: break;
      }
      if (!content) return null;
      return <React.Fragment key={sectionName}>{content}</React.Fragment>;
    });
  };

  return (
    <article 
      ref={paperRef}
      className={`resume-paper ${templateClass}`} 
      style={paperStyle}
    >
      {/* Dynamic Visual Page Limits Guide Rails (Hidden in Print Mode) */}
      <div className="page-limit-line no-print" style={{ top: '1123px' }} />
      <span className="page-limit-label no-print" style={{ top: '1123px' }}>Page 1 Limit</span>
      
      <div className="page-limit-line no-print" style={{ top: '2246px' }} />
      <span className="page-limit-label no-print" style={{ top: '2246px' }}>Page 2 Limit</span>

      {renderHeader()}
      {renderSections()}
    </article>
  );
}
