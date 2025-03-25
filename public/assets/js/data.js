// Function to get the user's IP address using a third-party API (ipify)
async function getIp() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error fetching IP:', error);
      return 'Unknown';
    }
  }
  
  // Function to collect and store data
  async function storeData() {
    const ip = await getIp();
    const userAgent = navigator.userAgent;
    const date = new Date().toISOString();
    
    // Create a CSV formatted string (one row)
    const csvData = `${date},"${userAgent}",${ip}\n`;
  
    fetch('/log-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csvData })
    })
    .then(async (response) => {
      const text = await response.text();
      if (response.ok) {
        console.log('Data stored successfully:', text);
      } else {
        console.error('Error storing data:', text);
      }
    })
    .catch(error => console.error('Fetch error:', error));
  }
  
  // Optional: Function to retrieve and display stored data
  async function retrieveData() {
    try {
      const response = await fetch('/get-data');
      if (response.ok) {
        const data = await response.text();
        document.getElementById('dataDisplay').innerText = data;
      } else {
        document.getElementById('dataDisplay').innerText = 'No data available';
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  }
  
  // Run storeData when the page loads, then retrieve data after a short delay
  window.addEventListener('DOMContentLoaded', () => {
    storeData();
    setTimeout(retrieveData, 1000);
  });
  