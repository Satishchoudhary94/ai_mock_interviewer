"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7; // seconds

// Set session cookie
export async function setSessionCookie(idToken: string) {
  const cookieStore = cookies(); // don't await cookies()

  try {
    // Create Firebase session cookie
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION * 1000,
    });

    // Set it in browser
    cookieStore.set("session", sessionCookie, {
      maxAge: SESSION_DURATION,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
  } catch (error) {
    console.error("Error setting session cookie:", error);
  }
}

// Register user in Firestore
export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    const userRef = db.collection("users").doc(uid);
    const userSnapshot = await userRef.get();

    if (userSnapshot.exists) {
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };
    }

    // Save new user to Firestore
    await userRef.set({
      name,
      email,
      createdAt: new Date(),
    });

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: any) {
    console.error("Error signing up:", error);
    return {
      success: false,
      message:
        error.code === "auth/email-already-exists"
          ? "This email is already in use"
          : "Failed to create account. Please try again.",
    };
  }
}

// Sign in and set session cookie
export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return {
        success: false,
        message: "User does not exist. Please sign up.",
      };
    }

    // Set session cookie
    await setSessionCookie(idToken);

    return {
      success: true,
      message: "Signed in successfully.",
    };
  } catch (error) {
    console.error("Error signing in:", error);
    return {
      success: false,
      message: "Failed to sign in. Please try again.",
    };
  }
}

// Clear the session cookie (logout)
export async function signOut() {
  const cookieStore = cookies();
  cookieStore.delete("session");
}

// Get current logged in user from session cookie
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userDoc = await db.collection("users").doc(decodedClaims.uid).get();

    if (!userDoc.exists) return null;

    return {
      ...userDoc.data(),
      id: userDoc.id,
    } as User;
  } catch (error) {
    console.error("Error verifying session cookie:", error);
    return null; // Expired or invalid session
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
