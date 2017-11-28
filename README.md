#DOZER
![Imgur](https://i.imgur.com/HKy4zWK.png)
[Click here to view!](https://evening-bastion-15027.herokuapp.com/)

###Idea: 
Ever want to get more sleep on your way to get somewhere, but don't want to miss your stop? Yes people, we're talking ubers, lyfts, buses, and subways.

What if you could sleep on your way without worry of missing your stop?! Now you sound like a dozer!

###Technologies
* Google Maps Javascript API
* Google Maps Autocorrect
* Google Maps Distance Matrix
* Google Maps Direction Service
* Google Passport Authenticator
* Twilio API
* Node.js/Ajax/Express/Bcrypt/Mongo


###How It Works
After signing up and storing your contact information, we allow users to choose a new trip. From there, users can pick a contact method: email, text, or phone call to receive an alarm. After declaring how far in advance of arrival users would like to be woken up, they can press the submit button to be notified that specified amount of time before arrival.

###Challenges
* How do we get reliable alarms sent to a phone via a web app?
* Grabbing Most Common End Destinations
* Using Twilio for the first time
* Using Google Maps for the first time

###Approach
We decided the best way to get the functionality of a native app would be to use the Twilio API to call our users. The other important feature was accurately calculating the amount of time to get somewhere, particularly on public transportation, so we decided that the Google Maps api would be best for that.

###Missing Features
* Remove the add setting button and change contact method into check marks, allowing users to click multiple contact methods for one trip or...
* Incorporate the add setting button, potentially allowing users to input multiple contacts to receive alerts prior to arrival
* Facebook Login and Authentication
* Alarm sending before transfers in public transportation. Currently, the alarm is set to go off before your ultimate arrival
* Recent Trip revisit buttons
* Native app functionality!!

