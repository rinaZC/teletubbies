"""
Insta485 index (main) view.

URLs include:
/explore/
"""
import flask
import insta485


@insta485.app.route('/explore/', methods=['GET', 'POST'])
def show_explore():
    """Display /explore/ route."""
    if 'user' not in flask.session:
        return flask.redirect(flask.url_for('login'))

    user = flask.session['user']
    connection = insta485.model.get_db()
    not_following_un_temp = connection.execute(
        "SELECT username "
        "FROM users "
        "WHERE username NOT IN "
        "(SELECT username2 FROM following "
        "WHERE username1 = ?) "
        "AND username != ?;", [user, user]
    )
    not_following_un = not_following_un_temp.fetchall()
    not_following = []
    for un_use in not_following_un:
        each_follower = {}
        user_img_temp = connection.execute(
            "SELECT filename "
            "FROM users "
            "WHERE username = ?;", [un_use['username']]
        )
        each_follower['user_img_url'] = flask.url_for(
            'download_file',
            filename=user_img_temp.fetchone()['filename']
        )
        each_follower['username'] = un_use['username']
        not_following.append(each_follower)

    context = {"logname": user, "not_following": not_following}
    return flask.render_template("explore.html", **context)
