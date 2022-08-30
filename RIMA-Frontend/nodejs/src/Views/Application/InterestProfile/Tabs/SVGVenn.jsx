import React from "react"
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Menu,
    MenuItem,
    Button
} from "@material-ui/core";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WikiDesc from "./WikiDesc";

const SVGVenn = (props) => {
    const { userInterest, authorInterest, authorName, userName } = props;
    let bothInterest = [];
    let posUser = 174;
    let posAuthor = 374;
    let radUser = 100;
    const yPosText = 15;
    let posTextBoth = 0;
    const [state, setState] = useState({
        event: null,
        currTarg: null,
        openLearn: false,
        eventOnlyLearn: null
    });
    //userInterest = ["interest 1", "interest 2", "interest 3", "interest 4"];
    //authorInterest = ["interest 1", "interest 2", "interest ", "interest "];
    const handleClick = (event) => {
        let currTarg = event.currentTarget.innerHTML;

        setState({ ...state, event: event.currentTarget, currTarg: currTarg });
    };

    const handleClickOnlyLearn = (event) => {
        let currTarg = event.currentTarget.innerHTML;

        setState({
            ...state,
            eventOnlyLearn: event.currentTarget,
            currTarg: currTarg
        });
    };

    const handleClose = () => {
        setState({ ...state, event: null, openLearn: false, eventOnlyLearn: null });
    };

    const handleLearnMore = () => {
        console.log(state);

        setState({ ...state, event: null, openLearn: true });
    };

    const handleAdd = () => {
        let msg = "The interest " + state.currTarg + " has been saved";
        toast.success(msg, {
            toastId: "removedLevel2"
        });
        handleClose();
    };

    userInterest.map((u) => {
        if (authorInterest.includes(u)) {
            bothInterest.push(u);
        }
    });
    const radAuthor = radUser * (authorInterest.length / userInterest.length);

    if (bothInterest.length != 0) {
        posAuthor =
            posAuthor - (bothInterest.length / userInterest.length) * radAuthor;
        posUser = posUser + (bothInterest.length / userInterest.length) * radUser;
        posTextBoth = (posUser + posAuthor) * 0.5;
        console.log(posAuthor, posUser, posTextBoth);

        if (bothInterest.length == userInterest.length) {
            posTextBoth = 300;
            posAuthor = 300;
            posUser = 300;
            console.log(posUser, "test");
            //posAuthor=230
        } else if (bothInterest.length == authorInterest.length) {
            posAuthor = 300;
            posUser = 300;
            posTextBoth = 300;
            console.log("test");
        }
    } else {
        posAuthor = posAuthor + 10;
        posUser = posUser - 10;
    }

    return (
        <>
            <svg height="500" width="600">
                <circle
                    cx={posUser}
                    cy="130"
                    r="100"
                    fill="darkorange"
                    stroke="black"
                    class="circle"
                ></circle>

                <circle
                    cx={posAuthor}
                    cy="130"
                    r={radAuthor}
                    fill="darkblue"
                    stroke="black"
                    class="circle"
                ></circle>
                <text fill="#522D00">
                    {userInterest.map((u, i) => {
                        if (!authorInterest.includes(u)) {
                            return (
                                <tspan
                                    class="text"
                                    x={posUser - 80}
                                    y={100 + yPosText * i}
                                    onClick={handleClickOnlyLearn}
                                >
                                    {u}
                                </tspan>
                            );
                        }
                    })}
                </text>
                <text fill="black">
                    {authorInterest.map((u, i) => {
                        if (!userInterest.includes(u)) {
                            return (
                                <tspan
                                    class="text"
                                    x={posAuthor}
                                    y={100 + yPosText * i}
                                    onClick={handleClick}
                                >
                                    {u}
                                </tspan>
                            );
                        }
                    })}
                </text>
                <text fill="white">
                    {bothInterest.map((u, i) => {
                        return (
                            <tspan
                                class="text"
                                x={posTextBoth - 50}
                                y={100 + yPosText * i}
                                onClick={handleClickOnlyLearn}
                            >
                                {u}
                            </tspan>
                        );
                    })}
                </text>
                <text>
                    <tspan x={25} y={50} fill="darkorange">
                        {userName}
                    </tspan>
                    <tspan x={450} y={50} fill="darkblue">
                        {authorName}
                    </tspan>
                </text>
            </svg>
            <Menu
                id="simple-menu"
                anchorEl={state.event}
                keepMounted
                open={Boolean(state.event)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleLearnMore}>Learn More</MenuItem>
                <MenuItem onClick={handleAdd}>Add to my interests</MenuItem>
            </Menu>

            <Menu
                id="simple-menu"
                anchorEl={state.eventOnlyLearn}
                keepMounted
                open={Boolean(state.eventOnlyLearn)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleLearnMore}>Learn More</MenuItem>
            </Menu>

            <Dialog open={state.openLearn} onClose={handleClose}>
                {state.currTarg != null ? (
                    <DialogTitle>Learn More about {state.currTarg}</DialogTitle>
                ) : (
                    <DialogTitle>Learn more</DialogTitle>
                )}
                <DialogContent>
                    {" "}
                    <WikiDesc data={state.currTarg} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
        </>
    );
};

export default SVGVenn;
