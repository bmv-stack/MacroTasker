import sqlite from "react-native-sqlite-storage";

sqlite.enablePromise(true);

const dbName = "TodoApp.db";

export const getDBConnection = async () => {
    return sqlite.openDatabase(
        {
            name: dbName,
            location: 'default'
        }
    )
};

export const createTable = async (db) => {
    const query = `CREATE TABLE IF NOT EXISTS Tasks(
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    end_date TEXT,
    end_time TEXT,
    priority TEXT,
    notes TEXT,
    color TEXT,
    completed INTEGER DEFAULT 0
    );`;
    await db.executeSql(query);
};

export const saveTask = async (db, task) => {
    const insertQuery = `INSERT OR REPLACE INTO Tasks (id, title, date, time, end_date, end_time, priority, notes, color, completed)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
    const values = [task.id, task.title, task.date, task.time, task.end_date || null, task.end_time || null, task.priority, task.notes || '', task.color, task.completed ? 1 : 0];

    return db.executeSql(insertQuery, values);
}

export const getTask = async (db) => {
    try {
        const tasks = [];
        const [results] = await db.executeSql("SELECT * FROM Tasks ORDER BY completed ASC");

        for (let index = 0; index < results.rows.length; index++) {
            const item = results.rows.item(index);
            tasks.push({
                ...item,
                completed: item.completed === 1
            });
        };
        return tasks;
    } catch (error) {
        console.error(error);
        throw Error('Failed to get tasks');
    };
};

export const deleteTask = async (db, id) => {
    const deleteQuery = `DELETE from Tasks WHERE id = ?`;
    await db.executeSql(deleteQuery, [id]);
};

export const updateTaskStatus = async (db, id, completed) => {
    const query = `UPDATE Tasks SET completed = ?  WHERE id = ?`;
    await db.executeSql(query, [completed, id]);
}