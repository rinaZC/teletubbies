"""
Insta485.

URLs include:
/
"""
import flask
import insta485


@insta485.app.route('/accounts/logout/', methods=['POST'])
def logout():
    """Logout page."""
    if 'user' in flask.session:
        flask.session.clear()
        return flask.redirect(flask.url_for('login'))
    flask.abort(403)
    return None
