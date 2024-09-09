# Use the official Python image from the Docker Hub
FROM python:3.8

# Set environment variables to avoid prompts during installation
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1


# Add a non-root user to avoid running Chrome as root
RUN useradd -m backenduser
USER backenduser
WORKDIR /home/backenduser
# Copy your Selenium script into the container
# COPY your_script.py /home/seleniumuser/

# Example entrypoint to run the Selenium script
# CMD ["python", "/home/seleniumuser/your_script.py"]

# For demonstration, we'll start a Python interactive shell

COPY ./requirements.txt /home/backenduser/requirements.txt

RUN pip install -r requirements.txt

COPY . /home/backenduser

EXPOSE 88

CMD ["python", "main.py"]