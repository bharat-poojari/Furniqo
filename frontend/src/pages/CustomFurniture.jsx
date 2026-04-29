import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FiSend, FiEdit3, FiUpload, FiX, FiCheck, FiClock, 
  FiDollarSign, FiInfo, FiChevronDown, FiArrowRight, FiAlertCircle,
  FiUser, FiMail, FiPhone, FiLink, FiFileText, FiBox, FiTruck, FiPenTool,
  FiLayers, FiTrash2, FiChevronLeft, FiChevronRight, FiCheckCircle,
  FiShield, FiAward, FiZap, FiStar, FiHeart, FiSmile,
  FiCompass, FiCalendar, FiMaximize2, FiGrid, FiImage,
  FiMonitor, FiHome, FiCoffee, FiBookOpen, FiTool, FiRotateCw,
  FiZoomIn, FiEye, FiThumbsUp, FiGift, FiPlus, FiMinus, FiShoppingCart
} from 'react-icons/fi';
import { MdOutlineDesignServices, MdProductionQuantityLimits, MdLocalShipping, MdPalette } from 'react-icons/md';

// ============================================================
// UPGRADED FURNITURE MODEL WITH ALL IMPROVEMENTS
// ============================================================
const FurnitureModel = ({ config, focus, step, onMouseMove, rotation, tilt }) => {
  const [isHovering, setIsHovering] = useState(false);
  
  // Get colors based on selected options
  const getColors = () => {
    const materialColors = {
      oak: { primary: '#D4A056', secondary: '#B8860B', accent: '#8B6914', light: '#E8C08A', dark: '#A07030' },
      walnut: { primary: '#5C4033', secondary: '#4A3728', accent: '#3B2A1E', light: '#7A5A4A', dark: '#3A2010' },
      maple: { primary: '#D4A373', secondary: '#C4905E', accent: '#B07D4A', light: '#E8C8A0', dark: '#B08050' },
      leather: { primary: '#8B4513', secondary: '#6B3410', accent: '#4A2208', light: '#A06030', dark: '#5A2000' },
      velvet: { primary: '#6B3FA0', secondary: '#582C8A', accent: '#3E1A6B', light: '#8860C0', dark: '#4A2080' },
      metal: { primary: '#808080', secondary: '#6B6B6B', accent: '#4A4A4A', light: '#A0A0A0', dark: '#505050' },
    };
    return materialColors[config.material?.value] || materialColors.oak;
  };
  
  const colors = getColors();
  
  // Style-based morphing parameters
  const getStyleParams = () => {
    const styleMap = {
      modern: { borderRadius: 2, scaleY: 1, edgeSharpness: 0, shadowIntensity: 0.3 },
      scandinavian: { borderRadius: 6, scaleY: 1.02, edgeSharpness: 2, shadowIntensity: 0.2 },
      industrial: { borderRadius: 1, scaleY: 0.98, edgeSharpness: 0, shadowIntensity: 0.4 },
      'mid-century': { borderRadius: 4, scaleY: 1, edgeSharpness: 1, shadowIntensity: 0.25 },
      bohemian: { borderRadius: 12, scaleY: 1.03, edgeSharpness: 3, shadowIntensity: 0.15 },
      rustic: { borderRadius: 8, scaleY: 1.01, edgeSharpness: 2, shadowIntensity: 0.2 }
    };
    return styleMap[config.style?.value] || { borderRadius: 4, scaleY: 1, edgeSharpness: 1, shadowIntensity: 0.25 };
  };
  
  const styleParams = getStyleParams();
  
  // Focus mode scaling
  const getFocusTransform = () => {
    if (!focus) return { scale: 1, y: 0 };
    switch(focus) {
      case 'material': return { scale: 1.15, y: -12 };
      case 'style': return { scale: 1.1, y: -8 };
      case 'color': return { scale: 1.05, y: -4 };
      default: return { scale: 1, y: 0 };
    }
  };
  
  const focusTransform = getFocusTransform();
  
  // Determine visible parts based on step (Progressive Build)
  const visibleParts = {
    showBase: step >= 1,
    showStructure: step >= 2,
    showDetails: step >= 3
  };
  
  // Furniture shape configurations
  const furnitureShapes = {
    sofa: {
      base: { width: 80, height: 40, depth: 60 },
      arms: { left: { x: -30, y: -15, width: 15, height: 30 }, right: { x: 30, y: -15, width: 15, height: 30 } },
      back: { width: 80, height: 25, y: -25 },
    },
    bed: {
      base: { width: 90, height: 20, depth: 70 },
      headboard: { width: 92, height: 35, y: -25 },
      mattress: { width: 85, height: 15, y: -10 }
    },
    table: {
      top: { width: 70, height: 5, y: 0 },
      legs: [
        { x: -30, y: -15, width: 4, height: 20 },
        { x: 30, y: -15, width: 4, height: 20 },
      ]
    },
    chair: {
      seat: { width: 40, height: 8, y: -5 },
      backrest: { width: 40, height: 25, y: -20 },
      legs: [
        { x: -18, y: -20, width: 3, height: 15 },
        { x: 18, y: -20, width: 3, height: 15 },
      ]
    },
    cabinet: {
      body: { width: 60, height: 55, depth: 35 },
      doors: [
        { x: -18, width: 25, height: 45, y: 5 },
        { x: 8, width: 25, height: 45, y: 5 }
      ]
    },
    desk: {
      top: { width: 80, height: 5, y: 0 },
      legs: [
        { x: -35, y: -15, width: 4, height: 20 },
        { x: 35, y: -15, width: 4, height: 20 }
      ],
      drawer: { width: 50, height: 10, y: -8 }
    }
  };
  
  const shape = furnitureShapes[config.type?.value] || furnitureShapes.sofa;
  
  return (
    <div 
      className="relative w-full h-[300px] md:h-[400px] flex items-center justify-center perspective-1000"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={onMouseMove}
    >
      <motion.div
        animate={{ 
          rotateY: rotation,
          rotateX: tilt,
          scale: focusTransform.scale,
          y: focusTransform.y
        }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative"
      >
        <svg 
          width="320" 
          height="280" 
          viewBox="-120 -120 240 240" 
          className="furniture-svg transition-all duration-300"
          style={{ 
            filter: step === 3 ? 'drop-shadow(0 0 20px rgba(99,102,241,0.5))' : 'none',
            transition: 'filter 0.5s ease'
          }}
        >
          <defs>
            {/* Wood gradient for material layer */}
            <linearGradient id="materialGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.primary} />
              <stop offset="50%" stopColor={colors.secondary} />
              <stop offset="100%" stopColor={colors.accent} />
            </linearGradient>
            
            {/* Lighting overlay gradient */}
            <linearGradient id="lightingOverlay" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
              <stop offset="40%" stopColor="rgba(255,255,255,0.05)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.2)" />
            </linearGradient>
            
            {/* Second light source from bottom */}
            <linearGradient id="rimLighting" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,200,100,0.15)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            
            <filter id="shadowFilter">
              <feDropShadow dx="3" dy="5" stdDeviation="5" floodOpacity="0.35"/>
            </filter>
            
            <filter id="glowFilter">
              <feGaussianBlur stdDeviation="4" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <g transform={`translate(0, ${isHovering ? -5 : 0})`}>
            {/* Ground shadow */}
            <ellipse cx="0" cy="65" rx="60" ry="12" fill="rgba(0,0,0,0.25)">
              <animate attributeName="rx" values="60;65;60" dur="2s" repeatCount="indefinite" />
            </ellipse>
            
            {/* ===== LAYER 1: BASE GEOMETRY ===== */}
            {visibleParts.showBase && shape.base && (
              <motion.rect
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  rx: styleParams.borderRadius,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                x={-shape.base.width / 2}
                y={-30}
                width={shape.base.width}
                height={shape.base.height}
                fill="url(#materialGradient)"
                stroke={colors.dark}
                strokeWidth="1.5"
                filter="url(#shadowFilter)"
              />
            )}
            
            {/* ===== LAYER 2: STRUCTURE (Arms, Backrest, Headboard) ===== */}
            {visibleParts.showStructure && (
              <>
                {/* Sofa Arms */}
                {shape.arms && (
                  <>
                    <motion.rect 
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15, type: "spring" }}
                      x={-48} y={-45} width={14} height={32} rx={styleParams.borderRadius} 
                      fill={colors.primary} stroke={colors.dark} strokeWidth="1" 
                    />
                    <motion.rect 
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15, type: "spring" }}
                      x={34} y={-45} width={14} height={32} rx={styleParams.borderRadius} 
                      fill={colors.primary} stroke={colors.dark} strokeWidth="1" 
                    />
                  </>
                )}
                
                {/* Backrest */}
                {shape.back && (
                  <motion.rect
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    x={-shape.back.width / 2} y={-52} 
                    width={shape.back.width} height={shape.back.height} 
                    rx={styleParams.borderRadius} fill={colors.accent} 
                  />
                )}
                
                {/* Headboard */}
                {shape.headboard && (
                  <motion.rect
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    x={-46} y={-58} width={92} height={32} rx={styleParams.borderRadius} 
                    fill={colors.secondary}
                  />
                )}
                
                {/* Mattress */}
                {shape.mattress && (
                  <motion.rect
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    x={-42.5} y={-22} width={85} height={14} rx={styleParams.borderRadius} 
                    fill={colors.primary}
                  />
                )}
                
                {/* Table top */}
                {shape.top && (
                  <rect x={-35} y={-5} width={70} height={5} rx={styleParams.borderRadius} fill={colors.primary} />
                )}
                
                {/* Legs */}
                {shape.legs && shape.legs.map((leg, i) => (
                  <motion.rect 
                    key={i} 
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    x={leg.x - leg.width/2} y={leg.y} 
                    width={leg.width} height={leg.height} 
                    rx={Math.max(1, styleParams.borderRadius - 2)} 
                    fill={colors.secondary}
                    style={{ transformOrigin: `${leg.x}px ${leg.y + leg.height}px` }}
                  />
                ))}
              </>
            )}
            
            {/* ===== LAYER 3: DETAILS (Cushions, Drawers, Hardware) ===== */}
            {visibleParts.showDetails && (
              <>
                {/* Cushions */}
                {shape.cushions && shape.cushions.map((cushion, i) => (
                  <motion.rect 
                    key={i} 
                    initial={{ scale: 0, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.1, type: "spring" }}
                    x={cushion.x} y={cushion.y} 
                    width={cushion.width} height={cushion.height} 
                    rx={styleParams.borderRadius + 6} 
                    fill={colors.accent}
                    filter="url(#shadowFilter)"
                  />
                ))}
                
                {/* Doors */}
                {shape.doors && shape.doors.map((door, i) => (
                  <motion.rect 
                    key={i} 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    x={door.x} y={door.y} width={door.width} height={door.height} 
                    rx={styleParams.borderRadius} fill={colors.primary} stroke={colors.dark} strokeWidth="1" 
                  />
                ))}
                
                {/* Drawer */}
                {shape.drawer && (
                  <motion.rect
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    x={-25} y={-13} width={50} height={10} rx={styleParams.borderRadius} 
                    fill={colors.secondary}
                  />
                )}
              </>
            )}
            
            {/* ===== LIGHTING OVERLAY (Always on top of visible parts) ===== */}
            {visibleParts.showStructure && (
              <rect
                x={-shape.base.width / 2}
                y={-30}
                width={shape.base.width}
                height={shape.base.height}
                fill="url(#lightingOverlay)"
                style={{ mixBlendMode: 'overlay', pointerEvents: 'none' }}
                rx={styleParams.borderRadius}
              />
            )}
            
            {/* Rim lighting for premium look */}
            {visibleParts.showStructure && (
              <rect
                x={-shape.base.width / 2}
                y={-30}
                width={shape.base.width}
                height={shape.base.height}
                fill="url(#rimLighting)"
                style={{ mixBlendMode: 'screen', pointerEvents: 'none' }}
                rx={styleParams.borderRadius}
              />
            )}
            
            {/* Highlight reflection on hover */}
            {isHovering && visibleParts.showBase && (
              <motion.rect 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                x={-shape.base.width / 2} 
                y={-30} 
                width={shape.base.width} 
                height={8} 
                rx={styleParams.borderRadius} 
                fill="rgba(255,255,255,0.2)"
                style={{ pointerEvents: 'none' }}
              />
            )}
          </g>
        </svg>
        
        {/* Floating Live Labels */}
        <AnimatePresence>
          {(config.material || config.style) && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-black/85 backdrop-blur-md rounded-full px-4 py-1.5 text-white text-[11px] whitespace-nowrap z-10"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }}
            >
              <span className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.primary }} />
                {config.material?.label || 'Select Material'} 
                {config.style?.label && ` • ${config.style.label}`}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// ============================================================
