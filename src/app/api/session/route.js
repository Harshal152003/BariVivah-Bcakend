// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/dbConnect';
// import User from '@/models/User';
// import { verifyToken } from '@/lib/auth';
// import { createToken, setTokenCookie } from '@/lib/auth';

// // Define CORS headers
// const corsHeaders = {
//   'Access-Control-Allow-Origin': '*', // Or your specific origin
//   'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
//   'Access-Control-Allow-Headers': 'Content-Type, Authorization',
//   'Access-Control-Allow-Credentials': 'true' // Needed for cookies
// };

// export async function GET(request) {
//   try {
//     await dbConnect();
//     const token = request.cookies.get('authToken')?.value;

//     if (!token) {
//       return new NextResponse(
//         JSON.stringify({ user: null }),
//         { status: 200, headers: corsHeaders }
//       );
//     }

//     const decoded = verifyToken(token);
//     if (!decoded) {
//       return new NextResponse(
//         JSON.stringify({ user: null }),
//         { status: 200, headers: corsHeaders }
//       );
//     }

//     const user = await User.findById(decoded.userId)
//       .select('-__v -createdAt -updatedAt');

//     if (!user) {
//       return new NextResponse(
//         JSON.stringify({ user: null }),
//         { status: 200, headers: corsHeaders }
//       );
//     }

//     return new NextResponse(
//       JSON.stringify({
//         user: {
//           id: user._id,
//           phone: user.phone,
//           name: user.name,
//           isVerified: user.isVerified,
//           phoneIsVerified: user.phoneIsVerified,
//           subscription: user?.subscription,
//           profilePhoto: user.profilePhoto,
//           gender: user?.gender
//         }
//       }),
//       { headers: corsHeaders }
//     );

//   } catch (error) {
//     console.error('Session check error:', error);
//     return new NextResponse(
//       JSON.stringify({ error: 'Internal server error' }),
//       { status: 500, headers: corsHeaders }
//     );
//   }
// }

// export async function POST(request) {
//   try {
//     await dbConnect();
//     const { userId } = await request.json();

//     const user = await User.findById(userId);
//     if (!user) {
//       return new NextResponse(
//         JSON.stringify({ error: 'User not found' }),
//         { status: 404, headers: corsHeaders }
//       );
//     }

//     const token = createToken(user._id);
//     const response = new NextResponse(
//       JSON.stringify({
//         user: {
//           id: user._id,
//           phone: user.phone,
//           name: user.name,
//           isVerified: user.isVerified,
//           phoneIsVerified: user.phoneIsVerified,
//           subscription: {
//             isActive: user.subscription?.isActive || false,
//           },
//           profilePhoto: user.profilePhoto,
//           subscription: user.subscription || null,
//           gender: user?.gender
//         }
//       }),
//       { headers: corsHeaders }
//     );

//     setTokenCookie(response, token);
//     return response;

//   } catch (error) {
//     console.error('Session creation error:', error);
//     return new NextResponse(
//       JSON.stringify({ error: 'Internal server error' }),
//       { status: 500, headers: corsHeaders }
//     );
//   }
// }

// // Handle OPTIONS requests for preflight
// export async function OPTIONS() {
//   return new NextResponse(null, {
//     headers: corsHeaders
//   });
// }
//working
// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/dbConnect';
// import User from '@/models/User';
// import { verifyToken } from '@/lib/auth';
// import { createToken, setTokenCookie } from '@/lib/auth';

// // Define CORS headers
// const getCorsHeaders = (origin) => ({
//   'Access-Control-Allow-Origin': origin || '*',
//   'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
//   'Access-Control-Allow-Headers': 'Content-Type, Authorization',
//   'Access-Control-Allow-Credentials': 'true' // Needed for cookies
// });

// export async function GET(request) {
//   const origin = request.headers.get('origin');
//   const headers = getCorsHeaders(origin);

//   try {
//     await dbConnect();

//     // Get token from cookie or Authorization header
//     let token = request.cookies.get('authToken')?.value;
//     if (!token) {
//       const authHeader = request.headers.get('authorization');
//       if (authHeader && authHeader.startsWith('Bearer ')) {
//         token = authHeader.substring(7);
//       }
//     }

//     if (!token) {
//       return new NextResponse(
//         JSON.stringify({ user: null }),
//         { status: 200, headers }
//       );
//     }

//     const decoded = verifyToken(token);
//     if (!decoded) {
//       return new NextResponse(
//         JSON.stringify({ user: null }),
//         { status: 200, headers }
//       );
//     }

//     const user = await User.findById(decoded.userId)
//       .select('-__v -createdAt -updatedAt');

