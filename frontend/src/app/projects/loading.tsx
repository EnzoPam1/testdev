export default function Loading(){
    return (
      <main className="container" style={{ display:"grid", gap:24 }}>
        <div className="card" style={{ padding:16 }}>
          <div className="skeleton" style={{ height:44, borderRadius:12, marginBottom:12 }}/>
          <div className="skeleton" style={{ height:44, width:"60%", borderRadius:12 }}/>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16 }}>
          {Array.from({length:6}).map((_,i)=>(
            <div key={i} className="skeleton" style={{ height:140 }}/>
          ))}
        </div>
      </main>
    );
  }
  