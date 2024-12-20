window.addEventListener("load", init)

function init()
{
    const elements = document.getElementsByClassName("base_button")

    for(let i = 0; i < elements.length; i++)
    {
        let keys = elements[i].attributes["keys"]
        let click_callback = elements[i].onclick

        if(keys && keys.value && click_callback)
        {
            keys = keys.value.substring(1, keys.value.length-1).replaceAll(/( )|(')/g, "").split(",")

            window.addEventListener("keyup", (event) =>
            {
                if(keys.includes(event.code))
                {
                    click_callback.apply(elements[i])
                }
            })
        }
    }
}