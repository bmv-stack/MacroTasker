This project implements a robust, full-stack mobile architecture using React Native for the frontend and SQLite for a persistent, local first data layer. The application is built around a reactive state management pattern, utilizing the React Context API to maintain a synchronized "Single Source Of Truth" across the UI. Unlike standartd CRUD applications, this system prioritixes data consistency andlogical validation, ensuring that all task mutations-from creation to status updates-adhere to strict schema requirements. By decoupling the database, operations from the UI components, the architecture ensures a highly maintainable and scalable codebase capable of handling complex task lifecycle.

Features of this application?

The app provides four basic features of a To-Do List:

1. Task Creation
2. Task Modification
3. Task Completion
4. Task Deletion

Flow of the application:

The app works like any other To-Do application, you create a task using the '+' button on top right corner, you save the task. The taksk will be displayed on DashBoard/MainScreen as well as on the AllTasks screen. You can update, delete or mark the task as completed from the AllTasks screen. There is also a pie-chart feature so that you can keep track of your task data.

How the application works?

- When you first launch the application, you'll land on the MainScreen (You can change your app opening screen by altering the order of screens in App.js). Initially, there will be no tasks available, you'll have to create one using the '+' button on app bar.(Top Right Corner)
- Then you will be redirected on CreateTask screen where you can create your first task and hit the submit button. Your task will be saved and will be reflected on MainScreen as well as AllTasks screen. The type of you task (Ongoing, Completed or Overdue) will be displayed on the pie chart in AllTasks screen.
- You can switch to AllTasks screen using the tab named 'All Tasks' just below the app bar. Here, you can update, delete or mark your task as completed.

What purpose does each file serve?

You'll notice a few folders and files inside the 'src' folders. Below is the description of what is the purpose of each file in the 'src' folder:

1. /src/components: This folder holds all the resuable components, i.e. the components that are required to be consistent throughout different screens, it's better to reuse them rather than writing them again and again for every screen.

i. /src/components/appBar: This file holds the code for the appbar you see in the application, it is defined once and used across different screens
ii. /src/components/formInput: These are the input fields in which you enter the data in CreateTask screen. It is just a one input filed, used multiple times is that screen.
iii. /src/components/tabPills: This file has the code for the tab pills that you see below the app bar, notice the two tabs named 'Today's Focus' and 'All Tasks'? This file has the code fr those two.

2. /src/context: This folder just have one file, taskContext but it is essentially the most important file in this project. A 'context' file usually contains global state and data for the application.

i. /src/context/taskContext: This file is the heart of the data flow, the file acts as a 'Single Source Of Truth', meaning it is the bridge between the data transmission, from database to UI and vice-versa. All the methods for saving, deleting, updating and completing the task are stored in this. The file uses useContext() hook so that the data can be provided to each and every screen in the application using a Provider.

3. /src/database: No need to say what is inside this folder.

i. src/database/db: This is the database service file for the application. In simpler terms, it uses asynchronous programming for executing the queries as well as for fetching the data from the database. The methods defined here are used in taskContext to get/post data from the database. The '?' inside the saveTask() query are known as placeholders, they provide security against SQL injection. (Imagine if someone gives task title as DROP TABLE Tasks--)

4. /src/screens: Not explaining this folder, you will get a good grasp of this when you'll go through the data flow section.

Data Flow inside the application:

1. Whenever you launch the application on your device, a table named 'Tasks' is created (if it does not already exists) with the help of createTable function in db.js file.
2. When you input all the fields in the CreateTasks screen, that data is not talking with the database, at that moment, stored in the local state, meaning that if you close the app at that moment, all the data will be lost. To save that data to the database, your handleFinalSubmit() function wraps all the data into a varaiable named taskData and that is passed as an argument to the addNewTask() function, defined in the teaskContext.js file, after this, your input data is stored inside the database.
3. After saving the task in database, that task is reflected on the MainScreen and AllTasks screen, but how exactly? Notice that you have an empty array 'tasks' in your taskContext.js which helps in this. The specific line:
   const [tasks, setTasks] = useState([]);
   This line initially sets the 'tasks' array as empty. Your addNewTask() function helps in this, after awaiting saveTasks(), the addNewTask() does this setTasks(updatedTask). The exact block of code that does this in taskContext is:
   const addNewTask = async task => {
   const colors = [
   '#C1E1C1',
   '#FDFD96',
   '#9192F3',
   '#AEC6CF',
   '#F9BBB7',
   '#DE97F7',
   '#8CF7D7',
   '#7DECFF',
   '#F3E65E',
   '#ffae62'
   ];
   const taskWithColor = {
   ...task,
   color: task.color || colors[Math.floor(Math.random() * colors.length)],
   };
   const db = await getDBConnection();
   await saveTask(db, taskWithColor);
   const updatedTask = await getTask(db);
   setTasks(updatedTask);
   };
   Now, as we are using useTasks hook (our own hook) in both the screens, MainScreen as well as the AllTasks screen, these both are essentially 'subscribers' to the 'tasks' array in taskContext.js, they will listen to and reflect any change that takes place in 'tasks' array.

Navigation Between Screens:
The navigation between screens happens using the navigationStack library of react-native. You can see the exact name of libraries in tsconfig.json file. What these libraries does is that they provide native navigation, i.e. the switching between screens will feel exactly like the respective platform, i.e. iOS or Android.
