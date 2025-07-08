# Browser Title Fix for Authentication Pages

## Problem
When users logged out and navigated back to the login page, the browser tab would show the previous page title instead of the login page title. This happened because the browser's history still contained the previous page titles.

## Solution
We implemented a comprehensive solution that:

1. **Custom Hook**: Created `useAuthPageTitle` hook in `src/utils/authContext.js` to manage page titles and browser history consistently across all authentication pages.

2. **Immediate Title Setting**: The hook immediately sets the correct page title when the component mounts.

3. **History Management**: 
   - Replaces the current history entry to clear previous page titles
   - Prevents back navigation that would show old titles
   - Ensures the correct title is maintained during navigation

4. **Event Listeners**: Added `popstate` and `beforeunload` event listeners to maintain the correct title even when users try to navigate back or refresh the page.

## Files Modified

### Core Implementation
- `src/utils/authContext.js` - Added `useAuthPageTitle` custom hook

### Authentication Pages
- `src/views/authentication/auth/Login.js` - Updated to use the custom hook
- `src/views/authentication/auth/Register.js` - Updated to use the custom hook  
- `src/views/authentication/auth/ForgotPassword.js` - Updated to use the custom hook

### Additional Fix
- `src/layouts/full/vertical/sidebar/SidebarProfile/Profile.js` - Fixed sidebar logout to properly call logout function

## Usage
The custom hook is used in all authentication pages:

```javascript
import { useAuthPageTitle } from '../../../utils/authContext';

const LoginPage = () => {
  useAuthPageTitle('Login'); // Sets title to "Login - Alris CMS"
  // ... rest of component
};
```

## Benefits
- ✅ Consistent page titles across all authentication pages
- ✅ Prevents old page titles from showing in browser tabs
- ✅ Maintains correct titles during browser navigation
- ✅ Reusable solution across all auth pages
- ✅ Proper logout handling from all logout buttons

## Testing
To test the fix:
1. Login to the application
2. Navigate to different pages (blogs, pages, authors, etc.)
3. Logout using any logout button
4. Verify that the browser tab shows "Login - Alris CMS"
5. Try pressing the browser back button - it should still show "Login - Alris CMS"
6. Test the same with Register and Forgot Password pages 