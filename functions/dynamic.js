const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cookieParser = require("cookie-parser")();
const bodyParser = require("body-parser");

const cors = require("cors")({
    origin: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "PURGE", "DELETE"]
});

const app = express();
const async = require("async");
const moment = require("moment");
const _ = require("lodash");
const fs = require("fs");
const axios = require("axios");

var db = admin.firestore();

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.text());
app.use(cookieParser);

app.get("/query/ping", function (req, res) {
    res.status(200).json({
        ping: "pong"
    });
});

app.post("/query/photo", function(req, res) {
    // upload image
    const base64Image = req.body.image;
    const apiKey = process.env.ROBOFLOW_KEY;
    const workspaceName = process.env.ROBOFLOW_WORKSPACE_NAME;
    const projectName = "user-photos";

    var getCLIPVectors = function(imageId, callback) {
        axios({
            method: "GET",
            url: `https://api.roboflow.com/${process.env.ROBOFLOW_WORKSPACE_NAME}/${projectName}/image/${imageId}?noCache=true&api_key=${apiKey}`,
            headers: { "Content-Type": "application/json" },
        })
        .then(function (response) {
            var image = response?.data?.image;
            if(image?.embedding?.length) {
                callback(null, image);
            } else {
                setTimeout(function() {
                    getCLIPVectors(imageId, callback);
                }, 1000);
            }
        })
        .catch(function (error) {
            console.log(error.message);
            callback(error, null);
        });
    };

    var getSimilarImage = function(imageId, callback) {
        // use search API
        const apiKey = process.env.ROBOFLOW_KEY;
        axios({
            method: "POST",
            url: `https://api.roboflow.com/${process.env.ROBOFLOW_WORKSPACE_NAME}/celeb-dataset/search`,
            headers: {
                "Authorization": `Bearer ${apiKey}`
            },
            data: {
                prompt: `like-image:${imageId}`,
                limit: 5,
                offset: 0,
                fields: ["id"]
            }
        })
        .then(function (response) {
            var results = response?.data?.results;
            callback(null, results);
        })
        .catch(function (error) {
            console.log(error.message);
            callback(error, null);
        });
    };

    axios({
        method: "POST",
        url: `https://api.roboflow.com/dataset/${projectName}/upload`,
        params: { api_key: apiKey, name: "user-image.jpg", split: "train" },
        data: base64Image,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
    .then(function (response) {
        console.log(response.data);
        const imageId = response.data.id;
        getCLIPVectors(imageId, function(err, image) {
            getSimilarImage(imageId, function(err, similarImages) {
                res.status(200).json({
                    uploadedImage: imageId,
                    embedding: image?.embedding || null,
                    similarImages: similarImages || null
                });
            });
        });

        // ping against the API until there are CLIP vectors
    })
    .catch(function (error) {
        console.log(error.message);
        res.json({
            error: "Error uploading image"
        });
    });

    // hit search API

    // return best result
    
});

exports.app = app;