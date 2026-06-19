from dotenv import load_dotenv
import os
import google.generativeai as genai

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=API_KEY)

def summarize_text(text):

    model = genai.GenerativeModel("gemini-2.5-flash")

    prompt = f"""
    Summarize the following text in simple points:

    {text}
    """

    response = model.generate_content(prompt)

    return response.text