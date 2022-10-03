<template>
    <div class="container">
    <div id='storemapper' style='width:100%;'>
  <p>Dealer Locator is loading from <a href='https://www.pamlicostores.com'>Pamlico Dealer Locator</a>...</p>
</div>
<textarea readonly>
    <script>
        (function(doc, tag, id){
             var js = doc.getElementsByTagName(tag)[0];
             if (doc.getElementById(id)) {return;}
             js = doc.createElement(tag); js.id = id;
             js.src = "http://localhost/widgets/widgets.js";
             js.type = "text/javascript";
             doc.body.appendChild(js);
           }(document, 'script', 'xml-feed-grabber'));
        window.onload = function() {
            XmlFeedGrabber.setOptions({
                apiToken: {{ this.$store.state.apiToken }},
                companyID: {{this.$store.state.companyID}}
            });
               XmlFeedGrabber.render();
           }
    </script>
</textarea>

<div id="xml-grabber">Loading</div>
</div>
</template>
<script>
    (function(doc, tag, id){
         var js = doc.getElementsByTagName(tag)[0];
         if (doc.getElementById(id)) {return;}
         js = doc.createElement(tag); js.id = id;
         js.src = "http://localhost/widgets/widgets.js";
         js.type = "text/javascript";
         doc.body.appendChild(js);
       }(document, 'script', 'feeder'));
    window.onload = function() {
        XmlFeedGrabber.setOptions({
            companyID: 4
        });
           XmlFeedGrabber.render();
       }
</script>

<style>
    textarea{
        width:100%;
        height:450px;
    }
</style>