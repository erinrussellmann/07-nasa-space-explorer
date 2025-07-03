// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Get references to DOM elements
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const gallery = document.getElementById('gallery');
const button = document.querySelector('.filters button');

// NASA API key and endpoint
const API_KEY = 'xdwt0eY1rAiPymYi9MM8Bo2mbjNMf4HdjHtKyMJh';
const API_URL = 'https://api.nasa.gov/planetary/apod';

// Function to fetch images from NASA API
const fetchImages = async (startDate, endDate) => {
  // Show a loading message while fetching data
  gallery.innerHTML = `
    <div class="w-100 text-center py-5" id="loading-message">
      <div class="spinner-border text-primary mb-3" role="status"></div>
      <div>Loading space images... Please wait!</div>
    </div>
  `;

  // Build the API URL with query parameters
  const url = `${API_URL}?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;

  try {
    // Fetch data from the API
    const response = await fetch(url);
    // Convert the response to JSON
    const data = await response.json();

    // Check if the API returned an error
    if (data.error) {
      gallery.innerHTML = `<p>Error: ${data.error.message}</p>`;
      return;
    }

    // Display the images in the gallery
    displayImages(data);
  } catch (error) {
    // Show an error message if something goes wrong
    gallery.innerHTML = `<p>Could not fetch images. Please try again later.</p>`;
  }
};

// Function to display images in the gallery
const displayImages = (images) => {
  // Clear the gallery
  gallery.innerHTML = '';

  // If no images, show a message
  if (!images || images.length === 0) {
    gallery.innerHTML = '<p>No images found for this date range.</p>';
    return;
  }

  // Show a message to let users know they can click for more details
  // Create a div for the info message
  const infoDiv = document.createElement('div');
  infoDiv.className = 'alert alert-info w-100 text-center mb-3';
  infoDiv.textContent = 'Tip: Click any image to see more details!';
  // Insert the message at the top of the gallery
  gallery.appendChild(infoDiv);

  // Loop through each image and add it to the gallery
  images.forEach((item, index) => {
    // Only show images (not videos)
    if (item.media_type === 'image') {
      // Unique modal ID for each item
      const modalId = `imageModal${index}`;

      // Create a Bootstrap column for each image
      const colDiv = document.createElement('div');
      colDiv.className = 'col-12 col-md-6 col-lg-4 mb-4 d-flex';

      // Card HTML with modal trigger
      colDiv.innerHTML = `
        <div class="card w-100 h-100 gallery-card" style="cursor:pointer;" data-bs-toggle="modal" data-bs-target="#${modalId}">
          <img src="${item.url}" alt="${item.title}" class="card-img-top img-fluid" style="object-fit:cover; height:250px;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title" style="font-size:1rem;">${item.title}</h5>
            <p class="card-text" style="font-size:0.9rem;">${item.date}</p>
          </div>
        </div>
        <!-- Modal for this image -->
        <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
          <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="${modalId}Label">${item.title}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <img src="${item.url}" alt="${item.title}" class="img-fluid mb-3" style="width:100%;object-fit:cover;max-height:400px;">
                <p><strong>Date:</strong> ${item.date}</p>
                <p><strong>Explanation:</strong> ${item.explanation}</p>
                ${item.copyright ? `<p><strong>Credit:</strong> ${item.copyright}</p>` : ''}
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      `;

      // Add the column to the gallery row
      gallery.appendChild(colDiv);
    }
  });
};

// Add a click event listener to the button
button.addEventListener('click', () => {
  // Get the values from the date inputs
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;

  // Check if both dates are selected
  if (!startDate || !endDate) {
    gallery.innerHTML = '<p>Please select both start and end dates.</p>';
    return;
  }

  // Fetch and display images for the selected date range
  fetchImages(startDate, endDate);
});
