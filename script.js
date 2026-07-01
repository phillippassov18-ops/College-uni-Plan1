import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let currentUser = null;
let cloudChecks = {};
let cloudLoaded = false;

window.showScreen = (id) => {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo(0,0);
};
window.goHome = () => window.showScreen("home");

const julyLive = [
  ["July 11 show", "Ventura Music lead / first July event"],
  ["Book July Show #2", "Second July show confirmed"],
  ["Book July Show #3", "Third July show confirmed"],
  ["July 11 flyer", "Create and post official flyer"],
  ["Rehearsals with Asaf set", "Schedule rehearsals and lock set"],
  ["Promotion for July 11", "Announcement, stories, reels, countdown"]
];

const julyStudio = [
  ["Release Song #1", "First of 3 song releases"],
  ["Song #1 artwork / asset", "Cover or visual ready"],
  ["Song #1 promo reel", "Short-form promo"],
  ["Song #1 release post", "Post on release day"]
];

const augustLive = [
  ["August Show #1", "Booked and confirmed"],
  ["August Show #2", "Booked and confirmed"],
  ["August Show #3", "Booked and confirmed"],
  ["Promote August shows", "Flyers, reels, reminders"],
  ["Meet 10 musicians", "Build network"],
  ["Lock September venues", "Keep pipeline moving"]
];

const augustStudio = [
  ["Release Song #2", "Second of 3 song releases"],
  ["Song #2 artwork / asset", "Cover or visual ready"],
  ["Song #2 promo reel", "Short-form promo"],
  ["Song #2 release post", "Post on release day"]
];

const septemberLive = [
  ["September Show #1", "Booked and confirmed"],
  ["September Show #2", "Booked and confirmed"],
  ["September Show #3", "Booked and confirmed"],
  ["Promote September shows", "Flyers, reels, reminders"],
  ["Book October shows", "Do not enter October empty"]
];

const septemberStudio = [
  ["Release Song #3", "Third of 3 song releases"],
  ["Song #3 artwork / asset", "Cover or visual ready"],
  ["Song #3 promo reel", "Short-form promo"],
  ["Song #3 release post", "Post on release day"]
];

const venues = [
  ["Current lead", "Ventura Music", "Status: meeting / interested"],
  ["Venue #2", "Valley / LA", "Find contact + message"],
  ["Venue #3", "Valley / LA", "Find contact + message"],
  ["Venue #4", "Valley / LA", "Find contact + message"],
  ["Venue #5", "Valley / LA", "Find contact + message"],
  ["Venue #6", "Valley / LA", "Find contact + message"]
];

const shortTermTasks = [
  ["Finish MuzArt Video #2", "Short-term video goal"],
  ["Anybody Anywhere Video #1", "Release performance clip"],
  ["Anybody Anywhere Video #2", "Release performance clip"],
  ["Anybody Anywhere Video #3", "Release performance clip"],
  ["Post 20 July IG posts/reels", "Keep content moving"],
  ["Post-show recap", "Turn July 11 into content"]
];

const schoolWeek = [
  ["Complete COPE clearances", "Due next week — highest priority"],
  ["Verify all COPE documents submitted", "Portal / email confirmation"],
  ["Attend COPE July 11", "COPE Health Scholars"],
  ["Attend COPE July 12", "COPE Health Scholars"],
  ["Attend COPE July 18", "COPE Health Scholars"],
  ["Finish BIO 101 Lab", "Posts to transcript after lab"],
  ["Retake POLS", "Target A"],
  ["Register Physiology", "Fall 2026"],
  ["Register Microbiology", "Fall 2026"],
  ["Register Sociology", "Fall 2026"]
];

