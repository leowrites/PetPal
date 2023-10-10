var notificationButton = document.getElementById("notificationButton");

notificationButton.addEventListener("click", function() {
    var content = document.getElementById("notificationsDropdown");
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

function mobileNotificationsPopup() {
    var popup = document.getElementById("notificationsDropdownMobile");
    popup.classList.toggle("show");
}