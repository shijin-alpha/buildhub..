import React, { useEffect, useMemo, useState } from 'react';
import InfoPopup from './InfoPopup';

const TechnicalDetailsForm = ({ data, setData, onNext, onPrev }) => {
  const [activeSection, setActiveSection] = useState('floor-plans');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [buildingType, setBuildingType] = useState('');
  const LS_KEY = 'buildhub_architect_tech_details_v1';
  const LS_PROGRESS = 'buildhub_architect_tech_details_progress_v1';

  const templates = useMemo(() => ([
    {
      id: 'residential_concrete', name: 'Residential – Concrete baseline',
      prefill: {
        structural: {
          load_bearing_walls: 'Reinforced concrete walls at cores; 200 mm slabs',
          column_positions: '8 m grid; edge columns 300×600 mm',
          foundation_outline: 'Isolated footings; M30 concrete',
          roof_outline: 'Flat RCC slab with insulation'
        },
        construction: {
          wall_thickness: 'External 230 mm RCC + insulation + plaster; Internal 115 mm block',
          ceiling_heights: 'Living 3.1 m; Bedrooms 3.0 m; Kitchen 2.9 m',
          building_codes: 'IBC 2021 / IS 456 as applicable',
          critical_instructions: 'Use Fe500 rebars; cover as per exposure class XC2'
        }
      }
    },
    {
      id: 'steel_office', name: 'Office – Steel frame + curtain wall',
      prefill: {
        structural: {
          load_bearing_walls: 'Steel moment frames; braced cores',
          column_positions: '9 m × 9 m grid; HSS 300×300',
          foundation_outline: 'Pile caps with steel base plates',
          roof_outline: 'Lightweight metal deck with insulation'
        },
        construction: {
          wall_thickness: 'Curtain wall with IGU; party walls 150 mm GWB on studs',
          ceiling_heights: 'Office 3.0 m clear; Lobby 4.5 m',
          building_codes: 'IBC 2021; ASCE 7-22 for loads',
          critical_instructions: 'Intumescent paint to achieve 2-hr rating'
        }
      }
    },
    {
      id: 'timber_school', name: 'School – Timber CLT',
      prefill: {
        structural: {
          load_bearing_walls: 'CLT shear walls with GLT beams',
          column_positions: '7.2 m grid; GLT posts 200×200',
          foundation_outline: 'Strip footing; anchor bolts',
          roof_outline: 'CLT panels with green roof assembly'
        },
        construction: {
          wall_thickness: 'External CLT 140 mm + insulation; internal 100 mm',
          ceiling_heights: 'Classrooms 3.3 m; Corridors 3.0 m',
          building_codes: 'EN Eurocodes / local timber codes',
          critical_instructions: 'Moisture protection during erection'
        }
      }
    },
    {
      id: 'residential_contemporary', name: 'Residential – Contemporary',
      prefill: {
        structural: {
          load_bearing_walls: 'RCC shear walls with large openings; transfer beams at living spaces',
          column_positions: 'Irregular grid to allow open-plan; concealed edge columns',
          foundation_outline: 'Raft foundation for mixed soil strata',
          roof_outline: 'Flat slab with parapet; provision for PV mounts'
        },
        elevations: {
          front_elevation: 'Clean horizontal lines; large glazing; minimal ornamentation',
          height_details: 'Floor-to-floor 3.3 m; thin slab edges expressed'
        },
        construction: {
          wall_thickness: 'External 230 mm RCC + EPS insulation + render; internal 100–115 mm partitions',
          ceiling_heights: 'Living 3.2 m; bedrooms 3.0 m',
          building_codes: 'IBC 2021; energy code per region',
          critical_instructions: 'Thermal breaks on balconies; high-performance glazing U≤1.6 W/m²K'
        }
      }
    },
    {
      id: 'residential_traditional', name: 'Residential – Traditional',
      prefill: {
        structural: {
          load_bearing_walls: 'Brick/block load-bearing walls with RCC bands',
          foundation_outline: 'Strip footing; plinth beam; DPC at 150 mm above GL',
          roof_outline: 'Pitched truss roof with clay tiles'
        },
        elevations: {
          front_elevation: 'Symmetry, eaves, and framed openings; verandah',
          height_details: 'Plinth 600 mm; typical floor-to-floor 3.0 m'
        },
        construction: {
          wall_thickness: 'External 345 mm cavity/solid brick; internal 115–230 mm',
          ceiling_heights: 'Ground 3.3 m; Upper 3.0 m',
          building_codes: 'Local heritage guidelines where applicable',
          critical_instructions: 'Moisture management; ridge ventilation'
        }
      }
    },
    {
      id: 'residential_minimalist', name: 'Residential – Modern Minimal',
      prefill: {
        structural: {
          load_bearing_walls: 'RCC flat slab with minimal beams; slender columns',
          roof_outline: 'Flat roof with inverted insulation system'
        },
        elevations: {
          front_elevation: 'Monolithic volumes; concealed gutters; frameless corners',
          height_details: 'Clear height 3.0 m; floor-to-floor 3.2 m'
        },
        construction: {
          wall_thickness: 'External 200–230 mm + exterior insulation finish system',
          ceiling_heights: 'Consistent 3.0 m',
          building_codes: 'Energy and acoustic performance emphasized',
          critical_instructions: 'Shadow gaps; integrated concealments for MEP'
        }
      }
    },
    {
      id: 'commercial_retail', name: 'Commercial – Retail shell',
      prefill: {
        structural: {
          column_positions: '8–9 m grid; long-span beams at storefronts',
          foundation_outline: 'Pile/raft depending on site; high live loads areas'
        },
        site_orientation: {
          access_points: 'Service bay access; customer entry; emergency exits per code'
        },
        construction: {
          wall_thickness: 'Facade curtain wall/storefront glazing; demising walls 150–200 mm GWB',
          ceiling_heights: 'Retail floor 4.0–4.5 m; back-of-house 3.0 m',
          building_codes: 'IBC 2021; sprinkler and egress per NFPA',
          critical_instructions: 'Accessibility aisles; smoke extraction interfaces'
        }
      }
    },
    {
      id: 'commercial_mixeduse', name: 'Commercial – Mixed-use podium + tower',
      prefill: {
        structural: {
          column_positions: 'Podium transfer girders; tower typical grid 8.4 m',
          roof_outline: 'Podium landscaped roof; tower MEP terrace'
        },
        construction: {
          wall_thickness: 'Podium facade heavy cladding; tower unitized curtain wall',
          ceiling_heights: 'Retail 4.5 m; amenities 3.6 m; tower 3.1 m',
          building_codes: 'IBC 2021; mixed-occupancy separation',
          critical_instructions: 'Acoustic separation between uses; fire compartmentation details'
        }
      }
    },
    {
      id: 'residential_villa', name: 'Residential – Luxury Villa',
      prefill: {
        floor_plans: {
          living_room_dimensions: '24 × 18 ft',
          master_bedroom_dimensions: '18 × 14 ft'
        },
        structural: {
          foundation_outline: 'Isolated footings; basement optional',
          roof_outline: 'Flat + partial sloped accents; terrace deck'
        },
        construction: {
          wall_thickness: 'External 250–300 mm with high insulation; internal 115–150 mm',
          ceiling_heights: 'Ground 3.4 m; Upper 3.2 m',
          building_codes: 'High energy performance; local villa standards',
          critical_instructions: 'Provision for home automation and solar PV'
        }
      }
    },
    {
      id: 'residential_apartment_midrise', name: 'Residential – Mid-rise Apartments',
      prefill: {
        structural: {
          load_bearing_walls: 'RCC shear/core with frame; stairs and lift cores',
          column_positions: 'Typical bay 7.2–8.4 m'
        },
        construction: {
          wall_thickness: 'External 200–230 mm; internal 100–150 mm',
          ceiling_heights: 'Typical 2.9–3.0 m',
          building_codes: 'Local multi-family codes; fire egress and refuge floor',
          critical_instructions: 'Acoustic separation between units; fire-stopping at MEP penetrations'
        }
      }
    }
  ]), []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const rawProgress = localStorage.getItem(LS_PROGRESS);
      if (raw) {
        const parsed = JSON.parse(raw);
        setData(prev => ({ ...prev, technical_details: { ...prev.technical_details, ...parsed } }));
      }
      if (rawProgress) setActiveSection(rawProgress);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(data.technical_details || {}));
      localStorage.setItem(LS_PROGRESS, activeSection);
    } catch {}
  }, [data.technical_details, activeSection]);

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

  const applyTemplate = (tplId) => {
    const tpl = templates.find(t => t.id === tplId);
    setSelectedTemplateId(tplId);
    if (!tpl) return;
    setData(prev => ({
      ...prev,
      technical_details: {
        ...prev.technical_details,
        ...tpl.prefill
      }
    }));
  };

  const exportDetails = () => {
    const blob = new Blob([JSON.stringify(data.technical_details || {}, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'technical_details.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // Smart suggestions
  const applyBuildingTypePreset = (type) => {
    setBuildingType(type);
    if (!type) return;
    const presets = {
      residential: {
        construction: {
          wall_thickness: 'External 230 mm; Internal 115 mm',
          ceiling_heights: 'Living 3.0 m; Bedrooms 2.9 m; Kitchen 2.8 m',
          building_codes: 'Local residential code; fire egress per IBC',
          critical_instructions: 'Provide damp-proof course and thermal insulation per climate zone'
        },
        floor_plans: {
          living_room_dimensions: '20 × 15 ft',
          master_bedroom_dimensions: '16 × 12 ft',
          kitchen_dimensions: '12 × 10 ft'
        }
      },
      office: {
        construction: {
          wall_thickness: 'Partitions 100–150 mm GWB on studs; cores concrete',
          ceiling_heights: 'Open office 3.0 m clear; lobby 4.2 m',
          building_codes: 'IBC 2021; ASHRAE ventilation rates',
          critical_instructions: 'Acoustic control in meeting rooms; raised flooring for services'
        },
        structural: {
          column_positions: '9 m × 9 m grid; HSS 300×300',
          roof_outline: 'Metal deck + insulation'
        }
      },
      commercial: {
        construction: {
          wall_thickness: 'Curtain wall/storefront; demising walls 150–200 mm',
          ceiling_heights: 'Retail 4.2 m; BOH 3.0 m',
          building_codes: 'IBC 2021; NFPA sprinklers and egress',
          critical_instructions: 'Accessible routes; smoke extraction'
        }
      },
      contemporary: {
        elevations: {
          front_elevation: 'Clean lines, large glazing, minimal ornament',
          height_details: 'F2F ~3.2–3.3 m; thin slab edges'
        },
        construction: {
          building_codes: 'Energy code emphasis; high-performance envelope'
        }
      },
      school: {
        construction: {
          wall_thickness: 'External 200–250 mm; internal 100–150 mm',
          ceiling_heights: 'Classrooms 3.3 m; corridors 3.0 m',
          building_codes: 'Local education facility codes; accessibility per ADA/EN',
          critical_instructions: 'Daylighting and glare control; durable finishes'
        }
      }
    };
    const preset = presets[type];
    if (!preset) return;
    setData(prev => ({
      ...prev,
      technical_details: {
        ...prev.technical_details,
        ...(preset.floor_plans ? { floor_plans: { ...(prev.technical_details?.floor_plans||{}), ...preset.floor_plans } } : {}),
        ...(preset.site_orientation ? { site_orientation: { ...(prev.technical_details?.site_orientation||{}), ...preset.site_orientation } } : {}),
        ...(preset.structural ? { structural: { ...(prev.technical_details?.structural||{}), ...preset.structural } } : {}),
        ...(preset.elevations ? { elevations: { ...(prev.technical_details?.elevations||{}), ...preset.elevations } } : {}),
        ...(preset.construction ? { construction: { ...(prev.technical_details?.construction||{}), ...preset.construction } } : {}),
        meta: { ...(prev.technical_details?.meta||{}), building_type: type }
      }
    }));
  };

  const magicFill = () => {
    // Heuristic parser from description/file names
    const desc = (data.description || '').toLowerCase();
    const names = [data.layout_file?.name, data.preview_image?.name, ...(data.files||[]).map(f=>f?.name)].filter(Boolean).join(' ').toLowerCase();
    const text = `${desc} ${names}`;
    // room hints
    const is3bhk = /\b3\s*bhk\b|\b3 bedroom\b/.test(text);
    const is2bhk = /\b2\s*bhk\b|\b2 bedroom\b/.test(text);
    const isOffice = /office|workspace|cowork/.test(text);
    const isRetail = /retail|shop|storefront|mall|boutique/.test(text);
    const isSchool = /school|classroom|campus/.test(text);
    const isContemporary = /contemporary|modern minimal|minimalist/.test(text);
    const isTraditional = /traditional|heritage|vernacular/.test(text);
    const isVilla = /villa|bungalow|farmhouse/.test(text);
    const isApartment = /apartment|mid[- ]?rise|multi[- ]?family/.test(text);
    if (isOffice) applyBuildingTypePreset('office');
    else if (isRetail) applyBuildingTypePreset('commercial');
    else if (isSchool) applyBuildingTypePreset('school');
    else applyBuildingTypePreset('residential');

    if (isContemporary) applyTemplate('residential_contemporary');
    if (isTraditional) applyTemplate('residential_traditional');
    if (isVilla) applyTemplate('residential_villa');
    if (isApartment) applyTemplate('residential_apartment_midrise');
    if (isRetail) applyTemplate('commercial_retail');

    const fp = {};
    if (is3bhk) {
      fp.living_room_dimensions = '22 × 16 ft';
      fp.master_bedroom_dimensions = '16 × 13 ft';
      fp.other_room_dimensions = 'Bedroom 2: 14 × 12 ft; Bedroom 3: 12 × 11 ft';
    } else if (is2bhk) {
      fp.living_room_dimensions = '20 × 14 ft';
      fp.master_bedroom_dimensions = '15 × 12 ft';
      fp.other_room_dimensions = 'Bedroom 2: 12 × 11 ft';
    }
    if (Object.keys(fp).length) {
      setData(prev => ({
        ...prev,
        technical_details: {
          ...prev.technical_details,
          floor_plans: { ...(prev.technical_details?.floor_plans||{}), ...fp }
        }
      }));
    }
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
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', margin: '8px 0' }}>
          <div className="form-inline">
            <label style={{ marginRight: 8 }}>Quick template</label>
            <select value={selectedTemplateId} onChange={(e) => applyTemplate(e.target.value)}>
              <option value="">Select template…</option>
              {templates.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-secondary" type="button" onClick={exportDetails}>Export JSON</button>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', margin: '8px 0' }}>
          <div className="form-inline">
            <label style={{ marginRight: 8 }}>Building type</label>
            <select value={buildingType} onChange={(e)=>applyBuildingTypePreset(e.target.value)}>
              <option value="">Select…</option>
              <option value="residential">Residential</option>
              <option value="office">Office</option>
              <option value="commercial">Commercial</option>
              <option value="school">School</option>
              <option value="contemporary">Contemporary</option>
            </select>
          </div>
          <div className="form-inline">
            <label style={{ marginRight: 8 }}>Quick template</label>
            <select value={selectedTemplateId} onChange={(e) => applyTemplate(e.target.value)}>
              <option value="">Select template…</option>
              {templates.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-secondary" type="button" onClick={magicFill}>Magic Fill</button>
          <button className="btn btn-secondary" type="button" onClick={exportDetails}>Export JSON</button>
        </div>
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

