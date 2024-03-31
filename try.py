import vertexai
from vertexai.generative_models import GenerativeModel, Part
import pathlib
import textwrap
import google.generativeai as genai

from IPython.display import display
from IPython.display import Markdown

def generate_text_from_image(project_id: str, location: str)->str:
    # Initialize Vertex AI
    credentials = service_account.Credentials.from_service_account_file('service_acc_key.json')
    vertexai.init(project=project_id, location=location, credentials=credentials)

def to_markdown(text):
    text = text.replace('•', '  *')
    return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))

if __name__ == "__main__":
    
    #loading Image
    import PIL.Image

    img = PIL.Image.open('WechatIMG19.jpg')

    #analyzing image
    model = genai.GenerativeModel('gemini-pro-vision')
    response = model.generate_content(img)
    to_markdown(response.text)
    response = model.generate_content(
        ["Write a short, engaging blog post based on this picture. It should include a description of the meal in the photo and talk about my journey meal prepping.", img], 
        stream=True)
    #printing the response
    print(response.text)
    response.resolve()
    to_markdown(response.text)