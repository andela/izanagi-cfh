'use strict';
const dotenv = require('dotenv').config();
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
exports.invite = (req, res) => {
    const gameUrl = req.body.link;
    const smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
      }
  };
  let transporter = nodemailer.createTransport(smtpTransport(smtpConfig));
  transporter.sendMail({
      from: 'game-invite@izanagi-cfh.com',
      to: req.body.email,
      subject: 'Izanagi Cards For Humanity Game Invitation ',
      text: `Hi there You been invited to play a game on Izanagi Cards For Humanity. Click on this link to join: ${gameUrl}`
    }, (error, info) => {
        if(error) {
            res.send(error);
        } else {
            res.send(info.rejected);
        }
    });
  };