const matrix = [
  ["English I","✅","✅","✅","✅","✅","✅","✅","✅","✅","✅","✅ Complete",true],
  ["English II / Critical Thinking","✅","✅","✅","✅","✅","✅","✅","✅","✅","✅","✅ Complete",true],
  ["Statistics","✅","✅","✅","✅","✅","✅","✅","✅","✅","✅","✅ A",true],
  ["General Psychology","✅","✅","✅","✅","✅","✅","✅","✅","⭐","✅","✅ Complete",true],
  ["Lifespan Psychology","✅","✅","✅","⭐","⭐","⭐","⭐","⭐","⭐","⭐","✅ Complete",true],
  ["Public Speaking","⭐","⭐","⭐","✅","✅","✅","✅","✅","⭐","➖","✅ Complete",true],
  ["BIO 101","⭐","⭐","⭐","⭐","⭐","⭐","⭐","⭐","➖","➖","✅ after lab posts",false],
  ["BIO 006","➖","➖","➖","➖","➖","➖","➖","➖","✅","✅","✅ Complete",true],
  ["Human Anatomy","✅","✅","✅","✅","✅","✅","✅","✅","✅","✅","✅ B",true],
  ["Human Physiology","✅","✅","✅","✅","✅","✅","✅","✅","✅","✅","🟡 Fall 2026",false],
  ["Microbiology","✅","✅","✅","✅","✅","✅","✅","✅","⭐","✅","🟡 Fall 2026",false],
  ["Sociology","⭐","⭐","⭐","⭐","✅","✅","✅","⭐","➖","✅","🟡 Fall 2026",false],
  ["CHEM 051","✅","✅","✅","✅","✅","➖","❓","✅","❌","❌","✅ A",true],
  ["CHEM 101","❌","❌","❌","❓","❓","✅","❓","❓","✅","✅","❓ verify",false],
  ["CHEM 102","❌","❌","❌","❌","❌","❌","❌","❌","✅","✅","🔴 not taken",false],
  ["CHEM 211","❌","❌","❌","❌","❌","✅","❌","❌","✅","➖","🔴 not taken",false],
  ["BIO 007","❌","❌","❌","❌","❌","❌","❌","❌","✅","➖","❓ verify",false],
  ["Genetics","❌","❌","❌","❌","❌","❌","❌","❌","➖","⭐","🔴 not taken",false],
  ["Public Health","❌","❌","❌","❌","❌","❌","❌","❌","➖","⭐","🔴 not taken",false],
  ["Nutrition","⭐","⭐","⭐","⭐","⭐","⭐","⭐","⭐","➖","⭐","🔴 verify",false],
  ["TEAS","✅","✅","✅","⭐","⭐","⭐","⭐","⭐","❌","❌","🔴 not taken",false],
  ["COPE / Clinical Experience","⭐","⭐","⭐","⭐","⭐","⭐","⭐","⭐","⭐","⭐","🟡 starts July",false]
];

const schoolNotes = [
  ["🏛 UCLA", "Full IGETC. All seven non-nursing prep courses by spring before transfer. Most demanding chemistry/biology sequence. Most competitive."],
  ["🏛 UC Irvine", "Strong science prep. Genetics/Public Health may matter. Keep open if the extra coursework is worth it."],
  ["🌊 CSULB", "Heavy science GPA emphasis. Chemistry equivalency needs careful verification."],
  ["🟠 CSUF", "Good fit with current coursework. Allied-health chemistry pathway appears favorable."],
  ["🌴 CSUCI", "Good target. Chemistry articulation is different, so verify before registering for extra chemistry."],
  ["🦅 CSULA", "Good local CSU option. Sociology/Nutrition-style support courses may matter depending on final program rules."],
  ["🏔 CSUN", "Need correct current traditional BSN route verified; RN-to-BSN is a separate backup path after ADN/RN."],
  ["🏥 ADN Programs", "TEAS required. Science GPA matters. Fastest RN path, then bridge to BSN later."]
];

