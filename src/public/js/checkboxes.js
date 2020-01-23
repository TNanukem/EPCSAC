// This function allows the selection of random features

function checkbox(id_check, id_div, id_text){
  var checkbox = document.getElementById(id_check);
  var text = document.getElementById(id_text);
  var div = document.getElementById(id_div);

  if (checkbox.checked == true){
    text.style.display = "none";
    div.style.display = "block"
  } else {
    text.style.display = "block";
    div.style.display = "none"
  }
}
