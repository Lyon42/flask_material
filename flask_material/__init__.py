import os
from flask import Flask, Blueprint, send_from_directory
from flask_material.pages import home

root_path = os.path.dirname(__file__)
bp = Blueprint("flask_material", __name__, static_folder = root_path + "\\static\\", template_folder = root_path + "\\templates\\", url_prefix = '/flask_material')

def init(app: Flask):
    app.register_blueprint(bp)

def create_app(config = None):
    app = Flask(__name__)
    init(app)

    # Try to load config
    if config is None:
        app.config.from_pyfile("default_config.py", silent=True)
    else:
        app.config.from_object(config)

    # Register Blueprints
    app.register_blueprint(home.bp)

    return app
