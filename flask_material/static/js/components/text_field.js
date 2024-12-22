window.addEventListener("load", () => setTimeout(init, 1))

function init()
{
    const text_fields = document.getElementsByClassName("base_text_field")

    for(let i = 0; i < text_fields.length; i++)
    {
        text_fields[i].addEventListener("input", function(e){on_input(e, text_fields[i].id)})
        on_input(null, text_fields[i].id)
    }
}

function on_input(e, text_field_id)
{
    const text_field = document.getElementById(text_field_id)
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

    if(text_field.hasOwnProperty("on_input"))
    {
        text_field.on_input(e, text_field_id)
    }
}

function on_input_number(e, text_field_id)
{
    let text_field = document.getElementById(text_field_id)
    let input = document.getElementById(text_field_id + "_input")
    let cur_value = input.value
    let old_value = input.hasOwnProperty("old_value") ? input.old_value : ""
    let cursor_pos = input.selectionStart

    console.log(input.selectionStart + "/" + input.selectionEnd)
    console.log()

    /*let decimal_point_pos = old_value.indexOf(".") + old_value.indexOf(",") + 1
    let decimal_point_found = false

    for(let i = 0; i < cur_value.length; i++)
    {
        let remove_char = !/[0-9+\-,.]/.test(cur_value[i])
        remove_char |= i !== 0 && (cur_value[i] === "+" || cur_value[i] === "-")

        if(cur_value[i] === "." || cur_value[i] === ",")
        {
            remove_char = decimal_point_found
            decimal_point_found = true
        }

        if(remove_char)
        {
            cur_value = cur_value.substring(0, i) + cur_value.substring(i + 1, cur_value.length)
            cursor_pos += i < cursor_pos ? -1 : 0
            i--
        }
    }

    input.value = cur_value
    input.setSelectionRange(cursor_pos, cursor_pos)
    input.old_value = input.value*/

    if(text_field.hasOwnProperty("on_input_number"))
    {
        text_field.on_input_number(e, text_field_id)
    }
}

function clear(text_field_id)
{
    const input = document.getElementById(text_field_id + "_input")
    input.value = ""
    on_input(text_field_id)
}

window.text_field_functions = {on_input, clear, on_input_number}