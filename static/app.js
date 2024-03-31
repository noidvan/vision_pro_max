// static/app.js
document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("video")
  const imagePreview = document.getElementById("image-preview")
  const captureButton = document.getElementById("capture-button")
  const retakeButton = document.getElementById("retake-button")
  const nextButton = document.getElementById("next-button")
  const cameraContainer = document.getElementById("camera-container")
  const previewContainer = document.getElementById("preview-container")

  let stream

  async function startCamera() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true })
      video.srcObject = stream
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  function stopCamera() {
    if (stream) {
      const tracks = stream.getTracks()
      tracks.forEach((track) => track.stop())
    }
  }

  captureButton.addEventListener("click", function () {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const width = video.videoWidth
    const height = video.videoHeight
    canvas.width = width
    canvas.height = height
    ctx.drawImage(video, 0, 0, width, height)

    // Show preview container and hide camera container
    cameraContainer.style.display = "none"
    previewContainer.style.display = "block"

    // Convert canvas content to a blob representing the captured image
    canvas.toBlob(function (blob) {
      const imageUrl = URL.createObjectURL(blob)
      imagePreview.src = imageUrl
    })

    // Stop the camera
    stopCamera()
  })

  retakeButton.addEventListener("click", function () {
    // Hide preview container and show camera container
    previewContainer.style.display = "none"
    cameraContainer.style.display = "block"

    // Start the camera again for retaking the image
    startCamera()
  })

  nextButton.addEventListener("click", function () {
  // Ensure the imagePreview.src is not empty
  if (imagePreview.src) {
    // Convert the image URL back to a blob
    fetch(imagePreview.src)
      .then(response => response.blob())
      .then(blob => {
        // Convert blob to Base64
        const reader = new FileReader();
        reader.readAsDataURL(blob); 
        reader.onloadend = function() {
            const base64data = reader.result;

            // Extract Base64 data from the result
            const base64ImageContent = base64data.split(',')[1];

            // Send the image data to Flask backend
            fetch('/form', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({image_data: base64ImageContent}),
            })
            .then(response => response.text())
            .then(data => {
              console.log('Success:', data);
              // Handle success, such as redirecting to the home page or showing a success message
              window.location.href = "/home"; // Redirect to the home page or show success message
            })
            .catch((error) => {
              console.error('Error:', error);
              // Handle error
            });
        }
      });
  }
  })

  // Start the camera when the page loads
  startCamera()
})

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
