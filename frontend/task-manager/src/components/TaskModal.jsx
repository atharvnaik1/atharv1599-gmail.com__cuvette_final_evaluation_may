import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TaskModal.css';
import { FaChevronDown } from 'react-icons/fa';
import { format, addDays, subDays } from "date-fns";
import { saveTask, updateTask } from '../api/taskApi';
import { MdDelete } from "react-icons/md";
import { getPeople } from '../api/PeopleApi';

const TaskModal = ({ task, closeModal, saveTask, status = 'to-do' }) => {
  const [title, setTitle] = useState(task ? task.title : '');
  const [priority, setPriority] = useState(task ? task.priority : 'Moderate');
  const [assignTo, setAssignTo] = useState(task ? task.assignTo : []);
  const [checklist, setChecklist] = useState(task && task.checklist ? task.checklist : []);
  const [dueDate, setDueDate] = useState(task ? new Date(task.dueDate) : null);
  const [emailList, setEmailList] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showChecklist, setShowChecklist] = useState(checklist.length > 0); // New state to control checklist visibility

  // Load email list from database
  useEffect(() => {
    const loadEmailList = async () => {
      try {
        const people = await getPeople();
        setEmailList(people.map((person) => person.email));
      } catch (error) {
        console.error("Error loading people:", error);
      }
    };

    loadEmailList();
  }, []);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setPriority(task.priority);
      setAssignTo(task.assignTo);
      setChecklist(task.checklist);
      setDueDate(task.dueDate ? new Date(task.dueDate) : null);
    }
  }, [task]);

  const addChecklistItem = () => {
    setShowChecklist(true); // Show checklist section when the first item is added
    setChecklist([...checklist, { text: '', completed: false }]);
  };

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
    if (assignTo.includes(email)) {
      setAssignTo(assignTo.filter((assignedEmail) => assignedEmail !== email));
    } else {
      setAssignTo([...assignTo, email]);
    }
    setDropdownOpen(true);
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

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
     // Generate and store initials in localStorage
     const initialsMap = assignTo.reduce((acc, email) => {
      const initials = email.split('@')[0].slice(0, 2).toUpperCase();
      acc[email] = initials;
      return acc;
    }, {});

    localStorage.setItem('assignedInitials', JSON.stringify(initialsMap));

    try {
      if (task && task._id) {
        await updateTask(task._id, newTask);
      } else {
        await saveTask(newTask);
      }
      closeModal();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const completedCount = checklist.filter(item => item.completed).length;
  const totalCount = checklist.length;

  const filteredEmailList = emailList.filter(email =>
    email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{task ? 'Edit Task' : 'Add New Task'}</h3>
        <div className="modal-form">
          <div className="form-group">
            <div className="title-container">
              <label className="titel">Title <span>*</span></label>
              <input
                className='title-input'
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Task Title"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="select-priority-container">
              <label className='select'>Select Priority <span>*</span></label>
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
          </div>

          <div className="form-group assign-to-group">
            <label>Assign to</label>
            <div className="assign-to-container">
              <input type="text" placeholder="Select or type to add" value={searchTerm} onClick={toggleDropdown} onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input" />
              <FaChevronDown className="dropdown-icon" onClick={toggleDropdown} />
            </div>
            {dropdownOpen && (
              <div className="dropdown-menu">
                
                {filteredEmailList.map((email, index) => {
                  const initials = email.split('@')[0].slice(0, 2).toUpperCase();
                  const isAssigned = assignTo.includes(email);
                  return (
                    <div key={index} className="dropdown-item">
                      <div className="email-circle">{initials}</div>
                      <span className="email-text">{email}</span>
                      <button 
                        className={`assign-button ${isAssigned ? 'assigned' : ''}`} 
                        onClick={() => handleAssignToChange(email)}
                      >
                        {isAssigned ? 'Assigned' : 'Assign'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

         
            <div className="form-group">
              <label>Checklist ({completedCount}/{totalCount})</label>
              {showChecklist && (  <div className="checklist-item-container">
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
                      placeholder="Add Task Here"
                      className="task-input"
                    />
                    <MdDelete 
                      className="deleteIcon"
                      size={"30px"}
                      onClick={() => removeChecklistItem(index)}
                    />
                  </div>
                ))}
              </div>
               )}
            </div>
         
          <button onClick={addChecklistItem} className="add-checklist-item"><span>{"+"}</span> Add New</button>

          <div className="modal-actions">
            <div className="duedate-btn">
              <DatePicker
                selected={dueDate}
                excludeDateIntervals={[
                  {
                    start: subDays(new Date(), 100),
                    end: subDays(new Date(), 10),
                  },
                ]}
                onChange={(date) => setDueDate(date)}
                customInput={
                  <button className="due-date-btn">
                    {dueDate ? dueDate.toLocaleDateString('en-US') : 'Select Due Date'}
                  </button>
                }
                dateFormat="MM/dd/yyyy"
              />
            </div>
            <div className="end-btn">
              <button onClick={closeModal} className="cancelbtn">Cancel</button>
              <button onClick={handleSave} className="save-btn">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
