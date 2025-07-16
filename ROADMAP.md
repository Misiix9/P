# Portfolio Linux Desktop – Build Roadmap

## 🔧 Phase 1 – Setup & Boilerplate
- [ ] Initialize project with Vite + React + TailwindCSS
- [ ] Add framer-motion and tailwind plugins for glass effect (backdrop-filter)
- [ ] Setup file structure:

/components
/Taskbar
/StartMenu
/DesktopIcon
/Window
/Apps
/MyComputer
/Trash
/Terminal
/Security
/Terms
/Contact
/assets
/utils
/styles

## 🖥️ Phase 2 – UI Shell
- [ ] Create top bar (taskbar) with:
- Start button
- Time/date (update with `setInterval`)
- Icons (battery, volume, network)
- [ ] Create desktop with:
- Clickable, draggable desktop icons
- [ ] Add state for active windows & stacking

## 🪟 Phase 3 – Window Management
- [ ] Create <Window> component:
- Draggable & resizable
- Top bar with Minimize / Maximize / Close
- Handle z-index stacking
- [ ] Animate open/close/maximize/minimize with Framer Motion

## 🧠 Phase 4 – Apps Implementation
- [ ] My Computer:
- Show folders and inner contents
- [ ] Trash:
- Show deleted items
- Buttons for restore and empty
- [ ] Terminal:
- Animated typing effect
- Accept basic commands (`help`, `about`, `contact`)
- [ ] Security:
- List of tech stacks and security practices
- [ ] Terms:
- Render markdown content scrollable
- [ ] Contact:
- Form with name, email, message, send button
- Add basic validation

## ✨ Phase 5 – Desktop Interactivity & Polish
- [ ] Desktop icon dragging & positioning (localStorage optional)
- [ ] Add animations (open, close, hover, drag)
- [ ] Smooth transitions on all user interactions
- [ ] Add Liquid Glass effects to all windows and panels
- [ ] Add sounds on opening/closing window (optional)
- [ ] Add fake notifications (optional)

## 🚀 Phase 6 – Deploy
- [ ] Optimize performance
- [ ] Remove unused styles and components
- [ ] Export to Netlify, Vercel, or GitHub Pages 