import os
from flask import Flask, Blueprint, render_template
from flask_material.util import custom_template_functions

root_path = os.path.dirname(__file__)
bp = Blueprint("flask_material", __name__, static_folder = root_path + "\\static\\", template_folder = root_path + "\\templates\\", url_prefix = '/flask_material')

def init(app: Flask):
    app.register_blueprint(bp)

    # Load Jinja extensions
    app.jinja_env.add_extension('jinja2.ext.do')

    # Register context processors
    custom_template_functions.register_functions(app)

def create_app(config = None):
    app = Flask(__name__)
    init(app)

    # Try to load config
    if config is None:
        app.config.from_pyfile("default_config.py", silent=True)
    else:
        app.config.from_object(config)

    register_routes(app)

    return app

def register_routes(app: Flask):
    @app.route("/")
    def component():
        return render_template("flask_material/test/component_test.html")

    @app.route("/navigation_drawer")
    def navigation_drawer():
        return render_template("flask_material/test/navigation_drawer_test.html")

    @app.route("/retractable_navigation_drawer")
    def modal_navigation_drawer():
        return render_template("flask_material/test/retractable_navigation_drawer_test.html")

    @app.route("/modal_navigation_drawer")
    def retractable_navigation_drawer():
        return render_template("flask_material/test/modal_navigation_drawer_test.html")
