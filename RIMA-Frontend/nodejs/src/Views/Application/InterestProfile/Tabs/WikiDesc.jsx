import React, { useEffect, useRef, useState } from "react";

import { Typography, Link } from "@material-ui/core";

const WikiDesc = (props) => {
    const { data } = props;

    let text = data.pageData;
    console.log(data)

    if (text.length > 800) {
        text = text.substring(0, 800) + "...";
    }
    return (
        <>
            <Typography>
                {text}{" "}
                <Link href={data.url} target="_blank">
                    Learn more
                </Link>
            </Typography>
        </>
    );
};
export default WikiDesc;
