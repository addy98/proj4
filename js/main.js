const $list = $("#list");
const $flags = $("#flags");

let map;

// initializes google map
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 40, lng: -10 },
    zoom: 3,
  });
}

// loads json data into list view, calls map function after completion
async function loadData() {
  
  const result = await $.ajax({
    url: 'data/countries.json',
    type: 'GET',
    dataType: 'json',
  });

  for (let i=0; i<38; i++) {
      
      // appends flags to list view
      $flags.append(
        '<div class="col country">'+
          '<img class="flag" id="'+result[i].country.replace(/\s+/g, '')+'" src="'+result[i].flag+'">'+
          '<div class="desc">'+
              '<h6>'+result[i].country+'</h6>'+
          '</div>'+
        '</div>'
      );

      // append markers to map view
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(result[i].Lat, result[i].Lng),
        map: map
      });

      // append info windows to markers
      let infowindow;
      if (result[i].players.length == 1) {
        infowindow = new google.maps.InfoWindow({
          content: result[i].country+' has '+result[i].players.length+' player in the NBA.'
        });
      } else {
        infowindow = new google.maps.InfoWindow({
          content: result[i].country+' has '+result[i].players.length+' players in the NBA.'
        });
      }
      
      
      // event handler for click on list or map view of any country
      let clicked = false;
      function clickOnCountry() {
        map.setZoom(5);
        map.setCenter(marker.getPosition());
        infowindow.open(map, marker);
        if (clicked == false) {
          $flags.hide();
          $list.append(
            '<div id="info">'+
              '<button class="btn btn-primary all">'+
                '<span class="back">'+
                  '<i class="material-icons">arrow_back</i> All countries'+
                '</span>'+
              '</button>'+
              '<div class="break"></div>'+
              '<h5 class="subhead">'+result[i].country+'</h5>'+
              '<table id="table" class="table table-hover table-responsive">'+
                '<tr class="text-primary">'+
                  '<th>Player</th>'+
                  '<th>Team</th>'+
                '</tr>'+
                '<tr id="new"></tr>'+
              '</table>'+
            '</div>'
          );
          
          for (let j=0; j<result[i].players.length; j++) {
            $("#new").replaceWith(
              '<tr>'+
                '<td>'+result[i].players[j].fname+' '+result[i].players[j].lname+'</td>'+
                '<td>'+result[i].players[j].team+'</td>'+
              '</tr>'
            );
          }
          $(".all").on("click", () => {
            $("#info").remove();
            $("#table").remove();
            $("#new").remove();
            $(".subhead").remove();
            $(".all").remove();
            $flags.show();
            map.setZoom(3);
            map.setCenter({ lat: 40, lng: -10 });
            infowindow.close();
            clicked = false;
          });
          clicked = true;
        } 
        if (clicked == true) {
          for (let j=0; j<result[i].players.length; j++) {
            $("#new").replaceWith(
              '<tr>'+
                '<td>'+result[i].players[j].fname+' '+result[i].players[j].lname+'</td>'+
                '<td>'+result[i].players[j].team+'</td>'+
              '</tr>'
            );
          }
        }
      }

      // click handler for flags in list view
      $("#"+result[i].country.replace(/\s+/g, '')).on("click", clickOnCountry);

      // click handler for markers in map view
      marker.addListener("click", clickOnCountry);

  }
}

loadData();