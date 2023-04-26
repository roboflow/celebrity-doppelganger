gcloud builds submit --tag gcr.io/rf-doppelganger/doppelganger-python --project rf-magicscissors
gcloud run deploy doppelganger-python --image gcr.io/rf-doppelganger/doppelganger-python --platform managed --region us-central1 --allow-unauthenticated --project rf-doppelganger --memory 16G --cpu 8 --timeout 60m --concurrency 1 --execution-environment gen2