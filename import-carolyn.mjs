import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const config = {
  apiKey: "AIzaSyAt5Pe3_mi6KAD5w4nSqeKiUKCrJjOFJhY",
  authDomain: "trainer-app-b4dd1.firebaseapp.com",
  projectId: "trainer-app-b4dd1",
  storageBucket: "trainer-app-b4dd1.firebasestorage.app",
  messagingSenderId: "376018012060",
  appId: "1:376018012060:web:5fe266522a06f76f816a59"
};

const app  = initializeApp(config);
const db   = getFirestore(app);
const auth = getAuth(app);

function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }
function makeEx(name, pattern, unilateral, sets, notes="") {
  return { id:uid(), name, pattern, unilateral:!!unilateral, isUnilateralExercise:!!unilateral,
           performedUnilateral:false, sets, notes };
}
function s(w,r) { return { weight:w, reps:r }; }
function session(clientId, date, notes, exercises) {
  return { id:uid(), clientId, clientIds:[clientId],
           date:new Date(date).toISOString(), notes, exercises };
}

// --- credentials via env ---
const EMAIL    = process.env.FB_EMAIL;
const PASSWORD = process.env.FB_PASSWORD;

if (!EMAIL || !PASSWORD) {
  console.error("Gebruik: FB_EMAIL=... FB_PASSWORD=... node import-carolyn.mjs");
  process.exit(1);
}

console.log("Inloggen...");
await signInWithEmailAndPassword(auth, EMAIL, PASSWORD);
console.log("✓ Ingelogd");

const ref  = doc(db, "app", "data");
const snap = await getDoc(ref);
const data = snap.exists() ? (snap.data().payload || {}) : {};
const base = { clients:[], sessions:[], exerciseLibrary:[], templates:[], ...data };

if (base.clients.some(c => c.name === "Carolyn Whelan")) {
  console.log("⚠ Carolyn Whelan bestaat al. Import gestopt.");
  process.exit(0);
}

const clientId = uid();
const carolyn  = { id:clientId, name:"Carolyn Whelan", createdAt:new Date().toISOString() };
console.log("✓ Klant aangemaakt");

