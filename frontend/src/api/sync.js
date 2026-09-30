import api from "./client";

import {
  getPendingTasks,
  deletePendingTask
} from "../db/indexedDb";

export async function syncPendingTasks() {

  if (!navigator.onLine) {
    return;
  }

  const pendingTasks =
    await getPendingTasks();

  for (const task of pendingTasks) {

    try {

      await api.post("/tasks", task);

      await deletePendingTask(
        task.localId
      );

    } catch (error) {

      console.error(
        "Task sync failed",
        error
      );

    }

  }

}