// setup our chart
const svgWidth=960;
const svgHeight=500;

const margin={
    t:20,
    r:40,
    b:80,
    l:100
};
const width=svgWidth-margin.l-margin.r;
const height=svgHeight-margin.t-margin.b;
// Create an SVG wrapper, append an svg that will hold our chart and shift the latter by left and top margins

const svg=d3.select('#scatter').classed('chart',true)
.append("svg")
.attr("width",svgWidth)
.attr("height",svgHeight);
// append an svg group
                                                                                                                                                                                                 
const chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.l}, ${margin.t})`);
// set the default axis


let chooseXaxis="poverty";

let chooseYaxis="healthcare";

d3.csv("./assets/data/data.csv").then(function(data){
    
    
	data.forEach( d =>{
        d.poverty = +d.poverty;
		d.age = +d.age;
		d.income = +d.income;
		d.obesity = +d.obesity;
		d.smokes = +d.smokes;
		d.healthcare = +d.healthcare;
    });
// define scale functions(range)

let xLinearScale=xScale(data,chooseXaxis);

let yLinearScale=yScale(data,chooseYaxis);
// define axis functions


const bottomAxis=d3.axisBottom(xLinearScale);

const leftAxis=d3.axisLeft(yLinearScale);

// create x-axis


let xAxis=chartGroup.append("g")
    .classed("x-axis",true)
    .attr("transform",`translate(0,${height})`)
    .call(bottomAxis);
// create y-axis

let yAxis=chartGroup
    .append("g")
    .call(leftAxis);

// create chart

let circlesGroup=chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx",d=>xLinearScale(d[chooseXaxis]))
    .attr("cy",d=>yLinearScale(d[chooseYaxis]))
    .attr("r",8)
    .attr("fill","lightblue")

// create state labels

    
let circlesText = chartGroup.append('g').selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .classed('circlesText',true)
    .attr('x', d => xLinearScale(d[chooseXaxis]))
    .attr('y', d => yLinearScale(d[chooseYaxis]))
    .attr('transform','translate(0,4.5)')
	 .text(d => d.abbr)
    .attr("text-anchor" , "middle")
    .attr("font-size", "8px")
    .attr("fill", "black"); 
    
    // add labels to x and y axes
    
const xLabelsGroup=chartGroup.append("g")
    .attr("transform",`translate(${width/2},${height+20})`);

 const povertyLabel=xLabelsGroup.append("text")
    .attr("x",0)
    .attr("y",20)
    .attr("value","poverty")
    .classed("active",true)
    .text("In Povert (%)");
const ageLabel=xLabelsGroup.append("text")
    .attr("x",0)
    .attr("y",40)
    .attr("value","age")
    .classed("active",true)
    .text("Age (Median)");
const incomeLabel=xLabelsGroup.append("text")
    .attr("x",0)
    .attr("y",60)
    .attr("value","income")
    .classed("active",true)
    .text("HouseHold Income(Median)");

const yLabelsGroup=chartGroup.append("g");

const healthcareLabel=yLabelsGroup.append("text")
.attr("transform", `translate(-40,${height / 2})rotate(-90)`)
    .attr("value","healthcare")
    .classed("active",true)
    .text("Lacks Heathcare(%)")

const smokesLabel=yLabelsGroup.append("text")
.attr("transform", `translate(-60,${height / 2})rotate(-90)`)
    .attr("value","smokes")
    .classed("active",true)
    .text("Smokes(%)")

const obesityLabel=yLabelsGroup.append("text")
.attr("transform", `translate(-80,${height / 2})rotate(-90)`)
    .attr("value","obesity")
    .classed("active",true)
    .text("Obesity(%)")

circlesGroup=updateToolTip(chooseXaxis,chooseYaxis,circlesGroup,circlesText);
circlesText=updateToolTip(chooseXaxis,chooseYaxis,circlesGroup,circlesText);
// change the x axis's status from inactive to active when clicked and change all active to inactive

xLabelsGroup.selectAll("text")
 .on("click",function(){
     const  value= d3.select(this).attr("value");
     if (value !==chooseXaxis){
         chooseXaxis=value;
         xLinearScale=xScale(data,chooseXaxis);
         xAxis=renderxAxis(xLinearScale,xAxis);
         d3.selectAll(".circlesText")
         .transition()
         .duration(1000)
         .attr("x", function (d) {
             return xLinearScale(d[chooseXaxis]);
         });
    circlesGroup = renderxCircles(circlesGroup, xLinearScale, chooseXaxis);
    
        // updates tooltips with new info
    circlesGroup = updateToolTip(chooseXaxis, chooseYaxis,circlesGroup,circlesText);
    circlesText = updateToolTip(chooseXaxis, chooseYaxis,circlesGroup,circlesText)
        // changes classes to change bold text
    if (chooseXaxis === "poverty") {
        povertyLabel
        .classed("active", true)
        .classed("inactive", false);
        ageLabel
        .classed("active",false)
        .classed("inactive",true)
         incomeLabel
        .classed("active",false)
        .classed("inactive",true)
        }
    else if (chooseXaxis === 'age'){
    povertyLabel
        .classed('active', false)
        .classed('inactive', true);
    incomeLabel
        .classed('active', false)
        .classed('inactive', true);
    ageLabel
        .classed('active', true)
        .classed('inactive', false);
            }
	else {
    povertyLabel
        .classed('active', false)
        .classed('inactive', true);
    incomeLabel
        .classed('active', true)
        .classed('inactive', false);
    ageLabel
        .classed('active', false)
        .classed('inactive', true);
        }
}
})
// change the y axis's status from inactive to active when clicked and change all active to inactive

yLabelsGroup.selectAll("text")
 .on("click",function(){
     const  value= d3.select(this).attr("value");
    if (value !==chooseYaxis){
    chooseYaxis=value;
    yLinearScale=yScale(data,chooseYaxis);
    yAxis=renderyAxis(yLinearScale,yAxis);
    d3.selectAll(".circlesText")
         .transition()
         .duration(1000)
         .attr("y", function (d) {
             return yLinearScale(d[chooseYaxis]);
         });

    circlesGroup = renderyCircles(circlesGroup,yLinearScale,chooseYaxis);
    

// updates tooltips with new info
    circlesGroup = updateToolTip(chooseXaxis, chooseYaxis,circlesGroup,circlesText);
    circlesText=updateToolTip(chooseXaxis, chooseYaxis,circlesGroup,circlesText);

        // changes classes to change bold text
     if (chooseYaxis === "healthcare") {
    healthcareLabel
        .classed("active", true)
        .classed("inactive", false);
    obesityLabel
        .classed('active', false)
        .classed('inactive', true);
    smokesLabel
        .classed('active', false)
        .classed('inactive', true);
    }
    else if (chooseYaxis === 'smokes'){
    healthcareLabel
        .classed('active', false)
        .classed('inactive', true);
    obesityLabel
        .classed('active', false)
        .classed('inactive', true);
    smokesLabel
        .classed('active', true)
        .classed('inactive', false);

        }
    else  
    {
    healthcareLabel
        .classed('active', false)
        .classed('inactive', true);
    obesityLabel
        .classed('active', true)
        .classed('inactive', false);
    smokesLabel
        .classed('active', false)
        .classed('inactive', true);

        }
    }
 })
});
    // set domain for the axes


function xScale(data,chooseXaxis){
    const xLinearScale=d3.scaleLinear()
    .domain([d3.min(data,d=>d[chooseXaxis])*0.8,
    d3.max(data,d=>d[chooseXaxis])*1.2
    ])
    .range([0,width]);
    return xLinearScale;
    }
    
    
function yScale(data,chooseYaxis){
    const yLinearScale=d3.scaleLinear()
    .domain([d3.min(data,d=>d[chooseYaxis])*0.8,
    d3.max(data,d=>d[chooseYaxis])*1.2
    ])
    .range([height,0]);
    return yLinearScale;
    }
function renderxAxis(newXscale,xAxis){
    const bottomAxis=d3.axisBottom(newXscale);
    xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

    return xAxis;
    }
function renderyAxis(newYscale,yAxis){
    const leftAxis=d3.axisLeft(newYscale);
    yAxis.transition()
    .duration(1000)
    .call(leftAxis);
    
        return yAxis;
    }
function renderxCircles(circlesGroup,newXscale,chooseXaxis,){
    circlesGroup.transition()
    .duration(1000)
    .attr("cx",d=>newXscale(d[chooseXaxis]))
     
    return circlesGroup;
    }
function renderyCircles(circlesGroup,newYscale,chooseYaxis){
        circlesGroup.transition()
        .duration(1000)
        .attr("cy",d=>newYscale(d[chooseYaxis]));
        return circlesGroup;
        }
 // assign the tooltip to the current axis

function updateToolTip(chooseXaxis,chooseYaxis,circlesGroup,circlesText){
        const toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(d=>{
            let valueX=+d[chooseXaxis];
            let valueY=+d[chooseYaxis];
            let labelX;
            let labelY;
            if (chooseXaxis==="poverty" ){
                labelX="Poverty"
                if (chooseYaxis==="healthcare")
                    labelY="Healthcare"
                    else if(chooseYaxis==="smokes")
                        labelY="Smokes"
                        else
                        labelY="Obesity"
                        return(`${d.state}<br>${labelY}:${valueY}%<br>${labelX}:${valueX}%`)
            }
            else if (chooseXaxis==="age" ){
                labelX="age"
                if (chooseYaxis==="healthcare")
                    labelY="Healthcare"
                    else if(chooseYaxis==="smokes")
                        labelY="Smokes"
                        else
                        labelY="Obesity"
                        return(`${d.state}<br>${labelY}:${valueY}%<br>${labelX}:${valueX}%`)
            } 
            else{
                labelX="income"
                if (chooseYaxis==="healthcare")
                    labelY="Healthcare"
                    else if(chooseYaxis==="smokes")
                        labelY="Smokes"
                        else
                        labelY="Obesity"
                        return(`${d.state}<br>${labelY}:${valueY}%<br>${labelX}:${valueX}%`)
            } 
                         
                    
           
    
         });
        
    circlesGroup.call(toolTip);
    circlesGroup.on("mouseover",toolTip.show).on("mouseout",toolTip.hide);
    return circlesGroup;
     };