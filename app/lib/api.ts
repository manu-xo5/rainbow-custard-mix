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

  static async get(folderId: string) {
    try {
      const docRef = doc(collection(db, "folders"), folderId);
      const folder = await getDoc(docRef);
      return folder.data();
    } catch (err) {
      console.log("[service getFolders()]");
      console.error(err);
      return undefined;
    }
  }

  static async createFolder(body: { title: string }) {
    await addDoc(collection(db, "folders"), body);
  }

  static async updateFolder(body: { folderId: string; title: string }) {
    try {
      const docRef = doc(collection(db, "folders"), body.folderId);
      await setDoc(docRef, { title: body.title }, { merge: true });
    } catch {
      return;
    }
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
