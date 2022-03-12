"""
Insta485 index (main) view.

URLs include:
/
"""
import flask
import arrow
import insta485


@insta485.app.route('/', methods=['GET', 'POST'])
def show_index():
    """Display / route."""
    if 'user' not in flask.session:
        return flask.redirect(flask.url_for('login'))
    user = flask.session['user']
    # Connect to database
    connection = insta485.model.get_db()
    # GET fetch static file
    # Query database
    cur_index = connection.execute(
        "SELECT postid, filename, owner, created "
        "FROM posts "
        "WHERE owner = ? "
        "OR owner IN (SELECT username2 "
        "FROM following WHERE username1 = ?) "
        "ORDER BY posts.postid DESC;", [user, user]
    )
    posts = cur_index.fetchall()

    for each_post in posts:
        profile_picture = connection.execute(
            "SELECT filename "
            "FROM users "
            "WHERE username = ?;", [each_post['owner']]
        )
        each_post['owner_img_url'] = \
            flask.url_for('download_file',
                          filename=profile_picture.fetchone()['filename'])
        each_post['timestamp'] = arrow.get(each_post['created']).humanize()
        each_post['img_url'] = \
            flask.url_for('download_file', filename=each_post['filename'])

        num_likes = connection.execute(
            "SELECT COUNT(*) AS total_likes "
            "FROM likes "
            "WHERE postid = ?;", [each_post['postid']]
        )
        each_post['likes'] = int(num_likes.fetchone()['total_likes'])
        fecth_comment = connection.execute(
            "SELECT owner, text "
            "FROM comments "
            "WHERE postid = ?;", [each_post['postid']]
        )
        each_post['comments'] = fecth_comment.fetchall()
        if check_liked_status(connection, user, each_post):
            each_post['liked'] = True
        else:
            each_post['liked'] = False
    # Add database info to context
    context = {"users": user, "posts": posts}
    return flask.render_template("index.html", **context)


def check_liked_status(connection, user, r_form):
    """check_liked_status."""
    temp = connection.execute(
        "SELECT created "
        "FROM likes "
        "WHERE owner = ? "
        "AND postid = ?", [user, r_form['postid']]
    )
    if temp.fetchone():
        return True
    return False


@insta485.app.route('/likes/', methods=['POST'])
def change_like():
    """Change like."""
    user = flask.session['user']
    connection = insta485.model.get_db()
    if flask.request.form['operation'] == 'like':
        if not check_liked_status(connection, user, flask.request.form):
            connection.execute(
                "INSERT INTO likes(owner, postid) "
                "VALUES (?,?);", [user, flask.request.form['postid']]
            )
        else:
            return flask.abort(409)
    elif flask.request.form['operation'] == 'unlike':
        if check_liked_status(connection, user, flask.request.form):
            connection.execute(
                "DELETE FROM likes "
                "WHERE owner = ? "
                "AND postid = ?;", [user, flask.request.form['postid']]
            )
        else:
            return flask.abort(409)
    if flask.request.args.get('target'):
        return flask.redirect(flask.request.args.get('target'))
    return flask.redirect(flask.url_for('show_index'))


@insta485.app.route('/comments/', methods=['POST'])
def change_comment():
    """Change comment."""
    user = flask.session['user']
    connection = insta485.model.get_db()
    if flask.request.form['operation'] == 'create':
        if flask.request.form.get('text'):
            connection.execute(
                "INSERT INTO comments(owner, postid, text) "
                "VALUES (?,?,?);", [user, flask.request.form['postid'],
                                    flask.request.form['text']]
            )
        else:
            flask.abort(400)
    elif flask.request.form['operation'] == 'delete':
        check_user = connection.execute(
            "SELECT created FROM comments "
            "WHERE commentid = ? "
            "And owner = ?;", [flask.request.form['commentid'],
                               user]
        )
        if check_user.fetchone():
            connection.execute(
                "DELETE FROM comments "
                "WHERE commentid = ?;", [flask.request.form['commentid']]
            )
        else:
            flask.abort(403)
    if flask.request.args.get('target'):
        return flask.redirect(flask.request.args.get('target'))
    return flask.redirect(flask.url_for('show_index'))
