// Question 2 - ETL

// LINK Data team members need to develop against APIs of highly variable quality. Often the documentation is not clear or comprehensive, so some work
// needs to happen to fully understand the behaviors upstream.
const axios = require('axios');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

/**
 * Converts a date string from 'DD-MM' format to 'YYYY-MM-DD' format,
 * assuming the provided year is used for the conversion.
 * @param {number} year - The year to be used for conversion.
 * @param {string} dateStr - The date string in 'DD-MM' format.
 * @returns {string} - The date string in 'YYYY-MM-DD' format.
 */
function convertDate(year, dateStr) {
  const [day, month] = dateStr.split('-');
  return new Date(year, month - 1, day).toISOString().split('T')[0];
}

/**
 * Fetches transaction data from the API, transforms it, and saves it to a CSV file.
 * @param {string} start - The start date for the data retrieval in 'YYYY-MM-DD' format.
 * @param {string} end - The end date for the data retrieval in 'YYYY-MM-DD' format.
 */
async function fetchAndSaveData(start, end) {
  const year = new Date(start).getFullYear();
  let year_cnt = 0, old_month = 0;

  try {
    const response = await axios.get('http://35.77.82.139:3000/transactions', {
      params: {
        fromDate: start,
        toDate: end
      },
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'axios/1.7.3'
      }
    });

    const res = response.data.data;
    if (!res) {
      console.log("Empty array responded");
      return;
    }

    // Transform the response data
    const transformedData = res.map(item => {
      const cur_month = Number(item.date.split('-')[1]);
      if (cur_month < old_month) year_cnt++;
      old_month = cur_month;
      return {
        date: convertDate(year + year_cnt, item.date),
        amount: parseFloat(item.amount.replace(/,/g, '')),
        description: `'${item.description}'`
      };
    });

    // Define CSV headers
    const headers = [
      { id: 'date', title: 'Date' },
      { id: 'amount', title: 'Amount' },
      { id: 'description', title: 'Description' }
    ];
    
    // Initialize CSV writer
    const csvWriter = createCsvWriter({
      path: 'output.csv',
      header: headers
    });

    // Write transformed data to CSV
    await csvWriter.writeRecords(transformedData);
    console.log('CSV file was written successfully');
    
  } catch (error) {
    // Handle errors from API request
    if (error.response && error.response.status === 400) {
      console.log("400 ERROR - BAD REQUEST");
      
      // Initialize CSV writer for error scenario
      const csvWriter = createCsvWriter({
        path: 'output.csv',
        header: [] // No headers needed for error case
      });

      // Write an empty record
      await csvWriter.writeRecords([]);
    } else {
      console.log("Error occurred: ", error);
    }
  }
}

// Example usage
fetchAndSaveData('2021-10-30', '2021-11-05');
