# ProAgents: A Day in the Life

An end-to-end narrative showing how ProAgents transforms your development workflow.

---

## Prologue: Before ProAgents

*It's Monday morning. Sarah opens her laptop to start working on a new feature for the company's e-commerce platform. Her task: add a wishlist feature.*

**The Old Way:**

```
Sarah: *Opens Slack, finds the feature request*
Sarah: *Searches codebase for similar features*
Sarah: *Finds 3 different patterns used in existing features*
Sarah: *Picks one, starts coding*
Sarah: *Realizes she missed an API endpoint 2 hours in*
Sarah: *Asks teammate about the auth pattern, waits for response*
Sarah: *Finally submits PR at 6pm*
Sarah: *Gets review comments about inconsistent patterns*
Sarah: *Spends next day fixing review comments*
```

**Time spent: 2 days**
**Frustration level: High**

---

## Act 1: Morning - Starting the Feature

*Sarah has adopted ProAgents. Same Monday morning, same wishlist feature.*

### 9:00 AM - Starting Fresh

```
Sarah: I need to add a wishlist feature. Users should be able to
       save products and view their wishlist.

ProAgents: I'll help you build a wishlist feature. Let me start by
           analyzing your codebase.

           [Analyzing...]

           ════════════════════════════════════════════════════════
           Codebase Analysis Complete
           ════════════════════════════════════════════════════════

           Project: ShopFlow (E-commerce Platform)
           Tech: React 18 + Next.js 14 + Prisma + PostgreSQL

           Existing Similar Features:
           • Cart system (src/features/cart/)
           • Favorites (src/features/favorites/) - Legacy, deprecated
           • Saved items (src/features/saved/) - Mobile only

           Recommendation: Follow cart/ pattern (most recent, best practices)

           Patterns Detected:
           • Feature folders with index.ts exports
           • React Query for server state
           • Zod for validation
           • tRPC for API (not REST)

           Related Models:
           • Product (existing)
           • User (existing)
           • CartItem (similar pattern to follow)

           Would you like me to proceed with requirements gathering?
```

Sarah notices ProAgents found the deprecated favorites feature - she would have spent an hour looking at that old code and following outdated patterns.

### 9:15 AM - Requirements Clarification

```
ProAgents: I have a few questions to clarify the requirements:

           1. Wishlist scope - what should users be able to do?
              [√] Add products to wishlist
              [√] Remove products from wishlist
              [√] View wishlist
              [ ] Share wishlist (public link)
              [ ] Multiple wishlists (e.g., "Birthday", "Home")

           2. Persistence - when does wishlist save?
              [√] Immediately (optimistic update)
              [ ] On explicit save
              [ ] Sync with account (logged in only)

           3. Guest users - should they have wishlists?
              [ ] No, login required
              [√] Yes, localStorage (migrate on login)
              [ ] Yes, anonymous account

           Please confirm or adjust these selections.
```

```
Sarah: Add "Share wishlist" too. And yes, guest users should get
       localStorage wishlists that migrate when they log in.
```

```
ProAgents: Got it. Updated requirements:

           ════════════════════════════════════════════════════════
           Wishlist Feature Requirements
           ════════════════════════════════════════════════════════

           User Stories:
           1. As a user, I can add a product to my wishlist
           2. As a user, I can remove a product from my wishlist
           3. As a user, I can view all my wishlisted products
           4. As a user, I can share my wishlist via a public link
           5. As a guest, my wishlist persists in localStorage
           6. As a guest who logs in, my wishlist migrates to my account

           Technical Requirements:
           • Follow cart/ feature structure
           • Use tRPC for API endpoints
           • Use React Query for client state
           • Guest wishlist in localStorage with migration

           API Endpoints (tRPC):
           • wishlist.list - Get user's wishlist
           • wishlist.add - Add product to wishlist
           • wishlist.remove - Remove from wishlist
           • wishlist.share - Generate shareable link
           • wishlist.migrate - Migrate guest wishlist to account

           Database Changes:
           • New Wishlist model
           • New WishlistItem model
           • New WishlistShare model

           Checkpoint: Do these requirements look complete?
```

