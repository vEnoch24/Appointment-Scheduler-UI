const sideMenu = document.querySelector("aside");
const menuBtn = document.getElementById("menu-btn");
const closeBtn = document.getElementById("close-btn");
const scheduleBtn = document.querySelector(".schedule");
const saveBtn = document.getElementById("save");
const scheduleBtnUI = document.getElementById("submit");

const darkMode = document.querySelector(".dark-mode");

menuBtn.addEventListener("click", () => {
  sideMenu.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  sideMenu.style.display = "none";
});

darkMode.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode-variables");
  darkMode.querySelector("span:nth-child(1)").classList.toggle("active");
  darkMode.querySelector("span:nth-child(2)").classList.toggle("active");
});


const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

ScrollReveal().reveal(".appointments", {
  ...scrollRevealOption,
});

//TUTORIAL
// let currentStep = 1;

// function showStep(stepNumber) {
//     document.getElementById(`step${stepNumber}`).style.display = 'block';
// }

// function hideStep(stepNumber) {
//     document.getElementById(`step${stepNumber}`).style.display = 'none';
// }

// function nextStep() {
//     hideStep(currentStep);
//     currentStep++;
    
//     if (currentStep <= 3) {
//         showStep(currentStep);
//     } else {
//         finishTutorial();
//     }
// }

// nextStep();

// function finishTutorial() {
//     hideStep(currentStep);
//     alert('Congratulations! You have completed the tutorial. Enjoy using our website!');
//     // Additional logic to mark the tutorial as completed in your system.
// }





//BACKEND FETCHES
const appointmentContainer = document.querySelector(".appointments");
const logout = document.querySelector(".logout");
const profile = document.querySelector(".profile");
const editBtn =  document.querySelector(".edit-btn");
const scheduleTitle = document.querySelector(".scheduleTitle");
const rescheduleTitle = document.querySelector(".rescheduleTitle");

let appointmentTitleInput = document.querySelector("#title");
let startTimeInput = document.querySelector("#start-time");
let endTimeInput = document.querySelector("#end-time");
let attendeesInput = document.querySelector("#attendee");
let locationInput = document.querySelector("#location");

const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get("email");
const id = urlParams.get("id");
const username = urlParams.get("username");

const userKey = `user_${email}`;
const userData = localStorage.getItem(userKey);
const token = JSON.parse(userData);

const idKey = `user_${id}`;
const Id = localStorage.getItem(idKey);
const appointmentUserID = JSON.parse(Id);

logout.addEventListener("click", () => {
  localStorage.removeItem(userKey);
});

function resetInput() {
  appointmentTitleInput.value = "";
  startTimeInput.value = "";
  endTimeInput.value = "";
  attendeesInput.value = "";
  locationInput.value = "";
}

document.addEventListener('DOMContentLoaded', function () {
  
  const now = new Date();
  const currentHour = now.getHours();

  let greeting = "";

  if(currentHour >= 5 && currentHour < 12)
  {
    greeting = "Good Morning";
  }else if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good afternoon";
  }else {
    greeting = "Good Evening";
  }

  if (token) {
      // JWT exists, user is authenticated
      // console.log('User is authenticated with a valid JWT.');
      
      const profileElement = `<div class="info">
                                  <p>${greeting}, <b>${username}</b></p>
                              </div>`
      profile.innerHTML = profileElement; 
  } else {
      // JWT does not exist, redirect the user to the login page
      // console.log('User is not authenticated. Redirecting to the login page.');
      window.location.href = '/login2.html';
  }
});

