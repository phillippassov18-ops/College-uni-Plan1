import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;
let cloudChecks = {};
let cloudLoaded = false;

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
  ["Genetics","❌","❌","❌","❌","❌","❌","❌","➖","⭐","🔴 not taken",false],
  ["Public Health","❌","❌","❌","❌","❌","❌","❌","➖","⭐","🔴 not taken",false],
  ["Nutrition","⭐","⭐","⭐","⭐","⭐","⭐","⭐","➖","⭐","🔴 verify",false],
  ["TEAS","✅","✅","✅","⭐","⭐","⭐","⭐","❌","❌","🔴 not taken",false],
  ["COPE / Clinical Experience","⭐","⭐","⭐","⭐","⭐","⭐","⭐","⭐","⭐","🟡 starts July",false]
];

const notes = [
  ["🏛 UCLA","Full IGETC. All non-nursing prep finished by spring before transfer. Most demanding chemistry/biology sequence. Most competitive."],
  ["🏛 UC Irvine","Strong science preparation. Genetics/Public Health may matter. Keep open if the extra coursework is worth it."],
  ["🌊 CSULB","Heavy science GPA emphasis. Chemistry equivalency needs careful verification."],
  ["🟠 CSUF","Good fit with current coursework. Allied-health chemistry pathway appears favorable."],
  ["🌴 CSUCI","Good target. Chemistry articulation is different, so verify before registering for extra chemistry."],
  ["🦅 CSULA","Good local CSU option. Sociology/Nutrition-style support courses may matter depending on final program rules."],
  ["🏥 ADN Programs","TEAS required. Science GPA matters. Fastest RN pathway, then bridge to BSN later."]
];

const semesters = [
  ["✅ Completed",["English I","English II / Critical Thinking","Statistics A","General Psychology","Lifespan Psychology","Public Speaking","BIO 006","Anatomy B","CHEM 051 A"]],
  ["☀️ Summer 2026",["Complete COPE clearances by next week","COPE dates: July 11, July 12, July 18","Finish BIO 101 lab/posting","Retake POLS for A","Confirm ADN deadlines"]],
  ["🍂 Fall 2026",["Physiology","Microbiology","Sociology","Continue COPE","Join nursing club if possible"]],
  ["❄️ Winter 2027",["TEAS prep / take if ready","Resume","Essays","Recommendation planning"]],
  ["🌱 Spring 2027",["Apply to ADN programs for Spring-entry cycles where available","Continue COPE","Submit transcripts / TEAS / nursing applications","Only add verified remaining prerequisites"]],
  ["🌊 Summer / Fall 2027",["Track ADN responses / interviews","Finish any remaining UC/CSU prereqs","UC/CSU applications if continuing that path","Track transcripts and updates"]]
];

const deadlines = [
  ["🏛 UCLA","Aug 1","Nov 30 / Dec 1","Nursing Supplemental: Jan 15","Mar–Apr","⬜"],
  ["🏛 UC Irvine","Aug 1","Nov 30 / Dec 1","None","Mar–Apr","⬜"],
  ["🌊 CSU Long Beach","Aug 1","Nov 30","Nursing application + program requirements","Spring","⬜"],
  ["🟠 CSU Fullerton","Aug 1","Nov 30","Program-specific nursing requirements","Spring","⬜"],
  ["🦅 CSU Los Angeles","Aug 1","Nov 30","NursingCAS: Jan 15","Spring","⬜"],
  ["🌴 CSU Channel Islands","Aug 1","Nov 30","Program-specific nursing requirements","Spring","⬜"],
  ["🏔 CSUN","Aug 1","Nov 30","Program-specific nursing application","Spring","⬜"],
  ["🏥 Pierce ADN","Sep 15 spring cycle / Feb 15 fall cycle","Oct 1 / Mar 1","TEAS, transcripts, nursing app","Nov–Dec or May–Jun","⬜"],
  ["🏥 Valley ADN","September spring cycle / Apr 1 fall cycle","Late Sept / Apr 30","TEAS, prereq eval, transcripts","After cycle","⬜"],
  ["🏥 LA City ADN","Jul 15 spring cycle / Jan–Feb fall cycle","Aug 15 / varies","TEAS, info session, transcripts","After cycle","⬜"]
];

const thisWeek = [
  ["Complete COPE clearances", "Due next week — highest priority"],
  ["Verify all COPE documents are submitted", "Check portal/email confirmation"],
  ["Confirm COPE dates", "July 11, July 12, July 18"],
  ["Upload final roadmap files to GitHub root", "index.html, style.css, script.js, firebase-config.js"],
  ["Test Firebase login + synced checkmarks", "Mac + phone"],
  ["Finish BIO 101 lab / transcript posting", "Counts as completed once posted"],
  ["Stay on POLS retake", "Target A"],
  ["Confirm Fall registration", "Physiology + Microbiology + Sociology"]
];

