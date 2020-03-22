// This function allows the selection of random features

function checkbox(id_check, id_div, id_text){
  var checkbox = document.getElementById(id_check);
  var text = document.getElementById(id_text);
  var div = document.getElementById(id_div);

  if (checkbox.checked == true){
    text.style.display = "none";
    text.style.float = "initial";
    div.style.display = "block"
  } else {
    text.style.display = "block";
    div.style.float = "initial";
    div.style.display = "none"
    text.style.marginLeft = "auto"
    text.style.marginRight = "auto"
  }
}

function checkbox_unique(id_checkbox, id_div){
  var checkbox = document.getElementById(id_checkbox);
  var div = document.getElementById(id_div);
  var doi = document.getElementById('DOI');

  if(checkbox.checked == true){
    div.style.display = "block";
    doi.required = true;
  } else {
    div.style.display = "none";
    doi.required = false;
  }
}
