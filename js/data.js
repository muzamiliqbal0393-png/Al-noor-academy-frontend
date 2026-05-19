(function(){
  // Central data source for the NoorAcademy landing page.
  // Used by js/main.js to populate: courses, teachers, pricing, reviews, FAQ, prayer times.

  window.NOOR_DATA = {
    courses: [
      {
        id: 'noorani-qaida',
        title: 'Noorani Qaida',
        level: 'Beginner',
        description: 'Basic Arabic letters, makharij, short vowels, and correct pronunciation for new learners.',
        duration: '4–6 weeks',
        rating: 4.9,
        reviews: 1260,
        priceMonthly: 29,
        priceAnnual: 249,
        students: 920,
        badge: 'Most Popular'
      },
      {
        id: 'nazra-quran',
        title: 'Nazra Quran (Reading)',
        level: 'Beginner–Intermediate',
        description: 'Learn to read Quran fluently with step-by-step guidance and weekly assessments.',
        duration: '8–12 weeks',
        rating: 4.8,
        reviews: 980,
        priceMonthly: 39,
        priceAnnual: 339,
        students: 740
      },
      {
        id: 'tajweed-level-1',
        title: 'Tajweed Course – Level 1',
        level: 'Foundation',
        description: 'Makharij, sifaat, basic rules of Noon Saakin, Tanween, and Qalqalah.',
        duration: '6–8 weeks',
        rating: 4.9,
        reviews: 760,
        priceMonthly: 45,
        priceAnnual: 399,
        students: 510,
        badge: 'VIP'
      },
      {
        id: 'tajweed-level-2',
        title: 'Tajweed Course – Level 2',
        level: 'Intermediate',
        description: 'Madd, Idgham, Ikhfa, Iqlab and advanced articulation improvement.',
        duration: '6–10 weeks',
        rating: 4.8,
        reviews: 640,
        priceMonthly: 49,
        priceAnnual: 439,
        students: 420
      },
      {
        id: 'tajweed-level-3',
        title: 'Tajweed Makharij Al-Huroof – Level 3',
        level: 'Advanced',
        description: 'Deep mastery of Makharij and fine tajweed checkpoints for high-accuracy recitation.',
        duration: '8–12 weeks',
        rating: 4.9,
        reviews: 510,
        priceMonthly: 59,
        priceAnnual: 519,
        students: 310
      },
      {
        id: 'hifz-track-1',
        title: 'Hifz Program – Track 1',
        level: 'Hifz Beginner',
        description: 'Daily revision plan, memorization checkpoints, and strong retention support.',
        duration: '12–16 weeks',
        rating: 4.7,
        reviews: 410,
        priceMonthly: 79,
        priceAnnual: 699,
        students: 260
      },
      {
        id: 'hifz-track-2',
        title: 'Hifz Program – Track 2',
        level: 'Hifz Intermediate',
        description: 'Structured revision cycles with performance tracking and teacher feedback.',
        duration: '14–18 weeks',
        rating: 4.8,
        reviews: 360,
        priceMonthly: 89,
        priceAnnual: 799,
        students: 210,
        badge: 'New'
      },
      {
        id: 'tafseer-basics',
        title: 'Tafseer Basics (Understanding)',
        level: 'All Levels',
        description: 'Meaning, themes, and key lessons from selected Surahs with Arabic vocabulary support.',
        duration: '6–10 weeks',
        rating: 4.6,
        reviews: 270,
        priceMonthly: 35,
        priceAnnual: 299,
        students: 190
      },
      {
        id: 'arabic-language',
        title: 'Arabic for Quran (Qur’anic Arabic)',
        level: 'Beginner–Intermediate',
        description: 'Grammar and vocabulary that directly helps recitation accuracy and comprehension.',
        duration: '8–12 weeks',
        rating: 4.7,
        reviews: 330,
        priceMonthly: 42,
        priceAnnual: 369,
        students: 240
      },
      {
        id: 'kids-quran',
        title: 'Kids Quran Program',
        level: 'Ages 6–12',
        description: 'Friendly learning method: reading, memorization games, and moral stories.',
        duration: '4–8 weeks',
        rating: 4.9,
        reviews: 520,
        priceMonthly: 45,
        priceAnnual: 399,
        students: 380,
        badge: 'Most Popular'
      },
      {
        id: 'dua-adhkar',
        title: 'Duas & Adhkar (Daily Guidance)',
        level: 'Beginner',
        description: 'Memorize and learn pronunciation for morning/evening adhkar and common duas.',
        duration: '3–5 weeks',
        rating: 4.5,
        reviews: 180,
        priceMonthly: 25,
        priceAnnual: 219,
        students: 150
      },
      {
        id: 'qirat-tilawat',
        title: 'Qirat & Tilawat Coaching',
        level: 'Advanced',
        description: 'Professional coaching for smooth tilawat, rhythm, and advanced checkpoints.',
        duration: '8–12 weeks',
        rating: 4.9,
        reviews: 220,
        priceMonthly: 69,
        priceAnnual: 599,
        students: 120
      }
    ],

    teachers: [
      { name: 'Sheikh Abdullah Al-Mansouri', spec: 'Certified Tajweed Instructor', badge: 'Ijazah', status: 'online', rating: 4.9, students: 620 },
      { name: 'Ustadhah Amina Noor', spec: 'Nazra & Noorani Qaida Specialist', badge: 'Top Rated', status: 'active', rating: 4.8, students: 740 },
      { name: 'Mufti Yusuf Al-Harbi', spec: 'Hifz Program Coach', badge: 'Hifz Master', status: 'online', rating: 4.9, students: 510 },
      { name: 'Sheikh Hamza Al-Qarni', spec: 'Makharij + Madd Teacher', badge: 'Advanced Tajweed', status: 'active', rating: 4.7, students: 420 },
      { name: 'Ustadh Faris Khan', spec: 'Arabic for Quran Coach', badge: 'Grammar Expert', status: 'online', rating: 4.8, students: 360 },
      { name: 'Ustadhah Sara Al-Attas', spec: 'Kids Quran & Memorization', badge: 'Kids Lead', status: 'active', rating: 4.9, students: 300 },
      { name: 'Sheikh Bilal Rahman', spec: 'Tafseer Basics Teacher', badge: 'Meaning Focus', status: 'online', rating: 4.6, students: 280 },
      { name: 'Ustadh Zaid Qureshi', spec: 'Qirat & Tilawat Coaching', badge: 'Professional', status: 'active', rating: 4.9, students: 240 }
    ],

    pricing: {
      monthly: [
        {
          id: 'starter',
          name: 'Starter',
          price: 29,
          desc: 'Perfect for beginners. Weekly guided sessions + feedback.',
          featured: false,
          features: ['7-day free trial', '1 session/week', 'Basic assessments', 'Teacher feedback']
        },
        {
          id: 'standard',
          name: 'Standard',
          price: 49,
          desc: 'Recommended for serious learners who want consistency.',
          featured: true,
          features: ['7-day free trial', '2 sessions/week', 'Progress report', 'Audio corrections', 'Priority booking']
        },
        {
          id: 'premium',
          name: 'Premium',
          price: 79,
          desc: 'For Hifz and advanced Tajweed with dedicated support.',
          featured: false,
          features: ['7-day free trial', '3 sessions/week', 'Advanced Tajweed checklists', 'Weekly revision plan', 'Certificate assistance']
        }
      ],
      annual: [
        {
          id: 'starter',
          name: 'Starter',
          price: 249,
          desc: 'Save with annual access. All Starter benefits included.',
          featured: false,
          features: ['7-day free trial', '1 session/week', 'Basic assessments', 'Teacher feedback']
        },
        {
          id: 'standard',
          name: 'Standard',
          price: 399,
          desc: 'Best value. Suitable for long-term Quran transformation.',
          featured: true,
          features: ['7-day free trial', '2 sessions/week', 'Progress report', 'Audio corrections', 'Priority booking']
        },
        {
          id: 'premium',
          name: 'Premium',
          price: 699,
          desc: 'Most intensive plan for Hifz & advanced Tajweed.',
          featured: false,
          features: ['7-day free trial', '3 sessions/week', 'Advanced Tajweed checklists', 'Weekly revision plan', 'Certificate assistance']
        }
      ]
    },

    reviews: [
      { name: 'Ahmed R.', location: 'Dubai', rating: 5, text: 'The teacher corrections are extremely detailed. My tajweed improved within weeks.' },
      { name: 'Sara K.', location: 'London', rating: 5, text: 'Kids program is amazing. My child loves the lessons and progress feels consistent.' },
      { name: 'Bilal M.', location: 'Karachi', rating: 4.8, text: 'Noorani Qaida made everything easy. The structured approach keeps me motivated.' },
      { name: 'Hafsa N.', location: 'Toronto', rating: 5, text: 'Hifz track 1 helped with revision planning. Teacher support is top-notch.' },
      { name: 'Faisal S.', location: 'Riyadh', rating: 4.9, text: 'Excellent communication and clear weekly assessments. Highly recommended.' },
      { name: 'Maryam A.', location: 'Paris', rating: 5, text: 'Tafseer basics gave me deeper understanding. The course is well organized.' }
    ],

    faq: [
      { q: 'How does the 7-day free trial work?', a: 'You’ll start with a trial session + a short assessment. After 7 days you can choose a plan or continue anytime.' },
      { q: 'What if I’m a complete beginner?', a: 'We’ll recommend Noorani Qaida or beginner Nazra. Teachers adjust pace based on your level.' },
      { q: 'Do you provide certificates?', a: 'Yes. Learners receive completion certificates after meeting course milestones and assessments.' },
      { q: 'Can I change my teacher?', a: 'You can request a teacher change during the first weeks if needed. Our goal is your comfort and progress.' },
      { q: 'Are sessions recorded?', a: 'Some sessions are recorded for practice. Your teacher will confirm recording policy for your plan.' },
      { q: 'Which languages are supported?', a: 'Lessons are available in English, Urdu, Arabic (and more depending on teacher availability).' }
    ],

    prayerTimes: [
      { name: 'Fajr', time: '4:32 AM', highlight: false },
      { name: 'Dhuhr', time: '12:21 PM', highlight: false },
      { name: 'Asr', time: '3:54 PM', highlight: true },
      { name: 'Maghrib', time: '6:45 PM', highlight: false },
      { name: 'Isha', time: '8:12 PM', highlight: false }
    ],

    dailyRecitation: {
      surah: 'Surah Ar-Rahman',
      reciter: 'Sheikh Abdul Rahman Al-Sudais',
      // No actual audio file shipped; UI still works.
      // If you later add an mp3, you can set: audioUrl.
      audioUrl: ''
    }
  };
})();

