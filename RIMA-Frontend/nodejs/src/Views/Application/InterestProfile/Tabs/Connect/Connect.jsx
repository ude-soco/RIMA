import * as React from "react";
import ConnectedGraph from "./ConnectedGraph"
import {CircularProgress, Grid, Typography, Box, TextField, Button, Dialog, DialogContent,IconButton,Tooltip } from "@material-ui/core";
import {useEffect, useState} from "react";
import RestAPI from "../../../../../Services/api";
import Help from "./Help"
import MoreFilters from "./MoreFilters"

export default function Connect (props) {
    const [data, setData] = useState(props.data)
    //console.log(data.selectedNames, "const")
    //console.log(data, "useState")
    const [dataCollected, setDataCollected]=useState(false)                  //Statevar whether data is collected or not
    const [myInterests, setMyInterests]=useState([])
    const [noa, setNoa] = useState(data.noa ? data.noa: 3)                   //Number of Authors (consistent)
    const [papers, setPapers] = useState(true)                               //fetch papers
    const [fetching, setFetch] = useState(true)                              //Statevar so data only gets fetch on at a time
    const [firstLoad, setFirstLoad] = useState(true)                         //Statevar if its the first loadup of the page
    const [changed, setChange] = useState(false)                             //Statevar if filter got changed
    const [selectedNames, setSelectedNames] = useState([data.selectedNames]) //List of filterd Authors
    const [help, setHelp] = useState(false)                                  //statevar for helpwindow
    const [open, setOpen] = useState(false)                                  //statevar for filters
    let currentUser = JSON.parse(localStorage.getItem("rimaUser"));
    //console.log("test", fetching)

    //Number of Authors gets submited an refetched with new amount
    const submitNumber = async() => {
        if(!fetching){
        setFetch(true)              //Statevar
        //console.log("submit")
        setDataCollected(false);    //show loading screen
        setFirstLoad(false)            //Statevar
        RestAPI.getConnectData({data: currentUser.author_id, noa, selectedNames, papers})   //api call
          .then((res) => {
            const {data}=res
            setData(data.data)
            //console.log(data, "useState2")
          })
          .catch((error) => {
            console.log("Error fetching data:", error);
          });
        
        }
      };
 
    useEffect(()=>{
        //console.log(selectedNames, "selectedNames in Connect------------------------------");
       if(data.length===0){                        //define data
            setData(props.data)
            setDataCollected(false)
        }
        else{
            setDataCollected(true)
            setFetch(false)
        }
        RestAPI.longTermInterest(currentUser).then(res=>{ //call api and fetch data
            const {data} =res
            let interests = []
            data.map((d)=>{
                interests.push(d.keyword)
            })
            setMyInterests(interests)
        })
    },[data,props,selectedNames])

   
    

    const handleMoreFilters = () => { //open filter menu
        setOpen(true);
    }
    const closeFilter = () => {
       if(firstLoad || changed){    //prevent new api calls althoug no filters are done
        submitNumber()
        setChange(false)}
        setOpen(false);
    } 

    const handleSelectedNamesChange = (names) => { //add names to filter list
        //console.log(names, "names")
        //console.log(selectedNames.some(item => item === names))
        if((names.some(item => !selectedNames.includes(item)))){setChange(true)} //deselect selected names, only call api if changes are done
        else {setChange(false)}
        setSelectedNames([...names]);
        
    }

    const closeHelp = () => {
        setHelp(false);
    }
    /*console.log(selectedNames, "SlectedNames Connect")
    console.log(help)

    console.log(data, "const3")*/
    return (
        <>

            
            
            <Grid container>
              <Grid item xs ={12} style={{padding:"8px"}}>
            
              
                    {/*if Data is collected show Graph, else loading screen */}            
                    {dataCollected? (
                    
                    <>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Button onClick={setHelp} color="primary">
                      Help
                    </Button>
                    {help ? (
                      <>
                        <Help closeHelp={closeHelp} />
                      </>
                    ) : (
                      <></>
                    )}
                    
                    <Box display="flex"  justifyContent="flex-end" alignItems="center">
                            {/*TextFiled to configure the Number of Authors*/}
                            <TextField id="noa" 
                                label="Number"
                                type="number"
                                variant="outlined"
                                size="small"
                                onChange={(e) => setNoa(parseInt(e.target.value, 10))}
                                defaultValue={noa ? noa : parseInt(3)}
                                color="primary"
                                style={firstLoad? {width: "12%" } : {width: "25%" }}
                                inputProps={{
                                    min: 0,
                                    max: 10, //max 10, otherwise loading time would be too long
                                    step: 1,
                                }} />
                            <Button onClick={submitNumber} id="submit" color="primary">Submit</Button>
                            <Button color="primary" onClick={handleMoreFilters}>
                                MORE                                
                            </Button>
                            <div>
                                    {firstLoad ? (
                                        <Button disabled>
                                            <Typography color="primary">Please Configure</Typography> {/*small advice on the first loadup of the page*/}
                                        </Button>
                                        
                                    ) : (
                                        <></>
                                    )}
                                    </div>
                            <Dialog open={open} onClose={closeFilter} maxWidth="md" fullWidth>
                                <DialogContent>
                                    <MoreFilters onClose={closeFilter} data={data} onSelectedNamesChange={handleSelectedNamesChange} /> {/*Filter*/}
                                </DialogContent>
                            </Dialog>
                           </Box></Box><ConnectedGraph data={data} myInterests={myInterests} firstLoad={firstLoad} />
                        </>
                        
                        ):(<Loading/>)}
                </Grid>
            </Grid>
          
        </>
      );
      
        
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
                    <Tooltip title="this can take some time"><Typography variant="overline"> Loading data  </Typography></Tooltip>
                </Grid>
            </Grid>
        </>
    )
}


