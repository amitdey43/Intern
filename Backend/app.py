# import joblib
# from flask import Flask, request, jsonify

# model = joblib.load("job_role_model.pkl")
# vector = joblib.load("tfidf_vectorizer.pkl")

# skills = ""
# vec= vector.transform([skills])
# predic=model.predict_proba(vec)[0]
# classes = model.classes_
# top_idx = predic.argsort()[-3:][::-1]

# print([{
#     "role":classes[i],
#     "predict":float(predic[i])
# }
# for i in top_idx
# ])



import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS

model = joblib.load("job_role_model.pkl")
vector = joblib.load("tfidf_vectorizer.pkl")

app = Flask(__name__)
CORS(app)

@app.route("/predict",methods=['POST'])
def predict():
    data= request.json
    skills = data.get("skills", [])
    skill= ",".join(skills)
    print(skill)

    vec= vector.transform([skill])
    predic=model.predict_proba(vec)[0]
    classes = model.classes_
    top_idx = predic.argsort()[-3:][::-1]

    return jsonify([{
        "role":classes[i],
        "predict":float(predic[i])
    }
    for i in top_idx
    ])

if __name__== "__main__":
    app.run(debug=True)