import { Checkbox } from "@mui/material"

const ServiceOptions = () => {
    return (
        <div id="settings-modal" className="modal">
            <h4>Select your streaming service providers:</h4>
            <form>
                <Checkbox name="netflix" label="Netflix" />
                <Checkbox name="hulu" label="Hulu" />
                <Checkbox name="prime" label="Amazon Prime" />
                <Checkbox name="hbomax" label="HBO MAX" />
                <Checkbox name="disney" label="Disney+" />
            </form>

        </div>
    )
}

export default ServiceOptions
