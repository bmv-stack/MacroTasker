import sqlite from 'react-native-sqlite-storage';

sqlite.enablePromise(true);

const dbName = 'TodoApp.db';

export const getDBConnection = async () => {
  return sqlite.openDatabase({
    name: dbName,
    location: 'default',
  });
};
export const createTable = async db => {
  const query = `CREATE TABLE IF NOT EXISTS Tasks(
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    endDate TEXT,
    endTime TEXT,
    priority TEXT,
    notes TEXT,
    color TEXT,
    completed INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );`;
  await db.executeSql(query);

  try {
    await db.executeSql(
      'ALTER TABLE Tasks ADD COLUMN createdAt DATETIME DEFAULT CURRENT_TIMESTAMP;',
    );
    console.log('Added createdAt column');
  } catch (e) {
    console.log('Column already exists or setup complete');
  }
};

export const saveTask = async (db, task) => {
  const checkQuery = `SELECT id FROM Tasks WHERE id = ?`;
  const [results] = await db.executeSql(checkQuery, [task.id]);

  if (results.rows.length > 0) {
    const updateQuery = `UPDATE Tasks SET title = ?, date = ?, time = ?, endDate = ?, endTime = ?, priority = ?, notes = ?, color = ?, completed = ? WHERE id = ?`;
    const values = [
      task.title,
      task.date,
      task.time,
      task.endDate || null,
      task.endTime || null,
      task.priority,
      task.notes || '',
      task.color,
      task.completed ? 1 : 0,
      task.id,
    ];
    return db.executeSql(updateQuery, values);
  } else {
    const insertQuery = `INSERT INTO Tasks (id, title, date, time, endDate, endTime, priority, notes, color, completed)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    const values = [
      task.id,
      task.title,
      task.date,
      task.time,
      task.endDate || null,
      task.endTime || null,
      task.priority,
      task.notes || '',
      task.color,
      task.completed ? 1 : 0,
    ];

    return db.executeSql(insertQuery, values);
  }
};

export const getTask = async db => {
  try {
    const tasks = [];
    const [results] = await db.executeSql(
      'SELECT * FROM Tasks ORDER BY completed ASC, createdAt DESC',
    );

    for (let index = 0; index < results.rows.length; index++) {
      const item = results.rows.item(index);
      tasks.push({
        ...item,
        notes: item.notes,
        completed: item.completed === 1 ? true : false,
      });
    }
    return tasks;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get tasks');
  }
};

export const deleteTask = async (db, id) => {
  const deleteQuery = `DELETE from Tasks WHERE id = ?`;
  await db.executeSql(deleteQuery, [id]);
};

export const updateTaskStatus = async (db, id, completed) => {
  const query = `UPDATE Tasks SET completed = ?  WHERE id = ?`;
  await db.executeSql(query, [completed, id]);
};
