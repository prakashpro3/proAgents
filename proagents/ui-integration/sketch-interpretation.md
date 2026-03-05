# Sketch & Wireframe Interpretation Guide

Convert hand-drawn sketches and wireframes into implementable designs.

---

## Supported Input Types

- Hand-drawn paper sketches (photographed)
- Digital wireframes
- Whiteboard drawings
- Low-fidelity mockups
- Napkin sketches
- Mind maps with UI elements

---

## Sketch Requirements

### For Best Results

**Do:**
- Draw clearly and legibly
- Use consistent symbols
- Label important elements
- Show multiple screens for flow
- Include annotations for interactions
- Draw at reasonable size

**Avoid:**
- Very light pencil marks
- Overlapping elements
- Ambiguous symbols
- Excessive detail in early sketches

### Photo/Scan Quality

```
Resolution: Minimum 1000px width
Lighting: Even, no shadows
Angle: Straight-on (not skewed)
Format: PNG or JPG
Background: High contrast (white paper, dark lines)
```

---

## Standard Sketch Symbols

Use these conventions for AI to better interpret your sketches:

### Basic Elements

| Symbol | Meaning |
|--------|---------|
| Rectangle | Container, card, section |
| Rectangle with X | Image placeholder |
| Wavy lines | Text content |
| Straight lines | Heading/title |
| Circle | Button, icon, avatar |
| Rounded rectangle | Button, input field |
| Checkbox | Checkbox, toggle |

### Interactive Elements

```
[  Button  ]     → Button with label
[____]           → Text input field
[▼]              → Dropdown
[ ] Option       → Checkbox
( ) Option       → Radio button
[x] Selected     → Selected checkbox
```

### Layout Symbols

```
┌─────────────────┐
│     Header      │
├─────────────────┤
│                 │
│     Content     │
│                 │
├─────────────────┤
│     Footer      │
└─────────────────┘
```

### Navigation

```
→    Arrow pointing right (navigation, link)
←    Back navigation
≡    Hamburger menu
⋮    More options menu
🔍   Search
```

---

## Providing Sketches to AI

### Usage

```
pa:design-sketch

AI: "Please provide your sketch or wireframe."
User: [Provides image path or uploads sketch]
```

### What to Provide

**Single Screen:**
- Clear photo of sketch
- Annotations if available

**Multi-Screen Flow:**
- Multiple images in sequence
- Number screens (1, 2, 3...)
- Show navigation arrows between screens

**With Context:**
```
"This is a login flow sketch:
1. login-screen.jpg - Initial login form
2. forgot-password.jpg - Password reset
3. verification.jpg - Email verification"
```

---

## AI Interpretation Process

### Step 1: Element Recognition

AI identifies basic shapes:
```
□ → Containers, cards, sections
○ → Buttons, avatars, icons
~~~ → Text blocks
▬▬▬ → Headings
[  ] → Input fields, buttons
```

### Step 2: Layout Understanding

```
Analyzes:
- Relative positioning
- Grouping and hierarchy
- Grid structure
- Spacing patterns
```

### Step 3: Component Mapping

```
Sketch Element → UI Component
─────────────────────────────
Header section → <Header />
Card with text → <Card />
Input field → <Input />
Round button → <Button />
List items → <List />
```

### Step 4: Interaction Inference

```
From visual cues:
- Arrows between screens → Navigation
- Highlighted elements → Primary actions
- Numbered steps → User flow
- Annotations → Specific behaviors
```

### Step 5: Clean Wireframe Generation

AI can generate a clean digital wireframe from your sketch:
```
Sketch Input → AI Analysis → Clean Wireframe → Component Spec
```

---

## Annotation Guide

### Add Labels for Clarity

```
         "User Profile"
         ↓
    ┌─────────┐
    │  ○○○    │ ← "Avatar"
    │ ~~~~~~~ │ ← "User name"
    │ [Edit]  │ ← "Edit button"
    └─────────┘
```

### Mark Interactions

```
[Login Button] → "Navigate to dashboard"
                 "Show loading state"
                 "Handle errors"
```

### Indicate States

```
Button States:
[ Default ] → [ Hover ] → [ Active ] → [ Disabled ]
    ↑            ↑           ↑            ↑
  Normal     Mouse over    Clicked      Inactive
```

### Specify Data

```
┌──────────────────┐
│ Product Card     │
│ ┌──────┐         │
│ │  X   │ ← "Product image" │
│ └──────┘         │
│ ~~~~~~~ ← "Product name (max 50 chars)" │
│ $XX.XX  ← "Price (formatted currency)" │
│ [Add to Cart]    │
└──────────────────┘
```

