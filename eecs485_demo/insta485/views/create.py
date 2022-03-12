"""
Insta485.

URLs include:
/accounts/create
"""
import flask
import insta485


@insta485.app.route('/accounts/create/', methods=['GET', 'POST'])
def create():
    """Display /accounts/create/ route."""
    if 'user' in flask.session:
        return flask.redirect('/accounts/edit/')
    return flask.render_template("create.html")
