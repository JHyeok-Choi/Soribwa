#!/usr/bin/env python
# coding=utf-8

from fastapi import FastAPI, status, File, UploadFile, APIRouter, WebSocket, WebSocketDisconnect, Request
#from fastapi.response import FileResponse
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from datetime import datetime
# from model import Todo

### MYSQL RDS
from pydantic import BaseModel, EmailStr, Field, Json
from database import db_conn
from models import User_info

### Kakao geoLocation
import requests
import hashlib
import hmac
import base64
import time
import uuid


from dotenv import load_dotenv
import os
load_dotenv()

ACCESSKEY = os.environ.get('AccessKey')
SECRETKEY = os.environ.get('SecretKey')
IP=os.environ.get('IP')


from typing_extensions import Annotated

import sys
import contextlib
import requests



import os
import librosa
import librosa.display
import struct 
import numpy as np
import IPython.display as ipd
from sklearn.preprocessing import MinMaxScaler
import matplotlib.pyplot as plt

import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn import metrics
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix 
from keras.utils import to_categorical
from keras.models import Sequential
from keras.layers import Dense, Dropout, Activation, Flatten
from keras.layers import Convolution2D, MaxPooling2D
from keras.optimizers import Adam
from keras.callbacks import ModelCheckpoint  
from keras.models import load_model




import soundfile
import io
import pydub
import librosa


######################
# ENCODING
from pprint import pprint
import scipy.io.wavfile
import numpy

######################


import warnings
warnings.filterwarnings('ignore')


#
model = load_model('urban_sound_model.h5')
print("Model loaded from urban_sound_model.h5")
#
fulldatasetpath = './urbansund8k/'




metadata = pd.read_csv('./urbansound8k/UrbanSound8K.csv')
le = LabelEncoder()
le.fit(metadata['class'])


app = FastAPI()
router = APIRouter()

app.add_middleware(
    # HTTPSRedirectMiddleware,
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db = db_conn()
session = db.sessionmaker()


@app.get(
    path='/', description="main",
    responses={200:{"description": "okok"}}
)
async def open_main():
    return "OK"

if __name__ == "__main__":
    uvicorn.run (app, host="0.0.0.0", port=5400)


@app.post('/node_test')
async def node_test(file: UploadFile):

    filename = file.filename
    test_file = os.path.join('./upload', filename)
    content = await file.read()

    with open(os.path.join('./upload', filename), 'wb') as fp:
            fp.write(content)
    

    audio_data, sample_rate = librosa.load(test_file, res_type='kaiser_fast')

    ### 데시벨 측정
    S = np.abs(librosa.stft(audio_data))
    dB = librosa.amplitude_to_db(S, ref=1e-05)
    print("check db mean: ", np.mean(dB))
    # dBm = str(int(np.mean(dB)))
    ###
    print("datetimme: ", datetime.now())

    mfccs = librosa.feature.mfcc(y=audio_data, sr=sample_rate, n_mfcc=40)
    mfccsscaled = np.mean(mfccs.T, axis=0)
    test_feature = np.array([mfccsscaled])
    
    if test_feature is not None:
        predicted_proba_vactor = model.predict(test_feature)
        predicted_class_index = np.argmax(predicted_proba_vactor)
        predicted_class_label = le.inverse_transform([predicted_class_index])[0]
        
        predicted_class_label = 'silence' if predicted_class_label in ['children_playing','street_music', 'air_conditioner', 'gun_shot', 'engine_idling'] else predicted_class_label
        print('=======================')
        print(f"The predicted class for {test_file} is: {predicted_class_label}")
        return jsonable_encoder({"date": str(datetime.now().strftime('%Y-%m-%d-%H:%M:%S')), "label": predicted_class_label, "dB": dBm})
    else:
        print("Failed to extract features from the file.")

    return "OKOK Done"




app.include_router(router)