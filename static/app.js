document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("video");
  const imagePreview = document.getElementById("image-preview");
  const captureButton = document.getElementById("capture-button");
  const retakeButton = document.getElementById("retake-button");
  const nextButton = document.getElementById("next-button");
  const cameraContainer = document.getElementById("camera-container");
  const previewContainer = document.getElementById("preview-container");

  let stream;

  async function startCamera() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  }

  function stopCamera() {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  }

  captureButton.addEventListener("click", function () {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(video, 0, 0, width, height);

    // Convert canvas content to a blob representing the captured image
    canvas.toBlob(function (blob) {
      const imageUrl = URL.createObjectURL(blob);
      imagePreview.src = imageUrl;

      // Convert the image URL back to a blob for sending
      fetch(imageUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function () {
            const base64data = reader.result;
            // Extract Base64 data from the result
            const base64ImageContent = base64data.split(",")[1];
            // Send the image data to Flask backend
            fetch("/form", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ image_data: base64ImageContent }),
            })
              .then((response) => response.text())
              .then((data) => {
                console.log("Success:", data);
                // Here, you might want to navigate to another page or show a success message
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          };
        });
    });

    // Show preview container and hide camera container
    cameraContainer.style.display = "none";
    previewContainer.style.display = "block";

    // Stop the camera
    stopCamera();
  });

  retakeButton.addEventListener("click", function () {
    previewContainer.style.display = "none";
    cameraContainer.style.display = "block";
    startCamera();
  });

  // Adjust or remove the nextButton event listener as per your new logic
  nextButton.addEventListener("click", function () {
    // Make a GET request to the /more_descriptive route
    fetch("/more_descriptive")
      .then(response => {
        if (response.ok) {
          return response.text(); // or response.json() if you're returning JSON
        }
        throw new Error('Network response was not ok.');
      })
      .then(data => {
        console.log("Success:", data);
        // Handle success, such as showing a notification or redirecting
      })
      .catch(error => {
        console.error("Error during fetch:", error);
        // Handle any errors
      });
  });
  
  // Start the camera when the page loads
  startCamera();
});


/*for header */
function parallax_height() {
  var scroll_top = $(this).scrollTop()
  var sample_section_top = $(".sample-section").offset().top
  var header_height = $(".sample-header-section").outerHeight()
  $(".sample-section").css({ "margin-top": header_height })
  $(".sample-header").css({ height: header_height - scroll_top })
}
parallax_height()
$(window).scroll(function () {
  parallax_height()
})
$(window).resize(function () {
  parallax_height()
})

function initMap() {
  // HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }

        var map = new google.maps.Map(document.getElementById("map"), {
          center: pos,
          zoom: 15,
        })

        var marker = new google.maps.Marker({
          position: pos,
          map: map,
          title: "Your current location",
        })
      },
      function () {
        handleLocationError(true, map.getCenter())
      }
    )
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false)
  }
}

function handleLocationError(browserHasGeolocation, pos) {
  console.log(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  )
}
