"""
Insta485 index (main) view.

URLs include:
/
"""
import flask
import insta485


@insta485.app.route('/accounts/password/', methods=['GET', 'POST'])
def password():
    """Password page."""
    if 'user' not in flask.session:
        return flask.redirect(flask.url_for('login'))
    user = flask.session['user']
    context = {"logname": user}
    return flask.render_template("password.html", **context)
