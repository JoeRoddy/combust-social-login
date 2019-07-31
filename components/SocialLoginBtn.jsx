import React from "react";
import firebase from "@firebase/app";
import "@firebase/auth";

import Icon from "../../../reusable/Icon";

const SocialLoginBtn = ({
  type,
  icon,
  backgroundColor,
  color = "white",
  onLogin
}) => {
  return (
    <button
      className="SocialLoginBtn uk-button uk-button-default uk-form-width-medium uk-margin-small"
      style={{ backgroundColor, color }}
      onClick={() =>
        loginWithThirdParty(type, (err, authInfo) => {
          if (err && err.code === "auth/operation-not-allowed") {
            alert(`ERR: Enable ${icon} auth for firebase`);
            window.open(getAuthConfigUrl(), "_blank");
          } else if (err) {
            onLogin(err);
          } else {
            const { uid } = authInfo.user;
            firebase
              .database()
              .ref(`users/${uid}`)
              .child("publicInfo")
              .update({
                isOnline: true
              })
              .then(res => onLogin(err, authInfo));
          }
        })
      }
    >
      <Icon type={type.toLowerCase()} />
      {type}
    </button>
  );
};

export default SocialLoginBtn;

const loginWithThirdParty = (type, callback) => {
  firebase
    .auth()
    .signInWithPopup(new firebase.auth[`${type}AuthProvider`]())
    .then(authInfo => {
      callback(null, authInfo);
    })
    .catch(error => {
      callback(error);
    });
};

const getAuthConfigUrl = () =>
  `https://console.firebase.google.com/u/0/project/${
    firebase.app().options.projectId
  }/authentication/providers`;
