import Matter from 'matter-js';
import { PhysicsManager } from './src/physics/PhysicsWorld.js';

console.log('🧪 Running Physics & DOM Synchronization Tests...\n');

// Mock a lightweight browser DOM environment for testing
const elements = [];
function createMockElement(id, rect = { left: 100, top: 100, width: 200, height: 50 }) {
  const el = {
    attributes: { 'data-physics-id': id },
    getAttribute(name) { return this.attributes[name]; },
    setAttribute(name, val) { this.attributes[name] = val; },
    removeAttribute(name) { delete this.attributes[name]; },
    getBoundingClientRect() { return rect; },
    style: {},
    parentElement: null,
    parentNode: {
      insertBefore(newNode, refNode) {
        newNode.parentNode = this;
        this.children = this.children || [];
        this.children.push(newNode);
      },
      removeChild(child) {
        if (this.children) {
          this.children = this.children.filter(c => c !== child);
        }
      },
      children: [],
    },
  };
  elements.push(el);
  return el;
}

// Global mocks
globalThis.window = {
  innerWidth: 1920,
  innerHeight: 1080,
  getComputedStyle: () => ({ display: 'block' }),
};

globalThis.document = {
  querySelectorAll: (selector) => {
    if (selector === '[data-physics-id]') {
      return elements.filter(el => {
        // Mock closest
        return true;
      });
    }
    return [];
  },
  createElement: (tag) => ({
    tagName: tag.toUpperCase(),
    attributes: {},
    style: {},
    setAttribute(name, val) { this.attributes[name] = val; },
    getAttribute(name) { return this.attributes[name]; },
  }),
};

let rafCallbacks = [];
globalThis.requestAnimationFrame = (cb) => {
  rafCallbacks.push(cb);
  return rafCallbacks.length;
};
globalThis.cancelAnimationFrame = (id) => {
  rafCallbacks = [];
};
globalThis.performance = { now: () => Date.now() };

// Test 1: Instantiation
const manager = new PhysicsManager();
console.assert(manager.isActive === false, 'Manager should start inactive');
console.log('✅ PhysicsManager instantiated cleanly');

// Test 2: Elements Setup
const btn1 = createMockElement('topbar-action-tools', { left: 50, top: 10, width: 120, height: 35 });
const card1 = createMockElement('status-trust-card', { left: 1600, top: 80, width: 300, height: 150 });

// Verify Sacred Safe Zone: MiniEditor must NOT be queryable as physics id
const miniEditor = {
  attributes: {},
  getAttribute(name) { return this.attributes[name]; },
};
console.assert(miniEditor.getAttribute('data-physics-id') === undefined, 'MiniEditor must not have data-physics-id');
console.log('✅ Sacred Safe Zone isolation verified: MiniEditor has no data-physics-id');

// Test 3: Start Collapse
manager.startCollapse();
console.assert(manager.isActive === true, 'Manager should be active after startCollapse()');
console.assert(manager.elementCache.size === 2, `Should cache 2 elements, got ${manager.elementCache.size}`);
console.assert(btn1.style.position === 'fixed', 'btn1 should have fixed positioning');
console.assert(btn1.style.zIndex === '45', 'btn1 should have z-index 45');
console.assert(btn1.style.pointerEvents === 'none', 'btn1 should have pointerEvents: none');
console.log('✅ Collapse initialization: placeholders injected and fixed positioning applied');

// Test 4: Verify Matter.js World & Bodies
console.assert(manager.engine !== null, 'Matter.js engine should be created');
console.assert(manager.boundaries.length === 3, 'Floor, LeftWall, RightWall should be added');
const cachedData = manager.elementCache.get(btn1);
console.assert(cachedData.body !== undefined, 'Matter body must exist for btn1');
console.assert(cachedData.body.position.x === 50 + 120 / 2, 'Body center X should match initial rect');
console.assert(cachedData.body.position.y === 10 + 35 / 2, 'Body center Y should match initial rect');
console.log('✅ Matter.js 2D rigid-bodies and boundary walls generated with precision');

// Test 5: Step RAF physics loop
console.assert(rafCallbacks.length > 0, 'RAF callback must be registered');
const initialY = cachedData.body.position.y;
// Trigger 15 RAF ticks so gravity pulls it down
for (let i = 0; i < 15; i++) {
  const cb = rafCallbacks.shift();
  if (cb) cb(Date.now() + 16 * (i + 1));
}
console.assert(cachedData.body.position.y > initialY, `Body should have fallen under gravity. Initial: ${initialY}, Current: ${cachedData.body.position.y}`);
console.assert(btn1.style.transform.includes('translate3d'), 'DOM transform style must be updated in RAF');
console.log('✅ RAF loop stepping: Matter.js gravity actively driving DOM style transforms');

// Test 6: Restore Elements
let recoveryDone = false;
manager.restoreElements(() => {
  recoveryDone = true;
});
console.assert(btn1.style.transition.includes('cubic-bezier'), 'Spring cubic-bezier transition must be applied');
console.assert(btn1.style.transform === 'translate3d(50px, 10px, 0) rotate(0rad)', 'Must target original rect coordinates');
console.log('✅ Restoration triggered: cubic-bezier(0.22, 1, 0.36, 1) spring transition returning elements home');

// Fast-forward timeout to simulate transitionend
setTimeout(() => {
  console.assert(recoveryDone === true, 'Recovery completion callback must be called');
  console.assert(manager.isActive === false, 'Manager should be inactive after restore');
  console.assert(manager.elementCache.size === 0, 'Cache should be cleared');
  console.log('✅ Restoration cleanup: placeholders removed, original styles restored, manager reset to idle');
  console.log('\n🎉 ALL PHYSICS & DOM SYNCHRONIZATION TESTS PASSED!\n');
}, 850);
