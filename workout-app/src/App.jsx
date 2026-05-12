import { useState, useEffect } from "react";

const C = {
  bg:"#fdf6ee",card:"#ffffff",border:"#e8d5c0",border2:"#f0e4d4",
  dim:"#a8896e",gray:"#7a6048",muted:"#5c4433",light:"#3d2a1a",
  text:"#2d1a0e",white:"#1a0f06",green:"#4e8c45",blue:"#3d7e92",
  purple:"#9e6b7e",yellow:"#b8892a",red:"#c8653e",orange:"#be5f32",
};
const iSty={width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 11px",fontSize:13,color:C.text,outline:"none",fontFamily:"inherit"};
const slbl={fontSize:10,fontWeight:700,color:C.dim,letterSpacing:"0.07em",marginBottom:8};

const HIIT_BASE=[
  {round:1,phase:"Warm-up",  level:"4–5",  dur:"60s", rest:"—",   note:"Easy pace, find your footing. Don't grip rails."},
  {round:2,phase:"Work",     level:"8–9",  dur:"60s", rest:"90s", note:"First push — controlled effort. Full steps, heel drive."},
  {round:3,phase:"Work",     level:"8–9",  dur:"60s", rest:"90s", note:"Match round 2. Stay consistent."},
  {round:4,phase:"Peak",     level:"10–12",dur:"60s", rest:"60s", note:"Hardest block — push here while warm but not fatigued."},
  {round:5,phase:"Peak",     level:"10–12",dur:"60s", rest:"60s", note:"Hold the peak. Shorter rest — dig in."},
  {round:6,phase:"Work",     level:"8–10", dur:"60s", rest:"90s", note:"Sustain quality over chasing peak."},
  {round:7,phase:"Work",     level:"8–10", dur:"60s", rest:"90s", note:"Last full effort — give what's left."},
  {round:8,phase:"Cool-down",level:"3–4",  dur:"2min",rest:"—",   note:"Keep moving 2 full min. Don't stop abruptly."},
];

function parseRest(s) {
  if (!s || s === "—") return null;
  if (s.includes("min")) return parseInt(s) * 60;
  return parseInt(s);
}

function suggestLevels(pr){
  if(!pr) return null;
  return HIIT_BASE.map((_,i)=>{
    const p=pr[i]; if(!p||!p.actualLevel) return null;
    const n=Number(p.actualLevel); if(isNaN(n)) return null;
    if(p.effort==="easy") return String(n+1);
    if(p.effort==="hard") return String(Math.max(n-1,3));
    return String(n);
  });
}

const SESSIONS=[
  {id:"hiit",label:"HIIT",emoji:"⚡",color:C.red,freq:"1×/week",desc:"20 min Stairmaster · 8 rounds",details:"Peak HR: 150–165 bpm · Cool-down 2 min · Don't stop abruptly"},
  {id:"glute",label:"Glute Day A",emoji:"🍑",color:C.purple,freq:"1×/week",desc:"Hip thrusts · RDLs · Split squats · Kickbacks · Band walks",details:"45–55 min · Push the hip thrusts heavy",
   exercises:[
     {name:"Hip Thrusts",sets:"4 × 10–12",note:"Drive through heels. Full squeeze at top, 2-sec hold. Go heavy — your #1 glute builder."},
     {name:"Romanian Deadlift",sets:"3 × 10–12",note:"Hinge at hips, soft knee. Feel hamstring stretch at bottom. Don't round the back."},
     {name:"Bulgarian Split Squat",sets:"3 × 10 each",note:"Lean slightly forward to bias glutes. Back foot elevated. Front heel stays down."},
     {name:"Cable Kickbacks",sets:"3 × 15 each",note:"Start hip flexed — loaded stretch is key. Drive leg back, squeeze glute at peak."},
     {name:"Lateral Band Walks",sets:"3 × 20 steps",note:"Band above knees. Stay low, toes forward. Targets glute med — creates the outer shelf."},
   ]},
  {id:"back",label:"Back Day",emoji:"🔙",color:C.blue,freq:"1×/week",desc:"Lat pulldown · Cable row · DB row · Face pulls · Extensions",details:"45–55 min · Full stretch on every pull",
   exercises:[
     {name:"Lat Pulldown",sets:"4 × 10–12",note:"Wide grip, lean back slightly. Full stretch at top. Pull to upper chest, elbows drive down."},
     {name:"Seated Cable Row",sets:"4 × 10–12",note:"Sit tall. Full stretch forward, squeeze shoulder blades together at end."},
     {name:"Single-Arm DB Row",sets:"3 × 12 each",note:"Let weight stretch at bottom — full ROM builds definition. Drive elbow back, not up."},
     {name:"Face Pulls",sets:"3 × 15–20",note:"Pull to forehead, elbows high and wide. Key for rear delt + cross-back definition."},
     {name:"Back Extensions",sets:"3 × 15",note:"Controlled — don't hyperextend. Squeeze glutes at top. Builds lower back definition."},
   ]},
  {id:"posterior",label:"Posterior Chain",emoji:"⛓️",color:C.green,freq:"1×/week",desc:"Deadlifts · Glute bridge · Good mornings · Sumo squat · Rev flyes",details:"50–60 min · Deadlifts are the anchor — form first",
   exercises:[
     {name:"Conventional Deadlift",sets:"4 × 6–8",note:"Bar over mid-foot. Hinge back, chest up, lats tight. Drive floor away. Your biggest muscle builder."},
     {name:"Glute Bridge",sets:"3 × 12–15",note:"Different from Tuesday — lighter, more reps. Focus on the squeeze."},
     {name:"Good Mornings",sets:"3 × 12",note:"Light weight only. Teaches hip hinge. Feel hamstring load. Builds lower back definition."},
     {name:"Sumo Squat",sets:"3 × 12",note:"Wide stance, toes out 45°. More glute than regular squat. Goblet or dumbbells at chest."},
     {name:"Reverse Flyes",sets:"3 × 15",note:"Light DBs, hinge forward. Arms wide. Squeeze rear delts at top — cross-back finisher."},
     {name:"Clamshells w/ Band",sets:"3 × 20",note:"Band above knees, side-lying, hips stacked. Rotate top knee up without rolling pelvis."},
   ]},
  {id:"mindbody",label:"Pilates / Yoga",emoji:"🧘",color:C.orange,freq:"1–2×/week",desc:"Class-based · whichever is available",details:"Core activation, cortisol reduction, PCOS hormone support. Showing up is the goal."},
  {id:"vestwalk",label:"Vest Walk",emoji:"🦺",color:C.green,freq:"2×/week",desc:"45–90 min · Hills · 110–120 bpm · Non-gym days",details:"Non-gym days only — fresh legs. Drive through heels on hills.",
   logFields:[{id:"duration",label:"Duration (min)"},{id:"hr",label:"Avg HR (bpm)"},{id:"terrain",label:"Hills? (Y/N)"}]},
  {id:"walk",label:"Easy Walk",emoji:"🚶",color:C.blue,freq:"Daily",desc:"30–45 min · Flat · No vest · Recovery pace",details:"Non-negotiable daily anchor.",
   logFields:[{id:"duration",label:"Duration (min)"},{id:"steps",label:"Steps"}]},
];

const SUPPS=[
  {id:"bvit",  label:"B Vitamins",         when:"Morning · with breakfast",            color:C.yellow,emoji:"🌅"},
  {id:"ov_am", label:"Ovasitol (AM)",       when:"Morning · with tea or breakfast",     color:C.blue,  emoji:"☀️"},
  {id:"fish",  label:"Fish Oil",            when:"Dinner · with meal (fat absorption)", color:C.green, emoji:"🌆"},
  {id:"ov_pm", label:"Ovasitol (PM)",       when:"Evening · with dinner or tea",        color:C.blue,  emoji:"🌇"},
  {id:"mag",   label:"Magnesium Glycinate", when:"Bedtime · 30–60 min before sleep",    color:C.purple,emoji:"🌙"},
];

const TARGETS=[
  {id:"protein", label:"Protein 115–120g",   note:"~35–47g breakfast · ~46g lunch · ~37g dinner", color:C.purple,emoji:"🥩"},
  {id:"fiber",   label:"Fiber 25–30g",        note:"Chia + flax breakfast = 14–17g alone",         color:C.green, emoji:"🌿"},
  {id:"water",   label:"Water 2–2.5 L",       note:"+500ml on gym & HIIT days",                    color:C.blue,  emoji:"💧"},
  {id:"move",    label:"Move Ring 600 kcal",  note:"Floor not ceiling — gym days hit 700–900",      color:C.red,   emoji:"🔴"},
  {id:"exercise",label:"Exercise Ring 45 min",note:"Walk alone closes it",                          color:C.green, emoji:"🟢"},
  {id:"stand",   label:"Stand Ring 10 hrs",   note:"Your data sweet spot (not Apple default 12)",   color:C.blue,  emoji:"🔵"},
  {id:"sleep",   label:"Sleep 7–8 hrs",       note:"Consistent bedtime — key for PCOS cortisol",   color:C.purple,emoji:"😴"},
  {id:"weigh",   label:"Weigh-in (optional)", note:"Best on cycle D10–16 — your true weight",      color:C.yellow,emoji:"⚖️"},
];

// Macro goals
const MACRO_GOALS = {cal:1700, protein:118, carbs:115, fat:55, fiber:28};

const todayKey = () => "day_" + new Date().toISOString().slice(0,10);
const prevDayKey = () => { const d=new Date(); d.setDate(d.getDate()-1); return "day_"+d.toISOString().slice(0,10); };
const weekLabel = (d) => { const dt=new Date(d); return dt.toLocaleDateString("en-US",{month:"short",day:"numeric"}); };
const last7Days = () => Array.from({length:7},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()-i); return "day_"+d.toISOString().slice(0,10); }).reverse();
const currentWeekDays = () => {
  const today=new Date(), dow=today.getDay();
  const monday=new Date(today); monday.setDate(today.getDate()-((dow+6)%7));
  return Array.from({length:7},(_,i)=>{
    const d=new Date(monday); d.setDate(monday.getDate()+i);
    const iso=d.toISOString().slice(0,10);
    return {iso:"day_"+iso,label:d.toLocaleDateString("en-US",{weekday:"short"}).slice(0,1),fullLabel:d.toLocaleDateString("en-US",{weekday:"short"}),isToday:iso===new Date().toISOString().slice(0,10)};
  });
};

