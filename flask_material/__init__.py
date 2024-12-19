from flask import Flask
from flask_material.pages import home

def create_app(config = None):
    app = Flask(__name__)

    # Try to load config
    if config is None:
        app.config.from_pyfile("default_config.py", silent=True)
    else:
        app.config.from_object(config)

    # Register Blueprints
    app.register_blueprint(home.bp)

    return app
