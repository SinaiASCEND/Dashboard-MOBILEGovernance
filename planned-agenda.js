// planned-agenda.js — Scheduled (planned) agenda items for upcoming governance meetings.
//
// Source: MASTER Agenda Tracker (sheet "EEC Agenda" + sheet "Subcommittee Agendas"),
// dated 2026-05-18. Generated, do not hand-edit; re-run gen_planned.py to refresh.
//
// Shape:
//   window.PLANNED_AGENDA.byCommittee[committee][YYYY-MM-DD] = [ {n, title, category,
//     owner, presenter, confirmed, guests, ready, goesToEEC, planned}, ... ]
// EEC items carry category/owner/presenter/guests/ready; subcommittee items carry
// presenter + goesToEEC (the EEC meeting this item feeds up to).

(function () {
  const DATA = {
  "generated": "2026-05-18",
  "source": "MASTER Agenda Tracker (EEC Agenda + Subcommittee Agendas tabs)",
  "byCommittee": {
    "EEC": {
      "2026-06-05": [
        {
          "n": 1,
          "title": "Minutes Approval",
          "category": "Voting",
          "owner": "EEC",
          "presenter": "Michelle Francis, MD (EEC Co-Chair)",
          "confirmed": "YES",
          "guests": "N/A",
          "ready": "",
          "planned": true
        },
        {
          "n": 2,
          "title": "Module Review — THINQ (Class of 2028)",
          "category": "Voting",
          "owner": "CIS",
          "presenter": "Ravi Ramaswamy, MD (CIS Admin Co-Chair)",
          "confirmed": "YES",
          "guests": "Leona Hess, Bess Storch, David Portnoy, Maaike vanGerwen, Aveena Kochar, CIS student Reps",
          "ready": "YES",
          "planned": true
        },
        {
          "n": 3,
          "title": "Year 3 Legacy Clerkship Year (Transitions)",
          "category": "Review",
          "owner": "CCS",
          "presenter": "Teddy Holzer, MD (CCS Admin Co-Chair)",
          "confirmed": "YES",
          "guests": "CCS Student Reps",
          "ready": "YES",
          "planned": true
        },
        {
          "n": 4,
          "title": "ASCEND Curriculum Review Process",
          "category": "Informational",
          "owner": "AES",
          "presenter": "Jacob Shreffler, PhD (AES Admin Co-Chair)",
          "confirmed": "YES",
          "guests": null,
          "ready": "YES",
          "planned": true
        }
      ],
      "2026-06-26": [
        {
          "n": 1,
          "title": "Minutes Approval",
          "category": "Voting",
          "owner": "EEC",
          "presenter": "Michelle Francis, MD (EEC Co-Chair)",
          "confirmed": "YES",
          "guests": null,
          "ready": "",
          "planned": true
        },
        {
          "n": 2,
          "title": "Class of 2028 Semester 3 Review",
          "category": "Voting",
          "owner": "PCCS",
          "presenter": "Staci Leisman, MD (PCCS Admin Co-Chair)",
          "confirmed": null,
          "guests": null,
          "ready": "",
          "planned": true,
          "subitems": [
            "(Endocrinology, Gastroenterology, GUSRH, MSK, Renal)"
          ]
        },
        {
          "n": 3,
          "title": "Class of 2029 Semester 1 Review",
          "category": "Voting",
          "owner": "PCCS",
          "presenter": "Staci Leisman, MD (PCCS Admin Co-Chair)",
          "confirmed": null,
          "guests": null,
          "ready": "",
          "planned": true,
          "subitems": [
            "(Foundations: MCG, Anatomy, FIM, Pathology)"
          ]
        },
        {
          "n": 4,
          "title": "Outcomes of NBME Examinations Performance and Resident Review Survey Results - Criteria for Sucess",
          "category": "Review with Vote",
          "owner": "AES",
          "presenter": "Jacob Shreffler, PhD (AES Admin Co-Chair)",
          "confirmed": "YES",
          "guests": null,
          "ready": "",
          "planned": true
        }
      ],
      "2026-07-10": [
        {
          "n": 1,
          "title": "Minutes Approval",
          "category": "Voting",
          "owner": "EEC",
          "presenter": "Michelle Francis, MD (EEC Co-Chair)",
          "confirmed": "YES",
          "guests": "N/A",
          "ready": "",
          "planned": true
        },
        {
          "n": 2,
          "title": "Phase 1 Module Learning Objectives",
          "category": "Voting",
          "owner": "EEC",
          "presenter": "Staci Leisman, MD (PCCS Admin Co-Chair)",
          "confirmed": null,
          "guests": "None",
          "ready": "",
          "planned": true
        },
        {
          "n": 3,
          "title": "Review of MD Program Policies - HIGH PRIORITY",
          "category": "Voting",
          "owner": "Other",
          "presenter": "Other",
          "confirmed": null,
          "guests": "Kris Alpi, Val Parkas, Jackie Chudow",
          "ready": "",
          "planned": true,
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
          ]
        }
      ],
      "2026-08-07": [
        {
          "n": 1,
          "title": "Minutes Approval",
          "category": "Voting",
          "owner": "EEC",
          "presenter": "Michelle Francis, MD (EEC Co-Chair)",
          "confirmed": "YES",
          "guests": null,
          "ready": "",
          "planned": true
        },
        {
          "n": 2,
          "title": "AY 2025-26 Year-End Governance Closeout Report",
          "category": "Review with Vote",
          "owner": "PCCS",
          "presenter": "Staci Leisman, MD (PCCS Admin Co-Chair)",
          "confirmed": null,
          "guests": "Staci Leisman",
          "ready": "",
          "planned": true
        },
        {
          "n": 3,
          "title": "Clinical Skills Review: Class of 2028 (POM 1, POM 2, and POM 3)",
          "category": "Voting",
          "owner": "CCS",
          "presenter": "Chris Strother (Chair, CCWG)",
          "confirmed": null,
          "guests": "Horatio Holzer, MD (CCS Admin Co-Chair), Mike Herscher",
          "ready": "",
          "planned": true
        }
      ],
      "2026-09-04": [
        {
          "n": 1,
          "title": "Minutes Approval",
          "category": "Voting",
          "owner": "EEC",
          "presenter": "Michelle Francis, MD (EEC Co-Chair)",
          "confirmed": "YES",
          "guests": null,
          "ready": "",
          "planned": true
        },
        {
          "n": 2,
          "title": "PEAKS 1 Review",
          "category": "Voting",
          "owner": "AES",
          "presenter": "Jacob Shreffler, PhD (AES Admin Co-Chair)",
          "confirmed": null,
          "guests": null,
          "ready": "",
          "planned": true
        },
        {
          "n": 3,
          "title": "Review of MD Program Policies - MEDIUM PRIORITY",
          "category": "Voting",
          "owner": "Other",
          "presenter": "Other",
          "confirmed": null,
          "guests": null,
          "ready": "",
          "planned": true,
          "subitems": [
            "Clinical Supervision Policy",
            "RCE Policy",
            "Mistreatment Policy",
            "Residents as Teachers Policy",
            "FERPA",
            "Student Promotions Committee"
          ]
        },
        {
          "n": 4,
          "title": "Class of 2029 Semester 2 Review",
          "category": "Voting",
          "owner": "PCCS",
          "presenter": "Staci Leisman, MD (PCCS Admin Co-Chair)",
          "confirmed": null,
          "guests": "Staci Leisman",
          "ready": "",
          "planned": true,
          "subitems": [
            "(Neuroscience, Behavioral Science, Hematology, Cardiology, Pulmonary)"
          ]
        }
      ],
      "2026-10-02": [
        {
          "n": 1,
          "title": "Minutes Approval",
          "category": "Voting",
          "owner": "EEC",
          "presenter": "Michelle Francis, MD (EEC Co-Chair)",
          "confirmed": "YES",
          "guests": null,
          "ready": "",
          "planned": true
        },
        {
          "n": 2,
          "title": "AES Mid-Cycle Assessment Outcomes Report",
          "category": null,
          "owner": "AES",
          "presenter": "Jacob Shreffler, PhD (AES Admin Co-Chair)",
          "confirmed": null,
          "guests": "Jacob Shreffler",
          "ready": "",
          "planned": true
        },
        {
          "n": 3,
          "title": "Areas of Concentration (AOC) Presentation #1",
          "category": null,
          "owner": "EEC",
          "presenter": "AOC Director (TBD)",
          "confirmed": null,
          "guests": null,
          "ready": "",
          "planned": true
        },
        {
          "n": 4,
          "title": "Class of 2029 Sem 1 Module Reviews — [remaining, if any]",
          "category": null,
          "owner": "PCCS",
          "presenter": "Staci Leisman, MD (PCCS Admin Co-Chair)",
          "confirmed": null,
          "guests": null,
          "ready": "",
          "planned": true
        }
      ],
      "2026-11-06": [
        {
          "n": 1,
          "title": "THINQ Integration Update",
          "category": null,
          "owner": "CIS",
          "presenter": "Ravi Ramaswamy, MD (CIS Admin Co-Chair)",
          "confirmed": null,
          "guests": null,
          "ready": "",
          "planned": true
        },
        {
          "n": 2,
          "title": "Step 1 Results & Subject Area Performance",
          "category": null,
          "owner": "AES",
          "presenter": "Jacob Shreffler, PhD (AES Admin Co-Chair)",
          "confirmed": null,
          "guests": null,
          "ready": "",
          "planned": true
        },
        {
          "n": 3,
          "title": "Match Data Class of 2026 + Program Directors Survey",
          "category": null,
          "owner": "AES",
          "presenter": "Jacob Shreffler, PhD (AES Admin Co-Chair)",
          "confirmed": null,
          "guests": null,
          "ready": "",
          "planned": true
        },
        {
          "n": 4,
          "title": "Areas of Concentration (AOC) Presentation #2",
          "category": null,
          "owner": "EEC",
          "presenter": "AOC Director (TBD)",
          "confirmed": null,
          "guests": null,
          "ready": "",
          "planned": true
        }
      ],
      "2026-12-04": [
        {
          "n": 1,
          "title": "Mid-Year Curricular Review",
          "category": null,
          "owner": "EEC",
          "presenter": "Rainier Soriano, MD",
          "confirmed": null,
          "guests": null,
          "ready": "",
          "planned": true
        },
        {
          "n": 2,
          "title": "AES — Assessment Policy Updates",
          "category": null,
          "owner": "AES",
          "presenter": "Jacob Shreffler, PhD (AES Admin Co-Chair)",
          "confirmed": null,
          "guests": null,
          "ready": "",
          "planned": true
        },
        {
          "n": 3,
          "title": "Areas of Concentration (AOC) Presentation #3",
          "category": null,
          "owner": "EEC",
          "presenter": "AOC Director (TBD)",
          "confirmed": null,
          "guests": null,
          "ready": "",
          "planned": true
        },
        {
          "n": 4,
          "title": "Class of 2029 POM 2 Module Review",
          "category": null,
          "owner": "CCS",
          "presenter": "Horatio Holzer, MD (CCS Admin Co-Chair)",
          "confirmed": null,
          "guests": null,
          "ready": "",
          "planned": true
        }
      ],
      "2027-01-08": [
        {
          "n": 1,
          "title": "Electives Summary — Class of 2026 + New Electives + Grading",
          "category": null,
          "owner": "CCS",
          "presenter": "Horatio Holzer, MD (CCS Admin Co-Chair)",
          "confirmed": null,
          "guests": null,
          "ready": "",
          "planned": true
        }
      ],
      "2027-02-05": [
        {
          "n": 1,
          "title": "Phase 1 Remediation Outcomes Report",
          "category": null,
          "owner": "AES",
          "presenter": "Jacob Shreffler, PhD (AES Admin Co-Chair)",
          "confirmed": null,
          "guests": null,
          "ready": "",
          "planned": true
        },
        {
          "n": 2,
          "title": "Areas of Concentration (AOC) Presentation #4",
          "category": null,
          "owner": "EEC",
          "presenter": "AOC Director (TBD)",
          "confirmed": null,
          "guests": null,
          "ready": "",
          "planned": true
        }
      ],
      "2027-03-05": [
        {
          "n": 1,
          "title": "Class of 2029 Sem 3 — Phase 1 Module Review Bundle",
          "category": null,
          "owner": "AES",
          "presenter": "Jacob Shreffler, PhD (AES) + Rainier Soriano, MD (Admin)",
          "confirmed": null,
          "guests": null,
          "ready": "",
          "planned": true
        },
        {
          "n": 2,
          "title": "Class of 2029 Sem 3 — POM 3 Module Review",
          "category": null,
          "owner": "AES",
          "presenter": "Jacob Shreffler, PhD (AES) + Rainier Soriano, MD (Admin)",
          "confirmed": null,
          "guests": null,
          "ready": "",
          "planned": true
        },
        {
          "n": 3,
          "title": "LCME DCI Preparation Update",
          "category": null,
          "owner": "EEC",
          "presenter": "Rainier Soriano, MD",
          "confirmed": null,
          "guests": null,
          "ready": "",
          "planned": true
        },
        {
          "n": 4,
          "title": "Phase 1 → Phase 2 Transition Report",
          "category": null,
          "owner": "CIS",
          "presenter": "Ravi Ramaswamy, MD (CIS Admin Co-Chair)",
          "confirmed": null,
          "guests": null,
          "ready": "",
          "planned": true
        }
      ],
      "2027-04-02": [
        {
          "n": 1,
          "title": "Class of 2030 Sem 1 — Phase 1 Module Review Bundle",
          "category": null,
          "owner": "AES",
          "presenter": "Jacob Shreffler, PhD (AES) + Rainier Soriano, MD (Admin)",
          "confirmed": null,
          "guests": null,
          "ready": "",
          "planned": true
        },
        {
          "n": 2,
          "title": "Combined ASCEND Phase 1 Review — Class of 2028 + Class of 2029",
          "category": null,
          "owner": null,
          "presenter": null,
          "confirmed": null,
          "guests": null,
          "ready": "",
          "planned": true
        },
        {
          "n": 3,
          "title": "Class of 2030 Sem 1 — POM 1 Module Review",
          "category": null,
          "owner": "AES",
          "presenter": "Jacob Shreffler, PhD (AES) + Rainier Soriano, MD (Admin)",
          "confirmed": null,
          "guests": null,
          "ready": "",
          "planned": true
        },
        {
          "n": 4,
          "title": "Match Outcomes Report — Class of 2027 (Legacy Y4)",
          "category": null,
          "owner": "AES",
          "presenter": "Steve Paik, MD",
          "confirmed": null,
          "guests": "Steve Paik",
          "ready": "",
          "planned": true
        },
        {
          "n": 5,
          "title": "Medical Student Research Day Recap",
          "category": null,
          "owner": "EEC",
          "presenter": "MSRO",
          "confirmed": null,
          "guests": null,
          "ready": "",
          "planned": true
        }
      ],
      "2027-05-07": [
        {
          "n": 1,
          "title": "AES — Year-End Assessment Outcomes Report",
          "category": null,
          "owner": "AES",
          "presenter": "Jacob Shreffler, PhD (AES Admin Co-Chair)",
          "confirmed": null,
          "guests": null,
          "ready": "",
          "planned": true
        },
        {
          "n": 2,
          "title": "PEAKS II Outcomes Report",
          "category": null,
          "owner": "AES",
          "presenter": "Jacob Shreffler, PhD (AES Admin Co-Chair)",
          "confirmed": null,
          "guests": null,
          "ready": "",
          "planned": true
        },
        {
          "n": 3,
          "title": "AY 27-28 Policy Package [PLACEHOLDER — specific policies TBD]",
          "category": null,
          "owner": "EEC",
          "presenter": "Rainier Soriano, MD",
          "confirmed": null,
          "guests": null,
          "ready": "",
          "planned": true
        }
      ],
      "2027-06-04": [
        {
          "n": 1,
          "title": "Combined ASCEND Phase 2/3 Review — Class of 2028 + Class of 2029",
          "category": null,
          "owner": "AES",
          "presenter": "Jacob Shreffler, PhD (AES) + Rainier Soriano, MD (Admin)",
          "confirmed": null,
          "guests": null,
          "ready": "",
          "planned": true
        },
        {
          "n": 2,
          "title": "AY 2026-27 Year-End Closeout & AY 27-28 Planning",
          "category": null,
          "owner": "EEC",
          "presenter": "Rainier Soriano, MD",
          "confirmed": null,
          "guests": null,
          "ready": "",
          "planned": true
        },
        {
          "n": 3,
          "title": "AY 27-28 Policy Package — Final Approval (if needed)",
          "category": null,
          "owner": "EEC",
          "presenter": "Rainier Soriano, MD",
          "confirmed": null,
          "guests": null,
          "ready": "",
          "planned": true
        },
        {
          "n": 4,
          "title": "Heads-Up: Class of 2028 Full Curriculum Review (AY 27-28)",
          "category": null,
          "owner": "EEC",
          "presenter": "Jacob Shreffler, PhD (AES) + Rainier Soriano, MD (Admin)",
          "confirmed": null,
          "guests": null,
          "ready": "",
          "planned": true
        }
      ]
    },
    "PCCS": {
      "2026-06-11": [
        {
          "n": 1,
          "title": "MSK (Class of 2028 Sem 3)",
          "presenter": "Module Directors",
          "goesToEEC": "2026-06-26",
          "planned": true
        },
        {
          "n": 2,
          "title": "FIM (Class of 2029 Sem 1)",
          "presenter": "Module Directors",
          "goesToEEC": null,
          "planned": true
        },
        {
          "n": 3,
          "title": "Pathology (Class of 2029 Sem 1)",
          "presenter": "Module Director",
          "goesToEEC": null,
          "planned": true
        }
      ],
      "2026-07-09": [
        {
          "n": 1,
          "title": "Neuro (Class of 2029 Sem 2) — Module Directors",
          "presenter": "Module Directors",
          "goesToEEC": "2026-08-07",
          "planned": true
        },
        {
          "n": 2,
          "title": "BS (Class of 2029 Sem 2) — Module Director",
          "presenter": "Module Director",
          "goesToEEC": null,
          "planned": true
        },
        {
          "n": 3,
          "title": "Heme (Class of 2029 Sem 2) — Module Director",
          "presenter": "Module Director",
          "goesToEEC": null,
          "planned": true
        }
      ],
      "2026-08-13": [
        {
          "n": 1,
          "title": "Cardiology (Class of 2029 Sem 2)",
          "presenter": "Module Directors",
          "goesToEEC": "2026-09-04",
          "planned": true
        },
        {
          "n": 2,
          "title": "Pulmonary (Class of 2029 Sem 2)",
          "presenter": "Module Directors",
          "goesToEEC": null,
          "planned": true
        },
        {
          "n": 3,
          "title": "Clinical Supervision Policy",
          "presenter": "???",
          "goesToEEC": null,
          "planned": true,
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
          "n": 1,
          "title": "Class of 2029 Sem 3 — Phase 1 Module Review Bundle (AES)",
          "presenter": null,
          "goesToEEC": "2027-03-05",
          "planned": true
        }
      ],
      "2027-03-11": [
        {
          "n": 1,
          "title": "Combined ASCEND Phase 1 Review — C/o 2028 + C/o 2029 (AES)",
          "presenter": null,
          "goesToEEC": "2027-04-02",
          "planned": true
        }
      ],
      "2027-04-08": [
        {
          "n": 1,
          "title": "Class of 2030 Sem 1 — Phase 1 Module Review Bundle (AES)",
          "presenter": null,
          "goesToEEC": "2027-05-07",
          "planned": true
        }
      ]
    },
    "CCS": {
      "2026-08-11": [
        {
          "n": 1,
          "title": "POM 2 (Class of 2028 Sem 2 — Leftover) — Module Director",
          "presenter": null,
          "goesToEEC": "2026-09-04",
          "planned": true
        },
        {
          "n": 2,
          "title": "Clinical Supervision Policy",
          "presenter": null,
          "goesToEEC": null,
          "planned": true,
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
          "n": 1,
          "title": "Class of 2029 POM 2 — Module Director",
          "presenter": null,
          "goesToEEC": "2026-12-04",
          "planned": true
        }
      ],
      "2026-12-08": [
        {
          "n": 1,
          "title": "Electives Summary — Class of 2026 + New Electives + Grading (Holzer)",
          "presenter": null,
          "goesToEEC": "2027-01-08",
          "planned": true
        }
      ],
      "2027-02-02": [
        {
          "n": 1,
          "title": "Class of 2029 Sem 3 — POM 3 Module Review (AES)",
          "presenter": null,
          "goesToEEC": "2027-02-05",
          "planned": true
        }
      ],
      "2027-03-16": [
        {
          "n": 1,
          "title": "Class of 2030 Sem 1 — POM 1 Module Review (AES)",
          "presenter": null,
          "goesToEEC": "2027-04-02",
          "planned": true
        }
      ],
      "2027-05-18": [
        {
          "n": 1,
          "title": "Combined ASCEND Phase 2/3 Review — C/o 2028 + C/o 2029 (AES)",
          "presenter": null,
          "goesToEEC": "2027-06-04",
          "planned": true
        }
      ]
    },
    "CIS": {
      "2026-10-15": [
        {
          "n": 1,
          "title": "THINQ Integration Update (Ramaswamy)",
          "presenter": null,
          "goesToEEC": "2026-11-06",
          "planned": true
        }
      ],
      "2027-02-11": [
        {
          "n": 1,
          "title": "Phase 1 → Phase 2 Transition Report (Ramaswamy)",
          "presenter": null,
          "goesToEEC": "2027-03-05",
          "planned": true
        }
      ]
    },
    "AES": {
      "2026-09-15": [
        {
          "n": 1,
          "title": "AES Mid-Cycle Assessment Outcomes Report",
          "presenter": null,
          "goesToEEC": "2026-10-02",
          "planned": true
        }
      ],
      "2026-10-20": [
        {
          "n": 1,
          "title": "Step 1 Results & Subject Area Performance",
          "presenter": null,
          "goesToEEC": "2026-11-06",
          "planned": true
        },
        {
          "n": 2,
          "title": "Match Data Class of 2026 + Program Directors Survey",
          "presenter": null,
          "goesToEEC": null,
          "planned": true
        }
      ],
      "2026-11-17": [
        {
          "n": 1,
          "title": "Assessment Policy Updates",
          "presenter": null,
          "goesToEEC": "2026-12-04",
          "planned": true
        }
      ],
      "2026-12-15": [
        {
          "n": 1,
          "title": "Phase 1 Remediation Outcomes Report (advance)",
          "presenter": null,
          "goesToEEC": "2027-02-05",
          "planned": true
        },
        {
          "n": 2,
          "title": "Match Outcomes Report — Class of 2027 (Legacy Y4)",
          "presenter": null,
          "goesToEEC": "2027-04-02",
          "planned": true
        },
        {
          "n": 3,
          "title": "Year-End Assessment Outcomes Report",
          "presenter": null,
          "goesToEEC": "2027-05-07",
          "planned": true
        },
        {
          "n": 4,
          "title": "PEAKS II Outcomes Report",
          "presenter": null,
          "goesToEEC": null,
          "planned": true
        }
      ]
    }
  }
};

  window.PLANNED_AGENDA = Object.assign({}, DATA, {
    // Planned agenda items for a given committee + date (""[]"" if none).
    itemsFor(committee, date) {
      const c = (this.byCommittee || {})[committee];
      if (!c) return [];
      return c[date] || [];
    },
    // True if this committee+date has any planned agenda on file.
    has(committee, date) {
      return this.itemsFor(committee, date).length > 0;
    },
  });
})();
