function onEnterNode(node) {
    console.log(node);
    document.getElementById('details').style.display = "block";
    document.getElementById('name').innerHTML = "Node: " + node.data.name;
    document.getElementById('trigger').innerHTML = (node.data.cond == undefined || node.data.cond == "") ? "NO TRIGGER" : determineTriggerType(node.data.cond);
    document.getElementById('type').innerHTML = (node.data.output == undefined || node.data.output.length === 0) ? "NO OUTPUT" : node.data.output.toString();
    document.getElementById('events').innerHTML = node.data.events ? "YES (" + node.data.eventnames.toString() + ")" :"NO";
    document.getElementById('conres').innerHTML = node.data.condResp ? "YES" :"NO";
    document.getElementById('slots').innerHTML = node.data.slots ? "YES" :"NO";
}

export function onExitNode() {
    //document.getElementById('details').style.display = "none";
    document.getElementById('name').innerHTML = "Node Info";
    document.getElementById('trigger').innerHTML = "";
    document.getElementById('type').innerHTML = "";
    document.getElementById('events').innerHTML = "";
    document.getElementById('conres').innerHTML = "";
    document.getElementById('slots').innerHTML = "";
    document.getElementById('path').innerHTML = "";
}


function determineTriggerType(input) {
    let indicator = input.charAt(0);
    let type = "";
    switch (indicator) {
        case '#':
            type = "INTENT"
            break;
        case '@':
            type = "ENTITY"
            break;
        case '$':
            type = "CONTEXT VARIABLE"
            break;
    }
    return type === "" ? input.slice(1) : input.slice(1) + " ("+ type + ")"
}

export function hover(n) {
    onEnterNode(n);
    let temp = n
    let path = []
    do{
        path.push(temp.data.name)
        temp = temp.parent
    } while(temp.parent !== null)
    path.push("root")
    setPath(path.reverse())
}

function setPath(arr){
    let text = arr.toString().split(",").join(" > ")
    document.getElementById('path').innerHTML = text;
}