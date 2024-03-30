// static/app.js
document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("canvas")
  const imagePreview = document.getElementById("image-preview")

  async function captureAndUpload() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      const mediaTrack = stream.getVideoTracks()[0]
      const imageCapture = new ImageCapture(mediaTrack)

      const photoBlob = await imageCapture.takePhoto()
      const formData = new FormData()
      formData.append("photo", photoBlob)

      // Send image data to Flask backend
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      })
      if (response.ok) {
        console.log("Image uploaded successfully!")
      } else {
        console.error("Failed to upload image:", response.statusText)
      }

      // Display the captured image as preview
      const imageUrl = URL.createObjectURL(photoBlob)
      imagePreview.src = imageUrl

      // Stop video stream
      mediaTrack.stop()
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  // Automatically trigger capture and upload process when the page loads
  captureAndUpload()
})
