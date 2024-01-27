import {
  doc,
  getDocs,
  addDoc,
  setDoc,
  collection,
  getDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import * as O from "./O";

const notesCollectionFor = (folderId: string) =>
  collection(db, "folders", folderId, "notes");

function qsToArray(qs) {
  const arr = [];
  qs.forEach((doc) => {
    arr.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  return arr;
}

class Folder {
  static async getAll() {
    try {
      const qs = await getDocs(collection(db, "folders"));
      const folders = qsToArray(qs);
      return folders;
    } catch (err) {
      console.log("[service getFolders()]");
      console.error(err);
      return [];
    }
  }

  static async createFolder(body: { title: string }) {
    addDoc(collection(db, "folders"), body);
  }

  static async deleteFolders(body: { folderList: string[] }) {
    const docIdsToDelete = body.folderList;

    const batch = writeBatch(db);

    docIdsToDelete.forEach((docId) => {
      const docRef = doc(collection(db, "folders"), docId);

      batch.delete(docRef);
    });

    await batch.commit();
  }
}

export { Folder };

export function getFolder(id: string) {
  return O.pipe(
    0,
    O.tryCatch(() => getDoc(doc(collection(db, "folders"), id))),
    O.bind((x) => x.data())
  );
}

export function saveFolder(body: {
  icon: string;
  title: string;
  first_note?: string;
  accentColor: string;
}) {
  return O.pipe(
    body,
    filter<ObjectValues<typeof body>>(Boolean),
    O.tryCatch((x: any) => addDoc(collection(db, "folders"), x))
  );
}

export function getNotes(id: string) {
  return O.pipe(
    notesCollectionFor(id),
    O.tryCatch((query) => getDocs(query)),
    O.bind(qsToArray)
  );
}

export function updateNote(folderId: string, id: string, note: string) {
  return O.pipe(
    notesCollectionFor(folderId),
    O.tryCatch((collection) =>
      setDoc(doc(collection, id), { note }, { merge: true })
    ),
    O.bind(Boolean)
  );
}

export function addNote(body: Record<string, string>) {
  return O.pipe(
    0,
    O.tryCatch(() => addDoc(notesCollectionFor(body.folder_id), body)),
    O.bind(Boolean)
  );
}

export function deleteNotes(body: Record<string, any[]>) {
  const docIdsToDelete = body.selected_notes;

  const batch = writeBatch(db);

  docIdsToDelete.forEach((docId) => {
    const docRef = doc(
      collection(db, "folders", String(body.folder_id), "notes"),
      docId
    );
    batch.delete(docRef);
  });

  return O.pipe(
    0,
    O.tryCatch(() => batch.commit()),
    O.bind(Boolean)
  );
}

type ObjectValues<T> = T[keyof T];

const filter =
  <T>(fn: (x: T) => boolean) =>
  (x: T) =>
    Object.fromEntries<T>(Object.entries(x).filter(([_, value]) => fn(value)));
