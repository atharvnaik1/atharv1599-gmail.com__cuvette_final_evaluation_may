import React, { useState, useEffect } from 'react';
import './TaskBoard.css';
import { LuCopyMinus } from 'react-icons/lu';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskModal from './TaskModal';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import { fetchTasks, saveTask, updateTask, deleteTask } from '../api/taskApi';
import AnalyticsPage from '../pages/Analytics';

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [taskStatus, setTaskStatus] = useState('');

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

  const deleteTaskHandler = async (_id) => {
    await deleteTask(__dirnameid);
    refreshTasks();
  };

  const toggleChecklist = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, isChecklistOpen: !task.isChecklistOpen } : task
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

  const renderTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };
  return (
    <div className="task-board-wrapper">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="backlog">
          {(provided) => (
            <div className="task-board" {...provided.droppableProps} ref={provided.innerRef}>
              <div className="task-board-header">
                <h3>Backlog</h3>
                <LuCopyMinus className="copy-minus-icon" />
              </div>
              <div className="task-board-body">
                {renderTasksByStatus('backlog').map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        className="task-item"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className="task-header">
                          <h4 title={task.title}>{task.title}</h4>
                          <p>{task.priority} priority</p>
                        </div>
                        <div className="checklist-header">
                          <span>Checklist {calculateChecklistProgress(task.checklist)}</span>
                          {task.isChecklistOpen ? (
                            <IoIosArrowUp className="collapse-icon" onClick={() => toggleChecklist(task.id)} />
                          ) : (
                            <IoIosArrowDown className="collapse-icon" onClick={() => toggleChecklist(task.id)} />
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
                        <div className="task-actions">
                          <FaEdit className="edit-icon" onClick={() => openModal(task)} />
                          <FaTrash className="delete-icon" onClick={() => deleteTaskHandler(task.id)} />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>

        {/* Repeat the above Droppable component for "To Do", "In Progress", and "Done" columns */}
        {/* Example for "To Do" column */}
        <Droppable droppableId="to-do">
          {(provided) => (
            <div className="task-board" {...provided.droppableProps} ref={provided.innerRef}>
              <div className="task-board-header">
                <h3>To Do</h3>
                <span className="plus-icon" onClick={() => openModal(null, 'to-do')}>+</span>
                <LuCopyMinus className="copy-minus-icon" />
              </div>
              <div className="task-board-body">
                {renderTasksByStatus('to-do').map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        className="task-item"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className="task-header">
                          <h4 title={task.title}>{task.title}</h4>
                          <p>{task.priority} priority</p>
                        </div>
                        <div className="checklist-header">
                          <span>Checklist {calculateChecklistProgress(task.checklist)}</span>
                          {task.isChecklistOpen ? (
                            <IoIosArrowUp className="collapse-icon" onClick={() => toggleChecklist(task.id)} />
                          ) : (
                            <IoIosArrowDown className="collapse-icon" onClick={() => toggleChecklist(task.id)} />
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
                        <div className="task-actions">
                          <FaEdit className="edit-icon" onClick={() => openModal(task)} />
                          <FaTrash className="delete-icon" onClick={() => deleteTaskHandler(task.id)} />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>

        {/* In Progress Column */}
        <Droppable droppableId="in-progress">
          {(provided) => (
            <div className="task-board" {...provided.droppableProps} ref={provided.innerRef}>
              <div className="task-board-header">
                <h3>In Progress</h3>
                <LuCopyMinus className="copy-minus-icon" />
              </div>
              <div className="task-board-body">
                {renderTasksByStatus('in-progress').map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        className="task-item"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className="task-header">
                          <h4 title={task.title}>{task.title}</h4>
                          <p>{task.priority} priority</p>
                        </div>

                        {/* Checklist progress */}
                        <div className="checklist-header">
                          <span>Checklist {calculateChecklistProgress(task.checklist)}</span>
                          {task.isChecklistOpen ? (
                            <IoIosArrowUp className="collapse-icon" onClick={() => toggleChecklist(task.id)} />
                          ) : (
                            <IoIosArrowDown className="collapse-icon" onClick={() => toggleChecklist(task.id)} />
                          )}
                        </div>

                        {/* Checklist (collapsible) */}
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

                        <div className="task-actions">
                          <FaEdit className="edit-icon" onClick={() => openModal(task)} />
                          <FaTrash className="delete-icon" onClick={() => deleteTask(task.id)} />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>

        {/* Done Column */}
        <Droppable droppableId="done">
          {(provided) => (
            <div className="task-board" {...provided.droppableProps} ref={provided.innerRef}>
              <div className="task-board-header">
                <h3>Done</h3>
                <LuCopyMinus className="copy-minus-icon" />
              </div>
              <div className="task-board-body">
                {renderTasksByStatus('done').map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        className="task-item"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className="task-header">
                          <h4 title={task.title}>{task.title}</h4>
                          <p>{task.priority} priority</p>
                        </div>

                        {/* Checklist progress */}
                        <div className="checklist-header">
                          <span>Checklist {calculateChecklistProgress(task.checklist)}</span>
                          {task.isChecklistOpen ? (
                            <IoIosArrowUp className="collapse-icon" onClick={() => toggleChecklist(task.id)} />
                          ) : (
                            <IoIosArrowDown className="collapse-icon" onClick={() => toggleChecklist(task.id)} />
                          )}
                        </div>

                        {/* Checklist (collapsible) */}
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

                        <div className="task-actions">
                          <FaEdit className="edit-icon" onClick={() => openModal(task)} />
                          <FaTrash className="delete-icon" onClick={() => deleteTask(task.id)} />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>

      </DragDropContext>
      {/* <AnalyticsPage tasks={tasks} /> */}
      
      {/* Modal for adding or editing a task */}
      {showModal && <TaskModal task={currentTask} closeModal={closeModal} saveTask={saveTaskHandler} />}
    </div>
  );
};

export default TaskBoard;
