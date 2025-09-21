import React, { useEffect, useMemo, useState } from 'react';
import Stepper from './wizard/Stepper';
import WizardLayout from './wizard/WizardLayout';
import SearchableDropdown from './SearchableDropdown';
import { indianCities } from '../data/indianCities';

export default function HomeownerRequestWizard() {
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

  const steps = ['Preliminary', 'Site', 'Family', 'Budget', 'Preferences', 'Review', 'Architect', 'Submit'];
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    plot_size: '', plot_shape: '', topography: '', development_laws: '',
    family_needs: '', rooms: '', budget_range: '', aesthetic: '',
    requirements: '', location: '', timeline: '', num_floors: '',
    selected_layout_id: null, layout_type: 'custom',
    selected_architect_ids: []
  });
  const [loading, setLoading] = useState(false);
  const next = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

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
    if (step === 6) fetchArchitects({ search: archSearch, specialization: archSpec, min_experience: archMinExp });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  async function submit() {
    setLoading(true);
    try {
      // 1) Create the layout request
      const res = await fetch('/buildhub/backend/api/homeowner/submit_request.php', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
          plot_size: data.plot_size,
          budget_range: data.budget_range,
          requirements: data.requirements,
          location: data.location,
          timeline: data.timeline,
          selected_layout_id: data.selected_layout_id,
          layout_type: data.layout_type,
          // packed structured fields used by backend
          plot_shape: data.plot_shape, topography: data.topography, development_laws: data.development_laws,
          family_needs: data.family_needs, rooms: data.rooms, aesthetic: data.aesthetic,
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
              <label>Budget (₹)</label>
              <input 
                type="number" 
                placeholder="Enter your budget in rupees" 
                value={data.budget_range} 
                onChange={e=>setData({...data, budget_range:e.target.value})} 
                min="0" 
                step="10000" 
              />
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
              <input value={data.plot_shape} onChange={e=>setData({...data, plot_shape:e.target.value})} placeholder="Rectangular, Square, etc." />
            </div>
            <div className="field">
              <label>Number of Floors</label>
              <input 
                type="number" 
                value={data.num_floors} 
                onChange={e=>setData({...data, num_floors:e.target.value})} 
                placeholder="e.g., 1, 2, 3" 
                min="1" 
              />
            </div>
          </div>
          <div className="section-body grid-2">
            <div className="field">
              <label>Topography</label>
              <input value={data.topography} onChange={e=>setData({...data, topography:e.target.value})} placeholder="Flat, Sloped, Rocky" />
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
              <input value={data.family_needs} onChange={e=>setData({...data, family_needs:e.target.value})} placeholder="Elder-friendly, WFH, Kids play area" />
            </div>
            <div className="field">
              <label>Rooms</label>
              <input value={data.rooms} onChange={e=>setData({...data, rooms:e.target.value})} placeholder="3 Bedrooms, 1 Study" />
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
          <div className="section-header">Preferences</div>
          <div className="section-body grid-2">
            <div className="field">
              <label>House Aesthetic / Style</label>
              <input value={data.aesthetic} onChange={e=>setData({...data, aesthetic:e.target.value})} placeholder="Modern, Traditional, Minimalist" />
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

      {step === 5 && (
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
                  <span>Budget</span><strong>{data.budget_range || 'N/A'}</strong>
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
                  <span>Family Needs</span><strong>{data.family_needs || 'N/A'}</strong>
                </div>
                <div className="review-row" style={{ display:'flex', justifyContent:'space-between', padding:'6px 0' }}>
                  <span>Rooms</span><strong>{data.rooms || 'N/A'}</strong>
                </div>
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
                      budget_range: data.budget_range,
                      requirements: data.requirements,
                      location: data.location,
                      timeline: data.timeline,
                      selected_layout_id: data.selected_layout_id,
                      layout_type: 'library',
                      // packed fields
                      plot_shape: data.plot_shape, topography: data.topography, development_laws: data.development_laws,
                      family_needs: data.family_needs, rooms: data.rooms, aesthetic: data.aesthetic,
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
        </div>
      )}

      {step === 6 && (
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

      {step === 7 && (
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