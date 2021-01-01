FROM python:3.8-slim

WORKDIR /app
COPY . .
RUN pip install --trusted-host pypi.python.org -r requirements.txt 

CMD python app.py
EXPOSE 80
