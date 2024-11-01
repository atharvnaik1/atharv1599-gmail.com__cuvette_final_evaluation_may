import React, { useState, useEffect } from 'react';
import './TaskBoard.css';
import { LuCopyMinus } from 'react-icons/lu';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskModal from './TaskModal';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import { fetchTasks, saveTask, updateTask, deleteTask } from '../api/taskApi';
import { BsThreeDots } from "react-icons/bs";
import { format, isToday, isThisWeek, isThisMonth } from 'date-fns';

const TaskBoard = ({ tasks, setTasks, selectedFilter }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [taskStatus, setTaskStatus] = useState('');
  const [activeTaskOptions, setActiveTaskOptions] = useState(null);

  // Fetch tasks from backend when component mounts
  const refreshTasks = async () => {
    try {
      const data = await fetchTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch tasks from backend:", error);
      setTasks([]);
    }
  };

  useEffect(() => {
    refreshTasks();
  }, []);

  const openModal = (task = null, status = 'to-do') => {
    setCurrentTask(task);
    setTaskStatus(status);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentTask(null);
  };

  const saveTaskHandler = async (newTask) => {
    if (currentTask && currentTask._id) {
      await updateTask(currentTask._id, newTask);
    } else {
      const newTaskWithStatus = { ...newTask, status: taskStatus };
      await saveTask(newTaskWithStatus);
    }
    refreshTasks();
    closeModal();
  };

  const deleteTaskHandler = async (id) => {
    try {
      await deleteTask(id);
      refreshTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const toggleChecklist = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === id ? { ...task, isChecklistOpen: !task.isChecklistOpen } : task
      )
    );
  };

  const calculateChecklistProgress = (checklist) => {
    const completed = checklist.filter((item) => item.completed).length;
    return `(${completed}/${checklist.length})`;
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const updatedTasks = Array.from(tasks);
    const [movedTask] = updatedTasks.splice(result.source.index, 1);
    movedTask.status = result.destination.droppableId;
    updatedTasks.splice(result.destination.index, 0, movedTask);
    setTasks(updatedTasks);
  };

  const updateTaskStatus = (task, newStatus) => {
    const updatedTask = { ...task, status: newStatus };
    updateTask(task._id, updatedTask).then(refreshTasks);
  };

  const filterTasksByDueDate = (task) => {
    const dueDate = new Date(task.dueDate);
    if (selectedFilter === "Today") return isToday(dueDate);
    if (selectedFilter === "This Week") return isThisWeek(dueDate);
    if (selectedFilter === "This Month") return isThisMonth(dueDate);
    return true; // If no specific filter is applied
  };

  
  const renderTasksByStatus = (status) => {
    return tasks
      .filter((task) => task.status === status && filterTasksByDueDate(task))
      .map((task, index) => (
        <Draggable key={task._id} draggableId={task._id} index={index}>
          {(provided) => (
            <div
              className="task-item"
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <div className="task-header">
                <div className="priority">
                  <p>{task.priority} priority</p>
                </div>
                <BsThreeDots
                  className="options-icon"
                  onClick={() => toggleOptions(task._id)}
                />
              </div>
              {activeTaskOptions === task._id && (
                <div className="options-box">
                  <p onClick={() => openModal(task)}>Edit</p>
                  <p>Share</p>
                  <p onClick={() => deleteTaskHandler(task._id)}>Delete</p>
                </div>
              )}
              <div className="task-title" title={task.title}>
                {task.title}
              </div>
              <div className="checklist-header">
                <span>Checklist {calculateChecklistProgress(task.checklist)}</span>
                {task.isChecklistOpen ? (
                  <IoIosArrowUp
                    className="collapse-icon"
                    onClick={() => toggleChecklist(task._id)}
                  />
                ) : (
                  <IoIosArrowDown
                    className="collapse-icon"
                    onClick={() => toggleChecklist(task._id)}
                  />
                )}
              </div>
              {task.isChecklistOpen && (
                <div className="checklist">
                  {task.checklist.map((item, idx) => (
                    <div key={idx} className="checklist-item">
                      <input type="checkbox" checked={item.completed} readOnly />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="task-footer">
                <div className="due-date">
                  {task.dueDate ? format(new Date(task.dueDate), 'do MMM') : ''}
                </div>
                {renderStatusButtons(task, status)}
              </div>
            </div>
          )}
        </Draggable>
      ));
  };

  const toggleOptions = (taskId) => {
    setActiveTaskOptions((prev) => (prev === taskId ? null : taskId));
  };

  const renderStatusButtons = (task, currentStatus) => {
    const statuses = ['backlog', 'to-do', 'in-progress', 'done'];
    return statuses
      .filter((status) => status !== currentStatus)
      .map((status) => (
        <button key={status} onClick={() => updateTaskStatus(task, status)}>
          {status}
        </button>
      ));
  };

  const closeAllChecklistsInColumn = (column) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.status === column ? { ...task, isChecklistOpen: false } : task
      )
    );
  };

  return (
    <div className="task-board-wrapper">
      <DragDropContext onDragEnd={handleDragEnd}>
        {['backlog', 'to-do', 'in-progress', 'done'].map((column) => (
          <Droppable key={column} droppableId={column}>
            {(provided) => (
              <div className="task-board" {...provided.droppableProps} ref={provided.innerRef}>
                <div className="task-board-header">
                  <h3>{column}</h3>
                  {column === 'to-do' && (
                    <span className="plus-icon" onClick={() => openModal(null, 'to-do')}>
                      +
                    </span>
                  )}
                  <LuCopyMinus
                    className="copy-minus-icon"
                    onClick={() => closeAllChecklistsInColumn(column)}
                  />
                </div>
                <div className="task-board-body">
                  {renderTasksByStatus(column)}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
      {showModal && <TaskModal task={currentTask} closeModal={closeModal} saveTask={saveTaskHandler} />}
    </div>
  );
};

export default TaskBoard;
