# Development Settings Enhancement Plan

This plan outlines the steps to expand the existing development settings (currently "Force Loading" and "Force Empty") into a more comprehensive suite of tools to improve the Developer Experience (DX).

## 1. Context Refactoring

Rename and expand `contexts/loadingContext.tsx` to `contexts/devSettingsContext.tsx` (or similar) to manage the new state.

- [ ] Rename `useLoadingToggle` to `useDevSettings`.
- [ ] Add new state variables with persistence (localStorage):
  - `forceError`: Simulate API failures.
  - `slowNetwork`: Introduce artificial latency (e.g., 2000ms).
  - `forceAdmin`: Mock the `isAdmin` state.
  - `disableTracking`: Prevent analytics events from being sent.
  - `showOutlines`: Toggle CSS outlines for layout debugging.

## 2. Data Fetching Enhancements (`hooks/useCollection.ts`)

Update the core data hook to respect the new dev settings.

- [ ] **Slow Network:** Wrap the fetch logic in a delay if `slowNetwork` is enabled.
- [ ] **Force Error:** Short-circuit the fetch and return an error state if `forceError` is enabled.

## 3. Auth & Role Simulation (`contexts/authContext.tsx`)

Allow the UI to behave as if an admin is logged in.

- [ ] Update `useAuth` to return `true` for `isAdmin` if the `forceAdmin` dev setting is enabled.

## 4. Analytics Control (`database/analytics_events.ts` or relevant tracking logic)

Protect production/live data from development noise.

- [ ] Add a check in the tracking function to skip execution if `disableTracking` is enabled.

## 5. UI Debugging (`app/layout.tsx` or global CSS)

Implement visual aids for development.

- [ ] Add a global class (e.g., `dev-show-outlines`) to the `body` when `showOutlines` is enabled.
- [ ] Add corresponding CSS in `styles/tailwind.css`:
  ```css
  .dev-show-outlines * {
    outline: 1px solid rgba(255, 0, 0, 0.3) !important;
  }
  ```

## 6. Settings UI Update (`components/Settings/index.tsx`)

Expose the new controls in the existing Settings dropdown.

- [ ] Group the new toggles under the "Development" section.
- [ ] Add `Switch` components for each new setting.
- [ ] Ensure the Development section remains restricted to `process.env.NODE_ENV === 'development'`.

## 7. Spotify State Mocks (Optional/Advanced)

Improve testing for the `CurrentlyListening` banner.

- [ ] Add a `spotifyMockState` (e.g., `none`, `playing`, `recent`, `ad`) to the dev context.
- [ ] Update `CurrentlyListening` component to prefer mock data when a state is selected.
