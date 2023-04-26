/*jshint esversion:6*/

const $ = require("jquery");
const page = require("page");
const swal = require("sweetalert2");
const _ = require("lodash");

const { initializeApp } = require("firebase/app");

// this gets downloaded from your Firebase project settings
const firebaseConfig = require("../../secrets/firebase.config.json");
const app = initializeApp(firebaseConfig);

const { getFirestore } = require("firebase/firestore");
const db = getFirestore(app);

const state = {
    workspace: null,
    apiKey: null,
    app: app,
    db: db
};

window.state = state;

$(function () {
    window.$ = $;

    _.mixin({
        getItem: function (k) {
            try {
                return localStorage.getItem(k);
            } catch (e) {
                return localStorageFallback[k] || null;
            }
        },
        setItem: function (k, v) {
            try {
                localStorage.setItem(k, v);
            } catch (e) {
                localStorageFallback[k] = v;
            }
        },
        removeItem: function (k) {
            try {
                localStorage.removeItem(k);
            } catch (e) {
                delete localStorageFallback[k];
            }
        },
        clear: function () {
            try {
                localStorage.clear();
            } catch (e) {
                localStorageFallback = {};
            }
        }
    });

    var loading = function(ctx, next) {
        $('body').html(require("../templates/loading.hbs")());
        setTimeout(function() {
            next();
        }, 0);
    };

    page("/", require(__dirname + "/routes/homepage.js")(state));

    page.start();
});
