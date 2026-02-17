"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { Task, TaskStatus, TaskPriority } from "@/types";
import { getTasks, saveTask, updateTask, deleteTask } from "@/lib/storage";
import TaskColumn from "./TaskColumn";
import TaskForm from "./TaskForm";

const COLUMNS: TaskStatus[] = ["todo", "in_progress", "done"];

type TaskBoardProps = {
  projectId: string;
};

export default function TaskBoard({ projectId }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(() => getTasks(projectId));
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("todo");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const refreshTasks = useCallback(() => {
    setTasks(getTasks(projectId));
  }, [projectId]);

  const handleAddTask = (status: TaskStatus) => {
    setDefaultStatus(status);
    setEditingTask(undefined);
    setShowForm(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDefaultStatus(task.status);
    setShowForm(true);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    refreshTasks();
  };

  const handleSaveTask = (data: { title: string; description?: string; status: TaskStatus; priority: TaskPriority }) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      saveTask({ ...data, projectId });
    }
    refreshTasks();
    setShowForm(false);
    setEditingTask(undefined);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    // Check if dropping over a column
    const overColumn = COLUMNS.includes(over.id as TaskStatus) ? (over.id as TaskStatus) : null;
    // Check if dropping over another task
    const overTask = tasks.find((t) => t.id === over.id);
    const newStatus = overColumn || (overTask ? overTask.status : null);

    if (newStatus && activeTask.status !== newStatus) {
      updateTask(activeTask.id, { status: newStatus });
      refreshTasks();
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    const overColumn = COLUMNS.includes(over.id as TaskStatus) ? (over.id as TaskStatus) : null;
    const overTask = tasks.find((t) => t.id === over.id);
    const newStatus = overColumn || (overTask ? overTask.status : null);

    if (newStatus && activeTask.status !== newStatus) {
      updateTask(activeTask.id, { status: newStatus });
      refreshTasks();
    }
  };

  const getTasksByStatus = (status: TaskStatus) => tasks.filter((t) => t.status === status);

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map((status) => (
            <TaskColumn
              key={status}
              status={status}
              tasks={getTasksByStatus(status)}
              onAddTask={() => handleAddTask(status)}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onUpdate={refreshTasks}
            />
          ))}
        </div>
      </DndContext>

      {showForm && (
        <TaskForm
          task={editingTask}
          defaultStatus={defaultStatus}
          onSave={handleSaveTask}
          onClose={() => { setShowForm(false); setEditingTask(undefined); }}
        />
      )}
    </>
  );
}
