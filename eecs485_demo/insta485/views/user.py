"""
Insta485 index (main) view.

URLs include:
/u/<user_url_slug>/
"""
import flask
import insta485


@insta485.app.route('/u/<user_url_slug>/', methods=['GET', 'POST'])
def show_user(user_url_slug):
    """User page."""
    if 'user' not in flask.session:
        return flask.redirect(flask.url_for('login'))
    connection = insta485.model.get_db()
    check_exist_user = connection.execute(
            "SELECT created "
            "FROM users "
            "WHERE username = ?;", [user_url_slug]
        )
    if not check_exist_user.fetchone():
        return flask.abort(404)
    user = flask.session['user']
    user_own_page = False
    logname_follows_username = False
    if user == user_url_slug:
        user_own_page = True
    check_follow_status = connection.execute(
        "SELECT created "
        "FROM following "
        "WHERE username1 = ? "
        "AND username2 = ?;", [user, user_url_slug]
    )
    if check_follow_status.fetchone():
        logname_follows_username = True
    num_posts = connection.execute(
        "SELECT Count(*) As total_posts "
        "FROM posts "
        "WHERE owner = ?;", [user_url_slug]
    )
    num_followers = connection.execute(
        "SELECT Count(*) As total_followers "
        "FROM following "
        "WHERE username2 = ?;", [user_url_slug]
    )
    num_following = connection.execute(
        "SELECT Count(*) As total_following "
        "FROM following "
        "WHERE username1 = ?;", [user_url_slug]
    )
    full_name = connection.execute(
        "SELECT fullname "
        "FROM users "
        "WHERE username = ?;", [user_url_slug]
    )
    get_post = connection.execute(
        "SELECT postid, filename FROM posts "
        "WHERE owner = ?;", [user_url_slug]
    )
    posts = get_post.fetchall()
    for each_post in posts:
        each_post['img_url'] = flask.url_for(
            'download_file', filename=each_post['filename'])

    context = {"logname": user, "username": user_url_slug,
               'user_own_page': user_own_page,
               "logname_follows_username": logname_follows_username,
               "total_posts": int(num_posts.fetchone()['total_posts']),
               "followers": int(num_followers.fetchone()['total_followers']),
               "following": int(num_following.fetchone()['total_following']),
               "fullname": full_name.fetchone()['fullname'],
               "posts": posts}
    return flask.render_template("user.html", **context)


@insta485.app.route('/following/', methods=['POST'])
def follow():
    """Follow."""
    connection = insta485.model.get_db()
    user = flask.session['user']
    user_url_slug = flask.request.form.get('username')
    check_follow_status = connection.execute(
        "SELECT created "
        "FROM following "
        "WHERE username1 = ? "
        "AND username2 = ?;", [user, user_url_slug]
    )
    if flask.request.form['operation'] == 'follow':
        if check_follow_status.fetchone():
            return flask.abort(409)
        connection.execute(
            "INSERT INTO following(username1, username2) "
            "VALUES(?,?);", [user, user_url_slug]
        )
    elif flask.request.form['operation'] == 'unfollow':
        if not check_follow_status.fetchone():
            return flask.abort(409)
        connection.execute(
            "DELETE FROM following "
            "WHERE username1 = ?"
            "AND username2 = ?;", [user, user_url_slug]
        )
    if flask.request.args.get("target"):
        return flask.redirect(flask.request.args.get("target"))
    return flask.redirect(flask.url_for('show_index'))
