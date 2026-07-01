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
  ["☀️ Summer 2026",["Finish BIO 101 lab/posting","Retake POLS for A","Start COPE","Confirm ADN deadlines"]],
  ["🍂 Fall 2026",["Physiology","Microbiology","Sociology","Continue COPE","Join nursing club if possible"]],
  ["❄️ Winter 2027",["TEAS prep / take if ready","Resume","Essays","Recommendation planning"]],
  ["🌱 Spring 2027",["Submit ADN applications as windows open","Continue COPE","Only add verified remaining prerequisites"]],
  ["🌊 Summer / Fall 2027",["Finish any remaining UC/CSU prereqs","UC/CSU applications","Track transcripts and updates"]]
];

const deadlines = [
  ["🏛 UCLA","Aug 1","Nov 30 / Dec 1","Nursing Supplemental: Jan 15","Mar–Apr","⬜"],
  ["🏛 UC Irvine","Aug 1","Nov 30 / Dec 1","None","Mar–Apr","⬜"],
  ["🌊 CSU Long Beach","Aug 1","Nov 30","Nursing application + program requirements","Spring","⬜"],
  ["🟠 CSU Fullerton","Aug 1","Nov 30","Program-specific nursing requirements","Spring","⬜"],
  ["🦅 CSU Los Angeles","Aug 1","Nov 30","NursingCAS: Jan 15","Spring","⬜"],
  ["🌴 CSU Channel Islands","Aug 1","Nov 30","Program-specific nursing requirements","Spring","⬜"],
  ["🏔 CSUN","Aug 1","Nov 30","Program-specific nursing application","Spring","⬜"],
  ["🏥 Pierce ADN","Feb 15 / Sep 15","Mar 1 / Oct 1","TEAS, transcripts, nursing app","May–Jun or Nov–Dec","⬜"],
  ["🏥 Valley ADN","Apr 1 / September","Apr 30 / late September","TEAS, prereq eval, transcripts","After cycle","⬜"],
  ["🏥 LA City ADN","Jul 15 / Jan–Feb","Aug 15 / varies","TEAS, info session, transcripts","After cycle","⬜"]
];

const timeline = [
  ["July","Continue COPE / Summer classes"],
  ["Aug 1","UC & CSU applications open"],
  ["September","Begin essays / resume"],
  ["Oct 1","FAFSA/CADAA opens"],
  ["Nov 30 / Dec 1","Submit UC & CSU applications"],
  ["Jan 15","UCLA Nursing Supplemental / CSULA NursingCAS"],
  ["Jan 31","UC TAU"],
  ["Feb–Mar","ADN Fall-entry application windows begin"],
  ["Mar 2","Financial aid priority deadline"],
  ["April","Some ADN Fall deadlines close"],
  ["May–June","Many ADN decisions"],
  ["June 1","UC SIR if admitted"],
  ["July 1","Final UC transcripts if admitted"]
];

function saved(id, fallback=false){ return localStorage.getItem(id) === null ? fallback : localStorage.getItem(id) === "true"; }
function checkbox(id, checked=false){ return `<input class="task" type="checkbox" data-id="${id}" ${saved(id,checked)?"checked":""}>`; }

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

function updateCount(){
  const boxes = [...document.querySelectorAll(".task")];
  const done = boxes.filter(b=>b.checked).length;
  document.getElementById("doneCount").textContent = done;
  document.getElementById("totalCount").textContent = boxes.length;
  document.getElementById("progressBar").style.width = boxes.length ? (done/boxes.length*100)+"%" : "0%";
}
document.querySelectorAll(".task").forEach(b=>{
  b.addEventListener("change",()=>{ localStorage.setItem(b.dataset.id,b.checked); updateCount(); });
});
updateCount();
