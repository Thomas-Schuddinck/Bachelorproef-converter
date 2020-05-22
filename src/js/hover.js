export function onEnterNode(node){
    console.log(node);
    document.getElementById('details').style.display = "block";
    document.getElementById('name').innerHTML = "Node: " + node.data.name;
    document.getElementById('trigger').innerHTML = (node.data.cond == undefined || node.data.cond == "" ) ? "GEEN TRIGGER" : node.data.cond;
    document.getElementById('type').innerHTML = (node.data.output == undefined || node.data.output.length === 0 ) ? "GEEN OUTPUT" : node.data.output.toString();
}

export function onExitNode(){
    //document.getElementById('details').style.display = "none";
    document.getElementById('name').innerHTML = "Node Info";
    document.getElementById('trigger').innerHTML = "";
    document.getElementById('type').innerHTML = "";
}
