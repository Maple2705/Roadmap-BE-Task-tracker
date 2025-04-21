const readline = require('node:readline/promises');
const { stdin: input, stdout: output } = require('node:process');
const fs = require('node:fs');

const rl = readline.createInterface({ input, output });

const filePath = 'tasks.json';
const prefixCLI = "task-cli";

function Starting() {
  console.log('\nHello!');

  if (!fs.existsSync(filePath)) {
    console.log('\nCreating store...');
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    console.log('\nCreating store completed!');
  }
}
function newDate() {
  return new Date().toUTCString();
}
function createNewTask(description) {
  if(!description){
    console.log("Description not found!");
    return;
  }

  const id = generateNewId();
  const newTask = { id, description, status: 'todo', updatedAt: newDate(), createdAt: newDate() };
  const arr = getTasks();
  arr.push(newTask);
  fs.writeFileSync(filePath, JSON.stringify(arr, null, 2));
  console.log(`Task added successfully (ID: ${id})`);
}
function getTasks() {
  const data = fs.readFileSync(filePath, 'utf8');
  const arr = JSON.parse(data);
  
  return arr || [];
}
function getLastest() {
  const arr = getTasks();
  const lastest = arr[arr.length - 1];
  return lastest;
}
function generateNewId() {
  const lastest = getLastest();
  return lastest ? lastest.id + 1 : 1;
}
function getTasksByStatus(status) {
  return getTasks()?.filter(task => task?.status === status);
}
function updateTask(id, description) {
  const arr = getTasks();
  const index = arr.findIndex(task => task.id == id);
  if (index === -1) {
    console.log("Task not found!");
    return;
  }
  if(!description){
    console.log("Description not found!");
    return;
  }

  arr[index].description = description;
  fs.writeFileSync(filePath, JSON.stringify(arr, null, 2));
  console.log(`Task updated successfully (ID: ${id})`);
}
function updateSatusById(id, status){
  const arr = getTasks();
  const index = arr.findIndex(task => task.id == id);
  if (index === -1) {
    console.log("Task not found!");
    return;
  }
  arr[index].status = status;
  fs.writeFileSync(filePath, JSON.stringify(arr, null, 2));
  console.log("Update task completed!");
}
function deleteTaskById(id) {
  const arr = getTasks();
  const index = arr.findIndex(task => task.id == id);
  if (index === -1) {
    console.log("Task not found!");
    return;
  }
  arr.splice(index, 1);
  fs.writeFileSync(filePath, JSON.stringify(arr, null, 2));
  console.log("Delete task completed!");
}

function handleInputCLI (input) {
  const words = input.split(" ");

  if(words[0] !== prefixCLI) {
    console.log('Your input:', input);
    return;
  }

  const command = words[1];
  const param = words[2];
  const description = input.match(/"(.+)"$/)?.[1];

  switch (command) {
    case 'add':
      createNewTask(description);
      break;
    case 'list':
      const data = !!param ? getTasksByStatus(param) : getTasks();
      console.log("Tasks:",data);
      break;
    case 'mark-in-progress':
      updateSatusById(param, 'in-progress');
    break;
    case 'mark-done':
      updateSatusById(param, 'done');
    break;
    case 'update':
      updateTask(param, description);
    break;
    case 'delete':
      deleteTaskById(param);
    break;
    
    default:
    console.log('Command not found');
    break;
  }
}


Starting();
rl.on('line', handleInputCLI); 