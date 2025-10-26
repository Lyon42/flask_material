window.addEventListener("fm_component_init", init)

function init()
{
    const elements = document.getElementsByClassName("base_button")

    for(let i = 0; i < elements.length; i++)
    {
        // Add Elements
        elements[i].fm.elements.icon = document.querySelector(`#${elements[i].id} .base_button_icon`)
        elements[i].fm.elements.label = document.querySelector(`#${elements[i].id} .base_button_label`)

        // Add Button Attributes and Methods
        elements[i].fm.type = "button"
        elements[i].fm.click = () => elements[i].click()
        elements[i].fm.on_click = (e, button) => {}

        // Add Event Listeners
        elements[i].addEventListener("click", (e) =>
        {
            if(elements[i].fm.enabled)
            {
                elements[i].fm.on_click(e, elements[i])
            }
        })

        window.addEventListener("keydown", (e) =>
        {
            if(document.activeElement === elements[i] && e.code === "Enter")
            {
                elements[i].fm.click()
            }
        })
    }
}