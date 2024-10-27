import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TaskModal.css';
import { FaChevronDown } from 'react-icons/fa';
import { saveTask, updateTask } from '../api/taskApi';

const TaskModal = ({ task, closeModal,saveTask ,status = 'to-do' }) => {
  const [title, setTitle] = useState(task ? task.title : '');
  const [priority, setPriority] = useState(task ? task.priority : 'Moderate');
  const [assignTo, setAssignTo] = useState(task ? task.assignTo : []);
  const [checklist, setChecklist] = useState(task ? task.checklist : [{ text: '', completed: false }]);
  const [dueDate, setDueDate] = useState(task ? new Date(task.dueDate) : null);
  const [emailList, setEmailList] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Load email list from localStorage initially
  useEffect(() => {
    const loadEmailList = () => {
      const storedEmails = JSON.parse(localStorage.getItem('savedEmails')) || [];
      setEmailList(storedEmails);
    };

    loadEmailList();

    const handleStorageChange = (e) => {
      if (e.key === 'savedEmails') loadEmailList();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Set initial values when editing an existing task
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setPriority(task.priority);
      setAssignTo(task.assignTo);
      setChecklist(task.checklist);
      setDueDate(task.dueDate ? new Date(task.dueDate) : null);
    }
  }, [task]);

  const addChecklistItem = () => setChecklist([...checklist, { text: '', completed: false }]);

  const handleChecklistChange = (index, newValue, isCompleted = null) => {
    setChecklist((prev) => {
      const updatedChecklist = [...prev];
      if (isCompleted !== null) {
        updatedChecklist[index].completed = isCompleted;
      } else {
        updatedChecklist[index].text = newValue;
      }
      return updatedChecklist;
    });
  };

  const removeChecklistItem = (index) => setChecklist(checklist.filter((_, idx) => idx !== index));

  const handleAssignToChange = (email) => {
    if (!assignTo.includes(email)) {
      setAssignTo([...assignTo, email]);
    }
    setDropdownOpen(false);
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const removeAssignedEmail = (email) => setAssignTo(assignTo.filter((assignedEmail) => assignedEmail !== email));

  const handleSave = async () => {
    if (!title.trim()) return;

    const newTask = {
      title,
      priority,
      assignTo,
      checklist,
      dueDate: dueDate ? dueDate.toISOString() : null,
      status: task ? task.status : status,
    };

    try {
      if (task && task._id) {
        await updateTask(task._id, newTask);
      } else {
        await saveTask(newTask);
      }
      
      
        // await refreshTasks(); // Refresh tasks on the board
    
      closeModal();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{task ? 'Edit Task' : 'Add New Task'}</h3>
        <div className="modal-form">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Task Title"
              required
            />
          </div>

          <div className="form-group">
            <label>Select Priority *</label>
            <div className="priority-options">
              <button className={`priority-btn ${priority === 'High' ? 'selected' : ''}`} onClick={() => setPriority('High')}>
                <span className="priority-dot red"></span> High Priority
              </button>
              <button className={`priority-btn ${priority === 'Moderate' ? 'selected' : ''}`} onClick={() => setPriority('Moderate')}>
                <span className="priority-dot blue"></span> Moderate Priority
              </button>
              <button className={`priority-btn ${priority === 'Low' ? 'selected' : ''}`} onClick={() => setPriority('Low')}>
                <span className="priority-dot green"></span> Low Priority
              </button>
            </div>
          </div>

          <div className="form-group assign-to-group">
            <label>Assign to</label>
            <div className="assign-to-container">
              {assignTo.map((email, index) => (
                <span key={index} className="assigned-email">
                  {email}
                  <button onClick={() => removeAssignedEmail(email)} className="remove-email-btn">x</button>
                </span>
              ))}
              <input type="text" placeholder="Select or type to add" readOnly onClick={toggleDropdown} />
              <FaChevronDown className="dropdown-icon" onClick={toggleDropdown} />
            </div>
            {dropdownOpen && (
              <div className="dropdown-menu">
                {emailList.map((email, index) => (
                  <div key={index} className="dropdown-item" onClick={() => handleAssignToChange(email)}>
                    {email}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Checklist *</label>
            {checklist.map((item, index) => (
              <div key={index} className="checklist-item">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={(e) => handleChecklistChange(index, item.text, e.target.checked)}
                />
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => handleChecklistChange(index, e.target.value)}
                  placeholder="Task to be done"
                  className="task-input"
                />
                <button onClick={() => removeChecklistItem(index)}>Delete</button>
              </div>
            ))}
            <button onClick={addChecklistItem} className="add-checklist-item">+ Add New</button>
          </div>

          <div className="modal-actions">
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              customInput={
                <button className="due-date-btn">
                  {dueDate ? dueDate.toLocaleDateString('en-US') : 'Select Due Date'}
                </button>
              }
              dateFormat="MM/dd/yyyy"
            />
            <button onClick={closeModal} className="cancel-btn">Cancel</button>
            <button onClick={handleSave} className="save-btn">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
