"""
Insta485 posts.

URLs include:
/
"""
import os
import pathlib
import uuid
import flask
import arrow
import insta485
from insta485.views.index import check_liked_status


@insta485.app.route('/p/<postid>/', methods=['GET', 'POST'])
def show_post(postid):
    """Display route."""
    if 'user' not in flask.session:
        return flask.redirect(flask.url_for('login'))
    user = flask.session['user']
    # Connect to database
    connection = insta485.model.get_db()
    # GET fetch static file
    # Query database
    cur_post = connection.execute(
        "SELECT postid, filename, owner, created "
        "FROM posts "
        "WHERE postid = ?;", [postid]
    )
    post = cur_post.fetchone()
    if not post:
        flask.abort(404)
    profile_picture = connection.execute(
        "SELECT filename "
        "FROM users "
        "WHERE username = ?;", [post.get('owner')]
    )
    owner_img_url = \
        flask.url_for('download_file',
                      filename=profile_picture.fetchone()['filename'])
    timestamp = arrow.get(post['created']).humanize()
    img_url = flask.url_for('download_file', filename=post['filename'])
    num_likes = connection.execute(
        "SELECT COUNT(*) AS total_likes "
        "FROM likes "
        "WHERE postid = ?;", [postid]
    )
    likes = int(num_likes.fetchone()['total_likes'])

    fecth_comment = connection.execute(
        "SELECT owner, text, commentid "
        "FROM comments "
        "WHERE postid = ?;", [postid]
    )
    comments = fecth_comment.fetchall()
    liked = check_liked_status(connection, user, post)

    context = {'logname': user, 'postid': post['postid'],
               'owner': post.get('owner'), 'owner_img_url': owner_img_url,
               'timestamp': timestamp, 'img_url': img_url,
               'likes': likes, 'comments': comments,
               'liked': liked}
    return flask.render_template("post.html", **context)


@insta485.app.route('/posts/', methods=['POST'])
def change_post():
    """Change post."""
    user = flask.session['user']
    connection = insta485.model.get_db()
    if flask.request.form['operation'] == 'create':
        if not flask.request.files['file']:
            flask.abort(400)
        fileobj_post = flask.request.files["file"]
        filename = fileobj_post.filename
        uuid_basename = "{stem}{suffix}".format(
            stem=uuid.uuid4().hex,
            suffix=pathlib.Path(filename).suffix
        )
        path = insta485.app.config["UPLOAD_FOLDER"] / uuid_basename
        fileobj_post.save(path)
        connection.execute(
            "INSERT INTO posts(filename, owner) "
            "VALUES(?,?);", [uuid_basename, user]
        )
        if flask.request.args.get("target"):
            return flask.redirect(flask.request.args.get("target"))
        return flask.redirect(
                flask.url_for('show_user', user_url_slug=user))

    check_owner = connection.execute(
        "SELECT filename FROM posts "
        "WHERE postid = ? "
        "AND owner = ?;", [flask.request.form['postid'],
                           user]
    )
    file_name_temp = check_owner.fetchone()
    if not file_name_temp:
        flask.abort(403)
    file_name = file_name_temp['filename']
    os.remove(insta485.app.config["UPLOAD_FOLDER"]/file_name)
    connection.execute(
        "DELETE FROM posts "
        "WHERE postid = ?;", [flask.request.form['postid']]
    )
    if flask.request.args.get("target"):
        return flask.redirect(flask.request.args.get("target"))
    return flask.redirect(
            flask.url_for('show_user', user_url_slug=user))
