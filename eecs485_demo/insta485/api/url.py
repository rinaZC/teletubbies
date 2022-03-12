"""GET /api/v1."""
import flask
import insta485


@insta485.app.route('/api/v1/', methods=['GET'])
def get_available_service():
    """Return a list of services available."""
    context = {
        "posts": "/api/v1/p/",
        "url": "/api/v1/"
    }
    return flask.jsonify(**context)
