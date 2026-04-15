"use client"

import { useState, useEffect, useCallback } from "react"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import type { CalendarTask, SolutionId, TaskCategory } from "@/lib/gtm/calendar-types"
import { defaultCalendarTasks } from "@/lib/gtm/calendar-data"
import CalendarHeader from "@/components/gtm/calendar/CalendarHeader"
import FilterBar from "@/components/gtm/calendar/FilterBar"
import CalendarView from "@/components/gtm/calendar/CalendarView"
import ListView from "@/components/gtm/calendar/ListView"
import TaskDetailModal from "@/components/gtm/calendar/TaskDetailModal"
import TaskCard from "@/components/gtm/calendar/TaskCard"

const font = "'Inter', system-ui, -apple-system, sans-serif"

async function fetchTasks(): Promise<CalendarTask[]> {
  try {
    const res = await fetch("/api/gtm/calendar")
    if (!res.ok) return defaultCalendarTasks
    const data = await res.json()
    if (!data.tasks || data.tasks.length === 0) return defaultCalendarTasks
    // Merge any default tasks that might be missing
    const existingIds = new Set(data.tasks.map((t: CalendarTask) => t.id))
    for (const dt of defaultCalendarTasks) {
      if (!existingIds.has(dt.id)) data.tasks.push(dt)
    }
    return data.tasks
  } catch {
    return defaultCalendarTasks
  }
}

