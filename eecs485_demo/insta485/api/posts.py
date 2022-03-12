"""REST API for posts."""
import flask
import insta485


@insta485.app.route("/api/v1/p/", methods=['GET'])
def get_newest_posts():
    """Return the 10 newest posts."""
    if 'user' not in flask.session:
        return error_403()
    user = flask.session['user']
    connection = insta485.model.get_db()

    post_lte = flask.request.args.get("postid_lte", default=connection.execute
                                      ("SELECT postid FROM posts "
                                       "ORDER BY postid "
                                       "DESC LIMIT 1;").fetchone()['postid'],
                                      type=int)
    post_size = flask.request.args.get("size", default=10, type=int)
    post_page = flask.request.args.get("page", default=0, type=int)
    if post_size < 0 or post_page < 0:
        context = {
            "message": "Bad Request",
            "status_code": 400
        }
        return flask.jsonify(**context), 400

    qualified_posts_temp = connection.execute(
        "SELECT postid FROM posts "
        "WHERE (owner = ? "
        "OR owner IN (SELECT username2 "
        "FROM following WHERE username1 = ?))"
        "AND postid <= ? "
        "ORDER BY posts.postid DESC "
        "LIMIT ? OFFSET ?;",
        [user, user, post_lte, post_size, post_page * post_size]
    )

    qualified_posts = qualified_posts_temp.fetchall()
    for each_post in qualified_posts:
        each_post['url'] = "/api/v1/p/{}/".format(each_post['postid'])

    if post_lte == float('inf'):
        post_lte = qualified_posts[0]['postid']

    next_temp = ""
    if len(qualified_posts) == post_size:
        next_temp = "/api/v1/p/?size={}&page={}&postid_lte={}". \
            format(post_size, post_page + 1, post_lte)

    context = {
        "next": next_temp,
        "results": qualified_posts,
        "url": flask.request.path
    }
    return flask.jsonify(**context), 200


@insta485.app.route('/api/v1/p/<int:postid_url_slug>/', methods=["GET"])
def get_post(postid_url_slug):
    """Return post on postid."""
    if 'user' not in flask.session:
        return error_403()

    connection_post = insta485.model.get_db()

    post_temp_post = connection_post.execute(
        "SELECT postid, filename, owner, created "
        "FROM posts WHERE postid = ?;", [postid_url_slug]
    )
    post_post = post_temp_post.fetchone()
    if not post_post:
        context = {
            "message": "Not Found",
            "status_code": 404
        }
        return flask.jsonify(**context), 404

    person_temp = connection_post.execute(
        "SELECT username, filename "
        "FROM users WHERE username = ?;", [post_post['owner']]
    )
    person = person_temp.fetchone()

    context = {
        "age": post_post['created'],
        "img_url": "/uploads/{}".format(post_post['filename']),
        "owner": post_post['owner'],
        "owner_img_url": "/uploads/{}".format(person['filename']),
        "owner_show_url": "/u/{}/".format(person['username']),
        "postid": "/p/{}/".format(postid_url_slug),
        "url": flask.request.path,
    }
    return flask.jsonify(**context), 200


@insta485.app.route('/api/v1/p/<int:postid_url_slug>/comments/',
                    methods=["GET"])
def get_comments(postid_url_slug):
    """Return post on postid."""
    if 'user' not in flask.session:
        return error_403()

    connection_comment = insta485.model.get_db()
    if not check_post_range(connection_comment, postid_url_slug):
        return error_404()

    post_comment_temp = connection_comment.execute(
        "SELECT commentid, owner, postid, text "
        "FROM comments WHERE postid = ?;", [postid_url_slug]
    )
    post_comment = post_comment_temp.fetchall()

    cs_result = []
    for comment in post_comment:
        c_temp = {}
        c_temp["commentid"] = comment['commentid']
        c_temp["owner"] = comment['owner']
        c_temp["owner_show_url"] = "/u/{}/".format(comment['owner'])
        c_temp["postid"] = comment['postid']
        c_temp["text"] = comment['text']
        cs_result.append(c_temp)

    context = {
        "comments": cs_result,
        "url": flask.request.path
    }
    return flask.jsonify(**context), 200


@insta485.app.route('/api/v1/p/<int:postid_url_slug>/comments/',
                    methods=["POST"])
