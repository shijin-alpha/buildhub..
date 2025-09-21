import React, { useState } from 'react';
import InfoPopup from './InfoPopup';

const TechnicalDetailsForm = ({ data, setData, onNext, onPrev }) => {
  const [activeSection, setActiveSection] = useState('floor-plans');

  const sections = [
    { id: 'floor-plans', title: '🏠 Floor Plans & Layout', icon: '🏠' },
    { id: 'site-orientation', title: '🌍 Site & Orientation', icon: '🌍' },
    { id: 'structural', title: '🏗️ Structural Elements', icon: '🏗️' },
    { id: 'elevations', title: '📐 Key Elevations & Sections', icon: '📐' },
    { id: 'construction', title: '📋 Construction Notes', icon: '📋' }
  ];

  const handleNext = () => {
    const currentIndex = sections.findIndex(section => section.id === activeSection);
    if (currentIndex < sections.length - 1) {
      // Go to next internal section
      setActiveSection(sections[currentIndex + 1].id);
    } else {
      // All sections covered, go to next wizard step
      onNext();
    }
  };

  const handlePrev = () => {
    const currentIndex = sections.findIndex(section => section.id === activeSection);
    if (currentIndex > 0) {
      // Go to previous internal section
      setActiveSection(sections[currentIndex - 1].id);
    } else {
      // At first section, go to previous wizard step
      onPrev();
    }
  };

  const updateData = (section, field, value) => {
    console.log('🔍 TechnicalDetailsForm updateData called:', { section, field, value });
    setData(prev => {
      const newData = {
        ...prev,
        technical_details: {
          ...prev.technical_details,
          [section]: {
            ...prev.technical_details?.[section],
            [field]: value
          }
        }
      };
      console.log('🔍 New technical_details data:', newData.technical_details);
      return newData;
    });
  };

  const renderFloorPlansSection = () => (
    <div className="technical-section">
      <h3>🏠 Floor Plans & Layout</h3>
      
      <div className="form-group">
        <label>Floor Plan Layout Description</label>
        <textarea
          rows="4"
          value={data.technical_details?.floor_plans?.layout_description || ''}
          onChange={(e) => updateData('floor_plans', 'layout_description', e.target.value)}
          placeholder="Describe the floor plan layout, room arrangements, and spatial organization..."
        />
      </div>

      <div className="form-group">
        <label>
          Room Dimensions
          <InfoPopup 
            content={
              <div>
                <strong>Default Room Dimensions (ft):</strong><br/>
                • Living Room: 20 × 15 (300 sq ft)<br/>
                • Master Bedroom: 16 × 12 (192 sq ft)<br/>
                • Kitchen: 12 × 10 (120 sq ft)<br/>
                • Bedroom 2: 14 × 12 (168 sq ft)<br/>
                • Bedroom 3: 12 × 10 (120 sq ft)<br/>
                • Bathroom: 8 × 6 (48 sq ft)<br/>
                • Dining Room: 14 × 12 (168 sq ft)<br/>
                <em>Format: Length × Width (e.g., 20 × 15 ft)</em>
              </div>
            }
            position="top"
          >
            <span style={{ marginLeft: '8px', cursor: 'pointer', color: '#6b7280' }}>ℹ️</span>
          </InfoPopup>
        </label>
        <div className="dimensions-grid">
          <div className="dimension-item">
            <label>
              Living Room
              <InfoPopup 
                content="Typical size: 20 × 15 ft (300 sq ft). Minimum: 12 × 10 ft. Consider furniture placement and traffic flow."
                position="top"
              >
                <span style={{ marginLeft: '4px', cursor: 'pointer', color: '#6b7280', fontSize: '12px' }}>ℹ️</span>
              </InfoPopup>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={data.technical_details?.floor_plans?.living_room_dimensions || ''}
                onChange={(e) => updateData('floor_plans', 'living_room_dimensions', e.target.value)}
                placeholder="e.g., 20 × 15 ft"
                style={{ paddingRight: '30px' }}
              />
              <span
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b7280',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  pointerEvents: 'none'
                }}
              >
                ×
              </span>
            </div>
          </div>
          <div className="dimension-item">
            <label>
              Master Bedroom
              <InfoPopup 
                content="Typical size: 16 × 12 ft (192 sq ft). Minimum: 12 × 10 ft. Include space for king bed, dressers, and walk-in closet."
                position="top"
              >
                <span style={{ marginLeft: '4px', cursor: 'pointer', color: '#6b7280', fontSize: '12px' }}>ℹ️</span>
              </InfoPopup>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={data.technical_details?.floor_plans?.master_bedroom_dimensions || ''}
                onChange={(e) => updateData('floor_plans', 'master_bedroom_dimensions', e.target.value)}
                placeholder="e.g., 16 × 12 ft"
                style={{ paddingRight: '30px' }}
              />
              <span
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b7280',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  pointerEvents: 'none'
                }}
              >
                ×
              </span>
            </div>
          </div>
          <div className="dimension-item">
            <label>
              Kitchen
              <InfoPopup 
                content="Typical size: 12 × 10 ft (120 sq ft). Minimum: 8 × 8 ft. Include work triangle: sink, stove, refrigerator."
                position="top"
              >
                <span style={{ marginLeft: '4px', cursor: 'pointer', color: '#6b7280', fontSize: '12px' }}>ℹ️</span>
              </InfoPopup>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={data.technical_details?.floor_plans?.kitchen_dimensions || ''}
                onChange={(e) => updateData('floor_plans', 'kitchen_dimensions', e.target.value)}
                placeholder="e.g., 12 × 10 ft"
                style={{ paddingRight: '30px' }}
              />
              <span
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b7280',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  pointerEvents: 'none'
                }}
              >
                ×
              </span>
            </div>
          </div>
          <div className="dimension-item">
            <label>
              Other Rooms
              <InfoPopup 
                content="Common dimensions: Bedroom 2: 14 × 12 ft, Bedroom 3: 12 × 10 ft, Bathroom: 8 × 6 ft, Dining Room: 14 × 12 ft. Format: Room Name: Length × Width ft"
                position="top"
              >
                <span style={{ marginLeft: '4px', cursor: 'pointer', color: '#6b7280', fontSize: '12px' }}>ℹ️</span>
              </InfoPopup>
            </label>
            <div style={{ position: 'relative' }}>
              <textarea
                rows="3"
                value={data.technical_details?.floor_plans?.other_room_dimensions || ''}
                onChange={(e) => updateData('floor_plans', 'other_room_dimensions', e.target.value)}
                placeholder="Bedroom 2: 14 × 12 ft, Bedroom 3: 12 × 10 ft, Bathroom: 8 × 6 ft..."
                style={{ paddingRight: '30px', resize: 'vertical' }}
              />
              <span
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '10px',
                  color: '#6b7280',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  pointerEvents: 'none'
                }}
              >
                ×
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>Door & Window Positions</label>
        <textarea
          rows="4"
          value={data.technical_details?.floor_plans?.door_window_positions || ''}
          onChange={(e) => updateData('floor_plans', 'door_window_positions', e.target.value)}
          placeholder="Specify door and window locations, sizes, and orientations..."
        />
      </div>

      <div className="form-group">
        <label>Main Circulation Paths</label>
        <textarea
          rows="3"
          value={data.technical_details?.floor_plans?.circulation_paths || ''}
          onChange={(e) => updateData('floor_plans', 'circulation_paths', e.target.value)}
          placeholder="Describe hallways, staircases, and main circulation routes..."
        />
      </div>
    </div>
  );

  const renderSiteOrientationSection = () => (
    <div className="technical-section">
      <h3>🌍 Site & Orientation</h3>
      
      <div className="form-group">
        <label>Plot Boundaries</label>
        <textarea
          rows="3"
          value={data.technical_details?.site_orientation?.plot_boundaries || ''}
          onChange={(e) => updateData('site_orientation', 'plot_boundaries', e.target.value)}
          placeholder="Describe plot boundaries, setbacks, and property lines..."
        />
      </div>

      <div className="form-group">
        <label>Orientation (North Direction)</label>
        <textarea
          rows="3"
          value={data.technical_details?.site_orientation?.orientation || ''}
          onChange={(e) => updateData('site_orientation', 'orientation', e.target.value)}
          placeholder="Specify north direction, solar orientation, and site positioning..."
        />
      </div>

      <div className="form-group">
        <label>Access Points</label>
        <textarea
          rows="3"
          value={data.technical_details?.site_orientation?.access_points || ''}
          onChange={(e) => updateData('site_orientation', 'access_points', e.target.value)}
          placeholder="Describe entrances, driveways, and access routes..."
        />
      </div>
    </div>
  );

  const renderStructuralSection = () => (
    <div className="technical-section">
      <h3>🏗️ Structural Elements</h3>
      
      <div className="form-group">
        <label>Load-bearing Walls</label>
        <textarea
          rows="3"
          value={data.technical_details?.structural?.load_bearing_walls || ''}
          onChange={(e) => updateData('structural', 'load_bearing_walls', e.target.value)}
          placeholder="Identify load-bearing walls and their positions..."
        />
      </div>

      <div className="form-group">
        <label>Column Positions</label>
        <textarea
          rows="3"
          value={data.technical_details?.structural?.column_positions || ''}
          onChange={(e) => updateData('structural', 'column_positions', e.target.value)}
          placeholder="Specify column locations and dimensions..."
        />
      </div>

      <div className="form-group">
        <label>Foundation Outline</label>
        <textarea
          rows="3"
          value={data.technical_details?.structural?.foundation_outline || ''}
          onChange={(e) => updateData('structural', 'foundation_outline', e.target.value)}
          placeholder="Describe foundation layout and specifications..."
        />
      </div>

      <div className="form-group">
        <label>Roof Outline</label>
        <textarea
          rows="3"
          value={data.technical_details?.structural?.roof_outline || ''}
          onChange={(e) => updateData('structural', 'roof_outline', e.target.value)}
          placeholder="Describe roof structure and design..."
        />
      </div>
    </div>
  );

  const renderElevationsSection = () => (
    <div className="technical-section">
      <h3>📐 Key Elevations & Sections</h3>
      
      <div className="form-group">
        <label>Front Elevation</label>
        <textarea
          rows="3"
          value={data.technical_details?.elevations?.front_elevation || ''}
          onChange={(e) => updateData('elevations', 'front_elevation', e.target.value)}
          placeholder="Describe front elevation design and features..."
        />
      </div>

      <div className="form-group">
        <label>Cross Sections</label>
        <textarea
          rows="3"
          value={data.technical_details?.elevations?.cross_sections || ''}
          onChange={(e) => updateData('elevations', 'cross_sections', e.target.value)}
          placeholder="Describe cross-sectional views and details..."
        />
      </div>

      <div className="form-group">
        <label>Height Details</label>
        <textarea
          rows="3"
          value={data.technical_details?.elevations?.height_details || ''}
          onChange={(e) => updateData('elevations', 'height_details', e.target.value)}
          placeholder="Specify floor heights, ceiling heights, and vertical dimensions..."
        />
      </div>
    </div>
  );

  const renderConstructionSection = () => (
    <div className="technical-section">
      <h3>📋 Construction Notes</h3>
      
      <div className="form-group">
        <label>Wall Thickness</label>
        <textarea
          rows="3"
          value={data.technical_details?.construction?.wall_thickness || ''}
          onChange={(e) => updateData('construction', 'wall_thickness', e.target.value)}
          placeholder="Specify wall thickness for different types..."
        />
      </div>

      <div className="form-group">
        <label>Ceiling Heights</label>
        <textarea
          rows="3"
          value={data.technical_details?.construction?.ceiling_heights || ''}
          onChange={(e) => updateData('construction', 'ceiling_heights', e.target.value)}
          placeholder="Specify ceiling heights for different rooms..."
        />
      </div>

      <div className="form-group">
        <label>Building Codes</label>
        <textarea
          rows="3"
          value={data.technical_details?.construction?.building_codes || ''}
          onChange={(e) => updateData('construction', 'building_codes', e.target.value)}
          placeholder="List applicable building codes and compliance requirements..."
        />
      </div>

      <div className="form-group">
        <label>Critical Instructions</label>
        <textarea
          rows="4"
          value={data.technical_details?.construction?.critical_instructions || ''}
          onChange={(e) => updateData('construction', 'critical_instructions', e.target.value)}
          placeholder="Any critical construction instructions, special considerations, or important notes..."
        />
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'floor-plans':
        return renderFloorPlansSection();
      case 'site-orientation':
        return renderSiteOrientationSection();
      case 'structural':
        return renderStructuralSection();
      case 'elevations':
        return renderElevationsSection();
      case 'construction':
        return renderConstructionSection();
      default:
        return renderFloorPlansSection();
    }
  };

  const isSectionComplete = (sectionId) => {
    // All sections are now optional, so they're always considered complete
    return true;
  };

  return (
    <div className="technical-details-form">
      <div className="technical-header">
        <h2>Technical Design Details</h2>
        <p>Provide comprehensive technical information about your architectural design</p>
        <div className="section-progress">
          <span>Section {sections.findIndex(s => s.id === activeSection) + 1} of {sections.length}: {sections.find(s => s.id === activeSection)?.title}</span>
        </div>
      </div>

      <div className="technical-layout">
        <div className="technical-sidebar">
          <div className="section-nav">
            {sections.map(section => (
              <button
                key={section.id}
                className={`section-nav-item ${activeSection === section.id ? 'active' : ''} ${isSectionComplete(section.id) ? 'complete' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="section-icon">{section.icon}</span>
                <span className="section-title">{section.title}</span>
                {isSectionComplete(section.id) && <span className="complete-indicator">✓</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="technical-content">
          {renderSectionContent()}
        </div>
      </div>

      <div className="technical-footer">
        <button className="btn btn-secondary" onClick={handlePrev}>
          Back
        </button>
        <button 
          className="btn btn-primary" 
          onClick={handleNext}
        >
          {activeSection === sections[sections.length - 1].id ? 'Next Step' : 'Next Section'}
        </button>
      </div>
    </div>
  );
};

export default TechnicalDetailsForm;

