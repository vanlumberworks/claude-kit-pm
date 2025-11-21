# Frontend Design Specification: [Component/Screen Name]

**For**: [Product name]
**Target Users**: [User type]
**Created**: [Date]
**Version**: 1.0

---

## Overview

**Purpose**: [What should this screen/component accomplish?]

**User Goal**: Users need to [accomplish what goal]

**Context**: [When/where users will use this]

---

## Layout & Structure

**Viewport Support**:
- Desktop: 1440px+ (primary)
- Tablet: 768px - 1439px
- Mobile: 320px - 767px

**Layout Type**: [Single column / Multi-column / Grid / Dashboard / Card-based]

**Visual Hierarchy**:
```
[ASCII diagram showing layout structure]

┌─────────────────────────────────────────┐
│            Header / Nav                  │
├─────────────────────────────────────────┤
│ ┌───────────┐ ┌───────────────────────┐ │
│ │  Sidebar  │ │   Main Content        │ │
│ │           │ │                       │ │
│ │           │ │                       │ │
│ └───────────┘ └───────────────────────┘ │
├─────────────────────────────────────────┤
│            Footer                        │
└─────────────────────────────────────────┘
```

---

## Components

### 1. [Component Name]

**Location**: [Top / Center / Sidebar / Bottom]

**Purpose**: [What this component does]

**Dimensions**:
- Width: [px or % or responsive]
- Height: [px or auto]
- Padding: [specification]

**Elements**:
- Element 1: [Description, size, style]
- Element 2: [Description, size, style]
- Element 3: [Description, size, style]

**Content**:
- Heading: "[Exact copy]" (24px, bold)
- Body: "[Example text]" (16px, regular)
- CTA: "[Button text]" (button specs)

---

### 2. [Next Component]
[Same structure]

---

## Style Specifications

### Colors
```
Primary Brand Color: #[hex]
  Usage: CTAs, important actions, brand elements

Secondary Color: #[hex]
  Usage: Links, secondary actions

Background: #[hex]
  Usage: Page background

Surface: #[hex]
  Usage: Cards, containers, elevated elements

Text Primary: #[hex]
  Usage: Headings, body text

Text Secondary: #[hex]
  Usage: Labels, captions, less important text

Success: #[hex] (Green)
Warning: #[hex] (Yellow/Orange)
Error: #[hex] (Red)
Info: #[hex] (Blue)
```

### Typography
```
Font Family: [Inter / Roboto / System font stack]

Headings:
- H1: 32px / Bold / Line-height 1.2 / Letter-spacing -0.5px
- H2: 24px / Semibold / Line-height 1.3
- H3: 20px / Semibold / Line-height 1.4
- H4: 18px / Medium / Line-height 1.4

Body:
- Large: 18px / Regular / Line-height 1.6
- Regular: 16px / Regular / Line-height 1.5
- Small: 14px / Regular / Line-height 1.5

Labels:
- 12px / Medium / Uppercase / Letter-spacing 1px
```

### Spacing
```
Base Unit: 8px

Spacing Scale:
- XXS: 4px (tight spacing)
- XS: 8px (between related items)
- S: 16px (between components)
- M: 24px (between sections)
- L: 32px (major sections)
- XL: 48px (page sections)
- XXL: 64px (hero sections)

Padding:
- Cards: 24px
- Buttons: 12px vertical, 24px horizontal
- Inputs: 12px vertical, 16px horizontal

Margins:
- Between paragraphs: 16px
- Between sections: 48px
```

### Shadows & Borders
```
Elevation:
- Flat: none
- Raised: 0 1px 3px rgba(0,0,0,0.1)
- Elevated: 0 4px 6px rgba(0,0,0,0.1)
- Floating: 0 10px 20px rgba(0,0,0,0.15)

Border Radius:
- Small: 4px (inputs, tags)
- Medium: 8px (buttons, cards)
- Large: 16px (modals, large cards)
- Full: 9999px (pills, avatars)

Borders:
- Default: 1px solid #E5E7EB
- Focus: 2px solid [Primary Color]
- Error: 2px solid [Error Color]
```

---

## Interactive Elements

### Buttons

**Primary Button**:
- Background: [Primary Color]
- Text: White, 16px, Medium
- Padding: 12px vertical, 24px horizontal
- Border radius: 8px
- Min height: 44px (touch target)
- Min width: 120px

**States**:
- Default: [Primary Color]
- Hover: [Darker shade] + Lift effect (0 4px 8px shadow)
- Active: [Even darker] + Pressed effect
- Disabled: Gray, 50% opacity, no pointer
- Loading: Spinner (20px) replaces text, disabled

**Secondary Button**: [Same structure with different colors]

**Ghost Button**: [Same structure with transparent background]

---

### Forms

**Input Fields**:
- Height: 48px
- Border: 1px solid #E5E7EB
- Border radius: 8px
- Padding: 12px 16px
- Font: 16px regular
- Placeholder: #9CA3AF

**States**:
- Default: Border #E5E7EB
- Focus: Border 2px [Primary Color], outline none
- Error: Border 2px [Error Color]
- Disabled: Background #F3F4F6, cursor not-allowed

**Labels**:
- Position: Above input
- Font: 14px medium
- Color: [Text Primary]
- Required indicator: Red asterisk

