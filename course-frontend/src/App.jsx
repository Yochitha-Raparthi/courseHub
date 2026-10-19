
// import { useEffect, useState } from 'react';
// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   Navigate,
// } from 'react-router-dom';

// import Landing from './pages/Landing.jsx';
// import Login from './pages/Login.jsx';
// import Signup from './pages/Signup.jsx';
// import CourseDashboard from './pages/CourseDashboard.jsx';
// import ProtectedRoute from './components/ProtectedRoute.jsx';

// const AUTH_URL = 'http://localhost:9878/auth';

// function AppRoutes() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let active = true;

//    async function checkSession() {
//   try {
//     const response = await fetch(`${AUTH_URL}/me`, {
//       credentials: 'include',
//     });

//     if (response.ok) {
//       const data = await response.json();
//       if (active) setUser(data);
//     } else if (response.status !== 401 && response.status !== 403) {
//       console.error('Session check failed:', response.status);
//     }
//   } catch (error) {
//     console.error('Could not restore session:', error);
//   } finally {
//     if (active) setLoading(false);
//   }
// }

//     checkSession();

//     return () => {
//       active = false;
//     };
//   }, []);

//   const role = String(user?.role || '').toUpperCase();
//   const isAdmin = role === 'ADMIN' || role === 'ROLE_ADMIN';

//   return (
//     <Routes>
//       <Route path="/" element={<Landing />} />

//       <Route
//   path="/login"
//   element={
//     user
//       ? <Navigate
//           to={isAdmin ? '/admin-dashboard' : '/user-dashboard'}
//           replace
//         />
//       : <Login onLogin={setUser} />
//   }
// />
//       <Route path="/signup" element={<Signup />} />

//       <Route
//   path="/user-dashboard"
//   element={
//     <ProtectedRoute user={user} loading={loading} requiredRole="USER">
//       <CourseDashboard
//         user={user}
//         onLogout={{handleLogout}}
//       />
//     </ProtectedRoute>
//   }
// />

// <Route
//   path="/admin-dashboard"
//   element={
//     <ProtectedRoute user={user} loading={loading} requiredRole="ADMIN">
//       <CourseDashboard
//         user={user}
//         onLogout={() => setUser(null)}
//       />
//     </ProtectedRoute>
//   }
// />

//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <AppRoutes />
//     </BrowserRouter>
//   );
// }


import { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';

import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import CourseDashboard from './pages/CourseDashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const AUTH_URL = 'http://localhost:9878/auth';

function AppRoutes() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Restore the existing login session when the app opens.
  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        const response = await fetch(`${AUTH_URL}/me`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();

          if (active) {
            setUser(data);
          }
        } else {
          if (active) {
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Could not restore session:', error);

        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    checkSession();

    return () => {
      active = false;
    };
  }, []);

  // Determine the dashboard using the role returned by the backend.
  const role = String(user?.role || '').toUpperCase();
  const isAdmin = role === 'ADMIN' || role === 'ROLE_ADMIN';

  const dashboardPath = isAdmin
    ? '/admin-dashboard'
    : '/user-dashboard';

  // Log out and invalidate the server-side session.
  async function handleLogout() {
    try {
      const response = await fetch(`${AUTH_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Logout failed (${response.status}).`);
      }

      setUser(null);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      alert('Unable to log out. Please try again.');
    }
  }

  // Handle a successful login.
  function handleLogin(loginUser) {
    setUser(loginUser);

    const loginRole = String(loginUser?.role || '').toUpperCase();
    const loginIsAdmin =
      loginRole === 'ADMIN' || loginRole === 'ROLE_ADMIN';

    navigate(
      loginIsAdmin ? '/admin-dashboard' : '/user-dashboard',
      { replace: true }
    );
  }

  if (loading) {
    return <p className="loading-message">Checking login session...</p>;
  }

  return (
    <Routes>
      {/* Public landing page */}
      <Route
        path="/"
        element={
          user
            ? <Navigate to={dashboardPath} replace />
            : <Landing />
        }
      />

      {/* Login page */}
      <Route
        path="/login"
        element={
          user
            ? <Navigate to={dashboardPath} replace />
            : <Login onLogin={handleLogin} />
        }
      />

      {/* Signup page */}
      <Route
        path="/signup"
        element={
          user
            ? <Navigate to={dashboardPath} replace />
            : <Signup />
        }
      />

      {/* User dashboard */}
      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute
            user={user}
            loading={loading}
            requiredRole="USER"
          >
            <CourseDashboard
              user={user}
              onLogout={handleLogout}
            />
          </ProtectedRoute>
        }
      />

      {/* Admin dashboard */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute
            user={user}
            loading={loading}
            requiredRole="ADMIN"
          >
            <CourseDashboard
              user={user}
              onLogout={handleLogout}
            />
          </ProtectedRoute>
        }
      />

      {/* Unknown routes */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}