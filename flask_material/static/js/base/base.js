window.addEventListener("load", remove_no_initial_animation_class)
update_dark_mode(false)

function update_dark_mode(dark_mode_activated = null)
{
    if(dark_mode_activated != null)
    {
        localStorage.dark_mode = dark_mode_activated
    }

    document.documentElement.className = localStorage.dark_mode === "true" ? "dark" : "light";
}

function toggle_dark_mode()
{
    update_dark_mode(localStorage.dark_mode === "true" ? "false" : "true");
}

function remove_no_initial_animation_class()
{
    const elements = document.getElementsByClassName("no-initial-animation");

    while(elements.length > 0)
    {
        elements[0].classList.remove("no-initial-animation")
    }
}

window.base_functions = {...window.base_functions, update_dark_mode, toggle_dark_mode}