// STEP INDICATOR WITH PROGRESS ANIMATION
// ============================================================
const StepIndicator = ({ step }) => {
  const steps = [
    { number: 1, title: "Choose Type", icon: FiBox, description: "Select furniture type" },
    { number: 2, title: "Style & Material", icon: MdPalette, description: "Customize look" },
    { number: 3, title: "Finalize", icon: FiCheckCircle, description: "Review & request" }
  ];
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((s, idx) => (
          <div key={s.number} className="flex-1 relative">
            {/* Progress line */}
            <div className={`absolute top-5 left-0 right-0 h-0.5 transition-all duration-500 ${
              idx < step - 1 ? 'bg-primary-500' : 'bg-neutral-200 dark:bg-neutral-700'
            }`} />
            
            <div className="relative flex flex-col items-center">
              <motion.div
                animate={{
                  scale: step === s.number ? 1.1 : 1,
                  backgroundColor: step >= s.number ? '#6366f1' : '#e5e7eb'
                }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors ${
                  step >= s.number ? 'bg-primary-500 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500'
                }`}
              >
                {step > s.number ? <FiCheck className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
              </motion.div>
              
              <p className={`text-xs font-semibold mt-2 hidden md:block ${
                step >= s.number ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'
              }`}>
                {s.title}
              </p>
              <p className={`text-[10px] hidden md:block ${
                step >= s.number ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                {s.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// ENHANCED OPTION CARDS WITH RIPPLE EFFECT
// ============================================================
const VisualOptionCard = ({ option, isSelected, onClick, icon: Icon }) => {
  const [ripple, setRipple] = useState(false);
  
  const handleClick = (e) => {
    setRipple(true);
    setTimeout(() => setRipple(false), 300);
    onClick();
  };
  
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      onClick={handleClick}
      className={`relative cursor-pointer rounded-xl p-3 transition-all overflow-hidden ${
        isSelected
          ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg ring-2 ring-primary-300'
          : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-primary-300 hover:shadow-md'
      }`}
    >
      {ripple && (
        <motion.div
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-white rounded-full"
        />
      )}
      <Icon className={`h-6 w-6 mx-auto mb-2 relative z-10 ${isSelected ? 'text-white' : 'text-primary-500'}`} />
      <p className={`text-xs font-semibold text-center relative z-10 ${isSelected ? 'text-white' : 'text-neutral-700 dark:text-neutral-300'}`}>
        {option.label}
      </p>
    </motion.div>
  );
};

// ============================================================
// MATERIAL CARD WITH TEXTURE PREVIEW
// ============================================================
const MaterialVisualCard = ({ material, isSelected, onClick }) => {
  const materialColors = {
    oak: 'from-amber-600 to-amber-400',
    walnut: 'from-amber-800 to-amber-600',
    maple: 'from-amber-500 to-amber-300',
    leather: 'from-red-800 to-red-600',
    velvet: 'from-purple-700 to-purple-500',
    metal: 'from-gray-500 to-gray-400'
  };
  
  const materialPatterns = {
    oak: "repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 2px, transparent 2px, transparent 8px)",
    walnut: "repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, transparent 1px, transparent 6px)",
    maple: "repeating-linear-gradient(90deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 3px, transparent 3px, transparent 9px)",
    leather: "radial-gradient(circle at 30% 40%, rgba(0,0,0,0.05) 1px, transparent 1px)",
    velvet: "repeating-linear-gradient(135deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 4px, transparent 4px, transparent 12px)",
    metal: "repeating-linear-gradient(0deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 1px, transparent 1px, transparent 5px)"
  };
  
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`cursor-pointer rounded-xl p-3 transition-all ${
        isSelected
          ? 'bg-primary-500 text-white shadow-lg ring-2 ring-primary-300'
          : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:shadow-md'
      }`}
    >
      <div 
        className={`w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br ${materialColors[material.value]} shadow-lg`}
        style={{ backgroundImage: materialPatterns[material.value] }}
      />
      <p className={`text-xs font-semibold text-center ${isSelected ? 'text-white' : 'text-neutral-700 dark:text-neutral-300'}`}>
        {material.label}
      </p>
      <p className={`text-[10px] text-center ${isSelected ? 'text-white/80' : 'text-neutral-400'}`}>
        {material.texture}
      </p>
    </motion.div>
  );
};

// ============================================================
// STYLE CARD WITH MORPH PREVIEW
// ============================================================
const StyleVisualCard = ({ style, isSelected, onClick }) => {
  const styleIcons = {
    modern: FiMonitor,
    scandinavian: FiHome,
    industrial: FiTool,
    'mid-century': FiGrid,
    bohemian: FiImage,
    rustic: FiHome
  };
  
  const Icon = styleIcons[style.value] || FiStar;
  
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`cursor-pointer rounded-xl p-3 transition-all ${
        isSelected
          ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg ring-2 ring-primary-300'
          : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:shadow-md'
      }`}
    >
      <Icon className={`h-6 w-6 mx-auto mb-2 ${isSelected ? 'text-white' : 'text-primary-500'}`} />
      <p className={`text-xs font-semibold text-center ${isSelected ? 'text-white' : 'text-neutral-700 dark:text-neutral-300'}`}>
        {style.label}
      </p>
      <p className={`text-[10px] text-center ${isSelected ? 'text-white/80' : 'text-neutral-400'}`}>
        {style.description}
      </p>
    </motion.div>
  );
};

// ============================================================
// MAIN COMPONENT - SINGLE SOURCE OF TRUTH
// ============================================================
const CustomFurniture = () => {
  const navigate = useNavigate();
  const modelContainerRef = useRef(null);
  
  // SINGLE CONFIG STATE - replaces all separate states
  const [config, setConfig] = useState({
    type: null,
    style: null,
    material: null,
    color: null,
    dimensions: '',
    step: 1
  });
  
  const [focus, setFocus] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [tilt, setTilt] = useState(0);
  const [completionAnimation, setCompletionAnimation] = useState(false);
  
  // Furniture options
  const furnitureOptions = [
    { value: 'sofa', label: 'Sofa', icon: FiHome },
    { value: 'bed', label: 'Bed', icon: FiHome },
    { value: 'table', label: 'Table', icon: FiCoffee },
    { value: 'chair', label: 'Chair', icon: FiGrid },
    { value: 'cabinet', label: 'Cabinet', icon: FiBox },
    { value: 'desk', label: 'Desk', icon: FiMonitor }
  ];
  
  const styleOptions = [
    { value: 'modern', label: 'Modern', icon: FiMonitor, description: 'Clean & Minimal' },
    { value: 'scandinavian', label: 'Nordic', icon: FiHome, description: 'Warm & Functional' },
    { value: 'industrial', label: 'Industrial', icon: FiTool, description: 'Raw & Urban' },
    { value: 'mid-century', label: 'Mid-Century', icon: FiGrid, description: 'Retro & Geometric' },
    { value: 'bohemian', label: 'Bohemian', icon: FiImage, description: 'Eclectic & Artistic' },
    { value: 'rustic', label: 'Rustic', icon: FiHome, description: 'Natural & Earthy' }
  ];
  
  const materialOptions = [
    { value: 'oak', label: 'Oak', texture: 'Classic Grain' },
    { value: 'walnut', label: 'Walnut', texture: 'Rich Dark' },
    { value: 'maple', label: 'Maple', texture: 'Smooth Fine' },
    { value: 'leather', label: 'Leather', texture: 'Luxury Soft' },
    { value: 'velvet', label: 'Velvet', texture: 'Plush Deep' },
    { value: 'metal', label: 'Metal', texture: 'Industrial Matte' }
  ];
  
  const colorOptions = ['Natural', 'Walnut', 'Black', 'White', 'Gray', 'Blue'];
  
  // Progressive build handlers
  const handleSelectFurniture = (furniture) => {
    setConfig(prev => ({ ...prev, type: furniture }));
    setTimeout(() => {
      setConfig(prev => ({ ...prev, step: 2 }));
    }, 400);
  };
  
  const handleSelectStyle = (style) => {
    setConfig(prev => ({ ...prev, style }));
    setFocus('style');
    setTimeout(() => setFocus(null), 800);
  };
  
  const handleSelectMaterial = (material) => {
    setConfig(prev => ({ ...prev, material }));
    setFocus('material');
    setTimeout(() => setFocus(null), 800);
  };
  
  const handleSelectColor = (color) => {
    setConfig(prev => ({ ...prev, color }));
    setFocus('color');
    setTimeout(() => setFocus(null), 800);
  };
  
  const handleComplete = () => {
    if (config.style && config.material) {
      setConfig(prev => ({ ...prev, step: 3 }));
      setCompletionAnimation(true);
      
      // Trigger rotation animation
      let rot = 0;
      const interval = setInterval(() => {
        rot += 3;
        setRotation(rot);
        if (rot >= 360) {
          clearInterval(interval);
          setCompletionAnimation(false);
        }
      }, 20);
      
      setTimeout(() => setShowDetails(true), 1000);
    }
  };
  
  const handleReset = () => {
    setConfig({
      type: null,
      style: null,
      material: null,
      color: null,
      dimensions: '',
      step: 1
    });
    setShowDetails(false);
    setRotation(0);
    setTilt(0);
  };
  
  // Mouse move for pseudo-3D parallax
  const handleModelMouseMove = (e) => {
    if (!modelContainerRef.current) return;
    const rect = modelContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt(x * 8);
  };
  
  // Memoized model for performance
  const memoizedModel = useMemo(() => (
    <FurnitureModel 
      config={config}
      focus={focus}
      step={config.step}
      onMouseMove={handleModelMouseMove}
      rotation={rotation}
      tilt={tilt}
    />
  ), [config, focus, rotation, tilt]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section - Simplified with live preview CTA */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-900 dark:to-primary-700 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1600')] bg-cover bg-center opacity-10" />
        <div className="relative py-16 md:py-20 flex flex-col items-center justify-center text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
              animate={{ scale: config.step === 1 ? 1 : 0.98 }}
            >
              Design Your Dream Furniture
            </motion.h1>
            <motion.p className="text-white/80 text-base mb-8 max-w-xl mx-auto">
              Build your piece step by step with our interactive 3D configurator
            </motion.p>
            
            {config.step === 1 && !config.type && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('type-selector')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                className="px-8 py-3 bg-white text-primary-600 rounded-full font-semibold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
              >
                Start Building <FiArrowRight className="h-4 w-4" />
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>
      
      {/* Main Configurator - STICKY LAYOUT */}
      <div className="w-[96%] mx-auto px-[2%] py-8 md:py-10">
        <div className="max-w-7xl mx-auto">
          <StepIndicator step={config.step} />
          
          {/* Two Column Layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* LEFT COLUMN - Controls (35%) */}
            <div className="lg:w-[35%] space-y-4">
              <div className="bg-white dark:bg-neutral-800/50 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-700 shadow-lg">
                <AnimatePresence mode="wait">
                  {config.step === 1 && (
                    <motion.div
                      key="step1"
                      id="type-selector"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div>
                        <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                          <FiBox className="h-5 w-5 text-primary-500" />
                          Choose Your Furniture Type
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {furnitureOptions.map((option) => (
                            <VisualOptionCard
                              key={option.value}
                              option={option}
                              isSelected={config.type?.value === option.value}
                              onClick={() => handleSelectFurniture(option)}
                              icon={option.icon}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <div className="flex items-center gap-2 text-xs text-neutral-400">
                          <FiInfo className="h-3 w-3" />
                          <span>Select a furniture type to continue</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {config.step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-5"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                          <MdPalette className="h-5 w-5 text-primary-500" />
                          Customize Your {config.type?.label}
                        </h3>
                        <button 
                          onClick={handleReset}
                          className="text-xs text-primary-500 hover:text-primary-600 flex items-center gap-1 transition-colors"
                        >
                          <FiRotateCw className="h-3 w-3" />
                          Reset
                        </button>
                      </div>
                      
                      {/* Style Selection */}
                      <div>
                        <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2 block">Design Style</label>
                        <div className="grid grid-cols-2 gap-2">
                          {styleOptions.map((style) => (
                            <StyleVisualCard
                              key={style.value}
                              style={style}
                              isSelected={config.style?.value === style.value}
                              onClick={() => handleSelectStyle(style)}
                            />
                          ))}
                        </div>
                      </div>
                      
                      {/* Material Selection */}
                      <div>
                        <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2 block">Material</label>
                        <div className="grid grid-cols-3 gap-2">
                          {materialOptions.map((material) => (
                            <MaterialVisualCard
                              key={material.value}
                              material={material}
                              isSelected={config.material?.value === material.value}
                              onClick={() => handleSelectMaterial(material)}
                            />
                          ))}
                        </div>
                      </div>
                      
                      {/* Color Selection */}
                      <div>
                        <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2 block">Color / Finish</label>
                        <div className="flex flex-wrap gap-2">
                          {colorOptions.map((color) => (
                            <motion.button
                              key={color}
                              whileHover={{ scale: 1.05, y: -1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleSelectColor(color)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                config.color === color
                                  ? 'bg-primary-500 text-white shadow-md'
                                  : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                              }`}
                            >
                              {color}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Dimensions */}
                      <div>
                        <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2 block flex items-center justify-between">
                          <span>Dimensions (L×W×H)</span>
                          <button 
                            type="button"
                            className="text-[10px] text-primary-500 hover:text-primary-600 flex items-center gap-0.5"
                          >
                            
                            Size Guide
                          </button>
                        </label>
                        <input
                          type="text"
                          value={config.dimensions}
                          onChange={(e) => setConfig(prev => ({ ...prev, dimensions: e.target.value }))}
                          placeholder='e.g., 72" × 36" × 30"'
                          className="w-full rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
                        />
                      </div>
                      
                      {/* Progress indicator */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                          <span>Style {config.style ? '✓' : '⬚'}</span>
                          <span>Material {config.material ? '✓' : '⬚'}</span>
                          <span>Color {config.color ? '✓' : '⬚'}</span>
                        </div>
                        <div className="h-1 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-primary-500 rounded-full"
                            animate={{ width: `${(Object.values(config).filter(v => v !== null && v !== '' && v !== 1 && v !== 2).length / 4) * 100}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                      
                      {/* Complete Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleComplete}
                        disabled={!config.style || !config.material}
                        className={`w-full py-3 rounded-lg font-semibold text-sm transition-all ${
                          !config.style || !config.material
                            ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-lg'
                        }`}
                      >
                        Complete My Design
                      </motion.button>
                    </motion.div>
                  )}
                  
                  {config.step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-3"
                      >
                        <FiCheckCircle className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Design Complete!</h3>
                      <p className="text-sm text-neutral-500">Your custom furniture is ready to be crafted</p>
                      
                      <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4 space-y-2 text-left">
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-500">Type</span>
                          <span className="font-semibold text-neutral-900 dark:text-white">{config.type?.label}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-500">Style</span>
                          <span className="font-semibold text-neutral-900 dark:text-white">{config.style?.label}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-500">Material</span>
                          <span className="font-semibold text-neutral-900 dark:text-white">{config.material?.label}</span>
                        </div>
                        {config.color && (
                          <div className="flex justify-between text-sm">
                            <span className="text-neutral-500">Color</span>
                            <span className="font-semibold text-neutral-900 dark:text-white">{config.color}</span>
                          </div>
                        )}
                        {config.dimensions && (
                          <div className="flex justify-between text-sm">
                            <span className="text-neutral-500">Dimensions</span>
                            <span className="font-semibold text-neutral-900 dark:text-white">{config.dimensions}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={handleReset}
                          className="flex-1 py-2.5 rounded-lg font-medium text-sm border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                        >
                          Start Over
                        </button>
                        <button
                          onClick={() => setShowDetails(true)}
                          className="flex-1 py-2.5 rounded-lg font-medium text-sm bg-primary-600 text-white hover:bg-primary-700 transition-colors flex items-center justify-center gap-1"
                        >
                          Request Quote <FiArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {/* RIGHT COLUMN - Sticky 3D Model (65%) */}
            <div className="lg:w-[65%]">
              <div 
                ref={modelContainerRef}
                className="sticky top-24 bg-white dark:bg-neutral-800/50 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Live Preview</h3>
                    <p className="text-[10px] text-neutral-400">Updates instantly with your choices</p>
                  </div>
                  {config.step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full"
                    >
                      <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                        <FiCheckCircle className="h-3 w-3" /> Complete
                      </span>
                    </motion.div>
                  )}
                </div>
                
                {memoizedModel}
                
                {/* Build progress messages */}
                <AnimatePresence>
                  {config.step === 2 && config.type && !config.style && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-center"
                    >
                      <p className="text-xs text-amber-700 dark:text-amber-400 flex items-center justify-center gap-1">
                        <FiStar className="h-3 w-3" /> Select a style to continue
                      </p>
                    </motion.div>
                  )}
                  {config.step === 2 && config.style && !config.material && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-center"
                    >
                      <p className="text-xs text-amber-700 dark:text-amber-400 flex items-center justify-center gap-1">
                        <MdPalette className="h-3 w-3" /> Choose a material to complete your design
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Rotation hint for final step */}
                {config.step === 3 && completionAnimation && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-center"
                  >
                    <p className="text-[10px] text-primary-500 flex items-center justify-center gap-1">
                      <FiRotateCw className="h-3 w-3 animate-spin" />
                      Rotating for full view...
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
          
          {/* Quote Request Modal */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowDetails(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="bg-white dark:bg-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Request a Quote</h3>
                    <button onClick={() => setShowDetails(false)} className="text-neutral-400 hover:text-neutral-600">
                      <FiX className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="mb-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                    <p className="text-xs text-primary-700 dark:text-primary-300">
                      <strong>{config.type?.label}</strong> • {config.style?.label} • {config.material?.label}
                      {config.color && ` • ${config.color}`}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <input type="text" placeholder="Your Name" className="w-full rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    <input type="email" placeholder="Email Address" className="w-full rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    <input type="tel" placeholder="Phone Number" className="w-full rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    <textarea placeholder="Additional Notes" rows={3} className="w-full rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    
                    <button className="w-full py-2.5 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-sm hover:shadow-lg transition-all">
                      Submit Request
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Contact CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 text-center"
          >
            <button 
              onClick={() => navigate('/contact')}
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium inline-flex items-center gap-2 group"
            >
              Need expert advice?
              <span className="border-b border-primary-600">Chat with our design consultant</span>
              <FiArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CustomFurniture);