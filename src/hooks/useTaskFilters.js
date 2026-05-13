import { useMemo } from 'react';
import { parseDate } from '../utils/parseDate';
import { getMinute } from '../utils/getMinutes';

export const useTaskFilters = (tasks, filters, selectedDate) => {
  const { sortOrder, status, startDate, endDate } = filters;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  now.setHours(0, 0, 0, 0);

  // ----- Filtering and Sorting -----
  const filteredTasks = useMemo(() => {
    let tasksToFilter = [...tasks];

    if (sortOrder === 'dueDate') {
      tasksToFilter = tasksToFilter.filter(task => !task.completed);
    }

    if (startDate) {
      const start = parseDate(startDate);
      const end = endDate ? parseDate(endDate) : now;
      if (start && end) {
        tasksToFilter = tasksToFilter.filter(task => {
          const taskDate = parseDate(task.date);
          const actualEndDate = start > end ? start : end;
          return taskDate && taskDate >= start && taskDate <= actualEndDate;
        });
      }
    } else {
      const selected = parseDate(selectedDate);
      if (selected) {
        tasksToFilter = tasksToFilter.filter(task => {
          const taskDate = parseDate(task.date);
          return (
            taskDate && taskDate.toDateString() === selected.toDateString()
          );
        });
      }
    }

    if (status !== '') {
      tasksToFilter = tasksToFilter.filter(t => {
        const isEndDate = !!t.endDate;
        const endD = isEndDate ? parseDate(t.endDate) : null;
        const isOverdue =
          !t.completed &&
          isEndDate &&
          (endD < now ||
            (endD.getTime() === now.getTime() &&
              getMinute(t.endTime) < currentMinutes));
        if (status === 'Completed') return t.completed;
        if (status === 'Overdue') return isOverdue;
        if (status === 'Ongoing') {
          return !t.completed && !isOverdue && !(parseDate(t.date) > now);
        }
        return true;
      });
    }

    return tasksToFilter.sort((a, b) => {
      if (sortOrder !== '') {
        if (sortOrder === 'dueDate') {
          const firstDate = parseDate(a.endDate || a.date);
          const secondDate = parseDate(b.endDate || b.date);

          if (firstDate.getTime() !== secondDate.getTime()) {
            return firstDate - secondDate;
          }
          const timeA = getMinute(a.endTime || a.time);
          const timeB = getMinute(b.endTime || b.time);
          return timeA - timeB;
        }
        const priorityOrder = { High: 3, Normal: 2, Low: 1 };
        switch (sortOrder) {
          case 'priorityHigh':
            return (
              priorityOrder[b.priority || 'Normal'] -
              priorityOrder[a.priority || 'Normal']
            );
          case 'priorityLow':
            return (
              priorityOrder[a.priority || 'Normal'] -
              priorityOrder[b.priority || 'Normal']
            );
          case 'desc':
            return b.title.localeCompare(a.title);
          default:
            return a.title.localeCompare(b.title);
        }
      }
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return a.title.localeCompare(b.title);
    });
  }, [tasks, selectedDate, status, sortOrder, startDate, endDate]);

  // ----- Section List -----
  const groupedSections = useMemo(() => {
    if (!startDate) return [];
    const groups = {};
    filteredTasks.forEach(task => {
      if (!groups[task.date]) groups[task.date] = [];
      groups[task.date].push(task);
    });
    return Object.keys(groups)
      .sort()
      .map(date => ({ title: date, data: groups[date] }));
  }, [filteredTasks, startDate, endDate]);

  // ----- Chart Data -----
  const chartData = useMemo(() => {
    const completedCount = filteredTasks.filter(t => t.completed).length;
    const overdueCount = filteredTasks.filter(t => {
      if (t.completed || !t.endDate) return false;
      const d = parseDate(t.endDate);
      return (
        d < now ||
        (d.getTime() === now.getTime() && getMinute(t.endTime) < currentMinutes)
      );
    }).length;
    const ongoingCount = filteredTasks.length - completedCount - overdueCount;
    const isFuture = startDate ? false : parseDate(selectedDate) > now;
    const pendingCount = filteredTasks.filter(t => {
      const taskDate = parseDate(t.date);
      return !t.completed && taskDate > now;
    }).length;

    return {
      ongoingCount,
      overdueCount,
      completedCount,
      pendingCount,
      isFuture,
    };
  }, [filteredTasks]);

  return { filteredTasks, groupedSections, chartData };
};
