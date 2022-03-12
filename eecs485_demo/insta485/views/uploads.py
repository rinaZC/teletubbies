"""
Insta485.

URLs include:
/
"""

import flask
import insta485


@insta485.app.route("/uploads/<path:filename>")
def download_file(filename):
    """Upload file page."""
    if 'user' not in flask.session:
        flask.abort(403)
    return flask.send_from_directory(
        insta485.app.config['UPLOAD_FOLDER'], filename
    )
