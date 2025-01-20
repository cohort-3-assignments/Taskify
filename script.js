import tempTaskData from "./data.js";

// Allow dropping items
function allowDrop(ev) {
    ev.preventDefault();
}

// Handle dragging items
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

// Handle dropping items
function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);

    let dropTarget = ev.target;

    // Find the closest valid card container
    while (dropTarget && !dropTarget.classList.contains("card")) {
        dropTarget = dropTarget.parentElement;
    }

    if (dropTarget && dropTarget.classList.contains("card")) {
        dropTarget.appendChild(draggedElement);
    } else {
        alert("Invalid drop target");
    }

    // Remove highlight after dropping
    if (dropTarget) {
        dropTarget.classList.remove("highlight-border");
    }
}

// Function to create the task card
function createTask(id, title, description, tag, date) {
    const taskCard = document.createElement("div");
    taskCard.id = id;
    taskCard.className = "task-card";
    taskCard.draggable = true;

    taskCard.innerHTML = `
        <div class="card-title">${title}</div>
        <div class="card-description">${description}</div>
        <div class="card-details">
            <div class="card-tag" style="background-color:${tagColors[tag]}">${tag}</div>
            <div class="card-date">${formatDate(date)}</div>
        </div>
    `;

    return taskCard;
}

function formatDate(inputDate) {
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const [year, month, day] = inputDate.split("-");
    return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;
}

const tagColors = {
    UI_UX: "#FF5733",
    Backend: "#3498DB",
    API: "#9B59B6",
    Content: "#F1C40F",
    Testing: "#1ABC9C",
    DevOps: "#E67E22",
    Documentation: "#2ECC71"
};


function clearForm() {
    document.querySelector("#title").value = "";
    document.querySelector("#description").value = "";
    document.querySelector("#tag").value = "";
    document.querySelector("#date").value = "";
    document.querySelector("#task-type").innerText = "";
}


document.addEventListener("DOMContentLoaded", function () {
    const cardContainers = document.querySelectorAll(".card");

    // Attach event listeners to card containers
    cardContainers.forEach((card) => {
        card.addEventListener("dragover", (ev) => {
            allowDrop(ev);
            card.classList.add("highlight-border");
        });

        card.addEventListener("dragleave", () => {
            card.classList.remove("highlight-border");
        });

        card.addEventListener("drop", (ev) => {
            drop(ev);
            card.classList.remove("highlight-border");
        });
    });

    // Populate tasks
    tempTaskData.forEach((task) => {
        const taskCard = createTask(task.id, task.title, task.description, task.tag, task.date);
        const cardContainer = document.getElementById(task.state);

        if (cardContainer) {
            cardContainer.appendChild(taskCard);
        }

        // Attach dragstart event to task card
        taskCard.addEventListener("dragstart", drag);
    });

    // Add event listener to open dialog button
    document.querySelectorAll(".addTask").forEach((button) => {
        button.addEventListener("click", () => {
            const parent = button.parentElement;
            document.querySelector("#task-type").textContent = parent.id;

            document.querySelector(".dialog").style.display = "block";
        });
    })

    document.querySelector('.close-button').addEventListener('click', () => {
        document.querySelector('.dialog').style.display = 'none';
    })

    document.querySelector('#newTask').addEventListener("click", (e) => {

        e.preventDefault();
        const title = document.querySelector('#title').value;
        const description = document.querySelector('#description').value;
        const tag = document.querySelector('#tag').value;
        const date = document.querySelector('#date').value;
        const state = document.querySelector("#task-type").innerText.toLowerCase();

        const newTask = {
            id: tempTaskData.length + 1,
            title,
            description,
            tag,
            date,
            state
        }

        tempTaskData.push(newTask);

        // console.log(newTask);

        clearForm();



        const taskCard = createTask(newTask.id, newTask.title, newTask.description, newTask.tag, newTask.date);
        const cardContainer = document.getElementById(newTask.state);

        if (cardContainer) {
            cardContainer.appendChild(taskCard);
        }

        taskCard.addEventListener("dragstart", drag);

        document.querySelector('.dialog').style.display = 'none';
    
    })
            

});


