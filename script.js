const $ = (id) => document.getElementById(id);
const read = (key, fallback=[]) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
let tasks = read("cm_tasks");
let schedules = read("cm_schedules");
let notes = read("cm_notes");

function toast(message){const el=$("toast");el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2200)}
function safeDate(value){if(!value)return "-";return new Date(value+"T00:00:00").toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"})}
function escapeHTML(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}

function showPage(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===page));
  document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
  $("pageCrumb").textContent={dashboard:"Dashboard",tasks:"Tugas Saya",schedule:"Jadwal Kuliah",notes:"Catatan"}[page];
  $("sidebar").classList.remove("open");
  if(page==="dashboard") renderDashboard();
}
document.querySelectorAll(".nav-link").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.go)));
$("menuToggle").addEventListener("click",()=>$("sidebar").classList.toggle("open"));
$("todayDate").textContent=new Date().toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"});

function taskMarkup(task){
  return `<div class="task-item"><input class="task-check" type="checkbox" data-toggle="${task.id}" ${task.done?"checked":""} aria-label="Tandai selesai"><div class="task-info"><b style="${task.done?"text-decoration:line-through;color:#a0a3b2":""}">${escapeHTML(task.title)}</b><small>${escapeHTML(task.course)} · Deadline ${safeDate(task.deadline)}</small></div><div class="task-meta"><span class="priority ${task.priority}">${task.priority}</span><button class="delete-btn" data-delete="${task.id}" aria-label="Hapus tugas">×</button></div></div>`;
}
function bindTaskActions(){
  document.querySelectorAll("[data-toggle]").forEach(el=>el.addEventListener("change",()=>{const t=tasks.find(x=>x.id===el.dataset.toggle);if(t){t.done=el.checked;save("cm_tasks",tasks);renderAll();toast(t.done?"Tugas ditandai selesai":"Status tugas diperbarui")}}));
  document.querySelectorAll("[data-delete]").forEach(el=>el.addEventListener("click",()=>{tasks=tasks.filter(t=>t.id!==el.dataset.delete);save("cm_tasks",tasks);renderAll();toast("Tugas dihapus")}));
}
function renderDashboard(){
  const done=tasks.filter(t=>t.done).length, total=tasks.length, pending=total-done, percent=total?Math.round(done/total*100):0;
  $("totalTasks").textContent=total;$("pendingTasks").textContent=pending;$("doneTasks").textContent=done;
  $("progressPercent").textContent=percent+"%";$("progressFraction").textContent=`${done} dari ${total}`;$("progressFill").style.width=percent+"%";
  const latest=[...tasks].sort((a,b)=>a.deadline.localeCompare(b.deadline)).slice(0,4);
  $("dashboardTasks").innerHTML=latest.length?latest.map(taskMarkup).join(""):'<div class="empty">Belum ada tugas. Tambahkan tugas pertamamu yuk!</div>';
  bindTaskActions();
}
function renderTasks(){
  const filter=$("taskFilter").value;
  const shown=tasks.filter(t=>filter==="all"||(filter==="done"?t.done:!t.done)).sort((a,b)=>a.deadline.localeCompare(b.deadline));
  $("allTasks").innerHTML=shown.length?shown.map(taskMarkup).join(""):'<div class="empty">Tidak ada tugas pada kategori ini.</div>';
  bindTaskActions();
}
function renderAll(){renderDashboard();renderTasks()}
$("addTaskBtn").addEventListener("click",()=>$("taskDialog").showModal());
$("closeDialog").addEventListener("click",()=>$("taskDialog").close());
$("taskFilter").addEventListener("change",renderTasks);
$("taskForm").addEventListener("submit",e=>{
  e.preventDefault();
  tasks.push({id:crypto.randomUUID(),title:$("taskTitle").value.trim(),course:$("taskCourse").value.trim(),deadline:$("taskDeadline").value,priority:$("taskPriority").value,done:false});
  save("cm_tasks",tasks);e.target.reset();$("taskDialog").close();renderAll();toast("Tugas berhasil ditambahkan");
});

function renderSchedules(){
  const days=["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
  const sorted=[...schedules].sort((a,b)=>days.indexOf(a.day)-days.indexOf(b.day)||a.time.localeCompare(b.time));
  $("scheduleList").innerHTML=sorted.length?sorted.map(s=>`<article class="schedule-card"><span class="schedule-day">${escapeHTML(s.day.toUpperCase())}</span><h3>${escapeHTML(s.name)}</h3><span class="schedule-time">◷ ${escapeHTML(s.time)}</span><button class="delete-btn" data-schedule-delete="${s.id}" aria-label="Hapus jadwal" style="float:right">×</button></article>`).join(""):'<div class="empty">Belum ada jadwal kuliah yang disimpan.</div>';
  document.querySelectorAll("[data-schedule-delete]").forEach(b=>b.addEventListener("click",()=>{schedules=schedules.filter(s=>s.id!==b.dataset.scheduleDelete);save("cm_schedules",schedules);renderSchedules();toast("Jadwal dihapus")}));
}
$("scheduleForm").addEventListener("submit",e=>{e.preventDefault();schedules.push({id:crypto.randomUUID(),name:$("courseName").value.trim(),day:$("courseDay").value,time:$("courseTime").value});save("cm_schedules",schedules);e.target.reset();renderSchedules();toast("Jadwal berhasil disimpan")});

function renderNotes(){
  $("notesList").innerHTML=notes.length?[...notes].reverse().map(n=>`<article class="note-card"><button class="delete-btn" data-note-delete="${n.id}" aria-label="Hapus catatan">×</button><h3>${escapeHTML(n.title)}</h3><p>${escapeHTML(n.body)}</p></article>`).join(""):'<div class="empty">Belum ada catatan. Tulis ide pertamamu!</div>';
  document.querySelectorAll("[data-note-delete]").forEach(b=>b.addEventListener("click",()=>{notes=notes.filter(n=>n.id!==b.dataset.noteDelete);save("cm_notes",notes);renderNotes();toast("Catatan dihapus")}));
}
$("noteForm").addEventListener("submit",e=>{e.preventDefault();notes.push({id:crypto.randomUUID(),title:$("noteTitle").value.trim(),body:$("noteBody").value.trim()});save("cm_notes",notes);e.target.reset();renderNotes();toast("Catatan berhasil disimpan")});

renderAll();renderSchedules();renderNotes();
