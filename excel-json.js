$(document).ready(function () {
  $(document).on("click", "#convert-to-json", function (e) {
    e.preventDefault();

    let keyColumn = $("#keys-checkbox-contaner input:checked").attr("name");
    let valueColumn = $("#values-checkbox-contaner input:checked").attr("name");

    let backupColumn = $("#values-backup-checkbox-contaner input:checked").attr(
      "name"
    );

    console.log(keyColumn);
    console.log(valueColumn);

    let result = ExcelToJSONConverter.convertToKeyValuePairedJSON(
      keyColumn,
      valueColumn,
      backupColumn
    );

    $("#checkbox-contaner").hide();
    $("#download-excel-json").show();
  });

  $(document).on("change", "#excel-input", function (e) {
    e.preventDefault();
    console.log("excel input changed", e);
    $(".single-checkbox").remove();
    $("#download-excel-json").hide();
    FileToBeConverted = e.target.files[0];
    ExcelToJSONConverter = new ExcelToJSON();
    ExcelToJSONConverter.parseExcel(FileToBeConverted);
  });
});

var FileToBeConverted = null;
var ExcelToJSONConverter = null;

var ExcelToJSON = function () {
  this.convertedRawJSON = null;
  this.keyValueJson = null;

  this.convertToKeyValuePairedJSON = function (
    keyColumn,
    valueColumn,
    backupColumn
  ) {
    console.log(this);
    let result = [];
    for (let i = 0; i < this.convertedRawJSON.length; i++) {
      let cur = this.convertedRawJSON[i];

      let value = cur[valueColumn];
      if (!value && backupColumn) {
        value = cur[backupColumn];
      }
      value = value.replaceAll("[hash]", "#");
      value = value.replaceAll("[Hash]", "#");

      result.push({
        keys: cur[keyColumn].split("/"),
        value: value,
      });
    }

    result = createNestedJson(result);
    createJsonFile(result, "download-excel-json", "exceltojson.json");

    return result;
  };

  this.showKeys = function () {
    if (this.convertedRawJSON == null) {
      return;
    }

    let keys = Object.keys(this.convertedRawJSON[0]);

    for (let i = 0; i < keys.length; i++) {
      let temp = document.getElementsByTagName("template")[0];
      let item = temp.content.querySelector("div");
      let newNode = document.importNode(item, true);
      let newNode2 = document.importNode(item, true);
      let newNode3 = document.importNode(item, true);

      $(newNode).children("label").text(keys[i]);
      $(newNode).children("input").attr("name", keys[i]);

      $(newNode2).children("label").text(keys[i]);
      $(newNode2).children("input").attr("name", keys[i]);

      $(newNode3).children("label").text(keys[i]);
      $(newNode3).children("input").attr("name", keys[i]);

      $("#keys-checkbox-contaner").append(newNode);
      $("#values-checkbox-contaner").append(newNode2);
      $("#values-backup-checkbox-contaner").append(newNode3);

      $("#checkbox-contaner").show();

      setEventListenerForCheckbox();
    }
  };
  this.parseExcel = function (file) {
    let _that = this;
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
        _that.convertedRawJSON = XL_row_object;

        _that.showKeys();
      });
    };

    reader.onerror = function (ex) {
      console.log(ex);
    };

    reader.readAsBinaryString(file);
  };
};

function setEventListenerForCheckbox() {
  $("#checkbox-contaner input:checkbox").on("click", function () {
    // in the handler, 'this' refers to the box clicked on
    var $box = $(this);
    if ($box.is(":checked")) {
      // the name of the box is retrieved using the .attr() method
      // as it is assumed and expected to be immutable
      var group = "input:checkbox[name='" + $box.attr("name") + "']";
      // the checked state of the group/box on the other hand will change
      // and the current value is retrieved using .prop() method
      $(group).prop("checked", false);
      $box.prop("checked", true);
    } else {
      $box.prop("checked", false);
    }
  });
}
