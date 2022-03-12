"""
Insta485 account view.

URLs include:
/accounts/
"""
import os
import pathlib
import uuid
import hashlib
import flask
import insta485


@insta485.app.route('/accounts/', methods=['POST'])
def accounts():
    """Receive /accounts/ POST."""
    if flask.request.form['operation'] == 'create':
        return account_create()
    if flask.request.form['operation'] == 'delete':
        return account_delete()
    if flask.request.form['operation'] == 'login':
        return account_login()
    if flask.request.form['operation'] == 'edit_account':
        return account_edit()
    return account_password()


def account_create():
    """Receive /accounts/ POST."""
    connection = insta485.model.get_db()

    fullname = flask.request.form.get("fullname")
    username = flask.request.form.get("username")
    check_username = connection.execute(
        "SELECT created FROM users "
        "WHERE username = ?;", [username]
    )

    if check_username.fetchone():
        flask.abort(409)
    email = flask.request.form.get("email")
    password = flask.request.form.get("password")
    fileobj = flask.request.files.get("file")

    if ((not fullname) or (not username) or
            (not email) or (not password) or (not fileobj)):
        flask.abort(400)
    filename = fileobj.filename
    password = generate_password(flask.request.form.get("password"))
    uuid_basename = "{stem}{suffix}".format(
        stem=uuid.uuid4().hex,
        suffix=pathlib.Path(filename).suffix
    )
    # Save to disk
    path = insta485.app.config["UPLOAD_FOLDER"] / uuid_basename
    fileobj.save(path)

    connection.execute(
        "INSERT INTO users(username, fullname, email, filename, password) "
        "VALUES(?,?,?,?,?);", [username, fullname,
                               email, uuid_basename, password]
    )
    flask.session['user'] = username
    if flask.request.args.get("target"):
        return flask.redirect(flask.request.args.get("target"))
    return flask.redirect(flask.url_for('show_index'))


def account_delete():
    """Receive /accounts/ POST."""
    if 'user' not in flask.session:
        flask.abort(403)
    user = flask.session['user']
    connection = insta485.model.get_db()
    filename_temp = connection.execute(
        "SELECT filename FROM users "
        "WHERE username = ?;", [user]
    )
    postimg_temp = connection.execute(
        "SELECT filename FROM posts "
        "WHERE owner = ?;", [user]
    )
    postimgs = postimg_temp.fetchall()
    for img in postimgs:
        img_name = img['filename']
        os.remove(insta485.app.config["UPLOAD_FOLDER"] / img_name)
    file_name = filename_temp.fetchone()['filename']
    os.remove(insta485.app.config["UPLOAD_FOLDER"] / file_name)
    connection.execute(
        "DELETE FROM users "
        "WHERE username = ?;", [user]
    )
    flask.session.clear()
    if flask.request.args.get("target"):
        return flask.redirect(flask.request.args.get("target"))
    return flask.redirect(flask.url_for('create'))


def account_login():
    """Receive /accounts/ POST."""
    if (not flask.request.form.get('username')) or \
            (not flask.request.form.get('password')):
        flask.abort(400)
    connection = insta485.model.get_db()
    auth_user = connection.execute(
        "SELECT password FROM users "
        "WHERE username = ?;", [flask.request.form['username']]
    )
    is_existed = auth_user.fetchone()
    if not is_existed:
        flask.abort(403)
    if is_right_password(is_existed['password'],
                         flask.request.form['password']):
        flask.session['user'] = flask.request.form['username']
    else:
        flask.abort(403)
    if flask.request.args.get("target"):
        return flask.redirect(flask.request.args.get("target"))
    return flask.redirect(flask.url_for('show_index'))


def account_edit():
    """Receive /accounts/ POST."""
    if 'user' not in flask.session:
        flask.abort(403)
    elif (not flask.request.form.get('fullname')) or \
            (not flask.request.form.get('email')):
        flask.abort(400)
    connection = insta485.model.get_db()
    user = flask.session['user']
    connection.execute(
        "UPDATE users "
        "SET fullname = ?, email = ? "
        "WHERE username = ?;", [flask.request.form['fullname'],
                                flask.request.form['email'], user]
    )
    if flask.request.files.get('file'):
        file_name_temp = connection.execute(
            "SELECT filename FROM users "
            "WHERE username = ?;", [user]
        )
        file_name = file_name_temp.fetchone()['filename']
        os.remove(insta485.app.config["UPLOAD_FOLDER"] / file_name)
        fileobj_account = flask.request.files["file"]
        filename = fileobj_account.filename
        uuid_basename = "{stem}{suffix}".format(
            stem=uuid.uuid4().hex,
            suffix=pathlib.Path(filename).suffix
        )
        # Save to disk
        path = insta485.app.config["UPLOAD_FOLDER"] / uuid_basename
        fileobj_account.save(path)
        connection.execute(
            "UPDATE users "
            "SET filename = ? "
            "WHERE username = ?;", [uuid_basename, user]
        )
    if flask.request.args.get("target"):
        return flask.redirect(flask.request.args.get("target"))
    return flask.redirect(flask.url_for('edit'))


def account_password():
    """Receive /accounts/ POST."""
    if 'user' not in flask.session:
        flask.abort(403)
    elif (not flask.request.form.get('password')) or \
            (not flask.request.form.get('new_password1')) or \
            (not flask.request.form.get('new_password2')):
        flask.abort(400)
    user = flask.session['user']
    connection = insta485.model.get_db()
    user_password_temp = connection.execute(
        "SELECT password FROM users "
        "WHERE username = ?;", [user]
    )
    user_password = \
        user_password_temp.fetchone()['password']
    if not is_right_password(user_password,
                             flask.request.form['password']):
        flask.abort(403)
    if flask.request.form['new_password1'] != \
            flask.request.form['new_password2']:
        flask.abort(401)
    connection.execute(
        "UPDATE users "
        "SET password = ? "
        "WHERE username = ?;", [
            generate_password(flask.request.form['new_password1']),
            user]
    )
    if flask.request.args.get("target"):
        return flask.redirect(flask.request.args.get("target"))
    return flask.redirect(flask.url_for('edit'))


def generate_password(password):
    """Create new password."""
    algorithm = 'sha512'
    salt = uuid.uuid4().hex
    hash_obj = hashlib.new(algorithm)
    password_salted = salt + password
    hash_obj.update(password_salted.encode('utf-8'))
    password_hash = hash_obj.hexdigest()
    password_db_string = "$".join([algorithm, salt, password_hash])
    return password_db_string


def is_right_password(db_password, typed_password):
    """Check if password matches."""
    decrypt_temp = str(db_password).split('$')
    salt = decrypt_temp[1]
    hash_obj = hashlib.new('sha512')
    password_salted = salt + typed_password
    hash_obj.update(password_salted.encode('utf-8'))
    password_hash = hash_obj.hexdigest()
    password_db_string = "$".join(['sha512', salt, password_hash])
    if password_db_string == db_password:
        return True
    return False
