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

const musicGoals = [
  ["Venue confirmed", "Lock the July 11 show location"],
  ["Flyer for July 11 show", "Create and post the flyer"],
  ["Rehearsals with Asaf set", "Schedule rehearsals and lock the set"],
  ["Promotion for show", "Announcement, stories, reels, countdown"],
  ["Finish MuzArt vid 2", "Complete edit and get it out"],
  ["Anybody Anywhere vids out", "Release the first performance clips"],
  ["Book July Show #2", "Second July show confirmed"],
  ["Book July Show #3", "Third July show confirmed"],
  ["Book August Show #1", "First August show confirmed"],
  ["Book August Show #2", "Second August show confirmed"],
  ["Book August Show #3", "Third August show confirmed"],
  ["Find 5 more venues", "Valley / LA venue outreach"]
];

const showTasks = [
  ["Meet venue guy", "Build relationship and talk logistics"],
  ["Date confirmed", "July 11 Saturday locked"],
  ["Start time confirmed", "Doors / music time"],
  ["PA / gear confirmed", "Know what to bring"],
  ["Lineup finalized", "Artists confirmed"],
  ["Flyer finished", "Ready to post"],
  ["Announcement posted", "Feed / reel / story"],
  ["Rehearsal complete", "Asaf / set prepared"],
  ["Film plan confirmed", "Vertical and horizontal footage"],
  ["Post-show recap", "Turn show into content"]
];

const venues = [
  ["Current lead", "Ventura Music", "Status: meeting / interested"],
  ["Venue #2", "Valley / LA", "Find contact + message"],
  ["Venue #3", "Valley / LA", "Find contact + message"],
  ["Venue #4", "Valley / LA", "Find contact + message"],
  ["Venue #5", "Valley / LA", "Find contact + message"],
  ["Venue #6", "Valley / LA", "Find contact + message"]
];

const contentTasks = [
  ["July 11 flyer posted", "Main announcement"],
  ["Countdown story", "48 hours before"],
  ["Day-of stories", "Load-in / soundcheck / crowd"],
  ["Post-show recap", "Next day"],
  ["MuzArt Video #2 complete", "Finish and post"],
  ["Anybody Anywhere Video #1", "Upload"],
  ["Anybody Anywhere Video #2", "Upload"],
  ["Anybody Anywhere Video #3", "Upload"],
  ["20 July IG posts/reels", "Monthly content target"]
];

const schoolWeek = [
  ["Complete COPE clearances", "Due next week — highest priority"],
  ["Verify COPE docs submitted", "Portal/email confirmation"],
  ["Confirm COPE dates", "July 11, July 12, July 18"],
  ["Finish BIO 101 lab / posting", "Counts as completed once posted"],
  ["Stay on POLS retake", "Target A"],
  ["Confirm Fall registration", "Physiology + Microbiology + Sociology"]
];

const matrix = [
  ["English I","✅","✅","✅","✅","✅","✅","✅","✅","✅","✅ Complete",true],
  ["English II / Critical Thinking","✅","✅","✅","✅","✅","✅","✅","✅","✅","✅ Complete",true],
  ["Statistics","✅","✅","✅","✅","✅","✅","✅","✅","✅","✅ A",true],
  ["General Psychology","✅","✅","✅","✅","✅","✅","✅","⭐","✅","✅ Complete",true],
  ["Lifespan Psychology","✅","✅","✅","⭐","⭐","⭐","⭐","⭐","⭐","✅ Complete",true],
  ["Public Speaking","⭐","⭐","⭐","✅","✅","✅","✅","⭐","➖","✅ Complete",true],
  ["BIO 101","⭐","⭐","⭐","⭐","⭐","⭐","⭐","➖","➖","✅ after lab posts",false],
  ["BIO 006","➖","➖","➖","➖","➖","➖","➖","✅","✅","✅ Complete",true],
  ["Human Anatomy","✅","✅","✅","✅","✅","✅","✅","✅","✅","✅ B",true],
  ["Human Physiology","✅","✅","✅","✅","✅","✅","✅","✅","✅","🟡 Fall 2026",false],
  ["Microbiology","✅","✅","✅","✅","✅","✅","✅","⭐","✅","🟡 Fall 2026",false],
  ["Sociology","⭐","⭐","⭐","✅","✅","✅","⭐","➖","✅","🟡 Fall 2026",false],
  ["CHEM 051","✅","✅","✅","✅","➖","❓","✅","❌","❌","✅ A",true],
  ["CHEM 101","❌","❌","❌","❓","✅","❓","❓","✅","✅","❓ verify",false],
  ["CHEM 102","❌","❌","❌","❌","❌","❌","❌","✅","✅","🔴 not taken",false],
  ["CHEM 211","❌","❌","❌","❌","✅","❌","❌","✅","➖","🔴 not taken",false],
  ["BIO 007","❌","❌","❌","❌","❌","❌","❌","✅","➖","❓ verify",false],
  ["TEAS","✅","✅","✅","⭐","⭐","⭐","⭐","❌","❌","🔴 not taken",false],
  ["COPE / Clinical Experience","⭐","⭐","⭐","⭐","⭐","⭐","⭐","⭐","⭐","🟡 starts July",false]
];

const semesters = [
  ["✅ Completed",["English I","English II / Critical Thinking","Statistics A","General Psychology","Lifespan Psychology","Public Speaking","BIO 006","Anatomy B","CHEM 051 A"]],
  ["☀️ Summer 2026",["Complete COPE clearances by next week","COPE dates: July 11, July 12, July 18","Finish BIO 101 lab/posting","Retake POLS for A"]],
  ["🍂 Fall 2026",["Physiology","Microbiology","Sociology","Continue COPE","Join nursing club if possible"]],
  ["❄️ Winter 2027",["TEAS prep / take if ready","Resume","Essays","Recommendation planning"]],
  ["🌱 Spring 2027",["Apply to ADN programs for Spring-entry cycles where available","Continue COPE","Submit transcripts / TEAS / nursing applications","Only add verified remaining prerequisites"]]
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
  taskCards("musicGoals", musicGoals, "musicGoal", "music");
  taskCards("showTasks", showTasks, "showTask", "music");
  taskCards("contentTasks", contentTasks, "contentTask", "music");
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
      <td>${checkbox("matrix"+i,r[10],"school")}</td>
      <td><b>${r[0]}</b></td>
      <td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td>${r[5]}</td><td>${r[6]}</td><td>${r[7]}</td><td>${r[8]}</td><td>${r[9]}</td><td>${r[10]}</td>
    </tr>
  `).join("");
  document.getElementById("semesterRows").innerHTML = semesters.map((s,si)=>`
    <div class="semester"><h3>${s[0]}</h3>
    ${s[1].map((item,ii)=>`<p>${checkbox("sem"+si+"_"+ii,s[0].includes("Completed"),"school")} ${item}</p>`).join("")}
    </div>
  `).join("");
  document.getElementById("deadlineRows").innerHTML = deadlines.map((d,i)=>`
    <tr><td>${checkbox("deadline"+i,false,"school")}</td><td>${d[0]}</td><td>${d[1]}</td><td>${d[2]}</td><td>${d[3]}</td><td>${d[4]}</td></tr>
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
