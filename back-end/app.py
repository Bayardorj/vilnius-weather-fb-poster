from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route('/weather')
def get_weather():
    weather_url = 'https://api.meteo.lt/v1/places/Vilnius/forecasts/long-term'
    resp = requests.get(weather_url)
    return jsonify(resp.json())

@app.route('/post-to-facebook', methods=['POST'])
def post_to_facebook():
    data = request.get_json()
    message = data.get('message')

    # Facebook page access token and page ID here
    PAGE_ACCESS_TOKEN = 'EAARw4ZBvTPPEBO2A7CzG0zbpYFZCqU4FX9dEXiJFTNu9H27qBxFf8oY29Q4oXEDUHqH5mZCCu8wYzRBfYnnA65B8ZBlN5b92XiQOQlawFiDeFsY65AyqlXjpi5JghqqrOyKZAfvqrG98VGf0qyih18qYA5Wf9PmRYLI9PSWeupAbHyxgAYZBM8oaFgAFZChYmJw7ZCEv7ooZD'
    PAGE_ID = '101401829235924'

    post_url = f'https://graph.facebook.com/{PAGE_ID}/feed'
    payload = {
        'message': message,
        'access_token': PAGE_ACCESS_TOKEN
    }

    fb_resp = requests.post(post_url, data=payload)
    fb_data = fb_resp.json()

    if 'id' in fb_data:
        return jsonify({'success': True, 'postId': fb_data['id']})
    else:
        return jsonify({'success': False, 'error': fb_data.get('error', {}).get('message', 'Unknown error')}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000)