const timeline = [
  ["July","Continue COPE / Summer classes"],
  ["Aug 1","UC & CSU applications open"],
  ["September","Begin essays / resume"],
  ["Oct 1","FAFSA/CADAA opens"],
  ["Nov 30 / Dec 1","Submit UC & CSU applications"],
  ["Jan 15","UCLA Nursing Supplemental / CSULA NursingCAS"],
  ["Jan 31","UC TAU"],
  ["July–Oct","ADN Spring-entry application windows can open/close"],
  ["Feb–Mar","ADN Fall-entry application windows begin"],
  ["Mar 2","Financial aid priority deadline"],
  ["April","Some ADN Fall deadlines close"],
  ["May–June","Many ADN decisions"],
  ["June 1","UC SIR if admitted"],
  ["July 1","Final UC transcripts if admitted"]
];

function localSaved(id, fallback=false){
  return localStorage.getItem(id) === null ? fallback : localStorage.getItem(id) === "true";
}

function saved(id, fallback=false){
  if (currentUser && cloudLoaded) {
    return cloudChecks[id] === undefined ? fallback : cloudChecks[id] === true;
  }
  return localSaved(id, fallback);
}

function checkbox(id, checked=false){
  return `<input class="task" type="checkbox" data-id="${id}" ${saved(id,checked)?"checked":""}>`;
}

function render(){
  document.getElementById("thisWeekRows").innerHTML = thisWeek.map((t,i)=>`
  <div class="task-card">
    ${checkbox("week"+i,false)}
    <div><strong>${t[0]}</strong><span>${t[1]}</span></div>
  </div>
`).join("");

document.getElementById("matrixRows").innerHTML = matrix.map((r,i)=>`
  <tr>
  <td>${checkbox("matrix"+i,r[10])}</td>
  <td><b>${r[0]}</b></td>
  <td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td>${r[5]}</td><td>${r[6]}</td><td>${r[7]}</td><td>${r[8]}</td><td>${r[9]}</td>
  <td>${r[10]}</td>
  </tr>`).join("");

  document.getElementById("notesRows").innerHTML = notes.map(n=>`<div class="note"><h3>${n[0]}</h3><p>${n[1]}</p></div>`).join("");

  document.getElementById("semesterRows").innerHTML = semesters.map((s,si)=>`
  <div class="semester"><h3>${s[0]}</h3>
  ${s[1].map((item,ii)=>`<p>${checkbox("sem"+si+"_"+ii, s[0].includes("Completed"))} ${item}</p>`).join("")}
  </div>`).join("");

  document.getElementById("deadlineRows").innerHTML = deadlines.map((d,i)=>`
  <tr><td>${checkbox("dead"+i,false)}</td><td>${d[0]}</td><td>${d[1]}</td><td>${d[2]}</td><td>${d[3]}</td><td>${d[4]}</td><td>${d[5]}</td></tr>`).join("");

  document.getElementById("timelineRows").innerHTML = timeline.map((t,i)=>`
  <tr><td>${checkbox("time"+i,false)}</td><td><b>${t[0]}</b></td><td>${t[1]}</td></tr>`).join("");

  document.querySelectorAll(".task").forEach(b=>{
    b.addEventListener("change", async ()=>{
      const id = b.dataset.id;
      if (currentUser) {
        cloudChecks[id] = b.checked;
        await saveCloud();
      } else {
        localStorage.setItem(id,b.checked);
      }
      updateCount();
    });
  });
  updateCount();
}

async function saveCloud(){
  if (!currentUser) return;
  await setDoc(doc(db, "roadmaps", currentUser.uid), {
    checks: cloudChecks,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

async function loadCloud(){
  if (!currentUser) return;
  const ref = doc(db, "roadmaps", currentUser.uid);
  const snap = await getDoc(ref);
  cloudChecks = snap.exists() && snap.data().checks ? snap.data().checks : {};
  cloudLoaded = true;

  // First-time login migration: copy local checks into cloud if cloud is empty.
  if (Object.keys(cloudChecks).length === 0) {
    document.querySelectorAll(".task").forEach(b=>{
      const id = b.dataset.id;
      if (localStorage.getItem(id) !== null) cloudChecks[id] = localStorage.getItem(id) === "true";
    });
    await saveCloud();
  }
}

function updateCount(){
  const boxes = [...document.querySelectorAll(".task")];
  const done = boxes.filter(b=>b.checked).length;
  document.getElementById("doneCount").textContent = done;
  document.getElementById("totalCount").textContent = boxes.length;
  document.getElementById("progressBar").style.width = boxes.length ? (done/boxes.length*100)+"%" : "0%";
}

document.getElementById("signInBtn").addEventListener("click", async ()=>{
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
});

document.getElementById("signOutBtn").addEventListener("click", async ()=>{
  await signOut(auth);
});

onAuthStateChanged(auth, async (user)=>{
  currentUser = user;
  cloudLoaded = false;
  if (user) {
    document.getElementById("signInBtn").style.display = "none";
    document.getElementById("signOutBtn").style.display = "inline-block";
    document.getElementById("userStatus").textContent = `Signed in as ${user.email}. Checkmarks sync across devices.`;
    render();
    await loadCloud();
    render();
  } else {
    document.getElementById("signInBtn").style.display = "inline-block";
    document.getElementById("signOutBtn").style.display = "none";
    document.getElementById("userStatus").textContent = "Not signed in — checkmarks save only on this device.";
    cloudChecks = {};
    cloudLoaded = false;
    render();
  }
});
