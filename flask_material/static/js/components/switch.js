window.addEventListener("fm_component_init", init)

const TIMEOUT_MAP = new Map();

function init()
{
    const elements= document.getElementsByClassName("base_switch");

    for(let i= 0; i < elements.length; i++)
    {
        // Add Elements
        elements[i].fm.elements.track = document.querySelector(`#${elements[i].id} .base_switch_track`)
        elements[i].fm.elements.handle = document.querySelector(`#${elements[i].id} .base_switch_handle`)
        elements[i].fm.elements.handle_icon_container = document.querySelector(`#${elements[i].id} .base_switch_icon_container`)
        elements[i].fm.elements.handle_icons = elements[i].fm.elements.handle_icon_container.children
        elements[i].fm.elements.handle_icon_off = document.querySelector(`#${elements[i].id} .base_switch_icon_off`)
        elements[i].fm.elements.handle_icon_on = document.querySelector(`#${elements[i].id} .base_switch_icon_on`)

        // Add Switch Attributes and Methods
        elements[i].fm._toggled = false
        Object.defineProperty(elements[i].fm, "toggled", {
            get: () => {return elements[i].fm._toggled},
            set: (toggled) =>
            {
                let prev_toggled = this._toggled
                elements[i].fm._toggled = toggled
                update_switch(elements[i])
                elements[i].fm.on_toggle(new CustomEvent("toggle", {prev_toggled}), elements[i])
            }
        })

        elements[i].fm.toggle = () => {elements[i].fm.toggled = !elements[i].fm.toggled}
        elements[i].fm.on_toggle = (e, sw) => {}

        // Add Event Listeners
        elements[i].addEventListener("mousedown", (e) => {press_handle(e, elements[i])})
        elements[i].addEventListener("mouseup", (e) => {release_handle(e, elements[i])})
        elements[i].addEventListener("mouseleave", (e) => {cancel_toggle(e, elements[i])})
        elements[i].addEventListener("dragstart", (e) => {cancel_toggle(e, elements[i])})

        window.addEventListener("keydown", (e) =>
        {
            if(document.activeElement === elements[i] && e.code === "Enter")
            {
                elements[i].fm.toggle()
            }
        })

        // Initial Switch Update
        update_switch(elements[i], true)
    }
}

function update_switch(switch_, skip_animation = false)
{
    // Animation
    if(!skip_animation)
    {
        const toggle_duration = parseFloat(getComputedStyle(switch_).getPropertyValue("--animation-duration-switch-toggle"))
        switch_.classList.add("base_switch_toggling")

        if(TIMEOUT_MAP.has(switch_))
        {
            window.clearTimeout(TIMEOUT_MAP.get(switch_))
            TIMEOUT_MAP.delete(switch_)
        }

        const id = window.setTimeout(() =>
        {
            switch_.classList.remove("base_switch_toggling")
            TIMEOUT_MAP.delete(switch_)
        }, toggle_duration * 1000)

        TIMEOUT_MAP.set(switch_, id)
    }

    switch_.fm.elements.handle.classList.remove("base_switch_handle_on_press")
    switch_.classList.toggle("base_switch_toggled", switch_.fm.toggled)

    //Icon
    if(switch_.fm.elements.handle_icon_off || switch_.fm.elements.handle_icon_on)
    {
        switch_.fm.elements.handle.classList.remove("base_switch_handle_with_icon")

        if(switch_.fm.elements.handle_icon_off)
        {
            switch_.fm.elements.handle_icon_off.style.opacity = switch_.fm.toggled ? "0%" : "100%"

            if(!switch_.fm.toggled)
            {
                switch_.fm.elements.handle.classList.add("base_switch_handle_with_icon")
            }
        }

        if(switch_.fm.elements.handle_icon_on)
        {
            switch_.fm.elements.handle_icon_on.style.opacity = switch_.fm.toggled ? "100%" : "0%"

            if(switch_.fm.toggled)
            {
                switch_.fm.elements.handle.classList.add("base_switch_handle_with_icon")
            }
        }
    }
}

function press_handle(e, switch_)
{
    if(e.button === 0 && switch_.fm.enabled)
    {
        switch_.classList.remove("base_switch_toggling")
        switch_.fm.elements.handle.classList.add("base_switch_handle_on_press")
    }
}

function release_handle(e, switch_)
{
    if(switch_.fm.elements.handle.classList.contains("base_switch_handle_on_press") && switch_.fm.enabled)
    {
        switch_.fm.toggled = !switch_.fm.toggled
    }
}

function cancel_toggle(e, switch_)
{
    switch_.fm.elements.handle.classList.remove("base_switch_handle_on_press")
}