Sarah reviews and confirms. This took 15 minutes instead of the hour she used to spend writing requirements docs.

---

## Act 2: Mid-Morning - Design & Planning

### 9:30 AM - UI Design

```
ProAgents: Based on your existing UI patterns, here's the proposed design:

           ════════════════════════════════════════════════════════
           Wishlist UI Design
           ════════════════════════════════════════════════════════

           1. Add to Wishlist Button (on product cards)
           ┌────────────────────────────┐
           │  Product Card              │
           │  ┌──────┐                  │
           │  │      │ Product Name     │
           │  │ IMG  │ $29.99           │
           │  │      │ [♡ Add to list]  │ ← Outline heart
           │  └──────┘                  │
           │         [Add to Cart]      │
           └────────────────────────────┘

           When added:
           │         [♥ In Wishlist]   │ ← Filled heart, different color

           2. Wishlist Page (/wishlist)
           ┌────────────────────────────────────────────────────┐
           │ My Wishlist (12 items)           [Share Wishlist]  │
           ├────────────────────────────────────────────────────┤
           │ ┌─────────────────────────────────────────────────┐│
           │ │ [IMG] Product 1          $29.99    [♥] [🛒]    ││
           │ │       In stock                                  ││
           │ └─────────────────────────────────────────────────┘│
           │ ┌─────────────────────────────────────────────────┐│
           │ │ [IMG] Product 2          $49.99    [♥] [🛒]    ││
           │ │       Only 2 left                               ││
           │ └─────────────────────────────────────────────────┘│
           │                                                    │
           │ Total value: $79.98                               │
           │ [Add All to Cart]                                 │
           └────────────────────────────────────────────────────┘

           3. Shared Wishlist Page (/wishlist/share/[id])
           Same as above but:
           • Different header: "Sarah's Wishlist"
           • No remove buttons
           • "Buy as Gift" option

           Using existing components:
           • ProductCard (with wishlist prop)
           • Button (existing)
           • ProductGrid (existing)
           • EmptyState (existing)

           Does this match your vision?
```

Sarah suggests one change - she wants the "Add All to Cart" button to be more prominent. ProAgents updates the design.

### 9:45 AM - Implementation Plan

```
ProAgents: Here's the implementation plan:

           ════════════════════════════════════════════════════════
           Implementation Plan
           ════════════════════════════════════════════════════════

           Files to Create (12 files):

           src/features/wishlist/
           ├── index.ts                    # Exports
           ├── components/
           │   ├── WishlistButton.tsx      # Add/remove button
           │   ├── WishlistPage.tsx        # Main page
           │   ├── WishlistItem.tsx        # Single item
           │   ├── WishlistSummary.tsx     # Total + actions
           │   └── SharedWishlist.tsx      # Public view
           ├── hooks/
           │   ├── useWishlist.ts          # Query hook
           │   ├── useWishlistMutation.ts  # Mutations
           │   └── useGuestWishlist.ts     # localStorage
           └── server/
               └── wishlist.router.ts      # tRPC router

           prisma/
           └── migrations/xxx_add_wishlist/
               └── migration.sql

           Files to Modify (4 files):
           • src/components/ProductCard.tsx  - Add wishlist button
           • src/server/routers/index.ts     - Add wishlist router
           • prisma/schema.prisma            - Add models
           • src/app/wishlist/page.tsx       - Create page

           Implementation Order:
           1. Database schema + migration
           2. tRPC router
           3. React Query hooks
           4. Guest wishlist (localStorage)
           5. WishlistButton component
           6. WishlistPage + WishlistItem
           7. SharedWishlist page
           8. Integration with ProductCard
           9. Tests

           Ready to start implementation?
```

