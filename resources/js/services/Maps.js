export default{
    data(){
        return {
            markers: [],
            activeIndex: -1
        }
    },
    display_map(lat, long, $ref, locations, markers){
        this.markers = markers;
        const map = new google.maps.Map($ref, {
            zoom: 15,
            center: new google.maps.LatLng(lat, long),
            mapTypeId: google.maps.MapTypeId.ROADMAP
          });

          const infoWindow = new google.maps.InfoWindow();
          for (let i = 0; i < locations.length; i++) {
            const placeID  = locations[i].id;
            const str = locations[i].longlat;
            const arr = str.split(',');
           let iconPhoto = '/upload/' + locations[i].marker_icon
            if(iconPhoto == null || iconPhoto == '/upload/image.png'){
              iconPhoto = '/upload/marker.png';
            }
            
  
            const icon = {
              url: iconPhoto, // url
              scaledSize: new google.maps.Size(50, 50), // scaled size
              origin: new google.maps.Point(0,0), // origin
              anchor: new google.maps.Point(0, 0) // anchor
          };
  
  
            const marker = new google.maps.Marker({
              position: new google.maps.LatLng(arr[0], arr[1]),
              map: map,
              title: locations[i].title,
              address: locations[i].address,
              icon: icon,
              placeID:  locations[i].id
            });
    
            markers.push(marker);

            google.maps.event.addListener(markers[i], 'click', function() { 
                var InfoContent = `<div style="color:black;" class="inforWindow"><h3>${this.title}</h3><p><strong>Address</strong> ${this.address}</p></div>`;
                infoWindow.setContent(InfoContent);
                infoWindow.open(map,this); 
            }); 

        }
    },
    display_infoWindow(index){
        this.activeIndex = index;
        console.log( this.markers[index].title);
        new google.maps.event.trigger(this.markers[index], "click");
    }
}