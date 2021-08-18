let tc = document.querySelector(".ticket-container");
let allFilter = document.querySelectorAll(".filter");
let deleteButton = document.querySelector(".delete");

let modalVisible = false;
let selectedPriority = "pink";
let selectedColor = undefined;

function loadTickets(priority) {
    let allTaskData = localStorage.getItem("allTask");
   if (allTaskData != null) {
        let data = JSON.parse(allTaskData);
        if (priority) {
            data = data.filter(function (ticket) {
                return ticket.selectedPriority == priority;
            })
        }
        tc.innerHTML = "";

        for (let i = 0; i < data.length; i++) {


            let ticket = document.createElement("div");
            ticket.classList.add("ticket");
            ticket.innerHTML = ` <div class="ticket ">
                             <div class="ticket-color ticket-color-${data[i].selectedPriority}"></div>
                             <div class="ticket-id">${data[i].taskId}</div>
                             <div class="task">
                             ${data[i].task}
                              </div>
                           <div>`;
            ticket.addEventListener("click", function (e) {
                if (e.currentTarget.classList.contains("active")) {
                    e.currentTarget.classList.remove("active");
                } else {
                    e.currentTarget.classList.add("active");
                }
            });
            tc.appendChild(ticket);
        }
    }
}
loadTickets();


for (let i = 0; i < allFilter.length; i++) {
    allFilter[i].addEventListener("click", filterHandler);
}

function filterHandler(e) {
    if (e.currentTarget.classList.contains("active")) {
        e.currentTarget.classList.remove("active");
        loadTickets();
    } else {
        let selectedFilter = document.querySelector(".filter.active");
        if (selectedFilter) {
            selectedFilter.classList.remove("active");
        }
        e.currentTarget.classList.add("active");
        loadTickets(e.currentTarget.children[0].classList[0].split("-")[0]);
    }

}

let addButton = document.querySelector(".add");

addButton.addEventListener("click", showModal);

function showModal(e) {
    if (!modalVisible) {
        let modal = document.createElement("div");
        modal.classList.add("modal");
        modal.innerHTML = `<div class="task-to-be-added" data-type="false" contenteditable="true">
                                     <span class="placeholder">Enter your text here</span>
                                </div>
                                 <div class="priority-list">
                                    <div class="pink-modal-filter modal-filter active"></div>
                                    <div class="blue-modal-filter modal-filter"></div>
                                    <div class="black-modal-filter modal-filter"></div>
                                    <div class="green-modal-filter modal-filter"></div>
                                </div>
                            </div>`;
        tc.appendChild(modal);
        let taskTyper = document.querySelector(".task-to-be-added");
        taskTyper.addEventListener("click", function (e) {
            if (e.currentTarget.getAttribute("data-type") == "false") {
                e.currentTarget.innerHTML = "";
                e.currentTarget.setAttribute("data-type", "true");
            }

        });
        taskTyper.addEventListener("keypress", addTicket.bind(this, taskTyper));
        modalVisible = true;
        let modalFilter = document.querySelectorAll(".modal-filter");

        for (let i = 0; i < modalFilter.length; i++) {
            modalFilter[i].addEventListener("click", selectPriority);
        }
    }

}
function selectPriority(e) {
    let activeFilter = document.querySelector(".modal-filter.active");
    activeFilter.classList.remove("active");
    selectedPriority = e.currentTarget.classList[0].split("-")[0];
    // console.log(selectedPriority);
    e.currentTarget.classList.add("active");
}

function addTicket(taskTyper, e) {
    if (e.key == "Enter" && e.shiftKey == false && taskTyper.innerText.trim() != "") {
        let id = uid();
        let task = taskTyper.innerText;
        
        document.querySelector(".modal").remove();
        modalVisible = false;
       
        let allTaskData = localStorage.getItem("allTask");
        if (allTaskData == null) {
            data = [{ "taskId": id, "task": task, "selectedPriority": selectedPriority }];
            localStorage.setItem("allTask", JSON.stringify(data));
        } else {
            let data = JSON.parse(allTaskData)
            data.push({ "taskId": id, "task": task, "selectedPriority": selectedPriority });
            localStorage.setItem("allTask", JSON.stringify(data));
        }
        let selectedFilter = document.querySelector(".filter.active");
        if(selectedFilter){
        let priority = selectedFilter.children[0].classList[0].split("-")[0];
        loadTickets(priority);
        }else{
            loadTickets();
        }
    } else if (e.key == "Enter" && e.shiftKey == false) {
        e.preventDefault();
        alert("You have not typed anything");
    }
}

deleteButton.addEventListener("click", function (e) {
    let selectedTicket = document.querySelectorAll(".ticket.active");
    let allTask = JSON.parse(localStorage.getItem("allTask"));
    for (let i = 0; i < selectedTicket.length; i++) {
        selectedTicket[i].remove();
        allTask = allTask.filter(function (data) {
            return data.taskId != selectedTicket[i].querySelector(".ticket-id").innerHTML;
        })
    }

    localStorage.setItem("allTask", JSON.stringify(allTask));

})
