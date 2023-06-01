import * as React from "react";
import ConnectedGraph from "./ConnectedGraph"
import {CircularProgress, Grid, Typography, Box, TextField, Button, Dialog, DialogContent} from "@material-ui/core";
import {useEffect, useState} from "react";
import RestAPI from "../../../../../Services/api";
import Help from "./Help"
import FilterListIcon from "@material-ui/icons/FilterList";
import MoreFilters from "./MoreFilters"

export default function Connect (props) {
    const [data, setData] = useState(props.data)
    console.log(data, "const")
    console.log(data, "useState")
    const [dataCollected, setDataCollected]=useState(false)
    const [myInterests, setMyInterests]=useState([])
    const [noa, setNoa] = useState(3)
    const [fetching, setFetch] = useState(true)
    let currentUser = JSON.parse(localStorage.getItem("rimaUser"));
    console.log("test", fetching)

    //ChatGPT
    const submitNumber = async() => {
        if(!fetching){
        setFetch(true)
        console.log("submit")
        setDataCollected(false);
        RestAPI.getConnectData({ data: currentUser.author_id, noa })
          .then((res) => {
            const {data}=res
            setData(data.data)
            console.log(data, "useState2")
          })
          .catch((error) => {
            console.log("Error fetching data:", error);
          });
        
        }
      };
 
    useEffect(()=>{
        
        if(data.length===0){
            setData(props.data)
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
            setFetch(false)
        }


    },[data,props])

   
    const [open, setOpen] = useState(false)

    const handleMoreFilters = () => {
        setOpen(true);
    }
    const closeFilter = () => {
        setOpen(false);
    } 


    console.log(data, "const3")
    return (
        <>
            <Help/>
            <Grid container>
              <Grid item xs ={12} style={{padding:"8px"}}>
              {dataCollected?
              <>
                    <Box display="flex" justifyContent="flex-end" alignItems="flex-end">
                        <TextField  id="noa"
                        label="Number"
                        type="number"
                        variant="outlined"
                        size="small"
                        onChange = {(e) => setNoa(parseInt(e.target.value, 10))}
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
                        <Button startIcon={<FilterListIcon/>} color="primary" onClick={handleMoreFilters} >
                            MORE
                        </Button>
                        <Dialog open={open} onClose={closeFilter} maxWidth="md" fullWidth>
                            <DialogContent>
                                <MoreFilters onClose={closeFilter} />
                            </DialogContent>
                        </Dialog>
                    </Box>
                    
                        <ConnectedGraph data={data} myInterests={myInterests}/>
                </>     :<Loading/>
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


