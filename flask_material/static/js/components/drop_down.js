window.addEventListener("fm_component_init", init)
window.addEventListener("click", on_click)
window.addEventListener("fm_init", () => {Array.from(document.getElementsByClassName("base_drop_down")).map((drop_down) => drop_down.fm.extended = false)})

function init()
{
    const elements = document.getElementsByClassName("base_drop_down")

    for(let i= 0; i < elements.length; i++)
    {
        // Add Elements
        elements[i].fm.elements.text_field = document.querySelector(`#${elements[i].id} .base_drop_down_text_field`)
        elements[i].fm.elements.menu = document.querySelector(`#${elements[i].id} .base_drop_down_menu`)

        // Add Drop Down Attributes and Methods
        Object.defineProperty(elements[i].fm, "extended", {
            get: () => {return elements[i].classList.contains("extended")},
            set: (extended) =>
            {
                extended = extended && elements[i].fm.enabled

                elements[i].classList.toggle("extended", extended)
                elements[i].fm.elements.menu.fm.focusable = extended
            }
        })

        Object.defineProperty(elements[i].fm, "selected_item", {
            get: () => {return elements[i].fm.elements.menu.fm.selected_item},
            set: (selected_item) => {elements[i].fm.elements.menu.fm.selected_item = selected_item}
        })

        Object.defineProperty(elements[i].fm, "enabled", {
            set: (enabled) =>
            {
                elements[i].fm._enabled = enabled
                elements[i].fm.elements.text_field.fm.enabled = enabled
                elements[i].fm.extended = false
            }
        })

        elements[i].fm.on_item_selected = (e, drop_down) => {}
        elements[i].fm.elements.text_field.fm.read_only = true

        // Add Event Listeners
        elements[i].addEventListener("click", (e) =>
        {
            elements[i].fm.extended = true
        })

        elements[i].fm.elements.menu.fm.on_item_selected = (e, menu) =>
        {
            for(let item of Array.from(elements[i].fm.elements.menu.fm.elements.items))
            {
                if(item.getAttribute("item_id") === elements[i].fm.elements.menu.fm.selected_item)
                {
                    elements[i].fm.elements.text_field.fm.text = item.querySelector(`.base_menu_item_content span`).innerHTML
                    break
                }
            }

            elements[i].fm.on_item_selected(e, elements[i])
        }

        window.addEventListener("keydown", (e) =>
        {
            if(document.activeElement === elements[i].fm.elements.text_field.fm.elements.input && e.code === "Enter")
            {
                elements[i].fm.extended = !elements[i].fm.extended
            }

            if(elements[i].contains(document.activeElement) && e.code === "Escape")
            {
                elements[i].fm.extended = false
                elements[i].fm.elements.text_field.fm.elements.input.focus()
            }
        })
    }
}

function on_click(e)
{
    const drop_downs = document.getElementsByClassName("base_drop_down");
    let clicked_drop_down = e.target.closest(".base_drop_down_text_field")

    for(const drop_down of drop_downs)
    {
        if(clicked_drop_down !== drop_down.fm.elements.text_field)
        {
            window.setTimeout(() =>
            {
                drop_down.fm.extended = false
            }, 50)
        }
    }
}