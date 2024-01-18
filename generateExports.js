const fs = require('fs');
const path = require('path');

const imageFolder = './src/profilePictures'; // Adjust the folder path as needed
const outputFile = './src/profilePictures/index.js'; // The output index.js file

// Read the files in the folder
fs.readdir(imageFolder, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  // Filter files to include only image files (e.g., .jpg, .png)
  const imageFiles = files.filter(file => /\.(jpg|png|jpeg|gif|svg)$/i.test(file));

  // Generate export statements for each image file
  const exportStatements = imageFiles.map(file => {
    const fileNameWithoutExtension = path.basename(file, path.extname(file));
    return `export { default as ${fileNameWithoutExtension} } from './${file}';`;
  });

  // Write the export statements to the output index.js file
  fs.writeFile(outputFile, exportStatements.join('\n'), err => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Exports generated and saved to ${outputFile}`);
    }
  });
});
