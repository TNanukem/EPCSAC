function comparePasswords(){
  var password = document.getElementById("InputPassword");
  var comparison = document.getElementById("ConfirmPassword");

  if(password.value == comparison.value){
    comparison.setCustomValidity("");
  } else {
    comparison.setCustomValidity("The passwords must match");
  }
}
