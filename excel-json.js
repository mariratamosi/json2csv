$(document).ready(function () {
  $(document).on("click", "#convert-to-json", function (e) {
    e.preventDefault();

    let key = $("#json-key").val();
    let value = $("#json-value").val();

    console.log("excel input changed", e);
    new ExcelToJSON().parseExcel(FileToBeConverted, key, value);
  });

  $(document).on("change", "#excel-input", function (e) {
    e.preventDefault();
    console.log("excel input changed", e);
    FileToBeConverted = e.target.files[0];
    new ExcelToJSON().parseExcel(FileToBeConverted, key, value);
  });
});

var FileToBeConverted = null;

var ExcelToJSON = function () {
  this.parseExcel = function (file, key, value) {
    var reader = new FileReader();

    reader.onload = function (e) {
      var data = e.target.result;
      var workbook = XLSX.read(data, {
        type: "binary",
      });

      workbook.SheetNames.forEach(function (sheetName) {
        // Here is your object
        var XL_row_object = XLSX.utils.sheet_to_row_object_array(
          workbook.Sheets[sheetName]
        );

        console.log(XL_row_object);

        var json_object = JSON.stringify(XL_row_object);
        console.log(json_object);
      });
    };

    reader.onerror = function (ex) {
      console.log(ex);
    };

    reader.readAsBinaryString(file);
  };
};
