python3 -m pip install --upgrade pip
python3 -m pip install virtualenv
python3 -m virtualenv venv --python=python3.9
python3 -m pip install -r requirements.txt
python3 manage.py makemigrations
python3 manage.py migrate