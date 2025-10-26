window.addEventListener("fm_component_init", init)

// Common Text Field Functions
function init()
{
    const elements = document.getElementsByClassName("base_text_field")

    for(let i= 0; i < elements.length; i++)
    {
        // Add Elements
        elements[i].fm.elements.inner = document.querySelector(`#${elements[i].id} .base_text_field_inner`)
        elements[i].fm.elements.leading_icon = document.querySelector(`#${elements[i].id} .base_text_leading_icon`)
        elements[i].fm.elements.input_container = document.querySelector(`#${elements[i].id} .base_text_field_input_container`)
        elements[i].fm.elements.label = document.querySelector(`#${elements[i].id} .base_text_field_label`)
        elements[i].fm.elements.input = document.querySelector(`#${elements[i].id} .base_text_field_input`)
        elements[i].fm.elements.trailing_icon = document.querySelector(`#${elements[i].id} .base_text_trailing_icon`)
        elements[i].fm.elements.error_icon = document.querySelector(`#${elements[i].id} .base_text_error_icon`)
        elements[i].fm.elements.supporting_text_container = document.querySelector(`#${elements[i].id} .base_text_field_supporting_text_container`)
        elements[i].fm.elements.supporting_text = document.querySelector(`#${elements[i].id} .base_text_field_supporting_text`)
        elements[i].fm.elements.char_count = document.querySelector(`#${elements[i].id} .base_text_field_char_count`)
        elements[i].fm.elements.focus_element = elements[i].fm.elements.input

        // Add Text Field Attributes and Methods
        elements[i].fm.input_type = elements[i].getAttribute("input_type")

        elements[i].fm._prev_selection = null
        elements[i].fm._history = []
        elements[i].fm._history_index = 0

        elements[i].fm.formatter = standard_formatter
        elements[i].fm.formatter_settings = {max_length: -1}

        elements[i].fm.on_change = (e, tf) => {}
        elements[i].fm.on_escape = (e, tf) => {document.activeElement.blur()}
        elements[i].fm.on_return = (e, tf) => {document.activeElement.blur()}

        elements[i].fm._text = elements[i].fm.elements.input.value
        Object.defineProperty(elements[i].fm, "text", {
            get: () => {return elements[i].fm._text},
            set: (text) =>
            {
                let prev_text = this._text
                elements[i].fm._text = text
                update_text_field(elements[i])
                elements[i].fm.on_change(new CustomEvent("change", {prev_text}), elements[i])
            }
        })

        elements[i].fm._error = false
        Object.defineProperty(elements[i].fm, "error", {
            get: () => {return elements[i].fm._error},
            set: (error) =>
            {
                elements[i].fm._error = error
                update_text_field(elements[i])
            }
        })

        Object.defineProperty(elements[i].fm, "read_only", {
            get: () => {return elements[i].fm.elements.input.readOnly},
            set: (read_only) =>
            {
                elements[i].fm.elements.input.readOnly = read_only
                elements[i].classList.toggle("read_only", read_only)
            }
        })

        // Add Event Listeners
        elements[i].addEventListener("beforeinput", (e) => on_before_input(e, elements[i]))
        elements[i].addEventListener("input", (e) => on_input(e, elements[i]))
        elements[i].addEventListener("keydown", (e) =>
        {
            if(elements[i].fm.read_only)
            {
                return
            }

            if(e.key === "Escape")
            {
                elements[i].fm.on_escape(new CustomEvent("escape"), elements[i])
            }
            else if(e.key === "Enter")
            {
                elements[i].fm.on_return(new CustomEvent("return"), elements[i])
            }
        })

        elements[i].addEventListener("focusin", (e) =>
        {
            elements[i].fm.elements.input.setSelectionRange(elements[i].fm.text.length, elements[i].fm.text.length)
        })

        // Init Special Text Field Types
        if(elements[i].fm.input_type === "number")
        {
            init_number_input(elements[i])
        }

        // Initial Text Field Update
        elements[i].dispatchEvent(new FocusEvent("focusout"))
        update_text_field(elements[i])
    }
}

function update_text_field(text_field)
{
    text_field.classList.toggle("base_text_field_empty", text_field.fm.text === "")
    text_field.classList.toggle("error", text_field.fm.error)

    if(text_field.fm.elements.char_count)
    {
        text_field.fm.elements.char_count.innerText = text_field.fm.text.length.toString()

        if(text_field.fm.formatter_settings.max_length >= 0)
        {
            text_field.fm.elements.char_count.innerText += `/${text_field.fm.formatter_settings.max_length}`
        }
    }

    let selection = [text_field.fm.elements.input.selectionStart, text_field.fm.elements.input.selectionEnd]
    text_field.fm.elements.input.value = text_field.fm.text
    text_field.fm.elements.input.setSelectionRange(selection[0], selection[1])
}

function on_before_input(e, text_field)
{
    text_field.fm._prev_selection = [text_field.fm.elements.input.selectionStart, text_field.fm.elements.input.selectionEnd]
}

function on_input(e, text_field)
{
    text_field.fm.elements.input.focus()
    let result = text_field.fm.formatter(text_field, e.data, e.inputType, text_field.fm.formatter_settings)

    if(result !== null)
    {
        text_field.fm.text = result[0]
        text_field.fm.elements.input.setSelectionRange(result[1], result[2])
    }
    else
    {
        text_field.fm.text = text_field.fm.text
        text_field.fm.elements.input.setSelectionRange(text_field.fm._prev_selection[0], text_field.fm._prev_selection[1])
    }
}

