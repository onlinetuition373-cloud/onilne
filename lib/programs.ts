// Single source for programs, curricula, subjects, and options.
// Used by the public site, both application forms, and the admin panel so labels always match.

export const programs = [
  {
    id: "tutoring",
    name: "School Tutoring",
    short: "Grades 6 to 12, GCSE, IGCSE, O and A Level, Matric and FSc",
    anchor: "tutoring",
  },
  {
    id: "writing",
    name: "Academic Writing Coaching",
    short: "Essays, reports, and research skills for college and university",
    anchor: "writing",
  },
  {
    id: "quran",
    name: "Quran and Islamic Studies",
    short: "Qaida, Nazra, Tajweed, Hifz, and Tafseer with male or female teachers",
    anchor: "quran",
  },
] as const;

export type ProgramId = (typeof programs)[number]["id"];

export const programName = (id: ProgramId) => programs.find((p) => p.id === id)?.name ?? id;

export const curricula = [
  "British: GCSE / IGCSE",
  "British: O Level",
  "British: A Level",
  "American: Middle and High School",
  "IB: MYP / DP",
  "Canadian provincial",
  "Australian curriculum",
  "Pakistan: Matric / FSc (all boards)",
  "Gulf private school (CBSE / British / American)",
  "Other",
];

export const gradeLevels = ["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];

export const schoolSubjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "English Language",
  "English Literature",
  "Economics",
  "Business Studies",
  "Urdu",
  "Arabic",
  "Islamiat",
  "Pakistan Studies",
];

export const writingLevels = ["High school", "Foundation or college", "Undergraduate", "Postgraduate"];

export const writingSupport = [
  "Essay planning and structure",
  "Research and sourcing",
  "Referencing (APA, Harvard, MLA)",
  "Draft feedback",
  "Presentation skills",
  "Exam writing technique",
];

export const quranCourses = [
  "Noorani Qaida",
  "Nazra Quran",
  "Tajweed",
  "Hifz",
  "Translation and Tafseer",
  "Islamic Studies for kids",
  "Arabic for beginners",
];

export const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Ireland",
  "Germany",
  "Netherlands",
  "Norway",
  "United Arab Emirates",
  "Saudi Arabia",
  "Qatar",
  "Kuwait",
  "Oman",
  "Bahrain",
  "Pakistan",
  "Malaysia",
  "Singapore",
  "Australia",
  "New Zealand",
  "South Africa",
  "Other",
];

export const timeZones = [
  { value: "America/Los_Angeles", label: "Pacific Time (GMT-8 / -7)" },
  { value: "America/Chicago", label: "Central Time (GMT-6 / -5)" },
  { value: "America/Toronto", label: "Eastern Time (GMT-5 / -4)" },
  { value: "Europe/London", label: "UK Time (GMT+0 / +1)" },
  { value: "Europe/Berlin", label: "Central Europe (GMT+1 / +2)" },
  { value: "Asia/Riyadh", label: "Saudi Arabia, Qatar, Kuwait (GMT+3)" },
  { value: "Asia/Dubai", label: "UAE, Oman (GMT+4)" },
  { value: "Asia/Karachi", label: "Pakistan (GMT+5)" },
  { value: "Asia/Kuala_Lumpur", label: "Malaysia, Singapore (GMT+8)" },
  { value: "Australia/Sydney", label: "Sydney, Melbourne (GMT+10 / +11)" },
  { value: "other", label: "Other" },
];

export const teachingLanguages = ["English", "Urdu", "Arabic", "Hindi", "Punjabi", "Pashto"];
