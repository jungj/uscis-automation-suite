function processNewPassports() {
  var SHEET_ID = "YOUR_SHEET_ID";
  var TEMPLATE_ID = "YOUR_TEMPLATE_ID";
  var FOLDER_ID = "YOUR_FOLDER_ID";

  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName("passport");
  
  // Get all data from the sheet
  var data = sheet.getDataRange().getValues();

  // Loop through rows (starting at index 1 to skip headers)
  for (var i = 1; i < data.length; i++) {
    var surname = data[i][3];   // Column D
    var givenName = data[i][4]; // Column E
    var status = data[i][5];    // Column F (Status)

    // Check if there is a name but NO "Completed" status
    if (surname && status !== "Completed") {
      
      try {
        // --- YOUR EXISTING PDF LOGIC ---
        var folder = DriveApp.getFolderById(FOLDER_ID);
        var copy = DriveApp.getFileById(TEMPLATE_ID).makeCopy(surname + "_Form", folder);
        var presentation = SlidesApp.openById(copy.getId());
        
        presentation.getSlides().forEach(function(slide) {
          slide.replaceAllText("{{Surname}}", surname);
          slide.replaceAllText("{{Given Name}}", givenName);
        });
        presentation.saveAndClose();
        
        var pdfBlob = DriveApp.getFileById(copy.getId()).getAs('application/pdf');
        folder.createFile(pdfBlob);
        // -------------------------------

        // Stamp "Completed" in Column 6 (F) so we don't process it again
        sheet.getRange(i + 1, 6).setValue("Completed");
        Logger.log("Processed: " + surname);

      } catch (e) {
        Logger.log("Error on row " + (i+1) + ": " + e.toString());
      }
    }
  }
}
