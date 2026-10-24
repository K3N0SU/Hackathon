import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
  limit,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { auth } from "@/lib/firebase";
import type { Chat } from "@/lib/chats";
import type { Clock } from "@/lib/clocks";
import type { LastScan } from "@/lib/exposure";
import type { Language, ScanResult } from "@/lib/scan";

export type Profile = {
  language?: Language;
  clocks?: Clock[];
  lastScan?: LastScan;
};

export type SavedScan = {
  id: string;
  createdAt: number;
  language: Language;
  thumb: string;
  result: ScanResult;
  latitude?: number;
  longitude?: number;
};

let store: Firestore | undefined;

function db() {
  if (!store) {
    try {
      store = initializeFirestore(auth().app, {
        localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
      });
    } catch {
      store = getFirestore(auth().app);
    }
  }
  return store;
}

function uid() {
  return auth().currentUser?.uid;
}

export async function loadProfile(): Promise<Profile> {
  const id = uid();
  if (!id) return {};
  const snapshot = await getDoc(doc(db(), "users", id));
  return (snapshot.data() as Profile | undefined) ?? {};
}

export async function saveProfile(changes: Profile) {
  const id = uid();
  if (!id) return;
  await setDoc(
    doc(db(), "users", id),
    { ...changes, updatedAt: Date.now() },
    { merge: true },
  );
}

export async function saveScan(scan: Omit<SavedScan, "id">) {
  const id = uid();
  if (!id) return;
  await addDoc(collection(db(), "users", id, "scans"), scan);
}

export async function listScans(): Promise<SavedScan[]> {
  const id = uid();
  if (!id) return [];
  const snapshot = await getDocs(
    query(
      collection(db(), "users", id, "scans"),
      orderBy("createdAt", "desc"),
      limit(40),
    ),
  );
  return snapshot.docs.map(
    (item) => ({ id: item.id, ...item.data() }) as SavedScan,
  );
}

export type SharedScan = {
  createdAt: number;
  language: Language;
  thumb: string;
  result: ScanResult;
};

export async function shareScan(scan: SharedScan) {
  const id = uid();
  if (!id) throw new Error("signed out");
  const created = await addDoc(collection(db(), "shares"), { ...scan, uid: id });
  return created.id;
}

export async function loadShare(shareId: string) {
  const snapshot = await getDoc(doc(db(), "shares", shareId));
  return (snapshot.data() as SharedScan | undefined) ?? null;
}

export async function deleteScan(scanId: string) {
  const id = uid();
  if (!id) return;
  await deleteDoc(doc(db(), "users", id, "scans", scanId));
}

export function thumbnail(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(
        1,
        360 / Math.max(img.naturalWidth, img.naturalHeight),
      );
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      const context = canvas.getContext("2d");
      if (!context) return reject(new Error("canvas unavailable"));
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };
    img.onerror = () => reject(new Error("image failed to load"));
    img.src = src;
  });
}

export async function listChats(): Promise<Chat[]> {
  const id = uid();
  if (!id) return [];
  const snapshot = await getDocs(
    query(collection(db(), "users", id, "chats"), orderBy("updatedAt", "desc"), limit(50)),
  );
  return snapshot.docs.map((item) => ({ ...item.data(), id: item.id }) as Chat);
}

export async function saveChat(chat: Chat) {
  const id = uid();
  if (!id) return;
  await setDoc(doc(db(), "users", id, "chats", chat.id), JSON.parse(JSON.stringify(chat)));
}

export async function deleteChat(chatId: string) {
  const id = uid();
  if (!id) return;
  await deleteDoc(doc(db(), "users", id, "chats", chatId));
}
