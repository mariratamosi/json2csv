/*
  1. readCSVInputFile
  2. format the data ["a/b/c,B"]--> [{keys: "a,b,c", value: "B"}]
  3. createJsonFile downloadable
*/
$(document).ready(function () {
  $(document).on("change", "#csv-input", function (e) {
    e.preventDefault();
    console.log("input changed");
    readCSVInputFile();
  });
});

function readCSVInputFile() {
  var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv)$/;
  //Checks whether the file is a valid csv file
  //Checks whether the browser supports HTML5
  if (typeof FileReader != "undefined") {
    var reader = new FileReader();
    reader.onload = function (e) {
      var csvrows = e.target.result.split("\n");
      var props = csvrows[0].split(",").map(function (prop) {
        return prop.trim();
      });

      let result = [];

      csvrows.forEach((item) => {
        let itemData = item.split(",");
        result.push({
          keys: itemData[0].split("/"),
          value: itemData[1],
        });
      });

      let jsonResult = createNestedJson(result);
      createJsonFile(jsonResult);
      console.log(jsonResult);
      console.log(props);
    };
    reader.readAsText($("#csv-input")[0].files[0]);
  } else {
    alert("Sorry! Your browser does not support HTML5!");
  }
}

function createJsonFile(storageObj) {
  var dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(storageObj));
  var dlAnchorElem = document.getElementById("download-json");
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", "csv2json.json");
}

var createNestedJson = (data) => {
  if (data.length == 0) {
    return;
  }

  if (data[0].keys.length == 0) {
    return data[0].value;
  }

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

  result[groupBater] = createNestedJson(firstGroup);
  secondResult = createNestedJson(secondGroup);

  return { ...result, ...secondResult };
};
