import React from "react"
import Header from "./Header";
import PublicationList from "./PublicationList";

const WhyInterest = (props) => {
    const {papers} = props
    console.log("test ", papers)
    return(
        <>
            <Header/>
            {papers.map((paper) => {
                return <PublicationList publication={paper} />;
            })}
        </>
    )
}

export default WhyInterest