Sarah confirms. The plan took 15 minutes to create.

---

## Act 3: Late Morning - Implementation

### 10:00 AM - Database & API

```
ProAgents: Starting implementation...

           ✓ Created database schema

           // prisma/schema.prisma (additions)

           model Wishlist {
             id        String         @id @default(cuid())
             userId    String         @unique
             user      User           @relation(fields: [userId], references: [id])
             items     WishlistItem[]
             shares    WishlistShare[]
             createdAt DateTime       @default(now())
             updatedAt DateTime       @updatedAt
           }

           model WishlistItem {
             id         String   @id @default(cuid())
             wishlistId String
             wishlist   Wishlist @relation(fields: [wishlistId], references: [id], onDelete: Cascade)
             productId  String
             product    Product  @relation(fields: [productId], references: [id])
             addedAt    DateTime @default(now())

             @@unique([wishlistId, productId])
           }

           model WishlistShare {
             id         String   @id @default(cuid())
             wishlistId String
             wishlist   Wishlist @relation(fields: [wishlistId], references: [id], onDelete: Cascade)
             shareCode  String   @unique @default(cuid())
             expiresAt  DateTime?
             createdAt  DateTime @default(now())
           }

           ✓ Created migration
           ✓ Applied migration

           ✓ Created tRPC router

           // src/server/routers/wishlist.router.ts

           export const wishlistRouter = router({
             list: protectedProcedure.query(async ({ ctx }) => {
               return ctx.db.wishlist.findUnique({
                 where: { userId: ctx.session.user.id },
                 include: {
                   items: { include: { product: true } },
                 },
               });
             }),

             add: protectedProcedure
               .input(z.object({ productId: z.string() }))
               .mutation(async ({ ctx, input }) => {
                 // ... implementation
               }),

             remove: protectedProcedure
               .input(z.object({ productId: z.string() }))
               .mutation(async ({ ctx, input }) => {
                 // ... implementation
               }),

             share: protectedProcedure.mutation(async ({ ctx }) => {
               // ... implementation
             }),

             getShared: publicProcedure
               .input(z.object({ shareCode: z.string() }))
               .query(async ({ ctx, input }) => {
                 // ... implementation
               }),

             migrate: protectedProcedure
               .input(z.object({
                 guestItems: z.array(z.string())
               }))
               .mutation(async ({ ctx, input }) => {
                 // ... implementation
               }),
           });
```

### 10:30 AM - React Hooks

```
ProAgents: ✓ Created React Query hooks

           // src/features/wishlist/hooks/useWishlist.ts

           export function useWishlist() {
             return api.wishlist.list.useQuery();
           }

           export function useWishlistMutation() {
             const utils = api.useUtils();

             const add = api.wishlist.add.useMutation({
               onMutate: async ({ productId }) => {
                 // Optimistic update
                 await utils.wishlist.list.cancel();
                 const previous = utils.wishlist.list.getData();
                 // ... optimistic logic
                 return { previous };
               },
               onError: (err, vars, context) => {
                 utils.wishlist.list.setData(undefined, context?.previous);
               },
               onSettled: () => {
                 utils.wishlist.list.invalidate();
               },
             });

             // ... remove mutation similar

             return { add, remove };
           }

           ✓ Created guest wishlist hook

           // src/features/wishlist/hooks/useGuestWishlist.ts

           const STORAGE_KEY = 'guest_wishlist';

           export function useGuestWishlist() {
             const [items, setItems] = useState<string[]>(() => {
               if (typeof window === 'undefined') return [];
               const saved = localStorage.getItem(STORAGE_KEY);
               return saved ? JSON.parse(saved) : [];
             });

             const add = useCallback((productId: string) => {
               setItems(prev => {
                 const next = [...new Set([...prev, productId])];
                 localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
                 return next;
               });
             }, []);

             const remove = useCallback((productId: string) => {
               setItems(prev => {
                 const next = prev.filter(id => id !== productId);
                 localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
                 return next;
               });
             }, []);

             const clear = useCallback(() => {
               setItems([]);
               localStorage.removeItem(STORAGE_KEY);
             }, []);

             return { items, add, remove, clear };
           }
```

