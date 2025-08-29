from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.post("/api/search")
def api_search():
    data = request.get_json(force=True) or {}
    pet_type = data.get("petType", "")
    location = data.get("location", "")
    service = data.get("petService", "")
    date_range = data.get("dateRange", "")

    # TODO: Replace this with your real search logic / DB calls.
    mock_results = [
        {
            "id": 1,
            "title": "Pawfect Groomers - Central",
            "description": "Award-winning groomers with gentle handling.",
            "price": "From $35",
            "service": "Grooming",
            "location": "Central (District 1-2)"
        },
        {
            "id": 2,
            "title": "Happy Paws Sitters",
            "description": "Experienced sitters for all small animals.",
            "price": "From $25/day",
            "service": "Sitter",
            "location": "East (District 14-18)"
        },
        {
            "id": 3,
            "title": "Lux Pet Hotel",
            "description": "Round-the-clock care and cuddles.",
            "price": "From $40/night",
            "service": "Pet Hotel",
            "location": "West (District 5-8, 22-23)"
        }
    ]

    def matches(item):
        ok = True
        if pet_type:
            ok = ok and True  # future: add pet-type specific filtering
        if location:
            ok = ok and (item["location"] == location)
        if service:
            ok = ok and (item["service"] == service)
        return ok

    results = [r for r in mock_results if matches(r)]

    return jsonify({
        "filters": {
            "petType": pet_type,
            "location": location,
            "petService": service,
            "dateRange": date_range
        },
        "count": len(results),
        "results": results
    })

if __name__ == "__main__":
    # Local dev only. On Azure, Docker CMD will use Gunicorn instead.
    app.run(host="0.0.0.0", port=5000, debug=True)
