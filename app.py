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
        res = its.generate_text(myimg)
        its.text_to_speech(res)
        additional_question = "Do you need more detailed description of the picture?"
        its.text_to_speech(additional_question)


        return 'Image uploaded successfully!'
    else:
        return 'No image data found in request!', 400

@app.route('/home')
def home():
    return render_template('home.html')

def ask_user():
    # Your Python function logic here
    print("Python function called")
    its.text_to_speech("Please touch the screen so that we can know you are active, we care about your safety.")

@app.route('/ask_user', methods=['GET'])
def call_python_function():
    ask_user()
    return 'Python function called successfully'

def ask_user2():
    # Your Python function logic here
    print("Python function 2 called")
    its.text_to_speech("Since you didn't response, we gonna rise an alarm and call 911")


@app.route('/ask_user2', methods=['GET'])
def call_python_function2():
    ask_user2()
    return 'Python function 2 called successfully'

if __name__ == '__main__':
    its.setup()
    app.run(debug=True)
