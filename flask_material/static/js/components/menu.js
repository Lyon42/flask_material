function select_item(menu_id, item_id, callback)
{
    let menu = document.getElementById(menu_id)
    menu.setAttribute("selected_item", item_id)

    Array.from(menu.children).map(function (child)
    {
        child.classList.toggle("base_menu_item_wrapper_selected", child.getAttribute("item_id") === item_id)

        if(child.getAttribute("item_id") === item_id && callback != null)
        {
            callback(item_id)
        }
    })
}

function selected_item(menu_id)
{
    let selected_item = document.getElementById(menu_id).getAttribute("selected_item")
    return selected_item === "" ? null : selected_item
}

window.menu_functions = {select_item, selected_item}