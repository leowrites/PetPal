python3 -m pip install --upgrade pip
python3 -m pip install virtualenv
python3 -m virtualenv venv
. venv/bin/activate
python3 -m pip install -r requirements.txt
python3 manage.py makemigrations
python3 manage.py migrate