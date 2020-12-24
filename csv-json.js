$(document).ready(function () {
  $("#jsonInput").change(function (e) {
    var fileName = e.target.files[0].name;
    console.log('The file "' + fileName + '" has been selected.');

    readFile(e.target);
  });

  $(document).on("change", "#excel-input", function (e) {
    e.preventDefault();
    console.log("input changed");
    ExportToTable();
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
    element.value = element.value.replaceAll("#", "[hash]");
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

function createJsonFile(storageObj) {
  var dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(storageObj));
  var dlAnchorElem = document.getElementById("download-json");
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", "csv2json.json");
}

function ExportToTable() {
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
      // formatJsonForDownload(csvrows);
      console.log(jsonResult);
      console.log(props);
    };
    reader.readAsText($("#excel-input")[0].files[0]);
  } else {
    alert("Sorry! Your browser does not support HTML5!");
  }
}
