import React, { useState } from 'react';

const TechnicalDetailsDisplay = ({ technicalDetails }) => {
  const [activeSection, setActiveSection] = useState('floor-plans');
  const [isCollapsed, setIsCollapsed] = useState(true);

  if (!technicalDetails || Object.keys(technicalDetails).length === 0) {
    return (
      <div className="technical-details-display">
        <div className="no-technical-details">
          <p>No technical details provided for this design.</p>
        </div>
      </div>
    );
  }

  const sections = [
    { id: 'floor-plans', title: '🏠 Floor Plans & Layout', icon: '🏠' },
    { id: 'site-orientation', title: '🌍 Site & Orientation', icon: '🌍' },
    { id: 'structural', title: '🏗️ Structural Elements', icon: '🏗️' },
    { id: 'elevations', title: '📐 Key Elevations & Sections', icon: '📐' },
    { id: 'construction', title: '📋 Construction Notes', icon: '📋' }
  ];

  const renderFloorPlansSection = () => {
    const data = technicalDetails.floor_plans || {};
    return (
      <div className="technical-section-content">
        {data.layout_description && (
          <div className="detail-item">
            <h4>Floor Plan Layout</h4>
            <p>{data.layout_description}</p>
          </div>
        )}
        
        {(data.living_room_dimensions || data.master_bedroom_dimensions || data.kitchen_dimensions || data.other_room_dimensions) && (
          <div className="detail-item">
            <h4>Room Dimensions</h4>
            <div className="dimensions-list">
              {data.living_room_dimensions && (
                <div className="dimension-item">
                  <strong>Living Room:</strong> {data.living_room_dimensions}
                </div>
              )}
              {data.master_bedroom_dimensions && (
                <div className="dimension-item">
                  <strong>Master Bedroom:</strong> {data.master_bedroom_dimensions}
                </div>
              )}
              {data.kitchen_dimensions && (
                <div className="dimension-item">
                  <strong>Kitchen:</strong> {data.kitchen_dimensions}
                </div>
              )}
              {data.other_room_dimensions && (
                <div className="dimension-item">
                  <strong>Other Rooms:</strong>
                  <div className="other-rooms">{data.other_room_dimensions}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {data.door_window_positions && (
          <div className="detail-item">
            <h4>Door & Window Positions</h4>
            <p>{data.door_window_positions}</p>
          </div>
        )}

        {data.circulation_paths && (
          <div className="detail-item">
            <h4>Main Circulation Paths</h4>
            <p>{data.circulation_paths}</p>
          </div>
        )}
      </div>
    );
  };

  const renderSiteOrientationSection = () => {
    const data = technicalDetails.site_orientation || {};
    return (
      <div className="technical-section-content">
        {data.plot_boundaries && (
          <div className="detail-item">
            <h4>Plot Boundaries</h4>
            <p>{data.plot_boundaries}</p>
          </div>
        )}
        {data.orientation && (
          <div className="detail-item">
            <h4>Orientation (North Direction)</h4>
            <p>{data.orientation}</p>
          </div>
        )}
        {data.access_points && (
          <div className="detail-item">
            <h4>Access Points</h4>
            <p>{data.access_points}</p>
          </div>
        )}
      </div>
    );
  };

  const renderStructuralSection = () => {
    const data = technicalDetails.structural || {};
    return (
      <div className="technical-section-content">
        {data.load_bearing_walls && (
          <div className="detail-item">
            <h4>Load-bearing Walls</h4>
            <p>{data.load_bearing_walls}</p>
          </div>
        )}
        {data.column_positions && (
          <div className="detail-item">
            <h4>Column Positions</h4>
            <p>{data.column_positions}</p>
          </div>
        )}
        {data.foundation_outline && (
          <div className="detail-item">
            <h4>Foundation Outline</h4>
            <p>{data.foundation_outline}</p>
          </div>
        )}
        {data.roof_outline && (
          <div className="detail-item">
            <h4>Roof Outline</h4>
            <p>{data.roof_outline}</p>
          </div>
        )}
      </div>
    );
  };

  const renderElevationsSection = () => {
    const data = technicalDetails.elevations || {};
    return (
      <div className="technical-section-content">
        {data.front_elevation && (
          <div className="detail-item">
            <h4>Front Elevation</h4>
            <p>{data.front_elevation}</p>
          </div>
        )}
        {data.cross_sections && (
          <div className="detail-item">
            <h4>Cross Sections</h4>
            <p>{data.cross_sections}</p>
          </div>
        )}
        {data.height_details && (
          <div className="detail-item">
            <h4>Height Details</h4>
            <p>{data.height_details}</p>
          </div>
        )}
      </div>
    );
  };

  const renderConstructionSection = () => {
    const data = technicalDetails.construction || {};
    return (
      <div className="technical-section-content">
        {data.wall_thickness && (
          <div className="detail-item">
            <h4>Wall Thickness</h4>
            <p>{data.wall_thickness}</p>
          </div>
        )}
        {data.ceiling_heights && (
          <div className="detail-item">
            <h4>Ceiling Heights</h4>
            <p>{data.ceiling_heights}</p>
          </div>
        )}
        {data.building_codes && (
          <div className="detail-item">
            <h4>Building Codes</h4>
            <p>{data.building_codes}</p>
          </div>
        )}
        {data.critical_instructions && (
          <div className="detail-item">
            <h4>Critical Instructions</h4>
            <p>{data.critical_instructions}</p>
          </div>
        )}
      </div>
    );
  };

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

  const hasSectionData = (sectionId) => {
    const sectionData = technicalDetails[sectionId];
    if (!sectionData) return false;
    return Object.values(sectionData).some(value => value && value.trim() !== '');
  };

  return (
    <div className="technical-details-display">
      <div className="technical-header">
        <h3>Technical Design Details</h3>
        <p>Comprehensive architectural specifications and construction details</p>
        <div style={{ marginTop: 8 }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setIsCollapsed(prev => !prev)}
          >
            {isCollapsed ? 'View details' : 'Hide details'}
          </button>
        </div>
      </div>

      {!isCollapsed && (
      <div className="technical-layout">
        <div className="technical-sidebar">
          <div className="section-nav">
            {sections.map(section => {
              if (!hasSectionData(section.id)) return null;
              return (
                <button
                  key={section.id}
                  className={`section-nav-item ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <span className="section-icon">{section.icon}</span>
                  <span className="section-title">{section.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="technical-content">
          {renderSectionContent()}
        </div>
      </div>
      )}
    </div>
  );
};

export default TechnicalDetailsDisplay;


