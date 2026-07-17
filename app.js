const STORAGE_KEY = "attendly-subjects-v1";
const THEME_KEY = "attendly-theme";
const PROFILE_NAME_KEY = "attendly-profile-name";
const ATTENDANCE_GOAL_KEY = "attendly-attendance-goal";
const TIMETABLES_KEY = "attendly-default-timetables-v1";
const ACTIVE_TIMETABLE_KEY = "attendly-active-timetable";
const TIMETABLE_VERSION_KEY = "attendly-timetable-version";
const TIMETABLE_VERSION = "ce-sem-iii-div-b-2026-07-20";
const TERM_START = "2026-07-13";

const palette = {
  violet: { color: "#5d54e8", soft: "#eeedff" },
  blue: { color: "#4f86e8", soft: "#edf4ff" },
  coral: { color: "#d76b5e", soft: "#fff0ed" },
  green: { color: "#28a568", soft: "#eaf8f0" },
  amber: { color: "#c48720", soft: "#fff6e4" },
  pink: { color: "#c863a2", soft: "#fcedf6" }
};

const iconPaths = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  sparkle: '<path d="m12 2 1.35 5.65L19 9l-5.65 1.35L12 16l-1.35-5.65L5 9l5.65-1.35L12 2ZM19 15l.6 2.4L22 18l-2.4.6L19 21l-.6-2.4L16 18l2.4-.6L19 15Z"/>',
  moon: '<path d="M20.5 15.3A8.5 8.5 0 0 1 8.7 3.5 8.5 8.5 0 1 0 20.5 15.3Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/>',
  more: '<circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/>',
  "chevron-right": '<path d="m9 5 7 7-7 7"/>',
  "chevron-left": '<path d="m15 5-7 7 7 7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  chart: '<path d="M4 19V5M4 19h17"/><path d="m7 15 3-4 3 2 5-7"/>',
  users: '<path d="M16 20v-1.5a4.5 4.5 0 0 0-4.5-4.5h-3A4.5 4.5 0 0 0 4 18.5V20M10 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM16 3.2a3.5 3.5 0 0 1 0 6.7M17 14.2a4.5 4.5 0 0 1 3 4.3V20"/>',
  target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4"/><path d="M12 3.5V2M20.5 12H22M12 20.5V22M3.5 12H2"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  trash: '<path d="M4 7h16M10 11v5M14 11v5M6 7l1 14h10l1-14M9 7V4h6v3"/>',
  check: '<path d="m5 12 4.2 4.2L19 6.5"/>',
  pencil: '<path d="m4 16.5-.8 4.3 4.3-.8L19 8.5 15.5 5 4 16.5ZM14.5 6 18 9.5"/>',
  "arrow-right": '<path d="M5 12h14M13 6l6 6-6 6"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22V5.5ZM4 5.5v15M8 7h8M8 11h7"/>',
  dots: '<circle cx="12" cy="5" r="1.2" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1.2" fill="currentColor" stroke="none"/>',
};

const state = {
  subjects: loadSubjects(),
  userName: loadUserName(),
  attendanceGoal: loadAttendanceGoal(),
  timetables: loadTimetables(),
  activeTimetableId: localStorage.getItem(ACTIVE_TIMETABLE_KEY) || "timetable-current",
  view: "overview",
  calendarMonth: new Date().getMonth(),
  calendarYear: new Date().getFullYear(),
  selectedDate: toISODate(new Date()),
  timetableDate: toISODate(new Date()),
  editingSubjectId: null,
  editingTimetableId: null,
  drawerMode: null,
  logStatus: "present"
};

