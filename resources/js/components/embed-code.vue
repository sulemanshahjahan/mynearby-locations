<template>
    <div class="container">
 
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
                //apiToken: {{ this.$store.state.apiToken }},
                companyID: {{this.$store.state.companyID}}
            });
               XmlFeedGrabber.render();
           }
    </script>
</textarea>
</div>
</template>


<style>
    textarea{
        width: 100%;
        height: 300px;
        background: #00181c;
        color: white;
    }
</style>