module.exports = {
   name: 'vibe',
   description: 'Vibin.',
   execute(message, args) {
      message.channel.send({
         embed: {
            color: 10181046,
            title: "Zero Two vibes with " + message.author.username + ".",
            image: {
               url: "https://image.myanimelist.net/ui/G-Sm6d0qIwQxUGHIp-m2WE4r0RSD61OQcp0zIes03ZCYoKjsVsjXKaeievJ3JFbIPWVFdDFNffxoioO0_wZFCqs4E0_YgZYsXqmLfTNB-IZA-B-IvlYVs7FcQAbSVU5Z"
            }
         }
      })
   }
}
