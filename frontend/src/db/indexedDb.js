import { openDB } from "idb";

const dbPromise = openDB("task-pwa", 1, {

  upgrade(db) {

    if (!db.objectStoreNames.contains("tasks")) {
      db.createObjectStore("tasks", {
        keyPath: "id"
      });
    }

    if (!db.objectStoreNames.contains("pendingTasks")) {
      db.createObjectStore("pendingTasks", {
        keyPath: "localId",
        autoIncrement: true
      });
    }

  }

});

export async function saveTasks(tasks) {

  const db = await dbPromise;

  const tx = db.transaction("tasks", "readwrite");

  for (const task of tasks) {
    tx.store.put(task);
  }

  await tx.done;
}

export async function getTasks() {

  const db = await dbPromise;

  return db.getAll("tasks");
}

export async function savePendingTask(task) {

  const db = await dbPromise;

  await db.add("pendingTasks", task);
}

export async function getPendingTasks() {

  const db = await dbPromise;

  return db.getAll("pendingTasks");
}

export async function deletePendingTask(id) {

  const db = await dbPromise;

  await db.delete("pendingTasks", id);
}