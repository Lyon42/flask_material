let COLOR_SCHEME_TOGGLING_TIMEOUT_ID = null

window.addEventListener("load", () => window.setTimeout(fm_init, 0))
window.addEventListener("fm_pre_init", add_fm_data)
window.addEventListener("fm_post_init", remove_no_initial_animation_class)
update_dark_mode(false, true)

function fm_init()
{
    window.dispatchEvent(new Event("fm_pre_init"))
    window.dispatchEvent(new Event("fm_component_init"))
    window.dispatchEvent(new Event("fm_init"))
    window.dispatchEvent(new Event("fm_post_init"))
}

function add_fm_data()
{
    let components = document.getElementsByClassName("fm_component")

    for(let i = 0; i < components.length; i++)
    {
        components[i].fm = {type: "none",
                            _enabled: true,
                            set enabled(enabled)
                            {
                                this._enabled = enabled
                                this.focusable = this.focusable // Causes tabindex attribute to update
                                this.elements.root.classList.toggle("disabled", !enabled)
                            },
                            get enabled() {return this._enabled},

                            _focusable: true,
                            set focusable(focusable)
                            {
                                this._focusable = focusable
                                this.elements.focus_element.setAttribute("tabindex", focusable && this.enabled ? "0" : "-1")
                            },
                            get focusable() {return this._focusable},

                            elements: {root: components[i], focus_element: components[i]}}
    }
}

function remove_no_initial_animation_class()
{
    const elements = document.getElementsByClassName("no-initial-animation");

    while(elements.length > 0)
    {
        elements[0].classList.remove("no-initial-animation")
    }
}

function update_dark_mode(dark_mode_activated = null, prevent_animation = false)
{
    if(dark_mode_activated != null)
    {
        localStorage.dark_mode = dark_mode_activated
    }

    if(!prevent_animation)
    {
        if(COLOR_SCHEME_TOGGLING_TIMEOUT_ID != null)
        {
            window.clearTimeout(COLOR_SCHEME_TOGGLING_TIMEOUT_ID)
        }

        const toggle_duration = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--animation-duration-dark-mode"))
        COLOR_SCHEME_TOGGLING_TIMEOUT_ID = window.setTimeout(() =>
        {
            document.documentElement.classList.remove("color_scheme_toggling")
            COLOR_SCHEME_TOGGLING_TIMEOUT_ID = null
        }, toggle_duration * 1000)
        document.documentElement.classList.add("color_scheme_toggling")
    }

    document.documentElement.classList.toggle("color_scheme_light", localStorage.dark_mode === "false")
    document.documentElement.classList.toggle("color_scheme_dark", localStorage.dark_mode === "true")
}

function toggle_dark_mode()
{
    update_dark_mode(localStorage.dark_mode === "true" ? "false" : "true");
}

window.base_functions = {update_dark_mode, toggle_dark_mode}