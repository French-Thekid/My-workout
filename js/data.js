/* ---------------- ICONS ---------------- */
const PATHS = {
    dumbbell: '<path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/>',
    calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    timer: '<path d="M10 2h4M12 14l3-3"/><circle cx="12" cy="14" r="8"/>',
    trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
    plus: '<path d="M5 12h14M12 5v14"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    trendingUp: '<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    waves: '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
  };
  
  function icon(name, size = 20, cls = '') {
    return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${size}" height="${size}">${PATHS[name]}</svg>`;
  }
  
  /* ---------------- DATA / PLAN ---------------- */
  const IMG = {
    chest: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
    back: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
    legs: 'https://images.unsplash.com/photo-1646495001290-39103b31873a?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
    rest: 'https://images.pexels.com/photos/14289784/pexels-photo-14289784.jpeg?auto=compress&cs=tinysrgb&w=1200',
  };
  
  const ex = (name, sets, target, kind = 'exercise') => ({ name, sets, target, kind });
  const brk = () => ({ name: 'Short Break', sets: 0, target: 'Rest & recover', kind: 'break' });
  
  const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const SHORT = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  
  const PLAN = [
    {
      title: 'Chest + Triceps', focus: 'Push Power', muscle: 'chest', image: IMG.chest,
      exercises: [
        ex('Pull Ups', 1, '30 reps'), ex('Flat Barbell Bench', 3, '10-15 reps'), ex('Incline Barbell Bench', 3, '10-15 reps'),
        ex('Chest Fly Machine', 3, '15 reps'), ex('Chest Dips (lean forward)', 3, 'To Failure'), brk(),
        ex('Double Arm Push Down (metal)', 3, '10-15 reps'), ex('Overhead Push Up', 3, '10-15 reps'), ex('Single Arm Push Down', 3, '10-15 reps'), brk(),
        ex('Incline Treadmill', 1, '15 min @ 3.5mph', 'cardio')
      ]
    },
    {
      title: 'Back + Biceps', focus: 'Pull Strength', muscle: 'back', image: IMG.back,
      exercises: [
        ex('Pull Ups', 1, '50 reps'), ex('Machine Rows', 3, '10-15 reps'), ex('Lat Pull Down (wide)', 3, '10-15 reps'),
        ex('Lat Pull Down (narrow)', 3, '10-15 reps'), ex('Chest Supported Rows', 3, '15 reps'), brk(),
        ex('Traps Shrugs', 3, '10-15 reps'), ex('Face Pulls', 3, '10-15 reps'), brk(),
        ex('Barbell / Dumbbell Curls', 3, '10-15 reps'), ex('Incline Seated Dumbbell Curl', 3, '10-15 reps'),
        ex('Hammer Curl', 3, '10-15 reps'), ex('Concentration Curls', 3, '10-15 reps'), brk(),
        ex('Incline Treadmill', 1, '15 min @ 3.5mph', 'cardio')
      ]
    },
    {
      title: 'Shoulders + Legs + Core', focus: 'Full Engine', muscle: 'legs', image: IMG.legs,
      exercises: [
        ex('Pull Ups', 1, '30 reps'), ex('Shoulder Press', 3, '10-15 reps'), ex('Lateral Raises', 3, '10-15 reps'),
        ex('Frontal Raises', 3, '10-15 reps'), ex('Shrugs', 3, '15 reps'), ex('Face Pulls', 3, '15 reps'), brk(),
        ex('Squats', 3, '10-15 reps'), ex('Leg Press', 3, '10-15 reps'), ex('Leg Raises', 3, '10-15 reps'), ex('Hamstring Curl', 3, '10-15 reps'), brk(),
        ex('Declined Bench Sit Ups', 3, '10-15 reps'), ex('Hanging / Laying Leg Raises', 3, '10-15 reps'),
        ex('Cable Crunches', 3, '10-15 reps'), ex('Planks', 3, '1 min'), ex('Jumping Jacks', 1, '300 reps', 'cardio')
      ]
    },
    {
      title: 'Chest + Triceps', focus: 'Push Power', muscle: 'chest', image: IMG.chest,
      exercises: [
        ex('Pull Ups', 1, '30 reps'), ex('Incline Dumbbell Bench', 3, '10-15 reps'), ex('Chest Fly Machine', 3, '15 reps'),
        ex('Cable Fly (high-to-low)', 3, '10-15 reps'), ex('Chest Dips (lean forward)', 3, 'To Failure'), brk(),
        ex('Double Arm Push Down (metal)', 3, '10-15 reps'), ex('Overhead Arm Push Up', 3, '10-15 reps'),
        ex('Single Arm Push Down', 3, '10-15 reps'), ex('Machine Arm Push Down', 3, '10-15 reps'), brk(),
        ex('Incline Treadmill', 1, '15 min @ 3.5mph', 'cardio')
      ]
    },
    {
      title: 'Back + Biceps', focus: 'Pull Strength', muscle: 'back', image: IMG.back,
      exercises: [
        ex('Pull Ups', 1, '50 reps'), ex('Deadlift', 3, '10 reps'), ex('Lat Pull Down (wide)', 3, '10-15 reps'),
        ex('Lat Pull Down (narrow)', 3, '10-15 reps'), ex('Seated Row', 3, '10-15 reps'), ex('Machine Pullovers', 3, '15 reps'), brk(),
        ex('Preacher Curls', 3, '10-15 reps'), ex('Cable Curls', 3, '10-15 reps'), ex('Hammer Curls', 3, '10-15 reps'),
        ex('Wrist Curls', 3, '10-15 reps'), ex('Reverse Wrist Curls', 3, '10-15 reps'), brk(),
        ex('Incline Treadmill', 1, '15 min @ 3.5mph', 'cardio')
      ]
    },
    { title: 'Rest Day', focus: 'Recover & Grow', muscle: 'rest', image: IMG.rest, exercises: [] },
    { title: 'Rest Day', focus: 'Recover & Grow', muscle: 'rest', image: IMG.rest, exercises: [] },
  ];
