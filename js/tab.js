
function openPage(pageName, elmnt) {
    // Hide all elements with class="tabcontent" by default */
    var i, tabcontent, active;
    console.log("clicked", elmnt)
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Remove the background color of all tablinks/buttons
    active = document.getElementsByClassName("active-button");
    for (i = 0; i < active.length; i++) {
        console.log(active[i])
        active[i].classList.remove("active-button");
    }

    // Show the specific tab content
    document.getElementById(pageName).style.display = "block";

    elmnt.classList.add("active-button");
    elmnt.classList.add("bkg");
}

console.log(document.getElementById("default-tab"));
console.log(document.getElementsByClassName("tabcontent"));
document.getElementById("default-tab").click();