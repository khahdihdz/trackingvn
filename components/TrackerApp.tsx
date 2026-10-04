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
  <header className="container topbar"><a href="/" className="brand"><span>Tracking</span>VN</a><span className="muted topnote">Tra cứu vận đơn Việt Nam</span></header>
  <section className="container hero">
   <div className="eyebrow">⚡ Nhanh · rõ ràng · không giả dữ liệu</div>
   <h1>Theo dõi đơn hàng <span className="gradient-text">dễ dàng hơn</span></h1>
   <p className="muted">Nhập mã vận đơn để nhận diện đơn vị vận chuyển và mở thông tin tracking chính thức. Không tạo dữ liệu hành trình giả.</p>
   <div className="card search-card"><div className="search-grid">
    <input aria-label="Mã vận đơn" value={code} onChange={e=>setCode(e.target.value)} onKeyDown={e=>e.key==="Enter"&&void track()} placeholder="Nhập mã vận đơn..." />
    <select aria-label="Đơn vị vận chuyển" value={carrier} onChange={e=>setCarrier(e.target.value)}>{carriers.map(([id,name])=><option key={id} value={id}>{name}</option>)}</select>
    <button onClick={()=>void track()} disabled={loading} className="primary">{loading?"Đang tra...":"Tra cứu"}</button>
   </div></div>
   {message&&<div role="alert" className="alert">{message}</div>}
  </section>

  {history.length>0&&!data&&<section className="container section-small"><div className="card history-card"><div className="section-head"><strong>Lịch sử tra cứu</strong><button onClick={clear}>Xóa</button></div><div className="chips">{history.map(x=><button key={x} onClick={()=>{setCode(x);void track(x)}}>{x}</button>)}</div></div></section>}

  {data&&<section className="container result-section"><div className="card result-card">
   <div className="result-head"><div><div className="muted label">Mã vận đơn</div><div className="code">{data.trackingCode}</div><div className="muted">{data.carrier.name}</div></div><div className="actions"><button onClick={()=>void share()}>🔗 Chia sẻ</button><button onClick={()=>void track()}>↻ Cập nhật</button></div></div>
   <div className="result-body">
    <div className={"status-box "+(data.success?"ok":"warn")}><div className="muted label">Trạng thái</div><div className="status">{icon(data.status.code)} {data.status.label}</div>{data.lastUpdated&&<div className="muted">Cập nhật: {fmt(data.lastUpdated)}</div>}</div>
    {!data.success&&<div className="unavailable"><strong>Tra cứu tự động chưa khả dụng</strong><p className="muted">{data.unavailableReason||"Nguồn dữ liệu của nhà vận chuyển chưa cho phép truy vấn tự động."}</p><a href={data.officialUrl} target="_blank" rel="noreferrer" className="official">Mở trang tracking chính thức ↗</a></div>}
    {data.success&&<><div className="info-grid">{[["Điểm gửi",data.origin],["Điểm đến",data.destination],["COD",data.codAmount],["Phí ship",data.shippingFee],["Khối lượng",data.weight],["Dự kiến giao",data.estimatedDelivery]].map(([l,v])=>v?<div key={l} className="info-item"><div className="muted">{l}</div><strong>{v}</strong></div>:null)}</div><div className="timeline"><h2>Hành trình</h2>{data.events.length===0?<p className="muted">Chưa có sự kiện hành trình.</p>:data.events.map((e,i)=><div key={i} className="event"><div className={"dot "+(i===0?"active":"")}>✓</div><div><strong>{e.status}</strong><div>{e.description}</div><div className="muted event-meta">{fmt(e.timestamp)}{e.location?" · "+e.location:""}</div></div></div>)}</div></>}
    <div className="result-footer"><label><input type="checkbox" checked={auto} onChange={e=>setAuto(e.target.checked)}/> Tự động cập nhật mỗi 30 giây</label><a href={data.officialUrl} target="_blank" rel="noreferrer" className="muted">Trang chính thức ↗</a></div>
   </div>
  </div></section>}

  <section className="container features"><div className="feature-grid">{[["🔎","Tự động nhận diện","Nhận diện mã vận đơn theo pattern của từng nhà vận chuyển."],["🔗","Liên kết chính thức","Khi không thể lấy dữ liệu tự động, mở thẳng trang tracking của hãng."],["🛡️","Không giả dữ liệu","Không hiển thị hành trình mẫu như thể đó là đơn hàng thật."],["📱","Mobile-first","Giao diện tối ưu cho điện thoại và không gây tràn ngang."]].map(([i,t,d])=><div key={t} className="card feature"><div className="feature-icon">{i}</div><h3>{t}</h3><p className="muted">{d}</p></div>)}</div></section>
  <footer className="container footer">© 2026 khahdihdz · TrackingVN</footer>
 </main>
}