//     if (!user) {
//       return new NextResponse(
//         JSON.stringify({ user: null }),
//         { status: 200, headers }
//       );
//     }

//     return new NextResponse(
//       JSON.stringify({
//         user: {
//           id: user._id,
//           phone: user.phone,
//           name: user.name,
//           isVerified: user.isVerified,
//           phoneIsVerified: user.phoneIsVerified,
//           subscription: user.subscription,
//           profilePhoto: user.profilePhoto,
//           gender: user?.gender
//         }
//       }),
//       { headers }
//     );

//   } catch (error) {
//     console.error('Session check error:', error);
//     return new NextResponse(
//       JSON.stringify({ error: 'Internal server error' }),
//       { status: 500, headers }
//     );
//   }
// }

// export async function POST(request) {
//   const origin = request.headers.get('origin');
//   const headers = getCorsHeaders(origin);

//   try {
//     await dbConnect();
//     const { userId } = await request.json();

//     if (!userId) {
//       return new NextResponse(
//         JSON.stringify({ error: 'User ID is required' }),
//         { status: 400, headers }
//       );
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return new NextResponse(
//         JSON.stringify({ error: 'User not found' }),
//         { status: 404, headers }
//       );
//     }

//     const token = createToken(user._id);
//     const userData = {
//       id: user._id,
//       phone: user.phone,
//       name: user.name,
//       isVerified: user.isVerified,
//       phoneIsVerified: user.phoneIsVerified,
//       subscription: user.subscription || null,
//       profilePhoto: user.profilePhoto,
//       gender: user?.gender
//     };

//     const response = new NextResponse(
//       JSON.stringify({
//         user: userData,
//         token // Return token in body for mobile apps
//       }),
//       { headers }
//     );

//     // Set cookie for web browsers
//     setTokenCookie(response, token);
//     return response;

//   } catch (error) {
//     console.error('Session creation error:', error);
//     return new NextResponse(
//       JSON.stringify({ error: 'Internal server error' }),
//       { status: 500, headers }
//     );
//   }
// }

// // Handle OPTIONS requests for preflight
// export async function OPTIONS(request) {
//   const origin = request.headers.get('origin');
//   return new NextResponse(null, {
//     headers: getCorsHeaders(origin)
//   });
// }



// "use client"
// import { createContext, useContext, useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// const SessionContext = createContext();

// export function SessionProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   // Check for existing session on initial load
//   useEffect(() => {
//     async function loadUser() {
//       try {
//         // First try localStorage
//         const storedUser = localStorage.getItem('user');
//         if (storedUser) {
//           const parsedUser = JSON.parse(storedUser);
//           setUser(parsedUser);
//           console.log('Loaded user ID from localStorage:', parsedUser.id);
//         }

//         // Then try API
//         const response = await fetch('/api/session', {
//           credentials: 'include' // Important for cookie-based auth
//         });
//         const result = await response.json();
//         console.log("✅ SessionContext: /api/session result:", result);

//         if (result.user) {
//           setUser(result.user);
//           localStorage.setItem('user', JSON.stringify(result.user));
//           console.log('Loaded user ID from API:', result.user.id);
//         }
//       } catch (error) {
//         console.error("❌ Failed to load session:", error);
//         // If API fails, stick with localStorage user if available
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadUser();
//   }, []);

//   // Login function to be called after OTP verification
//   const login = async (userId) => {
//     try {
//       const response = await fetch('/api/session', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setUser(data.user);  // Make sure this matches your API response structure
//         localStorage.setItem('user', JSON.stringify(data.user));
//         console.log('Logged in user ID:', data.user.id);
//         router.push('/dashboard');  // Navigate to dashboard after successful login
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.error('Login failed:', error);
//       return false;
//     }
//   };

//   // Logout function
//   const logout = async () => {
//     try {
//       await fetch('/api/logout', { method: 'POST' });
//       setUser(null);
//       localStorage.removeItem('user');
//       router.push('/login');
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };

//   const value = {
//     user,
//     loading,
//     login,
//     logout,
//     isAuthenticated: !!user,
//     isPhoneVerified: user?.phoneIsVerified || false,
//   };

//   return (
//     <SessionContext.Provider value={value}>
//       {children}
//     </SessionContext.Provider>
//   );
// }

// export function useSession() {
//   const context = useContext(SessionContext);
//   if (context === undefined) {
//     throw new Error('useSession must be used within a SessionProvider');
//   }
//   return context;
// }

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { createToken, setTokenCookie } from '@/lib/auth';

// Define CORS headers
const getCorsHeaders = (origin) => ({
  'Access-Control-Allow-Origin': origin || '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true' // Needed for cookies
});

