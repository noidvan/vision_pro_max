from flask import Flask, render_template, request, jsonify
import base64
from io import BytesIO
from PIL import Image
import image_to_speech as its

app = Flask(__name__)

@app.route('/')
def upload_form():
    return render_template('form.html')

@app.route('/form', methods=['POST'])
def upload_image():
    data = request.get_json()
    if data and 'image_data' in data:
        image_data = data['image_data']
        image_data = base64.b64decode(image_data)
        image = Image.open(BytesIO(image_data))
        image.save('uploaded_photo.png', 'PNG')  # Save the photo to a file
        myimg = its.Image.load_from_file("uploaded_photo.png")
        res = its.generate_text(myimg, "Describe what is going on in the image, keep it concise (under 10s of reading time), describe in the format: [color] [object] in [direction].")
        its.text_to_speech(res)
        additional_question = "Do you need more detailed description of the picture?"
        its.text_to_speech(additional_question)


        return 'Image uploaded successfully!'
    else:
        return 'No image data found in request!', 400

@app.route('/home')
def home():
    return render_template('home.html')

if __name__ == '__main__':
    its.setup()
    app.run(debug=True)