const sessions = [

  session(clientId, "2023-12-31", "Jaaroverzicht 2023", [
    makeEx("Bulgarian Split Squat",  "Squat",    true,  [s("10","")]),
    makeEx("Linear Leg Press",       "Machine",  false, [s("75","")]),
    makeEx("Leg Extension",          "Machine",  true,  [s("10","")]),
    makeEx("Hip Thrust",             "Hinge",    false, [s("12,5","")]),
    makeEx("RDL",                    "Hinge",    false, [s("2x7,5","")]),
    makeEx("Leg Curl",               "Machine",  true,  [s("12,5","")], "Prone, unilateraal"),
    makeEx("Chin Up",                "Pull",     false, [s("","")],     "4-2-1-0 tempo"),
    makeEx("Lat Pulldown",           "Pull",     false, [s("22,5","")]),
    makeEx("Cable Row",              "Pull",     false, [s("25","")]),
    makeEx("Shoulder Press",         "Push",     true,  [s("4","")]),
    makeEx("DB Bench Press",         "Push",     false, [s("2x8","")]),
    makeEx("Incline Push Up",        "Push",     false, [s("","")],     "4-2-1-1 tempo, 5 reps negatief"),
    makeEx("Tricep Extension Cable", "Isolatie", false, [s("6","")])
  ]),

  session(clientId, "2024-12-31", "Jaaroverzicht 2024", [
    makeEx("Bulgarian Split Squat",  "Squat",    true,  [s("16","")]),
    makeEx("Goblet Squat",           "Squat",    false, [s("20","")]),
    makeEx("Linear Leg Press",       "Machine",  false, [s("85","")]),
    makeEx("Leg Extension",          "Machine",  false, [s("22,5","")]),
    makeEx("Hip Thrust",             "Hinge",    false, [s("25","")]),
    makeEx("Leg Curl",               "Machine",  false, [s("25","")]),
    makeEx("Chin Up",                "Pull",     false, [s("","")],     "3 reps! → 6-8 reps (zwarte + blauwe dunne band)"),
    makeEx("Lat Pulldown",           "Pull",     false, [s("15","10"),s("15","10")]),
    makeEx("Cable Row",              "Pull",     false, [s("25","")]),
    makeEx("Face Pull",              "Pull",     false, [s("12,5","")]),
    makeEx("DB Bench Press",         "Push",     false, [s("2x10","")]),
    makeEx("Tricep Extension Cable", "Isolatie", false, [s("10","")]),
    makeEx("Bicep Curls Cable",      "Isolatie", false, [s("7,5","")]),
    makeEx("Lateral Raise",          "Isolatie", false, [s("2x3","")])
  ]),

  session(clientId, "2025-12-31", "Jaaroverzicht 2025", [
    makeEx("Bulgarian Split Squat",  "Squat",    true,  [s("18","10")]),
    makeEx("Goblet Squat",           "Squat",    false, [s("24","10"),s("24","10")]),
    makeEx("Linear Leg Press",       "Machine",  false, [s("120","12"),s("120","12"),s("120","12")]),
    makeEx("Leg Extension",          "Machine",  false, [s("25","12")]),
    makeEx("Hip Thrust",             "Hinge",    false, [s("35","12"),s("35","12")]),
    makeEx("Leg Curl",               "Machine",  false, [s("27,5","10"),s("27,5","10"),s("27,5","10")]),
    makeEx("Chin Up",                "Pull",     false, [s("","")],     "5 reps rode band → 6 reps rode band, 6-8 reps"),
    makeEx("Lat Pulldown",           "Pull",     false, [s("22,5","")], "High to low"),
    makeEx("Cable Row",              "Pull",     false, [s("30","10")]),
    makeEx("Face Pull",              "Pull",     false, [s("15","12"),s("15","12"),s("15","12")]),
    makeEx("DB Bench Press",         "Push",     false, [s("2x10","12"),s("2x10","12"),s("2x10","12")]),
    makeEx("Incline Push Up",        "Push",     false, [s("","12"),s("","12"),s("","12")],  "Negatief 4"),
    makeEx("Bicep Curls Cable",      "Isolatie", false, [s("12,5","10")]),
    makeEx("DB Bicep Curls",         "Isolatie", false, [s("2x7","8")]),
    makeEx("Lateral Raise",          "Isolatie", false, [s("2x4","12")])
  ]),

  session(clientId, "2026-02-28", "Februari 2026", [
    makeEx("Bulgarian Split Squat",  "Squat",    true,  [s("18","8"),s("18","8")]),
    makeEx("Hip Thrust",             "Hinge",    false, [s("40","12"),s("40","12")]),
    makeEx("Leg Extension",          "Machine",  false, [s("22,5","12"),s("22,5","12"),s("22,5","12")]),
    makeEx("Chin Up",                "Pull",     false, [s("","")],     "E(30s)MOM 10x1rep + EMOM 5x3reps"),
    makeEx("Lat Pulldown",           "Pull",     false, [s("15","10"),s("15","10"),s("15","10")]),
    makeEx("DB Bench Press",         "Push",     false, [s("2x12","8"),s("2x12","8")]),
    makeEx("Push Up",                "Push",     false, [s("","10")])
  ]),

  session(clientId, "2026-03-31", "Maart 2026", [
    makeEx("Bulgarian Split Squat",  "Squat",    true,  [s("20","8"),s("20","8")]),
    makeEx("Goblet Squat",           "Squat",    false, [s("24","10"),s("24","10")]),
    makeEx("Linear Leg Press",       "Machine",  false, [s("120","12")]),
    makeEx("Hip Thrust",             "Hinge",    false, [s("45","10"),s("45","10")]),
    makeEx("Leg Curl",               "Machine",  false, [s("27,5","10"),s("27,5","10"),s("27,5","10")]),
    makeEx("Chin Up",                "Pull",     false, [s("","")],     "EMOM 6x3 + tempo 3/3/1, 6-8 reps"),
    makeEx("Lat Pulldown",           "Pull",     false, [s("37,5","8")], "Neutral grip"),
    makeEx("Cable Row",              "Pull",     false, [s("30","10"),s("30","10"),s("30","10")]),
    makeEx("Face Pull",              "Pull",     false, [s("12,5","10"),s("12,5","10")]),
    makeEx("DB Bench Press",         "Push",     false, [s("2x12","8"),s("2x12","8"),s("2x12","8")]),
    makeEx("Lateral Raise",          "Isolatie", false, [s("2x4","12"),s("2x4","12"),s("2x4","12")])
  ]),

  session(clientId, "2026-04-30", "April 2026 — sessie 1", [
    makeEx("Bulgarian Split Squat",  "Squat",    true,  [s("12","10"),s("12","10"),s("12","10")]),
    makeEx("Goblet Squat",           "Squat",    false, [s("24","12"),s("24","12")]),
    makeEx("Hip Thrust",             "Hinge",    false, [s("40","10"),s("40","10"),s("40","10")]),
    makeEx("Leg Curl",               "Machine",  false, [s("27,5","8"),s("27,5","8"),s("27,5","8")]),
    makeEx("Chin Up",                "Pull",     false, [s("","")],     "6-8 reps, gele band"),
    makeEx("Lat Pulldown",           "Pull",     false, [s("15","10"),s("15","10")], "High to low"),
    makeEx("Cable Row",              "Pull",     false, [s("30","12"),s("30","12")]),
    makeEx("Tricep Extension Cable", "Isolatie", false, [s("10","12"),s("10","12"),s("10","12")])
  ]),

  session(clientId, "2026-04-30", "April 2026 — sessie 2", [
    makeEx("Bulgarian Split Squat",  "Squat",    true,  [s("14","10"),s("14","10"),s("14","10")])
  ]),

  session(clientId, "2026-05-31", "Mei 2026 — sessie 1", [
    makeEx("Bulgarian Split Squat",  "Squat",    true,  [s("16","10"),s("16","10")]),
    makeEx("Goblet Squat",           "Squat",    false, [s("24","12"),s("24","12")]),
    makeEx("Linear Leg Press",       "Machine",  false, [s("100","12"),s("100","12"),s("100","12")]),
    makeEx("Hip Thrust",             "Hinge",    false, [s("40","10"),s("40","10"),s("40","10")]),
    makeEx("Leg Curl",               "Machine",  false, [s("27,5","12"),s("27,5","12"),s("27,5","12")]),
    makeEx("Chin Up",                "Pull",     false, [s("","")],     "Gele band, 6-8 reps"),
    makeEx("Lat Pulldown",           "Pull",     false, [s("37,5","8"),s("37,5","8")], "Neutral grip"),
    makeEx("Bent Over Row",          "Pull",     false, [s("16","10"),s("16","10"),s("16","10")]),
    makeEx("DB Bench Press",         "Push",     false, [s("2x10","10"),s("2x10","10"),s("2x10","10")]),
    makeEx("Push Up",                "Push",     false, [s("","10")]),
    makeEx("Landmine Press",         "Push",     false, [s("20","6"),s("20","6"),s("20","6")]),
    makeEx("Tricep Extension Cable", "Isolatie", false, [s("7,5","12"),s("7,5","12"),s("7,5","12")])
  ]),

  session(clientId, "2026-05-31", "Mei 2026 — sessie 2", [
    makeEx("Bulgarian Split Squat",  "Squat",    true,  [s("16","10"),s("16","10"),s("16","10")]),
    makeEx("Hip Thrust",             "Hinge",    false, [s("45","10"),s("45","10")])
  ]),

  session(clientId, "2026-06-01", "Juni 2026 — sessie 1", [
    makeEx("Goblet Squat",           "Squat",    false, [s("24","12"),s("24","12"),s("24","12")]),
    makeEx("Linear Leg Press",       "Machine",  false, [s("100","12"),s("100","12"),s("100","12")]),
    makeEx("Leg Extension",          "Machine",  false, [s("15","10"),s("15","10")]),
    makeEx("Hip Thrust",             "Hinge",    false, [s("50","12")]),
    makeEx("Chin Up",                "Pull",     false, [s("","")],     "Gele band, 6-8 reps"),
    makeEx("Lat Pulldown",           "Pull",     false, [s("35","8"),s("35","8"),s("35","8")], "Neutral grip"),
    makeEx("Bent Over Row",          "Pull",     false, [s("16","10"),s("16","10"),s("16","10")]),
    makeEx("Incline Push Up",        "Push",     false, [s("","15"),s("","15"),s("","15")],    "Negatief 5")
  ]),

  session(clientId, "2026-06-06", "Juni 2026 — sessie 2", [
    makeEx("Push Up",                "Push",     false, [s("","10")])
  ])
];

