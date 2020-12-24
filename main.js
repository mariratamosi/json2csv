console.log("hey");

fetch(`test.json`)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data);
    let result = flattenData(data);
    console.log("json to flatten data ", result);

    createExcel(result);

    result.map((items) => {
      items.keys = items.keys.split(",");
    });

    let reverseResult = createNestedJson(JSON.parse(JSON.stringify(result)));
    console.log("flatten data to json ", reverseResult);
  })
  .catch((err) => {
    console.warn("json file not loaded.", err);
  });

var createNestedJson = (data) => {
  if (data.length == 0) {
    //console.log(data);
    return;
  }

  if (data[0].keys.length == 0) {
    //console.log("final value "+data[0].value);
    return data[0].value;
  }

  //console.log(data);

  let groupBater = data[0].keys[0];

  let result = {};
  let secondResult = {};

  let firstGroup = data.filter((items) => {
    return items.keys.indexOf(groupBater) == 0;
  });

  let secondGroup = data.filter((items) => {
    return items.keys.indexOf(groupBater) != 0;
  });

  firstGroup.map((items) => {
    items.keys.shift();
  });

  //console.log(firstGroup);

  //console.log(secondGroup);

  result[groupBater] = createNestedJson(firstGroup);
  secondResult = createNestedJson(secondGroup);

  return { ...result, ...secondResult };
};

var flattenData = (data) => {
  let result = [];
  for (let props in data) {
    let value = data[props];

    if (typeof value == "string") {
      result.push({
        keys: props,
        value: value,
      });
      continue;
    }

    let tempResult = flattenData(value);

    tempResult.map((items) => {
      items.keys = props + "/" + items.keys;
    });
    result = result.concat(tempResult);
  }
  return result;
};

$(document).ready(function () {
  $("#jsonInput").change(function (e) {
    var fileName = e.target.files[0].name;
    console.log('The file "' + fileName + '" has been selected.');

    readFile(e.target);
  });
});

function readFile(input) {
  let file = input.files[0];

  let reader = new FileReader();

  reader.readAsText(file);

  reader.onload = function () {
    console.log(JSON.parse(reader.result));
    let jsonData = JSON.parse(reader.result);
    let flattenJSON = flattenData(jsonData);

    console.log(flattenJSON);
    createExcel(flattenJSON);
    //convert it to excel, make it downloadable
  };

  reader.onerror = function () {
    console.log(reader.error);
  };
}

function createExcel(jsonData) {
  let csv = "";

  jsonData.forEach((element) => {
    csv += element.keys + "," + element.value + "\n";
  });

  console.log(csv);
  // let btn = document.getElementById("downloadJSON");
  // btn.innerText="Download";
  // btn.href = 'data:text/csv;charset=utf-8,' + csv;
  // btn.download = "json2excel" +'.csv';

  var btn = $("#downloadJSON");
  btn.html("Download");
  btn.attr("href", "data:text/csv;charset=utf-8," + csv);
  btn.attr("download", "json2excel.csv");

  btn.click();
}
