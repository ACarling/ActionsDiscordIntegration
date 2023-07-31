A simple discord bot to hook into a github workflow and provide notifications to a specific channel



### Create 3 Github webhooks
```
http://serverhostname/success
http://serverhostname/fail
http://serverhostname/warn
```

Add sampleWorkflow.yml to github repository ```.github/Workflow/``` folder <br>
Edit to work with your testing and linting flow

### Setup discord bot

Follow step 1 here: <br>
https://discord.com/developers/docs/getting-started


### Create a .env file in bot root directory:
``` bash
# discord developer portal/oauth/general/client secret
CLIENT_TOKEN='<discord client secret here>' 

# in discord enable developer mode, right click on the wanted channel, click channelid
CHANNEL_ID='<discord client id here>'

# the port the bot server will be hosted on (needs to be publically avaliable)
PORT='80'
```

### Deploy the discord bot server
example:

``` bash
$ crontab -e
```

``` bash
# add this line to crontab config file
@reboot node /PathToBot/bot/index.js > /PathToBot/bot/output.log 2> /PathToBot/bot/error.log & echo $! > /PathToBot/bot/currentpid
```