### 11:00 AM - Components

```
ProAgents: ✓ Created WishlistButton component

           // Following existing button patterns in your codebase

           interface WishlistButtonProps {
             productId: string;
             variant?: 'icon' | 'full';
           }

           export function WishlistButton({
             productId,
             variant = 'icon'
           }: WishlistButtonProps) {
             const { status } = useSession();
             const { data: wishlist } = useWishlist();
             const { items: guestItems, add: guestAdd, remove: guestRemove } =
               useGuestWishlist();
             const { add, remove } = useWishlistMutation();

             const isGuest = status !== 'authenticated';
             const isInWishlist = isGuest
               ? guestItems.includes(productId)
               : wishlist?.items.some(i => i.productId === productId);

             const handleClick = () => {
               if (isGuest) {
                 isInWishlist ? guestRemove(productId) : guestAdd(productId);
               } else {
                 isInWishlist
                   ? remove.mutate({ productId })
                   : add.mutate({ productId });
               }
             };

             // ... render based on variant
           }

           ✓ Created WishlistPage, WishlistItem, WishlistSummary, SharedWishlist

           ✓ Updated ProductCard to include WishlistButton
```

### 11:30 AM - Page Integration

```
ProAgents: ✓ Created wishlist page

           // src/app/wishlist/page.tsx

           export default function WishlistPage() {
             const { data: wishlist, isLoading } = useWishlist();
             const { status } = useSession();
             const { items: guestItems } = useGuestWishlist();

             if (status === 'unauthenticated' && guestItems.length > 0) {
               return <GuestWishlistView items={guestItems} />;
             }

             if (isLoading) return <WishlistSkeleton />;
             if (!wishlist?.items.length) return <EmptyWishlist />;

             return (
               <div className="container mx-auto py-8">
                 <WishlistHeader
                   itemCount={wishlist.items.length}
                   onShare={() => {/* ... */}}
                 />
                 <ProductGrid>
                   {wishlist.items.map(item => (
                     <WishlistItem key={item.id} item={item} />
                   ))}
                 </ProductGrid>
                 <WishlistSummary items={wishlist.items} />
               </div>
             );
           }

           ✓ Created shared wishlist page

           // src/app/wishlist/share/[code]/page.tsx
```

---

## Act 4: Afternoon - Testing & Review

### 12:30 PM - Automated Testing

```
ProAgents: Running tests...

           ════════════════════════════════════════════════════════
           Test Results
           ════════════════════════════════════════════════════════

           Unit Tests:
           ✓ WishlistButton shows correct state for wishlisted item
           ✓ WishlistButton handles guest wishlist
           ✓ WishlistButton shows loading state
           ✓ useGuestWishlist persists to localStorage
           ✓ useGuestWishlist handles SSR
           ✓ WishlistItem renders product info
           ✓ WishlistItem handles remove action
           ✓ WishlistSummary calculates total correctly
           ✓ SharedWishlist hides remove buttons

           Integration Tests:
           ✓ Full wishlist flow (add → view → remove)
           ✓ Guest to authenticated migration
           ✓ Share wishlist generates link
           ✓ Shared wishlist is viewable

           API Tests:
           ✓ wishlist.add creates item
           ✓ wishlist.add prevents duplicates
           ✓ wishlist.remove deletes item
           ✓ wishlist.share creates share code
           ✓ wishlist.migrate moves guest items

           Coverage: 92%

           All 18 tests passed.
```

### 1:00 PM - Code Review

