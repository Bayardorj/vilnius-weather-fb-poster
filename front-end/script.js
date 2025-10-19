const weatherInfoDiv = document.getElementById('weather-info');
    const postBtn = document.getElementById('post-btn');
    const statusDiv = document.getElementById('status');

    let weatherData = null;

    // Fetch weather data from backend
    fetch('http://195.189.96.47:4000/weather')
      .then(response => response.json())
      .then(data => {
        if (data.forecastTimestamps && data.forecastTimestamps.length > 0) {
          weatherData = data.forecastTimestamps[0];
          weatherInfoDiv.innerHTML = `
            <p><strong>Temperature:</strong> ${weatherData.airTemperature} °C</p>
            <p><strong>Time:</strong> ${weatherData.forecastTimeUtc}</p>
          `;
          postBtn.disabled = false;
        } else {
          weatherInfoDiv.textContent = 'No weather data available.';
        }
      })
      .catch(err => {
        weatherInfoDiv.textContent = 'Failed to load weather data.';
        console.error(err);
      });

    // Post weather data to Facebook when button clicked
    postBtn.addEventListener('click', () => {
      if (!weatherData) return;

      const message = `Current temperature in Vilnius is ${weatherData.airTemperature} °C as of ${weatherData.forecastTimeUtc}.`;

      statusDiv.textContent = 'Posting to Facebook...';
      postBtn.disabled = true;

      fetch('http://195.189.96.47:4000/post-to-facebook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          statusDiv.textContent = 'Posted successfully! Post ID: ' + data.postId;
        } else {
          statusDiv.textContent = 'Failed to post: ' + (data.error || 'Unknown error');
        }
        postBtn.disabled = false;
      })
      .catch(err => {
        statusDiv.textContent = 'Error posting to Facebook.';
        console.error(err);
        postBtn.disabled = false;
      });
    });