---

## Flow Diagrams

### Screen Flow

```
┌─────────┐    ┌─────────┐    ┌─────────┐
│  Login  │ → │Dashboard│ → │ Profile │
└─────────┘    └─────────┘    └─────────┘
     │              │
     ↓              ↓
┌─────────┐    ┌─────────┐
│ Sign Up │    │Settings │
└─────────┘    └─────────┘
```

### User Journey

```
1. User lands on homepage
        ↓
2. Clicks "Sign Up"
        ↓
3. Fills registration form
        ↓
4. Receives verification email
        ↓
5. Clicks verification link
        ↓
6. Lands on dashboard
```

---

## Sketch-to-Code Output

### Component Specification

From a sketch, AI generates:

```markdown
## Component: UserCard

### Description
Card displaying user information with avatar and action button.

### Elements
1. Avatar (circle, 48px)
2. User name (heading, bold)
3. User email (text, muted)
4. Edit button (secondary style)

### Layout
- Horizontal layout
- Avatar on left
- Text stacked vertically
- Button right-aligned

### Props (Inferred)
- user: { name, email, avatarUrl }
- onEdit: () => void

### Sketch Reference
[Original sketch element]
```

### Implementation Suggestion

```jsx
// Suggested implementation based on sketch

function UserCard({ user, onEdit }) {
  return (
    <div className="user-card">
      <img
        src={user.avatarUrl}
        alt={user.name}
        className="user-avatar"
      />
      <div className="user-info">
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
      <button onClick={onEdit}>
        Edit
      </button>
    </div>
  );
}
```

---

## Iteration Process

### Initial Sketch Review

```
1. Provide sketch
2. AI interprets and generates component list
3. Review interpretation
4. Clarify any misunderstandings
5. Confirm components
```

### Refinement Loop

```
"The search icon should open a modal, not a new page"
"The sidebar should be collapsible"
"Add a notification bell to the header"

AI updates interpretation and components accordingly.
```

### Progressive Detail

```
Round 1: Basic layout and components
Round 2: Add interactions and states
Round 3: Refine styling and spacing
Round 4: Finalize specifications
```

---

## Best Practices

### 1. Start Simple
Begin with basic shapes and add detail progressively.

### 2. Be Consistent
Use the same symbols throughout your sketches.

### 3. Label Key Elements
Especially for elements that aren't visually obvious.

### 4. Show Context
Include enough surrounding elements to understand layout.

### 5. Number Screens
For multi-screen flows, clearly number or name each screen.

### 6. Note Responsive Behavior
Indicate how layout changes for different screen sizes.

---

## Examples

### Example 1: Simple Form

```
Sketch:
┌─────────────────────┐
│    Create Account    │
├─────────────────────┤
│ Email:              │
│ [________________]  │
│                     │
│ Password:           │
│ [________________]  │
│                     │
│ [  Sign Up  ]       │
│                     │
│ Already have account?│
│ Log in              │
└─────────────────────┘

AI Output:
- Form with email and password inputs
- Primary button "Sign Up"
- Link to login page
- Vertical layout with standard spacing
```

### Example 2: Dashboard

```
Sketch:
┌──────┬────────────────┐
│ Logo │  Search    [👤]│
├──────┼────────────────┤
│      │                │
│ Menu │   Stats Cards  │
│      │   [1] [2] [3]  │
│ ──── │                │
│ Item │   Chart        │
│ Item │   [~~~~~~~~]   │
│ Item │                │
│      │   Table        │
└──────┴────────────────┘

AI Output:
- Header with logo, search, user menu
- Sidebar with navigation menu
- Main content with stats cards
- Chart section
- Data table
```

---

## Troubleshooting

**AI Misinterprets Element:**
- Add clear label/annotation
- Redraw with more distinct shape
- Describe verbally what it should be

**Layout Unclear:**
- Add grid lines
- Mark section boundaries
- Use consistent spacing

**Flow Not Understood:**
- Number screens clearly
- Draw arrows between screens
- Add written flow description

**Missing Details:**
- Annotate with notes
- Provide reference screenshots
- Describe expected behavior

---

## Integration with Workflow

```
1. Create sketch (paper or digital)
2. Photo/scan sketch
3. Run: pa:design-sketch
4. Provide sketch image
5. Review AI interpretation
6. Iterate and refine
7. Confirm component specifications
8. Proceed to implementation planning
```
