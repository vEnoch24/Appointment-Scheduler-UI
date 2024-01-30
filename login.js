//UI fucntionalities
const wrapper = document.querySelector(".wrapper");
const loginLink = document.querySelector(".login-link");
const loginLink2 = document.querySelector(".login-link2");
const registerLink = document.querySelector(".register-link");
const btnPopup = document.querySelector(".btnLogin-popup");
const btnPopup2 = document.querySelectorAll(".btnLogin-popup2");
const iconClose = document.querySelector(".icon-close");
const forgotPasswordLink = document.querySelector(".forgot-link");
const dropdownBtn = document.querySelector(".dropdown-btn");
const navigation = document.querySelector(".navigation");
const btns = document.querySelectorAll(".nav-btn");
const slides = document.querySelectorAll(".video-slide");
const contents = document.querySelectorAll(".content");

/***************************/
const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const appTitle = document.querySelector(".apptitle")

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
  appTitle.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
  appTitle.classList.remove("sign-up-mode");
});
/**************************/

// registerLink.addEventListener("click", () => {
//   wrapper.classList.add("active");
// });

// loginLink.addEventListener("click", () => {
//   wrapper.classList.remove("active");
// });

// loginLink2.addEventListener("click", () => {
//   wrapper.classList.remove("active-reset");
// });

// btnPopup.addEventListener("click", () => {
//   wrapper.classList.add("active-popup");
// });

// btnPopup2.forEach((btn) => {
//   btn.addEventListener("click", () => {
//     wrapper.classList.add("active-popup");
//   });
// });

// btnPopup2.addEventListener("click", () => {
//   wrapper.classList.add("active-popup");
// });

// iconClose.addEventListener("click", () => {
//   wrapper.classList.remove("active-popup");
// });

// dropdownBtn.addEventListener("click", () => {
//   dropdownBtn.classList.toggle("active");
//   navigation.classList.toggle("active");
// });

// var sliderNav = function (manual) {
//   btns.forEach((btn) => {
//     btn.classList.remove("active");
//   });

//   slides.forEach((slide) => {
//     slide.classList.remove("active");
//   });

//   contents.forEach((content) => {
//     content.classList.remove("active");
//   });

//   btns[manual].classList.add("active");
//   slides[manual].classList.add("active");
//   contents[manual].classList.add("active");
// };

// btns.forEach((btn, i) => {
//   btn.addEventListener("click", () => {
//     sliderNav(i);
//   });
// });

const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

// ScrollReveal().reveal(".home .content", {
//   ...scrollRevealOption,
// });

// contents.forEach((content) => {
//   ScrollReveal().reveal(content, {
//     ...scrollRevealOption,
//   });
// });
// ScrollReveal().reveal(".home .content h1", {
//   ...scrollRevealOption,
//   delay: 500,
// });
// ScrollReveal().reveal(".home .content p", {
//   ...scrollRevealOption,
//   delay: 1000,
// });
// ScrollReveal().reveal(".home .btnLogin-popup2", {
//   ...scrollRevealOption,
//   delay: 1500,
// });
// ScrollReveal().reveal(".home .media-icons", {
//   ...scrollRevealOption,
//   delay: 2000,
// });

// forgotPasswordLink.addEventListener("click", () => {
//   wrapper.classList.add("active-reset");
//   wrapper.classList.remove("active");
// });

//Backend Functionalites
const registerBtn = document.querySelector(".register-btn");
const loginBtn = document.querySelector(".login-btn");
const rememberMe = document.querySelector(".remember-me")

let usernameInput = document.querySelector(".username");
let email_input = document.querySelector(".email");
let phoneInput = document.querySelector(".phoneNumber");
let passwordInput = document.querySelector(".password");
let confirmPasswordInput = document.querySelector(".confirmPassword");
let loginEmail_input = document.querySelector(".login-email");
let loginPasswordInput = document.querySelector(".login-password");

let userId = "";

async function register(userName, email, phoneNumber, password, confirmPassword) {
  const body = {
    username: userName,
    email: email,
    phoneNumber: phoneNumber,
    password: password,
    confirmPassword: confirmPassword,
  };

  if (userName !== "" || email !== "" || phoneNumber!== "" || password !== "") {
    try {
      const response = await fetch(
        "https://localhost:44318/api/Auth/register",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! : status ${response.status}`);
      }
      if (response.ok) {
        const responseData = await response.json();
        //userId = responseData.id;
        localStorage.setItem('UserID', responseData.id);
        sendVerificationEmail(responseData.id, responseData.verificationToken);

        var successPage = `http://127.0.0.1:5500/UserCreationSuccess.html?email=${responseData.email}`;
        window.open(successPage, "_blank");
        //window.location.href = successPage;
      }
    } catch (error) {
      alert(error);
    }
  } else {
    alert("Fill all fields");
  }
}



