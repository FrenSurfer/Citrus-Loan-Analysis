const fs = require('fs');
const csv = require('csv-parser');
require('dotenv').config();

const csvFilePath = process.env.CSV;
const collectionData = {};

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    if (!collectionData[row.Collection]) {
      collectionData[row.Collection] = [];
    }
    collectionData[row.Collection].push(row);
  })
  .on('end', () => {
    let counterLoan = 0;
    let totalRepaidTime = 0;

    let repaidIn1Day = 0;
    let repaidIn2Days = 0;
    let repaidIn3Days = 0;
    let repaidIn4Days = 0;
    let repaidIn5Days = 0;
    let repaidIn6Days = 0;
    let repaidIn7Days = 0;

    Object.keys(collectionData).forEach((collectionName) => {
      let collection = collectionData[collectionName];
      collection.forEach((loan) => {
        counterLoan++;

        let startTimeParts = loan['Start Time'].split(/[\/ :]/);
        let endTimeParts = loan['End Time'].split(/[\/ :]/);

        let start = new Date(startTimeParts[2], startTimeParts[1] - 1, startTimeParts[0], startTimeParts[3], startTimeParts[4], startTimeParts[5]);
        let end = new Date(endTimeParts[2], endTimeParts[1] - 1, endTimeParts[0], endTimeParts[3], endTimeParts[4], endTimeParts[5]);

        let diffInMilliseconds = end - start;
        let diffInDays = diffInMilliseconds / (1000 * 3600 * 24);

        totalRepaidTime += diffInDays;

        if (diffInDays <= 1) {
          repaidIn1Day++;
        } else if (diffInDays <= 2) {
          repaidIn2Days++;
        } else if (diffInDays <= 3) {
          repaidIn3Days++;
        } else if (diffInDays <= 4) {
          repaidIn4Days++;
        } else if (diffInDays <= 5) {
          repaidIn5Days++;
        } else if (diffInDays <= 6) {
          repaidIn6Days++;
        } else if (diffInDays <= 7) {
          repaidIn7Days++;
        }
      });
    });

    let avgRepTime = totalRepaidTime / counterLoan;

    console.log('\n   GLOBAL STATS    ');
    console.log("\nTotal Loans : " + counterLoan + "    " + "AVG Repaid time : " + avgRepTime.toFixed(2) + " Days");

    Object.keys(collectionData).forEach((collectionName) => {
        let collection = collectionData[collectionName];
        let totalRepaid = collection.filter(loan => loan.Status === 'REPAID').length;
        let totalDefaulted = collection.filter(loan => loan.Status === 'DEFAULTED').length;
  
        console.log('\n   ' + collectionName.toUpperCase() + ' STATS');
        console.log('\nTotal Loans : ' + collection.length);
        console.log('Total Repaid : ' + totalRepaid);
        console.log('Total Defaulted : ' + totalDefaulted + "\n");
      });

    let totalRepaid = repaidIn1Day + repaidIn2Days + repaidIn3Days + repaidIn4Days + repaidIn5Days + repaidIn6Days + repaidIn7Days;

    console.log("\nTotal Repaid: " + totalRepaid + " (" + ((totalRepaid / counterLoan) * 100).toFixed(2) + "%)");

    console.log("\n   NUMBER OF LOANS REPAYED IN SPECIFIC DAYS");
    console.log("1 Day : " + repaidIn1Day + " ( "  + (Math.round((repaidIn1Day/totalRepaid)*10000) / 100).toFixed(2) + "%)");
    console.log("2 Days: " + repaidIn2Days + " ( "  + (Math.round((repaidIn2Days/totalRepaid)*10000) / 100).toFixed(2) + "%)");
    console.log("3 Days: " + repaidIn3Days + " ( "  + (Math.round((repaidIn3Days/totalRepaid)*10000) / 100).toFixed(2) + "%)");
    console.log("4 Days: " + repaidIn4Days + " ( "  + (Math.round((repaidIn4Days/totalRepaid)*10000) / 100).toFixed(2) + "%)");
    console.log("5 Days: " + repaidIn5Days + " ( "  + (Math.round((repaidIn5Days/totalRepaid)*10000) / 100).toFixed(2) + "%)");
    console.log("6 Days: " + repaidIn6Days + " ( "  + (Math.round((repaidIn6Days/totalRepaid)*10000) / 100).toFixed(2) + "%)");
    console.log("7 Days: " + repaidIn7Days + " ( "  + (Math.round((repaidIn7Days/totalRepaid)*10000) / 100).toFixed(2) + "%)" + "\n");

  });
