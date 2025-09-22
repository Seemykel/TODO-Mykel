
import './todo.css';
import { PropagateLoader } from "react-spinners";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useState, useEffect } from 'react';

const TodoApp = () => {
    const [task, setTask] = useState([]);
    const [deletedTasks, setDeletedTasks] = useState([]);
    const [singleTask, setSingleTask] = useState('');
    const [load, setLoad] = useState(true);
    const [showModal, setShowModal] = useState({
        show: false,
        type: 'add',
        content: 'A note has been Added'
    });
    const [showTextArea, setShowTextArea] = useState(false);

    //  Safe parse with fallback
    const getStoredTasks = () => {
        try {
            const saved = localStorage.getItem('task');
            return saved ? JSON.parse(saved) : [];
        } catch (err) {
            return [];
        }
    };

    useEffect(() => {
        setTask(getStoredTasks());
    }, []);

    useEffect(() => {
        localStorage.setItem('task', JSON.stringify(task));
    }, [task]);

    useEffect(() => {
        setTimeout(() => {
            setLoad(false);
        }, 3000);
    }, []);

    useEffect(() => {
        if (showModal.show) {
            const timer = setTimeout(() => {
                setShowModal((prev) => ({ ...prev, show: false }));
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [showModal]);

    const handleTaskSubmit = (e) => {
        e.preventDefault();
        if (singleTask === '') return;

        const newTask = {
            id: Date.now(),
            task: singleTask,
            completed: false
        };

        setTask([...task, newTask]);
        setSingleTask('');
        setShowTextArea(false);
        setShowModal({
            show: true,
            type: 'add',
            content: 'A note has just been Added'
        });
    };

    const handleCompleted = (id) => {
        const updatedTask = task.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
        );
        setTask(updatedTask);
    };

    const handleDelete = (id) => {
        const taskToDelete = task.find((t) => t.id === id);
        if (taskToDelete) {
            setDeletedTasks([...deletedTasks, taskToDelete]);
        }
        const filteredTasks = task.filter((t) => t.id !== id);
        setTask(filteredTasks);
        setShowModal({
            show: true,
            type: 'delete',
            content: 'Note has been deleted!'
        });
    };

    const handleEdit = (id) => {
        const editItem = task.find((t) => t.id === id);
        if (!editItem) return;
        setSingleTask(editItem.task);
        setShowTextArea(true);
        handleDelete(id); 
    };

    if (load) {
        return (
            <main className="loading-page">
                <PropagateLoader color="orangered" size={35} />
            </main>
        );
    }

    return (
        <section className="todoapp">
            <div className="overlay">
                <div className="todo-list">
                    <p className={`modal ${showModal.show ? 'show' : ''}`}>
                        {showModal.content}
                    </p>
                    <h1>Note App</h1>
                    {showTextArea ? (
                        <form onSubmit={handleTaskSubmit} className="list">
                            <input
                                type="text"
                                value={singleTask}
                                onChange={(e) => setSingleTask(e.target.value)}
                                placeholder="Input Your Task Here"
                            />
                            <input type="submit" value="Add" />
                        </form>
                    ) : (
                        <div className="add-btn">
                            <button
                                onClick={() => setShowTextArea(true)}
                                className="add"
                            >
                                <FaPlus />
                            </button>
                        </div>
                    )}
                </div>
                <div className="task">
                    <div className="list-task">
                        <ul>
                            {task.map((task) => (
                                <li key={task.id}>
                                    <span className="span">{task.task}</span>
                                    <div className="icons">
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={() =>
                                                handleCompleted(task.id)
                                            }
                                        />
                                        <span>
                                            <button
                                                onClick={() =>
                                                    handleEdit(task.id)
                                                }
                                            >
                                                <FaEdit />
                                            </button>
                                        </span>
                                        <span>
                                            <button
                                                onClick={() =>
                                                    handleDelete(task.id)
                                                }
                                            >
                                                <FaTrash />
                                            </button>
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="completed">
                        <h2>Completed Task</h2>
                        <ul>
                            {task
                                .filter((task) => task.completed === true)
                                .map((task) => (
                                    <li key={task.id}>
                                        <span>{task.task}</span>
                                        <span>
                                            <button
                                                onClick={() =>
                                                    handleDelete(task.id)
                                                }
                                            >
                                                <FaTrash />
                                            </button>
                                        </span>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TodoApp;
