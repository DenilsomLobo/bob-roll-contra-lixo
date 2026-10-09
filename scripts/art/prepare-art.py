"""Compatibility entry point. The high-resolution pipeline uses Node and Chrome."""
from pathlib import Path
import subprocess
subprocess.run(['node', str(Path(__file__).with_name('prepare-art.mjs'))], check=True)
