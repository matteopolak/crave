from os import getenv

from FlagEmbedding import FlagModel
from flask import Flask, request
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
model = FlagModel('BAAI/bge-base-en-v1.5', use_fp16=True)

@app.route("/", methods=["POST"])
def embed():
	body = request.get_json(force=True)

	if body is None:
		return "no body", 400

	embeddings = model.encode([body['text']])

	return {
		"embedding": embeddings[0].tolist()
	}

if __name__ == "__main__":
	app.run(host='0.0.0.0', port=int(getenv('TEXT_EMBEDDER_PORT', '5000')))
