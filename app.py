# app.py
from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def upload_form():
    return render_template('form.html')

@app.route('/form', methods=['POST'])
def upload_image():
    if 'photo' in request.files:
        photo = request.files['photo']
        # Save or process the photo here
        photo.save('uploaded_photo.jpg')  # Example: Save the photo to a file
        return 'Image uploaded successfully!'
    else:
        return 'No photo found in request!'

@app.route('/home')
def home():
    return render_template('home.html')

if __name__ == '__main__':
    app.run(debug=True)
