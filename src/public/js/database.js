function showParameters(value){

  var xhttp;
  if(value != ""){
    xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      document.getElementById("param").innerHTML = this.responseText;
      }
    };
    xhttp.open("GET", "getparams?id="+value, true);
    xhttp.send();

  }
}
