import { useEffect, useState } from "react";

import api from "../api/client";

import {
  getTasks,
  saveTasks,
  savePendingTask
} from "../db/indexedDb";
import "./Tasks.css";

function Tasks() {

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {

    try {

      if (navigator.onLine) {

        const response = await api.get("/tasks");

        setTasks(response.data);

        await saveTasks(response.data);

      } else {

        const cachedTasks = await getTasks();

        setTasks(cachedTasks);

      }

    } catch (error) {

      const cachedTasks = await getTasks();

      setTasks(cachedTasks);

    }

  }

  async function createTask(event) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    const newTask = {
      title,
      completed: false
    };

    if (navigator.onLine) {

      try {

        const response = await api.post(
          "/tasks",
          newTask
        );

        setTasks((current) => [
          ...current,
          response.data
        ]);

        setTitle("");

        return;

      } catch (error) {
        console.log(error);
      }

    }

    // Offline

    const offlineTask = {
      id: `offline-${Date.now()}`,
      ...newTask,
      offline: true
    };

    setTasks((current) => [
      ...current,
      offlineTask
    ]);

    await saveTasks([
      ...tasks,
      offlineTask
    ]);

    await savePendingTask(newTask);

    setTitle("");

  }

  return (
    <section className="tasks-page">
      <div className="tasks-heading">
        <div>
          <p className="tasks-eyebrow">YOUR WORKSPACE</p>
          <h1>Tasks</h1>
          <p className="tasks-description">A clear view of what needs your attention.</p>
        </div>
        <span className={`connection-status ${navigator.onLine ? "is-online" : "is-offline"}`}>
          <span aria-hidden="true" />
          {navigator.onLine ? "Online" : "Offline"}
        </span>
      </div>

      <form className="task-form" onSubmit={createTask}>
        <label className="visually-hidden" htmlFor="new-task">Task name</label>
        <input
          id="new-task"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What needs to be done?"
          autoComplete="off"
        />
        <button type="submit" disabled={!title.trim()}>
          <span aria-hidden="true">+</span>
          Add task
        </button>
      </form>

      <section className="task-list-section" aria-label="Your tasks">
        <div className="task-list-heading">
          <h2>All tasks</h2>
          <span>{tasks.length}</span>
        </div>
        {tasks.length === 0 ? (
          <p className="empty-tasks">No tasks yet. Add one above to get started.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li className="task-row" key={task.id}>
                <span className="task-marker" aria-hidden="true" />
                <span className="task-title">{task.title}</span>
                {task.offline && <span className="pending-sync">Pending sync</span>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}

export default Tasks;