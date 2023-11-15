virtualenv venv --python=python3.9
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate