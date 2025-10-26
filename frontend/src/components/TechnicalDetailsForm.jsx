import React, { useState, useMemo } from 'react';
import '../styles/TechnicalDetailsForm.css';

const TechnicalDetailsForm = ({ data, setData, onNext, onPrev }) => {
  const [activeSection, setActiveSection] = useState('floor_plans');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const [formData, setFormData] = useState({
    floor_plan_layout: data.technical_details?.floor_plan_layout || '',
    room_dimensions: data.technical_details?.room_dimensions || {
      living_room: '',
      master_bedroom: '',
      kitchen: '',
      other_rooms: ''
    },
    door_window_positions: data.technical_details?.door_window_positions || '',
    circulation_paths: data.technical_details?.circulation_paths || '',
    structural_elements: data.technical_details?.structural_elements || '',
    elevations_sections: data.technical_details?.elevations_sections || '',
    construction_notes: data.technical_details?.construction_notes || '',
    foundation_type: data.technical_details?.foundation_type || '',
    structural_materials: data.technical_details?.structural_materials || '',
    load_bearing_elements: data.technical_details?.load_bearing_elements || '',
    facade_treatment: data.technical_details?.facade_treatment || '',
    section_details: data.technical_details?.section_details || '',
    building_height: data.technical_details?.building_height || '',
    material_specifications: data.technical_details?.material_specifications || '',
    construction_methods: data.technical_details?.construction_methods || '',
    special_requirements: data.technical_details?.special_requirements || '',
    electrical_system: data.technical_details?.electrical_system || '',
    plumbing_system: data.technical_details?.plumbing_system || '',
    hvac_system: data.technical_details?.hvac_system || '',
    fire_safety: data.technical_details?.fire_safety || '',
    accessibility_features: data.technical_details?.accessibility_features || '',
    energy_efficiency: data.technical_details?.energy_efficiency || '',
    estimated_cost: data.technical_details?.estimated_cost || '',
    cost_breakdown: data.technical_details?.cost_breakdown || '',
    material_costs: data.technical_details?.material_costs || '',
    labor_costs: data.technical_details?.labor_costs || '',
    view_price: data.technical_details?.view_price || data.view_price || 0
  });

  // Template definitions
  const templates = useMemo(() => [
    {
      id: 'residential_concrete',
      name: 'Residential – Concrete baseline',
      data: {
        structural_elements: 'RCC framed structure with concrete columns, beams, and slabs. Standard residential construction with M20 grade concrete.',
        foundation_type: 'RCC Foundation with strip footing',
        structural_materials: 'M20 grade concrete, Fe415 steel reinforcement',
        electrical_system: 'Standard residential electrical layout with MCB distribution board',
        plumbing_system: 'CPVC pipes for water supply, PVC for drainage',
        hvac_system: 'Natural ventilation with ceiling fans',
        estimated_cost: '₹15,00,000 - ₹20,00,000'
      }
    },
    {
      id: 'steel_office',
      name: 'Office – Steel frame + curtain wall',
      data: {
        structural_elements: 'Steel frame structure with composite steel-concrete floors. Modern office building design.',
        foundation_type: 'Raft foundation with pile foundation',
        structural_materials: 'Structural steel grade Fe500, M25 grade concrete',
        electrical_system: 'Commercial electrical system with UPS backup',
        plumbing_system: 'GI pipes for water supply, cast iron for drainage',
        hvac_system: 'Centralized AC system with VRF technology',
        estimated_cost: '₹25,00,000 - ₹35,00,000'
      }
    },
    {
      id: 'timber_school',
      name: 'School – Timber CLT',
      data: {
        structural_elements: 'Cross-laminated timber (CLT) structure with steel connections',
        foundation_type: 'Strip foundation with timber posts',
        structural_materials: 'CLT panels, structural timber, steel connections',
        electrical_system: 'Educational facility electrical with safety features',
        plumbing_system: 'PEX pipes for water supply, PVC for drainage',
        hvac_system: 'Natural ventilation with mechanical assistance',
        estimated_cost: '₹18,00,000 - ₹25,00,000'
      }
    },
    {
      id: 'residential_contemporary',
      name: 'Residential – Contemporary',
      data: {
        structural_elements: 'Modern RCC structure with cantilevered elements and glass facades',
        foundation_type: 'RCC foundation with basement',
        structural_materials: 'M25 grade concrete, Fe500 steel, glass curtain wall',
        electrical_system: 'Smart home electrical system with automation',
        plumbing_system: 'PEX pipes with smart water management',
        hvac_system: 'VRF air conditioning with heat recovery',
        estimated_cost: '₹30,00,000 - ₹45,00,000'
      }
    },
    {
      id: 'residential_traditional',
      name: 'Residential – Traditional',
      data: {
        structural_elements: 'Traditional masonry construction with RCC roof',
        foundation_type: 'Strip foundation with masonry walls',
        structural_materials: 'Brick masonry, M15 grade concrete, traditional roofing',
        electrical_system: 'Standard residential electrical with traditional aesthetics',
        plumbing_system: 'Traditional plumbing with modern fixtures',
        hvac_system: 'Natural ventilation with traditional cooling methods',
        estimated_cost: '₹12,00,000 - ₹18,00,000'
      }
    },
    {
      id: 'residential_minimalist',
      name: 'Residential – Modern Minimal',
      data: {
        structural_elements: 'Minimalist RCC structure with clean lines and open spaces',
        foundation_type: 'RCC foundation with floating slab',
        structural_materials: 'M20 grade concrete, minimal steel, clean finishes',
        electrical_system: 'Hidden electrical system with minimal visible elements',
        plumbing_system: 'Concealed plumbing with minimalist fixtures',
        hvac_system: 'Underfloor heating with minimal visible systems',
        estimated_cost: '₹20,00,000 - ₹30,00,000'
      }
    },
    {
      id: 'commercial_retail',
      name: 'Commercial – Retail shell',
      data: {
        structural_elements: 'Steel frame with large open spaces for retail flexibility',
        foundation_type: 'Raft foundation for heavy loads',
        structural_materials: 'Structural steel, composite floors, curtain wall system',
        electrical_system: 'High-capacity commercial electrical with backup',
        plumbing_system: 'Commercial plumbing with multiple connections',
        hvac_system: 'Centralized HVAC with zone control',
        estimated_cost: '₹40,00,000 - ₹60,00,000'
      }
    },
    {
      id: 'commercial_mixeduse',
      name: 'Commercial – Mixed-use podium + tower',
      data: {
        structural_elements: 'Mixed-use structure with podium and tower elements',
        foundation_type: 'Deep foundation with basement levels',
        structural_materials: 'High-strength concrete M30+, structural steel',
        electrical_system: 'Multi-zone electrical system for different uses',
        plumbing_system: 'Complex plumbing system for multiple functions',
        hvac_system: 'Zoned HVAC system for different building uses',
        estimated_cost: '₹50,00,000 - ₹80,00,000'
      }
    },
    {
      id: 'residential_villa',
      name: 'Residential – Luxury Villa',
      data: {
        structural_elements: 'Luxury RCC structure with premium finishes and features',
        foundation_type: 'RCC foundation with basement and parking',
        structural_materials: 'High-grade concrete M25+, premium steel, luxury finishes',
        electrical_system: 'Premium electrical system with smart home features',
        plumbing_system: 'Premium plumbing with luxury fixtures',
        hvac_system: 'Premium HVAC with smart climate control',
        estimated_cost: '₹60,00,000 - ₹1,00,00,000'
      }
    },
    {
      id: 'residential_apartment_midrise',
      name: 'Residential – Mid-rise Apartments',
      data: {
        structural_elements: 'Mid-rise RCC structure optimized for apartment living',
        foundation_type: 'RCC foundation with basement parking',
        structural_materials: 'M25 grade concrete, Fe500 steel, apartment finishes',
        electrical_system: 'Apartment electrical system with individual meters',
        plumbing_system: 'Apartment plumbing with individual connections',
        hvac_system: 'Individual AC units with common ventilation',
        estimated_cost: '₹35,00,000 - ₹50,00,000'
      }
    }
  ], []);

  // Section definitions
  const sections = useMemo(() => [
    {
      id: 'floor_plans',
      title: 'Floor Plans & Layout',
      icon: '🏠',
      description: 'Complete the fields below to provide technical details for this section'
    },
    {
      id: 'structural',
      title: 'Structural Elements',
      icon: '🏗️',
      description: 'Specify structural components and construction methods'
    },
    {
      id: 'elevations',
      title: 'Key Elevations & Sections',
      icon: '📐',
      description: 'Provide details about building elevations and cross-sections'
    },
    {
      id: 'construction',
      title: 'Construction Notes',
      icon: '📋',
      description: 'Additional construction specifications and considerations'
    },
    {
      id: 'systems',
      title: 'Building Systems',
      icon: '⚡',
      description: 'Electrical, plumbing, HVAC, and other building systems'
    },
    {
      id: 'pricing',
      title: 'Cost Estimation',
      icon: '💰',
      description: 'Pricing information and cost breakdown'
    }
  ], []);

  const handleInputChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Update parent data
    setData({
      ...data,
      technical_details: newFormData
    });
  };

  const handleRoomDimensionChange = (room, value) => {
    const newRoomDimensions = { ...formData.room_dimensions, [room]: value };
    const newFormData = { ...formData, room_dimensions: newRoomDimensions };
    setFormData(newFormData);
    
    // Update parent data
    setData({
      ...data,
      technical_details: newFormData
    });
  };

  const handleTemplateChange = (templateId) => {
    setSelectedTemplate(templateId);
    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        const newFormData = { ...formData, ...template.data };
        setFormData(newFormData);
        setData({
          ...data,
          technical_details: newFormData
        });
      }
    }
  };

  const validateCurrentSection = () => {
    // Simple validation - just return true for now
    // You can add section-specific validation here
    return true;
  };

  const handleNext = () => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1].id);
    }
  };

  const handlePrev = () => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    if (currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1].id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update the parent data with technical details including view_price
    setData(prevData => ({
      ...prevData,
      technical_details: formData,
      view_price: formData.view_price
    }));
    onNext();
  };

  const renderFloorPlansSection = () => (
    <div className="technical-section">
      <div className="form-group">
        <label>Floor Plan Layout Description</label>
        <textarea
          value={formData.floor_plan_layout}
          onChange={(e) => handleInputChange('floor_plan_layout', e.target.value)}
          placeholder="Describe the floor plan layout, room arrangements, and spatial organization..."
          rows="4"
        />
      </div>

      <div className="form-group">
        <label>Room Dimensions</label>
        <div className="dimensions-grid">
          <div className="dimension-item">
            <label>Living Room</label>
            <input
              type="text"
              value={formData.room_dimensions.living_room}
              onChange={(e) => handleRoomDimensionChange('living_room', e.target.value)}
              placeholder="e.g., 20 × 15 ft"
            />
          </div>
          <div className="dimension-item">
            <label>Master Bedroom</label>
            <input
              type="text"
              value={formData.room_dimensions.master_bedroom}
              onChange={(e) => handleRoomDimensionChange('master_bedroom', e.target.value)}
              placeholder="e.g., 16 × 12 ft"
            />
          </div>
          <div className="dimension-item">
            <label>Kitchen</label>
            <input
              type="text"
              value={formData.room_dimensions.kitchen}
              onChange={(e) => handleRoomDimensionChange('kitchen', e.target.value)}
              placeholder="e.g., 12 × 10 ft"
            />
          </div>
          <div className="dimension-item">
            <label>Other Rooms</label>
            <textarea
              value={formData.room_dimensions.other_rooms}
              onChange={(e) => handleRoomDimensionChange('other_rooms', e.target.value)}
              placeholder="Bedroom 2: 14 × 12 ft, Bedroom 3: 12 × 10 ft, Bathroom: 8 × 6 ft..."
              rows="3"
            />
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>Door & Window Positions</label>
        <textarea
          value={formData.door_window_positions}
          onChange={(e) => handleInputChange('door_window_positions', e.target.value)}
          placeholder="Specify door and window locations, sizes, and orientations..."
          rows="4"
        />
      </div>

      <div className="form-group">
        <label>Main Circulation Paths</label>
        <textarea
          value={formData.circulation_paths}
          onChange={(e) => handleInputChange('circulation_paths', e.target.value)}
          placeholder="Describe hallways, staircases, and main circulation routes..."
          rows="3"
        />
      </div>

      {/* Section Navigation */}
      <div className="section-navigation">
        <button type="button" onClick={handlePrev} className="btn btn-secondary" disabled={activeSection === 'floor_plans'}>
          ← Previous
        </button>
        <button type="button" onClick={handleNext} className="btn btn-primary">
          Next: Structural Elements →
        </button>
      </div>
    </div>
  );

  const renderStructuralSection = () => (
    <div className="technical-section">
      <div className="form-group">
        <label>Structural System</label>
        <textarea
          value={formData.structural_elements}
          onChange={(e) => handleInputChange('structural_elements', e.target.value)}
          placeholder="Describe structural system, materials, load-bearing elements, foundation type..."
          rows="4"
        />
      </div>

      <div className="form-group">
        <label>Foundation Type</label>
        <input
          type="text"
          value={formData.foundation_type}
          onChange={(e) => handleInputChange('foundation_type', e.target.value)}
          placeholder="e.g., RCC Foundation, Pile Foundation, Strip Foundation..."
        />
      </div>

      <div className="form-group">
        <label>Structural Materials</label>
        <textarea
          value={formData.structural_materials}
          onChange={(e) => handleInputChange('structural_materials', e.target.value)}
          placeholder="Specify concrete grade, steel specifications, masonry details..."
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>Load Bearing Elements</label>
        <textarea
          value={formData.load_bearing_elements}
          onChange={(e) => handleInputChange('load_bearing_elements', e.target.value)}
          placeholder="Describe columns, beams, walls, and other load-bearing components..."
          rows="3"
        />
      </div>

      {/* Section Navigation */}
      <div className="section-navigation">
        <button type="button" onClick={handlePrev} className="btn btn-secondary">
          ← Previous
        </button>
        <button type="button" onClick={handleNext} className="btn btn-primary">
          Next: Elevations & Sections →
        </button>
      </div>
    </div>
  );

  const renderElevationsSection = () => (
    <div className="technical-section">
      <div className="form-group">
        <label>Elevation Details</label>
        <textarea
          value={formData.elevations_sections}
          onChange={(e) => handleInputChange('elevations_sections', e.target.value)}
          placeholder="Describe building elevations, facade treatments, section details..."
          rows="4"
        />
      </div>

      <div className="form-group">
        <label>Facade Treatment</label>
        <textarea
          value={formData.facade_treatment}
          onChange={(e) => handleInputChange('facade_treatment', e.target.value)}
          placeholder="Specify exterior finishes, cladding materials, architectural features..."
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>Section Details</label>
        <textarea
          value={formData.section_details}
          onChange={(e) => handleInputChange('section_details', e.target.value)}
          placeholder="Describe cross-sections, wall thicknesses, floor-to-floor heights..."
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>Building Height</label>
        <input
          type="text"
          value={formData.building_height}
          onChange={(e) => handleInputChange('building_height', e.target.value)}
          placeholder="e.g., 10.5m (Ground + 2 floors)"
        />
      </div>

      {/* Section Navigation */}
      <div className="section-navigation">
        <button type="button" onClick={handlePrev} className="btn btn-secondary">
          ← Previous
        </button>
        <button type="button" onClick={handleNext} className="btn btn-primary">
          Next: Construction Details →
        </button>
      </div>
    </div>
  );

  const renderConstructionSection = () => (
    <div className="technical-section">
      <div className="form-group">
        <label>Construction Specifications</label>
        <textarea
          value={formData.construction_notes}
          onChange={(e) => handleInputChange('construction_notes', e.target.value)}
          placeholder="Include material specifications, construction methods, special requirements..."
          rows="4"
        />
      </div>

      <div className="form-group">
        <label>Material Specifications</label>
        <textarea
          value={formData.material_specifications}
          onChange={(e) => handleInputChange('material_specifications', e.target.value)}
          placeholder="Specify brands, grades, and quality standards for materials..."
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>Construction Methods</label>
        <textarea
          value={formData.construction_methods}
          onChange={(e) => handleInputChange('construction_methods', e.target.value)}
          placeholder="Describe construction techniques, sequencing, and methodologies..."
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>Special Requirements</label>
        <textarea
          value={formData.special_requirements}
          onChange={(e) => handleInputChange('special_requirements', e.target.value)}
          placeholder="Any special construction requirements, permits, or considerations..."
          rows="3"
        />
      </div>

      {/* Section Navigation */}
      <div className="section-navigation">
        <button type="button" onClick={handlePrev} className="btn btn-secondary">
          ← Previous
        </button>
        <button type="button" onClick={handleNext} className="btn btn-primary">
          Next: MEP Systems →
        </button>
      </div>
    </div>
  );

  const renderSystemsSection = () => (
    <div className="technical-section">
      <div className="form-group">
        <label>Electrical System</label>
        <textarea
          value={formData.electrical_system}
          onChange={(e) => handleInputChange('electrical_system', e.target.value)}
          placeholder="Describe electrical layout, load calculations, panel locations..."
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>Plumbing System</label>
        <textarea
          value={formData.plumbing_system}
          onChange={(e) => handleInputChange('plumbing_system', e.target.value)}
          placeholder="Specify water supply, drainage, fixture locations..."
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>HVAC System</label>
        <textarea
          value={formData.hvac_system}
          onChange={(e) => handleInputChange('hvac_system', e.target.value)}
          placeholder="Describe heating, ventilation, and air conditioning systems..."
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>Fire Safety</label>
        <textarea
          value={formData.fire_safety}
          onChange={(e) => handleInputChange('fire_safety', e.target.value)}
          placeholder="Specify fire safety measures, exits, sprinkler systems..."
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>Accessibility Features</label>
        <textarea
          value={formData.accessibility_features}
          onChange={(e) => handleInputChange('accessibility_features', e.target.value)}
          placeholder="Describe accessibility compliance, ramps, elevators..."
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>Energy Efficiency</label>
        <textarea
          value={formData.energy_efficiency}
          onChange={(e) => handleInputChange('energy_efficiency', e.target.value)}
          placeholder="Specify insulation, solar panels, energy-efficient systems..."
          rows="3"
        />
      </div>

      {/* Section Navigation */}
      <div className="section-navigation">
        <button type="button" onClick={handlePrev} className="btn btn-secondary">
          ← Previous
        </button>
        <button type="button" onClick={() => { const result = validateCurrentSection(); if (result) handleNext(); }} className="btn btn-primary">
          Next: Pricing & Timeline →
        </button>
      </div>
    </div>
  );

  const renderPricingSection = () => (
    <div className="technical-section">
      <div className="price-section">
        <label>Estimated Total Cost</label>
        <div className="price-input-container">
          <input
            type="text"
            className="price-input"
            value={formData.estimated_cost}
            onChange={(e) => handleInputChange('estimated_cost', e.target.value)}
            placeholder="e.g., ₹25,00,000"
          />
        </div>
        <div className="field-help">
          Enter the total estimated cost for the project including all materials and labor
        </div>
      </div>

      <div className="form-group">
        <label>Price to View Layout (₹)</label>
        <input
          type="number"
          value={formData.view_price || 0}
          onChange={(e) => handleInputChange('view_price', e.target.value)}
          placeholder="e.g., 100"
          min="0"
          step="0.01"
        />
        <div className="field-help" style={{marginTop: '4px'}}>
          Amount homeowners must pay to view this layout (Optional - set 0 for free)
        </div>
      </div>

      <div className="form-group">
        <label>Cost Breakdown</label>
        <textarea
          value={formData.cost_breakdown}
          onChange={(e) => handleInputChange('cost_breakdown', e.target.value)}
          placeholder="Provide detailed cost breakdown by category..."
          rows="4"
        />
      </div>

      <div className="form-group">
        <label>Material Costs</label>
        <textarea
          value={formData.material_costs}
          onChange={(e) => handleInputChange('material_costs', e.target.value)}
          placeholder="Breakdown of material costs (concrete, steel, finishes, etc.)..."
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>Labor Costs</label>
        <textarea
          value={formData.labor_costs}
          onChange={(e) => handleInputChange('labor_costs', e.target.value)}
          placeholder="Breakdown of labor costs (masonry, carpentry, electrical, etc.)..."
          rows="3"
        />
      </div>

      {/* Section Navigation */}
      <div className="section-navigation">
        <button type="button" onClick={handlePrev} className="btn btn-secondary">
          ← Previous
        </button>
        <button type="button" onClick={handleSubmit} className="btn btn-primary">
          Next: Files & Submit →
        </button>
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (activeSection) {
      case 'floor_plans':
        return renderFloorPlansSection();
      case 'structural':
        return renderStructuralSection();
      case 'elevations':
        return renderElevationsSection();
      case 'construction':
        return renderConstructionSection();
      case 'systems':
        return renderSystemsSection();
      case 'pricing':
        return renderPricingSection();
      default:
        return renderFloorPlansSection();
    }
  };

  const currentSection = sections.find(s => s.id === activeSection);

  return (
    <div className="technical-details-form-new">
      {/* Header */}
      <div className="technical-header-new">
        <div className="header-left">
          <button className="modal-close-new" onClick={onPrev}>
            ×
          </button>
          <div className="header-info">
            <h2>Technical Design Details</h2>
            <div className="progress-indicator">
              <span className="progress-text">Step 2 of 3</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '66%' }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="template-selector">
            <label>Template:</label>
            <select 
              value={selectedTemplate} 
              onChange={(e) => handleTemplateChange(e.target.value)}
            >
              <option value="">Select a template...</option>
              {templates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="technical-main-new">
        {/* Sidebar */}
        <div className="technical-sidebar-new">
          <div className="section-nav-new">
            {sections.map((section, index) => (
              <button
                key={section.id}
                className={`section-nav-item-new ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <div className="section-number">{index + 1}</div>
                <div className="section-info">
                  <span className="section-icon-new">{section.icon}</span>
                  <span className="section-title-new">{section.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="technical-content-new">
          <div className="content-header">
            <h3>{currentSection?.title}</h3>
            <p>{currentSection?.description}</p>
          </div>
          <div className="content-body">
            {renderCurrentSection()}
          </div>
        </div>
      </div>

    </div>
  );
};

export default TechnicalDetailsForm;