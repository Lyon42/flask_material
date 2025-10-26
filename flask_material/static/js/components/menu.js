window.addEventListener("fm_component_init", init)

function init()
{
    const elements = document.getElementsByClassName("base_menu");

    for(let i= 0; i < elements.length; i++)
    {
        // Add Elements
        elements[i].fm.elements.items = elements[i].fm.elements.root.children

        // Add Menu Attributes and Methods
        elements[i].fm._selected_item = ""
        Object.defineProperty(elements[i].fm, "selected_item", {
            get: () => {return elements[i].fm._selected_item},
            set: (item_id) =>
            {
                if(!elements[i].fm.enabled)
                {
                    return
                }

                let success = false;

                Array.from(elements[i].fm.elements.items).map(function (item)
                {
                    if(item.classList.contains("base_menu_item"))
                    {
                        const is_selected = item.getAttribute("item_id") === item_id
                        success |= is_selected
                        item.classList.toggle("selected", is_selected)
                    }
                })

                elements[i].fm._selected_item = success ? item_id : ""
                elements[i].fm.on_item_selected(new CustomEvent("item_selected"), elements[i])
            }
        })

        if(!Object.hasOwn(elements[i].fm, "on_item_selected"))
        {
            elements[i].fm.on_item_selected = (e, menu) => {}
        }

        Object.defineProperty(elements[i].fm, "focusable", {
            set(focusable)
            {
                this._focusable = focusable
                Array.from(this.elements.items).forEach((elem) => elem.setAttribute("tabindex", focusable && this.enabled ? "0" : "-1"))
            }
        })

        // Add Event Listeners
        Array.from(elements[i].children).map(function (item)
        {
            if(item.classList.contains("base_menu_item"))
            {
                item.addEventListener("click", (e) =>
                {
                    if(elements[i].fm.enabled)
                    {
                        elements[i].fm.selected_item = item.getAttribute("item_id")
                    }
                })
            }

            window.addEventListener("keydown", (e) =>
            {
                if(document.activeElement === item && e.code === "Enter")
                {
                    elements[i].fm.selected_item = item.getAttribute("item_id")
                }
            })
        })
    }
}
