/*

1. read json file
2. flattenData ["a/b/c","B"]
3. formatCSV
*/

$(document).ready(function () {
  $("#jsonInput").change(function (e) {
    var fileName = e.target.files[0].name;
    console.log('The file "' + fileName + '" has been selected.');

    readJSONFile(e.target);
  });
});

function readJSONFile(input) {
  let file = input.files[0];

  let reader = new FileReader();

  reader.readAsText(file);

  reader.onload = function () {
    console.log(JSON.parse(reader.result));
    let jsonData = JSON.parse(reader.result);
    let flattenJSON = flattenData(jsonData);

    console.log(flattenJSON);
    formatCSV(flattenJSON);
  };

  reader.onerror = function () {
    console.log(reader.error);
  };
}

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

function formatCSV(jsonData) {
  let csv = "";

  jsonData.forEach((element) => {
    element.value = element.value.replaceAll("#", "[hash]");
    csv += element.keys + "," + element.value + "\n";
  });

  console.log(csv);

  var btn = $("#downloadJSON");
  btn.html("Download");
  btn.attr("href", "data:text/csv;charset=utf-8," + csv);
  btn.attr("download", "json2excel.csv");

  btn.click();
}
