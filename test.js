console.log("hey");

fetch(`test.json`)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data);
    let result = flattenData(data);
    console.log("json to flatten data ", result);

    formatCSV(result);

    result.map((items) => {
      items.keys = items.keys.split("/");
    });

    let reverseResult = createNestedJson(JSON.parse(JSON.stringify(result)));
    console.log("flatten data to json ", reverseResult);
  })
  .catch((err) => {
    console.warn("json file not loaded.", err);
  });
