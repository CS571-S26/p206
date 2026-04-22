export const studySets = [
  // =========================
  // FULL PRACTICE TESTS
  // =========================
  ...Array.from({ length: 24 }, (_, i) => ({
    id: `practice-test-${i + 1}`,
    title: `Security+ Practice Test ${i + 1}`,
    type: "quiz",
    source: "examcompass"
  })),

  // =========================
  // ACRONYM QUIZZES
  // =========================
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `acronyms-${i + 1}`,
    title: `Security+ Acronyms Quiz ${i + 1}`,
    type: "quiz",
    source: "examcompass"
  })),

  // =========================
  // TOPIC-BASED QUIZZES
  // =========================
  {
    id: "security-controls-1",
    title: "Security Controls",
    type: "quiz",
    source: "examcompass"
  },
  {
    id: "encryption",
    title: "Encryption",
    type: "quiz",
    source: "examcompass"
  },
  {
    id: "hashing",
    title: "Hashing",
    type: "quiz",
    source: "examcompass"
  },
  {
    id: "digital-signatures",
    title: "Digital Signatures",
    type: "quiz",
    source: "examcompass"
  },
  {
    id: "digital-certificates",
    title: "Digital Certificates",
    type: "quiz",
    source: "examcompass"
  },
  {
    id: "threat-actors",
    title: "Threat Actor Types",
    type: "quiz",
    source: "examcompass"
  },
  {
    id: "threat-vectors",
    title: "Threat Vectors & Attack Surfaces",
    type: "quiz",
    source: "examcompass"
  },
  {
    id: "social-engineering",
    title: "Social Engineering",
    type: "quiz",
    source: "examcompass"
  },
  {
    id: "security-vulnerabilities",
    title: "Security Vulnerabilities",
    type: "quiz",
    source: "examcompass"
  },
  {
    id: "malware-attacks",
    title: "Malware Attacks",
    type: "quiz",
    source: "examcompass"
  },
  {
    id: "network-attacks",
    title: "Network Attacks",
    type: "quiz",
    source: "examcompass"
  },
  {
    id: "application-attacks",
    title: "Application Attacks",
    type: "quiz",
    source: "examcompass"
  },
  {
    id: "indicators-malicious",
    title: "Indicators of Malicious Activity",
    type: "quiz",
    source: "examcompass"
  },
  {
    id: "data-protection",
    title: "Data Protection Concepts",
    type: "quiz",
    source: "examcompass"
  },
  {
    id: "resilience-recovery",
    title: "Resilience & Recovery",
    type: "quiz",
    source: "examcompass"
  },
  {
    id: "wireless-security",
    title: "Wireless Security Settings",
    type: "quiz",
    source: "examcompass"
  },
  {
    id: "application-security",
    title: "Application Security",
    type: "quiz",
    source: "examcompass"
  },
  {
    id: "vulnerability-management",
    title: "Vulnerability Management",
    type: "quiz",
    source: "examcompass"
  },
  {
    id: "secure-protocols",
    title: "Secure Network Protocols",
    type: "quiz",
    source: "examcompass"
  },
  {
    id: "access-controls",
    title: "Access Controls",
    type: "quiz",
    source: "examcompass"
  },
  {
    id: "password-concepts",
    title: "Password Concepts",
    type: "quiz",
    source: "examcompass"
  },
  {
    id: "incident-response",
    title: "Incident Response Activities",
    type: "quiz",
    source: "examcompass"
  },
  {
    id: "risk-management",
    title: "Risk Management Concepts",
    type: "quiz",
    source: "examcompass"
  },
  {
    id: "agreement-types",
    title: "Agreement Types",
    type: "quiz",
    source: "examcompass"
  },
  {
    id: "penetration-testing",
    title: "Penetration Testing",
    type: "quiz",
    source: "examcompass"
  }
];