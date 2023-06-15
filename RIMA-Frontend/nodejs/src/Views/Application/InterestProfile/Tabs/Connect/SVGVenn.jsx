import React, {useEffect} from "react"
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
import RestAPI from "../../../../../Services/api";
import {Loading} from "../Loading";

const SVGVenn = (props) => {
    const { authorInterest, authorName, userName } = props;
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
        eventOnlyLearn: null,
        currPageData:false,
        pageData:false
    });
    const [currPageData, setCurrPageData]=useState(false)
    const [userInterest, setUserInterest]=useState([])
    const [keywords, setKeywords]=useState([])
    //userInterest = ["interest 1", "interest 2", "interest 3", "interest 4"];
    //authorInterest = ["interest 1", "interest 2", "interest ", "interest "];

    let currentUser = JSON.parse(localStorage.getItem("rimaUser"));

    const fetchKeywords = async () => {
        //setState({...state,userInterests: []})

        const response = await RestAPI.longTermInterest(currentUser);
        const {data} = response;
        let dataArray = [];
        let interests = []
        data.map((d) => {
            //console.log(d, "test")
            interests.push(d.keyword)
            const {id, categories, original_keywords, original_keywords_with_weights, source, keyword, weight, papers} = d;
            let newData = {
                id: id,
                categories: categories,
                originalKeywords: original_keywords,
                originalKeywordsWithWeights: original_keywords_with_weights,
                source: source,
                text: keyword,
                value: weight,
                papers: papers,
            };
            dataArray.push(newData);

        })
        setKeywords(dataArray)

        return interests

    };

    const getData = async () => {
        let interests=await fetchKeywords()
        console.log(interests, "test explore.py get data")
        if (interests) {
            setUserInterest(interests)
            let allInterests=interests.concat(authorInterest)
            /*let pageData=await RestAPI.getWikiInfo({interests:allInterests})
            setState({...state, pageData: pageData})
            console.log(allInterests, pageData, "wiki test allinterestest")*/
        }
    }

    const validateInterest = (interests, interest) => {
        console.log("test add new interest validatat", interest)
        return interests.some((i) => i.text === interest.toLowerCase());
    };

    const addNewInterest = async (currInterest) => {
        console.log("test add discover", keywords)
        let alreadyExist = validateInterest(keywords, currInterest);

        if (!alreadyExist) {
            console.log("test done it")
            let newInterests = keywords;
            let newInterest = {
                id: Date.now(),
                categories: [],
                originalKeywords: [],
                source: "Manual",
                text: currInterest.toLowerCase(),
                value: 3,
            }
            newInterests.push(newInterest);

            newInterests.sort((a, b) => (a.value < b.value) ? 1 : ((b.value < a.value) ? -1 : 0));
            let listOfInterests = [];
            newInterests.forEach(interest => {
                let item = {
                    name: interest.text,
                    weight: interest.value,
                    id: interest.id,
                    source:interest.source
                }
                listOfInterests.push(item);
            });
            console.log("Updated list", listOfInterests)
            try {
                await RestAPI.addKeyword(listOfInterests);
            } catch (err) {
                console.log(err);
            }
            // console.log(newInterests)
        }
        console.log("Interest already exists in my list!")
    }

    useEffect(()=>{
        getData()
    },[])

    const handleClick = (event) => {
        let currTarg = event.currentTarget.innerHTML;
        getPageDataCurr(currTarg)



        setState({ ...state, event: event.currentTarget, currTarg: currTarg });
    };

    const getPageDataCurr = async (target)=>{

        const dataPage={"interest":target}
        const response = await RestAPI.getWikiInfo(dataPage)

        const {data} = response

        const pageData={
            pageData:data.data.summary,
            url:data.data.url
        }

        setCurrPageData(pageData)


    }

    const handleClickOnlyLearn = (event) => {

        let currTarg = event.currentTarget.innerHTML;
        getPageDataCurr(currTarg)

        setState({
            ...state,
            eventOnlyLearn: event.currentTarget,
            currTarg: currTarg
        });
    };

    const handleClose = () => {
        setState({ ...state, event: null, openLearn: false, eventOnlyLearn: null});
        setCurrPageData(false)
    };

    const handleLearnMore = () => {
        console.log(state);

        setState({ ...state, event: null, openLearn: true });
    };

    const handleAdd = () => {
        let msg = "The interest " + state.currTarg + " has been added to your interest profile";
        toast.success(msg, {
            toastId: "removedLevel2"
        });
        addNewInterest(state.currTarg)
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
            {userInterest.length !== 0?<svg height="500" width="600">
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
            </svg>:<Loading/>}
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
                    {currPageData?<WikiDesc data={currPageData}/>:<Loading/>}
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>

        </>
    );
};

export default SVGVenn;
