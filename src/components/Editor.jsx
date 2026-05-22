import React, { useState } from 'react';
import { 
  User, Briefcase, GraduationCap, FolderGit, Cpu, 
  Trash2, ArrowUp, ArrowDown, Plus, Coffee, Sparkles 
} from 'lucide-react';
import { CAREER_BREAK_TEMPLATES } from '../data/verbs';

export default function Editor({ 
  resumeData, 
  updatePersonalInfo, 
  updateSummary, 
  updateExperience, 
  updateProjects, 
  updateEducation, 
  updateSkills,
  updateCustomSections
}) {
  const { personalInfo, summary, experience, projects, education, skills, customSections = [] } = resumeData;
  const [expandedSection, setExpandedSection] = useState('personal');

  const toggleSection = (sec) => {
    setExpandedSection(expandedSection === sec ? null : sec);
  };

  // EXPERIENCE MANAGERS
  const handleAddExperience = (isBreak = false) => {
    const newItem = {
      id: `exp-${Date.now()}`,
      company: isBreak ? "Upskilling Sabbatical" : "",
      role: isBreak ? "Professional Development" : "",
      dates: "",
      description: isBreak ? "Dedicated time to full-time technical upskilling and distributed architectures..." : "",
      isCareerBreak: isBreak,
      breakReason: isBreak ? "Structured Upskilling Sabbatical" : ""
    };
    updateExperience([...experience, newItem]);
  };

  const handleEditExperience = (id, field, val) => {
    const updated = experience.map(exp => {
      if (exp.id === id) {
        return { ...exp, [field]: val };
      }
      return exp;
    });
    updateExperience(updated);
  };

  const handleCareerBreakTemplate = (id, type) => {
    const tmpl = CAREER_BREAK_TEMPLATES.find(t => t.type === type);
    if (!tmpl) return;
    
    const updated = experience.map(exp => {
      if (exp.id === id) {
        return {
          ...exp,
          company: "Professional Development & Study",
          role: tmpl.reason,
          breakReason: tmpl.reason,
          description: tmpl.description
        };
      }
      return exp;
    });
    updateExperience(updated);
  };

  const handleMoveExperience = (idx, dir) => {
    if (dir === 'up' && idx === 0) return;
    if (dir === 'down' && idx === experience.length - 1) return;
    
    const updated = [...experience];
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    updateExperience(updated);
  };

  const handleDeleteExperience = (id) => {
    updateExperience(experience.filter(exp => exp.id !== id));
  };

  // PROJECTS MANAGERS
  const handleAddProject = () => {
    const newItem = {
      id: `proj-${Date.now()}`,
      title: "",
      role: "",
      technologies: "",
      dates: "",
      description: ""
    };
    updateProjects([...projects, newItem]);
  };

  const handleEditProject = (id, field, val) => {
    const updated = projects.map(proj => {
      if (proj.id === id) return { ...proj, [field]: val };
      return proj;
    });
    updateProjects(updated);
  };

  const handleMoveProject = (idx, dir) => {
    if (dir === 'up' && idx === 0) return;
    if (dir === 'down' && idx === projects.length - 1) return;
    
    const updated = [...projects];
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    updateProjects(updated);
  };

  const handleDeleteProject = (id) => {
    updateProjects(projects.filter(proj => proj.id !== id));
  };

  // EDUCATION MANAGERS
  const handleAddEducation = () => {
    const newItem = {
      id: `edu-${Date.now()}`,
      degree: "",
      school: "",
      dates: "",
      description: ""
    };
    updateEducation([...education, newItem]);
  };

  const handleEditEducation = (id, field, val) => {
    const updated = education.map(edu => {
      if (edu.id === id) return { ...edu, [field]: val };
      return edu;
    });
    updateEducation(updated);
  };

  const handleMoveEducation = (idx, dir) => {
    if (dir === 'up' && idx === 0) return;
    if (dir === 'down' && idx === education.length - 1) return;
    
    const updated = [...education];
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    updateEducation(updated);
  };

  const handleDeleteEducation = (id) => {
    updateEducation(education.filter(edu => edu.id !== id));
  };

  // SKILLS MANAGERS
  const handleAddSkill = () => {
    const newItem = {
      id: `sk-${Date.now()}`,
      category: "",
      list: ""
    };
    updateSkills([...skills, newItem]);
  };

  const handleEditSkill = (id, field, val) => {
    const updated = skills.map(sk => {
      if (sk.id === id) return { ...sk, [field]: val };
      return sk;
    });
    updateSkills(updated);
  };

  const handleDeleteSkill = (id) => {
    updateSkills(skills.filter(sk => sk.id !== id));
  };

  // CUSTOM SECTIONS MANAGERS
  const handleAddCustom = () => {
    const newItem = {
      id: `cust-${Date.now()}`,
      title: "",
      description: ""
    };
    updateCustomSections([...customSections, newItem]);
  };

  const handleEditCustom = (id, field, val) => {
    const updated = customSections.map(cust => {
      if (cust.id === id) return { ...cust, [field]: val };
      return cust;
    });
    updateCustomSections(updated);
  };

  const handleDeleteCustom = (id) => {
    updateCustomSections(customSections.filter(cust => cust.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* 1. PERSONAL DETAILS */}
      <div className="editor-section">
        <div className="section-title" onClick={() => toggleSection('personal')} style={{ cursor: 'pointer' }}>
          <span><User size={16} color="#3b82f6" /> Contact Details</span>
        </div>
        
        {expandedSection === 'personal' && (
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Alex Mercer"
                value={personalInfo.fullName}
                onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Professional Title</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Senior Software Engineer"
                value={personalInfo.title}
                onChange={(e) => updatePersonalInfo('title', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="e.g. alex@email.com"
                value={personalInfo.email}
                onChange={(e) => updatePersonalInfo('email', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. +1 (555) 123-4567"
                value={personalInfo.phone}
                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. San Francisco, CA"
                value={personalInfo.location}
                onChange={(e) => updatePersonalInfo('location', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Personal Website</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. alexmercer.dev"
                value={personalInfo.website}
                onChange={(e) => updatePersonalInfo('website', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>LinkedIn Handle</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. linkedin.com/in/alex"
                value={personalInfo.linkedin}
                onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>GitHub Username</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. github.com/alex"
                value={personalInfo.github}
                onChange={(e) => updatePersonalInfo('github', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. PROFESSIONAL SUMMARY */}
      <div className="editor-section">
        <div className="section-title" onClick={() => toggleSection('summary')} style={{ cursor: 'pointer' }}>
          <span><Sparkles size={16} color="#3b82f6" /> Professional Summary</span>
        </div>
        
        {expandedSection === 'summary' && (
          <div className="form-group">
            <label>Career Overview</label>
            <textarea 
              className="form-input" 
              placeholder="Provide a strong, results-focused summary of your key strengths and achievements..."
              value={summary}
              onChange={(e) => updateSummary(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* 3. WORK EXPERIENCE & CAREER BREAKS */}
      <div className="editor-section">
        <div className="section-title" onClick={() => toggleSection('experience')} style={{ cursor: 'pointer' }}>
          <span><Briefcase size={16} color="#3b82f6" /> Work History & Breaks</span>
        </div>

        {expandedSection === 'experience' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            
            {experience.map((exp, idx) => (
              <div key={exp.id} className="item-card">
                <div className="item-card-header">
                  <div className="item-card-title">
                    {exp.isCareerBreak ? (
                      <span className="career-break-badge">
                        <Coffee size={12} />
                        Break: {exp.breakReason || 'Upskilling'}
                      </span>
                    ) : (
                      exp.company || exp.role ? `${exp.company || 'New Company'} — ${exp.role || 'Role'}` : 'Untitled Experience'
                    )}
                  </div>
                  <div className="item-card-controls">
                    <button type="button" className="icon-btn" onClick={() => handleMoveExperience(idx, 'up')} disabled={idx === 0}>
                      <ArrowUp size={14} />
                    </button>
                    <button type="button" className="icon-btn" onClick={() => handleMoveExperience(idx, 'down')} disabled={idx === experience.length - 1}>
                      <ArrowDown size={14} />
                    </button>
                    <button type="button" className="icon-btn danger" onClick={() => handleDeleteExperience(exp.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Form fields */}
                {exp.isCareerBreak ? (
                  // Career break form fields
                  <div className="form-grid">
                    <div className="form-group form-grid-full">
                      <label>Career Break Reason / Category</label>
                      <select 
                        className="form-input" 
                        value={exp.breakReason} 
                        onChange={(e) => handleEditExperience(exp.id, 'breakReason', e.target.value)}
                      >
                        <option value="Structured Upskilling Sabbatical">Structured Upskilling Sabbatical</option>
                        <option value="Family Caregiving & Upskilling">Family Caregiving & Upskilling</option>
                        <option value="Self-Directed Sabbatical">Self-Directed Sabbatical</option>
                        <option value="Independent Product Research">Independent Product Research</option>
                        <option value="Dedicated Health Sabbatical">Dedicated Health Sabbatical</option>
                      </select>
                    </div>

                    {/* Preloaded quick templates trigger */}
                    <div className="form-group form-grid-full">
                      <label style={{ color: '#60a5fa', fontSize: '0.65rem' }}>Auto-Fill Positive Wording Template</label>
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
                        {CAREER_BREAK_TEMPLATES.map(t => (
                          <button 
                            key={t.type} 
                            type="button" 
                            className="btn-secondary" 
                            style={{ fontSize: '0.65rem', padding: '0.2rem 0.4rem', borderStyle: 'dashed' }}
                            onClick={() => handleCareerBreakTemplate(exp.id, t.type)}
                          >
                            {t.type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Parent Entity / Label</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. Professional Development" 
                        value={exp.company}
                        onChange={(e) => handleEditExperience(exp.id, 'company', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Active Dates</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. Jul 2022 - Dec 2022" 
                        value={exp.dates}
                        onChange={(e) => handleEditExperience(exp.id, 'dates', e.target.value)}
                      />
                    </div>
                    <div className="form-group form-grid-full">
                      <label>Activities & Professional Accomplishments</label>
                      <textarea 
                        className="form-input" 
                        placeholder="Explain how you used your career break productively (courses, open-source work, entrepreneurship)..." 
                        value={exp.description}
                        onChange={(e) => handleEditExperience(exp.id, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  // Standard Job form fields
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Company / Organization</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. Google" 
                        value={exp.company}
                        onChange={(e) => handleEditExperience(exp.id, 'company', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Job Title / Role</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. Lead Engineer" 
                        value={exp.role}
                        onChange={(e) => handleEditExperience(exp.id, 'role', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Dates Worked</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. Jan 2021 - Present" 
                        value={exp.dates}
                        onChange={(e) => handleEditExperience(exp.id, 'dates', e.target.value)}
                      />
                    </div>
                    <div className="form-group form-grid-full">
                      <label>Role Accomplishments (Separate with line breaks)</label>
                      <textarea 
                        className="form-input" 
                        placeholder="Describe your achievements (Tip: Use the STAR assistant below to compile strong bullet points)..." 
                        value={exp.description}
                        onChange={(e) => handleEditExperience(exp.id, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
              <button 
                type="button" 
                className="btn-add" 
                style={{ flex: 1 }}
                onClick={() => handleAddExperience(false)}
              >
                <Plus size={14} /> Add Standard Job
              </button>
              <button 
                type="button" 
                className="btn-add" 
                style={{ flex: 1, borderColor: 'rgba(245, 158, 11, 0.3)', color: '#f59e0b', background: 'rgba(245,158,11,0.04)' }}
                onClick={() => handleAddExperience(true)}
              >
                <Coffee size={14} /> Add Career Break
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. PROJECTS */}
      <div className="editor-section">
        <div className="section-title" onClick={() => toggleSection('projects')} style={{ cursor: 'pointer' }}>
          <span><FolderGit size={16} color="#3b82f6" /> Projects & Portfolio</span>
        </div>

        {expandedSection === 'projects' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {projects.map((proj, idx) => (
              <div key={proj.id} className="item-card">
                <div className="item-card-header">
                  <div className="item-card-title">{proj.title || 'New Project'}</div>
                  <div className="item-card-controls">
                    <button type="button" className="icon-btn" onClick={() => handleMoveProject(idx, 'up')} disabled={idx === 0}>
                      <ArrowUp size={14} />
                    </button>
                    <button type="button" className="icon-btn" onClick={() => handleMoveProject(idx, 'down')} disabled={idx === projects.length - 1}>
                      <ArrowDown size={14} />
                    </button>
                    <button type="button" className="icon-btn danger" onClick={() => handleDeleteProject(proj.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Project Title</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. DevMetrics Dashboard"
                      value={proj.title}
                      onChange={(e) => handleEditProject(proj.id, 'title', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Project Role</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Lead Architect"
                      value={proj.role}
                      onChange={(e) => handleEditProject(proj.id, 'role', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Technologies Used</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. React, Node.js, Docker"
                      value={proj.technologies}
                      onChange={(e) => handleEditProject(proj.id, 'technologies', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Dates</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. 2022"
                      value={proj.dates}
                      onChange={(e) => handleEditProject(proj.id, 'dates', e.target.value)}
                    />
                  </div>
                  <div className="form-group form-grid-full">
                    <label>Description & Achievements</label>
                    <textarea 
                      className="form-input" 
                      placeholder="Briefly describe what you built and the impact it generated..."
                      value={proj.description}
                      onChange={(e) => handleEditProject(proj.id, 'description', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button type="button" className="btn-add" onClick={handleAddProject}>
              <Plus size={14} /> Add Project
            </button>
          </div>
        )}
      </div>

      {/* 5. EDUCATION */}
      <div className="editor-section">
        <div className="section-title" onClick={() => toggleSection('education')} style={{ cursor: 'pointer' }}>
          <span><GraduationCap size={16} color="#3b82f6" /> Education & Certs</span>
        </div>

        {expandedSection === 'education' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {education.map((edu, idx) => (
              <div key={edu.id} className="item-card">
                <div className="item-card-header">
                  <div className="item-card-title">{edu.degree || edu.school || 'New Education'}</div>
                  <div className="item-card-controls">
                    <button type="button" className="icon-btn" onClick={() => handleMoveEducation(idx, 'up')} disabled={idx === 0}>
                      <ArrowUp size={14} />
                    </button>
                    <button type="button" className="icon-btn" onClick={() => handleMoveEducation(idx, 'down')} disabled={idx === education.length - 1}>
                      <ArrowDown size={14} />
                    </button>
                    <button type="button" className="icon-btn danger" onClick={() => handleDeleteEducation(edu.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Degree / Certificate</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. B.S. in Computer Science"
                      value={edu.degree}
                      onChange={(e) => handleEditEducation(edu.id, 'degree', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>School / Institution</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. UC Berkeley"
                      value={edu.school}
                      onChange={(e) => handleEditEducation(edu.id, 'school', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Dates Attended</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. 2015 - 2019"
                      value={edu.dates}
                      onChange={(e) => handleEditEducation(edu.id, 'dates', e.target.value)}
                    />
                  </div>
                  <div className="form-group form-grid-full">
                    <label>Details / Honors / GPA</label>
                    <textarea 
                      className="form-input" 
                      placeholder="e.g. GPA 3.8/4.0. Specialization in database systems."
                      value={edu.description}
                      onChange={(e) => handleEditEducation(edu.id, 'description', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button type="button" className="btn-add" onClick={handleAddEducation}>
              <Plus size={14} /> Add Education
            </button>
          </div>
        )}
      </div>

      {/* 6. SKILLS */}
      <div className="editor-section">
        <div className="section-title" onClick={() => toggleSection('skills')} style={{ cursor: 'pointer' }}>
          <span><Cpu size={16} color="#3b82f6" /> Skills</span>
        </div>

        {expandedSection === 'skills' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {skills.map((sk) => (
              <div key={sk.id} className="item-card" style={{ gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'absolute', right: '0.5rem', top: '0.5rem' }}>
                  <button type="button" className="icon-btn danger" onClick={() => handleDeleteSkill(sk.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="form-group" style={{ marginRight: '1.5rem' }}>
                  <label>Skill Category</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Languages / Libraries"
                    value={sk.category}
                    onChange={(e) => handleEditSkill(sk.id, 'category', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Skills List (comma-separated)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. JavaScript, Go, Python, SQL"
                    value={sk.list}
                    onChange={(e) => handleEditSkill(sk.id, 'list', e.target.value)}
                  />
                </div>
              </div>
            ))}

            <button type="button" className="btn-add" onClick={handleAddSkill}>
              <Plus size={14} /> Add Skill Group
            </button>
          </div>
        )}
      </div>

      {/* 7. CUSTOM SECTIONS */}
      <div className="editor-section">
        <div className="section-title" onClick={() => toggleSection('custom')} style={{ cursor: 'pointer' }}>
          <span><Sparkles size={16} color="#3b82f6" /> Custom Sections (Certs / Awards)</span>
        </div>

        {expandedSection === 'custom' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {customSections.map((cust) => (
              <div key={cust.id} className="item-card" style={{ gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'absolute', right: '0.5rem', top: '0.5rem' }}>
                  <button type="button" className="icon-btn danger" onClick={() => handleDeleteCustom(cust.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="form-group" style={{ marginRight: '1.5rem' }}>
                  <label>Section Heading</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Certifications / Volunteering"
                    value={cust.title}
                    onChange={(e) => handleEditCustom(cust.id, 'title', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Section Content (Separate bullet points with line breaks)</label>
                  <textarea 
                    className="form-input" 
                    placeholder="e.g. Certified AWS Cloud Practitioner 2025&#10;Google Analytics Specialist Cert..."
                    value={cust.description}
                    onChange={(e) => handleEditCustom(cust.id, 'description', e.target.value)}
                  />
                </div>
              </div>
            ))}

            <button type="button" className="btn-add" onClick={handleAddCustom}>
              <Plus size={14} /> Add Custom Section
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
