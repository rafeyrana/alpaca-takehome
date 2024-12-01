from setuptools import setup, find_packages

setup(
    name="app",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        "fastapi==0.110.0",
        "uvicorn==0.24.0",
        "sqlalchemy==2.0.23",
        "psycopg2-binary==2.9.9",
        "python-dotenv==1.0.0",
        "pydantic==2.6.1",
        "langchain==0.1.0",
        "langchain-openai==0.0.2",
        "openai==1.8.0",
        "transformers==4.24.0",
        "torch==2.0.0",
    ],
)
