// Single place for every image used across the site. Swap URLs here to replace imagery site-wide.
// These are stock placeholders. Real photos of your own teachers and classes will convert better.
const u = (id: string, w = 1400) => `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

// Free Pexels stock clip (1920x1080, 14s loop). Replace with your own class footage when you have it.
const pexelsVideo = (id: number, file: string) => `https://videos.pexels.com/video-files/${id}/${id}-${file}.mp4`;

export const media = {
  // Background video for the homepage hero. The subject sits on the right, so the left gradient keeps text readable.
  // To use your own footage, drop it at public/videos/hero.mp4 (and hero-mobile.mp4). It is tried first,
  // and the Pexels clip is the fallback. The poster shows while the video loads or if it cannot play.
  heroVideo: {
    local: "/videos/hero.mp4",
    localMobile: "/videos/hero-mobile.mp4",
    src: pexelsVideo(6476354, "hd_1920_1080_25fps"),
    srcMobile: pexelsVideo(6476354, "hd_1280_720_25fps"),
    poster: u("photo-1588072432836-e10032774350", 1600),
  },
  // Background photo for each inner page hero (shared PageHeader component)
  pageHeaders: {
    services: { src: u("photo-1758685733926-00cba008215b", 1920), alt: "Teacher helping a young student at a desk" },
    about: { src: u("photo-1522202176988-66273c2fd55f", 1920), alt: "Students working together around a laptop" },
    contact: { src: u("photo-1657664050038-1e6f957de1a9", 1920), alt: "Parent and child at a table with a laptop" },
    payment: { src: u("photo-1435527173128-983b87201f4d", 1920), alt: "Open planner on a wooden desk" },
    applyStudent: { src: u("photo-1623076189461-f7706b741c04", 1920), alt: "Young student in an online lesson" },
    applyTeacher: { src: u("photo-1541178735493-479c1a27ed24", 1920), alt: "Teacher preparing a lesson on a laptop" },
  },
  hero: {
    src: u("photo-1588072432836-e10032774350", 1600),
    alt: "Student learning online at home with a laptop and notebook",
  },
  programs: {
    tutoring: {
      src: u("photo-1758685733926-00cba008215b"),
      alt: "Teacher helping a young student with maths problems at a desk",
    },
    writing: {
      src: u("photo-1759984782211-3a02ca78e6ac"),
      alt: "Student studying and writing notes at a desk",
    },
    quran: {
      src: u("photo-1609599006353-e629aaabfeae"),
      alt: "An open Quran resting on a wooden stand",
    },
  },
  // Parent and child learning together, used in the "How it works" section
  family: {
    src: u("photo-1657664050038-1e6f957de1a9", 1200),
    alt: "Mother and daughter sitting together at a table with a laptop",
  },
  // Background photos for the feature cards (homepage "Why choose us" and About page values)
  features: {
    vetted: { src: u("photo-1541178735493-479c1a27ed24", 800), alt: "Teacher preparing a lesson on a laptop" },
    timezones: { src: u("photo-1521295121783-8a321d551ad2", 800), alt: "Desk globe on a table" },
    rescheduling: { src: u("photo-1435527173128-983b87201f4d", 800), alt: "Open monthly planner on a wooden desk" },
    reports: { src: u("photo-1606326608690-4e0281b1e588", 800), alt: "Pencil resting on an answer sheet" },
    femaleTeachers: { src: u("photo-1758685848142-06e158cf64bc", 800), alt: "Female teacher smiling at her desk with a laptop" },
    recordings: { src: u("photo-1760346546839-aced24accdff", 800), alt: "Laptop showing a live video lesson" },
    care: { src: u("photo-1629360057380-18b15b42e650", 800), alt: "Two young students learning together" },
    progress: { src: u("photo-1758612898312-708f2ffdcd53", 800), alt: "Young boy studying with a laptop and notebook" },
    rooted: { src: u("photo-1501504905252-473c47e087f8", 800), alt: "Open book beside a laptop" },
  },
  // Photo beside the FAQ
  faq: {
    src: u("photo-1623076189461-f7706b741c04", 1000),
    alt: "Young girl sitting at a table with a laptop during a lesson",
  },
  about: {
    story: {
      src: u("photo-1522202176988-66273c2fd55f"),
      alt: "Students working together around a laptop",
    },
  },
  teachers: [
    {
      src: u("photo-1615472096167-e2efc2f25dcd", 700),
      alt: "Portrait of a mathematics teacher",
    },
    {
      src: u("photo-1568602471122-7832951cc4c5", 700),
      alt: "Portrait of a physics teacher",
    },
    {
      src: u("photo-1580894742597-87bc8789db3d", 700),
      alt: "Portrait of a Quran and Tajweed teacher",
    },
  ],
};
