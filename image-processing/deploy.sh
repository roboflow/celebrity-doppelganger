gcloud builds submit --tag gcr.io/rf-magicscissors/magicscissors-python --project rf-magicscissors
gcloud run deploy magicscissors-python --image gcr.io/rf-magicscissors/magicscissors-python --platform managed --region us-central1 --allow-unauthenticated --project rf-magicscissors