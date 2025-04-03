$(document).ready(function () {
  var select_manufacturer = $("select#id_manufacturer");
  var select_eyetrackerdevice = $("select#id_eyetracker_device");

  console.log("JS Loaded!");
  console.log("Manufacturer dropdown:", select_manufacturer.length);
  console.log("Device dropdown:", select_eyetrackerdevice.length);

  // When manufacturer changes
  select_manufacturer.change(function () {
    var manufacturer_id = $(this).val();
    console.log("Selected manufacturer:", manufacturer_id);

    if (!manufacturer_id) {
      manufacturer_id = "0";
    }

    // FIXED: Using correct equipment type for the backend
    var url =
      "/experiment/equipment/get_equipment_by_manufacturer/eyetracker/" +
      manufacturer_id;

    console.log("Calling URL:", url);

    $.getJSON(url, function (all_equipment) {
      console.log("Received devices:", all_equipment);

      var options = '<option value="" selected="selected">---------</option>';
      for (var i = 0; i < all_equipment.length; i++) {
        var device = all_equipment[i];
        var id = device.pk;
        var name = device.fields["identification"] || "Unnamed";

        options += '<option value="' + id + '">' + name + "</option>";
      }

      select_eyetrackerdevice.html(options);
      select_eyetrackerdevice.trigger("change"); // triggers description update
    });
  });

  // When device changes
  select_eyetrackerdevice.change(function () {
    var eyetrackerdevice_id = $(this).val();
    var description_field = $("#id_description");

    console.log("Device selected:", eyetrackerdevice_id);
    console.log("Description field found:", description_field.length > 0);

    // Prevent invalid fetch
    if (!eyetrackerdevice_id || description_field.length === 0) {
      if (description_field.length > 0) {
        description_field.prop("value", "");
      }
      return;
    }

    var url = "/experiment/equipment/" + eyetrackerdevice_id + "/attributes";
    console.log("Getting attributes from:", url);

    $.getJSON(url, function (equipment) {
      console.log("Equipment data received:", equipment);
      description_field.prop("value", equipment["description"]);
    });
  });
});