function Tick({checked,color}){
  return <div style={{width:24,height:24,borderRadius:7,flexShrink:0,pointerEvents:"none",border:`2px solid ${checked?color:"#d0b8a0"}`,background:checked?color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
    {checked&&<svg width="13" height="13" viewBox="0 0 13 13"><path d="M2 6.5l3.5 3.5 5.5-6" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
  </div>;
}
function Badge({children,color}){return <span style={{padding:"2px 7px",borderRadius:4,fontSize:10,fontWeight:700,background:`${color}1a`,color,border:`1px solid ${color}30`}}>{children}</span>;}
function Card({children,style}){return <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,...style}}>{children}</div>;}

function MBar({label,val,goal,color,unit="g"}){
  const v=Number(val)||0;
  const pct=Math.min((v/goal)*100,100);
  const hit=pct>=100;
  return <div style={{marginBottom:8}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
      <span style={{fontSize:11,color:C.gray}}>{label}</span>
      <span style={{fontSize:11,fontWeight:700,color:hit?C.green:color}}>{v}{unit}<span style={{color:C.dim,fontWeight:400}}> / {goal}{unit}</span></span>
    </div>
    <div style={{height:6,background:C.border2,borderRadius:3,overflow:"hidden"}}>
      <div style={{height:"100%",width:`${pct}%`,background:hit?C.green:color,borderRadius:3,transition:"width 0.4s"}}/>
    </div>
  </div>;
}

export default function App(){
  const [tab,setTab]=useState("tracker");
  const [week,setWeek]=useState(1);
  const [data,setData]=useState(()=>{
    try { return JSON.parse(localStorage.getItem("wt_data")||"{}"); } catch { return {}; }
  });
  const [startDate,setStartDate]=useState(()=>localStorage.getItem("wt_start")||"");
  const [showDateInput,setShowDateInput]=useState(false);
  const [openSess,setOpenSess]=useState(null);
  const [openEx,setOpenEx]=useState(null);
  const [planSub,setPlanSub]=useState("split");
  const [timer,setTimer]=useState({active:false,seconds:0,roundIdx:null});
  const TOTAL=6;

  // Persist data
  useEffect(()=>{
    try { localStorage.setItem("wt_data",JSON.stringify(data)); } catch {}
  },[data]);

  // Persist + apply start date
  useEffect(()=>{
    localStorage.setItem("wt_start",startDate);
    if(!startDate) return;
    const days=Math.floor((new Date()-new Date(startDate))/86400000);
    const w=Math.min(Math.max(Math.ceil((days+1)/7),1),TOTAL);
    setWeek(w);
  },[startDate]);

  // Rest countdown
  useEffect(()=>{
    if(!timer.active) return;
    if(timer.seconds<=0){ setTimer(t=>({...t,active:false,roundIdx:null})); return; }
    const id=setInterval(()=>setTimer(t=>({...t,seconds:t.seconds-1})),1000);
    return()=>clearInterval(id);
  },[timer.active,timer.seconds]);

  const startRestTimer=(idx,restStr)=>{
    const secs=parseRest(restStr);
    if(!secs) return;
    setTimer({active:true,seconds:secs,roundIdx:idx});
  };

  const exportData=()=>{
    const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),startDate,data},null,2)],{type:"application/json"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download=`workout_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
  };

  const wKey=`w${week}`;
  const wData=data[wKey]||{};
  const dKey=todayKey();
  const dData=data[dKey]||{};
  const prevData=data[prevDayKey()]||{};
  const macros=dData.macros||{};
  const sessCount=SESSIONS.filter(s=>wData[s.id]?.done).length;
  const suppsDone=SUPPS.filter(s=>dData[`s_${s.id}`]).length;
  const targetsDone=TARGETS.filter(t=>dData[`t_${t.id}`]).length;
  const suggestions=suggestLevels(prevData.hiitRounds);

  const autoWeek=startDate?Math.min(Math.max(Math.ceil((Math.floor((new Date()-new Date(startDate))/86400000)+1)/7),1),TOTAL):null;

  const upd=(fn)=>setData(d=>{const n={...d};fn(n);return n;});
  const toggleSess=(sid)=>upd(d=>{
    const wk=d[wKey]||{},sess=wk[sid]||{},done=!sess.done;
    const today=new Date().toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});
    d[wKey]={...wk,[sid]:{...sess,done,day:done?(sess.day||today):sess.day}};
  });
  const setDay=(sid,v)=>upd(d=>{d[wKey]={...(d[wKey]||{}),[sid]:{...(d[wKey]?.[sid]||{}),day:v}};});
  const setLog=(sid,fid,v)=>upd(d=>{const s=d[wKey]?.[sid]||{};d[wKey]={...(d[wKey]||{}),[sid]:{...s,log:{...(s.log||{}),[fid]:v}}};});
  const setWt=(sid,ex,wi,v)=>upd(d=>{const k=`w${wi+1}`,s=d[k]?.[sid]||{};d[k]={...(d[k]||{}),[sid]:{...s,weights:{...(s.weights||{}),[ex]:v}}};});
  const toggleDay=(pfx,id)=>upd(d=>{const dd=d[dKey]||{};d[dKey]={...dd,[`${pfx}_${id}`]:!dd[`${pfx}_${id}`]};});
  const setHiitRound=(idx,field,val)=>upd(d=>{
    const dd=d[dKey]||{};
    const rounds=dd.hiitRounds?[...dd.hiitRounds]:HIIT_BASE.map(()=>({}));
    rounds[idx]={...(rounds[idx]||{}),[field]:val};
    d[dKey]={...dd,hiitRounds:rounds};
  });
  const setMacro=(field,val)=>upd(d=>{const dd=d[dKey]||{};d[dKey]={...dd,macros:{...(dd.macros||{}),[field]:val}};});

  const TABS=[
    {id:"tracker",label:"Tracker",icon:"✓"},
    {id:"loads",  label:"Loads",  icon:"🏋️"},
    {id:"daily",  label:"Daily",  icon:"☀️"},
    {id:"macros", label:"Macros", icon:"🥗"},
    {id:"plan",   label:"Plan",   icon:"📋"},
    {id:"ref",    label:"Targets",icon:"🎯"},
  ];
  const PLAN_SUBS=[{id:"split",label:"Weekly Split"},{id:"gym",label:"Gym Sessions"},{id:"walks",label:"Walk Protocol"},{id:"progress",label:"Progression"}];

  return(
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'DM Sans',system-ui,sans-serif",color:C.text,fontSize:13}}>

      {/* HEADER */}
      <div style={{position:"sticky",top:0,zIndex:100,background:`linear-gradient(180deg,#f5e6d2,${C.bg})`,padding:"14px 14px 0",borderBottom:`1px solid ${C.border2}`}}>
        <div style={{maxWidth:680,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <div>
              <div style={{fontSize:16,fontWeight:800,color:C.white,letterSpacing:"-0.02em"}}>WORKOUT TRACKER</div>
              <div style={{fontSize:10,color:C.dim,marginTop:1}}>6-week fat loss · flexible schedule</div>
            </div>
            {(tab==="tracker"||tab==="loads")&&(
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5}}>
                {/* Week navigator */}
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <button onClick={()=>setWeek(w=>Math.max(1,w-1))} style={{width:30,height:30,borderRadius:7,border:`1px solid ${C.border}`,background:C.card,color:C.muted,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
                  <span style={{fontSize:12,fontWeight:700,color:C.text,minWidth:55,textAlign:"center"}}>
                    Wk {week}<span style={{color:C.dim,fontWeight:400}}> / {TOTAL}</span>
                    {autoWeek&&week===autoWeek&&<span style={{display:"block",fontSize:8,color:C.green,fontWeight:600,textAlign:"center"}}>current</span>}
                  </span>
                  <button onClick={()=>setWeek(w=>Math.min(TOTAL,w+1))} style={{width:30,height:30,borderRadius:7,border:`1px solid ${C.border}`,background:C.card,color:C.muted,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
                </div>
                {/* Start date */}
                {showDateInput?(
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <input type="date" value={startDate} onChange={e=>{setStartDate(e.target.value);setShowDateInput(false);}}
                      style={{...iSty,width:130,padding:"3px 7px",fontSize:11}}/>
                    <button onClick={()=>setShowDateInput(false)} style={{background:"none",border:"none",color:C.dim,cursor:"pointer",fontSize:13}}>✕</button>
                  </div>
                ):(
                  <button onClick={()=>setShowDateInput(true)} style={{background:"none",border:"none",cursor:"pointer",fontSize:9,color:startDate?C.green:C.dim,padding:0}}>
                    {startDate?`started ${new Date(startDate).toLocaleDateString("en-US",{month:"short",day:"numeric"})} · edit`:"set start date"}
                  </button>
                )}
              </div>
            )}
            {(tab==="daily"||tab==="macros")&&<div style={{fontSize:10,color:C.gray}}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"})}</div>}
          </div>

          {/* Progress bars */}
          {(tab==="tracker"||tab==="loads")&&(
            <div style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:9,color:C.dim}}>Week {week} sessions</span><span style={{fontSize:9,color:C.green,fontWeight:700}}>{sessCount}/{SESSIONS.length}</span></div>
              <div style={{height:3,background:C.border2,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${(sessCount/SESSIONS.length)*100}%`,background:`linear-gradient(90deg,${C.green},${C.blue})`,borderRadius:2,transition:"width 0.4s"}}/></div>
            </div>
          )}
          {tab==="daily"&&(
            <div style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:9,color:C.dim}}>Today's checklist</span><span style={{fontSize:9,color:C.yellow,fontWeight:700}}>{suppsDone+targetsDone}/{SUPPS.length+TARGETS.length}</span></div>
              <div style={{height:3,background:C.border2,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${((suppsDone+targetsDone)/(SUPPS.length+TARGETS.length))*100}%`,background:`linear-gradient(90deg,${C.yellow},${C.purple})`,borderRadius:2,transition:"width 0.4s"}}/></div>
            </div>
          )}
          {tab==="macros"&&(
            <div style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:9,color:C.dim}}>Today's calories</span><span style={{fontSize:9,color:C.blue,fontWeight:700}}>{Number(macros.cal)||0} / {MACRO_GOALS.cal} kcal</span></div>
              <div style={{height:3,background:C.border2,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(((Number(macros.cal)||0)/MACRO_GOALS.cal)*100,100)}%`,background:`linear-gradient(90deg,${C.blue},${C.green})`,borderRadius:2,transition:"width 0.4s"}}/></div>
            </div>
          )}

          {/* Tabs */}
          <div style={{display:"flex",gap:1}}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"7px 1px",background:"none",border:"none",cursor:"pointer",fontSize:9,fontWeight:tab===t.id?700:400,color:tab===t.id?C.text:C.dim,borderBottom:tab===t.id?`2px solid ${C.blue}`:"2px solid transparent",transition:"all 0.15s"}}>
                {t.icon}<br/>{t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:680,margin:"0 auto",padding:14,paddingBottom:40}}>

        {/* ══ TRACKER ══ */}
        {tab==="tracker"&&(
          <div style={{display:"flex",gap:5,marginBottom:12}}>
            {currentWeekDays().map(({iso,label,fullLabel,isToday})=>{
              const dayData=data[iso]||{};
              const hasDaily=Object.keys(dayData).length>0;
              const hasSession=SESSIONS.some(s=>{const sd=wData[s.id]||{}; return sd.done&&sd.day&&sd.day.toLowerCase().includes(fullLabel.toLowerCase());});
              const active=hasDaily||hasSession;
              return(
                <div key={iso} style={{flex:1,textAlign:"center",padding:"7px 2px",borderRadius:8,border:`1px solid ${isToday?C.yellow:active?C.green+"60":C.border2}`,background:active?C.green+"18":isToday?C.yellow+"0a":"transparent"}}>
                  <div style={{fontSize:9,fontWeight:700,color:isToday?C.yellow:active?C.green:C.dim}}>{label}</div>
                  <div style={{width:6,height:6,borderRadius:"50%",background:active?C.green:C.border2,margin:"4px auto 0"}}/>
                </div>
              );
            })}
          </div>
        )}
        {tab==="tracker"&&SESSIONS.map(s=>{
          const sd=wData[s.id]||{},done=sd.done||false,open=openSess===s.id;
          return(
            <div key={s.id} style={{background:done?`${s.color}09`:C.card,border:`1px solid ${done?s.color+"35":C.border}`,borderRadius:12,marginBottom:8,overflow:"hidden",transition:"all 0.2s"}}>
              <div style={{display:"flex",alignItems:"center",padding:"12px 14px",gap:10}}>
                <div onClick={()=>toggleSess(s.id)} style={{cursor:"pointer"}}><Tick checked={done} color={s.color}/></div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:2}}>
                    <span style={{fontSize:13,fontWeight:700,color:done?s.color:C.text}}>{s.emoji} {s.label}</span>
                    <Badge color={s.color}>{s.freq}</Badge>
                  </div>
                  <div style={{fontSize:11,color:C.gray}}>{s.desc}</div>
                  {done&&sd.day&&<div style={{fontSize:10,color:s.color,marginTop:3,fontWeight:600}}>✓ {sd.day}</div>}
                </div>
                <button onClick={()=>setOpenSess(open?null:s.id)} style={{background:"none",border:"none",cursor:"pointer",color:C.dim,fontSize:14,padding:4,transform:open?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▾</button>
              </div>

              {open&&(
                <div style={{borderTop:`1px solid ${s.color}20`,padding:"12px 14px",background:`${s.color}04`}}>
                  <div style={{fontSize:11,color:C.muted,marginBottom:10}}>{s.details}</div>
                  <label style={{fontSize:10,color:C.dim,fontWeight:700,display:"block",marginBottom:5}}>DAY COMPLETED</label>
                  <input type="text" placeholder="e.g. Monday" value={sd.day||""} onChange={e=>setDay(s.id,e.target.value)} style={{...iSty,marginBottom:12}}/>

                  {/* HIIT rounds */}
                  {s.id==="hiit"&&(
                    <div>
                      {suggestions&&<div style={{fontSize:10,color:C.yellow,background:"rgba(184,137,42,0.08)",border:"1px solid rgba(184,137,42,0.25)",borderRadius:7,padding:"7px 10px",marginBottom:10}}>💡 Levels suggested from yesterday — adjust as you feel</div>}

                      {/* Active rest timer banner */}
                      {timer.active&&(
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(200,101,62,0.08)",border:"1px solid rgba(200,101,62,0.25)",borderRadius:9,padding:"10px 14px",marginBottom:10}}>
                          <div>
                            <div style={{fontSize:10,color:C.dim,fontWeight:700,marginBottom:2}}>REST — Round {(timer.roundIdx??0)+1}</div>
                            <div style={{fontSize:28,fontWeight:800,color:timer.seconds<=10?C.red:C.text,fontVariantNumeric:"tabular-nums",lineHeight:1}}>
                              {Math.floor(timer.seconds/60).toString().padStart(2,"0")}:{(timer.seconds%60).toString().padStart(2,"0")}
                            </div>
                          </div>
                          <button onClick={()=>setTimer({active:false,seconds:0,roundIdx:null})} style={{background:"rgba(248,113,113,0.15)",border:"1px solid rgba(248,113,113,0.3)",borderRadius:7,padding:"6px 10px",color:C.red,cursor:"pointer",fontSize:11,fontWeight:700}}>Skip</button>
                        </div>
                      )}

                      <div style={slbl}>8-ROUND LOG</div>
                      {HIIT_BASE.map((r,i)=>{
                        const rd=(dData.hiitRounds||[])[i]||{};
                        const sug=suggestions?.[i];
                        const isDone=!!rd.done;
                        const restSecs=parseRest(r.rest);
                        const isTimingThisRound=timer.active&&timer.roundIdx===i;
                        return(
                          <div key={i} style={{background:isDone?`${s.color}0a`:C.bg,border:`1px solid ${isDone?s.color+"30":C.border2}`,borderRadius:9,padding:"9px 10px",marginBottom:5}}>
                            <div style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:isDone?0:6}}>
                              <div onClick={()=>setHiitRound(i,"done",!isDone)} style={{cursor:"pointer",marginTop:2}}><Tick checked={isDone} color={s.color}/></div>
                              <div style={{flex:1}}>
                                <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:2}}>
                                  <span style={{fontSize:11,fontWeight:700,color:isDone?s.color:C.text}}>Round {r.round} — {r.phase}</span>
                                  <span style={{fontSize:9,color:C.dim}}>Level {r.level} · {r.dur}</span>
                                  {sug&&!isDone&&<span style={{fontSize:9,color:C.yellow,fontWeight:700}}>→ Try {sug}</span>}
                                </div>
                                <div style={{fontSize:10,color:C.gray}}>{r.note}</div>
                                {/* Rest timer trigger — shown after marking done, if rest exists */}
                                {isDone&&restSecs&&(
                                  <div style={{marginTop:6}}>
                                    {isTimingThisRound?(
                                      <span style={{fontSize:10,color:C.red,fontWeight:700}}>
                                        resting {Math.floor(timer.seconds/60).toString().padStart(2,"0")}:{(timer.seconds%60).toString().padStart(2,"0")}
                                      </span>
                                    ):(
                                      <button onClick={()=>startRestTimer(i,r.rest)} style={{background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.25)",borderRadius:6,padding:"3px 9px",color:C.red,cursor:"pointer",fontSize:10,fontWeight:700}}>
                                        ▶ Rest {r.rest}
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            {!isDone&&(
                              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5,paddingLeft:32}}>
                                <div><div style={{fontSize:8,color:C.dim,marginBottom:2}}>Actual Level</div><input type="number" placeholder={sug||r.level.split("–")[0]} value={rd.actualLevel||""} onChange={e=>setHiitRound(i,"actualLevel",e.target.value)} style={{...iSty,padding:"5px 7px",fontSize:11}}/></div>
                                <div><div style={{fontSize:8,color:C.dim,marginBottom:2}}>Rest (sec)</div><input type="number" placeholder={r.rest==="—"?"—":r.rest.replace("s","")} value={rd.rest||""} onChange={e=>setHiitRound(i,"rest",e.target.value)} style={{...iSty,padding:"5px 7px",fontSize:11}}/></div>
                                <div><div style={{fontSize:8,color:C.dim,marginBottom:2}}>Effort</div>
                                  <select value={rd.effort||""} onChange={e=>setHiitRound(i,"effort",e.target.value)} style={{...iSty,padding:"5px 7px",fontSize:11}}>
                                    <option value="">—</option><option value="easy">Easy</option><option value="good">Good</option><option value="hard">Hard</option>
                                  </select>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Log fields */}
                  {s.logFields&&(
                    <><div style={slbl}>SESSION LOG</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:4}}>
                      {s.logFields.map(f=>(
                        <div key={f.id}>
                          <label style={{fontSize:10,color:C.gray,display:"block",marginBottom:3}}>{f.label}</label>
                          <input type="text" placeholder="—" value={(sd.log||{})[f.id]||""} onChange={e=>setLog(s.id,f.id,e.target.value)} style={iSty}/>
                        </div>
                      ))}
                    </div></>
                  )}

                  {/* Mind-body */}
                  {s.id==="mindbody"&&(
                    <div style={{background:`${s.color}0a`,border:`1px solid ${s.color}20`,borderRadius:9,padding:"10px 12px",marginTop:4}}>
                      <div style={{fontSize:11,color:C.gray}}>Tap the checkbox to log. No further tracking needed — showing up is the goal. ✓</div>
                    </div>
                  )}

                  {/* Exercises with form notes */}
                  {s.exercises&&(
                    <>
                      <div style={{...slbl,marginTop:12}}>EXERCISES — tap to log weight</div>
                      {s.exercises.map(ex=>{
                        const ek=`${s.id}_${ex.name}`,exOpen=openEx===ek,curWt=(sd.weights||{})[ex.name]||"";
                        return(
                          <div key={ex.name} style={{marginBottom:5}}>
                            <button onClick={()=>setOpenEx(exOpen?null:ek)} style={{width:"100%",background:C.bg,border:`1px solid ${C.border2}`,borderRadius:9,padding:"9px 12px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                              <span style={{fontSize:12,color:C.text,fontWeight:600}}>{ex.name}</span>
                              <div style={{display:"flex",alignItems:"center",gap:8}}>
                                <span style={{fontSize:10,color:C.gray}}>{ex.sets}</span>
                                {curWt&&<span style={{fontSize:10,color:s.color,fontWeight:700}}>{curWt} lbs</span>}
                                <span style={{color:C.dim,fontSize:11}}>{exOpen?"▴":"▾"}</span>
                              </div>
                            </button>
                            {exOpen&&(
                              <div style={{padding:"10px 12px",background:"#faf0e4",borderRadius:"0 0 9px 9px",border:`1px solid ${C.border2}`,borderTop:"none"}}>
                                <div style={{fontSize:11,color:C.muted,lineHeight:1.6,marginBottom:8,padding:"7px 9px",background:`${s.color}08`,borderRadius:6,border:`1px solid ${s.color}15`}}>💡 {ex.note}</div>
                                <label style={{fontSize:10,color:C.gray,display:"block",marginBottom:4}}>Weight used (lbs)</label>
                                <input type="number" placeholder="0" value={curWt} onChange={e=>setWt(s.id,ex.name,week-1,e.target.value)} style={{...iSty,width:130}}/>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* ══ LOADS ══ */}
        {tab==="loads"&&(
          <div>
            <div style={{fontSize:11,color:C.dim,marginBottom:14,lineHeight:1.5}}>Add <span style={{color:C.green,fontWeight:700}}>2.5–5 lbs</span> every 1–2 weeks when all reps clean. ▲ green = PR, ▼ red = dropped.</div>
            {SESSIONS.filter(s=>s.exercises).map(s=>(
              <div key={s.id} style={{marginBottom:18}}>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8}}>
                  <span style={{fontSize:15}}>{s.emoji}</span>
                  <span style={{fontSize:13,fontWeight:700,color:s.color}}>{s.label}</span>
                </div>
                {s.exercises.map(ex=>{
                  const allW=Array.from({length:TOTAL},(_,i)=>((data[`w${i+1}`]?.[s.id]?.weights)||{})[ex.name]||"");
                  return(
                    <div key={ex.name} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:10,marginBottom:6}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                        <span style={{fontSize:12,fontWeight:600,color:C.text}}>{ex.name}</span>
                        <span style={{fontSize:10,color:C.dim}}>{ex.sets}</span>
                      </div>
                      <div style={{fontSize:9,color:C.muted,marginBottom:7,lineHeight:1.4}}>{ex.note}</div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:4}}>
                        {allW.map((val,i)=>(
                          <div key={i} style={{textAlign:"center"}}>
                            <div style={{fontSize:8,color:i+1===autoWeek?C.green:C.dim,marginBottom:3,fontWeight:i+1===autoWeek?700:400}}>Wk {i+1}{i+1===autoWeek?" ·":""}</div>
                            <input type="number" placeholder="—" value={val} onChange={e=>setWt(s.id,ex.name,i,e.target.value)}
                              style={{width:"100%",textAlign:"center",outline:"none",borderRadius:6,padding:"4px 1px",fontSize:11,fontWeight:val?700:400,background:val?`${s.color}14`:C.bg,border:`1px solid ${val?s.color+"40":C.border2}`,color:val?s.color:C.dim}}/>
                            {val&&i>0&&allW[i-1]&&<div style={{fontSize:8,marginTop:2,fontWeight:700,color:Number(val)>=Number(allW[i-1])?C.green:C.red}}>{Number(val)>=Number(allW[i-1])?"▲":"▼"}{Math.abs(Number(val)-Number(allW[i-1]))}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{if(window.confirm(`Reset Week ${week}?`))upd(d=>{delete d[wKey];})}} style={{flex:1,background:"none",border:`1px solid ${C.border}`,borderRadius:9,padding:"10px 0",color:C.dim,fontSize:12,cursor:"pointer"}}>Reset Week {week} Data</button>
              <button onClick={exportData} style={{flex:1,background:"rgba(96,165,250,0.07)",border:`1px solid rgba(96,165,250,0.25)`,borderRadius:9,padding:"10px 0",color:C.blue,fontSize:12,cursor:"pointer",fontWeight:600}}>⬇ Export Backup</button>
            </div>
          </div>
        )}

        {/* ══ DAILY CHECKLIST ══ */}
        {tab==="daily"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
              <Card style={{padding:"12px 14px"}}><div style={{fontSize:22,fontWeight:800,color:suppsDone===SUPPS.length?C.green:C.yellow}}>{suppsDone}<span style={{fontSize:14,color:C.dim,fontWeight:400}}>/{SUPPS.length}</span></div><div style={{fontSize:10,color:C.gray,marginTop:2}}>Supplements taken</div></Card>
              <Card style={{padding:"12px 14px"}}><div style={{fontSize:22,fontWeight:800,color:targetsDone===TARGETS.length?C.green:C.blue}}>{targetsDone}<span style={{fontSize:14,color:C.dim,fontWeight:400}}>/{TARGETS.length}</span></div><div style={{fontSize:10,color:C.gray,marginTop:2}}>Daily targets hit</div></Card>
            </div>

            <div style={slbl}>💊 SUPPLEMENTS</div>
            <Card style={{overflow:"hidden",marginBottom:14}}>
              {SUPPS.map((s,i)=>{
                const ch=!!dData[`s_${s.id}`];
                return(
                  <div key={s.id} onClick={()=>toggleDay("s",s.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 14px",borderBottom:i<SUPPS.length-1?`1px solid ${C.border2}`:"none",background:ch?`${s.color}07`:"transparent",cursor:"pointer",transition:"background 0.15s"}}>
                    <Tick checked={ch} color={s.color}/>
                    <span style={{fontSize:20,flexShrink:0}}>{s.emoji}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:700,color:ch?s.color:C.text,transition:"color 0.15s"}}>{s.label}</div>
                      <div style={{fontSize:10,color:C.gray,marginTop:1}}>{s.when}</div>
                    </div>
                    {ch&&<span style={{fontSize:13,color:s.color,fontWeight:800}}>✓</span>}
                  </div>
                );
              })}
            </Card>

            <div style={slbl}>🎯 DAILY TARGETS</div>
            <Card style={{overflow:"hidden",marginBottom:14}}>
              {TARGETS.map((t,i)=>{
                const ch=!!dData[`t_${t.id}`];
                return(
                  <div key={t.id} onClick={()=>toggleDay("t",t.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 14px",borderBottom:i<TARGETS.length-1?`1px solid ${C.border2}`:"none",background:ch?`${t.color}07`:"transparent",cursor:"pointer",transition:"background 0.15s"}}>
                    <Tick checked={ch} color={t.color}/>
                    <span style={{fontSize:20,flexShrink:0}}>{t.emoji}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:700,color:ch?t.color:C.text,transition:"color 0.15s"}}>{t.label}</div>
                      <div style={{fontSize:10,color:C.gray,marginTop:1}}>{t.note}</div>
                    </div>
                    {ch&&<span style={{fontSize:13,color:t.color,fontWeight:800}}>✓</span>}
                  </div>
                );
              })}
            </Card>
            <button onClick={()=>{if(window.confirm("Reset today?"))upd(d=>{delete d[dKey];});}} style={{width:"100%",background:"none",border:`1px solid ${C.border}`,borderRadius:9,padding:"10px 0",color:C.dim,fontSize:12,cursor:"pointer"}}>Reset Today's Checklist</button>
          </div>
        )}

        {/* ══ MACROS (manual entry from Cronometer) ══ */}
        {tab==="macros"&&(
          <div>
            {/* Instructions */}
            <div style={{background:"rgba(61,126,146,0.06)",border:`1px solid rgba(61,126,146,0.2)`,borderRadius:10,padding:"11px 13px",marginBottom:14,fontSize:11,color:C.muted,lineHeight:1.6}}>
              📲 Log your meals in <span style={{color:C.blue,fontWeight:700}}>Cronometer</span>, then enter your daily totals here. Takes 20 seconds and keeps your nutrition alongside your training data.
            </div>

            {/* Today's input */}
            <div style={slbl}>TODAY'S TOTALS — from Cronometer</div>
            <Card style={{padding:"14px",marginBottom:14}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                {[
                  {field:"cal",    label:"Calories",   unit:"kcal", color:C.blue,   goal:MACRO_GOALS.cal},
                  {field:"protein",label:"Protein",    unit:"g",    color:C.purple, goal:MACRO_GOALS.protein},
                  {field:"carbs",  label:"Carbs",      unit:"g",    color:C.yellow, goal:MACRO_GOALS.carbs},
                  {field:"fat",    label:"Fat",        unit:"g",    color:C.orange, goal:MACRO_GOALS.fat},
                  {field:"fiber",  label:"Fiber",      unit:"g",    color:C.green,  goal:MACRO_GOALS.fiber},
                ].map(m=>(
                  <div key={m.field}>
                    <label style={{fontSize:10,color:C.gray,display:"block",marginBottom:3}}>{m.label} <span style={{color:C.dim}}>({m.unit}) — goal: {m.goal}</span></label>
                    <input type="number" placeholder="0" value={macros[m.field]||""} onChange={e=>setMacro(m.field,e.target.value)}
                      style={{...iSty,borderColor:macros[m.field]?m.color+60:C.border,color:macros[m.field]?m.color:C.muted,fontWeight:macros[m.field]?700:400}}/>
                  </div>
                ))}
              </div>

              {/* Progress bars */}
              <MBar label="Calories" val={macros.cal}     goal={MACRO_GOALS.cal}     color={C.blue}   unit=" kcal"/>
              <MBar label="Protein"  val={macros.protein} goal={MACRO_GOALS.protein} color={C.purple} />
              <MBar label="Carbs"    val={macros.carbs}   goal={MACRO_GOALS.carbs}   color={C.yellow} />
              <MBar label="Fat"      val={macros.fat}     goal={MACRO_GOALS.fat}     color={C.orange} />
              <MBar label="Fiber"    val={macros.fiber}   goal={MACRO_GOALS.fiber}   color={C.green}  />
            </Card>

            {/* 7-day history */}
            <div style={slbl}>7-DAY OVERVIEW</div>
            <Card style={{overflow:"hidden",marginBottom:14}}>
              <div style={{padding:"10px 12px",background:C.border2,borderBottom:`1px solid ${C.border}`}}>
                <div style={{display:"grid",gridTemplateColumns:"60px 1fr 50px 50px 50px 50px",gap:6}}>
                  {["Date","Cal","Pro","Carb","Fat","Fib"].map(h=><div key={h} style={{fontSize:9,fontWeight:700,color:C.dim,textTransform:"uppercase"}}>{h}</div>)}
                </div>
              </div>
              {last7Days().map((dk,i)=>{
                const d=data[dk]||{};
                const m=d.macros||{};
                const isToday=dk===dKey;
                const hasData=m.cal||m.protein;
                return(
                  <div key={dk} style={{padding:"9px 12px",borderBottom:i<6?`1px solid ${C.border2}`:"none",background:isToday?"rgba(61,126,146,0.06)":"transparent"}}>
                    <div style={{display:"grid",gridTemplateColumns:"60px 1fr 50px 50px 50px 50px",gap:6,alignItems:"center"}}>
                      <div style={{fontSize:10,fontWeight:isToday?700:400,color:isToday?C.blue:C.gray}}>{isToday?"Today":weekLabel(dk.replace("day_",""))}</div>
                      <div style={{height:4,background:C.border2,borderRadius:2,overflow:"hidden"}}>
                        {m.cal&&<div style={{height:"100%",width:`${Math.min((Number(m.cal)/MACRO_GOALS.cal)*100,100)}%`,background:Number(m.cal)>=MACRO_GOALS.cal?C.green:C.blue,borderRadius:2}}/>}
                      </div>
                      {[{f:"cal",c:C.blue},{f:"protein",c:C.purple},{f:"carbs",c:C.yellow},{f:"fat",c:C.orange},{f:"fiber",c:C.green}].slice(0,4).map(x=>(
                        <div key={x.f} style={{fontSize:10,color:m[x.f]?x.c:C.dim,fontWeight:m[x.f]?600:400}}>{m[x.f]||"—"}</div>
                      ))}
                      <div style={{fontSize:10,color:m.fiber?C.green:C.dim,fontWeight:m.fiber?600:400}}>{m.fiber||"—"}</div>
                    </div>
                  </div>
                );
              })}
            </Card>

            {/* Macro targets reminder */}
            <Card style={{padding:"12px 14px"}}>
              <div style={{fontSize:11,fontWeight:700,color:C.muted,marginBottom:8}}>YOUR TARGETS</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,textAlign:"center"}}>
                {[{label:"Calories",val:"1700",unit:"kcal",color:C.blue},{label:"Protein",val:"118",unit:"g",color:C.purple},{label:"Carbs",val:"115",unit:"g",color:C.yellow},{label:"Fat",val:"55",unit:"g",color:C.orange},{label:"Fiber",val:"28",unit:"g",color:C.green}].map(t=>(
                  <div key={t.label} style={{padding:"8px 4px",background:C.bg,borderRadius:8,border:`1px solid ${C.border2}`}}>
                    <div style={{fontSize:14,fontWeight:800,color:t.color}}>{t.val}</div>
                    <div style={{fontSize:8,color:C.dim}}>{t.unit}</div>
                    <div style={{fontSize:8,color:C.gray,marginTop:1}}>{t.label}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ══ PLAN ══ */}
        {tab==="plan"&&(
          <div>
            <div style={{display:"flex",gap:5,marginBottom:14,flexWrap:"wrap"}}>
              {PLAN_SUBS.map(s=>(
                <button key={s.id} onClick={()=>setPlanSub(s.id)} style={{padding:"6px 12px",borderRadius:7,fontSize:11,cursor:"pointer",fontWeight:planSub===s.id?700:400,background:planSub===s.id?C.blue:C.card,border:`1px solid ${planSub===s.id?C.blue:C.border}`,color:planSub===s.id?"#fff":C.gray,transition:"all 0.15s"}}>{s.label}</button>
              ))}
            </div>

            {planSub==="split"&&(
              <div>
                <div style={{fontSize:11,color:C.dim,marginBottom:12,lineHeight:1.5}}>Flexible — shift days to fit your life. Keep <span style={{color:C.green,fontWeight:700}}>48 hrs</span> between heavy sessions.</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:14}}>
                  {[{val:"7",lbl:"Walk days",color:C.green},{val:"3",lbl:"Gym sessions",color:C.blue},{val:"1",lbl:"HIIT",color:C.red},{val:"1–2",lbl:"Mind-Body",color:C.orange}].map(t=>(
                    <Card key={t.lbl} style={{padding:"9px 7px",textAlign:"center"}}><div style={{fontSize:18,fontWeight:800,color:t.color}}>{t.val}</div><div style={{fontSize:8,color:C.gray,marginTop:2}}>{t.lbl}</div></Card>
                  ))}
                </div>
                {[
                  {day:"Mon",label:"HIIT + Pilates/Yoga + Walk",color:C.red,pills:["HIIT 20 min","Pilates or Yoga","Flat walk 30 min"],pillColors:[C.red,C.orange,C.blue],note:"HIIT first. Mind-body after. Short flat walk — no vest.",focus:null},
                  {day:"Tue",label:"Glute Day A + Easy Walk",color:C.purple,pills:["Gym 45–55 min","Easy walk 30 min"],pillColors:[C.purple,C.blue],note:"Hip thrusts + RDLs as anchors. Walk after — no vest.",focus:"GLUTES"},
                  {day:"Wed",label:"Back Day + Walk",color:C.blue,pills:["Gym 45–55 min","Walk 30–45 min"],pillColors:[C.blue,C.blue],note:"Lat pulldown/rows as anchors. Upper + lower back. No vest.",focus:"BACK"},
                  {day:"Thu",label:"Posterior Chain + Walk",color:C.green,pills:["Gym 50–60 min","Walk 30–45 min"],pillColors:[C.green,C.blue],note:"Deadlifts anchor this day. Combines back + glutes. No vest.",focus:"BACK+GLUTES"},
                  {day:"Fri",label:"🦺 Vest Walk + Mind-Body",color:C.green,pills:["Vest walk 45–60 min","Pilates or Yoga"],pillColors:[C.green,C.orange],note:"Hills with vest. Target 110–120 bpm. Mind-body in evening.",focus:null},
                  {day:"Sat",label:"🦺 Long Vest Walk",color:C.green,pills:["Vest walk 60–90 min"],pillColors:[C.green],note:"Longest walk of the week. Hills. Fresh legs — no gym.",focus:null},
                  {day:"Sun",label:"Recovery",color:C.dim,pills:["Easy walk 30–45 min"],pillColors:[C.blue],note:"True recovery. Flat, easy pace. Let the body repair.",focus:null},
                ].map((d,i)=>(
                  <Card key={i} style={{marginBottom:7,overflow:"hidden",borderTop:`3px solid ${d.color}`}}>
                    <div style={{padding:"11px 12px"}}>
                      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:7}}>
                        <div>
                          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4}}>
                            <span style={{fontSize:12,fontWeight:800,color:d.color}}>{d.day}</span>
                            <span style={{fontSize:11,fontWeight:600,color:C.text}}>{d.label}</span>
                          </div>
                          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                            {d.pills.map((p,j)=><span key={j} style={{padding:"2px 7px",borderRadius:4,fontSize:9,fontWeight:600,background:`${d.pillColors[j]}18`,color:d.pillColors[j],border:`1px solid ${d.pillColors[j]}30`}}>{p}</span>)}
                          </div>
                        </div>
                        {d.focus&&<span style={{padding:"2px 7px",borderRadius:4,fontSize:8,fontWeight:800,background:`${d.color}20`,color:d.color,border:`1px solid ${d.color}35`,letterSpacing:"0.04em",flexShrink:0}}>{d.focus}</span>}
                      </div>
                      <div style={{fontSize:10,color:C.gray,lineHeight:1.5}}>{d.note}</div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {planSub==="gym"&&(
              <div>
                {[
                  {label:"Monday — HIIT",color:C.red,emoji:"⚡",note:"8 rounds · Starting guide built in · Levels update from previous session",
                   items:HIIT_BASE.map(r=>({name:`Round ${r.round} — ${r.phase}`,detail:`Level ${r.level} · ${r.dur}${r.rest!=="—"?` · Rest ${r.rest}`:""} · ${r.note}`}))},
                  {label:"Tuesday — Glute Day A",color:C.purple,emoji:"🍑",note:"45–55 min · Hip thrusts heavy — your #1 glute builder",
                   items:SESSIONS.find(s=>s.id==="glute").exercises.map(ex=>({name:ex.name,detail:`${ex.sets} · ${ex.note}`}))},
                  {label:"Wednesday — Back Day",color:C.blue,emoji:"🔙",note:"45–55 min · Full stretch every pull",
                   items:SESSIONS.find(s=>s.id==="back").exercises.map(ex=>({name:ex.name,detail:`${ex.sets} · ${ex.note}`}))},
                  {label:"Thursday — Posterior Chain",color:C.green,emoji:"⛓️",note:"50–60 min · Deadlifts anchor this day",
                   items:SESSIONS.find(s=>s.id==="posterior").exercises.map(ex=>({name:ex.name,detail:`${ex.sets} · ${ex.note}`}))},
                ].map((sess,si)=>(
                  <div key={si} style={{marginBottom:18}}>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:5}}>
                      <span style={{fontSize:15}}>{sess.emoji}</span>
                      <span style={{fontSize:13,fontWeight:700,color:sess.color}}>{sess.label}</span>
                    </div>
                    <div style={{fontSize:10,color:C.gray,marginBottom:8,padding:"6px 9px",background:`${sess.color}0d`,borderRadius:7,border:`1px solid ${sess.color}20`}}>{sess.note}</div>
                    <Card style={{overflow:"hidden"}}>
                      {sess.items.map((item,ii)=>(
                        <div key={ii} style={{padding:"10px 12px",borderBottom:ii<sess.items.length-1?`1px solid ${C.border2}`:"none"}}>
                          <div style={{fontSize:12,fontWeight:600,color:C.text,marginBottom:2}}>{item.name}</div>
                          <div style={{fontSize:10,color:C.gray,lineHeight:1.4}}>{item.detail}</div>
                        </div>
                      ))}
                    </Card>
                  </div>
                ))}
              </div>
            )}

            {planSub==="walks"&&(
              <div>
                <Card style={{overflow:"hidden",marginBottom:14}}>
                  <div style={{padding:"10px 12px",background:C.border2,borderBottom:`1px solid ${C.border}`}}>
                    <div style={{display:"grid",gridTemplateColumns:"38px 1fr 65px 45px 80px",gap:6}}>
                      {["Day","Type","Duration","Vest","HR"].map(h=><div key={h} style={{fontSize:8,fontWeight:700,color:C.dim,textTransform:"uppercase",letterSpacing:"0.05em"}}>{h}</div>)}
                    </div>
                  </div>
                  {[
                    {day:"Mon",type:"Post-HIIT easy walk",dur:"30 min",   vest:false,hr:"90–100"},
                    {day:"Tue",type:"Post-gym easy walk", dur:"30–45 min",vest:false,hr:"95–105"},
                    {day:"Wed",type:"Post-gym easy walk", dur:"30–45 min",vest:false,hr:"95–105"},
                    {day:"Thu",type:"Post-gym easy walk", dur:"30–45 min",vest:false,hr:"95–105"},
                    {day:"Fri",type:"Vest + hills",        dur:"45–60 min",vest:true, hr:"110–120"},
                    {day:"Sat",type:"Long vest walk ⭐",   dur:"60–90 min",vest:true, hr:"110–125"},
                    {day:"Sun",type:"Easy recovery walk",  dur:"30–45 min",vest:false,hr:"90–100"},
                  ].map((w,i)=>(
                    <div key={i} style={{padding:"10px 12px",borderBottom:i<6?`1px solid ${C.border2}`:"none",background:w.vest?"rgba(78,140,69,0.06)":"transparent"}}>
                      <div style={{display:"grid",gridTemplateColumns:"38px 1fr 65px 45px 80px",gap:6,alignItems:"center"}}>
                        <div style={{fontSize:11,fontWeight:700,color:C.text}}>{w.day}</div>
                        <div style={{fontSize:10,color:w.vest?C.green:C.light,fontWeight:w.vest?600:400}}>{w.type}</div>
                        <div style={{fontSize:10,color:C.gray}}>{w.dur}</div>
                        <div style={{textAlign:"center"}}>{w.vest?<span style={{color:C.green,fontWeight:700}}>✅</span>:<span style={{color:C.dim}}>—</span>}</div>
                        <div style={{fontSize:9,color:w.vest?C.green:C.gray,fontWeight:w.vest?600:400}}>{w.hr} bpm</div>
                      </div>
                    </div>
                  ))}
                </Card>
                <Card style={{padding:"12px 14px"}}>
                  <div style={{fontSize:11,fontWeight:700,color:C.yellow,marginBottom:9}}>🏔️ Hill walk form</div>
                  {[["Full steps","Entire foot down — toe-stepping = calves not glutes"],["Heel drive","Push floor away — this loads the glutes"],["Push uphill","Don't slow on inclines — that's where the work is"],["Light grip","No death-gripping rails — removes 30% calorie burn"],["Stay elevated","Keep pace on flats after hills — let HR stay up"]].map(([t,tip])=>(
                    <div key={t} style={{display:"flex",gap:8,marginBottom:6}}>
                      <span style={{color:C.green,fontWeight:700,fontSize:12,flexShrink:0}}>→</span>
                      <div><span style={{fontSize:11,fontWeight:600,color:C.text}}>{t}: </span><span style={{fontSize:10,color:C.gray}}>{tip}</span></div>
                    </div>
                  ))}
                </Card>
              </div>
            )}

            {planSub==="progress"&&(
              <div>
                <div style={{fontSize:11,color:C.dim,marginBottom:12,lineHeight:1.5}}>Target: <span style={{color:C.green,fontWeight:700}}>160–165 lb in 26 weeks</span> · 0.48 lb/week</div>
                {[
                  {phase:"Wks 1–3",  label:"Foundation",color:C.yellow,target:"172–174 lb",desc:"Learn gym movements — form over weight."},
                  {phase:"Wks 4–6",  label:"Build",     color:C.blue,  target:"170–172 lb",desc:"Add 5 lbs to main lifts when all reps clean."},
                  {phase:"Wks 7–10", label:"Momentum",  color:C.green, target:"167–170 lb",desc:"Back and glute changes becoming visible."},
                  {phase:"Wks 11–16",label:"Peak",      color:C.green, target:"163–167 lb",desc:"Progressive overload every lift. Consistency is everything."},
                  {phase:"Wks 17–22",label:"Refine",    color:C.purple,target:"160–164 lb",desc:"Shift toward recomposition. Keep protein high."},
                  {phase:"Wks 23–26",label:"Lock In",   color:C.red,   target:"160–165 lb ✅",desc:"Goal range. Focus on mirror + performance."},
                ].map((p,i)=>(
                  <Card key={i} style={{padding:"10px 14px",marginBottom:7,display:"flex",gap:12,alignItems:"flex-start"}}>
                    <div style={{flexShrink:0,width:60}}><div style={{fontSize:10,color:p.color,fontWeight:700}}>{p.phase}</div><div style={{fontSize:8,color:C.dim}}>{p.label}</div></div>
                    <div style={{flex:1}}><div style={{fontSize:11,fontWeight:700,color:C.green,marginBottom:3}}>{p.target}</div><div style={{fontSize:10,color:C.gray,lineHeight:1.4}}>{p.desc}</div></div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ TARGETS REFERENCE ══ */}
        {tab==="ref"&&(
          <div>
            <div style={slbl}>DAILY TARGETS</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:18}}>
              {[{label:"Move Ring",value:"600 kcal",color:C.red,note:"Floor not ceiling"},{label:"Exercise",value:"45 min",color:C.green,note:"Walk closes it"},{label:"Stand Ring",value:"10 hrs",color:C.blue,note:"Data sweet spot"},{label:"Protein",value:"115–120g",color:C.purple,note:"Non-negotiable"},{label:"Fiber",value:"25–30g",color:C.green,note:"Chia+flax = 14g"},{label:"Water",value:"2–2.5 L",color:C.blue,note:"+500ml gym days"}].map(t=>(
                <Card key={t.label} style={{padding:"10px 9px"}}><div style={{fontSize:15,fontWeight:800,color:t.color,marginBottom:2}}>{t.value}</div><div style={{fontSize:9,fontWeight:700,color:C.muted,marginBottom:1}}>{t.label}</div><div style={{fontSize:8,color:C.dim}}>{t.note}</div></Card>
              ))}
            </div>

            <div style={slbl}>SUPPLEMENT TIMING</div>
            <Card style={{overflow:"hidden",marginBottom:18}}>
              {SUPPS.map((s,i)=>(
                <div key={s.id} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderBottom:i<SUPPS.length-1?`1px solid ${C.border2}`:"none"}}>
                  <span style={{fontSize:20,flexShrink:0}}>{s.emoji}</span>
                  <div><div style={{fontSize:12,fontWeight:700,color:s.color}}>{s.label}</div><div style={{fontSize:10,color:C.gray,marginTop:1}}>{s.when}</div></div>
                </div>
              ))}
            </Card>

            <div style={slbl}>6-MONTH PROGRESSION</div>
            {[
              {phase:"Wks 1–3",  label:"Foundation",color:C.yellow,target:"172–174 lb",desc:"Learn gym movements — form over weight."},
              {phase:"Wks 4–6",  label:"Build",     color:C.blue,  target:"170–172 lb",desc:"Add 5 lbs to main lifts when all reps clean."},
              {phase:"Wks 7–10", label:"Momentum",  color:C.green, target:"167–170 lb",desc:"Back and glute changes becoming visible."},
              {phase:"Wks 11–16",label:"Peak",      color:C.green, target:"163–167 lb",desc:"Progressive overload every lift."},
              {phase:"Wks 17–22",label:"Refine",    color:C.purple,target:"160–164 lb",desc:"Shift toward recomposition. Keep protein high."},
              {phase:"Wks 23–26",label:"Lock In",   color:C.red,   target:"160–165 lb ✅",desc:"Goal range. Focus on mirror + performance."},
            ].map((p,i)=>(
              <Card key={i} style={{padding:"10px 14px",marginBottom:7,display:"flex",gap:12,alignItems:"flex-start"}}>
                <div style={{flexShrink:0,width:60}}><div style={{fontSize:10,color:p.color,fontWeight:700}}>{p.phase}</div><div style={{fontSize:8,color:C.dim}}>{p.label}</div></div>
                <div style={{flex:1}}><div style={{fontSize:11,fontWeight:700,color:C.green,marginBottom:3}}>{p.target}</div><div style={{fontSize:10,color:C.gray,lineHeight:1.4}}>{p.desc}</div></div>
              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
