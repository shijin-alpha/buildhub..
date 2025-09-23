import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomeownerDashboard.css';
import '../styles/BlueGlassTheme.css';
import '../styles/SoftSidebar.css';
import '../styles/Widgets.css';
import '../styles/ReviewSection.css';
import './WidgetColors.css';
import SearchableDropdown from './SearchableDropdown';
import { indianCities } from '../data/indianCities';
import { badgeClass, formatStatus } from '../utils/status';
import { ProjectProgressChart, ProjectTimeline, BudgetTracker } from './widgets/ProjectTrackingWidgets';
import NotificationSystem from './widgets/NotificationSystem';
import DesignGallery from './widgets/DesignGallery';
import NeatJsonCard from './NeatJsonCard';
import TechnicalDetailsDisplay from './TechnicalDetailsDisplay';

const HomeownerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [requestsTab, setRequestsTab] = useState('all'); // 'all' or 'contractors'
  const [receivedDesigns, setReceivedDesigns] = useState([]);
  const [comments, setComments] = useState({}); // designId -> list
  const [commentDrafts, setCommentDrafts] = useState({}); // designId -> text
  const [commentRatings, setCommentRatings] = useState({}); // designId -> 1..5
  const [user, setUser] = useState(null);
  const [layoutRequests, setLayoutRequests] = useState([]);
  const [contractorRequests, setContractorRequests] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [layoutLibrary, setLayoutLibrary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [selectedLibraryLayout, setSelectedLibraryLayout] = useState(null);
  // Request form data state used for customization and submissions
  const [requestData, setRequestData] = useState({
    plot_size: '',
    budget_range: '',
    plot_shape: '',
    num_floors: '',
    topography: '',
    development_laws: '',
    family_needs: '',
    rooms: '',
    aesthetic: '',
    location: '',
    timeline: '',
    requirements: '',
    selected_layout_id: null,
    layout_type: 'custom'
  });
  const [previewLayout, setPreviewLayout] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDesignDetails, setShowDesignDetails] = useState({}); // designId -> boolean
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showArchitectModal, setShowArchitectModal] = useState(false);
  const [sidebarProfileOpen, setSidebarProfileOpen] = useState(false);

  // Architect assignment state
  const [architects, setArchitects] = useState([]);
  const [archLoading, setArchLoading] = useState(false);
  const [archError, setArchError] = useState('');
  const [archSearch, setArchSearch] = useState('');
  const [archSpec, setArchSpec] = useState('');
  const [archMinExp, setArchMinExp] = useState('');
  const [archStepDone, setArchStepDone] = useState(false);
  const [selectedRequestForAssign, setSelectedRequestForAssign] = useState(null);
  const [selectedArchitectId, setSelectedArchitectId] = useState([]);
  const [assignMessage, setAssignMessage] = useState('');

  // Support / Help modal state
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportForm, setSupportForm] = useState({ subject: '', category: 'general', message: '' });
  const [supportLoading, setSupportLoading] = useState(false);
  const [supportIssues, setSupportIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [issueReplies, setIssueReplies] = useState([]);
  const [showReportsList, setShowReportsList] = useState(false);

  // Add Layout modal state
  const [showAddLayoutModal, setShowAddLayoutModal] = useState(false);
  const [addLayoutForm, setAddLayoutForm] = useState({ title: '', layoutType: '', bedrooms: '', bathrooms: '', area: '', priceRange: '', description: '', previewImage: null, layoutFile: null });

  // 3D computed plan from finalized design (fallback to placeholder)
  const [computed3DRooms, setComputed3DRooms] = useState([]);
  const [computed3DWalls, setComputed3DWalls] = useState([]);

  // Image/File viewer state
  const [viewer, setViewer] = useState({ open: false, src: '', title: '' });

  // Contractor selection state
  const [showContractorModal, setShowContractorModal] = useState(false);
  const [contractors, setContractors] = useState([]);
  const [contractorLoading, setContractorLoading] = useState(false);
  const [contractorError, setContractorError] = useState('');
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [contractorMessage, setContractorMessage] = useState('');
  const [sendingToContractor, setSendingToContractor] = useState(false);
  const [sourceDesignForContractor, setSourceDesignForContractor] = useState(null); // when opened from Received Designs

  // Technical details modal state
  const [technicalDetailsModal, setTechnicalDetailsModal] = useState(null);

  // Profile dropdown outside-click handler (top header)
  const profileRef = useRef(null);
  const sidebarProfileRef = useRef(null);
  useEffect(() => {
    const onDocClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
      if (sidebarProfileRef.current && !sidebarProfileRef.current.contains(e.target)) {
        setSidebarProfileOpen(false);
      }
    };
    const onKey = (e) => { if (e.key === 'Escape') { setProfileMenuOpen(false); setSidebarProfileOpen(false); } };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDocClick); document.removeEventListener('keydown', onKey); };
  }, []);

  useEffect(() => {
    // Get user data from session
    const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
    setUser(userData);

    import('../utils/session').then(({ preventCache, verifyServerSession }) => {
      preventCache();
      (async () => {
        const serverAuth = await verifyServerSession();
        if (!userData.id || userData.role !== 'homeowner' || !serverAuth) {
          sessionStorage.removeItem('user');
          localStorage.removeItem('bh_user');
          navigate('/login', { replace: true });
          return;
        }
        // Only load data when tabs are actually clicked
      })();
    });
  }, []);

  // Support helpers
  const loadSupportIssues = async () => {
    try {
      const res = await fetch('/buildhub/backend/api/support/get_issues.php', { credentials: 'include' });
      const json = await res.json();
      if (json.success) {
        setSupportIssues(json.issues || []);
      }
    } catch {}
  };

  const openIssueThread = async (issueId) => {
    try {
      const res = await fetch(`/buildhub/backend/api/support/get_issues.php?issue_id=${issueId}`, { credentials: 'include' });
      const json = await res.json();
      if (json.success) {
        setSelectedIssue(json.issue);
        setIssueReplies(json.replies || []);
      }
    } catch {}
  };

  const submitSupportIssue = async () => {
    if (!supportForm.subject.trim() || !supportForm.message.trim()) return;
    setSupportLoading(true);
    try {
      const res = await fetch('/buildhub/backend/api/support/create_issue.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(supportForm)
      });
      const json = await res.json();
      if (json.success) {
        setSupportForm({ subject: '', category: 'general', message: '' });
        setSuccess('Issue reported to admin');
        await loadSupportIssues();
        if (json.issue_id) {
          await openIssueThread(json.issue_id);
        } else {
          // If no id returned, default to list view
          setSelectedIssue(null);
        }
      } else {
        setError(json.message || 'Failed to submit issue');
      }
    } catch {
      setError('Network error submitting issue');
    } finally {
      setSupportLoading(false);
    }
  };

  const handleLogout = async () => {
    try { await fetch('/buildhub/backend/api/logout.php', { method: 'POST', credentials: 'include' }); } catch {}
    localStorage.removeItem('bh_user');
    sessionStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  const fetchMyRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch('/buildhub/backend/api/homeowner/get_my_requests.php');
      const result = await response.json();
      if (result.success) {
        const reqs = Array.isArray(result.requests) ? result.requests : [];
        setLayoutRequests(reqs.filter(r => r.status !== 'deleted'));
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyProjects = async () => {
    try {
      const response = await fetch('/buildhub/backend/api/homeowner/get_my_projects.php');
      const result = await response.json();
      if (result.success) {
        setMyProjects(result.projects || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchContractorRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/buildhub/backend/api/homeowner/get_contractor_requests.php');
      const result = await response.json();
      if (result.success) {
        const reqs = Array.isArray(result.requests) ? result.requests : [];
        setContractorRequests(reqs);
      }
    } catch (error) {
      console.error('Error fetching contractor requests:', error);
    } finally {
      setLoading(false);
    }
  };

  // Persistently remove a request (soft-delete via backend)
  const removeRequest = async (requestId) => {
    if (!requestId) return;
    try {
      const res = await fetch('/buildhub/backend/api/homeowner/delete_request.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layout_request_id: requestId })
      });
      const json = await res.json();
      if (json.success) {
        setLayoutRequests(prev => prev.filter(r => r.id !== requestId));
        setContractorRequests(prev => prev.filter(r => r.id !== requestId));
        setSuccess('Request removed');
      } else {
        setError(json.message || 'Failed to remove request');
      }
    } catch (e) {
      setError('Error removing request');
    }
  };

  const fetchLayoutLibrary = async () => {
    try {
      const response = await fetch('/buildhub/backend/api/homeowner/get_layout_library.php');
      const result = await response.json();
      if (result.success) {
        setLayoutLibrary(result.layouts || []);
      }
    } catch (error) {
      console.error('Error fetching layout library:', error);
    }
  };

  const handleAddLayout = async (e) => {
    e.preventDefault();
    // Placeholder: send to backend
    // For now, just close modal
    setShowAddLayoutModal(false);
    setAddLayoutForm({ title: '', layoutType: '', bedrooms: '', bathrooms: '', area: '', priceRange: '', description: '', previewImage: null, layoutFile: null });
    setSuccess('Layout added to library (placeholder)');
  };

  const fetchReceivedDesigns = async () => {
    try {
      const response = await fetch('/buildhub/backend/api/homeowner/get_received_designs.php', {
        credentials: 'include'
      });
      const result = await response.json();
      if (result.success) {
        const designs = result.designs || [];
        setReceivedDesigns(designs);
        const finalized = designs.find(d => d.status === 'finalized');
        if (finalized) {
          hydrate3DFromDesign(finalized);
        } else {
          setComputed3DRooms(defaultRooms());
          setComputed3DWalls(defaultWalls());
        }
      }
    } catch (e) {
      console.error('Error fetching designs:', e);
    }
  };

  // Helpers for file type checks used in library previews
  const isImageUrl = (url) => /\.(png|jpe?g|gif|webp|bmp|svg|heic)$/i.test(url || '');
  const isPdfUrl = (url) => /\.(pdf)$/i.test(url || '');

  const handleDeleteDesign = async (designId) => {
    if (!designId) return;
    try {
      const res = await fetch('/buildhub/backend/api/homeowner/delete_design.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ design_id: designId })
      });
      const json = await res.json();
      if (json.success) {
        setReceivedDesigns(prev => prev.filter(d => d.id !== designId));
        setSuccess('Design deleted successfully');
      } else {
        setError(json.message || 'Failed to delete design');
      }
    } catch (e) {
      setError('Error deleting design');
    }
  };

  const updateSelection = async (designId, action) => {
    try {
      const res = await fetch('/buildhub/backend/api/homeowner/update_design_selection.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ design_id: designId, action })
      });
      const json = await res.json();
      if (json.success) {
        setSuccess(action === 'finalize' ? 'Design finalized' : action === 'shortlist' ? 'Added to shortlist' : 'Removed from shortlist');
        await fetchReceivedDesigns();
        // Removed auto-switch to 3D tab
      } else {
        setError(json.message || 'Failed to update selection');
      }
    } catch (e) {
      setError('Error updating selection');
    }
  };

  const fetchComments = async (designId) => {
    try {
      const res = await fetch(`/buildhub/backend/api/comments/get_comments.php?design_id=${designId}`);
      const json = await res.json();
      if (json.success) setComments(prev => ({ ...prev, [designId]: json.comments }));
    } catch {}
  };

  const postComment = async (designId) => {
    const text = (commentDrafts[designId] || '').trim();
    const rating = Number(commentRatings[designId] || 0);
    if (!text) return;
    try {
      // 1) Post design comment
      const res = await fetch('/buildhub/backend/api/comments/post_comment.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ design_id: designId, message: text })
      });
      const json = await res.json();

      // 2) Also post a review with optional rating
      const design = receivedDesigns.find(d => d.id === designId);
      if (design?.architect_id) {
        try {
          await fetch('/buildhub/backend/api/reviews/post_review.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ architect_id: design.architect_id, design_id: designId, rating: rating > 0 ? rating : 5, comment: text })
          });
        } catch {}
      }

      if (json.success) {
        setCommentDrafts(prev => ({ ...prev, [designId]: '' }));
        setCommentRatings(prev => ({ ...prev, [designId]: 0 }));
        fetchComments(designId);
        setSuccess('Comment & review posted');
        // Re-hydrate 3D if commenting on finalized design
        const isFinal = (receivedDesigns.find(d => d.id === designId)?.status === 'finalized');
        if (isFinal) hydrate3DFromDesign(receivedDesigns.find(d => d.id === designId));
      } else {
        setError(json.message || 'Failed to post comment');
      }
    } catch {
      setError('Error posting comment');
    }
  };

  // Architect directory + assignment
  const fetchArchitects = async (params = {}) => {
    setArchLoading(true);
    setArchError('');
    try {
      const q = new URLSearchParams({
        ...(params.search ? { search: params.search } : {}),
        ...(params.specialization ? { specialization: params.specialization } : {}),
        ...(params.min_experience ? { min_experience: params.min_experience } : {}),
        ...(params.layout_request_id ? { layout_request_id: params.layout_request_id } : {}),
      }).toString();
      const response = await fetch(`/buildhub/backend/api/homeowner/get_architects.php${q ? `?${q}` : ''}`, { credentials: 'include' });
      // If backend supports status filter, ensure approved only by default
      // else we will filter client-side below
      const result = await response.json();
      if (result.success) {
        setArchitects(result.architects || []);
      } else {
        setArchError(result.message || 'Failed to load architects');
      }
    } catch (e) {
      setArchError('Error loading architects');
    } finally {
      setArchLoading(false);
    }
  };

  // Contractor directory + selection
  const fetchContractors = async (params = {}) => {
    setContractorLoading(true);
    setContractorError('');
    try {
      const q = new URLSearchParams({
        ...(params.search ? { search: params.search } : {}),
        ...(params.specialization ? { specialization: params.specialization } : {}),
        ...(params.min_experience ? { min_experience: params.min_experience } : {}),
      }).toString();
      const response = await fetch(`/buildhub/backend/api/homeowner/get_contractors.php${q ? `?${q}` : ''}`, { credentials: 'include' });
      const result = await response.json();
      if (result.success) {
        setContractors(result.contractors || []);
      } else {
        setContractorError(result.message || 'Failed to load contractors');
      }
    } catch (e) {
      setContractorError('Error loading contractors');
    } finally {
      setContractorLoading(false);
    }
  };

  const openArchitectModal = (request) => {
    setSelectedRequestForAssign(request);
    setSelectedArchitectId(null);
    setAssignMessage('');
    setShowArchitectModal(true);
    // Pass layout_request_id so backend can mark already assigned architects
    fetchArchitects({ status: 'approved', search: archSearch, specialization: archSpec, min_experience: archMinExp, layout_request_id: request?.id });
  };

  const openContractorModal = (layout) => {
    setSelectedLibraryLayout(layout);
    setSelectedContractor(null);
    setContractorMessage('');
    setShowContractorModal(true);
    fetchContractors();
  };

  // From a received design: resolve related library layout and open modal
  const openSendToContractorFromDesign = (design) => {
    setSourceDesignForContractor(design || null);
    const layoutId = design?.selected_layout_id;
    // Immediately set minimal selection so sending works without waiting for library load
    if (layoutId) {
      setSelectedLibraryLayout({ id: layoutId, title: 'Selected Layout' });
    } else {
      setSelectedLibraryLayout(null);
    }
    setShowContractorModal(true);
    fetchContractors();

    // Try to enrich with full layout details for the modal display
    const ensureFullLayout = async () => {
      if (!layoutId) return;
      // If already in memory with full details, use it
      if (Array.isArray(layoutLibrary) && layoutLibrary.length > 0) {
        const match = layoutLibrary.find(l => Number(l.id) === Number(layoutId));
        if (match) {
          setSelectedLibraryLayout(match);
          return;
        }
      }
      // Otherwise, fetch the library and find the item
      try {
        const res = await fetch('/buildhub/backend/api/homeowner/get_layout_library.php', { credentials: 'include' });
        const json = await res.json();
        if (json?.success && Array.isArray(json.layouts)) {
          const match = json.layouts.find(l => Number(l.id) === Number(layoutId));
          if (match) setSelectedLibraryLayout(match);
        }
      } catch (_) { /* ignore, minimal selection already set */ }
    };
    ensureFullLayout();
  };

  const sendToContractor = async () => {
    const layoutIdToSend = selectedLibraryLayout?.id || sourceDesignForContractor?.selected_layout_id;
    if (!selectedContractor) {
      setError('Please select a contractor');
      return;
    }
    // Allow send without layout if we have a forwarded design bundle
    const canSendWithoutLayout = !!sourceDesignForContractor;
    if (!layoutIdToSend && !canSendWithoutLayout) {
      setError('Please select a layout to send');
      return;
    }

    setSendingToContractor(true);
    try {
      const response = await fetch('/buildhub/backend/api/homeowner/send_to_contractor.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          layout_id: layoutIdToSend || null,
          contractor_id: selectedContractor.id,
          homeowner_id: user?.id,
          contractor_message: contractorMessage || '',
          forwarded_design: sourceDesignForContractor ? {
            id: sourceDesignForContractor.id,
            title: sourceDesignForContractor.design_title,
            description: sourceDesignForContractor.description,
            files: Array.isArray(sourceDesignForContractor.files) ? sourceDesignForContractor.files : [],
            technical_details: sourceDesignForContractor.technical_details || null,
            created_at: sourceDesignForContractor.created_at
          } : null
        })
      });

      const result = await response.json();
      if (result.success) {
        // Show success message in the UI
        setSuccess(`Layout sent to ${result.contractor_name} successfully!`);
        setShowContractorModal(false);
        setSelectedContractor(null);
        setContractorMessage('');
        setSelectedLibraryLayout(null);
        setSourceDesignForContractor(null);
        // Refresh the requests to show the new entry
        fetchMyRequests();
        // Auto-hide success message after 5 seconds
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError(result.message || 'Failed to send to contractor');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setSendingToContractor(false);
    }
  };

  // Map a finalized design (images/PDF or JSON-like description) to a simple 3D plan.
  // Priority: 1) JSON in description; 2) filename keywords; 3) defaults.
  const hydrate3DFromDesign = (design) => {
    const fallbackRooms = defaultRooms();
    const fallbackWalls = defaultWalls();

    // 1) Try JSON in description (e.g., your example payload)
    const desc = (design?.description || '').trim();
    if (desc.startsWith('{') || desc.startsWith('[')) {
      try {
        const attrs = JSON.parse(desc);
        const fromAttrs = computePlanFromAttributes(attrs);
        if (fromAttrs && Array.isArray(fromAttrs.rooms) && Array.isArray(fromAttrs.walls)) {
          setComputed3DRooms(fromAttrs.rooms.length ? fromAttrs.rooms : fallbackRooms);
          setComputed3DWalls(fromAttrs.walls.length ? fromAttrs.walls : fallbackWalls);
          return;
        }
      } catch (_) { /* ignore and fallback */ }
    }

    // 1b) Try JSON from layout_json field (preferred)
    if (design?.layout_json) {
      try {
        const attrs = JSON.parse(design.layout_json);
        const fromAttrs = computePlanFromAttributes(attrs);
        if (fromAttrs && Array.isArray(fromAttrs.rooms) && Array.isArray(fromAttrs.walls)) {
          setComputed3DRooms(fromAttrs.rooms.length ? fromAttrs.rooms : fallbackRooms);
          setComputed3DWalls(fromAttrs.walls.length ? fromAttrs.walls : fallbackWalls);
          return;
        }
      } catch (_) { /* ignore and fallback */ }
    }

    // 2) Heuristic via filenames
    const files = Array.isArray(design?.files) ? design.files : [];
    if (!files.length) {
      setComputed3DRooms(fallbackRooms);
      setComputed3DWalls(fallbackWalls);
      return;
    }

    const names = files.map(f => (f.original || f.stored || '').toLowerCase());
    const has = (kw) => names.some(n => n.includes(kw));

    const rooms = [];
    if (has('living')) rooms.push({ name: 'Living Room', position: [-1.4,0,1.0], size: [2.8,2.0], color: '#eef6ff' });
    if (has('kitchen')) rooms.push({ name: 'Kitchen', position: [1.5,0,1.0], size: [2.4,2.0], color: '#fff6e9' });
    if (has('bed') || has('master')) rooms.push({ name: 'Bedroom', position: [-1.6,0,-1.0], size: [2.6,1.8], color: '#f3e8ff' });
    if (has('bath') || has('toilet') || has('wc')) rooms.push({ name: 'Bath', position: [1.2,0,-1.0], size: [2.0,1.2], color: '#fdecec' });
    if (has('hall') || has('corridor') || has('foyer')) rooms.push({ name: 'Hallway', position: [1.2,0,-2.1], size: [2.0,0.6], color: '#ecfdf5' });

    const finalRooms = rooms.length ? rooms : fallbackRooms;
    const walls = [
      { position: [0, 0.175, 2.25], rotation: [0,0,0], length: 6.2 },
      { position: [0, 0.175, -2.25], rotation: [0,0,0], length: 6.2 },
      { position: [-3.1, 0.175, 0], rotation: [0, Math.PI/2, 0], length: 4.5 },
      { position: [3.1, 0.175, 0], rotation: [0, Math.PI/2, 0], length: 4.5 },
      { position: [0.15, 0.175, 0], rotation: [0, Math.PI/2, 0], length: 4.2 },
      { position: [-0.25, 0.175, -2.0], rotation: [0,0,0], length: 4.0 },
      { position: [2.2, 0.175, -1.6], rotation: [0, Math.PI/2, 0], length: 1.8 },
    ];

    setComputed3DRooms(finalRooms);
    setComputed3DWalls(walls);
  };

  // Empty default rooms/walls to be populated with real data from API
  const defaultRooms = () => ([]);
  const defaultWalls = () => ([]);

  // Compute plan from attributes or structured JSON
  const computePlanFromAttributes = (attrs) => {
    // If structured rooms present, map them precisely
    if (attrs && Array.isArray(attrs.rooms)) {
      const scale = Number(attrs.scale || 1);
      const rooms = attrs.rooms.map((r, idx) => ({
        name: r.name || `Room ${idx+1}`,
        position: [Number(r.x || 0) * scale, 0, Number(r.z || 0) * scale],
        size: [Number(r.width || 2) * scale, Number(r.depth || 2) * scale],
        color: r.color || undefined,
      }));
      const walls = Array.isArray(attrs.walls) ? attrs.walls.map((w) => ({
        position: [Number(w.x || 0) * scale, 0.175, Number(w.z || 0) * scale],
        rotation: [0, degToRad(Number(w.rotation || 0)), 0],
        length: Number(w.length || 2) * scale,
        thickness: Number(w.thickness || 0.06) * (scale > 0 ? scale : 1),
        height: Number(w.height || 0.35) * (scale > 0 ? scale : 1),
      })) : [];
      return { rooms, walls };
    }

    // Fallback: infer from high-level attributes (e.g., "3 bhk")
    const roomsText = (attrs?.rooms || '').toString().toLowerCase();
    const is3Bhk = roomsText.includes('3') || roomsText.includes('3bhk') || roomsText.includes('3-bhk');

    const style = (attrs?.aesthetic || '').toString().toLowerCase();
    const modern = style.includes('modern');

    // Return empty rooms and walls until real data is available from API
     return { rooms: defaultRooms(), walls: defaultWalls() };
  };

  const degToRad = (deg) => (deg * Math.PI) / 180;

  const handleAssignArchitect = async () => {
    if (!selectedRequestForAssign) {
      setArchError('No request selected');
      return;
    }
    // Collect selected architect IDs (multi-select)
    const selectedIds = Array.isArray(selectedArchitectId)
      ? selectedArchitectId
      : (selectedArchitectId ? [selectedArchitectId] : []);
    if (selectedIds.length === 0) {
      setArchError('Please select at least one architect');
      return;
    }
    try {
      setArchLoading(true);
      // Guard: require layout_request_id
      if (!selectedRequestForAssign?.id) {
        setArchError('Please select a request first');
        setArchLoading(false);
        return;
      }
      const response = await fetch('/buildhub/backend/api/homeowner/assign_architect.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          layout_request_id: selectedRequestForAssign.id,
          architect_ids: selectedIds,
          message: assignMessage
        })
      });
      const result = await response.json();
      if (result.success) {
        setSuccess('Request sent to selected architect(s)');
        setShowArchitectModal(false);
        setSelectedRequestForAssign(null);
        setSelectedArchitectId(null);
      } else {
        setArchError(result.message || 'Failed to send request');
      }
    } catch (e) {
      setArchError('Error sending request');
    } finally {
      setArchLoading(false);
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!requestData.plot_size || !requestData.budget_range || !requestData.requirements) {
      setError('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/buildhub/backend/api/homeowner/submit_request.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();
      if (result.success) {
        // If architect(s) selected, assign immediately
        const selIds = Array.isArray(selectedArchitectId) ? selectedArchitectId : (selectedArchitectId ? [selectedArchitectId] : []);
        if (selIds.length > 0) {
          try {
            await fetch('/buildhub/backend/api/homeowner/assign_architect.php', {
              method: 'POST', 
              headers: { 'Content-Type': 'application/json' }, 
              credentials: 'include',
              body: JSON.stringify({
                layout_request_id: result.request_id,
                architect_ids: selIds,
                message: assignMessage || 'Custom design request from dashboard'
              })
            });
          } catch (e) { /* ignore assignment errors here */ }
        }
        setSuccess(`Your layout request has been submitted successfully! ${selIds.length > 0 ? 'It has been assigned to the selected architect(s).' : 'You can assign it to architects from the Requests tab.'}`);
        setShowRequestForm(false);
        setSelectedArchitectId(null);
        setAssignMessage('');
        setRequestData({
          plot_size: '',
          plot_shape: '',
          topography: '',
          development_laws: '',
          family_needs: '',
          rooms: '',
          budget_range: '',
          aesthetic: '',
          requirements: '',
          location: '',
          timeline: '',
          selected_layout_id: null,
          layout_type: 'custom'
        });
        fetchMyRequests();
      } else {
        setError('Failed to submit request: ' + result.message);
      }
    } catch (error) {
      setError('Error submitting request');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFromLibrary = (layout) => {
    setSelectedLibraryLayout(layout);
    setRequestData({
      ...requestData,
      selected_layout_id: layout.id,
      layout_type: 'library'
    });
    setShowLibraryModal(false);
    navigate(`/homeowner/request?selected_layout_id=${layout.id}&layout_type=library`);
  };

  const renderDashboard = () => (
    <div>
      {/* Hero – UrbanEye-like purple banner */}
      <div className="hero-card">
        <div className="hero-content">
          <div>
            <h1>Welcome back, {user?.first_name || 'Homeowner'}! <span role="img" aria-label="wave">👋</span></h1>
            <p>Plan and track your home project. Request designs, review proposals, and manage progress.</p>
          </div>
          <div className="hero-actions"></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card w-blue">
          <div className="stat-content">
            <div className="stat-icon requests">📋</div>
            <div className="stat-info">
              <h3>{layoutRequests.length}</h3>
              <p>Layout Requests</p>
            </div>
          </div>
        </div>
        <div className="stat-card w-green">
          <div className="stat-content">
            <div className="stat-icon projects">🏗️</div>
            <div className="stat-info">
              <h3>{myProjects.length}</h3>
              <p>Active Projects</p>
            </div>
          </div>
        </div>
        <div className="stat-card w-purple">
          <div className="stat-content">
            <div className="stat-icon library">📚</div>
            <div className="stat-info">
              <h3>{layoutLibrary.length}</h3>
              <p>Available Layouts</p>
            </div>
          </div>
        </div>
        <div className="stat-card w-orange">
          <div className="stat-content">
            <div className="stat-icon completed">✅</div>
            <div className="stat-info">
              <h3>{layoutRequests.filter(r => r.status === 'approved').length}</h3>
              <p>Approved Requests</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section-card">
        <div className="section-header">
          <h2>Quick Actions</h2>
          <p>Get started with your construction project</p>
        </div>
        <div className="section-content">
          <div className="quick-actions float-grid stagger-children">
            <button 
              className="float-rect w-blue"
              onClick={() => navigate('/homeowner/request')}
            >
              <div className="fr-icon">📐</div>
              <div className="fr-title">Request Custom Design</div>
              <div className="fr-sub">Get professional architectural designs for your plot</div>
            </button>
            <button 
              className="float-rect w-purple"
              onClick={() => { setShowLibraryModal(true); fetchLayoutLibrary(); }}
            >
              <div className="fr-icon">📚</div>
              <div className="fr-title">Browse Layout Library</div>
              <div className="fr-sub">Choose from pre-designed layouts and customize them</div>
            </button>
            <button 
              className="float-rect w-orange"
              onClick={() => { setActiveTab('requests'); fetchMyRequests(); }}
            >
              <div className="fr-icon">👁️</div>
              <div className="fr-title">View My Requests</div>
              <div className="fr-sub">Track the status of your layout requests</div>
            </button>
            <button 
              className="float-rect w-green"
              onClick={() => { setActiveTab('projects'); fetchMyProjects(); }}
            >
              <div className="fr-icon">🏠</div>
              <div className="fr-title">Manage Projects</div>
              <div className="fr-sub">Monitor your ongoing construction projects</div>
            </button>
          </div>
        </div>
      </div>

      {/* Project Progress Tracking */}
      <div className="section-card">
        <div className="section-header">
          <h2>Project Progress</h2>
          <p>Track the progress of your active projects</p>
        </div>
        <div className="section-content">
          <div className="widgets-grid">
            <div className="widget-container">
              <div className="widget-header">
                <h3 className="widget-title">Progress Overview</h3>
                <div className="widget-actions">
                  <button className="icon-btn" title="Refresh" onClick={fetchMyProjects}>↻</button>
                </div>
              </div>
              <ProjectProgressChart projects={myProjects} />
            </div>
            <div className="widget-container">
              <div className="widget-header">
                <h3 className="widget-title">Budget Tracker</h3>
                <div className="widget-actions">
                  <button className="icon-btn" title="View Details">👁️</button>
                </div>
              </div>
              <BudgetTracker projects={myProjects} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="section-header">
        <h2>Recent Activity</h2>
        <p>Latest updates on your requests and projects</p>
      </div>
      <div className="section-content">
        <div className="item-list">
          {layoutRequests.slice(0, 5).map(request => {
            const derivedStatus = (Number(request?.accepted_count) > 0 || request?.status === 'approved' || request?.status === 'accepted') ? 'accepted' : request?.status;
            const icon = derivedStatus === 'accepted' ? '✅' : derivedStatus === 'rejected' ? '❌' : '⏳';
            return (
              <div key={request.id} className="list-item">
                <div className="item-icon">{icon}</div>
                <div className="item-content">
                  <h4 className="item-title">Layout Request - {request.plot_size}</h4>
                  <p className="item-subtitle">Budget: {request.budget_range}</p>
                  <p className="item-meta">Submitted: {new Date(request.created_at).toLocaleDateString()}</p>
                </div>
                <div className="item-actions">
                  <span className={`status-badge ${badgeClass(derivedStatus)}`}>
                    {formatStatus(derivedStatus)}
                  </span>
                </div>
              </div>
            );
          })}
          {layoutRequests.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No Requests Yet</h3>
              <p>Start by submitting your first layout request!</p>
              <div className="empty-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowRequestForm(true)}
                >
                  Request Custom Design
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => { setShowLibraryModal(true); fetchLayoutLibrary(); }}
                >
                  Browse Library
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderRequests = () => (
    <div>
      <div className="main-header">
        <div className="header-content">
          <div>
            <h1>My Layout Requests</h1>
            <p>Track your architectural design requests and their progress</p>
          </div>
          <div className="header-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => { setShowLibraryModal(true); fetchLayoutLibrary(); }}
            >
              📚 Browse Library
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation" style={{ marginBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
        <button
          className={`tab-button ${requestsTab === 'all' ? 'active' : ''}`}
          onClick={() => setRequestsTab('all')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: 'transparent',
            borderBottom: requestsTab === 'all' ? '2px solid #3b82f6' : '2px solid transparent',
            color: requestsTab === 'all' ? '#3b82f6' : '#6b7280',
            cursor: 'pointer',
            fontWeight: requestsTab === 'all' ? '600' : '400'
          }}
        >
          All Requests
        </button>
        <button
          className={`tab-button ${requestsTab === 'contractors' ? 'active' : ''}`}
          onClick={() => {
            setRequestsTab('contractors');
            fetchContractorRequests();
          }}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: 'transparent',
            borderBottom: requestsTab === 'contractors' ? '2px solid #3b82f6' : '2px solid transparent',
            color: requestsTab === 'contractors' ? '#3b82f6' : '#6b7280',
            cursor: 'pointer',
            fontWeight: requestsTab === 'contractors' ? '600' : '400'
          }}
        >
          Sent to Contractors
        </button>
      </div>

      <div className="section-card">
        <div className="section-header">
          <h2>{requestsTab === 'all' ? 'Request History' : 'Contractor Requests'}</h2>
          <p>{requestsTab === 'all' ? 'All your submitted layout requests' : 'Requests sent to contractors for proposals'}</p>
        </div>
        <div className="section-content">
          {loading ? (
            <div className="loading">Loading requests...</div>
          ) : (requestsTab === 'all' ? layoutRequests : contractorRequests).length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">{requestsTab === 'all' ? '📭' : '🏗️'}</div>
              <h3>{requestsTab === 'all' ? 'No Requests Yet' : 'No Contractor Requests'}</h3>
              <p>{requestsTab === 'all' ? 'Submit your first layout request to get started!' : 'Send requests to contractors to get started!'}</p>
              <div className="empty-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/homeowner/request')}
                >
                  Request Custom Design
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => { setShowLibraryModal(true); fetchLayoutLibrary(); }}
                >
                  Browse Library
                </button>
              </div>
            </div>
          ) : (
            <div className="item-list">
              {(requestsTab === 'all' ? layoutRequests : contractorRequests).map(request => (
                <RequestItem
                  key={request.id}
                  request={request}
                  onAssignArchitect={() => openArchitectModal(request)}
                  onRemove={() => removeRequest(request.id)}
                  showContractorInfo={requestsTab === 'contractors'}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderReceivedDesigns = () => (
    <div>
      <div className="main-header">
        <div className="header-content">
          <div>
            <h1>Received Designs</h1>
            <p>Review designs, shortlist your favorites, and finalize one</p>
          </div>
          <button className="btn btn-secondary" onClick={fetchReceivedDesigns}>↻ Refresh</button>
        </div>
      </div>

      <div className="section-card">
        <div className="section-header">
          <h2>All Designs (Legacy View)</h2>
          <p>Designs sent by architects directly or for your requests</p>
        </div>
        <div className="section-content">
          {receivedDesigns.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎨</div>
              <h3>No Designs Yet</h3>
              <p>Assigned architects will send designs here for your review.</p>
            </div>
          ) : (
            <div className="item-list">
              {receivedDesigns.map(d => (
                <div key={d.id} className="list-item">
                  <div className="item-icon">{d.status === 'finalized' ? '🏁' : d.status === 'shortlisted' ? '⭐' : '🎨'}</div>
                  <div className="item-content" style={{flex:1}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:10}}>
                      <div>
                        <h4 className="item-title" style={{margin:0}}>{d.design_title}</h4>
                        <p className="item-subtitle" style={{margin:'2px 0 0 0'}}>By {d.architect?.name || 'Architect'} • {new Date(d.created_at).toLocaleString()}</p>
                        <button className="btn btn-secondary" style={{marginTop:6}} onClick={() => setShowDesignDetails(prev => ({...prev, [d.id]: !prev[d.id]}))}>
                          {showDesignDetails[d.id] ? 'Hide Details' : 'View Details'}
                        </button>
                        {showDesignDetails[d.id] && (
                          <div className="details-panel">
                            <div className="details-grid">
                              <div><strong>Sent By:</strong> {d.architect?.name || 'Architect'}</div>
                              <div><strong>Architect Email:</strong> {d.architect?.email || '-'}</div>
                              <div><strong>Design ID:</strong> {d.id}</div>
                              {d.layout_request_id ? (
                                <div><strong>Request ID:</strong> {d.layout_request_id}</div>
                              ) : (
                                <div><strong>Request:</strong> Direct upload</div>
                              )}
                              <div><strong>Status:</strong> <span className={`status-chip ${d.status}`}>{d.status}</span></div>
                              <div><strong>Uploaded:</strong> {new Date(d.created_at).toLocaleString()}</div>
                            </div>
                            {d.description && (
                              <div className="description-section">
                                <strong>Description:</strong>
                                <div className="description-content">
                                  <NeatJsonCard raw={d.description} title="Requirements" />
                                </div>
                              </div>
                            )}
                            {d.technical_details && (
                              <div className="technical-details-section" style={{marginTop:16}}>
                                <TechnicalDetailsDisplay technicalDetails={d.technical_details} />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <button className="btn btn-danger" onClick={() => handleDeleteDesign(d.id)}>🗑️ Delete</button>
                    </div>
                    <p className="item-meta" style={{marginTop:6}}>
                      Status: <span className={`status-badge ${d.status}`}>{d.status}</span>
                    </p>

                    {/* Files grid */}
                    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:'10px', marginTop:'10px'}}>
                      {/* Prefer special tags if present */}
                      {(() => {
                        const files = Array.isArray(d.files) ? d.files : [];
                        const preview = files.find(x => x.tag === 'preview') || files.find(x => /preview|thumb|cover/i.test(x.original || ''));
                        const layout = files.find(x => x.tag === 'layout') || files.find(x => /layout|plan|floor|design/i.test(x.original || ''));
                        const others = files.filter(x => x !== preview && x !== layout);
                        const toCards = [preview, layout, ...others].filter(Boolean);
                        return toCards.map((f, idx) => {
                          const href = f.path || `/buildhub/backend/uploads/designs/${f.stored || f.original}`;
                          const ext = (f.ext || '').toLowerCase();
                          const isImage = ['jpg','jpeg','png','gif','webp','svg','heic'].includes(ext);
                          const label = f.tag === 'preview' ? 'Preview' : f.tag === 'layout' ? 'Layout' : undefined;
                          return (
                            <div key={idx} className="file-card" style={{cursor:'default'}}>
                              {isImage ? (
                                <img src={href} alt={f.original} style={{width:'100%', height:120, objectFit:'cover', borderRadius:6}} onClick={() => setViewer({ open: true, src: href, title: f.original || f.stored })} />
                              ) : (
                                <div className="file-thumb" style={{height:120, display:'flex', alignItems:'center', justifyContent:'center', background:'#f5f5f7', borderRadius:6}}>
                                  <span style={{fontSize:'2rem'}}>📄</span>
                                </div>
                              )}
                              <div className="file-name" style={{fontSize:'0.85rem', marginTop:6, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}} title={f.original || f.stored}>
                                {label ? `${label}: ` : ''}{f.original || f.stored}
                              </div>
                              <div style={{display:'flex', gap:8, marginTop:6}}>
                                {isImage ? (
                                  <button type="button" className="btn btn-secondary" style={{padding:'6px 10px'}} onClick={() => setViewer({ open: true, src: href, title: f.original || f.stored })}>View</button>
                                ) : (
                                  <a href={href} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{padding:'6px 10px'}}>Open</a>
                                )}
                                <a href={href} download className="btn" style={{padding:'6px 10px'}}>Download</a>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>

                    {/* Comments */}
                    <div className="comment-section">
                      <button className="btn btn-secondary" onClick={() => fetchComments(d.id)}>Load comments</button>
                      <div className="comment-list">
                        {(comments[d.id] || []).map(c => (
                          <div key={c.id} className="comment-item">
                            <div className="comment-author">{c.author}</div>
                            <div className="comment-message">{c.message}</div>
                            <div className="comment-date">{new Date(c.created_at).toLocaleString()}</div>
                          </div>
                        ))}
                        <div className="comment-compose">
                          <div className="star-input">
                            {[1,2,3,4,5].map(star => (
                              <span
                                key={star}
                                role="button"
                                onClick={() => setCommentRatings(prev => ({ ...prev, [d.id]: star }))}
                                style={{color: (commentRatings[d.id] || 0) >= star ? '#f5a623' : '#ddd'}}
                                title={`${star} star${star>1?'s':''}`}
                              >★</span>
                            ))}
                          </div>
                          <input
                            type="text"
                            value={commentDrafts[d.id] || ''}
                            onChange={(e) => setCommentDrafts(prev => ({ ...prev, [d.id]: e.target.value }))}
                            placeholder="Write a comment... (will also be posted as a review)"
                          />
                          <button onClick={() => postComment(d.id)}>Post</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="item-actions" style={{display:'flex', flexDirection:'column', gap:6}}>
                    <button className="btn" onClick={() => openSendToContractorFromDesign(d)}>Send to Contractor</button>
                    {d.status !== 'shortlisted' && d.status !== 'finalized' && (
                      <button className="btn" onClick={() => updateSelection(d.id, 'shortlist')}>⭐ Shortlist</button>
                    )}
                    {d.status === 'shortlisted' && (
                      <button className="btn" onClick={() => updateSelection(d.id, 'remove-shortlist')}>Remove shortlist</button>
                    )}
                    {d.status !== 'finalized' && (
                      <button className="btn btn-primary" onClick={() => updateSelection(d.id, 'finalize')}>🏁 Finalize</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderLibrary = () => (
    <div>
      <div className="main-header">
        <div className="header-content">
          <div>
            <h1>Layout Library</h1>
            <p>Browse and select from our collection of pre-designed layouts</p>
          </div>
        </div>
      </div>

      <div className="section-card">
        <div className="section-header">
          <h2>Available Layouts</h2>
          <p>Choose from professionally designed layouts and customize them for your needs</p>
        </div>
        <div className="section-content">
          {loading ? (
            <div className="loading">Loading layouts...</div>
          ) : layoutLibrary.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>No Layouts Available</h3>
              <p>Check back later for new layout designs!</p>
            </div>
          ) : (
            <div className="layout-grid">
              {layoutLibrary.map(layout => (
                <LayoutCard 
                  key={layout.id} 
                  layout={layout} 
                  onSelect={() => handleSelectFromLibrary(layout)}
                  onPreview={() => setPreviewLayout(layout)}
                  isImageUrl={isImageUrl}
                  isPdfUrl={isPdfUrl}
                  onSendToContractor={openContractorModal}
                  onViewDetails={setTechnicalDetailsModal}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div>
      <div className="main-header">
        <div className="header-content">
          <div>
            <h1>My Projects</h1>
            <p>Monitor your ongoing construction projects</p>
          </div>
          <button className="btn btn-primary" onClick={fetchMyProjects}>↻ Refresh Projects</button>
        </div>
      </div>

      {myProjects.length > 0 && (
        <div className="section-card">
          <div className="section-header">
            <h2>Project Timeline</h2>
            <p>View your project schedule and milestones</p>
          </div>
          <div className="section-content">
            <div className="widget-container">
              <ProjectTimeline projects={myProjects} />
            </div>
          </div>
        </div>
      )}

      <div className="section-card">
        <div className="section-header">
          <h2>Active Projects</h2>
          <p>Your current construction projects</p>
        </div>
        <div className="section-content">
          {myProjects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏗️</div>
              <h3>No Projects Yet</h3>
              <p>Your approved layout requests will appear here as projects!</p>
              <button className="btn btn-primary" onClick={() => setActiveTab('dashboard')}>Go to Dashboard</button>
            </div>
          ) : (
            <div className="item-list">
              {myProjects.map(project => (
                <ProjectItem key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>

      {myProjects.length > 0 && (
        <div className="section-card">
          <div className="section-header">
            <h2>Budget Overview</h2>
            <p>Track your project expenses and budget allocation</p>
          </div>
          <div className="section-content">
            <div className="widget-container">
              <BudgetTracker projects={myProjects} />
            </div>
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
            data-title="Dashboard"
            onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); fetchMyProjects(); fetchReceivedDesigns(); }}
          >
            <span className="nav-icon sb-icon">📊</span>
            <span className="nav-label sb-label">Dashboard</span>
          </a>
          <a 
            href="#" 
            className={`nav-item sb-item ${activeTab === 'library' ? 'active' : ''}`}
            data-title="Layout Library"
            onClick={(e) => { e.preventDefault(); setActiveTab('library'); fetchLayoutLibrary(); }}
          >
            <span className="nav-icon sb-icon">📚</span>
            <span className="nav-label sb-label">Layout Library</span>
          </a>
          <a 
            href="#" 
            className={`nav-item sb-item ${activeTab === 'requests' ? 'active' : ''}`}
            data-title="My Requests"
            onClick={(e) => { e.preventDefault(); setActiveTab('requests'); fetchMyRequests(); }}
          >
            <span className="nav-icon sb-icon">📋</span>
            <span className="nav-label sb-label">My Requests</span>
          </a>
          <a 
            href="#" 
            className={`nav-item sb-item ${activeTab === 'designs' ? 'active' : ''}`}
            data-title="Received Designs"
            onClick={(e) => { e.preventDefault(); setActiveTab('designs'); fetchReceivedDesigns(); }}
          >
            <span className="nav-icon sb-icon">🎨</span>
            <span className="nav-label sb-label">Received Designs</span>
          </a>
          <a 
            href="#" 
            className={`nav-item sb-item ${activeTab === 'projects' ? 'active' : ''}`}
            data-title="My Projects"
            onClick={(e) => { e.preventDefault(); setActiveTab('projects'); fetchMyProjects(); }}
          >
            <span className="nav-icon sb-icon">🏗️</span>
            <span className="nav-label sb-label">My Projects</span>
          </a>

        </nav>

        <div className="sidebar-footer sb-footer" style={{ padding:'12px', borderTop:'1px solid #e5e7eb', marginTop:'auto' }} ref={sidebarProfileRef}>
          <button
            type="button"
            onClick={() => setSidebarProfileOpen(v => !v)}
            aria-haspopup="menu"
            aria-expanded={sidebarProfileOpen ? 'true' : 'false'}
            style={{
              width:'100%', background:'transparent', border:'none', padding:0, textAlign:'left', cursor:'pointer'
            }}
            title="Profile"
          >
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                display: 'flex', alignItems:'center', justifyContent:'center',
                overflow:'hidden'
              }}>
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="Avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                ) : (
                  <span style={{ fontWeight: 700, fontSize: 12, color:'#374151' }}>
                    {(user?.first_name?.[0] || 'U').toUpperCase()}{(user?.last_name?.[0] || '').toUpperCase()}
                  </span>
                )}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:600, fontSize:13, color:'#111827', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                  {user?.first_name || 'Homeowner'} {user?.last_name || ''}
                </div>
                <div style={{ fontSize:12, color:'#6b7280', display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ display:'inline-flex', width:6, height:6, borderRadius:6, background:'#10b981' }}></span>
                  Homeowner
                </div>
              </div>
              <span style={{ fontSize:12, color:'#6b7280', transition:'transform 160ms ease', transform: sidebarProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
            </div>
          </button>

          {sidebarProfileOpen && (
            <div
              role="menu"
              style={{
                marginTop:8,
                background:'#fff',
                border:'1px solid #e5e7eb',
                borderRadius:10,
                boxShadow:'0 10px 28px rgba(2,6,23,0.12)',
                overflow:'hidden',
                transition:'opacity 120ms ease, transform 120ms ease',
                opacity: 1,
                transform:'scale(1)'
              }}
              aria-label="Profile menu"
            >
              <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:'#f9fafb', borderBottom:'1px solid #f1f5f9' }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  display: 'flex', alignItems:'center', justifyContent:'center',
                  fontWeight: 700, fontSize: 12, color:'#374151'
                }}>
                  {(user?.first_name?.[0] || 'U').toUpperCase()}{(user?.last_name?.[0] || '').toUpperCase()}
                </div>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontWeight:600, fontSize:13, color:'#111827', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                    {user?.first_name || 'Homeowner'} {user?.last_name || ''}
                  </div>
                  <div style={{ fontSize:12, color:'#6b7280' }}>{user?.email || ''}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => { setSidebarProfileOpen(false); navigate('/homeowner/profile'); }}
                style={{
                  width:'100%', display:'flex', alignItems:'center', gap:10,
                  background:'transparent', border:'none', textAlign:'left', padding:'10px 12px', cursor:'pointer'
                }}
                onMouseOver={(e)=>{ e.currentTarget.style.background='#f9fafb'; }}
                onFocus={(e)=>{ e.currentTarget.style.background='#f9fafb'; e.currentTarget.style.outline='none'; }}
                onMouseOut={(e)=>{ e.currentTarget.style.background='transparent'; }}
              >
                <span aria-hidden style={{ width:18, textAlign:'center' }}>👤</span>
                <span style={{ fontSize:14, color:'#111827' }}>Profile Setup</span>
              </button>

              <div style={{ height:1, background:'#f1f5f9' }}></div>

              <button
                type="button"
                onClick={handleLogout}
                style={{
                  width:'100%', display:'flex', alignItems:'center', gap:10,
                  background:'transparent', border:'none', textAlign:'left', padding:'10px 12px', cursor:'pointer', color:'#b91c1c'
                }}
                onMouseOver={(e)=>{ e.currentTarget.style.background='#fff1f2'; }}
                onMouseOut={(e)=>{ e.currentTarget.style.background='transparent'; }}
              >
                <span aria-hidden style={{ width:18, textAlign:'center' }}>🚪</span>
                <span style={{ fontSize:14 }}>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={`dashboard-main soft-main shifted`}>
        {/* Top Glass Header */}
        <div className="top-glassbar">
          <div className="left">
            <div className="search">
              <span className="icon">🔎</span>
              <input type="text" placeholder="Search tasks, requests, designs..." aria-label="Search" />
            </div>
          </div>
          <div className="right">
            <NotificationSystem userId={user?.id} />
            <button className="icon-btn" title="Help" onClick={() => { setShowSupportModal(true); loadSupportIssues(); }}>❓</button>
          </div>
        </div>
        {/* In-page alerts */}
        <div style={{position:'fixed', top:20, right:20, zIndex:1000, display:'flex', flexDirection:'column', gap:10}}>
          {error && (
            <div className="alert alert-error" style={{minWidth:280}}>
              {error}
              <button onClick={() => setError('')} className="alert-close">×</button>
            </div>
          )}
          {success && (
            <div className="alert alert-success" style={{minWidth:280}}>
              {success}
              <button onClick={() => setSuccess('')} className="alert-close">×</button>
            </div>
          )}
        </div>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'library' && renderLibrary()}
        {activeTab === 'requests' && renderRequests()}
        {activeTab === 'designs' && renderReceivedDesigns()}
        {activeTab === 'projects' && renderProjects()}
        {activeTab === 'scene3d' && (
          <div className="section-card">
            <div className="section-header">
              <h2>Finalized Layout – 3D View</h2>
              <p>View your finalized floor plan in 3D. Click rooms to highlight.</p>
            </div>
            <div className="section-content">
              <div className="home-3d-panel" role="region" aria-label="3D home layout">
                <Home3DLayout rooms={computed3DRooms} walls={computed3DWalls} onSelectRoom={(room)=> setSuccess(`${room} selected`)} />
              </div>
            </div>
          </div>
        )}

        {/* Support / Help Modal */}
        {showSupportModal && (
          <div className="form-modal" onClick={() => setShowSupportModal(false)} style={{background:'rgba(30,58,138,0.55)', position:'fixed', inset:0}}>
            <div
              className="form-content"
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth:'unset', width:'100vw', height:'100vh', borderRadius:0, padding:0,
                display:'flex', flexDirection:'column', overflow:'hidden', background:'#fff'
              }}
            >
              {/* Fullscreen header */}
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid #dbeafe', background:'#1d4ed8'}}>
                <div>
                  <h3 style={{margin:0, color:'#fff'}}>Help & Support</h3>
                  <p style={{margin:'2px 0 0 0', color:'#e0e7ff'}}>Report an issue to admin and view replies</p>
                </div>
                <div style={{display:'flex', gap:8}}>
                  <button className="btn" onClick={() => { setSelectedIssue(null); setShowReportsList(true); loadSupportIssues(); }}>Show My Reports</button>
                  <button className="btn btn-secondary" onClick={() => setShowSupportModal(false)}>Close</button>
                </div>
              </div>

              {/* Body: two-pane layout (single column when no thread selected) */}
              <div style={{display:'grid', gridTemplateColumns: selectedIssue ? '480px 1fr' : '1fr', gap:0, flex:1, minHeight:0, background:'#eff6ff'}}>
                {/* Left column: form + issues list */}
                <div style={{borderRight: selectedIssue ? '1px solid #bfdbfe' : 'none', display:'flex', flexDirection:'column', minHeight:0, background:'#fff'}}>
                  <div style={{padding: selectedIssue ? '16px 16px 8px' : '24px 24px 12px', maxWidth: selectedIssue ? 'unset' : '1200px', flex: showReportsList ? 'unset' : 1}}>
                    <h4 style={{margin:'0 0 8px'}}>Report an Issue</h4>
                    <form onSubmit={(e)=>{ e.preventDefault(); submitSupportIssue(); }}>
                      <div className="form-group">
                        <label>Subject *</label>
                        <input type="text" value={supportForm.subject} onChange={(e)=>setSupportForm({...supportForm, subject:e.target.value})} required />
                      </div>
                      <div className="form-row">
                        <div className="form-group" style={{flex:1}}>
                          <label>Category</label>
                          <select value={supportForm.category} onChange={(e)=>setSupportForm({...supportForm, category:e.target.value})}>
                            <option value="general">General</option>
                            <option value="bug">Bug</option>
                            <option value="billing">Billing</option>
                            <option value="account">Account</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Message *</label>
                        <textarea rows={selectedIssue ? 10 : 14} value={supportForm.message} onChange={(e)=>setSupportForm({...supportForm, message:e.target.value})} required placeholder="Describe your issue in detail" />
                      </div>
                      <div className="form-actions" style={{padding:0, display:'flex', gap:8}}>
                        <button type="submit" className="btn btn-primary" disabled={supportLoading}>
                          {supportLoading ? 'Sending...' : 'Send to Admin'}
                        </button>
                        <button type="button" className="btn" onClick={() => { loadSupportIssues(); setSelectedIssue(null); setShowReportsList(true); }}>
                          View Sent Reports
                        </button>
                      </div>
                    </form>
                  </div>
                  {showReportsList && (
                    <>
                      <div style={{padding: selectedIssue ? '12px 16px 8px' : '16px 24px 8px', maxWidth: selectedIssue ? 'unset' : '1200px'}}>
                        <h4 style={{margin:'0 0 8px'}}>My Reports</h4>
                      </div>
                      <div className="item-list" style={{flex:1, overflowY:'auto', padding: selectedIssue ? '0 8px 12px 8px' : '0 16px 24px 16px', maxWidth: selectedIssue ? 'unset' : '1200px'}}>
                        {supportIssues.length === 0 ? (
                          <div className="empty-state" style={{margin:'24px'}}>
                            <div className="empty-icon">📝</div>
                            <h3>No issues yet</h3>
                            <p>Submit your first issue using the form above.</p>
                          </div>
                        ) : (
                          supportIssues.map(iss => (
                            <div key={iss.id} className={`list-item ${selectedIssue?.id === iss.id ? 'selected' : ''}`} style={{cursor:'pointer'}} onClick={() => openIssueThread(iss.id)}>
                              <div className="item-icon">{iss.status === 'answered' ? '✅' : '🕘'}</div>
                              <div className="item-content">
                                <h4 className="item-title" style={{margin:0}}>{iss.subject}</h4>
                                <p className="item-subtitle" style={{margin:'2px 0 0 0'}}>#{iss.id} • {iss.category} • {new Date(iss.created_at).toLocaleString()}</p>
                              </div>
                              <div className="item-actions">
                                <span className={`status-badge ${iss.status}`}>{iss.status}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Right column: thread view (only when an issue is selected) */}
                {selectedIssue && (
                  <div style={{display:'flex', flexDirection:'column', minHeight:0, background:'#f8fafc'}}>
                    <div style={{padding:'12px 16px', borderBottom:'1px solid #dbeafe', background:'#fff'}}>
                      <h4 style={{margin:'0 0 4px'}}>{selectedIssue.subject}</h4>
                      <div className="muted">Category: {selectedIssue.category} • Status: {selectedIssue.status} • Opened: {new Date(selectedIssue.created_at).toLocaleString()}</div>
                    </div>
                    <div style={{flex:1, overflowY:'auto', padding:'16px', display:'flex', flexDirection:'column', gap:10}}>
                      <div className="chat-bubble you">
                        <div className="bubble-header">You</div>
                        <div className="bubble-body">{selectedIssue.message}</div>
                        <div className="bubble-meta">{new Date(selectedIssue.created_at).toLocaleString()}</div>
                      </div>
                      {issueReplies.map(r => (
                        <div key={r.id} className={`chat-bubble ${r.sender === 'admin' ? 'admin' : 'you'}`}>
                          <div className="bubble-header">{r.sender === 'admin' ? 'Admin' : 'You'}</div>
                          <div className="bubble-body">{r.message}</div>
                          <div className="bubble-meta">{new Date(r.created_at).toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Request Form Modal */}
        {showRequestForm && (
          <div className="form-modal">
            <div className="form-content">
              <div className="form-header">
                <h3>
                  {requestData.layout_type === 'library' ? 'Customize Selected Layout' : 'Submit Layout Request'}
                </h3>
                <p>
                  {requestData.layout_type === 'library' 
                    ? 'Provide your requirements to customize the selected layout'
                    : 'Get professional architectural designs for your construction project'
                  }
                </p>
              </div>

              {/* Selected Layout Display */}
              {requestData.layout_type === 'library' && selectedLibraryLayout && (
                <div className="selected-layout-display">
                  <h4>Selected Layout: {selectedLibraryLayout.title}</h4>
                  <div className="layout-preview">
                    <img 
                      src={selectedLibraryLayout.image_url || '/images/default-layout.jpg'} 
                      alt={selectedLibraryLayout.title}
                      className="layout-image"
                    />
                    <div className="layout-details">
                      <p><strong>Type:</strong> {selectedLibraryLayout.layout_type}</p>
                      <p><strong>Bedrooms:</strong> {selectedLibraryLayout.bedrooms}</p>
                      <p><strong>Bathrooms:</strong> {selectedLibraryLayout.bathrooms}</p>
                      <p><strong>Area:</strong> {selectedLibraryLayout.area} sq ft</p>
                    </div>
                  </div>
                  
                  {/* Technical Details in Selected Layout */}
                  {selectedLibraryLayout.technical_details && (
                    <div style={{marginTop: '12px', padding: '12px', background: '#f8f9fa', borderRadius: '6px', border: '1px solid #e9ecef'}}>
                      <h5 style={{margin: '0 0 8px 0', fontSize: '0.9rem', color: '#495057'}}>Technical Specifications</h5>
                      <TechnicalDetailsDisplay 
                        technicalDetails={selectedLibraryLayout.technical_details} 
                        compact={true}
                      />
                    </div>
                  )}
                </div>
              )}
              
              <form onSubmit={handleRequestSubmit}>
                <div className="form-section">
                  <h4 className="section-title">Basic Information</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Plot Size (sq ft) *</label>
                      <input
                        type="number"
                        value={requestData.plot_size}
                        onChange={(e) => setRequestData({...requestData, plot_size: e.target.value})}
                        placeholder="e.g., 1200"
                        required
                        min="100"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Budget (₹) *</label>
                      <input
                        type="number"
                        placeholder="Enter your budget in rupees"
                        value={requestData.budget_range}
                        onChange={(e) => setRequestData({...requestData, budget_range: e.target.value})}
                        min="0"
                        step="10000"
                        required
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>

                {/* Site details */}
                <div className="form-section">
                  <h4 className="section-title">Site Details</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Plot Shape</label>
                      <input
                        type="text"
                        value={requestData.plot_shape}
                        onChange={(e) => setRequestData({...requestData, plot_shape: e.target.value})}
                        placeholder="e.g., Rectangular, Square, Irregular"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Number of Floors *</label>
                      <input
                        type="number"
                        value={requestData.num_floors}
                        onChange={(e) => setRequestData({...requestData, num_floors: e.target.value})}
                        placeholder="e.g., 1, 2, 3"
                        min="1"
                        required
                        className="form-control"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Topography</label>
                      <input
                        type="text"
                        value={requestData.topography}
                        onChange={(e) => setRequestData({...requestData, topography: e.target.value})}
                        placeholder="e.g., Flat, Sloped, Rocky"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Local Development Laws / Restrictions</label>
                      <input
                        type="text"
                        value={requestData.development_laws}
                        onChange={(e) => setRequestData({...requestData, development_laws: e.target.value})}
                        placeholder="e.g., Setbacks, FSI/FAR, height limits"
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>

                {/* Family needs */}
                <div className="form-section">
                  <h4 className="section-title">Family & Design Preferences</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Family Needs</label>
                      <input
                        type="text"
                        value={requestData.family_needs}
                        onChange={(e) => setRequestData({...requestData, family_needs: e.target.value})}
                        placeholder="e.g., Elder-friendly, Work-from-home, Kids play area"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Rooms</label>
                      <input
                        type="text"
                        value={requestData.rooms}
                        onChange={(e) => setRequestData({...requestData, rooms: e.target.value})}
                        placeholder="e.g., 3 Bedrooms, 1 Study, 1 Puja Room"
                        className="form-control"
                      />
                    </div>
                  </div>

                  {/* Aesthetic */}
                  <div className="form-row">
                    <div className="form-group">
                      <label>House Aesthetic / Style</label>
                      <input
                        type="text"
                        value={requestData.aesthetic}
                        onChange={(e) => setRequestData({...requestData, aesthetic: e.target.value})}
                        placeholder="e.g., Modern, Traditional, Minimalist"
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section location-timeline-section">
                  <h4 className="section-title">Location & Timeline</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Location</label>
                      <div className="location-input-wrapper">
                        <SearchableDropdown
                          options={indianCities}
                          value={requestData.location}
                          onChange={(value) => setRequestData({...requestData, location: value})}
                          placeholder="Search for a city..."
                          detectLocation={true}
                        />
                        <div className="location-detect-info">
                          <i className="fas fa-info-circle"></i>
                          <span>Click the location icon to detect your current city</span>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Timeline</label>
                      <select
                        value={requestData.timeline}
                        onChange={(e) => setRequestData({...requestData, timeline: e.target.value})}
                        className="form-control timeline-select"
                      >
                        <option value="">Select timeline</option>
                        <option value="0-6 months">0-6 months</option>
                        <option value="6-12 months">6-12 months</option>
                        <option value="12-18 months">12-18 months</option>
                        <option value="18-24 months">18-24 months</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Additional notes */}
                <div className="form-section">
                  <h4 className="section-title">
                    {requestData.layout_type === 'library' 
                      ? 'Customization Requirements' 
                      : 'Additional Notes'
                    }
                  </h4>
                  <div className="form-group">
                    <label>
                      {requestData.layout_type === 'library' 
                        ? 'Describe your modifications *' 
                        : 'Any other preferences or constraints'
                      }
                    </label>
                    <textarea
                      value={requestData.requirements}
                      onChange={(e) => setRequestData({...requestData, requirements: e.target.value})}
                      placeholder={
                        requestData.layout_type === 'library'
                          ? "Describe any modifications you'd like to make to the selected layout: room changes, additional features, material preferences, etc."
                          : "Any other preferences or constraints"
                      }
                      rows="4"
                      required={requestData.layout_type === 'library'}
                      className="form-control"
                    />
                  </div>
                </div>

                {/* Inline Architect selection before submit */}
                <div className="form-card architect-selection-card">
                  <h4 className="architect-selection-title">Choose Architect (optional)</h4>
                  <p className="architect-selection-subtitle">Pick who should receive your request immediately after submission.</p>
                  <div className="architect-filters-row">
                    <div className="filter-input-group">
                      <i className="fas fa-search filter-icon"></i>
                      <input
                        type="text"
                        placeholder="Search name/company/email"
                        value={archSearch}
                        onChange={(e) => setArchSearch(e.target.value)}
                        className="architect-filter-input"
                      />
                    </div>
                    <div className="filter-input-group">
                      <i className="fas fa-briefcase filter-icon"></i>
                      <input
                        type="text"
                        placeholder="Specialization (optional)"
                        value={archSpec}
                        onChange={(e) => setArchSpec(e.target.value)}
                        className="architect-filter-input"
                      />
                    </div>
                    <div className="filter-input-group">
                      <i className="fas fa-clock filter-icon"></i>
                      <input
                        type="number"
                        placeholder="Min experience"
                        value={archMinExp}
                        onChange={(e) => setArchMinExp(e.target.value)}
                        min="0"
                        className="architect-filter-input"
                      />
                    </div>
                    <button type="button" className="architect-search-btn" onClick={() => fetchArchitects({ status: 'approved', search: archSearch, specialization: archSpec, min_experience: archMinExp })}>
                      <i className="fas fa-search"></i> Search
                    </button>
                  </div>
                  {archError && <div className="alert alert-error architect-error">{archError}</div>}
                  <div className="architect-list">
                    {archLoading ? (
                      <div className="architect-loading">
                        <i className="fas fa-spinner fa-spin"></i> Loading architects...
                      </div>
                    ) : architects.length === 0 ? (
                      <div className="architect-empty-state">
                        <div className="empty-icon">🧑‍🎨</div>
                        <h4 className="empty-title">No architects found</h4>
                        <p className="empty-message">Adjust your filters and try again</p>
                      </div>
                    ) : (
                      architects
                        .filter(a => (a.status || 'approved') === 'approved')
                        .map(a => (
                        <label key={a.id} className="architect-list-item">
                          <div className="architect-avatar">
                            <i className="fas fa-user-tie"></i>
                          </div>
                          <div className="architect-content">
                            <div className="architect-name">{a.first_name} {a.last_name} {a.company_name ? `• ${a.company_name}` : ''}</div>
                            <div className="architect-specialization">
                              <i className="fas fa-briefcase"></i> {a.specialization || 'General'} 
                              <span className="experience-badge">{a.experience_years ?? 'N/A'} yrs</span>
                            </div>
                            <div className="architect-email">{a.email || ''}</div>
                            <div className="architect-rating">
                              <span title={a.avg_rating ? `${a.avg_rating} / 5` : 'No ratings yet'}>
                                {[1,2,3,4,5].map(star => (
                                  <span key={star} className="rating-star" style={{color: (a.avg_rating || 0) >= star ? '#f5a623' : '#ddd'}}>★</span>
                                ))}
                              </span>
                              <span className="rating-count">({a.review_count || 0} reviews)</span>
                            </div>
                          </div>
                          <div className="architect-actions">
                            <button type="button" className="select-architect-btn" onClick={() => { setSelectedArchitectId([a.id]); setArchStepDone(true); }}>
                              <i className="fas fa-check"></i> Select
                            </button>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                  {!archStepDone ? (
                    <div className="muted" style={{marginTop:8}}>Select an approved architect above to proceed.</div>
                  ) : (
                    <div className="form-group" style={{marginTop:8}}>
                      <label>Message to architect (optional)</label>
                      <textarea
                        value={assignMessage}
                        onChange={(e) => setAssignMessage(e.target.value)}
                        placeholder="Add any notes for the architect"
                        rows="2"
                      />
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowRequestForm(false);
                      setSelectedLibraryLayout(null);
                      setRequestData({
                        plot_size: '',
                        budget_range: '',
                        requirements: '',
                        location: '',
                        timeline: '',
                        selected_layout_id: null,
                        layout_type: 'custom'
                      });
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading || (!archStepDone && Array.isArray(selectedArchitectId) && selectedArchitectId.length > 0 && !assignMessage)}
                    className="btn btn-primary"
                  >
                    {loading ? 'Submitting...' : 
                     requestData.layout_type === 'library' ? 'Submit Customization Request' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Architect Selection Modal */}
        {showArchitectModal && (
          <div className="form-modal">
            <div className="form-content architect-modal">
              <div className="form-header">
                <h3>Select Architect</h3>
                <p>Choose an architect to send your request</p>
                <button className="modal-close" onClick={() => setShowArchitectModal(false)}>×</button>
              </div>

              {/* Request selection fallback */}
              {(!selectedRequestForAssign || !selectedRequestForAssign.id) ? (
                <div className="form-group">
                  <label>Select one of your requests</label>
                  <select
                    value={selectedRequestForAssign?.id || ''}
                    onChange={(e) => {
                      const req = layoutRequests.find(r => String(r.id) === e.target.value);
                      setSelectedRequestForAssign(req || null);
                    }}
                    className="form-control"
                  >
                    <option value="">-- Select request --</option>
                    {layoutRequests.map(r => (
                      <option key={r.id} value={r.id}>
                        #{r.id} • {r.layout_type === 'library' ? (r.selected_layout_title || 'Library') : 'Custom'} • {r.plot_size} sq ft
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="info-row">
                  <span className="status-chip success">For Request #{selectedRequestForAssign.id}</span>
                </div>
              )}

              <div className="filters-row">
                <input
                  type="text"
                  placeholder="Search name/company/email"
                  value={archSearch}
                  onChange={(e) => setArchSearch(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Specialization (optional)"
                  value={archSpec}
                  onChange={(e) => setArchSpec(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Min experience"
                  value={archMinExp}
                  onChange={(e) => setArchMinExp(e.target.value)}
                  min="0"
                />
                <button onClick={() => fetchArchitects({ status: 'approved', search: archSearch, specialization: archSpec, min_experience: archMinExp })}>
                  <i className="fas fa-search"></i> Search
                </button>
              </div>

              {archError && <div className="alert alert-error">{archError}</div>}

              <div className="architects-list">
                {archLoading ? (
                  <div className="loading">Loading architects...</div>
                ) : architects.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🧑‍🎨</div>
                    <h3>No architects found</h3>
                    <p>Adjust your filters and try again</p>
                  </div>
                ) : (
                  <div className="item-list">
                    {architects.map(a => {
                      const already = !!a.already_assigned;
                      const status = a.assignment_status; // sent | accepted | declined | null
                      return (
                        <label key={a.id} className={`list-item ${already ? 'disabled' : ''} ${Array.isArray(selectedArchitectId) ? selectedArchitectId.includes(a.id) ? 'selected' : '' : (selectedArchitectId === a.id ? 'selected' : '')}`}>
                          <div className="item-icon">🧑‍🎨</div>
                          <div className="item-content">
                            <h4 className="item-title">{a.first_name} {a.last_name} {a.company_name ? `• ${a.company_name}` : ''}</h4>
                            <p className="item-subtitle">{a.specialization || 'General'}</p>
                            <div className="detail-grid">
                              <span><strong>Experience:</strong> {a.experience_years ?? 'N/A'} years</span>
                              <span><strong>Projects:</strong> {a.project_count || '0'}</span>
                              <span><strong>Email:</strong> {a.email || 'N/A'}</span>
                              <span><strong>License:</strong> {a.license_number || 'N/A'}</span>
                            </div>
                            <div className="rating-row">
                              <span title={a.avg_rating ? `${a.avg_rating} / 5` : 'No ratings yet'}>
                                {[1,2,3,4,5].map(star => (
                                  <span key={star} style={{color: (a.avg_rating || 0) >= star ? '#f5a623' : '#ddd'}}>★</span>
                                ))}
                              </span>
                              <span style={{marginLeft:8, color:'#666', fontSize:'0.9rem'}}>({a.review_count || 0})</span>
                            </div>
                            <div className="contact-info">
                              <span className="muted">Phone: {a.phone || 'N/A'}</span>
                              <span className="muted">City: {a.city || 'N/A'}</span>
                            </div>
                            {already && (
                              <div className="status-row">
                                <span className={`status-chip ${status === 'accepted' ? 'success' : status === 'declined' ? 'danger' : ''}`}>
                                  {status ? `Already ${formatStatus(status)}` : 'Request sent'}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="item-actions">
                            <input 
                              type="checkbox" 
                              disabled={already}
                              checked={Array.isArray(selectedArchitectId) ? selectedArchitectId.includes(a.id) : selectedArchitectId === a.id}
                              onChange={(e) => {
                                if (Array.isArray(selectedArchitectId)) {
                                  setSelectedArchitectId(
                                    e.target.checked
                                      ? [...selectedArchitectId, a.id]
                                      : selectedArchitectId.filter(id => id !== a.id)
                                  );
                                } else {
                                  setSelectedArchitectId(e.target.checked ? [a.id] : []);
                                }
                              }}
                            />
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Message to architect (optional)</label>
                <textarea
                  value={assignMessage}
                  onChange={(e) => setAssignMessage(e.target.value)}
                  placeholder="Add any specific requirements or notes for the architect"
                  rows="3"
                />
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowArchitectModal(false)}>Cancel</button>
                <button className="btn btn-primary" disabled={archLoading || !selectedArchitectId} onClick={handleAssignArchitect}>
                  {archLoading ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contractor Selection Modal */}
        {showContractorModal && (
          <div className="form-modal">
            <div className="form-content contractor-modal">
              <div className="form-header">
                <h3>Select Contractor</h3>
                <p>Choose a contractor to send your layout</p>
                <button className="modal-close" onClick={() => setShowContractorModal(false)}>×</button>
              </div>

              {/* Selected Layout Display */}
              {selectedLibraryLayout && (
                <div className="selected-layout-display">
                  <h4>Selected Layout: {selectedLibraryLayout.title}</h4>
                  <div className="layout-preview">
                    <img 
                      src={selectedLibraryLayout.image_url || '/images/default-layout.jpg'} 
                      alt={selectedLibraryLayout.title}
                      className="layout-image"
                    />
                    <div className="layout-details">
                      <p><strong>Type:</strong> {selectedLibraryLayout.layout_type}</p>
                      <p><strong>Bedrooms:</strong> {selectedLibraryLayout.bedrooms}</p>
                      <p><strong>Bathrooms:</strong> {selectedLibraryLayout.bathrooms}</p>
                      <p><strong>Area:</strong> {selectedLibraryLayout.area} sq ft</p>
                    </div>
                  </div>
                  
                  {/* Technical Details in Selected Layout */}
                  {selectedLibraryLayout.technical_details && (
                    <div style={{marginTop: '12px', padding: '12px', background: '#f8f9fa', borderRadius: '6px', border: '1px solid #e9ecef'}}>
                      <h5 style={{margin: '0 0 8px 0', fontSize: '0.9rem', color: '#495057'}}>Technical Specifications</h5>
                      <TechnicalDetailsDisplay 
                        technicalDetails={selectedLibraryLayout.technical_details} 
                        compact={true}
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="filters-row">
                <input
                  type="text"
                  placeholder="Search contractor name/email"
                  value={archSearch}
                  onChange={(e) => setArchSearch(e.target.value)}
                />
                <button onClick={() => fetchContractors({ search: archSearch })}>
                  <i className="fas fa-search"></i> Search
                </button>
              </div>

              {contractorError && <div className="alert alert-error">{contractorError}</div>}

              <div className="contractors-list">
                {contractorLoading ? (
                  <div className="loading">Loading contractors...</div>
                ) : contractors.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">👷</div>
                    <h3>No contractors found</h3>
                    <p>Adjust your filters and try again</p>
                  </div>
                ) : (
                  <div className="item-list">
                    {contractors.map(contractor => (
                      <label key={contractor.id} className={`list-item ${selectedContractor?.id === contractor.id ? 'selected' : ''}`}>
                        <div className="item-icon">👷</div>
                        <div className="item-content">
                          <h4 className="item-title">{contractor.first_name} {contractor.last_name}</h4>
                          <p className="item-subtitle">Verified Contractor</p>
                          <div className="detail-grid">
                            <span><strong>Email:</strong> {contractor.email || 'N/A'}</span>
                            <span><strong>License:</strong> {contractor.license ? 'Verified' : 'Not provided'}</span>
                            <span><strong>Portfolio:</strong> {contractor.portfolio ? 'Available' : 'Not provided'}</span>
                            <span><strong>Member since:</strong> {contractor.created_at ? new Date(contractor.created_at).getFullYear() : 'N/A'}</span>
                          </div>
                          <div className="rating-row">
                            <span title={contractor.avg_rating ? `${contractor.avg_rating} / 5` : 'No ratings yet'}>
                              {[1,2,3,4,5].map(star => (
                                <span key={star} style={{color: (contractor.avg_rating || 0) >= star ? '#f5a623' : '#ddd'}}>★</span>
                              ))}
                            </span>
                            <span style={{marginLeft:8, color:'#666', fontSize:'0.9rem'}}>({contractor.review_count || 0})</span>
                          </div>
                        </div>
                        <div className="item-actions">
                          <input 
                            type="radio" 
                            name="contractor"
                            checked={selectedContractor?.id === contractor.id}
                            onChange={() => setSelectedContractor(contractor)}
                          />
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              {/* Optional message to contractor */}
              <div className="form-group" style={{ marginTop: 12 }}>
                <label>Message to contractor (optional)</label>
                <textarea
                  value={contractorMessage}
                  onChange={(e) => setContractorMessage(e.target.value)}
                  placeholder="Add any notes or instructions for the contractor"
                  rows="3"
                />
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowContractorModal(false)}>Cancel</button>
                <button className="btn btn-primary" disabled={contractorLoading || !selectedContractor || sendingToContractor} onClick={sendToContractor}>
                  {sendingToContractor ? 'Sending...' : 'Send to Contractor'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Library Modal */}
        {showLibraryModal && (
          <div className="form-modal">
            <div className="form-content library-modal">
              <div className="form-header">
                <h3>Layout Library</h3>
                <p>Choose from our collection of professionally designed layouts</p>
                <button
                  className="modal-close"
                  onClick={() => setShowLibraryModal(false)}
                >
                  ×
                </button>
                <button className="btn btn-primary" onClick={() => setShowAddLayoutModal(true)} style={{marginTop: 10}}>Add Layout</button>
              </div>
              
              <div className="library-content">
                {loading ? (
                  <div className="loading">Loading layouts...</div>
                ) : layoutLibrary.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📚</div>
                    <h3>No Layouts Available</h3>
                    <p>Check back later for new layout designs!</p>
                  </div>
                ) : (
                  <div className="layout-grid">
                    {layoutLibrary.map(layout => (
                      <LayoutCard 
                        key={layout.id} 
                        layout={layout} 
                        onSelect={() => handleSelectFromLibrary(layout)}
                        onPreview={() => setPreviewLayout(layout)}
                        isImageUrl={isImageUrl}
                        isPdfUrl={isPdfUrl}
                        isModal={true}
                        onSendToContractor={openContractorModal}
                        onViewDetails={setTechnicalDetailsModal}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add Layout Modal */}
        {showAddLayoutModal && (
          <div className="form-modal">
            <div className="form-content" style={{maxWidth: 920, maxHeight: '90vh', height: '90vh', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: 'rgb(203, 213, 224) rgb(247, 250, 252)', paddingRight: 12, marginRight: 8, position: 'relative', scrollBehavior: 'smooth'}}>
              <div className="fade-top"></div>
              <div className="form-header">
                <h3>Add Layout</h3>
                <p>Publish a new layout to the library</p>
                <div className="step-indicator" style={{marginTop: 10, display: 'flex', gap: 10}}>
                  <span className="step active">Basic Info &amp; Files</span>
                </div>
                <button
                  className="modal-close"
                  onClick={() => setShowAddLayoutModal(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleAddLayout}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Title</label>
                    <input placeholder="e.g., Modern 3BHK House" required type="text" value={addLayoutForm.title} onChange={(e) => setAddLayoutForm({...addLayoutForm, title: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Layout Type</label>
                    <select required value={addLayoutForm.layoutType} onChange={(e) => setAddLayoutForm({...addLayoutForm, layoutType: e.target.value})}>
                      <option value="">Select Type</option>
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Mixed Use">Mixed Use</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Bedrooms</label>
                    <input min="1" required type="number" value={addLayoutForm.bedrooms} onChange={(e) => setAddLayoutForm({...addLayoutForm, bedrooms: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Bathrooms</label>
                    <input min="1" required type="number" value={addLayoutForm.bathrooms} onChange={(e) => setAddLayoutForm({...addLayoutForm, bathrooms: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Area (sq ft)<div className="info-popup-container" style={{position: 'relative', display: 'inline-block'}}><span style={{marginLeft: 8, cursor: 'pointer', color: 'rgb(107, 114, 128)'}}>ℹ️</span></div></label>
                    <input min="100" required type="number" value={addLayoutForm.area} onChange={(e) => setAddLayoutForm({...addLayoutForm, area: e.target.value})} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Price Range</label>
                    <input placeholder="e.g., 20-30 Lakhs" type="text" value={addLayoutForm.priceRange} onChange={(e) => setAddLayoutForm({...addLayoutForm, priceRange: e.target.value})} />
                  </div>
                </div>
                <div className="form-section" style={{marginTop: 20, padding: 16, border: '1px solid rgb(229, 231, 235)', borderRadius: 8, background: 'rgb(249, 250, 251)'}}>
                  <h4 style={{margin: '0px 0px 16px', color: 'rgb(55, 65, 81)'}}>Files &amp; Media</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Preview Image *</label>
                      <input accept="image/*" required type="file" onChange={(e) => setAddLayoutForm({...addLayoutForm, previewImage: e.target.files[0]})} />
                      <p className="form-help" style={{margin: '4px 0px 0px', fontSize: '0.8rem', color: 'rgb(107, 114, 128)'}}>Upload a preview image (JPG, PNG, GIF, WebP)</p>
                    </div>
                    <div className="form-group">
                      <label>Layout Design File *</label>
                      <input accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.svg,.dwg,.dxf,.ifc,.rvt,.skp,.3dm,.obj,.stl" required type="file" onChange={(e) => setAddLayoutForm({...addLayoutForm, layoutFile: e.target.files[0]})} />
                      <p className="form-help" style={{margin: '4px 0px 0px', fontSize: '0.8rem', color: 'rgb(107, 114, 128)'}}>Upload layout file (PDF, Images, CAD files, 3D models)</p>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"></div>
                    <div className="form-group"></div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea rows="6" placeholder="Describe the layout features and design highlights..." style={{minHeight: 120}} value={addLayoutForm.description} onChange={(e) => setAddLayoutForm({...addLayoutForm, description: e.target.value})}></textarea>
                </div>
                <div className="form-actions" style={{marginTop: 30, paddingBottom: 30, borderTop: '1px solid rgb(229, 231, 235)', paddingTop: 20}}>
                  <button type="submit" className="btn btn-primary">Add Layout</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddLayoutModal(false)}>Cancel</button>
                </div>
              </form>
              <div className="fade-bottom"></div>
            </div>
          </div>
        )}

        {/* Preview modal for image + layout */}
        {previewLayout && (
          <div className="form-modal" onClick={() => setPreviewLayout(null)}>
            <div className="form-content" onClick={(e)=>e.stopPropagation()} style={{maxWidth:'min(1200px, 96vw)'}}>
              <div className="form-header">
                <h3>{previewLayout.title}</h3>
                <p>Preview Image and Layout</p>
                {(previewLayout.architect_name || previewLayout.architect_email) && (
                  <div style={{marginTop:6, color:'#6b7280'}}>
                    {previewLayout.architect_name && (<div><strong>Architect:</strong> {previewLayout.architect_name}</div>)}
                    {previewLayout.architect_email && (<div><strong>Email:</strong> {previewLayout.architect_email}</div>)}
                  </div>
                )}
              </div>
              <div className="form-row" style={{gap:'16px'}}>
                <div className="form-group" style={{flex:1}}>
                  <label>Preview Image</label>
                  {isImageUrl(previewLayout.image_url) ? (
                    <img src={previewLayout.image_url} alt="Preview" style={{width:'100%', maxHeight:'70vh', objectFit:'contain', borderRadius:8}}/>
                  ) : (
                    <div style={{padding:12, background:'#fafafa', border:'1px dashed #ddd', borderRadius:8}}>No image</div>
                  )}
                </div>
                <div className="form-group" style={{flex:1}}>
                  <label>Layout</label>
                  {isImageUrl(previewLayout.design_file_url) ? (
                    <img src={previewLayout.design_file_url} alt="Layout" style={{width:'100%', maxHeight:'70vh', objectFit:'contain', borderRadius:8}}/>
                  ) : isPdfUrl(previewLayout.design_file_url) ? (
                    <iframe title="Layout PDF" src={previewLayout.design_file_url} style={{width:'100%', height:'70vh', border:'1px solid #eee', borderRadius:8}} />
                  ) : previewLayout.design_file_url ? (
                    <a className="btn btn-link" href={previewLayout.design_file_url} target="_blank" rel="noreferrer">Open/Download Layout</a>
                  ) : (
                    <div style={{padding:12, background:'#fafafa', border:'1px dashed #ddd', borderRadius:8}}>No layout file</div>
                  )}
                </div>
              </div>
              
              {/* Technical Details in Preview Modal */}
              {previewLayout.technical_details && (
                <div style={{marginTop: '16px', padding: '12px', background: '#f8f9fa', borderRadius: '6px', border: '1px solid #e9ecef'}}>
                  <h5 style={{margin: '0 0 8px 0', fontSize: '0.9rem', color: '#495057'}}>Technical Specifications</h5>
                  <TechnicalDetailsDisplay 
                    technicalDetails={previewLayout.technical_details} 
                    compact={true}
                  />
                </div>
              )}
              
              <div className="form-actions">
                <button type="button" className="btn btn-primary" onClick={() => setPreviewLayout(null)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {/* Layout Details Modal */}
        {technicalDetailsModal && (
          <div className="form-modal" onClick={() => setTechnicalDetailsModal(null)}>
            <div className="form-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: 'min(1000px, 95vw)', maxHeight: '90vh'}}>
              <div className="form-header">
                <h3>Layout Details - {technicalDetailsModal.title}</h3>
                <p>Complete layout information and specifications</p>
                {(technicalDetailsModal.architect_name || technicalDetailsModal.architect_email) && (
                  <div style={{marginTop: 6, color: '#6b7280'}}>
                    {technicalDetailsModal.architect_name && (<div><strong>Architect:</strong> {technicalDetailsModal.architect_name}</div>)}
                    {technicalDetailsModal.architect_email && (<div><strong>Email:</strong> {technicalDetailsModal.architect_email}</div>)}
                  </div>
                )}
              </div>
              
              <div style={{overflowY: 'auto', maxHeight: '70vh', paddingRight: '8px'}}>
                {/* Basic Layout Information */}
                <div style={{marginBottom: '24px', padding: '16px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef'}}>
                  <h4 style={{margin: '0 0 12px 0', color: '#495057'}}>Basic Information</h4>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px'}}>
                    <div>
                      <strong>Title:</strong> {technicalDetailsModal.title || 'N/A'}
                    </div>
                    <div>
                      <strong>Type:</strong> {technicalDetailsModal.layout_type || 'N/A'}
                    </div>
                    <div>
                      <strong>Bedrooms:</strong> {technicalDetailsModal.bedrooms || 'N/A'}
                    </div>
                    <div>
                      <strong>Bathrooms:</strong> {technicalDetailsModal.bathrooms || 'N/A'}
                    </div>
                    <div>
                      <strong>Area:</strong> {technicalDetailsModal.area ? `${technicalDetailsModal.area} sq ft` : 'N/A'}
                    </div>
                    <div>
                      <strong>Price Range:</strong> {technicalDetailsModal.price_range || 'N/A'}
                    </div>
                    <div>
                      <strong>Status:</strong> {technicalDetailsModal.status || 'N/A'}
                    </div>
                    <div>
                      <strong>Created:</strong> {technicalDetailsModal.created_at ? new Date(technicalDetailsModal.created_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  {technicalDetailsModal.description && (
                    <div style={{marginTop: '12px'}}>
                      <strong>Description:</strong>
                      <p style={{margin: '4px 0 0 0', color: '#6c757d'}}>{technicalDetailsModal.description}</p>
                    </div>
                  )}
                </div>

                {/* Technical Details */}
                {technicalDetailsModal.technical_details && (
                  <div style={{marginBottom: '24px'}}>
                    <h4 style={{margin: '0 0 12px 0', color: '#495057'}}>Technical Specifications</h4>
                    <TechnicalDetailsDisplay 
                      technicalDetails={technicalDetailsModal.technical_details} 
                      compact={false}
                    />
                  </div>
                )}

                {/* Files Information */}
                <div style={{padding: '16px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef'}}>
                  <h4 style={{margin: '0 0 12px 0', color: '#495057'}}>Files & Media</h4>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px'}}>
                    {technicalDetailsModal.image_url && (
                      <div>
                        <strong>Preview Image:</strong>
                        <div style={{marginTop: '8px'}}>
                          <img 
                            src={technicalDetailsModal.image_url} 
                            alt="Preview" 
                            style={{maxWidth: '100%', maxHeight: '200px', borderRadius: '6px', objectFit: 'cover'}}
                          />
                        </div>
                      </div>
                    )}
                    {technicalDetailsModal.design_file_url && (
                      <div>
                        <strong>Layout File:</strong>
                        <div style={{marginTop: '8px', padding: '8px', background: '#fff', borderRadius: '6px', border: '1px solid #dee2e6'}}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <span style={{fontSize: '1.5rem'}}>
                              {technicalDetailsModal.design_file_url.toLowerCase().endsWith('.pdf') ? '📄' :
                               technicalDetailsModal.design_file_url.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/) ? '🖼️' :
                               technicalDetailsModal.design_file_url.toLowerCase().match(/\.(dwg|dxf)$/) ? '📐' :
                               technicalDetailsModal.design_file_url.toLowerCase().match(/\.(skp|3dm|obj|stl)$/) ? '🏗️' : '📎'}
                            </span>
                            <div>
                              <div style={{fontWeight: '500'}}>{technicalDetailsModal.design_file_url.split('/').pop()}</div>
                              <a href={technicalDetailsModal.design_file_url} target="_blank" rel="noreferrer" style={{fontSize: '0.8rem', color: '#3b82f6'}}>View File</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn btn-primary" onClick={() => setTechnicalDetailsModal(null)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Image/File Viewer Modal */}
      <ImageViewer viewer={viewer} setViewer={setViewer} />
    </div>
  );
};

// Request Item Component
const RequestItem = ({ request, onAssignArchitect, onRemove, showContractorInfo = false }) => {
  const [showDetails, setShowDetails] = React.useState(false);
  return (
    <div className="list-item">
      <div className="item-icon">
        {request.layout_type === 'library' 
          ? '📚' 
          : ((Number(request?.accepted_count) > 0 || request?.status === 'approved' || request?.status === 'accepted') ? '✅' : (request.status === 'rejected' ? '❌' : '⏳'))}
      </div>
      <div className="item-content">
        <h4 className="item-title">
          {request.layout_type === 'library' 
            ? `Library Layout: ${request.selected_layout_title || 'Selected Layout'}` 
            : `Custom Layout Request - ${request.plot_size} sq ft`
          }
        </h4>
        <p className="item-subtitle">
          Budget: {request.budget_range}
          {request.layout_type === 'library' && request.selected_layout_type && (
            <span className="layout-type-badge"> • {request.selected_layout_type}</span>
          )}
        </p>
        <p className="item-meta">
          Submitted: {new Date(request.created_at).toLocaleDateString()}
          {request.location && ` • ${request.location}`}
          • Designs: {request.design_count} • Proposals: {request.proposal_count}
        </p>
        <div className="status-row">
          <span className="status-chip">Sent: {request.sent_count || 0}</span>
          <span className="status-chip success">Accepted: {request.accepted_count || 0}</span>
          <span className="status-chip danger">Rejected: {request.rejected_count || 0}</span>
        </div>
        {showContractorInfo && (
          <div className="contractor-info" style={{ marginTop: '8px', padding: '8px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontWeight: '600', color: '#374151' }}>Contractor Assignments</span>
              <span className="status-chip" style={{ background: '#dbeafe', color: '#1e40af' }}>
                {request.assignment_count || 0} assigned
              </span>
            </div>
            {request.assigned_contractors && request.assigned_contractors.length > 0 ? (
              <div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Assigned Contractors:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {request.assigned_contractors.map((contractor, index) => (
                    <span key={index} className="status-chip" style={{ background: '#ecfdf5', color: '#065f46' }}>
                      {contractor}
                    </span>
                  ))}
                </div>
                {request.assignment_statuses && request.assignment_statuses.length > 0 && (
                  <div style={{ marginTop: '4px', fontSize: '12px', color: '#6b7280' }}>
                    Status: {request.assignment_statuses.join(', ')}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ fontSize: '14px', color: '#6b7280', fontStyle: 'italic' }}>
                No contractors assigned yet
              </div>
            )}
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
              Proposals received: {request.proposal_count || 0}
            </div>
          </div>
        )}
        {/* Minimal homeowner view: hide requirements & large preview */}
        {showDetails && (
          <div className="details-panel" style={{ marginTop:10, padding:12, border:'1px solid #e5e7eb', borderRadius:8, background:'#fafafa' }}>
            <div className="grid-2" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <div>
                <div className="muted" style={{ fontSize:12, color:'#666' }}>Request Type</div>
                <div style={{ fontWeight:600 }}>{request.layout_type === 'library' ? 'Library Layout' : 'Custom Request'}</div>
              </div>
              <div>
                <div className="muted" style={{ fontSize:12, color:'#666' }}>Plot Size</div>
                <div style={{ fontWeight:600 }}>{request.plot_size || '-'}</div>
              </div>
              <div>
                <div className="muted" style={{ fontSize:12, color:'#666' }}>Budget Range</div>
                <div style={{ fontWeight:600 }}>{request.budget_range || '-'}</div>
              </div>
              <div>
                <div className="muted" style={{ fontSize:12, color:'#666' }}>Location</div>
                <div style={{ fontWeight:600 }}>{request.location || '-'}</div>
              </div>
              <div>
                <div className="muted" style={{ fontSize:12, color:'#666' }}>Timeline</div>
                <div style={{ fontWeight:600 }}>{request.timeline || '-'}</div>
              </div>
              {request.layout_type === 'library' && (
                <div style={{ gridColumn:'1 / -1' }}>
                  <div className="muted" style={{ fontSize:12, color:'#666' }}>Selected Layout</div>
                  <div style={{ fontWeight:600 }}>{request.selected_layout_title || 'Selected Layout'}</div>
                </div>
              )}
              {request.layout_type === 'library' && (request.selected_layout_architect_name || request.selected_layout_architect_email) && (
                <div style={{ gridColumn:'1 / -1', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  {request.selected_layout_architect_name && (
                    <div><strong>Architect:</strong> {request.selected_layout_architect_name}</div>
                  )}
                  {request.selected_layout_architect_email && (
                    <div><strong>Email:</strong> {request.selected_layout_architect_email}</div>
                  )}
                </div>
              )}
              {request.requirements && (
                <div style={{ gridColumn:'1 / -1' }}>
                  <NeatJsonCard raw={request.requirements} title="Requirements" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="item-actions" style={{ position:'relative' }}>
        {(() => { const derivedStatus = (Number(request?.accepted_count) > 0 || request?.status === 'approved' || request?.status === 'accepted') ? 'accepted' : request?.status; return (
          <span className={`status-badge ${badgeClass(derivedStatus)}`}>
            {derivedStatus === 'deleted' ? 'Deleted' : formatStatus(derivedStatus)}
          </span>
        ); })()}
        <button className="btn btn-secondary" onClick={() => setShowDetails(s => !s)}>{showDetails ? 'Hide Details' : 'View Details'}</button>
        <button 
          className="btn btn-primary"
          onClick={onAssignArchitect}
          title="Send this request to a selected architect"
        >
          Send to Architect
        </button>
        <button
          className="btn"
          onClick={onRemove}
          title="Remove request"
        >
          Remove
        </button>

      </div>
    </div>
  );
};

// Project Item Component
const ProjectItem = ({ project }) => {
  const [showDetails, setShowDetails] = React.useState(false);
  
  // Calculate days remaining based on start date and estimated duration
  const calculateDaysRemaining = () => {
    const startDate = new Date(project.start_date);
    const duration = project.estimated_duration || 90; // Default to 90 days if not specified
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + duration);
    
    const today = new Date();
    const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    return daysRemaining > 0 ? daysRemaining : 0;
  };
  
  // Progress color based on percentage
  const getProgressColor = () => {
    const progress = project.progress || 0;
    if (progress < 25) return "#ff4d4d";
    if (progress < 50) return "#ffa64d";
    if (progress < 75) return "#4db8ff";
    return "#4dff88";
  };
  
  return (
    <div className="list-item project-item">
      <div className="item-icon">🏗️</div>
      <div className="item-content">
        <h4 className="item-title">{project.project_name}</h4>
        <p className="item-subtitle">Contractor: {project.contractor_name}</p>
        <p className="item-meta">
          Started: {new Date(project.start_date).toLocaleDateString()}
          • Progress: {project.progress || 0}%
        </p>
        
        {/* Progress bar */}
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{
              width: `${project.progress || 0}%`,
              backgroundColor: getProgressColor()
            }}
          ></div>
        </div>
        
        {showDetails && (
          <div className="project-details">
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Budget:</span>
                <span className="detail-value">{project.budget || "Not specified"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Days Remaining:</span>
                <span className="detail-value">{calculateDaysRemaining()}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Location:</span>
                <span className="detail-value">{project.location || "Not specified"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Plot Size:</span>
                <span className="detail-value">{project.plot_size || "Not specified"}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="item-actions">
        <span className={`status-badge ${project.status}`}>
          {project.status}
        </span>
        <div className="button-group">
          <button className="btn btn-secondary" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? "Hide Details" : "Show Details"}
          </button>
          <button className="btn btn-primary">
            View Project
          </button>
        </div>
      </div>
    </div>
  );
};

// Layout Card Component
const LayoutCard = ({ layout, onSelect, onPreview, isImageUrl, isPdfUrl, isModal = false, onSendToContractor, onViewDetails }) => (
  <div className={`layout-card ${isModal ? 'modal-card' : ''}`}>
    <div className="layout-image-container">
      <button type="button" className="layout-image-button" onClick={(e) => { e.stopPropagation(); onPreview(); }} style={{cursor:'zoom-in'}}>
        <img 
          src={layout.image_url || '/images/default-layout.jpg'} 
          alt={layout.title}
          className="layout-card-image"
        />
      </button>
      <div className="layout-overlay">
        <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          {(layout.design_file_url && (isImageUrl(layout.design_file_url) || isPdfUrl(layout.design_file_url))) && (
            <button type="button" className="btn" onClick={(e) => { e.stopPropagation(); onPreview(); }}>View Layout</button>
          )}
          <button type="button" className="btn" onClick={(e) => { e.stopPropagation(); onViewDetails && onViewDetails(layout); }}>View Details</button>
          <button type="button" className="btn" onClick={(e) => { e.stopPropagation(); onSelect(); }}>
            Customize
          </button>
          <button type="button" className="btn btn-primary" onClick={(e) => { e.stopPropagation(); onSendToContractor && onSendToContractor(layout); }}>
            Send to Contractor
          </button>
        </div>
      </div>
    </div>
    <div className="layout-card-content">
      <h4 className="layout-title">{layout.title}</h4>
      <p className="layout-type">{layout.layout_type}</p>
      <div className="layout-specs">
        <span className="spec">🛏️ {layout.bedrooms} BR</span>
        <span className="spec">🚿 {layout.bathrooms} BA</span>
        <span className="spec">📐 {layout.area} sq ft</span>
      </div>
      {layout.architect_name && (
        <p className="layout-author" style={{margin: '6px 0', color: '#555'}}>By {layout.architect_name}</p>
      )}
      {layout.architect_email && (
        <p className="layout-author" style={{margin: '0 0 6px 0', color: '#6b7280'}}>Email: {layout.architect_email}</p>
      )}
      {layout.description && (
        <p className="layout-description">{layout.description}</p>
      )}
      
      {/* Technical Details Preview */}
      {layout.technical_details && (
        <div className="technical-details-preview" style={{marginTop: '12px', padding: '12px', background: '#f8f9fa', borderRadius: '6px', border: '1px solid #e9ecef'}}>
          <h5 style={{margin: '0 0 8px 0', fontSize: '0.9rem', color: '#495057'}}>Technical Specifications</h5>
          <TechnicalDetailsDisplay 
            technicalDetails={layout.technical_details} 
            compact={true}
          />
        </div>
      )}
      
      <div className="layout-price">
        {layout.price_range && (
          <span className="price-range">₹{layout.price_range}</span>
        )}
      </div>
    </div>
  </div>
);

// Image/File Viewer Modal Component
const ImageViewer = ({ viewer, setViewer }) => {
  if (!viewer.open) return null;

  const isImage = /\.(jpg|jpeg|png|gif|webp|svg|heic)$/i.test(viewer.src);
  const isPdf = /\.(pdf)$/i.test(viewer.src);

  return (
    <div 
      className="viewer-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={() => setViewer({ open: false, src: '', title: '' })}
    >
      <div 
        className="viewer-content"
        style={{
          position: 'relative',
          maxWidth: '90vw',
          maxHeight: '90vh',
          backgroundColor: 'white',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="viewer-header"
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f9fafb'
          }}
        >
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#374151' }}>
            {viewer.title}
          </h3>
          <button
            onClick={() => setViewer({ open: false, src: '', title: '' })}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Close viewer"
          >
            ×
          </button>
        </div>
        <div 
          className="viewer-body"
          style={{
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            maxHeight: '70vh',
            overflow: 'auto'
          }}
        >
          {isImage ? (
            <img
              src={viewer.src}
              alt={viewer.title}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: '4px'
              }}
            />
          ) : isPdf ? (
            <iframe
              src={viewer.src}
              style={{
                width: '100%',
                height: '600px',
                border: 'none',
                borderRadius: '4px'
              }}
              title={viewer.title}
            />
          ) : (
            <div style={{ textAlign: 'center', color: '#6b7280' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
              <p style={{ margin: 0, fontSize: '16px' }}>Preview not available</p>
              <a
                href={viewer.src}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  marginTop: '12px',
                  padding: '8px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                Open File
              </a>
            </div>
          )}
        </div>
        <div 
          className="viewer-footer"
          style={{
            padding: '12px 20px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <a
            href={viewer.src}
            download
            style={{
              padding: '8px 16px',
              backgroundColor: '#10b981',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Download
          </a>
          <a
            href={viewer.src}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '8px 16px',
              backgroundColor: '#6b7280',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Open in New Tab
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomeownerDashboard;