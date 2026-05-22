// Pre-filled high-quality sample resume data for a Senior Software Engineer

export const SAMPLE_RESUME_DATA = {
  personalInfo: {
    fullName: "Alex Mercer",
    title: "Senior Software Engineer",
    email: "alex.mercer@devmail.com",
    phone: "+1 (555) 382-7492",
    location: "San Francisco, CA",
    website: "alexmercer.dev",
    linkedin: "linkedin.com/in/alexmercer",
    github: "github.com/alexmercer"
  },
  summary: "Innovative and results-driven Senior Software Engineer with 7+ years of experience architecting high-performance web applications and distributed systems. Expert in modern React systems, Node.js, and cloud scale infrastructure. Proven track record of optimizing engineering delivery velocity, leading agile teams, and utilizing career sabbaticals to acquire advanced training in distributed system scaling.",
  experience: [
    {
      id: "exp-1",
      company: "Vortex Systems",
      role: "Tech Lead & Senior Developer",
      dates: "Jan 2023 - Present",
      description: "Architected a next-generation real-time analytics dashboard, improving interactive page performance by 42% using memoization and virtual lists.\nOrchestrated the migration of high-traffic node services to AWS serverless architecture, reducing cloud server overhead costs by 35%.\nMentored 6 junior and mid-level developers, establishing peer review guidelines that decreased production regressions by 18%."
    },
    {
      id: "exp-2",
      company: "Professional Upskilling Sabbatical",
      role: "Distributed Systems & Cloud Study",
      dates: "Jul 2022 - Dec 2022",
      description: "Dedicated time to full-time advanced studies in distributed databases and reliability engineering. Designed and built two open-source system-monitoring tools, obtaining deep knowledge of WebAssembly performance optimization.",
      isCareerBreak: true,
      breakReason: "Structured Upskilling Sabbatical"
    },
    {
      id: "exp-3",
      company: "AeroWeb Corporation",
      role: "Software Engineer II",
      dates: "Oct 2019 - Jun 2022",
      description: "Engineered real-time telemetry websocket connections, serving 15,000+ active connections simultaneously with zero packet loss.\nStreamlined product CI/CD deployment pipelines using GitHub Actions, reducing developer deploy times from 22 minutes to 5 minutes.\nStandardized modular style token definitions, accelerating front-end team feature delivery by 25%."
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "DevMetrics (Open Source Dashboard)",
      role: "Lead Architect",
      technologies: "React, TypeScript, Go, Docker",
      dates: "2022",
      description: "Created an open-source system analytics manager processing 10k metrics/sec. Earned 1,200+ stars on GitHub and was integrated by 40+ engineering organizations."
    },
    {
      id: "proj-2",
      title: "FinFlow Ledger",
      role: "Full Stack Engineer",
      technologies: "Next.js, Node.js, PostgreSQL, CSS Variables",
      dates: "2021",
      description: "Developed a premium, double-entry financial bookkeeping app featuring custom interactive data visuals and automated transaction category filters."
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.S. in Computer Science (Honors)",
      school: "University of California, Berkeley",
      dates: "2015 - 2019",
      description: "Specialized in Software Engineering and Database Architectures. GPA: 3.82/4.00."
    }
  ],
  skills: [
    { id: "sk-1", category: "Languages", list: "JavaScript (ES6+), TypeScript, Go, Python, SQL, HTML5/CSS3" },
    { id: "sk-2", category: "Libraries & Frameworks", list: "React, Next.js, Node.js, Express, Redux Toolkit, WebSockets" },
    { id: "sk-3", category: "Tools & Infrastructure", list: "AWS (S3, Lambda, EC2), Docker, Git, GitHub Actions, Linux, Serverless" }
  ],
  customSections: [
    {
      id: "cust-1",
      title: "Certifications & Credentials",
      description: "AWS Certified Solutions Architect – Associate (2024)\nCertified Kubernetes Administrator (CKA) – CNCF (2023)"
    }
  ],
  layoutSettings: {
    fontSize: 10,
    lineHeight: 1.4,
    sectionSpacing: 18,
    pageMargin: 20,
    primaryColor: "#2563eb", // Elegant Royal Blue
    fontClass: "font-inter",
    template: "minimal" // minimal, elegant, tech
  },
  activeLayout: "hybrid" // chronological, functional, hybrid
};
