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
  const [myEstimates, setMyEstimates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [collapsed] = useState(false);
  const [sidebarProfileOpen, setSidebarProfileOpen] = useState(false);
  const sidebarProfileRef = useRef(null);
  const [showRequestDetails, setShowRequestDetails] = useState({});
  // Live totals for inbox estimate form
  const estimateFormRef = useRef(null);
  const [materialsTotal, setMaterialsTotal] = useState(0);
  const [laborTotal, setLaborTotal] = useState(0);
  const [utilitiesTotal, setUtilitiesTotal] = useState(0);
  const [miscTotal, setMiscTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [recentReportUrl, setRecentReportUrl] = useState('');

  const autoGrow = (el) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  const buildEstimateReport = (formEl) => {
    try {
      const data = new FormData(formEl);
      const get = (k) => data.get(k) || '';
      const html = `<!doctype html><html><head><meta charset="utf-8"/>
      <title>Cost Estimate Report</title>
      <style>
        body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#0f172a;margin:24px}
        h1{margin:0 0 8px 0;font-size:20px}
        h2{margin:18px 0 8px 0;font-size:16px;border-bottom:1px solid #e5e7eb;padding-bottom:6px}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
        .row{display:flex;justify-content:space-between;gap:12px}
        .card{border:1px solid #e5e7eb;border-radius:10px;padding:12px;margin:12px 0}
        .muted{color:#64748b}
        .total{font-weight:700}
        table{width:100%;border-collapse:collapse;margin-top:8px}
        th,td{border-bottom:1px solid #eef2f7;padding:8px;text-align:left}
      </style>
      </head><body>
        <h1>Cost Estimate</h1>
        <div class="muted">Generated on ${new Date().toLocaleString()}</div>
        <div class="card">
          <h2>Project</h2>
          <div class="grid">
            <div><strong>Name:</strong> ${get('structured[project_name]')}</div>
            <div><strong>Address:</strong> ${get('structured[project_address]')}</div>
            <div><strong>Plot Size:</strong> ${get('structured[plot_size]')}</div>
            <div><strong>Built-up Area:</strong> ${get('structured[built_up_area]')}</div>
            <div><strong>Floors:</strong> ${get('structured[floors]')}</div>
            <div><strong>Date:</strong> ${get('structured[estimation_date]')}</div>
          </div>
        </div>
        <div class="card">
          <h2>Materials</h2>
          <table><thead><tr><th>Item</th><th class="muted">Qty</th><th class="muted">Rate</th><th>Amount</th></tr></thead><tbody>
            ${['cement','sand','bricks','steel','aggregate','tiles','paint','doors','windows','others'].map(k=>{
              const name=get(`structured[materials][${k}][name]`);
              const qty=get(`structured[materials][${k}][qty]`);
              const rate=get(`structured[materials][${k}][rate]`);
              const amt=get(`structured[materials][${k}][amount]`);
              return (name||amt)?`<tr><td>${name}</td><td class="muted">${qty}</td><td class="muted">${rate}</td><td>${amt}</td></tr>`:'';
            }).join('')}
          </tbody></table>
          <div class="row"><div class="muted">Materials Total</div><div class="total">₹${get('structured[totals][materials]')}</div></div>
        </div>
        <div class="card">
          <h2>Labor</h2>
          <table><thead><tr><th>Task</th><th class="muted">Qty</th><th class="muted">Rate</th><th>Amount</th></tr></thead><tbody>
            ${['mason','plaster','painting','electrical','plumbing','flooring','roofing','others'].map(k=>{
              const name=get(`structured[labor][${k}][name]`);
              const qty=get(`structured[labor][${k}][qty]`);
              const rate=get(`structured[labor][${k}][rate]`);
              const amt=get(`structured[labor][${k}][amount]`);
              return (name||amt)?`<tr><td>${name}</td><td class="muted">${qty}</td><td class="muted">${rate}</td><td>${amt}</td></tr>`:'';
            }).join('')}
          </tbody></table>
          <div class="row"><div class="muted">Labor Total</div><div class="total">₹${get('structured[totals][labor]')}</div></div>
        </div>
        <div class="card">
          <h2>Utilities & Fixtures</h2>
          <table><thead><tr><th>Item</th><th class="muted">Qty</th><th class="muted">Rate</th><th>Amount</th></tr></thead><tbody>
            ${['sanitary','kitchen','electrical_fixtures','water_tank','hvac','gas_water'].map(k=>{
              const name=get(`structured[utilities][${k}][name]`);
              const qty=get(`structured[utilities][${k}][qty]`);
              const rate=get(`structured[utilities][${k}][rate]`);
              const amt=get(`structured[utilities][${k}][amount]`);
              return (name||amt)?`<tr><td>${name}</td><td class="muted">${qty}</td><td class="muted">${rate}</td><td>${amt}</td></tr>`:'';
            }).join('')}
            ${['others1','others2','others3'].map(k=>{
              const name=get(`structured[utilities][${k}][name]`);
              const amt=get(`structured[utilities][${k}][amount]`);
              return (name||amt)?`<tr><td>${name}</td><td class="muted"></td><td class="muted"></td><td>${amt}</td></tr>`:'';
            }).join('')}
          </tbody></table>
          <div class="row"><div class="muted">Utilities Total</div><div class="total">₹${get('structured[totals][utilities]')}</div></div>
        </div>
        <div class="card">
          <h2>Miscellaneous</h2>
          <table><thead><tr><th>Item</th><th class="muted">Qty</th><th class="muted">Rate</th><th>Amount</th></tr></thead><tbody>
            ${['transport','contingency','fees','cleaning','safety'].map(k=>{
              const name=get(`structured[misc][${k}][name]`);
              const qty=get(`structured[misc][${k}][qty]`);
              const rate=get(`structured[misc][${k}][rate]`);
              const amt=get(`structured[misc][${k}][amount]`);
              return (name||amt)?`<tr><td>${name}</td><td class="muted">${qty}</td><td class="muted">${rate}</td><td>${amt}</td></tr>`:'';
            }).join('')}
            ${['others1','others2','others3'].map(k=>{
              const name=get(`structured[misc][${k}][name]`);
              const amt=get(`structured[misc][${k}][amount]`);
              return (name||amt)?`<tr><td>${name}</td><td class="muted"></td><td class="muted"></td><td>${amt}</td></tr>`:'';
            }).join('')}
          </tbody></table>
          <div class="row"><div class="muted">Misc Total</div><div class="total">₹${get('structured[totals][misc]')}</div></div>
        </div>
        <div class="card">
          <h2>Grand Total</h2>
          <div class="row"><div class="muted">Grand Total (All)</div><div class="total">₹${get('structured[totals][grand]')}</div></div>
        </div>
        <script>window.onload=function(){window.print&&window.print();}</script>
      </body></html>`;
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setRecentReportUrl(url);
      window.open(url, '_blank');
    } catch {}
  };

  // Ensure legacy calls to window.__bhCalcSectionTotals work
  useEffect(() => {
    window.__bhCalcSectionTotals = (form) => {
      try { recalcTotalsFromForm(form); } catch {}
    };
    return () => {
      try { if (window.__bhCalcSectionTotals) delete window.__bhCalcSectionTotals; } catch {}
    };
  }, []);

  const recalcTotalsFromForm = (formEl) => {
    if (!formEl) return;
    // Compute per-line amounts for each section (qty * rate)
    try {
      ['materials','labor','utilities','misc'].forEach((section) => {
        const qtyInputs = formEl.querySelectorAll(`input[name^="structured[${section}]"][name$="[qty]"]`);
        qtyInputs.forEach((qtyEl) => {
          const base = qtyEl.name.replace(/\[qty\]$/, '');
          const rateEl = formEl.querySelector(`input[name="${base}[rate]"]`);
          const amountEl = formEl.querySelector(`input[name="${base}[amount]"]`);
          const qty = parseFloat((qtyEl.value || '').toString().replace(/[,\s]/g, '')) || 0;
          const rate = parseFloat(((rateEl && rateEl.value) || '').toString().replace(/[,\s]/g, '')) || 0;
          const amount = qty * rate;
          if (amountEl) amountEl.value = amount ? String(amount) : '';
        });
      });
    } catch {}
    const sumSection = (prefix) => {
      const amountInputs = formEl.querySelectorAll(`input[name^="${prefix}"][name$="[amount]"]`);
      let inputs;
      if (amountInputs && amountInputs.length > 0) {
        inputs = amountInputs;
      } else {
        inputs = formEl.querySelectorAll(`input[name^="${prefix}"]`);
      }
      let total = 0;
      inputs.forEach((inp) => {
        const v = (inp && inp.value) || '';
        // Extract any numbers present (supports "123", "123.45", embedded in text)
        const matches = v.match(/[-+]?(?:\d+\.?\d*|\d*\.?\d+)/g);
        if (matches) {
          matches.forEach((tok) => {
            const n = parseFloat(tok);
            if (!Number.isNaN(n)) total += n;
          });
        }
      });
      return total;
    };
    const m = sumSection('structured[materials]');
    const l = sumSection('structured[labor]');
    const u = sumSection('structured[utilities]');
    const s = sumSection('structured[misc]');
    setMaterialsTotal(m);
    setLaborTotal(l);
    setUtilitiesTotal(u);
    setMiscTotal(s);
    setGrandTotal(m + l + u + s);
  };

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
      try {
        const me = JSON.parse(sessionStorage.getItem('user') || '{}');
        if (mounted && me?.id) {
          const r4 = await fetch(`/buildhub/backend/api/contractor/get_my_estimates.php?contractor_id=${me.id}`, { credentials: 'include' });
          const j4 = await r4.json().catch(() => ({}));
          if (j4?.success) setMyEstimates(Array.isArray(j4.estimates) ? j4.estimates : []);
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
              <h3>{myEstimates.length}</h3>
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
              <form ref={estimateFormRef} className="estimate-form" onInput={(e)=>{ try { recalcTotalsFromForm(e.currentTarget); } catch(_) {} }} onSubmit={async (e)=>{
                e.preventDefault();
                const me = JSON.parse(sessionStorage.getItem('user') || '{}');
                const form = e.currentTarget;
                const sid = String(item?.id || form.querySelector('input[name="send_id"]')?.value || '');
                const cid = String(user?.id || me?.id || form.querySelector('input[name="contractor_id"]')?.value || '');
                if (!sid || !cid) {
                  alert('Missing identifiers. Please refresh and try again.');
                  return;
                }
                // Build structured object from inputs named like structured[...]
                const structured = {};
                const setNested = (obj, pathArr, value) => {
                  let ref = obj;
                  for (let i = 0; i < pathArr.length - 1; i++) {
                    const key = pathArr[i];
                    if (!(key in ref) || typeof ref[key] !== 'object') ref[key] = {};
                    ref = ref[key];
                  }
                  ref[pathArr[pathArr.length - 1]] = value;
                };
                const els = form.querySelectorAll('[name^="structured[" ]');
                els.forEach((el) => {
                  const name = el.getAttribute('name');
                  const m = name.match(/^structured\[(.+)\]$/);
                  if (!m) return;
                  const raw = m[1];
                  const parts = raw.split('][').map(s => s.replace(/\]$/,'').replace(/^\[/,''));
                  const val = el.value;
                  setNested(structured, parts, val);
                });
                const payload = {
                  send_id: Number(sid),
                  contractor_id: Number(cid),
                  materials: form.querySelector('textarea[name="materials"]')?.value || '',
                  cost_breakdown: form.querySelector('textarea[name="cost_breakdown"]')?.value || '',
                  total_cost: form.querySelector('input[name="total_cost"]')?.value || '',
                  timeline: form.querySelector('input[name="timeline"]')?.value || '',
                  notes: form.querySelector('textarea[name="notes"]')?.value || '',
                  structured
                };
                try {
                  const res = await fetch('/buildhub/backend/api/contractor/submit_estimate_for_send.php', {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
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
                {/* Hidden identifiers for backend (use defaultValue to avoid React controlled issues) */}
                <input type="hidden" name="send_id" defaultValue={String(item?.id || '')} />
                <input type="hidden" name="contractor_id" defaultValue={String(user?.id || (JSON.parse(sessionStorage.getItem('user')||'{}').id || ''))} />
                {/* helper: auto-calc grand total from section totals */}
                <script dangerouslySetInnerHTML={{__html:`window.__bhCalcGrandTotal = window.__bhCalcGrandTotal || function(form){try{var m=form.querySelector('[name="structured[totals][materials]"]');var l=form.querySelector('[name="structured[totals][labor]"]');var u=form.querySelector('[name="structured[totals][utilities]"]');var s=form.querySelector('[name="structured[totals][misc]"]');var g=form.querySelector('[name="structured[totals][grand]"]');var tc=form.querySelector('[name="total_cost"]');function num(v){if(!v) return 0;return parseFloat(String(v).replace(/[,\s]/g,''))||0;}var sum=num(m&&m.value)+num(l&&l.value)+num(u&&u.value)+num(s&&s.value);if(g){g.value=sum?String(sum):'';}if(tc){tc.value=sum?String(sum):tc.value;}}catch(e){}};`}} />
                {/* section calculators */}
                <script dangerouslySetInnerHTML={{__html:`window.__bhCalcSectionTotals = window.__bhCalcSectionTotals || function(form){try{function sumSection(prefix){var inputs=form.querySelectorAll('[name^="'+prefix+'"]');var total=0;inputs.forEach(function(inp){var v=(inp && inp.value)||'';var match=v.match(/[-+]?(?:\\d+\\.?\\d*|\\d*\\.?\\d+)/g);if(match){match.forEach(function(tok){var n=parseFloat(tok);if(!isNaN(n)) total+=n;});}});return total;}var m=sumSection('structured[materials]');var l=sumSection('structured[labor]');var u=sumSection('structured[utilities]');var s=sumSection('structured[misc]');var fm=form.querySelector('[name="structured[totals][materials]"]'); if(fm) fm.value = m?String(m):'';var fl=form.querySelector('[name="structured[totals][labor]"]'); if(fl) fl.value = l?String(l):'';var fu=form.querySelector('[name="structured[totals][utilities]"]'); if(fu) fu.value = u?String(u):'';var fs=form.querySelector('[name="structured[totals][misc]"]'); if(fs) fs.value = s?String(s):''; if(typeof window.__bhCalcGrandTotal==='function'){ window.__bhCalcGrandTotal(form); } }catch(e){}};`}} />
                {/* 1. Basic Project Information */}
                <div className="section-title">1. Basic Project Information</div>
                <div className="grid-2">
                  <input name="structured[project_name]" placeholder="Project Name" list="bh_project_names" />
                  <input name="structured[project_address]" placeholder="Project Address / Location" />
                  <input name="structured[plot_size]" placeholder="Plot Size (sq.ft / sq.m)" />
                  <input name="structured[built_up_area]" placeholder="Built-up Area (sq.ft / sq.m)" />
                  <select name="structured[floors]" defaultValue="">
                    <option value="" disabled>Number of Floors</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                  <input name="structured[estimation_date]" type="date" placeholder="Estimation Date" />
                  <input name="structured[client_name]" placeholder="Client / Homeowner Name" />
                  <input name="structured[client_contact]" placeholder="Contact Info" />
                </div>

                {/* 2. Material Costs */}
                <div className="section-title" style={{marginTop:8}}>2. Material Costs</div>
                <div className="muted" style={{marginTop:4}}>Tip: enter numeric amounts anywhere in the field (e.g., "OPC 53 - 60000"). The calculator sums the numbers it finds.</div>
                <div className="grid-3" onInput={(e)=>{ try { recalcTotalsFromForm(e.currentTarget.closest('form')); } catch(_) {} }}>
                  <div className="estimate-line grid-4">
                    <input name="structured[materials][cement][name]" placeholder="Cement grade (OPC 43/53, PPC)" list="bh_cement" />
                    <input name="structured[materials][cement][qty]" placeholder="Qty (bags) e.g., 50" />
                    <input name="structured[materials][cement][rate]" placeholder="Rate (₹ per bag) e.g., 380" />
                    <input name="structured[materials][cement][amount]" placeholder="Amount (auto)" readOnly />
                  </div>
                  <div className="estimate-line grid-4">
                    <input name="structured[materials][sand][name]" placeholder="Sand type (River/M-sand)" list="bh_sand" />
                    <input name="structured[materials][sand][qty]" placeholder="Qty (m³) e.g., 6" />
                    <input name="structured[materials][sand][rate]" placeholder="Rate (₹ per m³) e.g., 2500" />
                    <input name="structured[materials][sand][amount]" placeholder="Amount (auto)" readOnly />
                  </div>
                  <div className="estimate-line grid-4">
                    <input name="structured[materials][bricks][name]" placeholder="Bricks/Blocks (Clay/AAC)" list="bh_bricks" />
                    <input name="structured[materials][bricks][qty]" placeholder="Qty (nos) e.g., 5000" />
                    <input name="structured[materials][bricks][rate]" placeholder="Rate (₹ per 1000) e.g., 8500" />
                    <input name="structured[materials][bricks][amount]" placeholder="Amount (auto)" readOnly />
                  </div>
                  <div className="estimate-line grid-4">
                    <input name="structured[materials][steel][name]" placeholder="Steel/TMT (8/10/12mm)" list="bh_steel" />
                    <input name="structured[materials][steel][qty]" placeholder="Qty (kg) e.g., 1200" />
                    <input name="structured[materials][steel][rate]" placeholder="Rate (₹ per kg) e.g., 68" />
                    <input name="structured[materials][steel][amount]" placeholder="Amount (auto)" readOnly />
                  </div>
                  <div className="estimate-line grid-4">
                    <input name="structured[materials][aggregate][name]" placeholder="Aggregate (10/20mm)" list="bh_aggregate" />
                    <input name="structured[materials][aggregate][qty]" placeholder="Qty (m³) e.g., 8" />
                    <input name="structured[materials][aggregate][rate]" placeholder="Rate (₹ per m³) e.g., 1800" />
                    <input name="structured[materials][aggregate][amount]" placeholder="Amount (auto)" readOnly />
                  </div>
                  <div className="estimate-line grid-4">
                    <input name="structured[materials][tiles][name]" placeholder="Tiles/Flooring (Vitrified/Ceramic)" list="bh_tiles" />
                    <input name="structured[materials][tiles][qty]" placeholder="Qty (m²) e.g., 120" />
                    <input name="structured[materials][tiles][rate]" placeholder="Rate (₹ per m²) e.g., 600" />
                    <input name="structured[materials][tiles][amount]" placeholder="Amount (auto)" readOnly />
                  </div>
                  <div className="estimate-line grid-4">
                    <input name="structured[materials][paint][name]" placeholder="Paint (Interior/Exterior)" list="bh_paint" />
                    <input name="structured[materials][paint][qty]" placeholder="Qty (L) e.g., 80" />
                    <input name="structured[materials][paint][rate]" placeholder="Rate (₹ per L) e.g., 250" />
                    <input name="structured[materials][paint][amount]" placeholder="Amount (auto)" readOnly />
                  </div>
                  <div className="estimate-line grid-4">
                    <input name="structured[materials][doors][name]" placeholder="Doors (Teak/Flush)" list="bh_doors" />
                    <input name="structured[materials][doors][qty]" placeholder="Qty (nos) e.g., 10" />
                    <input name="structured[materials][doors][rate]" placeholder="Rate (₹ per door) e.g., 7000" />
                    <input name="structured[materials][doors][amount]" placeholder="Amount (auto)" readOnly />
                  </div>
                  <div className="estimate-line grid-4">
                    <input name="structured[materials][windows][name]" placeholder="Windows (uPVC/Aluminium)" list="bh_windows" />
                    <input name="structured[materials][windows][qty]" placeholder="Qty (nos) e.g., 12" />
                    <input name="structured[materials][windows][rate]" placeholder="Rate (₹ per window) e.g., 6000" />
                    <input name="structured[materials][windows][amount]" placeholder="Amount (auto)" readOnly />
                  </div>
                  <div className="estimate-line grid-4" style={{gridColumn:'1 / -1'}}>
                    <input name="structured[materials][others][name]" placeholder="Other material (e.g., Glass/Hardware)" />
                    <input name="structured[materials][others][qty]" placeholder="Qty (units)" />
                    <input name="structured[materials][others][rate]" placeholder="Rate (₹ per unit)" />
                    <input name="structured[materials][others][amount]" placeholder="Amount (auto)" readOnly />
                  </div>
                </div>

                {/* 3. Labor Charges */}
                <div className="section-title" style={{marginTop:8}}>3. Labor Charges</div>
                <div className="grid-3" onInput={(e)=>{ try { recalcTotalsFromForm(e.currentTarget.closest('form')); } catch(_) {} }}>
                  <div className="estimate-line grid-4">
                    <input name="structured[labor][mason][name]" placeholder="Masonry work" list="bh_labor_mason" />
                    <input name="structured[labor][mason][qty]" placeholder="Qty (m³ / days)" />
                    <input name="structured[labor][mason][rate]" placeholder="Rate (₹ per unit)" />
                    <input name="structured[labor][mason][amount]" placeholder="Amount (auto)" readOnly />
                  </div>
                  <div className="estimate-line grid-4">
                    <input name="structured[labor][plaster][name]" placeholder="Plaster work" list="bh_labor_plaster" />
                    <input name="structured[labor][plaster][qty]" placeholder="Qty (m²)" />
                    <input name="structured[labor][plaster][rate]" placeholder="Rate (₹ per m²)" />
                    <input name="structured[labor][plaster][amount]" placeholder="Amount (auto)" readOnly />
                  </div>
                  <div className="estimate-line grid-4">
                    <input name="structured[labor][painting][name]" placeholder="Painting" list="bh_labor_painting" />
                    <input name="structured[labor][painting][qty]" placeholder="Qty (m² / rooms)" />
                    <input name="structured[labor][painting][rate]" placeholder="Rate (₹ per unit)" />
                    <input name="structured[labor][painting][amount]" placeholder="Amount (auto)" readOnly />
                  </div>
                  <div className="estimate-line grid-4">
                    <input name="structured[labor][electrical][name]" placeholder="Electrical" list="bh_labor_electrical" />
                    <input name="structured[labor][electrical][qty]" placeholder="Qty (points / rooms)" />
                    <input name="structured[labor][electrical][rate]" placeholder="Rate (₹ per point/room)" />
                    <input name="structured[labor][electrical][amount]" placeholder="Amount (auto)" readOnly />
                  </div>
                  <div className="estimate-line grid-4">
                    <input name="structured[labor][plumbing][name]" placeholder="Plumbing" list="bh_labor_plumbing" />
                    <input name="structured[labor][plumbing][qty]" placeholder="Qty (fittings / rooms)" />
                    <input name="structured[labor][plumbing][rate]" placeholder="Rate (₹ per fitting)" />
                    <input name="structured[labor][plumbing][amount]" placeholder="Amount (auto)" readOnly />
                  </div>
                  <div className="estimate-line grid-4">
                    <input name="structured[labor][flooring][name]" placeholder="Flooring installation" list="bh_labor_flooring" />
                    <input name="structured[labor][flooring][qty]" placeholder="Qty (m²)" />
                    <input name="structured[labor][flooring][rate]" placeholder="Rate (₹ per m²)" />
                    <input name="structured[labor][flooring][amount]" placeholder="Amount (auto)" readOnly />
                  </div>
                  <div className="estimate-line grid-4">
                    <input name="structured[labor][roofing][name]" placeholder="Roofing/Ceiling work" list="bh_labor_roofing" />
                    <input name="structured[labor][roofing][qty]" placeholder="Qty (m²)" />
                    <input name="structured[labor][roofing][rate]" placeholder="Rate (₹ per m²)" />
                    <input name="structured[labor][roofing][amount]" placeholder="Amount (auto)" readOnly />
                  </div>
                  <div className="estimate-line grid-4" style={{gridColumn:'1 / -1'}}>
                    <input name="structured[labor][others][name]" placeholder="Other labor" />
                    <input name="structured[labor][others][qty]" placeholder="Qty (units)" />
                    <input name="structured[labor][others][rate]" placeholder="Rate (₹ per unit)" />
                    <input name="structured[labor][others][amount]" placeholder="Amount (auto)" readOnly />
                  </div>
                </div>

                {/* 4. Utilities & Fixtures */}
                <div className="section-title" style={{marginTop:8}}>4. Utilities & Fixtures</div>
                <div className="grid-3" onInput={(e)=>{ try { recalcTotalsFromForm(e.currentTarget.closest('form')); } catch(_) {} }}>
                  <div className="estimate-line grid-4">
                    <input name="structured[utilities][sanitary][name]" placeholder="Sanitary fittings" list="bh_util_sanitary" />
                    <input name="structured[utilities][sanitary][qty]" placeholder="Qty (sets)" />
                    <input name="structured[utilities][sanitary][rate]" placeholder="Rate (₹ per set)" />
                    <input name="structured[utilities][sanitary][amount]" placeholder="Amount (auto)" readOnly />
                  </div>
                  <div className="estimate-line grid-4">
                    <input name="structured[utilities][kitchen][name]" placeholder="Kitchen cabinets / modular" list="bh_util_kitchen" />
                    <input name="structured[utilities][kitchen][qty]" placeholder="Qty (ft / set)" />
                    <input name="structured[utilities][kitchen][rate]" placeholder="Rate (₹ per ft/set)" />
                    <input name="structured[utilities][kitchen][amount]" placeholder="Amount (auto)" readOnly />
                  </div>
                  <div className="estimate-line grid-4">
                    <input name="structured[utilities][electrical_fixtures][name]" placeholder="Electrical fixtures" list="bh_util_electrical_fixtures" />
                    <input name="structured[utilities][electrical_fixtures][qty]" placeholder="Qty (points)" />
                    <input name="structured[utilities][electrical_fixtures][rate]" placeholder="Rate (₹ per point)" />
                    <input name="structured[utilities][electrical_fixtures][amount]" placeholder="Amount (auto)" readOnly />
                  </div>
                  <div className="estimate-line grid-4">
                    <input name="structured[utilities][water_tank][name]" placeholder="Water tank & pumps" list="bh_util_watertank" />
                    <input name="structured[utilities][water_tank][qty]" placeholder="Qty (units)" />
                    <input name="structured[utilities][water_tank][rate]" placeholder="Rate (₹ per unit)" />
                    <input name="structured[utilities][water_tank][amount]" placeholder="Amount (auto)" readOnly />
                  </div>
                  <div className="estimate-line grid-4">
                    <input name="structured[utilities][hvac][name]" placeholder="AC / Heating" list="bh_util_hvac" />
                    <input name="structured[utilities][hvac][qty]" placeholder="Qty (tons / units)" />
                    <input name="structured[utilities][hvac][rate]" placeholder="Rate (₹ per unit)" />
                    <input name="structured[utilities][hvac][amount]" placeholder="Amount (auto)" readOnly />
                  </div>
                  <div className="estimate-line grid-4">
                    <input name="structured[utilities][gas_water][name]" placeholder="Gas / Water lines" list="bh_util_gaswater" />
                    <input name="structured[utilities][gas_water][qty]" placeholder="Qty (m / points)" />
                    <input name="structured[utilities][gas_water][rate]" placeholder="Rate (₹ per m/point)" />
                    <input name="structured[utilities][gas_water][amount]" placeholder="Amount (auto)" readOnly />
                  </div>
                  {/* Other utilities: simple Item + Price rows */}
                  <div className="estimate-line grid-4" style={{gridColumn:'1 / -1'}}>
                    <input name="structured[utilities][others1][name]" placeholder="Other utility item (e.g., Geyser install)" />
                    <div />
                    <div />
                    <input name="structured[utilities][others1][amount]" placeholder="Price (₹)" />
                  </div>
                  <div className="estimate-line grid-4" style={{gridColumn:'1 / -1'}}>
                    <input name="structured[utilities][others2][name]" placeholder="Other utility item" />
                    <div />
                    <div />
                    <input name="structured[utilities][others2][amount]" placeholder="Price (₹)" />
                  </div>
                  <div className="estimate-line grid-4" style={{gridColumn:'1 / -1'}}>
                    <input name="structured[utilities][others3][name]" placeholder="Other utility item" />
                    <div />
                    <div />
                    <input name="structured[utilities][others3][amount]" placeholder="Price (₹)" />
                  </div>
                </div>

                {/* 5. Miscellaneous Costs */}
                <div className="section-title" style={{marginTop:8}}>5. Miscellaneous Costs</div>
                <div className="grid-3" onInput={(e)=>{ try { recalcTotalsFromForm(e.currentTarget.closest('form')); } catch(_) {} }}>
                  <div className="estimate-line grid-4">
                    <input name="structured[misc][transport][name]" placeholder="Transport (local/long-haul)" list="bh_misc_transport" />
                    <input name="structured[misc][transport][qty]" placeholder="Qty (trips)" />
                    <input name="structured[misc][transport][rate]" placeholder="Rate (₹ per trip)" />
                    <input name="structured[misc][transport][amount]" placeholder="Amount (auto)" readOnly />
                  </div>
                  <div className="estimate-line grid-4">
                    <input name="structured[misc][contingency][name]" placeholder="Contingency buffer" list="bh_misc_contingency" />
                    <input name="structured[misc][contingency][qty]" placeholder="Qty (%) e.g., 5" />
                    <input name="structured[misc][contingency][rate]" placeholder="Base amount (₹)" />
                    <input name="structured[misc][contingency][amount]" placeholder="Amount (auto)" readOnly />
                  </div>
                <div className="estimate-line grid-4">
                  <input name="structured[misc][fees][name]" placeholder="Permit/Municipal/Registration fees" list="bh_misc_fees" />
                  <div />
                  <div />
                  <input name="structured[misc][fees][amount]" placeholder="Price (₹)" />
                </div>
                  <div className="estimate-line grid-4">
                    <input name="structured[misc][cleaning][name]" placeholder="Cleaning / Waste removal" list="bh_misc_cleaning" />
                    <input name="structured[misc][cleaning][qty]" placeholder="Qty (days / loads)" />
                    <input name="structured[misc][cleaning][rate]" placeholder="Rate (₹ per unit)" />
                    <input name="structured[misc][cleaning][amount]" placeholder="Amount (auto)" readOnly />
                  </div>
                  <div className="estimate-line grid-4">
                    <input name="structured[misc][safety][name]" placeholder="Safety equipment / Scaffolding" list="bh_misc_safety" />
                    <input name="structured[misc][safety][qty]" placeholder="Qty (sets / days)" />
                    <input name="structured[misc][safety][rate]" placeholder="Rate (₹ per unit)" />
                    <input name="structured[misc][safety][amount]" placeholder="Amount (auto)" readOnly />
                  </div>
                  {/* Other miscellaneous: simple Item + Price rows */}
                  <div className="estimate-line grid-4" style={{gridColumn:'1 / -1'}}>
                    <input name="structured[misc][others1][name]" placeholder="Other expense (e.g., Site security)" />
                    <div />
                    <div />
                    <input name="structured[misc][others1][amount]" placeholder="Price (₹)" />
                  </div>
                  <div className="estimate-line grid-4" style={{gridColumn:'1 / -1'}}>
                    <input name="structured[misc][others2][name]" placeholder="Other expense" />
                    <div />
                    <div />
                    <input name="structured[misc][others2][amount]" placeholder="Price (₹)" />
                  </div>
                  <div className="estimate-line grid-4" style={{gridColumn:'1 / -1'}}>
                    <input name="structured[misc][others3][name]" placeholder="Other expense" />
                    <div />
                    <div />
                    <input name="structured[misc][others3][amount]" placeholder="Price (₹)" />
                  </div>
                </div>

                {/* 6. Totals */}
                <div className="section-title" style={{marginTop:8}}>6. Total Estimation</div>
                <div className="totals" onInput={(e)=>{ try { recalcTotalsFromForm(e.currentTarget.closest('form')); } catch(_) {} }}>
                  <input name="structured[totals][materials]" placeholder="Material Costs Total" value={materialsTotal || ''} readOnly style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[totals][labor]" placeholder="Labor Charges Total" value={laborTotal || ''} readOnly style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[totals][utilities]" placeholder="Utilities & Fixtures Total" value={utilitiesTotal || ''} readOnly style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input name="structured[totals][misc]" placeholder="Miscellaneous Total" value={miscTotal || ''} readOnly style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8}} />
                  <input className="grand-total" name="structured[totals][grand]" placeholder="Grand Total (auto)" readOnly value={grandTotal || ''} />
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
                  <button className="btn btn-secondary" type="button" onClick={(e)=>{ const form = e.currentTarget.closest('form'); if (form) form.reset(); recalcTotalsFromForm(form); }}>Reset</button>
                  <button className="btn btn-primary" type="button" onClick={(e)=>{ const form = e.currentTarget.closest('form'); buildEstimateReport(form); }}>Download Report</button>
                  <button className="btn btn-primary" type="submit">Submit Estimate</button>
                </div>

                {/* Predictive option sources (datalists) */}
                <datalist id="bh_project_names">
                  <option value="Residential Villa" />
                  <option value="Commercial Complex" />
                  <option value="Renovation Project" />
                </datalist>
                <datalist id="bh_cement">
                  <option value="OPC 43 grade - 50 bags" />
                  <option value="OPC 53 grade - 60 bags" />
                  <option value="PPC - 55 bags" />
                </datalist>
                <datalist id="bh_sand">
                  <option value="River sand - 5 m³" />
                  <option value="M-sand - 6 m³" />
                </datalist>
                <datalist id="bh_bricks">
                  <option value="Clay bricks - 5000 nos" />
                  <option value="AAC blocks - 3000 nos" />
                </datalist>
                <datalist id="bh_steel">
                  <option value="TMT 8/10/12mm - 1500 kg" />
                  <option value="TMT 16/20mm - 1000 kg" />
                </datalist>
                <datalist id="bh_aggregate">
                  <option value="20mm aggregate - 8 m³" />
                  <option value="10mm aggregate - 6 m³" />
                </datalist>
                <datalist id="bh_tiles">
                  <option value="Vitrified tiles - 120 m²" />
                  <option value="Ceramic tiles - 90 m²" />
                </datalist>
                <datalist id="bh_paint">
                  <option value="Interior emulsion - 80 L" />
                  <option value="Exterior emulsion - 60 L" />
                </datalist>
                <datalist id="bh_doors">
                  <option value="Teakwood doors - 10 nos" />
                  <option value="Flush doors - 8 nos" />
                </datalist>
                <datalist id="bh_windows">
                  <option value="uPVC windows - 12 nos" />
                  <option value="Aluminium windows - 10 nos" />
                </datalist>
                <datalist id="bh_labor_mason">
                  <option value="Masonry - ₹/m³" />
                  <option value="Block work - ₹/m²" />
                </datalist>
                <datalist id="bh_labor_plaster">
                  <option value="Internal plaster - ₹/m²" />
                  <option value="External plaster - ₹/m²" />
                </datalist>
                <datalist id="bh_labor_painting">
                  <option value="2-coat interior - ₹/m²" />
                  <option value="3-coat exterior - ₹/m²" />
                </datalist>
                <datalist id="bh_labor_electrical">
                  <option value="Per point - ₹/pt" />
                  <option value="Per room - ₹/room" />
                </datalist>
                <datalist id="bh_labor_plumbing">
                  <option value="Per fitting - ₹/fit" />
                  <option value="Per bathroom - ₹/bath" />
                </datalist>
                <datalist id="bh_labor_flooring">
                  <option value="Flooring install - ₹/m²" />
                  <option value="Skirting - ₹/m" />
                </datalist>
                <datalist id="bh_labor_roofing">
                  <option value="Roof sheet install - ₹/m²" />
                  <option value="Ceiling grid - ₹/m²" />
                </datalist>
                <datalist id="bh_util_sanitary">
                  <option value="WC, basin, shower set" />
                  <option value="Premium sanitary set" />
                </datalist>
                <datalist id="bh_util_kitchen">
                  <option value="Modular kitchen - 12ft" />
                  <option value="Modular kitchen - 15ft" />
                </datalist>
                <datalist id="bh_util_electrical_fixtures">
                  <option value="LED panels, fans, switches" />
                  <option value="Designer lights set" />
                </datalist>
                <datalist id="bh_util_watertank">
                  <option value="Overhead tank 1000L + pump" />
                  <option value="Overhead tank 2000L + pump" />
                </datalist>
                <datalist id="bh_util_hvac">
                  <option value="Split AC - 1.5T x 2" />
                  <option value="Inverter AC - 1T x 3" />
                </datalist>
                <datalist id="bh_util_gaswater">
                  <option value="Gas line + kitchen water line" />
                  <option value="Full house water lines" />
                </datalist>
                <datalist id="bh_misc_transport">
                  <option value="Material transport local" />
                  <option value="Material transport long-haul" />
                </datalist>
                <datalist id="bh_misc_contingency">
                  <option value="5% buffer" />
                  <option value="10% buffer" />
                </datalist>
                <datalist id="bh_misc_fees">
                  <option value="Permit & registration" />
                  <option value="Municipal fees" />
                </datalist>
                <datalist id="bh_misc_cleaning">
                  <option value="Debris removal" />
                  <option value="Final cleaning" />
                </datalist>
                <datalist id="bh_misc_safety">
                  <option value="PPE & scaffolding" />
                  <option value="Safety nets & signage" />
                </datalist>
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
  const renderMyEstimates = () => (
    <div>
      <div className="main-header">
        <h1>My Estimates</h1>
        <p>Your submitted estimates with totals and timestamps</p>
      </div>
      <div className="section-card">
        <div className="section-header">
          <h2>Recent Estimates</h2>
          <p>Download or reference previous submissions</p>
        </div>
        <div className="section-content">
          {myEstimates.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📄</div>
              <h3>No Estimates Yet</h3>
              <p>Submit an estimate from your Inbox to see it here.</p>
            </div>
          ) : (
            <div className="item-list">
              {myEstimates.map(est => (
                <div key={est.id} className="list-item">
                  <div className="item-content" style={{flex:1}}>
                    <h4 className="item-title">Estimate #{est.id}</h4>
                    <p className="item-subtitle">Send ID: {est.send_id} • Total: ₹{est.total_cost ?? '—'} • {new Date(est.created_at).toLocaleString()}</p>
                  </div>
                  <div className="item-actions">
                    <button className="btn btn-secondary" onClick={()=>{
                      try {
                        const win = window.open('', '_blank');
                        if (win) { win.document.write('<pre>'+ (est.structured || est.materials || '') +'</pre>'); win.document.close(); }
                      } catch {}
                    }}>View Raw</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

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