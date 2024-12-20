import {call_function_by_name} from "../util.js";

const timeout_map = new Map();

window.addEventListener("load", init)

function init()
{
    const elements= document.getElementsByClassName("base_switch");

    for(let i= 0; i < elements.length; i++)
    {
        let switch_id = elements[i].id
        let switch_input = document.getElementById(switch_id + "_input")
        let default_state_function = elements[i].attributes["default_state_function"]

        if(default_state_function)
        {
            let default_state = call_function_by_name(elements[i].attributes["default_state_function"].value.toString())

            if(default_state)
            {
                switch_input.checked = default_state
            }
        }

        toggle(switch_id)
    }
}

function toggle(switchId, callback = null)
{
    const switch_component = document.getElementById(switchId)
    const input = document.getElementById(switchId + "_input")
    const track = document.getElementById(switchId + "_track")
    const thumb = document.getElementById(switchId + "_thumb")
    const thumb_icons = document.querySelectorAll("#" + switchId + "_thumb svg")
    const label_off = document.getElementById(switchId + "_label_off")
    const label_on = document.getElementById(switchId + "_label_on")
    const icon_off = document.getElementById(switchId + "_icon_off")
    const icon_on = document.getElementById(switchId + "_icon_on")

    //Animation
    const animation_duration = parseFloat(getComputedStyle(document.getElementById(switchId)).getPropertyValue("--switch-time").replace("s", ""))

    if(timeout_map.has(switchId))
    {
        window.clearTimeout(timeout_map.get(switchId))
        timeout_map.delete(switchId)
    }

    track.style.transitionDuration = animation_duration + "s"
    thumb.style.transitionDuration = animation_duration + "s"
    thumb_icons.forEach((element) => element.style.transitionDuration = animation_duration + "s")

    const id = window.setTimeout(function()
    {
        track.style.transitionDuration = null
        thumb.style.transitionDuration = null
        thumb_icons.forEach((element) => element.style.transitionDuration = null)

        timeout_map.delete(switchId)
    }, animation_duration * 1000)

    timeout_map.set(switchId, id)

    //Label
    if(label_off)
    {
        label_off.style.opacity = input.checked ? "0%" : "100%"
    }

    if(label_on)
    {
        label_on.style.opacity = input.checked ? "100%" : "0%"
    }
    
    //Icon
    if(icon_off || icon_on)
    {
        if(icon_off)
        {
            icon_off.style.opacity = input.checked ? "0%" : "100%"
        }

        if(icon_on)
        {
            icon_on.style.opacity = input.checked ? "100%" : "0%"
        }

        if(input.checked && icon_on || !input.checked && icon_off)
        {
            thumb.classList.add("base_switch_thumb_with_icon")
        }
        else
        {
            thumb.classList.remove("base_switch_thumb_with_icon")
        }
    }

    if(switch_component.classList.contains("useLocalStorage"))
    {
        localStorage.setItem(switchId, input.checked)
    }

    if(callback)
    {
        callback(switchId, input.checked)
    }
}

function press(event, switchId)
{
    if(event.button === 0)
    {
        const input = document.getElementById(switchId + "_input")
        const thumb = document.getElementById(switchId + "_thumb")
        const switch_checked = input.checked

        if(!switch_checked)
        {
            thumb.classList.remove("base_switch_thumb_on_uncheck")
            thumb.classList.add("base_switch_thumb_on_check")
        }
        else
        {
            thumb.classList.remove("base_switch_thumb_on_check")
            thumb.classList.add("base_switch_thumb_on_uncheck")
        }

        addEventListener("mouseup", () =>
        {
            setTimeout(function ()
            {
                if(input.checked === switch_checked)
                {
                    cancel_toggle(switchId)
                }
            }, 0)
        }, {once: true, capture: false})
    }

    return false;
}

function cancel_toggle(switchId)
{
    const thumb = document.getElementById(switchId + "_thumb")

    thumb.classList.remove("base_switch_thumb_on_check")
    thumb.classList.remove("base_switch_thumb_on_uncheck")
}

window.switchFunctions = {toggle, press, cancel_toggle}