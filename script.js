let tasks = []
let numsAdded = []
let incr = 0
let tasksArr = []

document.addEventListener('DOMContentLoaded', (ev) => {
if (JSON.parse(localStorage.getItem('tasks')).length > 0) {
    tasks = JSON.parse(localStorage.getItem('tasks'))
    tasks.forEach(el => {
        numsAdded.push(el.id)
    })
    incr = Math.min(...numsAdded)
    for (let i = 0; i < tasks.length; i++) {
        
        if (!tasks[i].done === true) {
            incr = tasks[i].id
            new Task(tasks[i].taskValue)
        } else {
            incr = tasks[i].id
            new Task(tasks[i].taskValue, true)
        }
    }   
} else {return}
})

class Task {

    constructor (taskValue, done) {
        this.id = incr
        this.taskValue = taskValue
        this.done = done
        this.createTask()
    }

createTask() {
    if (this.done === undefined) {this.done = false}
    if (this.done === false) {
    document.getElementById('tasksAllArticle').insertAdjacentHTML('beforeend', `
    <article class="task" id="${incr}">
    <p class="textTask">${this.taskValue}</p>
    <section class="deleteAndDone">
    <img id="done_${incr}" src="assets/done.png">
    <img id="delete_${incr}" src="assets/delete.png">
    </section>
    </article>`)} else {
    document.getElementById('tasksDoneArticle').insertAdjacentHTML('beforeend', `
    <article class="task" id="${incr}" done="">
    <p class="textTask">${this.taskValue}</p>
    <section class="deleteAndDone">
    <img id="done_${incr}" src="assets/done.png">
    <img id="delete_${incr}" src="assets/delete.png">
    </section>
    </article>`)
    }
    
    document.getElementById(`done_${incr}`).addEventListener('click', (ev) => {
        let currentTask = ev.srcElement.parentElement.parentElement
        document.getElementById(currentTask.id).toggleAttribute('done')
        document.getElementById('tasksDoneArticle').insertAdjacentElement('beforeend', currentTask)
        tasksArr.forEach(el => {
            if (el.id == currentTask.id) {
                el.done = true
            }
        })
        localStorage.setItem('tasks', JSON.stringify(tasksArr))
    })
    document.getElementById(`delete_${incr}`).addEventListener('click', (ev) => {
        let currentTask = ev.srcElement.parentElement.parentElement
        let result = tasksArr.filter(item => item.id != currentTask.id)
        tasksArr = result
        localStorage.setItem('tasks', JSON.stringify(tasksArr))
        currentTask.remove()
    })

    tasksArr.push({id: this.id, taskValue: this.taskValue, done: this.done})
    localStorage.setItem('tasks', JSON.stringify(tasksArr))

    incr++
}
}


class AllTasks {
    constructor () {
        this.done = [...document.getElementById('tasksDoneArticle').childNodes].filter(el => el.nodeName == 'ARTICLE')
        this.noDone = [...document.getElementById('tasksAllArticle').childNodes].filter(el => el.nodeName == 'ARTICLE')
        this.all = this.done.concat(noDone)
    }
}

class LocalStorage {
constructor () {
    this.tasksDone = [...document.getElementById('tasksDoneArticle').childNodes]
    this.tasksNoDone = [...document.getElementById('tasksAllArticle').childNodes]
    this.localArray = JSON.parse(localStorage.getItem('tasks'))
}

deleteAll () {
    for (let i = 0; i<this.tasksDone.length; i++) {
        this.tasksDone[i].remove()
    }
    for (let i = 0; i<this.tasksNoDone.length; i++) {
        this.tasksNoDone[i].remove()
    }
    localStorage.removeItem('tasks')
}

deleteNoDone () {
    this.localArray.forEach(el => {
        if (el.done === false) {
            document.getElementById(`${el.id}`).remove()
        }
        let result = this.localArray.filter(item => item.done != false)
        localStorage.setItem('tasks', JSON.stringify(result))
    })
}

deleteDone() {
    this.localArray.forEach(el => {
        if (el.done === true) {
            document.getElementById(`${el.id}`).remove()
        }
        let result = this.localArray.filter(item => item.done != true)
        localStorage.setItem('tasks', JSON.stringify(result))
    })
}
}

document.getElementById('settings').addEventListener('click', (ev) => {
    if (document.getElementById('accordeonSec').style.display == 'flex') {
        document.getElementById('accordeonSec').style.display = 'none'
    } else {document.getElementById('accordeonSec').style.display = 'flex'}
})

document.getElementById('deleteAll').addEventListener('click', (ev) => { 
    let del = new LocalStorage()
    del.deleteAll()
})

document.getElementById('deleteOneSec').addEventListener('click', (ev) => {
    let del = new LocalStorage()
    del.deleteNoDone()
})

document.getElementById('deleteTwoSec').addEventListener('click', (ev) => {
    let del = new LocalStorage()
    del.deleteDone()
})

document.getElementById('addBtn').addEventListener('click', (ev) => {
    if (numsAdded.includes(incr)) {incr = (Math.max(...numsAdded)+1)}
    new Task(document.getElementById('textCon').value)
})