const semesters = [
  ["✅ Completed",["English I","English II / Critical Thinking","Statistics A","General Psychology","Lifespan Psychology","Public Speaking","BIO 006","Anatomy B","CHEM 051 A"]],
  ["☀️ Summer 2026",["Complete COPE clearances by next week","COPE dates: July 11, July 12, July 18","Finish BIO 101 lab/posting","Retake POLS for A","Confirm ADN deadlines"]],
  ["🍂 Fall 2026",["Physiology","Microbiology","Sociology","Continue COPE","Join nursing club if possible"]],
  ["❄️ Winter 2027",["TEAS prep / take if ready","Resume","Essays","Recommendation planning"]],
  ["🌱 Spring 2027",["Apply to ADN programs for Spring-entry cycles where available","Continue COPE","Submit transcripts / TEAS / nursing applications","Only add verified remaining prerequisites"]],
  ["🌊 Summer / Fall 2027",["Track ADN responses / interviews","Finish remaining verified UC/CSU prerequisites","Submit UC/CSU applications if continuing that path","Track transcripts and updates"]]
];

const deadlines = [
  ["UCLA","Aug 1","Nov 30 / Dec 1","Nursing Supplemental: Jan 15","Mar–Apr"],
  ["UC Irvine","Aug 1","Nov 30 / Dec 1","None","Mar–Apr"],
  ["CSU Long Beach","Aug 1","Nov 30","Nursing application + requirements","Spring"],
  ["CSU Fullerton","Aug 1","Nov 30","Program requirements","Spring"],
  ["CSU Los Angeles","Aug 1","Nov 30","NursingCAS: Jan 15","Spring"],
  ["CSU Channel Islands","Aug 1","Nov 30","Program requirements","Spring"],
  ["CSUN","Aug 1","Nov 30","Program-specific nursing application","Spring"],
  ["Pierce ADN","Sep 15 / Feb 15","Oct 1 / Mar 1","TEAS, transcripts, nursing app","Nov–Dec or May–Jun"],
  ["Valley ADN","September / Apr 1","Late Sept / Apr 30","TEAS, prereq eval, transcripts","After cycle"],
  ["LA City ADN","Jul 15 / Jan–Feb","Aug 15 / varies","TEAS, info session, transcripts","After cycle"]
];

const timeline = [
  ["July", "Continue COPE / summer classes"],
  ["Aug 1", "UC & CSU applications open"],
  ["September", "Begin essays / resume"],
  ["Oct 1", "FAFSA/CADAA opens"],
  ["Nov 30 / Dec 1", "Submit UC & CSU applications"],
  ["Jan 15", "UCLA Nursing Supplemental / CSULA NursingCAS"],
  ["Jan 31", "UC TAU"],
  ["July–Oct", "ADN Spring-entry application windows can open/close"],
  ["Feb–Mar", "ADN Fall-entry application windows begin"],
  ["Mar 2", "Financial aid priority deadline"],
  ["April", "Some ADN Fall deadlines close"],
  ["May–June", "Many ADN decisions"],
  ["June 1", "UC SIR if admitted"],
  ["July 1", "Final UC transcripts if admitted"]
];

function localSaved(id, fallback=false){
  return localStorage.getItem(id) === null ? fallback : localStorage.getItem(id) === "true";
}
function saved(id, fallback=false){
  if (currentUser && cloudLoaded) return cloudChecks[id] === undefined ? fallback : cloudChecks[id] === true;
  return localSaved(id, fallback);
}
function checkbox(id, fallback=false, group="school"){
  return `<input class="task ${group}" type="checkbox" data-id="${id}" ${saved(id,fallback) ? "checked" : ""}>`;
}
function taskCards(target, data, prefix, group){
  document.getElementById(target).innerHTML = data.map((t,i)=>`
    <div class="task-card">
      ${checkbox(prefix+i,false,group)}
      <div><strong>${t[0]}</strong><span>${t[1]}</span></div>
    </div>
  `).join("");
}

