import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ContractorDashboard.css';
import '../styles/BlueGlassTheme.css';
import '../styles/SoftSidebar.css';
import './WidgetColors.css';
import { badgeClass, formatStatus } from '../utils/status';
import { useToast } from './ToastProvider.jsx';

const ContractorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [layoutRequests, setLayoutRequests] = useState([]);
  const [inbox, setInbox] = useState([]);
  const [ackDateById, setAckDateById] = useState({});
  const [ackOpenById, setAckOpenById] = useState({});
  const [myProposals, setMyProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [collapsed] = useState(false);
  const [sidebarProfileOpen, setSidebarProfileOpen] = useState(false);
  const sidebarProfileRef = useRef(null);
  const [showRequestDetails, setShowRequestDetails] = useState({});

  // Sidebar counts
  const requestsCount = Array.isArray(layoutRequests) ? layoutRequests.length : 0;
  const proposalsCount = Array.isArray(myProposals) ? myProposals.length : 0;
  const inboxCount = Array.isArray(inbox) ? inbox.length : 0;

  // Periodic refresh for sidebar counts
  useEffect(() => {
    let mounted = true;
    const refreshCounts = async () => {
      try {
        const r1 = await fetch('/buildhub/backend/api/contractor/get_layout_requests.php');
        const j1 = await r1.json().catch(() => ({}));
        if (mounted && j1?.success) setLayoutRequests(Array.isArray(j1.requests) ? j1.requests : []);
      } catch {}
      try {
        const r2 = await fetch('/buildhub/backend/api/contractor/get_my_proposals.php');
        const j2 = await r2.json().catch(() => ({}));
        if (mounted && j2?.success) setMyProposals(Array.isArray(j2.proposals) ? j2.proposals : []);
      } catch {}
      try {
        const me = JSON.parse(sessionStorage.getItem('user') || '{}');
        if (me?.id) {
          const r3 = await fetch(`/buildhub/backend/api/contractor/get_inbox.php?contractor_id=${me.id}`, { credentials: 'include' });
          const j3 = await r3.json().catch(() => ({}));
          if (mounted && j3?.success) setInbox(Array.isArray(j3.items) ? j3.items : []);
        }
      } catch {}
      try {
        const me = JSON.parse(sessionStorage.getItem('user') || '{}');
        if (me?.id) {
          const r3 = await fetch(`/buildhub/backend/api/contractor/get_inbox.php?contractor_id=${me.id}`, { credentials: 'include' });
          const j3 = await r3.json().catch(() => ({}));
          if (mounted && j3?.success) setInbox(Array.isArray(j3.items) ? j3.items : []);
        }
      } catch {}
      try {
        const me = JSON.parse(sessionStorage.getItem('user') || '{}');
        if (me?.id) {
          const r3 = await fetch(`/buildhub/backend/api/contractor/get_inbox.php?contractor_id=${me.id}`, { credentials: 'include' });
          const j3 = await r3.json().catch(() => ({}));
          if (mounted && j3?.success) setInbox(Array.isArray(j3.items) ? j3.items : []);
        }
      } catch {}
    };
    refreshCounts();
    const id = setInterval(refreshCounts, 60000);
    return () => { mounted = false; clearInterval(id); };
  }, []);
  


  useEffect(() => {
    // Get user data from session
    const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
    setUser(userData);

    import('../utils/session').then(({ preventCache, verifyServerSession }) => {
      preventCache();
      (async () => {
        const serverAuth = await verifyServerSession();
        if (!userData.id || userData.role !== 'contractor' || !serverAuth) {
          sessionStorage.removeItem('user');
          localStorage.removeItem('bh_user');
          navigate('/login', { replace: true });
          return;
        }
        fetchLayoutRequests();
        fetchMyProposals();
      })();
    });
  }, []);

  // Close sidebar profile dropdown on outside click or ESC
  useEffect(() => {
    const onClick = (e) => {
      if (sidebarProfileRef.current && !sidebarProfileRef.current.contains(e.target)) {
        setSidebarProfileOpen(false);
      }
    };
    const onKey = (e) => { if (e.key === 'Escape') { setSidebarProfileOpen(false); } };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // Static sidebar – no auto-collapse

  const fetchLayoutRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch('/buildhub/backend/api/contractor/get_layout_requests.php');
      const result = await response.json();
      if (result.success) {
        setLayoutRequests(result.requests || []);
      }
    } catch (error) {
      console.error('Error fetching layout requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseRequirements = (req) => {
    if (!req) return {};
    try { return typeof req === 'string' ? JSON.parse(req) : req; } catch { return {}; }
  };

  const renderForwardedDesign = (request) => {
    const reqObj = parseRequirements(request.requirements);
    const forwarded = reqObj.forwarded_design;
    if (!forwarded) return null;
    const files = Array.isArray(forwarded.files) ? forwarded.files : [];
    const td = forwarded.technical_details || {};
    
    const formatValue = (value) => {
      if (!value) return '-';
      
      // Handle string values that might contain JSON
      if (typeof value === 'string') {
        // Try to parse as JSON first
        try {
          const parsed = JSON.parse(value);
          if (typeof parsed === 'object' && parsed !== null) {
            return Object.entries(parsed)
              .map(([k, v]) => `• ${k.replace(/_/g, ' ')}: ${String(v)}`)
              .join('\n');
          }
        } catch {}
        
        // Handle newline characters and clean up formatting
        return value
          .replace(/\\n/g, '\n')
          .replace(/\n\s*\n/g, '\n') // Remove extra newlines
          .trim();
      }
      
      // Handle object values directly
      if (typeof value === 'object' && value !== null) {
        return Object.entries(value)
          .map(([k, v]) => `• ${k.replace(/_/g, ' ')}: ${String(v)}`)
          .join('\n');
      }
      
      return String(value);
    };
    
    const renderKV = (obj) => {
      if (!obj || typeof obj !== 'object') return null;
      return (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:12 }}>
          {Object.entries(obj).map(([k, v]) => (
            <div key={k} style={{ padding:'12px', background:'#fff', border:'1px solid #e5e7eb', borderRadius:8, boxShadow:'0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize:13, fontWeight:600, color:'#374151', marginBottom:8, textTransform:'capitalize' }}>
                {k.replaceAll('_',' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
              <div style={{ fontSize:14, lineHeight:1.5, color:'#6b7280', whiteSpace:'pre-wrap' }}>
                {formatValue(v)}
              </div>
            </div>
          ))}
        </div>
      );
    };
    return (
      <div className="forwarded-design" style={{ marginTop: 10 }}>
        <div className="details-grid" style={{ marginBottom: 8 }}>
          <div><strong>Design Title:</strong> {forwarded.title || '-'}</div>
          <div><strong>Uploaded:</strong> {forwarded.created_at ? new Date(forwarded.created_at).toLocaleString() : '-'}</div>
        </div>
        {forwarded.description && (
          <div className="description-section" style={{ marginBottom: 8 }}>
            <strong>Description:</strong>
            <div className="description-content">{forwarded.description}</div>
          </div>
        )}
        {reqObj.contractor_message && (
          <div className="description-section" style={{ marginBottom: 8 }}>
            <strong>Message from homeowner:</strong>
            <div className="description-content">{reqObj.contractor_message}</div>
          </div>
        )}
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'12px'}}>
          {files.map((f, idx) => {
            const href = f.path || `/buildhub/backend/uploads/designs/${f.stored || f.original}`;
            const ext = (f.ext || '').toLowerCase();
            const isImage = ['jpg','jpeg','png','gif','webp','svg','heic'].includes(ext);
            return (
              <div key={idx} className="file-card-interactive" style={{
                position:'relative', 
                cursor:'pointer',
                borderRadius:8,
                overflow:'hidden',
                boxShadow:'0 2px 8px rgba(0,0,0,0.1)',
                transition:'transform 0.2s ease',
                ':hover': { transform:'scale(1.02)' }
              }}>
                {isImage ? (
                  <div style={{position:'relative', width:'100%', height:140}}>
                    <img 
                      src={href} 
                      alt={f.original} 
                      style={{width:'100%', height:'100%', objectFit:'cover'}}
                      onClick={(e) => {
                        e.stopPropagation();
                        const overlay = e.currentTarget.nextSibling;
                        overlay.style.display = overlay.style.display === 'flex' ? 'none' : 'flex';
                      }}
                    />
                    <div className="image-overlay" style={{
                      position:'absolute',
                      top:0, left:0, right:0, bottom:0,
                      background:'rgba(0,0,0,0.7)',
                      display:'none',
                      alignItems:'center',
                      justifyContent:'center',
                      gap:10,
                      zIndex:10
                    }}>
                      <a 
                        href={href} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn btn-light" 
                        style={{padding:'8px 16px', fontSize:'14px'}}
                        onClick={(e) => e.stopPropagation()}
                      >
                        👁️ View
                      </a>
                      <a 
                        href={href} 
                        download 
                        className="btn btn-light" 
                        style={{padding:'8px 16px', fontSize:'14px'}}
                        onClick={(e) => e.stopPropagation()}
                      >
                        💾 Download
                      </a>
                    </div>
                  </div>
                ) : (
                  <div style={{height:140, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#f8fafc', border:'2px dashed #cbd5e1'}}>
                    <span style={{fontSize:'2.5rem', marginBottom:8}}>📄</span>
                    <div style={{display:'flex', gap:8}}>
                      <a href={href} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">View</a>
                      <a href={href} download className="btn btn-primary btn-sm">Download</a>
                    </div>
                  </div>
                )}
                <div style={{padding:'8px', background:'#fff', borderTop:'1px solid #e5e7eb'}}>
                  <div style={{fontSize:'13px', fontWeight:500, color:'#374151', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}} title={f.original || f.stored}>
                    {f.original || f.stored}
                  </div>
                  <div style={{fontSize:'11px', color:'#9ca3af', marginTop:2}}>
                    {ext.toUpperCase()} • Click to {isImage ? 'view' : 'download'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {(td && Object.keys(td).length > 0) && (
          <div style={{ marginTop: 16 }}>
            <h4 style={{ margin: '10px 0' }}>Technical Details</h4>
            {td.floor_plans && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontWeight:600, marginBottom:6 }}>Floor Plans</div>
                {renderKV(td.floor_plans)}
              </div>
            )}
            {td.site_orientation && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontWeight:600, marginBottom:6 }}>Site Orientation</div>
                {renderKV(td.site_orientation)}
              </div>
            )}
            {td.structural && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontWeight:600, marginBottom:6 }}>Structural</div>
                {renderKV(td.structural)}
              </div>
            )}
            {td.elevations && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontWeight:600, marginBottom:6 }}>Elevations</div>
                {renderKV(td.elevations)}
              </div>
            )}
            {td.construction && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontWeight:600, marginBottom:6 }}>Construction</div>
                {renderKV(td.construction)}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const getForwardedSummary = (request) => {
    const reqObj = parseRequirements(request.requirements);
    const forwarded = reqObj.forwarded_design || {};
    const title = forwarded.title || reqObj.layout_description || 'Project Request';
    const desc = (forwarded.description || '').trim();
    const short = desc.length > 120 ? desc.slice(0, 117) + '…' : desc;
    return { title, short, hasDesc: !!desc };
  };

  const getForwardedThumb = (request) => {
    const reqObj = parseRequirements(request.requirements);
    const forwarded = reqObj.forwarded_design;
    const files = Array.isArray(forwarded?.files) ? forwarded.files : [];
    const first = files[0];
    if (!first) return null;
    const href = first.path || `/buildhub/backend/uploads/designs/${first.stored || first.original}`;
    const ext = (first.ext || '').toLowerCase();
    const isImage = ['jpg','jpeg','png','gif','webp','svg','heic'].includes(ext);
    return { href, isImage, name: first.original || first.stored };
  };

  const fetchMyProposals = async () => {
    try {
      const response = await fetch('/buildhub/backend/api/contractor/get_my_proposals.php');
      const result = await response.json();
      if (result.success) {
        setMyProposals(result.proposals || []);
      }
    } catch (error) {
      console.error('Error fetching proposals:', error);
    }
  };

  const handleLogout = async () => {
    try { await fetch('/buildhub/backend/api/logout.php', { method: 'POST', credentials: 'include' }); } catch {}
    localStorage.removeItem('bh_user');
    sessionStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  const renderOverview = () => (
    <div>
      {/* Main Header */}
      <div className="main-header">
        <h1>Welcome back, {user?.first_name}!</h1>
        <p>Manage your cost estimates and project bids</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card w-blue">
          <div className="stat-content">
            <div className="stat-icon pending">⏰</div>
            <div className="stat-info">
              <h3>{layoutRequests.length}</h3>
              <p>Pending Requests</p>
            </div>
          </div>
        </div>
        <div className="stat-card w-purple">
          <div className="stat-content">
            <div className="stat-icon estimates">📋</div>
            <div className="stat-info">
              <h3>{myProposals.length}</h3>
              <p>Estimates Sent</p>
            </div>
          </div>
        </div>
        <div className="stat-card w-green">
          <div className="stat-content">
            <div className="stat-icon projects">✅</div>
            <div className="stat-info">
              <h3>{myProposals.filter(p => p.status === 'accepted').length}</h3>
              <p>Projects Won</p>
            </div>
          </div>
        </div>
        <div className="stat-card w-orange">
          <div className="stat-content">
            <div className="stat-icon total">💰</div>
            <div className="stat-info">
              <h3>₹{myProposals.reduce((sum, p) => sum + (parseFloat(p.total_cost) || 0), 0).toLocaleString()}</h3>
              <p>Total Bids</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Cost Requests */}
      <div className="section-card">
        <div className="section-header">
          <h2>Recent Cost Requests</h2>
          <p>Latest layout approvals requiring cost estimates</p>
        </div>
        <div className="section-content">
          {loading ? (
            <div className="loading">Loading requests...</div>
          ) : layoutRequests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No Requests Available</h3>
              <p>Check back later for new project opportunities!</p>
            </div>
          ) : (
            <div className="item-list">
              {layoutRequests.slice(0, 5).map(request => {
                const summary = getForwardedSummary(request);
                const thumb = getForwardedThumb(request);
                return (
                <div key={request.id} className="list-item">
                  <div className="item-image">
                    {thumb?.isImage ? (
                      <img src={thumb.href} alt={thumb.name} style={{width:48, height:48, objectFit:'cover', borderRadius:6}} />
                    ) : (
                      '🏠'
                    )}
                  </div>
                  <div className="item-content">
                    <h4 className="item-title">{summary.title}</h4>
                    {summary.hasDesc && (
                      <p className="item-subtitle">{summary.short}</p>
                    )}
                    <p className="item-meta">By {request.homeowner_name} • {request.plot_size} • Budget: ₹{request.budget_range}</p>
                    <button className="btn btn-secondary" style={{marginTop:6}} onClick={() => setShowRequestDetails(prev => ({...prev, [request.id]: !prev[request.id]}))}>
                      {showRequestDetails[request.id] ? 'Hide Details' : 'View Details'}
                    </button>
                    {showRequestDetails[request.id] && (
                      <div className="details-panel">
                        {renderForwardedDesign(request)}
                      </div>
                    )}
                  </div>
                  <div className="item-actions">
                    <span className={`status-badge ${badgeClass(request.status)}`}>{formatStatus(request.status)}</span>
                    <button className="btn btn-primary" onClick={() => navigate(`/contractor/estimate?layout_request_id=${request.id}`)}>Submit Estimate</button>
                  </div>
                </div>
              );})}
            </div>
          )}
        </div>
      </div>

      {/* Inbox */}
      <div className="section-card">
        <div className="section-header" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <h2>Inbox</h2>
            <p>Layouts and designs sent directly to you</p>
          </div>
          <button className="btn btn-secondary" onClick={async ()=>{
            try {
              const me = JSON.parse(sessionStorage.getItem('user') || '{}');
              const r = await fetch(`/buildhub/backend/api/contractor/get_inbox.php?contractor_id=${me.id}`, { credentials: 'include' });
              const j = await r.json().catch(() => ({}));
              if (j?.success) setInbox(Array.isArray(j.items) ? j.items : []);
            } catch {}
          }}>Refresh</button>
        </div>
        <div className="section-content">
          {Array.isArray(inbox) && inbox.length ? inbox.map(renderInboxItem) : (
            <div className="empty-state">
              <div className="empty-icon">📥</div>
              <h3>No items yet</h3>
              <p>When a homeowner sends you a layout, it appears here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderInbox = () => (
    <div>
      <div className="main-header">
        <h1>Inbox</h1>
        <p>Layouts and designs sent directly by homeowners</p>
      </div>

      <div className="section-card">
        <div className="section-header" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <h2>Received Items</h2>
            <p>All layouts and forwarded designs sent to you</p>
          </div>
          <button className="btn btn-secondary" onClick={async ()=>{
            try {
              const me = JSON.parse(sessionStorage.getItem('user') || '{}');
              const r = await fetch(`/buildhub/backend/api/contractor/get_inbox.php?contractor_id=${me.id}`, { credentials: 'include' });
              const j = await r.json().catch(() => ({}));
              if (j?.success) setInbox(Array.isArray(j.items) ? j.items : []);
            } catch {}
          }}>Refresh</button>
        </div>
        <div className="section-content">
          {Array.isArray(inbox) && inbox.length ? inbox.map(renderInboxItem) : (
            <div className="empty-state">
              <div className="empty-icon">📥</div>
              <h3>No items yet</h3>
              <p>When a homeowner sends you a layout, it appears here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const phpOrigin = (typeof window !== 'undefined' && window.location && window.location.port === '3000') ? 'http://localhost' : '';
  const assetUrl = (path) => {
    if (!path) return path;
    if (/^https?:\/\//i.test(path)) return path;
    return `${phpOrigin}/${String(path).replace(/^\/?/, '')}`;
  };

  const renderTechnicalNeat = (obj) => {
    if (!obj || typeof obj !== 'object') return null;
    const sections = Object.keys(obj);
    if (!sections.length) return null;
    return (
      <div style={{border:'1px solid #eee', borderRadius:8, padding:10, background:'#fafafa', display:'grid', gap:10}}>
        {sections.map((sectionKey) => {
          const section = obj[sectionKey];
          if (!section || typeof section !== 'object') return null;
          const entries = Object.entries(section);
          if (!entries.length) return null;
          return (
            <div key={sectionKey}>
              <div style={{fontWeight:600, marginBottom:6, textTransform:'capitalize'}}>{sectionKey.replace(/[_-]/g,' ')}</div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 2fr', gap:'6px 12px'}}>
                {entries.map(([k, v]) => (
                  <React.Fragment key={k}>
                    <div style={{color:'#555'}}>{String(k).replace(/[_-]/g,' ')}</div>
                    <div style={{color:'#111'}}>{typeof v === 'object' ? JSON.stringify(v) : String(v)}</div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderInboxItem = (item) => {
    const payload = item.payload || {};
    const fd = payload.forwarded_design || null;
    const firstFile = fd && Array.isArray(fd.files) && fd.files[0] ? fd.files[0] : null;
    const rawImg = payload.layout_image_url || (firstFile && (firstFile.url || firstFile.path || (typeof firstFile === 'string' ? firstFile : null)));
    const img = assetUrl(rawImg);
    const technical = fd?.technical_details || payload.technical_details || null;
    const floor = payload.floor_details || null;
    return (
      <div className="card" key={item.id} style={{marginBottom: 12}}>
        <div className="card-header" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div className="card-title">New layout sent</div>
            <div className="muted" style={{fontSize:'0.85rem'}}>From: {item.homeowner_name || 'Homeowner'}{item.homeowner_email ? ` • ${item.homeowner_email}` : ''}</div>
          </div>
          <div style={{display:'flex', alignItems:'center', gap:8}}>
            <div className="muted" style={{fontSize:'0.85rem'}}>{new Date(item.created_at).toLocaleString()}</div>
            {item.acknowledged_at ? (
              <span className="status-badge accepted" title={`Due: ${item.due_date || '—'}`}>Acknowledged</span>
            ) : (
              <div style={{display:'flex', alignItems:'center', gap:6}}>
                {!ackOpenById[item.id] && (
                  <button className="btn btn-primary" onClick={()=> setAckOpenById(prev=>({...prev, [item.id]: true}))}>Acknowledge</button>
                )}
                {ackOpenById[item.id] && (
                  <>
                    <input 
                      type="date" 
                      value={ackDateById[item.id] || ''}
                      onChange={(e)=> setAckDateById(prev=>({...prev, [item.id]: e.target.value}))}
                      style={{padding:'6px 8px', border:'1px solid #e5e7eb', borderRadius:6}}
                    />
                    <button className="btn btn-primary" onClick={async ()=>{
                      const me = JSON.parse(sessionStorage.getItem('user') || '{}');
                      try {
                        await fetch('/buildhub/backend/api/contractor/acknowledge_inbox_item.php', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          credentials: 'include',
                          body: JSON.stringify({ id: item.id, contractor_id: me.id, due_date: ackDateById[item.id] || null })
                        });
                      } catch {}
                      try {
                        const r = await fetch(`/buildhub/backend/api/contractor/get_inbox.php?contractor_id=${me.id}`, { credentials: 'include' });
                        const j = await r.json().catch(() => ({}));
                        if (j?.success) setInbox(Array.isArray(j.items) ? j.items : []);
                      } catch {}
                      setAckOpenById(prev=>({...prev, [item.id]: false}));
                    }}>Confirm</button>
                    <button className="btn btn-secondary" onClick={()=> setAckOpenById(prev=>({...prev, [item.id]: false}))}>Cancel</button>
                  </>
                )}
              </div>
            )}
            <button className="btn btn-secondary" onClick={async ()=>{
              try {
                const me = JSON.parse(sessionStorage.getItem('user') || '{}');
                await fetch('/buildhub/backend/api/contractor/delete_inbox_item.php', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include',
                  body: JSON.stringify({ id: item.id, contractor_id: me.id })
                });
                // Refresh inbox
                const r = await fetch(`/buildhub/backend/api/contractor/get_inbox.php?contractor_id=${me.id}`, { credentials: 'include' });
                const j = await r.json().catch(() => ({}));
                if (j?.success) setInbox(Array.isArray(j.items) ? j.items : []);
              } catch {}
            }}>Remove</button>
          </div>
        </div>
        <div className="card-body" style={{display:'grid',gridTemplateColumns:'160px 1fr',gap:12}}>
          <div>
            {img ? (
              <img src={img} alt="Layout preview" style={{width:'160px',height:'120px',objectFit:'cover',borderRadius:8,border:'1px solid #eee'}} onError={(e)=>{ e.currentTarget.style.display='none'; }} />
            ) : (
              <div style={{width:'160px',height:'120px',display:'grid',placeItems:'center',border:'1px dashed #ddd',borderRadius:8}}>No image</div>
            )}
          </div>
          <div style={{display:'grid',gap:6}}>
            {fd?.title && <div><strong>Design:</strong> {fd.title}</div>}
            {fd?.description && <div><strong>Description:</strong> {fd.description}</div>}
            {item.message && <div><strong>Message:</strong> {item.message}</div>}
            {floor && (
              <details>
                <summary style={{cursor:'pointer'}}>Floor details</summary>
                <div style={{marginTop:8}}>
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
                    {floor.floors_count !== undefined && <div><strong>Floors:</strong> {String(floor.floors_count)}</div>}
                    {floor.floor_height && <div><strong>Floor height:</strong> {String(floor.floor_height)}</div>}
                    {floor.ground_floor_area && <div><strong>Ground floor area:</strong> {String(floor.ground_floor_area)}</div>}
                    {floor.first_floor_area && <div><strong>First floor area:</strong> {String(floor.first_floor_area)}</div>}
                    {floor.second_floor_area && <div><strong>Second floor area:</strong> {String(floor.second_floor_area)}</div>}
                    {floor.flooring_materials && <div style={{gridColumn:'1 / -1'}}><strong>Flooring materials:</strong> {String(floor.flooring_materials)}</div>}
                  </div>
                </div>
              </details>
            )}
            {technical && (
              <details>
                <summary style={{cursor:'pointer'}}>Technical details</summary>
                <div style={{marginTop:8}}>{renderTechnicalNeat(technical)}</div>
              </details>
            )}
            {fd?.files && Array.isArray(fd.files) && fd.files.length > 0 && (
              <details>
                <summary style={{cursor:'pointer'}}>Files ({fd.files.length})</summary>
                <ul style={{margin:'8px 0 0 16px'}}>
                  {fd.files.map((f, idx) => {
                    const url = assetUrl(f.url || f.path || (typeof f === 'string' ? f : ''));
                    const name = f.name || (typeof f === 'string' ? f : `File ${idx+1}`);
                    return <li key={idx}><a href={url} target="_blank" rel="noreferrer">{name}</a></li>;
                  })}
                </ul>
              </details>
            )}

            {/* Submit Estimate for this send */}
            <details>
              <summary style={{cursor:'pointer'}}>Submit Estimate</summary>
              <form className="estimate-form" onSubmit={async (e)=>{
                e.preventDefault();
                const me = JSON.parse(sessionStorage.getItem('user') || '{}');
                const form = e.currentTarget;
                const fd = new FormData(form);
                fd.append('send_id', String(item.id));
                fd.append('contractor_id', String(me.id));
                try {
                  const res = await fetch('/buildhub/backend/api/contractor/submit_estimate_for_send.php', {
                    method: 'POST',
                    credentials: 'include',
                    body: fd
                  });
                  const json = await res.json();
                  if (json?.success) {
                    alert('Estimate submitted');
                    form.reset();
                  } else {
                    alert(json?.message || 'Failed to submit');
                  }
                } catch {
                  alert('Network error');
                }
              }}>
                {/* helper: auto-calc grand total from section totals */}
                <script dangerouslySetInnerHTML={{__html:`window.__bhCalcGrandTotal = window.__bhCalcGrandTotal || function(form){try{var m=form.querySelector('[name="structured[totals][materials]"]');var l=form.querySelector('[name="structured[totals][labor]"]');var u=form.querySelector('[name="structured[totals][utilities]"]');var s=form.querySelector('[name="structured[totals][misc]"]');var g=form.querySelector('[name="structured[totals][grand]"]');var tc=form.querySelector('[name="total_cost"]');function num(v){if(!v) return 0;return parseFloat(String(v).replace(/[,\s]/g,''))||0;}var sum=num(m&&m.value)+num(l&&l.value)+num(u&&u.value)+num(s&&s.value);if(g){g.value=sum?String(sum):'';}if(tc){tc.value=sum?String(sum):tc.value;}}catch(e){}};`}} />
                {/* 1. Basic Project Information */}
                <div className="section-title">1. Basic Project Information</div>
                <div className="grid-2">
                  <input name="structured[project_name]" placeholder="Project Name" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[project_address]" placeholder="Project Address / Location" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[plot_size]" placeholder="Plot Size (sq.ft / sq.m)" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[built_up_area]" placeholder="Built-up Area (sq.ft / sq.m)" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[floors]" placeholder="Number of Floors" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[estimation_date]" type="date" placeholder="Estimation Date" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[client_name]" placeholder="Client / Homeowner Name" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[client_contact]" placeholder="Contact Info" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                </div>

                {/* 2. Material Costs */}
                <div className="section-title" style={{marginTop:8}}>2. Material Costs</div>
                <div className="grid-3">
                  <input name="structured[materials][cement]" placeholder="Cement (type, qty, unit, total)" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[materials][sand]" placeholder="Sand (type, qty m³, unit, total)" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[materials][bricks]" placeholder="Bricks (qty, unit, total)" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[materials][steel]" placeholder="Steel/TMT (kg, unit, total)" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[materials][aggregate]" placeholder="Aggregate (m³, unit, total)" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[materials][tiles]" placeholder="Tiles/Flooring (m², unit, total)" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[materials][paint]" placeholder="Paint (type, liters, unit, total)" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[materials][doors]" placeholder="Doors (type, qty, unit, total)" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[materials][windows]" placeholder="Windows (type, qty, unit, total)" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[materials][others]" placeholder="Other materials (roofing, glass, etc.)" style={{gridColumn:'1 / -1'}} />
                </div>

                {/* 3. Labor Charges */}
                <div className="section-title" style={{marginTop:8}}>3. Labor Charges</div>
                <div className="grid-3">
                  <input name="structured[labor][mason]" placeholder="Mason Work (rate, total)" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[labor][plaster]" placeholder="Plaster Work (rate, total)" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[labor][painting]" placeholder="Painting (rate, total)" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[labor][electrical]" placeholder="Electrical (per point/room, total)" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[labor][plumbing]" placeholder="Plumbing (per fitting/system, total)" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[labor][flooring]" placeholder="Flooring Installation (per area, total)" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[labor][roofing]" placeholder="Roofing/Ceiling Work" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[labor][others]" placeholder="Additional labor tasks" style={{gridColumn:'1 / -1'}} />
                </div>

                {/* 4. Utilities & Fixtures */}
                <div className="section-title" style={{marginTop:8}}>4. Utilities & Fixtures</div>
                <div className="grid-3">
                  <input name="structured[utilities][sanitary]" placeholder="Sanitary fittings" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[utilities][kitchen]" placeholder="Kitchen cabinets / modular kitchen" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[utilities][electrical_fixtures]" placeholder="Electrical fixtures" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[utilities][water_tank]" placeholder="Water tank & pumps" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[utilities][hvac]" placeholder="AC / Heating (if applicable)" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[utilities][gas_water]" placeholder="Gas / Water lines" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                </div>

                {/* 5. Miscellaneous Costs */}
                <div className="section-title" style={{marginTop:8}}>5. Miscellaneous Costs</div>
                <div className="grid-3">
                  <input name="structured[misc][transport]" placeholder="Transportation of materials" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[misc][contingency]" placeholder="Labor contingency / buffer" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[misc][fees]" placeholder="Permit / municipal / registration fees" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[misc][cleaning]" placeholder="Cleaning / waste removal" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[misc][safety]" placeholder="Safety equipment / scaffolding" style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                </div>

                {/* 6. Totals */}
                <div className="section-title" style={{marginTop:8}}>6. Total Estimation</div>
                <div className="totals">
                  <input name="structured[totals][materials]" placeholder="Material Costs Total" onInput={(e)=>window.__bhCalcGrandTotal(e.currentTarget.form)} style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[totals][labor]" placeholder="Labor Charges Total" onInput={(e)=>window.__bhCalcGrandTotal(e.currentTarget.form)} style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[totals][utilities]" placeholder="Utilities & Fixtures Total" onInput={(e)=>window.__bhCalcGrandTotal(e.currentTarget.form)} style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[totals][misc]" placeholder="Miscellaneous Total" onInput={(e)=>window.__bhCalcGrandTotal(e.currentTarget.form)} style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input className="grand-total" name="structured[totals][grand]" placeholder="Grand Total (auto)" readOnly />
                </div>

                {/* 7. Notes for Homeowner */}
                <div className="section-title" style={{marginTop:8}}>7. Notes for Homeowner</div>
                <textarea name="notes" placeholder="Prices approximate; quantities based on layout; payment schedule; taxes; warranties" rows={3} />

                {/* 8. Optional Details for Transparency */}
                <div style={{fontWeight:700, marginTop:8}}>8. Optional Details</div>
                <textarea name="structured[brands]" placeholder="Brands (cement, steel, tiles) / Grades / Units / Photos links" rows={2} style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                <label style={{fontWeight:600}}>Materials</label>
                <textarea name="materials" placeholder="List key materials, grades, brands if any" rows={2} style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                <label style={{fontWeight:600}}>Cost breakdown</label>
                <textarea name="cost_breakdown" placeholder="Itemized costs (e.g., excavation, RCC, masonry, finishes, labor)" rows={3} style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
                  <div>
                    <label style={{fontWeight:600}}>Total cost (₹)</label>
                    <input name="total_cost" type="number" step="0.01" placeholder="Auto-calculated" required readOnly style={{width:'100%', border:'1px solid #e5e7eb', borderRadius:6, padding:8, background:'#f9fafb'}} />
                  </div>
                  <div>
                    <label style={{fontWeight:600}}>Timeline</label>
                    <input name="timeline" placeholder="e.g., 8–10 weeks" required style={{width:'100%', border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  </div>
                </div>
                <label style={{fontWeight:600}}>Notes</label>
                <textarea name="notes" placeholder="Assumptions, exclusions, payment terms, validity" rows={2} style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                <div style={{padding:10, background:'#f8fafc', border:'1px dashed #cbd5e1', borderRadius:8}}>
                  <div style={{fontWeight:600, marginBottom:6}}>Preview</div>
                  <div style={{fontSize:14, color:'#374151'}}>Fill the fields and your estimate will be visible to the homeowner under "Sent to Contractors".</div>
                </div>
                <div>
                  <label style={{fontWeight:600}}>Attachments (optional)</label>
                  <input name="attachments" type="file" multiple />
                </div>
                <div className="actions">
                  <button className="btn btn-secondary" type="button" onClick={(e)=>{ const form = e.currentTarget.closest('form'); if (form) form.reset(); }}>Reset</button>
                  <button className="btn btn-primary" type="submit">Submit Estimate</button>
                </div>
              </form>
            </details>
          </div>
        </div>
      </div>
    );
  };

  const renderAvailableProjects = () => (
    <div>
      <div className="main-header">
        <h1>Cost Requests</h1>
        <p>Browse layout requests from homeowners and submit your cost estimates</p>
      </div>

      <div className="section-card">
        <div className="section-header">
          <h2>Available Projects</h2>
          <p>Submit cost estimates for approved layouts</p>
        </div>
        <div className="section-content">
          {loading ? (
            <div className="loading">Loading projects...</div>
          ) : layoutRequests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No Projects Available</h3>
              <p>Check back later for new project opportunities!</p>
            </div>
          ) : (
            <div className="item-list">
              {layoutRequests.map(request => {
                const summary = getForwardedSummary(request);
                const thumb = getForwardedThumb(request);
                return (
                <div key={request.id} className="list-item">
                  <div className="item-image">
                    {thumb?.isImage ? (
                      <img src={thumb.href} alt={thumb.name} style={{width:48, height:48, objectFit:'cover', borderRadius:6}} />
                    ) : (
                      '🏠'
                    )}
                  </div>
                  <div className="item-content">
                    <h4 className="item-title">{summary.title}</h4>
                    {summary.hasDesc && (
                      <p className="item-subtitle">{summary.short}</p>
                    )}
                    <p className="item-meta">By {request.homeowner_name} • {request.plot_size} • Budget: ₹{request.budget_range}</p>
                    <button className="btn btn-secondary" style={{marginTop:6}} onClick={() => setShowRequestDetails(prev => ({...prev, [request.id]: !prev[request.id]}))}>
                      {showRequestDetails[request.id] ? 'Hide Details' : 'View Details'}
                    </button>
                    {showRequestDetails[request.id] && (
                      <div className="details-panel">
                        {renderForwardedDesign(request)}
                      </div>
                    )}
                  </div>
                  <div className="item-actions">
                    <span className={`status-badge ${badgeClass(request.status)}`}>{formatStatus(request.status)}</span>
                    <button className="btn btn-primary" onClick={() => navigate(`/contractor/estimate?layout_request_id=${request.id}`)}>Submit Estimate</button>
                  </div>
                </div>
              );})}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderMyProposals = () => (
    <div>
      <div className="main-header">
        <h1>My Estimates</h1>
        <p>Track your submitted cost estimates and their status</p>
      </div>

      <div className="section-card">
        <div className="section-header">
          <h2>Submitted Estimates</h2>
          <p>Monitor the status of your cost estimates</p>
        </div>
        <div className="section-content">
          {myProposals.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No Estimates Yet</h3>
              <p>Submit estimates for available projects to get started!</p>
            </div>
          ) : (
            <div className="item-list">
              {myProposals.map(proposal => (
                <ProposalItem key={proposal.id} proposal={proposal} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div>
      <div className="main-header">
        <h1>Profile</h1>
        <p>Manage your account information and settings</p>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <div className="profile-avatar-large">
            {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
          </div>
          <div className="profile-info">
            <h3>{user?.first_name} {user?.last_name}</h3>
            <p className="profile-role">Contractor</p>
            <p className="profile-email">{user?.email}</p>
          </div>
        </div>

        <div className="profile-card">
          <div className="section-header">
            <h2>Account Information</h2>
            <p>Your personal and professional details</p>
          </div>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Full Name</label>
              <p>{user?.first_name} {user?.last_name}</p>
            </div>
            <div className="detail-item">
              <label>Email Address</label>
              <p>{user?.email}</p>
            </div>
            <div className="detail-item">
              <label>Role</label>
              <p>Contractor</p>
            </div>
            <div className="detail-item">
              <label>Account Status</label>
              <p className="status-badge accepted">Active</p>
            </div>
            <div className="detail-item">
              <label>Total Projects</label>
              <p>{myProposals.filter(p => p.status === 'accepted').length}</p>
            </div>
            <div className="detail-item">
              <label>Success Rate</label>
              <p>{myProposals.length > 0 ? Math.round((myProposals.filter(p => p.status === 'accepted').length / myProposals.length) * 100) : 0}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`dashboard-sidebar soft-sidebar expanded`}>
        <div className="sidebar-header sb-brand">

          <a href="#" className="sidebar-logo">
            <div className="logo-icon">🏠</div>
            <span className="logo-text sb-title">BUILDHUB</span>
          </a>
        </div>

        <nav className="sidebar-nav sb-nav">
          <a 
            href="#" 
            className={`nav-item sb-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveTab('overview'); }}
            title="Dashboard"
          >
            <span className="nav-label sb-label">Dashboard</span>
          </a>
          <a 
            href="#" 
            className={`nav-item sb-item ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveTab('projects'); }}
            title="Cost Requests"
          >
            <span className="nav-label sb-label">Cost Requests</span>
            {requestsCount > 0 && (<span className="nav-badge pulse" style={{ marginLeft:'auto' }}>{requestsCount}</span>)}
          </a>
          <a 
            href="#" 
            className={`nav-item sb-item ${activeTab === 'proposals' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveTab('proposals'); }}
            title="My Estimates"
          >
            <span className="nav-label sb-label">My Estimates</span>
            {proposalsCount > 0 && (<span className="nav-badge pulse" style={{ marginLeft:'auto' }}>{proposalsCount}</span>)}
          </a>
          <a 
            href="#" 
            className={`nav-item sb-item ${activeTab === 'inbox' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveTab('inbox'); }}
            title="Inbox"
          >
            <span className="nav-label sb-label">Inbox</span>
            {inboxCount > 0 && (<span className="nav-badge pulse" style={{ marginLeft:'auto' }}>{inboxCount}</span>)}
          </a>
        
        </nav>

        <div className="sidebar-footer sb-footer" style={{ padding:'12px', borderTop:'1px solid #e5e7eb', marginTop:'auto' }} ref={sidebarProfileRef}>
          <button
            type="button"
            onClick={() => setSidebarProfileOpen(v => !v)}
            aria-haspopup="menu"
            aria-expanded={sidebarProfileOpen ? 'true' : 'false'}
            style={{ width:'100%', background:'transparent', border:'none', padding:0, textAlign:'left', cursor:'pointer' }}
            title="Profile"
          >
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:'#fff', border:'1px solid #e5e7eb', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="Avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                ) : (
                  <span style={{ fontWeight:700, fontSize:12, color:'#374151' }}>{(user?.first_name?.[0]||'C').toUpperCase()}{(user?.last_name?.[0]||'').toUpperCase()}</span>
                )}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:600, fontSize:13, color:'#111827', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                  {user?.first_name || 'Contractor'} {user?.last_name || ''}
                </div>
                <div style={{ fontSize:12, color:'#6b7280', display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ display:'inline-flex', width:6, height:6, borderRadius:6, background:'#10b981' }}></span>
                  Contractor
                </div>
              </div>
              <span style={{ fontSize:12, color:'#6b7280', transition:'transform 160ms ease', transform: sidebarProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
            </div>
          </button>

          {sidebarProfileOpen && (
            <div role="menu" style={{ marginTop:8, background:'#fff', border:'1px solid #e5e7eb', borderRadius:10, boxShadow:'0 10px 28px rgba(2,6,23,0.12)', overflow:'hidden' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:'#f9fafb', borderBottom:'1px solid #f1f5f9' }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background:'#fff', border:'1px solid #e5e7eb', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="Avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  ) : (
                    <span style={{ fontWeight:700, fontSize:12, color:'#374151' }}>{(user?.first_name?.[0]||'C').toUpperCase()}{(user?.last_name?.[0]||'').toUpperCase()}</span>
                  )}
                </div>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontWeight:600, fontSize:13, color:'#111827', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.first_name || 'Contractor'} {user?.last_name || ''}</div>
                  <div style={{ fontSize:12, color:'#6b7280' }}>{user?.email || ''}</div>
                </div>
              </div>
              <button type="button" onClick={() => { setSidebarProfileOpen(false); setActiveTab('profile'); }} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, background:'transparent', border:'none', textAlign:'left', padding:'10px 12px', cursor:'pointer' }} onMouseOver={(e)=>{ e.currentTarget.style.background='#f9fafb'; }} onMouseOut={(e)=>{ e.currentTarget.style.background='transparent'; }}>
                <span aria-hidden style={{ width:18, textAlign:'center' }}>👤</span>
                <span style={{ fontSize:14, color:'#111827' }}>Profile Setup</span>
              </button>
              <div style={{ height:1, background:'#f1f5f9' }}></div>
              <button type="button" onClick={handleLogout} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, background:'transparent', border:'none', textAlign:'left', padding:'10px 12px', cursor:'pointer', color:'#b91c1c' }} onMouseOver={(e)=>{ e.currentTarget.style.background='#fff1f2'; }} onMouseOut={(e)=>{ e.currentTarget.style.background='transparent'; }}>
                <span aria-hidden style={{ width:18, textAlign:'center' }}>🚪</span>
                <span style={{ fontSize:14 }}>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main blue-glass soft-main shifted">
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}
        
        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'projects' && renderAvailableProjects()}
        {activeTab === 'proposals' && renderMyProposals()}
        {activeTab === 'inbox' && renderInbox()}
        {activeTab === 'profile' && renderProfile()}
      </div>
    </div>
  );
};

// Project Item Component
const ProjectItem = ({ request, onProposalSubmit }) => {
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalData, setProposalData] = useState({
    materials: '',
    cost_breakdown: '',
    total_cost: '',
    timeline: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/buildhub/backend/api/contractor/submit_proposal.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          layout_request_id: request.id,
          ...proposalData
        })
      });

      const result = await response.json();
      if (result.success) {
        setShowProposalForm(false);
        setProposalData({
          materials: '',
          cost_breakdown: '',
          total_cost: '',
          timeline: '',
          notes: ''
        });
        onProposalSubmit();
        // Notify success via toast if available
        if (window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', message: 'Proposal submitted successfully!' } }));
        }
      } else {
        if (window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'error', message: 'Failed to submit proposal: ' + (result.message || '') } }));
          }
      }
    } catch (error) {
      if (window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'error', message: 'Error submitting proposal' } }));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="list-item">
        <div className="item-image">🏠</div>
        <div className="item-content">
          <h4 className="item-title">{request.homeowner_name}</h4>
          <p className="item-subtitle">{request.requirements || 'Modern Home Project'}</p>
          <p className="item-meta">{request.plot_size} • Budget: ₹{request.budget_range} • {new Date(request.created_at).toLocaleDateString()}</p>
        </div>
        <div className="item-actions">
          <span className={`status-badge ${badgeClass(request.status)}`}>{formatStatus(request.status)}</span>
          <button 
            onClick={() => setShowProposalForm(true)}
            className="btn btn-primary"
          >
            Submit Estimate
          </button>
        </div>
      </div>

      {showProposalForm && (
        <div className="form-modal">
          <div className="form-content">
            <div className="form-header">
              <h3>Submit Cost Estimate</h3>
              <p>Provide detailed cost breakdown for {request.homeowner_name}'s project</p>
            </div>
            
            <form onSubmit={handleSubmitProposal}>
              <div className="form-group">
                <label>Materials List *</label>
                <textarea
                  value={proposalData.materials}
                  onChange={(e) => setProposalData({...proposalData, materials: e.target.value})}
                  placeholder="List all materials needed (cement, steel, bricks, etc.)"
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label>Cost Breakdown *</label>
                <textarea
                  value={proposalData.cost_breakdown}
                  onChange={(e) => setProposalData({...proposalData, cost_breakdown: e.target.value})}
                  placeholder="Detailed cost breakdown for materials and labor"
                  rows="4"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Total Cost (₹) *</label>
                  <input
                    type="number"
                    value={proposalData.total_cost}
                    onChange={(e) => setProposalData({...proposalData, total_cost: e.target.value})}
                    placeholder="Total project cost"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Timeline *</label>
                  <input
                    type="text"
                    value={proposalData.timeline}
                    onChange={(e) => setProposalData({...proposalData, timeline: e.target.value})}
                    placeholder="e.g., 3-4 months"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Additional Notes</label>
                <textarea
                  value={proposalData.notes}
                  onChange={(e) => setProposalData({...proposalData, notes: e.target.value})}
                  placeholder="Any additional information or terms"
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => setShowProposalForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  {submitting ? 'Submitting...' : 'Submit Estimate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

// Proposal Item Component
const ProposalItem = ({ proposal }) => (
  <div className="list-item">
    <div className="item-image">📄</div>
    <div className="item-content">
      <h4 className="item-title">Estimate for {proposal.homeowner_name}</h4>
      <p className="item-subtitle">Total Cost: ₹{proposal.total_cost} • Timeline: {proposal.timeline}</p>
      <p className="item-meta">Submitted: {new Date(proposal.created_at).toLocaleDateString()}</p>
    </div>
    <div className="item-actions">
      <span className={`status-badge ${badgeClass(proposal.status)}`}>
        {formatStatus(proposal.status)}
      </span>
    </div>
  </div>
);

export default ContractorDashboard;