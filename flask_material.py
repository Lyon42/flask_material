from flask import Flask, send_from_directory
import os

if __name__ == "main":
    from flask_material import create_app
    create_app()

def init(app: Flask):
    if __name__ == "main":
        raise Exception("Init should only be called if FlaskMaterial is used as library!")

    root_path = os.path.dirname(__file__)

    @app.route("/<path:filename>")
    def flask_material(filename: str):
        return send_from_directory(root_path + "\\static\\", filename)
