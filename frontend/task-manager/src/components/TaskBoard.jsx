import React, { useState, useEffect } from 'react';
import './TaskBoard.css';
import { LuCopyMinus } from 'react-icons/lu';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import edit and delete icons
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskModal from './TaskModal'; // Import the modal component
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io'; // Import arrow icons for collapsing

const setAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
};

const TaskBoard =() => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [currentTask, setCurrentTask] = useState(null); // Track task being edited or created
  const [taskStatus, setTaskStatus] = useState(''); // To track which column the task is being created for


  // Fetch tasks from backend on component mount
  useEffect(() => {
    const initializeTasks = async () => {
      try {
        const response = await fetch('/api/tasks', {
          headers: setAuthHeader(),
        });
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          throw new Error('Failed to fetch tasks');
        }
      } catch (error) {
        console.error("Error fetching tasks from backend:", error);
        // Fallback to local storage if backend fetch fails
        const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        setTasks(storedTasks);
      }
    };
    initializeTasks();
  }, []);

  useEffect(() => {
    // Sync local storage whenever tasks change
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // const fetchTasksFromBackend = async () => {
  //   const response = await fetch('/api/tasks', {
  //     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  //   });
  //   if (response.ok) {
  //     const data = await response.json();
  //     setTasks(data);
  //   } else {
  //     throw new Error('Failed to fetch tasks from backend');
  //   }
  // };


  const saveTaskToBackend = async (newTask) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...setAuthHeader(),
        },
        body: JSON.stringify(newTask),
      });
      if (response.ok) {
        const savedTask = await response.json();
        setTasks((prevTasks) => [...prevTasks, savedTask]);
      } else {
        throw new Error('Failed to save task');
      }
    } catch (error) {
      console.error("Error saving task to backend:", error);
    }
  };

  const deleteTaskFromBackend = async (taskId) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...setAuthHeader(),
      },
    });
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  // Function to open the modal for task creation or editing
  const openModal = (task = null, status = '') => {
    setCurrentTask(task); // If a task is passed, we're editing. If null, we're creating.
    setTaskStatus(status); // Set the status of the task
    setShowModal(true); // Open the modal
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false); // Close the modal
    setCurrentTask(null); // Clear the current task
  };

  // Function to add or edit a task (received from the modal)
  const saveTask = (newTask) => {
    if (currentTask) {
      // Editing an existing task
      const updatedTasks = tasks.map((task) =>
        task.id === currentTask.id ? { ...task, ...newTask } : task
      );
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Update local storage
        } else {
          // Adding a new task
          const taskId = Date.now().toString();
          const newTaskWithId = { id: taskId, ...newTask, status: taskStatus };
          setTasks((prevTasks) => [...prevTasks, newTaskWithId]);
          saveTaskToBackend(newTaskWithId); // Save to backend
        }
        closeModal();
      };
    

  // Function to delete a task
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId)); // Filter out the task with the matching ID
    deleteTaskFromBackend(taskId);
  };

  // Function to toggle the collapsible checklist
  const toggleChecklist = (taskId) => {
    setTasks(
      tasks.map(task =>
        task.id === taskId ? { ...task, isChecklistOpen: !task.isChecklistOpen } : task
      )
    );
  };

  // Function to calculate the checklist progress (completed/total)
  const calculateChecklistProgress = (checklist) => {
    const completed = checklist.filter(item => item.completed).length;
    return `(${completed}/${checklist.length})`;
  };

  // Function to handle drag-and-drop functionality
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const updatedTasks = Array.from(tasks);
    const [movedTask] = updatedTasks.splice(result.source.index, 1);
    movedTask.status = result.destination.droppableId; // Update task status based on the new column
    updatedTasks.splice(result.destination.index, 0, movedTask);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Update local storage

  };

  // Function to filter tasks by status
  const renderTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div className="task-board-wrapper">
      <DragDropContext onDragEnd={handleDragEnd}>
        {/* Backlog Column */}
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

        {/* To Do Column */}
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

      {/* Modal for adding or editing a task */}
      {showModal && <TaskModal task={currentTask} closeModal={closeModal} saveTask={saveTask} />}
    </div>
  );
};

export default TaskBoard;