function icon(name, className = "") {
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || ""}</svg>`;
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[character]));
}

function uid(prefix = "id") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromISODate(value) {
  const [year, month, day] = String(value).split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

function relativeDate(daysAgo) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - daysAgo);
  return toISODate(date);
}

function formatDate(value, options = { month: "short", day: "numeric" }) {
  if (!value) return "—";
  return new Intl.DateTimeFormat(undefined, options).format(fromISODate(value));
}

function formatTime(value) {
  if (!value) return "Time not set";
  const [hours, minutes] = value.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 || 12;
  return `${hour}:${String(minutes || 0).padStart(2, "0")} ${period}`;
}

function formatScheduleTime(item) {
  const start = formatTime(item.time);
  if (!item.duration) return start;
  const [hours, minutes] = String(item.time || "09:00").split(":").map(Number);
  const endMinutes = hours * 60 + minutes + Number(item.duration);
  return `${start}-${formatTime(`${String(Math.floor(endMinutes / 60) % 24).padStart(2, "0")}:${String(endMinutes % 60).padStart(2, "0")}`)}`;
}

function scheduleDetails(item) {
  return [item.batch, item.room, item.faculty].filter(Boolean).join(" · ");
}

function loadUserName() {
  try {
    const stored = localStorage.getItem(PROFILE_NAME_KEY)?.trim();
    if (stored) return stored;
    const entered = window.prompt("Welcome to Attendly. What is your name?")?.trim();
    const name = entered || "Student";
    localStorage.setItem(PROFILE_NAME_KEY, name);
    return name;
  } catch (error) {
    return "Student";
  }
}

function dayCodeForDate(value) {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][fromISODate(value).getDay()];
}

function slotKey(scheduleItem) {
  return `${scheduleItem.day || "day"}|${scheduleItem.time || "time"}`;
}

function scheduleRecordId(subject, date, slot) {
  return `scheduled-${subject.id}-${date}-${slot.replace(/[^a-z0-9]+/gi, "-")}`;
}

function attendanceStartDate(subject) {
  return subject.startDate && subject.startDate > TERM_START ? subject.startDate : TERM_START;
}

function attendanceDateIsActive(subject, date) {
  const startDate = attendanceStartDate(subject);
  return date >= startDate && (!subject.endDate || date <= subject.endDate);
}

function loadSubjects() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const isDemoSeed = Array.isArray(stored) && stored.length === 3 && stored.every((subject) => ["subject-design", "subject-economics", "subject-product"].includes(subject.id));
    if (Array.isArray(stored) && !isDemoSeed) return stored;
    if (Array.isArray(stored) && isDemoSeed && localStorage.getItem(TIMETABLE_VERSION_KEY) === TIMETABLE_VERSION) return stored;
    const timetableSubjects = createSeedSubjects();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timetableSubjects));
    localStorage.setItem(TIMETABLE_VERSION_KEY, TIMETABLE_VERSION);
    return timetableSubjects;
  } catch (error) {
    console.warn("Could not read attendance data", error);
  }
  return createSeedSubjects();
}

function saveSubjects() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.subjects));
}

function loadAttendanceGoal() {
  const stored = Number(localStorage.getItem(ATTENDANCE_GOAL_KEY));
  return Math.max(1, Math.min(100, stored || 75));
}

function timetableSlotsFromSubjects(subjects) {
  return subjects.flatMap((subject) => (subject.schedule || []).map((item) => ({
    subjectName: subject.name,
    day: item.day || "Mon",
    time: item.time || "09:00",
    details: scheduleDetails(item),
    duration: Number(item.duration) || 60
  })));
}

function createInitialTimetable() {
  return { id: "timetable-current", name: "Current weekly timetable", slots: timetableSlotsFromSubjects(createSeedSubjects()) };
}

function loadTimetables() {
  try {
    const stored = JSON.parse(localStorage.getItem(TIMETABLES_KEY));
    if (Array.isArray(stored)) return stored;
    const defaults = [createInitialTimetable()];
    localStorage.setItem(TIMETABLES_KEY, JSON.stringify(defaults));
    return defaults;
  } catch (error) {
    return [createInitialTimetable()];
  }
}

function saveTimetables() {
  localStorage.setItem(TIMETABLES_KEY, JSON.stringify(state.timetables));
}

function record(date, status) {
  return { id: uid("record"), date, status };
}

function timetableSlot(day, time, room, faculty, batch = "", duration = 60) {
  return { day, time, room, faculty, batch, duration };
}

function timetableSubject(id, name, color, schedule) {
  return { id: `subject-${id}`, name, requirement: 75, totalConducted: 0, color, schedule, startDate: TERM_START, endDate: "", records: [] };
}

function createSeedSubjects() {
  return [
    timetableSubject("oopl", "Object Oriented Programming Lab", "violet", [timetableSlot("Mon", "08:00", "CC-803", "ARA", "", 120)]),
    timetableSubject("coa", "Computer Organization and Architecture", "blue", [
      timetableSlot("Mon", "10:00", "CR-401", "VHD"), timetableSlot("Tue", "10:00", "CR-402", "VHD"), timetableSlot("Fri", "10:00", "CR-401", "VHD")
    ]),
    timetableSubject("ss", "Signals and Systems", "green", [
      timetableSlot("Mon", "11:00", "CR-401", "VSB"), timetableSlot("Tue", "11:00", "CR-402", "VSB"),
      timetableSlot("Mon", "12:00", "CR-401", "VSB", "B1", 120), timetableSlot("Tue", "12:00", "CR-401", "VSB", "B2", 120)
    ]),
    timetableSubject("dsal", "Data Structures and Algorithms Lab", "amber", [
      timetableSlot("Mon", "12:00", "CL-503", "PDO", "B2", 120), timetableSlot("Tue", "12:00", "CL-503", "PDO", "B1", 120)
    ]),
    timetableSubject("dsa", "Data Structures and Algorithms", "coral", [
      timetableSlot("Mon", "15:00", "CR-401", "PDO"), timetableSlot("Tue", "15:00", "CR-401", "PDO"), timetableSlot("Fri", "15:00", "CR-401", "PDO")
    ]),
    timetableSubject("dm", "Discrete Mathematics", "pink", [
      timetableSlot("Mon", "16:00", "CR-401", "SSU", "B1"), timetableSlot("Wed", "10:00", "CR-401", "SSU"),
      timetableSlot("Thu", "08:00", "CR-401", "SSU"), timetableSlot("Thu", "14:00", "CR-401", "SSU", "B2")
    ]),
    timetableSubject("tc", "Technical Communication", "blue", [
      timetableSlot("Mon", "16:00", "CR-401", "DKU", "B2"), timetableSlot("Tue", "16:00", "CR-401", "DKU", "B1")
    ]),
    timetableSubject("pem", "Principles of Economics and Management", "amber", [
      timetableSlot("Wed", "08:00", "CR-401", "MPA"), timetableSlot("Thu", "09:00", "CR-401", "MPA"), timetableSlot("Fri", "12:00", "CR-401", "MPA")
    ]),
    timetableSubject("ps", "Probability and Statistics", "green", [
      timetableSlot("Wed", "09:00", "CR-401", "KPA"), timetableSlot("Thu", "10:00", "CR-402", "KPA"),
      timetableSlot("Wed", "12:00", "CL-401", "KPA", "B1", 120), timetableSlot("Thu", "12:00", "CL-401", "KPA", "B2", 120)
    ]),
    timetableSubject("pp", "Programming with Python", "coral", [
      timetableSlot("Wed", "12:00", "CL-503", "ISA", "B2", 120), timetableSlot("Thu", "12:00", "CL-503", "ISA", "B1", 120), timetableSlot("Fri", "13:00", "CR-402", "ISA")
    ]),
    timetableSubject("oop", "Object Oriented Programming", "violet", [
      timetableSlot("Wed", "14:00", "CR-507", "NSH"), timetableSlot("Fri", "11:00", "CR-502", "NSH")
    ]),
    timetableSubject("qt01", "Survey of Quantum Technologies and Applications", "pink", [
      timetableSlot("Thu", "15:00", "CR-106", "BBO/TBA"), timetableSlot("Thu", "16:00", "CR-106", "BBO/TBA"), timetableSlot("Fri", "16:00", "CR-408", "BBO/TBA")
    ])
  ];
}

function getPalette(subject) {
  return palette[subject.color] || palette.violet;
}

function subjectVars(subject) {
  const colors = getPalette(subject);
  return `style="--subject-color:${colors.color};--subject-soft:${colors.soft}"`;
}

function subjectInitials(subject) {
  return subject.name.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase() || "?";
}

function getStats(subject) {
  const records = attendanceRecordsForStats(subject);
  const present = records.filter((item) => item.status === "present").length;
  const absent = records.filter((item) => item.status === "absent").length;
  const cancelled = records.filter((item) => item.status === "cancelled").length;
  const actualClasses = present + absent;
  const total = Math.max(Number(subject.totalConducted) || 0, actualClasses);
  const denominator = present + absent;
  const percentage = denominator ? Math.round((present / denominator) * 100) : 0;
  const requirement = Math.max(1, Math.min(100, Number(state.attendanceGoal) || 75));
  const below = denominator > 0 && percentage < requirement;
  const safeMisses = below || denominator === 0 ? 0 : Math.max(0, Math.floor((present / (requirement / 100)) - denominator + 0.000001));
  let recovery = null;
  if (denominator > 0 && below) {
    recovery = requirement >= 100 && absent > 0
      ? null
      : Math.max(1, Math.ceil(((requirement / 100) * denominator - present) / (1 - requirement / 100)));
  }
  const status = denominator === 0 ? "yellow" : percentage < requirement ? "red" : percentage < requirement + 5 ? "yellow" : "green";
  return { total, present, absent, cancelled, actualClasses, denominator, percentage, requirement, safeMisses, recovery, status, below };
}

function statusLabel(status) {
  return { green: "On track", yellow: "Watch", red: "Below target" }[status] || "Watch";
}

function statusRecordLabel(status) {
  return { present: "Present", absent: "Absent", cancelled: "Cancelled" }[status] || "Unknown";
}

function statusClass(status) {
  return status === "present" ? "present" : status === "absent" ? "absent" : "cancelled";
}

function scheduleText(subject) {
  const schedule = Array.isArray(subject.schedule) ? subject.schedule.filter((item) => item.day || item.time) : [];
  if (!schedule.length) return "Schedule not set";
  const first = schedule[0];
  const firstText = `${first.day || "Day"} ${formatScheduleTime(first)}`;
  return schedule.length > 1 ? `${firstText} +${schedule.length - 1}` : firstText;
}

function scheduleItemsForDate(subject, date) {
  if (!attendanceDateIsActive(subject, date)) return [];
  return (subject.schedule || []).filter((item) => item.day === dayCodeForDate(date) && (item.day || item.time));
}

function storedRecordForSlot(subject, date, slot, dayItems) {
  const records = Array.isArray(subject.records) ? subject.records : [];
  return records.find((item) => item.date === date && item.slot === slot)
    || (dayItems.length === 1 ? records.find((item) => item.date === date && !item.slot) : null);
}

function scheduledAttendanceForDate(subject, date) {
  const dayItems = scheduleItemsForDate(subject, date);
  return dayItems.map((item) => {
    const slot = slotKey(item);
    const stored = storedRecordForSlot(subject, date, slot, dayItems);
    return {
      id: stored?.id || scheduleRecordId(subject, date, slot),
      date,
      slot,
      status: stored?.status || "present",
      scheduleItem: item,
      generated: !stored
    };
  });
}

function attendanceRecordsForDate(subject, date) {
  const scheduled = scheduledAttendanceForDate(subject, date);
  const usedRecordIds = new Set(scheduled.filter((item) => !item.generated).map((item) => item.id));
  const legacy = (subject.records || []).filter((item) => item.date === date && !usedRecordIds.has(item.id) && attendanceDateIsActive(subject, date));
  return [...scheduled, ...legacy];
}

function attendanceRecordsThrough(subject, endDate = toISODate(new Date())) {
  const startDate = attendanceStartDate(subject);
  if (startDate > endDate) return [];
  const records = [];
  const cursor = fromISODate(startDate);
  const lastDate = fromISODate(endDate);
  while (cursor <= lastDate) {
    records.push(...attendanceRecordsForDate(subject, toISODate(cursor)));
    cursor.setDate(cursor.getDate() + 1);
  }
  return records;
}

function attendanceRecordsForStats(subject) {
  const today = toISODate(new Date());
  const records = attendanceRecordsThrough(subject, today);
  const knownIds = new Set(records.map((item) => item.id));
  const futureOverrides = (subject.records || []).filter((item) => item.date > today && !knownIds.has(item.id) && attendanceDateIsActive(subject, item.date));
  return [...records, ...futureOverrides].flatMap((recordItem) => recordItem.status === "cancelled" && recordItem.rescheduledStatus
    ? [{ ...recordItem, status: recordItem.rescheduledStatus }]
    : [recordItem]);
}

function renderStaticIcons() {
  document.querySelectorAll("[data-icon]").forEach((element) => {
    const name = element.dataset.icon;
    element.innerHTML = icon(name);
  });
}

function renderSidebar() {
  document.querySelector("#subjectCount").textContent = state.subjects.length;
  const list = document.querySelector("#sidebarSubjects");
  list.innerHTML = state.subjects.length
    ? state.subjects.map((subject) => `<button class="sidebar-subject" type="button" data-open-subject="${subject.id}"><span class="subject-swatch" ${subjectVars(subject)}></span><span>${escapeHTML(subject.name)}</span></button>`).join("")
    : `<div class="empty-sidebar">No subjects yet. Add your first class to get started.</div>`;
  const profileName = document.querySelector("#profileName");
  if (profileName) profileName.textContent = state.userName;
  const avatar = document.querySelector(".avatar");
  if (avatar) avatar.textContent = state.userName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "S";
  document.querySelectorAll(".nav-item").forEach((button) => button.classList.toggle("is-active", button.dataset.view === state.view));
}

function aggregateStats() {
  const all = state.subjects.map(getStats);
  const present = all.reduce((sum, item) => sum + item.present, 0);
  const absent = all.reduce((sum, item) => sum + item.absent, 0);
  const total = all.reduce((sum, item) => sum + item.total, 0);
  return {
    present,
    absent,
    total,
    percentage: present + absent ? Math.round((present / (present + absent)) * 100) : 0,
    safeMisses: all.reduce((sum, item) => sum + item.safeMisses, 0),
    trackedSubjects: state.subjects.length
  };
}

function renderOverview() {
  const aggregate = aggregateStats();
  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";
  const subjectsMarkup = state.subjects.length
    ? `<div class="subject-grid">${state.subjects.map(renderSubjectCard).join("")}</div>`
    : `<div class="empty-state"><div class="empty-illustration">${icon("book")}</div><h3>Your attendance space is ready</h3><p>Add a subject to start tracking classes, attendance targets, and your safe-to-miss buffer.</p><button class="button button-primary" type="button" data-open-create>${icon("plus")}<span>Add your first subject</span></button></div>`;

  return `
    <div class="page-heading">
      <div><span class="eyebrow">${greeting}, ${escapeHTML(state.userName)}</span><h1>Your attendance, at a glance.</h1><p>A clear view of where you stand, and what to do next.</p></div>
      <button class="button button-primary" type="button" data-open-create>${icon("plus")}<span>Add subject</span></button>
    </div>
    <section class="insight-banner" style="--ring-progress:${aggregate.percentage}%">
      <div class="insight-copy"><span class="eyebrow">Semester pulse</span><h2>${aggregate.trackedSubjects ? insightHeadline(aggregate.percentage) : "Set up your first subject to see the full picture."}</h2><p>${aggregate.trackedSubjects ? `Across ${aggregate.trackedSubjects} subject${aggregate.trackedSubjects === 1 ? "" : "s"}, you have ${aggregate.absent} absence${aggregate.absent === 1 ? "" : "s"} logged. Keep the rhythm going.` : "Your data stays private on this device and updates instantly as you log classes."}</p></div>
      <div class="insight-rate"><div class="rate-ring"><div class="rate-ring-content"><strong>${aggregate.percentage}%</strong><span>attendance</span></div></div><div class="rate-caption"><strong>Overall health</strong><span>${aggregate.percentage >= 75 ? "Looking steady this semester." : "A little focus now will help."}</span></div></div>
    </section>
    <section class="metrics-grid" aria-label="Attendance summary">
      ${metricCard("chart", "Overall attendance", `${aggregate.percentage}%`, aggregate.total ? `${aggregate.present} present of ${aggregate.present + aggregate.absent}` : "No classes logged")}
      ${metricCard("calendar", "Classes tracked", aggregate.total, aggregate.total ? `${aggregate.absent} absent · ${aggregate.present} present` : "Add a subject to begin")}
      ${metricCard("users", "Active subjects", aggregate.trackedSubjects, aggregate.trackedSubjects ? "Across this semester" : "Ready when you are")}
      ${metricCard("target", "Safe buffer", aggregate.safeMisses, aggregate.safeMisses === 1 ? "class left across subjects" : "classes left across subjects")}
    </section>
    <section class="subject-section"><div class="section-heading"><div><h2>Subject overview</h2><p>Tap a subject to manage its details and history.</p></div><div class="section-heading-actions">${state.subjects.length ? `<span class="section-count">${state.subjects.length} tracked</span><button class="section-link" type="button" data-view="timetable">Weekly timetable ${icon("arrow-right")}</button>` : ""}</div></div>${subjectsMarkup}</section>
  `;
}

function insightHeadline(percentage) {
  if (percentage >= 90) return "You’re building a very strong attendance streak.";
  if (percentage >= 80) return "You’re in a great place. Keep the momentum going.";
  if (percentage >= 75) return "You’re on track. A little consistency goes a long way.";
  return "A small reset now can protect the rest of your semester.";
}

function metricCard(iconName, label, value, detail) {
  return `<article class="metric-card"><div class="metric-top"><span>${label}</span><span class="metric-icon">${icon(iconName)}</span></div><div class="metric-value">${value}${typeof value === "number" ? "" : ""}</div><span class="metric-detail">${detail}</span></article>`;
}

function renderSubjectCard(subject) {
  const stats = getStats(subject);
  const safeText = stats.below ? "0 classes" : `${stats.safeMisses} ${stats.safeMisses === 1 ? "class" : "classes"}`;
  const recoveryText = stats.below ? (stats.recovery === null ? "Not recoverable" : `${stats.recovery} ${stats.recovery === 1 ? "class" : "classes"}`) : "On track";
  const recoveryClass = stats.below ? "recovery" : "safe";
  return `<article class="subject-card" ${subjectVars(subject)} data-open-subject="${subject.id}">
    <div class="card-head"><div class="subject-identity"><div class="subject-badge">${escapeHTML(subjectInitials(subject))}</div><div><div class="subject-name">${escapeHTML(subject.name)}</div><div class="subject-meta"><span>${escapeHTML(scheduleText(subject))}</span><span class="schedule-dot"></span><span>${stats.requirement}% required</span></div></div></div><div style="display:flex;align-items:center;gap:6px"><span class="status-pill status-${stats.status}"><span class="status-dot"></span>${statusLabel(stats.status)}</span><button class="card-menu" type="button" data-open-subject="${subject.id}" aria-label="Open ${escapeHTML(subject.name)}">${icon("more")}</button></div></div>
    <div class="card-progress"><div class="progress-track"><div class="progress-fill ${stats.status}" style="width:${Math.min(100, stats.percentage)}%"></div></div><span class="progress-value">${stats.percentage}%</span></div><div class="progress-label"><span>${stats.present} present · ${stats.absent} absent</span><span>${stats.total} total</span></div>
    <div class="card-footer"><div class="card-stat"><span class="card-stat-label">Can miss before target</span><span class="card-stat-value ${stats.below ? "caution" : "safe"}">${safeText}</span></div><div class="card-stat"><span class="card-stat-label">Attend to recover</span><span class="card-stat-value ${recoveryClass}">${recoveryText}</span></div></div><div class="card-action"><button class="log-link" type="button" data-open-subject="${subject.id}">Log a class ${icon("arrow-right")}</button></div>
  </article>`;
}

function calendarRecordsForDate(date) {
  return state.subjects.flatMap((subject) => attendanceRecordsForDate(subject, date).map((recordItem) => ({ subject, record: recordItem })));
}

function renderCalendar() {
  const monthDate = new Date(state.calendarYear, state.calendarMonth, 1);
  const monthLabel = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(monthDate);
  const firstDayOffset = (monthDate.getDay() + 6) % 7;
  const daysInMonth = new Date(state.calendarYear, state.calendarMonth + 1, 0).getDate();
  const gridSize = firstDayOffset + daysInMonth > 35 ? 42 : 35;
  const cells = [];
  for (let index = 0; index < gridSize; index += 1) {
    const dayNumber = index - firstDayOffset + 1;
    const date = new Date(state.calendarYear, state.calendarMonth, dayNumber);
    const iso = toISODate(date);
    const records = calendarRecordsForDate(iso);
    const isCurrentMonth = date.getMonth() === state.calendarMonth;
    const isToday = iso === toISODate(new Date());
    const visibleRecords = records.slice(0, 3);
    cells.push(`<button class="calendar-day ${isCurrentMonth ? "" : "is-muted"} ${iso === state.selectedDate ? "is-selected" : ""} ${isToday ? "is-today" : ""}" type="button" data-calendar-date="${iso}"><span class="day-number">${date.getDate()}</span><span class="day-records">${visibleRecords.map(({ subject, record: recordItem }) => `<span class="calendar-record"><span class="record-dot ${statusClass(recordItem.status)}"></span><span>${escapeHTML(subject.name)}</span></span>`).join("")}${records.length > 3 ? `<span class="record-more">+${records.length - 3} more</span>` : ""}</span></button>`);
  }
  const selectedRecords = calendarRecordsForDate(state.selectedDate);
  const selectedDateLabel = formatDate(state.selectedDate, { weekday: "long", month: "long", day: "numeric" });
  const selectedDayMarkup = selectedRecords.length
    ? `<div class="details-list">${selectedRecords.map(({ subject, record: recordItem }) => `<div class="day-detail-row"><span class="detail-swatch" ${subjectVars(subject)}></span><div class="day-detail-copy"><strong>${escapeHTML(subject.name)}</strong><span>${recordItem.scheduleItem ? `${formatScheduleTime(recordItem.scheduleItem)}${scheduleDetails(recordItem.scheduleItem) ? ` · ${escapeHTML(scheduleDetails(recordItem.scheduleItem))}` : ""}` : recordItem.status === "cancelled" ? "Class cancelled" : "Class logged"}</span></div><span class="record-status ${statusClass(recordItem.status)}">${statusRecordLabel(recordItem.status)}</span></div>`).join("")}</div>`
    : `<div class="details-empty">Nothing logged on this day.<br />Select a subject to add attendance.</div>`;

  return `<div class="calendar-toolbar"><div><span class="eyebrow">All attendance</span><h1>Calendar</h1><p>Every class, in one quiet timeline.</p></div><div class="calendar-actions"><button class="calendar-nav" type="button" data-calendar-prev aria-label="Previous month">${icon("chevron-left")}</button><select class="month-select" id="monthSelect" aria-label="Select month">${monthOptions()}</select><button class="calendar-nav" type="button" data-calendar-next aria-label="Next month">${icon("chevron-right")}</button><button class="button button-secondary button-small" type="button" data-calendar-today>Today</button></div></div><div class="calendar-layout"><section class="calendar-card"><div class="weekday-grid"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div><div class="month-grid">${cells.join("")}</div></section><aside class="date-details"><span class="details-kicker">Selected day</span><h2>${selectedDateLabel}</h2><p class="details-summary">${selectedRecords.length ? `${selectedRecords.length} class${selectedRecords.length === 1 ? "" : "es"} logged` : "No attendance logged"}</p>${selectedDayMarkup}</aside></div>`;
}

const timetableDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function startOfWeek(value) {
  const date = fromISODate(value);
  const day = date.getDay();
  date.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
  return date;
}

function timetableWeekDates() {
  const monday = startOfWeek(state.timetableDate);
  return timetableDays.map((day, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return { day, date, iso: toISODate(date) };
  });
}

function timetableEntriesForDay(day) {
  return state.subjects.flatMap((subject) => (subject.schedule || [])
    .filter((item) => item.day === day)
    .map((item) => ({ subject, item })))
    .sort((left, right) => (left.item.time || "99:99").localeCompare(right.item.time || "99:99"));
}

function renderTimetableEntry({ subject, item, date }) {
  const stats = getStats(subject);
  const attendance = scheduledAttendanceForDate(subject, date).find((recordItem) => recordItem.slot === slotKey(item));
  const classStatus = attendance?.status || "present";
  return `<article class="timetable-entry" ${subjectVars(subject)}><button class="timetable-entry-open" type="button" data-open-subject="${subject.id}" title="Open ${escapeHTML(subject.name)}"><span class="timetable-entry-time">${escapeHTML(formatScheduleTime(item))}</span><strong>${escapeHTML(subject.name)}</strong><span class="timetable-entry-meta">${stats.present}/${stats.denominator || 0} present · ${stats.percentage}% overall</span>${scheduleDetails(item) ? `<span class="timetable-entry-detail">${escapeHTML(scheduleDetails(item))}</span>` : ""}</button><div class="timetable-entry-footer"><div class="class-status-actions"><button class="class-status present ${classStatus === "present" ? "is-selected" : ""}" type="button" data-scheduled-status="present" data-subject-id="${subject.id}" data-attendance-date="${date}" data-attendance-slot="${escapeHTML(slotKey(item))}">Present</button><button class="class-status absent ${classStatus === "absent" ? "is-selected" : ""}" type="button" data-scheduled-status="absent" data-subject-id="${subject.id}" data-attendance-date="${date}" data-attendance-slot="${escapeHTML(slotKey(item))}">Absent</button><button class="class-status cancelled ${classStatus === "cancelled" ? "is-selected" : ""}" type="button" data-scheduled-status="cancelled" data-subject-id="${subject.id}" data-attendance-date="${date}" data-attendance-slot="${escapeHTML(slotKey(item))}" aria-label="Mark cancelled">Cancel</button></div><span>${stats.requirement}% target</span></div></article>`;
}

function renderTimetable() {
  const week = timetableWeekDates();
  const totalSlots = week.reduce((sum, item) => sum + timetableEntriesForDay(item.day).filter(({ subject }) => attendanceDateIsActive(subject, item.iso)).length, 0);
  const scheduledSubjects = new Set(state.subjects.filter((subject) => (subject.schedule || []).some((item) => item.day)).map((subject) => subject.id));
  const weekStart = week[0].iso;
  const weekEnd = week[week.length - 1].iso;
  const weekLabel = `${formatDate(weekStart, { month: "short", day: "numeric" })} – ${formatDate(weekEnd, { month: "short", day: "numeric", year: "numeric" })}`;
  const today = toISODate(new Date());

  return `<div class="timetable-toolbar"><div><span class="eyebrow">Your weekly rhythm</span><h1>Timetable</h1><p>See every class at a glance, with attendance health beside it.</p></div><div class="timetable-actions"><button class="calendar-nav" type="button" data-timetable-prev aria-label="Previous week">${icon("chevron-left")}</button><div class="week-label"><strong>${weekLabel}</strong><span>${weekStart === toISODate(startOfWeek(today)) ? "Current week" : "Weekly view"}</span></div><button class="calendar-nav" type="button" data-timetable-next aria-label="Next week">${icon("chevron-right")}</button><button class="button button-secondary button-small" type="button" data-timetable-today>Today</button></div></div><div class="timetable-summary"><div><span class="summary-icon">${icon("clock")}</span><span><strong>${totalSlots} scheduled class${totalSlots === 1 ? "" : "es"}</strong><small>This week</small></span></div><div><span class="summary-icon">${icon("book")}</span><span><strong>${scheduledSubjects.size} subject${scheduledSubjects.size === 1 ? "" : "s"} on your timetable</strong><small>Click a class to edit or log attendance</small></span></div><button class="button button-primary button-small" type="button" data-open-create>${icon("plus")}<span>Add subject</span></button></div><section class="timetable-panel"><div class="timetable-scroll"><div class="timetable-grid">${week.map(({ day, date, iso }) => { const entries = timetableEntriesForDay(day).filter(({ subject }) => attendanceDateIsActive(subject, iso)).map((entry) => ({ ...entry, date: iso })); return `<section class="timetable-day ${iso === today ? "is-today" : ""}"><header class="timetable-day-header"><div><span>${day}</span><strong>${date.getDate()}</strong></div><small>${new Intl.DateTimeFormat(undefined, { month: "short" }).format(date)}</small></header><div class="timetable-day-list">${entries.length ? entries.map(renderTimetableEntry).join("") : `<div class="timetable-empty"><span>${icon("clock")}</span><p>No classes</p><small>Enjoy the breathing room.</small></div>`}</div></section>`; }).join("")}</div></div><div class="timetable-legend"><span><i class="legend-dot green"></i>On track</span><span><i class="legend-dot yellow"></i>Watch</span><span><i class="legend-dot red"></i>Below target</span></div></section>`;
}

function renderAttendance() {
  const rows = state.subjects.map((subject) => {
    const stats = getStats(subject);
    const safeMisses = stats.below ? "0" : String(stats.safeMisses);
    const recovery = stats.below ? (stats.recovery === null ? "—" : String(stats.recovery)) : "—";
    return `<tr><th><div class="attendance-subject"><span class="subject-swatch" ${subjectVars(subject)}></span><span>${escapeHTML(subject.name)}</span></div></th><td>${stats.total}</td><td>${stats.present}</td><td>${stats.absent}</td><td><strong>${stats.percentage}%</strong></td><td>${stats.requirement}%</td><td class="attendance-number ${stats.below ? "caution" : "safe"}">${safeMisses}</td><td class="attendance-number ${stats.below ? "recovery" : "safe"}">${recovery}</td><td><span class="status-pill status-${stats.status}"><span class="status-dot"></span>${statusLabel(stats.status)}</span></td></tr>`;
  }).join("");
  const body = rows || `<tr><td class="attendance-empty" colspan="9">No subjects yet. Add a subject or apply a timetable to start tracking attendance.</td></tr>`;
  return `<div class="page-heading attendance-heading"><div><span class="eyebrow">Subject by subject</span><h1>Your Attendance</h1><p>Every limit follows your profile goal of ${state.attendanceGoal}%.</p></div><button class="button button-secondary button-small" type="button" data-open-profile>${icon("target")}<span>Edit goal</span></button></div><div class="attendance-table-wrap"><table class="attendance-table"><thead><tr><th>Subject</th><th>Total classes</th><th>Attended</th><th>Missed</th><th>Attendance</th><th>Goal</th><th>Can still miss</th><th>Need attend</th><th>Status</th></tr></thead><tbody>${body}</tbody></table></div>`;
}

function cancelledClasses() {
  return state.subjects.flatMap((subject) => (subject.records || [])
    .filter((recordItem) => recordItem.status === "cancelled")
    .map((recordItem) => {
      const record = attendanceRecordsForDate(subject, recordItem.date).find((item) => item.id === recordItem.id) || recordItem;
      return { subject, record };
    }))
    .sort((left, right) => right.record.date.localeCompare(left.record.date) || (right.record.slot || "").localeCompare(left.record.slot || ""));
}

function renderCancelledClasses() {
  const classes = cancelledClasses();
  const content = classes.length ? `<div class="cancelled-list">${classes.map(({ subject, record }) => {
    const rescheduled = record.rescheduledStatus;
    const detail = record.scheduleItem ? `${formatScheduleTime(record.scheduleItem)}${scheduleDetails(record.scheduleItem) ? ` · ${escapeHTML(scheduleDetails(record.scheduleItem))}` : ""}` : "Cancelled class";
    return `<article class="cancelled-card" ${subjectVars(subject)}><div class="cancelled-card-main"><span class="detail-swatch"></span><div><strong>${escapeHTML(subject.name)}</strong><span>${formatDate(record.date, { weekday: "long", month: "short", day: "numeric", year: "numeric" })} · ${detail}</span></div><span class="record-status cancelled">Cancelled</span></div><div class="reschedule-question"><div><strong>Did you attend the rescheduled class?</strong><span>${rescheduled ? `Marked ${statusRecordLabel(rescheduled).toLowerCase()}.` : "Choose an answer to update attendance."}</span></div><div class="reschedule-actions"><button class="reschedule-status present ${rescheduled === "present" ? "is-selected" : ""}" type="button" data-rescheduled-status="present" data-subject-id="${subject.id}" data-attendance-date="${record.date}" data-attendance-slot="${escapeHTML(record.slot || "")}">Present</button><button class="reschedule-status absent ${rescheduled === "absent" ? "is-selected" : ""}" type="button" data-rescheduled-status="absent" data-subject-id="${subject.id}" data-attendance-date="${record.date}" data-attendance-slot="${escapeHTML(record.slot || "")}">Absent</button></div></div></article>`;
  }).join("")}</div>` : `<div class="empty-state"><div class="empty-illustration">${icon("close")}</div><h3>No cancelled classes</h3><p>Classes you mark as cancelled will appear here so you can record the rescheduled result.</p></div>`;
  return `<div class="page-heading"><div><span class="eyebrow">Rescheduled follow-up</span><h1>Cancelled Classes</h1><p>Review cancelled classes and record whether you attended the replacement class.</p></div></div>${content}`;
}

function timetableForId(id) {
  return state.timetables.find((timetable) => timetable.id === id);
}

function renderDefaultTimetableRow(slot = {}) {
  return `<div class="timetable-editor-row" data-timetable-row><input class="input" name="timetableSubject" required placeholder="Subject name" value="${escapeHTML(slot.subjectName || "")}" /><select class="select" name="timetableDay" required>${timetableDays.map((day) => `<option value="${day}" ${slot.day === day ? "selected" : ""}>${day}</option>`).join("")}</select><input class="input" name="timetableTime" required type="time" value="${escapeHTML(slot.time || "09:00")}" /><input class="input timetable-editor-detail" name="timetableDetails" placeholder="Room or note (optional)" value="${escapeHTML(slot.details || "")}" /><button class="icon-button" type="button" data-remove-timetable-row aria-label="Remove class">${icon("trash")}</button></div>`;
}

function readTimetableForm(form) {
  return [...form.querySelectorAll("[data-timetable-row]")].map((row) => ({
    subjectName: row.querySelector('[name="timetableSubject"]')?.value.trim() || "",
    day: row.querySelector('[name="timetableDay"]')?.value || "",
    time: row.querySelector('[name="timetableTime"]')?.value || "",
    details: row.querySelector('[name="timetableDetails"]')?.value.trim() || "",
    duration: 60
  })).filter((slot) => slot.subjectName && slot.day && slot.time);
}

function renderDefaultTimetableEditor() {
  const isNew = state.editingTimetableId === "new";
  const timetable = timetableForId(state.editingTimetableId) || (isNew ? { name: "", slots: [{ subjectName: "", day: "Mon", time: "09:00", details: "" }] } : null);
  if (!timetable) return "";
  const slots = timetable.slots?.length ? timetable.slots : [{ subjectName: "", day: "Mon", time: "09:00", details: "" }];
  return `<form class="timetable-editor" id="timetableForm" data-timetable-id="${isNew ? "" : escapeHTML(timetable.id)}"><div class="timetable-editor-heading"><div><h2>${isNew ? "Create a timetable" : "Edit timetable"}</h2><p>Add each class once. This Monday–Sunday pattern repeats weekly.</p></div><button class="close-button" type="button" data-cancel-timetable aria-label="Close editor">${icon("close")}</button></div><div class="field"><label for="timetableName">Timetable name</label><input class="input" id="timetableName" name="timetableName" required placeholder="e.g. Semester III" value="${escapeHTML(timetable.name || "")}" /></div><div class="timetable-editor-label"><span>Classes</span><span>Subject · day · time</span></div><div class="timetable-editor-rows" id="timetableEditorRows">${slots.map(renderDefaultTimetableRow).join("")}</div><button class="add-schedule" type="button" data-add-timetable-row>${icon("plus")} Add class</button><div class="timetable-editor-footer"><button class="button button-secondary button-small" type="button" data-cancel-timetable>Cancel</button><button class="button button-primary button-small" type="submit">${icon("check")} Save timetable</button></div></form>`;
}

function renderDefaultTimetables() {
  const cards = state.timetables.length ? state.timetables.map((timetable) => {
    const subjectCount = new Set((timetable.slots || []).map((slot) => slot.subjectName.trim().toLowerCase()).filter(Boolean)).size;
    const active = timetable.id === state.activeTimetableId;
    return `<article class="default-timetable-card ${active ? "is-active" : ""}"><div class="timetable-card-header"><div><span class="eyebrow">Weekly pattern</span><h2>${escapeHTML(timetable.name)}</h2></div>${active ? `<span class="active-chip">Active</span>` : ""}</div><p>${timetable.slots?.length || 0} scheduled classes · ${subjectCount} subject${subjectCount === 1 ? "" : "s"}</p><div class="timetable-card-actions"><button class="button button-secondary button-small" type="button" data-edit-timetable="${escapeHTML(timetable.id)}">${icon("pencil")} Edit</button><button class="button ${active ? "button-secondary" : "button-primary"} button-small" type="button" data-apply-timetable="${escapeHTML(timetable.id)}">${icon("check")} ${active ? "Applied" : "Apply"}</button></div></article>`;
  }).join("") : `<div class="empty-state"><div class="empty-illustration">${icon("book")}</div><h3>No default timetables yet</h3><p>Create a Monday–Sunday pattern and apply it whenever you need.</p></div>`;
  return `<div class="page-heading"><div><span class="eyebrow">Weekly templates</span><h1>Default Timetables</h1><p>Save patterns once, then apply one to your active weekly schedule.</p></div><button class="button button-primary button-small" type="button" data-new-timetable>${icon("plus")}<span>New timetable</span></button></div><div class="default-timetable-list">${cards}</div>${state.editingTimetableId ? renderDefaultTimetableEditor() : ""}`;
}

function monthOptions() {
  const options = [];
  for (let offset = -6; offset <= 6; offset += 1) {
    const date = new Date(state.calendarYear, state.calendarMonth + offset, 1);
    const value = `${date.getFullYear()}-${date.getMonth()}`;
    const selected = date.getFullYear() === state.calendarYear && date.getMonth() === state.calendarMonth;
    options.push(`<option value="${value}" ${selected ? "selected" : ""}>${new Intl.DateTimeFormat(undefined, { month: "short", year: "numeric" }).format(date)}</option>`);
  }
  return options.join("");
}

function renderApp() {
  const view = document.querySelector("#appView");
  view.innerHTML = state.view === "overview" ? renderOverview()
    : state.view === "timetable" ? renderTimetable()
      : state.view === "default-timetables" ? renderDefaultTimetables()
        : state.view === "attendance" ? renderAttendance()
          : state.view === "cancelled" ? renderCancelledClasses()
          : renderCalendar();
  document.querySelector("#breadcrumbTitle").textContent = state.view === "overview" ? "Overview"
    : state.view === "timetable" ? "Timetable"
      : state.view === "default-timetables" ? "Default Timetables"
        : state.view === "attendance" ? "Your Attendance"
          : state.view === "cancelled" ? "Cancelled Classes"
          : "Calendar";
  renderSidebar();
}

function blankSubject() {
  return { id: "", name: "", requirement: 75, totalConducted: 0, color: "violet", schedule: [{ day: "Mon", time: "09:00" }], startDate: "", endDate: "", records: [] };
}

function renderColorOptions(subject) {
  return `<div class="color-options">${Object.entries(palette).map(([name, colors]) => `<button class="color-option ${subject.color === name ? "is-selected" : ""}" type="button" data-color-option="${name}" aria-label="${name}" style="--option-color:${colors.color};--option-soft:${colors.soft}"><span></span></button>`).join("")}</div>`;
}

function renderScheduleRows(subject) {
  const schedule = subject.schedule && subject.schedule.length ? subject.schedule : [{ day: "Mon", time: "09:00" }];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return schedule.map((item) => `<div class="schedule-row" data-room="${escapeHTML(item.room || "")}" data-faculty="${escapeHTML(item.faculty || "")}" data-batch="${escapeHTML(item.batch || "")}" data-duration="${Number(item.duration) || 60}"><select class="select" name="scheduleDay"><option value="">Day</option>${days.map((day) => `<option value="${day}" ${item.day === day ? "selected" : ""}>${day}</option>`).join("")}</select><input class="input" type="time" name="scheduleTime" value="${escapeHTML(item.time || "09:00")}" /><button class="icon-button" type="button" data-remove-schedule aria-label="Remove schedule">${icon("trash")}</button></div>`).join("");
}

function renderHistory(subject) {
  const records = attendanceRecordsThrough(subject).sort((a, b) => b.date.localeCompare(a.date) || (b.slot || "").localeCompare(a.slot || ""));
  if (!records.length) return `<div class="history-empty">No classes logged yet. Use the quick log above after each class.</div>`;
  return records.map((recordItem) => {
    const date = fromISODate(recordItem.date);
    const detail = recordItem.scheduleItem ? `${formatScheduleTime(recordItem.scheduleItem)}${scheduleDetails(recordItem.scheduleItem) ? ` · ${scheduleDetails(recordItem.scheduleItem)}` : ""}` : recordItem.status === "cancelled" ? "This class was cancelled" : "Attendance record";
    return `<div class="history-row"><div class="history-date"><strong>${date.getDate()}</strong><span>${new Intl.DateTimeFormat(undefined, { month: "short" }).format(date)}</span></div><div class="history-copy"><strong>${new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(date)}</strong><span>${detail}</span></div><select class="history-status-select" data-history-status="${recordItem.id}" data-history-date="${recordItem.date}" data-history-slot="${escapeHTML(recordItem.slot || "")}" data-history-scheduled="${recordItem.scheduleItem ? "true" : "false"}" aria-label="Update status for ${formatDate(recordItem.date)}"><option value="present" ${recordItem.status === "present" ? "selected" : ""}>Present</option><option value="absent" ${recordItem.status === "absent" ? "selected" : ""}>Absent</option><option value="cancelled" ${recordItem.status === "cancelled" ? "selected" : ""}>Cancelled</option></select>${recordItem.generated ? "" : `<button class="history-delete" type="button" data-history-delete="${recordItem.id}" aria-label="Delete attendance record">${icon("trash")}</button>`}</div>`;
  }).join("");
}

function renderDrawer() {
  if (state.drawerMode === "profile") {
    renderProfileDrawer();
    return;
  }
  const isCreate = state.drawerMode === "create";
  const subject = isCreate ? blankSubject() : state.subjects.find((item) => item.id === state.editingSubjectId);
  if (!subject) return;
  const title = isCreate ? "Add a subject" : subject.name;
  const subtitle = isCreate ? "Set up a class in a few quick details." : `${getStats(subject).percentage}% attendance · ${getStats(subject).requirement}% required`;
  document.querySelector("#drawerContent").innerHTML = `<div class="drawer-inner"><div class="drawer-header"><div class="drawer-title-row"><div class="drawer-icon">${icon(isCreate ? "plus" : "book")}</div><div><h2>${escapeHTML(title)}</h2><p>${escapeHTML(subtitle)}</p></div></div><div class="drawer-header-actions">${!isCreate ? `<button class="drawer-delete-button" type="button" data-delete-subject>${icon("trash")}<span>Delete</span></button>` : ""}<button class="close-button" type="button" data-close-drawer aria-label="Close">${icon("close")}</button></div></div><form id="subjectForm" data-subject-id="${escapeHTML(subject.id)}"><div class="drawer-scroll"><section class="form-section"><div class="form-section-heading"><h3>Subject details</h3><span>Required</span></div><div class="field-grid"><div class="field"><label for="subjectName">Subject name</label><input class="input" id="subjectName" name="name" required placeholder="e.g. Interaction Design" value="${escapeHTML(subject.name)}" /></div><div class="field"><label for="requirement">Attendance goal</label><input class="input" id="requirement" name="requirement" type="number" value="${state.attendanceGoal}" readonly /><span class="input-hint">Set globally from your Profile.</span></div></div><div class="field" style="margin-top:12px"><label for="totalConducted">Total classes conducted</label><input class="input" id="totalConducted" name="totalConducted" type="number" min="0" step="1" value="${escapeHTML(subject.totalConducted)}" /><span class="input-hint">Use this when you are starting with classes already completed.</span></div><div class="field" style="margin-top:14px"><label>Accent color</label>${renderColorOptions(subject)}<input type="hidden" name="color" id="subjectColor" value="${escapeHTML(subject.color)}" /></div></section><section class="form-section"><div class="form-section-heading"><h3>Class schedule</h3><span>Optional</span></div><div class="schedule-list" id="scheduleList">${renderScheduleRows(subject)}</div><button class="add-schedule" type="button" data-add-schedule>${icon("plus")} Add another day</button></section><section class="form-section"><div class="form-section-heading"><h3>Semester dates</h3><span>Optional</span></div><div class="date-grid"><div class="field"><label for="startDate">Start date</label><input class="input" id="startDate" name="startDate" type="date" value="${escapeHTML(subject.startDate || "")}" /></div><div class="field"><label for="endDate">End date</label><input class="input" id="endDate" name="endDate" type="date" value="${escapeHTML(subject.endDate || "")}" /></div></div></section>${!isCreate ? `<section class="form-section log-box"><div class="form-section-heading"><h3>Log a class</h3><span>Quick update</span></div><div class="log-controls"><input class="input" id="logDate" type="date" value="${toISODate(new Date())}" /><div class="status-buttons"><button class="status-button present ${state.logStatus === "present" ? "is-selected" : ""}" type="button" data-log-status="present"><span class="status-dot"></span>Present</button><button class="status-button absent ${state.logStatus === "absent" ? "is-selected" : ""}" type="button" data-log-status="absent"><span class="status-dot"></span>Absent</button><button class="status-button cancelled ${state.logStatus === "cancelled" ? "is-selected" : ""}" type="button" data-log-status="cancelled"><span class="status-dot"></span>Cancelled</button></div></div><div class="log-submit"><button class="button button-primary button-small" type="button" data-log-submit>${icon("check")} Save attendance</button></div></section><section class="form-section"><div class="form-section-heading"><h3>Attendance history</h3><span>${(subject.records || []).length} logged</span></div><div class="history-list">${renderHistory(subject)}</div></section>` : `<section class="form-section"><div class="history-empty">Save this subject first, then attendance history and quick logging will appear here.</div></section>`}</div><div class="drawer-footer"><span class="footer-hint">${!isCreate ? "Delete is available at the top of this panel." : "Your subject will appear in the timetable after you add a schedule."}</span><div class="footer-actions"><button class="button button-secondary button-small" type="button" data-close-drawer>Cancel</button><button class="button button-primary button-small" type="submit">${icon("check")} ${isCreate ? "Create subject" : "Save changes"}</button></div></div></form></div>`;
  document.querySelector("#subjectDrawer").setAttribute("aria-hidden", "false");
}

function renderProfileDrawer() {
  const presets = [75, 80, 85, 90];
  const presetValue = presets.includes(state.attendanceGoal) ? String(state.attendanceGoal) : "custom";
  document.querySelector("#drawerContent").innerHTML = `<div class="drawer-inner"><div class="drawer-header"><div class="drawer-title-row"><div class="drawer-icon">${icon("target")}</div><div><h2>Profile</h2><p>Your name and attendance goal.</p></div></div><button class="close-button" type="button" data-close-drawer aria-label="Close">${icon("close")}</button></div><form id="profileForm"><div class="drawer-scroll"><section class="form-section"><div class="form-section-heading"><h3>Personal details</h3><span>Saved locally</span></div><div class="field"><label for="profileNameInput">Your name</label><input class="input" id="profileNameInput" name="name" required value="${escapeHTML(state.userName)}" /></div></section><section class="form-section"><div class="form-section-heading"><h3>Attendance goal</h3><span>Used for every subject</span></div><div class="field"><label for="goalPreset">Minimum attendance</label><select class="select" id="goalPreset" name="goalPreset">${presets.map((value) => `<option value="${value}" ${presetValue === String(value) ? "selected" : ""}>${value}%</option>`).join("")}<option value="custom" ${presetValue === "custom" ? "selected" : ""}>Custom</option></select></div><div class="field" style="margin-top:12px"><label for="customGoal">Custom percentage</label><input class="input" id="customGoal" name="customGoal" type="number" min="1" max="100" value="${state.attendanceGoal}" /></div><span class="input-hint">This goal powers every subject’s limits and recovery calculations.</span></section></div><div class="drawer-footer"><span class="footer-hint">Your changes are stored on this device.</span><div class="footer-actions"><button class="button button-secondary button-small" type="button" data-close-drawer>Cancel</button><button class="button button-primary button-small" type="submit">${icon("check")} Save profile</button></div></div></form></div>`;
  document.querySelector("#subjectDrawer").setAttribute("aria-hidden", "false");
}

function openDrawer(subjectId = null) {
  state.editingSubjectId = subjectId;
  state.drawerMode = subjectId ? "edit" : "create";
  state.logStatus = "present";
  renderDrawer();
  document.body.classList.add("drawer-open");
}

function openProfileDrawer() {
  state.editingSubjectId = null;
  state.drawerMode = "profile";
  renderDrawer();
  document.body.classList.add("drawer-open");
}

function closeDrawer() {
  document.body.classList.remove("drawer-open");
  document.querySelector("#subjectDrawer").setAttribute("aria-hidden", "true");
  state.editingSubjectId = null;
  state.drawerMode = null;
}

function readSchedule(form) {
  return [...form.querySelectorAll(".schedule-row")].map((row) => ({
    day: row.querySelector('[name="scheduleDay"]')?.value || "",
    time: row.querySelector('[name="scheduleTime"]')?.value || "",
    room: row.dataset.room || "",
    faculty: row.dataset.faculty || "",
    batch: row.dataset.batch || "",
    duration: Number(row.dataset.duration) || 60
  })).filter((item) => item.day || item.time);
}

function saveSubjectFromForm(form) {
  const formData = new FormData(form);
  const id = form.dataset.subjectId;
  const existing = state.subjects.find((subject) => subject.id === id);
  const nextSubject = {
    id: id || uid("subject"),
    name: String(formData.get("name") || "").trim(),
    requirement: state.attendanceGoal,
    totalConducted: Math.max(0, Number(formData.get("totalConducted")) || 0),
    color: formData.get("color") || "violet",
    schedule: readSchedule(form),
    startDate: formData.get("startDate") || "",
    endDate: formData.get("endDate") || "",
    records: existing ? existing.records : []
  };
  if (!nextSubject.name) return;
  if (existing) Object.assign(existing, nextSubject);
  else state.subjects.unshift(nextSubject);
  saveSubjects();
  closeDrawer();
  renderApp();
  showToast(existing ? "Subject updated" : "Subject created");
}

function saveProfileFromForm(form) {
  const formData = new FormData(form);
  const preset = formData.get("goalPreset");
  const goal = Math.max(1, Math.min(100, Number(preset === "custom" ? formData.get("customGoal") : preset) || 75));
  state.userName = String(formData.get("name") || "Student").trim() || "Student";
  state.attendanceGoal = goal;
  localStorage.setItem(PROFILE_NAME_KEY, state.userName);
  localStorage.setItem(ATTENDANCE_GOAL_KEY, String(goal));
  state.subjects.forEach((subject) => { subject.requirement = goal; });
  saveSubjects();
  closeDrawer();
  renderApp();
  showToast("Profile saved");
}

function saveTimetableFromForm(form) {
  const formData = new FormData(form);
  const id = form.dataset.timetableId || uid("timetable");
  const next = {
    id,
    name: String(formData.get("timetableName") || "Untitled timetable").trim() || "Untitled timetable",
    slots: readTimetableForm(form)
  };
  const index = state.timetables.findIndex((timetable) => timetable.id === id);
  if (index >= 0) state.timetables[index] = next;
  else state.timetables.push(next);
  saveTimetables();
  state.editingTimetableId = null;
  renderApp();
  showToast("Timetable saved");
}

function applyTimetable(id) {
  const timetable = timetableForId(id);
  if (!timetable) return;
  const grouped = new Map();
  timetable.slots.forEach((slot) => {
    const key = slot.subjectName.trim().toLowerCase();
    if (!key) return;
    if (!grouped.has(key)) grouped.set(key, { name: slot.subjectName.trim(), schedule: [] });
    grouped.get(key).schedule.push({ day: slot.day, time: slot.time, room: slot.details || "", duration: Number(slot.duration) || 60 });
  });
  const existing = new Map(state.subjects.map((subject) => [subject.name.trim().toLowerCase(), subject]));
  state.subjects = [...grouped.values()].map((entry, index) => {
    const old = existing.get(entry.name.toLowerCase());
    if (old) return { ...old, name: entry.name, schedule: entry.schedule, requirement: state.attendanceGoal };
    return { id: uid("subject"), name: entry.name, requirement: state.attendanceGoal, totalConducted: 0, color: Object.keys(palette)[index % Object.keys(palette).length], schedule: entry.schedule, startDate: TERM_START, endDate: "", records: [] };
  });
  state.activeTimetableId = id;
  localStorage.setItem(ACTIVE_TIMETABLE_KEY, id);
  saveSubjects();
  saveTimetables();
  state.view = "timetable";
  state.editingTimetableId = null;
  renderApp();
  showToast(`${timetable.name} applied`);
}

function addAttendance(subjectId, date, status) {
  const subject = state.subjects.find((item) => item.id === subjectId);
  if (!subject || !date) return;
  subject.records = subject.records || [];
  subject.records.push({ id: uid("record"), date, status });
  const actualClasses = subject.records.filter((item) => item.status !== "cancelled").length;
  subject.totalConducted = Math.max(Number(subject.totalConducted) || 0, actualClasses);
  saveSubjects();
  renderDrawer();
  renderApp();
  showToast(`${statusRecordLabel(status)} attendance saved`);
}

function setScheduledAttendance(subjectId, date, slot, status) {
  const subject = state.subjects.find((item) => item.id === subjectId);
  if (!subject || !attendanceDateIsActive(subject, date)) return;
  subject.records = subject.records || [];
  const dayItems = scheduleItemsForDate(subject, date);
  const existing = subject.records.find((item) => item.date === date && item.slot === slot)
    || (dayItems.length === 1 ? subject.records.find((item) => item.date === date && !item.slot) : null);
  if (status === "present") {
    if (existing) subject.records = subject.records.filter((item) => item.id !== existing.id);
  } else if (existing) {
    existing.status = status;
    existing.slot = slot;
    if (status !== "cancelled") delete existing.rescheduledStatus;
  } else {
    subject.records.push({ id: uid("record"), date, slot, status });
  }
  saveSubjects();
  renderApp();
  showToast(`${statusRecordLabel(status)} attendance saved`);
}

function setRescheduledAttendance(subjectId, date, slot, status) {
  const subject = state.subjects.find((item) => item.id === subjectId);
  if (!subject) return;
  const dayItems = scheduleItemsForDate(subject, date);
  const record = (subject.records || []).find((item) => item.date === date && item.slot === slot)
    || (dayItems.length === 1 ? (subject.records || []).find((item) => item.date === date && !item.slot) : null);
  if (!record || record.status !== "cancelled") return;
  record.rescheduledStatus = status;
  saveSubjects();
  renderApp();
  showToast(`Rescheduled class marked ${statusRecordLabel(status).toLowerCase()}`);
}

function updateRecord(subjectId, recordId, nextStatus) {
  const subject = state.subjects.find((item) => item.id === subjectId);
  const recordItem = subject?.records?.find((item) => item.id === recordId);
  if (!recordItem) return;
  recordItem.status = nextStatus;
  const actualClasses = subject.records.filter((item) => item.status !== "cancelled").length;
  subject.totalConducted = Math.max(Number(subject.totalConducted) || 0, actualClasses);
  saveSubjects();
  renderDrawer();
  renderApp();
  showToast("Attendance history updated");
}

function deleteRecord(subjectId, recordId) {
  const subject = state.subjects.find((item) => item.id === subjectId);
  if (!subject) return;
  subject.records = (subject.records || []).filter((item) => item.id !== recordId);
  saveSubjects();
  renderDrawer();
  renderApp();
  showToast("Attendance record removed");
}

function deleteSubject(subjectId) {
  const subject = state.subjects.find((item) => item.id === subjectId);
  if (!subject) return;
  if (!window.confirm(`Delete ${subject.name} and its attendance history?`)) return;
  state.subjects = state.subjects.filter((item) => item.id !== subjectId);
  saveSubjects();
  closeDrawer();
  renderApp();
  showToast("Subject deleted");
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove("is-visible"), 2500);
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  const iconElement = document.querySelector("#themeToggle [data-icon]");
  if (iconElement) iconElement.innerHTML = icon(isDark ? "sun" : "moon");
}

function moveCalendarMonth(offset) {
  const next = new Date(state.calendarYear, state.calendarMonth + offset, 1);
  state.calendarYear = next.getFullYear();
  state.calendarMonth = next.getMonth();
  renderApp();
}

function moveTimetableWeek(offset) {
  const next = fromISODate(state.timetableDate);
  next.setDate(next.getDate() + offset);
  state.timetableDate = toISODate(next);
  renderApp();
}

function goToCurrentTimetableWeek() {
  state.timetableDate = toISODate(new Date());
  renderApp();
}

function initialize() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === "dark" || (!savedTheme && window.matchMedia?.("(prefers-color-scheme: dark)").matches)) {
    document.body.classList.add("dark");
  }
  document.querySelector("#todayLabel").textContent = `Today, ${formatDate(toISODate(new Date()), { month: "short", day: "numeric" })}`;
  renderStaticIcons();
  renderApp();

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    const nav = target.closest("[data-view]");
    if (nav) {
      state.view = nav.dataset.view;
      state.editingTimetableId = null;
      document.querySelector("#sidebar").classList.remove("is-open");
      renderApp();
      return;
    }
    if (target.closest("#profileButton, [data-open-profile]")) { openProfileDrawer(); return; }
    if (target.closest("#addSubjectButton, [data-open-create]")) { openDrawer(); return; }
    const subjectTrigger = target.closest("[data-open-subject]");
    if (subjectTrigger) { openDrawer(subjectTrigger.dataset.openSubject); return; }
    if (target.closest("#themeToggle")) { toggleTheme(); return; }
    if (target.closest("#mobileMenu")) { document.querySelector("#sidebar").classList.toggle("is-open"); return; }
    if (target.closest("#drawerBackdrop, [data-close-drawer]")) { closeDrawer(); return; }
    const scheduledStatus = target.closest("[data-scheduled-status]");
    if (scheduledStatus) {
      setScheduledAttendance(scheduledStatus.dataset.subjectId, scheduledStatus.dataset.attendanceDate, scheduledStatus.dataset.attendanceSlot, scheduledStatus.dataset.scheduledStatus);
      return;
    }
    const rescheduledStatus = target.closest("[data-rescheduled-status]");
    if (rescheduledStatus) {
      setRescheduledAttendance(rescheduledStatus.dataset.subjectId, rescheduledStatus.dataset.attendanceDate, rescheduledStatus.dataset.attendanceSlot, rescheduledStatus.dataset.rescheduledStatus);
      return;
    }
    const statusButton = target.closest("[data-log-status]");
    if (statusButton) {
      state.logStatus = statusButton.dataset.logStatus;
      document.querySelectorAll("[data-log-status]").forEach((button) => button.classList.toggle("is-selected", button.dataset.logStatus === state.logStatus));
      return;
    }
    if (target.closest("[data-log-submit]")) {
      addAttendance(state.editingSubjectId, document.querySelector("#logDate")?.value || toISODate(new Date()), state.logStatus);
      return;
    }
    if (target.closest("[data-new-timetable]")) {
      state.view = "default-timetables";
      state.editingTimetableId = "new";
      renderApp();
      return;
    }
    const editTimetable = target.closest("[data-edit-timetable]");
    if (editTimetable) {
      state.view = "default-timetables";
      state.editingTimetableId = editTimetable.dataset.editTimetable;
      renderApp();
      return;
    }
    const applyTimetableButton = target.closest("[data-apply-timetable]");
    if (applyTimetableButton) { applyTimetable(applyTimetableButton.dataset.applyTimetable); return; }
    if (target.closest("[data-cancel-timetable]")) {
      state.editingTimetableId = null;
      renderApp();
      return;
    }
    if (target.closest("[data-add-timetable-row]")) {
      const list = document.querySelector("#timetableEditorRows");
      if (list) list.insertAdjacentHTML("beforeend", renderDefaultTimetableRow());
      return;
    }
    const removeTimetableRow = target.closest("[data-remove-timetable-row]");
    if (removeTimetableRow) {
      const list = document.querySelector("#timetableEditorRows");
      if (list && list.children.length > 1) removeTimetableRow.closest("[data-timetable-row]")?.remove();
      return;
    }
    const colorButton = target.closest("[data-color-option]");
    if (colorButton) {
      document.querySelectorAll("[data-color-option]").forEach((button) => button.classList.toggle("is-selected", button === colorButton));
      const colorInput = document.querySelector("#subjectColor");
      if (colorInput) colorInput.value = colorButton.dataset.colorOption;
      return;
    }
    if (target.closest("[data-add-schedule]")) {
      const list = document.querySelector("#scheduleList");
      if (list) list.insertAdjacentHTML("beforeend", `<div class="schedule-row"><select class="select" name="scheduleDay"><option value="">Day</option><option>Mon</option><option>Tue</option><option>Wed</option><option>Thu</option><option>Fri</option><option>Sat</option><option>Sun</option></select><input class="input" type="time" name="scheduleTime" value="09:00" /><button class="icon-button" type="button" data-remove-schedule aria-label="Remove schedule">${icon("trash")}</button></div>`);
      return;
    }
    const removeSchedule = target.closest("[data-remove-schedule]");
    if (removeSchedule) {
      const list = document.querySelector("#scheduleList");
      if (list && list.children.length > 1) removeSchedule.closest(".schedule-row")?.remove();
      return;
    }
    if (target.closest("[data-delete-subject]")) { deleteSubject(state.editingSubjectId); return; }
    const deleteHistory = target.closest("[data-history-delete]");
    if (deleteHistory) { deleteRecord(state.editingSubjectId, deleteHistory.dataset.historyDelete); return; }
    if (target.closest("[data-calendar-prev]")) { moveCalendarMonth(-1); return; }
    if (target.closest("[data-calendar-next]")) { moveCalendarMonth(1); return; }
    if (target.closest("[data-timetable-prev]")) { moveTimetableWeek(-7); return; }
    if (target.closest("[data-timetable-next]")) { moveTimetableWeek(7); return; }
    if (target.closest("[data-timetable-today]")) { goToCurrentTimetableWeek(); return; }
    if (target.closest("[data-calendar-today]")) {
      const today = new Date();
      state.calendarYear = today.getFullYear(); state.calendarMonth = today.getMonth(); state.selectedDate = toISODate(today); renderApp(); return;
    }
    const calendarDate = target.closest("[data-calendar-date]");
    if (calendarDate) { state.selectedDate = calendarDate.dataset.calendarDate; renderApp(); }
  });

  document.addEventListener("change", (event) => {
    const target = event.target;
    if (target.matches("[data-history-status]")) {
      if (target.dataset.historyScheduled === "true") setScheduledAttendance(state.editingSubjectId, target.dataset.historyDate, target.dataset.historySlot, target.value);
      else updateRecord(state.editingSubjectId, target.dataset.historyStatus, target.value);
    }
    if (target.matches("#monthSelect")) {
      const [year, month] = target.value.split("-").map(Number);
      state.calendarYear = year; state.calendarMonth = month; renderApp();
    }
  });

  document.addEventListener("submit", (event) => {
    if (event.target.matches("#profileForm")) {
      event.preventDefault();
      saveProfileFromForm(event.target);
      return;
    }
    if (event.target.matches("#timetableForm")) {
      event.preventDefault();
      saveTimetableFromForm(event.target);
      return;
    }
    if (event.target.matches("#subjectForm")) {
      event.preventDefault();
      saveSubjectFromForm(event.target);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.drawerMode) closeDrawer();
  });
}

window.addEventListener("beforeunload", saveSubjects);
initialize();
