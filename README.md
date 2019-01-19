# League Voice

Manage champion select with the power of your voice!

![League Voice](/web/static/app.png)

---

## Installation

For regular users, head over to the [releases](/releases) tab and download the win32.zip file. This file contains everything you need to run League Voice.

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

The releases can be found [here](/releases). League Voice follows the semvar standard.

## Overview

#### Usage

#### Troubleshooting

## Legal

#### Storage of information

League Voice stores certain pieces of data to make the application function.

By using League Voice you agree to allowing us to store these pieces of information.

- League of Legends Summoner Name
- League of Legends PUUID (An internal ID)
- Google Account ID

###### Summoner Name

We stored the summoner name so we can both verify and reference to you by a name.

###### PUUID

A PUUID is an ID used by Riot internally to have a universially unique identifier for accounts. We use this ID to link your League account with your Google account.

###### Google ID

A Google ID is an ID used by Google to identify accounts. Combined with the PUUID we have a way to link accounts to eachother.

#### License

This project is licensed under the MIT License. A copy of the license can be found in the root directory of this package.

#### Riot Games

League Voice was created under Riot Games' "Legal Jibber Jabber" policy using assets owned by Riot Games.  Riot Games does not endorse or sponsor this project.