def post_comments(postid_url_slug):
    """Return post on postid."""
    if 'user' not in flask.session:
        return error_403()

    connection_comment = insta485.model.get_db()
    text_get = flask.request.get_json()
    text = text_get['text']

    connection_comment.execute(
        "INSERT INTO comments(owner, postid, text) "
        "VALUES (?,?,?);", [flask.session['user'], postid_url_slug,
                            text]
    )
    context = {
        "commentid": connection_comment.execute
        ("SELECT last_insert_rowid()").fetchone(),
        "owner": flask.session['user'],
        "owner_show_url": "/u/{}/".format(flask.session['user']),
        "postid": postid_url_slug,
        "text": text
    }
    return flask.jsonify(**context), 201


@insta485.app.route('/api/v1/p/<int:postid_url_slug>/likes/',
                    methods=["GET"])
def get_likes(postid_url_slug):
    """Check likes status."""
    if 'user' not in flask.session:
        return error_403()

    connection_like = insta485.model.get_db()
    post_temp_post = connection_like.execute(
        "SELECT postid, filename, owner, created "
        "FROM posts WHERE postid = ?;", [postid_url_slug]
    )
    post_post = post_temp_post.fetchone()
    if not post_post:
        context = {
            "message": "Not Found",
            "status_code": 404
        }
        return flask.jsonify(**context), 404

    num_likes = connection_like.execute(
        "SELECT COUNT(*) AS total_likes "
        "FROM likes "
        "WHERE postid = ?;", [postid_url_slug]
    )

    context = {
        "logname_likes_this": check_liked_status
        (connection_like, flask.session['user'], postid_url_slug),
        "likes_count": int(num_likes.fetchone()['total_likes']),
        "postid": postid_url_slug,
        "url": flask.request.path
    }
    return flask.jsonify(**context), 200


@insta485.app.route('/api/v1/p/<int:postid_url_slug>/likes/',
                    methods=["DELETE"])
def delete_likes(postid_url_slug):
    """Return the 10 newest posts."""
    if 'user' not in flask.session:
        return error_403()

    connection_like = insta485.model.get_db()
    if not check_post_range(connection_like, postid_url_slug):
        return error_404()
    connection_like.execute(
        "DELETE FROM likes "
        "WHERE owner = ? "
        "AND postid = ?;", [flask.session['user'], postid_url_slug]
    )
    return "", 204


@insta485.app.route('/api/v1/p/<int:postid_url_slug>/likes/',
                    methods=["POST"])
def post_likes(postid_url_slug):
    """Return the 10 newest posts."""
    if 'user' not in flask.session:
        return error_403()

    connection_like = insta485.model.get_db()
    if not check_post_range(connection_like, postid_url_slug):
        return error_404()
    if check_liked_status(connection_like,
                          flask.session['user'], postid_url_slug):
        context = {
            "logname": flask.session['user'],
            "message": "Conflict",
            "postid": postid_url_slug,
            "status_code": 409
        }
        return flask.jsonify(**context), 409

    connection_like.execute(
        "INSERT INTO likes(owner, postid) "
        "VALUES (?,?);", [flask.session['user'], postid_url_slug]
    )
    context = {
        "logname": flask.session['user'],
        "postid": postid_url_slug
    }

    return flask.jsonify(**context), 201


def error_403():
    """Return the 10 newest posts."""
    context = {
        "message": "Forbidden",
        "status_code": 403
    }
    return flask.jsonify(**context), 403


def check_liked_status(connection, user, post_id):
    """check_liked_status."""
    temp = connection.execute(
        "SELECT created "
        "FROM likes "
        "WHERE owner = ? "
        "AND postid = ?;", [user, post_id]
    )
    if temp.fetchone():
        return 1
    return 0


def check_post_range(connection, postid_url_slug):
    """Check post is in range."""
    post_temp = connection.execute(
        "SELECT postid, filename, owner, created "
        "FROM posts WHERE postid = ?;", [postid_url_slug]
    )
    if not post_temp.fetchone():
        return False
    return True


def error_404():
    """Return the 10 newest posts."""
    context = {
        "message": "Not Found",
        "status_code": 404
    }
    return flask.jsonify(**context), 404