async function schedule(
  appointmentTitle,
  startTime,
  endTime,
  attendees,
  location,
  appointmentUserId
) {
  const body = {
    startTime: startTime,
    endTime: endTime,
    appointmentTitle: appointmentTitle,
    numberOfAttedees: attendees,
    location: location,
    appointmentUserId: appointmentUserId
  };

  try {
    const response = await fetch(
      "https://localhost:44318/api/Appointment/CreateAppointment",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (response.ok) {
      getAllAppointments();
      resetInput();
    }
  } catch (error) {
    alert(error);
    console.error(error);
  }
}

async function deleteAppointment(id) {
  try{
    const response = await fetch(`https://localhost:44318/api/Appointment/DeleteAppointment?id=${id}`,
    {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if(response.ok) {
      getAllAppointments();
    }  else {
      console.error("Failed to delete the element");
      alert("Failed to delete the element");
    }

  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function getAnAppointment(id) {
  try{
    const response = await fetch(`https://localhost:44318/api/Appointment/GetAnAppointment?id=${id}`,
    {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    const responseData = await response.json();
    displayInForm(responseData);  
  } catch (error) {
    console.error(error);
  }
}

async function editAppointment(id, appointmentTitle, startTime, endTime, attendees, location) {
  const body = {
    startTime: startTime,
    endTime: endTime,
    appointmentTitle: appointmentTitle,
    numberOfAttendees: attendees,
    location: location,
  }

  try{
    const response = await fetch(`https://localhost:44318/api/Appointment/EditAppointment?id=${id}`, 
    {
      method: 'PUT',
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if(response.ok) {
      scheduleBtnUI.style.display = "block";
      saveBtn.style.display = "none";
      getAllAppointments();
      resetInput();
    }
  }catch(error) {
    console.error(error);
  }
}

function displayInForm(appointment) {
  appointmentTitleInput.value = appointment.appointmentTitle;
  startTimeInput.value = appointment.startTime;
  endTimeInput.value = appointment.endTime;
  attendeesInput.value = appointment.numberOfAttedees;
  locationInput.value = appointment.location;
}

async function getAllAppointments() {
  try {
    const response = await fetch(
      `https://localhost:44318/api/Appointment/GetAllAppointments?id=${appointmentUserID}`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseData = await response.json();
    displayAppointments(responseData);
    MoveToNoification(responseData);
  } catch (error) {
    console.error(error);
  }
}

function displayAppointments( appointments ) {
  let allAppointments = "";
  appointments.forEach((appoinment) => {
    const appoinmentElement = `<div class="app-title" data-id="${ appoinment.appointmentId }">
                                  <div class="status">
                                      <div class="info">
                                          <h1>${ appoinment.appointmentTitle }</h1>
                                          <h3><span id="att-startTime" style="color: #32cf93">  ${  formatDateTime(appoinment.startTime)  }</span> to <span id="att-endTime"
                                          style="color: #32cf93"> ${ formatDateTime(appoinment.endTime)  }</span></h3>
                                          <h3><span id="att-number" style="color: #007bff">${ appoinment.numberOfAttedees }</span> attendees</h3>
                                          <h3><span id="att-location" style="color: #007bff">${ appoinment.location }</span></h3>
                                      </div>
                                  </div>
                                  <div class="progress">
                                      <button class="edit-btn"><span class="material-icons-sharp">
                                              edit
                                          </span></button>

                                      <button class="delete-btn"><span class="material-icons-sharp">
                                              delete
                                          </span></button>
                                  </div>
                              </div>`;

    allAppointments += appoinmentElement;
  });

  appointmentContainer.innerHTML = allAppointments;
}

getAllAppointments();

scheduleBtn.addEventListener("click", () => {
  schedule(
    appointmentTitleInput.value,
    startTimeInput.value,
    endTimeInput.value,
    attendeesInput.value,
    locationInput.value,
    appointmentUserID
  );

  // console.log(appointmentTitleInput.value,
  //   startTimeInput.value,
  //   endTimeInput.value,
  //   attendeesInput.value,
  //   locationInput.value,
  //   appointmentUserID);
});

function formatDateTime(inputDate) {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(inputDate).toLocaleDateString("en-US", options);
}

function populateForm(id) {
  getAnAppointment(id);
  saveBtn.style.display = "block";
  scheduleBtnUI.style.display = "none";

  const mediaQuery = window.matchMedia('(max-width: 768px)');

  if(mediaQuery.matches)
  {
    sideMenu.style.display = "block";
  }
}

function saveEdit(id) {
  editAppointment(id, appointmentTitleInput.value, startTimeInput.value, endTimeInput.value, attendeesInput.value, locationInput.value);
}

let editId;
document.addEventListener("click", async (event) => {
const target = event.target;

  //Delete a note
  if (target.classList.contains("delete-btn")) {
    const noteElement = target.closest(".app-title");
    // Get the data-id attribute from the parent .note element
    editId = noteElement.dataset.id;
    scheduleBtnUI.style.display = "block";
    saveBtn.style.display = "none";
    resetInput();

    deleteAppointment(editId);
  }

  if(target.classList.contains("edit-btn")) {
    const noteElement = target.closest(".app-title");
    // Get the data-id attribute from the parent .note element
    editId = noteElement.dataset.id;
    rescheduleTitle.classList.remove("hide");
    scheduleTitle.classList.add("hide");
    populateForm(editId);
  }

  if(target.classList.contains("save")) {
    rescheduleTitle.classList.add("hide");
    scheduleTitle.classList.remove("hide");
    saveEdit(editId);
  }
});


const notificationConatiner = document.querySelector(".notification-container");

function MoveToNoification(appointments){
  let allAppointments = "";

  const startedNotification = document.getElementById("text_muted_started");
  const endedNotification = document.getElementById("text_muted_ended");
  
  appointments.forEach((appointment) => {
    const isStarted = appointment.appointmentStatus === "Started";
    const isEnded = appointment.appointmentStatus === "Ended";
    const isPending = appointment.appointmentStatus === "Pending";
    const displayStyle = isStarted ? "flex" : "none";
    const displayStyle2 = isEnded ? "flex" : "none";
    const displayStyle3 = isPending ? "flex" : "none";

    const appoinmentNotification = `<div class="notification">
                                          <div class="icon">
                                            <span class="material-icons-sharp">
                                                notifications_active
                                            </span>
                                          </div>
                                          <div class="content">
                                              <div class="info">
                                                  <h2>${ appointment.appointmentTitle }</h2>
                                                  <h3 style="display: ${displayStyle};" id="text_muted_started">
                                                      Started
                                                  </h3>
                                                  <h3 style="display: ${displayStyle2};" id="text_muted_ended">
                                                      Ended
                                                  </h3>
                                                  <h3 style="display: ${displayStyle3};" id="text_muted_pending">
                                                      Pending
                                                  </h3>
                                              </div>
                                          </div>
                                        </div>`;
      allAppointments += appoinmentNotification;

      if(appointment.appointmentStatus === "Ended") {
            setTimeout(function () {
              deleteAppointment(appointment.appointmentId)
            },
            3600000
          );
      }
  });

  notificationConatiner.innerHTML = allAppointments;
}