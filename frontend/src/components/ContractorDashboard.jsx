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
  const [myProposals, setMyProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [collapsed] = useState(false);
  const [sidebarProfileOpen, setSidebarProfileOpen] = useState(false);
  const sidebarProfileRef = useRef(null);
  const [showRequestDetails, setShowRequestDetails] = useState({});

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
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:'10px'}}>
          {files.map((f, idx) => {
            const href = f.path || `/buildhub/backend/uploads/designs/${f.stored || f.original}`;
            const ext = (f.ext || '').toLowerCase();
            const isImage = ['jpg','jpeg','png','gif','webp','svg','heic'].includes(ext);
            return (
              <div key={idx} className="file-card" style={{cursor:'default'}}>
                {isImage ? (
                  <img src={href} alt={f.original} style={{width:'100%', height:120, objectFit:'cover', borderRadius:6}} />
                ) : (
                  <div className="file-thumb" style={{height:120, display:'flex', alignItems:'center', justifyContent:'center', background:'#f5f5f7', borderRadius:6}}>
                    <span style={{fontSize:'2rem'}}>📄</span>
                  </div>
                )}
                <div className="file-name" style={{fontSize:'0.85rem', marginTop:6, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}} title={f.original || f.stored}>
                  {f.original || f.stored}
                </div>
                <div style={{display:'flex', gap:8, marginTop:6}}>
                  <a href={href} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{padding:'6px 10px'}}>Open</a>
                  <a href={href} download className="btn" style={{padding:'6px 10px'}}>Download</a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
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
              {layoutRequests.slice(0, 5).map(request => (
                <div key={request.id} className="list-item">
                  <div className="item-image">🏠</div>
                  <div className="item-content">
                    <h4 className="item-title">{request.homeowner_name}</h4>
                    <p className="item-subtitle">{(parseRequirements(request.requirements).layout_description || request.requirements) || 'Modern Home Project'}</p>
                    <p className="item-meta">{request.plot_size} • Budget: ₹{request.budget_range}</p>
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

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
              {layoutRequests.map(request => (
                <div key={request.id} className="list-item">
                  <div className="item-image">🏠</div>
                  <div className="item-content">
                    <h4 className="item-title">{request.homeowner_name}</h4>
                    <p className="item-subtitle">{(parseRequirements(request.requirements).layout_description || request.requirements) || 'Modern Home Project'}</p>
                    <p className="item-meta">{request.plot_size} • Budget: ₹{request.budget_range}</p>
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
              ))}
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
            <span className="nav-icon sb-icon">📊</span>
            <span className="nav-label sb-label">Dashboard</span>
          </a>
          <a 
            href="#" 
            className={`nav-item sb-item ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveTab('projects'); }}
            title="Cost Requests"
          >
            <span className="nav-icon sb-icon">📋</span>
            <span className="nav-label sb-label">Cost Requests</span>
          </a>
          <a 
            href="#" 
            className={`nav-item sb-item ${activeTab === 'proposals' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveTab('proposals'); }}
            title="My Estimates"
          >
            <span className="nav-icon sb-icon">📄</span>
            <span className="nav-label sb-label">My Estimates</span>
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