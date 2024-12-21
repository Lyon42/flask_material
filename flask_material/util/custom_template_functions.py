import os
from flask import Flask
from typing import List
from flask_material.util import util


def register_functions(app: Flask):
    @app.context_processor
    def utility_processor():
        def load_svg_unsafe(svg_location: str, id: str = None, classes: List[str] = None):
            """
            Reads a svg from a file in the static folder.
            :param svg_location: The location of the svg relative from the static folder
            :param id: The HTML id to add to the svg -> default: None
            :param classes: The HTML classes that should be added to the svg -> default: None
            :return: The content of the svg file
            """

            if svg_location.endswith(".svg"):
                abs_svg_path = util.find_static_source(svg_location)

                if abs_svg_path is None:
                    return None

                icon = open(abs_svg_path).read()
                insert_index = icon.index("<svg") + 4
                icon = icon[:insert_index] + " " + ("id=\"" + id + "\"" if id else "") + " " + ("class=\"" + " ".join(classes) + "\"" if classes else "") + " " + icon[insert_index:]
                return icon

            return None

        def throw(msg):
            raise Exception(msg)

        return dict(load_svg_unsafe=load_svg_unsafe, throw=throw)
