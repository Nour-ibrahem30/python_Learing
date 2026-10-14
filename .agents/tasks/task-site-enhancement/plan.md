# Implementation Plan

This plan enhances animations and layout for the Python-learning platform using Framer Motion. All animations use transform and opacity only for 60fps performance and respect prefers-reduced-motion.

## Existing Behavior to Preserve

- All navigation links (internal routes via react-router-dom, anchor links)
- RTL Arabic text rendering with dir="ltr" on code blocks
- Dark mode support via [data-theme='dark'] selectors
- Responsive breakpoints at 1450px, 1000px, 700px
- Existing Framer Motion animations (fade-in, slide variants)
- useProgress hook functionality for lesson tracking
- Playground state management (name, output, feedback, isRunning)

## Prefers-Reduced-Motion Strategy

global.css already has a comprehensive reduced-motion rule. For new animations:
1. CSS animations: Rely on existing `animation-duration: 0.01ms !important`
2. Framer Motion: Use `useReducedMotion()` hook to conditionally disable complex animations
3. New CSS: Add explicit overrides in the existing `@media (prefers-reduced-motion: reduce)` block

---

- [ ] 1. **Hero Section - Floating Code Editor**
      Add floating animation to CodeEditor component using CSS @keyframes float in CodeEditor.css (translateY 0 to -10px). Apply to .editor with animation: float 4s ease-in-out infinite.
      Files: src/components/sections/CodeEditor.css
      Verify: `npm run build` — no errors, CodeEditor.css compiles

- [ ] 2. **Hero Section - Gradient Text Effect**
      Add .gradient-text class in Hero.css with background: linear-gradient, background-clip: text, -webkit-text-fill-color: transparent. Add @keyframes gradient-shift to animate background-position. Apply to .highlight span in Hero.jsx.
      Files: src/components/sections/Hero.css, src/components/sections/Hero.jsx
      Verify: `npm run build` — no errors

- [ ] 3. **Hero Section - Animated Background Blobs**
      Add ::before and ::after pseudo-elements to .hero in Hero.css with border-radius: 50%, background gradients, filter: blur(60px), opacity: 0.3. Add @keyframes blob-move with transform: translate and scale.
      Files: src/components/sections/Hero.css
      Verify: `npm run build` — no errors

- [ ] 4. **Hero Section - Improved Scribble Animation**
      Enhance motion.path in Hero.jsx with custom ease array [0.65, 0, 0.35, 1] for overshoot effect. Increase pathLength animation to include slight overshoot and settle.
      Files: src/components/sections/Hero.jsx
      Verify: `npm run build` — no errors

- [ ] 5. **Hero Section - Staggered Text Reveal**
      Split paragraph text into motion.span words in Hero.jsx. Extend containerVariants staggerChildren to 0.05. Each word gets itemVariants with y: 10 to 0.
      Files: src/components/sections/Hero.jsx
      Verify: `npm run build` — no errors

- [ ] 6. **Hero Section - CTA Button Pulse**
      Add whileHover boxShadow animation to Button.jsx primary variant: boxShadow cycles through '0 0 0 0 rgba(48,101,200,0.4)' to '0 0 0 15px rgba(48,101,200,0)'.
      Files: src/components/ui/Button.jsx
      Verify: `npm run build` — no errors

- [ ] 7. **LessonCard - 3D Tilt on Hover**
      Add perspective: 1000px to card wrapper in LessonCard.jsx. Use onMouseMove to calculate rotateX/rotateY based on mouse position via useMotionValue. Apply style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}.
      Files: src/components/sections/LessonCard.jsx
      Verify: `npm run build` — no errors

- [ ] 8. **LessonCard - Animated Gradient Border**
      Add .lesson::before in LessonCard.css with conic-gradient border. Add @keyframes gradient-rotate that rotates the gradient. Show border on hover via opacity transition.
      Files: src/components/sections/LessonCard.css
      Verify: `npm run build` — no errors

- [ ] 9. **LessonCard - Typing Animation for Code Preview**
      In LessonCard.jsx, animate code preview text character by character using motion.span with staggerChildren: 0.02 on whileInView. Add cursor span at end with blink animation.
      Files: src/components/sections/LessonCard.jsx
      Verify: `npm run build` — no errors

- [ ] 10. **LessonCard - Scale + Glow on Hover**
       Add scale: 1.02 to whileHover in LessonCard.jsx. Add @keyframes glow-pulse in LessonCard.css for animated box-shadow. Apply animation on :hover.
       Files: src/components/sections/LessonCard.jsx, src/components/sections/LessonCard.css
       Verify: `npm run build` — no errors

