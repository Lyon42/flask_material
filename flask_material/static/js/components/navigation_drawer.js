document.addEventListener("mouseup", (e) =>
{
    const left_side_bar = document.getElementById("left_side_bar")

    if(left_side_bar.classList.contains("modal_navigation_drawer") && !left_side_bar.contains(e.target))
    {
        extend(false)
    }
})

function extend(extended)
{
    const left_side_bar = document.getElementById("left_side_bar")

    if(extended)
    {
        left_side_bar.classList.add("left_side_bar_extended")
    }
    else
    {
        left_side_bar.classList.remove("left_side_bar_extended")
    }
}

function toggle()
{
    extend(!document.getElementById("left_side_bar").classList.contains("left_side_bar_extended"))
}

function extended()
{
    return document.getElementById("left_side_bar").classList.contains("left_side_bar_extended");
}

window.nav_drawer_functions = {extend, toggle, extended}