```
ProAgents: Running code review...

           ════════════════════════════════════════════════════════
           Code Review Results
           ════════════════════════════════════════════════════════

           ✅ Follows project patterns
              • Feature structure matches cart/
              • tRPC patterns consistent
              • React Query usage correct
              • Component naming matches conventions

           ✅ TypeScript
              • Strict mode compliant
              • No 'any' types
              • Proper null handling

           ✅ Performance
              • Optimistic updates implemented
              • No unnecessary re-renders
              • Efficient database queries

           ✅ Accessibility
              • Buttons have aria-labels
              • Focus states present
              • Screen reader support

           ✅ Security
              • Input validation with Zod
              • User authorization checked
              • No SQL injection risk

           ⚠️  Minor suggestions:
              • Consider adding rate limiting to share endpoint
              • Could add wishlist item limit (suggest: 100)

           Ready for merge.
```

Sarah reviews the suggestions and decides to add the 100 item limit.

---

## Act 5: Late Afternoon - Deployment

### 2:00 PM - Final Steps

```
ProAgents: Making final adjustments...

           ✓ Added wishlist item limit (100 items)
           ✓ Updated tests
           ✓ All tests passing

           Ready to commit and create PR?

Sarah: Yes, go ahead.

ProAgents: Creating commit...

           $ git add .
           $ git commit -m "feat(wishlist): add wishlist feature

           - Add wishlist model and tRPC router
           - Add guest wishlist with localStorage
           - Add guest-to-account migration
           - Add wishlist sharing with public links
           - Add WishlistButton component
           - Add wishlist page with summary
           - Add comprehensive tests (92% coverage)
           - Add 100 item limit

           Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"

           $ git push origin feature/wishlist

           ════════════════════════════════════════════════════════
           Pull Request Created
           ════════════════════════════════════════════════════════

           PR #247: feat(wishlist): add wishlist feature
           https://github.com/shopflow/shopflow/pull/247

           ## Summary
           - Users can add products to wishlist
           - Guest wishlists with localStorage persistence
           - Migration to account on login
           - Shareable wishlist links

           ## Test Plan
           - [x] Unit tests (18 passing)
           - [x] Manual testing on local
           - [x] Guest flow verified
           - [x] Share flow verified

           ## Screenshots
           [Attached: wishlist-page.png, wishlist-button.png]

           Ready for review!
```

### 3:00 PM - Done

Sarah's PR is ready for review. The entire feature, from requirements to PR, took about 5 hours.

**With ProAgents:**
- Time: 5 hours (vs 2+ days)
- Consistent with existing patterns
- Tests included
- Documentation automatic
- No review rework needed

---

## Epilogue: The Learning Continues

*Two weeks later, Sarah starts another feature. ProAgents has learned from the wishlist work.*

```
Sarah: Add a product comparison feature.

ProAgents: I'll help you build a comparison feature.

           [Learning Applied]
           • Following feature/ folder pattern (learned from wishlist)
           • Using tRPC + React Query (project standard)
           • Including guest localStorage support (you did this for wishlist)
           • Auto-skipping requirements checkpoint (you usually proceed quickly)

           Based on wishlist, I expect you'll want:
           • Optimistic updates
           • Guest support with migration
           • Shareable comparison links

           Shall I include these by default?
```

ProAgents remembers. It learns. It gets better.

---

## Summary: The ProAgents Difference

| Aspect | Without ProAgents | With ProAgents |
|--------|-------------------|----------------|
| **Pattern Discovery** | Manual search, inconsistent | Automatic, consistent |
| **Requirements** | Written docs, back-and-forth | Interactive, immediate |
| **UI Design** | Separate design process | Inline with existing patterns |
| **Implementation** | Code from scratch | Following detected patterns |
| **Testing** | Often skipped or minimal | Automatic, comprehensive |
| **Code Review** | Wait for teammates | Instant AI review |
| **Documentation** | Manual, often forgotten | Automatic |
| **Learning** | Repeat mistakes | Continuous improvement |
| **Total Time** | 2+ days | 5 hours |

---

*The end. Time to build something amazing.*
