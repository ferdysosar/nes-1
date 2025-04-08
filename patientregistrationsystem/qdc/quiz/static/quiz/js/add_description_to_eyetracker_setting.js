$(document).ready(function () {
  var select_manufacturer = $("select#id_manufacturer");
  var select_eyetrackerdevice = $("select#id_eyetracker_device");

  // When manufacturer changes
  select_manufacturer.change(function () {
    var manufacturer_id = $(this).val();

    if (!manufacturer_id) {
      manufacturer_id = "0";
    }

    // FIXED: Using correct equipment type for the backend
    var url =
      "/experiment/equipment/get_equipment_by_manufacturer/eyetracker/" +
      manufacturer_id;

    $.getJSON(url, function (all_equipment) {
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

    // Prevent invalid fetch
    if (!eyetrackerdevice_id || description_field.length === 0) {
      if (description_field.length > 0) {
        description_field.prop("value", "");
      }
      return;
    }

    var url = "/experiment/equipment/" + eyetrackerdevice_id + "/attributes";

    $.getJSON(url, function (equipment) {
      description_field.prop("value", equipment["description"]);
    });
  });
});
