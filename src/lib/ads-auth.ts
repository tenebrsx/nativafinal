import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export const ADS_ALLOWED_EMAIL = "tenebrsx@gmail.com";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export function isAdsAdmin(user: User | null | undefined): boolean {
  if (!user?.email) return false;
  return (
    user.email.toLowerCase() === ADS_ALLOWED_EMAIL.toLowerCase() &&
    user.emailVerified === true
  );
}

export function subscribeAdsAuth(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}

export async function signInAdsWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function signOutAds() {
  return signOut(auth);
}
