import os
from typing import Iterator, Optional
from flask import current_app


def find_static_source(rel_path: str) -> Optional[str]:
    for static_dir in iter_static_folders():
        abs_path = os.path.join(static_dir, rel_path)

        if os.path.exists(abs_path):
            return abs_path

    return None


def iter_static_folders() -> Iterator[str]:
    if current_app is not None:
        yield current_app.static_folder

        for blueprint in current_app.iter_blueprints():
            yield blueprint.static_folder
