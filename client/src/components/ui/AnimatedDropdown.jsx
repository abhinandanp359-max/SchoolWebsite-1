import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

/**
 * AnimatedDropdown
 * A premium, fluid dropdown component using GSAP for physical-feeling animations.
 * Features:
 * - Smooth drop-down reveal with slight overshoot and settle (back.out ease)
 * - Subtle opacity and scale transitions
 * - Supports both hover and click triggers
 * - Reusable and highly customizable
 */
const AnimatedDropdown = ({
  trigger,
  children,
  duration = 0.7,
  ease = "back.out(1.2)", // Provides the natural spring-like overshoot
  distance = -30, // Start slightly above
  className = "",
  dropdownClassName = "",
  triggerMode = "click", // 'click' or 'hover'
  isOpen: controlledIsOpen,
  onClose,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  
  const handleOpen = useCallback(() => setInternalIsOpen(true), []);
  const handleClose = useCallback(() => {
    setInternalIsOpen(false);
    if (onClose) onClose();
  }, [onClose]);
  
  const handleToggle = useCallback(() => isOpen ? handleClose() : handleOpen(), [isOpen, handleClose, handleOpen]);

  useGSAP(() => {
    if (!dropdownRef.current) return;
    
    if (isOpen) {
      // Reveal animation: Drop down from top, scale up slightly, fade in
      gsap.fromTo(dropdownRef.current, 
        { 
          y: distance, 
          opacity: 0,
          scale: 0.95,
          pointerEvents: 'none',
          visibility: 'visible',
        },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          duration: duration, 
          ease: ease,
          pointerEvents: 'auto',
          clearProps: "transform" // Clean up inline transforms when done
        }
      );
    } else {
      // Closing animation: Smooth upward motion with fade
      gsap.to(dropdownRef.current, {
        y: distance * 0.8, // Don't go all the way back up to make it feel gentler
        opacity: 0,
        scale: 0.95,
        duration: duration * 0.6, // Slightly faster on close
        ease: "power2.inOut",
        pointerEvents: 'none',
        onComplete: () => {
          gsap.set(dropdownRef.current, { visibility: 'hidden' });
        }
      });
    }
  }, { dependencies: [isOpen, distance, duration, ease], scope: containerRef });

  // Handle outside click to close
  useEffect(() => {
    if (!isOpen || triggerMode !== 'click' || isControlled) return;
    
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        handleClose();
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen, triggerMode, isControlled, handleClose]);

  const triggerProps = triggerMode === 'hover' && !isControlled
    ? { onMouseEnter: handleOpen, onMouseLeave: handleClose }
    : { onClick: handleToggle };

  const dropdownHoverProps = triggerMode === 'hover' && !isControlled
    ? { onMouseEnter: handleOpen, onMouseLeave: handleClose }
    : {};

  return (
    <div 
      ref={containerRef} 
      className={`relative inline-block ${className}`} 
      {...(triggerMode === 'hover' && !isControlled ? { onMouseLeave: handleClose } : {})}
    >
      <div 
        className="cursor-pointer inline-block"
        {...triggerProps}
      >
        {trigger}
      </div>
      
      <div
        ref={dropdownRef}
        className={`absolute left-0 top-full z-50 min-w-max origin-top pt-2 ${dropdownClassName}`}
        style={{ opacity: 0, visibility: 'hidden', pointerEvents: 'none' }} // Initial state
        {...dropdownHoverProps}
      >
        {children}
      </div>
    </div>
  );
};

export default AnimatedDropdown;