function render(){
  taskCards("julyLive", julyLive, "julyLive", "music");
  taskCards("julyStudio", julyStudio, "julyStudio", "music");
  taskCards("augustLive", augustLive, "augustLive", "music");
  taskCards("augustStudio", augustStudio, "augustStudio", "music");
  taskCards("septemberLive", septemberLive, "septemberLive", "music");
  taskCards("septemberStudio", septemberStudio, "septemberStudio", "music");
  taskCards("shortTermTasks", shortTermTasks, "shortTerm", "music");

  document.getElementById("venueCards").innerHTML = venues.map((v,i)=>`
    <div class="venue-card">
      <h3>${v[0]}</h3>
      <p><strong>${v[1]}</strong></p>
      <p>${v[2]}</p>
      <p>${checkbox("venueContacted"+i,false,"music")} Contacted</p>
      <p>${checkbox("venueInterested"+i,false,"music")} Interested</p>
      <p>${checkbox("venueBooked"+i,false,"music")} Booked</p>
    </div>
  `).join("");

  taskCards("schoolWeek", schoolWeek, "schoolWeek", "school");
  document.getElementById("matrixRows").innerHTML = matrix.map((r,i)=>`
    <tr>
      <td>${checkbox("matrix"+i,r[11],"school")}</td>
      <td><b>${r[0]}</b></td>
      <td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td>${r[5]}</td><td>${r[6]}</td><td>${r[7]}</td><td>${r[8]}</td><td>${r[9]}</td><td>${r[10]}</td><td>${r[11]}</td>
    </tr>
  `).join("");
  document.getElementById("schoolNotes").innerHTML = schoolNotes.map(n=>`<div class="note"><h3>${n[0]}</h3><p>${n[1]}</p></div>`).join("");
  document.getElementById("semesterRows").innerHTML = semesters.map((s,si)=>`
    <div class="semester"><h3>${s[0]}</h3>
    ${s[1].map((item,ii)=>`<p>${checkbox("sem"+si+"_"+ii,s[0].includes("Completed"),"school")} ${item}</p>`).join("")}
    </div>
  `).join("");
  document.getElementById("deadlineRows").innerHTML = deadlines.map((d,i)=>`
    <tr><td>${checkbox("deadline"+i,false,"school")}</td><td>${d[0]}</td><td>${d[1]}</td><td>${d[2]}</td><td>${d[3]}</td><td>${d[4]}</td></tr>
  `).join("");
  document.getElementById("timelineRows").innerHTML = timeline.map((t,i)=>`
    <tr><td>${checkbox("timeline"+i,false,"school")}</td><td><b>${t[0]}</b></td><td>${t[1]}</td></tr>
  `).join("");

  document.querySelectorAll(".task").forEach(b=>{
    b.addEventListener("change", async ()=>{
      if (currentUser) {
        cloudChecks[b.dataset.id] = b.checked;
        await saveCloud();
      } else {
        localStorage.setItem(b.dataset.id, b.checked);
      }
      updateCount();
    });
  });
  updateCount();
}

async function saveCloud(){
  if (!currentUser) return;
  await setDoc(doc(db, "roadmaps", currentUser.uid), { checks: cloudChecks, updatedAt: new Date().toISOString() }, { merge: true });
}
async function loadCloud(){
  if (!currentUser) return;
  const snap = await getDoc(doc(db, "roadmaps", currentUser.uid));
  cloudChecks = snap.exists() && snap.data().checks ? snap.data().checks : {};
  cloudLoaded = true;
}
function updateCount(){
  ["music","school"].forEach(group=>{
    const boxes = [...document.querySelectorAll(".task."+group)];
    const done = boxes.filter(b=>b.checked).length;
    const total = boxes.length;
    document.getElementById(group+"Done").textContent = done;
    document.getElementById(group+"Total").textContent = total;
    document.getElementById(group+"Bar").style.width = total ? (done/total*100)+"%" : "0%";
  });
}

document.getElementById("signInBtn").addEventListener("click", () => signInWithPopup(auth, new GoogleAuthProvider()));
document.getElementById("signOutBtn").addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, async user=>{
  currentUser = user;
  cloudLoaded = false;
  if (user) {
    document.getElementById("signInBtn").classList.add("hidden");
    document.getElementById("signOutBtn").classList.remove("hidden");
    document.getElementById("userStatus").textContent = "Signed in as " + user.email;
    render();
    await loadCloud();
    render();
  } else {
    document.getElementById("signInBtn").classList.remove("hidden");
    document.getElementById("signOutBtn").classList.add("hidden");
    document.getElementById("userStatus").textContent = "Not signed in — saves on this device only.";
    cloudChecks = {};
    render();
  }
});
