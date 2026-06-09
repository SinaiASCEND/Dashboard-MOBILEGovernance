// planned-agenda.js — Forward-looking agendas for the EEC and its subcommittees.
//
// Source: RPS-MASTER_Agenda_Tracker_2026_05_18.xlsx
//   • "EEC Agenda" tab           → window.PLANNED_AGENDA.EEC  (keyed by ISO meeting date)
//   • "Subcommittee Agendas" tab → window.PLANNED_AGENDA.SUB  (keyed by committee, then date)
//
// Consumed by both dashboards via window.PLANNED_AGENDA.itemsFor(committee, dateISO),
// which returns the planned agenda items for a given meeting. The desktop app folds
// these into scheduled meetings automatically; the mobile app does the same.
//
// Item shape:
//   { title, category?, owner?, presenter?, presenterConfirmed?, guests?, ready?,
//     subitems?: [..], goesToEEC?: "YYYY-MM-DD" }
//
// To refresh: re-export the tracker and regenerate this file. Dates must be ISO
// (YYYY-MM-DD) and must match the meeting dates in mobile-schedules.js for the
// items to attach to a meeting row.

(function () {
  const EEC = {
  "2026-06-05": [
    {
      "title": "Minutes Approval",
      "category": "Voting",
      "owner": "EEC",
      "presenter": "Michelle Francis, MD (EEC Co-Chair)",
      "presenterConfirmed": "YES"
    },
    {
      "title": "Module Review — THINQ (Class of 2028)",
      "category": "Voting",
      "owner": "CIS",
      "presenter": "Ravi Ramaswamy, MD (CIS Admin Co-Chair)",
      "presenterConfirmed": "YES",
      "guests": "Leona Hess, Bess Storch, David Portnoy, Maaike vanGerwen, Aveena Kochar, CIS student Reps",
      "ready": "YES"
    },
    {
      "title": "Year 3 Legacy Clerkship Year (Transitions)",
      "category": "Review",
      "owner": "CCS",
      "presenter": "Teddy Holzer, MD (CCS Admin Co-Chair)",
      "presenterConfirmed": "YES",
      "guests": "CCS Student Reps",
      "ready": "YES"
    },
    {
      "title": "ASCEND Curriculum Review Process",
      "category": "Informational",
      "owner": "AES",
      "presenter": "Jacob Shreffler, PhD (AES Admin Co-Chair)",
      "presenterConfirmed": "YES",
      "ready": "YES"
    }
  ],
  "2026-06-26": [
    {
      "title": "Minutes Approval",
      "category": "Voting",
      "owner": "EEC",
      "presenter": "Michelle Francis, MD (EEC Co-Chair)",
      "presenterConfirmed": "YES"
    },
    {
      "title": "Class of 2028 Semester 3 Review",
      "subitems": [
        "(Endocrinology, Gastroenterology, GUSRH, MSK, Renal)"
      ],
      "category": "Voting",
      "owner": "PCCS",
      "presenter": "Staci Leisman, MD (PCCS Admin Co-Chair)"
    },
    {
      "title": "Class of 2029 Semester 1 Review",
      "subitems": [
        "(Foundations: MCG, Anatomy, FIM, Pathology)"
      ],
      "category": "Voting",
      "owner": "PCCS",
      "presenter": "Staci Leisman, MD (PCCS Admin Co-Chair)"
    },
    {
      "title": "Outcomes of NBME Examinations Performance and Resident Review Survey Results - Criteria for Success",
      "category": "Review with Vote",
      "owner": "AES",
      "presenter": "Jacob Shreffler, PhD (AES Admin Co-Chair)",
      "presenterConfirmed": "YES"
    }
  ],
  "2026-07-10": [
    {
      "title": "Minutes Approval",
      "category": "Voting",
      "owner": "EEC",
      "presenter": "Michelle Francis, MD (EEC Co-Chair)",
      "presenterConfirmed": "YES"
    },
    {
      "title": "Phase 1 Module Learning Objectives",
      "category": "Voting",
      "owner": "EEC",
      "presenter": "Staci Leisman, MD (PCCS Admin Co-Chair)",
      "guests": "None"
    },
    {
      "title": "Review of MD Program Policies - HIGH PRIORITY",
      "subitems": [
        "Advancement/Progression Policy",
        "Academic Remediation Policy",
        "Grading Policy",
        "Grade Appeal Policy",
        "Technical Standards Policy",
        "Attendance Policy",
        "LOA Policy",
        "Characteristics of Accepted Applicants",
        "Student Work Hours",
        "Pre-med requirements",
        "Timeliness of Grades Policy",
        "MM/C Feedback Policy",
        "Narrative Assessment Policy",
        "Student Eval Completion Policy",
        "COI in Student Assessment",
        "Elective Requirements"
      ],
      "category": "Voting",
      "owner": "Other",
      "presenter": "Other",
      "guests": "Kris Alpi, Val Parkas, Jackie Chudow"
    }
  ],
  "2026-08-07": [
    {
      "title": "Minutes Approval",
      "category": "Voting",
      "owner": "EEC",
      "presenter": "Michelle Francis, MD (EEC Co-Chair)",
      "presenterConfirmed": "YES"
    },
    {
      "title": "AY 2025-26 Year-End Governance Closeout Report",
      "category": "Review with Vote",
      "owner": "PCCS",
      "presenter": "Staci Leisman, MD (PCCS Admin Co-Chair)",
      "guests": "Staci Leisman"
    },
    {
      "title": "Clinical Skills Review: Class of 2028 (POM 1, POM 2, and POM 3)",
      "category": "Voting",
      "owner": "CCS",
      "presenter": "Chris Strother (Chair, CCWG)",
      "guests": "Horatio Holzer, MD (CCS Admin Co-Chair), Mike Herscher"
    }
  ],
  "2026-09-04": [
    {
      "title": "Minutes Approval",
      "category": "Voting",
      "owner": "EEC",
      "presenter": "Michelle Francis, MD (EEC Co-Chair)",
      "presenterConfirmed": "YES"
    },
    {
      "title": "PEAKS 1 Review",
      "category": "Voting",
      "owner": "AES",
      "presenter": "Jacob Shreffler, PhD (AES Admin Co-Chair)"
    },
    {
      "title": "Review of MD Program Policies - MEDIUM PRIORITY",
      "subitems": [
        "Clinical Supervision Policy",
        "RCE Policy",
        "Mistreatment Policy",
        "Residents as Teachers Policy",
        "FERPA",
        "Student Promotions Committee"
      ],
      "category": "Voting",
      "owner": "Other",
      "presenter": "Other"
    },
    {
      "title": "Class of 2029 Semester 2 Review",
      "subitems": [
        "(Neuroscience, Behavioral Science, Hematology, Cardiology, Pulmonary)"
      ],
      "category": "Voting",
      "owner": "PCCS",
      "presenter": "Staci Leisman, MD (PCCS Admin Co-Chair)",
      "guests": "Staci Leisman"
    }
  ],
  "2026-10-02": [
    {
      "title": "Minutes Approval",
      "category": "Voting",
      "owner": "EEC",
      "presenter": "Michelle Francis, MD (EEC Co-Chair)",
      "presenterConfirmed": "YES"
    },
    {
      "title": "AES Mid-Cycle Assessment Outcomes Report",
      "owner": "AES",
      "presenter": "Jacob Shreffler, PhD (AES Admin Co-Chair)",
      "guests": "Jacob Shreffler"
    },
    {
      "title": "Areas of Concentration (AOC) Presentation #1",
      "owner": "EEC",
      "presenter": "AOC Director (TBD)"
    },
    {
      "title": "Class of 2029 Sem 1 Module Reviews — [remaining, if any]",
      "owner": "PCCS",
      "presenter": "Staci Leisman, MD (PCCS Admin Co-Chair)"
    }
  ],
  "2026-11-06": [
    {
      "title": "THINQ Integration Update",
      "owner": "CIS",
      "presenter": "Ravi Ramaswamy, MD (CIS Admin Co-Chair)"
    },
    {
      "title": "Step 1 Results & Subject Area Performance",
      "owner": "AES",
      "presenter": "Jacob Shreffler, PhD (AES Admin Co-Chair)"
    },
    {
      "title": "Match Data Class of 2026 + Program Directors Survey",
      "owner": "AES",
      "presenter": "Jacob Shreffler, PhD (AES Admin Co-Chair)"
    },
    {
      "title": "Areas of Concentration (AOC) Presentation #2",
      "owner": "EEC",
      "presenter": "AOC Director (TBD)"
    }
  ],
  "2026-12-04": [
    {
      "title": "Mid-Year Curricular Review",
      "owner": "EEC",
      "presenter": "Rainier Soriano, MD"
    },
    {
      "title": "AES — Assessment Policy Updates",
      "owner": "AES",
      "presenter": "Jacob Shreffler, PhD (AES Admin Co-Chair)"
    },
    {
      "title": "Areas of Concentration (AOC) Presentation #3",
      "owner": "EEC",
      "presenter": "AOC Director (TBD)"
    },
    {
      "title": "Class of 2029 POM 2 Module Review",
      "owner": "CCS",
      "presenter": "Horatio Holzer, MD (CCS Admin Co-Chair)"
    }
  ],
  "2027-01-08": [
    {
      "title": "Electives Summary — Class of 2026 + New Electives + Grading",
      "owner": "CCS",
      "presenter": "Horatio Holzer, MD (CCS Admin Co-Chair)"
    }
  ],
  "2027-02-05": [
    {
      "title": "Phase 1 Remediation Outcomes Report",
      "owner": "AES",
      "presenter": "Jacob Shreffler, PhD (AES Admin Co-Chair)"
    },
    {
      "title": "Areas of Concentration (AOC) Presentation #4",
      "owner": "EEC",
      "presenter": "AOC Director (TBD)"
    }
  ],
  "2027-03-05": [
    {
      "title": "Class of 2029 Sem 3 — Phase 1 Module Review Bundle",
      "owner": "AES",
      "presenter": "Jacob Shreffler, PhD (AES) + Rainier Soriano, MD (Admin)"
    },
    {
      "title": "Class of 2029 Sem 3 — POM 3 Module Review",
      "owner": "AES",
      "presenter": "Jacob Shreffler, PhD (AES) + Rainier Soriano, MD (Admin)"
    },
    {
      "title": "LCME DCI Preparation Update",
      "owner": "EEC",
      "presenter": "Rainier Soriano, MD"
    },
    {
      "title": "Phase 1 → Phase 2 Transition Report",
      "owner": "CIS",
      "presenter": "Ravi Ramaswamy, MD (CIS Admin Co-Chair)"
    }
  ],
  "2027-04-02": [
    {
      "title": "Class of 2030 Sem 1 — Phase 1 Module Review Bundle",
      "owner": "AES",
      "presenter": "Jacob Shreffler, PhD (AES) + Rainier Soriano, MD (Admin)"
    },
    {
      "title": "Combined ASCEND Phase 1 Review — Class of 2028 + Class of 2029"
    },
    {
      "title": "Class of 2030 Sem 1 — POM 1 Module Review",
      "owner": "AES",
      "presenter": "Jacob Shreffler, PhD (AES) + Rainier Soriano, MD (Admin)"
    },
    {
      "title": "Match Outcomes Report — Class of 2027 (Legacy Y4)",
      "owner": "AES",
      "presenter": "Steve Paik, MD",
      "guests": "Steve Paik"
    },
    {
      "title": "Medical Student Research Day Recap",
      "owner": "EEC",
      "presenter": "MSRO"
    }
  ],
  "2027-05-07": [
    {
      "title": "AES — Year-End Assessment Outcomes Report",
      "owner": "AES",
      "presenter": "Jacob Shreffler, PhD (AES Admin Co-Chair)"
    },
    {
      "title": "PEAKS II Outcomes Report",
      "owner": "AES",
      "presenter": "Jacob Shreffler, PhD (AES Admin Co-Chair)"
    },
    {
      "title": "AY 27-28 Policy Package [PLACEHOLDER — specific policies TBD]",
      "owner": "EEC",
      "presenter": "Rainier Soriano, MD"
    }
  ],
  "2027-06-04": [
    {
      "title": "Combined ASCEND Phase 2/3 Review — Class of 2028 + Class of 2029",
      "owner": "AES",
      "presenter": "Jacob Shreffler, PhD (AES) + Rainier Soriano, MD (Admin)"
    },
    {
      "title": "AY 2026-27 Year-End Closeout & AY 27-28 Planning",
      "owner": "EEC",
      "presenter": "Rainier Soriano, MD"
    },
    {
      "title": "AY 27-28 Policy Package — Final Approval (if needed)",
      "owner": "EEC",
      "presenter": "Rainier Soriano, MD"
    },
    {
      "title": "Heads-Up: Class of 2028 Full Curriculum Review (AY 27-28)",
      "owner": "EEC",
      "presenter": "Jacob Shreffler, PhD (AES) + Rainier Soriano, MD (Admin)"
    }
  ]
};

  const SUB = {
  "PCCS": {
    "2026-06-11": [
      {
        "title": "MSK (Class of 2028 Sem 3)",
        "presenter": "Module Directors",
        "goesToEEC": "2026-06-26"
      },
      {
        "title": "FIM (Class of 2029 Sem 1)",
        "presenter": "Module Directors"
      },
      {
        "title": "Pathology (Class of 2029 Sem 1)",
        "presenter": "Module Director"
      }
    ],
    "2026-07-09": [
      {
        "title": "Neuro (Class of 2029 Sem 2) — Module Directors",
        "presenter": "Module Directors",
        "goesToEEC": "2026-08-07"
      },
      {
        "title": "BS (Class of 2029 Sem 2) — Module Director",
        "presenter": "Module Director"
      },
      {
        "title": "Heme (Class of 2029 Sem 2) — Module Director",
        "presenter": "Module Director"
      }
    ],
    "2026-08-13": [
      {
        "title": "Cardiology (Class of 2029 Sem 2)",
        "presenter": "Module Directors",
        "goesToEEC": "2026-09-04"
      },
      {
        "title": "Pulmonary (Class of 2029 Sem 2)",
        "presenter": "Module Directors"
      },
      {
        "title": "Clinical Supervision Policy",
        "subitems": [
          "RCE Policy",
          "Mistreatment Policy",
          "Residents as Teachers Policy",
          "FERPA",
          "Student Promotions Committee"
        ]
      }
    ],
    "2027-02-11": [
      {
        "title": "Class of 2029 Sem 3 — Phase 1 Module Review Bundle (AES)",
        "goesToEEC": "2027-03-05"
      }
    ],
    "2027-03-11": [
      {
        "title": "Combined ASCEND Phase 1 Review — C/o 2028 + C/o 2029 (AES)",
        "goesToEEC": "2027-04-02"
      }
    ],
    "2027-04-08": [
      {
        "title": "Class of 2030 Sem 1 — Phase 1 Module Review Bundle (AES)",
        "goesToEEC": "2027-05-07"
      }
    ]
  },
  "CCS": {
    "2026-08-11": [
      {
        "title": "POM 2 (Class of 2028 Sem 2 — Leftover) — Module Director",
        "goesToEEC": "2026-09-04"
      },
      {
        "title": "Clinical Supervision Policy",
        "subitems": [
          "RCE Policy",
          "Mistreatment Policy",
          "Residents as Teachers Policy",
          "FERPA",
          "Student Promotions Committee"
        ]
      }
    ],
    "2026-11-10": [
      {
        "title": "Class of 2029 POM 2 — Module Director",
        "goesToEEC": "2026-12-04"
      }
    ],
    "2026-12-08": [
      {
        "title": "Electives Summary — Class of 2026 + New Electives + Grading (Holzer)",
        "goesToEEC": "2027-01-08"
      }
    ],
    "2027-02-02": [
      {
        "title": "Class of 2029 Sem 3 — POM 3 Module Review (AES)",
        "goesToEEC": "2027-02-05"
      }
    ],
    "2027-03-16": [
      {
        "title": "Class of 2030 Sem 1 — POM 1 Module Review (AES)",
        "goesToEEC": "2027-04-02"
      }
    ],
    "2027-05-18": [
      {
        "title": "Combined ASCEND Phase 2/3 Review — C/o 2028 + C/o 2029 (AES)",
        "goesToEEC": "2027-06-04"
      }
    ]
  },
  "CIS": {
    "2026-10-15": [
      {
        "title": "THINQ Integration Update (Ramaswamy)",
        "goesToEEC": "2026-11-06"
      }
    ],
    "2027-02-11": [
      {
        "title": "Phase 1 → Phase 2 Transition Report (Ramaswamy)",
        "goesToEEC": "2027-03-05"
      }
    ]
  },
  "AES": {
    "2026-09-15": [
      {
        "title": "AES Mid-Cycle Assessment Outcomes Report",
        "goesToEEC": "2026-10-02"
      }
    ],
    "2026-10-20": [
      {
        "title": "Step 1 Results & Subject Area Performance",
        "goesToEEC": "2026-11-06"
      },
      {
        "title": "Match Data Class of 2026 + Program Directors Survey"
      }
    ],
    "2026-11-17": [
      {
        "title": "Assessment Policy Updates",
        "goesToEEC": "2026-12-04"
      }
    ],
    "2026-12-15": [
      {
        "title": "Phase 1 Remediation Outcomes Report (advance)",
        "goesToEEC": "2027-02-05"
      },
      {
        "title": "Match Outcomes Report — Class of 2027 (Legacy Y4)",
        "goesToEEC": "2027-04-02"
      },
      {
        "title": "Year-End Assessment Outcomes Report",
        "goesToEEC": "2027-05-07"
      },
      {
        "title": "PEAKS II Outcomes Report"
      }
    ]
  }
};

  function itemsFor(committee, date) {
    if (!committee || !date) return [];
    if (committee === "EEC") return EEC[date] || [];
    const c = SUB[committee];
    return (c && c[date]) || [];
  }

  // Every committee+date that has at least one planned item (useful for badges).
  function plannedDates(committee) {
    if (committee === "EEC") return Object.keys(EEC);
    const c = SUB[committee];
    return c ? Object.keys(c) : [];
  }

  window.PLANNED_AGENDA = {
    EEC, SUB, itemsFor, plannedDates,
    source: "RPS-MASTER_Agenda_Tracker_2026_05_18.xlsx",
    academicYear: "AY 2026-27",
  };
})();
