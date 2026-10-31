import { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { OSMood } from '../app/osStateMachine.js';
import { audioManager } from '../audio/AudioManager.js';

/**
 * PhysicsWorld Manager
 * Bridges Matter.js 2D rigid-body simulation with React DOM elements.
 * Adheres strictly to Section 4 of AGENTS.md:
 * - Invisible placeholders to prevent central editor layout reflow
 * - RAF loop decoupled from React state
 * - Smooth spring restoration via cubic-bezier(0.22, 1, 0.36, 1)
 */
export class PhysicsManager {
  constructor() {
    this.engine = null;
    this.world = null;
    this.rafId = null;
    this.isActive = false;
    this.isRestoring = false;
    this.elementCache = new Map(); // el -> { id, rect, originalStyle, placeholder, body }
    this.boundaries = [];
  }

  /**
   * Detaches all [data-physics-id] elements and drops them under Matter.js gravity
   */
  startCollapse() {
    if (this.isActive || this.isRestoring) return;

    // 1. Query all eligible elements, filtering out any nested inside another physics element
    const allElements = Array.from(document.querySelectorAll('[data-physics-id]'));
    const elements = allElements.filter(
      (el) => !el.parentElement?.closest('[data-physics-id]')
    );

    if (elements.length === 0) return;

    this.isActive = true;

    // 2. Initialize Matter.js Engine & World
    this.engine = Matter.Engine.create({
      gravity: { x: 0, y: 1.2, scale: 0.001 },
    });
    this.world = this.engine.world;

    // 3. Create static boundaries (Floor, Left Wall, Right Wall)
    const width = window.innerWidth;
    const height = window.innerHeight;
    const wallThickness = 120;

    const floor = Matter.Bodies.rectangle(
      width / 2,
      height - 15,
      width * 2,
      wallThickness,
      { isStatic: true, label: 'Floor' }
    );

    const leftWall = Matter.Bodies.rectangle(
      -wallThickness / 2,
      height / 2,
      wallThickness,
      height * 2,
      { isStatic: true, label: 'LeftWall' }
    );

    const rightWall = Matter.Bodies.rectangle(
      width + wallThickness / 2,
      height / 2,
      wallThickness,
      height * 2,
      { isStatic: true, label: 'RightWall' }
    );

    this.boundaries = [floor, leftWall, rightWall];
    Matter.World.add(this.world, this.boundaries);

    // 4. Measure, create placeholders, and construct Matter.js bodies
    const bodies = [];

    elements.forEach((el) => {
      const id = el.getAttribute('data-physics-id');
      const rect = el.getBoundingClientRect();

      // Skip elements that are not currently rendered/visible
      if (rect.width === 0 || rect.height === 0) return;

      const originalStyle = el.getAttribute('style') || '';

      // Create an invisible placeholder with identical dimensions to prevent layout reflow
      const placeholder = document.createElement('div');
      placeholder.setAttribute('data-physics-placeholder', id);
      placeholder.style.width = `${rect.width}px`;
      placeholder.style.height = `${rect.height}px`;
      placeholder.style.visibility = 'hidden';
      placeholder.style.pointerEvents = 'none';
      placeholder.style.flexShrink = '0';
      
      const computedDisplay = window.getComputedStyle(el).display;
      placeholder.style.display = computedDisplay === 'inline' ? 'inline-block' : computedDisplay;

      if (el.parentNode) {
        el.parentNode.insertBefore(placeholder, el);
      }

      // Detach element into fixed position
      el.style.position = 'fixed';
      el.style.top = '0px';
      el.style.left = '0px';
      el.style.width = `${rect.width}px`;
      el.style.height = `${rect.height}px`;
      el.style.margin = '0px';
      el.style.zIndex = '45';
      el.style.pointerEvents = 'none'; // Ensure user can still type in the editor beneath!
      el.style.transform = `translate3d(${rect.left}px, ${rect.top}px, 0) rotate(0rad)`;
      el.style.willChange = 'transform';

      // Create rigid body
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const body = Matter.Bodies.rectangle(centerX, centerY, rect.width, rect.height, {
        restitution: 0.38,
        friction: 0.12,
        frictionAir: 0.015,
        density: 0.001,
        label: id,
      });

      // Theatrical chaos: slight random angular velocity and horizontal impulse
      const randomAngVel = (Math.random() - 0.5) * 0.14; // rad/s
      Matter.Body.setAngularVelocity(body, randomAngVel);

      const forceX = (Math.random() - 0.5) * 0.04 * body.mass;
      const forceY = (Math.random() * -0.012) * body.mass; // subtle initial jump
      Matter.Body.applyForce(body, body.position, { x: forceX, y: forceY });

      bodies.push(body);
      this.elementCache.set(el, { id, rect, originalStyle, placeholder, body });
    });

    Matter.World.add(this.world, bodies);

    // 5. Start RequestAnimationFrame physics sync loop
    let lastTime = performance.now();
    const updateLoop = (now) => {
      if (!this.isActive) return;

      const delta = Math.min(now - lastTime, 32); // Clamp delta to avoid spiral
      lastTime = now;

      Matter.Engine.update(this.engine, delta);

      // Directly update DOM transforms without React re-rendering
      this.elementCache.forEach(({ rect, body }, el) => {
        if (body) {
          const x = body.position.x - rect.width / 2;
          const y = body.position.y - rect.height / 2;
          el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${body.angle}rad)`;
        }
      });

      this.rafId = requestAnimationFrame(updateLoop);
    };

    this.rafId = requestAnimationFrame(updateLoop);
  }

  /**
   * Smoothly restores detached elements back to their original coordinates
   */
  restoreElements(onComplete) {
    if (!this.isActive) {
      if (onComplete) onComplete();
      return;
    }

    this.isRestoring = true;

    // 1. Cancel RAF loop
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    // 2. Destroy Matter.js world & engine
    if (this.engine) {
      Matter.World.clear(this.world, false);
      Matter.Engine.clear(this.engine);
      this.engine = null;
      this.world = null;
    }

    const transitionDuration = 750; // ms

    // 3. Animate all elements back to their cached home coordinates
    this.elementCache.forEach(({ rect }, el) => {
      el.style.transition = 'transform 0.75s cubic-bezier(0.22, 1, 0.36, 1)';
      el.style.transform = `translate3d(${rect.left}px, ${rect.top}px, 0) rotate(0rad)`;
    });

    // 4. Once transition completes, strip fixed styles and remove placeholders
    setTimeout(() => {
      this.elementCache.forEach(({ placeholder, originalStyle }, el) => {
        // Remove placeholder div
        if (placeholder && placeholder.parentNode) {
          placeholder.parentNode.removeChild(placeholder);
        }

        // Restore original inline styles cleanly
        if (originalStyle) {
          el.setAttribute('style', originalStyle);
        } else {
          el.removeAttribute('style');
        }
      });

      this.elementCache.clear();
      this.isActive = false;
      this.isRestoring = false;

      if (onComplete) {
        onComplete();
      }
    }, transitionDuration + 60);
  }

  /**
   * Instant abort and hard reset (for Reset Demo button)
   */
  hardReset() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    if (this.engine) {
      Matter.World.clear(this.world, false);
      Matter.Engine.clear(this.engine);
      this.engine = null;
      this.world = null;
    }

    this.elementCache.forEach(({ placeholder, originalStyle }, el) => {
      if (placeholder && placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
      }
      if (originalStyle) {
        el.setAttribute('style', originalStyle);
      } else {
        el.removeAttribute('style');
      }
    });

    this.elementCache.clear();
    this.isActive = false;
    this.isRestoring = false;
  }
}

// Global Singleton Instance
export const physicsManager = new PhysicsManager();

/**
 * React Hook that monitors OS mood and triggers physics collapse / restore
 */
export function usePhysicsCollapse({ mood, trust, onRecoveryComplete }) {
  const managerRef = useRef(physicsManager);

  useEffect(() => {
    const manager = managerRef.current;

    // Trigger collapse when entering MENTAL_BREAKDOWN or BENGALURU_BOSS_FIGHT
    if (mood === OSMood.MENTAL_BREAKDOWN || mood === OSMood.BENGALURU_BOSS_FIGHT) {
      if (!manager.isActive) {
        manager.startCollapse();
        audioManager.playShatterThud();
      }
    } 
    // Trigger smooth restoration when entering RECOVERY
    else if (mood === OSMood.RECOVERY) {
      if (manager.isActive) {
        manager.restoreElements(() => {
          if (onRecoveryComplete) onRecoveryComplete();
        });
      }
    }
    // If state is hard reset to CALM or 100% trust, immediately abort any physics
    else if (mood === OSMood.CALM && trust === 100) {
      if (manager.isActive) {
        manager.hardReset();
      }
    }
  }, [mood, trust, onRecoveryComplete]);

  return managerRef.current;
}