async function sendVerificationEmail(userId, token) {
  const body = {
    userId: userId,
    token: token,
  };

  try {
    const response = await fetch(
      "https://localhost:44318/api/Auth/SendVerificationEmail",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! : status ${response.status}`);
    }
    if (response.ok) {
      console.log("Email sent");
    }
  } catch (error) {
    alert(error);
  }
}

async function forgotPassword(email) {
  try {
    const response = await fetch(
      `https://localhost:44318/api/Auth/Forgot-Password?email=${email}`,
      {
        method: "POST",
      }
    );

    if (response.ok) {
      console.log("You can reset password now");
    }
  } catch (error) {
    alert(error);
  }
}

async function resetPassword(token, password, confirmPassword) {
  const body = {
    token: token,
    password: password,
    confirmPassword: confirmPassword,
  };

  try {
    const response = await fetch(
      "https://localhost:44318/api/Auth/Reset-Password",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (response.ok) {
      const popup = document.getElementById("popup");
      popup.style.display = "block";
      setTimeout(function () {
        popup.style.display = "none";
      }, 2000);
      console.log("Password Reset Successfully");
    }
  } catch (error) {
    alert(error);
  }
}

async function getUserByEmail(email) {
  try {
    const response = await fetch(
      `https://localhost:44318/api/Auth/GetUserByEmail?email=${email}`,
      {
        method: "GET",
      }
    );

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    alert(error);
  }
}

async function login(email, password) {
  const body = {
    email: email,
    password: password,
  };
  const errorContainer = document.getElementById("errorContainer");

  try {
    const response = await fetch(`https://localhost:44318/api/Auth/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      body: JSON.stringify(body),
    });

    const responseData = await response.json();

    if(response.ok)
    {
      // if(rememberMe.checked){
      //   localStorage.setItem('jwt', responseData);
      // }else{
      //   sessionStorage.setItem('sessionToken', responseData);
      // }   

      const user = await getUserByEmail(email);

      // Generate a unique key for the user's data using their email
      const userKey = `user_${email}`;
      const idKey = `user_${user.id}`

      // Store the user's data in local storage using the unique key
      localStorage.setItem(userKey, JSON.stringify(responseData));
      localStorage.setItem(idKey, JSON.stringify(user.id));

      var MainPage = `http://127.0.0.1:5500/MainPage/index.html?email=${email}&id=${user.id}&username=${user.username}`;
      window.location.href = MainPage;
    }

    // if (response.status === 200) {
    //   console.log("Logged in with token:", responseData);
    // }

    if (!response.ok) {
      // const errorText = await response.text();
      // const errorText = error.message;

      errorContainer.style.display = "block";
      errorContainer.textContent = "User not found. Please register";
      //errorContainer.textContent = errorText;
      setTimeout(function () {
        errorContainer.style.display = "none";
      }, 3000);

      if (errorText === "User not found") {
        errorContainer.textContent = "User not found. Please register.";
      } else if (errorText === "Not Verified") {
        errorContainer.textContent =
          "Your account is not verified. Please verify your email.";
      } else if (errorText === "Wrong Password!") {
        errorContainer.textContent =
          "Wrong password. Please check your password.";
      } else {
        errorContainer.textContent =
          "An error occurred. Please try again later.";
      }
      setTimeout(function () {
        errorContainer.style.display = "none";
      }, 2000);
    }
  } catch (error) {}
}

registerBtn.addEventListener("click", function () {
  register(
    usernameInput.value,
    email_input.value,
    phoneInput.value,
    passwordInput.value,
    confirmPasswordInput.value
  );
  // console.log(
  //   usernameInput.value,
  //   email_input.value,
  //   passwordInput.value,
  //   confirmPasswordInput.value
  // );
});

loginBtn.addEventListener("click", function () {
  login(loginEmail_input.value, loginPasswordInput.value);
});

let emailStore;

//PASSWORD RESET
document.addEventListener("click", async (event) => {
  const target = event.target;

  if (target.classList.contains("forgot-link")) {
    const formBox = target.closest(".form-box");

    // Find the "email" input field within the formBox
    const emailInput = formBox.querySelector(".login-email");
    const email = emailInput.value;
    if (email !== "") {
      emailStore = email;
      wrapper.classList.add("active-reset");
      wrapper.classList.remove("active");
      forgotPassword(email);
    } else {
      alert("input the mail password you want to reset");
    }
  }

  if (target.classList.contains("reset-btn")) {
    const formBox = target.closest(".form-box");

    // Find the "email" input field within the formBox
    let newPasswordInput = formBox.querySelector(".new-password");
    let newConfirmPasswordInput = formBox.querySelector(".new-confirmPassword");

    if (emailStore !== "") {
      try {
        const user = await getUserByEmail(emailStore);
        console.log(user.passwordRestToken);
        if (user) {
          await resetPassword(
            user.passwordRestToken,
            newPasswordInput.value,
            newConfirmPasswordInput.value
          );
          // newPasswordInput.value = "";
          // newConfirmPasswordInput.value = "";
        } else {
          alert("User not found");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while resetting the password.");
      }
    } else {
      alert("input the mail of password you want to reset");
    }
  }
});