- [ ] 11. **LessonCard - Animated Progress Bar for Viewed**
       Add .progress-bar div in LessonCard.jsx below thumbnail when viewed=true. Style in LessonCard.css with height: 3px, gradient background. Animate width from 0% to 100% on mount.
       Files: src/components/sections/LessonCard.jsx, src/components/sections/LessonCard.css
       Verify: `npm run build` — no errors

- [ ] 12. **Ticker - Infinite Marquee Scroll**
       In Ticker.jsx, double items array for seamless loop. Wrap in motion.div with animate={{ x: ['0%', '-50%'] }}, transition: { repeat: Infinity, duration: 25, ease: 'linear' }. Use useAnimationControls for hover pause.
       Files: src/components/sections/Ticker.jsx
       Verify: `npm run build` — no errors

- [ ] 13. **Ticker - Gradient Fade Edges**
       Add ::before and ::after to .ticker in Ticker.css with gradient from var(--paper) to transparent. Position absolute on left/right edges with pointer-events: none.
       Files: src/components/sections/Ticker.css
       Verify: `npm run build` — no errors

- [ ] 14. **Roadmap - Animated Connecting Line**
       Add .steps::before in Roadmap.css with vertical line. In Roadmap.jsx, wrap steps in container with motion.div for line that animates scaleY: [0, 1] on whileInView.
       Files: src/components/sections/Roadmap.jsx, src/components/sections/Roadmap.css
       Verify: `npm run build` — no errors

- [ ] 15. **Roadmap - Number Counter Animation**
       In Roadmap.jsx, create AnimatedNumber component using useInView and useState to count from 0 to target. Use useEffect with requestAnimationFrame loop for smooth counting.
       Files: src/components/sections/Roadmap.jsx
       Verify: `npm run build` — no errors

- [ ] 16. **Roadmap - Icon Hover Animations**
       Add @keyframes bounce-subtle to Roadmap.css. Apply to .step-num on hover with transform: scale(1.1) and animation.
       Files: src/components/sections/Roadmap.css
       Verify: `npm run build` — no errors

- [ ] 17. **Playground - Typing Cursor Animation**
       Add ::after pseudo-element to .mini-editor input in Playground.css with blinking cursor when :focus. Use @keyframes cursor-blink.
       Files: src/components/sections/Playground.css
       Verify: `npm run build` — no errors

- [ ] 18. **Playground - Confetti on Success**
       In Playground.jsx, create Confetti component with array of motion.div particles. On success feedback, spawn particles with random positions, animate fall and fade. Clean up with AnimatePresence.
       Files: src/components/sections/Playground.jsx, src/components/sections/Playground.css
       Verify: `npm run build` — no errors

- [ ] 19. **Playground - Improved Output Reveal**
       Animate output text in Playground.jsx with typing effect using motion.span for each character, staggerChildren: 0.01 triggered when output changes.
       Files: src/components/sections/Playground.jsx
       Verify: `npm run build` — no errors

- [ ] 20. **About - Parallax Scroll Effect**
       In About.jsx, use useScroll() and useTransform() from framer-motion. Apply different y offsets to photo (slower) and content (faster) based on scrollYProgress.
       Files: src/components/sections/About.jsx
       Verify: `npm run build` — no errors

- [ ] 21. **About - Animated Social Icons**
       Add whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }} to social-link in About.jsx. Add spring transition for bounce effect.
       Files: src/components/sections/About.jsx
       Verify: `npm run build` — no errors

- [ ] 22. **About - Image Reveal Animation**
       Animate about-photo clipPath in About.jsx: initial={{ clipPath: 'circle(0%)' }}, whileInView={{ clipPath: 'circle(100%)' }} with transition duration 0.8s.
       Files: src/components/sections/About.jsx
       Verify: `npm run build` — no errors

- [ ] 23. **About - Tag Rotation Animation**
       Enhance about-tag in About.jsx with animate={{ rotate: [6, 8, 6] }} and transition: { repeat: Infinity, duration: 3 } for continuous subtle movement.
       Files: src/components/sections/About.jsx
       Verify: `npm run build` — no errors

- [ ] 24. **Footer - Wave Animation**
       Add .footer-wave SVG or CSS shape before footer in Footer.jsx. Animate with @keyframes wave in Footer.css using translateX on repeated pattern.
       Files: src/components/layout/Footer.jsx, src/components/layout/Footer.css
       Verify: `npm run build` — no errors

