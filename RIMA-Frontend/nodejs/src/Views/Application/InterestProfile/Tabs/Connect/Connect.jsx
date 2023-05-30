import * as React from "react";
import ConnectedGraph from "./ConnectedGraph"
import {CircularProgress, Grid, Typography, Box, TextField, Button} from "@material-ui/core";
import {useEffect, useState} from "react";
import RestAPI from "../../../../../Services/api";
import Help from "./Help"
import FilterListIcon from "@material-ui/icons/FilterList";

export default function Connect (props) {
    //let {data} = props
    const [data, setData] = useState(props.data)
    console.log(data, "const")
    console.log(data, "useState")
    const [dataCollected, setDataCollected]=useState(false)
    const [myInterests, setMyInterests]=useState([])
    const [noa, setNoa] = useState(3)
    let currentUser = JSON.parse(localStorage.getItem("rimaUser"));
    
    


    //ChatGPT
    const submitNumber = async() => {
        const inputValue = document.getElementById("noa").value;
        const numberOfAuthors = parseInt(inputValue, 10);
      
        setNoa(numberOfAuthors);
        setDataCollected(false);
      
        RestAPI.getConnectData({ data: currentUser.author_id, noa: noa })
          .then((res) => {
            const {data}=res
            setData(data.data)
            console.log(data, "useState2")
          })
          .catch((error) => {
            console.log("Error fetching data:", error);
          });
      };
 
    useEffect(()=>{
        if(data.length===0){
            setDataCollected(false)
        }
        else{
            RestAPI.longTermInterest(currentUser).then(res=>{
                const {data} =res
                let interests = []
                data.map((d)=>{
                    interests.push(d.keyword)
                })
                setMyInterests(interests)
            })
                     

            setDataCollected(true)
        }


    },[data])



    


    console.log(data, "const3")
    return (
        <>
            <Help/>
            <Grid container>
              <Grid item xs ={12} style={{padding:"8px"}}>
                    <Box display="flex" justifyContent="flex-end" alignItems="flex-end">
                        <TextField  id="noa"
                        label="Number"
                        type="number"
                        variant="outlined"
                        size="small"
                        defaultValue = "3"
                        color="primary"
                        style={{ width: "7.5%" }}      
                        inputProps={{
                            min: 0,
                            max: 10,
                            step: 1,
                        }}  
                        />
                        <Button onClick={submitNumber} id="submit" color="primary">Submit</Button>
                        <Button startIcon={<FilterListIcon/>} color="primary" >
                            MORE
                        </Button>
                    </Box>
                    {dataCollected?
                        <ConnectedGraph data={data} myInterests={myInterests}/>:<Loading/>
                    }
             
                </Grid>
            </Grid>
        </>
        )
};

export const Loading = () => {
    return (
        <>
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
            >
                <Grid item>
                    <CircularProgress/>
                </Grid>
                <Grid item>
                    <Typography variant="overline"> Loading data </Typography>
                </Grid>
            </Grid>
        </>
    )
}


