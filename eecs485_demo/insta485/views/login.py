"""
Insta485.

URLs include:
/
"""
import flask
import insta485


@insta485.app.route('/accounts/login/', methods=['GET'])
def login():
    """Login page."""
    if 'user' in flask.session:
        return flask.redirect(flask.url_for('show_index'))
    return flask.render_template("login.html")
