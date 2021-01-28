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
      console.log(csvrows);

      csvrows.forEach((item) => {
        let checkEscape = item.indexOf(", ");
        if (checkEscape != -1) {
          item = item.replaceAll(", ", "[escapeComma]");
          console.log("checkEscape " + checkEscape);
        }
        let itemData = item.split(","); //but not
        console.log(item);
        if (itemData[2] != undefined) {
          result.push({
            keys: itemData[0].split("/"),
            value: itemData[2]
              .trim()
              .replaceAll("[escapeComma]", ", ")
              .replace(/(^")|("$)/g, ""),
          });
        }
      });

      console.log(csvrows);

      let jsonResult = createNestedJson(result);
      createJsonFile(jsonResult, "download-json", "csv2json.json");
      console.log(jsonResult);
    };
    reader.readAsText($("#csv-input")[0].files[0], "utf-8");
  } else {
    alert("Sorry! Your browser does not support HTML5!");
  }
}

function createJsonFile(storageObj, id, filename) {
  var dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(storageObj, undefined, 2));
  var dlAnchorElem = document.getElementById(id);
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", filename);
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
