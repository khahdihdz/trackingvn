"use client";

import { useEffect, useState } from "react";

type EventItem={timestamp:string;status:string;description:string;location?:string};
type Result={success:boolean;carrier:{id:string;name:string};trackingCode:string;status:{code:string;label:string;description?:string};events:EventItem[];origin?:string;destination?:string;weight?:string;shippingFee?:string;codAmount?:string;estimatedDelivery?:string;lastUpdated?:string;unavailableReason?:string;officialUrl:string};

const carriers=[["","Tự động nhận diện"],["spx","SPX Express"],["ghn","GHN"],["ghtk","GHTK"],["viettelpost","Viettel Post"],["jtexpress","J&T Express"],["vnpost","VNPost / EMS"],["ninjavan","Ninja Van"],["bestexpress","BEST Express"],["ahamove","Ahamove"]];

function fmt(v?:string){if(!v)return "";const d=new Date(v);return Number.isNaN(d.getTime())?v:new Intl.DateTimeFormat("vi-VN",{dateStyle:"medium",timeStyle:"short"}).format(d)}
function icon(s:string){return s==="DELIVERED"?"✓":s==="OUT_FOR_DELIVERY"?"🚚":s==="IN_TRANSIT"?"↗":s==="UNKNOWN"?"?":"•"}

