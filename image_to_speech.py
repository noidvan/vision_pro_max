import vertexai
from vertexai.generative_models import GenerativeModel, Part, Image
from google.oauth2 import service_account
from google.cloud import texttospeech
from playsound import playsound


def generate_text(project_id: str, location: str) -> str:
    # Initialize Vertex AI
    
    vertexai.init(project=project_id, location=location, credentials=credentials)
    # Load the model
    img = Image.load_from_file("WechatIMG19.jpg")
    multimodal_model = GenerativeModel("gemini-1.0-pro-vision")
    # Query the model
    response = multimodal_model.generate_content(["Explain what's going on in the image to a blind person.", img])
    print(response.text)
    return response.text

def text_to_speech(text):
    """Synthesizes speech from the input string of text."""

    client = texttospeech.TextToSpeechClient(credentials=credentials)

    input_text = texttospeech.SynthesisInput(text=text)

    # Note: the voice can also be specified by name.
    # Names of voices can be retrieved with client.list_voices().
    voice = texttospeech.VoiceSelectionParams(
        language_code="en-US",
        name="en-US-Standard-C",
        ssml_gender=texttospeech.SsmlVoiceGender.FEMALE,
    )

    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )

    response = client.synthesize_speech(
        request={"input": input_text, "voice": voice, "audio_config": audio_config}
    )

    # The response's audio_content is binary.
    with open("output.mp3", "wb") as out:
        out.write(response.audio_content)
        print('Audio content written to file "output.mp3"')
    playsound('output.mp3')

if __name__ == "__main__":
    credentials = service_account.Credentials.from_service_account_file('service_acc_key.json')
    myres = generate_text("avian-principle-418814", 'us-central1')
    text_to_speech(myres)