export const GET = async (request) => {
  const origin = request.headers.get('origin');
  const headers = getCorsHeaders(origin);

  try {
    await dbConnect();

    // Get token from cookie or Authorization header
    let token = request.cookies.get('authToken')?.value;
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return new NextResponse(
        JSON.stringify({ user: null }),
        { status: 200, headers }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return new NextResponse(
        JSON.stringify({ user: null }),
        { status: 200, headers }
      );
    }

    console.log('Session check for userId:', decoded.userId);

    const user = await User.findById(decoded.userId)
      .select('-__v -createdAt -updatedAt');

    if (!user) {
      return new NextResponse(
        JSON.stringify({ user: null }),
        { status: 200, headers }
      );
    }

    return new NextResponse(
      JSON.stringify({
        user: {
          id: user._id,
          phone: user.phone,
          name: user.name,
          isVerified: user.isVerified,
          phoneIsVerified: user.phoneIsVerified,
          subscription: user.subscription,
          profilePhoto: user.profilePhoto,
          gender: user?.gender,
          currentCity: user.currentCity, // Added currentCity for nearby filter
          profileCompletion: user.profileCompletion
        }
      }),
      { headers }
    );

  } catch (error) {
    console.error('Session check error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers }
    );
  }
}

export const POST = async (request) => {
  const origin = request.headers.get('origin');
  const headers = getCorsHeaders(origin);

  try {
    await dbConnect();

    const bodyText = await request.text();
    console.log('Received raw body:', bodyText);

    let { userId } = JSON.parse(bodyText);  // userId is actually the phone number

    // Ensure phone number has +91 prefix
    if (userId && !userId.startsWith('+91') && /^\d{10}$/.test(userId)) {
      userId = '+91' + userId;
    }

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ error: 'Phone number is required' }),
        { status: 400, headers }
      );
    }

    console.log('Creating session for phone:', userId);

    // FIX: Check for both formats: with +91 (standard) and without (legacy/raw)
    // The client might send +91... or just 98... 
    // We construct both forms to be safe.

    // 1. Clean input to get raw digits
    const rawDigits = userId.replace(/^\+91/, '');
    const phoneWithPrefix = `+91${rawDigits}`;
    const phoneWithoutPrefix = rawDigits;

    // 2. Find ANY user matching either format
    const users = await User.find({
      phone: { $in: [phoneWithPrefix, phoneWithoutPrefix] }
    }).sort({ createdAt: 1 }); // Oldest first (Main Account)

    let user;

    if (users.length === 0) {
      // Create new user if absolutely no match found
      user = new User({
        phone: phoneWithPrefix, // Defaults to standard format
        name: 'Static User',
        isVerified: true,
        phoneIsVerified: true,
        subscription: null,
        profilePhoto: null,
        gender: null,
        lastLoginAt: new Date()
      });
      await user.save();
      console.log('Created new user with ID:', user._id);
    } else {
      // User(s) found
      if (users.length > 1) {
        // Merge Scenario
        const mainUser = users[0];
        const duplicateUser = users[1];
        console.log(`[Session] Merging duplicate user ${duplicateUser._id} into ${mainUser._id}`);

        // Update main user to standard phone format if needed
        if (mainUser.phone !== phoneWithPrefix) {
          mainUser.phone = phoneWithPrefix;
          await mainUser.save();
        }

        // Delete duplicate
        await User.findByIdAndDelete(duplicateUser._id);
        user = mainUser;
      } else {
        // Single user
        user = users[0];
        // Normalize phone
        if (user.phone !== phoneWithPrefix) {
          user.phone = phoneWithPrefix;
          await user.save();
        }
      }
    }

    const token = createToken(user._id);
    const userData = {
      id: user._id,
      phone: user.phone,
      name: user.name,
      isVerified: user.isVerified,
      phoneIsVerified: user.phoneIsVerified,
      subscription: user.subscription || null,
      profilePhoto: user.profilePhoto,
      gender: user?.gender,
      currentCity: user.currentCity, // Added currentCity for nearby filter
      profileCompletion: user.profileCompletion
    };

    const response = new NextResponse(
      JSON.stringify({
        user: userData,
        token // Return token in body for mobile apps
      }),
      { headers }
    );

    // Set cookie for web browsers
    setTokenCookie(response, token);
    return response;

  } catch (error) {
    console.error('Session creation error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers }
    );
  }
}

// Handle OPTIONS requests for preflight
export const OPTIONS = async (request) => {
  const origin = request.headers.get('origin');
  return new NextResponse(null, {
    headers: getCorsHeaders(origin)
  });
}