const newLibExercises = [
  { id:uid(), name:"Bulgarian Split Squat",  pattern:"Squat",    unilateral:true  },
  { id:uid(), name:"Goblet Squat",            pattern:"Squat",    unilateral:false },
  { id:uid(), name:"Linear Leg Press",        pattern:"Machine",  unilateral:false },
  { id:uid(), name:"Leg Extension",           pattern:"Machine",  unilateral:false },
  { id:uid(), name:"Hip Thrust",              pattern:"Hinge",    unilateral:false },
  { id:uid(), name:"RDL",                     pattern:"Hinge",    unilateral:false },
  { id:uid(), name:"Leg Curl",                pattern:"Machine",  unilateral:false },
  { id:uid(), name:"Chin Up",                 pattern:"Pull",     unilateral:false },
  { id:uid(), name:"Lat Pulldown",            pattern:"Pull",     unilateral:false },
  { id:uid(), name:"Cable Row",               pattern:"Pull",     unilateral:false },
  { id:uid(), name:"Bent Over Row",           pattern:"Pull",     unilateral:false },
  { id:uid(), name:"Face Pull",               pattern:"Pull",     unilateral:false },
  { id:uid(), name:"Shoulder Press",          pattern:"Push",     unilateral:false },
  { id:uid(), name:"DB Bench Press",          pattern:"Push",     unilateral:false },
  { id:uid(), name:"Incline Push Up",         pattern:"Push",     unilateral:false },
  { id:uid(), name:"Push Up",                 pattern:"Push",     unilateral:false },
  { id:uid(), name:"Landmine Press",          pattern:"Push",     unilateral:false },
  { id:uid(), name:"Tricep Extension Cable",  pattern:"Isolatie", unilateral:false },
  { id:uid(), name:"Bicep Curls Cable",       pattern:"Isolatie", unilateral:false },
  { id:uid(), name:"Lateral Raise",           pattern:"Isolatie", unilateral:false }
];

const existingNames = base.exerciseLibrary.map(e => e.name.toLowerCase());
const toAdd = newLibExercises.filter(e => !existingNames.includes(e.name.toLowerCase()));

const newData = {
  clients:         [...base.clients, carolyn],
  sessions:        [...base.sessions, ...sessions],
  exerciseLibrary: [...base.exerciseLibrary, ...toAdd],
  templates:       base.templates
};

console.log(`Opslaan: ${sessions.length} sessies, ${toAdd.length} nieuwe bibliotheek-oefeningen...`);
await setDoc(ref, { payload: newData });
console.log("✓ Import voltooid!");
process.exit(0);
