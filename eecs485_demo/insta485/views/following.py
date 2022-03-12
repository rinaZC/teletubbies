"""
Insta485.

URLs include:
/u/user_url/following
"""

import flask
import insta485


@insta485.app.route('/u/<username>/following/', methods=['GET'])
def show_following(username):
    """Following page."""
    if 'user' not in flask.session:
        return flask.redirect(flask.url_for('login'))
    connection = insta485.model.get_db()
    check_exist_following = connection.execute(
        "SELECT created "
        "FROM users "
        "WHERE username = ?;", [username]
    )
    if not check_exist_following.fetchone():
        flask.abort(404)
    user = flask.session['user']
    # Connect to database
    connection = insta485.model.get_db()
    # GET fetch static file
    # Query database
    cur = connection.execute(
        "SELECT username2 "
        "FROM following "
        "WHERE username1 = ?;", [username]
    )
    following = cur.fetchall()
    for each_following in following:
        profile_picture = connection.execute(
            "SELECT filename "
            "FROM users "
            "WHERE username = ?;", [each_following['username2']]
        )
        each_following['user_img_url'] = \
            flask.url_for('download_file',
                          filename=profile_picture.fetchone()['filename'])
        each_following['username'] = each_following['username2']
        check_follow_status = connection.execute(
            "SELECT created "
            "FROM following "
            "WHERE username1 = ? "
            "AND username2 = ?;", [user, each_following['username']]
        )
        if check_follow_status.fetchone():
            each_following['logname_follows_username'] = True
        else:
            each_following['logname_follows_username'] = False

    context = {"logname": user,
               "current_user": username,
               "following": following}
    return flask.render_template("following.html", **context)
