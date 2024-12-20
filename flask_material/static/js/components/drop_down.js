window.addEventListener("click", on_click)

let EXTENDED_DROP_DOWNS = []

function on_click(e)
{
    let parent_drop_down = e.target.closest(".base_drop_down_container")
    let parent_menu = e.target.closest(".base_menu_container")
    EXTENDED_DROP_DOWNS.map(function (drop_down)
    {
        drop_down.classList.remove("base_drop_down_extended")
        document.getElementById(drop_down.id + "_menu").style.transition = "none"
    })

    if(parent_drop_down != null && parent_menu == null)
    {
        EXTENDED_DROP_DOWNS.push(parent_drop_down)
        parent_drop_down.classList.add("base_drop_down_extended")
        document.getElementById(parent_drop_down.id + "_menu").style.transition = ""
    }
}

function select_item(drop_down_id, item_id, callback = null)
{
    let label = document.getElementById(drop_down_id + "_menu_" + item_id + "_label")
    document.getElementById(drop_down_id + "_text_field_input").value = label.innerText

    if(callback != null)
    {
        callback(item_id)
    }
}

function selected_item(drop_down_id)
{
    return window.menu_functions.selected_item(drop_down_id + "_menu")
}

window.drop_down_functions = {select_item, selected_item}