var navBar = document.getElementById("navBarCollapsible");

navBar.addEventListener("click", function() {
    this.classList.toggle("active");
    var content = document.getElementById("navBarCollapsibleContent");
    var iconOpen = document.getElementById("navBarCollapsibleOpen");
    var iconClose = document.getElementById("navBarCollapsibleClosed");
    if (content.style.maxHeight){
        content.style.maxHeight = null;
        iconOpen.style.display = "none";
        iconClose.style.display = "block";
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
        iconClose.style.display = "none";
        iconOpen.style.display = "block";
    }
});