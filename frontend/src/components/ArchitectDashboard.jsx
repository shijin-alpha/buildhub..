import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ArchitectSoftUI.css';
import '../../styles/ArchitectDashboard.css';

import '../styles/SoftSidebar.css';
import '../styles/HeaderProfile.css';
import '../styles/Widgets.css';
import './WidgetColors.css';
import { badgeClass, formatStatus } from '../utils/status';
import { useToast } from './ToastProvider';
import ArchitectProfileButton from './ArchitectProfileButton';
import StylishProfile from './StylishProfile';
import NeatJsonCard from './NeatJsonCard';
import TechnicalDetailsDisplay from './TechnicalDetailsDisplay';
import TechnicalDetailsForm from './TechnicalDetailsForm';
import '../styles/TechnicalDetailsForm.css';


const ArchitectDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [layoutRequests, setLayoutRequests] = useState([]);
  const [myDesigns, setMyDesigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const toast = useToast();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadFormStep, setUploadFormStep] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSidebarProfileMenu, setShowSidebarProfileMenu] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({ specialization: '', experience_years: '', email: '', phone: '', city: '', avg_rating: null, review_count: 0 });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  // Reviews in profile drawer
  const [archReviews, setArchReviews] = useState([]);
  const [archReviewsLoading, setArchReviewsLoading] = useState(false);
  const [archReviewsError, setArchReviewsError] = useState('');
  const [showReviews, setShowReviews] = useState(false);

  // My library state
  const [libraryLayouts, setLibraryLayouts] = useState([]);
  const [showLibraryForm, setShowLibraryForm] = useState(false);
  const [libraryFormStep, setLibraryFormStep] = useState(0);
  const [libraryForm, setLibraryForm] = useState({
    title: '', layout_type: '', bedrooms: '', bathrooms: '', area: '', price_range: '', description: '', image: null, design_file: null, technical_details: {}
  });

  // Upload form state
  const [uploadData, setUploadData] = useState({
    request_id: '',
    homeowner_id: '', // optional: send directly to a homeowner
    design_title: '',
    description: '',
    technical_details: {},
    files: []
  });

  useEffect(() => {
    // Get user data from session
    const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
    setUser(userData);

    // Strict: prevent cached back navigation showing dashboard
    import('../utils/session').then(({ preventCache, verifyServerSession }) => {
      preventCache();
      (async () => {
        const serverAuth = await verifyServerSession();
        if (!userData.id || userData.role !== 'architect' || !serverAuth) {
          sessionStorage.removeItem('user');
          localStorage.removeItem('bh_user');
          navigate('/login', { replace: true });
          return;
        }
        // proceed
        fetchLayoutRequests();
        fetchMyDesigns();
        fetchMyLibrary();
        fetchMyProfile();
      })();
    });
  }, []);

  const fetchLayoutRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch('/buildhub/backend/api/architect/get_layout_requests.php');
      const result = await response.json();
      if (result.success) {
        setLayoutRequests(result.requests || []);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyDesigns = async () => {
    try {
      const response = await fetch('/buildhub/backend/api/architect/get_my_designs.php');
      const result = await response.json();
      if (result.success) {
        setMyDesigns(result.designs || []);
      }
    } catch (error) {
      console.error('Error fetching designs:', error);
    }
  };

  // Mark a design as finalized
  const finalizeDesign = async (designId) => {
    try {
      const res = await fetch('/buildhub/backend/api/architect/finalize_design.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ design_id: designId }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Design finalized');
        // Update list locally without full refetch
        setMyDesigns(prev => prev.map(d => d.id === designId ? { ...d, status: 'finalized' } : d));
      } else {
        toast.error(json.message || 'Failed to finalize');
      }
    } catch (e) {
      toast.error('Network error while finalizing');
    }
  };

  const fetchMyProfile = async () => {
    setProfileLoading(true);
    try {
      const res = await fetch('/buildhub/backend/api/architect/get_my_profile.php');
      const json = await res.json();
      if (json.success) {
        const p = json.profile || {};
        setProfile({
          specialization: p.specialization || '',
          experience_years: p.experience_years ?? '',
          email: p.email || '',
          phone: p.phone || '',
          city: p.city || '',
          avg_rating: p.avg_rating ?? null,
          review_count: p.review_count || 0,
        });
        // Fetch reviews for this architect (self)
        if (json.profile?.id || sessionStorage.getItem('user')) {
          const me = JSON.parse(sessionStorage.getItem('user') || '{}');
          const myId = json.profile?.id || me.id;
          if (myId) {
            setArchReviewsLoading(true);
            setArchReviewsError('');
            try {
              const r = await fetch(`/buildhub/backend/api/reviews/get_reviews.php?architect_id=${myId}`);
              const rj = await r.json();
              if (rj.success) {
                setArchReviews(Array.isArray(rj.reviews) ? rj.reviews : []);
                // also sync avg + count if backend computes differently
                if (typeof rj.avg_rating === 'number') setProfile(prev => ({...prev, avg_rating: rj.avg_rating}));
                if (typeof rj.review_count === 'number') setProfile(prev => ({...prev, review_count: rj.review_count}));
              } else {
                setArchReviewsError(rj.message || 'Failed to load reviews');
              }
            } catch {
              setArchReviewsError('Network error while loading reviews');
            } finally {
              setArchReviewsLoading(false);
            }
          }
        }
      }
    } catch (e) {
      // non-blocking
    } finally {
      setProfileLoading(false);
    }
  };

  const saveMyProfile = async (e) => {
    e?.preventDefault?.();
    setProfileSaving(true);
    try {
      const payload = {
        specialization: profile.specialization,
        experience_years: profile.experience_years === '' ? null : Number(profile.experience_years),
        phone: profile.phone,
        city: profile.city,
      };
      const res = await fetch('/buildhub/backend/api/architect/update_my_profile.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        setSuccess('Profile updated');
        fetchMyProfile();
      } else {
        setError(json.message || 'Failed to update profile');
      }
    } catch (e) {
      setError('Error updating profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const fetchMyLibrary = async () => {
    try {
      const res = await fetch('/buildhub/backend/api/architect/get_my_layouts.php');
      const json = await res.json();
      if (json.success) setLibraryLayouts(json.layouts || []);
    } catch (e) { console.error('Error fetching my layouts', e); }
  };

  const submitNewLibraryItem = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(libraryForm).forEach(([k,v]) => {
      if (k === 'technical_details') {
        if (v && Object.keys(v).length > 0) {
          fd.append(k, JSON.stringify(v));
        }
      } else if (v !== null && v !== '') {
        fd.append(k, v);
      }
    });
    try {
      const res = await fetch('/buildhub/backend/api/architect/create_layout_library_item.php', {
        method: 'POST',
        body: fd
      });
      const json = await res.json();
      if (json.success) {
        setSuccess('Layout added to library');
        setShowLibraryForm(false);
        setLibraryFormStep(0);
        setLibraryForm({ title:'', layout_type:'', bedrooms:'', bathrooms:'', area:'', price_range:'', description:'', image:null, design_file:null, technical_details: {} });
        fetchMyLibrary();
      } else {
        setError(json.message || 'Failed to add layout');
      }
    } catch (e) {
      setError('Error adding layout');
    }
  };

  const [editLayout, setEditLayout] = useState(null);

  // Library form navigation
  const nextLibraryStep = () => setLibraryFormStep(s => Math.min(s + 1, 1));
  const prevLibraryStep = () => setLibraryFormStep(s => Math.max(s - 1, 0));

  const openEditLayout = (item) => {
    setEditLayout({ ...item, image: null, design_file: null });
  };

  const closeEditLayout = () => setEditLayout(null);

  const saveEditLayout = async (e) => {
    e.preventDefault();
    if (!editLayout) return;
    const fd = new FormData();
    fd.append('id', editLayout.id);
    ['title','layout_type','bedrooms','bathrooms','area','price_range','description','status'].forEach(k=>{
      if (editLayout[k] !== undefined && editLayout[k] !== null && editLayout[k] !== '') fd.append(k, editLayout[k]);
    });
    if (editLayout.image) fd.append('image', editLayout.image);
    if (editLayout.design_file) fd.append('design_file', editLayout.design_file);
    try {
      const res = await fetch('/buildhub/backend/api/architect/update_layout_library_item.php', { method: 'POST', body: fd });
      const json = await res.json();
      if (json.success) {
        setSuccess('Layout updated');
        setEditLayout(null);
        fetchMyLibrary();
      } else {
        setError(json.message || 'Failed to update layout');
      }
    } catch (e) {
      setError('Error updating layout');
    }
  };

  const toggleLayoutStatus = async (item) => {
    const target = item.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch('/buildhub/backend/api/architect/update_layout_library_item.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, status: target })
      });
      const json = await res.json();
      if (json.success) {
        setLibraryLayouts(prev => prev.map(x => x.id === item.id ? { ...x, status: target } : x));
      } else {
        setError(json.message || 'Failed to change status');
      }
    } catch (e) {
      setError('Error changing status');
    }
  };

  // Preview modal for clear viewing of image and layout file
  const [previewItem, setPreviewItem] = useState(null);
  const openPreview = (item) => setPreviewItem(item);
  const closePreview = () => setPreviewItem(null);

  const isImageUrl = (url) => /\.(png|jpe?g|gif|webp|bmp)$/i.test(url || '');
  const isPdfUrl = (url) => /\.(pdf)$/i.test(url || '');

  const renderPreviewModal = () => {
    if (!previewItem) return null;
    const imgUrl = previewItem.image_url || null;
    const fileUrl = previewItem.design_file_url || null;
    const architectName = (user?.first_name || '') + ' ' + (user?.last_name || '');
    const architectEmail = user?.email || '';

    const canEmbed = fileUrl && (isImageUrl(fileUrl) || isPdfUrl(fileUrl));

    return (
      <div className="form-modal" onClick={closePreview}>
        <div className="form-content" style={{maxWidth:'90vw', width:'1100px'}} onClick={(e)=>e.stopPropagation()}>
          <div className="form-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <h3 style={{margin:0}}>{previewItem.title || 'Preview'}</h3>
              {previewItem.layout_type && <p style={{margin:'4px 0 0 0', color:'#64748b'}}>{previewItem.layout_type}</p>}
            </div>
            <button className="btn btn-secondary" onClick={closePreview}>Close</button>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'1.2fr .8fr', gap:'16px'}}>
            <div style={{border:'1px solid #e5e7eb', borderRadius:10, overflow:'hidden', background:'#000'}}>
              {canEmbed ? (
                isImageUrl(fileUrl) ? (
                  <img src={fileUrl} alt="Layout" style={{width:'100%', height:'80vh', objectFit:'contain', background:'#000'}}/>
                ) : (
                  <iframe src={fileUrl} title="Layout PDF" style={{width:'100%', height:'80vh', border:'none', background:'#fff'}}/>
                )
              ) : imgUrl ? (
                <img src={imgUrl} alt="Preview" style={{width:'100%', height:'80vh', objectFit:'contain'}}/>
              ) : (
                <div style={{padding:24}}>No preview available. You can download the layout file from the card.</div>
              )}
            </div>

            <div>
              {imgUrl && (
                <div style={{border:'1px solid #e5e7eb', borderRadius:10, overflow:'hidden', background:'#fff'}}>
                  <img src={imgUrl} alt="Preview" style={{width:'100%', height:260, objectFit:'cover'}}/>
                </div>
              )}
              <div className="drawer-section" style={{marginTop:16}}>
                <h4>Details</h4>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
                  <div><strong>Bedrooms:</strong> {previewItem.bedrooms ?? '-'}</div>
                  <div><strong>Bathrooms:</strong> {previewItem.bathrooms ?? '-'}</div>
                  <div><strong>Area:</strong> {previewItem.area ? `${previewItem.area} sq ft` : '-'}</div>
                  <div><strong>Price:</strong> {previewItem.price_range ?? '-'}</div>
                  <div><strong>Architect:</strong> {architectName.trim() || 'You'}</div>
                  <div><strong>Email:</strong> {architectEmail || '-'}</div>
                </div>
                {previewItem.description && <p style={{marginTop:10, whiteSpace:'pre-wrap'}}>{previewItem.description}</p>}
                {fileUrl && !canEmbed && (
                  <a className="btn btn-primary" href={fileUrl} target="_blank" rel="noreferrer" style={{marginTop:10, display:'inline-block'}}>Download Layout</a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render the preview modal at the root of component output

  const handleLogout = async () => {
    try { await fetch('/buildhub/backend/api/logout.php', { method: 'POST', credentials: 'include' }); } catch {}
    localStorage.removeItem('bh_user');
    sessionStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    // Only require files; backend will auto-route to the appropriate homeowner/request and default title
    if (uploadData.files.length === 0) {
      setError('Please select at least one file');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      if (uploadData.request_id) formData.append('request_id', uploadData.request_id);
      if (uploadData.homeowner_id) formData.append('homeowner_id', uploadData.homeowner_id);
      if (uploadData.design_title) formData.append('design_title', uploadData.design_title);
      if (uploadData.description) formData.append('description', uploadData.description);
      if (uploadData.technical_details && Object.keys(uploadData.technical_details).length > 0) {
        formData.append('technical_details', JSON.stringify(uploadData.technical_details));
      }
      
      // Handle multiple files
      for (let i = 0; i < uploadData.files.length; i++) {
        formData.append('design_files[]', uploadData.files[i]);
      }

      const response = await fetch('/buildhub/backend/api/architect/upload_design.php', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (result.success) {
        setSuccess('Design uploaded successfully!');
        setShowUploadForm(false);
        setUploadData({
          request_id: '',
          homeowner_id: '',
          design_title: '',
          description: '',
          technical_details: {},
          files: []
        });
        setUploadFormStep(0);
        fetchMyDesigns();
      } else {
        setError('Failed to upload design: ' + result.message);
      }
    } catch (error) {
      setError('Error uploading design');
    } finally {
      setLoading(false);
    }
  };

  const renderDashboard = () => (
    <div>
      {/* Main Header */}
      <div className="main-header">
        <div className="header-content">
          <div>
            <h1>Dashboard</h1>
            <p>Manage your architectural designs and connect with clients</p>
          </div>
          <div className="header-profile">
            <ArchitectProfileButton 
              user={user}
              position="bottom-right"
              onProfileClick={() => setActiveTab('profile')}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card w-purple">
          <div className="stat-content">
            <div className="stat-icon requests">📋</div>
            <div className="stat-info">
              <h3>{layoutRequests.length}</h3>
              <p>Available Requests</p>
            </div>
          </div>
        </div>
        <div className="stat-card w-blue">
          <div className="stat-content">
            <div className="stat-icon designs">🎨</div>
            <div className="stat-info">
              <h3>{myDesigns.length}</h3>
              <p>Designs Created</p>
            </div>
          </div>
        </div>
        <div className="stat-card w-green">
          <div className="stat-content">
            <div className="stat-icon approved">✅</div>
            <div className="stat-info">
              <h3>{myDesigns.filter(d => d.status === 'approved').length}</h3>
              <p>Approved Designs</p>
            </div>
          </div>
        </div>
        <div className="stat-card w-orange">
          <div className="stat-content">
            <div className="stat-icon progress">⏳</div>
            <div className="stat-info">
              <h3>{myDesigns.filter(d => d.status === 'in-progress').length}</h3>
              <p>In Progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section-card">
        <div className="section-header">
          <h2>Quick Actions</h2>
          <p>Get started with your architectural projects</p>
        </div>
        <div className="section-content">
          <div className="quick-actions float-grid stagger-children">
            <button 
              className="float-rect w-blue"
              onClick={() => navigate('/architect/upload')}
            >
              <div className="fr-icon">📐</div>
              <div className="fr-title">Upload New Design</div>
              <div className="fr-sub">Create and submit architectural designs for client requests</div>
            </button>
            <button 
              className="float-rect w-orange"
              onClick={() => setActiveTab('requests')}
            >
              <div className="fr-icon">👁️</div>
              <div className="fr-title">Browse Requests</div>
              <div className="fr-sub">View available client requests waiting for designs</div>
            </button>
            <button 
              className="float-rect w-purple"
              onClick={() => setActiveTab('designs')}
            >
              <div className="fr-icon">🎨</div>
              <div className="fr-title">My Portfolio</div>
              <div className="fr-sub">Manage your submitted designs and track their status</div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="section-card">
        <div className="section-header">
          <h2>Recent Activity</h2>
          <p>Latest updates on your designs and client requests</p>
        </div>
        <div className="section-content">
          <div className="item-list">
            {myDesigns.slice(0, 5).map(design => (
              <div key={design.id} className="list-item">
                <div className="item-icon">
                  {design.status === 'approved' ? '✅' : 
                   design.status === 'rejected' ? '❌' : '🎨'}
                </div>
                <div className="item-content">
                  <h4 className="item-title">{design.design_title}</h4>
                  <p className="item-subtitle">Client: {design.client_name}</p>
                  <p className="item-meta">Submitted: {new Date(design.created_at).toLocaleDateString()}</p>
                </div>
                <div className="item-actions" style={{display:'flex', alignItems:'center', gap:8}}>
                  <span className={`status-badge ${badgeClass(design.status)}`}>
                    {formatStatus(design.status)}
                  </span>
                  {design.status !== 'finalized' && (
                    <button className="btn btn-secondary" onClick={() => finalizeDesign(design.id)}>
                      Finalize
                    </button>
                  )}
                </div>
              </div>
            ))}
            {myDesigns.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🎨</div>
                <h3>No Designs Yet</h3>
                <p>Start by creating your first architectural design!</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowUploadForm(true)}
                >
                  Upload Design
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRequests = () => (
    <div>
      <div className="main-header">
        <div className="header-content">
          <div>
            <h1>Layout Requests</h1>
            <p>Client requests sent to you and open requests</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/architect/upload')}
          >
            + Upload Design
          </button>
        </div>
      </div>

      {/* Assigned to me */}
      <div className="section-header">
        <h2>Requests Assigned To Me</h2>
        <p>Homeowners selected you for these requests</p>
      </div>
      <AssignedRequests onCreateFromAssigned={(requestId) => { setUploadData({ ...uploadData, request_id: requestId }); setShowUploadForm(true); }} />

      {/* Open/available requests */}
      <div className="section-card">
        <div className="section-header">
          <h2>Available Requests</h2>
          <p>Create architectural designs for these client requests</p>
        </div>
        <div className="section-content">
          {loading ? (
            <div className="loading">Loading requests...</div>
          ) : layoutRequests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No Requests Available</h3>
              <p>Check back later for new client requests!</p>
            </div>
          ) : (
            <div className="item-list">
              {layoutRequests.map(request => (
                <RequestItem 
                  key={request.id} 
                  request={request} 
                  onCreateDesign={() => {
                    setUploadData({...uploadData, request_id: request.id});
                    setShowUploadForm(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderDesigns = () => (
    <div>
      <div className="main-header">
        <div className="header-content">
          <div>
            <h1>My Designs</h1>
            <p>Track your submitted architectural designs and their progress</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowUploadForm(true)}
          >
            + New Design
          </button>
        </div>
      </div>

      <div className="section-card">
        <div className="section-header">
          <h2>Design Portfolio</h2>
          <p>All your submitted architectural designs</p>
        </div>
        <div className="section-content">
          {myDesigns.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎨</div>
              <h3>No Designs Yet</h3>
              <p>Upload your first architectural design to get started!</p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowUploadForm(true)}
              >
                Upload Design
              </button>
            </div>
          ) : (
            <div className="item-grid">
              {myDesigns.map(design => (
                <div key={design.id} className="layout-card">
                  <div className="layout-card-content">
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <h4 className="layout-title">{design.design_title || 'Untitled Design'}</h4>
                      <span className={`badge ${badgeClass(design.status || 'proposed')}`}>{formatStatus(design.status || 'proposed')}</span>
                    </div>
                    {design.description && (<p className="layout-description">{design.description}</p>)}

                    <div className="homeowner-details">
                      <h4>Homeowner Details:</h4>
                      <p><strong>Name:</strong> {design.client_name || 'Not specified'}</p>
                      <p><strong>Email:</strong> {design.client_email || 'Not specified'}</p>
                    </div>

                    <div className="request-details" style={{marginTop:8}}>
                      <h4>Request Details:</h4>
                      <p><strong>Plot Size:</strong> {design.plot_size || '-'}</p>
                      <p><strong>Budget:</strong> {design.budget_range || '-'}</p>
                      {design.requirements && (() => {
                        const req = String(design.requirements || '').trim();
                        const looksJson = req.startsWith('{') && req.endsWith('}');
                        if (looksJson) {
                          return (
                            <div>
                              <strong>Requirements:</strong>
                              <div style={{ marginTop: 6 }}>
                                <NeatJsonCard raw={req} title="Requirements" />
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div>
                            <strong>Requirements:</strong>
                            <div style={{whiteSpace:'pre-wrap'}}>{design.requirements}</div>
                          </div>
                        );
                      })()}
                    </div>

                    {design.technical_details && (
                      <div className="technical-details-section" style={{marginTop:16}}>
                        <TechnicalDetailsDisplay technicalDetails={design.technical_details} />
                      </div>
                    )}

                    <div style={{display:'flex', gap:8, flexWrap:'wrap', margin:'6px 0'}}>
                      {Array.isArray(design.files) && design.files.length > 0 ? (
                        design.files.slice(0,3).map((f, idx) => (
                          (isImageUrl(f.path) || isPdfUrl(f.path)) ? (
                            <a key={idx} className="btn" href={f.path} target="_blank" rel="noreferrer">View File {idx+1}</a>
                          ) : (
                            <a key={idx} className="btn btn-link" href={f.path} target="_blank" rel="noreferrer">Download File {idx+1}</a>
                          )
                        ))
                      ) : (
                        <span className="muted">No files attached</span>
                      )}
                    </div>

                    <div className="review-section" style={{marginTop:8}}>
                      <h4>Review</h4>
                      {Array.isArray(archReviews) && archReviews.filter(rv => rv.design_id === design.id).length > 0 ? (
                        archReviews.filter(rv => rv.design_id === design.id).slice(0,1).map(rv => (
                          <div key={rv.id} className="review-item" style={{borderTop:'1px solid #eee', padding:'10px 0'}}>
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                              <div style={{fontWeight:600}}>{rv.author || 'Homeowner'}</div>
                              <div style={{color:'#f5a623'}}>{'★'.repeat(rv.rating)}{'☆'.repeat(5 - rv.rating)}</div>
                            </div>
                            <div className="muted" style={{fontSize:12, color:'#667085', marginTop:4}}>{new Date(rv.created_at).toLocaleString()}</div>
                            {rv.comment && <div style={{marginTop:6, whiteSpace:'pre-wrap'}}>{rv.comment}</div>}
                          </div>
                        ))
                      ) : (
                        <div className="muted">No review yet</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div style={{ padding: '20px' }}>
      {profileLoading ? (
        <div className="loading" style={{ textAlign: 'center', padding: '40px' }}>
          Loading profile…
        </div>
      ) : (
        <StylishProfile
          user={user}
          profile={profile}
          setProfile={setProfile}
          onSave={saveMyProfile}
          onReset={fetchMyProfile}
          loading={profileLoading}
          saving={profileSaving}
          reviews={archReviews}
          reviewCount={profile.review_count || 0}
          avgRating={profile.avg_rating || 0}
          onUserUpdate={(updatedUser) => setUser(updatedUser)}
        />
      )}
    </div>
  );

  const renderLibrary = () => (
    <div>
      <div className="main-header">
        <div className="header-content">
          <div>
            <h1>My Layout Library</h1>
            <p>Create layouts with preview images for homeowners to browse</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowLibraryForm(true)}>+ Add Layout</button>
        </div>
      </div>

      <div className="section-card">
        <div className="section-header">
          <h2>Library Items</h2>
          <p>Your published layouts</p>
        </div>
        <div className="section-content">
          {libraryLayouts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>No Layouts Yet</h3>
              <p>Add your first layout to the library so homeowners can request customizations</p>
              <button className="btn btn-primary" onClick={() => setShowLibraryForm(true)}>Add Layout</button>
            </div>
          ) : (
            <div className="item-grid">
              {libraryLayouts.map(item => (
                <div key={item.id} className="layout-card">
                  <button className="layout-image-container" onClick={()=>openPreview(item)} style={{cursor:'zoom-in'}}>
                    <img src={item.image_url || '/images/default-layout.jpg'} alt={item.title} className="layout-card-image"/>
                  </button>
                  <div className="layout-card-content">
                    <h4 className="layout-title">{item.title}</h4>
                    <p className="layout-type">{item.layout_type}</p>
                    <div className="layout-specs">
                      <span className="spec">🛏️ {item.bedrooms} BR</span>
                      <span className="spec">🚿 {item.bathrooms} BA</span>
                      <span className="spec">📐 {item.area} sq ft</span>
                    </div>
                    {item.description && (<p className="layout-description">{item.description}</p>)}
                    {item.price_range && (<div className="layout-price"><span className="price-range">₹{item.price_range}</span></div>)}
                    <div style={{display:'flex', gap:8, flexWrap:'wrap', margin:'6px 0'}}>
                      {item.image_url && (
                        <button className="btn btn-secondary" onClick={()=>openPreview(item)}>View Preview</button>
                      )}
                      {item.design_file_url && (
                        isImageUrl(item.design_file_url) || isPdfUrl(item.design_file_url) ? (
                          <button className="btn" onClick={()=>openPreview(item)}>View Layout</button>
                        ) : (
                          <a className="btn btn-link" href={item.design_file_url} target="_blank" rel="noreferrer">Download Layout</a>
                        )
                      )}
                    </div>
                    <div style={{display:'flex', gap:8, flexWrap:'wrap', margin:'6px 0'}}>
                      <button className="btn btn-secondary" onClick={()=>openEditLayout(item)}>Edit</button>
                      <button
                        className={`btn ${item.status === 'active' ? 'btn-danger' : 'btn-success'}`}
                        onClick={()=>toggleLayoutStatus(item)}
                      >
                        {item.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showLibraryForm && (
        <div className="form-modal">
          <div className="form-content" style={{maxWidth:'920px'}}>
            <div className="form-header">
              <h3>Add Layout</h3>
              <p>Publish a new layout to the library</p>
              <div className="step-indicator" style={{marginTop: 10, display: 'flex', gap: 10}}>
                <span className={`step ${libraryFormStep === 0 ? 'active' : ''}`}>Basic Info</span>
                <span className={`step ${libraryFormStep === 1 ? 'active' : ''}`}>Technical Details</span>
              </div>
            </div>
            <form onSubmit={submitNewLibraryItem}>
              {libraryFormStep === 0 && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Title</label>
                      <input type="text" value={libraryForm.title} onChange={(e)=>setLibraryForm({...libraryForm, title:e.target.value})}/>
                    </div>
                    <div className="form-group">
                      <label>Type</label>
                      <input type="text" value={libraryForm.layout_type} onChange={(e)=>setLibraryForm({...libraryForm, layout_type:e.target.value})}/>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Bedrooms</label>
                      <input type="number" value={libraryForm.bedrooms} onChange={(e)=>setLibraryForm({...libraryForm, bedrooms:e.target.value})}/>
                    </div>
                    <div className="form-group">
                      <label>Bathrooms</label>
                      <input type="number" value={libraryForm.bathrooms} onChange={(e)=>setLibraryForm({...libraryForm, bathrooms:e.target.value})}/>
                    </div>
                    <div className="form-group">
                      <label>Area (sq ft)</label>
                      <input type="number" value={libraryForm.area} onChange={(e)=>setLibraryForm({...libraryForm, area:e.target.value})}/>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Price Range</label>
                      <input type="text" value={libraryForm.price_range} onChange={(e)=>setLibraryForm({...libraryForm, price_range:e.target.value})} placeholder="e.g., 20-30 Lakhs"/>
                    </div>
                    <div className="form-group">
                      <label>Preview Image</label>
                      <input type="file" accept="image/*" onChange={(e)=>setLibraryForm({...libraryForm, image:e.target.files?.[0] || null})}/>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Layout Design File</label>
                      <input type="file" onChange={(e)=>setLibraryForm({...libraryForm, design_file:e.target.files?.[0] || null})}/>
                    </div>
                    <div className="form-group" style={{flex:1}}>
                      {libraryForm.image && (
                        <div style={{border:'1px solid #eee', padding:8, borderRadius:8}}>
                          <p style={{margin:'0 0 6px'}}>Image Preview</p>
                          <img src={URL.createObjectURL(libraryForm.image)} alt="Preview" style={{maxWidth:'100%', borderRadius:6}}/>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea rows="4" value={libraryForm.description} onChange={(e)=>setLibraryForm({...libraryForm, description:e.target.value})}></textarea>
                  </div>
                </>
              )}
              
              {libraryFormStep === 1 && (
                <div className="technical-details-section">
                  <TechnicalDetailsForm 
                    data={libraryForm} 
                    setData={setLibraryForm} 
                    onNext={submitNewLibraryItem} 
                    onPrev={prevLibraryStep} 
                  />
                </div>
              )}
              
              <div className="form-actions">
                {libraryFormStep === 0 ? (
                  <>
                    <button type="button" className="btn btn-secondary" onClick={()=>setShowLibraryForm(false)}>Cancel</button>
                    <button type="button" className="btn btn-primary" onClick={nextLibraryStep}>Next: Technical Details</button>
                  </>
                ) : (
                  <>
                    <button type="button" className="btn btn-secondary" onClick={prevLibraryStep}>Back</button>
                    <button type="submit" className="btn btn-primary">Add Layout</button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {editLayout && (
        <div className="form-modal">
          <div className="form-content" style={{maxWidth:'920px'}}>
            <div className="form-header">
              <h3>Edit Layout</h3>
              <p>Update your library item</p>
            </div>
            <form onSubmit={saveEditLayout}>
              <div className="form-row">
                <div className="form-group">
                  <label>Title *</label>
                  <input type="text" value={editLayout.title} onChange={(e)=>setEditLayout({...editLayout, title:e.target.value})} required/>
                </div>
                <div className="form-group">
                  <label>Type *</label>
                  <input type="text" value={editLayout.layout_type} onChange={(e)=>setEditLayout({...editLayout, layout_type:e.target.value})} required/>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Bedrooms *</label>
                  <input type="number" value={editLayout.bedrooms} onChange={(e)=>setEditLayout({...editLayout, bedrooms:e.target.value})} required/>
                </div>
                <div className="form-group">
                  <label>Bathrooms *</label>
                  <input type="number" value={editLayout.bathrooms} onChange={(e)=>setEditLayout({...editLayout, bathrooms:e.target.value})} required/>
                </div>
                <div className="form-group">
                  <label>Area (sq ft) *</label>
                  <input type="number" value={editLayout.area} onChange={(e)=>setEditLayout({...editLayout, area:e.target.value})} required/>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price Range</label>
                  <input type="text" value={editLayout.price_range || ''} onChange={(e)=>setEditLayout({...editLayout, price_range:e.target.value})} placeholder="e.g., 20-30 Lakhs"/>
                </div>
                <div className="form-group">
                  <label>Replace Image</label>
                  <input type="file" accept="image/*" onChange={(e)=>setEditLayout({...editLayout, image:e.target.files?.[0] || null})}/>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Replace Layout Design File</label>
                  <input type="file" onChange={(e)=>setEditLayout({...editLayout, design_file:e.target.files?.[0] || null})}/>
                </div>
                <div className="form-group" style={{flex:1}}>
                  {editLayout.image && (
                    <div style={{border:'1px solid #eee', padding:8, borderRadius:8}}>
                      <p style={{margin:'0 0 6px'}}>New Image Preview</p>
                      <img src={URL.createObjectURL(editLayout.image)} alt="Preview" style={{maxWidth:'100%', borderRadius:6}}/>
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="4" value={editLayout.description || ''} onChange={(e)=>setEditLayout({...editLayout, description:e.target.value})}></textarea>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select value={editLayout.status} onChange={(e)=>setEditLayout({...editLayout, status: e.target.value})}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={closeEditLayout}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div className={`dashboard-sidebar soft-sidebar expanded ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header sb-brand">
          <a href="#" className="sidebar-logo">
            <div className="logo-icon">🏠</div>
            <span className="logo-text sb-title">BUILDHUB</span>
          </a>
        </div>

        <nav className="sidebar-nav sb-nav">
          <a 
            href="#" 
            className={`nav-item sb-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}
          >
            <span className="nav-icon sb-icon">📊</span>
            Dashboard
          </a>
          <a 
            href="#" 
            className={`nav-item sb-item ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveTab('requests'); }}
          >
            <span className="nav-icon sb-icon">📋</span>
            Layout Requests
          </a>
          <a 
            href="#" 
            className={`nav-item sb-item ${activeTab === 'designs' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveTab('designs'); }}
          >
            <span className="nav-icon sb-icon">🎨</span>
            My Designs
          </a>
          <a 
            href="#" 
            className={`nav-item sb-item ${activeTab === 'library' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveTab('library'); }}
          >
            <span className="nav-icon sb-icon">📚</span>
            My Layout Library
          </a>

        </nav>

        <div className="sidebar-footer sb-footer" style={{padding:'12px'}}>
          <div style={{position:'relative'}}>

            {showSidebarProfileMenu && (
              <div className="profile-dropdown open" style={{position:'absolute', bottom:'52px', left:0, right:0, zIndex: 1000}}>
                <div className="dropdown-header">My Account</div>
                <button type="button" className="dropdown-item" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>

          <div className="sidebar-version" style={{marginTop:10}}>v1.0.0</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main soft-main shifted">
        {error && (
          <div className="alert alert-error">
            {error}
            <button onClick={() => setError('')} className="alert-close">×</button>
          </div>
        )}
        
        {success && (
          <div className="alert alert-success">
            {success}
            <button onClick={() => setSuccess('')} className="alert-close">×</button>
          </div>
        )}

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'requests' && renderRequests()}
        {activeTab === 'designs' && renderDesigns()}
        {activeTab === 'library' && renderLibrary()}
        {activeTab === 'profile' && renderProfile()}

        {/* Upload Form Modal */}
        {showUploadForm && (
          <div className="form-modal">
            <div className="form-content">
              <div className="form-header">
                <h3>Upload Design</h3>
                <p>Submit your architectural design for a client request</p>
              </div>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {renderPreviewModal()}

        {/* Upload Form Modal */}
        {showUploadForm && (
          <div className="form-modal">
            <div className="form-content" style={{maxWidth: '1200px', width: '90vw'}}>
              <div className="form-header">
                <h3>Create Design</h3>
                <p>Submit your architectural design with comprehensive technical details</p>
                <div className="upload-steps">
                  <div className={`step ${uploadFormStep >= 0 ? 'active' : ''}`}>1. Basic Info</div>
                  <div className={`step ${uploadFormStep >= 1 ? 'active' : ''}`}>2. Technical Details</div>
                  <div className={`step ${uploadFormStep >= 2 ? 'active' : ''}`}>3. Files & Submit</div>
                </div>
              </div>
              
              {/* Step 1: Basic Information */}
              {uploadFormStep === 0 && (
                <div className="upload-step">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Send To</label>
                      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
                        <div>
                          <label style={{fontSize:'0.85rem'}}>By Request (optional)</label>
                          <select
                            value={uploadData.request_id}
                            onChange={(e) => setUploadData({...uploadData, request_id: e.target.value})}
                          >
                            <option value="">Choose a client request</option>
                            {layoutRequests.map(request => (
                              <option key={request.id} value={request.id}>
                                {request.client_name} - {request.plot_size} sq ft ({request.budget_range})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label style={{fontSize:'0.85rem'}}>Direct Homeowner ID (optional)</label>
                          <input
                            type="number"
                            value={uploadData.homeowner_id}
                            onChange={(e) => setUploadData({...uploadData, homeowner_id: e.target.value})}
                            placeholder="e.g., 123"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Design Title *</label>
                      <input
                        type="text"
                        value={uploadData.design_title}
                        onChange={(e) => setUploadData({...uploadData, design_title: e.target.value})}
                        placeholder="e.g., Modern 3BHK Villa Design"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={uploadData.description}
                      onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                      placeholder="Describe your design features, materials, and special considerations..."
                      rows="4"
                    />
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button" 
                      onClick={() => setShowUploadForm(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setUploadFormStep(1)}
                      className="btn btn-primary"
                      disabled={!uploadData.design_title}
                    >
                      Next: Technical Details
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Technical Details */}
              {uploadFormStep === 1 && (
                <div className="upload-step">
                  <TechnicalDetailsForm 
                    data={uploadData} 
                    setData={setUploadData} 
                    onNext={() => setUploadFormStep(2)} 
                    onPrev={() => setUploadFormStep(0)} 
                  />
                </div>
              )}

              {/* Step 3: Files and Submit */}
              {uploadFormStep === 2 && (
                <div className="upload-step">
                  <div className="form-group">
                    <label>Design Files *</label>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.svg,.heic,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.rtf,.dwg,.dxf,.ifc,.rvt,.skp,.3dm,.obj,.stl,.zip,.rar,.7z,.mp4,.mov,.avi,.m4v"
                      onChange={(e) => setUploadData({...uploadData, files: Array.from(e.target.files)})}
                      required
                    />
                    <p className="form-help">Select multiple files (images, PDFs, docs, CAD/3D, archives, videos)</p>
                  </div>

                  {/* Review Section */}
                  <div className="review-section">
                    <h4>Review Your Submission</h4>
                    <div className="review-grid">
                      <div className="review-item">
                        <div className="review-label">Design Title</div>
                        <div className="review-value">{uploadData.design_title || 'Not provided'}</div>
                      </div>
                      <div className="review-item">
                        <div className="review-label">Description</div>
                        <div className="review-value">{uploadData.description || 'No description'}</div>
                      </div>
                      {uploadData.technical_details?.floor_plans?.layout_description && (
                        <div className="review-item">
                          <div className="review-label">Floor Plan Layout</div>
                          <div className="review-value">{uploadData.technical_details.floor_plans.layout_description}</div>
                        </div>
                      )}
                      <div className="review-item">
                        <div className="review-label">Files</div>
                        <div className="review-value">{uploadData.files.length} file(s) selected</div>
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button" 
                      onClick={() => setUploadFormStep(1)}
                      className="btn btn-secondary"
                    >
                      Back
                    </button>
                    <button 
                      type="button" 
                      onClick={handleUploadSubmit}
                      disabled={loading || uploadData.files.length === 0}
                      className="btn btn-primary"
                    >
                      {loading ? 'Uploading...' : 'Upload Design'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Assigned Requests Component
const AssignedRequests = ({ onCreateFromAssigned }) => {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  // Helpers: parse/normalize requirements into structured fields
  const normalizeRequirements = (reqText, reqParsed) => {
    // Prefer parsed JSON if valid
    const src = (reqParsed && typeof reqParsed === 'object') ? reqParsed : {};
    // Try to detect key info from text as best-effort
    const text = (reqText || '').toString();
    const pick = (k) => src[k] ?? null;
    const extract = (label) => {
      const m = text.match(new RegExp(label + ":\\s*([^\\n]+)", 'i'));
      return m ? m[1].trim() : null;
    };
    return {
      rooms: pick('rooms') ?? extract('rooms') ?? extract('bedrooms') ?? null,
      family_needs: pick('family_needs') ?? extract('family needs') ?? null,
      style: pick('preferred_style') ?? pick('style') ?? pick('aesthetic') ?? extract('style') ?? null,
      plot_shape: pick('plot_shape') ?? extract('plot shape') ?? null,
      topography: pick('topography') ?? extract('topography') ?? null,
      development_laws: pick('development_laws') ?? extract('development laws') ?? null,
      notes: pick('notes') ?? null,
      raw: text.trim()
    };
  };

  const toClipboard = async (str) => {
    try { await navigator.clipboard.writeText(str); } catch {}
  };

  const downloadText = (filename, content) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/buildhub/backend/api/architect/get_assigned_requests.php');
      const data = await res.json();
      if (data.success) {
        // Filter out requests with 'declined' status
        const filteredAssignments = data.assignments.filter(assignment => 
          assignment.assignment_status !== 'declined'
        );
        setItems(filteredAssignments || []);
      } else {
        setError(data.message || 'Failed to load assigned requests');
      }
    } catch (e) {
      setError('Error loading assigned requests');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { load(); }, []);

  const respond = async (assignment_id, action) => {
    try {
      const res = await fetch('/buildhub/backend/api/architect/respond_assignment.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignment_id, action })
      });
      const data = await res.json().catch(() => ({}));
      await load();
      return data && data.success ? (data.status || null) : null;
    } catch {
      return null;
    }
  };

  return (
    <div className="section-content">
      {loading ? (
        <div className="loading">Loading assigned requests...</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📬</div>
          <h3>No Assigned Requests</h3>
          <p>Homeowners haven’t assigned requests to you yet.</p>
          <button className="btn btn-secondary" onClick={load}>Refresh</button>
        </div>
      ) : (
        <div className="item-list">
          {items.map(a => (
            <div key={a.assignment_id} className="list-item">
              <div className="item-icon">📌</div>
              <div className="item-content">
                <h4 className="item-title">Request #{a.layout_request.id} • {a.layout_request.plot_size} sq ft</h4>
                <p className="item-subtitle">Budget: {a.layout_request.budget_range} • From: {a.homeowner.name}</p>
                <p className="item-meta">Assigned: {new Date(a.assigned_at).toLocaleDateString()} • Status: {a.assignment_status}</p>
                {a.message && <p className="item-description">Message: {a.message}</p>}

                {/* Interactive requirement details */}
                {(() => {
                  const R = normalizeRequirements(a.layout_request.requirements, a.layout_request.requirements_parsed);
                  const chips = [
                    R.rooms ? { label: 'Rooms', value: R.rooms } : null,
                    R.family_needs ? { label: 'Family needs', value: R.family_needs } : null,
                    (a.layout_request.preferred_style || R.style) ? { label: 'Style', value: a.layout_request.preferred_style || R.style } : null,
                  ].filter(Boolean);
                  return (
                    <div className="details-card">
                      <div className="details-header">
                        <strong>Requirements</strong>
                      </div>
                      <div className="details-grid">
                        <div>
                          <h5>Site & Budget</h5>
                          <div className="chips">
                            <span className="chip"><strong>Plot:</strong> {a.layout_request.plot_size || '—'}</span>
                            <span className="chip"><strong>Budget:</strong> {a.layout_request.budget_range || '—'}</span>
                            <span className="chip"><strong>Location:</strong> {a.layout_request.location || '—'}</span>
                            <span className="chip"><strong>Timeline:</strong> {a.layout_request.timeline || '—'}</span>
                            {R.plot_shape && <span className="chip"><strong>Plot shape:</strong> {R.plot_shape}</span>}
                            {R.topography && <span className="chip"><strong>Topography:</strong> {R.topography}</span>}
                            {R.development_laws && <span className="chip"><strong>Dev. laws:</strong> {R.development_laws}</span>}
                          </div>
                        </div>
                        <div>
                          <h5>Preferences</h5>
                          <div className="chips">
                            {(a.layout_request.layout_type || 'custom') && (
                              <span className="chip"><strong>Type:</strong> {a.layout_request.layout_type || 'custom'}</span>
                            )}
                            {chips.map((c, idx) => (
                              <span key={idx} className="chip"><strong>{c.label}:</strong> {c.value}</span>
                            ))}
                            {R.style && (
                              <span className="chip"><strong>Style:</strong> {R.style}</span>
                            )}
                            {a.layout_request.library?.title && (
                              <span className="chip"><strong>Library:</strong> {a.layout_request.library.title}</span>
                            )}
                          </div>
                        </div>
                        <div className="span-2">
                          <h5>Notes</h5>
                          <p className="item-description">{R.notes || (R.raw ? null : a.layout_request.requirements) || '—'}</p>
                          {!R.notes && R.raw && (
                            <div className="muted" style={{fontSize:12}}>Original notes available in raw request.</div>
                          )}
                          {a.layout_request.library?.image_url && (
                            <div className="preview-row">
                              <img src={a.layout_request.library.image_url} alt="Selected layout" className="preview-image" />
                            </div>
                          )}
                          {/* Show file link for the selected library layout so architect can view/download */}
                          {a.layout_request.library?.file_url && (
                            <div className="preview-row" style={{marginTop:8, display:'flex', gap:8}}>
                              <a className="btn btn-secondary" href={a.layout_request.library.file_url} target="_blank" rel="noopener noreferrer">
                                View Layout File
                              </a>
                              <a className="btn" href={a.layout_request.library.file_url} download>
                                Download
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
              <div className="item-actions">
                <button className="btn btn-secondary" onClick={load}>Refresh</button>
                {a.assignment_status === 'sent' && (
                  <>
                    <button className="btn btn-success" onClick={() => respond(a.assignment_id, 'accept')}>Accept</button>
                    <button className="btn btn-danger" onClick={() => respond(a.assignment_id, 'reject')}>Reject</button>
                  </>
                )}
                <div style={{display:'flex', gap:8}}>
                  <button
                    className="btn btn-primary"
                    disabled={a.assignment_status !== 'accepted'}
                    title={a.assignment_status !== 'accepted' ? 'Accept the request to create a design' : undefined}
                    onClick={() => onCreateFromAssigned?.(a.layout_request.id)}
                  >
                    Create Design
                  </button>
                  <button className="btn btn-secondary" onClick={() => {
                    respond(a.assignment_id, 'reject');
                  }}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Request Item Component
const RequestItem = ({ request, onCreateDesign }) => (
  <div className="list-item">
    <div className="item-icon">📋</div>
    <div className="item-content">
      <h4 className="item-title">{request.client_name} - {request.plot_size} sq ft</h4>
      <p className="item-subtitle">Budget: {request.budget_range}</p>
      <p className="item-meta">
        Location: {request.location || 'Not specified'} • 
        Submitted: {new Date(request.created_at).toLocaleString()}
      </p>
      <NeatJsonCard raw={request.requirements} title="Requirements" />
    </div>
    <div className="item-actions">
      <button className="btn btn-primary" onClick={onCreateDesign}>
        Create Design
      </button>
    </div>
  </div>
);

// Design Item Component
const DesignItem = ({ design, user }) => (
  <div className="list-item">
    <div className="item-icon">
      {design.status === 'approved' ? '✅' : 
       design.status === 'rejected' ? '❌' : '🎨'}
    </div>
    <div className="item-content">
      <h4 className="item-title">{design.design_title}</h4>
      <p className="item-subtitle">Client: {design.client_name}</p>
      <p className="item-meta">
        Plot Size: {design.plot_size} sq ft • Budget: {design.budget_range}
      </p>
      <p className="item-meta">
        Submitted: {new Date(design.created_at).toLocaleDateString()}
      </p>
      <div className="details-panel" style={{ marginTop:8, padding:10, border:'1px solid #e5e7eb', borderRadius:8, background:'#fafafa' }}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
          <div><strong>Architect:</strong> {(user?.first_name || '') + ' ' + (user?.last_name || '')}</div>
          <div><strong>Email:</strong> {user?.email || '-'}</div>
          {design.layout_request_id ? (
            <div><strong>Request ID:</strong> {design.layout_request_id}</div>
          ) : (
            <div><strong>Request:</strong> Direct upload</div>
          )}
          <div><strong>Status:</strong> {design.status}</div>
        </div>
      </div>
      {design.description && (
        <div style={{marginTop:8}}>
          <NeatJsonCard raw={design.description} title="Description" />
        </div>
      )}
    </div>
    <div className="item-actions" style={{display:'flex', alignItems:'center', gap:8}}>
      <span className={`status-badge ${badgeClass(design.status)}`}>
        {formatStatus(design.status)}
      </span>
      {design.status !== 'finalized' && (
        <button className="btn btn-secondary" onClick={() => finalizeDesign(design.id)}>
          Finalize
        </button>
      )}
      <button className="btn btn-secondary">
        View Files
      </button>
    </div>
  </div>
);

export default ArchitectDashboard;