export default function CalendarPage() {
  const [tasks, setTasks] = useState<CalendarTask[]>(defaultCalendarTasks)
  const [viewMode, setViewMode] = useState<"list" | "calendar">("calendar")
  const [currentMonth, setCurrentMonth] = useState(() => new Date(2026, 2, 1)) // March 2026
  const [selectedSolutions, setSelectedSolutions] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTask, setSelectedTask] = useState<CalendarTask | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks().then((loaded) => {
      setTasks(loaded)
      setMounted(true)
      setLoading(false)
    })
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  const filteredTasks = tasks.filter((t) => {
    if (selectedSolutions.length > 0 && !selectedSolutions.includes(t.solution)) return false
    if (selectedCategories.length > 0 && !selectedCategories.includes(t.category)) return false
    return true
  })

  const taskStats = {
    total: filteredTasks.length,
    completed: filteredTasks.filter((t) => t.completed).length,
  }

  const handleToggleComplete = useCallback((taskId: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
      const task = updated.find((t) => t.id === taskId)
      if (task) {
        fetch(`/api/gtm/calendar/${taskId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(task),
        }).catch(() => {})
      }
      return updated
    })
  }, [])

  const handleTaskClick = useCallback((task: CalendarTask) => {
    setSelectedTask(task)
  }, [])

  const handleMonthChange = useCallback((offset: number) => {
    setCurrentMonth((prev) => {
      const next = new Date(prev)
      next.setMonth(next.getMonth() + offset)
      return next
    })
  }, [])

  const handleTodayClick = useCallback(() => {
    const today = new Date()
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1))
  }, [])

  const handleSolutionToggle = useCallback((solutionId: string) => {
    setSelectedSolutions((prev) =>
      prev.includes(solutionId)
        ? prev.filter((s) => s !== solutionId)
        : [...prev, solutionId]
    )
  }, [])

  const handleCategoryToggle = useCallback((categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    )
  }, [])

  const handleClearFilters = useCallback(() => {
    setSelectedSolutions([])
    setSelectedCategories([])
  }, [])

  const handleDeleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
    fetch(`/api/gtm/calendar/${taskId}`, { method: "DELETE" }).catch(() => {})
  }, [])

  const handleEditTask = useCallback((updatedTask: CalendarTask) => {
    setTasks((prev) => prev.map((t) => t.id === updatedTask.id ? updatedTask : t))
    fetch(`/api/gtm/calendar/${updatedTask.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    }).catch(() => {})
    setSelectedTask(updatedTask)
  }, [])

  const handleResetTasks = useCallback(() => {
    // Delete all current tasks from KV
    for (const task of tasks) {
      fetch(`/api/gtm/calendar/${task.id}`, { method: "DELETE" }).catch(() => {})
    }
    // Re-seed with defaults
    setTasks(defaultCalendarTasks)
    for (const task of defaultCalendarTasks) {
      fetch("/api/gtm/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      }).catch(() => {})
    }
  }, [tasks])

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)
    const { active, over } = event
    if (!over) return

    const activeTaskId = active.id as string
    const overId = over.id as string

    // If dropped on a day column (id starts with "day-")
    if (overId.startsWith("day-")) {
      const newDate = overId.replace("day-", "")
      setTasks((prev) =>
        prev.map((t) =>
          t.id === activeTaskId ? { ...t, date: newDate } : t
        )
      )
      // Persist date change
      const task = tasks.find((t) => t.id === activeTaskId)
      if (task) {
        fetch(`/api/gtm/calendar/${activeTaskId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...task, date: newDate }),
        }).catch(() => {})
      }
      return
    }

    // If dropped on another task (reorder within same day)
    const activeTask = tasks.find((t) => t.id === activeTaskId)
    const overTask = tasks.find((t) => t.id === overId)

    if (activeTask && overTask) {
      if (activeTask.date !== overTask.date) {
        // Move to new date
        setTasks((prev) =>
          prev.map((t) =>
            t.id === activeTaskId ? { ...t, date: overTask.date } : t
          )
        )
        fetch(`/api/gtm/calendar/${activeTaskId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...activeTask, date: overTask.date }),
        }).catch(() => {})
      } else {
        // Reorder within same day
        const dayTasks = tasks
          .filter((t) => t.date === activeTask.date)
          .sort((a, b) => a.sortOrder - b.sortOrder)
        const oldIndex = dayTasks.findIndex((t) => t.id === activeTaskId)
        const newIndex = dayTasks.findIndex((t) => t.id === overId)
        if (oldIndex !== -1 && newIndex !== -1) {
          const reordered = arrayMove(dayTasks, oldIndex, newIndex)
          const orderMap = new Map(reordered.map((t, i) => [t.id, i]))
          setTasks((prev) =>
            prev.map((t) =>
              orderMap.has(t.id) ? { ...t, sortOrder: orderMap.get(t.id)! } : t
            )
          )
          // Bulk update reordered tasks
          const reorderedTasks = reordered.map((t, i) => ({ ...t, sortOrder: i }))
          fetch("/api/gtm/calendar", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reorderedTasks),
          }).catch(() => {})
        }
      }
    }
  }

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null

  if (loading) {
    return (
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "120px 48px",
        textAlign: "center",
      }}>
        <p style={{
          fontSize: 14,
          color: "var(--gtm-text-muted)",
          fontFamily: font,
        }}>
          Loading calendar...
        </p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px 48px" }}>
      {/* Page Header */}
      <div style={{ padding: "48px 0 0" }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--gtm-cyan)",
            letterSpacing: "0.14em",
            fontFamily: font,
            marginBottom: 10,
            textTransform: "uppercase",
          }}
        >
          EXECUTION PLAN
        </p>
        <h1
          style={{
            fontSize: 36,
            fontWeight: 300,
            color: "var(--gtm-text-primary)",
            fontFamily: font,
            margin: 0,
            transition: "color 200ms ease",
          }}
        >
          GTM Calendar
        </h1>
        <p
          style={{
            fontSize: 16,
            fontWeight: 400,
            color: "var(--gtm-text-muted)",
            fontFamily: font,
            marginTop: 8,
            transition: "color 200ms ease",
          }}
        >
          Tactical execution across all solutions. Drag to reschedule. Click to
          view details.
        </p>
      </div>

      <CalendarHeader
        currentMonth={currentMonth}
        viewMode={viewMode}
        onMonthChange={handleMonthChange}
        onViewChange={setViewMode}
        onTodayClick={handleTodayClick}
        taskStats={taskStats}
      />

      <FilterBar
        selectedSolutions={selectedSolutions}
        selectedCategories={selectedCategories}
        onSolutionToggle={handleSolutionToggle}
        onCategoryToggle={handleCategoryToggle}
        onClearAll={handleClearFilters}
      />

      {/* Reset button */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button
          onClick={handleResetTasks}
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "var(--gtm-text-faint)",
            fontFamily: font,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px 8px",
            transition: "color 200ms ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gtm-text-muted)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--gtm-text-faint)")}
        >
          Reset to default schedule
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {viewMode === "calendar" ? (
          <CalendarView
            tasks={filteredTasks}
            currentMonth={currentMonth}
            onToggleComplete={handleToggleComplete}
            onTaskClick={handleTaskClick}
            onDeleteTask={handleDeleteTask}
          />
        ) : (
          <ListView
            tasks={filteredTasks}
            onToggleComplete={handleToggleComplete}
            onTaskClick={handleTaskClick}
            onDeleteTask={handleDeleteTask}
          />
        )}

        <DragOverlay>
          {activeTask ? (
            <div style={{ opacity: 0.85, transform: "rotate(2deg)" }}>
              <TaskCard
                task={activeTask}
                variant={viewMode === "calendar" ? "compact" : "full"}
                onToggleComplete={() => {}}
                onClick={() => {}}
                isDragging
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskDetailModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onToggleComplete={handleToggleComplete}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  )
}
