"""
Insta485.

URLs include:
/u/user_url/follower
"""
import flask
import insta485


@insta485.app.route('/u/<username>/followers/', methods=['GET'])
def show_followers(username):
    """Display route."""
    if 'user' not in flask.session:
        return flask.redirect(flask.url_for('login'))
    connection = insta485.model.get_db()
    check_exist_follower = connection.execute(
        "SELECT created "
        "FROM users "
        "WHERE username = ?;", [username]
    )
    if not check_exist_follower.fetchone():
        flask.abort(404)

    user = flask.session['user']
    # Connect to database
    connection = insta485.model.get_db()
    # GET fetch static file
    # Query database
    cur = connection.execute(
        "SELECT username1 "
        "FROM following "
        "WHERE username2 = ?;", [username]
    )
    followers = cur.fetchall()
    for each_follower in followers:
        profile_picture = connection.execute(
            "SELECT filename "
            "FROM users "
            "WHERE username = ?;", [each_follower['username1']]
        )
        each_follower['user_img_url'] = \
            flask.url_for('download_file',
                          filename=profile_picture.fetchone()['filename'])
        each_follower['username'] = each_follower['username1']
        check_follow_status = connection.execute(
            "SELECT created "
            "FROM following "
            "WHERE username1 = ? "
            "AND username2 = ?;", [user, each_follower['username']]
        )
        if check_follow_status.fetchone():
            each_follower['logname_follows_username'] = True
        else:
            each_follower['logname_follows_username'] = False

    context = {"logname": user,
               "current_user": username,
               "followers": followers}
    return flask.render_template("followers.html", **context)
