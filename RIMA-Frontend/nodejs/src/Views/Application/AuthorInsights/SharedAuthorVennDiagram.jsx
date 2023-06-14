import React, { useEffect } from "react";
import Highcharts from 'highcharts'
import VennModule from 'highcharts/modules/venn'

VennModule(Highcharts); // Initialize the Venn module

const SharedAuthorVennDiagram = ({ sets, selectedNode,setsColor }) => {
    console.log("selectedNode: ", selectedNode)
    
    const getColor = (set) => {
        let color = '#808080';
        for (let item of setsColor) {
            const sameSet = set.sets === item.setName;
            const includeSelectedNode = set.label.includes(selectedNode);
            if (sameSet && includeSelectedNode) {
                color = '#1e90ff'
                break;
            } else if (sameSet) {
                color= item.setColor
            }
        }
        console.log("color returned: ",color)
        return color;
    }
    useEffect(() => {
        console.log("Sets: ", sets, "Selected node: ", selectedNode); // Add this line
        Highcharts.chart('venn', {
           
            chart: {
                type: 'venn',
                height: '600px'
            },
            title: {
                text: "Shared conferences"
            },
            plotOptions: {
                venn: {
                    borderWidth: 5,
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}',
                        style: {
                            color: 'black',
                            fontSize: '12px',
                            fontFamily: '',
                            verticalAlign: "middle ",
                            textOverflow: 'ellipsis',
                            padding:10
                        }
                    }
                }
            },
            series: [
                {
                    type: 'venn',
                    colorByPoint: true,
                    data: sets.map(set => ({
                        sets: set.sets,
                        value: set.size,
                        name: set.label,
                        // Highlight the set if its label includes the selected node, else make it grey
                        color:  getColor(set)
                    }))
                }
            ]
        });
       
    }, [sets, selectedNode])
    
    return <div id="venn"/>
}
export default SharedAuthorVennDiagram;




