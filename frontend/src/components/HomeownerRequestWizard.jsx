import React, { useEffect, useMemo, useState } from 'react';
import Stepper from './wizard/Stepper';
import WizardLayout from './wizard/WizardLayout';
import SearchableDropdown from './SearchableDropdown';
import { indianCities } from '../data/indianCities';

export default function HomeownerRequestWizard() {
  const steps = ['Preliminary', 'Site', 'Family', 'Budget', 'Orientation', 'Materials', 'Preferences', 'Review', 'Architect', 'Submit'];
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    plot_size: '', plot_shape: '', topography: '', development_laws: '',
    family_needs: [], rooms: [], budget_range: '', aesthetic: '', // Changed to arrays for multi-select
    requirements: '', location: '', timeline: '', num_floors: '',
    selected_layout_id: null, layout_type: 'custom',
    selected_architect_ids: [],
    custom_budget: '', // Added for custom budget input
    floor_rooms: {}, // New: floor-wise room planning { floor1: { bedrooms: 2, bathrooms: 1, ... }, floor2: {...} }
    expandedFloors: { 1: true }, // Track which floors are expanded
    room_images: {}, // New: images per room type { bedrooms: [images], kitchen: [images], ... }
    expandedRoomImages: {}, // Track which room image sections are expanded
    // New sections
    orientation: '', // Site orientation preferences
    site_considerations: '', // Additional site considerations
    material_preferences: [], // Material preferences array
    budget_allocation: '', // Budget allocation preferences
    reference_images: [] // Uploaded reference images
  });
  const [loading, setLoading] = useState(false);
  const next = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  // Room types definition - moved to component level for accessibility
  const roomTypes = [
    { key: 'master_bedroom', label: 'Master Bedroom', icon: '👑', short: 'MB', max: 2 },
    { key: 'bedrooms', label: 'Bedrooms', icon: '🛏️', short: 'BR', max: 8 },
    { key: 'attached_bathrooms', label: 'Attached Bathrooms', icon: '🚿', short: 'AB', max: 8 },
    { key: 'common_bathrooms', label: 'Common Bathrooms', icon: '🚽', short: 'CB', max: 6 },
    { key: 'living_room', label: 'Living Room', icon: '🛋️', short: 'LR', max: 3 },
    { key: 'dining_room', label: 'Dining Room', icon: '🍽️', short: 'DR', max: 2 },
    { key: 'kitchen', label: 'Kitchen', icon: '🍳', short: 'K', max: 2 },
    { key: 'study_room', label: 'Study Room', icon: '📚', short: 'SR', max: 3 },
    { key: 'prayer_room', label: 'Prayer Room', icon: '🕉️', short: 'PR', max: 2 },
    { key: 'guest_room', label: 'Guest Room', icon: '🏠', short: 'GR', max: 3 },
    { key: 'store_room', label: 'Store Room', icon: '📦', short: 'STR', max: 4 },
    { key: 'balcony', label: 'Balcony', icon: '🌅', short: 'B', max: 5, excludeFromGroundFloor: true },
    { key: 'terrace', label: 'Terrace', icon: '🏞️', short: 'T', max: 2, excludeFromGroundFloor: true },
    { key: 'garage', label: 'Garage', icon: '🚗', short: 'G', max: 3 },
    { key: 'utility_area', label: 'Utility Area', icon: '🔧', short: 'UA', max: 2 }
  ];

  // Architect directory state (reusing existing backend endpoints/logic)
  const [architects, setArchitects] = useState([]);
  const [archLoading, setArchLoading] = useState(false);
  const [archError, setArchError] = useState('');
  const [archSearch, setArchSearch] = useState('');
  const [archSpec, setArchSpec] = useState('');
  const [archMinExp, setArchMinExp] = useState('');
  const [sortKey, setSortKey] = useState('best');
  // Expanded details and reviews for selected architect
  const [expandedArchitectId, setExpandedArchitectId] = useState(null);
  const [reviewsCache, setReviewsCache] = useState({}); // { [architectId]: { reviews, avg_rating, review_count } }
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Prefill from URL query params when applicable (from library or deep link)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selected_layout_id = params.get('selected_layout_id');
    const layout_type = params.get('layout_type');
    const plot_size = params.get('plot_size');
    const action = params.get('action');
    setData(prev => ({
      ...prev,
      ...(selected_layout_id ? { selected_layout_id } : {}),
      ...(layout_type ? { layout_type } : {}),
      ...(plot_size ? { plot_size } : {})
    }));

    // If deep-linked with action=send_to_contractors and a library layout is present,
    // auto-trigger the fast-path submission to contractors.
    if (action === 'send_to_contractors' && layout_type === 'library' && selected_layout_id) {
      (async () => {
        setLoading(true);
        try {
          const res = await fetch('/buildhub/backend/api/homeowner/submit_request.php', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
              plot_size: plot_size || '',
              budget_range: '',
              requirements: '',
              location: '',
              timeline: '',
              selected_layout_id,
              layout_type: 'library',
              // packed fields (empty for quick send)
              plot_shape: '', topography: '', development_laws: '',
              family_needs: '', rooms: '', aesthetic: '',
              // activate for contractors
              activate_for_contractors: true
            })
          });
          const j = await res.json();
          if (j.success) {
            window.dispatchEvent && window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', message: 'Sent to contractors' } }));
            window.history.back();
          } else {
            alert(j.message || 'Failed to send to contractors');
          }
        } catch (_) { alert('Network error'); }
        finally { setLoading(false); }
      })();
    }
  }, []);

  const sortedArchitects = useMemo(() => {
    const list = [...architects];
    if (sortKey === 'best') {
      list.sort((a, b) => {
        const ar = (a.avg_rating ?? -1);
        const br = (b.avg_rating ?? -1);
        if (br !== ar) return br - ar;
        const ac = (a.review_count ?? 0);
        const bc = (b.review_count ?? 0);
        return bc - ac;
      });
    } else if (sortKey === 'experience') {
      list.sort((a, b) => (b.experience_years ?? -1) - (a.experience_years ?? -1));
    } else if (sortKey === 'recent') {
      list.sort((a, b) => b.id - a.id);
    }
    return list;
  }, [architects, sortKey]);

  const getInitials = (first, last) => {
    const f = (first || '').trim().charAt(0) || '';
    const l = (last || '').trim().charAt(0) || '';
    const init = (f + l).toUpperCase();
    return init || 'A';
  };

  const toggleArchitectDetails = async (architectId) => {
    if (expandedArchitectId === architectId) {
      setExpandedArchitectId(null);
      return;
    }
    setExpandedArchitectId(architectId);
    if (!reviewsCache[architectId]) {
      setReviewsLoading(true);
      try {
        const res = await fetch(`/buildhub/backend/api/reviews/get_reviews.php?architect_id=${architectId}`);
        const json = await res.json();
        if (json.success) {
          setReviewsCache(prev => ({ ...prev, [architectId]: json }));
        }
      } catch (_) {
        // ignore
      } finally {
        setReviewsLoading(false);
      }
    }
  };

  const renderStars = (n) => {
    const rating = Math.max(0, Math.min(5, Number(n) || 0));
    const filled = '★'.repeat(rating);
    const empty = '☆'.repeat(5 - rating);
    return filled + empty;
  };

  const fetchArchitects = async (params = {}) => {
    setArchLoading(true);
    setArchError('');
    try {
      const q = new URLSearchParams({
        ...(params.search ? { search: params.search } : {}),
        ...(params.specialization ? { specialization: params.specialization } : {}),
        ...(params.min_experience ? { min_experience: params.min_experience } : {}),
      }).toString();
      const res = await fetch(`/buildhub/backend/api/homeowner/get_architects.php${q ? `?${q}` : ''}`);
      const json = await res.json();
      if (json.success) setArchitects(json.architects || []); else setArchError(json.message || 'Failed to load architects');
    } catch (e) { setArchError('Error loading architects'); }
    finally { setArchLoading(false); }
  };

  // Auto-load architects when entering the Architect step
  useEffect(() => {
    if (step === 8) fetchArchitects({ search: archSearch, specialization: archSpec, min_experience: archMinExp });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  async function submit() {
    setLoading(true);
    try {
      // 1) Create the layout request
      const res = await fetch('/buildhub/backend/api/homeowner/submit_request.php', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
          plot_size: data.plot_size,
          budget_range: data.budget_range === 'Custom' ? data.custom_budget : data.budget_range,
          requirements: data.requirements,
          location: data.location,
          timeline: data.timeline,
          selected_layout_id: data.selected_layout_id,
          layout_type: data.layout_type,
          // packed structured fields used by backend
          plot_shape: data.plot_shape, topography: data.topography, development_laws: data.development_laws,
          family_needs: Array.isArray(data.family_needs) ? data.family_needs.join(', ') : data.family_needs, 
          rooms: Array.isArray(data.rooms) ? data.rooms.join(', ') : data.rooms, 
          aesthetic: data.aesthetic,
          floor_rooms: JSON.stringify(data.floor_rooms), // Send floor-wise room planning as JSON
          // New fields
          orientation: data.orientation,
          site_considerations: data.site_considerations,
          material_preferences: Array.isArray(data.material_preferences) ? data.material_preferences.join(', ') : data.material_preferences,
          budget_allocation: data.budget_allocation,
          reference_images: data.reference_images || [],
          room_images: data.room_images || {} // Room-specific images
        })
      });
      const json = await res.json();
      if (!json.success) { alert(json.message || 'Failed to submit'); return; }

      const requestId = json.request_id;

      // 2) If user selected architect(s), send assignment(s)
      if (Array.isArray(data.selected_architect_ids) && data.selected_architect_ids.length > 0) {
        try {
          const ares = await fetch('/buildhub/backend/api/homeowner/assign_architect.php', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
              layout_request_id: requestId,
              architect_ids: data.selected_architect_ids,
              message: 'Custom design request from wizard'
            })
          });
          const aj = await ares.json();
          if (!aj.success) console.warn('Architect assignment warning:', aj.message);
        } catch (e) { console.warn('Architect assignment failed'); }
      }

      // Show success message
      window.dispatchEvent && window.dispatchEvent(new CustomEvent('toast', { 
        detail: { 
          type: 'success', 
          message: 'Request submitted successfully! Your custom design request has been created and sent to the selected architects.' 
        } 
      }));
      window.history.back();
    } catch (e) { alert('Network error'); }
    finally { setLoading(false); }
  }

  const header = useMemo(() => ({ title: 'File your Request', subtitle: 'Approx 5–7 minutes' }), []);

  // Helpers
  const toggleArchitect = (id) => {
    setData(prev => {
      const list = new Set(prev.selected_architect_ids || []);
      if (list.has(id)) list.delete(id); else list.add(id);
      return { ...prev, selected_architect_ids: Array.from(list) };
    });
  };

  return (
    <WizardLayout
      title={header.title}
      subtitle={header.subtitle}
      stepper={<Stepper steps={steps} current={step} />}
      onBack={step > 0 ? prev : () => window.history.back()}
      onClose={() => window.history.back()}
    >
      {/* Step content */}
      {step === 0 && (
        <div className="section">
          <div className="section-header">Preliminary</div>
          <div className="section-body grid-2">
            <div className="field">
              <label>Plot Size (sq ft)</label>
              <input type="number" value={data.plot_size} onChange={e=>setData({...data, plot_size:e.target.value})} min={100} />
            </div>
            <div className="field">
              <label>Budget Range (₹)</label>
              <select
                value={data.budget_range}
                onChange={e=>setData({...data, budget_range:e.target.value})}
              >
                <option value="">Select budget range</option>
                <option value="5-10 Lakhs">₹5-10 Lakhs</option>
                <option value="10-20 Lakhs">₹10-20 Lakhs</option>
                <option value="20-30 Lakhs">₹20-30 Lakhs</option>
                <option value="30-50 Lakhs">₹30-50 Lakhs</option>
                <option value="50-75 Lakhs">₹50-75 Lakhs</option>
                <option value="75 Lakhs - 1 Crore">₹75 Lakhs - 1 Crore</option>
                <option value="1-2 Crores">₹1-2 Crores</option>
                <option value="2-5 Crores">₹2-5 Crores</option>
                <option value="5+ Crores">₹5+ Crores</option>
                <option value="Custom">Custom Amount</option>
              </select>
              {data.budget_range === 'Custom' && (
                <input
                  type="number"
                  placeholder="Enter custom budget amount in rupees"
                  value={data.custom_budget || ''}
                  onChange={e=>setData({...data, custom_budget:e.target.value})}
                  min="0"
                  step="10000"
                  style={{marginTop: '8px'}}
                />
              )}
            </div>
          </div>
          <div className="wizard-footer">
            <button className="btn btn-primary" onClick={next}>Next</button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="section">
          <div className="section-header">Site Details</div>
          <div className="section-body grid-2">
            <div className="field">
              <label>Plot Shape</label>
              <select
                value={data.plot_shape}
                onChange={e=>setData({...data, plot_shape:e.target.value})}
              >
                <option value="">Select plot shape</option>
                <option value="Rectangular">Rectangular</option>
                <option value="Square">Square</option>
                <option value="L-shaped">L-shaped</option>
                <option value="U-shaped">U-shaped</option>
                <option value="Triangular">Triangular</option>
                <option value="Irregular">Irregular</option>
                <option value="Corner Plot">Corner Plot</option>
                <option value="Trapezoidal">Trapezoidal</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="field">
              <label>Number of Floors</label>
              <select
                value={data.num_floors}
                onChange={e=>setData({...data, num_floors:e.target.value})}
              >
                <option value="">Select number of floors</option>
                <option value="1">1 Floor (Ground Floor Only)</option>
                <option value="2">2 Floors (G+1)</option>
                <option value="3">3 Floors (G+2)</option>
                <option value="4">4 Floors (G+3)</option>
                <option value="5">5 Floors (G+4)</option>
                <option value="6+">6+ Floors</option>
              </select>
            </div>
          </div>
          <div className="section-body grid-2">
            <div className="field">
              <label>Topography</label>
              <select
                value={data.topography}
                onChange={e=>setData({...data, topography:e.target.value})}
              >
                <option value="">Select topography</option>
                <option value="Flat">Flat</option>
                <option value="Slightly Sloped">Slightly Sloped</option>
                <option value="Moderately Sloped">Moderately Sloped</option>
                <option value="Steeply Sloped">Steeply Sloped</option>
                <option value="Rocky">Rocky</option>
                <option value="Sandy">Sandy</option>
                <option value="Clayey">Clayey</option>
                <option value="Mixed Terrain">Mixed Terrain</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="field">
              <label>Local Development Laws / Restrictions</label>
              <input value={data.development_laws} onChange={e=>setData({...data, development_laws:e.target.value})} placeholder="Setbacks, FSI/FAR, height limits" />
            </div>
          </div>
          <div className="wizard-footer">
            <button className="btn btn-secondary" onClick={prev}>Back</button>
            <button className="btn btn-primary" onClick={next}>Next</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="section">
          <div className="section-header">Family</div>
          <div className="section-body grid-2">
            <div className="field">
              <label>Family Needs</label>
              <div className="interactive-options">
                {[
                  { key: 'Elder-friendly', label: 'Elder-friendly', icon: '👴' },
                  { key: 'Work-from-home', label: 'Work-from-home', icon: '💻' },
                  { key: 'Kids play area', label: 'Kids play area', icon: '🧸' },
                  { key: 'Pet-friendly', label: 'Pet-friendly', icon: '🐕' },
                  { key: 'Wheelchair accessible', label: 'Wheelchair accessible', icon: '♿' },
                  { key: 'Home office', label: 'Home office', icon: '🏢' },
                  { key: 'Guest accommodation', label: 'Guest accommodation', icon: '🛏️' },
                  { key: 'Storage space', label: 'Storage space', icon: '📦' },
                  { key: 'Garden/Outdoor space', label: 'Garden/Outdoor space', icon: '🌿' },
                  { key: 'Security features', label: 'Security features', icon: '🔒' },
                  { key: 'Energy efficient', label: 'Energy efficient', icon: '⚡' },
                  { key: 'Low maintenance', label: 'Low maintenance', icon: '🔧' }
                ].map(option => (
                  <button
                    key={option.key}
                    type="button"
                    className={`interactive-option ${Array.isArray(data.family_needs) && data.family_needs.includes(option.key) ? 'selected' : ''}`}
                    onClick={() => {
                      const currentNeeds = Array.isArray(data.family_needs) ? data.family_needs : [];
                      const newNeeds = currentNeeds.includes(option.key)
                        ? currentNeeds.filter(item => item !== option.key)
                        : [...currentNeeds, option.key];
                      setData({...data, family_needs: newNeeds});
                    }}
                  >
                    <span className="option-icon">{option.icon}</span>
                    <span className="option-label">{option.label}</span>
                    {Array.isArray(data.family_needs) && data.family_needs.includes(option.key) && (
                      <span className="option-check">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label>Room Planning by Floor</label>
              <div className="compact-floor-planning">
                {(() => {
                  const numFloors = parseInt(data.num_floors) || 1;
                  const floors = Array.from({ length: numFloors }, (_, i) => i + 1);

                  return floors.map(floorNum => {
                    const floorKey = `floor${floorNum}`;
                    const isExpanded = data.expandedFloors?.[floorNum] ?? (floorNum === 1); // Expand first floor by default
                    
                    return (
                      <div key={floorNum} className="compact-floor-section">
                        <div 
                          className="floor-header"
                          onClick={() => {
                            setData(prev => ({
                              ...prev,
                              expandedFloors: {
                                ...prev.expandedFloors,
                                [floorNum]: !isExpanded
                              }
                            }));
                          }}
                        >
                          <div className="floor-title">
                            <span className="floor-icon">🏢</span>
                            <span>{floorNum === 1 ? 'Ground Floor' : `Floor ${floorNum}`}</span>
                          </div>
                          <div className="floor-summary">
                            {(() => {
                              const floorData = data.floor_rooms[floorKey] || {};
                              const totalRooms = Object.values(floorData).reduce((sum, count) => sum + count, 0);
                              const roomSummary = Object.entries(floorData)
                                .filter(([_, count]) => count > 0)
                                .map(([roomType, count]) => {
                                  const room = roomTypes.find(r => r.key === roomType);
                                  // Only include rooms that are available for this floor
                                  if (floorNum === 1 && room?.excludeFromGroundFloor) {
                                    return null;
                                  }
                                  return `${room?.short || roomType}: ${count}`;
                                })
                                .filter(Boolean)
                                .join(', ');
                              return totalRooms > 0 ? roomSummary : 'No rooms specified';
                            })()}
                          </div>
                          <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
                        </div>
                        
                        {isExpanded && (
                          <div className="room-planning-grid">
                            <div className="room-planning-header">
                              <span className="room-type-label">Room Type</span>
                              <span className="quantity-label">Quantity</span>
                            </div>
                            {roomTypes
                              .filter(roomType => {
                                // Exclude balcony and terrace from ground floor
                                if (floorNum === 1 && roomType.excludeFromGroundFloor) {
                                  return false;
                                }
                                return true;
                              })
                              .map(roomType => {
                                const currentValue = data.floor_rooms[floorKey]?.[roomType.key] || 0;
                              
                              return (
                                <div key={roomType.key} className="room-planning-item">
                                  <div className="room-info">
                                    <span className="room-icon">{roomType.icon}</span>
                                    <div className="room-details">
                                      <span className="room-name">{roomType.label}</span>
                                      <span className="room-limit">(Max: {roomType.max})</span>
                                    </div>
                                  </div>
                        <div className="quantity-selector">
                          <button
                            type="button"
                            className="quantity-btn decrease"
                            onClick={() => {
                              const newValue = Math.max(0, currentValue - 1);
                              setData(prev => ({
                                ...prev,
                                floor_rooms: {
                                  ...prev.floor_rooms,
                                  [floorKey]: {
                                    ...prev.floor_rooms[floorKey],
                                    [roomType.key]: newValue
                                  }
                                }
                              }));
                            }}
                            disabled={currentValue === 0}
                            title="Decrease quantity"
                          >
                            Remove
                          </button>
                          <div className="quantity-display">
                            <span className="quantity-number">{currentValue}</span>
                            <span className="quantity-text">rooms</span>
                          </div>
                          <button
                            type="button"
                            className="quantity-btn increase"
                            onClick={() => {
                              const newValue = Math.min(roomType.max, currentValue + 1);
                              setData(prev => ({
                                ...prev,
                                floor_rooms: {
                                  ...prev.floor_rooms,
                                  [floorKey]: {
                                    ...prev.floor_rooms[floorKey],
                                    [roomType.key]: newValue
                                  }
                                }
                              }));
                            }}
                            disabled={currentValue >= roomType.max}
                            title="Add more rooms"
                          >
                            Add
                          </button>
                        </div>
                        
                        {/* Room-specific image upload */}
                        <div className="room-image-upload">
                          <input
                            type="file"
                            id={`room-images-${roomType.key}-${floorNum}`}
                            multiple
                            accept="image/*"
                            onChange={(e) => {
                              const files = Array.from(e.target.files);
                              const newImages = files.map(file => ({
                                id: Date.now() + Math.random(),
                                file: file,
                                name: file.name,
                                size: file.size,
                                url: URL.createObjectURL(file)
                              }));
                              setData(prev => ({
                                ...prev,
                                room_images: {
                                  ...prev.room_images,
                                  [roomType.key]: [...(prev.room_images[roomType.key] || []), ...newImages]
                                }
                              }));
                            }}
                            style={{display: 'none'}}
                          />
                          <label 
                            htmlFor={`room-images-${roomType.key}-${floorNum}`} 
                            className="room-image-btn"
                            title={`Upload reference images for ${roomType.label}`}
                          >
                            <span className="room-image-icon">📷</span>
                            <span className="room-image-text">Add Images</span>
                          </label>
                          
                          {/* Show uploaded images count and manage button */}
                          {data.room_images[roomType.key] && data.room_images[roomType.key].length > 0 && (
                            <div className="room-images-count">
                              <span>{data.room_images[roomType.key].length} image(s)</span>
                              <button
                                type="button"
                                className="manage-images-btn"
                                onClick={() => {
                                  // Toggle expanded state for this room type
                                  setData(prev => ({
                                    ...prev,
                                    expandedRoomImages: {
                                      ...prev.expandedRoomImages,
                                      [roomType.key]: !prev.expandedRoomImages?.[roomType.key]
                                    }
                                  }));
                                }}
                              >
                                {data.expandedRoomImages?.[roomType.key] ? 'Hide' : 'Manage'}
                              </button>
                            </div>
                          )}
                        </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
          <div className="wizard-footer">
            <button className="btn btn-secondary" onClick={prev}>Back</button>
            <button className="btn btn-primary" onClick={next}>Next</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="section">
          <div className="section-header">Budget & Timeline</div>
          <div className="section-body grid-2">
            <div className="field">
              <label>Location</label>
              <SearchableDropdown
                options={indianCities}
                value={data.location}
                onChange={(value) => setData({...data, location: value})}
                placeholder="Search for a city..."
              />
            </div>
            <div className="field">
              <label>Timeline</label>
              <select value={data.timeline} onChange={e=>setData({...data, timeline:e.target.value})}>                <option value="">Select</option>
                <option value="0-6 months">0-6 months</option>
                <option value="6-12 months">6-12 months</option>
                <option value="12-18 months">12-18 months</option>
                <option value="18-24 months">18-24 months</option>
              </select>
            </div>
          </div>
          <div className="wizard-footer">
            <button className="btn btn-secondary" onClick={prev}>Back</button>
            <button className="btn btn-primary" onClick={next}>Next</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="section">
          <div className="section-header">Orientation & Site Considerations</div>
          <div className="section-body grid-2">
            <div className="field">
              <label>Preferred Orientation</label>
              <select
                value={data.orientation}
                onChange={e=>setData({...data, orientation:e.target.value})}
              >
                <option value="">Select preferred orientation</option>
                <option value="North-facing">North-facing (Best for natural light)</option>
                <option value="South-facing">South-facing (Good for warmth)</option>
                <option value="East-facing">East-facing (Morning sun)</option>
                <option value="West-facing">West-facing (Evening sun)</option>
                <option value="North-East">North-East (Balanced light)</option>
                <option value="North-West">North-West (Balanced light)</option>
                <option value="South-East">South-East (Morning & afternoon sun)</option>
                <option value="South-West">South-West (Afternoon & evening sun)</option>
                <option value="No preference">No specific preference</option>
              </select>
            </div>
            <div className="field">
              <label>Site Considerations</label>
              <textarea 
                rows={4} 
                value={data.site_considerations} 
                onChange={e=>setData({...data, site_considerations:e.target.value})} 
                placeholder="Any specific site considerations: views, privacy, noise, access, etc."
              />
            </div>
          </div>
          <div className="wizard-footer">
            <button className="btn btn-secondary" onClick={prev}>Back</button>
            <button className="btn btn-primary" onClick={next}>Next</button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="section">
          <div className="section-header">Budget & Material Preferences</div>
          <div className="section-body grid-2">
            <div className="field">
              <label>Budget Allocation Preference</label>
              <select
                value={data.budget_allocation}
                onChange={e=>setData({...data, budget_allocation:e.target.value})}
              >
                <option value="">Select budget allocation preference</option>
                <option value="Quality over quantity">Quality over quantity (Premium materials)</option>
                <option value="Balanced approach">Balanced approach (Good quality, reasonable cost)</option>
                <option value="Cost-effective">Cost-effective (Budget-friendly materials)</option>
                <option value="Eco-friendly focus">Eco-friendly focus (Sustainable materials)</option>
                <option value="Luxury finish">Luxury finish (High-end materials throughout)</option>
                <option value="Mixed approach">Mixed approach (Premium in key areas, standard elsewhere)</option>
              </select>
            </div>
            <div className="field">
              <label>Material Preferences</label>
              <div className="interactive-options">
                {[
                  { key: 'Marble', label: 'Marble', icon: '🏛️' },
                  { key: 'Granite', label: 'Granite', icon: '🪨' },
                  { key: 'Wood', label: 'Wood', icon: '🪵' },
                  { key: 'Ceramic Tiles', label: 'Ceramic Tiles', icon: '🔲' },
                  { key: 'Vitrified Tiles', label: 'Vitrified Tiles', icon: '⬜' },
                  { key: 'Natural Stone', label: 'Natural Stone', icon: '🗿' },
                  { key: 'Glass', label: 'Glass', icon: '🪟' },
                  { key: 'Steel', label: 'Steel', icon: '🔩' },
                  { key: 'Concrete', label: 'Concrete', icon: '🏗️' },
                  { key: 'Brick', label: 'Brick', icon: '🧱' },
                  { key: 'Eco-friendly', label: 'Eco-friendly Materials', icon: '🌱' },
                  { key: 'Smart Materials', label: 'Smart Materials', icon: '🤖' }
                ].map(option => (
                  <button
                    key={option.key}
                    type="button"
                    className={`interactive-option ${Array.isArray(data.material_preferences) && data.material_preferences.includes(option.key) ? 'selected' : ''}`}
                    onClick={() => {
                      const currentMaterials = Array.isArray(data.material_preferences) ? data.material_preferences : [];
                      const newMaterials = currentMaterials.includes(option.key)
                        ? currentMaterials.filter(item => item !== option.key)
                        : [...currentMaterials, option.key];
                      setData({...data, material_preferences: newMaterials});
                    }}
                  >
                    <span className="option-icon">{option.icon}</span>
                    <span className="option-label">{option.label}</span>
                    {Array.isArray(data.material_preferences) && data.material_preferences.includes(option.key) && (
                      <span className="option-check">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="wizard-footer">
            <button className="btn btn-secondary" onClick={prev}>Back</button>
            <button className="btn btn-primary" onClick={next}>Next</button>
          </div>
        </div>
      )}


      {step === 6 && (
        <div className="section">
          <div className="section-header">Preferences</div>
          <div className="section-body grid-2">
            <div className="field">
              <label>House Aesthetic / Style</label>
              <select
                value={data.aesthetic}
                onChange={e=>setData({...data, aesthetic:e.target.value})}
              >
                <option value="">Select house style</option>
                <option value="Modern">Modern</option>
                <option value="Contemporary">Contemporary</option>
                <option value="Traditional">Traditional</option>
                <option value="Minimalist">Minimalist</option>
                <option value="Luxury">Luxury</option>
                <option value="Mediterranean">Mediterranean</option>
                <option value="Colonial">Colonial</option>
                <option value="Victorian">Victorian</option>
                <option value="Art Deco">Art Deco</option>
                <option value="Scandinavian">Scandinavian</option>
                <option value="Industrial">Industrial</option>
                <option value="Rustic">Rustic</option>
                <option value="Farmhouse">Farmhouse</option>
                <option value="Craftsman">Craftsman</option>
                <option value="Tudor">Tudor</option>
                <option value="Ranch">Ranch</option>
                <option value="Cape Cod">Cape Cod</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="field">
              <label>Additional Notes</label>
              <textarea rows={4} value={data.requirements} onChange={e=>setData({...data, requirements:e.target.value})} placeholder="Other preferences or constraints" />
            </div>
          </div>
          <div className="wizard-footer">
            <button className="btn btn-secondary" onClick={prev}>Back</button>
            <button className="btn btn-primary" onClick={next}>Next</button>
          </div>
        </div>
      )}

      {step === 7 && (
        <div className="section">
          <div className="section-header">Review</div>
          <div className="section-body">
            <div 
              className="review-grid"
              style={{
                display: 'grid',
                gap: 12,
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))'
              }}
            >
              {/* Overview */}
              <div className="review-card" style={{ background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:12, padding:16, boxShadow:'0 1px 2px rgba(0,0,0,0.04)'}}>
                <div className="review-title" style={{ fontWeight:600, marginBottom:8 }}>Overview</div>
                <div className="review-row" style={{ display:'flex', justifyContent:'space-between', padding:'6px 0' }}>
                  <span>Plot Size</span><strong>{data.plot_size || 'N/A'}</strong>
                </div>
                <div className="review-row" style={{ display:'flex', justifyContent:'space-between', padding:'6px 0' }}>
                  <span>Budget</span><strong>{data.budget_range === 'Custom' ? data.custom_budget : (data.budget_range || 'N/A')}</strong>
                </div>
                <div className="review-row" style={{ display:'flex', justifyContent:'space-between', padding:'6px 0' }}>
                  <span>Location</span><strong>{data.location || 'N/A'}</strong>
                </div>
                <div className="review-row" style={{ display:'flex', justifyContent:'space-between', padding:'6px 0' }}>
                  <span>Timeline</span><strong>{data.timeline || 'N/A'}</strong>
                </div>
                <div className="review-row" style={{ display:'flex', justifyContent:'space-between', padding:'6px 0' }}>
                  <span>Number of Floors</span><strong>{data.num_floors || 'N/A'}</strong>
                </div>
                <div className="review-row" style={{ display:'flex', justifyContent:'space-between', padding:'6px 0' }}>
                  <span>Layout Type</span><strong style={{ textTransform:'capitalize' }}>{data.layout_type || 'custom'}</strong>
                </div>
              </div>

              {/* Site Details */}
              <div className="review-card" style={{ background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:12, padding:16, boxShadow:'0 1px 2px rgba(0,0,0,0.04)'}}>
                <div className="review-title" style={{ fontWeight:600, marginBottom:8 }}>Site Details</div>
                <div className="review-row" style={{ display:'flex', justifyContent:'space-between', padding:'6px 0' }}>
                  <span>Plot Shape</span><strong>{data.plot_shape || 'N/A'}</strong>
                </div>
                <div className="review-row" style={{ display:'flex', justifyContent:'space-between', padding:'6px 0' }}>
                  <span>Topography</span><strong>{data.topography || 'N/A'}</strong>
                </div>
                <div className="review-row" style={{ display:'flex', justifyContent:'space-between', padding:'6px 0' }}>
                  <span>Development Laws</span><strong>{data.development_laws || 'N/A'}</strong>
                </div>
              </div>

              {/* Family */}
            <div className="review-card" style={{ background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:12, padding:16, boxShadow:'0 1px 2px rgba(0,0,0,0.04)'}}>
              <div className="review-title" style={{ fontWeight:600, marginBottom:8 }}>Family</div>
              <div className="review-row" style={{ display:'flex', justifyContent:'space-between', padding:'6px 0' }}>
                <span>Family Needs</span><strong>{Array.isArray(data.family_needs) && data.family_needs.length > 0 ? data.family_needs.join(', ') : 'N/A'}</strong>
              </div>
              <div className="review-row" style={{ display:'flex', justifyContent:'space-between', padding:'6px 0' }}>
                <span>Rooms</span><strong>{Array.isArray(data.rooms) && data.rooms.length > 0 ? data.rooms.join(', ') : 'N/A'}</strong>
              </div>
            </div>

            <div className="review-card" style={{ background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:12, padding:16, boxShadow:'0 1px 2px rgba(0,0,0,0.04)'}}>
              <div className="review-title" style={{ fontWeight:600, marginBottom:8 }}>Orientation & Site</div>
              <div className="review-row" style={{ display:'flex', justifyContent:'space-between', padding:'6px 0' }}>
                <span>Orientation</span><strong>{data.orientation || 'N/A'}</strong>
              </div>
              <div className="review-row" style={{ display:'flex', justifyContent:'space-between', padding:'6px 0' }}>
                <span>Site Considerations</span><strong>{data.site_considerations || 'N/A'}</strong>
              </div>
            </div>

            <div className="review-card" style={{ background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:12, padding:16, boxShadow:'0 1px 2px rgba(0,0,0,0.04)'}}>
              <div className="review-title" style={{ fontWeight:600, marginBottom:8 }}>Materials & Budget</div>
              <div className="review-row" style={{ display:'flex', justifyContent:'space-between', padding:'6px 0' }}>
                <span>Budget Allocation</span><strong>{data.budget_allocation || 'N/A'}</strong>
              </div>
              <div className="review-row" style={{ display:'flex', justifyContent:'space-between', padding:'6px 0' }}>
                <span>Material Preferences</span><strong>{Array.isArray(data.material_preferences) && data.material_preferences.length > 0 ? data.material_preferences.join(', ') : 'N/A'}</strong>
              </div>
            </div>

            {data.reference_images && data.reference_images.length > 0 && (
              <div className="review-card" style={{ background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:12, padding:16, boxShadow:'0 1px 2px rgba(0,0,0,0.04)'}}>
                <div className="review-title" style={{ fontWeight:600, marginBottom:8 }}>General Reference Images</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
                  {data.reference_images.map((image, index) => (
                    <div key={image.id} style={{ textAlign: 'center' }}>
                      <img 
                        src={image.url} 
                        alt={image.name}
                        style={{ 
                          width: '100%', 
                          height: '80px', 
                          objectFit: 'cover', 
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb'
                        }}
                      />
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                        {image.name.length > 15 ? image.name.substring(0, 15) + '...' : image.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Room-specific Images */}
            {data.room_images && Object.keys(data.room_images).length > 0 && (
              <div className="review-card" style={{ background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:12, padding:16, boxShadow:'0 1px 2px rgba(0,0,0,0.04)'}}>
                <div className="review-title" style={{ fontWeight:600, marginBottom:8 }}>Room-Specific Reference Images</div>
                {Object.entries(data.room_images).map(([roomTypeKey, images]) => {
                  if (!images || images.length === 0) return null;
                  
                  const roomType = roomTypes.find(r => r.key === roomTypeKey);
                  
                  return (
                    <div key={roomTypeKey} style={{ marginBottom: '16px' }}>
                      <div style={{ fontWeight: '600', marginBottom: '8px', color: '#374151', fontSize: '14px' }}>
                        {roomType?.icon} {roomType?.label} ({images.length} images)
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '6px' }}>
                        {images.map((image, index) => (
                          <div key={image.id} style={{ textAlign: 'center' }}>
                            <img 
                              src={image.url} 
                              alt={image.name}
                              style={{ 
                                width: '100%', 
                                height: '60px', 
                                objectFit: 'cover', 
                                borderRadius: '4px',
                                border: '1px solid #e5e7eb'
                              }}
                            />
                            <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>
                              {image.name.length > 12 ? image.name.substring(0, 12) + '...' : image.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

              {/* Floor-wise Room Planning */}
              <div className="review-card" style={{ background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:12, padding:16, boxShadow:'0 1px 2px rgba(0,0,0,0.04)'}}>
                <div className="review-title" style={{ fontWeight:600, marginBottom:8 }}>Room Planning by Floor</div>
                {(() => {
                  const numFloors = parseInt(data.num_floors) || 1;
                  const floors = Array.from({ length: numFloors }, (_, i) => i + 1);
                  
                  return floors.map(floorNum => {
                    const floorKey = `floor${floorNum}`;
                    const floorData = data.floor_rooms[floorKey] || {};
                    const hasRooms = Object.values(floorData).some(count => count > 0);
                    
                    if (!hasRooms) return null;
                    
                    return (
                      <div key={floorNum} style={{ marginBottom: '12px', padding: '8px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                        <div style={{ fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
                          {floorNum === 1 ? 'Ground Floor' : `Floor ${floorNum}`}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '4px' }}>
                          {Object.entries(floorData).map(([roomType, count]) => {
                            if (count === 0) return null;
                            return (
                              <div key={roomType} style={{ fontSize: '12px', color: '#6b7280' }}>
                                {roomType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}: {count}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  });
                })()}
                {Object.keys(data.floor_rooms).length === 0 && (
                  <div style={{ color: '#6b7280', fontSize: '14px' }}>No room planning specified</div>
                )}
              </div>

              {/* Preferences */}
              <div className="review-card" style={{ background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:12, padding:16, boxShadow:'0 1px 2px rgba(0,0,0,0.04)'}}>
                <div className="review-title" style={{ fontWeight:600, marginBottom:8 }}>Preferences</div>
                <div className="review-row" style={{ display:'flex', justifyContent:'space-between', padding:'6px 0' }}>
                  <span>Aesthetic / Style</span><strong>{data.aesthetic || 'N/A'}</strong>
                </div>
                <div className="review-row" style={{ display:'flex', justifyContent:'space-between', padding:'6px 0' }}>
                  <span>Additional Notes</span>
                  <div style={{ maxWidth: '60%', textAlign:'right', color:'#374151' }}>
                    {data.requirements || '—'}
                  </div>
                </div>
              </div>

              {/* Architect Selection */}
              <div className="review-card" style={{ background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:12, padding:16, boxShadow:'0 1px 2px rgba(0,0,0,0.04)'}}>
                <div className="review-title" style={{ fontWeight:600, marginBottom:8 }}>Architects</div>
                <div className="review-row" style={{ display:'flex', justifyContent:'space-between', padding:'6px 0' }}>
                  <span>Selected</span>
                  <strong>{Array.isArray(data.selected_architect_ids) ? data.selected_architect_ids.length : 0}</strong>
                </div>
              </div>
            </div>
          </div>
          <div className="wizard-footer">
            <button className="btn btn-secondary" onClick={prev}>Back</button>
            <div style={{display:'flex', gap:8}}>
              {data.layout_type === 'library' && data.selected_layout_id ? (
                <button className="btn" onClick={()=>{
                  // Fast path: send to contractors (only for library layouts)
                  setLoading(true);
                  fetch('/buildhub/backend/api/homeowner/submit_request.php', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
                      plot_size: data.plot_size,
                      budget_range: data.budget_range === 'Custom' ? data.custom_budget : data.budget_range,
                      requirements: data.requirements,
                      location: data.location,
                      timeline: data.timeline,
                      selected_layout_id: data.selected_layout_id,
                      layout_type: 'library',
                      // packed fields
                      plot_shape: data.plot_shape, topography: data.topography, development_laws: data.development_laws,
                      family_needs: Array.isArray(data.family_needs) ? data.family_needs.join(', ') : data.family_needs, 
                      rooms: Array.isArray(data.rooms) ? data.rooms.join(', ') : data.rooms, 
                      aesthetic: data.aesthetic,
                      floor_rooms: JSON.stringify(data.floor_rooms), // Send floor-wise room planning as JSON
                      // activate for contractors
                      activate_for_contractors: true
                    })
                  }).then(r=>r.json()).then(j=>{
                    if (j.success) {
                      window.dispatchEvent && window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', message: 'Sent to contractors' } }));
                      window.history.back();
                    } else {
                      alert(j.message || 'Failed to send to contractors');
                    }
                  }).catch(()=>alert('Network error')).finally(()=>setLoading(false));
                }}>Send to Contractors</button>
              ) : null}
              <button className="btn btn-primary" onClick={next}>Customize with Architect</button>
            </div>
          </div>
          
          {/* Room Images Management */}
          {data.room_images && Object.keys(data.room_images).length > 0 && (
            <div className="field" style={{ marginTop: '24px' }}>
              <label>Room-Specific Images</label>
              <div className="room-images-management">
                {Object.entries(data.room_images).map(([roomTypeKey, images]) => {
                  if (!images || images.length === 0) return null;
                  
                  const roomType = roomTypes.find(r => r.key === roomTypeKey);
                  const isExpanded = data.expandedRoomImages?.[roomTypeKey];
                  
                  return (
                    <div key={roomTypeKey} className="room-images-section">
                      <div className="room-images-header">
                        <span className="room-images-title">
                          {roomType?.icon} {roomType?.label} Images ({images.length})
                        </span>
                        <button
                          type="button"
                          className="toggle-images-btn"
                          onClick={() => {
                            setData(prev => ({
                              ...prev,
                              expandedRoomImages: {
                                ...prev.expandedRoomImages,
                                [roomTypeKey]: !prev.expandedRoomImages?.[roomTypeKey]
                              }
                            }));
                          }}
                        >
                          {isExpanded ? '▼' : '▶'}
                        </button>
                      </div>
                      
                      {isExpanded && (
                        <div className="room-images-grid">
                          {images.map((image, index) => (
                            <div key={image.id} className="room-image-item">
                              <img src={image.url} alt={image.name} />
                              <div className="room-image-info">
                                <span className="room-image-name">{image.name}</span>
                                <span className="room-image-size">{(image.size / 1024 / 1024).toFixed(1)} MB</span>
                              </div>
                              <button
                                type="button"
                                className="remove-room-image-btn"
                                onClick={() => {
                                  setData(prev => ({
                                    ...prev,
                                    room_images: {
                                      ...prev.room_images,
                                      [roomTypeKey]: prev.room_images[roomTypeKey].filter(img => img.id !== image.id)
                                    }
                                  }));
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Reference Images Section */}
          <div className="field" style={{ marginTop: '24px' }}>
            <label>Reference Images for Architect</label>
            <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '16px'}}>
              Upload images that show your preferred style, layout, or specific features you'd like in your home. 
              This helps architects understand your vision better.
            </p>
            <div className="image-upload-area">
              <input
                type="file"
                id="reference-images"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  const newImages = files.map(file => ({
                    id: Date.now() + Math.random(),
                    file: file,
                    name: file.name,
                    size: file.size,
                    url: URL.createObjectURL(file)
                  }));
                  setData(prev => ({
                    ...prev,
                    reference_images: [...(prev.reference_images || []), ...newImages]
                  }));
                }}
                style={{display: 'none'}}
              />
              <label htmlFor="reference-images" className="upload-button">
                <span className="upload-icon">📷</span>
                <span>Choose Images</span>
              </label>
            </div>
            
            {data.reference_images && data.reference_images.length > 0 && (
              <div className="uploaded-images">
                <h4 style={{margin: '16px 0 8px 0', fontSize: '14px', fontWeight: '600'}}>Uploaded Images:</h4>
                <div className="image-grid">
                  {data.reference_images.map((image, index) => (
                    <div key={image.id} className="image-item">
                      <img src={image.url} alt={image.name} />
                      <div className="image-info">
                        <span className="image-name">{image.name}</span>
                        <span className="image-size">{(image.size / 1024 / 1024).toFixed(1)} MB</span>
                      </div>
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => {
                          setData(prev => ({
                            ...prev,
                            reference_images: prev.reference_images.filter(img => img.id !== image.id)
                          }));
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {step === 8 && (
        <div className="section">
          <div className="section-header">Choose Architect</div>
          <div className="section-body">
            <div style={{
              background:'#f8fafc', border:'1px solid #e5e7eb', borderRadius:12, padding:12, marginBottom:12
            }}>
              <div className="grid-3" style={{gap:12}}>
                <div className="field">
                  <label>Search</label>
                  <div style={{ position:'relative' }}>
                    <span style={{ position:'absolute', left:10, top:9 }}>🔍</span>
                    <input 
                      style={{ paddingLeft:30 }}
                      value={archSearch} 
                      onChange={(e)=>setArchSearch(e.target.value)} 
                      placeholder="Name, email, city" 
                    />
                  </div>
                </div>
                <div className="field">
                  <label>Specialization</label>
                  <input value={archSpec} onChange={(e)=>setArchSpec(e.target.value)} placeholder="Residential, Interiors, etc." />
                </div>
                <div className="field">
                  <label>Min Experience (years)</label>
                  <input type="number" min={0} value={archMinExp} onChange={(e)=>setArchMinExp(e.target.value)} />
                </div>
                <div className="field">
                  <label>Sort by</label>
                  <select value={sortKey} onChange={(e)=>setSortKey(e.target.value)}>
                    <option value="best">Best match</option>
                    <option value="experience">Experience</option>
                    <option value="recent">Recently joined</option>
                  </select>
                </div>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:12 }}>
                <div className="muted" style={{ color:'#6b7280' }}>
                  Selected: {(data.selected_architect_ids || []).length}
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button className="btn btn-secondary" onClick={()=>fetchArchitects({ search: archSearch, specialization: archSpec, min_experience: archMinExp })} disabled={archLoading}>
                    {archLoading ? 'Searching…' : 'Search'}
                  </button>
                  <button className="btn" onClick={()=>{ setArchSearch(''); setArchSpec(''); setArchMinExp(''); fetchArchitects({}); }}>
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {archError && <div className="error" style={{marginBottom:12}}>{archError}</div>}

            <div className="item-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:12 }}>
              {sortedArchitects.map(a => (
                <div key={a.id} className="card" style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:14, display:'flex', flexDirection:'column', gap:10 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:40, height:40, borderRadius:'50%', background:'#e0f2fe', color:'#0369a1', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>
                        {getInitials(a.first_name, a.last_name)}
                      </div>
                      <div>
                        <div style={{ fontWeight:700, fontSize:16 }}>{`${a.first_name || ''} ${a.last_name || ''}`.trim() || `Architect #${a.id}`}</div>
                        <div style={{ color:'#6b7280', fontSize:12 }}>{a.email || ''}</div>
                      </div>
                    </div>
                    <label style={{ display:'flex', alignItems:'center', gap:6, cursor:'pointer' }}>
                      <input
                        type="checkbox"
                        checked={(data.selected_architect_ids || []).includes(a.id)}
                        onChange={()=>toggleArchitect(a.id)}
                      />
                      <span style={{ fontSize:12, color:'#374151' }}>Select</span>
                    </label>
                  </div>

                  <div style={{ display:'flex', alignItems:'center', gap:8, color:'#374151' }}>
                    <span style={{ color:'#f59e0b' }}>{renderStars(a.avg_rating)}</span>
                    <span style={{ fontSize:12 }}>{typeof a.avg_rating === 'number' ? `${a.avg_rating} / 5` : 'No rating yet'}</span>
                    <span style={{ fontSize:12, color:'#6b7280' }}>({a.review_count || 0})</span>
                  </div>

                  <div style={{ display:'flex', gap:8, flexWrap:'wrap', fontSize:12, color:'#6b7280' }}>
                    {a.specialization ? <span style={{ background:'#f3f4f6', padding:'4px 8px', borderRadius:999 }}>#{a.specialization}</span> : null}
                    {typeof a.experience_years === 'number' ? <span style={{ background:'#f3f4f6', padding:'4px 8px', borderRadius:999 }}>{a.experience_years} yrs exp</span> : null}
                    {a.already_assigned ? <span style={{ background:'#d1fae5', color:'#065f46', padding:'4px 8px', borderRadius:999 }}>Already assigned</span> : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleArchitectDetails(a.id)}
                    className="btn"
                    style={{ alignSelf:'flex-start' }}
                    title="View details and reviews"
                  >
                    {expandedArchitectId === a.id ? 'Hide details' : 'View details'}
                  </button>

                  {expandedArchitectId === a.id && (
                    <div style={{ marginTop:4, padding:12, border:'1px solid #e5e7eb', borderRadius:8, background:'#fafafa' }}>
                      <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:8 }}>
                        <div style={{ fontSize:20 }}>{renderStars(a.avg_rating)}</div>
                        <div style={{ color:'#555' }}>{typeof a.avg_rating === 'number' ? `${a.avg_rating} / 5` : 'No rating yet'}</div>
                        <div style={{ color:'#888' }}>({a.review_count || 0} reviews)</div>
                      </div>

                      {reviewsLoading && !reviewsCache[a.id] && <div className="muted">Loading reviews…</div>}

                      {reviewsCache[a.id]?.reviews?.length > 0 ? (
                        <div style={{ display:'grid', gap:10 }}>
                          {reviewsCache[a.id].reviews.slice(0,3).map(rv => (
                            <div key={rv.id} style={{ padding:10, background:'#fff', borderRadius:6, border:'1px solid #eee' }}>
                              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                                <div style={{ fontWeight:600 }}>{rv.author || 'Homeowner'}</div>
                                <div style={{ color:'#f59e0b' }}>{renderStars(rv.rating)}</div>
                              </div>
                              <div style={{ color:'#555', whiteSpace:'pre-wrap' }}>{rv.comment}</div>
                              <div style={{ color:'#888', fontSize:12, marginTop:6 }}>{new Date(rv.created_at).toLocaleDateString()}</div>
                            </div>
                          ))}
                          {reviewsCache[a.id].reviews.length > 3 && (
                            <div className="muted" style={{ fontSize:12 }}>Showing recent 3 reviews</div>
                          )}
                        </div>
                      ) : (
                        !reviewsLoading && <div className="muted">No reviews yet</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {sortedArchitects.length === 0 && !archLoading && (
                <div className="empty-state" style={{ gridColumn:'1/-1' }}>
                  <div className="empty-icon">🧑‍🎨</div>
                  <h3>No architects found</h3>
                  <p>Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          </div>
          <div className="wizard-footer">
            <button className="btn btn-secondary" onClick={prev}>Back</button>
            <button className="btn btn-primary" onClick={next}>Next</button>
          </div>
        </div>
      )}

      {step === 9 && (
        <div className="section">
          <div className="section-header">Submit</div>
          <div className="section-body">
            <p className="muted">Your request will be created and sent to the selected architect(s): {
              (() => {
                const ids = data.selected_architect_ids || [];
                if (!ids.length) return 'None selected';
                const names = ids.map(id => {
                  const a = architects.find(x => x.id === id);
                  if (!a) return `Architect #${id}`;
                  const name = `${a.first_name || ''} ${a.last_name || ''}`.trim();
                  return name || `Architect #${id}`;
                });
                return names.join(', ');
              })()
            }</p>
          </div>
          <div className="wizard-footer">
            <button className="btn btn-secondary" onClick={prev}>Back</button>
            <button className="btn btn-primary" disabled={loading} onClick={submit}>{loading ? 'Submitting...' : 'Submit Request'}</button>
          </div>
        </div>
      )}
    </WizardLayout>
  );
}