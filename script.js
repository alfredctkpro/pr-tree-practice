document.addEventListener("DOMContentLoaded", function () {
    var heading = document.querySelector("h1");
    heading.addEventListener("click", function () {
        heading.textContent = "你點了標題！";
    });
});
