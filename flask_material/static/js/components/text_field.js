window.addEventListener("load", () => setTimeout(init, 10))

function init()
{
    const text_fields = document.getElementsByClassName("base_text_field")

    for(let i = 0; i < text_fields.length; i++)
    {
        on_input(text_fields[i].id)
    }
}

function on_input(text_field_id)
{
    const input = document.getElementById(text_field_id + "_input")
    const label = document.getElementById(text_field_id + "_label")

    if(label)
    {
        if(input.value)
        {
            label.classList.add("base_text_field_label_populated")
        }
        else
        {
            label.classList.remove("base_text_field_label_populated")
        }
    }
}

function clear(text_field_id)
{
    const input = document.getElementById(text_field_id + "_input")
    input.value = ""
    on_input(text_field_id)
}

window.textFieldFunctions = {on_input, clear}