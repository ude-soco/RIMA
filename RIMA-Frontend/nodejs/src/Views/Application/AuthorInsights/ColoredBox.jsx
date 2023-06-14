import React from "react";

const ColoredBox = ({ confColor }) => {
    console.log("`${setColor}`",`${confColor.setColor}`)
    return (
<div className="card text-white mb-3" style={{ maxWidth: "fit-content", backgroundColor: confColor.setColor }}>
            <div className="card-body">
                <p className="card-text-black" style={{color:'black'}}>{confColor.setName}</p>
            </div>   
        </div>
    )
}
export default ColoredBox