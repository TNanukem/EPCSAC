var pageIndex = 1;

window.addEventListener('load', function () {
  showPages(pageIndex);
})

function plusPage(n){
	    		showPages(pageIndex += n);
}

function showPages(n){
  var i;
  var pages = document.getElementsByClassName("pages");
  //window.alert(pages.length);

  var next_button = document.getElementById("next-button");
  var previous_button = document.getElementById("previous-button");
  var submit = document.getElementById("submit_button");

  // Button appereance handling
  if (n >= pages.length){
    next_button.style.display = "none";
    submit.style.display = "inline-block";
  }
  else {
    next_button.style.display = "inline-block";
    submit.style.display = "none";
  }

  if (n == 1){
    previous_button.style.display = "none";
  }
  else {
    previous_button.style.display = "inline-block";
  }

  // Makes all pages invisible
	for(i = 0; i < pages.length; i++){
		pages[i].style.display = "none";
	}

  pages[pageIndex-1].style.display = "block";

}