// Standard Text Field Functions
function standard_formatter(text_field, data, input_type, settings = {})
{
    let next_text = text_field.fm.text
    let cur_selection = [...text_field.fm._prev_selection]
    let next_selection = [cur_selection[0], cur_selection[0]]
    let no_selection = next_text.length > 0 && cur_selection[0] === cur_selection[1]
    data = data === null ? "" : data

    switch (input_type)
    {
        case "insertText":
        case "insertFromPaste":
            next_selection = [cur_selection[0] + data.length, cur_selection[0] + data.length]
            break
        case "deleteContentBackward":
            cur_selection[0] = no_selection ? Math.max(cur_selection[0] - 1, 0) : cur_selection[0]
            next_selection = [cur_selection[0], cur_selection[0]]
            break
        case "deleteContentForward":
            cur_selection[1] = no_selection ? Math.min(cur_selection[1] + 1, next_text.length) : cur_selection[1]
            break
        case "deleteSoftLineBackward":
        case "deleteHardLineBackward":
            cur_selection = [0, cur_selection[1]]
            break
        case "deleteSoftLineForward":
        case "deleteHardLineForward":
            cur_selection = [cur_selection[0], next_text.length]
            break
        case "deleteEntireSoftLine":
            cur_selection = [0, next_text.length]
            break
        case "deleteContent":
        case "deleteByCut":
            break
        case "historyUndo":
            text_field.fm._history.push([text_field.fm.text, text_field.fm._prev_selection])
            text_field.fm._history_index = Math.max(text_field.fm._history_index - 1, 0)
            next_text = text_field.fm._history[text_field.fm._history_index][0]
            next_selection = text_field.fm._history[text_field.fm._history_index][1]
            break
        case "historyRedo":
            text_field.fm._history_index = Math.min(text_field.fm._history_index + 1, text_field.fm._history.length)
            next_text = text_field.fm._history[text_field.fm._history_index][0]
            next_selection = text_field.fm._history[text_field.fm._history_index][1]
            break
        default:
            return [next_text, cur_selection[0], cur_selection[1]]
    }

    if(settings.max_length >= 0)
    {
        let stripped_off = data.length
        next_text = next_text.substring(0, settings.max_length)
        data = data.substring(0, settings.max_length - next_text.length)
        stripped_off -= data.length

        next_selection = [Math.max(next_selection[0] - stripped_off, 0), Math.max(next_selection[1] - stripped_off, 0)]
    }

    if(input_type !== "historyUndo" && input_type !== "historyRedo")
    {
        next_text = next_text.substring(0, cur_selection[0]) + data + next_text.substring(cur_selection[1], next_text.length)

        if(next_text !== text_field.fm.text)
        {
            if(text_field.fm._history.length === text_field.fm._history_index)
            {
                text_field.fm._history.push([text_field.fm.text, text_field.fm._prev_selection])
            }
            else
            {
                while(text_field.fm._history.length > text_field.fm._history_index + 1)
                {
                    text_field.fm._history.pop()
                }
            }

            text_field.fm._history_index = text_field.fm._history.length
        }
    }

    return [next_text, next_selection[0], next_selection[1]]
}

// Number Field Functions
function init_number_input(text_field)

{
    text_field.fm.text_field_type = "number"
    text_field.fm.formatter = number_formatter
    text_field.fm.formatter_settings = {decimal_point_char: ".",
                                        only_integer: false}
    text_field.fm._value = null
    text_field.fm.on_value_change = (e, tf) => {}

    Object.defineProperty(text_field.fm, "value", {
        get: () => {return text_field.fm._value},
        set: (value) =>
        {
            let prev_value = text_field.fm._value
            text_field.fm._value = value
            text_field.fm.text = text_field.fm.value !== null ? format_number(text_field.fm.value, text_field.fm.formatter_settings) : ""
            text_field.fm.on_value_change(new CustomEvent("value_change", {prev_value}), text_field)
        }
    })

    text_field.addEventListener("focusout", (e) =>
    {
        text_field.fm.value = text_field.fm.text !== "" ? parse_number(text_field.fm.text, text_field.fm.formatter_settings) : null
    })
}

function number_formatter(text_field, data, input_type, settings = {})
{
    let result = standard_formatter(text_field, data, input_type)
    let contains_letters = !new RegExp(`^[0-9+\\-\\${settings.decimal_point_char}]*$`).test(result[0])
    let invalid_sign = (result[0].lastIndexOf("+") + result[0].lastIndexOf("-")) >= 0
    let decimal_count = (result[0].match(new RegExp(`\\${settings.decimal_point_char}`, "g")) || []).length
    let max_decimal_count = settings.only_integer ? 0 : 1

    if(contains_letters || invalid_sign || decimal_count > max_decimal_count || isNaN(parse_number(result[0], settings)))
    {
        if(input_type !== "historyUndo" && input_type !== "historyRedo")
        {
            text_field.fm._history.pop()
            text_field.fm._history_index = text_field.fm._history.length
        }

        return null
    }

    return result
}

function parse_number(text, settings)
{
    text = text.replaceAll(settings.decimal_point_char, ".")

    if(/^[+-]?\.?$/.test(text))
    {
        return 0
    }

    return settings.only_integer ? parseInt(text) : parseFloat(text)
}

function format_number(value, settings)
{
    let text = value.toString()
    text = text.replaceAll(".", settings.decimal_point_char)

    return text
}
