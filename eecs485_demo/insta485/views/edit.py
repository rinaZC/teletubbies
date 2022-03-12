"""
Insta485 index (main) view.

URLs include:
/
"""
import flask
import insta485


@insta485.app.route('/accounts/edit/', methods=['GET', 'POST'])
def edit():
    """Display /accounts/edit/ route."""
    if 'user' not in flask.session:
        return flask.redirect(flask.url_for('login'))
    user_name = flask.session['user']
    connection = insta485.model.get_db()
    user_data = connection.execute(
        "SELECT username, filename, fullname, email "
        "FROM users "
        "WHERE username = ?;", [user_name]
    )
    user_temp = user_data.fetchone()
    user = {}
    user['username'] = user_temp['username']
    user['img'] = flask.url_for('download_file',
                                filename=user_temp['filename'])
    user['fullname'] = user_temp['fullname']
    user['email'] = user_temp['email']
    context = {"logname": user_name,
               "user": user}
    return flask.render_template('edit.html', **context)
