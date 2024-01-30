// Extract userId and token from the URL
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("userId");
const token = urlParams.get("token");

if(token !== "")
{
  //Request to API to verify the email
  fetch(`https://localhost:44318/api/Auth/Verify?token=${token}`)
  .then((response) => {
    if (response.ok) {
      // Email verification was successful
      
      console.log("User Verified");
    } else if (response.status === 400) {

      response.text().then(errorMessage => {
        if (errorMessage.includes("Email is already verified")) {
          console.log("Email is already verified");
        } else {
          console.log("Verification Error");
        }
      });
    } else {
      console.log("Verification Error");
    }
  })
  .catch((error) => {
    console.error(error);
  });
}