export default function TrackerApp({initialCode=""}:{initialCode?:string}){
 const [code,setCode]=useState(initialCode),[carrier,setCarrier]=useState(""),[data,setData]=useState<Result|null>(null),[loading,setLoading]=useState(false),[message,setMessage]=useState(""),[history,setHistory]=useState<string[]>([]),[auto,setAuto]=useState(false);
 useEffect(()=>{try{setHistory(JSON.parse(localStorage.getItem("trackingvn-history")||"[]"))}catch{}},[]);
 const save=(v:string)=>{const n=[v,...history.filter(x=>x!==v)].slice(0,8);setHistory(n);localStorage.setItem("trackingvn-history",JSON.stringify(n))};
 const track=async(v=code)=>{const c=v.trim().toUpperCase();if(!c){setMessage("Vui lòng nhập mã vận đơn.");return}setLoading(true);setMessage("");setData(null);try{const q=new URLSearchParams({code:c});if(carrier)q.set("carrier",carrier);const r=await fetch("/api/tracking?"+q.toString(),{cache:"no-store"}),j=await r.json();if(!j.success){setMessage(j.message||"Không thể tra cứu mã vận đơn.");return}setData(j.data);save(c);window.history.replaceState(null,"","/track/"+encodeURIComponent(c))}catch{setMessage("Không thể kết nối máy chủ. Vui lòng thử lại.")}finally{setLoading(false)}};
 useEffect(()=>{if(initialCode){setCode(initialCode);void track(initialCode)}},[initialCode]);
 useEffect(()=>{if(!auto||!code)return;const t=window.setInterval(()=>void track(code),30000);return()=>window.clearInterval(t)},[auto,code]);
 const share=async()=>{const url=window.location.href;if(navigator.share)await navigator.share({title:"Theo dõi đơn hàng",text:code,url});else{await navigator.clipboard.writeText(url);setMessage("Đã sao chép liên kết chia sẻ.")}};
 const clear=()=>{setHistory([]);localStorage.removeItem("trackingvn-history")};

 return <main>
  <header className="container" style={{padding:"22px 0 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><a href="/" style={{fontWeight:900,fontSize:20,letterSpacing:"-.04em"}}><span style={{color:"#2563eb"}}>Tracking</span>VN</a><span className="muted" style={{fontSize:13}}>Tra cứu vận đơn Việt Nam</span></header>
  <section className="container" style={{padding:"58px 0 34px",textAlign:"center"}}>
   <div style={{display:"inline-flex",padding:"7px 12px",borderRadius:999,background:"#eff6ff",color:"#2563eb",fontWeight:700,fontSize:13,marginBottom:18}}>⚡ Nhanh · rõ ràng · không giả dữ liệu</div>
   <h1 style={{fontSize:"clamp(38px,7vw,68px)",lineHeight:1.02,letterSpacing:"-.055em",margin:"0 auto 18px",maxWidth:820}}>Theo dõi đơn hàng <span className="gradient-text">dễ dàng hơn</span></h1>
   <p className="muted" style={{fontSize:17,maxWidth:680,margin:"0 auto 30px",lineHeight:1.7}}>Nhập mã vận đơn để nhận diện đơn vị vận chuyển và mở thông tin tracking chính thức. Không tạo dữ liệu hành trình giả.</p>
   <div className="card" style={{maxWidth:900,margin:"0 auto",padding:12,textAlign:"left"}}><div style={{display:"grid",gridTemplateColumns:"1fr 190px 130px",gap:10}}>
    <input aria-label="Mã vận đơn" value={code} onChange={e=>setCode(e.target.value)} onKeyDown={e=>e.key==="Enter"&&void track()} placeholder="Nhập mã vận đơn..." style={{minWidth:0,border:0,outline:0,padding:"15px 16px",fontSize:16,borderRadius:14,background:"#f8fafc"}}/>
    <select aria-label="Đơn vị vận chuyển" value={carrier} onChange={e=>setCarrier(e.target.value)} style={{border:0,outline:0,padding:"0 12px",borderRadius:14,background:"#f8fafc"}}>{carriers.map(([id,name])=><option key={id} value={id}>{name}</option>)}</select>
    <button onClick={()=>void track()} disabled={loading} style={{border:0,borderRadius:14,background:"#2563eb",color:"#fff",fontWeight:800,padding:"0 18px",opacity:loading?.7:1}}>{loading?"Đang tra...":"Tra cứu"}</button>
   </div></div>
   {message&&<div role="alert" style={{maxWidth:900,margin:"12px auto 0",padding:"12px 16px",borderRadius:14,background:"#fff7ed",color:"#9a3412",textAlign:"left"}}>{message}</div>}
  </section>

  {history.length>0&&!data&&<section className="container" style={{paddingBottom:24}}><div className="card" style={{padding:20}}><div style={{display:"flex",justifyContent:"space-between"}}><strong>Lịch sử tra cứu</strong><button onClick={clear} style={{border:0,background:"transparent",color:"#64748b"}}>Xóa</button></div><div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:14}}>{history.map(x=><button key={x} onClick={()=>{setCode(x);void track(x)}} style={{border:"1px solid #e2e8f0",background:"#f8fafc",borderRadius:999,padding:"8px 12px"}}>{x}</button>)}</div></div></section>}

  {data&&<section className="container" style={{paddingBottom:60}}><div className="card" style={{overflow:"hidden"}}>
   <div style={{padding:24,display:"flex",flexWrap:"wrap",gap:18,justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #eef2f7"}}><div><div className="muted" style={{fontSize:13}}>Mã vận đơn</div><div style={{fontWeight:900,fontSize:25}}>{data.trackingCode}</div><div className="muted" style={{marginTop:5}}>{data.carrier.name}</div></div><div style={{display:"flex",gap:8}}><button onClick={()=>void share()} style={{border:"1px solid #dbe3ef",background:"#fff",borderRadius:12,padding:"10px 14px",fontWeight:700}}>🔗 Chia sẻ</button><button onClick={()=>void track()} style={{border:"1px solid #dbe3ef",background:"#fff",borderRadius:12,padding:"10px 14px",fontWeight:700}}>↻ Cập nhật</button></div></div>
   <div style={{padding:24}}>
    <div style={{padding:18,borderRadius:18,background:data.success?"#eff6ff":"#fff7ed",border:"1px solid "+(data.success?"#dbeafe":"#fed7aa")}}><div className="muted" style={{fontSize:13}}>Trạng thái</div><div style={{fontWeight:900,fontSize:24,marginTop:4}}>{icon(data.status.code)} {data.status.label}</div>{data.lastUpdated&&<div className="muted" style={{marginTop:6}}>Cập nhật: {fmt(data.lastUpdated)}</div>}</div>
    {!data.success&&<div style={{marginTop:16,padding:18,borderRadius:18,background:"#f8fafc"}}><strong>Tra cứu tự động chưa khả dụng</strong><p className="muted" style={{lineHeight:1.65}}>{data.unavailableReason||"Nguồn dữ liệu của nhà vận chuyển chưa cho phép truy vấn tự động."}</p><a href={data.officialUrl} target="_blank" rel="noreferrer" style={{display:"inline-block",background:"#111827",color:"#fff",padding:"11px 16px",borderRadius:12,fontWeight:800}}>Mở trang tracking chính thức ↗</a></div>}
    {data.success&&<><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginTop:18}}>{[["Điểm gửi",data.origin],["Điểm đến",data.destination],["COD",data.codAmount],["Phí ship",data.shippingFee],["Khối lượng",data.weight],["Dự kiến giao",data.estimatedDelivery]].map(([l,v])=>v?<div key={l} style={{padding:15,border:"1px solid #e5e7eb",borderRadius:15}}><div className="muted" style={{fontSize:12}}>{l}</div><strong style={{display:"block",marginTop:5}}>{v}</strong></div>:null)}</div>
    <div style={{marginTop:28}}><h2 style={{fontSize:20}}>Hành trình</h2>{data.events.length===0?<p className="muted">Chưa có sự kiện hành trình.</p>:data.events.map((e,i)=><div key={i} style={{display:"grid",gridTemplateColumns:"30px 1fr",gap:10,paddingBottom:20}}><div style={{width:20,height:20,borderRadius:"50%",background:i===0?"#2563eb":"#e2e8f0",color:"#fff",display:"grid",placeItems:"center",fontSize:11}}>✓</div><div><strong>{e.status}</strong><div>{e.description}</div><div className="muted" style={{fontSize:13,marginTop:4}}>{fmt(e.timestamp)}{e.location?" · "+e.location:""}</div></div></div>)}</div></>}
    <div style={{marginTop:24,paddingTop:18,borderTop:"1px solid #eef2f7",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}><label style={{display:"flex",gap:8,alignItems:"center"}}><input type="checkbox" checked={auto} onChange={e=>setAuto(e.target.checked)}/> Tự động cập nhật mỗi 30 giây</label><a href={data.officialUrl} target="_blank" rel="noreferrer" className="muted">Trang chính thức ↗</a></div>
   </div>
  </div></section>}

  <section className="container" style={{padding:"20px 0 70px"}}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14}}>{[["🔎","Tự động nhận diện","Nhận diện mã vận đơn theo pattern của từng nhà vận chuyển."],["🔗","Liên kết chính thức","Khi không thể lấy dữ liệu tự động, mở thẳng trang tracking của hãng."],["🛡️","Không giả dữ liệu","Không hiển thị hành trình mẫu như thể đó là đơn hàng thật."],["📱","Mobile-first","Giao diện tối ưu cho điện thoại và không gây tràn ngang."]].map(([i,t,d])=><div key={t} className="card" style={{padding:20}}><div style={{fontSize:25}}>{i}</div><h3 style={{margin:"10px 0 7px"}}>{t}</h3><p className="muted" style={{lineHeight:1.6,margin:0}}>{d}</p></div>)}</div></section>
  <footer className="container" style={{padding:"0 0 28px",textAlign:"center"}}><span className="muted" style={{fontSize:13}}>© 2026 khahdihdz · TrackingVN</span></footer>
 </main>
}
