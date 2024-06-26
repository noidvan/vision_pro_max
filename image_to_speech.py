import vertexai
from vertexai.generative_models import GenerativeModel, Part, Image
from google.oauth2 import service_account
from google.cloud import texttospeech
from playsound import playsound

def setup():
    credentials = service_account.Credentials.from_service_account_file('service_acc_key.json')
    vertexai.init(project="avian-principle-418814", location='northamerica-northeast1', credentials=credentials)
    global tts_client
    tts_client = texttospeech.TextToSpeechClient(credentials=credentials)



def generate_text(img, prompt) -> str:
    # Initialize Vertex AI
    
    # Load the model
    
    multimodal_model = GenerativeModel("gemini-1.0-pro-vision")
    # Query the model
    response = multimodal_model.generate_content([prompt, img])
    print(response.text)
    return response.text

def text_to_speech(text):
    """Synthesizes speech from the input string of text."""


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

    response = tts_client.synthesize_speech(
        request={"input": input_text, "voice": voice, "audio_config": audio_config}
    )

    # The response's audio_content is binary.
    with open("output.mp3", "wb") as out:
        out.write(response.audio_content)
        print('Audio content written to file "output.mp3"')
    playsound('output.mp3')

if __name__ == "__main__":
    setup()
    myimg = Image.load_from_file("WechatIMG19.jpg")
    res = generate_text(myimg, "Describe what is going on in the image, keep it concise (under 10s of reading time), describe in the format: [color] [object] in [direction].")
    text_to_speech(res)