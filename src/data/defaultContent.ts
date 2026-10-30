import { PortfolioContent } from '../types/portfolio';

export const defaultPortfolioContent: PortfolioContent = {
  metaTitle: 'Mrs. Smita Pawar | Assistant Professor & Researcher | DYPIU Pune',
  hero: {
    pill: {
      badge: 'Certified IUCEE-IIECP Trainer & Best Faculty Awardee',
      expText: '20+ Years Exp'
    },
    greetingPrefix: "I'm",
    fullName: 'Smita Pawar',
    subtitle: 'Assistant Professor – VLSI & Embedded Systems | DYPIU Pune, India',
    primaryCtaText: 'My Research',
    primaryCtaLink: '#research',
    secondaryCtaText: 'Contact Me',
    secondaryCtaLink: '#contact',
    cards: {
      followTitle: 'Follow Me On',
      mentoredCount: '1000+',
      mentoredLabel: 'Mentored Students',
      mentoredSubtext: 'Dedicated student counseling & career advisory in engineering disciplines.',
      domainTitle: 'Domain Specialty',
      domainDescription: 'VLSI Design & Architecture, Wireless Multimedia Sensor Networks',
      quoteText: '“Highly professional educator with 20 years passion for VLSI & research excellence.”',
      quoteAuthor: '— DYPIU Faculty',
      researchFocusTags: ['#VLSI', '#EmbeddedSystems', '#WMSN', '#Patents', '#Counselling'],
      examHeadTitle: 'Examination Head',
      examHeadRole: 'Chief Coordinator'
    }
  },
  images: {
    heroCutout: '/assets/smita_pawar_3d.png',
    aboutProfile: '/assets/smita_pawar_3d.png'
  },
  about: {
    sectionTag: 'Academic Profile',
    titlePrefix: 'Who is',
    highlightedName: 'Smita Pawar',
    titleSuffix: '?',
    bioParagraph1:
      'I am an Assistant Professor with 20 years of rich total experience (19 years dedicated to engineering academics and 1 year in industrial precision engineering), specializing in Electronics & Telecommunication, VLSI Design, and Embedded Architectures.',
    bioParagraph2:
      'I am currently pursuing my PhD in Electrical & Electronics Engineering at Sandip University, Nashik. Beyond the laboratory, I serve as the Chief Examination Coordinator at DYPIU and hold specialized Diplomas in Child & Adolescent Counselling and DMIT Multi-Intelligence, enabling me to guide students both technically and psychologically.',
    badge1: 'Assistant Professor',
    badge2: 'PhD Scholar',
    languages: ['Marathi', 'Hindi', 'English'],
    passions: ['🌿 Gardening', '📚 Reading', '🧠 Mentorship'],
    stats: [
      {
        id: 'about-stat-1',
        digit: '20+',
        label: 'Years Exp',
        subtext: '19 Acad | 1 Ind'
      },
      {
        id: 'about-stat-2',
        digit: '06',
        label: 'Journals',
        subtext: 'Scopus Indexed'
      },
      {
        id: 'about-stat-3',
        digit: '02',
        label: 'Patents & 1 ©',
        subtext: 'Intellectual Property'
      },
      {
        id: 'about-stat-4',
        digit: '25+',
        label: 'Conferences',
        subtext: 'Workshops & FDPs'
      }
    ]
  },
  expertise: {
    sectionTag: 'Pedagogy & Curricular Mastery',
    titlePrefix: 'What I',
    titleHighlight: 'Teach & Research',
    description:
      'Taught First Year, Second Year, and Final Year BE & Tech degree courses in Computer Science and E&TC Engineering across DYPIU and Savitribai Phule Pune University.',
    items: [
      {
        id: 0,
        index: '01.',
        title: 'VLSI & Embedded Systems',
        badge: 'Core Specialization',
        tags: ['Embedded System Design', 'Digital Logic Design', 'VLSI Tools & Techniques', 'FPGA Prototyping'],
        description:
          'Specialized laboratory coaching, HDL simulation, FPGA prototyping, and hardware-software co-design fundamentals. Directing students in micro-controller interfacing and silicon synthesis.'
      },
      {
        id: 1,
        index: '02.',
        title: 'Electronics Engineering',
        badge: 'Core Pedagogy',
        tags: ['Basic Electronics', 'Analog Electronics', 'EDC', 'Solid-State Devices'],
        description:
          'In-depth pedagogy of semiconductor characteristics, transistor biasing, operational amplifiers, and circuit design principles.'
      },
      {
        id: 2,
        index: '03.',
        title: 'Communication & Networks',
        badge: 'Advanced Systems',
        tags: ['Computer Networks', 'Telecomm Switching', 'Wireless Multimedia Sensor Networks (WMSN)'],
        description:
          'Architecting high throughput, QoS-centric MAC protocols for wireless communication and industrial sensor networks.'
      },
      {
        id: 3,
        index: '04.',
        title: 'Electromagnetics & Theory',
        badge: 'Foundation',
        tags: ['Electromagnetics', 'Wave Propagation', 'Transmission Lines'],
        description:
          "Rigorous mathematical grounding in Maxwell's equations, boundary conditions, and high-frequency electromagnetic radiation."
      },
      {
        id: 4,
        index: '05.',
        title: 'Counselling & Mentoring',
        badge: 'Student Wellness',
        tags: ['Adolescent Psychology', 'DMIT Analysis', 'Academic Career Guidance'],
        description:
          'Holistic student wellness support leveraging professional certified diplomas to counsel and unlock young potential.'
      }
    ]
  },
  research: {
    sectionTag: 'Scholarly Impact',
    titlePrefix: 'Research &',
    titleHighlight: 'Publications',
    description:
      'Active research portfolio spanning wireless multimedia communications, VLSI circuits, and intellectual properties.',
    stats: [
      {
        id: 'res-box-1',
        digit: '06',
        label: 'Journals',
        subtext: 'Peer-reviewed & Scopus',
        badge: 'Scopus',
        documentTitle: 'Scopus Indexed & Peer-Reviewed Journal Publications',
        documentDescription: 'Compendium of 6 published peer-reviewed journal papers covering WMSN, latency minimization, and VLSI circuit architectures.'
      },
      {
        id: 'res-box-2',
        digit: '10',
        label: 'Conferences',
        subtext: "National & Int'l",
        badge: 'Global',
        documentTitle: 'National & International Conference Proceedings',
        documentDescription: 'Full catalog of 10 research papers presented at IEEE, Springer, and national engineering conferences.'
      },
      {
        id: 'res-box-3',
        digit: '02',
        label: 'Patents',
        subtext: 'Published IP',
        badge: 'IP India',
        documentTitle: 'Published Intellectual Property & Patents (IP India)',
        documentDescription: 'Official patent publication documentation for low-latency wireless sensor transceivers and VLSI nodes.'
      },
      {
        id: 'res-box-4',
        digit: '01',
        label: 'Copyright',
        subtext: 'Registered Work',
        badge: 'Govt Reg',
        documentTitle: 'Government Registered Copyright Work',
        documentDescription: 'Government of India registered pedagogical and technical outcome framework in embedded systems.'
      }
    ],
    dissertation: {
      badge: "Featured Master's Dissertation",
      tagline: 'WMSN Protocol Architecture',
      indexFocus: 'IEEE / Scopus Focus',
      title: 'A Quality of Service (QoS) Based MAC Protocol for Wireless Multimedia Sensor Networks',
      description:
        'Engineered priority queues and packet scheduling routines to preserve transmission latency standards for mission-critical video, sound, and sensor data packets in wireless network topologies. Evaluated latency reduction under dense simulated sensor deployment traffic.',
      footerNote: 'Hardware-Software Co-design for Energy-Efficient Sensor Transceivers'
    }
  },
  featuredVideo: {
    sectionTag: 'Keynote & Video Lectures',
    titlePrefix: 'Featured Video',
    titleHighlight: 'Presentation',
    description:
      'Keynote presentation and technical lecture on outcome-based engineering education, VLSI design pedagogy, and wireless multimedia sensor networks.',
    youtubeUrl: 'https://www.youtube.com/watch?v=k7i2X4fB5jM',
    videoTitle: 'IUCEE Pedagogy & Advanced VLSI Circuit Systems Masterclass',
    badge: 'Featured Keynote Talk',
    caption:
      'Recorded academic session highlighting priority MAC scheduling algorithms, student mentoring pedagogies, and VLSI circuit prototyping.',
    viewsOrDuration: 'Academic Keynote Session',
    boxSize: 'medium'
  },
  examCoordinator: {
    sectionTag: 'Institutional Leadership',
    titlePrefix: 'Examination',
    titleHighlight: 'Coordinator',
    periodBadge: 'Jan 2022 – Present',
    departmentBadge: 'DYPIU Core Administrative Cell',
    campusAdminText: 'Central Campus Administration',
    roleTitle: 'Chief Institutional Examination Head',
    description:
      'Spearheading comprehensive university exam operations, statutory audit compliance, confidential manuscript management, rigorous evaluation cycles, and university convocation protocols across faculties.',
    pillars: [
      {
        id: 'exam-pillar-1',
        title: 'Paper Confidentiality',
        subtext: 'Manuscript Security',
        icon: 'fa-shield-halved'
      },
      {
        id: 'exam-pillar-2',
        title: 'Convocation Lead',
        subtext: 'Degree Protocols',
        icon: 'fa-graduation-cap'
      },
      {
        id: 'exam-pillar-3',
        title: 'Syllabus Audits',
        subtext: 'Academic Compliance',
        icon: 'fa-list-check'
      },
      {
        id: 'exam-pillar-4',
        title: 'Student Grievances',
        subtext: 'Support & Welfare',
        icon: 'fa-users'
      }
    ]
  },
  education: [
    {
      id: 'edu-1',
      level: 'Doctoral Research',
      degree: 'PhD in Electrical & Electronics Engineering',
      institution: 'Sandip University, Nashik',
      scoreOrStatus: 'Pursuing Research',
      statusType: 'pursuing',
      description: 'Research focus: Advanced Wireless Sensor Network Protocols and Low-Power VLSI Architectures.'
    },
    {
      id: 'edu-2',
      level: 'Postgraduate Degree',
      degree: 'M.E. (VLSI & Embedded Systems)',
      institution: 'MAE, Alandi (D), Pune | Savitribai Phule Pune University',
      scoreOrStatus: 'First Class • CGPA 7.45',
      statusType: 'completed',
      highlight: 'Dissertation: "A QoS based MAC Protocol for Wireless Multimedia Sensor Networks (WMSN)"'
    },
    {
      id: 'edu-3',
      level: 'Undergraduate Degree',
      degree: 'B.E. (Electronics & Telecommunication)',
      institution: 'Sinhagad College of Engineering, Pune',
      scoreOrStatus: 'Higher Second Class • 59%',
      statusType: 'completed',
      highlight: 'Project: "Switch Mode Power Supply (SMPS) with Power Factor Corrector"'
    }
  ],
  experience: [
    {
      id: 'exp-1',
      period: 'Jan 2021 – Present',
      role: 'Assistant Professor & Examination Head',
      institution: 'D. Y. Patil International University (DYPIU)',
      department: 'Akurdi, Pune',
      description:
        'Lecturing advanced VLSI Design, Embedded Computing, Digital Systems, and leading the university Central Examination Section.',
      type: 'academic'
    },
    {
      id: 'exp-2',
      period: '2005 – 2020 (15 Years)',
      role: 'Assistant Professor / Lecturer',
      institution: 'MIT Academy of Engineering (MITAOE)',
      department: 'Alandi (D), Pune',
      description:
        'Delivered 15 consecutive years of accredited pedagogy in E&TC and Electronics Engineering. Awarded Best Faculty Award.',
      type: 'academic'
    },
    {
      id: 'exp-3',
      period: '2003 – 2004',
      role: 'Electronics Trainee Engineer',
      institution: 'TELCO (Tata Motors Ltd.)',
      department: 'Pune',
      description:
        'Hands-on industrial engineering and test operations in automotive electronic harnesses and assembly line instrumentation.',
      type: 'industry'
    }
  ],
  awards: [
    {
      id: 'award-1',
      category: 'International Certification',
      title: 'IUCEE – IIECP Certified Trainer',
      organization: 'Indo-Universal Collaboration for Engineering Education',
      description: 'Recognized international educator credentials by IUCEE for pedagogical innovation.',
      icon: 'fa-trophy'
    },
    {
      id: 'award-2',
      category: 'Excellence in Teaching',
      title: 'Best Faculty Award',
      organization: 'MIT Academy of Engineering (MITAOE), Alandi',
      description: 'Conferred for outstanding teaching excellence and exemplary student result rates.',
      icon: 'fa-medal'
    },
    {
      id: 'award-3',
      category: 'National Technical Jury',
      title: 'Robocon Inspection Committee',
      organization: 'Robocon India',
      description: 'Official Letter of Appreciation for technical safety and audit judging contributions.',
      icon: 'fa-certificate'
    }
  ],
  contact: {
    sectionTag: 'Get In Touch',
    titlePrefix: "Let's",
    titleHighlight: 'Connect',
    description:
      'Open for academic collaboration, research mentorship, guest lectures, curriculum advisory, and student career guidance.',
    email: 'pawarsmita1020@dypiu.ac.in',
    phone: '+91 9764027444',
    location: 'DYPIU Campus, Sector 29, Nigdi Pradhikaran, Akurdi, Pune, MH, India',
    linkedinUrl: 'https://www.linkedin.com',
    consultationFeeText: 'Available for University Curriculum Consultations',
    workingHoursText: 'Monday – Friday: 9:00 AM – 5:30 PM IST'
  }
};
