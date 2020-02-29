function validation(id_check, exact, max, min){
  var checkbox = document.getElementById(id_check);
  var exact = document.getElementById(exact);
  var max = document.getElementById(max);
  var min = document.getElementById(min);

  if (checkbox.checked == true){
    exact.required = false;
    min.required = true;
    max.required = true;
  } else {
    exact.required = true;
    min.required = false;
    max.required = false;
  }
}
