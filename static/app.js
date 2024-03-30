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
    // Navigate to a new page
    window.location.href = "home" // Replace '/next-page' with the URL of the new page
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
