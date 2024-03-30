import vertexai
from vertexai.generative_models import GenerativeModel, Part, Image
from google.oauth2 import service_account


def generate_text(project_id: str, location: str) -> str:
    # Initialize Vertex AI
    credentials = service_account.Credentials.from_service_account_file('service_acc_key.json')
    vertexai.init(project=project_id, location=location, credentials=credentials)
    # Load the model
    img = Image.load_from_file("WechatIMG19.jpg")
    multimodal_model = GenerativeModel("gemini-1.0-pro-vision")
    # Query the model
    response = multimodal_model.generate_content(["Explain what's going on in the image to a blind person.", img])
    print(response.text)
    return response.text

if __name__ == "__main__":
    generate_text("avian-principle-418814", 'us-central1')