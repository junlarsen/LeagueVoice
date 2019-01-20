# League Voice

Manage champion select with the power of your voice!

![League Voice](/web/static/app.png)

---

## Installation

For regular users, head over to the [releases](https://github.com/supergrecko/LeagueVoice/releases) tab and download the win32.zip file. This file contains everything you need to run League Voice.

For developers, clone this repository using git and run these commands.

```bash
$ npm install
$ npm rebuild --runtime=electron --target=3.0.0 --dist-url=https://atom.io/download/electron
```

#### Requirements

The requirements to use League Voice are listed here.

- Windows 64-bit Operating System
- League of Legends Client & account
- Google account

#### Releases

The releases can be found [here](https://github.com/supergrecko/LeagueVoice/releases). League Voice follows the semvar standard.

## Overview

#### What is League Voice?

League Voice is an application to connect your League of Legends champion select to your Google Assistant.

#### How do I use League Voice?

###### Linking accounts

###### Making commands

#### Troubleshooting

###### Common Issues

> Doesn't pick or ban my intended champion

The application needs to be running (you can start the app by clicking the "Start" button). 

Your League accounts needs to be linked with a Google Account. This procedure can be started by clicking the "Link" button and telling your Google Assistant to link your accounts.

If your intended champion has been picked or banned the assistant will not perform any action.

> Doesn't start upon pressing start

If you recently restarted your League Client make sure to restart your League Voice application as well.

###### Still having issues?

If your issue is not addressed in the Common Issues article and if you can't resolve any of the error messages you can report this error by submitting an issue.

Before sending your issue, make sure it hasn't already been addressed in the issues list. You can check the issues [here](https://github.com/supergrecko/LeagueVoice/issues) 

## Legal

#### Data Policies

League Voice stores certain pieces of data to make the application function.

By using League Voice you agree to allowing us to store these pieces of information.

- League of Legends Summoner Name
- League of Legends PUUID (An internal ID)
- Google Account ID

We use this data to link your Google account with your League of Legends account. This data is not shared with any third-party.

We need to collect this data to authenticate you so the client receives the correct data. This also prevents other users from interacting with your client.

#### License

This project is licensed under the MIT License. A copy of the license can be found in the root directory of this package.

#### Riot Games

League Voice was created under Riot Games' "Legal Jibber Jabber" policy using assets owned by Riot Games.  Riot Games does not endorse or sponsor this project.