**Error Messages**:
- Position: Below input
- Font: 14px regular
- Color: [Error Color]
- Icon: Alert icon (16px)

**Validation**:
- Real-time: On blur (after user leaves field)
- On submit: Show all errors
- Success state: Green checkmark icon

---

## Interactions & Behavior

### User Actions

**Action**: Click primary CTA
- **Result**: [What happens]
- **Feedback**: [Visual feedback]
- **Transition**: [Animation, duration]

**Action**: Hover over card
- **Result**: Card lifts with shadow
- **Transition**: 200ms ease-out

**Action**: Submit form
- **Result**: Validate, show errors or submit
- **Loading State**: Button shows spinner
- **Success**: Show confirmation, redirect after 2s
- **Error**: Show error message, keep form data

**Action**: [Another interaction]
- **Result**: [Outcome]
- **Feedback**: [How user knows it worked]

---

## States

### Loading State
**Approach**: [Skeleton screens / Spinners / Progress bars]

**Skeleton**:
- Use gray rectangles (#E5E7EB) for text
- Use circles for avatars
- Animate: Shimmer effect (subtle pulse)

### Empty State
**When**: [No data / No results / New user]

**Display**:
- Illustration: [Style description]
- Headline: "[Empty state title]" (20px, semibold)
- Description: "[Helpful message]" (16px, regular)
- CTA: "[Action button text]" (Primary button)

### Error State
**When**: [Action fails / Data load fails]

**Display**:
- Icon: Alert icon (48px, [Error Color])
- Message: "[Error description]" (18px, semibold)
- Details: "[Technical details if needed]" (14px, regular)
- Actions:
  - Primary: "Try Again" button
  - Secondary: "Contact Support" link

### Success State
**When**: [Action completes successfully]

**Display**:
- Icon: Checkmark (48px, [Success Color])
- Message: "[Success message]" (18px, semibold)
- Animation: Fade in + slide up
- Duration: Auto-dismiss after 5s or manual close

---

## Responsive Behavior

### Desktop (1440px+)
- Multi-column layout
- Sidebar visible
- Hover states active
- Large touch targets not required

### Tablet (768px - 1439px)
- 2-column layout
- Sidebar collapsible
- Some hover states
- Slightly larger touch targets

### Mobile (<768px)
- Single column stack
- Sidebar hidden (hamburger menu)
- No hover states
- Large touch targets (44px minimum)
- Bottom navigation bar
- Larger form inputs (avoid zoom)
- Simplified navigation

**Breakpoint Behavior**:
```
@media (max-width: 767px) {
  - Stack all columns
  - Full-width buttons
  - Hamburger menu
  - Bottom fixed CTA
}
```

---

## Accessibility Requirements

**WCAG 2.1 AA Compliance**:
- [ ] Color contrast ≥ 4.5:1 for text
- [ ] Color contrast ≥ 3:1 for UI components
- [ ] All interactive elements keyboard accessible
- [ ] Logical tab order (top to bottom, left to right)
- [ ] Focus indicators visible (2px outline, 2px offset)
- [ ] Screen reader labels on all inputs (aria-label)
- [ ] Error messages associated with fields (aria-describedby)
- [ ] Status changes announced (aria-live)
- [ ] Images have alt text
- [ ] Videos have captions
- [ ] No flashing content (seizure risk)
- [ ] Text resizable up to 200% without breaking
- [ ] Touch targets ≥ 44×44px (mobile)

---

## Technical Constraints

**Performance**:
- Initial load: < 2 seconds
- Time to interactive: < 3 seconds
- Largest contentful paint: < 2.5 seconds
- Image optimization: WebP format, lazy loading

**Browser Support**:
- Chrome: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Edge: Last 2 versions
- Mobile Safari: iOS 15+
- Chrome Mobile: Last 2 versions

**Offline Support**:
- [Yes/No]
- [If yes, describe offline behavior]

**Other Constraints**:
- [Any technical limitations]
- [Third-party integrations]
- [Specific framework requirements]

---

## Assets Needed

**Images**:
- Hero image: 1920×1080px, WebP
- Icons: SVG, 24×24px base size
- Illustrations: [Specifications]

**Fonts**:
- [Font family]: Weights 400, 500, 600, 700
- Hosting: [Google Fonts / Self-hosted]

**Icons**:
- Icon set: [Heroicons / Feather / Custom]
- Format: SVG
- Size: 24px default

---

## Examples & References

**Similar Patterns**:
- [Product/site name]: [What to reference]
- [Product/site name]: [What to reference]

**Design Inspiration**:
- [Link or description]

**Brand Guidelines**:
- [Link to brand style guide]

**Existing Components**:
- Design system: [Name]
- Component library: [Link]

---

## Next Steps

- [ ] Review with design team
- [ ] Create high-fidelity mockups
- [ ] Build prototype for user testing
- [ ] Get stakeholder approval
- [ ] Hand off to engineering
- [ ] QA visual review

---

## Notes & Open Questions

**Questions**:
1. [Question for designer]
2. [Question for stakeholders]

**Assumptions**:
- [Assumption 1]
- [Assumption 2]

**Future Enhancements**:
- [Feature to add later]
- [Nice-to-have that's out of scope]
