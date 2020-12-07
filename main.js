console.log("hey")

fetch(`test.json`).then((response) => {
    return response.json();
}).then((data) => {
    console.log(data);
    let result = flattenData(data);
    console.log("json to flatten data ",result);

    result.map((items)=>{
        items.keys = items.keys.split(",");
    })
    
    let reverseResult = createNestedJson(JSON.parse(JSON.stringify(result)));
    console.log("flatten data to json ",reverseResult);
}).catch((err) => {
    console.warn('json file not loaded.', err);
});

var createNestedJson=(data)=>{
    if (data.length==0) {
        //console.log(data);
        return;
    }

    if (data[0].keys.length==0){
        //console.log("final value "+data[0].value);
        return data[0].value;
    }

    //console.log(data);

    
    let groupBater = data[0].keys[0];

    let result = {};
    let secondResult = {};

    let firstGroup = data.filter((items)=>{
        return items.keys.indexOf(groupBater)==0;
    })

    let secondGroup = data.filter((items)=>{
        return items.keys.indexOf(groupBater)!=0;
    });

    firstGroup.map((items)=>{
        items.keys.shift();
    });


    //console.log(firstGroup);

    //console.log(secondGroup);

    result[groupBater] = createNestedJson(firstGroup);
    secondResult = createNestedJson(secondGroup);

    return {...result,...secondResult};
}

var flattenData=(data)=>{
    
    let result=[];
    for (let props in data){
        let value = data[props];

        if (typeof(value)=="string"){
            result.push({
                keys: props,
                value: value
            });
            continue;
        }

        let tempResult = flattenData(value);

        tempResult.map((items)=>{
                items.keys=props+","+items.keys;
        });
        result=result.concat(tempResult);
    }
    return result;
}