- [ ] 25. **Footer - Link Hover Animations**
       Wrap footer links in motion.a with whileHover={{ y: -3, color: 'var(--blue)' }} and transition: { type: 'spring', stiffness: 300 }.
       Files: src/components/layout/Footer.jsx
       Verify: `npm run build` — no errors

- [ ] 26. **Footer - Animated Back-to-Top**
       Add bouncing arrow animation to back-to-top link in Footer.jsx using motion.span with animate={{ y: [0, -5, 0] }}, repeat: Infinity. Add smooth scroll onClick.
       Files: src/components/layout/Footer.jsx
       Verify: `npm run build` — no errors

- [ ] 27. **Global - Scroll Animation Utilities**
       Add .animate-on-scroll and .animate-on-scroll.visible classes in global.css with opacity and transform transitions. Add .fade-up, .fade-in, .slide-left utility variants.
       Files: src/styles/global.css
       Verify: `npm run build` — no errors

- [ ] 28. **Global - Animated Focus States**
       Enhance :focus-visible in global.css with animated box-shadow using transition. Add subtle @keyframes focus-glow for accessibility-friendly animated ring.
       Files: src/styles/global.css
       Verify: `npm run build` — no errors

- [ ] 29. **Global - Skeleton Loading Animations**
       Add .skeleton class with @keyframes shimmer in global.css. Animated linear-gradient background moving via background-position. Add .skeleton-text, .skeleton-card variants.
       Files: src/styles/global.css
       Verify: `npm run build` — no errors

- [ ] 30. **LessonPage - Hero Parallax**
       In LessonPage.jsx, add useScroll with ref on lesson-hero. Use useTransform to create y offset for content (-30px range) and code window (opposite direction).
       Files: src/pages/LessonPage.jsx
       Verify: `npm run build` — no errors

- [ ] 31. **LessonPage - Copy Animation Feedback**
       Enhance copy button in LessonPage.jsx with AnimatePresence. On click, animate button content change to '✓ تم' with motion.span, add green flash via animate={{ backgroundColor }}.
       Files: src/pages/LessonPage.jsx
       Verify: `npm run build` — no errors

- [ ] 32. **LessonPage - Reading Progress Bar**
       Add ReadingProgress component in LessonPage.jsx using useScroll(). Render motion.div with position: fixed, top: 0, scaleX bound to scrollYProgress. Style in LessonPage.css.
       Files: src/pages/LessonPage.jsx, src/pages/LessonPage.css
       Verify: `npm run build` — no errors

- [ ] 33. **LessonPage - Navigation Card Hover**
       Enhance .nav-card in LessonPage.css with scale(1.02) and y: -4 on hover. Add ::before gradient sweep using translateX animation.
       Files: src/pages/LessonPage.css
       Verify: `npm run build` — no errors

- [ ] 34. **NotFoundPage - Bouncing Snake**
       Add animate={{ y: [0, -20, 0] }} to snake emoji span in NotFoundPage.jsx. Set transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' }.
       Files: src/pages/NotFoundPage.jsx
       Verify: `npm run build` — no errors

- [ ] 35. **NotFoundPage - Glitch Text Effect**
       Add @keyframes glitch with skew and clip-path in NotFoundPage.css. Add ::before/::after pseudo-elements to .not-found-title with offset positions and color shift.
       Files: src/pages/NotFoundPage.css, src/pages/NotFoundPage.jsx
       Verify: `npm run build` — no errors

- [ ] 36. **NotFoundPage - Floating Code Snippets**
       Add FloatingCode component in NotFoundPage.jsx with array of code symbols ['{}', 'def', '( )']. Map to absolutely positioned motion.span with floating animation at random positions.
       Files: src/pages/NotFoundPage.jsx, src/pages/NotFoundPage.css
       Verify: `npm run build` — no errors

- [ ] 37. **NotFoundPage - Interactive Hover Effects**
       Enhance button whileHover in NotFoundPage.jsx with larger scale (1.05) and slight rotation. Add hover tilt to code-window wrapper.
       Files: src/pages/NotFoundPage.jsx
       Verify: `npm run build` — no errors

- [ ] 38. **Final - Reduced Motion Audit**
       Review all new animations across files. Add any missing animation-duration: 0.01ms !important rules to the prefers-reduced-motion media query in global.css. Add useReducedMotion checks where needed in JSX.
       Files: src/styles/global.css, all modified JSX files
       Verify: `npm run build` — no errors, manual check that animations disable with prefers-reduced-motion

- [ ] 39. **Final - Build Verification**
       Run npm run build and verify clean output with no warnings or errors related to the animation changes.
       Files: (verification only)
       Verify: `npm run build` — exit code 0, no build errors
