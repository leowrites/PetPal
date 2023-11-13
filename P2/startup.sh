virtualenv venv --python=python3.9
pip install -r packages.txt
python manage.py makemigrations
python manage.py migrate