document.addEventListener('DOMContentLoaded', function() {
    // Function to open Google Maps or Street View
    function openMapOrStreetView(lat, lon) {
        const mapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
        const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lon}`;

        // Fetch reverse geocoding data to check for Street View availability
        fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=453d8c5ab0a64d3c86b26a8f044cdeea`)
            .then(response => response.json())
            .then(result => {
                // Check if Street View is available by looking at the result
                if (result.results && result.results.length > 0 && result.results[0].properties.streetView) {
                    // If Street View is available, redirect to Street View
                    window.location.href = streetViewUrl;
                } else {
                    // If Street View is not available, redirect to regular Google Maps
                    window.location.href = mapsUrl;
                }
            })
            .catch(() => {
                // On error, fallback to Google Maps
                window.location.href = mapsUrl;
            });
    }

    // Function to get the user's location
    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    openMapOrStreetView(latitude, longitude);
                },
                error => {
                    console.error('Error getting location:', error);
                    alert('Error fetching your location. Redirecting to Google Maps.');
                    window.location.href = 'https://www.google.com/maps?q=40.712776,-74.005974'; // Default to a fixed location if error occurs
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }

    // Show loading message and get location
    document.querySelector('.message').textContent = 'Locating...';
    setTimeout(() => {
        // Try Geoapify API first, then fallback to browser geolocation
        fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=51.21709661403662&lon=6.7782883744862374&apiKey=453d8c5ab0a64d3c86b26a8f044cdeea`)
            .then(response => response.json())
            .then(result => {
                const { lat, lon } = result.results[0].geometry;
                openMapOrStreetView(lat, lon);
            })
            .catch(() => {
                // If Geoapify fails, use browser geolocation
                getUserLocation();
            });
    }, 1000); // Simulate loading time
});