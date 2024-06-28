import React, { useState, useEffect } from 'react';
import { createTask, getTasks, updateTask, deleteTask } from './services/api';

function App() {
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskPriority, setTaskPriority] = useState('Baixa');
    const [tasks, setTasks] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [taskIdToEdit, setTaskIdToEdit] = useState(null);

    const fetchTasks = async () => {
        try {
            const fetchedTasks = await getTasks();
            setTasks(fetchedTasks);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleCreateTask = async () => {
        if (editMode) {
            handleUpdateTask();
        } else {
            try {
                await createTask({ name: taskName, description: taskDescription, priority: taskPriority });
                setTaskName('');
                setTaskDescription('');
                setTaskPriority('Baixa');
                setSuccessMessage('Tarefa criada com sucesso');
                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);
                fetchTasks();
            } catch (error) {
                console.error('Failed to create task:', error);
            }
        }
    };

    const handleUpdateTask = async () => {
        try {
            await updateTask(taskIdToEdit, { name: taskName, description: taskDescription, priority: taskPriority });
            setTaskName('');
            setTaskDescription('');
            setTaskPriority('Baixa');
            setEditMode(false);
            setTaskIdToEdit(null);
            setSuccessMessage('Tarefa atualizada com sucesso');
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            fetchTasks();
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    const handleEditTask = (task) => {
        setTaskName(task.name);
        setTaskDescription(task.description);
        setTaskPriority(task.priority);
        setEditMode(true);
        setTaskIdToEdit(task.id);
    };

    const handleDeleteTask = async (id) => {
        try {
            await deleteTask(id);
            setSuccessMessage('Tarefa excluída com sucesso');
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            fetchTasks();
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h2 style={styles.title}>{editMode ? 'Editar Tarefa' : 'Criar Tarefa'}</h2>
                <input
                    type="text"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="Nome da tarefa"
                    style={styles.input}
                />
                <textarea
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Descrição da tarefa"
                    rows={4}
                    style={styles.textarea}
                />
                <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    style={styles.select}
                >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                </select>
                <button onClick={handleCreateTask} style={styles.button}>
                    {editMode ? 'Atualizar Tarefa' : 'Criar Tarefa'}
                </button>
                {successMessage && (
                    <p style={styles.successMessage}>{successMessage}</p>
                )}
                <ul style={styles.taskList}>
                    {tasks.map(task => (
                        <li key={task.id} style={styles.taskItem}>
                            <div>
                                <strong>{task.name}</strong>: {task.description} ({task.priority})
                            </div>
                            <div>
                                <button onClick={() => handleEditTask(task)} style={styles.editButton}>
                                    ✏️
                                </button>
                                <button onClick={() => handleDeleteTask(task.id)} style={styles.deleteButton}>
                                    ❌
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0',
        color: '#333',
        padding: '20px',
    },
    formContainer: {
        width: '100%',
        maxWidth: '500px',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
        backgroundColor: '#fff',
    },
    title: {
        textAlign: 'center',
        marginBottom: '25px',
        color: '#007bff',
        fontSize: '24px',
    },
    input: {
        width: '100%',
        marginBottom: '15px',
        padding: '12px',
        borderRadius: '10px',
        border: '1px solid #ccc',
        backgroundColor: '#f9f9f9',
        color: '#333',
        fontSize: '16px',
    },
    textarea: {
        width: '100%',
        marginBottom: '15px',
        padding: '12px',
        borderRadius: '10px',
        border: '1px solid #ccc',
        backgroundColor: '#f9f9f9',
        color: '#333',
        fontSize: '16px',
    },
    select: {
        width: '100%',
        marginBottom: '15px',
        padding: '12px',
        borderRadius: '10px',
        border: '1px solid #ccc',
        backgroundColor: '#f9f9f9',
        color: '#333',
        fontSize: '16px',
    },
    button: {
        width: '100%',
        padding: '12px',
        borderRadius: '10px',
        border: 'none',
        backgroundColor: '#007bff',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
    },
    successMessage: {
        color: 'green',
        marginTop: '15px',
        textAlign: 'center',
        fontSize: '16px',
    },
    taskList: {
        marginTop: '30px',
        padding: '0',
        listStyleType: 'none',
    },
    taskItem: {
        marginBottom: '15px',
        padding: '15px',
        backgroundColor: '#f0f0f0',
        borderRadius: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid #ddd',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    editButton: {
        marginRight: '10px',
        padding: '8px',
        backgroundColor: '#ffc107',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    deleteButton: {
        padding: '8px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
    },
};

export default App;
