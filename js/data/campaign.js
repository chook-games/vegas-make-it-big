export const SCENARIOS = [
  {
    id: 's1', title: 'Καλωσόρισμα στη Vegas', theme: 'american', startCash: 5000,
    desc: 'Το πρώτο σου οικόπεδο. Στήσε ένα μικρό αλλά κερδοφόρο resort.',
    targetDays: 3, reward: { cash: 3000 },
    goals: [
      { type: 'cash', target: 8000, label: 'Ταμείο $8,000' },
      { type: 'lotBuildings', target: 3, label: '3 κτίρια στο Lot' }
    ]
  },
  {
    id: 's2', title: 'Ωκεανός & Titanic', theme: 'ocean', startCash: 6000,
    desc: 'Νέο οικόπεδο δίπλα στη θάλασσα. Χτίσε το πλωτό καζίνο-θρύλο.',
    targetDays: 4, reward: { cash: 6000 },
    goals: [
      { type: 'landmark', target: 'titanic', label: 'Χτίσε το Casino Titanic' },
      { type: 'lotBuildings', target: 6, label: '6 κτίρια στο Lot' },
      { type: 'rep', target: 25, label: 'Φήμη 25' }
    ]
  },
  {
    id: 's3', title: 'Διαστρική Λεωφόρος', theme: 'space', startCash: 8000,
    desc: 'Το σύμπαν σε περιμένει. Ανέβασε level και μάζεψε κεφάλαιο.',
    targetDays: 5, reward: { cash: 12000, gold: 1 },
    goals: [
      { type: 'level', target: 6, label: 'Level 6' },
      { type: 'cash', target: 60000, label: 'Ταμείο $60,000' }
    ]
  },
  {
    id: 's4', title: 'Προϊστορικό Πάρκο', theme: 'prehistoric', startCash: 10000,
    desc: 'Δεινόσαυροι και κόσμος. Γέμισε το πάρκο με ατραξιόν.',
    targetDays: 5, reward: { cash: 20000 },
    goals: [
      { type: 'lotBuildings', target: 8, label: '8 κτίρια στο Lot' },
      { type: 'guests', target: 150, label: '150 επισκέπτες' }
    ]
  },
  {
    id: 's5', title: 'Ανατολίτικη Γοητεία', theme: 'oriental', startCash: 15000,
    desc: 'Πολυτέλεια και προσωπικό. Χτίσε φήμη και στελέχωσε το resort.',
    targetDays: 6, reward: { cash: 35000, gold: 2 },
    goals: [
      { type: 'rep', target: 45, label: 'Φήμη 45' },
      { type: 'lotBuildings', target: 10, label: '10 κτίρια στο Lot' },
      { type: 'staff', target: 8, label: '8 εργαζόμενοι' }
    ]
  },
  {
    id: 's6', title: 'Χρυσή Αίγυπτος', theme: 'egyptian', startCash: 20000,
    desc: 'Αυτοκρατορία σε πολλά οικόπεδα. Άνοιξε νέα lots.',
    targetDays: 6, reward: { cash: 60000 },
    goals: [
      { type: 'cash', target: 250000, label: 'Ταμείο $250,000' },
      { type: 'lots', target: 3, label: '3 οικόπεδα' }
    ]
  },
  {
    id: 's7', title: 'Άγρια Δύση', theme: 'western', startCash: 25000,
    desc: 'Ο νόμος είναι εσύ. Μεγάλωσε το resort και πιάσε level.',
    targetDays: 7, reward: { cash: 90000, gold: 2 },
    goals: [
      { type: 'lotBuildings', target: 12, label: '12 κτίρια στο Lot' },
      { type: 'level', target: 12, label: 'Level 12' }
    ]
  },
  {
    id: 's8', title: 'Τροπικός Παράδεισος', theme: 'tropical', startCash: 30000,
    desc: 'Πλήθη τουριστών. Γέμισε το νησί και χτίσε φήμη.',
    targetDays: 7, reward: { cash: 130000 },
    goals: [
      { type: 'guests', target: 320, label: '320 επισκέπτες' },
      { type: 'rep', target: 60, label: 'Φήμη 60' }
    ]
  },
  {
    id: 's9', title: 'Μεσαιωνικό Βασίλειο', theme: 'medieval', startCash: 40000,
    desc: 'Κάστρα και θησαυροί. Τεράστιο κεφάλαιο και στρατός προσωπικού.',
    targetDays: 8, reward: { cash: 220000, gold: 3 },
    goals: [
      { type: 'cash', target: 800000, label: 'Ταμείο $800,000' },
      { type: 'staff', target: 15, label: '15 εργαζόμενοι' }
    ]
  },
  {
    id: 's10', title: 'Neon Μέλλον', theme: 'futuristic', startCash: 60000,
    desc: 'Το τελικό στάδιο. Γίνε ο Αυτοκράτορας της Vegas.',
    targetDays: 9, reward: { cash: 600000, gold: 5 },
    goals: [
      { type: 'rep', target: 85, label: 'Φήμη 85' },
      { type: 'lotBuildings', target: 16, label: '16 κτίρια στο Lot' },
      { type: 'level', target: 20, label: 'Level 20' }
    ]
  }
];

export const MAX_STARS = 3;
